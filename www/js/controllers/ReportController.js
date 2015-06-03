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
 * UI functionality for entering and saving reports
 */
.controller('ReportController', function($scope, $ionicSideMenuDelegate, $ionicModal, $ionicPopover, $ionicLoading) {
  
  // Declare and initialize modal handler object
  $scope.modalHandler = new ModalHandler();
  
  // Adding beforeEnter event listener.  This function will be called just before every view load,
	// regardless of controller and state caching.
	$scope.$on('$ionicView.enter', function() {
		$ionicSideMenuDelegate.canDragContent(true);
	});
  
  /**
   * @property
   */
  $scope.report = new WeatherReport();

  // Submit Popover functions
  //-------------------------------------------------------------------------------------
  
  // Create popover from template and save to $scope variable
  $ionicPopover.fromTemplateUrl('templates/popovers/submit.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });
  
  // Opens the submit popover
  /**
   * @method openPopover
   * @description Opens the submit popover
   * @param {element} The $event or target element which the popover should align itself to (from ionic documentation)
   * @return void
   * @throws none
   */  
  $scope.openPopover = function($event) {
    // Show the popover
    $scope.popover.show($event);
    
    // Fill in each report element
    var cat1 = document.getElementById("sumcat1");
    cat1.innerText = "Cloud Cover: " + $scope.report.cloudCover;
    
    var cat2 = document.getElementById("sumcat2");
    cat2.innerText = "Precipitation: " + $scope.report.precipitation;
    
    var cat3 = document.getElementById("sumcat3");
    cat3.innerText = "Visibility: " + $scope.report.visibility;
    
    var cat4_1 = document.getElementById("sumcat4_1");
    cat4_1.innerText = "Pressure Trend: " + $scope.report.pressureTendency;
    
    var cat4_2 = document.getElementById("sumcat4_2");
    cat4_2.innerText = "Surface Pressure: " + $scope.report.pressureValue + " hPa";
    
    var cat5 = document.getElementById("sumcat5");
    cat5.innerText = "Surface Temperature: " + $scope.report.temperatureValue + " " + $scope.report.temperatureUnits;
    
    var cat6 = document.getElementById("sumcat6");
    cat6.innerText = "Wind Speed: " + $scope.report.windValue + " " + $scope.report.windUnits;
    
    var cat6_3 = document.getElementById("sumcat6_3");
    cat6_3.innerText = "Wind Direction: " + $scope.report.windDirection;
    
    var cat9 = document.getElementById("sumcat9");
    cat9.innerText = "Other: " + $scope.report.category9;
    
    var cat7 = document.getElementById("sumcat7");
    cat7.innerText = "Notes:\n" + $scope.report.notes_1;
    
    var cat8 = document.getElementById("sumcat8");
    
  };
  
  // Closes the submit popover
  /**
   * @method closePopover
   * @description Closes the submit popover
   * @return void
   * @throws none
   */
  $scope.closePopover = function() {
    $scope.popover.hide();
  };
  
  // Called when the "Send Report" button on the submit popover is touched.  Should be used to 
  // execute a network call to submit the report.  Currently, just provides a fake success notification
  /**
   * @method submitReport
   * @description Called when the "Send Report" button on the submit popover is touched.  Should be used to 
   *              execute a network call to submit the report.  Currently, just provides a fake success notification
   * @return void
   * @throws none
   */
  $scope.submitReport = function() {
    $ionicLoading.show({template: 'Report Sent Successfully (un-implemented)', noBackdrop: true, duration: 1500});
    $scope.popover.hide();
  };
  
  // General Utility Functions
  //-------------------------------------------------------------------------------------
  
  // Changes the background of a div to indicate that it is selected.
  // Also clears out any other previously selected div's.
  /**
   * @method toggleAndSelect
   * @description Changes the background of a div to indicate that it is selected.
   *              Also clears out any other previously selected div's.
   * @param {string} id The id of the div to highlight as selected
   * @param {ionicModal} modal The modal to save the selection to.  Note that the result will be saved in the modal's "selection" field.
   *        Additionally, the modal must contain a "clearAllSelectedColors()" function that clears any previously selected items.
   */
  $scope.toggleAndSelect = function(id, modal) {
      // Get the previously selected div
      var div = document.getElementById(id);
      
      // Check previous background color
      if(div.style.backgroundColor === "rgb(149, 206, 226)")
      {
        // If previously selected, reset the color and the selection
        div.style.backgroundColor = "transparent";
        modal.selection = "";
      }
      else {
        // Reset any previous selections and modify div and current selection
        modal.clearAllSelectedColors();
        div.style.backgroundColor = "rgb(149, 206, 226)";
        modal.selection = id;
      }
  };
  
  $scope.closeModal = function(modal) {
    if(modal.clearAllSelectedColors())
    {
      modal.clearAllSelectedColors();
    }
    modal.hide();
  };


  // Category1 Functions
  //--------------------------------------------------------------------------------------
  
  // Create modal1 from html
  $ionicModal.fromTemplateUrl('templates/modals/cloud_cover.html', {
      scope: $scope,
      animation: 'slide-in-up',
  }).then(function(modal) {
      $scope.cloudCoverModal = modal;
      $scope.cloudCoverModal.selection = "";      
  });
  
  // Select an item on category 1
  $scope.selectItemCat1 = function(id) {
    var handler = $scope.modalHandler;
    handler.setNewTempSelection(document, $scope.cloudCoverModal, id);
  };
  
  // Save category 1 modal selections
  $scope.saveModal1 = function() {
      $scope.modalHandler.saveModal(document, $scope.cloudCoverModal, "cat1sum", $scope.convertCategory1, function(str) {return str;});
      $scope.report.cloudCover = $scope.convertCategory1($scope.cloudCoverModal.selection);
  };
  
  $scope.cancelModal1 = function() {
      $scope.cloudCoverModal.temp = "";
      $scope.cloudCoverModal.hide();
  };

   $scope.openModal1 = function() {
      $scope.modalHandler.openModal(document, $scope.cloudCoverModal);
  };  
  
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

  
  // Category2 Functions
  //-----------------------------------------------------------------------------------------------
  
  // Create modal1 from html
  $ionicModal.fromTemplateUrl('templates/modals/precip_modal.html', {
      scope: $scope,
      animation: 'slide-in-up',
  }).then(function(modal) {
      $scope.precipModal = modal;
      $scope.precipModal.selection = "";      
  });
  
  // Select an item on category 2
  $scope.selectItemCat2 = function(id) {
    var handler = $scope.modalHandler;
    handler.setNewTempSelection(document, $scope.precipModal, id);
  };
  
  // Save category 1 modal selections
  $scope.saveModal2 = function() {
      $scope.modalHandler.saveModal(document, $scope.precipModal, "cat2sum", $scope.convertCategory2, function(str) {return str;});
      $scope.report.precipitation = $scope.convertCategory2($scope.precipModal.selection);
  };
  
  $scope.cancelModal2 = function() {
      $scope.precipModal.temp = "";
      $scope.precipModal.hide();
  };

   $scope.openModal2 = function() {
      $scope.modalHandler.openModal(document, $scope.precipModal);
  };  
  
  // Converts id for category 2 to the correct report value
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
  
  // Category3 Functions
  //-----------------------------------------------------------------------------------------------

  // Create modal3 from html
  $ionicModal.fromTemplateUrl('templates/modals/visibility_modal.html', {
      scope: $scope,
      animation: 'slide-in-up',
  }).then(function(modal) {
      $scope.visibilityModal = modal;
      $scope.visibilityModal.selection = "";      
  });
  
  // Select an item on category 3
  $scope.selectItemCat3 = function(id) {
    var handler = $scope.modalHandler;
    handler.setNewTempSelection(document, $scope.visibilityModal, id);
  };
  
  // Save category 3 modal selections
  $scope.saveModal3 = function() {
      $scope.modalHandler.saveModal(document, $scope.visibilityModal, "cat3sum", $scope.convertCategory3, function(str) {return str;});
      $scope.report.visibility = $scope.convertCategory3($scope.visibilityModal.selection);
  };
  
  // Cancel modal 3
  $scope.cancelModal3 = function() {
      $scope.visibilityModal.temp = "";
      $scope.visibilityModal.hide();
  };

  // Open modal 3
  $scope.openModal3 = function() {
      $scope.modalHandler.openModal(document, $scope.visibilityModal);
  };  
  
  // Conversion function for category3
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
  
  // Category 4 Functions
  //-----------------------------------------------------------------------------------------------------
  
  // Create modal4 from html
  $ionicModal.fromTemplateUrl('templates/modals/pressure_modal.html', {
      scope: $scope,
      animation: 'slide-in-up',
  }).then(function(modal) {
      $scope.pressureModal = modal;
      $scope.pressureModal.selection = "";
      $scope.pressureModal.temp = "";
      $scope.pressureModal.input = "";
      $scope.pressureModal.inputTemp = "";
  });
  
  // Open modal 4
  $scope.openModal4 = function() {
    $scope.modalHandler.openModal(document, $scope.pressureModal);
    
    // Handle pressure value
    if($scope.pressureModal.input && $scope.pressureModal.input != "")
    {
      $scope.pressureModal.inputTemp = $scope.pressureModal.input;
    }
  };
  
  // Select an item on category 4
  $scope.selectItemCat4 = function(id) {
    var handler = $scope.modalHandler;
    handler.setNewTempSelection(document, $scope.pressureModal, id);
  };
  
  // Cancel modal 4
  $scope.cancelModal4 = function() {
      $scope.pressureModal.temp = "";
      $scope.pressureModal.inputTemp = "";
      $scope.pressureModal.hide();
  };
  
  // Save category 4 modal selections
  $scope.saveModal4 = function() {
      $scope.modalHandler.saveModal(document, $scope.pressureModal, "cat4sum", $scope.convertCategory4, function(str) {return $scope.pressureModal.inputTemp + " hPa";}, true);
      
      $scope.pressureModal.input = $scope.pressureModal.inputTemp;
      
      $scope.report.pressureTendency = $scope.convertCategory4($scope.pressureModal.selection);
      $scope.report.categoty4_2 = $scope.pressureModal.input;
  };
  
  // Conversion function for category 4
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
  
  // Category 5 Functions
  //-----------------------------------------------------------------------------------------------------
  
  // Create modal5 from html
  $ionicModal.fromTemplateUrl('templates/modals/surf_temp_modal.html', {
      scope: $scope,
      animation: 'slide-in-up',
  }).then(function(modal) {
      $scope.surfaceTempModal = modal;
      $scope.surfaceTempModal.input = "";
      $scope.surfaceTempModal.inputTemp = "";
      $scope.surfaceTempModal.selectTemp = "";
      $scope.surfaceTempModal.select = "";
  });
  
  // Open modal 5
  $scope.openModal5 = function() {
    $scope.modalHandler.openModal(document, $scope.surfaceTempModal);
    
    if($scope.surfaceTempModal.input && $scope.surfaceTempModal.input != "")
    {
      $scope.surfaceTempModal.inputTemp = $scope.surfaceTempModal.input;
    }
    
    if($scope.surfaceTempModal.select && $scope.surfaceTempModal.select != "")
    {
      $scope.surfaceTempModal.selectTemp = $scope.surfaceTempModal.select;
    }
    else 
    {
      document.getElementById("tempsel").selectedIndex = 1;
    }
  };
  
  // Cancel modal 5
  $scope.cancelModal5 = function() {
      $scope.surfaceTempModal.inputTemp = "";
      $scope.surfaceTempModal.selectTemp = "";
      $scope.surfaceTempModal.hide();
  };
  
  // Save category 5 modal selections
  $scope.saveModal5 = function() {
      $scope.surfaceTempModal.input = $scope.surfaceTempModal.inputTemp;
      $scope.surfaceTempModal.select = $scope.surfaceTempModal.selectTemp;
      
      $scope.report.temperatureValue = $scope.surfaceTempModal.input;
      $scope.report.temperatureUnits = $scope.surfaceTempModal.select;
      
      document.getElementById('cat5sum').innerText = $scope.report.temperatureValue + " " + $scope.report.temperatureUnits;
      
      $scope.surfaceTempModal.hide();
  };
  
  
  // Category 6 Functions
  //-----------------------------------------------------------------------------------------------------
  
  // Create modal6 from html
  $ionicModal.fromTemplateUrl('templates/modals/wind_modal.html', {
      scope: $scope,
      animation: 'slide-in-up',
  }).then(function(modal) {
      $scope.windModal = modal;
      $scope.windModal.input = "";
      $scope.windModal.inputTemp = "";
      $scope.windModal.select1Temp = "";
      $scope.windModal.select1 = "";
      $scope.windModal.select2Temp = "";
      $scope.windModal.select2 = "";
  });
  
  // Open modal 6
  $scope.openModal6 = function() {
    $scope.modalHandler.openModal(document, $scope.windModal);
    
    if($scope.windModal.input && $scope.windModal.input != "")
    {
      $scope.windModal.inputTemp = $scope.windModal.input;
    }
    
    if($scope.windModal.select1 && $scope.windModal.select1 != "")
    {
      $scope.windModal.select1Temp = $scope.windModal.select1;
    }
    
    if($scope.windModal.select2 && $scope.windModal.select2 != "")
    {
      $scope.windModal.select2Temp = $scope.windModal.select2;
    }
  };
  
  // Cancel modal 6
  $scope.cancelModal6 = function() {
      $scope.windModal.inputTemp = "";
      $scope.windModal.select1Temp = "";
       $scope.windModal.select2Temp = "";
      $scope.windModal.hide();
  };
  
  // Save category 6 modal selections
  $scope.saveModal6 = function() {
      $scope.windModal.input = $scope.windModal.inputTemp;
      $scope.windModal.select1 = $scope.windModal.select1Temp;
      $scope.windModal.select2 = $scope.windModal.select2Temp;
      
      $scope.report.windValue = $scope.windModal.input;
      $scope.report.windUnits = $scope.windModal.select1;
      $scope.report.windDirection = $scope.windModal.select2;
      
      document.getElementById('cat6sum').innerText = $scope.report.windValue + " " + $scope.report.windUnits + " " + $scope.report.windDirection;
      
      $scope.windModal.hide();
  };
  
  
  
  // Category 7 Functions
  //-----------------------------------------------------------------------------------------------------
  
  // Create modal7 from html
  $ionicModal.fromTemplateUrl('templates/modals/notes_modal.html', {
      scope: $scope,
      animation: 'slide-in-up',
  }).then(function(modal) {
      $scope.notesModal = modal;
      $scope.notesModal.input = "";
      $scope.notesModal.inputTemp = "";
  });
  
  // Open modal 7
  $scope.openModal7 = function() {
    $scope.modalHandler.openModal(document, $scope.notesModal);
    
    if($scope.notesModal.input && $scope.notesModal.input != "")
    {
      $scope.notesModal.inputTemp = $scope.notesModal.input;
    }
    
  };
  
  // Cancel modal 7
  $scope.cancelModal7 = function() {
      $scope.notesModal.inputTemp = "";
      $scope.notesModal.hide();
  };
  
  // Save category 7 modal selections
  $scope.saveModal7 = function() {
      $scope.notesModal.input = $scope.notesModal.inputTemp;
      
      $scope.report.notes = $scope.notesModal.input;
      
      document.getElementById('cat7sum').innerText = $scope.report.notes;
      
      $scope.notesModal.hide();
  };
  
  // Category 8 Functions
  //-----------------------------------------------------------------------------------------------------
  
  // Function called when the category 8 option button is pressed
  /**
   * @method reportCategory8
   * @description Function called when the category 8 option button is pressed
   */
  $scope.reportCategory8 = function() {
      $scope.openModal8();
  };
  
  // Modal8 functions
  // Create modal8 from html
  $ionicModal.fromTemplateUrl('templates/modals/camera_modal.html', {
      scope: $scope,
      animation: 'slide-in-up',
  }).then(function(modal) {
      $scope.cameraModal = modal;
  });
  
  $scope.takePic = function() {
    navigator.device.capture.captureImage(function(mediaFiles) {
      var image = document.getElementById("modal9preview");
      image.src = mediaFiles[0].fullPath;
      alert(mediaFiles[0].name);
      
      }, function() {alert("error");}, {limit:1});
  };
  
  $scope.takeVid = function() {
    navigator.device.capture.captureVideo(function() {alert("success");}, function() {alert("error");}, {limit:1});
  };
  
  $scope.selectPic = function() {
    navigator.camera.getPicture(function() {alert("success");}, function() {alert("error");}, {quality: 50, destinationType: Camera.DestinationType.FILE_URI, sourceType: Camera.PictureSourceType.PHOTOLIBRARY})
  };
  
  // Function opens modal8
  /**
   * @method openModal8
   * @description Function opens modal8
   * @return void
   * @throws none
   */
  $scope.openModal8 = function() {
      $scope.cameraModal.show();
  };
  
  // Function closes modal8
  /**
   * @method closeModal8
   * @description Function closes modal8
   * @return void
   * @throws none
   */
  $scope.closeModal8 = function() {
      $scope.cameraModal.hide();
  };
  
  // Function called when user presses cancel on modal8
  /**
   * @method cancelModal8
   * @description Function called when user presses cancel on modal8
   * @return void
   * @throws none
   */
  $scope.cancelModal8 = function() {
      //this.modal8.selection = "";
      //this.report.category8_1 = "";
      //alert(this.report.category8_1 + "\n" + this.report.category8_2);
      this.closeModal8();
  };

  // Function called when user presses save on modal8
  /**
   * @method saveModal8
   * @description Function called when user presses save on modal8
   * @return void
   * @throws none
   */
  $scope.saveModal8 = function() {
      // Do something with the selection
      //alert(this.modal8.selection);
      
     
      
      //alert(this.report.category8_1 + "\n" + this.report.category8_2);
      
      this.closeModal8();
  };
  
  // Function called when the category 9 option button is pressed
  /**
   * @method reportCategory9
   * @description Function called when the category 9 option button is pressed
   */
  $scope.reportCategory9 = function() {
      $scope.openModal9();
  };

  // Category 9 Functions
  //--------------------------------------------------------------------------------------
  
  // Function called when the category 9 option button is pressed
  /**
   * @method reportCategory9
   * @description Function called when the category 9 option button is pressed
   */
  $scope.reportCategory9 = function() {
      $scope.openModal9();
  };
  
  // Category9 Functions
  //--------------------------------------------------------------------------------------
  
  // Create modal9 from html
  $ionicModal.fromTemplateUrl('templates/modals/other_modal.html', {
      scope: $scope,
      animation: 'slide-in-up',
  }).then(function(modal) {
      $scope.otherModal = modal;
      $scope.otherModal.selection = "";      
  });
  
  // Select an item on category 9
  $scope.selectItemCat9 = function(id) {
    var handler = $scope.modalHandler;
    handler.setNewTempSelection(document, $scope.otherModal, id);
  };
  
  // Save category 9 modal selections
  $scope.saveModal9 = function() {
      $scope.modalHandler.saveModal(document, $scope.otherModal, "cat9sum", $scope.convertCategory9, function(str) {return str;});
      $scope.report.category9 = $scope.convertCategory9($scope.otherModal.selection);
  };
  
  $scope.cancelModal9 = function() {
      $scope.otherModal.temp = "";
      $scope.otherModal.hide();
  };

   $scope.openModal9 = function() {
      $scope.modalHandler.openModal(document, $scope.otherModal);
  };  
  
  // Takes in an id string representing the item selected in the modal.  Returns the corresponding report string value.
  /**
   * @method _convertOptionToValueModal9
   * @description Takes in an id string representing the item selected in the modal.  Returns
   *              the corresponding report string value.
   * @param {string} opt The id of the modal item selected
   * @return {string} The string representing the report value associated with the selected ui item.
   * @throws none
   */
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
      // Remove all modals
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
      $scope.popover.remove();
  });
});
