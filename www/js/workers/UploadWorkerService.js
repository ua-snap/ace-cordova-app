angular.module('worker-services', [])

.service('UploadWorkerService', function(Weather_report, Position) {
	// Variables
	var mReportRows = [];
	var mReportCounter = 0;

	var mPositionRows = [];
	var mPositionCounter = 0;
	
	return {
		/**
		 * Function initializes all service variables (if they are not initialized already)
		 * 
		 * @method initialize
		 * @return void
		 * @throws none
		 */
		initialize: function() {
			if(this.mReportRows === undefined)
			{
				this.mReportRows = [];
				this.mReportCounter = 0;
				
				this.mPositionRows = [];
				this.mPositionCounter = 0;
			}
		},
		
		/**
		 * Sends a success or error message back to the main thread
		 * 
		 * @method sendMessage
		 * @param {Boolean} success True if this is a success message, false otherwise
		 * @param {Integer} localId The local SQL id of the item being reported about
		 * @param {String} typeName Either "reports" or "positions"
		 * @param {Object} data Additional data to send
		 * @param {Boolean} final True if this is the last in a series of reports
		 * @param {Integer} count If final==true, this should be the number of reports uploaded
		 * @return void
		 * @throws none
		 */
		sendMessage: function(success, localId, typeName, data, final, count) {
			var message = {
				success: success,
				content: {
					localIds: localId,
					typeName: typeName,
					extra: data
				}
			}
			if(final)
			{
				message.content.done = true;
				message.content.count = count;
			}
			postMessage(message);
		},
		
		/**
		 * Function uploads all unuploaded positions currently in the database
		 * 
		 * @method uploadPositions
		 * @param {Array} positionRows The SQL rows representing the position values to be uploaded
		 * @return void
		 * @throws none
		 */
		uploadPositions: function(positionRows) {
			this.initialize();
			// Save positionRows to be used later in callback functions
			var self = this;
			self.mPositionRows = positionRows;
			for(var i = 0; i < self.mPositionRows.length; i++)
			{
				// Create position object to upload
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
				
				// Closure to persist "i"
				(function(j) {
					// Execute position create call (Loopback api)
					Position.create(position2, function(value, responseHeaders) {
						// Re-grab the correct position value
						var row4 = self.mPositionRows[j];
						
						// Message main thread about success
						self.sendMessage(true, row4.id, "positions", value);	
						
						// Check for end of batch and clear if necessary
						self.mPositionCounter++;
						if(self.mPositionCounter === self.mPositionRows.length)
						{							
							self.mPositionCounter = 0;
							self.mPositionRows = [];
						}
						
					}, function(httpResponse) {
						var row6 = self.mPositionRows[j];
						
						// Upload failed, notify main thread
						self.sendMessage(false, row6.id, "positions", httpResponse);
					});
				})(i);
			}
		},
		
		/**
		 * Function uploads all reports (and their associated positions) that were passed in reportRows
		 * 
		 * @method uploadReports
		 * @param {Array} reportRows the array of SQL rows (report joined with position) that will be uploaded
		 * @return void
		 * @throws none
		 */
		uploadReports: function(reportRows) {
			this.initialize();
			var self = this;
			// Save report rows for use later in callback functions
			self.mReportRows = reportRows;
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
				
				// Closure to persist "i"
				(function(j) {
					// Execute position create call (Loopback api)
					Position.create(position, function(value, responseHeaders) {
						// Re-grab row object
						var row2 = self.mReportRows[j];
						
						// Message main thread about success
						self.sendMessage(true, row2.positionId, "positions", value);					
						
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
						
						// Closure to persist original "i" value
						(function(k) {
							// execute weather report create call (Loopback api)
							Weather_report.create(report, function(value, responseHeaders) {
								// Re-grab row
								var row5 = self.mReportRows[k];
								self.mReportCounter++;
								
								if(self.mReportCounter < self.mReportRows.length)
								{
									// Send success message
									self.sendMessage(true, row5.reportId, "reports", value);
								}
								else
								{
									self.sendMessage(true, row5.reportId, "reports", value, true, self.mReportRows.length);
									
									// Clear out scope variables
									self.mReportCounter = 0;
									self.mReportRows = [];	
								}					
		
							}, function(httpResponse) {
								var row8 = self.mReportRows[k];
								self.mReportCounter++;
								
								if(self.mReportCounter < self.mReportRows.length)
								{
									// Send success message
									self.sendMessage(false, row8.reportId, "reports", value);
								}
								else
								{
									self.sendMessage(false, row8.reportId, "reports", value, true);
									
									// Clear out scope variables
									self.mReportIdArray = [];
									self.mReportCounter = 0;
									self.mReportRows = [];	
								}	
							});
						})(j);						
								
					}, function(httpResponse) {
						var row7 = self.mReportRows[j];
						// error
						self.sendMessage(false, row7.positionId, "positions", httpResponse);
					});	
				})(i);
			}
		}
	}
});