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
.service('AuthService', function($http, DbService, RemoteGroup, RemoteMobileUser, LocalStorageService, WebApiService) {    
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
            
            RemoteMobileUser.login(credentials, ['user'], function(err, res) {
               if(res)
               {
                   // Save access token
                   LocalStorageService.setItem("access_token", res.id, window);
                   
                   // Save currentUser item (which contains the group id)
                   LocalStorageService.setItem("currentUser", res.user, window);
                   
                   // Retrieve an array of the id's for users in the current group
                   var filter = {where: {id: res.user.groupId}, include: "MobileUsers"};
                   RemoteGroup.findOne(filter, function(err, result) {
                       if(result)
                       {
                           var groupUsersIdArray = [];
                           var groupUsers = result.__unknownProperties.MobileUsers;
                           for(var i = 0; i < groupUsers.length; i++)
                           {
                               groupUsersIdArray.push(groupUsers[i].id);
                           }
                           LocalStorageService.setItem("groupUserIds", groupUsersIdArray, window);
                           // SYNC 
                           window.client.sync();
                       }                       
                       else if(err)
                       {
                           alert(err);
                       }
                       
                   });
                   
                   if(successCallback)
                   {
                       successCallback.call(this, res);
                   }
               } 
               else if(err)
               {
                   alert(err);
                   if(errorCallback)
                   {
                       errorCallback.call(this, err);
                   }
               }
               else 
               {
                   alert('Server not found.  Please connect to the internet and retry.');
                   if(errorCallback)
                   {
                       errorCallback.call(this, err);
                   }
               }
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
            
            RemoteMobileUser.logout(LocalStorageService.getItem("access_token", "", window), function(err) {
              if(err)
              {
                  alert(err);
                  if(errorCallback)
                  {
                      errorCallback.call(this, err);
                  }
              }  
              else
              {
                  if(successCallback)
                  {
                      successCallback.call(this);
                  }
                  
                  // Clear out local user storage
                  LocalStorageService.setItem("access_token", "", window);
                  LocalStorageService.setItem("currentUser", "", window);
              }
            });           
            
            /*WebApiService.deAuthorizeUser(function(value, responseHeaders) {
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
            });*/
        }    
	};   	 
});