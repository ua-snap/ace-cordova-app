// SaveWorker.js

// This script is intended to run as a web worker thread, and contains utilities for persisting the current state of the
// local data store as a JSON file.

// Only load in a web worker context
if(typeof DedicatedWorkerGlobalScope != "undefined" && this instanceof DedicatedWorkerGlobalScope)
{
	// window shim
	this.window = this;
	
	// Set up file system access
	window.requestFileSystemSync = self.webkitRequestFileSystemSync || self.requestFileSystemSync;
	
	// Message Handler
	//-----------------------------------
	self.onmessage = function(message) {
		var msg = message.data;
		
		// Message port initialization message
		if(msg === "msgChannelPort")
		{
			window.syncWorkerPort = message.ports[0];
			window.syncWorkerPort.onmessage = self.onmessage;
		}
		// Save message
		else if(msg.req === "save")
		{
			// Update the data file
			var jsonBlob = new Blob([JSON.stringify(msg.data)], {type: "text/plain"});
			
			var fs = window.requestFileSystemSync(PERSISTENT, 50 * 1024 * 1024);
			var fileEntry = fs.root.getFile("acedb.txt", {create: true});
			fileEntry.createWriter().write(jsonBlob);
		}
		// Load message
		else if(msg.req === "load")
		{
			// Return the contents of the data file
			var fs = window.requestFileSystemSync(PERSISTENT, 50 * 1024 * 1024);
			var fileEntry = fs.root.getFile("acedb.txt", {create: true});
			var reader = new FileReaderSync();
			var contents = reader.readAsText(fileEntry.file());
			var data = {};
			if(contents && contents.length > 0)
			{
				try {
					data = JSON.parse(contents);
				}
				catch(error)
				{
					data = {};
				}
				
			}
			window.syncWorkerPort.postMessage(data);
		}
	}
}

