/**
 * Class handles email validation.
 * 
 * @class EmailValidator
 * @constructor
 */
var EmailValidator = function() {
	// Regex specifies the following: "somestring@somestring.somestring"
	this.regex = /\S+@\S+\.\S+/;
};

/**
 * Function validates an email address.  Returns true if the email is valid (according to the regex defined in the
 * class) and false otherwise.
 * 
 * @method validate
 * @param {String} email The email address to validate
 * @return {Boolean} True if the email address is valid, false otherwise
 * @throws none
 */
EmailValidator.prototype.validate = function(email)
{
	return this.regex.test(email);
}