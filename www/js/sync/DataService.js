angular.module('ace.services')

.service('DataService', function($http, LocalStorageService) {    
	return {
		// All callbacks should take the following args (err, res)
		
		/*
			Sent Message format:
			{
				req: String, - required - The name of the request to execute
				params: Object, - optional - any parameters required for the call
				filter: Object, - optional - a loopback filter object to use with any call that need it
				cbId: String, - optional - guid of the callback to be executed after the method finishes
			}	
			
			Recieved Message format:
			{
				cbId: String, - optional - The guid of the callback to be executed
				args: Array, - optional - An array of args to pass to the callback
			}	
		*/
				
		initialize: function() {
			// Set up window callback mapping object
			if(window.thread_messenger === undefined)
			{
				window.thread_messenger = {
					callbackMap: {}
				};
			}			
			
			// Only pre-initialize memory quote on Android
			if(window.cordova.platformId === "android")
			{
				// Set up persistent file quota (for save thread) 50 mb
				navigator.webkitPersistentStorage.requestQuota(50 * 1024 * 1024);
			}
			
			// Set up worker thread
			if(window.thread_messenger.worker === undefined)
			{
				window.thread_messenger.worker = new Worker("js/sync/SyncWorker.js");
				
				// Set up recieve message handler
				window.thread_messenger.worker.onmessage = this.recieveMessage;
			}
			
			// Set up save-load thread
			if(window.thread_messenger.saveWorker === undefined)
			{
				window.thread_messenger.saveWorker = new Worker("js/sync/SaveWorker.js");
			}
			
			// Set up message channel between worker threads
			window.thread_messenger.msgChannel = new MessageChannel();
			window.thread_messenger.worker.postMessage("msgChannelPort", [window.thread_messenger.msgChannel.port1]);
			window.thread_messenger.saveWorker.postMessage("msgChannelPort", [window.thread_messenger.msgChannel.port2])
			
			// Reset sync counter and indicator
			window.thread_messenger.syncCounter = 0;
			window.thread_messenger.syncing = false;
			
			// Reset sync callback storage
			window.thread_messenger.syncRequestQueue = [];
		},
		
		terminate: function() {
			// Close the worker thread
			// Note: WILL KILL ALL DATA ACCESS.  Should only be performed on logout
			if(window.thread_messenger && window.thread_messenger.worker)
			{
				window.thread_messenger.worker.terminate();
				window.thread_messenger.saveWorker.terminate();
			}	
		},
		
		// Send message handler
		sendMessage: function(req, params, filter, cb) {
			
			// Initialize if necessary
			if(window.thread_messenger === undefined)
			{
				this.initialize();
			}
			
			// Create GUID for callback
			var guid = this.createGUID();
			
			
			// Save the callback in the map (updating guid in case of collision)
			guid = this.saveCallback(guid, cb);
			
			// Create message
			var message = {
				req: req,
				params: params,
				filter: filter,
				cbId: guid
			};
			
			// send the message
			window.thread_messenger.worker.postMessage(message);				
		},
		
		// Recieved message handler
		recieveMessage: function(message) {
			if(message.data.cbId)
			{
				var callback = window.thread_messenger.callbackMap[message.data.cbId];
				if(callback)
				{
					callback.apply(window, message.data.args);
				}	
			}
		},
		
		// Saves a callback at id
		saveCallback: function(id, cb) {
			// Check for collision (added because of window.performance.now() polyfill used in iOS web views)
			if(window.thread_messenger.callbackMap[id] === undefined)
			{
				window.thread_messenger.callbackMap[id] = cb;	
				return id;
			}
			else
			{
				// Append a "c" and retry
				return this.saveCallback(id + "c", cb);
			}
			
		},
		
		// Synchronous function returns a Globally Unique Identifier to associate with a callback
		createGUID: function() {
			// Start with date.now
			var guid = Date.now().toString();
			
			// Add delimiter
			guid = guid + "-";
			
			// add in returned value of performance.now
			guid = guid + performance.now().toString();
			
			// Remove decimal place (if any exists)
			guid = guid.replace(".", "");
			
			// Add another delimiter
			guid = guid + "-";
			
			// Finish off with a random number
			guid = guid + this.getRandomInt(1, 10000);
			
			return guid;		
		},
		
		// Returns a random integer in a specified range
		getRandomInt: function(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;	
		},
				
		// Start of API functions (that can be called through the interface to the worker)
		
		// Login function
		remoteMobileUser_login: function(credentials, filter, cb) {
			this.sendMessage("login", credentials, filter, cb);
		},
		
		// Offline login function
		localMobileUser_login: function(credentials, filter, cb) {
			this.sendMessage("login-offline", credentials, filter, cb);
		},
		
		// RemoteGroup.findOne
		remoteGroup_findOne: function(filter, cb) {
			this.sendMessage("remotegroup.findone", null, filter, cb);	
		},
		
		// LocalGroup.findOne
		localGroup_findOne: function(filter, cb) {
			this.sendMessage("localgroup.findone", null, filter, cb);	
		},
		
		localWeatherReport_updateAll: function(filter, data, cb) {
			this.sendMessage("localweatherreport.updateall", data, filter, cb);	
		},
		
		// sync
		sync: function(cb, notification) {
			// Save the service self object
			var self = this;
			
			// Check if a sync is in progress
			if(window.thread_messenger.syncing)
			{
				// Check if the sync has a callback associated with it...
				// If it does not, it will just be a regular sync generated by the timer, so ignore it.
				if(cb && cb !== null)
				{
					// Handle the colliding sync requests
					var request = {
						cb: cb,
						notification: notification
					};
				
					// Add to start of queue
					window.thread_messenger.syncRequestQueue.unshift(request);
				}				
			}
			else
			{
				// Set syncing indicator
				window.thread_messenger.syncing = true;
				
				// Reset the syncCounter (in the case of an exceptionally long sync)
				window.thread_messenger.syncounter = 0;				
				
				if(notification)
				{
					// Display syncing notification (random number id)
					window.plugin.notification.local.schedule({
						id: 230476843,
						text: 'Syncing with remote server...',
						title: 'ACE Mobile App',
						sound: "file://sounds/point1sec.mp3",
						at: Date.now(),
						ongoing: false,
						smallIcon: 'ic_cloud_white_24dp' 			
					});
				}		
				
				// Clear sync notification on return (after 4 success messages)
				var callbackWrapper = function() {
					window.thread_messenger.syncCounter++;
					if(window.thread_messenger.syncCounter === 4)
					{
						// Reset counter and indicator and clear notification
						window.thread_messenger.syncCounter = 0;
						window.thread_messenger.syncing = false;
						
						// Fire off a "sync_complete" event
						var event = new Event('sync_complete');						
						document.dispatchEvent(event);
						
						window.plugin.notification.local.isPresent(230476843, function(present) {
							if(present)
							{
								window.plugin.notification.local.update({
									id: 230476843,
									text: 'Sync complete!',
									title: 'ACE Mobile App',
									smallIcon: "ic_cloud_done_white_24dp"
								});
								
								// Let "complete" stay displayed for 1 second, then clear
								window.setTimeout(function() {
									window.plugin.notification.local.cancel(230476843);
								}, 1000);
							}
						});
					}
					
					// Execute callback
					if(cb)
					{
						cb.apply(this, arguments);
					}
					
					// Handle the oldest pending sync request
					if(window.thread_messenger.syncRequestQueue.length > 0)
					{
						// Get the oldest request
						var request = window.thread_messenger.syncRequestQueue.pop();
						self.sync(request.cb, request.notification);						
					}
				}
				
				this.sendMessage("sync", null, null, callbackWrapper);
			}			
		},
		
		// Get all local mobile users
		localMobileUser_find: function(arg1, arg2) {
			// expecting either...
			// arg1 = filter, arg2 = callback function
			// or
			// arg1 = callback function, arg2 = undefined
			if(typeof arg1 === "function")
			{
				this.sendMessage("localmobileuser.find", null, null, arg1);
			}
			else if(typeof arg1 === "object" && typeof arg2 === "function")
			{
				this.sendMessage("localmobileuser.find", null, arg1, arg2);
			}
				
		},
		
		// Create a position (locally)
		localPosition_create: function(position, cb) {
			this.sendMessage("localposition.create", position, null, cb);
		},
		
		localMobileUser_updateAll: function(filter, data, cb) {
			this.sendMessage("localmobileuser.updateall", data, filter, cb);	
		},
		
		// Logout
		remoteMobileUser_logout: function(accessToken, cb) {
			this.sendMessage("remotemobileuser.logout", accessToken, null, cb);
		},
		
		// Create a weather report (locally)
		localWeatherReport_create: function(report, cb) {
			this.sendMessage("localweatherreport.create", report, null, cb);
		},
		
		// Find function for local weather reports
		localWeatherReport_find: function(filter, cb) {
			this.sendMessage("localweatherreport.find", null, filter, cb);
		},
		
		// Find function for local positions
		localPosition_find: function(filter, cb) {
			this.sendMessage("localposition.find", null, filter, cb);
		},
		
		// Find function for local settings
		localSettings_find: function(filter, cb) {
			this.sendMessage("localsettings.find", null, filter, cb);
		},
		
		// Update function for local settings
		localSettings_updateAll: function(filter, data, cb) {
			this.sendMessage("localsettings.updateall", data, filter, cb);
		},
		
		// Update or create local settings
		localSettings_upsert: function(data, cb) {
			this.sendMessage("localsettings.upsert", data, null, cb);
		},
		
		// Update or create local mobile user
		localMobileUser_upsert: function(data, cb) {
			this.sendMessage("localmobileuser.upsert", data, null, cb);
		},
		
		// Update remote mobile user instance
		remoteMobileUser_updateAll: function(filter, data, cb) {
			this.sendMessage("remotemobileuser.updateall", data, filter, cb);
		}		
	}
});