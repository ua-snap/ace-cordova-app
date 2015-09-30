// SyncWorker.js

// This file is the main file for the sync web worker thread.  All requests for data pass through the message handler
// function (see below).  See DataService.js for more complete documentation of each method.

// Initialization and shims
//----------------------------------------------------

// Only load in web worker context
if(self.importScripts !== undefined)
{
	// Local storage shim - use a simple dictionary object
	var localStorage = {};
	localStorage.data = {};
	
	// getItem shim
	localStorage.getItem = function(key, defaultValue) {
		var temp = localStorage.data[key];
		if(temp)
		{
			return temp;
		}
		else
		{
			return defaultValue;
		}
	};

	// setItem shim
	localStorage.setItem = function(key, value) {
		localStorage.data[key] = value;
	};

	// clear shim
	localStorage.clear = function() {
		localStorage.data = {};
	};

	// Window shim - required for loopback in the browser (browser.bundle.js)
	this.window = this;
	window.localStorage = localStorage;
	
	// Remove partial fetch support (doesn't work anyway).  Force to use XMLHttpRequest
	window.fetch = undefined;
	
	// Add console shim (for ios only)
	if(window.console === undefined)
	{
		window.console = function(str) {
			// do nothing
		};
	}
	
	// FormData shim - Attribution in file
	self.importScripts("../../js/polyfill/FormDataPolyfill.js")
	
	// Set up the loopback in the browser instance
	self.importScripts("../../js/sync/browser.bundle.js");
	self.importScripts("../../js/sync/lbclient.js");
	
	// Utility libraries
	self.importScripts("../../lib/underscore/underscore.js");
	self.importScripts("../../lib/async/dist/async.js");
}

// Message Handler
//-------------------------------------------

// Message handler for sync web worker thread
self.onmessage = function(message) {
	// Check if we are currently loading
	if(window.loading)
	{
		// Add request to queue
		if(!window.requestQueue)
		{
			window.requestQueue = [];
		}		
		window.requestQueue.unshift(message);
		return;
	}
	
	// Grab the actual message object that was passed
	var msg = message.data;
	
	// Setup message channel
	//------------------------------------------------
	// Message port initialization for the Save thread
	if(msg === "msgChannelPort")
	{
		// Save port for channel communication with save thread
		window.saveWorkerPort = message.ports[0];
		
		// Load the appropriate data
		window.saveWorkerPort.postMessage({req: "load"});
		window.loading = true;
		window.saveWorkerPort.onmessage = function(msg) {
			// Call the load function, which expects the data at window.localStorage.getItem("ace-db")
			var memory = window.client.models.LocalMobileUser.getConnector();
			window.localStorage.setItem("ace-db", msg.data);
			memory.loadFromFile(function() {
				// Return to normal operation
				window.loading = false;
				var tempMsg = window.requestQueue.pop();
				self.onmessage(tempMsg);
			});			
		};
	}
	// MobileUser
	//-----------------------------------------------
	else if(msg.req === "login") {
		(function(id) {
			window.client.models.RemoteMobileUser.login(msg.params, msg.filter, function(err, res) {
				
				if(res) {
					// Save access token id
					window.localStorage.setItem("access_token", res.id);
					
					// Save current user object
					if(res.user)
					{
						window.localStorage.setItem("currentUser", res.user);
					}
				}
				
				else if(err) {
					// Make err.stack a simple primitive to allow passing as a message
					var errCpy = {
						message: err.message,
					}
					
					// Add stack if present (may not be in older iOS webviews)
					if(err.stack)
					{
						errCpy.stack = err.stack.toString();
					}
				}
				
				// Formulate and send response message
				var args = [errCpy, res];
				
				var returnMsg = {
					cbId: id,
					args: args
				};
				self.postMessage(returnMsg);
				
				
			});
		})(msg.cbId);
	}
	else if(msg.req === "login-offline") {
		(function(id) {
			window.client.models.LocalMobileUser.login(msg.params, msg.filter, function(err, res) {
				
				if(res) {
					// Save access token id
					window.localStorage.setItem("access_token", res.id);
				}
				
				// Save current user object
				if(res.user)
				{
					window.localStorage.setItem("currentUser", res.user);
				}
				
				else if(err) {
					// Make err.stack a simple primitive to allow passing as a message
					var errCpy = {
						message: err.message,
						stack: err.stack.toString()
					}
				}
				
				// Formulate and send response message
				var args = [errCpy, res];
				
				var returnMsg = {
					cbId: id,
					args: args
				};
				self.postMessage(returnMsg);
				
				
			});
			
		})(msg.cbId);
	}
	else if(msg.req === "localmobileuser.find") {
		(function(id) {
			if(msg.filter !== null)
			{
				window.client.models.LocalMobileUser.find(msg.filter, function(err, res) {
					var users = [];
					for(var i = 0; i < res.length; i++)
					{
						users.push(res[i].toJSON());
					}
					var args = [err, users];
					var returnMsg = {
						cbId: id,
						args: args	
					};
					self.postMessage(returnMsg);
				});
			}
			else
			{
				window.client.models.LocalMobileUser.find(function(err, res) {
					var users = [];
					for(var i = 0; i < res.length; i++)
					{
						users.push(res[i].toJSON());
					}
					var args = [err, users];
					var returnMsg = {
						cbId: id,
						args: args	
					};
					self.postMessage(returnMsg);
				});
			}
			
		})(msg.cbId);
	}
	else if(msg.req === "localmobileuser.updateall") {
		(function(id) {
			window.client.models.LocalMobileUser.updateAll(msg.filter, msg.params, function(err, res) {
				var returnMsg = {
					cbId: id,
					args: [err, res]
				};
				self.postMessage(returnMsg);
			});
		})(msg.cbId);
	}
	else if(msg.req === "localmobileuser.upsert") {
		(function(id) {
			window.client.models.LocalMobileUser.upsert(msg.params, function(err, res) {
				var user;
				if(res)
				{
					user = res.toJSON();
				}
				var returnMsg = {
					cbId: id,
					args: [err, user]
				};
				self.postMessage(returnMsg);
			});
		})(msg.cbId);
	}
	else if(msg.req === "remotemobileuser.updateall") {
		(function(id) {
			window.client.models.RemoteMobileUser.updateAll(msg.filter, msg.params, function(err, res) {
				var returnMsg = {
					cbId: id,
					args: [err, res]
				};
				self.postMessage(returnMsg);
			});
		})(msg.cbId);
	}
	else if(msg.req === "remotemobileuser.logout") {
		(function(id) {
			window.client.models.RemoteMobileUser.logout(msg.params, function(err, res) {
				var args = [err, res];
				var returnMsg = {
					cbId: id,
					args: args
				};
				self.postMessage(returnMsg);
			});
		})(msg.cbId);
	}
	
	// Group
	//---------------------------------------------
	else if(msg.req === "remotegroup.findone") {
		(function(id) {
			window.client.models.RemoteGroup.findOne(msg.filter, function(err, res) {
				if(res.id === window.localStorage.getItem("currentUser", {}).groupId)
				{
					// Save group id's if they are present and are the current group
					var groupUsersIdArray = [];
	                var groupUsers = res.__unknownProperties.MobileUsers;
	                for(var i = 0; i < groupUsers.length; i++)
	                {
	                    groupUsersIdArray.push(groupUsers[i].id);
	                }
	                window.localStorage.setItem("groupUserIds", groupUsersIdArray);
				}
				
			   
				var args = [err, res];
				var returnMsg = {
					cbId: id,
					args: args
				};
				self.postMessage(returnMsg);
			});
		})(msg.cbId);
	}
	else if(msg.req === "localgroup.findone") {
		(function(id) {
			window.client.models.LocalGroup.findOne(msg.filter, function(err, res) {
				if(res.id === window.localStorage.getItem("currentUser", {}).groupId && res.__unknownProperties && res.__unknownProperties["MobileUsers"])
				{
					// Save group id's if they are present and are the current group
					var groupUsersIdArray = [];
	                var groupUsers = res.__unknownProperties.MobileUsers;
	                for(var i = 0; i < groupUsers.length; i++)
	                {
	                    groupUsersIdArray.push(groupUsers[i].id);
	                }
	                window.localStorage.setItem("groupUserIds", groupUsersIdArray);
				}
				
			   
				var args = [err, res];
				var returnMsg = {
					cbId: id,
					args: args
				};
				self.postMessage(returnMsg);
			});
		})(msg.cbId);
	}
	
	// Sync
	//-------------------------------
	else if(msg.req === "sync") {
		(function(id) {
			// Execute sync, preserving the callback guid
			window.client.sync(function(arg) {
				var args = [arg];
				var returnMsg = {
					cbId: id,
					args: args	
				};
				self.postMessage(returnMsg);
			});
		})(msg.cbId);
	}
	
	// LocalPosition
	//---------------------------------------------
	else if(msg.req === "localposition.create") {
		(function(id) {
			window.client.models.LocalPosition.create(msg.params, function(err, res) {
				var args;
				 
				if(res)
				{
					args = [err, res.toJSON()];
				}				
				else
				{
					args = [err, res];
				}
				
				var returnMsg = {
						cbId: id,
						args: args
					};
				self.postMessage(returnMsg);
			});
		})(msg.cbId);
	}
	else if(msg.req === "localposition.find") {
		(function(id) {
			if(msg.filter !== null) {
				window.client.models.LocalPosition.find(msg.filter, function(err, res) {
					var positions = [];
					for(var i = 0; i < res.length; i++)
					{
						positions.push(res[i].toJSON());
					}
					var args = [err, positions];
					var returnMsg = {
						cbId: id,
						args: args
					};
					self.postMessage(returnMsg);
				});
			}
			else {
				window.client.models.LocalPosition.find(function(err, res) {
					var positions = [];
					for(var i = 0; i < res.length; i++)
					{
						positions.push(res[i].toJSON());
					}
					var args = [err, positions];
					var returnMsg = {
						cbId: id,
						args: args
					};
					self.postMessage(returnMsg);
				});
			}
			
		})(msg.cbId);
	}
	
	// WeatherReport
	//------------------------------------------------
	else if(msg.req === "localweatherreport.create") {
		(function(id) {
			window.client.models.LocalWeatherReport.create(msg.params, function(err, res) {
				var report = res;
				var errCpy = err;
				if(res)
				{
					report = res.toJSON();
				}	
				else if(err)
				{
					errCpy = {
						message: err.message,
						stack: err.stack.toString()
					};
				}
				
				var args = [errCpy, report];
				var returnMsg = {
					cbId: id,
					args: args
				};
				self.postMessage(returnMsg);			
			});
		})(msg.cbId);
	}
	else if(msg.req === "localweatherreport.find") {
		(function(id) {
			if(msg.filter !== null)
			{
				window.client.models.LocalWeatherReport.find(msg.filter, function(err, res) {
					var reports = [];
					for(var i = 0; i < res.length; i++)
					{
						reports.push(res[i].toJSON());
					}
					var args = [err, reports];
					var returnMsg = {
						cbId: id,
						args: args
					};
					self.postMessage(returnMsg);
				});
			}
			else
			{
				window.client.models.LocalWeatherReport.find(function(err, res) {
					var reports = [];
					for(var i = 0; i < res.length; i++)
					{
						reports.push(res[i].toJSON());
					}
					var args = [err, reports];
					var returnMsg = {
						cbId: id,
						args: args
					};
					self.postMessage(returnMsg);
				});
			}
			
		})(msg.cbId);
	}
	else if(msg.req === "localweatherreport.updateall") {
		(function(id) {
			window.client.models.LocalWeatherReport.updateAll(msg.filter, msg.params, function(err, res) {
				var returnMsg = {
					cbId: id,
					args: [err, res]
				};
				self.postMessage(returnMsg);
			});
		})(msg.cbId);
	}
	else if(msg.req === "localmobileuser.currentcheckpoint") {
		(function(id) {
			// Get the (local) current checkpoint
			window.client.models.LocalMobileUser.currentCheckpoint(function(err, currentCheckpointId) {
				var returnMsg = {
					cbId: id,
					args: [err, currentCheckpointId]	
				};
				self.postMessage(returnMsg);
			});
		})(msg.cbId);
	}
	else if(msg.req === "remotemobileuser.currentcheckpoint") {
		(function(id) {
			// Get the (remote) current checkpoint
			window.client.models.RemoteMobileUser.currentCheckpoint(function(err, currentCheckpointId) {
				var returnMsg = {
					cbId: id,
					args: [err, currentCheckpointId]
				};
				self.postMessage(returnMsg);
			});
		})(msg.cbId);
	}
	else if(msg.req === "resetlocalmodels") {
		// Clear all local data
		// Call the load function, which expects the data at window.localStorage.getItem("ace-db")
		var memory = window.client.models.LocalMobileUser.getConnector();
		window.localStorage.setItem("ace-db", {});
		(function(id) {
			memory.loadFromFile(function() {
				var returnMsg = {
					cbId: id,
					args: [true]
				};
				self.postMessage(returnMsg);
			});	
		})(msg.cbId);
	}
	
	// Check queue and execute next call (if one is waiting)
	if(window.requestQueue && window.requestQueue.length > 0)
	{
		var temp = window.requestQueue.pop();
		self.onmessage(temp);
		return;
	}
}