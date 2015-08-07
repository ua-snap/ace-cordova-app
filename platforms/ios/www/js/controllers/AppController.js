// AppController.js

// AppController
//--------------------------------------------------------------

/**
 * @module ace.controllers
 */
// Create the ace.controllers angularjs module
angular.module('ace.controllers', [])

// Create the AppController controller
/**
 * @class AppController
 */
.controller('AppController', function($scope, DataService, DownloadService, UploadService, AuthService, LocalStorageService, $ionicSideMenuDelegate, $state, $http, DbService, GeoService) {
  
  // Function toggles sliding the left side-menu out and back in
  /**
   * @method toggleLeft
   * @description Function toggles sliding the left side-menu out and back in
   * @return void
   * @throws none
   */
	$scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
  
  $scope.$on('$ionicView.beforeEnter', function() {
    	$ionicSideMenuDelegate.canDragContent(true);
        
        // Set user name in left side menu
        document.getElementById("username_title").innerText = LocalStorageService.getItem("currentUser", null, window).username;
    });
  
  
  /**
   * Function logs out the current user 
   * 
   * @method logout
   * @description Function logs out the current user by removing them from local storage
   * @return void
   * @throws none
   */
  $scope.logout = function() {
      // Make server logout call
      AuthService.logoutUser(function() {
          // Success      
          // This function was accessed by sliding out the left menu, so close it back up.
        $ionicSideMenuDelegate.toggleLeft();
    
        // Disable dragging the left-menu (since we are about to switch to the login screen)
        $ionicSideMenuDelegate.canDragContent(false);
    
        // Turn off any active position tracking
        GeoService.disableTracking();
        
        // Stop watching position
        GeoService.disableWatchPosition(navigator.geolocation);
        
        // Stop auto-upload
        UploadService.disableAutoUpload();
        
        // Kill the upload worker thread (if necessary)
        UploadService.killUploadWorkerThread();
        
        // Kick the user back out to the login screen
        $state.go('login');
        
        // Kill the sync thread
        DataService.terminate();
        
        // Remove any notifications
        window.plugin.notification.local.cancel(230476843);
      
      }, function(err) {
          // Error (already alerted in AuthService)
          //alert(httpResponse.data);
      });
    };
  
  $scope.testLogin = function() {
    var worker = new Worker("js/sync/SyncWorker.js");
    var setupMessage = {
        accessToken: LocalStorageService.getItem("access_token", "", window),
        currentUser: LocalStorageService.getItem("currentUser", "", window),
        groupUserIds: LocalStorageService.getItem("groupUserIds", [], window),
        req: "setup"
    }
    worker.postMessage(setupMessage);
    worker.postMessage({req: "sync"});
  };
  
  // Function provides test access
  $scope.test = function() {
    // Try out getting geolocation
    /*navigator.geolocation.getCurrentPosition(function(position) {
      alert('Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n');
    }, function(error) {
      alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
    }, {timeout: 10000, enableHighAccuracy: true});*/
    /*GeoService.getCurrentPosition(navigator.geolocation, function(position) {
      alert('Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n');
    }, function(error) {
      alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
    });*/
    
    DownloadService.downloadUsers(1);
    
    
  };
  
  // Testing HTTPS capabilities
  $scope.test2 = function() {
    /*$http.get('https://www.google.com').then(function(resp) {
      alert('success: ' + resp);
    }, function(err) {
        alert('error: ' + err);
    });*/
    
    DbService.getAllUsers(window, function(res) {
        var a = 0; 
        a++;
    });
    
  };
  
  $scope.testSQLite = function() {
    DbService.openDatabase(window);
    
    /*navigator.geolocation.getCurrentPosition(function(pos) {
      DbService.insertPosition(pos, window);
      
      DbService.getAllPositionLogs(window, function(res) {
        alert(res.rows.length);
      });
      
      DbService.getRecentPositionLogs(window, 3, function(res) {
        alert(res.rows.length);
        var i = 0;
        i++;
      });
    });*/
    
    /*GeoService.getCurrentPosition(navigator.geolocation, function(pos) {
      DbService.insertPosition(pos, window);
      
      DbService.getAllPositionLogs(window, function(res) {
        alert(res.rows.length);
      });
      
      DbService.getRecentPositionLogs(window, 3, function(res) {
        alert(res.rows.length);
        var i = 0;
        i++;
      });
    }); */
    DbService.getAllPositionLogs(window, function(res) {
        var num = res.rows.length;
        alert(num);
    }); 
  };
  
  $scope.testReportPosition = function() {
    DbService.getReportsAndPositions(window, function(reports) {
      var i = 0;
      i++;
      i++;
    });
  };
  
  $scope.test3 = function() {
      /*var user = LocalStorageService.getItem("currentUser", null, window);
      
      Group.groupId({id: user.groupId}, function(value, responseHeaders) {
          var i = 0;
          i++;
      }, function(httpResponse) {
          var i = 0; i++;
      });*/
      /*DbService.getAllUsers(window, function(res) {
         var i = 0;
         i = res; 
         i = null;
      });*/
      UploadService.uploadAll();
      
  };
  
  $scope.lastPos = null;
  
  $scope.test4 = function() {
      GeoService.getCurrentPosition(navigator.geolocation, function(position) {			
			var insert = false;
			if(position !== null)
			{
				// Automatically insert if no other entries have been inserted
				if($scope.lastPos === null)
				{
					insert = true
				}
				else if((position.coords.latitude !== $scope.lastPos.coords.latitude) 
					|| (position.coords.longitude !== $scope.lastPos.coords.longitude) 
					|| (position.coords.altitude != $scope.lastPos.coords.altitude) 
					|| (position.coords.accuracy != $scope.lastPos.coords.accuracy) 
					|| (position.coords.altitudeAccuracy != $scope.lastPos.coords.altitudeAccuracy))
				{
					insert = true;
				}				
			}
			
			// Insert if necessary
			if(insert)
			{
				DbService.insertPosition(position, window);	
			}	
            
            $scope.lastPos = position;					
		});			     
  };
  
  /**
   * Function opens the settings view
   * 
   * @method openSettings
   * @return void
   * @throws none
   */
  $scope.openSettings = function() {    
    // This function was accessed by sliding out the left menu, so close it back up.
    $ionicSideMenuDelegate.toggleLeft();
    
    // Save previous state (tab)
    LocalStorageService.setItem('previousState', $state.current.name, window);
    
    // Perform the navigation using the $state object
    $state.go('settings');
  };
  
  $scope.testDownload = function() {
      DownloadService.downloadUsers(LocalStorageService.getItem("currentUser", null, window).groupId);
      
      //DownloadService.downloadPositions();
  };
  
  $scope.testSync = function() {
      GeoService.getCurrentPosition(navigator.geolocation, function(pos) {
          if(pos !== null)
          {
              var newPosition = {
    			userId: LocalStorageService.getItem("currentUser", {}, window).id,
    			latlng: {
    				lat: pos.coords.latitude,
    				lng: pos.coords.longitude
    			},
    			timestamp: pos.timestamp,
    			accuracy: pos.coords.accuracy,
    			altitude: pos.coords.altitude,
    			altitudeAccuracy: pos.coords.altitudeAccuracy,
    			heading: pos.coords.heading,
    			speed: pos.coords.speed
    		};
            
            DataService.localPosition_create(newPosition, function(err, res) {
                  var i = 0;
                  i++;
              });
          }
      }, function(err) {
          var error = err;
      });
  };
  
});
