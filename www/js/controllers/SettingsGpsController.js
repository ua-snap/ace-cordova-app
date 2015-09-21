// SettingsGpsController.js

angular.module('ace.controllers')

 
// SettingsGpsController.js
//-----------------------------------------------------------------------------------------------
 
// Controller for the settings view
.controller('SettingsGpsController', function($scope, $ionicSideMenuDelegate, $ionicHistory, $state, GeoService, SettingsService) {
	  
	// Adding beforeEnter event listener.  This function will be called just before every view load,
	// regardless of controller and state caching.
	$scope.$on('$ionicView.enter', function() {
		// Enable dragging of the side menu
		$ionicSideMenuDelegate.canDragContent(false);
	});
	
	// Initialize settings BEFORE entering
	$scope.$on('$ionicView.beforeEnter', function() {
		var settings = SettingsService.getSettings(window);
		$scope.gpsSettings.highAccuracy.checked = settings.gps.highAccuracy;
		$scope.gpsSettings.timeout = settings.gps.timeout;
		$scope.gpsSettings.enablePositionTracking.checked= settings.gps.positionTrackingEnabled;
		$scope.gpsSettings.trackingInterval = settings.gps.trackingInterval;
		$scope.gpsSettings.historyPointNum = settings.gps.displayedHistoryPoints;
	});
	
	// Initialize gpsSettings to defaults (will be overridden in beforeEnter lifecycle event handler)
	$scope.gpsSettings = {
		highAccuracy: {
          checked: true
      	},
		timeout: 10,
		enablePositionTracking: {
			checked: true
		},
		trackingInterval: 60,
		historyPointNum: 100
	};
	
	// Toggle handler for Enable High Accuracy setting
	// This will execute calls to the HTML5 Geolocation API with the enableHighAccuracy option
	$scope.enableHighAccuracy = function() {		
		// Update global settings
		var settings = SettingsService.getSettings(window);
		settings.gps.highAccuracy = $scope.gpsSettings.highAccuracy.checked;
		SettingsService.updateSettings(window, settings);
	};
	
	// Change the gps timeout
	$scope.timeoutChanged = function() {
		var settings = SettingsService.getSettings(window);
		settings.gps.timeout = $scope.gpsSettings.timeout;
		SettingsService.updateSettings(window, settings);
	};
	
	// Turn on/off recording of user position
	$scope.enablePosTrackingChanged = function() {
		// Update settings
		var settings = SettingsService.getSettings(window);
		settings.gps.positionTrackingEnabled = $scope.gpsSettings.enablePositionTracking.checked;
		SettingsService.updateSettings(window, settings);
		
		// Turn on tracking immediately, if checked
        if(settings.gps.positionTrackingEnabled)
        {
            GeoService.enableTracking(settings.gps.trackingInterval, null);
        }
        else
        {
            GeoService.disableTracking();
        }
	};
	
	// Change the frequency at which a user's position is recorded in the tracking functionality
	$scope.trackingIntervalChanged = function() {
		// ignore intermediate changes ("")
		if($scope.gpsSettings.trackingInterval !== "")
		{
			var settings = SettingsService.getSettings(window);
			settings.gps.trackingInterval = Number($scope.gpsSettings.trackingInterval);
			SettingsService.updateSettings(window, settings);	
			
			// Update tracking interval in geo service
			if(settings.positionTrackingEnabled)
			{
				GeoService.disableTracking();
				
				// Lower bound for position tracking interval: 1 second 
				if(settings.gps.trackingInterval < 1)
				{
					GeoService.enableTracking(1, null);
				}
				else
				{
					GeoService.enableTracking(settings.gps.trackingInterval, null);
				}
			}
		}
	};
	
	// Custom function called when the back navigation button is clicked
	// Custom, because this is navigation back to a different state (one of the tabs), instead 
	// of simple back navigation using the nav stack.
	$scope.goBack = function() {
		// Get the previous state (saved in the AppController toggleLeft() function)
		var localHandler = new LocalStorageUtil(window);
		var previousState = localHandler.get('previousState', null);
		
		// If a previous state exists, navigate back to it
		if(previousState)
		{
			$state.go(previousState);
		}
		else
		{
			// Default to the report tab
			$state.go('tab.report');
		}
	};
});