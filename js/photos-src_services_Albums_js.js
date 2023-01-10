"use strict";
(self["webpackChunkphotos"] = self["webpackChunkphotos"] || []).push([["src_services_Albums_js"],{

/***/ "./src/services/Albums.js":
/*!********************************!*\
  !*** ./src/services/Albums.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fetchAlbum": () => (/* binding */ fetchAlbum),
/* harmony export */   "fetchAlbums": () => (/* binding */ fetchAlbums),
/* harmony export */   "fetchAlbumContent": () => (/* binding */ fetchAlbumContent)
/* harmony export */ });
/* harmony import */ var _nextcloud_moment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/moment */ "./node_modules/@nextcloud/moment/dist/index.js");
/* harmony import */ var _nextcloud_moment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_moment__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/l10n */ "./node_modules/@nextcloud/l10n/dist/index.js");
/* harmony import */ var _services_DavClient_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/DavClient.js */ "./src/services/DavClient.js");
/* harmony import */ var _services_logger_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/logger.js */ "./src/services/logger.js");
/* harmony import */ var _services_DavRequest_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../services/DavRequest.js */ "./src/services/DavRequest.js");
/* harmony import */ var _utils_fileUtils_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/fileUtils.js */ "./src/utils/fileUtils.js");
/* provided dependency */ var console = __webpack_require__(/*! ./node_modules/console-browserify/index.js */ "./node_modules/console-browserify/index.js");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

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






/**
 * @typedef {object} Album
 * @property {string} id - The id of the album.
 * @property {string} name - The name of the album.
 * @property {number} creationDate - The creation date of the album.
 * @property {string} isShared - Whether the current user as shared the album.
 * @property {string} isCollaborative - Whether the album can be edited by other users.
 * @property {number} itemCount - The number of item in the album.
 * @property {number} cover - The cover of the album.
 */

/**
 * @param {string} extraProps - Extra properties to add to the DAV request.
 * @return {string}
 */

function getDavRequest() {
  var extraProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return "<?xml version=\"1.0\"?>\n\t\t\t<d:propfind xmlns:d=\"DAV:\"\n\t\t\t\txmlns:oc=\"http://owncloud.org/ns\"\n\t\t\t\txmlns:nc=\"http://nextcloud.org/ns\"\n\t\t\t\txmlns:ocs=\"http://open-collaboration-services.org/ns\">\n\t\t\t\t<d:prop>\n\t\t\t\t\t<nc:last-photo />\n\t\t\t\t\t<nc:nbItems />\n\t\t\t\t\t<nc:location />\n\t\t\t\t\t<nc:dateRange />\n\t\t\t\t\t<nc:collaborators />\n\t\t\t\t\t".concat(extraProps, "\n\t\t\t\t</d:prop>\n\t\t\t</d:propfind>");
}
/**
 *
 * @param {string} path - Albums' root path.
 * @param {import('webdav').StatOptions} options - Options to forward to the webdav client.
 * @param {string} extraProps - Extra properties to add to the DAV request.
 * @param {import('webdav').WebDAVClient} client - The DAV client to use.
 * @return {Promise<Album|null>}
 */


function fetchAlbum(_x, _x2) {
  return _fetchAlbum.apply(this, arguments);
}
/**
 *
 * @param {string} path - Albums' root path.
 * @param {import('webdav').StatOptions} options - Options to forward to the webdav client.
 * @param {string} extraProps - Extra properties to add to the DAV request.
 * @param {import('webdav').WebDAVClient} client - The DAV client to use.
 * @return {Promise<Album[]>}
 */

function _fetchAlbum() {
  _fetchAlbum = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(path, options) {
    var extraProps,
        client,
        response,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            extraProps = _args.length > 2 && _args[2] !== undefined ? _args[2] : '';
            client = _args.length > 3 && _args[3] !== undefined ? _args[3] : _services_DavClient_js__WEBPACK_IMPORTED_MODULE_2__["default"];
            _context.prev = 2;
            _context.next = 5;
            return client.stat(path, _objectSpread({
              data: getDavRequest(extraProps),
              details: true
            }, options));

          case 5:
            response = _context.sent;
            _services_logger_js__WEBPACK_IMPORTED_MODULE_3__["default"].debug('[Albums] Fetched an album: ', {
              data: response.data
            });
            return _context.abrupt("return", formatAlbum(response.data));

          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](2);

            if (!(_context.t0.code === 'ERR_CANCELED')) {
              _context.next = 14;
              break;
            }

            return _context.abrupt("return", null);

          case 14:
            throw _context.t0;

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[2, 10]]);
  }));
  return _fetchAlbum.apply(this, arguments);
}

function fetchAlbums(_x3, _x4) {
  return _fetchAlbums.apply(this, arguments);
}
/**
 *
 * @param {object} album - An album received from a webdav request.
 * @return {Album}
 */

function _fetchAlbums() {
  _fetchAlbums = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(path, options) {
    var extraProps,
        client,
        response,
        _args2 = arguments;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            extraProps = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : '';
            client = _args2.length > 3 && _args2[3] !== undefined ? _args2[3] : _services_DavClient_js__WEBPACK_IMPORTED_MODULE_2__["default"];
            _context2.prev = 2;
            _context2.next = 5;
            return client.getDirectoryContents(path, _objectSpread({
              data: getDavRequest(extraProps),
              details: true
            }, options));

          case 5:
            response = _context2.sent;
            _services_logger_js__WEBPACK_IMPORTED_MODULE_3__["default"].debug("[Albums] Fetched ".concat(response.data.length, " albums: "), {
              data: response.data
            });
            return _context2.abrupt("return", response.data.filter(function (album) {
              return album.filename !== path;
            }).map(formatAlbum));

          case 10:
            _context2.prev = 10;
            _context2.t0 = _context2["catch"](2);

            if (!(_context2.t0.code === 'ERR_CANCELED')) {
              _context2.next = 14;
              break;
            }

            return _context2.abrupt("return", []);

          case 14:
            throw _context2.t0;

          case 15:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[2, 10]]);
  }));
  return _fetchAlbums.apply(this, arguments);
}

function formatAlbum(album) {
  var _album$dateRange$repl, _album$dateRange;

  // Ensure that we have a proper collaborators array.
  if (album.props.collaborators === '') {
    album.props.collaborators = [];
  } else if (_typeof(album.props.collaborators.collaborator) === 'object') {
    if (Array.isArray(album.props.collaborators.collaborator)) {
      album.props.collaborators = album.props.collaborators.collaborator;
    } else {
      album.props.collaborators = [album.props.collaborators.collaborator];
    }
  } // Extract custom props.


  album = (0,_utils_fileUtils_js__WEBPACK_IMPORTED_MODULE_5__.genFileInfo)(album); // Compute date range label.

  var dateRange = JSON.parse((_album$dateRange$repl = (_album$dateRange = album.dateRange) === null || _album$dateRange === void 0 ? void 0 : _album$dateRange.replace(/&quot;/g, '"')) !== null && _album$dateRange$repl !== void 0 ? _album$dateRange$repl : '{}');

  if (dateRange.start === null) {
    dateRange.start = _nextcloud_moment__WEBPACK_IMPORTED_MODULE_0___default()().unix();
    dateRange.end = _nextcloud_moment__WEBPACK_IMPORTED_MODULE_0___default()().unix();
  }

  var dateRangeFormatted = {
    startDate: _nextcloud_moment__WEBPACK_IMPORTED_MODULE_0___default().unix(dateRange.start).format('MMMM YYYY'),
    endDate: _nextcloud_moment__WEBPACK_IMPORTED_MODULE_0___default().unix(dateRange.end).format('MMMM YYYY')
  };

  if (dateRangeFormatted.startDate === dateRangeFormatted.endDate) {
    album.date = dateRangeFormatted.startDate;
  } else {
    album.date = (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_1__.translate)('photos', '{startDate} to {endDate}', dateRangeFormatted);
  }

  return album;
}
/**
 *
 * @param {string} path - Albums' root path.
 * @param {import('webdav').StatOptions} options - Options to forward to the webdav client.
 * @param {import('webdav').WebDAVClient} client - The DAV client to use.
 * @return {Promise<Array>}
 */


function fetchAlbumContent(_x5, _x6) {
  return _fetchAlbumContent.apply(this, arguments);
}

function _fetchAlbumContent() {
  _fetchAlbumContent = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(path, options) {
    var client,
        response,
        fetchedFiles,
        _args3 = arguments;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            client = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : _services_DavClient_js__WEBPACK_IMPORTED_MODULE_2__["default"];
            _context3.prev = 1;
            _context3.next = 4;
            return client.getDirectoryContents(path, _objectSpread({
              data: _services_DavRequest_js__WEBPACK_IMPORTED_MODULE_4__["default"],
              details: true
            }, options));

          case 4:
            response = _context3.sent;
            fetchedFiles = response.data.map(function (file) {
              return (0,_utils_fileUtils_js__WEBPACK_IMPORTED_MODULE_5__.genFileInfo)(file);
            }).filter(function (file) {
              return file.fileid;
            });
            _services_logger_js__WEBPACK_IMPORTED_MODULE_3__["default"].debug("[Albums] Fetched ".concat(fetchedFiles.length, " new files: "), fetchedFiles);
            return _context3.abrupt("return", fetchedFiles);

          case 10:
            _context3.prev = 10;
            _context3.t0 = _context3["catch"](1);

            if (!(_context3.t0.code === 'ERR_CANCELED')) {
              _context3.next = 14;
              break;
            }

            return _context3.abrupt("return", []);

          case 14:
            _services_logger_js__WEBPACK_IMPORTED_MODULE_3__["default"].error('Error fetching album files', {
              error: _context3.t0
            });
            console.error(_context3.t0);
            throw _context3.t0;

          case 17:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[1, 10]]);
  }));
  return _fetchAlbumContent.apply(this, arguments);
}

/***/ })

}]);
//# sourceMappingURL=photos-src_services_Albums_js.js.map?v=e32aa3742969f968a380