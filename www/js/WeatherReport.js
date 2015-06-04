// WeatherReport.js

// WeatherReport
//-------------------------------------------------------------------------

// This class serves as a data container for all the information pertaining to Weather reports.

/**
 * @class WeatherReport
 * @description This class serves as a data container for all the information pertaining to Weather reports.
 * @constructor Initializes all values to "".
 */
var WeatherReport = function() {
	/**
	 * Stores the user selection for cloud cover
	 * 
	 * @property cloudCover
	 * @type string
	 * @default ""
	 */
	this.cloudCover = "";
	
	/**
	 * Precipitation variable
	 * 
	 * @property precipitation
	 * @type string
	 * @default ""
	 */
	this.precipitation = "";
	
	/**
	 * Visibility
	 * 
	 * @property visibility	 
	 * @type string
	 * @default ""
	 */
	this.visibility = "";
	
	/**
	 * Pressure Tendency (Upward, No Change, or Downward)
	 * 
	 * @property pressureTendency
	 * @type string
	 * @default ""
	 */
	this.pressureTendency = "";
	
	/**
	 * Pressure Value (restricted to hPa units)
	 * 
	 * @property pressureValue
	 * @type string
	 * @default ""
	 */
	this.pressureValue = "";
	
	/**
	 * Temperature value
	 * 
	 * @property temperatureValue
	 * @type string
	 * @default ""
	 */
	this.tempuratureValue = "";
	
	/**
	 * Temperature units (deg C or deg F)
	 * @property temperatureUnits
	 * @type string
	 * @default ""
	 */
	this.tempuratureUnits = "";
	
	/**
	 * Wind value
	 * 
	 * @property windValue
	 * @type string
	 * @default ""
	 */
	this.windValue = "";
	
	/**
	 * Wind units
	 * 
	 * @property windUnits
	 * @type string
	 * @default ""
	 */
	this.windUnits = "";
	
	/**
	 * Wind direction
	 * 
	 * @property windDirection
	 * @type string
	 * @default ""
	 */
	this.windDirection = "";
	
	/**
	 * Notes
	 * @property notes
	 * @type string
	 * @default ""
	 */
	this.notes = "";
	
	/**
	 * Field for camera
	 * 
	 * @property camera
	 * @type string
	 * @default ""
	 */
	this.camera = "";
	
	/**
	 * Other (Aurora Borealis or Tornado)
	 * @property other
	 * @type string
	 * @default ""
	 */
	this.other = "";
};