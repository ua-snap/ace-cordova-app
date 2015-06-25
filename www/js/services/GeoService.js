angular.module('starter.services')

.service('GeoService', function() {
	
	var mUpdateInterval = 1000;
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
		
		setUpdateInterval: function(updateInterval) {
			mUpdateInterval = updateInterval;
		},
		
		setWatchCallback: function(watchCallback) {
			mWatchCallback = watchCallback;
		},
		
		getCurrentPosition: function() {
			return mPos;
		},
		
		setFollowPosition: function(follow) {
			mFollowPosition = follow;
		},
		
		enableReport: function(frequency) {
			setInterval(function() {
				
			}, frequency * 1000);
		}
	};
});

