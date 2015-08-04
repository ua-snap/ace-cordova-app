angular.module('ace.services')

.service('DataService', function($http, DbService, RemoteGroup, RemoteMobileUser, LocalStorageService, WebApiService) {    
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
			
			// Set up worker thread
			if(window.thread_messenger.worker === undefined)
			{
				window.thread_messenger.worker = new Worker("js/sync/SyncWorker.js");
			}
		},
		
		// Send message handler
		sendMessage: function(req, params, filter, cb) {
			// Create GUID for callback
			var guid = this.createGUID();
			var message = {
				req: req,
				params: params,
				filter: filter,
				cbId: guid
			};
			
			// Save the callback in the map
			this.saveCallback(guid, cb);
			
			// send the message
			window.thread_messenger.worker.postMessage(message);				
		},
		
		// Recieved message handler
		recieveMessage: function(message) {
			if(message.data.cbId)
			{
				this.executeCallback(message.data.cbId, message.data.args);
			}
		},
		
		// Saves a callback at id
		saveCallback: function(id, cb) {
			window.thread_messenger.callbackMap[id] = cb;	
		},
		
		// Executes the callback saved at id
		executeCallback: function(id, argsArray) {			
			var callback = window.thread_messenger.callbackMap[id];
			if(callback)
			{
				callback.apply(window, argsArray);
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
		remoteLoginUser: function(credentials, filter, cb) {
			this.sendMessage("login", credentials, filter, cb);
		}
	}
});