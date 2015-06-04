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
    
    // default latitude and longitude
    var myLatlng = new google.maps.LatLng(37.3000, -120.4833);

    // Set up map options
    var mapOptions = {
        center: myLatlng,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    // Create map
    var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    
    // Get current position and update map once position is recieved
    navigator.geolocation.getCurrentPosition(function(pos) {
        map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        var myLocation = new google.maps.Marker({
            position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
            map: map,
            title: "My Location"
        });
    });

    // Save the map for later access
    $scope.map = map;
});
