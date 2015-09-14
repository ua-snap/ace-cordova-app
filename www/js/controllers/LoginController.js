// LoginController.js

// Grab the ace.controllers angular module (so we can add the login view controller to it)
angular.module('ace.controllers')

// LoginController
//--------------------------------------------------------------
// Create the LoginController controller
.controller('LoginController', function($scope, LocalStorageService, AuthService, $ionicPopup, $state, $ionicSideMenuDelegate, $ionicLoading) {

    // Data variable to hold username and password
    $scope.data = {};
    
    // Remove the ability of users to remain "logged in" after exiting app
    //LocalStorageService.getItem("currentUser", "", window).username;
    var oldUsername = "";
    
    // If a user was logged in, skip the login screen and take them 
    // directly to the default view (report view)
    if(oldUsername !== "")
    {
        // Re-enable sliding the left side-menu (it should have 
        // been disabled on a previous logout)
        $ionicSideMenuDelegate.canDragContent(true);
        $state.go('tab.report');
    }
    
    // Dynamically position the login block (css inconsistent)
    var loginBlock = window.document.getElementById("loginContents");
    
    var screenHeight = window.innerHeight;
    var loginBlockHeight = loginBlock.clientHeight;
    
    // Calculate padding top (so that the bottom of the login block is 30 px above the bottom of the screen)
    var paddingTop = screenHeight - loginBlockHeight - 30;
    loginBlock.style.paddingTop = paddingTop.toString() + "px";
    
    // Event handler to detect keypresses on the username field
    $scope.usernameKeyPress = function(e)
    {
        // Check if enter pressed
        if(e.which === 13)
        {
            // Return was pressed, so focus on password
            window.document.getElementById("passwordInput").focus();
        }
    }
    
    // Keypress event for password field
    $scope.passwordKeyPress = function(e)
    {
        // Check for enter
        if(e.which === 13)
        {
            // Ensure username and password are both provided
            if(!$scope.data.username)
            {
                // Prompt for a username and focus the username input field
                var noUsernamePopup = $ionicPopup.alert({
                    title: 'No username',
                    template: 'Please provide a username.'
                });
            }
            else if(!$scope.data.password)
            {
                // Notify the user of the failed login and do not login
                var noPassPopup = $ionicPopup.alert({
                    title: 'No password',
                    template: 'Please provide a password.'
                });
            }
            else
            {
                // Return was pressed, so login (and close keyboard)
                $scope.login();
                window.cordova.plugins.Keyboard.close();
            }
        }
    }

    // Checks the provided username and password and logs the user in
    // if the credentials are valid.  If invalid, notifies the user
    // and rejects the login attempt.  Utilizes AuthService to check 
    // credentials
    $scope.login = function() {
        // Start loading overlay
        $ionicLoading.show({
            template: '<p style=\"margin=auto\">Logging in...</p><ion-spinner></ion-spinner>'
        });
        // Attempt to authorize the current user with the provided credentials
        AuthService.loginUser($scope.data.username, $scope.data.password, function(user) {
            // Clear out username and password
            $scope.data.username = "";
            $scope.data.password = "";
            
            // Close the loading overlay
            $ionicLoading.hide();
            
            // Move the user to the default view (tab.report)
            $state.go('tab.report');
            
            // Re-enable the ability to drag the side menu out (disabled on 
            // previous logouts)
            $ionicSideMenuDelegate.canDragContent(true);
        }, function(data, status, headers, config) {
            // Remove the loading overlay
            $ionicLoading.hide();
            
            // Clear out password (but leave username)
            $scope.data.password = "";
            
            // Notify the user of the failed login and do not login
            $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials.'
            });
        });
    };
});
