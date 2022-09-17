"use strict";
(self["webpackChunkphotos"] = self["webpackChunkphotos"] || []).push([["src_mixins_FaceCoverMixin_js-src_mixins_FetchFacesMixin_js"],{

/***/ "./src/mixins/FaceCoverMixin.js":
/*!**************************************!*\
  !*** ./src/mixins/FaceCoverMixin.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var he__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! he */ "./node_modules/he/he.js");
/* harmony import */ var he__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(he__WEBPACK_IMPORTED_MODULE_0__);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @copyright Copyright (c) 2022 Marcel Klehr <mklehr@gmx.net>
 *
 * @author Marcel Klehr <mklehr@gmx.net>
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
  name: 'FaceCoverMixin',
  computed: _objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_1__.mapGetters)(['faces', 'facesFiles', 'files'])),
  methods: {
    getFaceCover: function getFaceCover(faceName) {
      var _this = this;

      // Give high scores for faces that intersect with the edge of the picture (with a margin of half the face size)
      var scoreFacePosition = function scoreFacePosition(faceDetection) {
        return Math.max(0, -1 * (faceDetection.x - faceDetection.width * 0.5)) + Math.max(0, -1 * (faceDetection.y - faceDetection.height * 0.5)) + Math.max(0, -1 * (1 - (faceDetection.x + faceDetection.width) - faceDetection.width * 0.5)) + Math.max(0, -1 * (1 - (faceDetection.y + faceDetection.height) - faceDetection.height * 0.5));
      };

      return (this.facesFiles[faceName] || []).slice(0, 25).map(function (fileId) {
        return _this.files[fileId];
      }).map(function (file) {
        return _objectSpread(_objectSpread({}, file), {}, {
          faceDetections: JSON.parse(he__WEBPACK_IMPORTED_MODULE_0___default().decode(file.faceDetections))
        });
      }) // sort larges face first
      .sort(function (a, b) {
        return b.faceDetections.find(function (d) {
          return d.title === faceName;
        }).width - a.faceDetections.find(function (d) {
          return d.title === faceName;
        }).width;
      }) // sort fewest face detections first
      .sort(function (a, b) {
        return a.faceDetections.length - b.faceDetections.length;
      }) // Sort faces that are at the edge last
      .sort(function (a, b) {
        return scoreFacePosition(a.faceDetections.find(function (d) {
          return d.title === faceName;
        })) - scoreFacePosition(b.faceDetections.find(function (d) {
          return d.title === faceName;
        }));
      })[0];
    },

    /**
     * This will produce an inline style to apply to images
     * to zoom toward the detected face
     *
     * @param faceName
     * @return {{}|{transform: string, width: string, transformOrigin: string}}
     */
    getCoverStyle: function getCoverStyle(faceName) {
      var cover = this.getFaceCover(faceName);

      if (!cover) {
        return {};
      }

      var detections = cover.faceDetections;
      var detection = detections.find(function (detection) {
        return detection.title === faceName;
      }); // Zoom into the picture so that the face fills the --photos-face-width box nicely
      // if the face is larger than the image, we don't zoom out (reason for the Math.max)

      var zoom = Math.max(1, 1 / detection.width * 0.4);
      var horizontalCenterOfFace = (detection.x + detection.width / 2) * 100;
      var verticalCenterOfFace = (detection.y + detection.height / 2) * 100;
      return {
        // We assume that the image is inside a div with width: var(--photos-face-width)
        width: '100%',
        // we translate the image so that the center of the detected face is in the center of the --photos-face-width box
        // and add the zoom
        transform: "translate(calc( var(--photos-face-width)/2 - ".concat(horizontalCenterOfFace, "% ), calc( var(--photos-face-width)/2 - ").concat(verticalCenterOfFace, "% )) scale(").concat(zoom, ")"),
        // this is necessary for the zoom to zoom toward the center of the face
        transformOrigin: "".concat(horizontalCenterOfFace, "% ").concat(verticalCenterOfFace, "%")
      };
    }
  }
});

/***/ }),

/***/ "./src/mixins/FetchFacesMixin.js":
/*!***************************************!*\
  !*** ./src/mixins/FetchFacesMixin.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/dialogs */ "./node_modules/@nextcloud/dialogs/dist/index.es.js");
/* harmony import */ var _nextcloud_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/auth */ "./node_modules/@nextcloud/auth/dist/index.esm.js");
/* harmony import */ var _services_DavClient_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/DavClient.js */ "./src/services/DavClient.js");
/* harmony import */ var _services_logger_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/logger.js */ "./src/services/logger.js");
/* harmony import */ var _services_DavRequest__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../services/DavRequest */ "./src/services/DavRequest.js");
/* harmony import */ var _utils_fileUtils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/fileUtils */ "./src/utils/fileUtils.js");
/* harmony import */ var _AbortControllerMixin__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./AbortControllerMixin */ "./src/mixins/AbortControllerMixin.js");
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
  name: 'FetchFacesMixin',
  data: function data() {
    return {
      errorFetchingFaces: null,
      loadingFaces: false,
      errorFetchingFiles: null,
      loadingFiles: false
    };
  },
  mixins: [_AbortControllerMixin__WEBPACK_IMPORTED_MODULE_6__["default"]],
  beforeMount: function beforeMount() {
    var _this = this;

    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _this.fetchFaces();

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  },
  computed: _objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_7__.mapGetters)(['faces'])),
  methods: _objectSpread(_objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_7__.mapActions)(['appendFiles'])), {}, {
    fetchFaces: function fetchFaces() {
      var _this2 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var _getCurrentUser, faces;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!_this2.loadingFaces) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt("return");

              case 2:
                if (!Object.keys(_this2.faces).length) {
                  _context2.next = 4;
                  break;
                }

                return _context2.abrupt("return");

              case 4:
                _context2.prev = 4;
                _this2.loadingFaces = true;
                _this2.errorFetchingFaces = null;
                _context2.next = 9;
                return _services_DavClient_js__WEBPACK_IMPORTED_MODULE_2__["default"].getDirectoryContents("/recognize/".concat((_getCurrentUser = (0,_nextcloud_auth__WEBPACK_IMPORTED_MODULE_1__.getCurrentUser)()) === null || _getCurrentUser === void 0 ? void 0 : _getCurrentUser.uid, "/faces/"), {
                  signal: _this2.abortController.signal
                });

              case 9:
                faces = _context2.sent;

                _this2.$store.dispatch('addFaces', {
                  faces: faces
                });

                _services_logger_js__WEBPACK_IMPORTED_MODULE_3__["default"].debug("[FetchFacesMixin] Fetched ".concat(faces.length, " new faces: "), faces);
                _context2.next = 19;
                break;

              case 14:
                _context2.prev = 14;
                _context2.t0 = _context2["catch"](4);

                if (_context2.t0.response && _context2.t0.response.status) {
                  if (_context2.t0.response.status === 404) {
                    _this2.errorFetchingFaces = 404;
                  } else {
                    _this2.errorFetchingFaces = _context2.t0;
                  }
                }

                _services_logger_js__WEBPACK_IMPORTED_MODULE_3__["default"].error(t('photos', 'Failed to fetch faces list.'), _context2.t0);
                (0,_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_0__.showError)(t('photos', 'Failed to fetch faces list.'));

              case 19:
                _context2.prev = 19;
                _this2.loadingFaces = false;
                return _context2.finish(19);

              case 22:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[4, 14, 19, 22]]);
      }))();
    },
    fetchFaceContent: function fetchFaceContent(faceName, force) {
      var _this3 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var _getCurrentUser2, _yield$client$getDire, fetchedFiles, fileIds;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!_this3.loadingFiles) {
                  _context3.next = 2;
                  break;
                }

                return _context3.abrupt("return");

              case 2:
                if (!(!force && _this3.facesFiles[faceName] && _this3.facesFiles[faceName].length)) {
                  _context3.next = 4;
                  break;
                }

                return _context3.abrupt("return");

              case 4:
                _context3.prev = 4;
                _this3.errorFetchingFiles = null;
                _this3.loadingFiles = true;
                _context3.next = 9;
                return _services_DavClient_js__WEBPACK_IMPORTED_MODULE_2__["default"].getDirectoryContents("/recognize/".concat((_getCurrentUser2 = (0,_nextcloud_auth__WEBPACK_IMPORTED_MODULE_1__.getCurrentUser)()) === null || _getCurrentUser2 === void 0 ? void 0 : _getCurrentUser2.uid, "/faces/").concat(faceName), {
                  data: _services_DavRequest__WEBPACK_IMPORTED_MODULE_4__["default"],
                  details: true,
                  signal: _this3.abortController.signal
                });

              case 9:
                _yield$client$getDire = _context3.sent;
                fetchedFiles = _yield$client$getDire.data;
                fetchedFiles = fetchedFiles.map(function (file) {
                  return (0,_utils_fileUtils__WEBPACK_IMPORTED_MODULE_5__.genFileInfo)(file);
                }).map(function (file) {
                  return _objectSpread(_objectSpread({}, file), {}, {
                    filename: file.realpath.replace("/".concat((0,_nextcloud_auth__WEBPACK_IMPORTED_MODULE_1__.getCurrentUser)().uid, "/files"), '')
                  });
                });
                fileIds = fetchedFiles.map(function (file) {
                  return '' + file.fileid;
                });

                _this3.appendFiles(fetchedFiles);

                if (!(fetchedFiles.length > 0)) {
                  _context3.next = 17;
                  break;
                }

                _context3.next = 17;
                return _this3.$store.commit('addFilesToFace', {
                  faceName: faceName,
                  fileIdsToAdd: fileIds
                });

              case 17:
                _services_logger_js__WEBPACK_IMPORTED_MODULE_3__["default"].debug("[FetchFacesMixin] Fetched ".concat(fileIds.length, " new files: "), fileIds);
                _context3.next = 24;
                break;

              case 20:
                _context3.prev = 20;
                _context3.t0 = _context3["catch"](4);

                if (_context3.t0.response && _context3.t0.response.status) {
                  if (_context3.t0.response.status === 404) {
                    _this3.errorFetchingFiles = 404;
                  } else {
                    _this3.errorFetchingFiles = _context3.t0;
                  }
                } // cancelled request, moving on...


                _services_logger_js__WEBPACK_IMPORTED_MODULE_3__["default"].error('Error fetching face files', _context3.t0);

              case 24:
                _context3.prev = 24;
                _this3.loadingFiles = false;
                return _context3.finish(24);

              case 27:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[4, 20, 24, 27]]);
      }))();
    }
  })
});

/***/ })

}]);
//# sourceMappingURL=photos-src_mixins_FaceCoverMixin_js-src_mixins_FetchFacesMixin_js.js.map?v=32ecf436be4947895a5d