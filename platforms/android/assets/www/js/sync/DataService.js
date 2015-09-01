// DataService.js

/**
 * @module ace.services
 */
angular.module('ace.services')

/**
 * @description The DataServie Angular service serves as both the "data retriever" and the "data persistor" interface for
 * the ace application.  All data retrieved from or saved to the remote server goes through this interface.
 * 
 * The service relies on a Web Worker thread that runs a generated (and slightly customized) Loopback synchronization 
 * browser bundle.  The sync library allows the service to save data without accessing the remote server, and then 
 * push the data to the server upon request.  The library also provides methods to access the server's data directly.  
 * Any such method starts with the word "remote".  Any method starting with "local" goes through the local data storage 
 * before being replicated to the server in a sync method.
 * 
 * The browser bundle (browser.bundle.js) is generated and customized by the ace-api project.
 * 
 * The Loopback synchronization library is still somewhat experimental; not all features (such as relationships) are 
 * implemented in the local library.
 * 
 * See the following for documentation and example applications
 * Docs: https://docs.strongloop.com/display/public/LB/Synchronization
 * Example app: https://github.com/strongloop/loopback-example-offline-sync
 * 
 * @class AuthService
 * @constructor
 */
 
// DataService.js
//-----------------------------------------------------------------------------------------------

// The DataServie Angular service serves as both the "data retriever" and the "data persistor" interface for
// the ace application.  All data retrieved from or saved to the remote server goes through this interface.

// The service relies on a Web Worker thread that runs a generated (and slightly customized) Loopback synchronization 
// browser bundle.  The sync library allows the service to save data without accessing the remote server, and then 
// push the data to the server upon request.  The library also provides methods to access the server's data directly.  
// Any such method starts with the word "remote".  Any method starting with "local" goes through the local data storage 
// before being replicated to the server in a sync method.
 
// The browser bundle (browser.bundle.js) is generated and customized by the ace-api project.

// The Loopback synchronization library is still somewhat experimental; not all features (such as relationships) are 
// implemented in the local library.
 
// See the following for documentation and example applications
// Docs: https://docs.strongloop.com/display/public/LB/Synchronization
// Example app: https://github.com/strongloop/loopback-example-offline-sync
.service('DataService', function(LocalStorageService) {    
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
		
		// Initialize the DataService, including instantiating the web worker threads	
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
			
			// Set up sync worker thread (will contain the loopback in the browser lib)
			if(window.thread_messenger.syncWorker === undefined)
			{
				window.thread_messenger.syncWorker = new Worker("js/sync/SyncWorker.js");
				
				// Set up recieve message handler
				window.thread_messenger.syncWorker.onmessage = this.recieveMessage;
			}
			
			// Set up save-load thread (will be responsible for persisting the data through the HTML5 file api)
			// Note: Chrome is the only browser that supports the HTML5 synchronous file api that this worker uses
			// Thus, this portion will only function on Android currently
			// Options for iOS are limited, due to the lack of access to permanent storage in web worker threads.
			if(window.thread_messenger.saveWorker === undefined)
			{
				window.thread_messenger.saveWorker = new Worker("js/sync/SaveWorker.js");
			}
			
			// Set up message channel between worker threads
			window.thread_messenger.msgChannel = new MessageChannel();
			window.thread_messenger.syncWorker.postMessage("msgChannelPort", [window.thread_messenger.msgChannel.port1]);
			window.thread_messenger.saveWorker.postMessage("msgChannelPort", [window.thread_messenger.msgChannel.port2])
			
			// Reset sync counter and indicator
			window.thread_messenger.syncCounter = 0;
			window.thread_messenger.syncing = false;
			
			// Reset sync callback storage
			window.thread_messenger.syncRequestQueue = [];
		},
		
		// Function terminates the sync and save web workers
		terminate: function() {
			// Close the sync thread and save thread
			// Note: WILL KILL ALL DATA ACCESS.  Should only be performed on logout
			if(window.thread_messenger && window.thread_messenger.syncWorker)
			{
				window.thread_messenger.syncWorker.terminate();
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
			window.thread_messenger.syncWorker.postMessage(message);				
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
		// (serves as the callback id in the callback map - window.thread_messenger.callbackMap)
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
		
		// Helper function returns a random integer in a specified range
		getRandomInt: function(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;	
		},
				
		// Start of API functions (that can be called through the interface to the worker)
		//-------------------------------------------------------------------------------
		// Note that these methods are designed to reflect the underlying Loopback-in-the-browser methods that are
		// called in the sync worker thread.  Groups, Positions, and WeatherReports all subclass the loopback 
		// PersistedModel class.  MobileUsers subclass the "User" class.  See the following for more information:
		// PersistedModel: https://docs.strongloop.com/display/LB/PersistedModel+class
		// User: https://docs.strongloop.com/display/LB/User
		// Filters: https://docs.strongloop.com/display/public/LB/Querying+data#Queryingdata-Filters
		
		// MobileUser
		//--------------------------------------------------------------------------------------------------
		
		/**
		 * @method remoteMobileUser_login
		 * 
		 * @description Remote login function.  Authenticates the provided credentials with the remote server
		 * 
		 * @param {Object} credentials An object consisting of either a username/password combo or an email/password
		 * 		combo.  {username: "testUserName", password: "myPassword"} or {email: "test@test.com", 
		 * 		password: "myPassword"}
		 * @param {Object} filter Loopback filter to include in the call.  Set to ["user"] to return the user's info
		 * 		on successful login
		 * @param {function} cb Callback function to be executed after the remote call is executed.  Will be passed
		 * 		the following parameters cb(err, res) 
		 * @return void
		 * @throws None
		 */
		 
		// Remote login function.  Authenticates the provided credentials with the remote server
		remoteMobileUser_login: function(credentials, filter, cb) {
			this.sendMessage("login", credentials, filter, cb);
		},
		
		/**
		 * @method remoteMobileUser_logout
		 * 
		 * @description Logs out the currently authenticated user with the remote server
		 * 
		 * @param {String} accessToken The id of the access token for the currently authenticated user
		 * @param {function} cb Callback function to be executed after the remote call is executed.  Will be passed
		 * 		the following parameters cb(err, res) 
		 * @return void
		 * @throws None
		 */
		 
		// Logs out the currently authenticated user with the remote server
		remoteMobileUser_logout: function(accessToken, cb) {
			this.sendMessage("remotemobileuser.logout", accessToken, null, cb);
		},
		
		/**
		 * @method remoteMobileUser_updateAll
		 * 
		 * @description Function updates all remote MobileUser objects that match the provided filter with the specified
		 * data fields and values.
		 * 
		 * @param {Object} filter Loopback filter to include in the call. Ex. {where: {id: 123456}}
		 * @param {Object} data Data to be updated.  Ex. {field: "value"}
		 * @param {function} cb Callback function to be executed after the remote call is executed.  Will be passed
		 * 		the following parameters cb(err, res) 
		 * @return void
		 * @throws None
		 */
		 
		// Function gets all local Positions specified by the included filter and passes them to the provided
		// callback function.
		remoteMobileUser_updateAll: function(filter, data, cb) {
			this.sendMessage("remotemobileuser.updateall", data, filter, cb);
		},
		
		/**
		 * @method localMobileUser_login
		 * 
		 * @description Local login function.  Authenticates the provided credentials with the set of users stored
		 * 		locally from previous logins.  Will take a substantial amount of time due to encryption/decryption 
		 * 		time for the password.
		 * 
		 * @param {Object} credentials An object consisting of either a username/password combo or an email/password
		 * 		combo.  {username: "testUserName", password: "myPassword"} or {email: "test@test.com", 
		 * 		password: "myPassword"}
		 * @param {Object} filter Loopback filter to include in the call.  Set to ["user"] to return the user's info
		 * 		on successful login
		 * @param {function} cb Callback function to be executed after the remote call is executed.  Will be passed
		 * 		the following parameters cb(err, res) 
		 * @return void
		 * @throws None
		 */
		 
		// Local login function.  Authenticates the provided credentials with the set of users stored
		// locally from previous logins.  Will take a substantial amount of time due to encryption/decryption 
		// time for the password.
		localMobileUser_login: function(credentials, filter, cb) {
			this.sendMessage("login-offline", credentials, filter, cb);
		},
		
		/**
		 * @method localMobileUser_find
		 * 
		 * @description Function gets all mobile users specified by the included filter
		 * 
		 * @param {Object/function} arg1 This argument can either be a filter object {where: {field: "value"}} or a
		 * 		callback function. 
		 * @param {function} If this argument is provided, it must always be a callback function
		 * @return void
		 * @throws None
		 */
		 
		// Function gets all mobile users specified by the included filter
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
		
		/**
		 * @method localMobileUser_updateAll
		 * 
		 * @description Updates all MobileUser objects in the local data store matching the provided filter.
		 * The fields included in the data object are updated to the specified values
		 * 
		 * @param {Object} filter Loopback filter to include in the call. Ex. {where: {id: 123456}}
		 * @param {Object} data Data to be updated.  Ex. {field: "value"}
		 * @param {function} cb Callback function to be executed after the remote call is executed.  Will be passed
		 * 		the following parameters cb(err, res) 
		 * @return void
		 * @throws None
		 */
		
		// Updates all MobileUser objects in the local data store matching the provided filter.
		// The fields included in the data object are updated to the specified values
		localMobileUser_updateAll: function(filter, data, cb) {
			this.sendMessage("localmobileuser.updateall", data, filter, cb);	
		},
		
		// Group
		//--------------------------------------------------------------------------------------------------
		
		/**
		 * @method remoteGroup_findOne
		 * 
		 * @description Returns one group matching the provided filter.  (See above for filter doc link) 
		 * Note: This method does support relationships for MobileUsers.  Any related Mobile Users (if included 
		 * in the filter) will be returned in the res.__unknownProperties.MobileUsers object
		 * 
		 * @param {Object} filter Loopback filter to include in the call. Ex. {where: {id: 123456}}
		 * @param {function} cb Callback function to be executed after the remote call is executed.  Will be passed
		 * 		the following parameters cb(err, res) 
		 * @return void
		 * @throws None
		 */
		 
		// Returns one group matching the provided filter.  (See above for filter doc link) 
		// Note: This method does support relationships for MobileUsers.  Any related Mobile Users (if included 
		// in the filter) will be returned in the res.__unknownProperties.MobileUsers object
		remoteGroup_findOne: function(filter, cb) {
			this.sendMessage("remotegroup.findone", null, filter, cb);	
		},
		
		/**
		 * @method localGroup_findOne
		 * 
		 * @description Returns one group matching the provided filter.  (See above for filter doc link) 
		 * Note: This method does NOT support relationships of any kind (unimplemented in loopback in the browser lib)
		 * 
		 * @param {Object} filter Loopback filter to include in the call. Ex. {where: {id: 123456}}
		 * @param {function} cb Callback function to be executed after the remote call is executed.  Will be passed
		 * 		the following parameters cb(err, res) 
		 * @return void
		 * @throws None
		 */
		 
		// Returns one group matching the provided filter.  (See above for filter doc link) 
		// Note: This method does NOT support relationships of any kind (unimplemented in loopback in the browser lib)
		localGroup_findOne: function(filter, cb) {
			this.sendMessage("localgroup.findone", null, filter, cb);	
		},
		
		// WeatherReport
		//--------------------------------------------------------------------------------------------------
		
		/**
		 * @method localWeatherReport_updateAll
		 * 
		 * @description Updates all weather report objects in the local data store matching the provided filter.
		 * The fields included in the data object are updated to the specified values
		 * 
		 * @param {Object} filter Loopback filter to include in the call. Ex. {where: {id: 123456}}
		 * @param {Object} data Data to be updated.  Ex. {field: "value"}
		 * @param {function} cb Callback function to be executed after the remote call is executed.  Will be passed
		 * 		the following parameters cb(err, res) 
		 * @return void
		 * @throws None
		 */
		 
		// Updates all weather report objects in the local data store matching the provided filter.
		// The fields included in the data object are updated to the specified values
		localWeatherReport_updateAll: function(filter, data, cb) {
			this.sendMessage("localweatherreport.updateall", data, filter, cb);	
		},
		
		/**
		 * @method localWeatherReport_create
		 * 
		 * @description Function creates a new WeatherReport object in the local data store
		 * 
		 * @param {Object} report The report object to be created
		 * @param {function} cb Callback function to be executed after the remote call is executed.  Will be passed
		 * 		the following parameters cb(err, res) 
		 * @return void
		 * @throws None
		 */
		 
		// Function creates a new WeatherReport object in the local data store
		localWeatherReport_create: function(report, cb) {
			this.sendMessage("localweatherreport.create", report, null, cb);
		},
		
		/**
		 * @method localWeatherReport_find
		 * 
		 * @description Function gets all local WeatherReports specified by the included filter and passes them to the provided
		 * callback function.
		 * 
		 * @param {Object/function} filter Filter object to specify which WeatherReports to return.  Ex. 
		 * 		{where: {field: "value"}}
		 * @param {function} cb Callback function to be executed after the remote call is executed.  Will be passed
		 * 		the following parameters cb(err, res) 
		 * @return void
		 * @throws None
		 */
		 
		// Function gets all WeatherReports specified by the included filter and passes them to the provided
		// callback function.
		localWeatherReport_find: function(filter, cb) {
			this.sendMessage("localweatherreport.find", null, filter, cb);
		},
		
		// LocalPosition
		//--------------------------------------------------------------------------------------------------
		
		/**
		 * @method localPosition_create
		 * 
		 * @description Function creates a local position object and stores it in the database
		 * 
		 * @param {Object} position The position object to create
		 * @param {function} cb Callback function to be executed after the remote call is executed.  Will be passed
		 * 		the following parameters cb(err, res) 
		 * @return void
		 * @throws None
		 */
		 
		// Function gets all mobile users specified by the included filter
		localPosition_create: function(position, cb) {
			this.sendMessage("localposition.create", position, null, cb);
		},
		
		/**
		 * @method localPosition_find
		 * 
		 * @description Function gets all local Position specified by the included filter and passes them to the provided
		 * callback function.
		 * 
		 * @param {Object/function} filter Filter object to specify which Positions to return.  Ex. 
		 * 		{where: {field: "value"}}
		 * @param {function} cb Callback function to be executed after the remote call is executed.  Will be passed
		 * 		the following parameters cb(err, res) 
		 * @return void
		 * @throws None
		 */
		 
		// Function gets all local Positions specified by the included filter and passes them to the provided
		// callback function.
		localPosition_find: function(filter, cb) {
			this.sendMessage("localposition.find", null, filter, cb);
		},
		
		// Sync
		//--------------------------------------------------------------------------------------------------
		
		/**
		 * @method sync
		 * 
		 * @description Performs a sync with the remote data store.  Performs collision detection to ensure that multiple
		 * sync's do not occur at the same time (which can corrupt the state of the data in the loopback lib)
		 * 
		 * @param {function} cb Callback function to be executed after the sync is executed FOR EACH DATA TYPE SYNCED.
		 * 		Will be passed a string representing the name of the type that just completed syncing. 
		 * @param {Boolean} notification True if a notification is to be displayed while syncing, False otherwise.
		 * 		Usually drawn from user settings
		 * @return void
		 * @throws None
		 */
		
		// Performs a sync with the remote data store.  Performs collision detection to ensure that multiple
		// sync's do not occur at the same time (which can corrupt the state of the data in the loopback lib)
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
				
				// Tell the sync worker thread to execute a sync
				this.sendMessage("sync", null, null, callbackWrapper);
			}			
		}	
	}
});