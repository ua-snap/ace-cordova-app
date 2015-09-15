// Web worker script for JSONAsync.js class

self.onmessage = function(message) {
	msg = message.data;
 	var data = {};
	var err = null;
	
	// Handle both parse and stringify case, catching any errors
	try
	{
		if(msg.req === "parse")
		{
			data = JSON.parse(msg.data);
			
		}
		else if(msg.req === "stringify")
		{
			data = JSON.stringify(msg.data);
		}
	}
	catch(error)
	{
		err = {
			error: "JSON error"
		};
	}
	
	// Return the result of the operation
	var rtnMsg = {
			data: data,
			error: err
	};
	self.postMessage(rtnMsg);		
}