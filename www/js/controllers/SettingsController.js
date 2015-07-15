// SettingsController.js

/**
 * @module ace.controllers
 */
 
 // SettingsController.js
 //-----------------------------------------------------------------------------------------------
 
 // Controller for the settings view
 /**
  * @class SettingsController
  */
angular.module('ace.controllers')

.controller('SettingsController', function($scope, $translate, $ionicNavBarDelegate, $ionicSideMenuDelegate, $ionicHistory, $state) {
	
	// Adding beforeEnter event listener.  This function will be called just before every view load,
	// regardless of controller and state caching.
	$scope.$on('$ionicView.enter', function() {
		// Enable dragging of the side menu
		$ionicSideMenuDelegate.canDragContent(false);
		
		// Re-translate the title (to ensure that it is correctly translated)
        $translate(['SETTINGS']).then(function(translations) {
           $ionicNavBarDelegate.title(translations.SETTINGS); 
        });
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
	
	/**
	 * Function called when the Database Settings item is clicked.  Opens the database settings interface
	 * 
	 * @method dbSettingsClicked
	 * @return void
	 * @throws none
	 */
	$scope.dbSettingsClicked = function() {
		$state.go('settings-db');	
	};
	
	/**
	 * Function called when the GPS Settings item is clicked.  Opens the GPS settings interface
	 * 
	 * @method gpsSettingsClicked
	 * @return void
	 * @throws none
	 */
	$scope.gpsSettingsClicked = function() {
		$state.go('settings-gps');
	};
	
	/**
	 * Function called when the Language Settings item is clicked.  Opens the Language settings interface
	 * 
	 * @method languageSettingsClicked
	 * @return void
	 * @throws none
	 */
	$scope.languageSettingsClicked = function() {
		$state.go('settings-language');
	}
});