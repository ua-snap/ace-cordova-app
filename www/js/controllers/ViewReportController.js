angular.module('starter.controllers')

.controller('ViewReportController', function($ionicSideMenuDelegate, $scope, $state, DataShareService) {
	$scope.report = null;
	
	// Adding beforeEnter event listener.  This function will be called just before every view load,
	// regardless of controller and state caching.
	$scope.$on('$ionicView.enter', function() {
		// Enable dragging of the side menu
		$ionicSideMenuDelegate.canDragContent(false);
	});
	
	$scope.$on('$ionicView.beforeEnter', function() {
		$scope.report = DataShareService.getItem("selectedReport", null);
		
		
		// Fill in view
		$scope.fillFromReport($scope.report);
	});
	
	// Fill in template
	$scope.useTemplateClicked = function() {
		DataShareService.setItem("template", $scope.report);
		$state.go("tab.report");
	};
	
	$scope.fillFromReport = function(report) {
		// Fill in each report element
	    var clouds = document.getElementById("sumcat1");
	    clouds.innerText = "Cloud Cover: " + report.cloudCover;
	    
	    var precip = document.getElementById("sumcat2");
	    precip.innerText = "Precipitation: " + report.precipitation;
	    
	    var vis = document.getElementById("sumcat3");
	    vis.innerText = "Visibility: " + report.visibility;
	    
	    var pressTrend = document.getElementById("sumcat4_1");
	    pressTrend.innerText = "Pressure Trend: " + report.pressureTendency;
	    
	    var pressVal = document.getElementById("sumcat4_2");
	    pressVal.innerText = "Surface Pressure: " + report.pressureValue + " hPa";
	    
	    var temp = document.getElementById("sumcat5");
	    temp.innerText = "Surface Temperature: " + report.temperatureValue + " " + $scope.report.temperatureUnits;
	    
	    var wind = document.getElementById("sumcat6");
	    wind.innerText = "Wind Speed: " + report.windValue + " " + $scope.report.windUnits;
	    
	    var windDir = document.getElementById("sumcat6_3");
	    windDir.innerText = "Wind Direction: " + report.windDirection;
	    
	    var other = document.getElementById("sumcat9");
	    other.innerText = "Other: " + report.other;
	    
	    var notes = document.getElementById("sumcat7");
	    notes.innerText = "Notes:\n" + report.notes;
	    
	    var pic = document.getElementById("sumcat8");
	};
});