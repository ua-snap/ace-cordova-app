angular.module('ace.services')

/**
 * Service class that provides an interface to local storage (SharedPreferences in native Android).  Anything stored
 * with this class will persist in the app memory until all app data is deleted or the app is uninstalled.
 * 
 * @class LocalStorageService
 * @constructor
 */
.service('LocalStorageService', function() {
	return {
		/**
		 * Sets an object (or primitive) in Local Storage to be associated with the passed key parameter.
		 * 
		 * @method setItem
		 * @param {String} key The key of the value to be saved.
		 * @param {Object} value The Object or primitive to be saved.  Objects will be converted to a JSON string, so
		 * 		they must contain no functions.
		 * @param {Window} window The window object from the current scope.
		 * @return void
		 * @throws none
		 */
		setItem: function(key, value, window)
		{
			var localHandler = new LocalStorageUtil(window);
			localHandler.set(key, value);
		},
		
		/**
		 * Gets an object or primitive from local storage that is associated with the passed key parameter
		 * 
		 * @method getItem
		 * @param {String} key The key of the object to retrieve
		 * @param {Object} defaultValue Will be returned if no object is found to be associated with key
		 * @param {Window} window The window object from the current scope
		 * @return {Object} The value associated with the key parameter in local storage
		 * @throws none
		 */
		getItem: function(key, defaultValue, window)
		{
			var localHandler = new LocalStorageUtil(window);
			return localHandler.get(key, defaultValue);
		}
		
	};
});