// LocalStorageUtil.js

/**
 * @class LocalStorageUtil
 * @constructor
 */

// LocalStorageUtil
//------------------------------------------------------------------

// Constructor assigns Cordova window variable
var LocalStorageUtil = function(window) {
	/**
	 * @property _window
	 * @type window
	 * @description Private variable to store the html window to access window.localStorage
	 * @default The window passed into the constructor
	 */
	this._window = window;
};

/**
 * @method get 
 * @description Function returns the value mapped to the specified key, if it exists.
 * If the value mapped to key does not exist, the function returns defaultValue *
 *  
 * @param {string} key The key associated with the string/object  to be retrieved. *
 * @param {string, Object} defaultValue Will be returned if no value is assosciated with the key param
 * @return {string, Object} Returns the string associated with the key if the string
 * does not register as valid JSON.  Otherwise returns the Object that the json string
 * parses to.
 * 
 * @throws none
 */

// Function returns the value mapped to the specified key in local storage, if it exists.
// If the value mapped to key does not exist, the function returns defaultValue
LocalStorageUtil.prototype.get = function(key, defaultValue) {
	// instantiate new JSONValidator object
	var validator = new JSONValidator();
	
	// Attempt to get the string associated with the key param
	var temp = this._getString(key);
	
	// Three cases:
	// 1. If key is not associated with anything, return defaultValue
	//
	// 2. If the value key is associated with is a valid json string, 
	// create the object from the string and return it.
	// 
	// 3. If the value that key is associated with is not a valid json
	// string, it must just simply be a string so return that.
	if(!temp)
	{
		return defaultValue;
	}
	else if(validator.isValidJSON(temp))
	{
		return JSON.parse(temp);
	}
	else
	{
		return temp;
	}
};


/**
 * @method set
 * @description Function saves the value param in local storage.  value is associated with
 * the provided key param.
 * 
 * @param {string} key The key to associate to value
 * @param {string, Object} The string or Object to save in LocalStorage
 * @return void
 * @throws none
 */

// Function saves the value param in local storage.  value is associated with
// the provided key param.
LocalStorageUtil.prototype.set = function(key, value) {
	if(typeof value == "string" || value instanceof String)
	{
		this._setString(key, value);
	}
	else
	{
		this._setObject(key, value);
	}
};

// Private helper function saves a string variable in local storage and 
// associates it with the provided key param.
LocalStorageUtil.prototype._setString = function(key, value) {
	this._window.localStorage.setItem(key, value);
};

// Private helper function gets the string variable that was saved in local
// storage and associated with the provided key param.  If no object corresponds
// to key, then the function returns the defaultValue param.
LocalStorageUtil.prototype._getString = function(key, defaultValue) {
	// Attempt to retreive the item associated with key
	var item = this._window.localStorage.getItem(key);

	// If the item does not exist, return the provided defaultValue.  Otherwise
	// return the string
	if(!item)
	{
		return defaultValue;
	}
	else
	{
		return item;
	}
};

// Private helper function saves the object param in local storage and 
// associates it with the provided key variable.
LocalStorageUtil.prototype._setObject = function(key, object) {
	// Save the object, converting it to a string using the JSON.stringify method.
	this._window.localStorage.setItem(key, JSON.stringify(object));
};
