angular.module('starter.services')

.service('DataShareService', function() {
	var dictionary = {};
	return {
		setItem: function(key, value) {
			if(key !== null)
			{
				dictionary[key.toString()] = value;	
			}					
		},
		
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