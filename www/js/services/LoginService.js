// LoginService.js

/**
 * @module starter.services
 */
angular.module('starter.services', [])

// LoginService class.  Performs login functionality.  
/**
 * @class LoginService
 */
.service('LoginService', function($http) {
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
        }
    };
});
