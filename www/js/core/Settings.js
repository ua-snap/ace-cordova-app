// Class contains application-level settings.  Intended to be stored in LocalStorage and accessed from there.
var Settings = function() {
	// GPS settings
	this.gps = {
		timeout: 10,
		highAccuracy: true,
		positionTrackingEnabled: true,
		trackingInterval: 1,
		displayedHistoryPoints: 100
	};
};