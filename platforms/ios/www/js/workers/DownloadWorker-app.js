// Create module
var downloadWorker = angular.module('download-worker', ['lbServices', 'worker-services']);

/**
 * Angular application handles all necessary upload tasks.  Will be treated here as a class
 * 
 * @class DownloadWorker
 * @constructor
 */
downloadWorker.run(function($window, DownloadWorkerService) {
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
		if(e.data.request === "downloadUsers")
		{
			DownloadWorkerService.downloadUsers(e.data.groupId);
		}
		else if(e.data.request === "downloadPositions")
		{
			DownloadWorkerService.downloadPositions(e.data.groupId);
		}
		else if(e.data.request === "downloadReports")
		{
			DownloadWorkerService.downloadReports(e.data.groupId);
		}
	}
});	