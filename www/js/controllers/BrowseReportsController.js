// BrowseReportsController.js
 
 // Add controller to the ace.controllers module
angular.module('ace.controllers')

// BrowseReportsController.js
//-----------------------------------------------------------------------------------------------
 
// AngularJS Controller for the settings view
// This view displays a list of all reports that have been submitted by the current user
.controller('BrowseReportsController', function($scope, $ionicListDelegate, $ionicLoading, SettingsService, $ionicSideMenuDelegate, GeoService, $ionicHistory, $state, DataService, LocalStorageService, DataShareService) {
	// Array to hold all reports (and to be accessed from the view via Angular)
	$scope.reports = [];
	  
	// Ensure that the reports info is correct when the view is FIRST displayed.
	$scope.$on('$ionicView.beforeEnter', function() {
		// Set up reports item
		$scope.refresh();

	});

	// Adding beforeEnter event listener.  This function will be called just before every view load,
	// regardless of controller and state caching.
	$scope.$on('$ionicView.enter', function() {
		// Enable dragging of the side menu
		$ionicSideMenuDelegate.canDragContent(false);
	});
	
	// Function called from pull to refresh
	$scope.doRefresh = function() {
		// Refresh the current list from the local storage set
		$scope.refresh();
	};
	
	// Refresh the currently displayed list from the local storage set
	$scope.refresh = function() {
		// Request the list of all reports for the current user from the local data storage set
		DataService.localWeatherReport_find({where: {userId: LocalStorageService.getItem("currentUser", {}, window).id}}, function(err, res) {
			// Get the associated positions
			var reportArray = res;
			var positionIdArray = [];
			for(var i = 0; i < res.length; i++)
			{
			   positionIdArray.push(res[i].positionId);
			}
			
			// Get all locations associated with the reports (to access the timestamp objects contained in them)
			DataService.localPosition_find({where: {id: {inq: positionIdArray}}}, function(err, res2) {
				// Store the positions by their id's (for faster retrieval later)
				var positionMap = {};
				for(var i = 0; i < res2.length; i++)
				{
					positionMap[res2[i].id] = res2[i];
				} 
				
				// Add the timestamp into each report object (to be displayed on the list)
				for(var i = 0; i < reportArray.length; i++)
				{
					reportArray[i].date = positionMap[reportArray[i].positionId].timestamp;
					var reportDate = reportArray[i].date;
					
					// Save string with correct formatting
					if(reportDate.getHours() < 10)
					{
						if(reportDate.getMinutes() < 10)
						{
							reportArray[i].dateString = "Report timestamp: 0" + reportDate.getHours() + ":0" + reportDate.getMinutes() + " " 
								+ (reportDate.getMonth() + 1) + "/" + reportDate.getDate() + "/" + reportDate.getFullYear();
						}
						else
						{
							reportArray[i].dateString = "Report timestamp: 0" + reportDate.getHours() + ":" + reportDate.getMinutes() + " " 
								+ (reportDate.getMonth() + 1) + "/" + reportDate.getDate() + "/" + reportDate.getFullYear();
						}
					}
					else
					{
						reportArray[i].dateString = "Report timestamp: " + reportDate.getHours() + ":" + reportDate.getMinutes() + " " 
							+ (reportDate.getMonth() + 1) + "/" + reportDate.getDate() + "/" + reportDate.getFullYear();
					}
				}
				
				// Update the view
				$scope.$apply(function() {
					$scope.reports = reportArray;
					
					// Turn off the spinning refresh notification
					$scope.$broadcast('scroll.refreshComplete');	
				});		
			});
		});
	};
	
	// Custom back navigation function for this view.  The BrowseReports view will always be displayed from the
	// tab.report state, so always navigate back to it
	$scope.goBack = function() {
		// ALWAYS go back to the report tab
		$state.go('tab.report');
	};
	
	// Click handler for selecting a report to view the details of.  Pass the selected report to the DataShareService
	// (which will make it available to the "view report" view in ViewReportController.js)
	$scope.elementClicked = function(report) {
		// Save item to be accessed in next view
		DataShareService.setItem("selectedReport", report);
		
		// Go to the browse-reports-view state
		$state.go("browse-reports-view");
 	};
	 
	 // Edit option button clicked (accessed via sliding the report to the left)
	 $scope.editClicked = function(report)
	 {
		 // Close the opened option button
		 $ionicListDelegate.closeOptionButtons();
		 
		 // Copy the report, removing date, positionId, and id fields
		 var reportCpy = JSON.parse(JSON.stringify(report));
		 delete reportCpy.date;
		 delete reportCpy.positionId;
		 //delete reportCpy.id;
		 
		 // Save the report to be accessed by the report view
		 DataShareService.setItem("edit", reportCpy);
		 
		 // Navigate to the tab.report state
		 $state.go("tab.report");
	 }
	 
	 // Template option button clicked (accessed via sliding the report to the left)
	 $scope.templateClicked = function(report)
	 {
		 // Close the opened option button
		 $ionicListDelegate.closeOptionButtons();
		 
		 // Copy the report, removing date, positionId, and id fields
		 var reportCpy = JSON.parse(JSON.stringify(report));
		 delete reportCpy.date;
		 delete reportCpy.positionId;
		 delete reportCpy.id;
		 
		 // Save the report to be accessed by the report view
		 DataShareService.setItem("template", reportCpy);
		 
		 // Navigate to the tab.report state
		 $state.go("tab.report");
	 }
	 
	 // Report resend button clicked (accessed via sliding the report to the left)
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