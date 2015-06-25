angular.module('starter.services')

.service('GeoService', function() {
	return {
		openDatabase: function(window) {
			var dbHandler = new DbHandler("ace.db", window);
		}	
	};
});