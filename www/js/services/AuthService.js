// AuthService.js

/**
 * @module ace.services
 */

// Create ace.services module
angular.module('ace.services', [])

/**
 * @description Service class handles authorization for the mobile app.  Performs login/logout functionality.  Also handles 
 * retrieving all users in the current user's Group after login.
 * 
 * @class AuthService
 * @constructor
 */
 
// AuthService.js
//-----------------------------------------------------------------------------------------------

// Service class handles authorization for the mobile app.  Performs login/logout functionality.  Also handles 
// retrieving all users in the current user's Group after login.
.service('AuthService', function($http, DataService, LocalStorageService, SettingsService) {    
	return {
        /**
         * Function logs in the user with the credentials passed in the "name" and "pw" variables.  Note that 
         * "name" can be either a username or a password.
         * If the device is connected to the internet, the function will attempt to authenticate with the remote server.
         * If the device is offline, the function will attempt to authenticate with the user set stored from previous
         * logins.
         * 
         * @method loginUser
         * @param {String} name The username or email address of the person to login
         * @param {String} pw The password of the person to authenticate
         * @param {function} successCallback Success callback function.
         * @param {function} errorCallback Error callback function.
         */
         
        // Function logs in the user with the credentials passed in the "name" and "pw" variables.  Note that 
        // "name" can be either a username or an email
		loginUser: function(name, pw, successCallback, errorCallback) {
            // Check if what was passed as username looks like an email address...
            var credentials = {};
            var emailValidator = new EmailValidator();
            if(emailValidator.validate(name))
            {
                // "name" was probably actally an email
                credentials = {
                    email: name,
                    password: pw
                };
            }
            else
            {
                // "name" was in fact a username
                credentials = {
                    username: name,
                    password: pw
                }
            }
            
            // Initialize the DataService (sync/DataService.js)
            DataService.initialize();
            
            // Check offline/online
            if(window.navigator.connection.type !== "none")
            {
                // Online, so authenticate with the server
                DataService.remoteMobileUser_login(credentials, ['user'], function(err, res) {
                    if(res)
                    {
                        // Save current user (including user settings)
                        LocalStorageService.setItem("currentUser", res.user, window);
                        
                        // Save access token for use in file upload functions
                        LocalStorageService.setItem("access_token", res.id, window);
                        
                        // Retrieve an array of the id's for users in the current group
                        var filter = {where: {id: res.user.groupId}, include: "MobileUsers"};
                        DataService.remoteGroup_findOne(filter, function(err, result) {
                        if(result)
                        {
                            var groupUsersIdArray = [];
                            var groupUsers = result.__unknownProperties.MobileUsers;
                            for(var i = 0; i < groupUsers.length; i++)
                            {
                                groupUsersIdArray.push(groupUsers[i].id);
                            }
                            LocalStorageService.setItem("groupUserIds", groupUsersIdArray, window);
                            
                            // Save group name (to be used when uploading to group containers)
                            LocalStorageService.setItem("groupName", result.__data.name, window);
                            
                            // SYNC 
                            var settings = SettingsService.getSettings(window);
                            DataService.sync(null, settings.general.notifications);                           
                        }                       
                        else if(err)
                        {
                            alert(err);
                        }
                        
                    });
                        // Login was successful, no need to wait on updating the user group data.
                        if(successCallback)
                        {
                            successCallback.call(this, res);
                        }
                    }
                    else
                    {
                        // Error occurred
                        if(errorCallback)
                        {
                            errorCallback.call(this, res);
                        }
                    }
                    
                });
            }
            else
            {
                // Offline login
                DataService.localMobileUser_login(credentials, ['user'], function(err, res) {
                    if(res)
                    {
                        // Save current user (including user settings)
                        LocalStorageService.setItem("currentUser", res.user, window);
                        
                        // No access token to save, clear any old ones
                        LocalStorageService.setItem("access_token", null, window);
                        
                        // Retrieve an array of the id's for users in the current group
                        var filter = {where: {id: res.user.groupId}};
                        DataService.localGroup_findOne(filter, function(err, result) {
                            // Save group name (to be used when uploading to group containers)
                            LocalStorageService.setItem("groupName", result.__data.name, window);
                            // Get the users in the group
                            DataService.localMobileUser_find({where: {groupId: result.__data.id}}, function(err, result) {
                                if(result)
                                {
                                    var groupUsersIdArray = [];
                                    var groupUsers = result;
                                    for(var i = 0; i < groupUsers.length; i++)
                                    {
                                        groupUsersIdArray.push(groupUsers[i].id);
                                    }
                                    LocalStorageService.setItem("groupUserIds", groupUsersIdArray, window);
                                }
                                 else if(err)
                                {
                                    alert(err);
                                }
                            });                       
                        });
                        
                        // Login was successful, don't need to wait for other data to update
                        if(successCallback)
                        {
                            successCallback.call(this, res);
                        }
                    }
                    else
                    {
                        if(errorCallback)
                        {
                            errorCallback.call(this, res);
                        }
                    }
                });
            }
        },
		
        /**
         * Function logs out the current user, revoking the current access token.
         * Note: currently only works online
         * 
         * @method logoutUser
         * @param {function} successCallback Success callback function.  Executed on a successful logout operation.
         * @param {function} errorCallback Error callback function.  Executed on a failed logout operation. 
         */
         
        // Function logs out the current user, revoking the current access token
        // Note: currently only works online
		logoutUser: function(successCallback, errorCallback) {
            // Logout with remote server
            DataService.remoteMobileUser_logout(LocalStorageService.getItem("access_token", "", window), function(err) {
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
                  // Logout successful
                  if(successCallback)
                  {
                      successCallback.call(this);
                  }
                  
                  // Clear out local user storage
                  LocalStorageService.setItem("access_token", "", window);
                  LocalStorageService.setItem("currentUser", "", window);
              }
            });           
        }    
	};   	 
});