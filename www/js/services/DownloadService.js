angular.module('ace.services')

.service('DownloadService', function(WebApiService, DbService) {
	var downloadWorker;
	
	return {
		
		killDownloadWorker: function() {
			this.downloadWorker.terminate();
			this.downloadWorker = undefined;
		},
		
		backgroundRequest: function(request) {
			if(!this.downloadWorker)
			{
				this.downloadWorker = new Worker("js/workers/DownloadWorker.js");
				
				this.downloadWorker.onmessage = this.messageReceived;
			}	
			
			this.downloadWorker.postMessage(request);
		},
		
		messageReceived: function(e) {
			if(e.data.success)
			{
				if(e.typeName === "users")
				{
					values = e.data.data;
					for(var i = 0; i < values.length; i++)
					{
						DbService.upsertUser(values[i], window, null);
					}
				}
				else if(e.typeName === "positions")
				{
					values = e.data.data;
					for(var i = 0; i < values.length; i++)
					{
						DbService.upsertPosition(values[i], window, null);
					}
				}
				else if(e.typeName === "reports")
				{
					
				}
			}
			else
			{
				// Error message, alert user where appropriate
			}
		},
		
		downloadAll: function() {
			this.downloadUsers();
			this.downloadPositions();
			this.downloadReports();
		},
		
		downloadUsers: function(groupId) {
			this.backgroundRequest("downloadUsers");
		},
		
		downloadPositions: function() {
			this.backgroundRequest("downloadPositions");
		},
		
		downloadReports: function() {
			this.backgroundRequest("downloadReports");
		},			
	};
});