// LoginService.js

/**
 * @module starter.services
 */
angular.module('starter.services', [])

// LoginService class.  Performs login functionality.  Currently hardcoded to "user/secret"
/**
 * @class LoginService
 */
.service('LoginService', function($q) {
    return {
        loginUser: function(name, pw) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            if (name == 'user' && pw == 'secret') {
                deferred.resolve('Welcome ' + name + '!');
                window.localStorage.setItem("username", name);
            } else {
                deferred.reject('Wrong credentials.');
            }
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        }
    };
});
