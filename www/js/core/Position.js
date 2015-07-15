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
 * @method importGoogleGeoLoc
 * @param {Object} googleGeo The HTML5 Geolocation position object to import
 * @return void
 * @throws none
 */
Position.prototype.importGoogleGeoLoc = function(googleGeo)
{
	this.timestamp = googleGeo.timestamp;
	this.coords.accuracy = googleGeo.coords.accuracy;
	this.coords.altitude = googleGeo.coords.altitude;
	this.coords.altitudeAccuracy = googleGeo.coords.altitude;
	this.coords.heading = googleGeo.coords.heading;
	this.coords.latitude = googleGeo.coords.latitude;
	this.coords.longitude = googleGeo.coords.longitude;
	this.coords.speed = googleGeo.coords.speed;
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