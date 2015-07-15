angular.module('ace.services')

/**
 * Service class provides access to the settings object model for the application, which is saved in LocalStorage.
 * 
 * @class SettingsService
 * @constructor
 */
.service('SettingsService', function() {
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
			var localHandler = new LocalStorageUtil(window);
			var settings = localHandler.get(settingsKey, null);
			if(settings === null)
			{
				settings = new Settings();
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
			var localHandler = new LocalStorageUtil(window);
			localHandler.set(settingsKey, settings);
		}
	};
});