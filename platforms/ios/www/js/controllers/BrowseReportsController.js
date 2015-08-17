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

.controller('BrowseReportsController', function($scope, $ionicListDelegate, $ionicLoading, SettingsService, $ionicSideMenuDelegate, GeoService, $ionicHistory, $state, DataService, LocalStorageService, DbService, DataShareService) {
  
  // Adding beforeEnter event listener.  This function will be called just before every view load,
	// regardless of controller and state caching.
	$scope.$on('$ionicView.enter', function() {
		// Enable dragging of the side menu
		$ionicSideMenuDelegate.canDragContent(false);
	});
	
	// Function called from pull to refresh
	$scope.doRefresh = function() {
		$scope.refresh();
	};
	
	$scope.refresh = function() {
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
				$scope.$apply(function() {
					$scope.reports = reportArray;
					$scope.$broadcast('scroll.refreshComplete');	
				});		
			});
		});
	};
	
	// Ensure that the reports info is correct when the view is FIRST displayed.
	$scope.$on('$ionicView.beforeEnter', function() {
		// Set up reports item
		$scope.refresh();

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
	 
	 $scope.resendClicked = function(report) {
		// Close the opened option button
		$ionicListDelegate.closeOptionButtons();
		 
		// Get report info
		var newReport = JSON.parse(JSON.stringify(report));
		
		// Remove position, temporary date info, and id
		delete newReport.positionId;
		delete newReport.date;
		delete newReport.id;
		
		// Create a new position
		GeoService.getCurrentPosition(navigator.geolocation, function(pos) {
			// Create new position object
			var localPos = {
	            userId: LocalStorageService.getItem("currentUser", {}, window).id,
	            latlng: {
	                lat: pos.coords.latitude,
	                lng: pos.coords.longitude,
	            },
	            timestamp: new Date(pos.timestamp),
	            accuracy: pos.coords.accuracy,
	            altitude: pos.coords.altitude,
	            altitudeAccuracy: pos.coords.altitudeAccuracy,
	            heading: pos.coords.heading,
	            speed: pos.coords.speed
	        };
			DataService.localPosition_create(localPos, function(err, res) {
				// Add new position data to report
	            var position = res;
	            newReport.positionId = position.id;
				
				// Create weather report
            	DataService.localWeatherReport_create(newReport, function(err, res) {
					// No need to deal with attachments (they will be left the same)
					
					// Attempt a sync
					var settings = SettingsService.getSettings(window);
                    DataService.sync(function(model) {
                        if(model === "report")
                        {
							// Notify user
                            $ionicLoading.show({template: 'Report Sent Successfully', noBackdrop: true, duration: 1500});
							
							// Refresh the view
							$scope.refresh();
                        }
                    }, settings.general.notifications);
				});
			});
			
		});
	 };
});