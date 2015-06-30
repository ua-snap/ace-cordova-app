angular.module('starter.services')

.service('SettingsService', function() {
	var settingsKey = "settings";
	return {
		getSettings: function(window) {
			var localHandler = new LocalStorageUtil(window);
			var settings = localHandler.get(settingsKey, null);
			if(settings === null)
			{
				settings = new Settings();
			}
			return settings;
		},
		
		updateSettings: function(window, settings)
		{
			var localHandler = new LocalStorageUtil(window);
			localHandler.set(settingsKey, settings);
		}
	};
});