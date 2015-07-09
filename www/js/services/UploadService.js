/* global . */
angular.module('starter.services')

/**
 * Service that manages uploading positions and reports to the ACE web server.  Service primarily checks for
 * any db items with a "0" uploaded flag and uploads them.
 * 
 * @class UploadService
 * @constructor
 */
.service('UploadService', function(DbService) {
	// Maintain reference to timer
	var mTimerId;
	
	// Maintain reference to background Web Worker thread
	var uploadWorker;
	
	return {
		enableAutoUpload: function(interval) {
			var self = this;
			mTimerId = setInterval(function() {
				self.uploadAll();
			}, interval * 1000);
		},
		
		disableAutoUpload: function() {
			clearInterval(mTimerId);
			mTimerId = null;
		},
		
		backgroundRequest: function(requestId, data, self)
		{
			if(!self.uploadWorker)
			{
				self.uploadWorker = new Worker("js/workers/UploadWorker.js");
				self.uploadWorker.onmessage = function(e) {
					if(e.data.success)
					{
						DbService.markUploaded(e.data.content.idArray, e.data.content.typeName, window);
					}
					else
					{
						alert(e.data.content.error.message);	
					}
				};
			}
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
					for(var i = 0; i < res.rows.length; i++)
					{
						var row = res.rows.item(i);
						rows.push(row);
					}
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
					for(var i = 0; i < res.rows.length; i++)
					{
						var row = res.rows.item(i);
						rows.push(row);
					}
					self.backgroundRequest("uploadReports", rows, self);
				}				
			});	
		},
		
		/**
		 * Function uploads all un-uploaded reports and positions
		 * 
		 * @method uploadAll
		 * @return void
		 * @throws none
		 */	
		uploadAll: function() {
			this.uploadReportsAndMark();
			this.uploadPositionsAndMark();
		}	
	};
});