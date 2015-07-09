// Create module
var workerApp = angular.module('upload-worker', ['lbServices']);

workerApp.run(function(Weather_report, Position, $window) {
	// Variables
	var mReportRows;
	var mPositionRows;
	
	// Message handler
	$window.onmessage = function(e)
	{
		var self = this;
		var request = e.data.request;
		if(request === "uploadReports") {
			self.mReportRows = e.data.rows;
			for(var i = 0; i < self.mReportRows.length; i++)
			{
				// Grab a reference to the current item
				// Each row will contain the joined results of a query on the reports and positions table, with
				// some aliases to separate out the id's
				var row = self.mReportRows[i];
				
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
						// Re-grab row object
						var row2 = self.mReportRows[j];
						
						// Message main thread about success
						var message = {
							success: true,
							content: {
								typeName: "positions",
								idArray: [row2.positionId]
							}
						};						
						postMessage(message);						
						
						// Get returned positionId
						var posWebId = value.id;
	
						// get report object
						var report = {
							userId: row2.userId,
							positionId: posWebId,
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
								var row5 = self.mReportRows[k];
								
								// Message main thread about success
								var message = {
									success: true,
									content: {
										typeName: "reports",
										idArray: [row5.reportId]
									}
								};						
								postMessage(message);	
		
							}, function(httpResponse) {
								// error
								var message = {
									success: false,
									content: httpResponse
								};
								postMessage(message);
							});
						})(j);						
								
					}, function(httpResponse) {
						var message = {
							success: false,
							content: httpResponse
						};
						postMessage(message);
					});	
				})(i);
			}
		}
		else if(request === "uploadPositions")
		{
			self.mPositionRows = e.data.rows;
			for(var i = 0; i < self.mPositionRows.length; i++)
			{
				var row3 = self.mPositionRows[i];
				var position2 = {
					userId: row3.userId,
					latlng: {lat: row3.latitude, lng: row3.longitude},
					timestamp: new Date(row3.timestamp),
					accuracy: row3.accuracy,
					altitude: row3.altitude,
					altitudeAccuracy: row3.altitudeAccuracy,
					heading: row3.heading,
					speed: row3.speed	
				};
				
				(function(j) {
					// Execute position create call (Loopback api)
					Position.create(position2, function(value, responseHeaders) {
						var row4 = self.mPositionRows[j];
						
						// Message main thread about success
						var message = {
							success: true,
							content: {
								typeName: "positions",
								idArray: [row4.id]
							}
						};						
						postMessage(message);	
					}, function(httpResponse) {
						var message = {
							success: false,
							content: httpResponse
						};
						postMessage(message);
					});
				})(i);
			}
		}
		else
		{
			var message = {
				success: false,
				content: "Unrecognized request id"
			};
			postMessage(message);
		}
	}
});