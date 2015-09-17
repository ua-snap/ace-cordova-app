// ReportController.js

// This extremely large controller file handles all UI functionality associated with the report tab.
// TODO: Refactor this controller.  Possibly split into individial controllers or "handlers" for each modal type

angular.module('ace.controllers')

// ReportController
//--------------------------------------------------------------

// Controller for the Report view.  This controller contains all the
// UI functionality for entering and saving reports
.controller('ReportController', function(AuthService, $scope, $state, $ionicPopup, $translate, DataService, LocalStorageService, $ionicNavBarDelegate, $ionicSideMenuDelegate, $ionicModal, SettingsService, $ionicPopover, $ionicLoading, DataShareService, GeoService) {
  
  // Declare and initialize modal handler object
  $scope.modalHandler = new ModalHandler();
  
  $scope.editingReport = false;
  
  // Adding enter event listener.  This function will be called just before every view load,
    // regardless of controller and state caching.  Here, this is used to enable the side menu drag functionality.
    $scope.$on('$ionicView.enter', function() {
    	$ionicSideMenuDelegate.canDragContent(true);
    });
    
    // Modify nav view titles after view has entered
    $scope.$on('$ionicView.afterEnter', function() {
        // Check for edit report case (will have different title)
        if(!$scope.editingReport)
        {
            // Re-translate the title (to ensure that it is correctly translated)
            $translate(['WEATHER']).then(function(translations) {
              $ionicNavBarDelegate.title(translations.WEATHER); 
            });
        }
        else
        {
            // Change nav view title to indicate the report is being edited
            $translate(['EDIT_REPORT']).then(function(translations) {
              $ionicNavBarDelegate.title(translations.EDIT_REPORT); 
            });
            
            // Swap out the submit button for the update button
            var submitBtn = document.getElementById("submitBtn");
            submitBtn.style.display = "none";
            
            var updateBtn = document.getElementById("updateBtn");
            updateBtn.style.display = "block"
        }
    })
  
  // Check if sent here from template view
  $scope.$on('$ionicView.beforeEnter', function() {
    var template =  DataShareService.getItem("template", null);
    if(template && template !== null)
    {
        $scope.importReport(template);
        DataShareService.setItem("template", null);
    }
    else
    {
        // Check for edit variable
        var editReport = DataShareService.getItem("edit", null);
        if(editReport && editReport !== null)
        {   
            $scope.editingReport = true;
            $scope.importReport(editReport);
            DataShareService.setItem("edit", null);
        }
    }
    
    // Turn tracking back on (if necessary)
    var settings = SettingsService.getSettings(window);
    if(!GeoService.isTrackingEnabled() && settings.gps.positionTrackingEnabled)
    {
        GeoService.enableTracking(settings.gps.trackingInterval);
    }    
    
    // Turn auto-upload back on (60 second interval)
    window.thread_messenger.syncTimer = window.setInterval(function() {
        // Check online state
        if(window.navigator.connection.type !== "none")
        {
            // Online so attempt to sync
            var settings = SettingsService.getSettings(window);
            DataService.sync(null, settings.general.notifications);
        }        
    }, 60000);
    
    // Ensure permission to add notifications
    window.plugin.notification.local.hasPermission(function(granted) {
        if(!granted)
        {
            window.plugin.notification.local.promptForPermission();
        }
    });
    
    window.thread_messenger.onlineListenerFunction = function() {
        if(window.onlineTriggered === undefined || window.onlineTriggered === false)
        {
            window.onlineTriggered = true;
            // Check if we were previously logged in
            if(LocalStorageService.getItem("access_token", "", window) === null)
            {
                // The user never logged in to the server
                
                // Request password
                $ionicPopup.prompt({
                    title: "Internet connectivity detected.  Enter password to log in to server",
                    inputType: 'password'
                }).then(function(password) {
                    // Log in to the server
                    AuthService.loginUser(LocalStorageService.getItem("currentUser", {}, window).username, password, function(result) {
                        // Set access token
                        LocalStorageService.setItem("access_token", result.id, window);
                        
                        // Sync
                        var settings = SettingsService.getSettings(window);
                        DataService.sync(null, settings.general.notifications);
                        window.onlineTriggered = false;
                    }, function(err) {
                        // Error
                        alert(err);
                    });
                });
            }
            else
            {
                // The user was previously logged in, so just sync immediately
                var settings = SettingsService.getSettings(window);
                
                // Sync only if settings is valid (user is logged in)
                if(settings)
                {
                    DataService.sync(null, settings.general.notifications); 
                }
                window.onlineTriggered = false;
                
            }
        }
    }
    
    // Setup to to perform when going online from being offline
    document.addEventListener("online", window.thread_messenger.onlineListenerFunction, false)
    
  });
  
  // Function called when the update button is clicked
  $scope.updateClicked = function() {
      // Grab id and delete unnecessary report items (ones that cannot be changed in this view)
      var reportId = $scope.report.id;
      delete $scope.report.id;
      delete $scope.report.userId;
      
      // Perform actual update
      DataService.localWeatherReport_updateAll({id: reportId}, $scope.report, function(err, res) {
          if(err) console.log(err);
      });
      
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
      $scope.cameraModal.clearData();
      
      $scope.editingReport = false;
      
      // Re-translate the title (to ensure that it is correctly translated)
      $translate(['WEATHER']).then(function(translations) {
        $ionicNavBarDelegate.title(translations.WEATHER); 
      });
      
      // Swap out the submit button for the update button
      var submitBtn = document.getElementById("submitBtn");
      submitBtn.style.display = "block";
      
      var updateBtn = document.getElementById("updateBtn");
      updateBtn.style.display = "none";
      
  };
  
  // Field holds the contents of the current report that is being entered
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
    
    var translationsArray = [
        'CLOUD_COVER',
        'PRECIPITATION',
        'VISIBILITY',
        'PRESSURE_TENDENCY',
        'SURFACE_PRESSURE',
        'TEMPERATURE',
        'WIND_SPEED',
        'WIND_DIRECTION',
        'OTHER',
        'NOTES'
    ];
    
    $translate(translationsArray).then(function(translations) {
        // Fill in each report element
        var clouds = document.getElementById("sumcat1");
        clouds.innerText = translations.CLOUD_COVER + ": " + $scope.report.cloudCover;
        
        var precip = document.getElementById("sumcat2");
        precip.innerText = translations.PRECIPITATION + ": " + $scope.report.precipitation;
        
        var vis = document.getElementById("sumcat3");
        vis.innerText = translations.VISIBILITY + ": " + $scope.report.visibility;
        
        var pressTrend = document.getElementById("sumcat4_1");
        pressTrend.innerText = translations.PRESSURE_TENDENCY + ": " + $scope.report.pressureTendency;
        
        var pressVal = document.getElementById("sumcat4_2");
        if($scope.report.pressureValue !== "")
        {
            pressVal.innerText = translations.SURFACE_PRESSURE + ": " + $scope.report.pressureValue + " hPa";
        }
        else
        {
            pressVal.innerText = translations.SURFACE_PRESSURE + ": ";   
        }
        
        
        var temp = document.getElementById("sumcat5");
        temp.innerText = translations.TEMPERATURE + ": " + $scope.report.temperatureValue + " " + $scope.report.temperatureUnits;
        
        var wind = document.getElementById("sumcat6");
        wind.innerText = translations.WIND_SPEED + ": " + $scope.report.windValue + " " + $scope.report.windUnits;
        
        var windDir = document.getElementById("sumcat6_3");
        windDir.innerText = translations.WIND_DIRECTION + ": " + $scope.report.windDirection;
        
        var other = document.getElementById("sumcat9");
        other.innerText = translations.OTHER + ": " + $scope.report.other;
        
        var notes = document.getElementById("sumcat7");
        notes.innerText = translations.NOTES + ":\n" + $scope.report.notes;
        
        var attachment = document.getElementById("sumcat8");
        attachment.innerText = "Attachment: " + $scope.report.attachment.replace(/^.*[\\\/]/, ''); 
    });
    
    
  };
  
  // Closes the submit popover
  $scope.closePopover = function() {
    $scope.submitPopover.hide();
  };
  
  // Called when the "Send Report" button on the submit popover is touched.  Should be used to 
  // execute a network call to submit the report.  Currently, just provides a fake success notification
  $scope.submitReport = function() {
    //$ionicLoading.show({template: 'Report Sent Successfully (un-implemented)', noBackdrop: true, duration: 1500});
    
    // Save report to database and upload
    var tempReport = $scope.report;
    GeoService.getCurrentPosition(navigator.geolocation, function(pos) {
        
        var localPos = {
            userId: LocalStorageService.getItem("currentUser", {}, window).id,
            latlng: {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
            },
            timestamp: new Date(pos.timestamp),
            accuracy: pos.coords.accuracy,
            altitude: pos.coords.altitude,
            altitudeAccuracy: pos.coords.altitudeAccuracy,
            heading: pos.coords.heading,
            speed: pos.coords.speed
        };
        
        // Create the local position
        DataService.localPosition_create(localPos, function(err, res) {
            // Add position data to report
            var position = res;
            tempReport.positionId = position.id;
            tempReport.userId = position.userId;
            
            // Create weather report
            DataService.localWeatherReport_create(tempReport, function(err, res) {
                if(window.navigator.connection.type !== "none") {
                    
                    // Upload attachment file if there is one
                    if(tempReport.attachment && tempReport.attachment !== "")
                    {
                        // Need to handle attachment
                        
                        // Create new url string
                        var uploadUrl = "https://ace-api-dev.herokuapp.com/api/containers/" + LocalStorageService.getItem("groupName", "null", window) + "/upload";
                        
                        // Create upload call
                        // Set up options
                        var options = {
                            headers: {},
                        };
                        options.headers['authorization'] = LocalStorageService.getItem("access_token", "", window);
                        
                        // Grab the file name
                        var fileName = tempReport.attachment.replace(/^.*[\\\/]/, '');
                        
                        // Can use file without adding type qualifier
                        if(fileName.indexOf(".") !== -1)
                        {
                            options.fileName = fileName;
                        }
                        else
                        {
                            options.fileName = fileName + "." + tempReport.attachmentType.substr(tempReport.attachmentType.lastIndexOf("/") + 1);
                        }
                        
                        // Mime type
                        options.mimeType = tempReport.attachmentType;
                        
                        // Closure to persist report id
                        (function(reportId, fName) {
                            var fileTransfer = new FileTransfer();
                            fileTransfer.upload(tempReport.attachment, encodeURI(uploadUrl), function(response) {                            
                                // Upload successful
                                // Create url
                                var url = "https://ace-api-dev.herokuapp.com/api/Containers/" + LocalStorageService.getItem("groupName", "", window) + "/download/" + fName;
                                DataService.localWeatherReport_updateAll({id: res.id}, {attachment: url}, function(err, res) {
                                    if(err) console.log(err);
                                });
                            }, function(error) {
                                // Upload failed
                                console.log(error);
                            }, options);
                        })(res.id, fileName);
                        
                    }
                    var settings = SettingsService.getSettings(window);
                    DataService.sync(function(model) {
                        if(model === "report")
                        {
                            $ionicLoading.show({template: 'Report Sent Successfully', noBackdrop: true, duration: 1500});
                        }
                    }, settings.general.notifications);
                }
                else {
                    $ionicLoading.show({template: 'Report saved locally (will be uploaded once internet connection is re-established)', noBackdrop: true, duration: 2500});
                }
            });
        });        
    });
    
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
    $scope.cameraModal.clearData();
    
    // Hide the popover
    $scope.submitPopover.hide();
  };
  
  // Function to import a report object (from template selection)
  //-------------------------------------------------------------------------------------
  $scope.importReport = function(report) {
    // Set report object
    $scope.report = report;
    
    // Update UI
    if(report.cloudCover && report.cloudCover !== "")
    {
      document.getElementById("cloud_sum").innerText = report.cloudCover;
      $scope.cloudCoverModal.selection = $scope.cloudCoverValueToId(report.cloudCover);
      $scope.cloudCoverModal.temp = $scope.cloudCoverValueToId(report.cloudCover);
    }
    
    if(report.precipitation && report.precipitation !== "")
    {
      document.getElementById("precip_sum").innerText = report.precipitation;
      $scope.precipModal.selection = $scope.precipitationValueToId(report.precipitation);
      $scope.precipModal.temp = $scope.precipitationValueToId(report.precipitation);
    }
    
    if(report.visibility && report.visibility !== "")
    {
      document.getElementById("vis_sum").innerText = report.visibility;
      $scope.visibilityModal.selection = $scope.visibilityValueToId(report.visibility);
      $scope.visibilityModal.temp = $scope.visibilityValueToId(report.visibility);
    }
    
    if(report.pressureValue && report.pressureValue != "")
    {
      document.getElementById("pressure_sum").innerText = report.pressureValue + " hPa";
      $scope.pressureModal.input = report.pressureValue;
      $scope.pressureModal.inputTemp = report.pressureValue;
      
      $scope.pressureModal.selection = $scope.pressureValueToId(report.pressureTendency);
      $scope.pressureModal.temp = $scope.pressureValueToId(report.pressureTendency);
    }
    
    if(report.temperatureValue && report.temperatureValue !== "")
    {
      document.getElementById("temp_sum").innerText = report.temperatureValue + " " + report.temperatureUnits;
      
      $scope.surfaceTempModal.input = report.temperatureValue;
      $scope.surfaceTempModal.inputTemp = report.temperatureValue;
      
      if(report.temperatureUnits.indexOf("F") !== -1)
      {
          $scope.surfaceTempModal.select = "F";
          $scope.surfaceTempModal.selectTemp = "F";
      }
      else
      {
          $scope.surfaceTempModal.select = "C";
          $scope.surfaceTempModal.selectTemp = "C";
      }
      
    }
    
    if(report.windValue && report.windValue != "")
    {
        document.getElementById("wind_sum").innerText = report.windValue + " " + report.windUnits + " " + report.windDirection;
        
        $scope.windModal.inputTemp = report.windValue;
        $scope.windModal.input = report.windValue;
        if(report.windUnits.indexOf("Knots") !== -1)
        {
            $scope.windModal.select1Temp = "k";
            $scope.windModal.select1 = "k";
        }
        else
        {
            $scope.windModal.select1Temp = "m";
            $scope.windModal.select1 = "m";
        }
        
        switch(report.windDirection)
        {
            case "":
                $scope.windModal.select2 = "blank";
                $scope.windModal.select2Temp = "blank";
                break;
            case "North": 
                $scope.windModal.select2 = "north";
                $scope.windModal.select2Temp = "north";
                break;
            case "Northeast":
                $scope.windModal.select2 = "northeast";
                $scope.windModal.select2Temp = "northeast";
                break;
            case "East":
                $scope.windModal.select2 = "east";
                $scope.windModal.select2Temp = "east";
                break;
            case "Southeast":
                $scope.windModal.select2 = "southeast";
                $scope.windModal.select2Temp = "southeast";
                break;
            case "South":
                $scope.windModal.select2 = "south";
                $scope.windModal.select2Temp = "south";
                break;
            case "Southwest":
                $scope.windModal.select2 = "southwest";
                $scope.windModal.select2Temp = "southwest";
                break;
            case "West":
                $scope.windModal.select2 = "west";
                $scope.windModal.select2Temp = "west";
                break;
            case "Northwest":
                $scope.windModal.select2 = "northwest";
                $scope.windModal.select2Temp = "northwest";
                break;
            default:
                $scope.windModal.select2 = "";
                $scope.windModal.select2Temp = "";
                break;
        }     
    }
    
    if(report.notes && report.notes != "")
    {
        document.getElementById("notes_sum").innerText = report.notes;
        $scope.notesModal.input = report.notes;
        $scope.notesModal.inputTemp = report.notes;
    }
    
    if(report.attachment && report.attachment != "")
    {
        // Update the summary field
        var summary = document.getElementById("camera_sum");
        var fileName = $scope.report.attachment.replace(/^.*[\\\/]/, '');
        summary.innerText = fileName;
        
        $scope.cameraModal.tempAttachment = $scope.report.attachment;
    }
    
    if(report.other && report.other != "")
    {
        document.getElementById("other_sum").innerText = report.other;
        $scope.otherModal.selection = report.other;
        $scope.otherModal.temp = report.other;
    }    
  };
  
  // Function called when the application opens (every time)
  //-------------------------------------------------------------------------------------
  document.addEventListener("deviceready", onDeviceReady, false);
  
  function onDeviceReady() {
    
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
  
  // Additional options
  //--------------------------------------------------------------------------------------
  $scope.browseReportsClicked = function() {
    $scope.optionsPopover.hide();
    $state.go("browse-reports");
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

  $scope.cloudCoverValueToId = function(value) {
    var returnValue = "";

    // Convert report value it item Id
    switch(value)
    {
      case "No Clouds":
        returnValue = "1opt1";
        break;
      case "1/8th":
        returnValue = "1opt2";
        break;
      case "2/8ths":
        returnValue = "1opt3";
        break;
      case "3/8ths":
        returnValue = "1opt4";
        break;
      case "4/8ths":
        returnValue = "1opt5";
        break;
      case "5/8ths":
        returnValue = "1opt6";
        break;
      case "6/8ths":
        returnValue = "1opt7";
        break;
      case "7/8ths":
        returnValue = "1opt8";
        break;
      case "8/8ths":
        returnValue = "1opt9";
        break; 
      case "Sky Obscured":
        returnValue = "1opt10";
        break;
      default:
        break;
    }
    
    return returnValue;
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
  
  $scope.precipitationValueToId = function(value) {
        var returnValue = "";
        switch(value)
        {
          case "Light Rain":
            returnValue = "2opt1";
            break;
          case "Moderate Rain":
            returnValue = "2opt2";
            break;
          case "Heavy Rain":
            returnValue = "2opt3";
            break;
          case "Light Snow":
            returnValue = "2opt4";
            break;
          case "Moderate Snow":
            returnValue = "2opt5";
            break;
          case "Heavy Snow":
            returnValue = "2opt6";
            break;
          case "Freezing Rain":
            returnValue = "2opt7";
            break;
          case "Heavy Freezing Rain":
            returnValue = "2opt8";
            break;
          case "Raing & Snow":
            returnValue = "2opt9";
            break; 
          case "Heavy Rain & Snow":
            returnValue = "2opt10";
            break;
          case "Sleet":
            returnValue = "2opt11";
            break;
          case "Ice Needles":
            returnValue = "2opt12";
            break;
          case "Freezing Drizzle":
            returnValue = "2opt13";
            break;
          case "Thunderstorm":
            returnValue = "2opt14";
            break;  
          case "Thundersnow":
            returnValue = "2opt15";
            break;
          case "Virga":
            returnValue = "2opt16";
            break;
          default:
            break;
    }
    
    return returnValue;
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
  
  $scope.visibilityValueToId = function(value) {
    var returnValue = "";
    switch(value)
    {
      case "Mist":
        returnValue = "3opt1";
        break;
      case "Patchy Fog":
        returnValue = "3opt2";
        break;
      case "Fog":
        returnValue = "3opt3";
        break;
      case "Ice Fog":
        returnValue = "3opt4";
        break;
      case "Haze":
        returnValue = "3opt5";
        break;
      case "Blowing Snow":
        returnValue = "3opt6";
        break;
      case "Smoke":
        returnValue = "3opt7";
        break;
      default:
        break;
    }
    
    return returnValue;  
  };
  
  // Conversion function for visibility.  Takes in the id of the user selection from the modal and returns the actual report value.
  $scope.convertCategory3 = function(opt) {
    var returnValue = "";
    switch(opt)
    {
      case "3opt1":
        returnValue = "Mist";
        break;
      case "3opt2":
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
      
      if($scope.pressureModal.input !== null)
      {
            $scope.report.pressureValue = $scope.pressureModal.input;      
            document.getElementById("pressure_sum").innerText = $scope.pressureModal.input + " hPa";
      }
      else
      {
          $scope.report.pressureValue = "";
          document.getElementById("pressure_sum").innerText = "______";
      }
      
  };
  
  $scope.pressureValueToId = function(value) {
    var returnValue = "";
    switch(value)
    {
      case "Upward":
        returnValue = "4opt1";
        break;
      case "No Change":
        returnValue = "4opt2";
        break;
      case "Downward":
        returnValue = "4opt3";
        break;
      default:
        break;
    }
    
    return returnValue;
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
      
      // Check settings and select units appropriately
      var settings = SettingsService.getSettings(window);
      if(settings.general.units === "Imperial")
      {
          $scope.surfaceTempModal.selectTemp = "F";
      }
      else
      {
          $scope.surfaceTempModal.selectTemp = "C";
      }
      
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
      if($scope.surfaceTempModal.select === "C")
      {
          $scope.report.temperatureUnits = " ºC ";
      }
      else if($scope.surfaceTempModal.select === "F")
      {
          $scope.report.temperatureUnits = " ºF ";
      }
      
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
      // Preselect knots and blank direction
      $scope.windModal.select1Temp = "k";
      $scope.windModal.select2Temp = "blank";
      
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
        // Check units settings and select units appropriately
        var settings = SettingsService.getSettings(window);
        if(settings.general.units === "Imperial")
        {
            $scope.windModal.select1Temp = "m";
        }
        else if(settings.general.units === "Metric")
        {
            $scope.windModal.select1Temp = "k";
        }
      
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
      if($scope.windModal.input === null)
      {
          $scope.report.windValue = "";
          $scope.report.windUnits = "";
      }
      else
      {
          $scope.report.windValue = $scope.windModal.input;
          if($scope.windModal.select1 === "k")
          {
              $scope.report.windUnits = " Knots ";
          }
          else if($scope.windModal.select1 = "m")
          {
              $scope.report.windUnits = " mph ";
          }
      }
      
      
      switch($scope.windModal.select2)
      {
            case "blank":
                $scope.report.windDirection = "";
                break;
            case "north": 
                $scope.report.windDirection = "North";
                break;
            case "northeast":
                $scope.report.windDirection = "Northeast";
                break;
            case "east":
                $scope.report.windDirection = "East";
                break;
            case "southeast":
                $scope.report.windDirection = "Southeast";
                break;
            case "south":
                $scope.report.windDirection = "South";
                break;
            case "southwest":
                $scope.report.windDirection = "Southwest";
                break;
            case "west":
                $scope.report.windDirection = "West";
                break;
            case "northwest":
                $scope.report.windDirection = "Northwest";
                break;
            default:
                $scope.report.windDirection = "";
                break;
            
      }
      
      // Update the summary element on the tab-report.html view
      if($scope.report.windValue !== "")
      {
          document.getElementById('wind_sum').innerText = $scope.report.windValue + " " + $scope.report.windUnits;
      }
      else
      {
          document.getElementById("wind_sum").innerText = "______";
      }
      
      
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
      
      // Clear function
      $scope.cameraModal.clearData = function() {
          var summary = document.getElementById("camera_sum");
          summary.innerText = "______";
          
          delete $scope.cameraModal.tempAttachment;
          delete $scope.cameraModal.tempAttachmentType
      };
  });
  
  // Launch an intent to open the attachment
  $scope.openAttachment = function() {
      var dataType = "";
      if($scope.cameraModal.tempAttachment.indexOf("jpg") !== -1)
      {
          dataType = "image/jpg";
      }
      else if($scope.cameraModal.tempAttachment.indexOf("mp4") !== -1)
      {
          dataType = "video/mp4";
      }
      else
      {
          dataType = "image/png";
      }
      
      // Start intent
      window.plugins.webintent.startActivity({
          action: window.plugins.webintent.ACTION_VIEW,
          url: $scope.cameraModal.tempAttachment,
          type: dataType
      }, function() {}, function(err) {alert(err);});
  };
  
  // Take a picture
  $scope.takePic = function() {
    navigator.camera.getPicture(function(uri) {
        // Store uri
        $scope.cameraModal.tempAttachment = uri;   
        
        // Get type
        $scope.determineAttachmentType(uri, function(fileType) {
            $scope.cameraModal.tempAttachmentType = fileType;
        });
        
        // Display the attachment button
        var btn = document.getElementById("openAttachmentButton");
        btn.style.display = "block";
           
      }, function() {
        // Do nothing
        
        //alert("error");
      }, {limit:1});
  };
  
  $scope.determineAttachmentType = function(uri, cb) {
    // Get the file type
    
    // First, check uri for .jpg or equivalent
    var fileType = uri.substring(uri.lastIndexOf("."));
    if(fileType && fileType.indexOf(".") !== -1)
    {
        if(fileType === ".jpg")
        {
            fileType = "image/jpg";
        }
        else if(fileType === ".png")
        {
            fileType = "image/png";
        }
        else if(fileType === ".mp4")
        {
            fileType = "video/mp4";
        }
        if(cb)
        {
            cb.call(this, fileType);
        }
    }
    else
    {
        // Lookup the file
        window.resolveLocalFileSystemURL(uri, function(fileEntry) {
            fileEntry.file(function(file) {
               cb.call(this, file.type);
            });
        }, function(err) {
            console.log(err);
        });
    }
  };
  
  // Take a video
  $scope.takeVid = function() {
    navigator.device.capture.captureVideo(function(mediaFiles) {
        // Store path
        $scope.cameraModal.tempAttachment = mediaFiles[0].fullPath;
        // Save type
        $scope.cameraModal.tempAttachmentType = mediaFiles[0].type;
        
        // Display the attachment button
        var btn = document.getElementById("openAttachmentButton");
        btn.style.display = "block";
    }, function() {
        // Do nothing
        
        //alert("error");
    }, {limit:1});
  };
  
  // Select a picture from the file browser
  $scope.selectPic = function() {
      navigator.camera.getPicture(function(uri) {
         // Dirty workaround for kitkat document content uri bug
         var photo_split;
         if(uri.substring(0, 21) === "content://com.android") {
             photo_split = uri.split("%3A");
             uri = "content://media/external/images/media/" + photo_split[1];
         }
                  
         // Initially set the tempAttachment
         $scope.cameraModal.tempAttachment = uri;
         
         // Display the attachment button
         var btn = document.getElementById("openAttachmentButton");
         btn.style.display = "block";
         
        // Determine attachment type
         $scope.determineAttachmentType(uri, function(fileType) {
             $scope.cameraModal.tempAttachmentType = fileType;
         });
         
      }, function(err) {
          // Do nothing
          
          //alert(err);
      }, {destinationType: Camera.DestinationType.FILE_URI, sourceType: Camera.PictureSourceType.PHOTOLIBRARY});
  };
  
  // Open the camera modal
  $scope.openModal8 = function() {
      $scope.cameraModal.show();
      var btn = document.getElementById("openAttachmentButton");
      if($scope.report.attachment && $scope.report.attachment !== "")
      {      
          $scope.cameraModal.tempAttachment = $scope.report.attachment;
          btn.style.margin = "auto";
      }     
      else
      {
          btn.style.display = "none";
      }
      $scope.$apply();
  };
  
  // Close the camera modal
  $scope.closeModal8 = function() {
      $scope.cameraModal.hide();
  };
  
  // Function called when user presses cancel on modal8
  $scope.cancelModal8 = function() {
      $scope.cameraModal.tempAttachment = "";
      this.closeModal8();
  };

  // Function called when user presses save on modal8
  $scope.saveModal8 = function() {
      $scope.report.attachment = $scope.cameraModal.tempAttachment;
      $scope.report.attachmentType = $scope.cameraModal.tempAttachmentType;
      
      // Update the summary field
      var summary = document.getElementById("camera_sum");
      var fileName = $scope.report.attachment.replace(/^.*[\\\/]/, '');
      summary.innerText = fileName;
      
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