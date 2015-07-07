angular.module('starter.services')
 
/**
 * @class DbService
 * @constructor
 */
.service('DbService', function($ionicLoading, LocalStorageService) {
	return {
		/**
		 * @method openDatabase
		 * @description Opens the default ACE database 
		 * @param {htmlDocument} window The window object from the current scope
		 * @return void
		 * @throws none
		 */
		openDatabase: function(window) {
			var dbHandler = new DbHandler("ace.db", window);
		},	
		
		/**
		 * @method createTables
		 * @description Creates all required tables in the ACE database using "CREATE TABLE IF NOT EXISTS"
		 * @param {htmlDocument} window The window object from the current scope
		 * @return void
		 * @throws none
		 */
		createTables: function(window) {
			var dbHandler = new DbHandler("ace.db", window);
			
			// Create positions table
			var createString = "";
			
			// Create reports table
			createString = createString + "CREATE TABLE IF NOT EXISTS reports (id integer primary key, positionId integer, userId integer, cloudCover text, precipitation text, visibility text, pressureTendency text, pressureValue text, temperatureValue text, temperatureUnits text, windValue text, windUnits text, windDirection text, notes text, camera text, other text, uploaded integer); ";
			dbHandler.executeSql(createString);
			
			createString = "CREATE TABLE IF NOT EXISTS positions (id integer primary key, userId integer, timestamp integer, latitude real, longitude real, accuracy data_num, altitude real, altitudeAccuracy real, heading real, speed real, uploaded integer); ";
			dbHandler.executeSql(createString);	
			
			createString = "CREATE TABLE IF NOT EXISTS users (id integer primary key, username text unique, email text, groupId integer)";
			dbHandler.executeSql(createString);
		},
		
		/**
		 * @method deleteDatabase
		 * @description Performs a hard delete on the ACE database (may cause errors, use #clearDatabase() instead)
		 * @param {htmlDocument} window The window object from the current scope
		 * @return void
		 * @throws none
		 */
		deleteDatabase: function(window) {
			var dbHandler = new DbHandler("ace.db", window);
			dbHandler.deleteDb();
		},
		
		/**
		 * @method clearDatabase
		 * @description Drops all tables from the ACE database, and then re-creates them by calling #createTables()
		 * @param {htmlDocument} window The window object from the current scope
		 * @return void
		 * @throws none
		 */
		clearDatabase: function(window) {
			var dbHandler = new DbHandler("ace.db", window);
			var clearString = "DROP TABLE IF EXISTS reports; DROP TABLE IF EXISTS positions; DROP TABLE IF EXISTS users";
			dbHandler.executeSql(clearString);
			this.createTables();
		},
		
		/**
		 * @method insertPosition
		 * @description Inserts the provided "pos" position argument into the ACE database
		 * @param {Position} pos The position (either the standard object returned from the HTML navigator.geolocation functions
		 * 		or a {{#crossLink "Position"}}{{/crossLink}} object)
		 * @param {htmlDocument} window The window object from the current scope
		 * @param {functon} callback Success callback executed on a successful insert.  Recieves the "res" (result) object that 
		 * 		contains the id of the just inserted position.
		 * @return void
		 * @throws none
		 */
		insertPosition: function(pos, window, callback) {
			var dbHandler = new DbHandler("ace.db", window);
			
			var keys = ["timestamp", "userId", "speed", "heading", "altitudeAccuracy", "altitude", "accuracy", "longitude", "latitude", "uploaded"];
			
			var userId = LocalStorageService.getItem("userId", null, window);
			
			var values = [pos.timestamp, userId, pos.coords.speed, pos.coords.heading, pos.coords.altitudeAccuracy, pos.coords.altitude, pos.coords.accuracy, pos.coords.longitude, pos.coords.latitude, 0];
			
			dbHandler.insertInto("positions", keys, values, callback);
		},
		
		/**
		 * @method insertUser
		 * @description Inserts the provided user into the ACE database
		 * @param {User} user The user object to insert, containing a username, email, and groupId
		 * @param {htmlDocument} window The window object from the current scope
		 * @param {function} callback Success callback executed on a successful insert.  Recieves the "res" (result) object that 
		 * 		contains the id of the just inserted position.
		 * @return void
		 * @throws none
		 */
		insertUser: function(user, window, callback) {
			var dbHandler = new DbHandler("ace.db", window);
			
			var keys = ["username", "email", "groupId"];
			
			var values = [user.username, user.email, user.groupId];
			
			dbHandler.insertInto("users", keys, values, callback);
		},
		
		/**
		 * Inserts the provided report into the ACE database.  First, requests the current location using {{crossLink GeoService/getCurrentPosition}}{{/crossLink}.
		 * Then, in the callback of a successful position returned, inserts that position into the database using {{crossLink DbService/insertPosition}}{{/crossLink}}.
		 * In the success callback of that function, the original report parameter is inserted into the database.
		 * 
		 * @method insertReport
		 * @param {WeatherReport} The report object to insert
		 * @param {htmlDocument} window The window object from the current scope
		 * @return void
		 * @throws none
		 */
		/*insertReport: function(report, window) {
			var dbHandler = new DbHandler("ace.db", window);
			var self = this;		
			GeoService.getCurrentLocation(navigator.geolocation, function(pos) {
				self.insertPosition(pos, window, function(res) {
					var posId = res.insertId;
					
					var userId = LocalStorageService.getItem("userId", null, window);
					
					var keys = ["positionId", "userId", "cloudCover", "precipitation", "visibility", "pressureTendency", "pressureValue", "temperatureValue", "temperatureUnits", "windValue", "windDirection", "notes", "camera", "other", "uploaded"];
			
					var values = [posId, userId, report.cloudCover, report.precipitation, report.visibility, report.pressureTendency, report.pressureValue, report.temperatureValue, report.temperatureUnits, report.windValue, report.windDirection, report.notes, report.camera, report.other, 0];
			
					dbHandler.insertInto("reports", keys, values, function(res) {
						$ionicLoading.show({template: 'Report Sent Successfully (saved to db)', noBackdrop: true, duration: 1500});
					});
				})
			}, function(error) {
				alert(error.message);
			});			
		},*/
		
		/**
		 * Function inserts a report and position simultaneously.  Use this function if you already have a position and want to insert
		 * a report marked to that position.
		 * 
		 * @method insertReportAndPosition
		 * @param {WeatherReport} report The report object to insert into the default ACE db.
		 * @param {Position} pos The position (either the standard object returned from the HTML navigator.geolocation functions
		 * 		or a {{#crossLink "Position"}}{{/crossLink}} object)
		 * @param {htmlDocument} window The window object from the current scope
		 * @return void
		 * @throws none
		 */
		insertReportAndPosition: function(report, position, window) {
			var dbHandler = new DbHandler("ace.db", window);
			var self = this;
			self.insertPosition(position, window, function(res) {
				var posId = res.insertId;
				var keys = ["positionId", "cloudCover", "precipitation", "visibility", "pressureTendency", "pressureValue", "temperatureValue", "temperatureUnits", "windValue", "windDirection", "notes", "camera", "other", "uploaded"];
			
				var values = [posId, report.cloudCover, report.precipitation, report.visibility, report.pressureTendency, report.pressureValue, report.temperatureValue, report.temperatureUnits, report.windValue, report.windDirection, report.notes, report.camera, report.other, 0];
		
				dbHandler.insertInto("reports", keys, values, function(res) {
					$ionicLoading.show({template: 'Report Sent Successfully (saved to db)', noBackdrop: true, duration: 1500});
				});
			});	
		},
		
		/**
		 * Function executes a SQL query to retrieve all the position logs from the database and passes the result ("res")
		 * as a parameter to the provided callback function.
		 * 
		 * @method getAllPositionLogs
		 * @param {htmlDocument} window The window object from the current scope
		 * @param {function} callback Success callback that recieves the result of the SQL query which contains all the position log information
		 * @return void
		 * @throws none 
		 */
		getAllPositionLogs: function(window, callback) {
			var dbHandler = new DbHandler("ace.db", window);
			dbHandler.selectAllFrom("positions", callback);
		},
		
		/**
		 * Function executes a SQL query to retrieve all the reports from the database and passes the result ("res") as a 
		 * parameter to the provided callback function.
		 * 
		 * @method getAllReports
		 * @param {htmlDocument} window The window object from the current scope
		 * @param {function} callback Success callback that recieves the result of the SQL query with contains all the reports
		 * @return void
		 * @throws none
		 */
		getAllReports: function(window, callback) {
			var dbHandler = new DbHandler("ace.db", window);
			dbHandler.selectAllFrom("reports", callback);
		},
		
		/**
		 * Function executes a SQL query to retrieve all the reports in the database and joins them with their associated position objects.
		 * 
		 * @method getReportsAndPositions
		 * @param {htmlDocument} window The window object from the current scope
		 * @param callback Success callback that recieves the result of the SQL query (all reports and their associated positions)
		 * @return void
		 * @throws none
		 */
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
		
		/**
		 * Function gets the "recent" (by timestamp) position logs from the database and passes the result ("res") object to 
		 * the provided callback function.  The exact number of logs to return is determined by the numLogs parameter
		 * 
		 * @method getRecentPositionLogs
		 * @param {htmlDocument} window The window object from the current scope
		 * @param {Integer} numLogs The number of position logs to return
		 * @param {function} callback Success callback that recieves the result ("res") of the SQL query.
		 * @return void
		 * @throws none
		 */
		getRecentPositionLogs: function(window, numLogs, callback) {
			var dbHandler = new DbHandler("ace.db", window);
			dbHandler.selectNum("positions", numLogs, "timestamp", false, callback);	
		},
		
		/**
		 * Utility function converts the provided array of positions into an array of google.maps.LatLng objects.
		 * 
		 * @method convertPositionArrayToLatLng
		 * @param {Array} positions The array of Positon objects to convert
		 * @return {Array} The newly converted array of LatLng objects
		 * @throws none
		 */
		convertPositionArrayToLatLng: function(positions) {
			var latLngArr = [];
			for(var i = 0; i < positions.length; i++)
			{
				latLngArr.push(new google.maps.LatLng(positions.item(i).latitude, positions.item(i).longitude));
			}
			return latLngArr;
		},
		
		/**
		 * Function gets all the users in the ACE db and passes the result ("res") as an argument to the provided callback
		 * function.
		 * 
		 * @method getAllUsers
		 * @param {htmlDocument} window The window object from the current scope
		 * @param {function} callback Success callback that recieves the result ("res") of the SQL query.
		 * @return void
		 * @throws none
		 */
		getAllUsers: function(window, callback) {
			var sqlString = "SELECT * FROM users";
			var dbHandler = new DbHandler("ace.db", window);
			dbHandler.executeSql(sqlString, callback);
		}
	};
});