"use strict";
(self["webpackChunkphotos"] = self["webpackChunkphotos"] || []).push([["src_views_SharedAlbumContent_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/SharedAlbumContent.vue?vue&type=script&lang=js&":
/*!***********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/SharedAlbumContent.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var vue_material_design_icons_MapMarker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue-material-design-icons/MapMarker */ "./node_modules/vue-material-design-icons/MapMarker.vue");
/* harmony import */ var vue_material_design_icons_Plus__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-material-design-icons/Plus */ "./node_modules/vue-material-design-icons/Plus.vue");
/* harmony import */ var vue_material_design_icons_Delete__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vue-material-design-icons/Delete */ "./node_modules/vue-material-design-icons/Delete.vue");
/* harmony import */ var vue_material_design_icons_ImagePlus__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! vue-material-design-icons/ImagePlus */ "./node_modules/vue-material-design-icons/ImagePlus.vue");
/* harmony import */ var vue_material_design_icons_Close__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! vue-material-design-icons/Close */ "./node_modules/vue-material-design-icons/Close.vue");
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @nextcloud/vue */ "./node_modules/@nextcloud/vue/dist/ncvuecomponents.js");
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_vue__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _nextcloud_auth__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @nextcloud/auth */ "./node_modules/@nextcloud/auth/dist/index.esm.js");
/* harmony import */ var _mixins_FetchSharedAlbumsMixin_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../mixins/FetchSharedAlbumsMixin.js */ "./src/mixins/FetchSharedAlbumsMixin.js");
/* harmony import */ var _mixins_FetchFilesMixin_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../mixins/FetchFilesMixin.js */ "./src/mixins/FetchFilesMixin.js");
/* harmony import */ var _mixins_AbortControllerMixin_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../mixins/AbortControllerMixin.js */ "./src/mixins/AbortControllerMixin.js");
/* harmony import */ var _components_Collection_CollectionContent_vue__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../components/Collection/CollectionContent.vue */ "./src/components/Collection/CollectionContent.vue");
/* harmony import */ var _components_HeaderNavigation_vue__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../components/HeaderNavigation.vue */ "./src/components/HeaderNavigation.vue");
/* harmony import */ var _components_FilesPicker_vue__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../components/FilesPicker.vue */ "./src/components/FilesPicker.vue");
/* harmony import */ var _services_logger_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../services/logger.js */ "./src/services/logger.js");
/* harmony import */ var _services_DavClient_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../services/DavClient.js */ "./src/services/DavClient.js");
/* harmony import */ var _services_DavRequest_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../services/DavRequest.js */ "./src/services/DavRequest.js");
/* harmony import */ var _utils_fileUtils_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../utils/fileUtils.js */ "./src/utils/fileUtils.js");
/* harmony import */ var _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @nextcloud/l10n */ "./node_modules/@nextcloud/l10n/dist/index.js");
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





 // import Download from 'vue-material-design-icons/Download'
// import DownloadMultiple from 'vue-material-design-icons/DownloadMultiple'







 // import ActionDownload from '../components/Actions/ActionDownload.vue'







/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'SharedAlbumContent',
  components: {
    MapMarker: vue_material_design_icons_MapMarker__WEBPACK_IMPORTED_MODULE_0__["default"],
    Plus: vue_material_design_icons_Plus__WEBPACK_IMPORTED_MODULE_1__["default"],
    Close: vue_material_design_icons_Close__WEBPACK_IMPORTED_MODULE_4__["default"],
    // Download,
    // DownloadMultiple,
    Delete: vue_material_design_icons_Delete__WEBPACK_IMPORTED_MODULE_2__["default"],
    ImagePlus: vue_material_design_icons_ImagePlus__WEBPACK_IMPORTED_MODULE_3__["default"],
    NcEmptyContent: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_5__.NcEmptyContent,
    NcActions: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_5__.NcActions,
    NcActionButton: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_5__.NcActionButton,
    NcActionSeparator: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_5__.NcActionSeparator,
    NcButton: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_5__.NcButton,
    NcModal: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_5__.NcModal,
    NcUserBubble: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_5__.NcUserBubble,
    CollectionContent: _components_Collection_CollectionContent_vue__WEBPACK_IMPORTED_MODULE_10__["default"],
    // ActionDownload,
    FilesPicker: _components_FilesPicker_vue__WEBPACK_IMPORTED_MODULE_12__["default"],
    HeaderNavigation: _components_HeaderNavigation_vue__WEBPACK_IMPORTED_MODULE_11__["default"]
  },
  mixins: [_mixins_FetchSharedAlbumsMixin_js__WEBPACK_IMPORTED_MODULE_7__["default"], _mixins_FetchFilesMixin_js__WEBPACK_IMPORTED_MODULE_8__["default"], _mixins_AbortControllerMixin_js__WEBPACK_IMPORTED_MODULE_9__["default"], _nextcloud_vue__WEBPACK_IMPORTED_MODULE_5__.isMobile],
  props: {
    albumName: {
      type: String,
      default: '/'
    }
  },
  data: function data() {
    return {
      showAddPhotosModal: false,
      loadingCount: 0,
      loadingAddFilesToAlbum: false
    };
  },
  computed: _objectSpread(_objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_18__.mapGetters)(['files', 'sharedAlbumsFiles'])), {}, {
    /**
     * @return {object} The album information for the current albumName.
     */
    album: function album() {
      return this.sharedAlbums[this.albumName] || {};
    },

    /**
     * @return {string[]} The list of files for the current albumName.
     */
    albumFileIds: function albumFileIds() {
      return this.sharedAlbumsFiles[this.albumName] || [];
    },

    /**
     * @return {string} The album name without the userId between parentheses.
     */
    albumOriginalName: function albumOriginalName() {
      return this.albumName.replace(new RegExp("\\(".concat(this.album.collaborators[0].id, "\\)$")), '');
    }
  }),
  watch: {
    album: function album() {
      this.fetchAlbumContent();
    }
  },
  methods: _objectSpread(_objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_18__.mapActions)(['appendFiles', 'deleteSharedAlbum', 'addFilesToSharedAlbum', 'removeFilesFromSharedAlbum'])), {}, {
    fetchAlbumContent: function fetchAlbumContent() {
      var _this = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var semaphoreSymbol, fetchSemaphoreSymbol, _getCurrentUser, response, fetchedFiles, fileIds, _error$response;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(_this.loadingFiles || _this.showEditAlbumForm)) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return", []);

              case 2:
                _context.next = 4;
                return _this.semaphore.acquire(function () {
                  return 0;
                }, 'fetchFiles');

              case 4:
                semaphoreSymbol = _context.sent;
                _context.next = 7;
                return _this.fetchSemaphore.acquire();

              case 7:
                fetchSemaphoreSymbol = _context.sent;
                _context.prev = 8;
                _this.errorFetchingFiles = null;
                _this.loadingFiles = true;
                _this.semaphoreSymbol = semaphoreSymbol;
                _context.next = 14;
                return _services_DavClient_js__WEBPACK_IMPORTED_MODULE_14__["default"].getDirectoryContents("/photos/".concat((_getCurrentUser = (0,_nextcloud_auth__WEBPACK_IMPORTED_MODULE_6__.getCurrentUser)()) === null || _getCurrentUser === void 0 ? void 0 : _getCurrentUser.uid, "/sharedalbums/").concat(_this.albumName), {
                  data: _services_DavRequest_js__WEBPACK_IMPORTED_MODULE_15__["default"],
                  details: true,
                  signal: _this.abortController.signal
                });

              case 14:
                response = _context.sent;
                fetchedFiles = response.data.map(function (file) {
                  return (0,_utils_fileUtils_js__WEBPACK_IMPORTED_MODULE_16__.genFileInfo)(file);
                });
                fileIds = fetchedFiles.map(function (file) {
                  return file.fileid;
                }).map(function (fileId) {
                  return fileId.toString();
                });

                _this.appendFiles(fetchedFiles);

                if (!(fetchedFiles.length > 0)) {
                  _context.next = 21;
                  break;
                }

                _context.next = 21;
                return _this.$store.commit('addFilesToSharedAlbum', {
                  albumName: _this.albumName,
                  fileIdsToAdd: fileIds
                });

              case 21:
                _services_logger_js__WEBPACK_IMPORTED_MODULE_13__["default"].debug("[SharedAlbumContent] Fetched ".concat(fileIds.length, " new files: "), fileIds);
                _context.next = 36;
                break;

              case 24:
                _context.prev = 24;
                _context.t0 = _context["catch"](8);

                if (!(((_error$response = _context.t0.response) === null || _error$response === void 0 ? void 0 : _error$response.status) === 404)) {
                  _context.next = 30;
                  break;
                }

                _this.errorFetchingFiles = 404;
                _context.next = 35;
                break;

              case 30:
                if (!(_context.t0.code === 'ERR_CANCELED')) {
                  _context.next = 34;
                  break;
                }

                return _context.abrupt("return");

              case 34:
                _this.errorFetchingFiles = _context.t0;

              case 35:
                // cancelled request, moving on...
                _services_logger_js__WEBPACK_IMPORTED_MODULE_13__["default"].error('[SharedAlbumContent] Error fetching album files', {
                  error: _context.t0
                });

              case 36:
                _context.prev = 36;
                _this.loadingFiles = false;

                _this.semaphore.release(semaphoreSymbol);

                _this.fetchSemaphore.release(fetchSemaphoreSymbol);

                return _context.finish(36);

              case 41:
                return _context.abrupt("return", []);

              case 42:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[8, 24, 36, 41]]);
      }))();
    },
    handleFilesPicked: function handleFilesPicked(fileIds) {
      var _this2 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _this2.showAddPhotosModal = false;
                _context2.next = 3;
                return _this2.addFilesToSharedAlbum({
                  albumName: _this2.albumName,
                  fileIdsToAdd: fileIds
                });

              case 3:
                _context2.next = 5;
                return _this2.fetchAlbumContent();

              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }))();
    },
    handleRemoveFilesFromAlbum: function handleRemoveFilesFromAlbum(fileIds) {
      var _this3 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _this3.$refs.collectionContent.onUncheckFiles(fileIds);

                _context3.next = 3;
                return _this3.removeFilesFromSharedAlbum({
                  albumName: _this3.albumName,
                  fileIdsToRemove: fileIds
                });

              case 3:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }))();
    },
    handleDeleteAlbum: function handleDeleteAlbum() {
      var _this4 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return _this4.deleteSharedAlbum({
                  albumName: _this4.albumName
                });

              case 2:
                _this4.$router.push('/sharedalbums');

              case 3:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }))();
    },
    t: _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_17__.translate
  })
});

/***/ }),

/***/ "./src/mixins/FetchSharedAlbumsMixin.js":
/*!**********************************************!*\
  !*** ./src/mixins/FetchSharedAlbumsMixin.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _nextcloud_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/auth */ "./node_modules/@nextcloud/auth/dist/index.esm.js");
/* harmony import */ var _AbortControllerMixin_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AbortControllerMixin.js */ "./src/mixins/AbortControllerMixin.js");
/* harmony import */ var _services_Albums_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/Albums.js */ "./src/services/Albums.js");
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
  name: 'FetchSharedAlbumsMixin',
  data: function data() {
    return {
      errorFetchingAlbums: null,
      loadingAlbums: false
    };
  },
  mixins: [_AbortControllerMixin_js__WEBPACK_IMPORTED_MODULE_1__["default"]],
  beforeMount: function beforeMount() {
    var _this = this;

    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _this.fetchAlbums();

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  },
  computed: _objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_3__.mapGetters)(['sharedAlbums'])),
  methods: _objectSpread(_objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_3__.mapActions)(['addSharedAlbums'])), {}, {
    fetchAlbums: function fetchAlbums() {
      var _this2 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var _getCurrentUser, albums, _error$response;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!_this2.loadingAlbums) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt("return");

              case 2:
                _context2.prev = 2;
                _this2.loadingAlbums = true;
                _this2.errorFetchingAlbums = null;
                _context2.next = 7;
                return (0,_services_Albums_js__WEBPACK_IMPORTED_MODULE_2__.fetchAlbums)("/photos/".concat((_getCurrentUser = (0,_nextcloud_auth__WEBPACK_IMPORTED_MODULE_0__.getCurrentUser)()) === null || _getCurrentUser === void 0 ? void 0 : _getCurrentUser.uid, "/sharedalbums"), _this2.abortController.signal);

              case 7:
                albums = _context2.sent;

                _this2.addSharedAlbums({
                  albums: albums
                });

                _context2.next = 14;
                break;

              case 11:
                _context2.prev = 11;
                _context2.t0 = _context2["catch"](2);

                if (((_error$response = _context2.t0.response) === null || _error$response === void 0 ? void 0 : _error$response.status) === 404) {
                  _this2.errorFetchingAlbums = 404;
                } else {
                  _this2.errorFetchingAlbums = _context2.t0;
                }

              case 14:
                _context2.prev = 14;
                _this2.loadingAlbums = false;
                return _context2.finish(14);

              case 17:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[2, 11, 14, 17]]);
      }))();
    }
  })
});

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/SharedAlbumContent.vue?vue&type=style&index=0&id=259e376e&lang=scss&scoped=true&":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/SharedAlbumContent.vue?vue&type=style&index=0&id=259e376e&lang=scss&scoped=true& ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, ".album[data-v-259e376e] {\n  display: flex;\n  flex-direction: column;\n}\n.album__title[data-v-259e376e] {\n  width: 100%;\n}\n.album__name[data-v-259e376e] {\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}\n.album__location[data-v-259e376e] {\n  margin-left: -4px;\n  display: flex;\n  color: var(--color-text-lighter);\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/SharedAlbumContent.vue?vue&type=style&index=0&id=259e376e&lang=scss&scoped=true&":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/SharedAlbumContent.vue?vue&type=style&index=0&id=259e376e&lang=scss&scoped=true& ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SharedAlbumContent_vue_vue_type_style_index_0_id_259e376e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./SharedAlbumContent.vue?vue&type=style&index=0&id=259e376e&lang=scss&scoped=true& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/SharedAlbumContent.vue?vue&type=style&index=0&id=259e376e&lang=scss&scoped=true&");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SharedAlbumContent_vue_vue_type_style_index_0_id_259e376e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SharedAlbumContent_vue_vue_type_style_index_0_id_259e376e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SharedAlbumContent_vue_vue_type_style_index_0_id_259e376e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SharedAlbumContent_vue_vue_type_style_index_0_id_259e376e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/views/SharedAlbumContent.vue":
/*!******************************************!*\
  !*** ./src/views/SharedAlbumContent.vue ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _SharedAlbumContent_vue_vue_type_template_id_259e376e_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SharedAlbumContent.vue?vue&type=template&id=259e376e&scoped=true& */ "./src/views/SharedAlbumContent.vue?vue&type=template&id=259e376e&scoped=true&");
/* harmony import */ var _SharedAlbumContent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SharedAlbumContent.vue?vue&type=script&lang=js& */ "./src/views/SharedAlbumContent.vue?vue&type=script&lang=js&");
/* harmony import */ var _SharedAlbumContent_vue_vue_type_style_index_0_id_259e376e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SharedAlbumContent.vue?vue&type=style&index=0&id=259e376e&lang=scss&scoped=true& */ "./src/views/SharedAlbumContent.vue?vue&type=style&index=0&id=259e376e&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _SharedAlbumContent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _SharedAlbumContent_vue_vue_type_template_id_259e376e_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render,
  _SharedAlbumContent_vue_vue_type_template_id_259e376e_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "259e376e",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/views/SharedAlbumContent.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/views/SharedAlbumContent.vue?vue&type=script&lang=js&":
/*!*******************************************************************!*\
  !*** ./src/views/SharedAlbumContent.vue?vue&type=script&lang=js& ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_SharedAlbumContent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./SharedAlbumContent.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/SharedAlbumContent.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_SharedAlbumContent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/views/SharedAlbumContent.vue?vue&type=style&index=0&id=259e376e&lang=scss&scoped=true&":
/*!****************************************************************************************************!*\
  !*** ./src/views/SharedAlbumContent.vue?vue&type=style&index=0&id=259e376e&lang=scss&scoped=true& ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SharedAlbumContent_vue_vue_type_style_index_0_id_259e376e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/style-loader/dist/cjs.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./SharedAlbumContent.vue?vue&type=style&index=0&id=259e376e&lang=scss&scoped=true& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/SharedAlbumContent.vue?vue&type=style&index=0&id=259e376e&lang=scss&scoped=true&");


/***/ }),

/***/ "./src/views/SharedAlbumContent.vue?vue&type=template&id=259e376e&scoped=true&":
/*!*************************************************************************************!*\
  !*** ./src/views/SharedAlbumContent.vue?vue&type=template&id=259e376e&scoped=true& ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SharedAlbumContent_vue_vue_type_template_id_259e376e_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SharedAlbumContent_vue_vue_type_template_id_259e376e_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SharedAlbumContent_vue_vue_type_template_id_259e376e_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./SharedAlbumContent.vue?vue&type=template&id=259e376e&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/SharedAlbumContent.vue?vue&type=template&id=259e376e&scoped=true&");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/SharedAlbumContent.vue?vue&type=template&id=259e376e&scoped=true&":
/*!****************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/SharedAlbumContent.vue?vue&type=template&id=259e376e&scoped=true& ***!
  \****************************************************************************************************************************************************************************************************************************/
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
    [
       true
        ? _c(
            "CollectionContent",
            {
              ref: "collectionContent",
              attrs: {
                collection: _vm.album,
                "collection-file-ids": _vm.albumFileIds,
                semaphore: _vm.semaphore,
                loading: _vm.loadingAlbums || _vm.loadingFiles,
                error: _vm.errorFetchingAlbums || _vm.errorFetchingFiles,
              },
              scopedSlots: _vm._u(
                [
                  {
                    key: "header",
                    fn: function (ref) {
                      var selectedFileIds = ref.selectedFileIds
                      return _c(
                        "HeaderNavigation",
                        {
                          key: "navigation",
                          attrs: {
                            loading: _vm.loadingFiles,
                            params: { albumName: _vm.albumName },
                            path: "/" + _vm.albumName,
                            title: _vm.albumOriginalName,
                          },
                          on: { refresh: _vm.fetchAlbumContent },
                        },
                        [
                          _vm.album.location !== ""
                            ? _c(
                                "div",
                                {
                                  staticClass: "album__location",
                                  attrs: { slot: "subtitle" },
                                  slot: "subtitle",
                                },
                                [
                                  _c("MapMarker"),
                                  _vm._v(
                                    _vm._s(_vm.album.location) +
                                      " ⸱ " +
                                      _vm._s(_vm.t("photos", "Shared by")) +
                                      " "
                                  ),
                                  _c("NcUserBubble", {
                                    attrs: {
                                      "display-name":
                                        _vm.album.collaborators[0].label,
                                      user: _vm.album.collaborators[0].id,
                                    },
                                  }),
                                ],
                                1
                              )
                            : _vm._e(),
                          _vm._v(" "),
                          _vm.album !== undefined
                            ? _c(
                                "template",
                                { slot: "right" },
                                [
                                  _vm.album.nbItems !== 0
                                    ? _c(
                                        "NcButton",
                                        {
                                          attrs: {
                                            type: "tertiary",
                                            "aria-label": _vm.t(
                                              "photos",
                                              "Add photos to this album"
                                            ),
                                          },
                                          on: {
                                            click: function ($event) {
                                              _vm.showAddPhotosModal = true
                                            },
                                          },
                                        },
                                        [
                                          _c("Plus", {
                                            attrs: { slot: "icon" },
                                            slot: "icon",
                                          }),
                                        ],
                                        1
                                      )
                                    : _vm._e(),
                                  _vm._v(" "),
                                  _c(
                                    "NcActions",
                                    {
                                      attrs: {
                                        "force-menu": true,
                                        "aria-label": _vm.t(
                                          "photos",
                                          "Open actions menu"
                                        ),
                                      },
                                    },
                                    [
                                      _c(
                                        "NcActionButton",
                                        {
                                          attrs: { "close-after-click": true },
                                          on: { click: _vm.handleDeleteAlbum },
                                        },
                                        [
                                          _vm._v(
                                            "\n\t\t\t\t\t\t" +
                                              _vm._s(
                                                _vm.t("photos", "Delete album")
                                              ) +
                                              "\n\t\t\t\t\t\t"
                                          ),
                                          _c("Delete", {
                                            attrs: { slot: "icon" },
                                            slot: "icon",
                                          }),
                                        ],
                                        1
                                      ),
                                      _vm._v(" "),
                                      selectedFileIds.length > 0
                                        ? [
                                            _c("NcActionSeparator"),
                                            _vm._v(" "),
                                            _c(
                                              "NcActionButton",
                                              {
                                                attrs: {
                                                  "close-after-click": true,
                                                },
                                                on: {
                                                  click: function ($event) {
                                                    return _vm.handleRemoveFilesFromAlbum(
                                                      selectedFileIds
                                                    )
                                                  },
                                                },
                                              },
                                              [
                                                _vm._v(
                                                  "\n\t\t\t\t\t\t\t" +
                                                    _vm._s(
                                                      _vm.t(
                                                        "photos",
                                                        "Remove selection from album"
                                                      )
                                                    ) +
                                                    "\n\t\t\t\t\t\t\t"
                                                ),
                                                _c("Close", {
                                                  attrs: { slot: "icon" },
                                                  slot: "icon",
                                                }),
                                              ],
                                              1
                                            ),
                                          ]
                                        : _vm._e(),
                                    ],
                                    2
                                  ),
                                ],
                                1
                              )
                            : _vm._e(),
                        ],
                        2
                      )
                    },
                  },
                ],
                null,
                false,
                327359241
              ),
            },
            [
              _vm._v(" "),
              _c(
                "NcEmptyContent",
                {
                  staticClass: "album__empty",
                  attrs: {
                    slot: "empty-content",
                    title: _vm.t(
                      "photos",
                      "This album does not have any photos or videos yet!"
                    ),
                  },
                  slot: "empty-content",
                },
                [
                  _c("ImagePlus", { attrs: { slot: "icon" }, slot: "icon" }),
                  _vm._v(" "),
                  _c(
                    "NcButton",
                    {
                      attrs: {
                        slot: "action",
                        type: "primary",
                        "aria-label": _vm.t(
                          "photos",
                          "Add photos to this album"
                        ),
                      },
                      on: {
                        click: function ($event) {
                          _vm.showAddPhotosModal = true
                        },
                      },
                      slot: "action",
                    },
                    [
                      _c("Plus", { attrs: { slot: "icon" }, slot: "icon" }),
                      _vm._v(
                        "\n\t\t\t\t" +
                          _vm._s(_vm.t("photos", "Add")) +
                          "\n\t\t\t"
                      ),
                    ],
                    1
                  ),
                ],
                1
              ),
            ],
            1
          )
        : 0,
      _vm._v(" "),
      _vm.showAddPhotosModal
        ? _c(
            "NcModal",
            {
              attrs: {
                size: "large",
                title: _vm.t("photos", "Add photos to the album"),
              },
              on: {
                close: function ($event) {
                  _vm.showAddPhotosModal = false
                },
              },
            },
            [
              _c("FilesPicker", {
                attrs: {
                  destination: _vm.album.basename,
                  "blacklist-ids": _vm.albumFileIds,
                  loading: _vm.loadingAddFilesToAlbum,
                },
                on: { "files-picked": _vm.handleFilesPicked },
              }),
            ],
            1
          )
        : _vm._e(),
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ })

}]);
//# sourceMappingURL=photos-src_views_SharedAlbumContent_vue.js.map?v=953a955b71fe7f4ffed2