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
.controller('AppController', function($scope, $ionicSideMenuDelegate, $state, $http) {
  
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
  
  // Function logs out the current user by removing them from local storage
  /**
   * @method logout
   * @description Function logs out the current user by removing them from local storage
   * @return void
   * @throws none
   */
  $scope.logout = function() {
    // Grab a new instance of LocalStorageUtil
    var localStorageHandler = new LocalStorageUtil(window);
    
    // Clear the username variable (where the current user's identity is stored)
    localStorageHandler.set("username", "");
    
    // This function was accessed by sliding out the left menu, so close it back up.
    $ionicSideMenuDelegate.toggleLeft();
    
    // Disable dragging the left-menu (since we are about to switch to the login screen)
    $ionicSideMenuDelegate.canDragContent(false);
    
    // Kick the user back out to the login screen
    $state.go('login');
  };
  
  // Function provides test access
  $scope.test = function() {
    // Try out getting geolocation
    navigator.geolocation.getCurrentPosition(function(position) {
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
    }, {timeout: 10000, enableHighAccuracy: true});
  };
  
  // Testing HTTPS capabilities
  $scope.test2 = function() {
    $http.get('https://www.google.com').then(function(resp) {
      alert('success: ' + resp);
    }, function(err) {
        alert('error: ' + err);
    });
  };
  
  $scope.openSettings = function() {
    
    // This function was accessed by sliding out the left menu, so close it back up.
    $ionicSideMenuDelegate.toggleLeft();
    
    // Save previous state (tab)
    var localHandler = new LocalStorageUtil(window);
    
    localHandler.set('previousState', $state.current.name);
    
    $state.go('settings');
  };
});
