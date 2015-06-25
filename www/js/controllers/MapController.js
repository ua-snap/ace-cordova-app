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
.controller('MapController', function($scope, $ionicSideMenuDelegate, $ionicPopover, GeoService) {
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
    
    var currentLocationMarker = null;
    
    $scope.curPos = null;
    
    $scope.settings = {
      displayPos: {
          checked: true
      },  
      followPos: false,
      displayHistory: {
          checked: false
      },
      reportFrequency: 1 
    };
    
    $scope.mapState = {
        center: null,
        zoom: null,
        typeStr: "",
    };
    
    // Adding beforeEnter event listener.  This function will be called just before every view load,
	// regardless of controller and state caching.
	$scope.$on('$ionicView.enter', function() {
		$ionicSideMenuDelegate.canDragContent(false);
        initialize();
	});    
    
    $scope.$on('$ionicView.leave', function() {
        $scope.saveMapState();
    });
    
    $scope.saveMapState = function() {
        // Save map options
        $scope.mapState.center = $scope.map.getCenter();
        $scope.mapState.zoom = $scope.map.getZoom();
        $scope.mapState.typeStr = $scope.map.getMapTypeId();
        
        // Save center to local storage
        var position = new Position();
        position.importGoogleGeoLoc(GeoService.getCurrentPosition());
        localHandler.set("lastPosition", position);
    };
    
    var initialize = function()
    {
        currentLocationMarker = null;
        
        // Check for last saved map settings
        var mapOptions;
        if($scope.mapState.center)
        {
            mapOptions = {
                center: $scope.mapState.center,
                zoom: $scope.mapState.zoom,
                mapTypeId: $scope.mapState.typeStr,
                scaleControl: true,
                panControl: false
            };
        }
        else
        {
            // Check for saved position
            var localHandler = new LocalStorageUtil(window);
            var lastPos = localHandler.get("lastPosition", null);
            
            var latLng;
            if(lastPos)
            {
                latLng = new google.maps.LatLng(lastPos.coords.latitude, lastPos.coords.longitude);
            }
            else
            {
                // Default starting position
                latLng = new google.maps.LatLng(37.3000, -120.4833);
            }
            
            // Set up map options
            var mapOptions = {
                center: latLng,
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                scaleControl: true,
                panControl: false
            };
        }      
    
        // Create and save map
        var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
        $scope.map = map;
        
        GeoService.enableWatchPosition(navigator.geolocation, updateMarker);
        
    };
    
    var updateMarker = function(pos, follow) {
        if(currentLocationMarker)
        {
            currentLocationMarker.setPosition(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            if(follow)
            {
                var latlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
                $scope.map.setCenter(latlng);
            }
        }
        else 
        {
            var latlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
            currentLocationMarker = new google.maps.Marker({
                    position: latlng,
                    map: $scope.map,
                    title: "current_pos"
            });
            $scope.map.setCenter(latlng);
        }
    };
    
    $scope.displayPosChanged = function() {
      //alert($scope.settings.displayPos.checked); 
      if($scope.settings.displayPos.checked)
      {
          GeoService.setWatchCallback(updateMarker);
      } 
      else 
      {
          // Remove the current location marker and clear the reference
          currentLocationMarker.setMap(null);
          currentLocationMarker = null;
          
          // Clear the callback function (that updates the marker)
          GeoService.setWatchCallback(null);
          
          // Make sure follow position setting is false
          if($scope.settings.followPos)
          {
              $scope.toggleFollowPosition();
          }          
      }
    };
    
    $scope.centerOnPosition = function() {
        var pos = GeoService.getCurrentPosition();
        var latlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        $scope.map.setCenter(latlng);
    };
    
    $scope.toggleFollowPosition = function() {
        // toggle setting
        if($scope.settings.followPos)
        {
            $scope.settings.followPos = false;
            document.getElementById("followBtn").style.color = "";
        }
        else 
        {
            $scope.settings.followPos = true;
            document.getElementById("followBtn").style.color = "#66cc33";
        }
        // set in service
        GeoService.setFollowPosition($scope.settings.followPos);
    };
});
