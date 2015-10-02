# ACE Cordova App

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
###### Remaining work
This project is not complete.  The vast majority of the functionality is provided here, but several bugs and additional
features remain to be implemented.  All todo's, enhancements, and bugs are documented in the Issues section of this repo.

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

###### Plato Code Analysis
This project uses [Plato](https://github.com/es-analysis/plato) for JavaScript source code analysis.  To generate the plato report, run "gulp gen-plato-report" from the top-level project directory.

## Licensing
TBD
