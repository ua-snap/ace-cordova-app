var EmailValidator = function() {
	this.regex = /\S+@\S+\.\S+/;
};

EmailValidator.prototype.validate = function(email)
{
	return this.regex.test(email);
}