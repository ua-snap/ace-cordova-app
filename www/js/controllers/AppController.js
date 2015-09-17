// AppController.js

// Create statement for the ace.controllers module
angular.module('ace.controllers', [])

// AppController
//--------------------------------------------------------------

// AppController is the main AngularJS controller responsible for the "base page" (no tabs).  It is mainly used
// for handling the left-side-menu

// Create the AppController controller
.controller('AppController', function($scope, DataService, AuthService, LocalStorageService, $ionicSideMenuDelegate, $state, $http, GeoService, $ionicHistory) {
  
    // Function toggles sliding the left side-menu out and back in
    // Called when the user presses the "More" (three vertical bars) button on the top left of the header bar
    $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };
  
    // Add a event handler to the ionic lifecycle event beforeEnter.  Performs initialization operations for the left-side
    // menu, namely - adding the username to the top
    $scope.$on('$ionicView.beforeEnter', function() {
        // Enable side-dragging of content
        $ionicSideMenuDelegate.canDragContent(true);
        
        // Set user name in left side menu
        document.getElementById("username_title").innerText = LocalStorageService.getItem("currentUser", null, window).username;
    });
  
  
    // Function called when the user clicks the "logout" button on the left-side menu
    $scope.logout = function() {
        // Make server logout call - will only work offline currently
        // TODO: Add offline logout support
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
            
            // Remove "online" event listener
            document.removeEventListener("online", window.thread_messenger.onlineListenerFunction, false);
            
            // Kill the sync thread and stop the sync interval timer
            DataService.terminate();
            window.clearInterval(window.thread_messenger.syncTimer);
            window.thread_messenger = undefined;
            
            // Remove access token id
            LocalStorageService.setItem("access_token", "", window);
            
            // Remove any notifications
            window.plugin.notification.local.cancel(230476843);
            
            // Kick the user back out to the login screen
            $state.go('login');
            
            // Clear any route history
            $ionicHistory.clearHistory();
            
        }, function(err) {
            // Error (already alerted in AuthService)
        });
    };
  
    // Function called when the user clicks the "settings" button in the left-side menu
    $scope.openSettings = function() {    
        // This function was accessed by sliding out the left menu, so close it back up.
        $ionicSideMenuDelegate.toggleLeft();
        
        // Save previous state (tab)
        LocalStorageService.setItem('previousState', $state.current.name, window);
        
        // Perform the navigation using the $state object
        $state.go('settings');
    };
});
