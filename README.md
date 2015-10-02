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

## Getting Started
The project [wiki](https://github.com/ua-snap/ace-cordova-app/wiki) contains a [Getting Started tutorial](https://github.com/ua-snap/ace-cordova-app/wiki/Getting-Started) that details the steps necessary to download and run this project locally and also to modify the existing set of data models.

## Additional Information
Please see the [wiki](https://github.com/ua-snap/ace-cordova-app/wiki) for all other information regarding the project.
