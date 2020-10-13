(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[0],{

/***/ "./node_modules/@nextcloud/axios/dist/index.js":
/*!*****************************************************!*\
  !*** ./node_modules/@nextcloud/axios/dist/index.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.object.assign */ "./node_modules/core-js/modules/es.object.assign.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _axios = _interopRequireDefault(__webpack_require__(/*! axios */ "./node_modules/@nextcloud/axios/node_modules/axios/index.js"));

var _auth = __webpack_require__(/*! @nextcloud/auth */ "./node_modules/@nextcloud/auth/dist/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var client = _axios.default.create({
  headers: {
    requesttoken: (0, _auth.getRequestToken)()
  }
});

var cancelableClient = Object.assign(client, {
  CancelToken: _axios.default.CancelToken,
  isCancel: _axios.default.isCancel
});
(0, _auth.onRequestTokenUpdate)(function (token) {
  return client.defaults.headers.requesttoken = token;
});
var _default = cancelableClient;
exports.default = _default;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@nextcloud/axios/node_modules/axios/index.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@nextcloud/axios/node_modules/axios/index.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/@nextcloud/axios/node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/@nextcloud/axios/node_modules/axios/lib/adapters/xhr.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@nextcloud/axios/node_modules/axios/lib/adapters/xhr.js ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/@nextcloud/axios/node_modules/axios/lib/utils.js");
var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/@nextcloud/axios/node_modules/axios/lib/core/settle.js");
var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/@nextcloud/axios/node_modules/axios/lib/helpers/cookies.js");
var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/@nextcloud/axios/node_modules/axios/lib/helpers/buildURL.js");
var buildFullPath = __webpack_require__(/*! ../core/buildFullPath */ "./node_modules/@nextcloud/axios/node_modules/axios/lib/core/buildFullPath.js");
var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/@nextcloud/axios/node_modules/axios/lib/helpers/parseHeaders.js");
var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/@nextcloud/axios/node_modules/axios/lib/helpers/isURLSameOrigin.js");
var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/@nextcloud/axios/node_modules/axios/lib/core/createError.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    if (
      (utils.isBlob(requestData) || utils.isFile(requestData)) &&
      requestData.type
    ) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = unescape(encodeURIComponent(config.auth.password)) || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "./node_modules/@nextcloud/axios/node_modules/axios/lib/axios.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@nextcloud/axios/node_modules/axios/lib/axios.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/@nextcloud/axios/node_modules/axios/lib/utils.js");
var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/@nextcloud/axios/node_modules/axios/lib/helpers/bind.js");
var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/@nextcloud/axios/node_modules/axios/lib/core/Axios.js");
var mergeConfig = __webpack_require__(/*! ./core/mergeConfig */ "./node_modules/@nextcloud/axios/node_modules/axios/lib/core/mergeConfig.js");
var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/@nextcloud/axios/node_modules/axios/lib/defaults.js");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(/*! ./cancel/Cancel */ "./node_modules/@nextcloud/axios/node_modules/axios/lib/cancel/Cancel.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/@nextcloud/axios/node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/@nextcloud/axios/node_modules/axios/lib/cancel/isCancel.js");

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/@nextcloud/axios/node_modules/axios/lib/helpers/spread.js");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),

/***/ "./node_modules/@nextcloud/axios/node_modules/axios/lib/cancel/Cancel.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@nextcloud/axios/node_modules/axios/lib/cancel/Cancel.js ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "./node_modules/@nextcloud/axios/node_modules/axios/lib/cancel/CancelToken.js":
/*!************************************************************************************!*\
  !*** ./node_modules/@nextcloud/axios/node_modules/axios/lib/cancel/CancelToken.js ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__(/*! ./Cancel */ "./node_modules/@nextcloud/axios/node_modules/axios/lib/cancel/Cancel.js");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "./node_modules/@nextcloud/axios/node_modules/axios/lib/cancel/isCancel.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/@nextcloud/axios/node_modules/axios/lib/cancel/isCancel.js ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "./node_modules/@nextcloud/axios/node_modules/axios/lib/core/Axios.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@nextcloud/axios/node_modules/axios/lib/core/Axios.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/@nextcloud/axios/node_modules/axios/lib/utils.js");
var buildURL = __webpack_require__(/*! ../helpers/buildURL */ "./node_modules/@nextcloud/axios/node_modules/axios/lib/helpers/buildURL.js");
var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/@nextcloud/axios/node_modules/axios/lib/core/InterceptorManager.js");
var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/@nextcloud/axios/node_modules/axios/lib/core/dispatchRequest.js");
var mergeConfig = __webpack_require__(/*! ./mergeConfig */ "./node_modules/@nextcloud/axios/node_modules/axios/lib/core/mergeConfig.js");

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "./node_modules/@nextcloud/axios/node_modules/axios/lib/core/InterceptorManager.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/@nextcloud/axios/node_modules/axios/lib/core/InterceptorManager.js ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/@nextcloud/axios/node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "./node_modules/@nextcloud/axios/node_modules/axios/lib/core/buildFullPath.js":
/*!************************************************************************************!*\
  !*** ./node_modules/@nextcloud/axios/node_modules/axios/lib/core/buildFullPath.js ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isAbsoluteURL = __webpack_require__(/*! ../helpers/isAbsoluteURL */ "./node_modules/@nextcloud/axios/node_modules/axios/lib/helpers/isAbsoluteURL.js");
var combineURLs = __webpack_require__(/*! ../helpers/combineURLs */ "./node_modules/@nextcloud/axios/node_modules/axios/lib/helpers/combineURLs.js");

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ "./node_modules/@nextcloud/axios/node_modules/axios/lib/core/createError.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/@nextcloud/axios/node_modules/axios/lib/core/createError.js ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__(/*! ./enhanceError */ "./node_modules/@nextcloud/axios/node_modules/axios/lib/core/enhanceError.js");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "./node_modules/@nextcloud/axios/node_modules/axios/lib/core/dispatchRequest.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/@nextcloud/axios/node_modules/axios/lib/core/dispatchRequest.js ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/@nextcloud/axios/node_modules/axios/lib/utils.js");
var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/@nextcloud/axios/node_modules/axios/lib/core/transformData.js");
var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/@nextcloud/axios/node_modules/axios/lib/cancel/isCancel.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/@nextcloud/axios/node_modules/axios/lib/defaults.js");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "./node_modules/@nextcloud/axios/node_modules/axios/lib/core/enhanceError.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/@nextcloud/axios/node_modules/axios/lib/core/enhanceError.js ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};


/***/ }),

/***/ "./node_modules/@nextcloud/axios/node_modules/axios/lib/core/mergeConfig.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/@nextcloud/axios/node_modules/axios/lib/core/mergeConfig.js ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/@nextcloud/axios/node_modules/axios/lib/utils.js");

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = [
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys)
    .concat(directMergeKeys);

  var otherKeys = Object
    .keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, mergeDeepProperties);

  return config;
};


/***/ }),

/***/ "./node_modules/@nextcloud/axios/node_modules/axios/lib/core/settle.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@nextcloud/axios/node_modules/axios/lib/core/settle.js ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__(/*! ./createError */ "./node_modules/@nextcloud/axios/node_modules/axios/lib/core/createError.js");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "./node_modules/@nextcloud/axios/node_modules/axios/lib/core/transformData.js":
/*!************************************************************************************!*\
  !*** ./node_modules/@nextcloud/axios/node_modules/axios/lib/core/transformData.js ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/@nextcloud/axios/node_modules/axios/lib/utils.js");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),

/***/ "./node_modules/@nextcloud/axios/node_modules/axios/lib/defaults.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@nextcloud/axios/node_modules/axios/lib/defaults.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var utils = __webpack_require__(/*! ./utils */ "./node_modules/@nextcloud/axios/node_modules/axios/lib/utils.js");
var normalizeHeaderName = __webpack_require__(/*! ./helpers/normalizeHeaderName */ "./node_modules/@nextcloud/axios/node_modules/axios/lib/helpers/normalizeHeaderName.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ./adapters/xhr */ "./node_modules/@nextcloud/axios/node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ./adapters/http */ "./node_modules/@nextcloud/axios/node_modules/axios/lib/adapters/xhr.js");
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../../process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/@nextcloud/axios/node_modules/axios/lib/helpers/bind.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@nextcloud/axios/node_modules/axios/lib/helpers/bind.js ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "./node_modules/@nextcloud/axios/node_modules/axios/lib/helpers/buildURL.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/@nextcloud/axios/node_modules/axios/lib/helpers/buildURL.js ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/@nextcloud/axios/node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "./node_modules/@nextcloud/axios/node_modules/axios/lib/helpers/combineURLs.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/@nextcloud/axios/node_modules/axios/lib/helpers/combineURLs.js ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "./node_modules/@nextcloud/axios/node_modules/axios/lib/helpers/cookies.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/@nextcloud/axios/node_modules/axios/lib/helpers/cookies.js ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/@nextcloud/axios/node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ "./node_modules/@nextcloud/axios/node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!***************************************************************************************!*\
  !*** ./node_modules/@nextcloud/axios/node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "./node_modules/@nextcloud/axios/node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/@nextcloud/axios/node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/@nextcloud/axios/node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ "./node_modules/@nextcloud/axios/node_modules/axios/lib/helpers/normalizeHeaderName.js":
/*!*********************************************************************************************!*\
  !*** ./node_modules/@nextcloud/axios/node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \*********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/@nextcloud/axios/node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "./node_modules/@nextcloud/axios/node_modules/axios/lib/helpers/parseHeaders.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/@nextcloud/axios/node_modules/axios/lib/helpers/parseHeaders.js ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/@nextcloud/axios/node_modules/axios/lib/utils.js");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "./node_modules/@nextcloud/axios/node_modules/axios/lib/helpers/spread.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@nextcloud/axios/node_modules/axios/lib/helpers/spread.js ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "./node_modules/@nextcloud/axios/node_modules/axios/lib/utils.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@nextcloud/axios/node_modules/axios/lib/utils.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/@nextcloud/axios/node_modules/axios/lib/helpers/bind.js");

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};


/***/ }),

/***/ "./node_modules/@nextcloud/vue/dist/Components/ActionButton.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@nextcloud/vue/dist/Components/ActionButton.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

!function(t,e){ true?module.exports=e():undefined}(window,(function(){return function(t){var e={};function n(o){if(e[o])return e[o].exports;var r=e[o]={i:o,l:!1,exports:{}};return t[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=t,n.c=e,n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(o,r,function(e){return t[e]}.bind(null,r));return o},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="/dist/",n(n.s=107)}({0:function(t,e,n){"use strict";function o(t,e,n,o,r,i,a,s){var c,u="function"==typeof t?t.options:t;if(e&&(u.render=e,u.staticRenderFns=n,u._compiled=!0),o&&(u.functional=!0),i&&(u._scopeId="data-v-"+i),a?(c=function(t){(t=t||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(t=__VUE_SSR_CONTEXT__),r&&r.call(this,t),t&&t._registeredComponents&&t._registeredComponents.add(a)},u._ssrRegister=c):r&&(c=s?function(){r.call(this,(u.functional?this.parent:this).$root.$options.shadowRoot)}:r),c)if(u.functional){u._injectStyles=c;var d=u.render;u.render=function(t,e){return c.call(e),d(t,e)}}else{var l=u.beforeCreate;u.beforeCreate=l?[].concat(l,c):[c]}return{exports:t,options:u}}n.d(e,"a",(function(){return o}))},1:function(t,e,n){"use strict";t.exports=function(t){var e=[];return e.toString=function(){return this.map((function(e){var n=function(t,e){var n=t[1]||"",o=t[3];if(!o)return n;if(e&&"function"==typeof btoa){var r=(a=o,s=btoa(unescape(encodeURIComponent(JSON.stringify(a)))),c="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(s),"/*# ".concat(c," */")),i=o.sources.map((function(t){return"/*# sourceURL=".concat(o.sourceRoot||"").concat(t," */")}));return[n].concat(i).concat([r]).join("\n")}var a,s,c;return[n].join("\n")}(e,t);return e[2]?"@media ".concat(e[2]," {").concat(n,"}"):n})).join("")},e.i=function(t,n,o){"string"==typeof t&&(t=[[null,t,""]]);var r={};if(o)for(var i=0;i<this.length;i++){var a=this[i][0];null!=a&&(r[a]=!0)}for(var s=0;s<t.length;s++){var c=[].concat(t[s]);o&&r[c[0]]||(n&&(c[2]?c[2]="".concat(n," and ").concat(c[2]):c[2]=n),e.push(c))}},e}},10:function(t,e){t.exports=__webpack_require__(/*! core-js/modules/web.dom-collections.iterator */ "./node_modules/core-js/modules/web.dom-collections.iterator.js")},107:function(t,e,n){"use strict";n.r(e);var o=n(83);
/**
 * @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */e.default=o.a},121:function(t,e,n){"use strict";var o=n(62);n.n(o).a},122:function(t,e,n){(e=n(1)(!1)).push([t.i,"li.active[data-v-33d3d922]{box-shadow:inset 4px 0 var(--color-primary)}.action--disabled[data-v-33d3d922]{pointer-events:none;opacity:.5}.action--disabled[data-v-33d3d922]:hover,.action--disabled[data-v-33d3d922]:focus{cursor:default;opacity:.5}.action--disabled *[data-v-33d3d922]{opacity:1 !important}.action-button[data-v-33d3d922]{display:flex;align-items:flex-start;width:100%;height:auto;margin:0;padding:0;padding-right:14px;cursor:pointer;white-space:nowrap;opacity:.7;color:var(--color-main-text);border:0;border-radius:0;background-color:transparent;box-shadow:none;font-weight:normal;line-height:44px}.action-button[data-v-33d3d922]:hover,.action-button[data-v-33d3d922]:focus{opacity:1}.action-button>span[data-v-33d3d922]{cursor:pointer;white-space:nowrap}.action-button__icon[data-v-33d3d922]{width:44px;height:44px;opacity:1;background-position:14px center;background-size:16px;background-repeat:no-repeat}.action-button p[data-v-33d3d922]{width:150px;padding:7px 0;margin:auto;cursor:pointer;text-align:left;line-height:1.6em}.action-button__longtext[data-v-33d3d922]{cursor:pointer;white-space:pre-wrap}.action-button__title[data-v-33d3d922]{font-weight:bold}\n",""]),t.exports=e},2:function(t,e,n){"use strict";function o(t,e){for(var n=[],o={},r=0;r<e.length;r++){var i=e[r],a=i[0],s={id:t+":"+r,css:i[1],media:i[2],sourceMap:i[3]};o[a]?o[a].parts.push(s):n.push(o[a]={id:a,parts:[s]})}return n}n.r(e),n.d(e,"default",(function(){return p}));var r="undefined"!=typeof document;if("undefined"!=typeof DEBUG&&DEBUG&&!r)throw new Error("vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment.");var i={},a=r&&(document.head||document.getElementsByTagName("head")[0]),s=null,c=0,u=!1,d=function(){},l=null,f="undefined"!=typeof navigator&&/msie [6-9]\b/.test(navigator.userAgent.toLowerCase());function p(t,e,n,r){u=n,l=r||{};var a=o(t,e);return h(a),function(e){for(var n=[],r=0;r<a.length;r++){var s=a[r];(c=i[s.id]).refs--,n.push(c)}e?h(a=o(t,e)):a=[];for(r=0;r<n.length;r++){var c;if(0===(c=n[r]).refs){for(var u=0;u<c.parts.length;u++)c.parts[u]();delete i[c.id]}}}}function h(t){for(var e=0;e<t.length;e++){var n=t[e],o=i[n.id];if(o){o.refs++;for(var r=0;r<o.parts.length;r++)o.parts[r](n.parts[r]);for(;r<n.parts.length;r++)o.parts.push(m(n.parts[r]));o.parts.length>n.parts.length&&(o.parts.length=n.parts.length)}else{var a=[];for(r=0;r<n.parts.length;r++)a.push(m(n.parts[r]));i[n.id]={id:n.id,refs:1,parts:a}}}}function v(){var t=document.createElement("style");return t.type="text/css",a.appendChild(t),t}function m(t){var e,n,o=document.querySelector('style[data-vue-ssr-id~="'+t.id+'"]');if(o){if(u)return d;o.parentNode.removeChild(o)}if(f){var r=c++;o=s||(s=v()),e=x.bind(null,o,r,!1),n=x.bind(null,o,r,!0)}else o=v(),e=y.bind(null,o),n=function(){o.parentNode.removeChild(o)};return e(t),function(o){if(o){if(o.css===t.css&&o.media===t.media&&o.sourceMap===t.sourceMap)return;e(t=o)}else n()}}var b,g=(b=[],function(t,e){return b[t]=e,b.filter(Boolean).join("\n")});function x(t,e,n,o){var r=n?"":o.css;if(t.styleSheet)t.styleSheet.cssText=g(e,r);else{var i=document.createTextNode(r),a=t.childNodes;a[e]&&t.removeChild(a[e]),a.length?t.insertBefore(i,a[e]):t.appendChild(i)}}function y(t,e){var n=e.css,o=e.media,r=e.sourceMap;if(o&&t.setAttribute("media",o),l.ssrId&&t.setAttribute("data-vue-ssr-id",e.id),r&&(n+="\n/*# sourceURL="+r.sources[0]+" */",n+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(r))))+" */"),t.styleSheet)t.styleSheet.cssText=n;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(n))}}},28:function(t,e,n){"use strict";n(7),n(32);var o=n(5),r=n.n(o);
/**
 * @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */e.a={before:function(){this.$slots.default&&""!==this.text.trim()||(r.a.util.warn("".concat(this.$options.name," cannot be empty and requires a meaningful text content"),this),this.$destroy(),this.$el.remove())},beforeUpdate:function(){this.text=this.getText()},data:function(){return{text:this.getText()}},computed:{isLongText:function(){return this.text&&this.text.trim().length>20}},methods:{getText:function(){return this.$slots.default?this.$slots.default[0].text.trim():""}}}},3:function(t,e){t.exports=__webpack_require__(/*! core-js/modules/es.object.to-string */ "./node_modules/core-js/modules/es.object.to-string.js")},32:function(t,e){t.exports=__webpack_require__(/*! core-js/modules/es.string.trim */ "./node_modules/core-js/modules/es.string.trim.js")},33:function(t,e){t.exports=__webpack_require__(/*! core-js/modules/web.url */ "./node_modules/core-js/modules/web.url.js")},38:function(t,e,n){"use strict";n(8),n(3),n(9),n(10),n(33);var o=n(28),r=(n(7),function(t,e){for(var n=t.$parent;n;){if(n.$options.name===e)return n;n=n.$parent}});e.a={mixins:[o.a],props:{icon:{type:String,default:""},title:{type:String,default:""},closeAfterClick:{type:Boolean,default:!1},ariaLabel:{type:String,default:""}},computed:{isIconUrl:function(){try{return new URL(this.icon)}catch(t){return!1}}},methods:{onClick:function(t){if(this.$emit("click",t),this.closeAfterClick){var e=r(this,"Actions");e&&e.closeMenu&&e.closeMenu()}}}}},5:function(t,e){t.exports=__webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm.js")},62:function(t,e,n){var o=n(122);"string"==typeof o&&(o=[[t.i,o,""]]),o.locals&&(t.exports=o.locals);(0,n(2).default)("ec11ce7c",o,!0,{})},7:function(t,e){t.exports=__webpack_require__(/*! core-js/modules/es.function.name */ "./node_modules/core-js/modules/es.function.name.js")},78:function(t,e){},8:function(t,e){t.exports=__webpack_require__(/*! core-js/modules/es.array.iterator */ "./node_modules/core-js/modules/es.array.iterator.js")},83:function(t,e,n){"use strict";var o={name:"ActionButton",mixins:[n(38).a],props:{disabled:{type:Boolean,default:!1}},computed:{isFocusable:function(){return!this.disabled}}},r=(n(121),n(0)),i=n(78),a=n.n(i),s=Object(r.a)(o,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("li",{staticClass:"action",class:{"action--disabled":t.disabled}},[n("button",{staticClass:"action-button",class:{focusable:t.isFocusable},attrs:{"aria-label":t.ariaLabel},on:{click:t.onClick}},[t._t("icon",[n("span",{staticClass:"action-button__icon",class:[t.isIconUrl?"action-button__icon--url":t.icon],style:{backgroundImage:t.isIconUrl?"url("+t.icon+")":null}})]),t._v(" "),t.title?n("p",[n("strong",{staticClass:"action-button__title"},[t._v("\n\t\t\t\t"+t._s(t.title)+"\n\t\t\t")]),t._v(" "),n("br"),t._v(" "),n("span",{staticClass:"action-button__longtext",domProps:{textContent:t._s(t.text)}})]):t.isLongText?n("p",{staticClass:"action-button__longtext",domProps:{textContent:t._s(t.text)}}):n("span",{staticClass:"action-button__text"},[t._v(t._s(t.text))]),t._v(" "),t._e()],2)])}),[],!1,null,"33d3d922",null);"function"==typeof a.a&&a()(s);e.a=s.exports},9:function(t,e){t.exports=__webpack_require__(/*! core-js/modules/es.string.iterator */ "./node_modules/core-js/modules/es.string.iterator.js")}})}));
//# sourceMappingURL=ActionButton.js.map

/***/ }),

/***/ "./node_modules/@nextcloud/vue/dist/Components/Actions.js":
/*!****************************************************************!*\
  !*** ./node_modules/@nextcloud/vue/dist/Components/Actions.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

!function(e,s){ true?module.exports=s():undefined}(window,(function(){return function(e){var s={};function t(o){if(s[o])return s[o].exports;var n=s[o]={i:o,l:!1,exports:{}};return e[o].call(n.exports,n,n.exports,t),n.l=!0,n.exports}return t.m=e,t.c=s,t.d=function(e,s,o){t.o(e,s)||Object.defineProperty(e,s,{enumerable:!0,get:o})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,s){if(1&s&&(e=t(e)),8&s)return e;if(4&s&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(t.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&s&&"string"!=typeof e)for(var n in e)t.d(o,n,function(s){return e[s]}.bind(null,n));return o},t.n=function(e){var s=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(s,"a",s),s},t.o=function(e,s){return Object.prototype.hasOwnProperty.call(e,s)},t.p="/dist/",t(t.s=54)}([function(e,s,t){"use strict";function o(e,s,t,o,n,r,c,i){var m,A="function"==typeof e?e.options:e;if(s&&(A.render=s,A.staticRenderFns=t,A._compiled=!0),o&&(A.functional=!0),r&&(A._scopeId="data-v-"+r),c?(m=function(e){(e=e||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(e=__VUE_SSR_CONTEXT__),n&&n.call(this,e),e&&e._registeredComponents&&e._registeredComponents.add(c)},A._ssrRegister=m):n&&(m=i?function(){n.call(this,(A.functional?this.parent:this).$root.$options.shadowRoot)}:n),m)if(A.functional){A._injectStyles=m;var a=A.render;A.render=function(e,s){return m.call(s),a(e,s)}}else{var l=A.beforeCreate;A.beforeCreate=l?[].concat(l,m):[m]}return{exports:e,options:A}}t.d(s,"a",(function(){return o}))},function(e,s,t){"use strict";e.exports=function(e){var s=[];return s.toString=function(){return this.map((function(s){var t=function(e,s){var t=e[1]||"",o=e[3];if(!o)return t;if(s&&"function"==typeof btoa){var n=(c=o,i=btoa(unescape(encodeURIComponent(JSON.stringify(c)))),m="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(i),"/*# ".concat(m," */")),r=o.sources.map((function(e){return"/*# sourceURL=".concat(o.sourceRoot||"").concat(e," */")}));return[t].concat(r).concat([n]).join("\n")}var c,i,m;return[t].join("\n")}(s,e);return s[2]?"@media ".concat(s[2]," {").concat(t,"}"):t})).join("")},s.i=function(e,t,o){"string"==typeof e&&(e=[[null,e,""]]);var n={};if(o)for(var r=0;r<this.length;r++){var c=this[r][0];null!=c&&(n[c]=!0)}for(var i=0;i<e.length;i++){var m=[].concat(e[i]);o&&n[m[0]]||(t&&(m[2]?m[2]="".concat(t," and ").concat(m[2]):m[2]=t),s.push(m))}},s}},function(e,s,t){"use strict";function o(e,s){for(var t=[],o={},n=0;n<s.length;n++){var r=s[n],c=r[0],i={id:e+":"+n,css:r[1],media:r[2],sourceMap:r[3]};o[c]?o[c].parts.push(i):t.push(o[c]={id:c,parts:[i]})}return t}t.r(s),t.d(s,"default",(function(){return u}));var n="undefined"!=typeof document;if("undefined"!=typeof DEBUG&&DEBUG&&!n)throw new Error("vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment.");var r={},c=n&&(document.head||document.getElementsByTagName("head")[0]),i=null,m=0,A=!1,a=function(){},l=null,g="undefined"!=typeof navigator&&/msie [6-9]\b/.test(navigator.userAgent.toLowerCase());function u(e,s,t,n){A=t,l=n||{};var c=o(e,s);return d(c),function(s){for(var t=[],n=0;n<c.length;n++){var i=c[n];(m=r[i.id]).refs--,t.push(m)}s?d(c=o(e,s)):c=[];for(n=0;n<t.length;n++){var m;if(0===(m=t[n]).refs){for(var A=0;A<m.parts.length;A++)m.parts[A]();delete r[m.id]}}}}function d(e){for(var s=0;s<e.length;s++){var t=e[s],o=r[t.id];if(o){o.refs++;for(var n=0;n<o.parts.length;n++)o.parts[n](t.parts[n]);for(;n<t.parts.length;n++)o.parts.push(v(t.parts[n]));o.parts.length>t.parts.length&&(o.parts.length=t.parts.length)}else{var c=[];for(n=0;n<t.parts.length;n++)c.push(v(t.parts[n]));r[t.id]={id:t.id,refs:1,parts:c}}}}function p(){var e=document.createElement("style");return e.type="text/css",c.appendChild(e),e}function v(e){var s,t,o=document.querySelector('style[data-vue-ssr-id~="'+e.id+'"]');if(o){if(A)return a;o.parentNode.removeChild(o)}if(g){var n=m++;o=i||(i=p()),s=E.bind(null,o,n,!1),t=E.bind(null,o,n,!0)}else o=p(),s=T.bind(null,o),t=function(){o.parentNode.removeChild(o)};return s(e),function(o){if(o){if(o.css===e.css&&o.media===e.media&&o.sourceMap===e.sourceMap)return;s(e=o)}else t()}}var f,M=(f=[],function(e,s){return f[e]=s,f.filter(Boolean).join("\n")});function E(e,s,t,o){var n=t?"":o.css;if(e.styleSheet)e.styleSheet.cssText=M(s,n);else{var r=document.createTextNode(n),c=e.childNodes;c[s]&&e.removeChild(c[s]),c.length?e.insertBefore(r,c[s]):e.appendChild(r)}}function T(e,s){var t=s.css,o=s.media,n=s.sourceMap;if(o&&e.setAttribute("media",o),l.ssrId&&e.setAttribute("data-vue-ssr-id",s.id),n&&(t+="\n/*# sourceURL="+n.sources[0]+" */",t+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(n))))+" */"),e.styleSheet)e.styleSheet.cssText=t;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(t))}}},function(e,s){e.exports=__webpack_require__(/*! core-js/modules/es.object.to-string */ "./node_modules/core-js/modules/es.object.to-string.js")},function(e,s){e.exports=__webpack_require__(/*! v-tooltip */ "./node_modules/v-tooltip/dist/v-tooltip.esm.js")},function(e,s){e.exports=__webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm.js")},function(e,s,t){"use strict";t.d(s,"b",(function(){return i})),t.d(s,"a",(function(){return c}));t(11);var o=t(27),n=Object(o.getGettextBuilder)().detectLocale();[{locale:"br",json:{charset:"utf-8",headers:{"Last-Translator":"Kervoas-Le Nabat Ewen <ewenkervoas@free.fr>, 2020","Language-Team":"Breton (https://www.transifex.com/nextcloud/teams/64236/br/)","Content-Type":"text/plain; charset=UTF-8",Language:"br","Plural-Forms":"nplurals=5; plural=((n%10 == 1) && (n%100 != 11) && (n%100 !=71) && (n%100 !=91) ? 0 :(n%10 == 2) && (n%100 != 12) && (n%100 !=72) && (n%100 !=92) ? 1 :(n%10 ==3 || n%10==4 || n%10==9) && (n%100 < 10 || n% 100 > 19) && (n%100 < 70 || n%100 > 79) && (n%100 < 90 || n%100 > 99) ? 2 :(n != 0 && n % 1000000 == 0) ? 3 : 4);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nKervoas-Le Nabat Ewen <ewenkervoas@free.fr>, 2020\n"},msgstr:["Last-Translator: Kervoas-Le Nabat Ewen <ewenkervoas@free.fr>, 2020\nLanguage-Team: Breton (https://www.transifex.com/nextcloud/teams/64236/br/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: br\nPlural-Forms: nplurals=5; plural=((n%10 == 1) && (n%100 != 11) && (n%100 !=71) && (n%100 !=91) ? 0 :(n%10 == 2) && (n%100 != 12) && (n%100 !=72) && (n%100 !=92) ? 1 :(n%10 ==3 || n%10==4 || n%10==9) && (n%100 < 10 || n% 100 > 19) && (n%100 < 70 || n%100 > 79) && (n%100 < 90 || n%100 > 99) ? 2 :(n != 0 && n % 1000000 == 0) ? 3 : 4);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (diwelus)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (bevennet)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:249"},msgstr:["Oberioù"]},Activities:{msgid:"Activities",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:176"},msgstr:["Oberiantizoù"]},"Animals & Nature":{msgid:"Animals & Nature",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:174"},msgstr:["Loened & Natur"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Dibab"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Serriñ"]},Custom:{msgid:"Custom",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:181"},msgstr:["Personelañ"]},Flags:{msgid:"Flags",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:180"},msgstr:["Bannieloù"]},"Food & Drink":{msgid:"Food & Drink",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:175"},msgstr:["Boued & Evajoù"]},"Frequently used":{msgid:"Frequently used",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:171"},msgstr:["Implijet alies"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Da heul"]},"No emoji found":{msgid:"No emoji found",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:168"},msgstr:["Emoji ebet kavet"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["Disoc'h ebet"]},Objects:{msgid:"Objects",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:178"},msgstr:["Traoù"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Arsav an diaporama"]},"People & Body":{msgid:"People & Body",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:173"},msgstr:["Tud & Korf"]},"Pick an emoji":{msgid:"Pick an emoji",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:153"},msgstr:["Choaz un emoji"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["A-raok"]},Search:{msgid:"Search",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:167"},msgstr:["Klask"]},"Search results":{msgid:"Search results",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:170"},msgstr:["Disoc'hoù an enklask"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Choaz ur c'hlav"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:57"},msgstr:["Arventennoù"]},"Smileys & Emotion":{msgid:"Smileys & Emotion",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:172"},msgstr:["Smileyioù & Fromoù"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Kregiñ an diaporama"]},Symbols:{msgid:"Symbols",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:179"},msgstr:["Arouezioù"]},"Travel & Places":{msgid:"Travel & Places",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:177"},msgstr:["Beaj & Lec'hioù"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["Dibosupl eo klask ar strollad"]}}}}},{locale:"ca",json:{charset:"utf-8",headers:{"Last-Translator":"Toni Hermoso Pulido <toniher@softcatala.cat>, 2020","Language-Team":"Catalan (https://www.transifex.com/nextcloud/teams/64236/ca/)","Content-Type":"text/plain; charset=UTF-8",Language:"ca","Plural-Forms":"nplurals=2; plural=(n != 1);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nCarles Ferrando Garcia <carles.ferrando@gnuescultura.eu>, 2020\nMarc Riera <marcriera@softcatala.org>, 2020\nToni Hermoso Pulido <toniher@softcatala.cat>, 2020\n"},msgstr:["Last-Translator: Toni Hermoso Pulido <toniher@softcatala.cat>, 2020\nLanguage-Team: Catalan (https://www.transifex.com/nextcloud/teams/64236/ca/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: ca\nPlural-Forms: nplurals=2; plural=(n != 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (invisible)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (restringit)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:254"},msgstr:["Accions"]},Activities:{msgid:"Activities",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:176"},msgstr:["Activitats"]},"Animals & Nature":{msgid:"Animals & Nature",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:174"},msgstr:["Animals i natura"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Tria"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Tanca"]},Custom:{msgid:"Custom",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:181"},msgstr:["Personalitzat"]},Flags:{msgid:"Flags",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:180"},msgstr:["Marques"]},"Food & Drink":{msgid:"Food & Drink",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:175"},msgstr:["Menjar i begudes"]},"Frequently used":{msgid:"Frequently used",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:171"},msgstr:["Utilitzats recentment"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Següent"]},"No emoji found":{msgid:"No emoji found",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:168"},msgstr:["No s'ha trobat cap emoji"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["Sense resultats"]},Objects:{msgid:"Objects",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:178"},msgstr:["Objectes"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Atura la presentació"]},"People & Body":{msgid:"People & Body",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:173"},msgstr:["Persones i cos"]},"Pick an emoji":{msgid:"Pick an emoji",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:153"},msgstr:["Trieu un emoji"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Anterior"]},Search:{msgid:"Search",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:167"},msgstr:["Cerca"]},"Search results":{msgid:"Search results",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:170"},msgstr:["Resultats de cerca"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Selecciona una etiqueta"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:57"},msgstr:["Paràmetres"]},"Smileys & Emotion":{msgid:"Smileys & Emotion",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:172"},msgstr:["Cares i emocions"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Inicia la presentació"]},Symbols:{msgid:"Symbols",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:179"},msgstr:["Símbols"]},"Travel & Places":{msgid:"Travel & Places",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:177"},msgstr:["Viatges i llocs"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["No es pot cercar el grup"]}}}}},{locale:"cs_CZ",json:{charset:"utf-8",headers:{"Last-Translator":"Pavel Borecki <pavel.borecki@gmail.com>, 2020","Language-Team":"Czech (Czech Republic) (https://www.transifex.com/nextcloud/teams/64236/cs_CZ/)","Content-Type":"text/plain; charset=UTF-8",Language:"cs_CZ","Plural-Forms":"nplurals=4; plural=(n == 1 && n % 1 == 0) ? 0 : (n >= 2 && n <= 4 && n % 1 == 0) ? 1: (n % 1 != 0 ) ? 2 : 3;"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nPavel Borecki <pavel.borecki@gmail.com>, 2020\n"},msgstr:["Last-Translator: Pavel Borecki <pavel.borecki@gmail.com>, 2020\nLanguage-Team: Czech (Czech Republic) (https://www.transifex.com/nextcloud/teams/64236/cs_CZ/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: cs_CZ\nPlural-Forms: nplurals=4; plural=(n == 1 && n % 1 == 0) ? 0 : (n >= 2 && n <= 4 && n % 1 == 0) ? 1: (n % 1 != 0 ) ? 2 : 3;\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (neviditelný)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (omezený)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:249"},msgstr:["Akce"]},Activities:{msgid:"Activities",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:176"},msgstr:["Aktivity"]},"Animals & Nature":{msgid:"Animals & Nature",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:174"},msgstr:["Zvířata a příroda"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Zvolit"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Zavřít"]},Custom:{msgid:"Custom",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:181"},msgstr:["Uživatelsky určené"]},Flags:{msgid:"Flags",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:180"},msgstr:["Příznaky"]},"Food & Drink":{msgid:"Food & Drink",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:175"},msgstr:["Jídlo a pití"]},"Frequently used":{msgid:"Frequently used",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:171"},msgstr:["Často používané"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Následující"]},"No emoji found":{msgid:"No emoji found",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:168"},msgstr:["Nenalezeno žádné emoji"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["Žádné výsledky"]},Objects:{msgid:"Objects",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:178"},msgstr:["Objekty"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Pozastavit prezentaci"]},"People & Body":{msgid:"People & Body",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:173"},msgstr:["Lidé a tělo"]},"Pick an emoji":{msgid:"Pick an emoji",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:153"},msgstr:["Vyberte emoji"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Předchozí"]},Search:{msgid:"Search",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:167"},msgstr:["Hledat"]},"Search results":{msgid:"Search results",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:170"},msgstr:["Výsledky hledání"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Vybrat štítek"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Nastavení"]},"Smileys & Emotion":{msgid:"Smileys & Emotion",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:172"},msgstr:["Úsměvy a emoce"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Spustit prezentaci"]},Symbols:{msgid:"Symbols",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:179"},msgstr:["Symboly"]},"Travel & Places":{msgid:"Travel & Places",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:177"},msgstr:["Cestování a místa"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["Nedaří se hledat skupinu"]}}}}},{locale:"da",json:{charset:"utf-8",headers:{"Last-Translator":"Thomas Nielsen <thsnielsen@gmail.com>, 2020","Language-Team":"Danish (https://www.transifex.com/nextcloud/teams/64236/da/)","Content-Type":"text/plain; charset=UTF-8",Language:"da","Plural-Forms":"nplurals=2; plural=(n != 1);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nThomas Nielsen <thsnielsen@gmail.com>, 2020\n"},msgstr:["Last-Translator: Thomas Nielsen <thsnielsen@gmail.com>, 2020\nLanguage-Team: Danish (https://www.transifex.com/nextcloud/teams/64236/da/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: da\nPlural-Forms: nplurals=2; plural=(n != 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (usynlig)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (begrænset)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:247"},msgstr:["Handlinger"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Vælg"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Luk"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Videre"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:172\nsrc/components/MultiselectTags/MultiselectTags.vue:78"},msgstr:["Ingen resultater"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Suspender fremvisning"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Forrige"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Vælg et mærke"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Indstillinger"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Start fremvisning"]}}}}},{locale:"de",json:{charset:"utf-8",headers:{"Last-Translator":"Mark Ziegler <mark.ziegler@rakekniven.de>, 2020","Language-Team":"German (https://www.transifex.com/nextcloud/teams/64236/de/)","Content-Type":"text/plain; charset=UTF-8",Language:"de","Plural-Forms":"nplurals=2; plural=(n != 1);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nPhilipp Fischbeck <pfischbeck@googlemail.com>, 2020\nAndreas Eitel <github-aneitel@online.de>, 2020\nMario Siegmann <mario_siegmann@web.de>, 2020\nJoachim Sokolowski, 2020\nMark Ziegler <mark.ziegler@rakekniven.de>, 2020\n"},msgstr:["Last-Translator: Mark Ziegler <mark.ziegler@rakekniven.de>, 2020\nLanguage-Team: German (https://www.transifex.com/nextcloud/teams/64236/de/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: de\nPlural-Forms: nplurals=2; plural=(n != 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (unsichtbar)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (eingeschränkt)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:249"},msgstr:["Aktionen"]},Activities:{msgid:"Activities",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:176"},msgstr:["Aktivitäten"]},"Animals & Nature":{msgid:"Animals & Nature",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:174"},msgstr:["Tiere & Natur"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Auswählen"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Schließen"]},Custom:{msgid:"Custom",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:181"},msgstr:["Benutzerdefiniert"]},Flags:{msgid:"Flags",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:180"},msgstr:["Flaggen"]},"Food & Drink":{msgid:"Food & Drink",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:175"},msgstr:["Essen & Trinken"]},"Frequently used":{msgid:"Frequently used",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:171"},msgstr:["Häufig verwendet"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Weiter"]},"No emoji found":{msgid:"No emoji found",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:168"},msgstr:["Kein Emoji gefunden"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["Keine Ergebnisse"]},Objects:{msgid:"Objects",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:178"},msgstr:["Gegenstände"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Diashow pausieren"]},"People & Body":{msgid:"People & Body",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:173"},msgstr:["Menschen & Körper"]},"Pick an emoji":{msgid:"Pick an emoji",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:153"},msgstr:["Ein Emoji auswählen"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Vorherige"]},Search:{msgid:"Search",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:167"},msgstr:["Suche"]},"Search results":{msgid:"Search results",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:170"},msgstr:["Suchergebnisse"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Schlagwort auswählen"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:57"},msgstr:["Einstellungen"]},"Smileys & Emotion":{msgid:"Smileys & Emotion",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:172"},msgstr:["Smileys & Emotionen"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Diashow starten"]},Symbols:{msgid:"Symbols",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:179"},msgstr:["Symbole"]},"Travel & Places":{msgid:"Travel & Places",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:177"},msgstr:["Reisen & Orte"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["Die Gruppe konnte nicht durchsucht werden"]}}}}},{locale:"de_DE",json:{charset:"utf-8",headers:{"Last-Translator":"Mark Ziegler <mark.ziegler@rakekniven.de>, 2020","Language-Team":"German (Germany) (https://www.transifex.com/nextcloud/teams/64236/de_DE/)","Content-Type":"text/plain; charset=UTF-8",Language:"de_DE","Plural-Forms":"nplurals=2; plural=(n != 1);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nPhilipp Fischbeck <pfischbeck@googlemail.com>, 2020\nProfDrJones <jones@fs.cs.hm.edu>, 2020\nMario Siegmann <mario_siegmann@web.de>, 2020\nMark Ziegler <mark.ziegler@rakekniven.de>, 2020\n"},msgstr:["Last-Translator: Mark Ziegler <mark.ziegler@rakekniven.de>, 2020\nLanguage-Team: German (Germany) (https://www.transifex.com/nextcloud/teams/64236/de_DE/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: de_DE\nPlural-Forms: nplurals=2; plural=(n != 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (unsichtbar)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (eingeschränkt)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:249"},msgstr:["Aktionen"]},Activities:{msgid:"Activities",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:176"},msgstr:["Aktivitäten"]},"Animals & Nature":{msgid:"Animals & Nature",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:174"},msgstr:["Tiere & Natur"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Auswählen"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Schließen"]},Custom:{msgid:"Custom",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:181"},msgstr:["Benutzerdefiniert"]},Flags:{msgid:"Flags",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:180"},msgstr:["Flaggen"]},"Food & Drink":{msgid:"Food & Drink",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:175"},msgstr:["Essen & Trinken"]},"Frequently used":{msgid:"Frequently used",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:171"},msgstr:["Häufig verwendet"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Weiter"]},"No emoji found":{msgid:"No emoji found",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:168"},msgstr:["Kein Emoji gefunden"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["Keine Ergebnisse"]},Objects:{msgid:"Objects",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:178"},msgstr:["Gegenstände"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Diashow pausieren"]},"People & Body":{msgid:"People & Body",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:173"},msgstr:["Menschen & Körper"]},"Pick an emoji":{msgid:"Pick an emoji",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:153"},msgstr:["Ein Emoji auswählen"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Vorherige"]},Search:{msgid:"Search",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:167"},msgstr:["Suche"]},"Search results":{msgid:"Search results",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:170"},msgstr:["Suchergebnisse"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Schlagwort auswählen"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:57"},msgstr:["Einstellungen"]},"Smileys & Emotion":{msgid:"Smileys & Emotion",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:172"},msgstr:["Smileys & Emotionen"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Diashow starten"]},Symbols:{msgid:"Symbols",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:179"},msgstr:["Symbole"]},"Travel & Places":{msgid:"Travel & Places",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:177"},msgstr:["Reisen & Orte"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["Die Gruppe kann nicht durchsucht werden"]}}}}},{locale:"el",json:{charset:"utf-8",headers:{"Last-Translator":"Efstathios Iosifidis <iefstathios@gmail.com>, 2020","Language-Team":"Greek (https://www.transifex.com/nextcloud/teams/64236/el/)","Content-Type":"text/plain; charset=UTF-8",Language:"el","Plural-Forms":"nplurals=2; plural=(n != 1);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\ngeorge k <norhorn@gmail.com>, 2020\nEfstathios Iosifidis <iefstathios@gmail.com>, 2020\n"},msgstr:["Last-Translator: Efstathios Iosifidis <iefstathios@gmail.com>, 2020\nLanguage-Team: Greek (https://www.transifex.com/nextcloud/teams/64236/el/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: el\nPlural-Forms: nplurals=2; plural=(n != 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (αόρατο)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (περιορισμένο)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:249"},msgstr:["Ενέργειες"]},Activities:{msgid:"Activities",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:176"},msgstr:["Δραστηριότητες"]},"Animals & Nature":{msgid:"Animals & Nature",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:174"},msgstr:["Ζώα & Φύση"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Επιλογή"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Κλείσιμο"]},Custom:{msgid:"Custom",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:181"},msgstr:["Προσαρμογή"]},Flags:{msgid:"Flags",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:180"},msgstr:["Σημαίες"]},"Food & Drink":{msgid:"Food & Drink",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:175"},msgstr:["Φαγητό & Ποτό"]},"Frequently used":{msgid:"Frequently used",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:171"},msgstr:["Συχνά χρησιμοποιούμενο"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Επόμενο"]},"No emoji found":{msgid:"No emoji found",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:168"},msgstr:["Δεν βρέθηκε emoji"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["Κανένα αποτέλεσμα"]},Objects:{msgid:"Objects",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:178"},msgstr:["Αντικείμενα"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Παύση προβολής διαφανειών"]},"People & Body":{msgid:"People & Body",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:173"},msgstr:["Άνθρωποι & Σώμα"]},"Pick an emoji":{msgid:"Pick an emoji",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:153"},msgstr:["Επιλέξτε ένα emoji"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Προηγούμενο"]},Search:{msgid:"Search",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:167"},msgstr:["Αναζήτηση"]},"Search results":{msgid:"Search results",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:170"},msgstr:["Αποτελέσματα αναζήτησης"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Επιλογή ετικέτας"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Ρυθμίσεις"]},"Smileys & Emotion":{msgid:"Smileys & Emotion",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:172"},msgstr:["Φατσούλες & Συναίσθημα"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Έναρξη προβολής διαφανειών"]},Symbols:{msgid:"Symbols",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:179"},msgstr:["Σύμβολα"]},"Travel & Places":{msgid:"Travel & Places",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:177"},msgstr:["Ταξίδια & Τοποθεσίες"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["Δεν είναι δυνατή η αναζήτηση της ομάδας"]}}}}},{locale:"es",json:{charset:"utf-8",headers:{"Last-Translator":"asd fgh <c1@cgps.xyz>, 2020","Language-Team":"Spanish (https://www.transifex.com/nextcloud/teams/64236/es/)","Content-Type":"text/plain; charset=UTF-8",Language:"es","Plural-Forms":"nplurals=2; plural=(n != 1);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\njavier san felipe <jsanfe@gmail.com>, 2020\nasd fgh <c1@cgps.xyz>, 2020\n"},msgstr:["Last-Translator: asd fgh <c1@cgps.xyz>, 2020\nLanguage-Team: Spanish (https://www.transifex.com/nextcloud/teams/64236/es/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: es\nPlural-Forms: nplurals=2; plural=(n != 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{etiqueta} (invisible)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{etiqueta} (restringido)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:247"},msgstr:["acciones"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Elige"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Cierra"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Siguiente"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:172\nsrc/components/MultiselectTags/MultiselectTags.vue:78"},msgstr:[" Ningún resultado"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Pausa la presentación "]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Anterior"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Selecciona una etiqueta"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Ajustes"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Comienza la presentación "]}}}}},{locale:"eu",json:{charset:"utf-8",headers:{"Last-Translator":"Asier Iturralde Sarasola <asier.iturralde@gmail.com>, 2020","Language-Team":"Basque (https://www.transifex.com/nextcloud/teams/64236/eu/)","Content-Type":"text/plain; charset=UTF-8",Language:"eu","Plural-Forms":"nplurals=2; plural=(n != 1);"},translations:{"":{"":{msgid:"",comments:{translator:"Translators:\nAsier Iturralde Sarasola <asier.iturralde@gmail.com>, 2020\n"},msgstr:["Last-Translator: Asier Iturralde Sarasola <asier.iturralde@gmail.com>, 2020\nLanguage-Team: Basque (https://www.transifex.com/nextcloud/teams/64236/eu/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: eu\nPlural-Forms: nplurals=2; plural=(n != 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:169"},msgstr:["{tag} (ikusezina)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:172"},msgstr:["{tag} (mugatua)"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Aukeratu"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:109"},msgstr:["Itxi"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:154"},msgstr:["Hurrengoa"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:169\nsrc/components/MultiselectTags/MultiselectTags.vue:78"},msgstr:["Emaitzarik ez"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:290"},msgstr:["Pausatu diaporama"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:134"},msgstr:["Aurrekoa"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Hautatu etiketa bat"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Ezarpenak"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:290"},msgstr:["Hasi diaporama"]}}}}},{locale:"fi_FI",json:{charset:"utf-8",headers:{"Last-Translator":"Robin Lahtinen <robin.lahtinen@gmail.com>, 2020","Language-Team":"Finnish (Finland) (https://www.transifex.com/nextcloud/teams/64236/fi_FI/)","Content-Type":"text/plain; charset=UTF-8",Language:"fi_FI","Plural-Forms":"nplurals=2; plural=(n != 1);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nRobin Lahtinen <robin.lahtinen@gmail.com>, 2020\n"},msgstr:["Last-Translator: Robin Lahtinen <robin.lahtinen@gmail.com>, 2020\nLanguage-Team: Finnish (Finland) (https://www.transifex.com/nextcloud/teams/64236/fi_FI/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: fi_FI\nPlural-Forms: nplurals=2; plural=(n != 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (näkymätön)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (rajoitettu)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:247"},msgstr:["Toiminnot"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Valitse"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Sulje"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Seuraava"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["Ei tuloksia"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Keskeytä diaesitys"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Edellinen"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Valitse tagi"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Asetukset"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Aloita diaesitys"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["Ryhmää ei voi hakea"]}}}}},{locale:"fr",json:{charset:"utf-8",headers:{"Last-Translator":"Julien Veyssier <eneiluj@gmx.fr>, 2020","Language-Team":"French (https://www.transifex.com/nextcloud/teams/64236/fr/)","Content-Type":"text/plain; charset=UTF-8",Language:"fr","Plural-Forms":"nplurals=2; plural=(n > 1);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nBrendan Abolivier <transifex@brendanabolivier.com>, 2020\ngud bes <gudbes@protonmail.com>, 2020\nGreg Greg <grena@grenabox.fr>, 2020\nLuclu7 <theluc7andcompagnie@gmail.com>, 2020\nJulien Veyssier <eneiluj@gmx.fr>, 2020\n"},msgstr:["Last-Translator: Julien Veyssier <eneiluj@gmx.fr>, 2020\nLanguage-Team: French (https://www.transifex.com/nextcloud/teams/64236/fr/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: fr\nPlural-Forms: nplurals=2; plural=(n > 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (invisible)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (restreint)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:249"},msgstr:["Actions"]},Activities:{msgid:"Activities",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:176"},msgstr:["Activités"]},"Animals & Nature":{msgid:"Animals & Nature",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:174"},msgstr:["Animaux & Nature"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Choisir"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Fermer"]},Custom:{msgid:"Custom",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:181"},msgstr:["Personnalisé"]},Flags:{msgid:"Flags",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:180"},msgstr:["Drapeaux"]},"Food & Drink":{msgid:"Food & Drink",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:175"},msgstr:["Nourriture & Boissons"]},"Frequently used":{msgid:"Frequently used",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:171"},msgstr:["Utilisés fréquemment"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Suivant"]},"No emoji found":{msgid:"No emoji found",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:168"},msgstr:["Pas d’émoji trouvé"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["Aucun résultat"]},Objects:{msgid:"Objects",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:178"},msgstr:["Objets"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Mettre le diaporama en pause"]},"People & Body":{msgid:"People & Body",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:173"},msgstr:["Personnes & Corps"]},"Pick an emoji":{msgid:"Pick an emoji",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:153"},msgstr:["Choisissez un émoji"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Précédent"]},Search:{msgid:"Search",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:167"},msgstr:["Chercher"]},"Search results":{msgid:"Search results",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:170"},msgstr:["Résultats de recherche"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Sélectionnez une balise"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Paramètres"]},"Smileys & Emotion":{msgid:"Smileys & Emotion",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:172"},msgstr:["Smileys & Émotions"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Démarrer le diaporama"]},Symbols:{msgid:"Symbols",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:179"},msgstr:["Symboles"]},"Travel & Places":{msgid:"Travel & Places",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:177"},msgstr:["Voyage & Lieux"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["Impossible de chercher le groupe"]}}}}},{locale:"gl",json:{charset:"utf-8",headers:{"Last-Translator":"Miguel Anxo Bouzada <mbouzada@gmail.com>, 2020","Language-Team":"Galician (https://www.transifex.com/nextcloud/teams/64236/gl/)","Content-Type":"text/plain; charset=UTF-8",Language:"gl","Plural-Forms":"nplurals=2; plural=(n != 1);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nMiguel Anxo Bouzada <mbouzada@gmail.com>, 2020\n"},msgstr:["Last-Translator: Miguel Anxo Bouzada <mbouzada@gmail.com>, 2020\nLanguage-Team: Galician (https://www.transifex.com/nextcloud/teams/64236/gl/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: gl\nPlural-Forms: nplurals=2; plural=(n != 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (invisíbel)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (restrinxido)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:249"},msgstr:["Accións"]},Activities:{msgid:"Activities",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:176"},msgstr:["Actividades"]},"Animals & Nature":{msgid:"Animals & Nature",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:174"},msgstr:["Animais e natureza"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Escoller"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Pechar"]},Custom:{msgid:"Custom",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:181"},msgstr:["Personalizado"]},Flags:{msgid:"Flags",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:180"},msgstr:["Bandeiras"]},"Food & Drink":{msgid:"Food & Drink",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:175"},msgstr:["Comida e bebida"]},"Frequently used":{msgid:"Frequently used",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:171"},msgstr:["Usado con frecuencia"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Seguinte"]},"No emoji found":{msgid:"No emoji found",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:168"},msgstr:["Non se atopou ningún «emoji»"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["Sen resultados"]},Objects:{msgid:"Objects",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:178"},msgstr:["Obxectos"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Pausar o diaporama"]},"People & Body":{msgid:"People & Body",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:173"},msgstr:["Persoas e corpo"]},"Pick an emoji":{msgid:"Pick an emoji",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:153"},msgstr:["Escolla un «emoji»"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Anterir"]},Search:{msgid:"Search",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:167"},msgstr:["Buscar"]},"Search results":{msgid:"Search results",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:170"},msgstr:["Resultados da busca"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Seleccione unha etiqueta"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Axustes"]},"Smileys & Emotion":{msgid:"Smileys & Emotion",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:172"},msgstr:["Sorrisos e emocións"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Iniciar o diaporama"]},Symbols:{msgid:"Symbols",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:179"},msgstr:["Símbolos"]},"Travel & Places":{msgid:"Travel & Places",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:177"},msgstr:["Viaxes e lugares"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["Non foi posíbel buscar o grupo"]}}}}},{locale:"he",json:{charset:"utf-8",headers:{"Last-Translator":"Yaron Shahrabani <sh.yaron@gmail.com>, 2020","Language-Team":"Hebrew (https://www.transifex.com/nextcloud/teams/64236/he/)","Content-Type":"text/plain; charset=UTF-8",Language:"he","Plural-Forms":"nplurals=4; plural=(n == 1 && n % 1 == 0) ? 0 : (n == 2 && n % 1 == 0) ? 1: (n % 10 == 0 && n % 1 == 0 && n > 10) ? 2 : 3;"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nYaron Shahrabani <sh.yaron@gmail.com>, 2020\n"},msgstr:["Last-Translator: Yaron Shahrabani <sh.yaron@gmail.com>, 2020\nLanguage-Team: Hebrew (https://www.transifex.com/nextcloud/teams/64236/he/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: he\nPlural-Forms: nplurals=4; plural=(n == 1 && n % 1 == 0) ? 0 : (n == 2 && n % 1 == 0) ? 1: (n % 10 == 0 && n % 1 == 0 && n > 10) ? 2 : 3;\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (נסתר)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (מוגבל)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:249"},msgstr:["פעולות"]},Activities:{msgid:"Activities",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:176"},msgstr:["פעילויות"]},"Animals & Nature":{msgid:"Animals & Nature",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:174"},msgstr:["חיות וטבע"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["בחירה"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["סגירה"]},Custom:{msgid:"Custom",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:181"},msgstr:["בהתאמה אישית"]},Flags:{msgid:"Flags",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:180"},msgstr:["דגלים"]},"Food & Drink":{msgid:"Food & Drink",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:175"},msgstr:["מזון ומשקאות"]},"Frequently used":{msgid:"Frequently used",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:171"},msgstr:["בשימוש תדיר"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["הבא"]},"No emoji found":{msgid:"No emoji found",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:168"},msgstr:["לא נמצא אמוג׳י"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["אין תוצאות"]},Objects:{msgid:"Objects",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:178"},msgstr:["חפצים"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["השהיית מצגת"]},"People & Body":{msgid:"People & Body",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:173"},msgstr:["אנשים וגוף"]},"Pick an emoji":{msgid:"Pick an emoji",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:153"},msgstr:["נא לבחור אמוג׳י"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["הקודם"]},Search:{msgid:"Search",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:167"},msgstr:["חיפוש"]},"Search results":{msgid:"Search results",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:170"},msgstr:["תוצאות חיפוש"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["בחירת תגית"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:57"},msgstr:["הגדרות"]},"Smileys & Emotion":{msgid:"Smileys & Emotion",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:172"},msgstr:["חייכנים ורגשונים"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["התחלת המצגת"]},Symbols:{msgid:"Symbols",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:179"},msgstr:["סמלים"]},"Travel & Places":{msgid:"Travel & Places",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:177"},msgstr:["טיולים ומקומות"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["לא ניתן לחפש בקבוצה"]}}}}},{locale:"hu_HU",json:{charset:"utf-8",headers:{"Last-Translator":"asbot10 <asbot000@gmail.com>, 2020","Language-Team":"Hungarian (Hungary) (https://www.transifex.com/nextcloud/teams/64236/hu_HU/)","Content-Type":"text/plain; charset=UTF-8",Language:"hu_HU","Plural-Forms":"nplurals=2; plural=(n != 1);"},translations:{"":{"":{msgid:"",comments:{translator:"Translators:\nBalázs Meskó <mesko.balazs@fsf.hu>, 2020\nasbot10 <asbot000@gmail.com>, 2020\n"},msgstr:["Last-Translator: asbot10 <asbot000@gmail.com>, 2020\nLanguage-Team: Hungarian (Hungary) (https://www.transifex.com/nextcloud/teams/64236/hu_HU/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: hu_HU\nPlural-Forms: nplurals=2; plural=(n != 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (láthatatlan)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (korlátozott)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:197"},msgstr:["Műveletek"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Válassszon"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Bezárás"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Következő"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:172\nsrc/components/MultiselectTags/MultiselectTags.vue:78"},msgstr:["Nincs találat"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Diavetítés szüneteltetése"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Előző"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Válasszon címkét"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Beállítások"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Diavetítés indítása"]}}}}},{locale:"is",json:{charset:"utf-8",headers:{"Last-Translator":"Sveinn í Felli <sv1@fellsnet.is>, 2020","Language-Team":"Icelandic (https://www.transifex.com/nextcloud/teams/64236/is/)","Content-Type":"text/plain; charset=UTF-8",Language:"is","Plural-Forms":"nplurals=2; plural=(n % 10 != 1 || n % 100 == 11);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nSveinn í Felli <sv1@fellsnet.is>, 2020\n"},msgstr:["Last-Translator: Sveinn í Felli <sv1@fellsnet.is>, 2020\nLanguage-Team: Icelandic (https://www.transifex.com/nextcloud/teams/64236/is/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: is\nPlural-Forms: nplurals=2; plural=(n % 10 != 1 || n % 100 == 11);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (ósýnilegt)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (takmarkað)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:254"},msgstr:["Aðgerðir"]},Activities:{msgid:"Activities",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:176"},msgstr:["Aðgerðir"]},"Animals & Nature":{msgid:"Animals & Nature",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:174"},msgstr:["Dýr og náttúra"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Velja"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Loka"]},Custom:{msgid:"Custom",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:181"},msgstr:["Sérsniðið"]},Flags:{msgid:"Flags",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:180"},msgstr:["Flögg"]},"Food & Drink":{msgid:"Food & Drink",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:175"},msgstr:["Matur og drykkur"]},"Frequently used":{msgid:"Frequently used",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:171"},msgstr:["Oftast notað"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Næsta"]},"No emoji found":{msgid:"No emoji found",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:168"},msgstr:["Ekkert tjáningartákn fannst"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["Engar niðurstöður"]},Objects:{msgid:"Objects",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:178"},msgstr:["Hlutir"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Gera hlé á skyggnusýningu"]},"People & Body":{msgid:"People & Body",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:173"},msgstr:["Fólk og líkami"]},"Pick an emoji":{msgid:"Pick an emoji",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:153"},msgstr:["Veldu tjáningartákn"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Fyrri"]},Search:{msgid:"Search",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:167"},msgstr:["Leita"]},"Search results":{msgid:"Search results",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:170"},msgstr:["Leitarniðurstöður"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Veldu merki"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:57"},msgstr:["Stillingar"]},"Smileys & Emotion":{msgid:"Smileys & Emotion",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:172"},msgstr:["Broskallar og tilfinningar"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Byrja skyggnusýningu"]},Symbols:{msgid:"Symbols",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:179"},msgstr:["Tákn"]},"Travel & Places":{msgid:"Travel & Places",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:177"},msgstr:["Staðir og ferðalög"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["Get ekki leitað í hópnum"]}}}}},{locale:"it",json:{charset:"utf-8",headers:{"Last-Translator":"Vincenzo Reale <vinx.reale@gmail.com>, 2020","Language-Team":"Italian (https://www.transifex.com/nextcloud/teams/64236/it/)","Content-Type":"text/plain; charset=UTF-8",Language:"it","Plural-Forms":"nplurals=2; plural=(n != 1);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nRandom_R, 2020\nVincenzo Reale <vinx.reale@gmail.com>, 2020\n"},msgstr:["Last-Translator: Vincenzo Reale <vinx.reale@gmail.com>, 2020\nLanguage-Team: Italian (https://www.transifex.com/nextcloud/teams/64236/it/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: it\nPlural-Forms: nplurals=2; plural=(n != 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (invisibile)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (limitato)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:249"},msgstr:["Azioni"]},Activities:{msgid:"Activities",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:176"},msgstr:["Attività"]},"Animals & Nature":{msgid:"Animals & Nature",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:174"},msgstr:["Animali e natura"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Scegli"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Chiudi"]},Custom:{msgid:"Custom",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:181"},msgstr:["Personalizzato"]},Flags:{msgid:"Flags",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:180"},msgstr:["Bandiere"]},"Food & Drink":{msgid:"Food & Drink",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:175"},msgstr:["Cibo e bevande"]},"Frequently used":{msgid:"Frequently used",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:171"},msgstr:["Usati di frequente"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Successivo"]},"No emoji found":{msgid:"No emoji found",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:168"},msgstr:["Nessun emoji trovato"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["Nessun risultato"]},Objects:{msgid:"Objects",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:178"},msgstr:["Oggetti"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Presentazione in pausa"]},"People & Body":{msgid:"People & Body",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:173"},msgstr:["Persone e corpo"]},"Pick an emoji":{msgid:"Pick an emoji",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:153"},msgstr:["Scegli un emoji"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Precedente"]},Search:{msgid:"Search",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:167"},msgstr:["Cerca"]},"Search results":{msgid:"Search results",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:170"},msgstr:["Risultati di ricerca"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Seleziona un'etichetta"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:57"},msgstr:["Impostazioni"]},"Smileys & Emotion":{msgid:"Smileys & Emotion",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:172"},msgstr:["Faccine ed emozioni"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Avvia presentazione"]},Symbols:{msgid:"Symbols",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:179"},msgstr:["Simboli"]},"Travel & Places":{msgid:"Travel & Places",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:177"},msgstr:["Viaggi e luoghi"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["Impossibile cercare il gruppo"]}}}}},{locale:"ja_JP",json:{charset:"utf-8",headers:{"Last-Translator":"YANO Tetsu <tetuyano+transi@gmail.com>, 2020","Language-Team":"Japanese (Japan) (https://www.transifex.com/nextcloud/teams/64236/ja_JP/)","Content-Type":"text/plain; charset=UTF-8",Language:"ja_JP","Plural-Forms":"nplurals=1; plural=0;"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nYANO Tetsu <tetuyano+transi@gmail.com>, 2020\n"},msgstr:["Last-Translator: YANO Tetsu <tetuyano+transi@gmail.com>, 2020\nLanguage-Team: Japanese (Japan) (https://www.transifex.com/nextcloud/teams/64236/ja_JP/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: ja_JP\nPlural-Forms: nplurals=1; plural=0;\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{タグ} (不可視)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{タグ} (制限付)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:249"},msgstr:["操作"]},Activities:{msgid:"Activities",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:176"},msgstr:["アクティビティ"]},"Animals & Nature":{msgid:"Animals & Nature",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:174"},msgstr:["動物と自然"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["選択"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["閉じる"]},Custom:{msgid:"Custom",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:181"},msgstr:["カスタム"]},Flags:{msgid:"Flags",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:180"},msgstr:["国旗"]},"Food & Drink":{msgid:"Food & Drink",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:175"},msgstr:["食べ物と飲み物"]},"Frequently used":{msgid:"Frequently used",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:171"},msgstr:["よく使うもの"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["次"]},"No emoji found":{msgid:"No emoji found",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:168"},msgstr:["絵文字が見つかりません"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["なし"]},Objects:{msgid:"Objects",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:178"},msgstr:["物"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["スライドショーを一時停止"]},"People & Body":{msgid:"People & Body",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:173"},msgstr:["様々な人と体の部位"]},"Pick an emoji":{msgid:"Pick an emoji",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:153"},msgstr:["絵文字を選択"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["前"]},Search:{msgid:"Search",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:167"},msgstr:["検索"]},"Search results":{msgid:"Search results",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:170"},msgstr:["検索結果"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["タグを選択"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["設定"]},"Smileys & Emotion":{msgid:"Smileys & Emotion",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:172"},msgstr:["笑顔と気持ち"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["スライドショーを開始"]},Symbols:{msgid:"Symbols",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:179"},msgstr:["記号"]},"Travel & Places":{msgid:"Travel & Places",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:177"},msgstr:["旅行と場所"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["グループを検索できません"]}}}}},{locale:"lt_LT",json:{charset:"utf-8",headers:{"Last-Translator":"Moo, 2020","Language-Team":"Lithuanian (Lithuania) (https://www.transifex.com/nextcloud/teams/64236/lt_LT/)","Content-Type":"text/plain; charset=UTF-8",Language:"lt_LT","Plural-Forms":"nplurals=4; plural=(n % 10 == 1 && (n % 100 > 19 || n % 100 < 11) ? 0 : (n % 10 >= 2 && n % 10 <=9) && (n % 100 > 19 || n % 100 < 11) ? 1 : n % 1 != 0 ? 2: 3);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nMoo, 2020\n"},msgstr:["Last-Translator: Moo, 2020\nLanguage-Team: Lithuanian (Lithuania) (https://www.transifex.com/nextcloud/teams/64236/lt_LT/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: lt_LT\nPlural-Forms: nplurals=4; plural=(n % 10 == 1 && (n % 100 > 19 || n % 100 < 11) ? 0 : (n % 10 >= 2 && n % 10 <=9) && (n % 100 > 19 || n % 100 < 11) ? 1 : n % 1 != 0 ? 2: 3);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (nematoma)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (apribota)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:254"},msgstr:["Veiksmai"]},Activities:{msgid:"Activities",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:176"},msgstr:["Veiklos"]},"Animals & Nature":{msgid:"Animals & Nature",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:174"},msgstr:["Gyvūnai ir gamta"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Pasirinkti"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Užverti"]},Custom:{msgid:"Custom",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:181"},msgstr:["Tinkinti"]},Flags:{msgid:"Flags",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:180"},msgstr:["Vėliavos"]},"Food & Drink":{msgid:"Food & Drink",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:175"},msgstr:["Maistas ir gėrimai"]},"Frequently used":{msgid:"Frequently used",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:171"},msgstr:["Dažniausiai naudoti"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Kitas"]},"No emoji found":{msgid:"No emoji found",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:168"},msgstr:["Nerasta jaustukų"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["Nėra rezultatų"]},Objects:{msgid:"Objects",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:178"},msgstr:["Objektai"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Pristabdyti skaidrių rodymą"]},"People & Body":{msgid:"People & Body",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:173"},msgstr:["Žmonės ir kūnas"]},"Pick an emoji":{msgid:"Pick an emoji",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:153"},msgstr:["Pasirinkti jaustuką"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Ankstesnis"]},Search:{msgid:"Search",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:167"},msgstr:["Ieškoti"]},"Search results":{msgid:"Search results",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:170"},msgstr:["Paieškos rezultatai"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Pasirinkti žymę"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:57"},msgstr:["Nustatymai"]},"Smileys & Emotion":{msgid:"Smileys & Emotion",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:172"},msgstr:["Šypsenos ir emocijos"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Pradėti skaidrių rodymą"]},Symbols:{msgid:"Symbols",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:179"},msgstr:["Simboliai"]},"Travel & Places":{msgid:"Travel & Places",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:177"},msgstr:["Kelionės ir vietos"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["Nepavyko atlikti paiešką grupėje"]}}}}},{locale:"lv",json:{charset:"utf-8",headers:{"Last-Translator":"stendec <stendec@inbox.lv>, 2020","Language-Team":"Latvian (https://www.transifex.com/nextcloud/teams/64236/lv/)","Content-Type":"text/plain; charset=UTF-8",Language:"lv","Plural-Forms":"nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n != 0 ? 1 : 2);"},translations:{"":{"":{msgid:"",comments:{translator:"Translators:\nstendec <stendec@inbox.lv>, 2020\n"},msgstr:["Last-Translator: stendec <stendec@inbox.lv>, 2020\nLanguage-Team: Latvian (https://www.transifex.com/nextcloud/teams/64236/lv/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: lv\nPlural-Forms: nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n != 0 ? 1 : 2);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:169"},msgstr:["{tag} (neredzams)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:172"},msgstr:["{tag} (ierobežots)"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Izvēlēties"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:109"},msgstr:["Aizvērt"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:154"},msgstr:["Nākamais"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:169\nsrc/components/MultiselectTags/MultiselectTags.vue:78"},msgstr:["Nav rezultātu"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:290"},msgstr:["Pauzēt slaidrādi"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:134"},msgstr:["Iepriekšējais"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Izvēlēties birku"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Iestatījumi"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:290"},msgstr:["Sākt slaidrādi"]}}}}},{locale:"mk",json:{charset:"utf-8",headers:{"Last-Translator":"Сашко Тодоров, 2020","Language-Team":"Macedonian (https://www.transifex.com/nextcloud/teams/64236/mk/)","Content-Type":"text/plain; charset=UTF-8",Language:"mk","Plural-Forms":"nplurals=2; plural=(n % 10 == 1 && n % 100 != 11) ? 0 : 1;"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nСашко Тодоров, 2020\n"},msgstr:["Last-Translator: Сашко Тодоров, 2020\nLanguage-Team: Macedonian (https://www.transifex.com/nextcloud/teams/64236/mk/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: mk\nPlural-Forms: nplurals=2; plural=(n % 10 == 1 && n % 100 != 11) ? 0 : 1;\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (невидливо)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (ограничено)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:249"},msgstr:["Акции"]},Activities:{msgid:"Activities",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:176"},msgstr:["Активности"]},"Animals & Nature":{msgid:"Animals & Nature",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:174"},msgstr:["Животни & Природа"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Избери"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Затвори"]},Custom:{msgid:"Custom",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:181"},msgstr:["Прилагодени"]},Flags:{msgid:"Flags",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:180"},msgstr:["Знамиња"]},"Food & Drink":{msgid:"Food & Drink",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:175"},msgstr:["Храна & Пијалоци"]},"Frequently used":{msgid:"Frequently used",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:171"},msgstr:["Најчесто користени"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Следно"]},"No emoji found":{msgid:"No emoji found",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:168"},msgstr:["Не се пронајдени емотикони"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["Нема резултати"]},Objects:{msgid:"Objects",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:178"},msgstr:["Објекти"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Пузирај слајдшоу"]},"People & Body":{msgid:"People & Body",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:173"},msgstr:["Луѓе & Тело"]},"Pick an emoji":{msgid:"Pick an emoji",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:153"},msgstr:["Избери емотикон"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Предходно"]},Search:{msgid:"Search",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:167"},msgstr:["Барај"]},"Search results":{msgid:"Search results",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:170"},msgstr:["Резултати од барувањето"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Избери ознака"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:57"},msgstr:["Параметри"]},"Smileys & Emotion":{msgid:"Smileys & Emotion",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:172"},msgstr:["Смешковци & Емотикони"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Стартувај слајдшоу"]},Symbols:{msgid:"Symbols",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:179"},msgstr:["Симболи"]},"Travel & Places":{msgid:"Travel & Places",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:177"},msgstr:["Патувања & Места"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["Неможе да се принајде групата"]}}}}},{locale:"nb_NO",json:{charset:"utf-8",headers:{"Last-Translator":"Ole Jakob Brustad <ole.jakob@brustadbuss.no>, 2020","Language-Team":"Norwegian Bokmål (Norway) (https://www.transifex.com/nextcloud/teams/64236/nb_NO/)","Content-Type":"text/plain; charset=UTF-8",Language:"nb_NO","Plural-Forms":"nplurals=2; plural=(n != 1);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nOle Jakob Brustad <ole.jakob@brustadbuss.no>, 2020\n"},msgstr:["Last-Translator: Ole Jakob Brustad <ole.jakob@brustadbuss.no>, 2020\nLanguage-Team: Norwegian Bokmål (Norway) (https://www.transifex.com/nextcloud/teams/64236/nb_NO/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: nb_NO\nPlural-Forms: nplurals=2; plural=(n != 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (usynlig)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (beskyttet)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:247"},msgstr:["Handlinger"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Velg"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Lukk"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Neste"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:172\nsrc/components/MultiselectTags/MultiselectTags.vue:78"},msgstr:["Ingen resultat"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Pause lysbildefremvisning"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Forrige"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Velg et merke"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Instillinger"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Start lysbildefremvisning"]}}}}},{locale:"nl",json:{charset:"utf-8",headers:{"Last-Translator":"Arjan van S, 2020","Language-Team":"Dutch (https://www.transifex.com/nextcloud/teams/64236/nl/)","Content-Type":"text/plain; charset=UTF-8",Language:"nl","Plural-Forms":"nplurals=2; plural=(n != 1);"},translations:{"":{"":{msgid:"",comments:{translator:"Translators:\nRoeland Jago Douma <roeland@famdouma.nl>, 2020\nArjan van S, 2020\n"},msgstr:["Last-Translator: Arjan van S, 2020\nLanguage-Team: Dutch (https://www.transifex.com/nextcloud/teams/64236/nl/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: nl\nPlural-Forms: nplurals=2; plural=(n != 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (onzichtbaar)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (beperkt)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:196"},msgstr:["Acties"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Kies"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Sluiten"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Volgende"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:172\nsrc/components/MultiselectTags/MultiselectTags.vue:78"},msgstr:["Geen resultaten"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Pauzeer diavoorstelling"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Vorige"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Selecteer een label"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Instellingen"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Start diavoorstelling"]}}}}},{locale:"oc",json:{charset:"utf-8",headers:{"Last-Translator":"Quentin PAGÈS, 2020","Language-Team":"Occitan (post 1500) (https://www.transifex.com/nextcloud/teams/64236/oc/)","Content-Type":"text/plain; charset=UTF-8",Language:"oc","Plural-Forms":"nplurals=2; plural=(n > 1);"},translations:{"":{"":{msgid:"",comments:{translator:"Translators:\nQuentin PAGÈS, 2020\n"},msgstr:["Last-Translator: Quentin PAGÈS, 2020\nLanguage-Team: Occitan (post 1500) (https://www.transifex.com/nextcloud/teams/64236/oc/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: oc\nPlural-Forms: nplurals=2; plural=(n > 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (invisible)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (limit)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:194"},msgstr:["Accions"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Causir"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Tampar"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Seguent"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:172\nsrc/components/MultiselectTags/MultiselectTags.vue:78"},msgstr:["Cap de resultat"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Metre en pausa lo diaporama"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Precedent"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Seleccionar una etiqueta"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Paramètres"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Lançar lo diaporama"]}}}}},{locale:"pl",json:{charset:"utf-8",headers:{"Last-Translator":"Valdnet, 2020","Language-Team":"Polish (https://www.transifex.com/nextcloud/teams/64236/pl/)","Content-Type":"text/plain; charset=UTF-8",Language:"pl","Plural-Forms":"nplurals=4; plural=(n==1 ? 0 : (n%10>=2 && n%10<=4) && (n%100<12 || n%100>14) ? 1 : n!=1 && (n%10>=0 && n%10<=1) || (n%10>=5 && n%10<=9) || (n%100>=12 && n%100<=14) ? 2 : 3);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nValdnet, 2020\n"},msgstr:["Last-Translator: Valdnet, 2020\nLanguage-Team: Polish (https://www.transifex.com/nextcloud/teams/64236/pl/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: pl\nPlural-Forms: nplurals=4; plural=(n==1 ? 0 : (n%10>=2 && n%10<=4) && (n%100<12 || n%100>14) ? 1 : n!=1 && (n%10>=0 && n%10<=1) || (n%10>=5 && n%10<=9) || (n%100>=12 && n%100<=14) ? 2 : 3);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (niewidoczna)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (ograniczona)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:249"},msgstr:["Działania"]},Activities:{msgid:"Activities",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:176"},msgstr:["Aktywność"]},"Animals & Nature":{msgid:"Animals & Nature",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:174"},msgstr:["Zwierzęta i natura"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Wybierz"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Zamknij"]},Custom:{msgid:"Custom",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:181"},msgstr:["Zwyczajne"]},Flags:{msgid:"Flags",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:180"},msgstr:["Flagi"]},"Food & Drink":{msgid:"Food & Drink",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:175"},msgstr:["Jedzenie i picie"]},"Frequently used":{msgid:"Frequently used",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:171"},msgstr:["Często używane"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Następny"]},"No emoji found":{msgid:"No emoji found",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:168"},msgstr:["Nie znaleziono emotikonów"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["Brak wyników"]},Objects:{msgid:"Objects",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:178"},msgstr:["Obiekty"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Wstrzymaj pokaz slajdów"]},"People & Body":{msgid:"People & Body",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:173"},msgstr:["Ludzie i ciało"]},"Pick an emoji":{msgid:"Pick an emoji",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:153"},msgstr:["Wybierz emoji"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Poprzedni"]},Search:{msgid:"Search",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:167"},msgstr:["Szukaj"]},"Search results":{msgid:"Search results",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:170"},msgstr:["Wyniki wyszukiwania"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Wybierz etykietę"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Ustawienia"]},"Smileys & Emotion":{msgid:"Smileys & Emotion",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:172"},msgstr:["Buźki i emotikony"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Rozpocznij pokaz slajdów"]},Symbols:{msgid:"Symbols",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:179"},msgstr:["Symbole"]},"Travel & Places":{msgid:"Travel & Places",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:177"},msgstr:["Podróże i miejsca"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["Nie można przeszukać grupy"]}}}}},{locale:"pt_BR",json:{charset:"utf-8",headers:{"Last-Translator":"Paulo Schopf, 2020","Language-Team":"Portuguese (Brazil) (https://www.transifex.com/nextcloud/teams/64236/pt_BR/)","Content-Type":"text/plain; charset=UTF-8",Language:"pt_BR","Plural-Forms":"nplurals=2; plural=(n > 1);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nMaurício Gardini <accounts@mauriciogardini.com>, 2020\nPaulo Schopf, 2020\n"},msgstr:["Last-Translator: Paulo Schopf, 2020\nLanguage-Team: Portuguese (Brazil) (https://www.transifex.com/nextcloud/teams/64236/pt_BR/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: pt_BR\nPlural-Forms: nplurals=2; plural=(n > 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (invisível)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (restrito) "]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:249"},msgstr:["Ações"]},Activities:{msgid:"Activities",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:176"},msgstr:["Atividades"]},"Animals & Nature":{msgid:"Animals & Nature",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:174"},msgstr:["Animais & Natureza"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Escolher"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Fechar"]},Custom:{msgid:"Custom",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:181"},msgstr:["Personalizado"]},Flags:{msgid:"Flags",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:180"},msgstr:["Bandeiras"]},"Food & Drink":{msgid:"Food & Drink",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:175"},msgstr:["Comida & Bebida"]},"Frequently used":{msgid:"Frequently used",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:171"},msgstr:["Mais usados"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Próximo"]},"No emoji found":{msgid:"No emoji found",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:168"},msgstr:["Nenhum emoji encontrado"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["Sem resultados"]},Objects:{msgid:"Objects",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:178"},msgstr:["Objetos"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Pausar apresentação de slides"]},"People & Body":{msgid:"People & Body",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:173"},msgstr:["Pessoas & Corpo"]},"Pick an emoji":{msgid:"Pick an emoji",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:153"},msgstr:["Escolha um emoji"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Anterior"]},Search:{msgid:"Search",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:167"},msgstr:["Pesquisar"]},"Search results":{msgid:"Search results",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:170"},msgstr:["Resultados da pesquisa"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Selecionar uma tag"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Configurações"]},"Smileys & Emotion":{msgid:"Smileys & Emotion",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:172"},msgstr:["Smiles & Emoções"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Iniciar apresentação de slides"]},Symbols:{msgid:"Symbols",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:179"},msgstr:["Símbolo"]},"Travel & Places":{msgid:"Travel & Places",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:177"},msgstr:["Viagem & Lugares"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["Não foi possível pesquisar o grupo"]}}}}},{locale:"pt_PT",json:{charset:"utf-8",headers:{"Last-Translator":"Manuela Silva <manuelarodsilva@gmail.com>, 2020","Language-Team":"Portuguese (Portugal) (https://www.transifex.com/nextcloud/teams/64236/pt_PT/)","Content-Type":"text/plain; charset=UTF-8",Language:"pt_PT","Plural-Forms":"nplurals=2; plural=(n != 1);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nfpapoila <fpapoila@gmail.com>, 2020\nManuela Silva <manuelarodsilva@gmail.com>, 2020\n"},msgstr:["Last-Translator: Manuela Silva <manuelarodsilva@gmail.com>, 2020\nLanguage-Team: Portuguese (Portugal) (https://www.transifex.com/nextcloud/teams/64236/pt_PT/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: pt_PT\nPlural-Forms: nplurals=2; plural=(n != 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (invisivel)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (restrito)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:249"},msgstr:["Ações"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Escolher"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Fechar"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Seguinte"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["Sem resultados"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Pausar diaporama"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Anterior"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Selecionar uma etiqueta"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Definições"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Iniciar diaporama"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["Não é possível pesquisar o grupo"]}}}}},{locale:"ru",json:{charset:"utf-8",headers:{"Last-Translator":"Alex <kekcuha@gmail.com>, 2020","Language-Team":"Russian (https://www.transifex.com/nextcloud/teams/64236/ru/)","Content-Type":"text/plain; charset=UTF-8",Language:"ru","Plural-Forms":"nplurals=4; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<12 || n%100>14) ? 1 : n%10==0 || (n%10>=5 && n%10<=9) || (n%100>=11 && n%100<=14)? 2 : 3);"},translations:{"":{"":{msgid:"",comments:{translator:"Translators:\nAlex <kekcuha@gmail.com>, 2020\n"},msgstr:["Last-Translator: Alex <kekcuha@gmail.com>, 2020\nLanguage-Team: Russian (https://www.transifex.com/nextcloud/teams/64236/ru/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: ru\nPlural-Forms: nplurals=4; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<12 || n%100>14) ? 1 : n%10==0 || (n%10>=5 && n%10<=9) || (n%100>=11 && n%100<=14)? 2 : 3);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:169"},msgstr:["{tag} (невидимое)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:172"},msgstr:["{tag} (ограниченное)"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Выберите"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:109"},msgstr:["Закрыть"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:154"},msgstr:["Следующее"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:169\nsrc/components/MultiselectTags/MultiselectTags.vue:78"},msgstr:["Результаты отсуствуют"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:290"},msgstr:["Приостановить показ слйдов"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:134"},msgstr:["Предыдущее"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Выберите метку"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Параметры"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:290"},msgstr:["Начать показ слайдов"]}}}}},{locale:"sk_SK",json:{charset:"utf-8",headers:{"Last-Translator":"Anton Kuchár <tonokuc@pobox.sk>, 2020","Language-Team":"Slovak (Slovakia) (https://www.transifex.com/nextcloud/teams/64236/sk_SK/)","Content-Type":"text/plain; charset=UTF-8",Language:"sk_SK","Plural-Forms":"nplurals=4; plural=(n % 1 == 0 && n == 1 ? 0 : n % 1 == 0 && n >= 2 && n <= 4 ? 1 : n % 1 != 0 ? 2: 3);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nAnton Kuchár <tonokuc@pobox.sk>, 2020\n"},msgstr:["Last-Translator: Anton Kuchár <tonokuc@pobox.sk>, 2020\nLanguage-Team: Slovak (Slovakia) (https://www.transifex.com/nextcloud/teams/64236/sk_SK/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: sk_SK\nPlural-Forms: nplurals=4; plural=(n % 1 == 0 && n == 1 ? 0 : n % 1 == 0 && n >= 2 && n <= 4 ? 1 : n % 1 != 0 ? 2: 3);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (neviditeľný)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (obmedzený)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:249"},msgstr:["Akcie"]},Activities:{msgid:"Activities",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:176"},msgstr:["Aktivity"]},"Animals & Nature":{msgid:"Animals & Nature",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:174"},msgstr:["Zvieratá a príroda"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Vybrať"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Zatvoriť"]},Custom:{msgid:"Custom",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:181"},msgstr:["Zvyk"]},Flags:{msgid:"Flags",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:180"},msgstr:["Vlajky"]},"Food & Drink":{msgid:"Food & Drink",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:175"},msgstr:["Jedlo a nápoje"]},"Frequently used":{msgid:"Frequently used",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:171"},msgstr:["Často používané"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Ďalší"]},"No emoji found":{msgid:"No emoji found",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:168"},msgstr:["Nenašli sa žiadne emodži"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["Žiadne výsledky"]},Objects:{msgid:"Objects",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:178"},msgstr:["Objekty"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Pozastaviť prezentáciu"]},"People & Body":{msgid:"People & Body",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:173"},msgstr:["Ľudia a telo"]},"Pick an emoji":{msgid:"Pick an emoji",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:153"},msgstr:["Vyberte si emodži"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Predchádzajúci"]},Search:{msgid:"Search",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:167"},msgstr:["Hľadať"]},"Search results":{msgid:"Search results",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:170"},msgstr:["Výsledky vyhľadávania"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Vybrať štítok"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Nastavenia"]},"Smileys & Emotion":{msgid:"Smileys & Emotion",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:172"},msgstr:["Smajlíky a emócie"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Začať prezentáciu"]},Symbols:{msgid:"Symbols",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:179"},msgstr:["Symboly"]},"Travel & Places":{msgid:"Travel & Places",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:177"},msgstr:["Cestovanie a miesta"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["Skupinu sa nepodarilo nájsť"]}}}}},{locale:"sv",json:{charset:"utf-8",headers:{"Last-Translator":"Jonatan Nyberg, 2020","Language-Team":"Swedish (https://www.transifex.com/nextcloud/teams/64236/sv/)","Content-Type":"text/plain; charset=UTF-8",Language:"sv","Plural-Forms":"nplurals=2; plural=(n != 1);"},translations:{"":{"":{msgid:"",comments:{translator:"Translators:\nGabriel Ekström <gabriel.ekstrom06@gmail.com>, 2020\nErik Lennartsson, 2020\nJonatan Nyberg, 2020\n"},msgstr:["Last-Translator: Jonatan Nyberg, 2020\nLanguage-Team: Swedish (https://www.transifex.com/nextcloud/teams/64236/sv/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: sv\nPlural-Forms: nplurals=2; plural=(n != 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (osynlig)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (begränsad)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:194"},msgstr:["Åtgärder"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Välj"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Stäng"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Nästa"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:172\nsrc/components/MultiselectTags/MultiselectTags.vue:78"},msgstr:["Inga resultat"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Pausa bildspel"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Föregående"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Välj en tag"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Inställningar"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Starta bildspel"]}}}}},{locale:"tr",json:{charset:"utf-8",headers:{"Last-Translator":"Hüseyin Fahri Uzun <mail@fahriuzun.com>, 2020","Language-Team":"Turkish (https://www.transifex.com/nextcloud/teams/64236/tr/)","Content-Type":"text/plain; charset=UTF-8",Language:"tr","Plural-Forms":"nplurals=2; plural=(n > 1);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nKemal Oktay Aktoğan <oktayaktogan@gmail.com>, 2020\nabc Def <hdogan1974@gmail.com>, 2020\nHüseyin Fahri Uzun <mail@fahriuzun.com>, 2020\n"},msgstr:["Last-Translator: Hüseyin Fahri Uzun <mail@fahriuzun.com>, 2020\nLanguage-Team: Turkish (https://www.transifex.com/nextcloud/teams/64236/tr/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: tr\nPlural-Forms: nplurals=2; plural=(n > 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (görünmez)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (kısıtlı)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:247"},msgstr:["Eylemler"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Seç"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Kapat"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Sonraki"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["Sonuçlar yok"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Slayt gösterisini duraklat"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Önceki"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Bir etiket seçin"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Ayarlar"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Slayt gösterisini başlat"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["Grupta arama yapılamıyor"]}}}}},{locale:"uk",json:{charset:"utf-8",headers:{"Last-Translator":"Oleksa Stasevych <oleksiy.stasevych@gmail.com>, 2020","Language-Team":"Ukrainian (https://www.transifex.com/nextcloud/teams/64236/uk/)","Content-Type":"text/plain; charset=UTF-8",Language:"uk","Plural-Forms":"nplurals=4; plural=(n % 1 == 0 && n % 10 == 1 && n % 100 != 11 ? 0 : n % 1 == 0 && n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? 1 : n % 1 == 0 && (n % 10 ==0 || (n % 10 >=5 && n % 10 <=9) || (n % 100 >=11 && n % 100 <=14 )) ? 2: 3);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nOleksa Stasevych <oleksiy.stasevych@gmail.com>, 2020\n"},msgstr:["Last-Translator: Oleksa Stasevych <oleksiy.stasevych@gmail.com>, 2020\nLanguage-Team: Ukrainian (https://www.transifex.com/nextcloud/teams/64236/uk/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: uk\nPlural-Forms: nplurals=4; plural=(n % 1 == 0 && n % 10 == 1 && n % 100 != 11 ? 0 : n % 1 == 0 && n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? 1 : n % 1 == 0 && (n % 10 ==0 || (n % 10 >=5 && n % 10 <=9) || (n % 100 >=11 && n % 100 <=14 )) ? 2: 3);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (invisible)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (restricted)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:249"},msgstr:["Дії"]},Activities:{msgid:"Activities",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:176"},msgstr:["Діяльність"]},"Animals & Nature":{msgid:"Animals & Nature",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:174"},msgstr:["Тварини та природа"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Виберіть"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Закрити"]},Custom:{msgid:"Custom",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:181"},msgstr:["Власне"]},Flags:{msgid:"Flags",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:180"},msgstr:["Прапори"]},"Food & Drink":{msgid:"Food & Drink",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:175"},msgstr:["Їжа та напитки"]},"Frequently used":{msgid:"Frequently used",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:171"},msgstr:["Найчастіші"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Вперед"]},"No emoji found":{msgid:"No emoji found",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:168"},msgstr:["Емоційки відсутні"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["Відсутні результати"]},Objects:{msgid:"Objects",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:178"},msgstr:["Об'єкти"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Пауза у показі слайдів"]},"People & Body":{msgid:"People & Body",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:173"},msgstr:["Люди та жести"]},"Pick an emoji":{msgid:"Pick an emoji",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:153"},msgstr:["Виберіть емоційку"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Назад"]},Search:{msgid:"Search",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:167"},msgstr:["Пошук"]},"Search results":{msgid:"Search results",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:170"},msgstr:["Результати пошуку"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Виберіть позначку"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Налаштування"]},"Smileys & Emotion":{msgid:"Smileys & Emotion",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:172"},msgstr:["Усміхайлики та емоційки"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Почати показ слайдів"]},Symbols:{msgid:"Symbols",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:179"},msgstr:["Символи"]},"Travel & Places":{msgid:"Travel & Places",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:177"},msgstr:["Поїздки та місця"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["Неможливо шукати в групі"]}}}}},{locale:"zh_CN",json:{charset:"utf-8",headers:{"Last-Translator":"Pascal Janus <pascal_janus@163.com>, 2020","Language-Team":"Chinese (China) (https://www.transifex.com/nextcloud/teams/64236/zh_CN/)","Content-Type":"text/plain; charset=UTF-8",Language:"zh_CN","Plural-Forms":"nplurals=1; plural=0;"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nSleepyJesse <Jesse_Xu@live.com>, 2020\nJianming Liang <fuufuukun@163.com>, 2020\nPascal Janus <pascal_janus@163.com>, 2020\n"},msgstr:["Last-Translator: Pascal Janus <pascal_janus@163.com>, 2020\nLanguage-Team: Chinese (China) (https://www.transifex.com/nextcloud/teams/64236/zh_CN/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: zh_CN\nPlural-Forms: nplurals=1; plural=0;\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} （不可见）"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} （受限）"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:247"},msgstr:["行为"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["选择"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["关闭"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["下一个"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["无结果"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["暂停幻灯片"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["上一个"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["选择一个标签"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["设置"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["开始幻灯片"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["无法搜索分组"]}}}}},{locale:"zh_TW",json:{charset:"utf-8",headers:{"Last-Translator":"Natashia Maxins <railroad1987@gmail.com>, 2020","Language-Team":"Chinese (Taiwan) (https://www.transifex.com/nextcloud/teams/64236/zh_TW/)","Content-Type":"text/plain; charset=UTF-8",Language:"zh_TW","Plural-Forms":"nplurals=1; plural=0;"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nbyStarTW (pan93412) <pan93412@gmail.com>, 2020\nNatashia Maxins <railroad1987@gmail.com>, 2020\n"},msgstr:["Last-Translator: Natashia Maxins <railroad1987@gmail.com>, 2020\nLanguage-Team: Chinese (Taiwan) (https://www.transifex.com/nextcloud/teams/64236/zh_TW/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: zh_TW\nPlural-Forms: nplurals=1; plural=0;\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (隱藏)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (受限)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:254"},msgstr:["動作"]},Activities:{msgid:"Activities",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:176"},msgstr:["活動"]},"Animals & Nature":{msgid:"Animals & Nature",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:174"},msgstr:["動物與自然"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["選擇"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["關閉"]},Custom:{msgid:"Custom",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:181"},msgstr:["自定義"]},Flags:{msgid:"Flags",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:180"},msgstr:["旗幟"]},"Food & Drink":{msgid:"Food & Drink",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:175"},msgstr:["食物與飲料"]},"Frequently used":{msgid:"Frequently used",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:171"},msgstr:["最近使用"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["下一個"]},"No emoji found":{msgid:"No emoji found",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:168"},msgstr:["未找到表情符號"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["無結果"]},Objects:{msgid:"Objects",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:178"},msgstr:["物件"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["暫停幻燈片"]},"People & Body":{msgid:"People & Body",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:173"},msgstr:["人物"]},"Pick an emoji":{msgid:"Pick an emoji",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:153"},msgstr:["選擇表情符號"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["上一個"]},Search:{msgid:"Search",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:167"},msgstr:["搜尋"]},"Search results":{msgid:"Search results",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:170"},msgstr:["搜尋結果"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["選擇標籤"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:57"},msgstr:["設定"]},"Smileys & Emotion":{msgid:"Smileys & Emotion",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:172"},msgstr:["表情"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["開始幻燈片"]},Symbols:{msgid:"Symbols",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:179"},msgstr:["標誌"]},"Travel & Places":{msgid:"Travel & Places",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:177"},msgstr:["旅遊與景點"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["無法搜尋群組"]}}}}}].map((function(e){return n.addTranslation(e.locale,e.json)}));var r=n.build(),c=r.ngettext.bind(r),i=r.gettext.bind(r)},function(e,s){e.exports=__webpack_require__(/*! core-js/modules/es.function.name */ "./node_modules/core-js/modules/es.function.name.js")},function(e,s){e.exports=__webpack_require__(/*! core-js/modules/es.array.iterator */ "./node_modules/core-js/modules/es.array.iterator.js")},function(e,s){e.exports=__webpack_require__(/*! core-js/modules/es.string.iterator */ "./node_modules/core-js/modules/es.string.iterator.js")},function(e,s){e.exports=__webpack_require__(/*! core-js/modules/web.dom-collections.iterator */ "./node_modules/core-js/modules/web.dom-collections.iterator.js")},function(e,s){e.exports=__webpack_require__(/*! core-js/modules/es.array.map */ "./node_modules/core-js/modules/es.array.map.js")},function(e,s){e.exports=__webpack_require__(/*! core-js/modules/es.regexp.to-string */ "./node_modules/core-js/modules/es.regexp.to-string.js")},function(e,s,t){var o=t(65);"string"==typeof o&&(o=[[e.i,o,""]]),o.locals&&(e.exports=o.locals);(0,t(2).default)("7a7fb996",o,!0,{})},function(e,s){e.exports=__webpack_require__(/*! core-js/modules/es.array.index-of */ "./node_modules/core-js/modules/es.array.index-of.js")},function(e,s,t){"use strict";t.r(s);var o=t(4);t(55);
/**
 * @copyright Copyright (c) 2019 Julius Härtl <jus@bitgrid.net>
 *
 * @author Julius Härtl <jus@bitgrid.net>
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
o.VTooltip.options.defaultTemplate='<div class="vue-tooltip" role="tooltip" data-v-'.concat("19787a9",'><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'),o.VTooltip.options.defaultHtml=!1,s.default=o.VTooltip},function(e,s,t){"use strict";e.exports=function(e,s){return s||(s={}),"string"!=typeof(e=e&&e.__esModule?e.default:e)?e:(/^['"].*['"]$/.test(e)&&(e=e.slice(1,-1)),s.hash&&(e+=s.hash),/["'() \t\n]/.test(e)||s.needQuotes?'"'.concat(e.replace(/"/g,'\\"').replace(/\n/g,"\\n"),'"'):e)}},function(e,s,t){"use strict";t.r(s),s.default="data:application/vnd.ms-fontobject;base64,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"},function(e,s,t){"use strict";t.r(s),s.default="data:font/woff;base64,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PAE55eh8gAAAAQAAAAEAADf1ivtfDzz1AAsTiAAAAADbpI3lAAAAANtTseb/4AAAE5MTiAAAAAgAAgAAAAAAAAABAAATiAAAAAATiP/g//UTkwABAAAAAAAAAAAAAAAAAAAABwAAAAATiAAAE4gAABOIAAATiAAABjYAABOIAAAAAP//AAAAAAAAAAAAAAAA/+AAAAAAAAAAAAAAACIANgBYAGwAgACUALQBDgF8AZoCEAImAjQCQgKoAyIDpgP+AAEAAAATAEsAAwAAAAAAAgAAAAoACgAAAP8AAAAAAAAAAAAQAMYAAQAAAAAAAQAUAAAAAQAAAAAAAgAHABQAAQAAAAAAAwAUABsAAQAAAAAABAAUAC8AAQAAAAAABQALAEMAAQAAAAAABgAUAE4AAQAAAAAACgArAGIAAQAAAAAACwATAI0AAwABBAkAAQAoAKAAAwABBAkAAgAOAMgAAwABBAkAAwAoANYAAwABBAkABAAoAP4AAwABBAkABQAWASYAAwABBAkABgAoATwAAwABBAkACgBWAWQAAwABBAkACwAmAbppY29uZm9udC12dWUtMTk3ODdhOVJlZ3VsYXJpY29uZm9udC12dWUtMTk3ODdhOWljb25mb250LXZ1ZS0xOTc4N2E5VmVyc2lvbiAxLjBpY29uZm9udC12dWUtMTk3ODdhOUdlbmVyYXRlZCBieSBzdmcydHRmIGZyb20gRm9udGVsbG8gcHJvamVjdC5odHRwOi8vZm9udGVsbG8uY29tAGkAYwBvAG4AZgBvAG4AdAAtAHYAdQBlAC0AMQA5ADcAOAA3AGEAOQBSAGUAZwB1AGwAYQByAGkAYwBvAG4AZgBvAG4AdAAtAHYAdQBlAC0AMQA5ADcAOAA3AGEAOQBpAGMAbwBuAGYAbwBuAHQALQB2AHUAZQAtADEAOQA3ADgANwBhADkAVgBlAHIAcwBpAG8AbgAgADEALgAwAGkAYwBvAG4AZgBvAG4AdAAtAHYAdQBlAC0AMQA5ADcAOAA3AGEAOQBHAGUAbgBlAHIAYQB0AGUAZAAgAGIAeQAgAHMAdgBnADIAdAB0AGYAIABmAHIAbwBtACAARgBvAG4AdABlAGwAbABvACAAcAByAG8AagBlAGMAdAAuAGgAdAB0AHAAOgAvAC8AZgBvAG4AdABlAGwAbABvAC4AYwBvAG0AAAACAAAAAAAAADIAAAAAAAAAAAAAAAAAAAAAAAAAAAATABMAAAECAQMBBAEFAQYBBwEIAQkBCgELAQwBDQEOAQ8BEAERARIBExFhcnJvdy1sZWZ0LWRvdWJsZQphcnJvdy1sZWZ0EmFycm93LXJpZ2h0LWRvdWJsZQthcnJvdy1yaWdodApicmVhZGNydW1iCWNoZWNrbWFyawVjbG9zZQdjb25maXJtBGluZm8EbWVudQRtb3JlBXBhdXNlBHBsYXkKdHJpYW5nbGUtcxB1c2VyLXN0YXR1cy1hd2F5D3VzZXItc3RhdHVzLWRuZBV1c2VyLXN0YXR1cy1pbnZpc2libGUSdXNlci1zdGF0dXMtb25saW5lAAA="},function(e,s,t){"use strict";t.r(s),s.default="data:font/ttf;base64,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AAATiP/g//UTkwABAAAAAAAAAAAAAAAAAAAABwAAAAATiAAAE4gAABOIAAATiAAABjYAABOIAAAAAP//AAAAAAAAAAAAAAAA/+AAAAAAAAAAAAAAACIANgBYAGwAgACUALQBDgF8AZoCEAImAjQCQgKoAyIDpgP+AAEAAAATAEsAAwAAAAAAAgAAAAoACgAAAP8AAAAAAAAAAAAQAMYAAQAAAAAAAQAUAAAAAQAAAAAAAgAHABQAAQAAAAAAAwAUABsAAQAAAAAABAAUAC8AAQAAAAAABQALAEMAAQAAAAAABgAUAE4AAQAAAAAACgArAGIAAQAAAAAACwATAI0AAwABBAkAAQAoAKAAAwABBAkAAgAOAMgAAwABBAkAAwAoANYAAwABBAkABAAoAP4AAwABBAkABQAWASYAAwABBAkABgAoATwAAwABBAkACgBWAWQAAwABBAkACwAmAbppY29uZm9udC12dWUtMTk3ODdhOVJlZ3VsYXJpY29uZm9udC12dWUtMTk3ODdhOWljb25mb250LXZ1ZS0xOTc4N2E5VmVyc2lvbiAxLjBpY29uZm9udC12dWUtMTk3ODdhOUdlbmVyYXRlZCBieSBzdmcydHRmIGZyb20gRm9udGVsbG8gcHJvamVjdC5odHRwOi8vZm9udGVsbG8uY29tAGkAYwBvAG4AZgBvAG4AdAAtAHYAdQBlAC0AMQA5ADcAOAA3AGEAOQBSAGUAZwB1AGwAYQByAGkAYwBvAG4AZgBvAG4AdAAtAHYAdQBlAC0AMQA5ADcAOAA3AGEAOQBpAGMAbwBuAGYAbwBuAHQALQB2AHUAZQAtADEAOQA3ADgANwBhADkAVgBlAHIAcwBpAG8AbgAgADEALgAwAGkAYwBvAG4AZgBvAG4AdAAtAHYAdQBlAC0AMQA5ADcAOAA3AGEAOQBHAGUAbgBlAHIAYQB0AGUAZAAgAGIAeQAgAHMAdgBnADIAdAB0AGYAIABmAHIAbwBtACAARgBvAG4AdABlAGwAbABvACAAcAByAG8AagBlAGMAdAAuAGgAdAB0AHAAOgAvAC8AZgBvAG4AdABlAGwAbABvAC4AYwBvAG0AAAACAAAAAAAAADIAAAAAAAAAAAAAAAAAAAAAAAAAAAATABMAAAECAQMBBAEFAQYBBwEIAQkBCgELAQwBDQEOAQ8BEAERARIBExFhcnJvdy1sZWZ0LWRvdWJsZQphcnJvdy1sZWZ0EmFycm93LXJpZ2h0LWRvdWJsZQthcnJvdy1yaWdodApicmVhZGNydW1iCWNoZWNrbWFyawVjbG9zZQdjb25maXJtBGluZm8EbWVudQRtb3JlBXBhdXNlBHBsYXkKdHJpYW5nbGUtcxB1c2VyLXN0YXR1cy1hd2F5D3VzZXItc3RhdHVzLWRuZBV1c2VyLXN0YXR1cy1pbnZpc2libGUSdXNlci1zdGF0dXMtb25saW5lAAA="},function(e,s,t){"use strict";t.r(s),s.default="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCIgPjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48bWV0YWRhdGE+PC9tZXRhZGF0YT48ZGVmcz48Zm9udCBpZD0iaWNvbmZvbnQtdnVlLTE5Nzg3YTkiIGhvcml6LWFkdi14PSI1MDAwIj48Zm9udC1mYWNlIGZvbnQtZmFtaWx5PSJpY29uZm9udC12dWUtMTk3ODdhOSIgZm9udC13ZWlnaHQ9IjQwMCIgZm9udC1zdHJldGNoPSJub3JtYWwiIHVuaXRzLXBlci1lbT0iNTAwMCIgcGFub3NlLTE9IjIgMCA1IDMgMCAwIDAgMCAwIDAiIGFzY2VudD0iNTAwMCIgZGVzY2VudD0iMCIgeC1oZWlnaHQ9IjAiIGJib3g9Ii0zMiAwIDUwMTEgNTAwMCIgdW5kZXJsaW5lLXRoaWNrbmVzcz0iMCIgdW5kZXJsaW5lLXBvc2l0aW9uPSI1MCIgdW5pY29kZS1yYW5nZT0iVStlYTAxLWVhMTIiIC8+PG1pc3NpbmctZ2x5cGggaG9yaXotYWR2LXg9IjAiICAvPjxnbHlwaCBnbHlwaC1uYW1lPSJhcnJvdy1sZWZ0LWRvdWJsZSIgdW5pY29kZT0iJiN4ZWEwMTsiIGQ9Ik0zNzUwIDM5MDYgbC0xNDA2IC0xNDA2IGwxNDA2IC0xNDA2IGwwIDMxMiBsLTEwOTQgMTA5NCBsMTA5NCAxMDk0IGwwIDMxMiBaTTIzNDQgMzkwNiBsLTE0MDYgLTE0MDYgbDE0MDYgLTE0MDYgbDAgMzEyIGwtMTA5NCAxMDk0IGwxMDk0IDEwOTQgbDAgMzEyIFoiIC8+PGdseXBoIGdseXBoLW5hbWU9ImFycm93LWxlZnQiIHVuaWNvZGU9IiYjeGVhMDI7IiBkPSJNMTU2MyAyNTAwIGwxODc1IC0xODc1IGwwIC0zMTIgbC0yMTg4IDIxODcgbDIxODggMjE4OCBsMCAtMzEzIGwtMTg3NSAtMTg3NSBaIiAvPjxnbHlwaCBnbHlwaC1uYW1lPSJhcnJvdy1yaWdodC1kb3VibGUiIHVuaWNvZGU9IiYjeGVhMDM7IiBkPSJNMTI1MCAxMDk0IGwxNDA2IDE0MDYgbC0xNDA2IDE0MDYgbDAgLTMxMiBsMTA5NCAtMTA5NCBsLTEwOTQgLTEwOTQgbDAgLTMxMiBaTTI2NTYgMTA5NCBsMTQwNyAxNDA2IGwtMTQwNyAxNDA2IGwwIC0zMTIgbDEwOTQgLTEwOTQgbC0xMDk0IC0xMDk0IGwwIC0zMTIgWiIgLz48Z2x5cGggZ2x5cGgtbmFtZT0iYXJyb3ctcmlnaHQiIHVuaWNvZGU9IiYjeGVhMDQ7IiBkPSJNMzQzOCAyNTAwIGwtMTg3NSAxODc1IGwwIDMxMyBsMjE4NyAtMjE4OCBsLTIxODcgLTIxODcgbDAgMzEyIGwxODc1IDE4NzUgWiIgLz48Z2x5cGggZ2x5cGgtbmFtZT0iYnJlYWRjcnVtYiIgdW5pY29kZT0iJiN4ZWEwNTsiIGQ9Ik0xNDggNTAwMCBsLTE0OCAtODUgbDEzOTQgLTI0MTUgbC0xMzk0IC0yNDE1IGwxNDggLTg1IGwxNDQzIDI1MDAgbC0xNDQzIDI1MDAgWiIgLz48Z2x5cGggZ2x5cGgtbmFtZT0iY2hlY2ttYXJrIiB1bmljb2RlPSImI3hlYTA2OyIgZD0iTTQwNDUgMzk3MSBsLTIwNjEgLTIwNjEgbC0xMDI5IDEwMjkgbC00NDIgLTQ0MSBsMTQ3MSAtMTQ3MSBsMjUwMyAyNTAyIGwtNDQyIDQ0MiBaIiAvPjxnbHlwaCBnbHlwaC1uYW1lPSJjbG9zZSIgdW5pY29kZT0iJiN4ZWEwNzsiIGQ9Ik00Mzc1IDExNTYgbC01MzEgLTUzMSBsLTEzNDQgMTM0NCBsLTEzNDQgLTEzNDQgbC01MzEgNTMxIGwxMzQ0IDEzNDQgbC0xMzQ0IDEzNDQgbDUzMSA1MzEgbDEzNDQgLTEzNDQgbDEzNDQgMTM0NCBsNTMxIC01MzEgbC0xMzQ0IC0xMzQ0IGwxMzQ0IC0xMzQ0IFoiIC8+PGdseXBoIGdseXBoLW5hbWU9ImNvbmZpcm0iIHVuaWNvZGU9IiYjeGVhMDg7IiBkPSJNMjY1NiA0ODQ0IHEtMTAxIDAgLTE4MCAtNTcgcS03NCAtNTIgLTEwOSAtMTM4IHEtMzUgLTg2IC0xOSAtMTc1IHExOCAtOTYgOTAgLTE2NyBsMTQ5NSAtMTQ5NCBsLTM2MTYgMCBxLTc3IDEgLTEzOSAtMjYgcS01OCAtMjQgLTk5IC03MCBxLTM5IC00NCAtNTkgLTEwMSBxLTIwIC01NiAtMjAgLTExNiBxMCAtNjAgMjAgLTExNiBxMjAgLTU3IDU5IC0xMDEgcTQxIC00NiA5OSAtNzAgcTYyIC0yNyAxMzkgLTI1IGwzNjE2IDAgbC0xNDk1IC0xNDk1IHEtNTUgLTUzIC04MSAtMTE2IHEtMjQgLTU5IC0yMSAtMTIxIHEzIC01OCAzMCAtMTEzIHEyNSAtNTQgNjggLTk3IHE0MyAtNDMgOTYgLTY4IHE1NSAtMjYgMTE0IC0yOSBxNjIgLTMgMTIwIDIxIHE2MyAyNSAxMTYgODEgbDIwMjkgMjAyOCBxNTkgNjAgODAgMTQxIHEyMSA4MCAxIDE1OSBxLTIxIDgyIC04MSAxNDIgbC0yMDI5IDIwMjggcS00NCA0NSAtMTAyIDcwIHEtNTggMjUgLTEyMiAyNSBaIiAvPjxnbHlwaCBnbHlwaC1uYW1lPSJpbmZvIiB1bmljb2RlPSImI3hlYTA5OyIgZD0iTTI0MjIgNDY4OCBxLTExMSAwIC0yMTMgLTQzIHEtOTggLTQyIC0xNzQgLTExNy41IHEtNzYgLTc1LjUgLTExNyAtMTc0LjUgcS00MyAtMTAxIC00MyAtMjEyLjUgcTAgLTExMS41IDQzIC0yMTIuNSBxNDEgLTk4IDExNyAtMTc0IHE3NiAtNzYgMTc0IC0xMTcgcTEwMiAtNDMgMjEzIC00MyBxMTExIDAgMjEzIDQzIHE5OCA0MSAxNzMuNSAxMTcgcTc1LjUgNzYgMTE3LjUgMTc0IHE0MyAxMDEgNDMgMjEyLjUgcTAgMTExLjUgLTQzIDIxMi41IHEtNDIgOTkgLTExNy41IDE3NC41IHEtNzUuNSA3NS41IC0xNzMuNSAxMTcuNSBxLTEwMiA0MyAtMjEzIDQzIFpNMTU2MyAzMTI1IHEtODYgMCAtMTU4IC00MyBxLTcxIC00MSAtMTEyIC0xMTIgcS00MyAtNzIgLTQzIC0xNTcuNSBxMCAtODUuNSA0MyAtMTU3LjUgcTQxIC03MSAxMTIgLTExMiBxNzIgLTQzIDE1OCAtNDMgbDYyNSAwIGwwIC0xNTYyIGwtNjI1IDAgcS04NiAwIC0xNTggLTQzIHEtNzEgLTQxIC0xMTIgLTExMiBxLTQzIC03MyAtNDMgLTE1OCBxMCAtODUgNDMgLTE1OCBxNDEgLTcxIDExMiAtMTEyIHE3MiAtNDMgMTU4IC00MiBsMTg3NSAwIHE4NSAwIDE1NyA0MiBxNzEgNDEgMTEyIDExMiBxNDMgNzMgNDMgMTU4IHEwIDg1IC00MyAxNTggcS00MSA3MSAtMTEyIDExMiBxLTcyIDQzIC0xNTcgNDMgbC02MjUgMCBsMCAxODc1IHEwIDg1IC00MyAxNTcgcS00MSA3MSAtMTEyIDExMiBxLTczIDQzIC0xNTggNDMgbC05MzcgMCBaIiAvPjxnbHlwaCBnbHlwaC1uYW1lPSJtZW51IiB1bmljb2RlPSImI3hlYTBhOyIgZD0iTTYyNSA0Mzc1IGwwIC02MjUgbDM3NTAgMCBsMCA2MjUgbC0zNzUwIDAgWk02MjUgMjgxMyBsMCAtNjI1IGwzNzUwIDAgbDAgNjI1IGwtMzc1MCAwIFpNNjI1IDEyNTAgbDAgLTYyNSBsMzc1MCAwIGwwIDYyNSBsLTM3NTAgMCBaIiAvPjxnbHlwaCBnbHlwaC1uYW1lPSJtb3JlIiB1bmljb2RlPSImI3hlYTBiOyIgZD0iTTc4MSAzMDQ3IHExMTIgMCAyMTMgLTQzIHE5OCAtNDIgMTc0IC0xMTcuNSBxNzYgLTc1LjUgMTE3IC0xNzMuNSBxNDMgLTEwMiA0MyAtMjEzIHEwIC0xMTEgLTQzIC0yMTMgcS00MSAtOTggLTExNyAtMTczLjUgcS03NiAtNzUuNSAtMTc0IC0xMTcuNSBxLTEwMSAtNDMgLTIxMi41IC00MyBxLTExMS41IDAgLTIxMy41IDQzIHEtOTggNDIgLTE3My41IDExNy41IHEtNzUuNSA3NS41IC0xMTcuNSAxNzMuNSBxLTQzIDEwMiAtNDMgMjEzIHEwIDExMSA0MyAyMTMgcTQyIDk4IDExNy41IDE3My41IHE3NS41IDc1LjUgMTczLjUgMTE3LjUgcTEwMiA0MyAyMTMgNDMgWk0yNTAwIDMwNDcgcTExMSAwIDIxMyAtNDMgcTk4IC00MiAxNzMuNSAtMTE3LjUgcTc1LjUgLTc1LjUgMTE3LjUgLTE3My41IHE0MyAtMTAyIDQzIC0yMTMgcTAgLTExMSAtNDMgLTIxMyBxLTQyIC05OCAtMTE3LjUgLTE3My41IHEtNzUuNSAtNzUuNSAtMTczLjUgLTExNy41IHEtMTAyIC00MyAtMjEzIC00MyBxLTExMSAwIC0yMTMgNDMgcS05OCA0MiAtMTczLjUgMTE3LjUgcS03NS41IDc1LjUgLTExNy41IDE3My41IHEtNDMgMTAyIC00MyAyMTMgcTAgMTExIDQzIDIxMyBxNDIgOTggMTE3LjUgMTczLjUgcTc1LjUgNzUuNSAxNzMuNSAxMTcuNSBxMTAyIDQzIDIxMyA0MyBaTTQyMTkgMzA0NyBxMTExIDAgMjEzIC00MyBxOTggLTQyIDE3My41IC0xMTcuNSBxNzUuNSAtNzUuNSAxMTcuNSAtMTczLjUgcTQzIC0xMDIgNDMgLTIxMyBxMCAtMTExIC00MyAtMjEzIHEtNDIgLTk4IC0xMTcuNSAtMTczLjUgcS03NS41IC03NS41IC0xNzMuNSAtMTE3LjUgcS0xMDIgLTQzIC0yMTMuNSAtNDMgcS0xMTEuNSAwIC0yMTIuNSA0MyBxLTk4IDQyIC0xNzQgMTE3LjUgcS03NiA3NS41IC0xMTcgMTczLjUgcS00MyAxMDIgLTQzIDIxMyBxMCAxMTEgNDMgMjEzIHE0MSA5OCAxMTcgMTczLjUgcTc2IDc1LjUgMTc0IDExNy41IHExMDEgNDMgMjEzIDQzIFoiIC8+PGdseXBoIGdseXBoLW5hbWU9InBhdXNlIiB1bmljb2RlPSImI3hlYTBjOyIgZD0iTTkzOCA0MDYzIGwwIC0zMTI1IGwxMjUwIDAgbDAgMzEyNSBsLTEyNTAgMCBaTTI4MTMgNDA2MyBsMCAtMzEyNSBsMTI1MCAwIGwwIDMxMjUgbC0xMjUwIDAgWiIgLz48Z2x5cGggZ2x5cGgtbmFtZT0icGxheSIgdW5pY29kZT0iJiN4ZWEwZDsiIGQ9Ik02MjUgNDM3NSBsMzc1MCAtMTg3NSBsLTM3NTAgLTE4NzUgbDAgMzc1MCBaIiAvPjxnbHlwaCBnbHlwaC1uYW1lPSJ0cmlhbmdsZS1zIiB1bmljb2RlPSImI3hlYTBlOyIgZD0iTTEyNTAgMzEyNSBsMTI1MCAtMTI1MCBsMTI1MCAxMjQ4IGwtMjUwMCAyIFoiIC8+PGdseXBoIGdseXBoLW5hbWU9InVzZXItc3RhdHVzLWF3YXkiIHVuaWNvZGU9IiYjeGVhMGY7IiBkPSJNMjE1NiA0OTY5IHEtMzYwIC00NiAtNjk1IC0xOTcgcS0zMjYgLTE0NyAtNjAxIC0zODAgcS0yNzQgLTIzMSAtNDcyIC01MjggcS0yMDIgLTMwMSAtMzA5IC02NDIgcS0xMTAgLTM1MyAtMTEwIC03MjIgcTAgLTQwNiAxMjggLTc4OCBxMTIzIC0zNzAgMzU2IC02ODYgcTIyOSAtMzEzIDU0MiAtNTQyIHEzMTYgLTIzMiA2ODYgLTM1NiBxMzgyIC0xMjggNzg4IC0xMjggcTM2OSAwIDcyMiAxMDcgcTM0MiAxMDQgNjQ0IDMwMSBxMjk4IDE5NCA1MzMgNDYzIHEyMzYgMjcwIDM4OSA1OTMgcTE1NiAzMzEgMjEyIDY5MiBxLTE4OCAtMjA0IC00MjMuNSAtMzUxIHEtMjM1LjUgLTE0NyAtNDk4LjUgLTIyNSBxLTI2OSAtODAgLTU0NyAtODAgcS0zMjIgMCAtNjI4IDEwMyBxLTI5NSA5OSAtNTQ4IDI4NiBxLTI1MSAxODQgLTQzNSA0MzUgcS0xODcgMjUzIC0yODYgNTQ4IHEtMTAzIDMwNiAtMTAzIDYyOCBxMCAyOTMgODAgNTY4IHE3OCAyNjkgMjI1LjUgNDk4LjUgcTE0Ny41IDIyOS41IDM1MC41IDQwMi41IFoiIC8+PGdseXBoIGdseXBoLW5hbWU9InVzZXItc3RhdHVzLWRuZCIgdW5pY29kZT0iJiN4ZWExMDsiIGQ9Ik0yNTAwIDUwMDAgcS00MDYgMCAtNzg4IC0xMjggcS0zNzAgLTEyNCAtNjg2IC0zNTYgcS0zMTMgLTIyOSAtNTQyIC01NDIgcS0yMzIgLTMxNiAtMzU2IC02ODYgcS0xMjggLTM4MiAtMTI4IC03ODggcTAgLTQwNiAxMjggLTc4OCBxMTI0IC0zNzAgMzU2IC02ODYgcTIyOSAtMzEzIDU0MiAtNTQyIHEzMTYgLTIzMiA2ODYgLTM1NiBxMzgyIC0xMjggNzg4IC0xMjggcTQwNiAwIDc4OCAxMjggcTM3MCAxMjQgNjg2IDM1NiBxMzEzIDIyOSA1NDIgNTQyIHEyMzIgMzE2IDM1NiA2ODYgcTEyOCAzODIgMTI4IDc4OCBxMCA0MDYgLTEyOCA3ODggcS0xMjQgMzcwIC0zNTYgNjg2IHEtMjI5IDMxMyAtNTQyIDU0MiBxLTMxNiAyMzIgLTY4NiAzNTYgcS0zODIgMTI4IC03ODggMTI4IFpNMTU2MyAyOTY5IGwxODc1IDAgcTkxIDAgMTc4IC0zOCBxODQgLTM3IDE1MCAtMTAzIHE2NiAtNjYgMTAyIC0xNDkgcTM4IC04NyAzOCAtMTc5IHEwIC05MiAtMzggLTE3OSBxLTM2IC04MyAtMTAyIC0xNDkgcS02NiAtNjYgLTE1MCAtMTAzIHEtODcgLTM4IC0xNzggLTM4IGwtMTg3NSAwIHEtOTIgMCAtMTc5IDM4IHEtODQgMzcgLTE1MCAxMDMgcS02NiA2NiAtMTAyIDE0OSBxLTM4IDg3IC0zOCAxNzkgcTAgOTIgMzggMTc5IHEzNiA4MyAxMDIgMTQ5IHE2NiA2NiAxNTAgMTAzIHE4NyAzOCAxNzkgMzggWiIgLz48Z2x5cGggZ2x5cGgtbmFtZT0idXNlci1zdGF0dXMtaW52aXNpYmxlIiB1bmljb2RlPSImI3hlYTExOyIgZD0iTTI1MDAgNTAwMCBxLTQwNiAwIC03ODggLTEyOCBxLTM3MCAtMTI0IC02ODYgLTM1NiBxLTMxMyAtMjI5IC01NDIgLTU0MiBxLTIzMiAtMzE2IC0zNTYgLTY4NiBxLTEyOCAtMzgyIC0xMjggLTc4OCBxMCAtNDA2IDEyOCAtNzg4IHExMjQgLTM3MCAzNTYgLTY4NiBxMjI5IC0zMTMgNTQyIC01NDIgcTMxNiAtMjMyIDY4NiAtMzU2IHEzODIgLTEyOCA3ODggLTEyOCBxNDA2IDAgNzg4IDEyOCBxMzcwIDEyNCA2ODYgMzU2IHEzMTMgMjI5IDU0MiA1NDIgcTIzMiAzMTYgMzU2IDY4NiBxMTI4IDM4MiAxMjggNzg4IHEwIDQwNiAtMTI4IDc4OCBxLTEyNCAzNzAgLTM1NiA2ODYgcS0yMjkgMzEzIC01NDIgNTQyIHEtMzE2IDIzMiAtNjg2IDM1NiBxLTM4MiAxMjggLTc4OCAxMjggWk0yNTAwIDQwMDAgcTMxMSAwIDU5MCAtMTE2IHEyNzEgLTExMiA0NzYuNSAtMzE3LjUgcTIwNS41IC0yMDUuNSAzMTcuNSAtNDc2LjUgcTExNiAtMjc5IDExNiAtNTkwIHEwIC0zMTEgLTExNiAtNTkwIHEtMTEyIC0yNzEgLTMxNy41IC00NzYuNSBxLTIwNS41IC0yMDUuNSAtNDc2LjUgLTMxNy41IHEtMjc5IC0xMTYgLTU5MCAtMTE2IHEtMzExIDAgLTU5MCAxMTYgcS0yNzEgMTEyIC00NzYuNSAzMTcuNSBxLTIwNS41IDIwNS41IC0zMTcuNSA0NzYuNSBxLTExNiAyNzkgLTExNiA1OTAgcTAgMzExIDExNiA1OTAgcTExMiAyNzEgMzE3LjUgNDc2LjUgcTIwNS41IDIwNS41IDQ3Ni41IDMxNy41IHEyNzkgMTE2IDU5MCAxMTYgWiIgLz48Z2x5cGggZ2x5cGgtbmFtZT0idXNlci1zdGF0dXMtb25saW5lIiB1bmljb2RlPSImI3hlYTEyOyIgZD0iTTE1MDAgMTUwMCBsMjAwMCAwIGwwIDIwMDAgbC0yMDAwIDAgbDAgLTIwMDAgWk0yNTAwIDUwMDAgcS00MDYgMCAtNzg4IC0xMjggcS0zNzAgLTEyNCAtNjg2IC0zNTYgcS0zMTMgLTIyOSAtNTQyIC01NDIgcS0yMzIgLTMxNiAtMzU2IC02ODYgcS0xMjggLTM4MiAtMTI4IC03ODggcTAgLTQwNiAxMjggLTc4OCBxMTI0IC0zNzAgMzU2IC02ODYgcTIyOSAtMzEzIDU0MiAtNTQyIHEzMTYgLTIzMiA2ODYgLTM1NiBxMzgyIC0xMjggNzg4IC0xMjggcTQwNiAwIDc4OCAxMjggcTM3MCAxMjQgNjg2IDM1NiBxMzEzIDIyOSA1NDIgNTQyIHEyMzIgMzE2IDM1NiA2ODYgcTEyOCAzODIgMTI4IDc4OCBxMCA0MDYgLTEyOCA3ODggcS0xMjQgMzcwIC0zNTYgNjg2IHEtMjI5IDMxMyAtNTQyIDU0MiBxLTMxNiAyMzIgLTY4NiAzNTYgcS0zODIgMTI4IC03ODggMTI4IFoiIC8+PC9mb250PjwvZGVmcz48L3N2Zz4="},function(e,s){e.exports=__webpack_require__(/*! core-js/modules/es.regexp.exec */ "./node_modules/core-js/modules/es.regexp.exec.js")},,function(e,s,t){"use strict";t(3),t(21),t(12),t(31);s.a=function(e){return Math.random().toString(36).replace(/[^a-z]+/g,"").substr(0,e||5)}},function(e,s){},function(e,s){e.exports=__webpack_require__(/*! core-js/modules/es.symbol */ "./node_modules/core-js/modules/es.symbol.js")},function(e,s){e.exports=__webpack_require__(/*! core-js/modules/es.array.concat */ "./node_modules/core-js/modules/es.array.concat.js")},function(e,s){e.exports=__webpack_require__(/*! @nextcloud/l10n/dist/gettext */ "./node_modules/@nextcloud/l10n/dist/gettext.js")},,,,function(e,s){e.exports=__webpack_require__(/*! core-js/modules/es.string.replace */ "./node_modules/core-js/modules/es.string.replace.js")},,,function(e,s,t){"use strict";t.r(s);var o={name:"Popover",components:{VPopover:t(4).VPopover}},n=(t(64),t(0)),r=t(24),c=t.n(r),i=Object(n.a)(o,(function(){var e=this.$createElement,s=this._self._c||e;return s("VPopover",this._g(this._b({attrs:{"popover-base-class":"popover","popover-wrapper-class":"popover__wrapper","popover-arrow-class":"popover__arrow","popover-inner-class":"popover__inner"}},"VPopover",this.$attrs,!1),this.$listeners),[this._t("trigger"),this._v(" "),s("template",{slot:"popover"},[this._t("default")],2)],2)}),[],!1,null,null,null);"function"==typeof c.a&&c()(i);var m=i.exports;
/**
 * @copyright Copyright (c) 2019 Marco Ambrosini <marcoambrosini@pm.me>
 *
 * @author Marco Ambrosini <marcoambrosini@pm.me>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */s.default=m},,function(e,s){e.exports=__webpack_require__(/*! core-js/modules/es.symbol.description */ "./node_modules/core-js/modules/es.symbol.description.js")},function(e,s,t){var o=t(85);"string"==typeof o&&(o=[[e.i,o,""]]),o.locals&&(e.exports=o.locals);(0,t(2).default)("7d4b1d60",o,!0,{})},,function(e,s){e.exports=__webpack_require__(/*! core-js/modules/es.array.slice */ "./node_modules/core-js/modules/es.array.slice.js")},,,,function(e,s,t){"use strict";t(26),t(14),t(82),t(7);var o=t(5),n=t.n(o);s.a=function(e,s,t){if(void 0!==e)for(var o=e.length-1;o>=0;o--){var r=e[o],c=!r.componentOptions&&r.tag&&-1===s.indexOf(r.tag),i=!!r.componentOptions&&"string"==typeof r.componentOptions.tag,m=i&&-1===s.indexOf(r.componentOptions.tag);(c||!i||m)&&((c||m)&&n.a.util.warn("".concat(c?r.tag:r.componentOptions.tag," is not allowed inside the ").concat(t.$options.name," component"),t),e.splice(o,1))}}},function(e,s){e.exports=__webpack_require__(/*! core-js/modules/es.symbol.iterator */ "./node_modules/core-js/modules/es.symbol.iterator.js")},,,,function(e,s){e.exports=__webpack_require__(/*! core-js/modules/es.array.filter */ "./node_modules/core-js/modules/es.array.filter.js")},function(e,s){e.exports=__webpack_require__(/*! core-js/modules/es.array.from */ "./node_modules/core-js/modules/es.array.from.js")},,,function(e,s){},,function(e,s,t){"use strict";t.r(s);var o=t(59);
/**
 * @copyright Copyright (c) 2018 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */s.default=o.a},function(e,s,t){var o=t(56);"string"==typeof o&&(o=[[e.i,o,""]]),o.locals&&(e.exports=o.locals);(0,t(2).default)("941c791e",o,!0,{})},function(e,s,t){(s=t(1)(!1)).push([e.i,".vue-tooltip[data-v-19787a9]{position:absolute;z-index:100000;right:auto;left:auto;display:block;margin:0;margin-top:-3px;padding:10px 0;text-align:left;text-align:start;opacity:0;line-height:1.6;line-break:auto;filter:drop-shadow(0 1px 10px var(--color-box-shadow))}.vue-tooltip[data-v-19787a9][x-placement^='top'] .tooltip-arrow{bottom:0;margin-top:0;margin-bottom:0;border-width:10px 10px 0 10px;border-right-color:transparent;border-bottom-color:transparent;border-left-color:transparent}.vue-tooltip[data-v-19787a9][x-placement^='bottom'] .tooltip-arrow{top:0;margin-top:0;margin-bottom:0;border-width:0 10px 10px 10px;border-top-color:transparent;border-right-color:transparent;border-left-color:transparent}.vue-tooltip[data-v-19787a9][x-placement^='right'] .tooltip-arrow{right:100%;margin-right:0;margin-left:0;border-width:10px 10px 10px 0;border-top-color:transparent;border-bottom-color:transparent;border-left-color:transparent}.vue-tooltip[data-v-19787a9][x-placement^='left'] .tooltip-arrow{left:100%;margin-right:0;margin-left:0;border-width:10px 0 10px 10px;border-top-color:transparent;border-right-color:transparent;border-bottom-color:transparent}.vue-tooltip[data-v-19787a9][aria-hidden='true']{visibility:hidden;transition:opacity .15s, visibility .15s;opacity:0}.vue-tooltip[data-v-19787a9][aria-hidden='false']{visibility:visible;transition:opacity .15s;opacity:1}.vue-tooltip[data-v-19787a9] .tooltip-inner{max-width:350px;padding:5px 8px;text-align:center;color:var(--color-main-text);border-radius:var(--border-radius);background-color:var(--color-main-background)}.vue-tooltip[data-v-19787a9] .tooltip-arrow{position:absolute;z-index:1;width:0;height:0;margin:0;border-style:solid;border-color:var(--color-main-background)}\n",""]),e.exports=s},,,function(e,s,t){"use strict";t(25),t(36),t(44),t(26),t(48),t(49),t(14),t(8),t(39),t(7),t(3),t(12),t(9),t(10);var o=t(15),n=t(23),r=t(43),c=t(6),i=t(34);function m(e){return function(e){if(Array.isArray(e))return A(e)}(e)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||function(e,s){if(!e)return;if("string"==typeof e)return A(e,s);var t=Object.prototype.toString.call(e).slice(8,-1);"Object"===t&&e.constructor&&(t=e.constructor.name);if("Map"===t||"Set"===t)return Array.from(e);if("Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))return A(e,s)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function A(e,s){(null==s||s>e.length)&&(s=e.length);for(var t=0,o=new Array(s);t<s;t++)o[t]=e[t];return o}var a=["ActionButton","ActionCheckbox","ActionInput","ActionLink","ActionRadio","ActionRouter","ActionSeparator","ActionText","ActionTextEditable"],l={name:"Actions",directives:{tooltip:o.default},components:{Popover:i.default},props:{open:{type:Boolean,default:!1},forceMenu:{type:Boolean,default:!1},menuTitle:{type:String,default:null},primary:{type:Boolean,default:!1},defaultIcon:{type:String,default:"action-item__menutoggle--default-icon"},ariaLabel:{type:String,default:Object(c.b)("Actions")},placement:{type:String,default:"bottom"},boundariesElement:{type:Element,default:function(){return document.querySelector("body")}},container:{type:String,default:"body"}},data:function(){return{actions:[],opened:this.open,focusIndex:0,randomId:"menu-"+Object(n.a)(),children:this.$children}},computed:{hasMultipleActions:function(){return this.actions.length>1},isValidSingleAction:function(){return 1===this.actions.length&&null!==this.firstActionElement},firstActionVNode:function(){return this.actions[0]},firstAction:function(){return this.children[0]?this.children[0]:{}},firstActionBinding:function(){if(this.firstActionVNode&&this.firstActionVNode.componentOptions){var e=this.firstActionVNode.componentOptions.tag;if("ActionLink"===e)return{is:"a",href:this.firstAction.href,target:this.firstAction.target,"aria-label":this.firstAction.ariaLabel};if("ActionRouter"===e)return{is:"router-link",to:this.firstAction.to,exact:this.firstAction.exact,"aria-label":this.firstAction.ariaLabel};if("ActionButton"===e)return{is:"button","aria-label":this.firstAction.ariaLabel}}return null},firstActionEvent:function(){return this.firstActionVNode&&this.firstActionVNode.componentOptions&&this.firstActionVNode.componentOptions.listeners&&this.firstActionVNode.componentOptions.listeners.click},firstActionEventBinding:function(){return this.firstActionEvent?"click":null},firstActionClass:function(){var e=this.firstActionVNode&&this.firstActionVNode.data.staticClass,s=this.firstActionVNode&&this.firstActionVNode.data.class;return"".concat(e," ").concat(s)}},watch:{open:function(e){e!==this.opened&&(this.opened=e)}},beforeMount:function(){this.initActions(),Object(r.a)(this.$slots.default,a,this)},beforeUpdate:function(){this.initActions(),Object(r.a)(this.$slots.default,a,this)},methods:{openMenu:function(e){this.opened||(this.opened=!0,this.$emit("update:open",!0),this.$emit("open"),this.onOpen(e))},closeMenu:function(e){this.opened&&(this.opened=!1,this.$emit("update:open",!1),this.$emit("close"),this.opened=!1,this.focusIndex=0,this.$refs.menuButton.focus())},onOpen:function(e){var s=this;this.$nextTick((function(){s.focusFirstAction(e)}))},onMouseFocusAction:function(e){if(document.activeElement!==e.target){var s=e.target.closest("li");if(s){var t=s.querySelector(".focusable");if(t){var o=m(this.$refs.menu.querySelectorAll(".focusable")).indexOf(t);o>-1&&(this.focusIndex=o,this.focusAction())}}}},removeCurrentActive:function(){var e=this.$refs.menu.querySelector("li.active");e&&e.classList.remove("active")},focusAction:function(){var e=this.$refs.menu.querySelectorAll(".focusable")[this.focusIndex];if(e){this.removeCurrentActive();var s=e.closest("li.action");e.focus(),s&&s.classList.add("active")}},focusPreviousAction:function(e){this.opened&&(0===this.focusIndex?this.closeMenu():(this.preventIfEvent(e),this.focusIndex=this.focusIndex-1),this.focusAction())},focusNextAction:function(e){if(this.opened){var s=this.$refs.menu.querySelectorAll(".focusable").length-1;this.focusIndex===s?this.closeMenu():(this.preventIfEvent(e),this.focusIndex=this.focusIndex+1),this.focusAction()}},focusFirstAction:function(e){this.opened&&(this.preventIfEvent(e),this.focusIndex=0,this.focusAction())},focusLastAction:function(e){this.opened&&(this.preventIfEvent(e),this.focusIndex=this.$el.querySelectorAll(".focusable").length-1,this.focusAction())},preventIfEvent:function(e){e&&(e.preventDefault(),e.stopPropagation())},execFirstAction:function(e){this.firstActionEvent&&this.firstActionEvent(e)},initActions:function(){this.actions=(this.$slots.default||[]).filter((function(e){return!!e&&!!e.componentOptions}))}}},g=(t(84),t(0)),u=t(52),d=t.n(u),p=Object(g.a)(l,(function(){var e,s=this,t=s.$createElement,o=s._self._c||t;return s.isValidSingleAction&&!s.forceMenu?o("element",s._b({directives:[{name:"tooltip",rawName:"v-tooltip.auto",value:s.firstAction.text,expression:"firstAction.text",modifiers:{auto:!0}}],staticClass:"action-item action-item--single",class:[s.firstAction.icon,s.firstActionClass],attrs:{rel:"noreferrer noopener"},on:s._d({},[s.firstActionEventBinding,s.execFirstAction])},"element",s.firstActionBinding,!1),[o("span",{attrs:{"aria-hidden":!0,hidden:""}},[s._t("default")],2)]):o("div",{directives:[{name:"show",rawName:"v-show",value:s.hasMultipleActions||s.forceMenu,expression:"hasMultipleActions || forceMenu"}],staticClass:"action-item",class:{"action-item--open":s.opened}},[o("Popover",{attrs:{delay:0,"handle-resize":!0,open:s.opened,placement:s.placement,"boundaries-element":s.boundariesElement,container:s.container},on:{"update:open":function(e){s.opened=e},show:s.openMenu,"apply-show":s.onOpen,hide:s.closeMenu}},[o("button",{ref:"menuButton",staticClass:"icon action-item__menutoggle",class:(e={},e[s.defaultIcon]=!0,e["action-item__menutoggle--with-title"]=s.menuTitle,e["action-item__menutoggle--primary"]=s.primary,e),attrs:{slot:"trigger","aria-label":s.ariaLabel,"aria-haspopup":"true","aria-controls":s.randomId,"aria-expanded":s.opened},slot:"trigger"},[s._v("\n\t\t\t"+s._s(s.menuTitle)+"\n\t\t")]),s._v(" "),o("div",{directives:[{name:"show",rawName:"v-show",value:s.opened,expression:"opened"}],ref:"menu",class:{open:s.opened},attrs:{tabindex:"-1"},on:{keydown:[function(e){return!e.type.indexOf("key")&&s._k(e.keyCode,"up",38,e.key,["Up","ArrowUp"])||e.ctrlKey||e.shiftKey||e.altKey||e.metaKey?null:s.focusPreviousAction(e)},function(e){return!e.type.indexOf("key")&&s._k(e.keyCode,"down",40,e.key,["Down","ArrowDown"])||e.ctrlKey||e.shiftKey||e.altKey||e.metaKey?null:s.focusNextAction(e)},function(e){return!e.type.indexOf("key")&&s._k(e.keyCode,"tab",9,e.key,"Tab")||e.ctrlKey||e.shiftKey||e.altKey||e.metaKey?null:s.focusNextAction(e)},function(e){return!e.type.indexOf("key")&&s._k(e.keyCode,"tab",9,e.key,"Tab")?null:e.shiftKey?e.ctrlKey||e.altKey||e.metaKey?null:s.focusPreviousAction(e):null},function(e){return!e.type.indexOf("key")&&s._k(e.keyCode,"page-up",void 0,e.key,void 0)||e.ctrlKey||e.shiftKey||e.altKey||e.metaKey?null:s.focusFirstAction(e)},function(e){return!e.type.indexOf("key")&&s._k(e.keyCode,"page-down",void 0,e.key,void 0)||e.ctrlKey||e.shiftKey||e.altKey||e.metaKey?null:s.focusLastAction(e)},function(e){return!e.type.indexOf("key")&&s._k(e.keyCode,"esc",27,e.key,["Esc","Escape"])||e.ctrlKey||e.shiftKey||e.altKey||e.metaKey?null:(e.preventDefault(),s.closeMenu(e))}],mousemove:s.onMouseFocusAction}},[o("ul",{attrs:{id:s.randomId,tabindex:"-1"}},[s.opened?[s._t("default")]:s._e()],2)])])],1)}),[],!1,null,"69f4d5ed",null);"function"==typeof d.a&&d()(p);s.a=p.exports},,,,,function(e,s,t){"use strict";var o=t(13);t.n(o).a},function(e,s,t){(s=t(1)(!1)).push([e.i,".popover{z-index:100000;display:block !important;filter:drop-shadow(0 1px 10px var(--color-box-shadow))}.popover__inner{padding:0;color:var(--color-main-text);border-radius:var(--border-radius);background:var(--color-main-background)}.popover__arrow{position:absolute;z-index:1;width:0;height:0;margin:10px;border-style:solid;border-color:var(--color-main-background)}.popover[x-placement^='top']{margin-bottom:10px}.popover[x-placement^='top'] .popover__arrow{bottom:-10px;left:calc(50% - $arrow-width);margin-top:0;margin-bottom:0;border-width:10px 10px 0 10px;border-right-color:transparent !important;border-bottom-color:transparent !important;border-left-color:transparent !important}.popover[x-placement^='bottom']{margin-top:10px}.popover[x-placement^='bottom'] .popover__arrow{top:-10px;left:calc(50% - $arrow-width);margin-top:0;margin-bottom:0;border-width:0 10px 10px 10px;border-top-color:transparent !important;border-right-color:transparent !important;border-left-color:transparent !important}.popover[x-placement^='right']{margin-left:10px}.popover[x-placement^='right'] .popover__arrow{top:calc(50% - $arrow-width);left:-10px;margin-right:0;margin-left:0;border-width:10px 10px 10px 0;border-top-color:transparent !important;border-bottom-color:transparent !important;border-left-color:transparent !important}.popover[x-placement^='left']{margin-right:10px}.popover[x-placement^='left'] .popover__arrow{top:calc(50% - $arrow-width);right:-10px;margin-right:0;margin-left:0;border-width:10px 0 10px 10px;border-top-color:transparent !important;border-right-color:transparent !important;border-bottom-color:transparent !important}.popover[aria-hidden='true']{visibility:hidden;transition:opacity var(--animation-quick),visibility var(--animation-quick);opacity:0}.popover[aria-hidden='false']{visibility:visible;transition:opacity var(--animation-quick);opacity:1}\n",""]),e.exports=s},,,,,,,,,,,,,,,,,function(e,s){e.exports=__webpack_require__(/*! core-js/modules/es.array.splice */ "./node_modules/core-js/modules/es.array.splice.js")},,function(e,s,t){"use strict";var o=t(37);t.n(o).a},function(e,s,t){var o=t(1),n=t(16),r=t(17),c=t(18),i=t(19),m=t(20);s=o(!1);var A=n(r),a=n(c),l=n(i),g=n(m);s.push([e.i,'@font-face{font-family:"iconfont-vue-19787a9";src:url('+A+");src:url("+A+') format("embedded-opentype"),url('+a+') format("woff"),url('+l+') format("truetype"),url('+g+') format("svg")}.icon[data-v-69f4d5ed]{font-style:normal;font-weight:400}.icon.arrow-left-double[data-v-69f4d5ed]:before{font-family:"iconfont-vue-19787a9";content:""}.icon.arrow-left[data-v-69f4d5ed]:before{font-family:"iconfont-vue-19787a9";content:""}.icon.arrow-right-double[data-v-69f4d5ed]:before{font-family:"iconfont-vue-19787a9";content:""}.icon.arrow-right[data-v-69f4d5ed]:before{font-family:"iconfont-vue-19787a9";content:""}.icon.breadcrumb[data-v-69f4d5ed]:before{font-family:"iconfont-vue-19787a9";content:""}.icon.checkmark[data-v-69f4d5ed]:before{font-family:"iconfont-vue-19787a9";content:""}.icon.close[data-v-69f4d5ed]:before{font-family:"iconfont-vue-19787a9";content:""}.icon.confirm[data-v-69f4d5ed]:before{font-family:"iconfont-vue-19787a9";content:""}.icon.info[data-v-69f4d5ed]:before{font-family:"iconfont-vue-19787a9";content:""}.icon.menu[data-v-69f4d5ed]:before{font-family:"iconfont-vue-19787a9";content:""}.icon.more[data-v-69f4d5ed]:before{font-family:"iconfont-vue-19787a9";content:""}.icon.pause[data-v-69f4d5ed]:before{font-family:"iconfont-vue-19787a9";content:""}.icon.play[data-v-69f4d5ed]:before{font-family:"iconfont-vue-19787a9";content:""}.icon.triangle-s[data-v-69f4d5ed]:before{font-family:"iconfont-vue-19787a9";content:""}.icon.user-status-away[data-v-69f4d5ed]:before{font-family:"iconfont-vue-19787a9";content:""}.icon.user-status-dnd[data-v-69f4d5ed]:before{font-family:"iconfont-vue-19787a9";content:""}.icon.user-status-invisible[data-v-69f4d5ed]:before{font-family:"iconfont-vue-19787a9";content:""}.icon.user-status-online[data-v-69f4d5ed]:before{font-family:"iconfont-vue-19787a9";content:""}.action-item[data-v-69f4d5ed]{position:relative;display:inline-block}.action-item--single[data-v-69f4d5ed]:hover,.action-item--single[data-v-69f4d5ed]:focus,.action-item--single[data-v-69f4d5ed]:active,.action-item__menutoggle[data-v-69f4d5ed]:hover,.action-item__menutoggle[data-v-69f4d5ed]:focus,.action-item__menutoggle[data-v-69f4d5ed]:active{opacity:1;background-color:rgba(127,127,127,0.25)}.action-item.action-item--open .action-item__menutoggle[data-v-69f4d5ed]{opacity:1;background-color:rgba(127,127,127,0.25)}.action-item--single[data-v-69f4d5ed],.action-item__menutoggle[data-v-69f4d5ed]{box-sizing:border-box;width:auto;min-width:44px;height:44px;margin:0;padding:14px;cursor:pointer;border:none;border-radius:22px;background-color:transparent}.action-item__menutoggle[data-v-69f4d5ed]{display:flex;align-items:center;justify-content:center;opacity:.7;font-weight:bold;line-height:16px}.action-item__menutoggle[data-v-69f4d5ed]:before{content:\'\'}.action-item__menutoggle--default-icon[data-v-69f4d5ed]:before{font-family:"iconfont-vue-19787a9";font-style:normal;font-weight:400;content:""}.action-item__menutoggle--default-icon[data-v-69f4d5ed]::before{font-size:16px}.action-item__menutoggle--with-title[data-v-69f4d5ed]{position:relative;padding-left:44px;white-space:nowrap;opacity:1;border:1px solid var(--color-border-dark);background-color:var(--color-background-dark);background-position:14px center;font-size:inherit}.action-item__menutoggle--with-title[data-v-69f4d5ed]:before{position:absolute;top:14px;left:14px}.action-item__menutoggle--primary[data-v-69f4d5ed]{opacity:1;color:var(--color-primary-text);border:none;background-color:var(--color-primary-element)}.action-item--open .action-item__menutoggle--primary[data-v-69f4d5ed],.action-item__menutoggle--primary[data-v-69f4d5ed]:hover,.action-item__menutoggle--primary[data-v-69f4d5ed]:focus,.action-item__menutoggle--primary[data-v-69f4d5ed]:active{color:var(--color-primary-text) !important;background-color:var(--color-primary-element-light) !important}.action-item--single[data-v-69f4d5ed]{opacity:.7}.action-item--single[data-v-69f4d5ed]:hover,.action-item--single[data-v-69f4d5ed]:focus,.action-item--single[data-v-69f4d5ed]:active{opacity:1}.action-item--single>[hidden][data-v-69f4d5ed]{display:none}.ie .action-item__menu[data-v-69f4d5ed],.ie .action-item__menu .action-item__menu_arrow[data-v-69f4d5ed],.edge .action-item__menu[data-v-69f4d5ed],.edge .action-item__menu .action-item__menu_arrow[data-v-69f4d5ed]{border:1px solid var(--color-border)}\n',""]),e.exports=s}])}));
//# sourceMappingURL=Actions.js.map

/***/ })

}]);
//# sourceMappingURL=photos-0.js.map?v=f851824c46ef168a8074