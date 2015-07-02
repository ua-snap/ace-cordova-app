angular.module('starter.services')

.service('LocalStorageService', function() {
	return {
		setItem: function(key, value, window)
		{
			var localHandler = new LocalStorageUtil(window);
			localHandler.set(key, value);
		},
		
		getItem: function(key, defaultValue, window)
		{
			var localHandler = new LocalStorageUtil(window);
			return localHandler.get(key, defaultValue);
		}
		
	};
});