"use strict";
(self["webpackChunkphotos"] = self["webpackChunkphotos"] || []).push([["src_views_TagContent_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/TagContent.vue?vue&type=script&lang=js&":
/*!***************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/TagContent.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var vue_material_design_icons_ArrowLeft__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue-material-design-icons/ArrowLeft */ "./node_modules/vue-material-design-icons/ArrowLeft.vue");
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/vue */ "./node_modules/@nextcloud/vue/dist/index.module.js");
/* harmony import */ var _components_File_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/File.vue */ "./src/components/File.vue");
/* harmony import */ var _components_FilesListViewer_vue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/FilesListViewer.vue */ "./src/components/FilesListViewer.vue");
/* harmony import */ var _utils_semaphoreWithPriority_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/semaphoreWithPriority.js */ "./src/utils/semaphoreWithPriority.js");
/* harmony import */ var _mixins_FilesSelectionMixin_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../mixins/FilesSelectionMixin.js */ "./src/mixins/FilesSelectionMixin.js");
/* harmony import */ var _mixins_AbortControllerMixin_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../mixins/AbortControllerMixin.js */ "./src/mixins/AbortControllerMixin.js");
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
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
  name: 'TagContent',
  components: {
    File: _components_File_vue__WEBPACK_IMPORTED_MODULE_2__["default"],
    FilesListViewer: _components_FilesListViewer_vue__WEBPACK_IMPORTED_MODULE_3__["default"],
    NcEmptyContent: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_1__.NcEmptyContent,
    NcActions: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_1__.NcActions,
    NcActionButton: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_1__.NcActionButton,
    NcLoadingIcon: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_1__.NcLoadingIcon,
    ArrowLeft: vue_material_design_icons_ArrowLeft__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  mixins: [_nextcloud_vue__WEBPACK_IMPORTED_MODULE_1__.isMobile, _mixins_FilesSelectionMixin_js__WEBPACK_IMPORTED_MODULE_5__["default"], _mixins_AbortControllerMixin_js__WEBPACK_IMPORTED_MODULE_6__["default"]],
  props: {
    path: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      error: null,
      loading: false,
      semaphore: new _utils_semaphoreWithPriority_js__WEBPACK_IMPORTED_MODULE_4__["default"](30),
      appContent: document.getElementById('app-content-vue')
    };
  },

  computed: { // global lists
    ...(0,vuex__WEBPACK_IMPORTED_MODULE_7__.mapGetters)(['files', 'tags', 'tagsNames']),

    // current tag id from current path
    tagId() {
      return this.$store.getters.tagId(this.path);
    },

    // current tag
    tag() {
      return this.tags[this.tagId];
    },

    // files list of the current tag
    fileIds() {
      return this.tag ? this.tag.files : [];
    },

    isEmpty() {
      return this.fileIds.length === 0;
    }

  },
  watch: {
    async path() {
      this.fetchContent();
    }

  },

  async beforeMount() {
    this.fetchContent();
  },

  methods: {
    async fetchContent() {
      // close any potential opened viewer
      OCA.Viewer.close();
      this.loading = true;
      this.error = null;

      try {
        // if we don't already have some cached data let's show a loader
        if (!this.tags[this.tagId]) {
          await this.$store.dispatch('fetchAllTags', {
            signal: this.abortController.signal
          });
        }

        await this.$store.dispatch('fetchTagFiles', {
          id: this.tagId,
          signal: this.abortController.signal
        });
      } catch (error) {
        console.error(error);
        this.error = true;
      } finally {
        // done loading
        this.loading = false;
      }
    },

    openViewer(fileId) {
      const file = this.files[fileId];
      OCA.Viewer.open({
        path: file.filename,
        list: this.fileIds.map(fileId => this.files[fileId]),
        loadMore: file.loadMore ? async () => await file.loadMore(true) : () => [],
        canLoop: file.canLoop
      });
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

  data() {
    return {
      abortController: new AbortController()
    };
  },

  beforeDestroy() {
    this.abortController.abort();
  },

  beforeRouteLeave(from, to, next) {
    this.abortController.abort();
    this.abortController = new AbortController();
    next();
  }

});

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/TagContent.vue?vue&type=style&index=0&id=5f4f85b9&scoped=true&lang=scss&":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/TagContent.vue?vue&type=style&index=0&id=5f4f85b9&scoped=true&lang=scss& ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, ".loader[data-v-5f4f85b9] {\n  margin-top: 30vh;\n}\n.photos-navigation[data-v-5f4f85b9] {\n  display: flex;\n  height: 44px;\n  padding: 0 40px;\n  align-items: center;\n  max-width: 100%;\n}\n.photos-navigation h2[data-v-5f4f85b9] {\n  padding: 0;\n  margin: 0;\n}\n.heading-subline[data-v-5f4f85b9] {\n  margin-left: 85px;\n  margin-top: -11px;\n  color: var(--color-text-maxcontrast);\n}\n.tag__photos[data-v-5f4f85b9] {\n  padding: 0 64px;\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/TagContent.vue?vue&type=style&index=0&id=5f4f85b9&scoped=true&lang=scss&":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/TagContent.vue?vue&type=style&index=0&id=5f4f85b9&scoped=true&lang=scss& ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_TagContent_vue_vue_type_style_index_0_id_5f4f85b9_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./TagContent.vue?vue&type=style&index=0&id=5f4f85b9&scoped=true&lang=scss& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/TagContent.vue?vue&type=style&index=0&id=5f4f85b9&scoped=true&lang=scss&");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_TagContent_vue_vue_type_style_index_0_id_5f4f85b9_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_TagContent_vue_vue_type_style_index_0_id_5f4f85b9_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_TagContent_vue_vue_type_style_index_0_id_5f4f85b9_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_TagContent_vue_vue_type_style_index_0_id_5f4f85b9_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/views/TagContent.vue":
/*!**********************************!*\
  !*** ./src/views/TagContent.vue ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _TagContent_vue_vue_type_template_id_5f4f85b9_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TagContent.vue?vue&type=template&id=5f4f85b9&scoped=true& */ "./src/views/TagContent.vue?vue&type=template&id=5f4f85b9&scoped=true&");
/* harmony import */ var _TagContent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TagContent.vue?vue&type=script&lang=js& */ "./src/views/TagContent.vue?vue&type=script&lang=js&");
/* harmony import */ var _TagContent_vue_vue_type_style_index_0_id_5f4f85b9_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TagContent.vue?vue&type=style&index=0&id=5f4f85b9&scoped=true&lang=scss& */ "./src/views/TagContent.vue?vue&type=style&index=0&id=5f4f85b9&scoped=true&lang=scss&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _TagContent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _TagContent_vue_vue_type_template_id_5f4f85b9_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render,
  _TagContent_vue_vue_type_template_id_5f4f85b9_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "5f4f85b9",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/views/TagContent.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/views/TagContent.vue?vue&type=script&lang=js&":
/*!***********************************************************!*\
  !*** ./src/views/TagContent.vue?vue&type=script&lang=js& ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_TagContent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./TagContent.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/TagContent.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_TagContent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/views/TagContent.vue?vue&type=style&index=0&id=5f4f85b9&scoped=true&lang=scss&":
/*!********************************************************************************************!*\
  !*** ./src/views/TagContent.vue?vue&type=style&index=0&id=5f4f85b9&scoped=true&lang=scss& ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_TagContent_vue_vue_type_style_index_0_id_5f4f85b9_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/style-loader/dist/cjs.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./TagContent.vue?vue&type=style&index=0&id=5f4f85b9&scoped=true&lang=scss& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/TagContent.vue?vue&type=style&index=0&id=5f4f85b9&scoped=true&lang=scss&");


/***/ }),

/***/ "./src/views/TagContent.vue?vue&type=template&id=5f4f85b9&scoped=true&":
/*!*****************************************************************************!*\
  !*** ./src/views/TagContent.vue?vue&type=template&id=5f4f85b9&scoped=true& ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TagContent_vue_vue_type_template_id_5f4f85b9_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TagContent_vue_vue_type_template_id_5f4f85b9_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TagContent_vue_vue_type_template_id_5f4f85b9_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./TagContent.vue?vue&type=template&id=5f4f85b9&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/TagContent.vue?vue&type=template&id=5f4f85b9&scoped=true&");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/TagContent.vue?vue&type=template&id=5f4f85b9&scoped=true&":
/*!********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/TagContent.vue?vue&type=template&id=5f4f85b9&scoped=true& ***!
  \********************************************************************************************************************************************************************************************************************/
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
  return _vm.error
    ? _c("NcEmptyContent", {
        attrs: { title: _vm.t("photos", "An error occurred") },
      })
    : _vm.loading
    ? _c("NcLoadingIcon", { staticClass: "loader" })
    : _c(
        "div",
        [
          _c(
            "div",
            { staticClass: "photos-navigation" },
            [
              _c(
                "NcActions",
                { staticClass: "photos-navigation__back" },
                [
                  _c(
                    "NcActionButton",
                    {
                      on: {
                        click: function ($event) {
                          return _vm.$router.push({ name: "tags" })
                        },
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "icon",
                          fn: function () {
                            return [_c("ArrowLeft")]
                          },
                          proxy: true,
                        },
                      ]),
                    },
                    [
                      _vm._v(
                        "\n\t\t\t\t" +
                          _vm._s(_vm.t("photos", "Back to tags overview")) +
                          "\n\t\t\t"
                      ),
                    ]
                  ),
                ],
                1
              ),
              _vm._v(" "),
              _c("h2", { staticClass: "photos-navigation__title" }, [
                _vm._v("\n\t\t\t" + _vm._s(_vm.path) + "\n\t\t"),
              ]),
            ],
            1
          ),
          _vm._v(" "),
          _c("div", { staticClass: "heading-subline" }, [
            _vm._v(
              "\n\t\t" +
                _vm._s(
                  _vm.n("photos", "%n photo", "%n photos", _vm.fileIds.length)
                ) +
                "\n\t"
            ),
          ]),
          _vm._v(" "),
          _vm.isEmpty
            ? _c("NcEmptyContent", {
                attrs: {
                  title: _vm.t("photos", "No photos with this tag yet"),
                },
              })
            : _vm._e(),
          _vm._v(" "),
          _c("FilesListViewer", {
            staticClass: "tag__photos",
            attrs: {
              "container-element": _vm.appContent,
              "file-ids": _vm.fileIds,
              "base-height": _vm.isMobile ? 120 : 200,
              loading: _vm.loading,
            },
            scopedSlots: _vm._u([
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
            ]),
          }),
        ],
        1
      )
}
var staticRenderFns = []
render._withStripped = true



/***/ })

}]);
//# sourceMappingURL=photos-src_views_TagContent_vue.js.map?v=abe35a8923781d089a65