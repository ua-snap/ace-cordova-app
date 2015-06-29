// ReportController.js

/**
 * @module starter.controllers
 */
angular.module('starter.controllers')

// ReportController
//--------------------------------------------------------------

// Controller for the Report view.  This controller contains all the
// UI functionality for entering and saving reports
/**
 * @class ReportController
 * @description Controller for the Report view.  This controller contains all the
 * UI functionality for entering and saving reports.
 */
.controller('ReportController', function($scope, $ionicSideMenuDelegate, $ionicModal, $ionicPopover, $ionicLoading, DbService) {
  
  // Declare and initialize modal handler object
  $scope.modalHandler = new ModalHandler();
  
  // Adding beforeEnter event listener.  This function will be called just before every view load,
	// regardless of controller and state caching.  Here, this is used to enable the side menu drag functionality.
	$scope.$on('$ionicView.enter', function() {
		$ionicSideMenuDelegate.canDragContent(true);
	});
  
  /**
   * Field holds the contents of the current report that is being entered
   * 
   * @property report
   * @type WeatherReport
   * @default All fields initialized to ""
   */
  $scope.report = new WeatherReport();

  // Submit Popover functions
  //-------------------------------------------------------------------------------------
  
  // Create popover from template and save to $scope variable
  $ionicPopover.fromTemplateUrl('templates/popovers/submit.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.submitPopover = popover;
  });
  
  // Opens the submit popover.  Populates it with information from the current report ($scope.report)
  $scope.openPopover = function($event) {
    // Show the popover
    $scope.submitPopover.show($event);
    
    // Fill in each report element
    var clouds = document.getElementById("sumcat1");
    clouds.innerText = "Cloud Cover: " + $scope.report.cloudCover;
    
    var precip = document.getElementById("sumcat2");
    precip.innerText = "Precipitation: " + $scope.report.precipitation;
    
    var vis = document.getElementById("sumcat3");
    vis.innerText = "Visibility: " + $scope.report.visibility;
    
    var pressTrend = document.getElementById("sumcat4_1");
    pressTrend.innerText = "Pressure Trend: " + $scope.report.pressureTendency;
    
    var pressVal = document.getElementById("sumcat4_2");
    pressVal.innerText = "Surface Pressure: " + $scope.report.pressureValue + " hPa";
    
    var temp = document.getElementById("sumcat5");
    temp.innerText = "Surface Temperature: " + $scope.report.temperatureValue + " " + $scope.report.temperatureUnits;
    
    var wind = document.getElementById("sumcat6");
    wind.innerText = "Wind Speed: " + $scope.report.windValue + " " + $scope.report.windUnits;
    
    var windDir = document.getElementById("sumcat6_3");
    windDir.innerText = "Wind Direction: " + $scope.report.windDirection;
    
    var other = document.getElementById("sumcat9");
    other.innerText = "Other: " + $scope.report.other;
    
    var notes = document.getElementById("sumcat7");
    notes.innerText = "Notes:\n" + $scope.report.notes;
    
    var pic = document.getElementById("sumcat8");
    
  };
  
  // Closes the submit popover
  $scope.closePopover = function() {
    $scope.submitPopover.hide();
  };
  
  // Called when the "Send Report" button on the submit popover is touched.  Should be used to 
  // execute a network call to submit the report.  Currently, just provides a fake success notification
  $scope.submitReport = function() {
    $ionicLoading.show({template: 'Report Sent Successfully (un-implemented)', noBackdrop: true, duration: 1500});
    
    // Save report to database
    DbService.insertReport($scope.report, window);
    
    // Clear all entered data
    $scope.report = new WeatherReport();    
    
    // Clear modal and summary data
    $scope.cloudCoverModal.clearData();
    $scope.precipModal.clearData();
    $scope.visibilityModal.clearData();
    $scope.pressureModal.clearData();
    $scope.surfaceTempModal.clearData();
    $scope.windModal.clearData();
    $scope.notesModal.clearData();
    $scope.otherModal.clearData();
    
    // Hide the popover
    $scope.submitPopover.hide();
  };
  
  // DB setup
  //-------------------------------------------------------------------------------------
  document.addEventListener("deviceready", onDeviceReady, false);
  
  function onDeviceReady() {
    // Open Db and create tables if necessary
    DbService.openDatabase(window);
    DbService.createTables(window);
  };
  
  // Additional Options
  //--------------------------------------------------------------------------------------
  // Set up menu options popover
  // Create popover from template and save to $scope variable
  $ionicPopover.fromTemplateUrl('templates/popovers/report-options.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.optionsPopover = popover;
  });
  
  $scope.openOptionsMenu = function($event) {
      $scope.optionsPopover.show($event);
  };


  // Cloud Cover Modal Functions
  //--------------------------------------------------------------------------------------
  
  // Create cloudCoverModal from html
  $ionicModal.fromTemplateUrl('templates/modals/cloud_cover.html', {
      scope: $scope,
      animation: 'slide-in-up',
  }).then(function(modal) {
      $scope.cloudCoverModal = modal;
      $scope.cloudCoverModal.temp = "";
      $scope.cloudCoverModal.selection = "";  
      
      // Clear any Cloud Cover information 
      $scope.cloudCoverModal.clearData = function() {
        // Clear modal storage
        $scope.cloudCoverModal.temp = "";
        $scope.cloudCoverModal.selection = "";
        
        // Clear summary display
        document.getElementById("cloud_sum").innerText = "______";    
      };    
  });
  
  
  
  // Select a cloud cover value
  $scope.selectItemCat1 = function(id) {
    var handler = $scope.modalHandler;
    handler.setNewTempSelection(document, $scope.cloudCoverModal, id);
  };
  
  // Save cloud cover selections
  $scope.saveModal1 = function() {
      $scope.modalHandler.saveModal(document, $scope.cloudCoverModal, "cloud_sum", $scope.convertCategory1, function(str) {return str;});
      $scope.report.cloudCover = $scope.convertCategory1($scope.cloudCoverModal.selection);
  };
  
  // Cancel out of the cloud cover modal
  $scope.cancelModal1 = function() {
      $scope.cloudCoverModal.temp = "";
      $scope.cloudCoverModal.hide();
  };

  // Open cloud cover modal
  $scope.openModal1 = function() {
      $scope.modalHandler.openModal(document, $scope.cloudCoverModal);
  };  
  
  // Takes the id of the selected item on the cloud cover modal and returns the actual report value
  $scope.convertCategory1 = function(id) {
    
	var returnValue = "";
    
    // Convert item id to actual report value
    switch(id)
    {
      case "1opt1":
        returnValue = "No Clouds";
        break;
      case "1opt2":
        returnValue = "1/8th";
        break;
      case "1opt3":
        returnValue = "2/8ths";
        break;
      case "1opt4":
        returnValue = "3/8ths";
        break;
      case "1opt5":
        returnValue = "4/8ths";
        break;
      case "1opt6":
        returnValue = "5/8ths";
        break;
      case "1opt7":
        returnValue = "6/8ths";
        break;
      case "1opt8":
        returnValue = "7/8ths";
        break;
      case "1opt9":
        returnValue = "8/8ths";
        break; 
      case "1opt10":
        returnValue = "Sky Obscured";
        break;
      default:
        break;
    }
    
    return returnValue;
  };

  
  // Precipitation Modal Functions
  //-----------------------------------------------------------------------------------------------
  
  // Create precipitation modal from html
  $ionicModal.fromTemplateUrl('templates/modals/precip_modal.html', {
      scope: $scope,
      animation: 'slide-in-up',
  }).then(function(modal) {
      // Save the modal and initialize the selection and temp variables
      $scope.precipModal = modal;
      
      // Used to save the actual selection made by the user
      $scope.precipModal.selection = ""; 
      
      // Used to store any temporary selections made with the modal open
      $scope.precipModal.temp = "";     
      
      // Clear any precip data from modal storage
      $scope.precipModal.clearData = function() {
        // Clear modal storage
        $scope.precipModal.selection = "";
        $scope.precipModal.temp = "";
        
        // Clear summary
        document.getElementById("precip_sum").innerText = "______";    
      };
  });
  
  
  
  // Select a precipitation value.  Called when an item on the precipitation modal is selected
  $scope.selectItemCat2 = function(id) {
    var handler = $scope.modalHandler;
    handler.setNewTempSelection(document, $scope.precipModal, id);
  };
  
  // Save precipitation modal selections.  Called when the save button on the precip modal is selected.
  $scope.saveModal2 = function() {
      $scope.modalHandler.saveModal(document, $scope.precipModal, "precip_sum", $scope.convertCategory2, function(str) {return str;});
      $scope.report.precipitation = $scope.convertCategory2($scope.precipModal.selection);
  };
  
  // Cancel out of the precipitation modal.  Called when the cancel button on the precip modal is selected.
  $scope.cancelModal2 = function() {
      $scope.precipModal.temp = "";
      $scope.precipModal.hide();
  };

  // Open the precipitation modal
  $scope.openModal2 = function() {
      $scope.modalHandler.openModal(document, $scope.precipModal);
  };  
  
  // Converts id for the precip modal to the actual report value
  $scope.convertCategory2 = function(opt) {
    var returnValue = "";
    switch(opt)
    {
      case "2opt1":
        returnValue = "Light Rain";
        break;
      case "2opt2":
        returnValue = "Moderate Rain";
        break;
      case "2opt3":
        returnValue = "Heavy Rain";
        break;
      case "2opt4":
        returnValue = "Light Snow";
        break;
      case "2opt5":
        returnValue = "Moderate Snow";
        break;
      case "2opt6":
        returnValue = "Heavy Snow";
        break;
      case "2opt7":
        returnValue = "Freezing Rain";
        break;
      case "2opt8":
        returnValue = "Heavy Freezing Rain";
        break;
      case "2opt9":
        returnValue = "Rain & Snow";
        break; 
      case "2opt10":
        returnValue = "Heavy Rain & Snow";
        break;
      case "2opt11":
        returnValue = "Sleet";
        break;
      case "2opt12":
        returnValue = "Ice Needles";
        break;
      case "2opt13":
        returnValue = "Freezing Drizzle";
        break;
      case "2opt14":
        returnValue = "Thunderstorm";
        break;  
      case "2opt15":
        returnValue = "Thundersnow";
        break;
      case "2opt16":
        returnValue = "Virga";
        break;
      default:
        break;
    }
    
    return returnValue;
  };
  
  // Visibility Modal Functions
  //-----------------------------------------------------------------------------------------------

  // Create visibility modal from html
  $ionicModal.fromTemplateUrl('templates/modals/visibility_modal.html', {
      scope: $scope,
      animation: 'slide-in-up',
  }).then(function(modal) {
      // Save modal variable (for later acces)
      $scope.visibilityModal = modal;
      
      // Initialize selection variable.  Used to persist actual user selections
      $scope.visibilityModal.selection = "";   
      
      // Initialize temp variable.  Used to temporarily store user selections while modal is open
      $scope.visibilityModal.temp = "";  
      
      // Clear visibility data
      $scope.visibilityModal.clearData = function() {
        // Clear modal data
        $scope.visibilityModal.temp = "";
        $scope.visibilityModal.selection = "";
        
        // Clear summary
        document.getElementById("vis_sum").innerText = "______";
      }; 
  });
  
  // Select an item on the visibility modal
  $scope.selectItemCat3 = function(id) {
    var handler = $scope.modalHandler;
    handler.setNewTempSelection(document, $scope.visibilityModal, id);
  };
  
  // Save visibility modal selections
  $scope.saveModal3 = function() {
      $scope.modalHandler.saveModal(document, $scope.visibilityModal, "vis_sum", $scope.convertCategory3, function(str) {return str;});
      $scope.report.visibility = $scope.convertCategory3($scope.visibilityModal.selection);
  };
  
  // Cancel visibility modal
  $scope.cancelModal3 = function() {
      $scope.visibilityModal.temp = "";
      $scope.visibilityModal.hide();
  };

  // Open visibility modal
  $scope.openModal3 = function() {
      $scope.modalHandler.openModal(document, $scope.visibilityModal);
  };  
  
  // Conversion function for visibility.  Takes in the id of the user selection from the modal and returns the actual report value.
  $scope.convertCategory3 = function(opt) {
    var returnValue = "";
    switch(opt)
    {
      case "3opt1":
        returnValue = "Mist";
        break;
      case "3opt3":
        returnValue = "Patchy Fog";
        break;
      case "3opt3":
        returnValue = "Fog";
        break;
      case "3opt4":
        returnValue = "Ice Fog";
        break;
      case "3opt5":
        returnValue = "Haze";
        break;
      case "3opt6":
        returnValue = "Blowing Snow";
        break;
      case "3opt7":
        returnValue = "Smoke";
        break;
      default:
        break;
    }
    
    return returnValue;
  };
  
  // Pressure Modal Functions
  //-----------------------------------------------------------------------------------------------------
  
  // Create pressure modal from html
  $ionicModal.fromTemplateUrl('templates/modals/pressure_modal.html', {
      scope: $scope,
      animation: 'slide-in-up',
  }).then(function(modal) {
      // Save modal variable
      $scope.pressureModal = modal;
      
      // Initialize selection and temp variables
      $scope.pressureModal.selection = "";
      $scope.pressureModal.temp = "";
      $scope.pressureModal.input = "";
      $scope.pressureModal.inputTemp = "";
      
      // Clear out any pressure data
      $scope.pressureModal.clearData = function() {
        // Clear modal storage
        $scope.pressureModal.selection = "";
        $scope.pressureModal.temp = "";
        $scope.pressureModal.input = "";
        $scope.pressureModal.inputTemp = "";
        
        // Clear summary
        document.getElementById("pressure_sum").innerText = "______";
      };
  });
  
  // Open pressure modal
  $scope.openModal4 = function() {
    $scope.modalHandler.openModal(document, $scope.pressureModal);
    
    // Handle any previous pressure value (using angular data binding)
    if($scope.pressureModal.input && $scope.pressureModal.input != "")
    {
      $scope.pressureModal.inputTemp = $scope.pressureModal.input;
    }
  };
  
  // Select an item on pressure modal
  $scope.selectItemCat4 = function(id) {
    var handler = $scope.modalHandler;
    handler.setNewTempSelection(document, $scope.pressureModal, id);
  };
  
  // Cancel pressure modal
  $scope.cancelModal4 = function() {
      $scope.pressureModal.temp = "";
      $scope.pressureModal.inputTemp = "";
      $scope.pressureModal.hide();
  };
  
  // Save pressure modal selections
  $scope.saveModal4 = function() {
      $scope.modalHandler.saveModal(document, $scope.pressureModal, "pressure_sum", $scope.convertCategory4, function(str) {return $scope.pressureModal.inputTemp + " hPa";}, true);
      
      $scope.pressureModal.input = $scope.pressureModal.inputTemp;
      
      $scope.report.pressureTendency = $scope.convertCategory4($scope.pressureModal.selection);
      $scope.report.pressureValue = $scope.pressureModal.input;
      
      document.getElementById("pressure_sum").innerText = $scope.pressureModal.input + " hPa";
  };
  
  // Conversion function for pressure modal.  Takes in the id of the user selection on the UI and returns the actual
  // report value
  $scope.convertCategory4 = function(opt) {
    var returnValue = "";
    switch(opt)
    {
      case "4opt1":
        returnValue = "Upward";
        break;
      case "4opt2":
        returnValue = "No Change";
        break;
      case "4opt3":
        returnValue = "Downward";
        break;
      default:
        break;
    }
    
    return returnValue;
  };
  
  // Surface Temperature Modal Functions
  //-----------------------------------------------------------------------------------------------------
  
  // Create temperature modal from html
  $ionicModal.fromTemplateUrl('templates/modals/surf_temp_modal.html', {
      scope: $scope,
      animation: 'slide-in-up',
  }).then(function(modal) {
      // Save modal variable (for later access)
      $scope.surfaceTempModal = modal;
      
      // Initialize all input, select, and temp variables
      $scope.surfaceTempModal.input = "";
      $scope.surfaceTempModal.inputTemp = "";
      
      // For units
      $scope.surfaceTempModal.selectTemp = "";
      $scope.surfaceTempModal.select = "";
      
      // Clear out any temperature data
      $scope.surfaceTempModal.clearData = function() {
        // Clear modal storage
        $scope.surfaceTempModal.input = "";
        $scope.surfaceTempModal.inputTemp = "";
        $scope.surfaceTempModal.selectTemp = "";
        $scope.surfaceTempModal.select = "";
        
        // Clear summary
        document.getElementById("temp_sum").innerText = "______";
      };
  });
  
  // Open temperature modal
  $scope.openModal5 = function() {
    $scope.modalHandler.openModal(document, $scope.surfaceTempModal);
    
    // Handle any previous temperature value
    if($scope.surfaceTempModal.input && $scope.surfaceTempModal.input != "")
    {
      $scope.surfaceTempModal.inputTemp = $scope.surfaceTempModal.input;
    }
    
    // Handle any previous temperature units selection
    if($scope.surfaceTempModal.select && $scope.surfaceTempModal.select != "")
    {
      $scope.surfaceTempModal.selectTemp = $scope.surfaceTempModal.select;
    }
    else 
    {
      document.getElementById("tempsel").selectedIndex = 1;
    }
  };
  
  // Cancel temperature modal
  $scope.cancelModal5 = function() {
      $scope.surfaceTempModal.inputTemp = "";
      $scope.surfaceTempModal.selectTemp = "";
      $scope.surfaceTempModal.hide();
  };
  
  // Save temperature modal selections
  $scope.saveModal5 = function() {
      // Save value
      $scope.surfaceTempModal.input = $scope.surfaceTempModal.inputTemp;
      $scope.surfaceTempModal.select = $scope.surfaceTempModal.selectTemp;
      
      // Save units
      $scope.report.temperatureValue = $scope.surfaceTempModal.input;
      $scope.report.temperatureUnits = $scope.surfaceTempModal.select;
      
      // Update the summary on the tab-report.html page
      document.getElementById('temp_sum').innerText = $scope.report.temperatureValue + " " + $scope.report.temperatureUnits;
      
      $scope.surfaceTempModal.hide();
  };
  
  
  // Wind modal Functions
  //-----------------------------------------------------------------------------------------------------
  
  // Create wind modal from html
  $ionicModal.fromTemplateUrl('templates/modals/wind_modal.html', {
      scope: $scope,
      animation: 'slide-in-up',
  }).then(function(modal) {
      $scope.windModal = modal;
      
      // Wind value variables
      $scope.windModal.input = "";
      $scope.windModal.inputTemp = "";
      
      // Wind units variables
      $scope.windModal.select1Temp = "";
      $scope.windModal.select1 = "";
      
      // Wind direction variables
      $scope.windModal.select2Temp = "";
      $scope.windModal.select2 = "";
      
      // Clear any wind data from modal storage
      $scope.windModal.clearData =  function() {
        // Clear modal storage
        $scope.windModal.input = "";
        $scope.windModal.inputTemp = "";
        $scope.windModal.select1Temp = "";
        $scope.windModal.select1 = "";
        $scope.windModal.select2Temp = "";
        $scope.windModal.select2 = "";
        
        // Clear summary
        document.getElementById("wind_sum").innerText = "______";
      };
  
  });
  
  
  // Open wind modal
  $scope.openModal6 = function() {
    // Open the modal
    $scope.modalHandler.openModal(document, $scope.windModal);
    
    // Handle any previous wind value entries (using angular data binding)
    if($scope.windModal.input && $scope.windModal.input != "")
    {
      $scope.windModal.inputTemp = $scope.windModal.input;
    }
    
    // Handle any previous wind units selections
    if($scope.windModal.select1 && $scope.windModal.select1 != "")
    {
      $scope.windModal.select1Temp = $scope.windModal.select1;
    }
    else
    {
      // Default to the 1st value (knots) selected
      document.getElementById("wind_sel_units").selectedIndex = 1;
    }
    
    // Handle any previous wind direction values
    if($scope.windModal.select2 && $scope.windModal.select2 != "")
    {
      $scope.windModal.select2Temp = $scope.windModal.select2;
    }
  };
  
  // Cancel wind modal
  $scope.cancelModal6 = function() {
      $scope.windModal.inputTemp = "";
      $scope.windModal.select1Temp = "";
       $scope.windModal.select2Temp = "";
      $scope.windModal.hide();
  };
  
  // Save wind modal selections
  $scope.saveModal6 = function() {
      // Save wind speed value
      $scope.windModal.input = $scope.windModal.inputTemp;
      
      // Save wind units value
      $scope.windModal.select1 = $scope.windModal.select1Temp;
      
      // Save wind direction value
      $scope.windModal.select2 = $scope.windModal.select2Temp;
      
      // Load values into report
      $scope.report.windValue = $scope.windModal.input;
      $scope.report.windUnits = $scope.windModal.select1;
      $scope.report.windDirection = $scope.windModal.select2;
      
      // Update the summary element on the tab-report.html view
      document.getElementById('wind_sum').innerText = $scope.report.windValue + " " + $scope.report.windUnits + " " + $scope.report.windDirection;
      
      // close the modal
      $scope.windModal.hide();
  };
  
  
  
  // Notes Modal Functions
  //-----------------------------------------------------------------------------------------------------
  
  // Create Notes modal from html
  $ionicModal.fromTemplateUrl('templates/modals/notes_modal.html', {
      scope: $scope,
      animation: 'slide-in-up',
  }).then(function(modal) {
      $scope.notesModal = modal;
      $scope.notesModal.input = "";
      $scope.notesModal.inputTemp = "";
      
      // Clear any notes data from modal storage
      $scope.notesModal.clearData = function() {
        // Clear modal storage
        $scope.notesModal.input = "";
        $scope.notesModal.inputTemp = "";
        
        // Clear summary
        document.getElementById("notes_sum").innerText = "______"; 
      };
  
  });
  
  // Open notes modal
  $scope.openModal7 = function() {
    $scope.modalHandler.openModal(document, $scope.notesModal);
    
    if($scope.notesModal.input && $scope.notesModal.input != "")
    {
      $scope.notesModal.inputTemp = $scope.notesModal.input;
    }
    
  };
  
  // Cancel notes modal
  $scope.cancelModal7 = function() {
      $scope.notesModal.inputTemp = "";
      $scope.notesModal.hide();
  };
  
  // Save notes modal selections
  $scope.saveModal7 = function() {
      // Save notes value
      $scope.notesModal.input = $scope.notesModal.inputTemp;
      
      // Load into report
      $scope.report.notes = $scope.notesModal.input;
      
      // Update summary on tab-report.html
      document.getElementById('notes_sum').innerText = $scope.report.notes;
      
      // close out the modal
      $scope.notesModal.hide();
  };
  
  // Camera Modal Functions
  //-----------------------------------------------------------------------------------------------------
  
  // Function called when the camera modal is selected on the 
  $scope.reportCategory8 = function() {
      $scope.openModal8();
  };
  
  // Create Camera modal from html
  $ionicModal.fromTemplateUrl('templates/modals/camera_modal.html', {
      scope: $scope,
      animation: 'slide-in-up',
  }).then(function(modal) {
      $scope.cameraModal = modal;
  });
  
  // Take a picture
  $scope.takePic = function() {
    navigator.device.capture.captureImage(function(mediaFiles) {
      var image = document.getElementById("modal9preview");
      image.src = mediaFiles[0].fullPath;
      alert(mediaFiles[0].name);
      
      }, function() {alert("error");}, {limit:1});
  };
  
  // Take a video
  $scope.takeVid = function() {
    navigator.device.capture.captureVideo(function() {alert("success");}, function() {alert("error");}, {limit:1});
  };
  
  // Select a picture from the file browser
  $scope.selectPic = function() {
    navigator.camera.getPicture(function() {alert("success");}, function() {alert("error");}, {quality: 50, destinationType: Camera.DestinationType.FILE_URI, sourceType: Camera.PictureSourceType.PHOTOLIBRARY})
  };
  
  // Open the camera modal
  $scope.openModal8 = function() {
      $scope.cameraModal.show();
  };
  
  // Close the camera modal
  $scope.closeModal8 = function() {
      $scope.cameraModal.hide();
  };
  
  // Function called when user presses cancel on modal8
  $scope.cancelModal8 = function() {
      this.closeModal8();
  };

  // Function called when user presses save on modal8
  $scope.saveModal8 = function() {
      this.closeModal8();
  };

  // Category 9 Functions
  //--------------------------------------------------------------------------------------
  
  // Function called when the category 9 option button is pressed
  $scope.reportCategory9 = function() {
      $scope.openModal9();
  };
  
  // Other Modal Functions
  //--------------------------------------------------------------------------------------
  
  // Create other modal (aurora borealis and tornado) from html
  $ionicModal.fromTemplateUrl('templates/modals/other_modal.html', {
      scope: $scope,
      animation: 'slide-in-up',
  }).then(function(modal) {
      // Save modal variable for later access
      $scope.otherModal = modal;
      
      // Initialize selection and temp variables
      $scope.otherModal.selection = "";    
      $scope.otherModal.temp = "";  
      
      // Clear out "Other" data from the modal
      $scope.otherModal.clearData = function() {
        // Clear modal storage
        $scope.otherModal.selection = "";
        $scope.otherModal.temp = "";
        
        // Clear summary
        document.getElementById("other_sum").innerText = "______";
      };
  });
  
  // Select an item on the other modal
  $scope.selectItemCat9 = function(id) {
    var handler = $scope.modalHandler;
    handler.setNewTempSelection(document, $scope.otherModal, id);
  };
  
  // Save other modal selections
  $scope.saveModal9 = function() {
      $scope.modalHandler.saveModal(document, $scope.otherModal, "other_sum", $scope.convertCategory9, function(str) {return str;});
      $scope.report.other = $scope.convertCategory9($scope.otherModal.selection);
  };
  
  // Cancel out of the other modal
  $scope.cancelModal9 = function() {
      // Reset any temporary selections and close the modal
      $scope.otherModal.temp = "";
      $scope.otherModal.hide();
  };

  // Open the Other modal
  $scope.openModal9 = function() {
      $scope.modalHandler.openModal(document, $scope.otherModal);
  };  
  
  // Takes in an id string representing the item selected in the modal.  Returns the corresponding report string value.
  $scope.convertCategory9 = function(opt) {
    var returnValue = "";
    switch(opt)
    {
      case "9opt1":
        returnValue = "Aurora Borealis";
        break;
      case "9opt2":
        returnValue = "Tornado";
        break;
      default:
        break;
    }
    
    return returnValue;
  };
  
  // onDestroy function for the ReportController.  This implemnetation will remove all modals.
  /**
   * @method onDestroy
   * @description Called when the controller is about to be destroyed.  Used here to release all modal resources.
   */
  $scope.$on('$destroy', function() {
      // Cleanup all modals
      $scope.cloudCoverModal.remove();
      $scope.precipModal.remove();
      $scope.visibilityModal.remove();
      $scope.pressureModal.remove();
      $scope.surfaceTempModal.remove();
      $scope.windModal.remove();
      $scope.notesModal.remove();
      $scope.cameraModal.remove();
      $scope.otherModal.remove();
      
      // Cleanup submit popover
      $scope.submitPopover.remove();
  });
});
