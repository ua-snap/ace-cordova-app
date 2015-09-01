# ace-cordova-app

## Into and Overview
This project contains the source code for the ACE mobile application.  The ACE mobile app is designed to provide a
framework upon which organizations can build any type of mobile reporting application.  While this specific project
was tailored to a weather-reporting application, the code can be modified and extended to support any type of field
data collection that can be done using a smartphone interface.  

This application was built as a hybrid mobile application
using the Apache Cordova project and the Ionic Framework.  Additionally, the stock Android system webview was substituted
with the Crosswalk webview from the Crosswalk Project, providing advanced HTML5 functionality in a mobile platform.

In addition to this repository, a server-side API was developed to store data collected by this application.  See 
https://github.com/ua-snap/ace-api for documentation and source code.  The API was built usiing the Loopback project 
(see http://loopback.io).

The ACE mobile application was also developed to support offline data entry and recording using the Synchronization 
components of the Loopback project.  Users can enter data and have full access to all pre-recorded or synced data
while offline.  That data will be synchronized with the server side data store when a network connection is 
re-established.

## Disclaimer
###### Platform Support
Currently, only the Android platform is supported.  iOS platforms will not be capable of running the application.  This 
is due to lack of support for the HTML5 File API in web worker threads in the Safari Mobile WebKit browser.  Additionally,
a full version of the Crosswalk webview is only available on the Android platform.

###### Remaining work
This project is not complete.  The vast majority of the functionality is provided here, but several bugs and additional
features remain to be implemented.  All todo's and bugs are documented in the Issues section of this repo.

## Code Structure Overview
### JavaScript
All JavaScript code written for the project is contained in the [www/js/](https://github.com/ua-snap/ace-cordova-app/tree/master/www/js)
directory.  Additional code from outside libraries is included in the [www/lib/](https://github.com/ua-snap/ace-cordova-app/tree/master/www/lib)
directory.

The code in the [www/js/](https://github.com/ua-snap/ace-cordova-app/tree/master/www/js) directory is divided into 5
additional directories by function. [www/js/controllers](https://github.com/ua-snap/ace-cordova-app/tree/master/www/js/controllers)
contains all the Angular controller code utilized by the application.  In order to customize the project to another 
reporting application, individuals should re-write the [tab-report.html](https://github.com/ua-snap/ace-cordova-app/tree/master/www/templates/tab-report.html) 
view and its corresponding controller ([ReportController.js](https://github.com/ua-snap/ace-cordova-app/tree/master/www/js/controllers/ReportController.js)
to suit their application.  Additional customization of other view's will also be required.

### HTML/CSS
All HTML views for the application are contained in the [www/templates/](https://github.com/ua-snap/ace-cordova-app/tree/master/www/templates)
directory.  Custom CSS can be found in [www/css/style.css](https://github.com/ua-snap/ace-cordova-app/blob/master/www/css/style.css), 
though the majority of the CSS for the application was contained in the Ionic framework.

