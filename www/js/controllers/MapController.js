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
.controller('MapController', function($scope, $ionicSideMenuDelegate, $ionicPopover, GeoService, DbService) {
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
    
    $scope.reportMarkers = [];
    
    var timer = null;
    
    var currentLocationMarker = null;
    var historyLine = null;
    
    $scope.curPos = null;
    
    $scope.settings = {
      displayPos: {
          checked: true
      },  
      followPos: false,
      displayHistory: {
          checked: false
      },
      trackFrequency: 1 ,
      enablePosTracking: {
          checked: false
      },
      displayReports: {
          checked: false
      }
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
                    title: "current_pos",
            });
            $scope.map.setCenter(latlng);
        }
    };
    
    $scope.enablePosTrackingChanged = function() {
        if($scope.settings.enablePosTracking.checked)
        {
            GeoService.enableTracking($scope.settings.trackingFrequency, null);
        }
        else
        {
            GeoService.disableTracking();
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
    
    $scope.displayHistoryChanged = function() {
      if($scope.settings.displayHistory.checked)
      {
          // Draw the history line
          $scope.drawHistoryLine();
          
          // Set up the report callback to include drawing the polyline
          GeoService.setTrackingCallback($scope.historyLineAddPoint);
      }  
      else
      {
          if(historyLine)
          {
            // remove the history line
            historyLine.setMap(null);    
          }          
      }
    };
    
    $scope.makeInfoWindowString = function(report) {        
        // Grab the date
        var date = new Date(report.position.timestamp);
        
        var htmlString = '<div id="content"><div id="siteNotice"></div>' + 
            '<h5 id="firstHeading" class="firstHeading">' + date + '</h5>' + '<div id="bodyContent">' + 
            '<p>Cloud Cover: ' + report.cloudCover + '<br>' +
            'Precipitation: ' + report.precipitation + '<br>' +
            'Visibility: ' + report.visibility + '<br>' +
            'Pressure Trend: ' + report.pressureTrend + '<br>' +
            'Surface Pressure: ' + report.surfacePressure + '<br>' +
            'Surface Temperature: ' + report.surfaceTemperature + '<br>' + 
            'Wind Speed: ' + report.windSpeed + '<br>' +
            'Wind Direction: ' + report.windDirection + '<br>' +
            'Other: ' + report.other + '<br>' + 
            'Notes: ' + report.notes + '<br>' + '</p></div></div>';
            
            return htmlString
    };
    
    // Called when the display reports option is changed
    $scope.displayReportsChanged = function() {
       var self = this;
	   if($scope.settings.displayReports.checked)
       {
           // Show reports on the map
           // Get all reports
           DbService.getReportsAndPositions(window, function(reports) {
              if(reports)
              {
                 var image = 'img/document-text_small_grn.png';
                  for(var i = 0; i < reports.length; i++)
                  {
                      var pos = new google.maps.LatLng(reports[i].position.coords.latitude, reports[i].position.coords.longitude);
                      var marker = new google.maps.Marker({
                         position: pos,
                         map: self.map,
                         icon: image,
                         title: 'report_marker'
                      });
                      self.reportMarkers.push(marker);
                      var htmlString = self.makeInfoWindowString(reports[i]);
                      var infoWindow = new google.maps.InfoWindow({
                        content: htmlString
                      });
                      
                      google.maps.event.addListener(marker, 'click', function() {
                          infoWindow.open(self.map, marker);
                      });
                  } 
              }              
           });
       }
       else
       {
           // remove all reports from the map
           for(var i = 0; i < $scope.reportMarkers.length; i++)
           {
               $scope.reportMarkers[i].setMap(null);
           }
       }
    };
    
    // Add one point to the history line
    $scope.historyLineAddPoint = function(pos) {
        var latlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        var path = historyLine.getPath();
        path.push(latlng);
    };
    
    $scope.drawHistoryLine = function() {
        // Grab last 100 position entries
        var posArr = DbService.getRecentPositionLogs(window, 100, function(res) {
            var latLngArr = DbService.convertPositionArrayToLatLng(res.rows);
            historyLine = new google.maps.Polyline({
                path: latLngArr,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2                
            });
            historyLine.setMap($scope.map);
        });
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