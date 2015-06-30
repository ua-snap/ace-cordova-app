var Position = function() {
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