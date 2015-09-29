// Settings.js

/**
 * Class contains application-level settings.  Intended to be stored in LocalStorage and accessed from there via the
 * SettingsService.
 * 
 * @class Settings
 * @constructor
 */

// Settings
//------------------------------------------------------------------------------

// Class contains application-level settings.  Intended to be stored in LocalStorage and accessed from there via the
// SettingsService.
// Note: this class contains the DEFAULT SETTINGS for the ACE mobile app
var Settings = function() {
	// GPS settings
	this.gps = {
		timeout: 10,
		highAccuracy: true,
		positionTrackingEnabled: true,
		trackingInterval: 15,
		displayedHistoryPoints: 100
	};
	
	// General settings
	this.general = {
		notifications: true,
		syncInterval: 5,
		units: "Imperial"
	};
	
	// Language settings
	this.language = "en";
};