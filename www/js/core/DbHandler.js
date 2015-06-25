var DbHandler = function(name, window) {
	this.mWindow = window;
	this.mDb = window.sqlitePlugin.openDatabase({name: "ace.db", createFromLocation: 1});
};

DbHandler.prototype.createTables = function() {
	this.mDb.transaction(function(tx) {
		tx.executeSql('CREATE TABLE IF NOT EXISTS position_history (id integer primary key, data_num timestamp, data_num latitude, data_num longitude, data_num accuracy, data_num altitude, data_num altitudeAccuracy, data_num heading, data_num speed)');
		return "success";
	}, function(error) {
		return error.message;
	});	
};


