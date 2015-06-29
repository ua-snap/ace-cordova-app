angular.module('starter.services')
 
.service('DbService', function() {
	return {
		openDatabase: function(window) {
			var dbHandler = new DbHandler("ace.db", window);
		},	
		
		createTables: function(window) {
			var dbHandler = new DbHandler("ace.db", window);
			
			// Create positions table
			var createString = "";
			
			// Create reports table
			createString = createString + "CREATE TABLE IF NOT EXISTS reports (id integer primary key, positionId integer, cloudCover text, precipitation text, visibility text, pressureTendency text, pressureValue text, temperatureValue text, temperatureUnits text, windValue text, windUnits text, windDirection text, notes text, camera text, other text); ";
			
			createString = createString + "CREATE TABLE IF NOT EXISTS positions (id integer primary key, timestamp integer, latitude real, longitude real, accuracy data_num, altitude real, altitudeAccuracy real, heading real, speed real); ";
			
			
			// Actually create both tables
			try
			{
				dbHandler.createTables(createString);	
			}			
			catch(error)
			{
				alert(error.message);
			}
		},
		
		deleteDatabase: function(window) {
			var dbHandler = new DbHandler("ace.db", window);
			dbHandler.deleteDb();
		},
		
		// Insert position into database
		insertPosition: function(pos, window, callback) {
			var dbHandler = new DbHandler("ace.db", window);
			
			var keys = ["timestamp", "speed", "heading", "altitudeAccuracy", "altitude", "accuracy", "longitude", "latitude"];
			
			var values = [pos.timestamp, pos.coords.speed, pos.coords.heading, pos.coords.altitudeAccuracy, pos.coords.altitude, pos.coords.accuracy, pos.coords.longitude, pos.coords.latitude];
			
			dbHandler.insertInto("positions", keys, values, callback);
		},
		
		// Insert report into database
		insertReport: function(report, window) {
			var dbHandler = new DbHandler("ace.db", window);
			var self = this;					
			navigator.geolocation.getCurrentPosition(function(pos) {
				self.insertPosition(pos, window, function(res) {
					var posId = res.insertId;
					//alert(posId);
					var keys = ["positionId", "cloudCover", "precipitation", "visibility", "pressureTendency", "pressureValue", "temperatureValue", "temperatureUnits", "windValue", "windDirection", "notes", "camera", "other"];
			
					var values = [posId, report.cloudCover, report.precipitation, report.visibility, report.pressureTendency, report.pressureValue, report.temperatureValue, report.temperatureUnits, report.windValue, report.windDirection, report.notes, report.camera, report.other];
			
					dbHandler.insertInto("reports", keys, values);
				})
			}, function(error) {
				alert(error.message);
			}, {timeout: 15000, enableHighAccuracy: true})
		},
		
		getAllPositionLogs: function(window, callback) {
			var dbHandler = new DbHandler("ace.db", window);
			dbHandler.selectAllFrom("positions", callback);
		},
		
		getRecentPositionLogs: function(window, numLogs, callback) {
			var dbHandler = new DbHandler("ace.db", window);
			dbHandler.selectNum("positions", numLogs, "timestamp", false, callback);	
		},
		
		convertPositionArrayToLatLng: function(positions) {
			var latLngArr = [];
			for(var i = 0; i < positions.length; i++)
			{
				latLngArr.push(new google.maps.LatLng(positions.item(i).latitude, positions.item(i).longitude));
			}
			return latLngArr;
		}
	};
});