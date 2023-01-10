"use strict";
(self["webpackChunkphotos"] = self["webpackChunkphotos"] || []).push([["src_components_FaceCover_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FaceCover.vue?vue&type=script&lang=js&":
/*!*******************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FaceCover.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/router */ "./node_modules/@nextcloud/router/dist/index.js");
/* harmony import */ var _mixins_FetchFacesMixin_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../mixins/FetchFacesMixin.js */ "./src/mixins/FetchFacesMixin.js");
/* harmony import */ var _mixins_FaceCoverMixin_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../mixins/FaceCoverMixin.js */ "./src/mixins/FaceCoverMixin.js");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'FaceCover',
  mixins: [_mixins_FetchFacesMixin_js__WEBPACK_IMPORTED_MODULE_1__["default"], _mixins_FaceCoverMixin_js__WEBPACK_IMPORTED_MODULE_2__["default"]],
  props: {
    baseName: {
      type: String,
      required: true
    },
    small: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      observer: null
    };
  },
  computed: _objectSpread(_objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_3__.mapGetters)(['files', 'faces', 'facesFiles'])), {}, {
    /**
     * @return {Face}
     */
    face: function face() {
      return this.faces[this.baseName];
    },

    /**
     * @return {string}
     */
    coverUrl: function coverUrl() {
      if (!this.cover) {
        return '';
      }

      return (0,_nextcloud_router__WEBPACK_IMPORTED_MODULE_0__.generateUrl)("/apps/photos/api/v1/preview/".concat(this.cover.fileid, "?x=", 512, "&y=", 512));
    },
    cover: function cover() {
      return this.getFaceCover(this.face.basename);
    },
    coverDimensions: function coverDimensions() {
      if (!this.cover) return {};
      return this.getCoverStyle(this.face.basename);
    }
  }),
  mounted: function mounted() {
    var _this = this;

    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _this.waitForVisible(_this.$el, function (isVisible) {
                if (!_this.facesFiles[_this.face.basename]) {
                  _this.fetchFiles();
                }
              });

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  },
  beforeDestroy: function beforeDestroy() {
    this.observer.disconnect();
  },
  methods: {
    fetchFiles: function fetchFiles() {
      var _this2 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return _this2.fetchFaceContent(_this2.face.basename);

              case 2:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }))();
    },
    waitForVisible: function waitForVisible(el, listener) {
      this.observer = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.intersectionRatio > 0) {
            listener();
            observer.disconnect();
          }
        });
      });
      this.observer.observe(el);
    }
  }
});

/***/ }),

/***/ "./src/mixins/AbortControllerMixin.js":
/*!********************************************!*\
  !*** ./src/mixins/AbortControllerMixin.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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
  name: 'AbortControllerMixin',
  data: function data() {
    return {
      abortController: new AbortController()
    };
  },
  beforeDestroy: function beforeDestroy() {
    this.abortController.abort();
  },
  beforeRouteLeave: function beforeRouteLeave(from, to, next) {
    this.abortController.abort();
    this.abortController = new AbortController();
    next();
  }
});

/***/ }),

/***/ "./src/mixins/FaceCoverMixin.js":
/*!**************************************!*\
  !*** ./src/mixins/FaceCoverMixin.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
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
  computed: _objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_0__.mapGetters)(['faces', 'facesFiles', 'files'])),
  methods: {
    getFaceCover: function getFaceCover(faceName) {
      var _this = this;

      // Give high scores for faces that intersect with the edge of the picture (with a margin of half the face size)
      var scoreFacePosition = function scoreFacePosition(faceDetection) {
        return Math.max(0, -1 * (faceDetection.x - faceDetection.width * 0.5)) + Math.max(0, -1 * (faceDetection.y - faceDetection.height * 0.5)) + Math.max(0, -1 * (1 - (faceDetection.x + faceDetection.width) - faceDetection.width * 0.5)) + Math.max(0, -1 * (1 - (faceDetection.y + faceDetection.height) - faceDetection.height * 0.5));
      };

      return (this.facesFiles[faceName] || []).slice(0, 25).map(function (fileId) {
        return _this.files[fileId];
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
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/dialogs */ "./node_modules/@nextcloud/dialogs/dist/index.es.js");
/* harmony import */ var _nextcloud_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/auth */ "./node_modules/@nextcloud/auth/dist/index.esm.js");
/* harmony import */ var _services_DavClient_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/DavClient.js */ "./src/services/DavClient.js");
/* harmony import */ var _services_logger_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/logger.js */ "./src/services/logger.js");
/* harmony import */ var _services_DavRequest__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../services/DavRequest */ "./src/services/DavRequest.js");
/* harmony import */ var _utils_fileUtils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/fileUtils */ "./src/utils/fileUtils.js");
/* harmony import */ var _AbortControllerMixin__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./AbortControllerMixin */ "./src/mixins/AbortControllerMixin.js");
/* harmony import */ var he__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! he */ "./node_modules/he/he.js");
/* harmony import */ var he__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(he__WEBPACK_IMPORTED_MODULE_7__);
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
  computed: _objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_8__.mapGetters)(['faces'])),
  methods: _objectSpread(_objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_8__.mapActions)(['appendFiles'])), {}, {
    fetchFaces: function fetchFaces() {
      var _this2 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var _getCurrentUser, _yield$client$getDire, faces;

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
                  data: _services_DavRequest__WEBPACK_IMPORTED_MODULE_4__["default"],
                  details: true,
                  signal: _this2.abortController.signal
                });

              case 9:
                _yield$client$getDire = _context2.sent;
                faces = _yield$client$getDire.data;

                _this2.$store.dispatch('addFaces', {
                  faces: faces
                });

                _services_logger_js__WEBPACK_IMPORTED_MODULE_3__["default"].debug("[FetchFacesMixin] Fetched ".concat(faces.length, " new faces: "), faces);
                _context2.next = 20;
                break;

              case 15:
                _context2.prev = 15;
                _context2.t0 = _context2["catch"](4);

                if (_context2.t0.response && _context2.t0.response.status) {
                  if (_context2.t0.response.status === 404) {
                    _this2.errorFetchingFaces = 404;
                  } else {
                    _this2.errorFetchingFaces = _context2.t0;
                  }
                }

                _services_logger_js__WEBPACK_IMPORTED_MODULE_3__["default"].error(t('photos', 'Failed to fetch faces list.'), {
                  error: _context2.t0
                });
                (0,_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_0__.showError)(t('photos', 'Failed to fetch faces list.'));

              case 20:
                _context2.prev = 20;
                _this2.loadingFaces = false;
                return _context2.finish(20);

              case 23:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[4, 15, 20, 23]]);
      }))();
    },
    fetchFaceContent: function fetchFaceContent(faceName, force) {
      var _this3 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var _getCurrentUser2, _yield$client$getDire2, fetchedFiles, fileIds;

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
                _yield$client$getDire2 = _context3.sent;
                fetchedFiles = _yield$client$getDire2.data;
                fetchedFiles = fetchedFiles.map(function (file) {
                  return (0,_utils_fileUtils__WEBPACK_IMPORTED_MODULE_5__.genFileInfo)(file);
                }).map(function (file) {
                  return _objectSpread(_objectSpread({}, file), {}, {
                    filename: file.realpath.replace("/".concat((0,_nextcloud_auth__WEBPACK_IMPORTED_MODULE_1__.getCurrentUser)().uid, "/files"), "/files/".concat((0,_nextcloud_auth__WEBPACK_IMPORTED_MODULE_1__.getCurrentUser)().uid))
                  });
                }).map(function (file) {
                  return _objectSpread(_objectSpread({}, file), {}, {
                    faceDetections: JSON.parse(he__WEBPACK_IMPORTED_MODULE_7___default().decode(file.faceDetections))
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


                _services_logger_js__WEBPACK_IMPORTED_MODULE_3__["default"].error('Error fetching face files', {
                  error: _context3.t0
                });

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

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FaceCover.vue?vue&type=style&index=0&id=acc68b4c&lang=scss&scoped=true&":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FaceCover.vue?vue&type=style&index=0&id=acc68b4c&lang=scss&scoped=true& ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "./node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".face-cover[data-v-acc68b4c] {\n  display: flex;\n  flex-direction: column;\n  padding: 10px;\n  border-radius: var(--border-radius-large);\n}\n.face-cover__crop-container[data-v-acc68b4c] {\n  overflow: hidden;\n  width: 250px;\n  height: 250px;\n  border-radius: 250px;\n  position: relative;\n  background: var(--color-background-darker);\n  --photos-face-width: 250px;\n}\n@media only screen and (max-width: 1020px) {\n.face-cover__crop-container[data-v-acc68b4c] {\n    width: 95px;\n    height: 95px;\n    --photos-face-width: 95px;\n}\n}\n.face-cover[data-v-acc68b4c]:hover, .face-cover[data-v-acc68b4c]:focus {\n  background: var(--color-background-hover);\n}\n.face-cover__details[data-v-acc68b4c] {\n  display: flex;\n  flex-direction: column;\n  width: 250px;\n  margin-top: 4px;\n  text-align: center;\n}\n@media only screen and (max-width: 1020px) {\n.face-cover__details[data-v-acc68b4c] {\n    width: 95px;\n}\n}\n.face-cover__details__first-line[data-v-acc68b4c] {\n  display: flex;\n  height: 2em;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.face-cover__details__second-line[data-v-acc68b4c] {\n  margin-top: 6px;\n  color: var(--color-text-maxcontrast);\n}\n.face-cover__details__name[data-v-acc68b4c] {\n  flex-grow: 1;\n  margin: 0;\n}\n.face-cover--small *[data-v-acc68b4c] {\n  font-size: 15px !important;\n}\n.face-cover--small .face-cover__details[data-v-acc68b4c] {\n  width: 60px !important;\n}\n.face-cover--small .face-cover__crop-container[data-v-acc68b4c] {\n  width: 60px !important;\n  height: 60px !important;\n  --photos-face-width: 60px !important;\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FaceCover.vue?vue&type=style&index=0&id=acc68b4c&lang=scss&scoped=true&":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FaceCover.vue?vue&type=style&index=0&id=acc68b4c&lang=scss&scoped=true& ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceCover_vue_vue_type_style_index_0_id_acc68b4c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FaceCover.vue?vue&type=style&index=0&id=acc68b4c&lang=scss&scoped=true& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FaceCover.vue?vue&type=style&index=0&id=acc68b4c&lang=scss&scoped=true&");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceCover_vue_vue_type_style_index_0_id_acc68b4c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceCover_vue_vue_type_style_index_0_id_acc68b4c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceCover_vue_vue_type_style_index_0_id_acc68b4c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceCover_vue_vue_type_style_index_0_id_acc68b4c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/components/FaceCover.vue":
/*!**************************************!*\
  !*** ./src/components/FaceCover.vue ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _FaceCover_vue_vue_type_template_id_acc68b4c_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FaceCover.vue?vue&type=template&id=acc68b4c&scoped=true& */ "./src/components/FaceCover.vue?vue&type=template&id=acc68b4c&scoped=true&");
/* harmony import */ var _FaceCover_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FaceCover.vue?vue&type=script&lang=js& */ "./src/components/FaceCover.vue?vue&type=script&lang=js&");
/* harmony import */ var _FaceCover_vue_vue_type_style_index_0_id_acc68b4c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FaceCover.vue?vue&type=style&index=0&id=acc68b4c&lang=scss&scoped=true& */ "./src/components/FaceCover.vue?vue&type=style&index=0&id=acc68b4c&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _FaceCover_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _FaceCover_vue_vue_type_template_id_acc68b4c_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render,
  _FaceCover_vue_vue_type_template_id_acc68b4c_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "acc68b4c",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/components/FaceCover.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/components/FaceCover.vue?vue&type=script&lang=js&":
/*!***************************************************************!*\
  !*** ./src/components/FaceCover.vue?vue&type=script&lang=js& ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceCover_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FaceCover.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FaceCover.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceCover_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/components/FaceCover.vue?vue&type=style&index=0&id=acc68b4c&lang=scss&scoped=true&":
/*!************************************************************************************************!*\
  !*** ./src/components/FaceCover.vue?vue&type=style&index=0&id=acc68b4c&lang=scss&scoped=true& ***!
  \************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceCover_vue_vue_type_style_index_0_id_acc68b4c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/style-loader/dist/cjs.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FaceCover.vue?vue&type=style&index=0&id=acc68b4c&lang=scss&scoped=true& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FaceCover.vue?vue&type=style&index=0&id=acc68b4c&lang=scss&scoped=true&");


/***/ }),

/***/ "./src/components/FaceCover.vue?vue&type=template&id=acc68b4c&scoped=true&":
/*!*********************************************************************************!*\
  !*** ./src/components/FaceCover.vue?vue&type=template&id=acc68b4c&scoped=true& ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceCover_vue_vue_type_template_id_acc68b4c_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceCover_vue_vue_type_template_id_acc68b4c_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceCover_vue_vue_type_template_id_acc68b4c_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FaceCover.vue?vue&type=template&id=acc68b4c&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FaceCover.vue?vue&type=template&id=acc68b4c&scoped=true&");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FaceCover.vue?vue&type=template&id=acc68b4c&scoped=true&":
/*!************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FaceCover.vue?vue&type=template&id=acc68b4c&scoped=true& ***!
  \************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      class: ["face-cover", _vm.small && "face-cover--small"],
      on: {
        click: function ($event) {
          return _vm.$emit("click")
        },
      },
    },
    [
      _c("div", { staticClass: "face-cover__crop-container" }, [
        _c("img", {
          ref: "image",
          staticClass: "face-cover__image",
          style: _vm.coverDimensions,
          attrs: { src: _vm.coverUrl },
        }),
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "face-cover__details" }, [
        !_vm.baseName.match(/^[0-9]+$/)
          ? _c("div", { staticClass: "face-cover__details__first-line" }, [
              _c("h2", { staticClass: "face-cover__details__name" }, [
                _vm._v("\n\t\t\t\t" + _vm._s(_vm.baseName) + "\n\t\t\t"),
              ]),
            ])
          : _vm._e(),
        _vm._v(" "),
        _vm.facesFiles[_vm.baseName] && !_vm.small
          ? _c("div", { staticClass: "face-cover__details__second-line" }, [
              _vm._v(
                "\n\t\t\t" +
                  _vm._s(
                    _vm.n(
                      "photos",
                      "%n photos",
                      "%n photos",
                      _vm.facesFiles[_vm.baseName].length
                    )
                  ) +
                  "\n\t\t"
              ),
            ])
          : _vm._e(),
      ]),
    ]
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ })

}]);
//# sourceMappingURL=photos-src_components_FaceCover_vue.js.map?v=d1dae6def2eafbbdf0ca