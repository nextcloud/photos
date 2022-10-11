(self["webpackChunkphotos"] = self["webpackChunkphotos"] || []).push([["src_components_FilesPicker_vue"],{

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
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/vue */ "./node_modules/@nextcloud/vue/dist/index.module.js");
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
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
    dateMonthAndYear(date) {
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
      default: () => []
    },
    // Whether we should disable the submit button and show a spinner.
    loading: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      allowedMimes: _services_AllowedMimes_js__WEBPACK_IMPORTED_MODULE_10__["default"],
      targetMonth: null,
      uploadContext: {
        route: 'albumpicker'
      }
    };
  },

  computed: { ...(0,vuex__WEBPACK_IMPORTED_MODULE_11__.mapGetters)(['files'])
  },
  watch: {
    monthsList(value) {
      if (this.targetMonth === null) {
        this.targetMonth = value[0];
      }
    }

  },
  methods: {
    getFiles() {
      this.fetchFiles('', {}, this.blacklistIds);
    },

    emitPickedEvent() {
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
    fileIdsByMonth() {
      const filesByMonth = {};

      for (const fileId of this.fetchedFileIds) {
        const file = this.files[fileId];
        filesByMonth[file.month] = filesByMonth[file.month] ?? [];
        filesByMonth[file.month].push(file.fileid);
      } // Sort files in sections.


      Object.keys(filesByMonth).forEach(month => filesByMonth[month].sort(this.sortFilesByTimestamp));
      return filesByMonth;
    },

    /**
     * @return {string[]}
     */
    monthsList() {
      return Object.keys(this.fileIdsByMonth).sort((month1, month2) => month1 > month2 ? -1 : 1);
    }

  }
});

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

/***/ "./src/components/FilesPicker.vue?vue&type=style&index=0&id=10d87d65&lang=scss&scoped=true&":
/*!**************************************************************************************************!*\
  !*** ./src/components/FilesPicker.vue?vue&type=style&index=0&id=10d87d65&lang=scss&scoped=true& ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FilesPicker_vue_vue_type_style_index_0_id_10d87d65_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/style-loader/dist/cjs.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FilesPicker.vue?vue&type=style&index=0&id=10d87d65&lang=scss&scoped=true& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FilesPicker.vue?vue&type=style&index=0&id=10d87d65&lang=scss&scoped=true&");


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
              "There are no photos or videos yet!"
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
//# sourceMappingURL=photos-src_components_FilesPicker_vue.js.map?v=43024ef169ccf568519e