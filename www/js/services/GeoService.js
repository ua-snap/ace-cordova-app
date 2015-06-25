angular.module('starter.services')

.service('GeoService', function() {
	
	var mReportInterval = 1;
	var mPos = null;
	var mWatchId;
	var mWatchCallback;
	var mFollowPosition = false;
	
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
		setReportInterval: function(reportInterval) {
			mReportInterval = reportInterval;
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
		
		// Turns on reporting the user's location and displaying their history on the map
		enableReport: function(frequency) {
			// If provided set the frequency to submit reports (in seconds)
			if(frequency)
			{
				mReportInterval = frequency;
			}
			
			// Set the interval function
			setInterval(function() {
				
			}, mReportInterval * 1000);
		}
	};
});

