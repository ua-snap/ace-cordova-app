// app.js

// Contains definitions and initialization for the ace mobile app
angular.module('ace', ['ionic', 'ace.controllers', 'ace.services', 'pascalprecht.translate'])
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
    
    .config(function($stateProvider, $urlRouterProvider, $translateProvider) {
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
    
    // Contains the mapping view
    .state('tab.map', {
        url: '/map',
        views: {
            'tab-map': {
            templateUrl: 'templates/tab-map.html',
            controller: 'MapController'
            }
        }
        })
    
    // Contains the workspace view
    .state('tab.workspace', {
        url: '/workspace',
        views: {
        'tab-workspace': {
            templateUrl: 'templates/tab-workspace.html',
            controller: 'WorkspaceController'
        }
        }
    })
    
    // Settings state - not a tab
    .state('settings', {
        url: '/settings',
        templateUrl: 'templates/settings.html',
        controller: 'SettingsController'
    })
    
    // GPS settings state (only accessed from Settings state)
    .state('settings-gps', {
        url: '/settings_gps',
        templateUrl: 'templates/settings_gps.html',
        controller: 'SettingsGpsController'
    })
    
    // Translations/Language settings state (only accessed from Settings state)
    .state('settings-language', {
        url: '/settings_language',
        templateUrl: 'templates/settings_language.html',
        controller: 'SettingsLangController'
    })
    
    // General settings state (only accessed from Settings state)
    .state('settings-general', {
        url: '/settings_general',
        templateUrl: 'templates/settings_general.html',
        controller: 'SettingsGeneralController'
    })
    
    // Report Browser State (only accessed from the tab.report state)
    .state('browse-reports', {
        url: '/report_browser',
        templateUrl: 'templates/browse_reports.html',
        controller: 'BrowseReportsController'
    })
    
    // View Report (From report browser state)
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
    
    
    // if none of the above states are matched, use this as the fallback (default to login state)
    $urlRouterProvider.otherwise('/login');
    
    // Translations here
    $translateProvider.useStaticFilesLoader({
        prefix: 'translations/',
        suffix: '.json'
    });
    
    // If no settings exist, initialize to defaults to allow the app to function
    var localHandler = new LocalStorageUtil(window);
    var settings = localHandler.get("settings", null);
    if(settings === null)
    {
        settings = new Settings();
    }
    
    // Set the preffered language to the current setting (default English)
    $translateProvider.preferredLanguage(settings.language);
});