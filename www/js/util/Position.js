/**
 * Object class used to store the contents of an HTML5 Geolocation position object.  Structured to mirror that object.
 * 
 * @class Position
 * @constructor
 */
var Position = function() {
	// Initialize all to ""
	this.timestamp = "";	
	this.coords = new Object();
	this.coords.accuracy = "";
	this.coords.altitude = "";
	this.coords.altitudeAccuracy = "";
	this.coords.heading = "";
	this.coords.latitude = "";
	this.coords.longitude = "";
	this.coords.speed = "";	
};	

/**
 * Function imports a HTML5 Geolocation position object
 * 
 * @method importNavigatorPosition
 * @param {Object} navPos The HTML5 Geolocation position object to import
 * @return void
 * @throws none
 */
Position.prototype.importNavigatorPosition = function(navPos)
{
	this.timestamp = navPos.timestamp;
	this.coords.accuracy = navPos.coords.accuracy;
	this.coords.altitude = navPos.coords.altitude;
	this.coords.altitudeAccuracy = navPos.coords.altitude;
	this.coords.heading = navPos.coords.heading;
	this.coords.latitude = navPos.coords.latitude;
	this.coords.longitude = navPos.coords.longitude;
	this.coords.speed = navPos.coords.speed;
};

/**
 * Function imports a SQL row from the ace.db "positions" table.
 * 
 * @method importSqlRow
 * @param {Object} sqlRow The row to import
 * @return void
 * @throws none
 */
Position.prototype.importSqlRow = function(sqlRow) {
	this.timestamp = sqlRow.timestamp;
	this.coords.accuracy = sqlRow.accuracy;
	this.coords.altitude = sqlRow.altitude;
	this.coords.altitudeAccuracy = sqlRow.altitudeAccuracy;
	this.coords.heading = sqlRow.heading;
	this.coords.latitude = sqlRow.latitude;
	this.coords.longitude = sqlRow.longitude;
	this.coords.speed = sqlRow.speed;
};