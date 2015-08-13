angular.module('ace.services')

/**
 * Service class provides access to the settings object model for the application, which is saved in LocalStorage.
 * 
 * @class SettingsService
 * @constructor
 */
.service('SettingsService', function(DataService, LocalStorageService) {
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
		getSettings: function(window) {
			var settings = LocalStorageService.getItem("currentUser", {}, window).settings;
			if(settings === null)
			{
				settings = new Settings();
				
				// Update the cached copy of the current user
				var currentUser = LocalStorageService.getItem("currentUser", {}, window);
				currentUser.settings = settings;
				LocalStorageService.setItem("currentUser", currentUser, window);
								
				// Update the local mobile user (in data store)
				DataService.remoteMobileUser_updateAll({id: currentUser.id}, currentUser, function(err, res) {
					var i = 0;
				});
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
		updateSettings: function(window, settings)
		{
			var currentUser = LocalStorageService.getItem("currentUser", {}, window);
			currentUser.settings = settings;
			LocalStorageService.setItem("currentUser", currentUser, window);
			
			// Update the local mobile user (in data store)
			DataService.remoteMobileUser_updateAll({id: currentUser.id}, currentUser, function(err, res) {
				var i = 0;
			});
		}
	};
});