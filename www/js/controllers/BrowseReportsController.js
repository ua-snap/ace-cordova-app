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

.controller('BrowseReportsController', function($scope, $ionicSideMenuDelegate, $ionicHistory, $state, DbService, DataShareService) {
  
  // Adding beforeEnter event listener.  This function will be called just before every view load,
	// regardless of controller and state caching.
	$scope.$on('$ionicView.enter', function() {
		// Enable dragging of the side menu
		$ionicSideMenuDelegate.canDragContent(true);
		
		
	});
	
	// Ensure that the reports info is correct when the view is FIRST displayed.
	$scope.$on('$ionicView.beforeEnter', function() {
		// Set up reports item
		DbService.getReportsAndPositions(window, function(reports) {
			for(var i = 0; i < reports.length; i++)
			{
				reports[i].date = new Date(reports[i].position.timestamp);
			}
			$scope.reports = reports;
		});
	});
	
	$scope.reports = [];
	
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
	
	$scope.elementClicked = function(report) {
		//alert(report.date);
		DataShareService.setItem("selectedReport", report);
		$state.go("browse-reports-view");
 	};
	
	$scope.deleteClicked = function() {
		// Delete the database
		DbService.deleteDatabase(window);
		
		// Recreate the database
		DbService.createTables(window);
	};
});