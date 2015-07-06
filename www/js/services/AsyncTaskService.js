angular.module('starter.services')

.service('AsyncTaskService', function($q) {
	return {
		getAsyncTask: function(task) {
			var deferred = $q.defer;
			
			// execute the function in the background
			try {
				var result = task.call(this, arguments);
				deferred.resolve(result);
			}	
			catch(error)
			{
				deferred.reject(error);
			}
			
			return deferred.promise;
		},
		
		runAsyncTask: function(task, successCb, errorCb) {
			var asyncTask = this.getAsyncTask(task);
			asyncTask.then(function(result) {
				// Success
				if(successCb)
				{
					successCb.call(this, result);
				}
			}, function(error) {
				// Error
				if(errorCb)
				{
					errorCb.call(this, error);
				}
			});	
		}
	};
});