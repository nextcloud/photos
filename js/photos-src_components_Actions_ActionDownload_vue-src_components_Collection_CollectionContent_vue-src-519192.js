(self["webpackChunkphotos"] = self["webpackChunkphotos"] || []).push([["src_components_Actions_ActionDownload_vue-src_components_Collection_CollectionContent_vue-src-519192"],{

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Actions/ActionDownload.vue?vue&type=script&lang=js&":
/*!********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Actions/ActionDownload.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/router */ "./node_modules/@nextcloud/router/dist/index.js");
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/vue */ "./node_modules/@nextcloud/vue/dist/ncvuecomponents.js");
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_vue__WEBPACK_IMPORTED_MODULE_1__);
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



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'ActionDownload',
  components: {
    NcActionLink: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_1__.NcActionLink
  },
  props: {
    title: {
      type: String,
      required: true
    },
    selectedFileIds: {
      type: Array,
      required: true
    }
  },
  computed: _objectSpread(_objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_2__.mapGetters)(['files'])), {}, {
    downloadUrl: function downloadUrl() {
      var params = new URLSearchParams();
      params.append('files', JSON.stringify(this.fileNames));
      return (0,_nextcloud_router__WEBPACK_IMPORTED_MODULE_0__.generateUrl)("/apps/files/ajax/download.php?".concat(params));
    },
    fileNames: function fileNames() {
      var _this = this;

      return this.selectedFileIds.map(function (fileId) {
        return _this.files[fileId].filename;
      });
    }
  })
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Collection/CollectionContent.vue?vue&type=script&lang=js&":
/*!**************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Collection/CollectionContent.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var vue_material_design_icons_AlertCircle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue-material-design-icons/AlertCircle */ "./node_modules/vue-material-design-icons/AlertCircle.vue");
/* harmony import */ var vue_material_design_icons_FolderMultipleImage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-material-design-icons/FolderMultipleImage */ "./node_modules/vue-material-design-icons/FolderMultipleImage.vue");
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @nextcloud/vue */ "./node_modules/@nextcloud/vue/dist/ncvuecomponents.js");
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_vue__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _mixins_FilesSelectionMixin_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../mixins/FilesSelectionMixin.js */ "./src/mixins/FilesSelectionMixin.js");
/* harmony import */ var _FilesListViewer_vue__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! .././FilesListViewer.vue */ "./src/components/FilesListViewer.vue");
/* harmony import */ var _File_vue__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! .././File.vue */ "./src/components/File.vue");
/* harmony import */ var _assets_Illustrations_folder_svg__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../assets/Illustrations/folder.svg */ "./src/assets/Illustrations/folder.svg");
/* harmony import */ var _utils_semaphoreWithPriority_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../utils/semaphoreWithPriority.js */ "./src/utils/semaphoreWithPriority.js");
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









/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'CollectionContent',
  components: {
    AlertCircle: vue_material_design_icons_AlertCircle__WEBPACK_IMPORTED_MODULE_0__["default"],
    FolderMultipleImage: vue_material_design_icons_FolderMultipleImage__WEBPACK_IMPORTED_MODULE_1__["default"],
    NcEmptyContent: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_2__.NcEmptyContent,
    FilesListViewer: _FilesListViewer_vue__WEBPACK_IMPORTED_MODULE_4__["default"],
    File: _File_vue__WEBPACK_IMPORTED_MODULE_5__["default"]
  },
  mixins: [_mixins_FilesSelectionMixin_js__WEBPACK_IMPORTED_MODULE_3__["default"], _nextcloud_vue__WEBPACK_IMPORTED_MODULE_2__.isMobile],
  props: {
    collection: {
      type: Object,
      default: function _default() {
        return undefined;
      }
    },
    collectionFileIds: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    error: {
      type: [Error],
      default: ''
    },
    semaphore: {
      type: _utils_semaphoreWithPriority_js__WEBPACK_IMPORTED_MODULE_7__["default"],
      required: true
    }
  },
  data: function data() {
    return {
      FolderIllustration: _assets_Illustrations_folder_svg__WEBPACK_IMPORTED_MODULE_6__,
      appContent: document.getElementById('app-content-vue')
    };
  },
  computed: _objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_8__.mapGetters)(['files'])),
  methods: {
    openViewer: function openViewer(fileId) {
      var _this = this;

      var file = this.files[fileId];
      OCA.Viewer.open({
        fileInfo: file,
        list: this.collectionFileIds.map(function (fileId) {
          return _this.files[fileId];
        }).filter(function (file) {
          return !file.sectionHeader;
        }),
        loadMore: file.loadMore ? /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return file.loadMore(true);

                case 2:
                  return _context.abrupt("return", _context.sent);

                case 3:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        })) : function () {
          return [];
        },
        canLoop: file.canLoop
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FilesPicker.vue?vue&type=script&lang=js&":
/*!*********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FilesPicker.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/vue */ "./node_modules/@nextcloud/vue/dist/ncvuecomponents.js");
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_vue__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _nextcloud_upload__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/upload */ "./node_modules/@nextcloud/upload/dist/index.esm.js");
/* harmony import */ var _nextcloud_moment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @nextcloud/moment */ "./node_modules/@nextcloud/moment/dist/index.js");
/* harmony import */ var _nextcloud_moment__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_moment__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var vue_material_design_icons_ImagePlus__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! vue-material-design-icons/ImagePlus */ "./node_modules/vue-material-design-icons/ImagePlus.vue");
/* harmony import */ var _FilesListViewer_vue__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./FilesListViewer.vue */ "./src/components/FilesListViewer.vue");
/* harmony import */ var _File_vue__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./File.vue */ "./src/components/File.vue");
/* harmony import */ var _mixins_FetchFilesMixin_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../mixins/FetchFilesMixin.js */ "./src/mixins/FetchFilesMixin.js");
/* harmony import */ var _mixins_FilesSelectionMixin_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../mixins/FilesSelectionMixin.js */ "./src/mixins/FilesSelectionMixin.js");
/* harmony import */ var _mixins_FilesByMonthMixin_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../mixins/FilesByMonthMixin.js */ "./src/mixins/FilesByMonthMixin.js");
/* harmony import */ var _mixins_UserConfig_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../mixins/UserConfig.js */ "./src/mixins/UserConfig.js");
/* harmony import */ var _services_AllowedMimes_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../services/AllowedMimes.js */ "./src/services/AllowedMimes.js");
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












/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'FilesPicker',
  components: {
    File: _File_vue__WEBPACK_IMPORTED_MODULE_5__["default"],
    FilesListViewer: _FilesListViewer_vue__WEBPACK_IMPORTED_MODULE_4__["default"],
    ImagePlus: vue_material_design_icons_ImagePlus__WEBPACK_IMPORTED_MODULE_3__["default"],
    NcButton: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_0__.NcButton,
    NcLoadingIcon: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_0__.NcLoadingIcon,
    UploadPicker: _nextcloud_upload__WEBPACK_IMPORTED_MODULE_1__.UploadPicker
  },
  filters: {
    /**
     * @param {string} date - In the following format: YYYYMM
     */
    dateMonthAndYear: function dateMonthAndYear(date) {
      return _nextcloud_moment__WEBPACK_IMPORTED_MODULE_2___default()(date, 'YYYYMM').format('MMMM YYYY');
    }
  },
  mixins: [_mixins_FetchFilesMixin_js__WEBPACK_IMPORTED_MODULE_6__["default"], _mixins_FilesByMonthMixin_js__WEBPACK_IMPORTED_MODULE_8__["default"], _mixins_FilesSelectionMixin_js__WEBPACK_IMPORTED_MODULE_7__["default"], _mixins_UserConfig_js__WEBPACK_IMPORTED_MODULE_9__["default"]],
  props: {
    // Label to show in the submit button.
    destination: {
      type: String,
      required: true
    },
    // List of file ids to not show.
    blacklistIds: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    // Whether we should disable the submit button and show a spinner.
    loading: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      allowedMimes: _services_AllowedMimes_js__WEBPACK_IMPORTED_MODULE_10__["default"],
      targetMonth: null,
      uploadContext: {
        route: 'albumpicker'
      }
    };
  },
  computed: _objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_11__.mapGetters)(['files'])),
  watch: {
    monthsList: function monthsList(value) {
      if (this.targetMonth === null) {
        this.targetMonth = value[0];
      }
    }
  },
  methods: {
    getFiles: function getFiles() {
      this.fetchFiles('', {}, this.blacklistIds);
    },
    emitPickedEvent: function emitPickedEvent() {
      this.$emit('files-picked', this.selectedFileIds);
    }
  }
});

/***/ }),

/***/ "./src/mixins/FilesByMonthMixin.js":
/*!*****************************************!*\
  !*** ./src/mixins/FilesByMonthMixin.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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
  name: 'FilesByMonthMixin',
  computed: {
    /**
     * @return {object<String, []>}
     */
    fileIdsByMonth: function fileIdsByMonth() {
      var _this = this;

      var filesByMonth = {};

      var _iterator = _createForOfIteratorHelper(this.fetchedFileIds),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _filesByMonth$file$mo;

          var fileId = _step.value;
          var file = this.files[fileId];
          filesByMonth[file.month] = (_filesByMonth$file$mo = filesByMonth[file.month]) !== null && _filesByMonth$file$mo !== void 0 ? _filesByMonth$file$mo : [];
          filesByMonth[file.month].push(file.fileid);
        } // Sort files in sections.

      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      Object.keys(filesByMonth).forEach(function (month) {
        return filesByMonth[month].sort(_this.sortFilesByTimestamp);
      });
      return filesByMonth;
    },

    /**
     * @return {string[]}
     */
    monthsList: function monthsList() {
      return Object.keys(this.fileIdsByMonth).sort(function (month1, month2) {
        return month1 > month2 ? -1 : 1;
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Collection/CollectionContent.vue?vue&type=style&index=0&id=6a4155da&lang=scss&scoped=true&":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Collection/CollectionContent.vue?vue&type=style&index=0&id=6a4155da&lang=scss&scoped=true& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "./node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".collection[data-v-6a4155da] {\n  display: flex;\n  flex-direction: column;\n}\n.collection__media[data-v-6a4155da] {\n  padding: 0 64px;\n}\n@media only screen and (max-width: 1200px) {\n.collection__media[data-v-6a4155da] {\n    padding: 0 4px;\n}\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FilesPicker.vue?vue&type=style&index=0&id=10d87d65&lang=scss&scoped=true&":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FilesPicker.vue?vue&type=style&index=0&id=10d87d65&lang=scss&scoped=true& ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
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
___CSS_LOADER_EXPORT___.push([module.id, ".file-picker[data-v-10d87d65] {\n  display: flex;\n  flex-direction: column;\n  padding: 12px;\n}\n.file-picker__content[data-v-10d87d65] {\n  display: flex;\n  align-items: flex-start;\n  flex-grow: 1;\n  height: 500px;\n}\n.file-picker__navigation[data-v-10d87d65] {\n  flex-basis: 200px;\n  overflow: scroll;\n  margin-right: 8px;\n  padding-right: 8px;\n  height: 100%;\n}\n@media only screen and (max-width: 1200px) {\n.file-picker__navigation[data-v-10d87d65] {\n    flex-basis: 100px;\n}\n}\n.file-picker__navigation--placeholder[data-v-10d87d65] {\n  background: var(--color-primary-light);\n  border-radius: var(--border-radius-large);\n}\n.file-picker__navigation__month[data-v-10d87d65] {\n  font-weight: bold;\n  font-size: 16px;\n  border-radius: var(--border-radius-pill);\n  padding: 8px 16px;\n  margin: 4px 0;\n  cursor: pointer;\n}\n@media only screen and (max-width: 1200px) {\n.file-picker__navigation__month[data-v-10d87d65] {\n    text-align: center;\n}\n}\n.file-picker__navigation__month[data-v-10d87d65]:hover {\n  background: var(--color-background-dark);\n}\n.file-picker__navigation__month.selected[data-v-10d87d65] {\n  background: var(--color-primary-element-lighter);\n}\n.file-picker__file-list[data-v-10d87d65] {\n  flex-grow: 1;\n  min-width: 0;\n  height: 100%;\n}\n.file-picker__file-list--placeholder[data-v-10d87d65] {\n  background: var(--color-primary-light);\n  border-radius: var(--border-radius-large);\n}\n.file-picker__file-list .section-header[data-v-10d87d65] {\n  font-weight: bold;\n  font-size: 20px;\n  padding: 8px 0 4px 0;\n}\n.file-picker__file-list[data-v-10d87d65]  .empty-content {\n  position: absolute;\n  width: 100%;\n  margin-top: 0;\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n}\n.file-picker__actions[data-v-10d87d65] {\n  display: flex;\n  justify-content: space-between;\n  justify-items: center;\n  padding-top: 16px;\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Collection/CollectionContent.vue?vue&type=style&index=0&id=6a4155da&lang=scss&scoped=true&":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Collection/CollectionContent.vue?vue&type=style&index=0&id=6a4155da&lang=scss&scoped=true& ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_CollectionContent_vue_vue_type_style_index_0_id_6a4155da_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../node_modules/css-loader/dist/cjs.js!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/dist/cjs.js!../../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CollectionContent.vue?vue&type=style&index=0&id=6a4155da&lang=scss&scoped=true& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Collection/CollectionContent.vue?vue&type=style&index=0&id=6a4155da&lang=scss&scoped=true&");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_CollectionContent_vue_vue_type_style_index_0_id_6a4155da_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_CollectionContent_vue_vue_type_style_index_0_id_6a4155da_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_CollectionContent_vue_vue_type_style_index_0_id_6a4155da_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_CollectionContent_vue_vue_type_style_index_0_id_6a4155da_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FilesPicker.vue?vue&type=style&index=0&id=10d87d65&lang=scss&scoped=true&":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FilesPicker.vue?vue&type=style&index=0&id=10d87d65&lang=scss&scoped=true& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FilesPicker_vue_vue_type_style_index_0_id_10d87d65_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FilesPicker.vue?vue&type=style&index=0&id=10d87d65&lang=scss&scoped=true& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FilesPicker.vue?vue&type=style&index=0&id=10d87d65&lang=scss&scoped=true&");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FilesPicker_vue_vue_type_style_index_0_id_10d87d65_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FilesPicker_vue_vue_type_style_index_0_id_10d87d65_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FilesPicker_vue_vue_type_style_index_0_id_10d87d65_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FilesPicker_vue_vue_type_style_index_0_id_10d87d65_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/components/Actions/ActionDownload.vue":
/*!***************************************************!*\
  !*** ./src/components/Actions/ActionDownload.vue ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ActionDownload_vue_vue_type_template_id_1aefa300___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ActionDownload.vue?vue&type=template&id=1aefa300& */ "./src/components/Actions/ActionDownload.vue?vue&type=template&id=1aefa300&");
/* harmony import */ var _ActionDownload_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ActionDownload.vue?vue&type=script&lang=js& */ "./src/components/Actions/ActionDownload.vue?vue&type=script&lang=js&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _ActionDownload_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _ActionDownload_vue_vue_type_template_id_1aefa300___WEBPACK_IMPORTED_MODULE_0__.render,
  _ActionDownload_vue_vue_type_template_id_1aefa300___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/components/Actions/ActionDownload.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/components/Collection/CollectionContent.vue":
/*!*********************************************************!*\
  !*** ./src/components/Collection/CollectionContent.vue ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _CollectionContent_vue_vue_type_template_id_6a4155da_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CollectionContent.vue?vue&type=template&id=6a4155da&scoped=true& */ "./src/components/Collection/CollectionContent.vue?vue&type=template&id=6a4155da&scoped=true&");
/* harmony import */ var _CollectionContent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CollectionContent.vue?vue&type=script&lang=js& */ "./src/components/Collection/CollectionContent.vue?vue&type=script&lang=js&");
/* harmony import */ var _CollectionContent_vue_vue_type_style_index_0_id_6a4155da_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CollectionContent.vue?vue&type=style&index=0&id=6a4155da&lang=scss&scoped=true& */ "./src/components/Collection/CollectionContent.vue?vue&type=style&index=0&id=6a4155da&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _CollectionContent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _CollectionContent_vue_vue_type_template_id_6a4155da_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render,
  _CollectionContent_vue_vue_type_template_id_6a4155da_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "6a4155da",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/components/Collection/CollectionContent.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/components/FilesPicker.vue":
/*!****************************************!*\
  !*** ./src/components/FilesPicker.vue ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _FilesPicker_vue_vue_type_template_id_10d87d65_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FilesPicker.vue?vue&type=template&id=10d87d65&scoped=true& */ "./src/components/FilesPicker.vue?vue&type=template&id=10d87d65&scoped=true&");
/* harmony import */ var _FilesPicker_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FilesPicker.vue?vue&type=script&lang=js& */ "./src/components/FilesPicker.vue?vue&type=script&lang=js&");
/* harmony import */ var _FilesPicker_vue_vue_type_style_index_0_id_10d87d65_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FilesPicker.vue?vue&type=style&index=0&id=10d87d65&lang=scss&scoped=true& */ "./src/components/FilesPicker.vue?vue&type=style&index=0&id=10d87d65&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _FilesPicker_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _FilesPicker_vue_vue_type_template_id_10d87d65_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render,
  _FilesPicker_vue_vue_type_template_id_10d87d65_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "10d87d65",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/components/FilesPicker.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/components/Actions/ActionDownload.vue?vue&type=script&lang=js&":
/*!****************************************************************************!*\
  !*** ./src/components/Actions/ActionDownload.vue?vue&type=script&lang=js& ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ActionDownload_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ActionDownload.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Actions/ActionDownload.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ActionDownload_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/components/Collection/CollectionContent.vue?vue&type=script&lang=js&":
/*!**********************************************************************************!*\
  !*** ./src/components/Collection/CollectionContent.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CollectionContent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CollectionContent.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Collection/CollectionContent.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CollectionContent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/components/FilesPicker.vue?vue&type=script&lang=js&":
/*!*****************************************************************!*\
  !*** ./src/components/FilesPicker.vue?vue&type=script&lang=js& ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_FilesPicker_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FilesPicker.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FilesPicker.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_FilesPicker_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/components/Collection/CollectionContent.vue?vue&type=style&index=0&id=6a4155da&lang=scss&scoped=true&":
/*!*******************************************************************************************************************!*\
  !*** ./src/components/Collection/CollectionContent.vue?vue&type=style&index=0&id=6a4155da&lang=scss&scoped=true& ***!
  \*******************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_CollectionContent_vue_vue_type_style_index_0_id_6a4155da_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/style-loader/dist/cjs.js!../../../node_modules/css-loader/dist/cjs.js!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/dist/cjs.js!../../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CollectionContent.vue?vue&type=style&index=0&id=6a4155da&lang=scss&scoped=true& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Collection/CollectionContent.vue?vue&type=style&index=0&id=6a4155da&lang=scss&scoped=true&");


/***/ }),

/***/ "./src/components/FilesPicker.vue?vue&type=style&index=0&id=10d87d65&lang=scss&scoped=true&":
/*!**************************************************************************************************!*\
  !*** ./src/components/FilesPicker.vue?vue&type=style&index=0&id=10d87d65&lang=scss&scoped=true& ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FilesPicker_vue_vue_type_style_index_0_id_10d87d65_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/style-loader/dist/cjs.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FilesPicker.vue?vue&type=style&index=0&id=10d87d65&lang=scss&scoped=true& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FilesPicker.vue?vue&type=style&index=0&id=10d87d65&lang=scss&scoped=true&");


/***/ }),

/***/ "./src/components/Actions/ActionDownload.vue?vue&type=template&id=1aefa300&":
/*!**********************************************************************************!*\
  !*** ./src/components/Actions/ActionDownload.vue?vue&type=template&id=1aefa300& ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ActionDownload_vue_vue_type_template_id_1aefa300___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ActionDownload_vue_vue_type_template_id_1aefa300___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ActionDownload_vue_vue_type_template_id_1aefa300___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ActionDownload.vue?vue&type=template&id=1aefa300& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Actions/ActionDownload.vue?vue&type=template&id=1aefa300&");


/***/ }),

/***/ "./src/components/Collection/CollectionContent.vue?vue&type=template&id=6a4155da&scoped=true&":
/*!****************************************************************************************************!*\
  !*** ./src/components/Collection/CollectionContent.vue?vue&type=template&id=6a4155da&scoped=true& ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CollectionContent_vue_vue_type_template_id_6a4155da_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CollectionContent_vue_vue_type_template_id_6a4155da_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CollectionContent_vue_vue_type_template_id_6a4155da_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CollectionContent.vue?vue&type=template&id=6a4155da&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Collection/CollectionContent.vue?vue&type=template&id=6a4155da&scoped=true&");


/***/ }),

/***/ "./src/components/FilesPicker.vue?vue&type=template&id=10d87d65&scoped=true&":
/*!***********************************************************************************!*\
  !*** ./src/components/FilesPicker.vue?vue&type=template&id=10d87d65&scoped=true& ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FilesPicker_vue_vue_type_template_id_10d87d65_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FilesPicker_vue_vue_type_template_id_10d87d65_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FilesPicker_vue_vue_type_template_id_10d87d65_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FilesPicker.vue?vue&type=template&id=10d87d65&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FilesPicker.vue?vue&type=template&id=10d87d65&scoped=true&");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Actions/ActionDownload.vue?vue&type=template&id=1aefa300&":
/*!*************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Actions/ActionDownload.vue?vue&type=template&id=1aefa300& ***!
  \*************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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
    "NcActionLink",
    {
      attrs: {
        "close-after-click": true,
        href: _vm.downloadUrl,
        download: _vm.downloadUrl,
        "aria-label": _vm.title,
      },
    },
    [
      _vm._v("\n\t" + _vm._s(_vm.title) + "\n\t"),
      _vm._t("icon", null, { slot: "icon" }),
    ],
    2
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Collection/CollectionContent.vue?vue&type=template&id=6a4155da&scoped=true&":
/*!*******************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Collection/CollectionContent.vue?vue&type=template&id=6a4155da&scoped=true& ***!
  \*******************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _vm.collection === undefined && !_vm.loading
    ? _c(
        "NcEmptyContent",
        {
          staticClass: "empty-content-with-illustration",
          attrs: { title: _vm.t("photos", "This collection does not exist") },
        },
        [_c("FolderMultipleImage")],
        1
      )
    : _vm.error
    ? _c(
        "NcEmptyContent",
        { attrs: { title: _vm.t("photos", "An error occurred") } },
        [_c("AlertCircle", { attrs: { slot: "icon" }, slot: "icon" })],
        1
      )
    : _c(
        "div",
        { staticClass: "collection" },
        [
          _vm._t("header", null, { selectedFileIds: _vm.selectedFileIds }),
          _vm._v(" "),
          _vm.collectionFileIds.length === 0 && !_vm.loading
            ? _vm._t("empty-content")
            : _vm._e(),
          _vm._v(" "),
          _vm.collection !== undefined
            ? _c("FilesListViewer", {
                staticClass: "collection__media",
                attrs: {
                  "container-element": _vm.appContent,
                  "file-ids": _vm.collectionFileIds,
                  "base-height": _vm.isMobile ? 120 : 200,
                  loading: _vm.loading,
                },
                scopedSlots: _vm._u(
                  [
                    {
                      key: "default",
                      fn: function (ref) {
                        var file = ref.file
                        var visibility = ref.visibility
                        return _c("File", {
                          attrs: {
                            file: _vm.files[file.id],
                            "allow-selection": true,
                            selected: _vm.selection[file.id] === true,
                            visibility: visibility,
                            semaphore: _vm.semaphore,
                          },
                          on: {
                            click: _vm.openViewer,
                            "select-toggled": _vm.onFileSelectToggle,
                          },
                        })
                      },
                    },
                  ],
                  null,
                  false,
                  3592900521
                ),
              })
            : _vm._e(),
        ],
        2
      )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FilesPicker.vue?vue&type=template&id=10d87d65&scoped=true&":
/*!**************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FilesPicker.vue?vue&type=template&id=10d87d65&scoped=true& ***!
  \**************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "file-picker" }, [
    _c(
      "div",
      { staticClass: "file-picker__content" },
      [
        _c(
          "div",
          {
            staticClass: "file-picker__navigation",
            class: {
              "file-picker__navigation--placeholder":
                _vm.monthsList.length === 0,
            },
          },
          _vm._l(_vm.monthsList, function (month) {
            return _c(
              "div",
              {
                key: month,
                staticClass: "file-picker__navigation__month",
                class: { selected: _vm.targetMonth === month },
                on: {
                  click: function ($event) {
                    _vm.targetMonth = month
                  },
                },
              },
              [
                _vm._v(
                  "\n\t\t\t\t" +
                    _vm._s(_vm._f("dateMonthAndYear")(month)) +
                    "\n\t\t\t"
                ),
              ]
            )
          }),
          0
        ),
        _vm._v(" "),
        _c("FilesListViewer", {
          staticClass: "file-picker__file-list",
          class: {
            "file-picker__file-list--placeholder": _vm.monthsList.length === 0,
          },
          attrs: {
            "file-ids-by-section": _vm.fileIdsByMonth,
            "empty-message": _vm.t(
              "photos",
              "There is no photos or videos yet!"
            ),
            sections: _vm.monthsList,
            loading: _vm.loadingFiles,
            "base-height": 100,
            "section-header-height": 50,
            "scroll-to-section": _vm.targetMonth,
          },
          on: { "need-content": _vm.getFiles },
          scopedSlots: _vm._u([
            {
              key: "default",
              fn: function (ref) {
                var file = ref.file
                var height = ref.height
                var visibility = ref.visibility
                return [
                  file.sectionHeader
                    ? _c(
                        "h3",
                        {
                          staticClass: "section-header",
                          style: { height: height + "px" },
                          attrs: {
                            id: "file-picker-section-header-" + file.id,
                          },
                        },
                        [
                          _vm._v(
                            "\n\t\t\t\t\t" +
                              _vm._s(_vm._f("dateMonthAndYear")(file.id)) +
                              "\n\t\t\t\t"
                          ),
                        ]
                      )
                    : _c("File", {
                        attrs: {
                          file: _vm.files[file.id],
                          "allow-selection": true,
                          selected: _vm.selection[file.id] === true,
                          visibility: visibility,
                          semaphore: _vm.semaphore,
                        },
                        on: { "select-toggled": _vm.onFileSelectToggle },
                      }),
                ]
              },
            },
          ]),
        }),
      ],
      1
    ),
    _vm._v(" "),
    _c(
      "div",
      { staticClass: "file-picker__actions" },
      [
        _c("UploadPicker", {
          attrs: {
            accept: _vm.allowedMimes,
            context: _vm.uploadContext,
            destination: _vm.photosLocation,
            multiple: true,
          },
          on: { uploaded: _vm.getFiles },
        }),
        _vm._v(" "),
        _c(
          "NcButton",
          {
            attrs: {
              type: "primary",
              disabled: _vm.loading || _vm.selectedFileIds.length === 0,
            },
            on: { click: _vm.emitPickedEvent },
            scopedSlots: _vm._u([
              {
                key: "icon",
                fn: function () {
                  return [
                    !_vm.loading ? _c("ImagePlus") : _vm._e(),
                    _vm._v(" "),
                    _vm.loading ? _c("NcLoadingIcon") : _vm._e(),
                  ]
                },
                proxy: true,
              },
            ]),
          },
          [
            _vm._v(
              "\n\t\t\t" +
                _vm._s(
                  _vm.t("photos", "Add to {destination}", {
                    destination: _vm.destination,
                  })
                ) +
                "\n\t\t"
            ),
          ]
        ),
      ],
      1
    ),
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./src/assets/Illustrations/folder.svg":
/*!*********************************************!*\
  !*** ./src/assets/Illustrations/folder.svg ***!
  \*********************************************/
/***/ ((module) => {

"use strict";
module.exports = "<svg id=\"3ecf9745-447a-4766-8a86-6837975429df\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"729.47\" height=\"695.09\" viewBox=\"0 0 729.47 695.09\" style=\"margin-left:calc(50% * (730 - 615) / 730)\"><defs><linearGradient id=\"fc2ce546-a06c-4acb-8cca-fc7989cc5e45\" x1=\"611.98\" y1=\"687.2\" x2=\"611.98\" y2=\"258.73\" gradientUnits=\"userSpaceOnUse\"><stop offset=\"0\" stop-color=\"gray\" stop-opacity=\"0.25\"/><stop offset=\"0.54\" stop-color=\"gray\" stop-opacity=\"0.12\"/><stop offset=\"1\" stop-color=\"gray\" stop-opacity=\"0.1\"/></linearGradient><linearGradient id=\"8de405ef-36e0-4554-af41-d0565e95cbca\" x1=\"410.91\" y1=\"358.56\" x2=\"452.61\" y2=\"86.08\" gradientTransform=\"matrix(1.01, 0.13, -0.13, 1.02, 62.29, -41.05)\" xlink:href=\"#fc2ce546-a06c-4acb-8cca-fc7989cc5e45\"/><linearGradient id=\"90a47f5c-11a4-432e-bbe5-e819485e2974\" x1=\"597.01\" y1=\"453.03\" x2=\"597.01\" y2=\"138.64\" gradientTransform=\"translate(140.76 -189.73) rotate(20.42)\" xlink:href=\"#fc2ce546-a06c-4acb-8cca-fc7989cc5e45\"/><linearGradient id=\"c3d8783b-6f33-4c65-b7a9-7a0b4c25dfb1\" x1=\"756.62\" y1=\"488.3\" x2=\"772.25\" y2=\"249.01\" gradientTransform=\"matrix(0.26, 0.99, -1.02, 0.25, 910.43, -476.82)\" xlink:href=\"#fc2ce546-a06c-4acb-8cca-fc7989cc5e45\"/><linearGradient id=\"1441cd83-913d-413c-98d4-824021df009a\" x1=\"310\" y1=\"695.09\" x2=\"310\" y2=\"203.86\" xlink:href=\"#fc2ce546-a06c-4acb-8cca-fc7989cc5e45\"/><linearGradient id=\"4913d3bc-5f66-46f4-9c65-3645c89ed5d3\" x1=\"545.79\" y1=\"695.81\" x2=\"545.79\" y2=\"464.64\" gradientUnits=\"userSpaceOnUse\"><stop offset=\"0\" stop-color=\"#b3b3b3\" stop-opacity=\"0.25\"/><stop offset=\"0.54\" stop-color=\"#b3b3b3\" stop-opacity=\"0.1\"/><stop offset=\"1\" stop-color=\"#b3b3b3\" stop-opacity=\"0.05\"/></linearGradient><linearGradient id=\"0cf8a40c-444c-472e-8722-d672ac4b1674\" x1=\"310.8\" y1=\"580.62\" x2=\"310.8\" y2=\"375.85\" xlink:href=\"#4913d3bc-5f66-46f4-9c65-3645c89ed5d3\"/><clipPath id=\"f4edd298-8257-4895-a91b-ae15b3b0d94f\" transform=\"translate(-235.26 -102.45)\"><rect x=\"400.07\" y=\"483.3\" width=\"291.69\" height=\"194.01\" rx=\"8.85\" ry=\"8.85\" fill=\"#fff\"/></clipPath></defs><title>folder</title><polygon points=\"618.97 687.2 513.53 687.2 513.53 258.73 710.42 258.73 618.97 687.2\" fill=\"url(#fc2ce546-a06c-4acb-8cca-fc7989cc5e45)\"/><polygon points=\"613.72 687.2 510.37 687.2 510.37 258.73 703.35 258.73 613.72 687.2\" fill=\"#f5f5f5\"/><rect x=\"249.88\" y=\"158.45\" width=\"439.19\" height=\"168.85\" transform=\"translate(-283.32 32.9) rotate(-15.62)\" fill=\"url(#8de405ef-36e0-4554-af41-d0565e95cbca)\"/><rect x=\"254.32\" y=\"160.66\" width=\"431.85\" height=\"163.44\" transform=\"translate(-283.15 33.09) rotate(-15.62)\" fill=\"#f4f4f4\"/><rect x=\"367.9\" y=\"230.63\" width=\"108.65\" height=\"8.29\" transform=\"translate(-282.88 19.88) rotate(-15.62)\" fill=\"#f5f5f5\"/><rect x=\"376.82\" y=\"262.55\" width=\"108.65\" height=\"8.29\" transform=\"translate(-291.14 23.46) rotate(-15.62)\" fill=\"#fff\"/><rect x=\"371.14\" y=\"237.71\" width=\"174.6\" height=\"8.29\" transform=\"translate(-283.45 29.89) rotate(-15.62)\" fill=\"#fff\"/><circle cx=\"329.58\" cy=\"277.88\" r=\"19.34\" transform=\"translate(-297.9 -3.47) rotate(-15.62)\" fill=\"#fff\"/><rect x=\"376.38\" y=\"210.25\" width=\"441.26\" height=\"171.17\" transform=\"translate(-300.97 124.47) rotate(-20.42)\" fill=\"url(#90a47f5c-11a4-432e-bbe5-e819485e2974)\"/><rect x=\"381.03\" y=\"214.81\" width=\"431.85\" height=\"163.44\" transform=\"translate(-301.21 124.5) rotate(-20.42)\" fill=\"#f7f7f7\"/><rect x=\"494.14\" y=\"288.83\" width=\"108.65\" height=\"8.29\" transform=\"translate(-303.02 107.35) rotate(-20.42)\" fill=\"#f5f5f5\"/><rect x=\"505.71\" y=\"319.89\" width=\"108.65\" height=\"8.29\" transform=\"translate(-313.13 113.34) rotate(-20.42)\" fill=\"#fff\"/><rect x=\"497.85\" y=\"292.85\" width=\"174.6\" height=\"8.29\" transform=\"matrix(0.94, -0.35, 0.35, 0.94, -302.12, 120.41)\" fill=\"#fff\"/><circle cx=\"459.76\" cy=\"343.69\" r=\"19.34\" transform=\"translate(-326.29 79.59) rotate(-20.42)\" fill=\"#fff\"/><rect x=\"646.89\" y=\"150.88\" width=\"172.17\" height=\"440.14\" transform=\"translate(3.97 925.06) rotate(-79.9)\" fill=\"url(#c3d8783b-6f33-4c65-b7a9-7a0b4c25dfb1)\"/><rect x=\"515.81\" y=\"288.22\" width=\"431.85\" height=\"163.44\" transform=\"translate(-159.05 -225.04) rotate(10.1)\" fill=\"#fafafa\"/><rect x=\"687.63\" y=\"287.92\" width=\"8.29\" height=\"108.65\" transform=\"translate(-1.75 860.83) rotate(-79.9)\" fill=\"#f5f5f5\"/><rect x=\"681.81\" y=\"320.56\" width=\"8.29\" height=\"108.65\" transform=\"translate(-38.67 882.02) rotate(-79.9)\" fill=\"#fff\"/><rect x=\"717.18\" y=\"277.05\" width=\"8.29\" height=\"174.6\" transform=\"translate(0.86 908.15) rotate(-79.9)\" fill=\"#fff\"/><circle cx=\"589.6\" cy=\"340.88\" r=\"19.34\" transform=\"translate(-84.66 759.11) rotate(-79.9)\" fill=\"#fff\"/><polygon points=\"171.78 253.69 100.61 203.86 2.07 203.86 2.07 253.69 2.07 278.1 2.07 695.09 617.93 695.09 617.93 253.69 171.78 253.69\" fill=\"url(#1441cd83-913d-413c-98d4-824021df009a)\"/><polygon points=\"174.44 258.73 104.36 210.36 7.34 210.36 7.34 258.73 7.34 282.43 7.34 687.2 613.72 687.2 613.72 258.73 174.44 258.73\" fill=\"#fff\"/><path d=\"M711.54,688.53a7.25,7.25,0,0,1-7.21,7.28H387.26a7.25,7.25,0,0,1-7.21-7.28V471.93a7.25,7.25,0,0,1,7.21-7.28H704.33a7.25,7.25,0,0,1,7.21,7.28\" transform=\"translate(-235.26 -102.45)\" fill=\"url(#4913d3bc-5f66-46f4-9c65-3645c89ed5d3)\"/><path d=\"M707.81,685a7,7,0,0,1-7,7H391.05a7,7,0,0,1-7-7V475.62a7,7,0,0,1,7-7H700.77a7,7,0,0,1,7,7\" transform=\"translate(-235.26 -102.45)\" fill=\"#fff\"/><g id=\"114cebd5-d8fe-4021-8e49-fe55d7dac6be\" data-name=\"&lt;Rectangle&gt;\"><rect x=\"161.12\" y=\"375.85\" width=\"299.37\" height=\"204.76\" rx=\"8.85\" ry=\"8.85\" fill=\"url(#0cf8a40c-444c-472e-8722-d672ac4b1674)\"/></g><rect x=\"164.8\" y=\"380.84\" width=\"291.69\" height=\"194.01\" rx=\"8.85\" ry=\"8.85\" fill=\"#fff\"/><g clip-path=\"url(#f4edd298-8257-4895-a91b-ae15b3b0d94f)\"><path d=\"M383.84,675.53l81.44-93.31a16.21,16.21,0,0,1,22.94-1.5L511,600.84a16.21,16.21,0,0,0,21.16.25l69.7-58.58A16.21,16.21,0,0,1,624.3,544l85.53,94.14a16.21,16.21,0,0,1,4.15,9.47l3.3,37.13a16.21,16.21,0,0,1-16.15,17.65H396.06a16.21,16.21,0,0,1-16.2-15.72h0A16.21,16.21,0,0,1,383.84,675.53Z\" transform=\"translate(-235.26 -102.45)\" fill=\"#6c63ff\"/></g><circle cx=\"199.93\" cy=\"411.95\" r=\"18.06\" fill=\"#ff5252\"/></svg>";

/***/ }),

/***/ "?d546":
/*!************************!*\
  !*** buffer (ignored) ***!
  \************************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?8131":
/*!************************!*\
  !*** buffer (ignored) ***!
  \************************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?3fc0":
/*!************************!*\
  !*** crypto (ignored) ***!
  \************************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?cad2":
/*!**********************!*\
  !*** util (ignored) ***!
  \**********************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?593c":
/*!**********************!*\
  !*** util (ignored) ***!
  \**********************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?4068":
/*!************************!*\
  !*** buffer (ignored) ***!
  \************************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?e7e4":
/*!************************!*\
  !*** buffer (ignored) ***!
  \************************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?7bec":
/*!************************!*\
  !*** buffer (ignored) ***!
  \************************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?802b":
/*!**********************!*\
  !*** util (ignored) ***!
  \**********************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?1e44":
/*!**********************!*\
  !*** util (ignored) ***!
  \**********************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?0aec":
/*!************************!*\
  !*** buffer (ignored) ***!
  \************************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?fbf1":
/*!************************!*\
  !*** buffer (ignored) ***!
  \************************/
/***/ (() => {

/* (ignored) */

/***/ })

}]);
//# sourceMappingURL=photos-src_components_Actions_ActionDownload_vue-src_components_Collection_CollectionContent_vue-src-519192.js.map?v=3869b5c10405b03b834f