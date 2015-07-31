angular.module('ace.services')

/**
 * Service class that handles all Geolocation for the app.
 * 
 * @class GeoService
 * @constructor
 */
.service('GeoService', function(DbService, SettingsService) {
	
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
		getCurrentPosition: function(geolocationObj, successCallback, errorCallback) {
			var self = this;
			// If currently watching position, simply return most recent position value
			if(mWatchId)
			{
				if(successCallback)
				{
					successCallback.call(this, mPos);	
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
						successCallback.call(this, position);
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
		// Sets private variable indicating whether or not to follow the user's position on the map (continually 
		// recenter on user position)
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
					var insert = false;
					if(position !== null)
					{
						// Automatically insert if no other entries have been inserted
						if(lastPos === null)
						{
							insert = true
						}
						else if(position.coords.accuracy === lastPos.coords.accuracy)
						{
							if(self.getDistanceHaversine(position, lastPos) > position.coords.accuracy)
							{
								insert = true;
							}
						}
						else
						{
							insert = true;
						}			
					}
					
					// Insert if necessary
					if(insert)
					{
						//DbService.insertPosition(position, window);
						window.client.models.LocalPosition.create(position, function(err, res) {
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
		setTrackingCallback: function(trackingCallback) {
			mTrackingCallback = trackingCallback;
		}
	};
});
