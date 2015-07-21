angular.module('worker-services', ['ace.services', 'lbServices'])

.service('DownloadWorkerService', function(WebApiService) {
	return {
		downloadAll: function() {
			this.downloadUsers();
			this.downloadPositions();
			this.downloadReports();
		},
		
		downloadUsers: function(groupId) {
			var self = this;
			WebApiService.getGroupUsers({id: groupId}, function(value, responseHeaders) {
				// Send message back to main thread to insert values into database
				self.sendMessage(true, value, "users");
			}, function(httpResponse) {
				// Send error message
				self.sendMessage(false, httpResponse);
			});
		},
		
		downloadPositions: function(groupId) {
			var self = this;
			WebApiService.getGroupPositions(groupId, function(value, responseHeaders) {
				self.sendMessage(true, value, "positions");
			}, function(httpResponse) {
				self.sendMessage(false, httpResponse);
			});
		},
		
		downloadReports: function(groupId) {
			var self = this;
			WebApiService.getGroupReports(groupId, function(value, responseHeaders) {
				self.sendMessage(true, value, "reports");
			}, function(httpResponse) {
				self.sendMessage(false, httpResponse);
			});
		},
		
		sendMessage: function(success, values, typeName) {
			var message = {
				success: success,
				data: {}
			};
			// Success message
			if(success)
			{
				message.data = values
				message.typeName = typeName;
			}
			else
			{
				// Error message
				message.data = values;
			}
			
			// Delete function objects...
			if(message.data.$promise)
			{
				message.data.$promise = null;
			}
			
			// Actually send the message
			postMessage(message);
		}			
	};	
});