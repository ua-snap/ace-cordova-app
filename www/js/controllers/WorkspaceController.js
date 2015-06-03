angular.module('starter.controllers')

.controller('WorkspaceController', function($scope, $ionicSideMenuDelegate) {
	
	// Adding beforeEnter event listener.  This function will be called just before every view load,
	// regardless of controller and state caching.
	$scope.$on('$ionicView.enter', function() {
		$ionicSideMenuDelegate.canDragContent(true);
	});
});
