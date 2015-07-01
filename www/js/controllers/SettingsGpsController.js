// SettingsGpsController.js

/**
 * @module starter.controllers
 */
 
 // SettingsGpsController.js
 //-----------------------------------------------------------------------------------------------
 
 // Controller for the settings view
 /**
  * @class SettingsGpsController
  */
angular.module('starter.controllers')

.controller('SettingsGpsController', function($scope, $ionicSideMenuDelegate, $ionicHistory, $state, GeoService, DbService, SettingsService) {
  	
	// Adding beforeEnter event listener.  This function will be called just before every view load,
	// regardless of controller and state caching.
	$scope.$on('$ionicView.enter', function() {
		// Enable dragging of the side menu
		$ionicSideMenuDelegate.canDragContent(false);
	});
	  
	$scope.gpsSettings = {
		highAccuracy: {
          checked: true
      	},
		timeout: 10,
		enablePositionTracking: {
			checked: true
		},
		trackingInterval: 1,
		historyPointNum: 100
	};
	
	$scope.enableHighAccuracy = function() {		
		// Update global settings
		var settings = SettingsService.getSettings(window);
		settings.gps.highAccuracy = $scope.gpsSettings.highAccuracy.checked;
		SettingsService.updateSettings(window, settings);
	};
	
	$scope.timeoutChanged = function() {
		var settings = SettingsService.getSettings(window);
		settings.gps.timeout = $scope.gpsSettings.timeout;
		SettingsService.updateSettings(window, settings);
	};
	
	$scope.enablePosTrackingChanged = function() {
		var settings = SettingsService.getSettings(window);
		settings.gps.positionTrackingEnabled = $scope.gpsSettings.enablePositionTracking.checked;
		SettingsService.updateSettings(window, settings);
		
        if(settings.gps.positionTrackingEnabled)
        {
            GeoService.enableTracking(settings.gps.trackingInterval, null);
        }
        else
        {
            GeoService.disableTracking();
        }
	};
	
	$scope.trackingFrequencyChanged = function() {
		var settings = SettingsService.getSettings(window);
		settings.gps.trackingInterval = $scope.gpsSettings.trackingInterval;
		SettingsService.updateSettings(window, settings);	
		
		// Update tracking interval in geo service
		if(settings.positionTrackingEnabled)
		{
			GeoService.disableTracking();
			GeoService.enableTracking(settings.gps.trackingInterval, null);
		}
	};
	
	$scope.histPointNumChanged = function() {
		var settings = SettingsService.getSettings(window);
		settings.gps.displayedHistoryPoints = $scope.gpsSettings.historyPointNum;
		SettingsService.updateSettings(window, settings);	
	};
	
  	// Adding beforeEnter event listener.  This function will be called just before every view load,
	// regardless of controller and state caching.
	$scope.$on('$ionicView.enter', function() {
		// Enable dragging of the side menu
		$ionicSideMenuDelegate.canDragContent(true);
	});
	
	$scope.$on('$ionicView.beforeEnter', function() {
		var settings = SettingsService.getSettings(window);
		$scope.gpsSettings.highAccuracy.checked = settings.gps.highAccuracy;
		$scope.gpsSettings.timeout = settings.gps.timeout;
		$scope.gpsSettings.enablePositionTracking.checked= settings.gps.positionTrackingEnabled;
		$scope.gpsSettings.trackingInterval = settings.gps.trackingInterval;
	});
	
	// Function toggles sliding the left side-menu out and back in
	/**
	* @method toggleLeft
	* @description Function toggles sliding the left side-menu out and back in
	* @return void
	* @throws none
	*/
	$scope.toggleLeft = function() {
		$ionicSideMenuDelegate.toggleLeft();
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