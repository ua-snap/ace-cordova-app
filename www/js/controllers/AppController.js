// AppController.js

// AppController
//--------------------------------------------------------------

/**
 * @module starter.controllers
 */
// Create the starter.controllers angularjs module
angular.module('starter.controllers', [])

// Create the AppController controller
/**
 * @class AppController
 */
.controller('AppController', function($scope, Group, UploadService, AuthService, LocalStorageService, $ionicSideMenuDelegate, $state, $http, DbService, GeoService) {
  
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
  
  // Function logs out the current user 
  /**
   * @method logout
   * @description Function logs out the current user by removing them from local storage
   * @return void
   * @throws none
   */
  $scope.logout = function() {
      // Make server logout call
      AuthService.logoutUser(function(value, responseHeaders) {
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
      
      }, function(data, httpResponse) {
          // Error (already alerted in AuthService)
          //alert(httpResponse.data);
      });
    };
  
  // Function provides test access
  $scope.test = function() {
    // Try out getting geolocation
    /*navigator.geolocation.getCurrentPosition(function(position) {
      alert('Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n');
    }, function(error) {
      alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
    }, {timeout: 10000, enableHighAccuracy: true});*/
    GeoService.getCurrentPosition(navigator.geolocation, function(position) {
      alert('Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n');
    }, function(error) {
      alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
    });
  };
  
  // Testing HTTPS capabilities
  $scope.test2 = function() {
    $http.get('https://www.google.com').then(function(resp) {
      alert('success: ' + resp);
    }, function(err) {
        alert('error: ' + err);
    });
  };
  
  $scope.testSQLite = function() {
    DbService.openDatabase(window);
    
    /*navigator.geolocation.getCurrentPosition(function(pos) {
      DbService.insertPosition(pos, window);
      
      DbService.getAllPositionLogs(window, function(res) {
        alert(res.rows.length);
      });
      
      DbService.getRecentPositionLogs(window, 3, function(res) {
        alert(res.rows.length);
        var i = 0;
        i++;
      });
    });*/
    
    GeoService.getCurrentPosition(navigator.geolocation, function(pos) {
      DbService.insertPosition(pos, window);
      
      DbService.getAllPositionLogs(window, function(res) {
        alert(res.rows.length);
      });
      
      DbService.getRecentPositionLogs(window, 3, function(res) {
        alert(res.rows.length);
        var i = 0;
        i++;
      });
    });   
  };
  
  $scope.testReportPosition = function() {
    DbService.getReportsAndPositions(window, function(reports) {
      var i = 0;
      i++;
      i++;
    });
  };
  
  $scope.test3 = function() {
      /*var user = LocalStorageService.getItem("currentUser", null, window);
      
      Group.groupId({id: user.groupId}, function(value, responseHeaders) {
          var i = 0;
          i++;
      }, function(httpResponse) {
          var i = 0; i++;
      });*/
      /*DbService.getAllUsers(window, function(res) {
         var i = 0;
         i = res; 
         i = null;
      });*/
      UploadService.uploadReportsAndMark();
      
  };
  
  // Go to the settings state
  $scope.openSettings = function() {    
    // This function was accessed by sliding out the left menu, so close it back up.
    $ionicSideMenuDelegate.toggleLeft();
    
    // Save previous state (tab)
    LocalStorageService.setItem('previousState', $state.current.name, window);
    
    // Perform the navigation using the $state object
    $state.go('settings');
  };
});
