angular.module('starter.services')
 
.service('DbService', function($ionicLoading) {
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
			dbHandler.executeSql(createString);
			
			createString = "CREATE TABLE IF NOT EXISTS positions (id integer primary key, timestamp integer, latitude real, longitude real, accuracy data_num, altitude real, altitudeAccuracy real, heading real, speed real); ";
			dbHandler.executeSql(createString);	
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
			
					dbHandler.insertInto("reports", keys, values, function(res) {
						$ionicLoading.show({template: 'Report Sent Successfully (saved to db)', noBackdrop: true, duration: 1500});
					});
				})
			}, function(error) {
				alert(error.message);
			}, {timeout: 15000, enableHighAccuracy: true})
		},
		
		getAllPositionLogs: function(window, callback) {
			var dbHandler = new DbHandler("ace.db", window);
			dbHandler.selectAllFrom("positions", callback);
		},
		
		getAllReports: function(window, callback) {
			var dbHandler = new DbHandler("ace.db", window);
			dbHandler.selectAllFrom("reports", callback);
		},
		
		getReportsAndPositions: function(window, callback) {
			var sqlString = "SELECT * FROM reports INNER JOIN positions ON reports.positionId=positions.id;";
			var dbHandler = new DbHandler("ace.db", window);
			dbHandler.executeSql(sqlString, function(res) {
				var reports = [];
				for(var i = 0; i < res.rows.length; i++)
				{
					var tempReport = new WeatherReport();
					tempReport.importSqlRow(res.rows.item(i));
					var tempPosition = new Position();
					tempPosition.importSqlRow(res.rows.item(i));
					tempReport.position = tempPosition;
					reports.push(tempReport);					
				}
				
				if(callback)
				{
					callback.call(this, reports);	
				}				
			});
		},
		
		getRecentPositionLogs: function(window, numLogs, callback) {
			var dbHandler = new DbHandler("ace.db", window);
			dbHandler.selectNum("positions", numLogs, "timestamp", true, callback);	
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