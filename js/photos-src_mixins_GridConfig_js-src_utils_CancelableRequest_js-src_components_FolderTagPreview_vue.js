(self["webpackChunkphotos"] = self["webpackChunkphotos"] || []).push([["src_mixins_GridConfig_js-src_utils_CancelableRequest_js-src_components_FolderTagPreview_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FolderTagPreview.vue?vue&type=script&lang=js&":
/*!**************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FolderTagPreview.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/router */ "./node_modules/@nextcloud/router/dist/index.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
  name: 'FolderTagPreview',
  props: {
    icon: {
      type: String,
      default: 'icon-folder'
    },
    id: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    fileList: {
      type: Array,
      default: function _default() {
        return [];
      }
    }
  },
  data: function data() {
    return {
      loaded: false,
      failed: []
    };
  },
  computed: {
    // folder is empty
    isEmpty: function isEmpty() {
      return this.previewList.length === 0;
    },
    ariaUuid: function ariaUuid() {
      return "folder-".concat(this.id);
    },
    ariaLabel: function ariaLabel() {
      return t('photos', 'Open the "{name}" sub-directory', {
        name: this.name
      });
    },

    /**
     * Previews list without the failed ones
     *
     * @return {object[]} the previews fileinfo
     */
    previewList: function previewList() {
      var _this = this;

      return this.fileList.filter(function (file) {
        return _this.failed.indexOf(file.fileid) === -1;
      });
    },

    /**
     * We do not want encoded slashes when browsing by folder
     * so we generate a new valid route object based on the
     * current named route, get the final url back, decode it
     * and use it as a direct string.
     * Which vue-router does not encode afterwards!
     *
     * @return {string}
     */
    to: function to() {
      // always remove first slash, the router
      // manage it automatically
      var regex = /^\/?(.+)/i;
      var path = regex.exec(this.path)[1]; // apply to current route

      return Object.assign({}, this.$route, {
        params: {
          path: path.split('/')
        }
      });
    }
  },
  methods: {
    generateImgSrc: function generateImgSrc(_ref) {
      var fileid = _ref.fileid,
          etag = _ref.etag;
      // use etag to force cache reload if file changed
      return (0,_nextcloud_router__WEBPACK_IMPORTED_MODULE_0__.generateUrl)("/core/preview?fileId=".concat(fileid, "&c=").concat(etag, "&x=", 250, "&y=", 250, "&forceIcon=0&a=0"));
    },
    onPreviewFail: function onPreviewFail(_ref2) {
      var fileid = _ref2.fileid;
      this.failed.push(fileid);
    }
  }
});

/***/ }),

/***/ "./src/assets/grid-sizes.js":
/*!**********************************!*\
  !*** ./src/assets/grid-sizes.js ***!
  \**********************************/
/***/ ((module) => {

/**
 * @copyright Copyright (c) 2018 John Molakvoæ <skjnldsv@protonmail.com>
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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
// for now we want to keep the same gap everywhere
var gap = 8;
/**
 * Define the max width proportions
 * The number (key) indicate the MAX size
 *
 * needs to be compatible with webpack config
 * so no export default {}
 */

module.exports = {
  sizes: {
    400: {
      marginTop: 66,
      marginW: gap,
      count: 3,
      gap: gap
    },
    700: {
      marginTop: 66,
      marginW: gap,
      count: 4,
      gap: gap
    },
    1024: {
      marginTop: 66,
      marginW: 44,
      count: 5,
      gap: gap
    },
    1280: {
      marginTop: 66,
      marginW: 44,
      count: 4,
      gap: gap
    },
    1440: {
      marginTop: 88,
      marginW: 66,
      count: 5,
      gap: gap
    },
    1600: {
      marginTop: 88,
      marginW: 66,
      count: 6,
      gap: gap
    },
    2048: {
      marginTop: 88,
      marginW: 66,
      count: 7,
      gap: gap
    },
    2560: {
      marginTop: 88,
      marginW: 88,
      count: 8,
      gap: gap
    },
    3440: {
      marginTop: 88,
      marginW: 88,
      count: 9,
      gap: gap
    },
    max: {
      marginTop: 88,
      marginW: 88,
      count: 10,
      gap: gap
    }
  }
};

/***/ }),

/***/ "./src/mixins/GridConfig.js":
/*!**********************************!*\
  !*** ./src/mixins/GridConfig.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _services_GridConfig__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/GridConfig */ "./src/services/GridConfig.js");
/* provided dependency */ var console = __webpack_require__(/*! ./node_modules/console-browserify/index.js */ "./node_modules/console-browserify/index.js");
/**
 * @copyright Copyright (c) 2018 John Molakvoæ <skjnldsv@protonmail.com>
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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

/**
 * Get the current used grid config
 */

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  data: function data() {
    return {
      gridConfig: {}
    };
  },
  created: function created() {
    var _this = this;

    _services_GridConfig__WEBPACK_IMPORTED_MODULE_0__["default"].$on('changed', function (val) {
      _this.gridConfig = val;
    });
    console.debug("[".concat("photos", "]"), 'Grid config', Object.assign({}, _services_GridConfig__WEBPACK_IMPORTED_MODULE_0__["default"].gridConfig));
    this.gridConfig = _services_GridConfig__WEBPACK_IMPORTED_MODULE_0__["default"].gridConfig;
  },
  beforeDestroy: function beforeDestroy() {
    _services_GridConfig__WEBPACK_IMPORTED_MODULE_0__["default"].$off('changed', this.gridConfig);
  }
});

/***/ }),

/***/ "./src/services/GridConfig.js":
/*!************************************!*\
  !*** ./src/services/GridConfig.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm.js");
/* harmony import */ var _assets_grid_sizes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../assets/grid-sizes */ "./src/assets/grid-sizes.js");
/* harmony import */ var _assets_grid_sizes__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_assets_grid_sizes__WEBPACK_IMPORTED_MODULE_0__);
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


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new vue__WEBPACK_IMPORTED_MODULE_1__["default"]({
  data: function data() {
    return {
      gridConfig: _assets_grid_sizes__WEBPACK_IMPORTED_MODULE_0__.sizes.max
    };
  },
  watch: {
    gridConfig: function gridConfig(val) {
      this.$emit('changed', val);
    }
  },
  created: function created() {
    window.addEventListener('resize', this.handleWindowResize);
    this.handleWindowResize();
  },
  beforeDestroy: function beforeDestroy() {
    window.removeEventListener('resize', this.handleWindowResize);
  },
  methods: {
    handleWindowResize: function handleWindowResize() {
      // find the first grid size that fit the current window width
      var currentSize = Object.keys(_assets_grid_sizes__WEBPACK_IMPORTED_MODULE_0__.sizes).find(function (size) {
        return size > document.documentElement.clientWidth;
      });
      this.gridConfig = _assets_grid_sizes__WEBPACK_IMPORTED_MODULE_0__.sizes[currentSize] || _assets_grid_sizes__WEBPACK_IMPORTED_MODULE_0__.sizes.max;
    }
  }
}));

/***/ }),

/***/ "./src/utils/CancelableRequest.js":
/*!****************************************!*\
  !*** ./src/utils/CancelableRequest.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _nextcloud_axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/axios */ "./node_modules/@nextcloud/axios/dist/index.js");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * @copyright Copyright (c) 2019 Marco Ambrosini <marcoambrosini@pm.me>
 *
 * @author Marco Ambrosini <marcoambrosini@pm.me>
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
 * Create a cancel token
 *
 * @return {CancelTokenSource}
 */

var createCancelToken = function createCancelToken() {
  return _nextcloud_axios__WEBPACK_IMPORTED_MODULE_0__["default"].CancelToken.source();
};
/**
 * Creates a cancelable axios 'request object'.
 *
 * @param {Function} request the axios promise request
 * @return {object}
 */


var CancelableRequest = function CancelableRequest(request) {
  /**
   * Generate an axios cancel token
   */
  var cancelToken = createCancelToken();
  /**
   * Execute the request
   *
   * @param {string} url the url to send the request to
   * @param {object} [options] optional config for the request
   */

  var fetch = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(url, options) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", request(url, Object.assign({
                cancelToken: cancelToken.token
              }, options)));

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function fetch(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();

  return {
    request: fetch,
    cancel: cancelToken.cancel
  };
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CancelableRequest);

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FolderTagPreview.vue?vue&type=style&index=0&id=77915c0c&lang=scss&scoped=true&":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FolderTagPreview.vue?vue&type=style&index=0&id=77915c0c&lang=scss&scoped=true& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, "@charset \"UTF-8\";\n/**\n * @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>\n *\n * @author John Molakvoæ <skjnldsv@protonmail.com>\n *\n * @license AGPL-3.0-or-later\n *\n * This program is free software: you can redistribute it and/or modify\n * it under the terms of the GNU Affero General Public License as\n * published by the Free Software Foundation, either version 3 of the\n * License, or (at your option) any later version.\n *\n * This program is distributed in the hope that it will be useful,\n * but WITHOUT ANY WARRANTY; without even the implied warranty of\n * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the\n * GNU Affero General Public License for more details.\n *\n * You should have received a copy of the GNU Affero General Public License\n * along with this program. If not, see <http://www.gnu.org/licenses/>.\n *\n */\n.file[data-v-77915c0c],\n.folder[data-v-77915c0c] {\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  -webkit-user-select: none;\n          user-select: none;\n  border-radius: var(--border-radius);\n  overflow: hidden;\n}\n.file .cover[data-v-77915c0c],\n.folder .cover[data-v-77915c0c] {\n  z-index: 2;\n  width: 100%;\n  padding-bottom: 100%;\n  transition: opacity var(--animation-quick) ease-in-out;\n  opacity: 0;\n  background-color: var(--color-main-text);\n}\n.file.active .cover[data-v-77915c0c], .file:active .cover[data-v-77915c0c], .file:hover .cover[data-v-77915c0c], .file:focus .cover[data-v-77915c0c],\n.folder.active .cover[data-v-77915c0c],\n.folder:active .cover[data-v-77915c0c],\n.folder:hover .cover[data-v-77915c0c],\n.folder:focus .cover[data-v-77915c0c] {\n  opacity: 0.3;\n}\n.file--clear.active .cover[data-v-77915c0c], .file--clear:active .cover[data-v-77915c0c], .file--clear:hover .cover[data-v-77915c0c], .file--clear:focus .cover[data-v-77915c0c],\n.folder--clear.active .cover[data-v-77915c0c],\n.folder--clear:active .cover[data-v-77915c0c],\n.folder--clear:hover .cover[data-v-77915c0c],\n.folder--clear:focus .cover[data-v-77915c0c] {\n  opacity: 0.1;\n}\n.fade-enter-active[data-v-77915c0c], .fade-leave-active[data-v-77915c0c] {\n  transition: opacity var(--animation-quick) ease-in-out;\n}\n.fade-enter[data-v-77915c0c], .fade-leave-to[data-v-77915c0c] {\n  opacity: 0;\n}\n.folder-content[data-v-77915c0c] {\n  position: absolute;\n  display: grid;\n  width: 100%;\n  height: 100%;\n}\n.folder-content--grid-1[data-v-77915c0c] {\n  grid-template-columns: 1fr;\n  grid-template-rows: 1fr;\n}\n.folder-content--grid-2[data-v-77915c0c] {\n  grid-template-columns: 1fr;\n  grid-template-rows: 1fr 1fr;\n}\n.folder-content--grid-3[data-v-77915c0c] {\n  grid-template-columns: 1fr 1fr;\n  grid-template-rows: 1fr 1fr;\n}\n.folder-content--grid-3 img[data-v-77915c0c]:first-child {\n  grid-column: span 2;\n}\n.folder-content--grid-4[data-v-77915c0c] {\n  grid-template-columns: 1fr 1fr;\n  grid-template-rows: 1fr 1fr;\n}\n.folder-content img[data-v-77915c0c] {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}\n.folder-name[data-v-77915c0c] {\n  position: absolute;\n  z-index: 3;\n  display: flex;\n  overflow: hidden;\n  flex-direction: column;\n  width: 100%;\n  height: 100%;\n  transition: opacity var(--animation-quick) ease-in-out;\n  opacity: 1;\n}\n.folder-name__icon[data-v-77915c0c] {\n  height: 40%;\n  margin-top: calc(30% - 1rem / 2);\n  background-size: 40%;\n}\n.folder-name__name[data-v-77915c0c] {\n  overflow: hidden;\n  height: 1rem;\n  padding: 0 10px;\n  text-align: center;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  color: var(--color-main-background);\n  text-shadow: 0 0 8px var(--color-main-text);\n  font-size: 1rem;\n  line-height: 1rem;\n}\n.folder--clear .folder-name__icon[data-v-77915c0c] {\n  opacity: 0.3;\n}\n.folder--clear .folder-name__name[data-v-77915c0c] {\n  color: var(--color-main-text);\n  text-shadow: 0 0 8px var(--color-main-background);\n}\n.folder:not(.folder--clear) .cover[data-v-77915c0c] {\n  opacity: 0.3;\n}\n.folder:not(.folder--clear):active .folder-name[data-v-77915c0c],\n.folder:not(.folder--clear):active .cover[data-v-77915c0c], .folder:not(.folder--clear):hover .folder-name[data-v-77915c0c],\n.folder:not(.folder--clear):hover .cover[data-v-77915c0c], .folder:not(.folder--clear):focus .folder-name[data-v-77915c0c],\n.folder:not(.folder--clear):focus .cover[data-v-77915c0c] {\n  opacity: 0;\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FolderTagPreview.vue?vue&type=style&index=0&id=77915c0c&lang=scss&scoped=true&":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FolderTagPreview.vue?vue&type=style&index=0&id=77915c0c&lang=scss&scoped=true& ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FolderTagPreview_vue_vue_type_style_index_0_id_77915c0c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FolderTagPreview.vue?vue&type=style&index=0&id=77915c0c&lang=scss&scoped=true& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FolderTagPreview.vue?vue&type=style&index=0&id=77915c0c&lang=scss&scoped=true&");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FolderTagPreview_vue_vue_type_style_index_0_id_77915c0c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FolderTagPreview_vue_vue_type_style_index_0_id_77915c0c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FolderTagPreview_vue_vue_type_style_index_0_id_77915c0c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FolderTagPreview_vue_vue_type_style_index_0_id_77915c0c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/components/FolderTagPreview.vue":
/*!*********************************************!*\
  !*** ./src/components/FolderTagPreview.vue ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _FolderTagPreview_vue_vue_type_template_id_77915c0c_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FolderTagPreview.vue?vue&type=template&id=77915c0c&scoped=true& */ "./src/components/FolderTagPreview.vue?vue&type=template&id=77915c0c&scoped=true&");
/* harmony import */ var _FolderTagPreview_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FolderTagPreview.vue?vue&type=script&lang=js& */ "./src/components/FolderTagPreview.vue?vue&type=script&lang=js&");
/* harmony import */ var _FolderTagPreview_vue_vue_type_style_index_0_id_77915c0c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FolderTagPreview.vue?vue&type=style&index=0&id=77915c0c&lang=scss&scoped=true& */ "./src/components/FolderTagPreview.vue?vue&type=style&index=0&id=77915c0c&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _FolderTagPreview_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _FolderTagPreview_vue_vue_type_template_id_77915c0c_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render,
  _FolderTagPreview_vue_vue_type_template_id_77915c0c_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "77915c0c",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/components/FolderTagPreview.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/components/FolderTagPreview.vue?vue&type=script&lang=js&":
/*!**********************************************************************!*\
  !*** ./src/components/FolderTagPreview.vue?vue&type=script&lang=js& ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_FolderTagPreview_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FolderTagPreview.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FolderTagPreview.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_FolderTagPreview_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/components/FolderTagPreview.vue?vue&type=style&index=0&id=77915c0c&lang=scss&scoped=true&":
/*!*******************************************************************************************************!*\
  !*** ./src/components/FolderTagPreview.vue?vue&type=style&index=0&id=77915c0c&lang=scss&scoped=true& ***!
  \*******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FolderTagPreview_vue_vue_type_style_index_0_id_77915c0c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/style-loader/dist/cjs.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FolderTagPreview.vue?vue&type=style&index=0&id=77915c0c&lang=scss&scoped=true& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FolderTagPreview.vue?vue&type=style&index=0&id=77915c0c&lang=scss&scoped=true&");


/***/ }),

/***/ "./src/components/FolderTagPreview.vue?vue&type=template&id=77915c0c&scoped=true&":
/*!****************************************************************************************!*\
  !*** ./src/components/FolderTagPreview.vue?vue&type=template&id=77915c0c&scoped=true& ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FolderTagPreview_vue_vue_type_template_id_77915c0c_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FolderTagPreview_vue_vue_type_template_id_77915c0c_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FolderTagPreview_vue_vue_type_template_id_77915c0c_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FolderTagPreview.vue?vue&type=template&id=77915c0c&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FolderTagPreview.vue?vue&type=template&id=77915c0c&scoped=true&");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FolderTagPreview.vue?vue&type=template&id=77915c0c&scoped=true&":
/*!*******************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FolderTagPreview.vue?vue&type=template&id=77915c0c&scoped=true& ***!
  \*******************************************************************************************************************************************************************************************************************************/
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
    "router-link",
    {
      staticClass: "folder",
      class: { "folder--clear": _vm.isEmpty },
      attrs: { to: _vm.to, "aria-label": _vm.ariaLabel },
    },
    [
      _c("transition", { attrs: { name: "fade" } }, [
        _c(
          "div",
          {
            directives: [
              {
                name: "show",
                rawName: "v-show",
                value: _vm.loaded,
                expression: "loaded",
              },
            ],
            staticClass: "folder-content",
            class: "folder-content--grid-" + _vm.previewList.length,
            attrs: { role: "none" },
          },
          _vm._l(_vm.previewList, function (file) {
            return _c("img", {
              key: file.fileid,
              attrs: { src: _vm.generateImgSrc(file), alt: "" },
              on: {
                load: function ($event) {
                  _vm.loaded = true
                },
                error: function ($event) {
                  return _vm.onPreviewFail(file)
                },
              },
            })
          }),
          0
        ),
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "folder-name" }, [
        _c("span", {
          staticClass: "folder-name__icon",
          class: [!_vm.isEmpty ? "icon-white" : "icon-dark", _vm.icon],
          attrs: { role: "img" },
        }),
        _vm._v(" "),
        _c(
          "p",
          { staticClass: "folder-name__name", attrs: { id: _vm.ariaUuid } },
          [_vm._v("\n\t\t\t" + _vm._s(_vm.name) + "\n\t\t")]
        ),
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "cover", attrs: { role: "none" } }),
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ })

}]);
//# sourceMappingURL=photos-src_mixins_GridConfig_js-src_utils_CancelableRequest_js-src_components_FolderTagPreview_vue.js.map?v=7eea2efa5035a0a23aa0