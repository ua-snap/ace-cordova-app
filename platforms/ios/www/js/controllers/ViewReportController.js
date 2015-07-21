angular.module('ace.controllers')

.controller('ViewReportController', function($ionicSideMenuDelegate, $scope, $state, $translate, DataShareService) {
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
	
	// Fill in template (Disabled currently)
	$scope.useTemplateClicked = function() {
		//DataShareService.setItem("template", $scope.report);
		$state.go("tab.report");
		alert("Not yet implemented.");
	};
	
	$scope.fillFromReport = function(report) {
		var translationsArray = [
	        'CLOUD_COVER',
	        'PRECIPITATION',
	        'VISIBILITY',
	        'PRESSURE_TENDENCY',
	        'SURFACE_PRESSURE',
	        'TEMPERATURE',
	        'WIND_SPEED',
	        'WIND_DIRECTION',
	        'OTHER',
	        'NOTES'
	    ];
	    
	    $translate(translationsArray).then(function(translations) {
	        // Fill in each report element
	        var clouds = document.getElementById("sumcat1");
	        clouds.innerText = translations.CLOUD_COVER + ": " + report.cloudCover;
	        
	        var precip = document.getElementById("sumcat2");
	        precip.innerText = translations.PRECIPITATION + ": " + report.precipitation;
	        
	        var vis = document.getElementById("sumcat3");
	        vis.innerText = translations.VISIBILITY + ": " + report.visibility;
	        
	        var pressTrend = document.getElementById("sumcat4_1");
	        pressTrend.innerText = translations.PRESSURE_TENDENCY + ": " + report.pressureTendency;
	        
	        var pressVal = document.getElementById("sumcat4_2");
	        pressVal.innerText = translations.SURFACE_PRESSURE + ": " + report.pressureValue + " hPa";
	        
	        var temp = document.getElementById("sumcat5");
	        temp.innerText = translations.TEMPERATURE + ": " + report.temperatureValue + " " + $scope.report.temperatureUnits;
	        
	        var wind = document.getElementById("sumcat6");
	        wind.innerText = translations.WIND_SPEED + ": " + report.windValue + " " + $scope.report.windUnits;
	        
	        var windDir = document.getElementById("sumcat6_3");
	        windDir.innerText = translations.WIND_DIRECTION + ": " + report.windDirection;
	        
	        var other = document.getElementById("sumcat9");
	        other.innerText = translations.OTHER + ": " + report.other;
	        
	        var notes = document.getElementById("sumcat7");
	        notes.innerText = translations.NOTES + ":\n" + report.notes;
	        
	        var pic = document.getElementById("sumcat8");
	    });
	};
});