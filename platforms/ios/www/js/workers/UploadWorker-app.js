// Create module
var workerApp = angular.module('upload-worker', ['lbServices', 'worker-services']);

/**
 * Angular application handles all necessary upload tasks.  Will be treated here as a class
 * 
 * @class UploadWorker
 * @constructor
 */
workerApp.run(function($window, UploadWorkerService) {	
	/**
	 * Function handles all incoming messages
	 * 
	 * @method onmessage
	 * @param {Event} e Event object passed as argument (postMessage(args) will be at e.data)
	 * @return void
	 * @throws none
	 */
	$window.onmessage = function(e)
	{	
		// Check request type
		var request = e.data.request;
		if(request === "uploadReports") {
			// Upload reports (and associated positions)
			UploadWorkerService.uploadReports(e.data.rows);
		}
		else if(request === "uploadPositions")
		{
			// Upload positions
			UploadWorkerService.uploadPositions(e.data.rows);
		}
		else
		{
			// Unknown request, message main thread
			var message = {
				success: false,
				content: "Unrecognized request id"
			};
			postMessage(message);
		}
	}
	
	
});