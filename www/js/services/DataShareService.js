angular.module('starter.services')

/**
 * Service class that is used primarily to share data between controllers.  One controller can call setItem on the 
 * service to place an item and another can call getItem to retrieve it.
 * 
 * @class DataShareService
 * @constructor
 */
.service('DataShareService', function() {
	// Private dictionary variable to contain key, value pairs
	var dictionary = {};
	return {
		
		/**
		 * Function sets an item in the dictionary
		 * 
		 * @method setItem
		 * @param {String} key The key of the item to set
		 * @param {Object} value The object to associate with the param "key"
		 * @return void
		 * @throws none
		 */
		setItem: function(key, value) {
			if(key !== null)
			{
				dictionary[key.toString()] = value;	
			}					
		},
		
		/**
		 * Retrieves the item associated with the provided "key" parameter.  Returns defaultValue if there is no object
		 * associated with the key.
		 * 
		 * @method getItem
		 * @param {String} key The key of the item to retrieve
		 * @param {Object} defaultValue The value to return if no object is associated with the key parameter
		 * @return {Object} The item associated with the key parameter
		 * @throws none
		 */
		getItem: function(key, defaultValue) {
			if(key !== null)
			{
				return dictionary[key.toString()];
			}
			else
			{
				return defaultValue;	
			}
		}
	};
});