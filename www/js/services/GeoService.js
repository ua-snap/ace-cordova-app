angular.module('starter.services')

.service('GeoService', function(DbService) {
	
	var mTrackingInterval = 1;
	var mPos = null;
	var mWatchId;
	var mWatchCallback;
	var mFollowPosition = false;
	var mTimerId;
	var mTrackingCallback;
	
	return {
		// Track the position of the device and update mPos with each available update
		enableWatchPosition: function(geolocationObj, watchSuccessCallback) {
			mWatchCallback = watchSuccessCallback;
			mWatchId = geolocationObj.watchPosition(function(pos) {
					mPos = pos;
					if(mWatchCallback)
					{
						mWatchCallback.call(this, pos, mFollowPosition);
					}
			}, function(error) {
				// Do nothing on error
			}, {timeout: 5000, enableHighAccuracy: true});
		},
		
		// Turn off position tracking
		disableWatchPosition: function(geolocationObj) {
			if(mWatchId)
			{
				geolocationObj.clearWatch(mWatchId);	
			}			
		},
		
		// Sets the interval to submit a location report (and to save a history point on the map)
		setTrackingInterval: function(trackingInterval) {
			mTrackingInterval = trackingInterval;
		},
		
		// Sets the callback function for watchPosition success
		setWatchCallback: function(watchCallback) {
			mWatchCallback = watchCallback;
		},
		
		// Returns the latest position value
		getCurrentPosition: function() {
			return mPos;
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
			
			// Set the interval function
			mTimerId = setInterval(function() {
				DbService.insertPosition(mPos, window); 
				
				if(mTrackingCallback)
				{
					mTrackingCallback.call(this, mPos);	
				}
				     
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

