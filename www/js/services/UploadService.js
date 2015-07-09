/* global . */
angular.module('starter.services')

/**
 * Service that manages uploading positions and reports to the ACE web server.  Service primarily checks for
 * any db items with a "0" uploaded flag and uploads them.
 * 
 * @class UploadService
 * @constructor
 */
.service('UploadService', function(DbService, Weather_report, LocalStorageService, Position) {
	var mTimerId;
	var mReportRows;
	var mPositionRows;
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
				var data = {
					request: "uploadPositions",
					rows: []
				};
				for(var i = 0; i < res.rows.length; i++)
				{
					var row = res.rows.item(i);
					data.rows.push(row);
				}
				if(!self.uploadWorker)
				{
					self.uploadWorker = new Worker('js/workers/UploadWorker.js');	
				}
				self.uploadWorker.postMessage(data);
			});	
			
			/*DbService.getUnuploaded("positions", window, function(res) {
				// Save the resulting rows to a variable in the service scope (to access later in callbacks)
				self.mPositionRows = res.rows;
				
				for(var i = 0; i < self.mPositionRows.length; i++)
				{
					var row = self.mPositionRows.item(i);
					
					// get the position object
					var position = {
						userId: row.userId,
						latlng: {lat: row.latitude, lng: row.longitude},
						timestamp: new Date(row.timestamp),
						accuracy: row.accuracy,
						altitude: row.altitude,
						altitudeAccuracy: row.altitudeAccuracy,
						heading: row.heading,
						speed: row.speed	
					};
					
					(function(posId) {
						// Execute position create call (Loopback api)
						Position.create(position, function(value, responseHeaders) {							
							// Mark position as uploaded
							DbService.markUploaded([posId], "positions", window);
						}, function(httpResponse) {
							alert(httpResponse.data.error.message);
						});
					})(position.positionId);
				}
				
			});*/
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
				var data = {
					request: "uploadReports",
					rows: []
				};
				for(var i = 0; i < res.rows.length; i++)
				{
					var row = res.rows.item(i);
					data.rows.push(row);
				}
				if(!self.uploadWorker)
				{
					self.uploadWorker = new Worker('js/workers/UploadWorker.js');	
				}
				self.uploadWorker.postMessage(data);
			});	
			
			//var worker = new Worker('js/workers/UploadWorker.js');
			//worker.postMessage("test");
			
			/*var self = this;
			DbService.getUnuploadedReportsWithPositions(window, function(res) {		
				self.mReportRows = res.rows;
				for(var i = 0; i < res.rows.length; i++)
				{
					// Grab a reference to the current item
					// Each row will contain the joined results of a query on the reports and positions table, with
					// some aliases to separate out the id's
					var row = self.mReportRows.item(i);
					
					// get the position object
					var position = {
						userId: row.userId,
						latlng: {lat: row.latitude, lng: row.longitude},
						timestamp: new Date(row.timestamp),
						accuracy: row.accuracy,
						altitude: row.altitude,
						altitudeAccuracy: row.altitudeAccuracy,
						heading: row.heading,
						speed: row.speed	
					};
					
					(function(j) {
						// Execute position create call (Loopback api)
						Position.create(position, function(value, responseHeaders) {
							var row2 = self.mReportRows.item(j);
							
							// Mark positions as uploaded
							DbService.markUploaded([row2.positionId], "positions", window);
		
							// Get returned positionId
							var posId = value.id;
		
							// get report object
							var report = {
								userId: row2.userId,
								positionId: posId,
								cloudCover: row2.cloudCover,
								precipitation: row2.precipitation,
								visibility: row2.visibility,
								pressureTendency: row2.pressureTendency,
								pressureValue: row2.pressureValue,
								temperatureValue: row2.temperatureValue,
								temperatureUnits: row2.temperatureUnits,
								windValue: row2.windValue,
								windUnits: row2.windUnits,
								windDirection: row2.windDirection,
								notes: row2.notes,
								other: row2.other,
								attachment: null
							};
							
							(function(k) {
								// execute weather report create call (Loopback api)
								Weather_report.create(report, function(value, responseHeaders) {
									var row3 = self.mReportRows.item(k);
									
									// success, mark local copy as uploaded
									DbService.markUploaded([row3.reportId], "reports", window);
			
								}, function(httpResponse) {
									// error
									alert(httpResponse.data.error.message);
								});
							})(j);						
									
						}, function(httpResponse) {
							alert(httpResponse.data.error.message);
						});	
					})(i);		
					
				}
			});	*/					
		},
			
		uploadAll: function() {
			this.uploadReportsAndMark();
			this.uploadPositionsAndMark();
		}	
	};
});