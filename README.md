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
features remain to be implemented.  All todo's, enhancements, and bugs are documented in the Issues section of this repo.

## Code Structure Overview
#### JavaScript
All JavaScript code written for the project is contained in the [www/js/](https://github.com/ua-snap/ace-cordova-app/tree/master/www/js)
directory.  Additional code from outside libraries is included in the [www/lib/](https://github.com/ua-snap/ace-cordova-app/tree/master/www/lib)
directory.

The code in the [www/js/](https://github.com/ua-snap/ace-cordova-app/tree/master/www/js) directory is divided into 5
additional directories by function. [www/js/controllers](https://github.com/ua-snap/ace-cordova-app/tree/master/www/js/controllers)
contains all the Angular controller code utilized by the application.  In order to customize the project to another 
reporting application, individuals should re-write the [tab-report.html](https://github.com/ua-snap/ace-cordova-app/tree/master/www/templates/tab-report.html) 
view and its corresponding controller ([ReportController.js](https://github.com/ua-snap/ace-cordova-app/tree/master/www/js/controllers/ReportController.js)
to suit their application.  Additional customization of other views will also be required.

#### HTML/CSS
All HTML views for the application are contained in the [www/templates/](https://github.com/ua-snap/ace-cordova-app/tree/master/www/templates)
directory.  Custom CSS can be found in [www/css/style.css](https://github.com/ua-snap/ace-cordova-app/blob/master/www/css/style.css), 
though the majority of the CSS for the application was contained in the Ionic framework.

## Quick-Start
#### Startup Instructions
Clone this repository into a directory on your local machine.  Navigate into the newly-created ace-cordova-app directory and run
the following terminal commands:

1. npm install
2. bower install
3. ionic platform add android

Since this project accesses the device GPS sensors through the HTML5 Geolocation API instead of an interface, developers are required to add the following permissions to the AndroidManifext.xml file manually:
```xml
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_LOCATION_EXTRA_COMMANDS" />
```
Additionally, the MANAGE_DOCUMENTS permission is required to allow the app to resolve filenames for file attachment.
```xml
    <uses-permission android:name="android.permission.MANAGE_DOCUMENTS" />
```

The app uses two Android material design icons for sync notifications, which are included in the project in the [/android-icons/](https://github.com/ua-snap/ace-cordova-app/tree/master/android-icons/) directory.  Navigate to the directory, and run the [copy-icons.sh](https://github.com/ua-snap/ace-cordova-app/tree/master/android-icons/copy-icons.sh) script to copy all icons to the newly added Android platform.  Alternatively, the icons can be copied manually to their respective file locations based on screen density.

Now, build and deploy the application using the "ionic run android" command.

#### Links
###### Login code
[LoginController.js](https://github.com/ua-snap/ace-cordova-app/blob/master/www/js/controllers/LoginController.js#L54), [AuthService.js](https://github.com/ua-snap/ace-cordova-app/blob/master/www/js/services/AuthService.js#L41)

###### Logout code
[AppController.js](https://github.com/ua-snap/ace-cordova-app/blob/master/www/js/controllers/AppController.js#L33)

###### Data Interface code
[DataService.js](https://github.com/ua-snap/ace-cordova-app/tree/master/www/js/sync/DataService.js)

## Documentation
###### Generation
Code documentation for the project was generated using the [Docco](http://jashkenas.github.io/docco/), [YUIDoc](http://yui.github.io/yuidoc/), and [docco-toc](https://www.npmjs.com/package/docco-toc) 
tools. To view the documentation, clone the project, then run "npm install" and "bower install" to install all dependencies.
Ensure gulp is intalled globally on your machine, and run "gulp gen-docco-all", "gulp gen-yuidoc-all", and "gulp gen-docco-
all-toc" to generate all forms of documentation.  The "gen-docco-all" task runs the standard docco tool on the entire code-base for the mobile app, with the exception of the files included from the ace-api project (browser.bundle.js and lbclient.js).  gen-yuidoc-all runs the YUIDoc tool on the same set of files.  The "gen-docco-all-toc" task runs an enhanced version of the docco tool (docco-toc) that adds some table of contents functionality to the standard docco html.  

###### Focus and Style
Different sections of the code base were documented in different ways, according to their function.  All Controllers for the 
project were documented with a more "docco-style" markup to allow for increased readability.  All Utility classes and Angular
Services were documented with both styles, but with an emphasis on the YUIDoc style; providing developers with an interface 
definition for classes they might use.

## Licensing
TBD
