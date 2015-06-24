// SettingsController.js

/**
 * @module starter.controllers
 */
 
 // SettingsController.js
 //-----------------------------------------------------------------------------------------------
 
 // Controller for the settings view
 /**
  * @class SettingsController
  */
angular.module('starter.controllers')

.controller('SettingsController', function($scope, $ionicSideMenuDelegate, $ionicHistory, $state) {
	
	// Adding beforeEnter event listener.  This function will be called just before every view load,
	// regardless of controller and state caching.
	$scope.$on('$ionicView.enter', function() {
		// Enable dragging of the side menu
		$ionicSideMenuDelegate.canDragContent(true);
	});
	
	// Function toggles sliding the left side-menu out and back in
	/**
	* @method toggleLeft
	* @description Function toggles sliding the left side-menu out and back in
	* @return void
	* @throws none
	*/
	$scope.toggleLeft = function() {
		$ionicSideMenuDelegate.toggleLeft();
	};
	
	$scope.goBack = function() {
		var localHandler = new LocalStorageUtil(window);
		var previousState = localHandler.get('previousState', null);
		if(previousState)
		{
			$state.go(previousState);
		}
		else
		{
			$state.go('tab.report');
		}
	};
});