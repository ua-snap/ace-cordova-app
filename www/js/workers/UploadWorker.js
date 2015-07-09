// Angular needs a global window object
self.window = self;
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
	cookie: ""
};


// Load Angular: must be on same domain as this script
self.importScripts('../../lib/angular/angular.js');
self.importScripts('../../lib/angular-resource/angular-resource.js')

// Put angular on global scope
self.angular = window.angular;

// Standard angular module definitions
self.importScripts('UploadWorker-app.js');
self.importScripts('../../js/services/lb-services.js');

// No root element seems to work fine
self.angular.bootstrap(null, ['upload-worker']);

