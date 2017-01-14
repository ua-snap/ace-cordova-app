// SettingsOrgController.js

angular.module('ace.controllers')

 // SettingsOrgController.js
 //-----------------------------------------------------------------------------------------------

 // Controller for the settings view
.controller('SettingsOrgController', function($scope, $ionicNavBarDelegate, $ionicSideMenuDelegate, $ionicHistory, $state, DataService, SettingsService, LocalStorageService, $translate) {

	// Load user settings prior to loading the view
	$scope.$on('$ionicView.beforeEnter', function() {
		var settings = SettingsService.getSettings(window);
		$scope.organizationSettings.organization = settings.organization;
		if(window.navigator.connection.type !== "none")
		{
			DataService.remoteGroup_find({}, function(err, result) {
				for(var i = 0; i < result.length; i++) {
					$scope.organizations.push({
						name: result[i].__data.name,
						value: result[i].__data.id
					});
				}
				$scope.$apply();
			});
		}
		else
		{
			DataService.localGroup_find({}, function(err, result) {
				for(var i = 0; i < result.length; i++) {
					$scope.organizations.push({
						name: result[i].__data.name,
						value: result[i].__data.id
					});
				}
				$scope.$apply();
			});
		}
	});

	// Adding beforeEnter event listener.  This function will be called just before every view load,
	// regardless of controller and state caching.
	$scope.$on('$ionicView.enter', function() {
		// Enable dragging of the side menu
		$ionicSideMenuDelegate.canDragContent(false);
	});

	// Array contains all displayed organization options
	$scope.organizations = [];

	// Selected organization
	$scope.organizationSettings = {
		organization: ""
	};

	// Event handler for changing the organization settings
	$scope.organizationChanged = function() {
		// Update settings
		var settings = SettingsService.getSettings(window);
		settings.organization = $scope.organizationSettings.organization;
		SettingsService.updateSettings(window, settings);
		LocalStorageService.setItem("groupId", settings.organization, window);
		for(var i = 0; i < $scope.organizations.length; i++) {
			if($scope.organizations[i].value === $scope.organizationSettings.organization) {
				LocalStorageService.setItem("groupName", $scope.organizations[i].name, window);
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
