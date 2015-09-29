// GeoService.js

/**
 * @module ace.services
 */
angular.module('ace.services')

/**
 * Service class that handles all Geolocation for the app.
 * 
 * @class GeoService
 * @constructor
 */

// GeoService.js
//-----------------------------------------------------------------------------------------------

// Service class that handles all Geolocation for the app.
.service('GeoService', function(SettingsService, LocalStorageService, DataService) {
	
	// Member variables for the service
	var mTrackingInterval = 1;
	var mPos = null;
	var mWatchId;
	var mWatchCallback;
	var mFollowPosition = false;
	var mTimerId;
	var mTrackingCallback;
	var lastPos = null;
	
	return {	
		/**
		 * Function turns on tracking of device position. Updates member variable mPos with each update from the 
		 * navigator.geolocation object.  Can also be used to execute some callback on every position update through
		 * the optional watchSuccessCallback parameter.
		 * 
		 * @method enableWatchPosition
		 * @param {Object} geolocationObj The object to use for geolocation information (usually navigator.geolocation)
		 * @param {function} watchSuccessCallback Function to be executed on each available position update.  Optional.
		 * @return void
		 * @throws none
		 */	
		
		// Function turns on tracking of device position. Updates member variable mPos with each update from the 
		// navigator.geolocation object.  Can also be used to execute some callback on every position update through
		// the optional watchSuccessCallback parameter.
		enableWatchPosition: function(geolocationObj, watchSuccessCallback) {
			var self = this;
			mWatchCallback = watchSuccessCallback;
			var settings = SettingsService.getSettings(window);
			mWatchId = geolocationObj.watchPosition(function(pos) {
					lastPos = mPos;
					mPos = pos;
					if(mWatchCallback)
					{
						mWatchCallback.call(this, pos, mFollowPosition);
					}
			}, function(error) {
				self.gpsErrorHandler(error);
			}, {timeout: settings.gps.timeout * 1000, enableHighAccuracy: settings.gps.highAccuracy});
		},
		
		/**
		 * Function disables tracking of the device position
		 * 
		 * @method disableWatchPosition
		 * @param {Object} geolocationObj The object to disable the watch on. (usually navigator.geolocation)
		 * @return void
		 * @throws none
		 */
		
		// Function disables tracking of the device position
		disableWatchPosition: function(geolocationObj) {
			if(mWatchId)
			{
				geolocationObj.clearWatch(mWatchId);	
			}	
			mWatchId = null;		
		},
		
		/**
		 * Function sets the interval at which to record a location to the web server.
		 * 
		 * @method setTrackingInterval
		 * @param {Number} trackingInterval The interval at which to record a location to the web server.
		 * @return void
		 * @throws none
		 */
		
		// Function sets the interval at which to record a location to the web server.
		setTrackingInterval: function(trackingInterval) {
			mTrackingInterval = trackingInterval;
		},
		
		/**
		 * Sets the callback function for a watchPosition update.
		 * 
		 * @method setWatchCallback
		 * @param {function} watchCallback The function to be executed on every position update
		 * @return void
		 * @throws none
		 */
		 
		// Sets the callback function for a watchPosition update.
		setWatchCallback: function(watchCallback) {
			mWatchCallback = watchCallback;
		},
		
		/**
		 * Function uses the Haversine method to return the distance between to GPS positions.
		 * 
		 * @method getDistanceHaversine
		 * @param {Object} The Position object representing the first location.
		 * @param {Object} The Position object representing the second location.
		 * @return {Number} The distance between the two positions in meters.
		 * @throws none
		 */
		
		// Function uses the Haversine method to return the distance between to GPS positions.
		getDistanceHaversine: function(position1, position2) {
			if(position1 && position2)
			{
				var lat1 = position1.coords.latitude;
				var lon1 = position1.coords.longitude;
				var lat2 = position2.coords.latitude;
				var lon2 = position2.coords.longitude;	
				
				var R = 6371;
				var dLat = this.degreesToRadians(lat2 - lat1);
				var dLon = this.degreesToRadians(lon2 - lon1);
				var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(this.degreesToRadians(lat1)) * 
				Math.cos(this.degreesToRadians(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
				var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  				var d = R * c;
				  
				// Return difference in meters 
			  	return d * 1000; 
			}
			else
			{
				return null;
			}			
		},
		
		/**
		 * Function converts the provided degrees argument to radians.
		 * 
		 * @method degreesToRadians
		 * @param {Number} deg The degrees to be converted to radians.
		 * @return {Number} The value of the provided "deg" argument in radians
		 * @throws none
		 */
		
		// Function converts the provided degrees argument to radians.
		degreesToRadians: function(deg) {
			return deg * (Math.PI/180);	
		},
		
		/**
		 * Function gets the most current position value and passes it to the successCallback parameter.  If the
		 * position is currently being watched, simply passes the current value of mPos.  If not, function enables 
		 * position watching and executes the successCallback only once.
		 * 
		 * @method getCurrentPosition
		 * @param {Object} geolocationObj The object to use for geolocation services (usually navigator.geolocation)
		 * @param {function} successCallback The function to pass the retrieved position to
		 * @param {function} errorCallback Function called if there is an error retrieving the latest position value.
		 * @return void
		 * @throws none
		 */
		
		// Function gets the most current position value and passes it to the successCallback parameter.  If the
		// position is currently being watched, simply passes the current value of mPos.  If not, function enables 
		// position watching and executes the successCallback only once.
		getCurrentPosition: function(geolocationObj, successCallback, errorCallback) {
			var self = this;
			// If currently watching position, simply return most recent position value
			if(mWatchId)
			{
				if(successCallback)
				{
					successCallback.call(null, mPos);	
				}					
			}
			else
			{
				// If not currently watching position, start a watch
				self.enableWatchPosition(geolocationObj, function(position) {
					// Make the callback only run once
					self.setWatchCallback(null);
					if(successCallback)
					{
						successCallback.call(null, position);
					}
				});
			}			
		},
		
		/**
		 * Function serves as the common error handler for the Geolocation service and is called wherever errorCallbacks are
		 * not used.  Currently does nothing.
		 * 
		 * @method gpsErrorHandler
		 * @param {Object} error The error to handle
		 * @return void
		 * @throws none
		 */
		
		// Function serves as the common error handler for the Geolocation service and is called wherever errorCallbacks are
		// not used.  Currently does nothing.
		gpsErrorHandler: function(error) {
			// Do nothing right now
		},
		
		/**
		 * Function sets an indicator telling the service to follow the user's position (only used when on the Map view)
		 * 
		 * @method setFollowPosition
		 * @param {Boolean} follow True if the user position should be followed. False if not.
		 * @return void
		 * @throws none
		 */
		
		// Function sets an indicator telling the service to follow the user's position (only used when on the Map view)
		setFollowPosition: function(follow) {
			mFollowPosition = follow;
		},
		
		/**
		 * Function turns on tracking of the device position at the frequency specified by the parameter.  Additionally, 
		 * an optional trackingCallback is provided to execute a function on every tracking interval.
		 * 
		 * @method enableTracking
		 * @param {Number} frequency The frequency at which to track the device position, in seconds.
		 * @param {function} trackingCallback Function that will be executed at each tracking interval (optional).
		 * @return void
		 * @throws none
		 */
		
		// Function turns on tracking of the device position at the frequency specified by the parameter.  Additionally, 
		// an optional trackingCallback is provided to execute a function on every tracking interval.
		enableTracking: function(frequency, trackingCallback) {
			if(trackingCallback)
			{
				mTrackingCallback = trackingCallback;	
			}
			
			// If provided set the frequency to submit reports (in seconds)
			if(frequency)
			{
				mTrackingInterval = frequency;
			}
			
			var self = this;
			
			// Check for any previous timer
			if(mTimerId)
			{
				clearInterval(mTimerId);
			}
			
			// Set the interval function
			mTimerId = setInterval(function() {
				self.getCurrentPosition(navigator.geolocation, function(position) {			
					// Insert if valid position
					if(position !== null)
					{
						var newPosition = {
							userId: LocalStorageService.getItem("currentUser", {}, window).id,
							latlng: {
								lat: position.coords.latitude,
								lng: position.coords.longitude
							},
							timestamp: position.timestamp,
							accuracy: position.coords.accuracy,
							altitude: position.coords.altitude,
							altitudeAccuracy: position.coords.altitudeAccuracy,
							heading: position.coords.heading,
							speed: position.coords.speed
						};
						DataService.localPosition_create(newPosition, function(err, res) {
							if(err) throw err;
						});
			
						if(mTrackingCallback)
						{
							mTrackingCallback.call(this, mPos);	
						}	
					}						
				});			     
			}, mTrackingInterval * 1000);
		},
		
		/**
		 * Function disables tracking a user's location
		 * 
		 * @method disableTracking
		 * @return void
		 * @throws none
		 */
		
		// Function disables tracking a user's location
		disableTracking: function() {
			if(mTimerId)
			{
				clearInterval(mTimerId);	
				mTimerId = null;
			}			
		},
		
		/**
		 * Function checks whether tracking is currently enabled.  Returns true if it is, false otherwise.
		 * 
		 * @method isTrackingEnabled
		 * @return {Boolean} True if tracking is enabled, false otherwise
		 * @throws none
		 */
		
		// Function checks whether tracking is currently enabled.  Returns true if it is, false otherwise.
		isTrackingEnabled: function() {
			if(mTimerId && mWatchId)
			{
				return true;
			}
			else
			{
				return false;
			}
		},
		
		/**
		 * Function sets the tracking callback
		 * 
		 * @method setTrackingCallback
		 * @param {function} trackingCallback The function to be executed on the tracking interval
		 * @return void
		 * @throws none
		 */
		
		// Function sets the tracking callback
		setTrackingCallback: function(trackingCallback) {
			mTrackingCallback = trackingCallback;
		}
	};
});
