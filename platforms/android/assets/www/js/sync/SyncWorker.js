if(self.importScripts !== undefined)
{
	// Local storage shim
	var localStorage = {};
	localStorage.data = {};

	localStorage.getItem = function(key, defaultValue) {
		var temp = localStorage.data[key];
		if(temp)
		{
			return temp;
		}
		else
		{
			return defaultValue;
		}
	};

	localStorage.setItem = function(key, value) {
		localStorage.data[key] = value;
	};

	localStorage.clear = function() {
		localStorage.data = {};
	};

	// Window shim
	this.window = this;
	window.localStorage = localStorage;
	// Remove partial fetch support (doesn't work anyway).  Force to use XMLHttpRequest
	window.fetch = undefined;
	
	// FormData shim - Attribution below
	/*
	 * FormData for XMLHttpRequest 2  -  Polyfill for Web Worker
	 * (c) 2014 Rob Wu <rob@robwu.nl>
	 * License: MIT
	 * - append(name, value[, filename])
	 * - XMLHttpRequest.prototype.send(object FormData)
	 * 
	 * Specification: http://www.w3.org/TR/XMLHttpRequest/#formdata
	 *                http://www.w3.org/TR/XMLHttpRequest/#the-send-method
	 * The .append() implementation also accepts Uint8Array and ArrayBuffer objects
	 * Web Workers do not natively support FormData:
	 *                http://dev.w3.org/html5/workers/#apis-available-to-workers
	 * Originally released in 2012 as a part of http://stackoverflow.com/a/10002486.
	 * Updates since initial release:
	 * - Forward-compatibility by testing whether FormData exists before defining it.
	 * - Increased robustness of .append.
	 * - Allow any typed array in .append.
	 * - Remove use of String.prototype.toString to work around a Firefox bug.
	 * - Use typed array in xhr.send instead of arraybuffer to get rid of deprecation
	 *   warnings.
	 **/
	(function(exports) {
	    if (exports.FormData) {
	        // Don't replace FormData if it already exists
	        return;
	    }
	    // Export variable to the global scope
	    exports.FormData = FormData;
	
	    var ___send$rw = XMLHttpRequest.prototype.send;
	    XMLHttpRequest.prototype.send = function(data) {
	        if (data instanceof FormData) {
	            if (!data.__endedMultipart) data.__append('--' + data.boundary + '--\r\n');
	            data.__endedMultipart = true;
	            this.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + data.boundary);
	            data = new Uint8Array(data.data);
	        }
	        // Invoke original XHR.send
	        return ___send$rw.call(this, data);
	    };
	
	    function FormData() {
	        // Force a Constructor
	        if (!(this instanceof FormData)) return new FormData();
	        // Generate a random boundary - This must be unique with respect to the form's contents.
	        this.boundary = '------RWWorkerFormDataBoundary' + Math.random().toString(36);
	        var internal_data = this.data = [];
	        /**
	        * Internal method.
	        * @param inp String | ArrayBuffer | Uint8Array  Input
	        */
	        this.__append = function(inp) {
	            var i = 0, len;
	            if (typeof inp == 'string') {
	                for (len = inp.length; i < len; ++i)
	                    internal_data.push(inp.charCodeAt(i) & 0xff);
	            } else if (inp && inp.byteLength) {/*If ArrayBuffer or typed array */
	                if (!('byteOffset' in inp))   /* If ArrayBuffer, wrap in view */
	                    inp = new Uint8Array(inp);
	                for (len = inp.byteLength; i < len; ++i)
	                    internal_data.push(inp[i] & 0xff);
	            }
	        };
	    }
	    /**
	    * @param name     String                                   Key name
	    * @param value    String|Blob|File|typed array|ArrayBuffer Value
	    * @param filename String                                   Optional File name (when value is not a string).
	    **/
	    FormData.prototype.append = function(name, value, filename) {
	        if (this.__endedMultipart) {
	            // Truncate the closing boundary
	            this.data.length -= this.boundary.length + 6;
	            this.__endedMultipart = false;
	        }
	        if (arguments.length < 2) {
	            throw new SyntaxError('Not enough arguments');
	        }
	        var part = '--' + this.boundary + '\r\n' + 
	                'Content-Disposition: form-data; name="' + name + '"';
	
	        if (value instanceof File || value instanceof Blob) {
	            return this.append(name,
	                            new Uint8Array(new FileReaderSync().readAsArrayBuffer(value)),
	                            filename || value.name);
	        } else if (typeof value.byteLength == 'number') {
	            // Duck-typed typed array or array buffer
	            part += '; filename="'+ (filename || 'blob').replace(/"/g,'%22') +'"\r\n';
	            part += 'Content-Type: application/octet-stream\r\n\r\n';
	            this.__append(part);
	            this.__append(value);
	            part = '\r\n';
	        } else {
	            part += '\r\n\r\n' + value + '\r\n';
	        }
	        this.__append(part);
	    };
	})(this);
	
}

self.importScripts("../../lib/pouchdb/dist/pouchdb.js");
self.importScripts("../../lib/pouchdb-upsert/dist/pouchdb.upsert.js");
self.importScripts("../../js/sync/browser.bundle.js");
self.importScripts("../../js/sync/lbclient.js");

self.onmessage = function(message) {
	var msg = message.data;
	
	if(msg.req === "login") {
		(function(id) {
			window.client.models.RemoteMobileUser.login(msg.params, msg.filter, function(err, res) {
				
				if(res) {
					// Save access token id
					window.localStorage.setItem("access_token", res.id);
				}
				else if(err) {
					// Make err.stack a simple primitive to allow passing as a message
					var errCpy = {
						message: err.message,
						stack: err.stack.toString()
					}
				}
				
				// Formulate and send response message
				var args = [errCpy, res];
				
				var returnMsg = {
					cbId: id,
					args: args
				};
				self.postMessage(returnMsg);
				
				
			});
		})(msg.cbId);
	}
	else if(msg.req === "remotegroup.findone") {
		(function(id) {
			window.client.models.RemoteGroup.findOne(msg.filter, function(err, res) {
				var args = [err, res];
				var returnMsg = {
					cbId: id,
					args: args
				};
				self.postMessage(returnMsg);
			});
		})(msg.cbId);
	}
	else if(msg.req === "sync") {
		(function(id) {
			window.client.sync(function(arg) {
				var args = [arg];
				var returnMsg = {
					cbId: id,
					args: args	
				};
				self.postMessage(returnMsg);
			});
		})(msg.cbId);
	}
	else if(msg.req === "localmobileuser.find") {
		(function(id) {
			if(msg.filter !== null)
			{
				window.client.models.LocalMobileUser.find(msg.filter, function(err, res) {
					var users = [];
					for(var i = 0; i < res.length; i++)
					{
						users.push(res[i].toJSON());
					}
					var args = [err, users];
					var returnMsg = {
						cbId: id,
						args: args	
					};
					self.postMessage(returnMsg);
				});
			}
			else
			{
				window.client.models.LocalMobileUser.find(function(err, res) {
					var users = [];
					for(var i = 0; i < res.length; i++)
					{
						users.push(res[i].toJSON());
					}
					var args = [err, users];
					var returnMsg = {
						cbId: id,
						args: args	
					};
					self.postMessage(returnMsg);
				});
			}
			
		})(msg.cbId);
	}
	else if(msg.req === "localposition.create") {
		(function(id) {
			window.client.models.LocalPosition.create(msg.params, function(err, res) {
				var args;
				 
				if(res)
				{
					args = [err, res.toJSON()];
				}				
				else
				{
					args = [err, res];
				}
				
				var returnMsg = {
						cbId: id,
						args: args
					};
				self.postMessage(returnMsg);
			});
		})(msg.cbId);
	}
	else if(msg.req === "remotemobileuser.logout") {
		(function(id) {
			window.client.models.RemoteMobileUser.logout(msg.params, function(err, res) {
				var args = [err, res];
				var returnMsg = {
					cbId: id,
					args: args
				};
				self.postMessage(returnMsg);
			});
		})(msg.cbId);
	}
	else if(msg.req === "localweatherreport.create") {
		(function(id) {
			window.client.models.LocalWeatherReport.create(msg.params, function(err, res) {
				if(res)
				{
					var args = [err, res.toJSON()];
					var returnMsg = {
						cbId: id,
						args: args
					};
					self.postMessage(returnMsg);
				}				
			});
		})(msg.cbId);
	}
	else if(msg.req === "localweatherreport.find") {
		(function(id) {
			if(msg.filter !== null)
			{
				window.client.models.LocalWeatherReport.find(msg.filter, function(err, res) {
					var reports = [];
					for(var i = 0; i < res.length; i++)
					{
						reports.push(res[i].toJSON());
					}
					var args = [err, reports];
					var returnMsg = {
						cbId: id,
						args: args
					};
					self.postMessage(returnMsg);
				});
			}
			else
			{
				window.client.models.LocalWeatherReport.find(function(err, res) {
					var reports = [];
					for(var i = 0; i < res.length; i++)
					{
						reports.push(res[i].toJSON());
					}
					var args = [err, reports];
					var returnMsg = {
						cbId: id,
						args: args
					};
					self.postMessage(returnMsg);
				});
			}
			
		})(msg.cbId);
	}
	else if(msg.req === "localposition.find") {
		(function(id) {
			if(msg.filter !== null) {
				window.client.models.LocalPosition.find(msg.filter, function(err, res) {
					var positions = [];
					for(var i = 0; i < res.length; i++)
					{
						positions.push(res[i].toJSON());
					}
					var args = [err, positions];
					var returnMsg = {
						cbId: id,
						args: args
					};
					self.postMessage(returnMsg);
				});
			}
			else {
				window.client.models.LocalPosition.find(function(err, res) {
					var positions = [];
					for(var i = 0; i < res.length; i++)
					{
						positions.push(res[i].toJSON());
					}
					var args = [err, positions];
					var returnMsg = {
						cbId: id,
						args: args
					};
					self.postMessage(returnMsg);
				});
			}
			
		})(msg.cbId);
	}
}