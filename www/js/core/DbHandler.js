var DbHandler = function(name, window) {
	this.mWindow = window;
	this.mDb = window.sqlitePlugin.openDatabase({name: "ace.db", createFromLocation: 1});
	this.mDbName = name;
};

DbHandler.prototype.createTables = function(createString) {
	this.mDb.transaction(function(tx) {
		tx.executeSql(createString);
	}, function(error) {
		// error condition on entire transaction
	});	
};

DbHandler.prototype.deleteDb = function() {
	window.sqlitePlugin.deleteDatabase({name: this.mDbName, location: 1});
};

DbHandler.prototype.insertInto = function(tableName, keys, values) {
	this.mDb.transaction(function(tx) {
		var sqlString = "INSERT INTO " + tableName + " (";
		for(var i = 0; i < keys.length; i++)
		{
			if(i !== (keys.length - 1))
			{
				sqlString = sqlString +	keys[i] + ","
			}
			else
			{
				sqlString = sqlString + keys[i] + ") VALUES (";	
			}			 
		}
		
		for(var i = 0; i < values.length; i++)
		{
			if(i !== (values.length - 1))
			{
				sqlString = sqlString +	"?,";
			}
			else
			{
				sqlString = sqlString + "?)";	
			}	
		}
		
		tx.executeSql(sqlString, values, function(tx, res) {
			alert(res.rowsAffected);
		});
	}, function(error) {
		alert(error.message);
	});
};


