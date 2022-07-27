"use strict";
(self["webpackChunkphotos"] = self["webpackChunkphotos"] || []).push([["src_utils_CancelableRequest_js-src_components_File_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/File.vue?vue&type=script&lang=js&":
/*!**************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/File.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/router */ "./node_modules/@nextcloud/router/dist/index.js");
/* harmony import */ var _nextcloud_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/auth */ "./node_modules/@nextcloud/auth/dist/index.js");
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @nextcloud/vue */ "./node_modules/@nextcloud/vue/dist/ncvuecomponents.js");
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_vue__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _mixins_UserConfig_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../mixins/UserConfig.js */ "./src/mixins/UserConfig.js");
/* harmony import */ var _utils_semaphoreWithPriority_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/semaphoreWithPriority.js */ "./src/utils/semaphoreWithPriority.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
  name: 'File',
  components: {
    CheckboxRadioSwitch: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_2__.CheckboxRadioSwitch
  },
  mixins: [_mixins_UserConfig_js__WEBPACK_IMPORTED_MODULE_3__["default"]],
  inheritAttrs: false,
  props: {
    // TODO: rename item to file
    item: {
      type: Object,
      required: true
    },
    selected: {
      type: Boolean,
      required: true
    },
    allowSelection: {
      type: Boolean,
      default: true
    },
    visibility: {
      type: String,
      required: true
    },
    semaphore: {
      type: _utils_semaphoreWithPriority_js__WEBPACK_IMPORTED_MODULE_4__["default"],
      required: true
    }
  },

  data() {
    return {
      loaded: false,
      error: false,
      canLoad: false,
      semaphoreSymbol: null,
      isDestroyed: false
    };
  },

  computed: {
    /** @return {string} */
    davPath() {
      return (0,_nextcloud_router__WEBPACK_IMPORTED_MODULE_0__.generateRemoteUrl)(`dav/files/${(0,_nextcloud_auth__WEBPACK_IMPORTED_MODULE_1__.getCurrentUser)().uid}`) + this.item.filename;
    },

    /** @return {string} */
    ariaDescription() {
      return `image-description-${this.item.fileid}`;
    },

    /** @return {string} */
    ariaLabel() {
      return t('photos', 'Open the full size "{name}" image', {
        name: this.item.basename
      });
    },

    /** @return {boolean} */
    isImage() {
      return this.item.mime.startsWith('image');
    },

    /** @return {string} */
    decodedEtag() {
      return this.item.etag.replace('&quot;', '').replace('&quot;', '');
    },

    /** @return {string} */
    srcVisible() {
      return this.getItemURL(512);
    },

    /** @return {string} */
    srcNear() {
      return this.getItemURL(64);
    }

  },

  async mounted() {
    // Don't render the component right away as it is useless if the user is only scrolling
    await new Promise(resolve => {
      setTimeout(async () => {
        resolve();
      }, 250);
    });
    this.semaphoreSymbol = await this.semaphore.acquire(() => {
      switch (this.visibility) {
        case 'visible':
          return 1;

        case 'near':
          return 2;

        default:
          return 3;
      }
    }, this.item.fileid);
    this.canLoad = true;

    if (this.visibility === 'none' || this.isDestroyed) {
      this.releaseSemaphore();
    }
  },

  beforeDestroy() {
    this.isDestroyed = true;
    this.releaseSemaphore(); // cancel any pending load

    if (this.$refs.imgNear !== undefined) {
      this.$refs.imgNear.src = '';
    }

    if (this.$refs.srcVisible !== undefined) {
      this.$refs.srcVisible.src = '';
    }
  },

  methods: {
    emitClick() {
      this.$emit('click', this.item.fileid);
    },

    /** When the image is fully loaded by browser we remove the placeholder */
    onLoad() {
      this.loaded = true;
      this.releaseSemaphore();
    },

    onError() {
      this.error = true;
      this.releaseSemaphore();
    },

    onToggle(value) {
      this.$emit('select-toggled', {
        id: this.item.fileid,
        value
      });
    },

    getItemURL(size) {
      return (0,_nextcloud_router__WEBPACK_IMPORTED_MODULE_0__.generateUrl)(`/core/preview?fileId=${this.item.fileid}&c=${this.decodedEtag}&x=${size}&y=${size}&forceIcon=0&a=1`);
    },

    releaseSemaphore() {
      if (this.semaphoreSymbol === null) {
        return;
      }

      this.semaphore.release(this.semaphoreSymbol);
      this.semaphoreSymbol = null;
    }

  }
});

/***/ }),

/***/ "./src/utils/CancelableRequest.js":
/*!****************************************!*\
  !*** ./src/utils/CancelableRequest.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _nextcloud_axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/axios */ "./node_modules/@nextcloud/axios/dist/index.js");
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

const createCancelToken = () => _nextcloud_axios__WEBPACK_IMPORTED_MODULE_0__["default"].CancelToken.source();
/**
 * Creates a cancelable axios 'request object'.
 *
 * @param {Function} request the axios promise request
 * @return {object}
 */


const CancelableRequest = function (request) {
  /**
   * Generate an axios cancel token
   */
  const cancelToken = createCancelToken();
  /**
   * Execute the request
   *
   * @param {string} url the url to send the request to
   * @param {object} [options] optional config for the request
   */

  const fetch = async function (url, options) {
    return request(url, Object.assign({
      cancelToken: cancelToken.token
    }, options));
  };

  return {
    request: fetch,
    cancel: cancelToken.cancel
  };
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CancelableRequest);

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/File.vue?vue&type=style&index=0&id=ab80f8a8&lang=scss&scoped=true&":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/File.vue?vue&type=style&index=0&id=ab80f8a8&lang=scss&scoped=true& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, ".file-container[data-v-ab80f8a8] {\n  background: var(--color-primary-light);\n  position: relative;\n  height: 100%;\n  width: 100%;\n  border: 2px solid var(--color-main-background);\n  box-sizing: border-box;\n}\n.file-container.selected[data-v-ab80f8a8]::after, .file-container[data-v-ab80f8a8]:focus-within::after {\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 2;\n  width: 100%;\n  height: 100%;\n  content: \"\";\n  outline: var(--color-primary) solid 4px;\n  outline-offset: -4px;\n  pointer-events: none;\n}\n.file-container:hover .selection-checkbox[data-v-ab80f8a8], .file-container.selected .selection-checkbox[data-v-ab80f8a8], .file-container:focus-within .selection-checkbox[data-v-ab80f8a8] {\n  display: flex;\n}\n.file-container .selection-checkbox[data-v-ab80f8a8] {\n  display: none;\n  position: absolute;\n  top: 8px;\n  right: min(22px, 50% - 7px);\n  z-index: 1;\n  width: fit-content;\n}\n.file-container .selection-checkbox[data-v-ab80f8a8]  .checkbox-radio-switch__label {\n  padding: 10px;\n  box-sizing: border-box;\n}\n.file-container .selection-checkbox[data-v-ab80f8a8]  .checkbox-radio-switch__label::after {\n  content: \"\";\n  background: var(--color-primary-light);\n  width: 16px;\n  height: 16px;\n  position: absolute;\n  left: 1px;\n  z-index: -1;\n}\n.file-container .selection-checkbox[data-v-ab80f8a8]  .checkbox-radio-switch__label .checkbox-radio-switch__icon {\n  margin: 0;\n}\n.file-container .selection-checkbox .input-label[data-v-ab80f8a8] {\n  position: fixed;\n  z-index: -1;\n  top: -5000px;\n  left: -5000px;\n}\n.file-container .file[data-v-ab80f8a8] {\n  width: 100%;\n  height: 100%;\n  box-sizing: border-box;\n}\n.file-container .file__images[data-v-ab80f8a8] {\n  display: contents;\n}\n.file-container .file__images .icon-video-white[data-v-ab80f8a8] {\n  position: absolute;\n  top: 10px;\n  right: 10px;\n  z-index: 20;\n}\n.file-container .file__images img[data-v-ab80f8a8] {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  position: absolute;\n  color: transparent;\n}\n.file-container .file__images .loading-overlay[data-v-ab80f8a8] {\n  position: absolute;\n  height: 100%;\n  width: 100%;\n  display: flex;\n  align-content: center;\n  align-items: center;\n  justify-content: center;\n}\n.file-container .file__images .loading-overlay svg[data-v-ab80f8a8] {\n  width: 70%;\n  height: 70%;\n}\n.file-container .file__hidden-description[data-v-ab80f8a8] {\n  position: absolute;\n  left: -10000px;\n  top: -10000px;\n  width: 1px;\n  height: 1px;\n  overflow: hidden;\n}\n.file-container .file__hidden-description.show[data-v-ab80f8a8] {\n  position: initial;\n  width: fit-content;\n  height: fit-content;\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/File.vue?vue&type=style&index=0&id=ab80f8a8&lang=scss&scoped=true&":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/File.vue?vue&type=style&index=0&id=ab80f8a8&lang=scss&scoped=true& ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_File_vue_vue_type_style_index_0_id_ab80f8a8_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./File.vue?vue&type=style&index=0&id=ab80f8a8&lang=scss&scoped=true& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/File.vue?vue&type=style&index=0&id=ab80f8a8&lang=scss&scoped=true&");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_File_vue_vue_type_style_index_0_id_ab80f8a8_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_File_vue_vue_type_style_index_0_id_ab80f8a8_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_File_vue_vue_type_style_index_0_id_ab80f8a8_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_File_vue_vue_type_style_index_0_id_ab80f8a8_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/components/File.vue":
/*!*********************************!*\
  !*** ./src/components/File.vue ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _File_vue_vue_type_template_id_ab80f8a8_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./File.vue?vue&type=template&id=ab80f8a8&scoped=true& */ "./src/components/File.vue?vue&type=template&id=ab80f8a8&scoped=true&");
/* harmony import */ var _File_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./File.vue?vue&type=script&lang=js& */ "./src/components/File.vue?vue&type=script&lang=js&");
/* harmony import */ var _File_vue_vue_type_style_index_0_id_ab80f8a8_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./File.vue?vue&type=style&index=0&id=ab80f8a8&lang=scss&scoped=true& */ "./src/components/File.vue?vue&type=style&index=0&id=ab80f8a8&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _File_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _File_vue_vue_type_template_id_ab80f8a8_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render,
  _File_vue_vue_type_template_id_ab80f8a8_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "ab80f8a8",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/components/File.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/components/File.vue?vue&type=script&lang=js&":
/*!**********************************************************!*\
  !*** ./src/components/File.vue?vue&type=script&lang=js& ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_File_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./File.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/File.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_File_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/components/File.vue?vue&type=style&index=0&id=ab80f8a8&lang=scss&scoped=true&":
/*!*******************************************************************************************!*\
  !*** ./src/components/File.vue?vue&type=style&index=0&id=ab80f8a8&lang=scss&scoped=true& ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_File_vue_vue_type_style_index_0_id_ab80f8a8_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/style-loader/dist/cjs.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./File.vue?vue&type=style&index=0&id=ab80f8a8&lang=scss&scoped=true& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/File.vue?vue&type=style&index=0&id=ab80f8a8&lang=scss&scoped=true&");


/***/ }),

/***/ "./src/components/File.vue?vue&type=template&id=ab80f8a8&scoped=true&":
/*!****************************************************************************!*\
  !*** ./src/components/File.vue?vue&type=template&id=ab80f8a8&scoped=true& ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_File_vue_vue_type_template_id_ab80f8a8_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_File_vue_vue_type_template_id_ab80f8a8_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_File_vue_vue_type_template_id_ab80f8a8_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./File.vue?vue&type=template&id=ab80f8a8&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/File.vue?vue&type=template&id=ab80f8a8&scoped=true&");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/File.vue?vue&type=template&id=ab80f8a8&scoped=true&":
/*!*******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/File.vue?vue&type=template&id=ab80f8a8&scoped=true& ***!
  \*******************************************************************************************************************************************************************************************************************/
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
    { staticClass: "file-container", class: { selected: _vm.selected } },
    [
      _c(
        "a",
        {
          staticClass: "file",
          attrs: { href: _vm.davPath, "aria-label": _vm.ariaLabel },
          on: {
            click: function ($event) {
              $event.preventDefault()
              return _vm.emitClick.apply(null, arguments)
            },
          },
        },
        [
          _vm.item.mime.includes("video") && _vm.item.hasPreview
            ? _c("div", { staticClass: "icon-video-white" })
            : _vm._e(),
          _vm._v(" "),
          _c("div", { staticClass: "file__images" }, [
            _vm.visibility !== "none" && _vm.canLoad && !_vm.error
              ? _c("img", {
                  key: _vm.item.basename + "-near",
                  ref: "imgNear",
                  attrs: {
                    src: _vm.srcNear,
                    alt: _vm.item.basename,
                    "aria-describedby": _vm.ariaDescription,
                  },
                  on: { load: _vm.onLoad, error: _vm.onError },
                })
              : _vm._e(),
            _vm._v(" "),
            _vm.visibility === "visible" && _vm.canLoad && !_vm.error
              ? _c("img", {
                  key: _vm.item.basename + "-visible",
                  ref: "imgVisible",
                  attrs: {
                    src: _vm.srcVisible,
                    alt: _vm.item.basename,
                    "aria-describedby": _vm.ariaDescription,
                  },
                  on: { load: _vm.onLoad, error: _vm.onError },
                })
              : _vm._e(),
          ]),
          _vm._v(" "),
          _c(
            "p",
            {
              staticClass: "file__hidden-description",
              class: { show: _vm.error },
              attrs: { id: _vm.ariaDescription },
            },
            [_vm._v(_vm._s(_vm.item.basename))]
          ),
        ]
      ),
      _vm._v(" "),
      _vm.allowSelection
        ? _c(
            "CheckboxRadioSwitch",
            {
              staticClass: "selection-checkbox",
              attrs: { checked: _vm.selected },
              on: { "update:checked": _vm.onToggle },
            },
            [
              _c("span", { staticClass: "input-label" }, [
                _vm._v(
                  _vm._s(
                    _vm.t("photos", "Select image {imageName}", {
                      imageName: _vm.item.basename,
                    })
                  )
                ),
              ]),
            ]
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
//# sourceMappingURL=photos-src_utils_CancelableRequest_js-src_components_File_vue.js.map?v=99d0252f27cd9940c61a