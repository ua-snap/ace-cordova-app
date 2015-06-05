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
        
        initialize();
	});
    
    var initialize = function()
    {
        // default latitude and longitude
        var myLatlng = new google.maps.LatLng(37.3000, -120.4833);
    
        // Set up map options
        var mapOptions = {
            center: myLatlng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scaleControl: true,
            panControl: false
        };
    
        // Create map
        var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
        
        // Get current position and update map once position is recieved
        navigator.geolocation.watchPosition(function(pos) {
            map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            var myLocation = new google.maps.Marker({
                position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                map: map,
                title: "My Location",
            });
        }, function(error) {
            alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
        }, {timeout: 10000, enableHighAccuracy: true});
        
         $scope.map = map;
    };   
    
   

});
