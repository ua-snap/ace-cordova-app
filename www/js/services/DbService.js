angular.module('starter.services')

.service('DbService', function() {
	return {
		openDatabase: function(window) {
			var dbHandler = new DbHandler("ace.db", window);
		},	
		
		createTables: function(window) {
			var dbHandler = new DbHandler("ace.db", window);
			dbHandler.createTables('CREATE TABLE IF NOT EXISTS position_history (id integer primary key, timestamp integer, latitude real, longitude real, accuracy data_num, altitude real, altitudeAccuracy real, heading real, speed real)');
		},
		
		insertPosition: function(pos, window) {
			var dbHandler = new DbHandler("ace.db", window);
			
			var keys = ["timestamp", "speed", "heading", "altitudeAccuracy", "altitude", "accuracy", "longitude", "latitude"];
			
			var values = [pos.timestamp, pos.coords.speed, pos.coords.heading, pos.coords.altitudeAccuracy, pos.coords.altitude, pos.coords.accuracy, pos.coords.longitude, pos.coords.latitude];
			
			dbHandler.insertInto("position_history", keys, values);
		},
		
		getAllPositionLogs: function(window, callback) {
			var dbHandler = new DbHandler("ace.db", window);
			dbHandler.selectAllFrom("position_history", callback);
		}
	};
});