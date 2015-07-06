angular.module('starter.services')

.service('AuthService', function($http, DbService, LocalStorageService, User) {
	return {
		loginUser: function(name, pw, successCallback, errorCallback) {
            
            var credentials = {
                username: name,
                password: pw
            };
            
            User.login(credentials, function(value, responseHeaders) {
                // success 
                // Save username and userId
                LocalStorageService.setItem("userId", value.user.userId, window);
                LocalStorageService.setItem("userName", value.user.userName, window);
                
                // execute callback
                if(successCallback)
                {
                    successCallback.call(this, value.user);
                }
            }, function(httpResponse) {
                // error
                alert(httpResponse.data);
            });
            
        },
		
		logoutUser: function(successCallback, errorCallback) {            
            
            User.logout(function(value, responseHeaders) {
                // success
                // Execute callback
                if(successCallback)
                {
                    successCallback.call(this, value, responseHeaders);
                }
            }, function(httpResponse) {
                // error
                alert(httpResponse.data);
                
                if(errorCallback)
                {
                    errorCallback.call(this, httpResponse);
                }
            });
        }    
	};   	 
});