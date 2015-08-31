// AppController.js

// AppController
//--------------------------------------------------------------

/**
 * @module ace.controllers
 */
// Create the ace.controllers angularjs module
angular.module('ace.controllers', [])

// Create the AppController controller
/**
 * @class AppController
 */
.controller('AppController', function($scope, DataService, AuthService, LocalStorageService, $ionicSideMenuDelegate, $state, $http, GeoService) {
  
  // Function toggles sliding the left side-menu out and back in
  /**
   * @method toggleLeft
   * @description Function toggles sliding the left side-menu out and back in
   * @return void
   * @throws none
   */
	$scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
  
  $scope.$on('$ionicView.beforeEnter', function() {
    	$ionicSideMenuDelegate.canDragContent(true);
        
        // Set user name in left side menu
        document.getElementById("username_title").innerText = LocalStorageService.getItem("currentUser", null, window).username;
    });
  
  
  /**
   * Function logs out the current user 
   * 
   * @method logout
   * @description Function logs out the current user by removing them from local storage
   * @return void
   * @throws none
   */
  $scope.logout = function() {
      // Make server logout call
      AuthService.logoutUser(function() {
          // Success      
          // This function was accessed by sliding out the left menu, so close it back up.
        $ionicSideMenuDelegate.toggleLeft();
    
        // Disable dragging the left-menu (since we are about to switch to the login screen)
        $ionicSideMenuDelegate.canDragContent(false);
    
        // Turn off any active position tracking
        GeoService.disableTracking();
        
        // Stop watching position
        GeoService.disableWatchPosition(navigator.geolocation);
        
        // Kick the user back out to the login screen
        $state.go('login');
        
        // Kill the sync thread and stop the sync interval timer
        DataService.terminate();
        window.clearInterval(window.thread_messenger.syncTimer);
        window.thread_messenger = undefined;
        
        // Remove access token id
        LocalStorageService.setItem("access_token", "", window);
        
        // Remove any notifications
        window.plugin.notification.local.cancel(230476843);
      
      }, function(err) {
          // Error (already alerted in AuthService)
          //alert(httpResponse.data);
      });
    };
  
  $scope.testLogin = function() {
    var worker = new Worker("js/sync/SyncWorker.js");
    var setupMessage = {
        accessToken: LocalStorageService.getItem("access_token", "", window),
        currentUser: LocalStorageService.getItem("currentUser", "", window),
        groupUserIds: LocalStorageService.getItem("groupUserIds", [], window),
        req: "setup"
    }
    worker.postMessage(setupMessage);
    worker.postMessage({req: "sync"});
  };
  
  $scope.lastPos = null;
  
  /**
   * Function opens the settings view
   * 
   * @method openSettings
   * @return void
   * @throws none
   */
  $scope.openSettings = function() {    
    // This function was accessed by sliding out the left menu, so close it back up.
    $ionicSideMenuDelegate.toggleLeft();
    
    // Save previous state (tab)
    LocalStorageService.setItem('previousState', $state.current.name, window);
    
    // Perform the navigation using the $state object
    $state.go('settings');
  };
  
  $scope.testSync = function() {
      GeoService.getCurrentPosition(navigator.geolocation, function(pos) {
          if(pos !== null)
          {
              var newPosition = {
    			userId: LocalStorageService.getItem("currentUser", {}, window).id,
    			latlng: {
    				lat: pos.coords.latitude,
    				lng: pos.coords.longitude
    			},
    			timestamp: pos.timestamp,
    			accuracy: pos.coords.accuracy,
    			altitude: pos.coords.altitude,
    			altitudeAccuracy: pos.coords.altitudeAccuracy,
    			heading: pos.coords.heading,
    			speed: pos.coords.speed
    		};
            
            DataService.localPosition_create(newPosition, function(err, res) {
                  var i = 0;
                  i++;
              });
          }
      }, function(err) {
          var error = err;
      });
  };
  
});
