// MapController.js

/**
 * @module starter.controllers
 */
angular.module('starter.controllers')

// MapController
//--------------------------------------------------------------


// MapController (controller for the Map tab)
/**
 * @class MapController
 */
.controller('MapController', function($scope, $ionicSideMenuDelegate) {
    
    // Adding beforeEnter event listener.  This function will be called just before every view load,
	// regardless of controller and state caching.
	$scope.$on('$ionicView.enter', function() {
		$ionicSideMenuDelegate.canDragContent(false);
	});
    
    var myLatlng = new google.maps.LatLng(37.3000, -120.4833);

    var mapOptions = {
        center: myLatlng,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

    navigator.geolocation.getCurrentPosition(function(pos) {
        map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        var myLocation = new google.maps.Marker({
            position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
            map: map,
            title: "My Location"
        });
    });

    $scope.map = map;
});
