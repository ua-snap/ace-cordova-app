angular.module('ace.services', [])

/**
 * This service serves as an interface to the ACE web api.
 * 
 * @class WebApiService
 * @constructor
 */
.service('WebApiService', function(Mobile_user, Weather_report, Position, Group) {
	return {
		
		/**
		 * Function checks user authorization and calls successCb in the case of valid authorization and errorCb in the
		 * case of invalid authorization.  Should be used to service a Login call and at any other time verification of
		 * authorization is needed.
		 * 
		 * @method authorizeUser
		 * @param {Username/Password} credentials An object containing a username (or email) and password
		 * @param {function} successCb Success callback function
		 * @param {function} errorCb Error callback function
		 * @return void
		 * @throws none
		 */
		authorizeUser: function(credentials, successCb, errorCb)
		{
			Mobile_user.login(credentials, successCb, errorCb);
		},
		
		/**
		 * Function de-authorizes (logs out) user and calls successCb if the call was successful, errorCb if some
		 * error occurred.
		 * 
		 * @method deAuthorizeUser
		 * @param {function} successCb Success callback function
		 * @param {function} errorCb Error callback function
		 * @return void
		 * @throws none
		 */
		deAuthorizeUser: function(successCb, errorCb)
		{
			Mobile_user.logout(successCb, errorCb);
		},
		
		/**
		 * Function creates a position from the position information provided in the argument.  The position variable
		 * should contain the following fields:
		 * position = {
		 * 		userId: Integer, 	(required)
		 * 		latlng: {			(required)
		 * 			lat: Number,
		 * 			lng: Number
		 * 		},
		 * 		timestamp: Date,	(required)
		 * 		accuracy: Number,
		 * 		altitudeAccuracy: Number,
		 * 		heading: Number,
		 * 		speed: Number
		 * }
		 * 
		 * successCb expects 2 arguments: a "value" that contains the details of the created position (and includes
		 * an unique "id" field) and a responseHeaders variable (not currently used).
		 * 
		 * errorCb expects only an httpResponse variable containing information about any errors
		 * 
		 * @method createPosition
		 * @param {Object} position The position object to upload.  Should be structured like the following:
		 * position = {
		 * 		userId: Integer, 	(required)
		 * 		latlng: {			(required)
		 * 			lat: Number,
		 * 			lng: Number
		 * 		},
		 * 		timestamp: Date,	(required)
		 * 		accuracy: Number,
		 * 		altitudeAccuracy: Number,
		 * 		heading: Number,
		 * 		speed: Number
		 * }
		 * 
		 * @param {function} successCb Success callback function.  Expects 2 arguments: a "value" that contains the 
		 * details of the created position (and includes an unique "id" field) and a responseHeaders variable (not currently used).
		 * 
		 * @param {function} errorCb Error callback function.  Expects only an httpResponse variable containing information about any errors
		 */
		createPosition: function(position, successCb, errorCb)
		{
			Position.create(position, successCb, errorCb);
		},
		
		
		/**
		 * Function creates a Weather report object.  The "report" object should be structured as follows:
		 * 
		 * report = {
		 * 		userId: Integer, (required)
		 * 		positionId: Integer, (required)
		 * 		cloudCover: String,
		 * 		precipitation: String,
		 * 		visibility: String,
		 * 		pressureTendency: String,
		 * 		pressureValue: String,
		 * 		temperatureValue: String,
		 * 		temperatureUnits: String,
		 * 		windValue: String,
		 * 		windUnits: String,
		 * 		windDirection: String,
		 * 		notes: String,
		 * 		other: String,
		 * 		attachment: String 
		 * }
		 * 
		 * @method createWeatherReport
		 * @param {Object} report The report object to create.  Should be structured as follows:
		 * report = {
		 * 		userId: Integer, (required)
		 * 		positionId: Integer, (required)
		 * 		cloudCover: String,
		 * 		precipitation: String,
		 * 		visibility: String,
		 * 		pressureTendency: String,
		 * 		pressureValue: String,
		 * 		temperatureValue: String,
		 * 		temperatureUnits: String,
		 * 		windValue: String,
		 * 		windUnits: String,
		 * 		windDirection: String,
		 * 		notes: String,
		 * 		other: String,
		 * 		attachment: String 
		 * }
		 * 
		 * @param {function} successCb Success callback function.  Expects 2 arguments: a "value" that contains the 
		 * details of the created position (and includes an unique "id" field) and a responseHeaders variable (not currently used).
		 * 
		 * @param {function} errorCb Error callback function.  Expects only an httpResponse variable containing information about any errors
		 */
		createWeatherReport: function(report, successCb, errorCb)
		{
			Weather_report.create(report, successCb, errorCb);
		},	
		
		/**
		 * Function returns all the mobile users that are in the current user's Group.  That is, all the users whose
		 * reports and positions should be visibile to the current user.
		 * 
		 * @method getGroupUsers
		 * @param {Object} params Currently used to pass the id of the group to the API service
		 * @param {function} successCb Success callback function.  Expects 2 arguments, a "value" that contains all other
		 * 		group users in JSON form in an array and an unused responseHeader variable.
		 * @param {function} errorCb Error callback function.  Expects 1 argument, an "httpResponse" variable that  
		 * 		contains information about the error.
		 */
		 getGroupUsers: function(params, successCb, errorCb) 
		 {
			 Group.MobileUsers(params, successCb, errorCb);
		 }		
	};
});