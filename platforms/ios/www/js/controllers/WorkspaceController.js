// WorkspaceController.js

/**
 * @module ace.controllers
 */
 
 // WorkspaceController.js
 //-----------------------------------------------------------------------------------------------
 
 // Controller for the workspace view
 /**
  * @class WorkspaceController
  */
angular.module('ace.controllers')

.controller('WorkspaceController', function($scope, $translate, $ionicNavBarDelegate, $ionicSideMenuDelegate) {
	
	// Adding beforeEnter event listener.  This function will be called just before every view load,
	// regardless of controller and state caching.
	$scope.$on('$ionicView.enter', function() {
		// Enable dragging of the side menu
		$ionicSideMenuDelegate.canDragContent(true);
		
		// Re-translate the title (to ensure that it is correctly translated)
        $translate(['WORKSPACE']).then(function(translations) {
           $ionicNavBarDelegate.title(translations.WEATHER); 
        });
	});
});
