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