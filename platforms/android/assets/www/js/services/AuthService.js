// AuthService.js

/**
 * @module ace.services
 */

angular.module('ace.services')

/**
 * @description Service class handles authorization for the mobile app.  Performs login/logout functionality.  Also handles 
 * retrieving all users in the current user's Group after login.
 * 
 * @class AuthService
 * @constructor
 */
.service('AuthService', function($http, DbService, LocalStorageService, WebApiService) {
	return {
        /**
         * Function logs in the user with the credentials passed in the "name" and "pw" variables.  Note that 
         * "name" can be either a username or a password
         * 
         * @method loginUser
         * @param {String} name The username or email address of the person to login
         * @param {String} pw The password of the person to authenticate
         * @param {function} successCallback Success callback function.
         * @param {function} errorCallback Error callback function.
         */
		loginUser: function(name, pw, successCallback, errorCallback) {
            
            // Check if what was passed as username looks like an email address...
            var credentials = {};
            var emailValidator = new EmailValidator();
            if(emailValidator.validate(name))
            {
                credentials = {
                    email: name,
                    password: pw
                };
            }
            else
            {
                credentials = {
                    username: name,
                password: pw
                }
            }
                       
            WebApiService.authorizeUser(credentials, function(value, responseHeaders) {
                // success 
                // Save user data
                LocalStorageService.setItem("currentUser", value.user, window);
                
                // Fill the user's table with all group member's data
                WebApiService.getGroupUsers({id: value.user.groupId}, function(value, responseHeaders) {
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
		
        /**
         * Function logs out the current user, revoking the current access token
         * 
         * @method logoutUser
         * @param {function} successCallback Success callback function.  Executed on a successful logout operation.
         * @param {function} errorCallback Error callback function.  Executed on a failed logout operation. 
         */
		logoutUser: function(successCallback, errorCallback) {            
            
            WebApiService.deAuthorizeUser(function(value, responseHeaders) {
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