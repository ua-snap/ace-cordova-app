/**
 * Class handles all database operations at the lowest level.
 * 
 * @class DbHandler
 * @constructor
 */
var DbHandler = function(name, window) {
	this.mWindow = window;
	this.mDb = window.sqlitePlugin.openDatabase({name: "ace.db", createFromLocation: 1});
	this.mDbName = name;
};

/**
 * Function deletes the current database for the app.
 * 
 * @method deleteDb
 * @return void
 * @throws none
 */
DbHandler.prototype.deleteDb = function() {
	//window.sqlitePlugin.close();
	window.sqlitePlugin.deleteDatabase({name: this.mDbName, location: 1});
};

 DbHandler.prototype.upsert = function(tableName, keys, values, uniqueCol, uniqueVal, callback) {
 	var self = this;
	this.mDb.transaction(function(tx) {
		var updateSqlString = "UPDATE OR IGNORE " + tableName + " SET ";	
		
		for(var i = 0; i < keys.length; i++)
		{
			if(i !== keys.length - 1)
			{
				updateSqlString = updateSqlString + keys[i] + "='" + values[i] + "',";
			}
			else
			{
				updateSqlString = updateSqlString + keys[i] + "='" + values[i] + "' WHERE " + uniqueCol + "=" + uniqueVal + "; ";
			}			
		}	
		
		var insertSqlString = "INSERT OR IGNORE INTO " + tableName + " (";
		
		for(var i = 0; i < keys.length; i++)
		{
			if(i !== (keys.length - 1))
			{
				insertSqlString = insertSqlString +	keys[i] + ","
			}
			else
			{
				insertSqlString = insertSqlString + keys[i] + ") VALUES (";	
			}			 
		}
		
		for(var i = 0; i < values.length; i++)
		{
			if(i !== (values.length - 1))
			{
				insertSqlString = insertSqlString +	"'" + values[i] + "',";
			}
			else
			{
				insertSqlString = insertSqlString + "'" + values[i] + "');";	
			}	
		}
		
		tx.executeSql(updateSqlString, [], function(tx, res) {
			tx.executeSql(insertSqlString, [], function(tx, res) {
				if(callback)
				{
					callback.call(this, res);
				}
			});			
		});
	}, function(error) {
		self.errorHandler(error);
	});
 };

/**
 * Function inserts a row into the specified table.  Column names are provided as an array of strings in the "keys"
 * parameter.  Values to insert are provided as an array in the values parameter.  If provided, the callback parameter
 * (function) will be executed on a successful insert.
 * 
 * @method insertInto
 * @param {String} tableName The name of the table to insert into
 * @param {String[]} keys The array of column names to insert into
 * @param {Array} values The array of values to insert
 * @param {function} callback The callback function to be executed on a successful insert.  Will be passed a "res" 
 * 		variable containing the result of the insert (including affected row numbers and id's)
 * @return void
 * @throws none
 */
DbHandler.prototype.insertInto = function(tableName, keys, values, callback) {
	var self = this;
	this.mDb.transaction(function(tx) {
		var sqlString = "INSERT OR IGNORE INTO " + tableName + " (";
		
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

/**
 * Function executes a "SELECT *" SQL statement on the specified table and passes the results to the provided callback
 * function.
 * 
 * @method selectAllFrom
 * @param {String} tableName The table to select all rows from
 * @param {function} callback The function to call on a successful select statement
 * @return void
 * @throws none
 */
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

/**
 * Function executes the provides SQL statement (sqlString) and passes the result to the provided callback function
 * 
 * @method executeSql
 * @param {String} sqlString The SQL statement to execute
 * @param {function} callback The function to exeucte after a successful statement execution
 * @return void
 * @throws none
 */
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

/**
 * Function selects the top number of results from the specified table.  Can be configured to determine ordering by
 * any column in either ascending or descending order.
 * 
 * @method selectNum
 * @param {String} tableName The name of the table to select from
 * @param {Integer} numResults The number of rows to return
 * @param {String} orderByCol The name of the column to order the results by
 * @param {Boolean} ascending True if the rows should be returned in ascending order, false otherwise
 * @return void
 * @throws none
 */
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

/**
 * Function returns the row from the specified table with a primary key id matching the provided id parameter.
 * 
 * @method getId
 * @param {String} tableName The name of the table to execute the select statement on
 * @param {Integer} id The id of the row to return
 * @param {function} callback The function to pass the results to.  Accepts one parameter (res) that contains the 
 * 		results of the transaction.  The row (if it exists) should be in res.rows.item(0)
 * @return void
 * @throws none
 */
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

/**
 * Common error handler for the DbHandler class.  Currently creates an "alert" with the error message (error.message)
 * 
 * @method errorHandler
 * @param {Object} error The error object to be handled
 */
DbHandler.prototype.errorHandler = function(error) {
	alert(error.message);
};


