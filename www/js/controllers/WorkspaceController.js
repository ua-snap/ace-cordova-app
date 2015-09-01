// WorkspaceController.js

angular.module('ace.controllers')

// WorkspaceController.js
//-----------------------------------------------------------------------------------------------

// Controller for the workspace view
.controller('WorkspaceController', function($scope, $translate, $ionicNavBarDelegate, $ionicSideMenuDelegate) {
	
	// Adding beforeEnter event listener.  This function will be called just before every view load,
	// regardless of controller and state caching.
	$scope.$on('$ionicView.enter', function() {
		// Enable dragging of the side menu
		$ionicSideMenuDelegate.canDragContent(false);
		
		// Re-translate the title (to ensure that it is correctly translated)
        $translate(['WORKSPACE']).then(function(translations) {
           $ionicNavBarDelegate.title(translations.WEATHER); 
        });
		
		// Initialize the pinch to zoom utility and fill with just a default image for now
		var gesturableImg = new ImgTouchCanvas({
            canvas: document.getElementById('workspaceCanvas'),
            path: "img/workspace1.png"
        });
	});
});
