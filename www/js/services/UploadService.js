angular.module('ace.services')

/**
 * Service that manages uploading positions and reports to the ACE web server.  Service primarily checks for
 * any db items with a "0" uploading flag and uploads them.  Utilizes a Web Worker thread to do all actual
 * uploading off the main thread
 * 
 * @class UploadService
 * @constructor
 */
.service('UploadService', function(DbService, $ionicLoading) {
	// Maintain reference to timer
	var mTimerId;
	
	// Maintain reference to background Web Worker thread
	var uploadWorker;
	
	// Variable to keep track of whether the user requested this upload directly (when submitting a report)
	var mUserRequested;
	
	return {
		
		/**
		 * Stops the Web Worker upload thread
		 * 
		 * @method killUploadWorkerThread
		 * @return void
		 * @throws none
		 */
		killUploadWorkerThread: function() {
			if(this.uploadWorker)
			{
				this.uploadWorker.terminate();
				this.uploadWorker = undefined;	
			}			
		},
		
		/**
		 * Function turns on the auto-upload feature
		 * 
		 * @method enableAutoUpload
		 * @param {Number} interval The interval (in seconds) at which to try to upload
		 * @return void
		 * @throws none
		 */
		enableAutoUpload: function(interval) {
			// Create the timer and save its id (clearing any old timers if necessary)
			var self = this;
			if(self.mTimerId)
			{
				clearInterval(self.mTimerId);
			}
			self.mTimerId = setInterval(function() {
				self.uploadAll();
			}, interval * 1000);
		},
		
		/**
		 * Function turns off the auto-upload feature
		 * 
		 * @method disableAutoUpload
		 * @return void
		 * @throws none
		 */
		disableAutoUpload: function() {
			if(self.mTimerId)
			{
				clearInterval(self.mTimerId);
				self.mTimerId = null;
			}			
		},
		
		/**
		 * Function makes a background request with the specified requestId to the web worker thread (and starts it)
		 * if necessary.
		 * 
		 * @method backgroundRequest
		 * @param {String} requestId The unique identifier of the service to request ("uploadReports" or "uploadPositions" currently)
		 * @param {Array} data The SQL rows to be uploaded
		 * @param {scope} self The "this" variable to use in this function
		 * @return void
		 * @throws none
		 */
		backgroundRequest: function(requestId, data, self)
		{
			// Check if worker thread is already started
			if(!self.uploadWorker)
			{
				// Start new worker thread
				self.uploadWorker = new Worker("js/workers/UploadWorker.js");
				
				// Return message handler
				self.uploadWorker.onmessage = function(e) {
					// Check for upload success
					if(e.data.success)
					{
						// Add webId
						var webIds = [e.data.content.extra.id];
						var localIds = e.data.content.localIds;
						if(localIds.constructor !== Array)
						{
							localIds = [e.data.content.localIds];
						}
						DbService.updateWebId(localIds, e.data.content.typeName, webIds, window);
						
						if(e.data.content.typeName === "reports")
						{
							if(e.data.content.done)
							{
								$ionicLoading.show({
									template: e.data.content.count + ' Reports Uploaded', 
									noBackdrop: true, 
									duration: 1500
								});
							}
						}
					}
					else
					{
						var localIds = e.data.content.localIds;
						if(localIds.constructor !== Array)
						{
							localIds = [e.data.content.localIds];
						}
						// Remove uploading mark
						DbService.updateUploading(localIds, e.data.content.typeName, false, window);
					}
				};
			}
			
			// Make the request message and submit
			var message = {
				request: requestId,
				rows: data
			};
			self.uploadWorker.postMessage(message);
		},
		
		/**
		 * Function uploads all unuploaded positions and marks them as uploaded
		 * 
		 * @method uploadPositionsAndMark
		 * @return void
		 * @throws none
		 */
		uploadPositionsAndMark: function() {
			var self = this;
			DbService.getUnuploaded("positions", window, function(res) {
				// Create data object to pass to upload worker thread
				if(res.rows.length > 0)
				{
					var rows = [];
					var localIds = [];
					for(var i = 0; i < res.rows.length; i++)
					{
						var row = res.rows.item(i);
						rows.push(row);
						localIds.push(row.id);
					}
					// Mark uploading
					DbService.updateUploading(localIds, "positions", true, window);
					
					self.backgroundRequest("uploadPositions", rows, self);
				}				
			});	
		},
		
		/**
		 * Function uploads all unuploaded reports and their associated positions.
		 * 
		 * @method uploadReportsAndMark
		 * @return void
		 * @throws none
		 */
		uploadReportsAndMark: function() {	
			var self = this;
			DbService.getUnuploadedReportsWithPositions(window, function(res) {
				// Create data object to pass to upload worker thread
				if(res.rows.length > 0)
				{
					var rows = [];
					var localPositionIds = [];
					var localReportIds = [];
					for(var i = 0; i < res.rows.length; i++)
					{
						var row = res.rows.item(i);
						rows.push(row);
						localPositionIds.push(row.positionId);
						localReportIds.push(row.reportId);
					}
					DbService.updateUploading(localPositionIds, "positions", true, window);
					DbService.updateUploading(localReportIds, "reports", true, window);
					self.backgroundRequest("uploadReports", rows, self);
				}	
			});	
		},
		
		/**
		 * Function uploads all un-uploaded reports and positions
		 * 
		 * @method uploadAll
		 * @param {Boolean} userRequested Variable used to indicate whether a user requested this upload
		 * 					(or the auto-upload timer).  Will be used in the worker return onmessage handler
		 * 					to determine whether or not to display a notification to the user of successful
		 * 					report upload.
		 * @return void
		 * @throws none
		 */	
		uploadAll: function() {
			this.uploadReportsAndMark();
			this.uploadPositionsAndMark();
		}	
	};
});