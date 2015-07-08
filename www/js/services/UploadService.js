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
		
		uploadPositionsAndMark: function() {
	
		},
		
		uploadReportsAndMark: function() {
			DbService.getUnuploadedReportsWithPositions(window, function(res) {
				for(var i = 0; i < res.rows.length; i++)
				{
					// Grab a reference to the current item
					var row = res.rows.item(i);
					
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
					
					// Execute position create call
					Position.create(position, function(value, responseHeaders) {
						// Mark positions as uploaded
						
						// Get returned positionId
						var posId = value.id;
						
						// get report object
						var report = {
							userId: row.userId,
							positionId: posId,
							cloudCover: row.cloudCover,
							precipitation: row.precipitation,
							visibility: row.visibility,
							pressureTendency: row.pressureTendency,
							pressureValue: row.pressureValue,
							temperatureValue: row.temperatureValue,
							temperatureUnits: row.temperatureUnits,
							windValue: row.windValue,
							windUnits: row.windUnits,
							windDirection: row.windDirection,
							notes: row.notes,
							other: row.other,
							attachment: null
						};
						
						// execute create call
						Weather_report.create(report, function(value, responseHeaders) {
							// success
							var i = 0;
							i++;
						}, function(httpResponse) {
							// error
							alert(httpResponse.data.error.message);
						});
					}, function(httpResponse) {
						alert(httpResponse.data.error.message);
					});
				}				
			});
		},
		
		uploadAll: function() {
			this.uploadReportsAndMark();
			this.uploadPositionsAndMark();
		}	
	};
});