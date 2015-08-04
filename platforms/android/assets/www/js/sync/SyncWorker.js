if(self.importScripts !== undefined)
{
	// Local storage shim
	var localStorage = {};
	localStorage.data = {};

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

	localStorage.setItem = function(key, value) {
		localStorage.data[key] = value;
	};

	localStorage.clear = function() {
		localStorage.data = {};
	};

	// Window shim
	this.window = this;
	window.localStorage = localStorage;
	// Remove partial fetch support (doesn't work anyway).  Force to use XMLHttpRequest
	window.fetch = undefined;
}

self.importScripts("../../lib/pouchdb/dist/pouchdb.js");
self.importScripts("../../lib/pouchdb-upsert/dist/pouchdb.upsert.js");
self.importScripts("../../js/sync/browser.bundle.js");
self.importScripts("../../js/sync/lbclient.js");

self.onmessage = function(message) {
	var msg = message.data;
	
	if(msg.req === "login") {
		(function(id) {
			window.client.models.RemoteMobileUser.login(msg.params, msg.filter, function(err, res) {
				
				if(res) {
					// Save access token id
					window.localStorage.setItem("access_token", res.id);
				}
				
				// Formulate and send response message
				var args = [err, res];
				
				var returnMsg = {
					cbId: id,
					args: args
				};
				self.postMessage(returnMsg);
				
				
			});
		})(msg.cbId);
	}
	else if(msg.req === "remotegroup.findone") {
		(function(id) {
			window.client.models.RemoteGroup.findOne(msg.filter, function(err, res) {
				var args = [err, res];
				var returnMsg = {
					cbId: id,
					args: args
				};
				self.postMessage(returnMsg);
			});
		})(msg.cbId);
	}
	else if(msg.req === "sync") {
		(function(id) {
			window.client.sync(function() {
				var args = arguments;
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
					var args = [err, res];
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
					var args = [err, res];
					var returnMsg = {
						cbId: id,
						args: args	
					};
					self.postMessage(returnMsg);
				});
			}
			
		})(msg.cbId);
	}
	else if(msg.req === "localposition.create") {
		(function(id) {
			window.client.models.LocalPosition.create(msg.params, function(err, res) {
				var args = [err, res.toJSON()];
				var returnMsg = {
					cbId: id,
					args: args
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
	else if(msg.req === "localweatherreport.create") {
		(function(id) {
			window.client.models.LocalWeatherReport.create(msg.params, function(err, res) {
				var args = [err, res];
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
			window.client.models.LocalWeatherReport.find(msg.filter, function(err, res) {
				var args = [err, res];
				var returnMsg = {
					cbId: id,
					args: args
				};
				self.postMessage(returnMsg);
			});
		})(msg.cbId);
	}
}