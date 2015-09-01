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
  $translateProvider.translations('en', {
     WEATHER: 'Weather',
     MAP: 'Map',
     WORKSPACE: 'Workspace',
     SUBMIT: 'Submit',
     CLOUD_COVER: 'Cloud Cover',
     NO_CLOUDS: 'No Clouds',
     ONE_EIGHTH: '1/8th',
     TWO_EIGHTS: '2/8ths',
     THREE_EIGHTS: '3/8ths',
     FOUR_EIGHTS: '4/8ths',
     FIVE_EIGHTS: '5/8ths',
     SIX_EIGHTS: '6/8ths',
     SEVEN_EIGHTS: '7/8ths',
     EIGHT_EIGHTS: '8/8ths',
     SKY_OBSCURED: 'Sky Obscured',
     PRECIPITATION: 'Precipitation',
     LIGHT_RAIN: 'Light Rain',
     MODERATE_RAIN: 'Moderate Rain',
     HEAVY_RAIN: 'Heavy Rain',
     LIGHT_SNOW: 'Light Snow',
     MODERATE_SNOW: 'Moderate Snow',
     HEAVY_SNOW: 'Heavy Snow',
     FREEZING_RAIN: 'Freezing Rain',
     HEAVY_FREEZING_RAIN: 'Heavy Freezing Rain',
     RAIN_AND_SNOW: 'Rain and Snow',
     HEAVY_RAIN_AND_SNOW: 'Heavy Rain and Snow',
     SLEET: 'Sleet',
     ICE_NEEDLES: 'Ice Needles',
     FREEZING_DRIZZLE: 'Freezing Drizzle',
     THUNDERSTORM: 'Thunderstorm',
     THUNDERSNOW: 'Thundersnow',
     VIRGA: 'Virga',
     VISIBILITY: 'Visibility',
     MIST: 'Mist',
     PATCHY_FOG: 'Patchy Fog',
     FOG: 'Fog',
     ICE_FOG: 'Ice Fog',
     HAZE: 'Haze',
     BLOWING_SNOW: 'Blowing Snow',
     SMOKE: 'Smoke',
     PRESSURE: 'Pressure',
     PRESSURE_TENDENCY: 'Pressure Tendency',
     UPWARD: 'Upward',
     NO_CHANGE: 'No Change',
     DOWNWARD: 'Downward',
     SURFACE_PRESSURE: 'Surface Pressure',
     ENTER_HERE: 'Enter Here...',
     TEMPERATURE: 'Temperature',
     WIND: 'Wind',
     WIND_SPEED: 'Wind Speed',
     WIND_DIRECTION: 'Wind Direction',
     NORTH: 'North',
     NORTHEAST: 'Northeast',
     EAST: 'East',
     SOUTHEAST: 'Southeast',
     SOUTH: 'South',
     SOUTHWEST: 'Southwest',
     WEST: 'West',
     NORTHWEST: 'Northwest',
     NOTES: 'Notes',
     CAMERA: 'Camera',
     TAKE_PICTURE: 'Take picture',
     TAKE_VIDEO: 'Take video',
     ATTACH_PHOTO: 'Attach photo',
     OTHER: 'Other',
     AURORA_BOREALIS: 'Aurora Borealis',
     TORNADO: 'Tornado',
     CANCEL: 'Cancel',
     SAVE: 'Save',
     LOGIN: 'Login',
     LOGOUT: 'Logout',
     USERNAME: 'Username or Email',
     PASSWORD: 'Password',
     SETTINGS: 'Settings',
     DATABASE_SETTINGS: 'Database Settings',
     DELETE_CACHED_DATA: 'Delete Cached Data',
     GPS_SETTINGS: 'GPS Settings',
     GPS_TIMEOUT: 'GPS Timeout',
     HIGH_ACCURACY: 'High Accuracy',
     ENABLE_POSITION_TRACKING: 'Enable Position Tracking',
     POSITION_TRACKING_INTERVAL: 'Position Tracking Interval',
     DISPLAYED_POSITION_HISTORY_POINTS: "Displayed Position History Points",   
     LANGUAGE_SETTINGS: 'Language Settings',
     SELECT_LANGUAGE: 'Select Language',
     REPORT_SUMMARY: 'Report Summary',
     MAP_OPTIONS: 'Map Options',
     DISPLAY_POSITION: 'Display Position',
     DISPLAY_HISTORY: 'Display History',
     DISPLAY_REPORTS: 'Display Reports',
     SEND_REPORT: 'Send Report',
     ADDITIONAL_ACTIONS: 'Additional Actions',
     BROWSE_PREVIOUS_REPORTS: 'Browse Previous Reports',
     PREVIOUS_REPORTS: 'Previous Reports',
     VIEW_REPORT: 'View Report',
     USE_AS_TEMPLATE: 'Use as Template'
  })
  .translations('fr', {
      WEATHER: 'Temps',
      MAP: 'Carte',
      WORKSPACE: 'Travail',
      SUBMIT: 'Soumettre',
      CLOUD_COVER: 'Nuage',
      NO_CLOUDS: 'Pas de nuages',
      ONE_EIGHTH: '1/8ème',
      TWO_EIGHTS: '2/8e',
      THREE_EIGHTS: '3/8e',
      FOUR_EIGHTS: '4/8e',
      FIVE_EIGHTS: '5/8e',
      SIX_EIGHTS: '6/8e',
      SEVEN_EIGHTS: '7/8e',
      EIGHT_EIGHTS: '8/8e',
      SKY_OBSCURED: 'ciel obscurci',
      PRECIPITATION: 'Précipitation',
      LIGHT_RAIN: 'pluie Légère',
      MODERATE_RAIN: 'pluie modérée',
      HEAVY_RAIN: 'forte Pluie',
      LIGHT_SNOW: 'neige Légère',
      MODERATE_SNOW: 'neige modérée',
      HEAVY_SNOW: 'Beaucoup De Neige',
      FREEZING_RAIN: 'pluie Verglaçante',
      HEAVY_FREEZING_RAIN: 'Pluie verglaçante lourde',
      RAIN_AND_SNOW: 'La pluie et la neige',
      HEAVY_RAIN_AND_SNOW: 'de fortes pluies et de la neige',
      SLEET: 'neige fondue',
      ICE_NEEDLES: 'aiguilles de glace',
      FREEZING_DRIZZLE: 'bruine verglaçante',
      THUNDERSTORM: 'orage',
      THUNDERSNOW: 'tonnerre neige',
      VIRGA: 'personnel',
      VISIBILITY: 'Visibilité',
      MIST: 'Mist',
      PATCHY_FOG: 'Patchy Fog',
      FOG: 'Fog',
      ICE_FOG: 'Ice Fog',
      HAZE: 'Haze',
      BLOWING_SNOW: 'Blowing Snow',
      SMOKE: 'Smoke',
      PRESSURE: 'Pression',
      PRESSURE_TENDENCY: 'tendance de la pression',
      UPWARD: 'ascendant',
      NO_CHANGE: 'pas de changement',
      DOWNWARD: 'vers le bas',
      SURFACE_PRESSURE: 'la pression de surface',
      ENTER_HERE: 'entrez ici...',
      TEMPERATURE: 'Température',
      WIND: 'Vent',
      WIND_SPEED: 'vitesse du vent',
      WIND_DIRECTION: 'direction du vent',
      NORTH: 'Nord',
      NORTHEAST: 'Nord Est',
      EAST: 'Est',
      SOUTHEAST: 'Sud Est',
      SOUTH: 'Sud',
      SOUTHWEST: 'Sud Ouest',
      WEST: 'Ouest',
      NORTHWEST: 'Nord Ouest',
      NOTES: 'Remarques',
      CAMERA: 'Caméra',
      TAKE_PICTURE: 'prendre une photo',
      TAKE_VIDEO: 'prenez la vidéo',
      ATTACH_PHOTO: 'joindre une photo',
      OTHER: 'Autre',
      AURORA_BOREALIS: 'aurore boréale',
      TORNADO: 'tornade',
      CANCEL: 'annuler',
      SAVE: 'enregister',
      LOGIN: 'se connecter',
      LOGOUT: 'se déconnecter',
      USERNAME: "nom d'utilisateur ou email",
      PASSWORD: 'mot de passe',
      SETTINGS: 'paramètres',
      DATABASE_SETTINGS: 'les paramètres de base de données',
      DELETE_CACHED_DATA: 'supprimer les données mises en cache',
      GPS_SETTINGS: 'paramètres GPS',
      GPS_TIMEOUT: 'temporisation GPS',
      HIGH_ACCURACY: 'haute précision',
      ENABLE_POSITION_TRACKING: 'permettre le suivi de position',
      POSITION_TRACKING_INTERVAL: 'intervalle de suivi de position',
      DISPLAYED_POSITION_HISTORY_POINTS: "l'histoire des points de position affichées",     
      LANGUAGE_SETTINGS: 'paramètres de langue',
      SELECT_LANGUAGE: 'Choisir la langue',
      REPORT_SUMMARY: 'résumé du rapport',
      MAP_OPTIONS: 'options de carte',
      DISPLAY_POSITION: "position d'affichage",
      DISPLAY_HISTORY: "l'histoire d'affichage",
      DISPLAY_REPORTS: "les rapports d'affichage",
      SEND_REPORT: 'envoyer un rapport',
      ADDITIONAL_ACTIONS: 'actions supplémentaires',
      BROWSE_PREVIOUS_REPORTS: 'parcourir les rapports précédents',
      PREVIOUS_REPORTS: 'les rapports précédents',
      VIEW_REPORT: 'Voir le rapport',
      USE_AS_TEMPLATE: 'utiliser comme modèle'
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

