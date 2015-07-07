angular.module('starter.services')

.service('AuthService', function($http, DbService, LocalStorageService, User, Group) {
	return {
		loginUser: function(name, pw, successCallback, errorCallback) {
            
            var credentials = {
                username: name,
                password: pw
            };
            
            User.login(credentials, function(value, responseHeaders) {
                // success 
                // Save user data
                LocalStorageService.setItem("currentUser", value.user, window);
                
                // Fill the user's table with all group member's data
                Group.groupId({id: value.user.groupId}, function(value, responseHeaders) {
                    // Group members in "value"
                    if(value)
                    {
                        for(var i = 0; i < value.length; i++)
                        {
                            DbService.insertUser(value[i], window, null);
                        }
                    }                 
                });
                
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