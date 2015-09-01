// SettingsGeneralController.js

angular.module('ace.controllers')

// SettingsGeneralController.js
//-----------------------------------------------------------------------------------------------
 
// Controller for the settings view
.controller('SettingsGeneralController', function($scope, $ionicSideMenuDelegate, SettingsService, $ionicHistory, $state) {
	// Pull settings from local storage BEFORE displaying view
	$scope.$on('$ionicView.beforeEnter', function() {
		var settings = SettingsService.getSettings(window);
		$scope.generalSettings.notifications.checked = settings.general.notifications;
		$scope.generalSettings.units = settings.general.units;
		
	});
  	
	// Adding beforeEnter event listener.  This function will be called just before every view load,
	// regardless of controller and state caching.
	$scope.$on('$ionicView.enter', function() {
		// Enable dragging of the side menu
		$ionicSideMenuDelegate.canDragContent(false);
	});
	
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
	
	// Initial state of all settings
	$scope.generalSettings = {
		notifications: {
			checked: true
		},
		units: "Imperial"
	};
	
	// Array to hold units name options
	$scope.unitsArray = ["Imperial", "Metric"];
	
	// Toggle/Check handler for when the sync notifications setting is changed
	$scope.notificationsChanged = function() {
		var settings = SettingsService.getSettings(window);
		settings.general.notifications = $scope.generalSettings.notifications.checked;
		SettingsService.updateSettings(window, settings);
	};
	
	// check handler for the units setting
	$scope.unitsChanged = function() {
		var settings = SettingsService.getSettings(window);
		settings.general.units = $scope.generalSettings.units;
		SettingsService.updateSettings(window, settings);
	};
});