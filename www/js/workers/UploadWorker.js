// This file contains all the initialization required to set up an Angular environment in the Web Worker thread.

// Angular needs a global window object
self.window = self;

// Mock localStorage and sessionStorage objects to get Angular to load
self.localStorage = {};
self.sessionStorage = {};

// Skeleton properties to get Angular to load and bootstrap.
self.history = {};
self.document = {
	readyState: 'complete',
	querySelector: function() {},
	createElement: function() {
		return {
			pathname: '',
			setAttribute: function() {}
		}
	},
	cookie: "",
	getElementById: function() {}
};


// Load angular.js and angular-resource.js (required by lb-services.js)
self.importScripts('../../lib/angular/angular.js');
self.importScripts('../../lib/angular-resource/angular-resource.js')

// Put angular on global scope
self.angular = window.angular;

// Import necessary files
self.importScripts('UploadWorker-app.js');
self.importScripts('UploadWorkerService.js')
self.importScripts('../../js/services/WebApiService.js');

// No root element seems to work fine
self.angular.bootstrap(null, ['upload-worker']);

