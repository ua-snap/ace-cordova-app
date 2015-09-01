// WeatherReport.js

/**
 * @class WeatherReport
 * @description This class serves as a data container for all the information pertaining to Weather reports.
 * @constructor Initializes all values to "".
 */

// WeatherReport
//-------------------------------------------------------------------------

// This class serves as a data container for all the information pertaining to Weather reports.
var WeatherReport = function() {
	/**
	 * Stores the user selection for cloud cover
	 * 
	 * @property cloudCover
	 * @type string
	 * @default ""
	 */
	
	// Stores the user selection for cloud cover
	this.cloudCover = "";
	
	/**
	 * Precipitation variable
	 * 
	 * @property precipitation
	 * @type string
	 * @default ""
	 */
	
	// Precipitation variable
	this.precipitation = "";
	
	/**
	 * Visibility
	 * 
	 * @property visibility	 
	 * @type string
	 * @default ""
	 */
	
	// Visibility
	this.visibility = "";
	
	/**
	 * Pressure Tendency (Upward, No Change, or Downward)
	 * 
	 * @property pressureTendency
	 * @type string
	 * @default ""
	 */
	
	// Pressure Tendency (Upward, No Change, or Downward)
	this.pressureTendency = "";
	
	/**
	 * Pressure Value (restricted to hPa units)
	 * 
	 * @property pressureValue
	 * @type string
	 * @default ""
	 */
	
	// Pressure Value (restricted to hPa units)
	this.pressureValue = "";
	
	/**
	 * Temperature value
	 * 
	 * @property temperatureValue
	 * @type string
	 * @default ""
	 */
	
	// Temperature value
	this.temperatureValue = "";
	
	/**
	 * Temperature units (deg C or deg F)
	 * 
	 * @property temperatureUnits
	 * @type string
	 * @default ""
	 */
	
	// Temperature units (deg C or deg F)
	this.temperatureUnits = "";
	
	/**
	 * Wind value
	 * 
	 * @property windValue
	 * @type string
	 * @default ""
	 */
	
	// Wind value
	this.windValue = "";
	
	/**
	 * Wind units
	 * 
	 * @property windUnits
	 * @type string
	 * @default ""
	 */
	
	// Wind units
	this.windUnits = "";
	
	/**
	 * Wind direction
	 * 
	 * @property windDirection
	 * @type string
	 * @default ""
	 */
	
	// Wind direction
	this.windDirection = "";
	
	/**
	 * Notes
	 * @property notes
	 * @type string
	 * @default ""
	 */
	
	// Notes
	this.notes = "";
	
	/**
	 * Field for camera
	 * 
	 * @property camera
	 * @type string
	 * @default ""
	 */
	
	// Field for camera
	this.attachment = "";
	
	/**
	 * Other (Aurora Borealis or Tornado)
	 * @property other
	 * @type string
	 * @default ""
	 */
	
	// Other (Aurora Borealis or Tornado)
	this.other = "";
};