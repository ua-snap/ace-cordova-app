// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'lbServices'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html",
    controller: 'AppController'
  })

  // Each tab has its own nav history stack:
  
  // Report state: this state contains all the reporting views
  .state('tab.report', {
    url: '/report',
    views: {
      'tab-report': {
        templateUrl: 'templates/tab-report.html',
        controller: 'ReportController'
      }
    }
  })

  // State for the map view
  .state('tab.map', {
      url: '/map',
      views: {
        'tab-map': {
          templateUrl: 'templates/tab-map.html',
          controller: 'MapController'
        }
      }
    })

  // State for the workspace view
  .state('tab.workspace', {
    url: '/workspace',
    views: {
      'tab-workspace': {
        templateUrl: 'templates/tab-workspace.html',
        controller: 'WorkspaceController'
      }
    }
  })
  
  // Settings state
  .state('settings', {
    url: '/settings',
    templateUrl: 'templates/settings.html',
    controller: 'SettingsController'
  })
  
  // Database settings state
  .state('settings-db', {
    url: '/settings_db',
    templateUrl: 'templates/settings_db.html',
    controller: 'SettingsDbController'
  })
  
  // GPS settings state
  .state('settings-gps', {
    url: '/settings_gps',
    templateUrl: 'templates/settings_gps.html',
    controller: 'SettingsGpsController'
  })
  
  // Report Browser State
  .state('browse-reports', {
    url: '/report_browser',
    templateUrl: 'templates/browse_reports.html',
    controller: 'BrowseReportsController'
  })
  
  // View Report (From report browser)
  .state('browse-reports-view', {
    url: '/report_browser_view',
    templateUrl: 'templates/browse_reports_view.html',
    controller: 'ViewReportController'
  })
  
  // Login state (default initial state)
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginController',
  });


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
  
});
