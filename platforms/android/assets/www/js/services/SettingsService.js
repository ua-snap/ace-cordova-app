// SettingsService.js

/**
 * @module ace.services
 */
angular.module('ace.services')

/**
 * Service class provides access to the settings object model for the application, which is saved in LocalStorage.
 * 
 * @class SettingsService
 * @constructor
 */

// SettingsService.js
//-----------------------------------------------------------------------------------------------

// Service class provides access to the settings object model for the application, which is saved in LocalStorage.
.service('SettingsService', function(DataService, LocalStorageService) {
	
	// Local Storage key for the settings object
	var settingsKey = "settings";
	
	return {
		/**
		 * Gets the current settings object (or a blank one with default settings if none is found)
		 * 
		 * @method getSettings
		 * @param {Window} window The window object from the current scope
		 * @return {Object} Returns the current Settings object if it exists, and one with default settings if it does
		 * 		not.
		 * @throws none
		 */
		
		// Gets the current settings object (or a blank one with default settings if none is found)
		getSettings: function(window) {
			var settings = LocalStorageService.getItem("currentUser", {}, window).settings;
			if(settings === null)
			{
				settings = new Settings();
				
				// Update the cached copy of the current user
				var currentUser = LocalStorageService.getItem("currentUser", {}, window);
				currentUser.settings = settings;
				LocalStorageService.setItem("currentUser", currentUser, window);
								
				// if online, update the remote user
				if(window.navigator.connection.type !== "none")
				{
					DataService.remoteMobileUser_updateAll({id: currentUser.id}, currentUser, function(err, res) {
						var i = 0;
					});
				}
				else
				{
					DataService.localMobileUser_updateAll({id: currentUser.id}, currentUser, function(err, res) {
						var i = 0;
					});
				}
				
			}
			return settings;
		},
		
		/**
		 * Updates the current settings object with the provided new settings object.
		 * 
		 * @method updateSettings
		 * @param {Window} window The window object from the current scope
		 * @param {Object} settings The Settings object to save
		 * @return void
		 * @throws none
		 */
		
		// Updates the current settings object with the provided new settings object.
		updateSettings: function(window, settings)
		{
			var currentUser = LocalStorageService.getItem("currentUser", {}, window);
			currentUser.settings = settings;
			LocalStorageService.setItem("currentUser", currentUser, window);
			
			// Update the local mobile user (in data store)
			if(window.navigator.connection.type !== "none")
			{
				DataService.remoteMobileUser_updateAll({id: currentUser.id}, currentUser, function(err, res) {
					// Do nothing
				});
			}
			else
			{
				DataService.remoteMobileUser_updateAll({id: currentUser.id}, currentUser, function(err, res) {
					// Do nothing
				});
			}
		}
	};
});