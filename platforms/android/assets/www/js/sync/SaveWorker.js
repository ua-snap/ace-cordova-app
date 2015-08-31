// Only load in a web worker context
if(typeof DedicatedWorkerGlobalScope != "undefined" && this instanceof DedicatedWorkerGlobalScope)
{
	// Web worker thread responsible for persisting the loopback data to the lcoal file system

	// window shim
	this.window = this;
	
	// Set up file system access
	window.requestFileSystemSync = self.webkitRequestFileSystemSync || self.requestFileSystemSync;
	
	
	self.onmessage = function(message) {
		var msg = message.data;
		
		if(msg === "msgChannelPort")
		{
			window.syncWorkerPort = message.ports[0];
			window.syncWorkerPort.onmessage = self.onmessage;
		}
		else if(msg.req === "save")
		{
			// Update the data file
			var jsonBlob = new Blob([JSON.stringify(msg.data)], {type: "text/plain"});
			
			var fs = window.requestFileSystemSync(PERSISTENT, 50 * 1024 * 1024);
			var fileEntry = fs.root.getFile("acedb.txt", {create: true});
			fileEntry.createWriter().write(jsonBlob);
		}
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

