// GolfReportsController.js

 // Add controller to the ace.controllers module
angular.module('ace.controllers')

// GolfReportsController.js
//-----------------------------------------------------------------------------------------------

// AngularJS Controller for the GolfReports view
// This view displays a list of all golf reports
.controller('GolfReportsController', function($state, $scope, $ionicSideMenuDelegate, DataService, LocalStorageService) {
	// Array to hold all reports (and to be accessed from the view via Angular)
	$scope.golf_reports = [];

	// Ensure that the golf reports info is correct when the view is first displayed.
	$scope.$on('$ionicView.beforeEnter', function() {
		DataService.localGolfReport_find({where: {userId: LocalStorageService.getItem("currentUser", {}, window).id}}, function(err, reports) {
			$scope.$apply(function() {
				$scope.golf_reports = reports;
			});
		});
	});

	// Adding enter event listener.  This function will be called after every view load,
	// regardless of controller and state caching.
	$scope.$on('$ionicView.enter', function() {
		// Enable dragging of the side menu
		$ionicSideMenuDelegate.canDragContent(true);
	});

	// Back button click handler
	$scope.goBack = function() {
		$state.go("tab.report")
	};

});
