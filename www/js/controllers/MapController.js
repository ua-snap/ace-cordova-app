// MapController.js

// Add to ace.controllers module
angular.module('ace.controllers')
 
// MapController
//--------------------------------------------------------------
 
 
// MapController is the controller for the map tab.  It handles all view-related tasks for the map view.
.controller('MapController', function($scope, $state, $ionicSideMenuDelegate, DataService, LocalStorageService, $translate, $ionicNavBarDelegate, $ionicPopover, GeoService, SettingsService) {
    // Set up menu options popover
    // Create popover from template and save to $scope variable
    $ionicPopover.fromTemplateUrl('templates/popovers/map-options.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.optionsPopover = popover;
    });
    
    // Click handler to open the map options popover
    $scope.openOptionsMenu = function($event) {
        $scope.optionsPopover.show($event);
    };
    
    // Controller-wide map variable
    $scope.map = null;
    
    // Last known position will be persisted in LocalStorage

    
    // If set to true, next watchPosition execution will center the map on the current location.
    // If false, watchPosition will not modify the map center
    $scope.centerMap = true;
    
    // Array maintains a reference to all report markers displayed on the map (to allow for deletion)
    $scope.reportMarkers = [];
    
    // Array maintains references to all user markers (for later deletion)
    $scope.otherUserMarkers = [];
    
    // Maintains a reference to the current location marker on the map
    $scope.currentLocationMarker = null;
    
    // Reference to the google maps polyline that displays a users recent positions
    var historyLine = null;
    
    // Get a date-time representing the last midnight time that occured (to be used in retrieving positions for the
    // history line)
    var lastMidnight = new Date();
    lastMidnight.setHours(0, 0, 0, 0);
    
    // Get the next midnight for the same reason (as lastMidnight above)
    var nextMidnight = new Date();
    nextMidnight.setHours(24, 0, 0, 0);
    
    // Initial settings defined here
    $scope.settings = {
      displayPos: {
          checked: true
      },  
      followPos: false,
      displayHistory: {
          checked: false,
          startDate: lastMidnight,
          endDate: nextMidnight
      },
      displayReports: {
          checked: false
      }
    };
    
    // Variable maintains some information about the state of the user-controls on and around the map
    $scope.mapState = {
        center: null,
        zoom: null,
        typeStr: "",
        displayHistory: false,
        displayReports: false,
        displayMarker: true,
        followPos: false
    };
    
    // Adding enter event listener.  This function will be called just before every view load,
	// regardless of controller and state caching.
	$scope.$on('$ionicView.enter', function() { 
        
        // Disable left swipe menu
		$ionicSideMenuDelegate.canDragContent(false);
        
        // Re-translate the title (to ensure that it is correctly translated)
        $translate(['MAP']).then(function(translations) {
           $ionicNavBarDelegate.title(translations.WEATHER); 
        });
        
        // Initialize the map
        initialize();
	});    
    
    // Lifecycle event handler, saves the map state on exit
    $scope.$on('$ionicView.leave', function() {
        // Save the state of the map
        $scope.saveMapState();
        
        // Disable the position update function (if necessary)
        if($scope.positionUpdateInterval !== undefined)
        {
            window.clearInterval($scope.positionUpdateInterval);
        }
    });
    
    // Save the state of the map (usually prior to view exit)
    $scope.saveMapState = function() {
        // Save map options
        $scope.mapState.center = $scope.map.getCenter();
        $scope.mapState.zoom = $scope.map.getZoom();
        $scope.mapState.typeStr = $scope.map.getMapTypeId();
        $scope.mapState.displayHistory = $scope.settings.displayHistory.checked;
        $scope.mapState.displayReports = $scope.settings.displayReports.checked;
        $scope.mapState.followPos = $scope.settings.followPos;
        
        // Save center to local storage
        var position = new Position();
        
        GeoService.getCurrentPosition(navigator.geolocation, function(pos) {
            // Convert navigator returned geolocation to a Position object
            position.importNavigatorPosition(pos);
            
            // Update the lastPosition variable
            var localHandler = new LocalStorageUtil(window);
            localHandler.set("lastPosition", position);
        });
    };
    
    // Regester an event handler for syncing (map will need to update other user's positions after a sync)
    document.addEventListener('sync_complete', function(e) {
        if($state.current.name === "tab.map")
        {
            // Refresh the map view
            $scope.displayHistoryChanged();
            $scope.displayReportsChanged();
            $scope.displayOtherUsersChanged();
        }        
    }, false);
    
    // Function handles initialization tasks
    var initialize = function()
    {
        // Clear out any persisting currentLocationMarker
        $scope.currentLocationMarker = null;
        
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
        
        // Start watching position
        //GeoService.setWatchCallback(updateMarker);
        
        // Check if history was displayed
        if($scope.mapState.displayHistory !== null)
        {
            $scope.settings.displayHistory.checked = $scope.mapState.displayHistory;
            $scope.displayHistoryChanged();
        }        
        
        // Check for reports
        if($scope.mapState.displayReports !== null)
        {
            $scope.settings.displayReports.checked = $scope.mapState.displayReports;
            $scope.displayReportsChanged();
        } 
        
        // Always display marker
        $scope.settings.displayPos.checked = true;
        $scope.displayPosChanged();
        
        // Set follow position appropriately
        $scope.settings.followPos = $scope.mapState.followPos;
        
        // toggle setting
        if($scope.settings.followPos)
        {
            document.getElementById("followBtn").style.color = "#66cc33";            
        }
        else 
        {
            document.getElementById("followBtn").style.color = "";
        }
        // set in service
        GeoService.setFollowPosition($scope.settings.followPos);
        
    };
    
    // Update the current location marker position
    var updateMarker = function(pos, follow) {
        if($scope.currentLocationMarker)
        {
            var latlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
            $scope.currentLocationMarker.setPosition(latlng);
            if(follow)
            {
                $scope.map.setCenter(latlng);
            }
        }
        else 
        {
            var latlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
            
            $scope.currentLocationMarker = new google.maps.Marker({
                    position: latlng,
                    map: $scope.map,
                    title: "current_pos",
            });
            $scope.map.setCenter(latlng);
        }
    };
    
    // Toggle handler for the display position setting
    $scope.displayPosChanged = function() {
        if($scope.settings.displayPos.checked)
        {   
            // Instead of adding a callback to the GeoService.watchPosition functionality, add a timer that updates 
            // the marker (will be much less cpu intensive, trying to fix map lockup bug)
            $scope.positionUpdateInterval = window.setInterval(function() {
                GeoService.getCurrentPosition(navigator.geolocation, function(position) {
                    if(position)
                    {
                        updateMarker(position, $scope.settings.followPos);
                    }
                }, function(error) {
                    // Do nothing on error
                });
            }, 500);
        } 
        else 
        {
            // Remove the current location marker and clear the reference
            $scope.currentLocationMarker.setMap(null);
            $scope.currentLocationMarker = null;
            
            // Clear the callback function (that updates the marker)
            //GeoService.setWatchCallback(null);
            window.clearInterval($scope.positionUpdateInterval);
            
            // Make sure follow position setting is false
            if($scope.settings.followPos)
            {
                $scope.toggleFollowPosition();
            }          
        }
    };
    
    // Setting toggle handler for the display location history option
    $scope.displayHistoryChanged = function() {
      if($scope.settings.displayHistory.checked)
      {
          // If an old history line exists, remove it before redrawing
          if(historyLine)
          {
              // Remove tracking callback (positions will still be recorded)
              GeoService.setTrackingCallback(null);
                
              // remove the history line
              historyLine.setMap(null);  
              
              historyLine = null;
          }
          
          // Draw the history line
          $scope.drawHistoryLine();
          
          // Set up the report callback to include drawing the polyline
          GeoService.setTrackingCallback($scope.historyLineAddPoint);
      }  
      else
      {
          if(historyLine)
          {
              // Remove tracking callback (positions will still be recorded)
              GeoService.setTrackingCallback(null);
                
              // remove the history line
              historyLine.setMap(null);  
              
              historyLine = null;  
          }          
      }
    };
    
    // Helper function creates an html string to display report contents in an info window popup
    $scope.makeInfoWindowString = function(report) {        
        // Grab the date
        var date = new Date(report.position.timestamp);
        
        // Variable to use in displaying pressureUnits
        var pressureUnits = "";
        if(report.pressureValue && report.pressureValue !== "")
        {
            pressureUnits = " hPa";
        }
        
        var htmlString = '<div id="content"><div id="siteNotice"></div>' + 
            '<h5 id="firstHeading" class="firstHeading">' + date + '</h5>' + '<div id="bodyContent">' + 
            '<p>Cloud Cover: ' + report.cloudCover + '<br>' +
            'Precipitation: ' + report.precipitation + '<br>' +
            'Visibility: ' + report.visibility + '<br>' +
            'Pressure Trend: ' + report.pressureTendency + '<br>' +
            'Surface Pressure: ' + report.pressureValue + " " + pressureUnits + '<br>' +
            'Surface Temperature: ' + report.temperatureValue + " " + report.temperatureUnits + '<br>' +
            'Wind Speed: ' + report.windValue + " " + report.windUnits + '<br>' +
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
           DataService.localWeatherReport_find({where: {userId: LocalStorageService.getItem("currentUser", {}, window).id}}, function(err, res) {
               // Get the associated positions
               var reportArray = res;
               var positionIdArray = [];
               for(var i = 0; i < res.length; i++)
               {
                   positionIdArray.push(res[i].positionId);
               }        
               
               // Grab associated positions         
               DataService.localPosition_find({where: {id: {inq: positionIdArray}}}, function(err, res2) {
                  var positionMap = {};
                  for(var i = 0; i < res2.length; i++)
                  {
                      positionMap[res2[i].id] = res2[i];
                  } 
                  var image = 'img/document-text_small_grn.png';
                  
                  // Create the markers and associated info windows
                  for(var i = 0; i < reportArray.length; i++)
                  {
                      var pos = new google.maps.LatLng(positionMap[reportArray[i].positionId].latlng.lat, positionMap[reportArray[i].positionId].latlng.lng);
                      reportArray[i].position = positionMap[reportArray[i].positionId];
                      var htmlString = self.makeInfoWindowString(reportArray[i]);
                      var infowindow = new google.maps.InfoWindow({
                        content: htmlString
                      });
                      var marker = new google.maps.Marker({
                         position: pos,
                         map: self.map,
                         icon: image,
                         title: 'report_marker',
                         infoWindow: infowindow
                      });
                      self.reportMarkers.push(marker);
                                         
                      google.maps.event.addListener(marker, 'click', function() {
                        this.infoWindow.open(this.getMap(), this);                         
                      });
                  } 
                  
               });
               
           });
       }
       else
       {
           // remove all reports from the map
           for(var i = 0; i < $scope.reportMarkers.length; i++)
           {
               $scope.reportMarkers[i].setMap(null);
           }
           $scope.reportMarkers = [];
       }
    };
    
    // Add one point to the history line
    $scope.historyLineAddPoint = function(pos) {
        var latlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        if(historyLine)
        {
            var path = historyLine.getPath();
            path.push(latlng);    
        }        
    };
    
    // Toggle setting handler for the display other users option
    $scope.displayOtherUsersChanged = function() {
        if($scope.settings.displayOtherUsers.checked === true)
        {
            // Add other position markers
            $scope.displayOtherUserPositions();
        }  
        else
        {
            // Remove other users markers
            for(var i = 0; i < $scope.otherUserMarkers.length; i++)
            {
                $scope.otherUserMarkers[i].setMap(null);
            }
            $scope.otherUserMarkers = [];
        }
    };
    
    // Display the most recent position of all other users
    $scope.displayOtherUserPositions = function() {
        var filter = {
            where: {
                groupId: LocalStorageService.getItem("currentUser", {}, window).groupId
            }
        };
        DataService.localMobileUser_find(filter, function(err, res) {
            // Res contains an array of all users in the current group
            var users = res;
            
            // Get the latest position from all users in the current user's group
            for(var i = 0; i < users.length; i++)
            {                
                var filter = {
                    where: {and: [
                        {userId: users[i].id},
                        {timestamp: {gt: $scope.settings.displayHistory.startDate}},
                        {timestamp: {lt: $scope.settings.displayHistory.endDate}}
                        ]},
                    limit: 1,
                    order: 'timestamp DESC'
                };
            
                DataService.localPosition_find(filter, function(err, res2) {
                    // Res2 contains at most 1 position (limit: 1 in filter)
                    if(res2.length > 0)
                    {
                        if(res2[0].userId !== LocalStorageService.getItem("currentUser", {}, window).id)
                        {
                            var latlng = new google.maps.LatLng(res2[0].latlng.lat, res2[0].latlng.lng);
                            var marker = new google.maps.Marker({
                                    position: latlng,
                                    map: $scope.map,
                                    title: "current_pos",
                                    icon: 'img/ic_person_pin_red_18dp_2x.png'
                            });
                            $scope.otherUserMarkers.push(marker);
                        } 
                    }                                       
                });
            }           
        });
    };
    
    // Draws a line on the map where the user has traveled
    $scope.drawHistoryLine = function() {
        // Grab last position entries from current user within selected date range
        var settings = SettingsService.getSettings(window);
        var filter = {
            order: 'timestamp DESC',
            where: {
                and: [
                    {timestamp: {gt: $scope.settings.displayHistory.startDate}},
                    {timestamp: {lt: $scope.settings.displayHistory.endDate}},
                    {userId: LocalStorageService.getItem("currentUser", {}, window).id}
                ]
            }
        };
        DataService.localPosition_find(filter, function(err, res) {
            // Draw the line
            var latLngArray = [];
            for(var i = 0; i < res.length; i++)
            {
                latLngArray.push(new google.maps.LatLng(res[i].latlng.lat, res[i].latlng.lng));
            }
            historyLine = new google.maps.Polyline({
                path: latLngArray.reverse(),
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2                
            });
            historyLine.setMap($scope.map);
        });
    };
    
    // Click handler for the target icon button.  Centers the map on the users position
    $scope.centerOnPosition = function() {
        GeoService.getCurrentPosition(navigator.geolocation, function(pos) {
            var latlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
            $scope.map.setCenter(latlng);
        });        
    };
    
    // Toggle/check handler for following user position (arrow at top of page)
    $scope.toggleFollowPosition = function() {
        // toggle setting
        if($scope.settings.followPos)
        {
            // Turn off following position
            $scope.settings.followPos = false;
            document.getElementById("followBtn").style.color = "";
        }
        else 
        {
            // Turn on following position (and change button to green)
            $scope.settings.followPos = true;
            document.getElementById("followBtn").style.color = "#66cc33";
        }
        // set in service
        GeoService.setFollowPosition($scope.settings.followPos);
    };
});