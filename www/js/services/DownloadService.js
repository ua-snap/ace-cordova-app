angular.module('ace.services')

.service('DownloadService', function(WebApiService, DbService) {
	return {
		downloadAll: function() {
			
		},
		
		downloadUsers: function(groupId) {
			WebApiService.getGroupUsers({id: groupId}, function(value, responseHeaders) {
				if(value)
				{
					for(var i = 0; i < value.length; i++)
					{
						DbService.upsertUser(value[i], window, function(res) {
							var a = 0; 
							a++;
						});
					}
				}
			}, function(httpResponse) {
				
			});
		},
		
		downloadPositions: function() {
			
		},
		
		downloadReports: function() {
			
		},			
	};
});