var DbHandler = function(name, window) {
	this.mWindow = window;
	this.mDb = window.sqlitePlugin.openDatabase({name: "ace.db", createFromLocation: 1});
	this.mDbName = name;
};

DbHandler.prototype.deleteDb = function() {
	window.sqlitePlugin.close();
	window.sqlitePlugin.deleteDatabase({name: this.mDbName, location: 1});
};

DbHandler.prototype.insertInto = function(tableName, keys, values, callback) {
	var self = this;
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
			if(callback)
			{
				callback.call(this, res);
			}
		});
	}, function(error) {
		self.errorHandler(error);
	});
};

DbHandler.prototype.selectAllFrom = function(tableName, callback) {
	var self = this;
	this.mDb.transaction(function(tx) {
		var sqlString = "SELECT * FROM " + tableName + ";";
		tx.executeSql(sqlString, [], function(tx, res) {
			callback.call(this, res);
		});
	}, function(error) {
		self.errorHandler(error);
	});	
};

DbHandler.prototype.executeSql = function(sqlString, callback) {
	var self = this;
	this.mDb.transaction(function(tx) {
		tx.executeSql(sqlString, [], function(tx, res) {
			if(callback)
			{
				callback.call(this, res);
			}
			
		}, function(error) {
			self.errorHandler(error);
		});
	});	
};

DbHandler.prototype.selectNum = function(tableName, numResults, orderByCol, ascending, callback) {
	var self = this;
	var sqlString = "SELECT * FROM " + tableName + " ORDER BY " + orderByCol;
	if(ascending)
	{
		sqlString = sqlString + " ASC ";
	} 	
	else 
	{
		sqlString = sqlString + " DESC ";
	}
	
	sqlString = sqlString + "LIMIT " + numResults;
	
	this.mDb.transaction(function(tx) {
		tx.executeSql(sqlString, [], function(tx, res) {
			callback.call(this, res);
		});
	}, function(error) {
		self.errorHandler(error);
	});
};

DbHandler.prototype.getId = function(tableName, id, callback) {
	var self = this;
	var sqlString = "SELECT * FROM " + tableName + " WHERE id='" + id + "'";
	this.mDb.transaction(function(tx) {
		tx.executeSql(sqlString, [], function(tx, res) {
			callback.call(this, res);
		});
	}, function(error) {
		self.errorHandler(error);
	});	
};

DbHandler.prototype.errorHandler = function(error) {
	alert(error.message);
};


