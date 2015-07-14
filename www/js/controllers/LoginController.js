// LoginController.js

// LoginController
//--------------------------------------------------------------

// Grab the starter.controllers angular module (so we can add to it)
/**
 * @module starter.controllers
 */
angular.module('starter.controllers')

// Create the LoginController controller
/**
 * @class LoginController
 * @constructor
 */
.controller('LoginController', function($scope, LocalStorageService, AuthService, $ionicPopup, $state, $ionicSideMenuDelegate) {

    // This function will be called every time that the login view
    // is displayed, so check for auser already logged in
    var oldUsername = "";//LocalStorageService.getItem("currentUser", "", window).username;
    
    // If a user was logged in, skip the login screen and take them 
    // directly to the default view (report view)
    if(oldUsername !== "")
    {
        // Re-enable sliding the left side-menu (it should have 
        // been disabled on a previous logout)
        $ionicSideMenuDelegate.canDragContent(true);
        $state.go('tab.report');
    }

    $scope.data = {};
    
    $scope.formSubmitted = function() {
        var focusedElement = document.activeElement;
        if(focusedElement.id !== "usernameInput")
        {
            $scope.login();
            return true;
        }
        else
        {
            document.getElementById("passwordInput").focus();
            return false;
        }
    };

    // Checks the provided username and password and logs the user in
    // if the credentials are valid.  If invalid, notifies the user
    // and rejects the login attempt.  Utilizes LoginService to check 
    // credentials
    /**
     * @method login
     * @description Checks the provided username and password and logs the user in
     * if the credentials are valid.  If invalid, notifies the user
     * and rejects the login attempt
     * @return void
     * @throws none
     */
    $scope.login = function() {
        AuthService.loginUser($scope.data.username, $scope.data.password, function(user) {
            // Clear out username and password
            $scope.data.username = "";
            $scope.data.password = "";
            
            // Move the user to the default view (tab.report)
            $state.go('tab.report');
            
            // Re-enable the ability to drag the side menu out (disabled on 
            // previous logouts)
            $ionicSideMenuDelegate.canDragContent(true);
        }, function(data, status, headers, config) {
            
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
