// JSONAsync.js

/**
 * @class JSONAsync
 * @description Utility class to perform JSON parse and stringify operations on web worker threads.
 * @constructor
 */

// JSONAsync
//------------------------------------------------------------------------------

// Utility class to perform JSON parse and stringify operations on web worker threads.
var JSONAsync = function() {
	// Path to the worker js script
	this.pathToJSONWorker = "js/util/JSONAsync.worker.js";
	
	// Initialize the worker (if necessary)
	if(window.JSONAsyncWorker === undefined)
	{
		window.JSONAsyncWorker = new Worker(this.pathToJSONWorker);
	}
};


/**
 * @method parse
 * @description Function parses the provided JSON string and passes the result to the provided callback.  The parsing
 * 		is done off the main thread.
 * @param {string} str The JSON string to be converted to an object
 * @param {function} cb Callback function that recieves result of the parse.  Takes 2 arguments: the first is an error
 * 		object that will be null if no error occurred.  The second will be the object that was parsed from the string.
 * @throws none
 */

// Function parses the provided JSON string and passes the result to the provided callback.  The parsing is done off the 
// main thread.
JSONAsync.prototype.parse = function(str, cb) {
	var msg = {
		req: "parse",
		data: str
	};
	(function(cbArg) {
		window.JSONAsyncWorker.onmessage = function(message) {
			var msg = message.data
			if(cbArg)
			{
				cbArg.call(window, msg.error, msg.data);
			}
		}
		window.JSONAsyncWorker.postMessage(msg);
	})(cb)
	
};

/**
 * @method stringify
 * @description Function stringifies the provided object and passes the resulting string to the provided callback.  The 
 * 		"stringification" is done off the main thread.
 * @param {string} str The string to check
 * @return {boolean} true if str is a valid json string, false otherwise
 * @throws none
 */
// Function stringifies the provided object and passes the resulting string to the provided callback.  The 
// "stringification" is done off the main thread.
JSONAsync.prototype.stringify = function(obj, cb) {
	var msg = {
		req: "stringify",
		data: obj
	};
	(function(cbArg) {
		window.JSONAsyncWorker.onmessage = function(message) {
			var msg = message.data
			if(cbArg)
			{
				cbArg.call(window, msg.error, msg.data);
			}
		}
		window.JSONAsyncWorker.postMessage(msg);
	})(cb)
};


