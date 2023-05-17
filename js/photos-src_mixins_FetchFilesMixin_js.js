"use strict";
(self["webpackChunkphotos"] = self["webpackChunkphotos"] || []).push([["src_mixins_FetchFilesMixin_js"],{

/***/ "./src/mixins/FetchFilesMixin.js":
/*!***************************************!*\
  !*** ./src/mixins/FetchFilesMixin.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _services_logger_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/logger.js */ "./src/services/logger.js");
/* harmony import */ var _services_PhotoSearch_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/PhotoSearch.js */ "./src/services/PhotoSearch.js");
/* harmony import */ var _utils_semaphoreWithPriority_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/semaphoreWithPriority.js */ "./src/utils/semaphoreWithPriority.js");
/* harmony import */ var _AbortControllerMixin_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./AbortControllerMixin.js */ "./src/mixins/AbortControllerMixin.js");
/* provided dependency */ var console = __webpack_require__(/*! ./node_modules/console-browserify/index.js */ "./node_modules/console-browserify/index.js");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * @copyright Copyright (c) 2022 Louis Chemineau <louis@chmn.me>
 *
 * @author Louis Chemineau <louis@chmn.me>
 *
 * @license AGPL-3.0-or-later
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




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'FetchFilesMixin',
  mixins: [_AbortControllerMixin_js__WEBPACK_IMPORTED_MODULE_3__["default"]],
  data: function data() {
    return {
      errorFetchingFiles: null,
      loadingFiles: false,
      doneFetchingFiles: false,
      semaphore: new _utils_semaphoreWithPriority_js__WEBPACK_IMPORTED_MODULE_2__["default"](30),
      fetchSemaphore: new _utils_semaphoreWithPriority_js__WEBPACK_IMPORTED_MODULE_2__["default"](1),
      semaphoreSymbol: null,
      fetchedFileIds: []
    };
  },
  watch: {
    $route: function $route() {
      this.resetFetchFilesState();
    }
  },
  methods: {
    /**
     * @param {string} path - Path to pass to getPhotos.
     * @param {object} options - Options to pass to getPhotos.
     * @param {string[]} [blacklist=[]] - Array of ids to filter out.
     * @param {boolean} [force=false] - Force fetching even if doneFetchingFiles is true
     * @return {Promise<string[]>} - The next batch of data depending on global offset.
     */
    fetchFiles: function fetchFiles() {
      var _arguments = arguments,
          _this = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var path, options, blacklist, force, semaphoreSymbol, fetchSemaphoreSymbol, _this$fetchedFileIds, numberOfImagesPerBatch, fetchedFiles, fileIds, _error$response;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                path = _arguments.length > 0 && _arguments[0] !== undefined ? _arguments[0] : '';
                options = _arguments.length > 1 && _arguments[1] !== undefined ? _arguments[1] : {};
                blacklist = _arguments.length > 2 && _arguments[2] !== undefined ? _arguments[2] : [];
                force = _arguments.length > 3 && _arguments[3] !== undefined ? _arguments[3] : false;

                if (!(_this.doneFetchingFiles && !force || _this.loadingFiles)) {
                  _context.next = 6;
                  break;
                }

                return _context.abrupt("return", []);

              case 6:
                _context.next = 8;
                return _this.semaphore.acquire(function () {
                  return 0;
                }, 'fetchFiles');

              case 8:
                semaphoreSymbol = _context.sent;
                _context.next = 11;
                return _this.fetchSemaphore.acquire();

              case 11:
                fetchSemaphoreSymbol = _context.sent;
                _context.prev = 12;
                _this.errorFetchingFiles = null;
                _this.loadingFiles = true;
                _this.semaphoreSymbol = semaphoreSymbol;
                numberOfImagesPerBatch = 200; // Load next batch of images

                _context.next = 19;
                return (0,_services_PhotoSearch_js__WEBPACK_IMPORTED_MODULE_1__["default"])(path, _objectSpread(_objectSpread({
                  firstResult: _this.fetchedFileIds.length,
                  nbResults: numberOfImagesPerBatch
                }, options), {}, {
                  signal: _this.abortController.signal
                }));

              case 19:
                fetchedFiles = _context.sent;

                // If we get less files than requested that means we got to the end
                if (fetchedFiles.length !== numberOfImagesPerBatch) {
                  _this.doneFetchingFiles = true;
                }

                fileIds = fetchedFiles.map(function (file) {
                  return file.fileid;
                }).filter(function (fileId) {
                  return !_this.fetchedFileIds.includes(fileId);
                }); // Filter to prevent duplicate fileIds.

                (_this$fetchedFileIds = _this.fetchedFileIds).push.apply(_this$fetchedFileIds, _toConsumableArray(fileIds.map(function (fileId) {
                  return fileId.toString();
                }).filter(function (fileId) {
                  return !blacklist.includes(fileId);
                })));

                _this.$store.dispatch('appendFiles', fetchedFiles);

                _services_logger_js__WEBPACK_IMPORTED_MODULE_0__["default"].debug("[FetchFilesMixin] Fetched ".concat(fileIds.length, " new files: "), fileIds);
                return _context.abrupt("return", fileIds);

              case 28:
                _context.prev = 28;
                _context.t0 = _context["catch"](12);

                if (!(((_error$response = _context.t0.response) === null || _error$response === void 0 ? void 0 : _error$response.status) === 404)) {
                  _context.next = 34;
                  break;
                }

                _this.errorFetchingFiles = 404;
                _context.next = 39;
                break;

              case 34:
                if (!(_context.t0.code === 'ERR_CANCELED')) {
                  _context.next = 38;
                  break;
                }

                return _context.abrupt("return", []);

              case 38:
                _this.errorFetchingFiles = _context.t0;

              case 39:
                // cancelled request, moving on...
                _services_logger_js__WEBPACK_IMPORTED_MODULE_0__["default"].error('Error fetching files', {
                  error: _context.t0
                });
                console.error(_context.t0);

              case 41:
                _context.prev = 41;
                _this.loadingFiles = false;

                _this.semaphore.release(semaphoreSymbol);

                _this.fetchSemaphore.release(fetchSemaphoreSymbol);

                return _context.finish(41);

              case 46:
                return _context.abrupt("return", []);

              case 47:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[12, 28, 41, 46]]);
      }))();
    },
    resetFetchFilesState: function resetFetchFilesState() {
      this.doneFetchingFiles = false;
      this.errorFetchingFiles = null;
      this.loadingFiles = false;
      this.fetchedFileIds = [];
    }
  }
});

/***/ }),

/***/ "./src/services/PhotoSearch.js":
/*!*************************************!*\
  !*** ./src/services/PhotoSearch.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_fileUtils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/fileUtils.js */ "./src/utils/fileUtils.js");
/* harmony import */ var _nextcloud_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/auth */ "./node_modules/@nextcloud/auth/dist/index.esm.js");
/* harmony import */ var _AllowedMimes_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AllowedMimes.js */ "./src/services/AllowedMimes.js");
/* harmony import */ var _DavClient_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./DavClient.js */ "./src/services/DavClient.js");
/* harmony import */ var _DavRequest_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./DavRequest.js */ "./src/services/DavRequest.js");
/* harmony import */ var _nextcloud_moment__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @nextcloud/moment */ "./node_modules/@nextcloud/moment/dist/index.js");
/* harmony import */ var _nextcloud_moment__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_moment__WEBPACK_IMPORTED_MODULE_5__);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @license AGPL-3.0-or-later
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






/**
 * List files from a folder and filter out unwanted mimes
 *
 * @param {object} path the lookup path
 * @param {object} [options] used for the cancellable requests
 * @param {number} [options.firstResult=0] Index of the first result that we want (starts at 0)
 * @param {number} [options.nbResults=200] The number of file to fetch
 * @param {string[]} [options.mimesType=allMimes] Mime type of the files
 * @param {boolean} [options.full=false] get full data of the files
 * @param {boolean} [options.onThisDay=false] get only items from this day of year
 * @param {boolean} [options.onlyFavorites=false] get only favorite items
 * @return {Promise<object[]>} the file list
 */

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  return _ref.apply(this, arguments);
}

function _ref() {
  _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var path,
        options,
        prefixPath,
        orMime,
        eqFavorites,
        onThisDay,
        response,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            path = _args.length > 0 && _args[0] !== undefined ? _args[0] : '';
            options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
            // default function options
            options = _objectSpread({
              firstResult: 0,
              nbResults: 200,
              mimesType: _AllowedMimes_js__WEBPACK_IMPORTED_MODULE_2__.allMimes,
              onThisDay: false,
              onlyFavorites: false
            }, options);
            prefixPath = "/files/".concat((0,_nextcloud_auth__WEBPACK_IMPORTED_MODULE_1__.getCurrentUser)().uid); // generating the search or condition
            // based on the allowed mimetypes

            orMime = options.mimesType.reduce(function (str, mime) {
              return "".concat(str, "\n\t\t<d:eq>\n\t\t\t<d:prop>\n\t\t\t\t<d:getcontenttype/>\n\t\t\t</d:prop>\n\t\t\t<d:literal>").concat(mime, "</d:literal>\n\t\t</d:eq>\n\t");
            }, '');
            eqFavorites = options.onlyFavorites ? "<d:eq>\n\t\t\t\t<d:prop>\n\t\t\t\t\t<oc:favorite/>\n\t\t\t\t</d:prop>\n\t\t\t\t<d:literal>1</d:literal>\n\t\t\t</d:eq>" : '';
            onThisDay = options.onThisDay ? "<d:or>".concat(Array(20).fill(1).map(function (_, years) {
              var start = _nextcloud_moment__WEBPACK_IMPORTED_MODULE_5___default()(Date.now()).startOf('day').subtract(3, 'd').subtract(years + 1, 'y');
              var end = _nextcloud_moment__WEBPACK_IMPORTED_MODULE_5___default()(Date.now()).endOf('day').add(3, 'd').subtract(years + 1, 'y');
              return "<d:and>\n\t\t\t\t<d:gt>\n\t\t\t\t\t<d:prop>\n\t\t\t\t\t\t<d:getlastmodified />\n\t\t\t\t\t</d:prop>\n\t\t\t\t\t<d:literal>".concat(start.format((_nextcloud_moment__WEBPACK_IMPORTED_MODULE_5___default().defaultFormatUtc)), "</d:literal>\n\t\t\t\t</d:gt>\n\t\t\t\t<d:lt>\n\t\t\t\t\t<d:prop>\n\t\t\t\t\t\t<d:getlastmodified />\n\t\t\t\t\t</d:prop>\n\t\t\t\t\t<d:literal>").concat(end.format((_nextcloud_moment__WEBPACK_IMPORTED_MODULE_5___default().defaultFormatUtc)), "</d:literal>\n\t\t\t\t</d:lt>\n\t\t\t</d:and>");
            }).join('\n'), "</d:or>") : '';
            options = Object.assign({
              method: 'SEARCH',
              headers: {
                'content-Type': 'text/xml'
              },
              data: "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n\t\t\t<d:searchrequest xmlns:d=\"DAV:\"\n\t\t\t\txmlns:oc=\"http://owncloud.org/ns\"\n\t\t\t\txmlns:nc=\"http://nextcloud.org/ns\"\n\t\t\t\txmlns:ns=\"https://github.com/icewind1991/SearchDAV/ns\"\n\t\t\t\txmlns:ocs=\"http://open-collaboration-services.org/ns\">\n\t\t\t\t<d:basicsearch>\n\t\t\t\t\t<d:select>\n\t\t\t\t\t\t<d:prop>\n\t\t\t\t\t\t\t".concat(_DavRequest_js__WEBPACK_IMPORTED_MODULE_4__.props, "\n\t\t\t\t\t\t</d:prop>\n\t\t\t\t\t</d:select>\n\t\t\t\t\t<d:from>\n\t\t\t\t\t\t<d:scope>\n\t\t\t\t\t\t\t<d:href>").concat(prefixPath, "/").concat(path, "</d:href>\n\t\t\t\t\t\t\t<d:depth>infinity</d:depth>\n\t\t\t\t\t\t</d:scope>\n\t\t\t\t\t</d:from>\n\t\t\t\t\t<d:where>\n\t\t\t\t\t\t<d:and>\n\t\t\t\t\t\t\t<d:or>\n\t\t\t\t\t\t\t\t").concat(orMime, "\n\t\t\t\t\t\t\t</d:or>\n\t\t\t\t\t\t\t").concat(eqFavorites, "\n\t\t\t\t\t\t\t").concat(onThisDay, "\n\t\t\t\t\t\t</d:and>\n\t\t\t\t\t</d:where>\n\t\t\t\t\t<d:orderby>\n\t\t\t\t\t\t<d:order>\n\t\t\t\t\t\t\t<d:prop><d:getlastmodified/></d:prop>\n\t\t\t\t\t\t\t<d:descending/>\n\t\t\t\t\t\t</d:order>\n\t\t\t\t\t</d:orderby>\n\t\t\t\t\t<d:limit>\n\t\t\t\t\t\t<d:nresults>").concat(options.nbResults, "</d:nresults>\n\t\t\t\t\t\t<ns:firstresult>").concat(options.firstResult, "</ns:firstresult>\n\t\t\t\t\t</d:limit>\n\t\t\t\t</d:basicsearch>\n\t\t\t</d:searchrequest>"),
              deep: true,
              details: true
            }, options);
            _context.next = 10;
            return _DavClient_js__WEBPACK_IMPORTED_MODULE_3__["default"].getDirectoryContents('', options);

          case 10:
            response = _context.sent;
            return _context.abrupt("return", response.data.map(function (data) {
              return (0,_utils_fileUtils_js__WEBPACK_IMPORTED_MODULE_0__.genFileInfo)(data);
            }));

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _ref.apply(this, arguments);
}

/***/ })

}]);
//# sourceMappingURL=photos-src_mixins_FetchFilesMixin_js.js.map?v=ffb4cce0b182b4d7d2b7