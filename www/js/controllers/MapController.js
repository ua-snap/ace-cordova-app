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
.controller('MapController', function($scope, $ionicSideMenuDelegate, $ionicPopover) {
    // Set up menu options popover
    // Create popover from template and save to $scope variable
      $ionicPopover.fromTemplateUrl('templates/popovers/map-options.html', {
        scope: $scope
      }).then(function(popover) {
        $scope.optionsPopover = popover;
      });
      
      $scope.openOptionsMenu = function($event) {
          $scope.optionsPopover.show($event);
      };
    
    // Controller-wide variables
    $scope.map = null;
    
    // Stores the last 100 location pings
    $scope.locationHistory = [];
    
    // Last known position will be persisted in LocalStorage
    var localHandler = new LocalStorageUtil(window);
    
    // If set to true, next watchPosition execution will center the map on the current location.
    // If false, watchPosition will not modify the map center
    $scope.centerMap = true;
    
    var timer = null;
    
    var currentLocationMarker;
    
    // Adding beforeEnter event listener.  This function will be called just before every view load,
	// regardless of controller and state caching.
	$scope.$on('$ionicView.enter', function() {
		$ionicSideMenuDelegate.canDragContent(false);
        
        initialize();
	});
    
    $scope.$on('$ionicView.leave', function() {
        currentLocationMarker = null;
    });
    
    
    var initialize = function()
    {
        // default latitude and longitude
        var lastPosition = localHandler.get("lastPosition", null);
        var myLatlng = new google.maps.LatLng(37.3000, -120.4833);
        if(lastPosition)
        {
            myLatlng = new google.maps.LatLng(lastPosition.coords.latitude, lastPosition.coords.longitude);
        }
        
    
        // Set up map options
        var mapOptions = {
            center: myLatlng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scaleControl: true,
            panControl: false
        };
    
        // Create and save map
        var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
        $scope.map = map;
        
        // Get current position and update map once position is recieved
        navigator.geolocation.watchPosition(function(pos) {
            
            var position = new Position();
            position.importGoogleGeoLoc(pos);
            
            // Save the last position to local storage
            localHandler.set("lastPosition", position);
            
            if(!currentLocationMarker)
            {
                currentLocationMarker = new google.maps.Marker({
                    position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                    map: $scope.map,
                    title: "current_pos"
                });
            }
            else
            {
                currentLocationMarker.setPosition(pos);    
            }        
            
        }, function(error) {
            alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
        }, {timeout: 10000, enableHighAccuracy: true}); 
    };  
    
    
    $scope.centerOnLocation = function() {
        var lastPos = localHandler.get("lastPosition", null);
        if(lastPos)
        {
            $scope.map.setCenter(new google.maps.LatLng(lastPos.coords.latitude, lastPos.coords.longitude));
        }
    }; 
    
    $scope.trackLocation = function() {
        document.getElementById("trackPosButton").style.backgroundColor = "#0c63eea";
    };
});
