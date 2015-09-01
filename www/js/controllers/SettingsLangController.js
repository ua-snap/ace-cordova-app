// SettingsLangController.js
  
angular.module('ace.controllers')

 // SettingsLangController.js
 //-----------------------------------------------------------------------------------------------
 
 // Controller for the settings view
.controller('SettingsLangController', function($scope, $ionicNavBarDelegate, $ionicSideMenuDelegate, $ionicHistory, $state, SettingsService, $translate) {
  	
	  // Load user settings prior to loading the view
	$scope.$on('$ionicView.beforeEnter', function() {
		var settings = SettingsService.getSettings(window);
		$scope.languageSettings.language = settings.language;
	});
	  
	// Adding beforeEnter event listener.  This function will be called just before every view load,
	// regardless of controller and state caching.
	$scope.$on('$ionicView.enter', function() {
		// Enable dragging of the side menu
		$ionicSideMenuDelegate.canDragContent(false);
	});
	
	// Array contains all displayed language options
	$scope.languages = [
		{name: "English", value: "en"},
		{name: "Français", value: "fr"}	
	];
	
	// Selected language
	$scope.languageSettings = {
		language: ""
	};
	
	// Event handler for changing the language settings
	$scope.languageChanged = function() {
		// Actually change language
		$translate.use($scope.languageSettings.language);
		
		// Change title name
		// Re-translate the title (to ensure that it is correctly translated)
        $translate(['SELECT_LANGUAGE']).then(function(translations) {
           $ionicNavBarDelegate.title(translations.SELECT_LANGUAGE); 
        });
		
		// Update settings
		var settings = SettingsService.getSettings(window);
		settings.language = $scope.languageSettings.language;
		SettingsService.updateSettings(window, settings);
	};
	
	// Custom function called when the back navigation button is clicked
	// Custom, because this is navigation back to a different state (one of the tabs), instead 
	// of simple back navigation using the nav stack.
	$scope.goBack = function() {
		// Get the previous state (saved in the AppController toggleLeft() function)
		var localHandler = new LocalStorageUtil(window);
		var previousState = localHandler.get('previousState', null);
		
		// If a previous state exists, navigate back to it
		if(previousState)
		{
			$state.go(previousState);
		}
		else
		{
			// Default to the report tab
			$state.go('tab.report');
		}
	};
});