// LoginController.js

// Grab the ace.controllers angular module (so we can add the login view controller to it)
angular.module('ace.controllers')

// LoginController
//--------------------------------------------------------------
// Create the LoginController controller
.controller('LoginController', function($scope, LocalStorageService, AuthService, $ionicPopup, $state, $ionicSideMenuDelegate) {

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
    

    // Function controls the app's behavior when the form is submitted.  Added to allow for keyboard navigation
    // from the username field to the password field when pressing the keyboard "go" button.
    $scope.formSubmitted = function() {
        // Determine the active text entry field when the "go" button was pressed
        var focusedElement = document.activeElement;
        
        // If anything other than the username field was focused, attempt to login with the provided credentials
        if(focusedElement.id !== "usernameInput")
        {
            $scope.login();
            return true;
        }
        else
        {
            // If the user was focused on the usernameInput text field, switch focus to the passwordInput field and 
            // cancel the login
            document.getElementById("passwordInput").focus();
            return false;
        }
    };

    // Checks the provided username and password and logs the user in
    // if the credentials are valid.  If invalid, notifies the user
    // and rejects the login attempt.  Utilizes AuthService to check 
    // credentials
    $scope.login = function() {
        // Attempt to authorize the current user with the provided credentials
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
