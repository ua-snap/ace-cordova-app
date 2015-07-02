angular.module('starter.services')

.service('AuthService', function($http) {
	return {
		loginUser: function(name, pw, successCallback, errorCallback) {
            var creds = {
                username: name,
                password: pw  
            };
            
            // Hardcoded login
            if(creds.username === "user" && creds.password === "secret")
            {
                if(successCallback)
                {
                    successCallback.call(this);
                }
            }
            
            $http.post("http://192.168.1.2:3000/api/Users/login", creds).success(function(data, status, headers, config) {
                // Set user access token
                $http.defaults.headers.common['X-Auth-Token'] = data.id;
                
                // Call success callback
                if(successCallback)
                {
                    successCallback.call(this, data, status, headers, config);
                }
            }).error(function(data, status, headers, config) {
                if(errorCallback)
                {
                    errorCallback.call(this, data, status, headers, config);
                }
            });
        },
		
		logoutUser: function(successCallback, errorCallback) {
            // Grab a new instance of LocalStorageUtil
            var localStorageHandler = new LocalStorageUtil(window);
            
            // Clear the username variable (where the current user's identity is stored)
            localStorageHandler.set("username", "");
            
            // Server logout call
            // Set up authorization header
            var config = {
                headers: {
                    authorization: $http.defaults.headers.common['X-Auth-Token']
                }
            };
            
            $http.post("http://192.168.1.2:3000/api/Users/logout", {}, config).success(function(data, status, headers, config) {
                // Clear out user access token
                $http.defaults.headers.common['X-Auth-Token'] = undefined;
                
                if(successCallback)
                {
                    successCallback.call(this, data, status, headers, config);
                }
            }).error(function(data, status, headers, config) {
                if(errorCallback)
                {
                    errorCallback.call(this, data, status, headers, config);
                }
            });
        }   
	};   	 
});