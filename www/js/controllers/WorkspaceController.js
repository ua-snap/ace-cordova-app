// WorkspaceController.js

/**
 * @module starter.controllers
 */
 
 // WorkspaceController.js
 //-----------------------------------------------------------------------------------------------
 
 // Controller for the workspace view
 /**
  * @class WorkspaceController
  */
angular.module('starter.controllers')

.controller('WorkspaceController', function($scope, $ionicSideMenuDelegate) {
	
	// Adding beforeEnter event listener.  This function will be called just before every view load,
	// regardless of controller and state caching.
	$scope.$on('$ionicView.enter', function() {
		// Enable dragging of the side menu
		$ionicSideMenuDelegate.canDragContent(true);
	});
});
