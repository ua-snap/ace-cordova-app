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
	this.window = {};
	this.window.localStorage = localStorage;
}

self.importScripts("../../lib/pouchdb/dist/pouchdb.js");
self.importScripts("../../lib/pouchdb-upsert/dist/pouchdb.upsert.js");

var localPouchDb = new window.PouchDB('pouch-db');

self.onmessage = function(message) {
	// Perform upsert
	localPouchDb.upsert(message.data.id, function(doc) {
		doc.data = message.data.doc;
		return doc;			
	}).catch(function(err) {
		console.log(err);
		var newDoc = {
			_id: message.data.id,
			data: message.data.doc
		};
		localPouchDb.putIfNotExists(newDoc);
	});
}