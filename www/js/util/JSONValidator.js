// JSONValidator.js

/**
 * @class JSONValidator
 * @constructor
 */

// JSONValidator
//------------------------------------------------------------------------------

// Empty constructor
var JSONValidator = function() {};


/**
 * @method isValidJSON
 * @param {string} str The string to check
 * @return {boolean} true if str is a valid json string, false otherwise
 * @throws none
 */

// Checks if str is a valid json string.  Returns true if it is, false otherwise.
JSONValidator.prototype.isValidJSON = function(str) {
	try
	{
		// Attempt to parse the string as a JSON object
		JSON.parse(str);
	}
	catch(e)
	{
		// If an error occured, the string must be invalid json
		return false;
	}
	
	// If this point is reached, the string was valid json
	return true;
};
