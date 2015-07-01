angular.module('starter.services')

.service('GeoService', function(DbService, SettingsService) {
	
	var mTrackingInterval = 1;
	var mPos = null;
	var mWatchId;
	var mWatchCallback;
	var mFollowPosition = false;
	var mTimerId;
	var mTrackingCallback;
	var lastPos = null;
	
	return {		
		// Track the position of the device and update mPos with each available update
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
		
		// Turn off position tracking
		disableWatchPosition: function(geolocationObj) {
			if(mWatchId)
			{
				geolocationObj.clearWatch(mWatchId);	
			}	
			mWatchId = null;		
		},
		
		// Sets the interval to submit a location report (and to save a history point on the map)
		setTrackingInterval: function(trackingInterval) {
			mTrackingInterval = trackingInterval;
		},
		
		// Sets the callback function for watchPosition success
		setWatchCallback: function(watchCallback) {
			mWatchCallback = watchCallback;
		},
		
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
		
		degreesToRadians: function(deg) {
			return deg * (Math.PI/180);	
		},
		
		// Returns the latest position value
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
		
		// Common GPS error handler
		gpsErrorHandler: function(error) {
			// Do nothing right now
		},
		
		// Sets private variable indicating whether or not to follow the user's position on the map (continually 
		// recenter on user position)
		setFollowPosition: function(follow) {
			mFollowPosition = follow;
		},
		
		// Turns on reporting the user's location
		enableTracking: function(frequency, trackingCallback) {
			if(trackingCallback)
			{
				mtrackingCallback = trackingCallback;	
			}
			
			// If provided set the frequency to submit reports (in seconds)
			if(frequency)
			{
				mTrackingInterval = frequency;
			}
			
			var self = this;
			
			// Set the interval function
			mTimerId = setInterval(function() {
				self.getCurrentPosition(navigator.geolocation, function(position) {			
					
					if((position !== null) && (position !== lastPos))
					{
						DbService.insertPosition(position, window);	
					
						if(mTrackingCallback)
						{
							mTrackingCallback.call(this, mPos);	
						}
					}					
				});			     
			}, mTrackingInterval * 1000);
		},
		
		// Turns off reporting user's location
		disableTracking: function() {
			clearInterval(mTimerId);	
		},
		
		// Set the report callback
		setTrackingCallback: function(trackingCallback) {
			mTrackingCallback = trackingCallback;
		}
	};
});
