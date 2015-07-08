angular.module('starter.services')

/**
 * This service serves as an interface to the ACE web api.
 * 
 * @class WebApiService
 * @constructor
 */
.service('WebApiService', function(Mobile_user) {
	return {
		
		/**
		 * Function checks user authorization and calls successCb in the case of valid authorization and errorCb in the
		 * case of invalid authorization.  Should be used to service a Login call and at any other time verification of
		 * authorization is needed.
		 * 
		 * @method authorizeUser
		 * @param {Username/Password} credentials An object containing a username (or email) and password
		 * @param {function} successCb Success callback function
		 * @param {function} errorCb Error callback function
		 * @return void
		 * @throws none
		 */
		authorizeUser: function(credentials, successCb, errorCb)
		{
			Mobile_user.login(credentials, successCb, errorCb);
		},
		
		/**
		 * Function de-authorizes (logs out) user and calls successCb if the call was successful, errorCb if some
		 * error occurred.
		 * 
		 * @method deAuthorizeUser
		 * @param {function} successCb Success callback function
		 * @param {function} errorCb Error callback function
		 * @return void
		 * @throws none
		 */
		deAuthorizeUser: function(successCb, errorCb)
		{
			Mobile_user.logout(successCb, errorCb);
		}
		
			
	};
});