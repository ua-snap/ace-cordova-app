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
}

self.importScripts("../../lib/pouchdb/dist/pouchdb.js");
self.importScripts("../../lib/pouchdb-upsert/dist/pouchdb.upsert.js");
self.importScripts("../../js/sync/browser.bundle.js");
self.importScripts("../../js/sync/lbclient.js");

self.onmessage = function(message) {
	if(message.data.req === "sync") {
		window.client.sync();
	}
	else if(message.data.req === "setup")
	{
		window.localStorage.setItem("access_token", message.data.accessToken);
		window.localStorage.setItem("currentUser", JSON.stringify(message.data.currentUser));
		window.localStorage.setItem("groupUserIds", JSON.stringify(message.data.groupUserIds));
	}
}