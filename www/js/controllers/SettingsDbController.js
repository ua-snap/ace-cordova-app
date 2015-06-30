// SettingsDbController.js

/**
 * @module starter.controllers
 */
 
 // SettingsDbController.js
 //-----------------------------------------------------------------------------------------------
 
 // Controller for the settings view
 /**
  * @class SettingsDbController
  */
angular.module('starter.controllers')

.controller('SettingsDbController', function($scope, $ionicSideMenuDelegate, $ionicHistory, $state, DbService) {
  
	// Adding beforeEnter event listener.  This function will be called just before every view load,
	// regardless of controller and state caching.
	$scope.$on('$ionicView.enter', function() {
		// Enable dragging of the side menu
		$ionicSideMenuDelegate.canDragContent(false);
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
	
	$scope.deleteClicked = function() {
		// Delete the database
		DbService.deleteDatabase(window);
		
		// Recreate the database
		DbService.createTables(window);
	};
});