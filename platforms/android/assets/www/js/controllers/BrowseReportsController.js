// SettingsDbController.js

/**
 * @module ace.controllers
 */
 
 // SettingsDbController.js
 //-----------------------------------------------------------------------------------------------
 
 // Controller for the settings view
 /**
  * @class SettingsDbController
  */
angular.module('ace.controllers')

.controller('BrowseReportsController', function($scope, $ionicSideMenuDelegate, $ionicHistory, $state, DataService, LocalStorageService, DbService, DataShareService) {
  
  // Adding beforeEnter event listener.  This function will be called just before every view load,
	// regardless of controller and state caching.
	$scope.$on('$ionicView.enter', function() {
		// Enable dragging of the side menu
		$ionicSideMenuDelegate.canDragContent(false);
	});
	
	// Ensure that the reports info is correct when the view is FIRST displayed.
	$scope.$on('$ionicView.beforeEnter', function() {
		// Set up reports item
		/*DbService.getReportsAndPositions(window, function(reports) {
			for(var i = 0; i < reports.length; i++)
			{
				reports[i].date = new Date(reports[i].position.timestamp);
			}
			$scope.reports = reports;
		});*/
		DataService.localWeatherReport_find({where: {userId: LocalStorageService.getItem("currentUser", {}, window).id}}, function(err, res) {
			// Get the associated positions
			var reportArray = res;
			var positionIdArray = [];
			for(var i = 0; i < res.length; i++)
			{
			   positionIdArray.push(res[i].positionId);
			}
			DataService.localPosition_find({where: {id: {inq: positionIdArray}}}, function(err, res2) {
				var positionMap = {};
				for(var i = 0; i < res2.length; i++)
				{
					positionMap[res2[i].id] = res2[i];
				} 
				for(var i = 0; i < reportArray.length; i++)
				{
					reportArray[i].date = positionMap[reportArray[i].positionId].timestamp;
				}
				$scope.reports = reportArray;				
			});
		})
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
		var previousState = LocalStorageService.getItem('previousState', null, window);
		
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
});