var workerApp = angular.module('worker-app', ['lbServices']);

workerApp.run(function(Weather_report, $window) {
	$window.onmessage = function(e)
	{
		var i = 0;
		i++;
	}
});