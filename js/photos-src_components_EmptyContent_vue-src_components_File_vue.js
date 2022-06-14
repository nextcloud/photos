(self["webpackChunkphotos"] = self["webpackChunkphotos"] || []).push([["src_components_EmptyContent_vue-src_components_File_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/EmptyContent.vue?vue&type=script&lang=js&":
/*!**********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/EmptyContent.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* provided dependency */ var console = __webpack_require__(/*! ./node_modules/console-browserify/index.js */ "./node_modules/console-browserify/index.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
  name: 'EmptyContent',
  props: {
    illustrationName: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      illustration: ''
    };
  },

  computed: {
    /**
     * Does this component have an illustration
     *
     * @return {boolean}
     */
    haveIllustration() {
      return this.illustrationName !== '';
    },

    /**
     * Is the illustration loaded
     *
     * @return {boolean}
     */
    isLoaded() {
      if (!this.haveIllustration) {
        return true;
      }

      return this.illustration !== '';
    },

    /**
     * The component is ready if the illustration
     * is done loading or if there is none
     *
     * @return {boolean}
     */
    isReady() {
      return !this.haveIllustration || this.haveIllustration && this.isLoaded;
    }

  },

  /**
   * Fetch the new illustration as soon as it changes
   */
  watch: {
    illustrationName() {
      this.getIllustration();
    }

  },

  beforeMount() {
    this.getIllustration();
  },

  methods: {
    /**
     * Fetch the illustration as webpack chunk
     */
    async getIllustration() {
      this.illustration = '';

      if (this.illustrationName !== '') {
        try {
          const illustration = await __webpack_require__("./src/assets/Illustrations lazy recursive ^\\.\\/.*\\.svg$")(`./${this.illustrationName}.svg`);
          this.illustration = illustration.default;
        } catch (error) {
          console.error('Could not get the error illustration', error);
        }
      }
    }

  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/File.vue?vue&type=script&lang=js&":
/*!**************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/File.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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
      this.$emit('on-click', this.item.fileid);
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

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/EmptyContent.vue?vue&type=style&index=0&lang=scss&":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/EmptyContent.vue?vue&type=style&index=0&lang=scss& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, ".emptycontent {\n  grid-column: 1/-1;\n  margin-top: 20vh;\n}\n.illustration {\n  min-width: 200px;\n  max-width: 15%;\n  width: 300px;\n  margin: auto;\n  margin-bottom: 20px;\n  position: relative;\n}\n.illustration svg {\n  width: 100%;\n  height: 100%;\n  max-height: 40vh;\n}\n.illustration [fill*=\"6c63ff\"] {\n  fill: var(--color-primary-element);\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/File.vue?vue&type=style&index=0&id=ab80f8a8&lang=scss&scoped=true&":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/File.vue?vue&type=style&index=0&id=ab80f8a8&lang=scss&scoped=true& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, "@charset \"UTF-8\";\n/**\n * @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>\n *\n * @author John Molakvoæ <skjnldsv@protonmail.com>\n *\n * @license AGPL-3.0-or-later\n *\n * This program is free software: you can redistribute it and/or modify\n * it under the terms of the GNU Affero General Public License as\n * published by the Free Software Foundation, either version 3 of the\n * License, or (at your option) any later version.\n *\n * This program is distributed in the hope that it will be useful,\n * but WITHOUT ANY WARRANTY; without even the implied warranty of\n * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the\n * GNU Affero General Public License for more details.\n *\n * You should have received a copy of the GNU Affero General Public License\n * along with this program. If not, see <http://www.gnu.org/licenses/>.\n *\n */\n.file[data-v-ab80f8a8],\n.folder[data-v-ab80f8a8] {\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  -webkit-user-select: none;\n          user-select: none;\n  border-radius: var(--border-radius);\n  overflow: hidden;\n}\n.file .cover[data-v-ab80f8a8],\n.folder .cover[data-v-ab80f8a8] {\n  z-index: 2;\n  width: 100%;\n  padding-bottom: 100%;\n  transition: opacity var(--animation-quick) ease-in-out;\n  opacity: 0;\n  background-color: var(--color-main-text);\n}\n.file.active .cover[data-v-ab80f8a8], .file:active .cover[data-v-ab80f8a8], .file:hover .cover[data-v-ab80f8a8], .file:focus .cover[data-v-ab80f8a8],\n.folder.active .cover[data-v-ab80f8a8],\n.folder:active .cover[data-v-ab80f8a8],\n.folder:hover .cover[data-v-ab80f8a8],\n.folder:focus .cover[data-v-ab80f8a8] {\n  opacity: 0.3;\n}\n.file--clear.active .cover[data-v-ab80f8a8], .file--clear:active .cover[data-v-ab80f8a8], .file--clear:hover .cover[data-v-ab80f8a8], .file--clear:focus .cover[data-v-ab80f8a8],\n.folder--clear.active .cover[data-v-ab80f8a8],\n.folder--clear:active .cover[data-v-ab80f8a8],\n.folder--clear:hover .cover[data-v-ab80f8a8],\n.folder--clear:focus .cover[data-v-ab80f8a8] {\n  opacity: 0.1;\n}\n.fade-enter-active[data-v-ab80f8a8], .fade-leave-active[data-v-ab80f8a8] {\n  transition: opacity var(--animation-quick) ease-in-out;\n}\n.fade-enter[data-v-ab80f8a8], .fade-leave-to[data-v-ab80f8a8] {\n  opacity: 0;\n}\n.file-container[data-v-ab80f8a8] {\n  background: lightgray;\n  position: relative;\n  border: 2px solid var(--color-main-background);\n  box-sizing: border-box;\n}\n.file-container.selected[data-v-ab80f8a8]::after {\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 2;\n  width: 100%;\n  height: 100%;\n  content: \"\";\n  outline: var(--color-primary) solid 4px;\n  outline-offset: -4px;\n  pointer-events: none;\n}\n.file-container:hover .selection-checkbox[data-v-ab80f8a8], .file-container.selected .selection-checkbox[data-v-ab80f8a8] {\n  display: flex;\n}\n.file-container .selection-checkbox[data-v-ab80f8a8] {\n  display: none;\n  position: absolute;\n  top: 8px;\n  right: min(22px, 50% - 7px);\n  z-index: 1;\n  width: fit-content;\n}\n.file-container .selection-checkbox[data-v-ab80f8a8]  .checkbox-radio-switch__label {\n  padding: 10px;\n}\n.file-container .selection-checkbox[data-v-ab80f8a8]  .checkbox-radio-switch__label::after {\n  content: \"\";\n  background: var(--color-primary-light);\n  width: 16px;\n  height: 16px;\n  position: absolute;\n  left: 1px;\n  z-index: -1;\n}\n.file-container .selection-checkbox[data-v-ab80f8a8]  .checkbox-radio-switch__label .checkbox-radio-switch__icon {\n  margin: 0;\n}\n.file-container a[data-v-ab80f8a8] {\n  width: 100%;\n  height: 100%;\n  box-sizing: border-box;\n  border-radius: 0;\n}\n.file-container a .images-container[data-v-ab80f8a8] {\n  display: contents;\n}\n.file-container a .images-container .icon-video-white[data-v-ab80f8a8] {\n  position: absolute;\n  top: 10px;\n  right: 10px;\n  z-index: 20;\n}\n.file-container a .images-container img[data-v-ab80f8a8] {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  position: absolute;\n}\n.file-container a .images-container .loading-overlay[data-v-ab80f8a8] {\n  position: absolute;\n  height: 100%;\n  width: 100%;\n  display: flex;\n  align-content: center;\n  align-items: center;\n  justify-content: center;\n}\n.file-container a .images-container .loading-overlay svg[data-v-ab80f8a8] {\n  width: 70%;\n  height: 70%;\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/EmptyContent.vue?vue&type=style&index=0&lang=scss&":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/EmptyContent.vue?vue&type=style&index=0&lang=scss& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_EmptyContent_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./EmptyContent.vue?vue&type=style&index=0&lang=scss& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/EmptyContent.vue?vue&type=style&index=0&lang=scss&");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_EmptyContent_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_EmptyContent_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_EmptyContent_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_EmptyContent_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/File.vue?vue&type=style&index=0&id=ab80f8a8&lang=scss&scoped=true&":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/File.vue?vue&type=style&index=0&id=ab80f8a8&lang=scss&scoped=true& ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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

/***/ "./src/components/EmptyContent.vue":
/*!*****************************************!*\
  !*** ./src/components/EmptyContent.vue ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _EmptyContent_vue_vue_type_template_id_6c3ea49c___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EmptyContent.vue?vue&type=template&id=6c3ea49c& */ "./src/components/EmptyContent.vue?vue&type=template&id=6c3ea49c&");
/* harmony import */ var _EmptyContent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EmptyContent.vue?vue&type=script&lang=js& */ "./src/components/EmptyContent.vue?vue&type=script&lang=js&");
/* harmony import */ var _EmptyContent_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./EmptyContent.vue?vue&type=style&index=0&lang=scss& */ "./src/components/EmptyContent.vue?vue&type=style&index=0&lang=scss&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _EmptyContent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _EmptyContent_vue_vue_type_template_id_6c3ea49c___WEBPACK_IMPORTED_MODULE_0__.render,
  _EmptyContent_vue_vue_type_template_id_6c3ea49c___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/components/EmptyContent.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/components/File.vue":
/*!*********************************!*\
  !*** ./src/components/File.vue ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

/***/ "./src/components/EmptyContent.vue?vue&type=script&lang=js&":
/*!******************************************************************!*\
  !*** ./src/components/EmptyContent.vue?vue&type=script&lang=js& ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_EmptyContent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./EmptyContent.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/EmptyContent.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_EmptyContent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/components/File.vue?vue&type=script&lang=js&":
/*!**********************************************************!*\
  !*** ./src/components/File.vue?vue&type=script&lang=js& ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_File_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./File.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/File.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_File_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/components/EmptyContent.vue?vue&type=style&index=0&lang=scss&":
/*!***************************************************************************!*\
  !*** ./src/components/EmptyContent.vue?vue&type=style&index=0&lang=scss& ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_EmptyContent_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/style-loader/dist/cjs.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./EmptyContent.vue?vue&type=style&index=0&lang=scss& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/EmptyContent.vue?vue&type=style&index=0&lang=scss&");


/***/ }),

/***/ "./src/components/File.vue?vue&type=style&index=0&id=ab80f8a8&lang=scss&scoped=true&":
/*!*******************************************************************************************!*\
  !*** ./src/components/File.vue?vue&type=style&index=0&id=ab80f8a8&lang=scss&scoped=true& ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_File_vue_vue_type_style_index_0_id_ab80f8a8_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/style-loader/dist/cjs.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./File.vue?vue&type=style&index=0&id=ab80f8a8&lang=scss&scoped=true& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/File.vue?vue&type=style&index=0&id=ab80f8a8&lang=scss&scoped=true&");


/***/ }),

/***/ "./src/components/EmptyContent.vue?vue&type=template&id=6c3ea49c&":
/*!************************************************************************!*\
  !*** ./src/components/EmptyContent.vue?vue&type=template&id=6c3ea49c& ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_EmptyContent_vue_vue_type_template_id_6c3ea49c___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_EmptyContent_vue_vue_type_template_id_6c3ea49c___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_EmptyContent_vue_vue_type_template_id_6c3ea49c___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./EmptyContent.vue?vue&type=template&id=6c3ea49c& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/EmptyContent.vue?vue&type=template&id=6c3ea49c&");


/***/ }),

/***/ "./src/components/File.vue?vue&type=template&id=ab80f8a8&scoped=true&":
/*!****************************************************************************!*\
  !*** ./src/components/File.vue?vue&type=template&id=ab80f8a8&scoped=true& ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_File_vue_vue_type_template_id_ab80f8a8_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_File_vue_vue_type_template_id_ab80f8a8_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_File_vue_vue_type_template_id_ab80f8a8_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./File.vue?vue&type=template&id=ab80f8a8&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/File.vue?vue&type=template&id=ab80f8a8&scoped=true&");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/EmptyContent.vue?vue&type=template&id=6c3ea49c&":
/*!***************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/EmptyContent.vue?vue&type=template&id=6c3ea49c& ***!
  \***************************************************************************************************************************************************************************************************************/
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
  return _vm.isReady
    ? _c("div", { staticClass: "emptycontent" }, [
        _vm.haveIllustration
          ? _c("div", {
              staticClass: "illustration",
              domProps: { innerHTML: _vm._s(_vm.illustration) },
            })
          : _c("div", { staticClass: "icon-error" }),
        _vm._v(" "),
        _c("h2", [_vm._t("default")], 2),
        _vm._v(" "),
        _c(
          "p",
          {
            directives: [
              {
                name: "show",
                rawName: "v-show",
                value: _vm.$slots.desc,
                expression: "$slots.desc",
              },
            ],
          },
          [_vm._t("desc")],
          2
        ),
      ])
    : _vm._e()
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/File.vue?vue&type=template&id=ab80f8a8&scoped=true&":
/*!*******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/File.vue?vue&type=template&id=ab80f8a8&scoped=true& ***!
  \*******************************************************************************************************************************************************************************************************************/
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
    "div",
    { staticClass: "file-container", class: { selected: _vm.selected } },
    [
      _vm.allowSelection
        ? _c("CheckboxRadioSwitch", {
            staticClass: "selection-checkbox",
            attrs: { checked: _vm.selected },
            on: { "update:checked": _vm.onToggle },
          })
        : _vm._e(),
      _vm._v(" "),
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
          _c("div", { staticClass: "images-container" }, [
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
            _vm._v(" "),
            _vm.visibility === "none" || !_vm.loaded || _vm.error
              ? _c(
                  "div",
                  {
                    key: _vm.item.basename + "-placeholder",
                    staticClass: "loading-overlay",
                  },
                  [
                    _c(
                      "svg",
                      {
                        attrs: {
                          xmlns: "http://www.w3.org/2000/svg",
                          viewBox: "0 0 32 32",
                          fill: "url(#placeholder__gradient)",
                        },
                      },
                      [
                        _vm.isImage
                          ? _c("use", { attrs: { href: "#placeholder--img" } })
                          : _c("use", {
                              attrs: { href: "#placeholder--video" },
                            }),
                      ]
                    ),
                  ]
                )
              : _vm._e(),
          ]),
          _vm._v(" "),
          _c(
            "p",
            {
              staticClass: "hidden-visually",
              attrs: { id: _vm.ariaDescription },
            },
            [_vm._v(_vm._s(_vm.item.basename))]
          ),
        ]
      ),
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./src/assets/Illustrations lazy recursive ^\\.\\/.*\\.svg$":
/*!***********************************************************************!*\
  !*** ./src/assets/Illustrations/ lazy ^\.\/.*\.svg$ namespace object ***!
  \***********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./empty.svg": [
		"./src/assets/Illustrations/empty.svg",
		"src_assets_Illustrations_empty_svg"
	],
	"./folder.svg": [
		"./src/assets/Illustrations/folder.svg",
		"src_assets_Illustrations_folder_svg"
	],
	"./images.svg": [
		"./src/assets/Illustrations/images.svg",
		"src_assets_Illustrations_images_svg"
	]
};
function webpackAsyncContext(req) {
	if(!__webpack_require__.o(map, req)) {
		return Promise.resolve().then(() => {
			var e = new Error("Cannot find module '" + req + "'");
			e.code = 'MODULE_NOT_FOUND';
			throw e;
		});
	}

	var ids = map[req], id = ids[0];
	return __webpack_require__.e(ids[1]).then(() => {
		return __webpack_require__.t(id, 1 | 16);
	});
}
webpackAsyncContext.keys = () => (Object.keys(map));
webpackAsyncContext.id = "./src/assets/Illustrations lazy recursive ^\\.\\/.*\\.svg$";
module.exports = webpackAsyncContext;

/***/ })

}]);
//# sourceMappingURL=photos-src_components_EmptyContent_vue-src_components_File_vue.js.map?v=7befebc12ab3bed69983