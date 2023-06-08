"use strict";
(self["webpackChunkphotos"] = self["webpackChunkphotos"] || []).push([["src_views_Faces_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/Faces.vue?vue&type=script&lang=js&":
/*!**********************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/Faces.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vue_material_design_icons_AccountBoxMultipleOutline__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue-material-design-icons/AccountBoxMultipleOutline */ "./node_modules/vue-material-design-icons/AccountBoxMultipleOutline.vue");
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/vue */ "./node_modules/@nextcloud/vue/dist/ncvuecomponents.js");
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_vue__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _mixins_FetchFacesMixin_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../mixins/FetchFacesMixin.js */ "./src/mixins/FetchFacesMixin.js");
/* harmony import */ var _components_FaceCover_vue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/FaceCover.vue */ "./src/components/FaceCover.vue");
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
  name: 'Faces',
  components: {
    FaceCover: _components_FaceCover_vue__WEBPACK_IMPORTED_MODULE_3__["default"],
    NcEmptyContent: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_1__.NcEmptyContent,
    NcLoadingIcon: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_1__.NcLoadingIcon,
    AccountBoxMultipleOutline: vue_material_design_icons_AccountBoxMultipleOutline__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  mixins: [_mixins_FetchFacesMixin_js__WEBPACK_IMPORTED_MODULE_2__["default"]],
  computed: { ...(0,vuex__WEBPACK_IMPORTED_MODULE_4__.mapGetters)(['facesFiles']),

    /**
     * @return {boolean} Whether the list of face is empty or not.
     */
    noFaces() {
      return Object.keys(this.faces).length === 0;
    },

    orderedFaces() {
      return Object.values(this.faces).sort((a, b) => {
        if (a.props.nbItems && b.props.nbItems) {
          return b.props.nbItems - a.props.nbItems;
        }

        if (!this.facesFiles[b.basename] || !this.facesFiles[a.basename]) {
          return 0;
        }

        return this.facesFiles[b.basename].length - this.facesFiles[a.basename].length;
      });
    }

  }
});

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/Faces.vue?vue&type=style&index=0&id=2a2a1e28&lang=scss&scoped=true&":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/Faces.vue?vue&type=style&index=0&id=2a2a1e28&lang=scss&scoped=true& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, ".faces[data-v-2a2a1e28] {\n  display: flex;\n  flex-direction: column;\n  height: calc(100vh - var(--header-height));\n  padding-left: 64px;\n}\n@media only screen and (max-width: 1020px) {\n.faces[data-v-2a2a1e28] {\n    padding: 0;\n}\n}\n.faces__header[data-v-2a2a1e28] {\n  display: flex;\n  min-height: 60px;\n  align-items: center;\n}\n.faces__header button[data-v-2a2a1e28] {\n  margin-right: 32px;\n}\n.faces__list[data-v-2a2a1e28] {\n  padding-top: 24px;\n  padding-bottom: 32px;\n  flex-grow: 1;\n  display: flex;\n  flex-wrap: wrap;\n  gap: 32px;\n  align-content: flex-start;\n}\n.faces__empty[data-v-2a2a1e28] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n.faces__empty__button[data-v-2a2a1e28] {\n  margin-top: 32px;\n}\n.empty-content-with-illustration[data-v-2a2a1e28]  .empty-content__icon {\n  width: 200px;\n  height: 200px;\n}\n.empty-content-with-illustration[data-v-2a2a1e28]  .empty-content__icon svg {\n  width: 200px;\n  height: 200px;\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/Faces.vue?vue&type=style&index=0&id=2a2a1e28&lang=scss&scoped=true&":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/Faces.vue?vue&type=style&index=0&id=2a2a1e28&lang=scss&scoped=true& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Faces_vue_vue_type_style_index_0_id_2a2a1e28_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Faces.vue?vue&type=style&index=0&id=2a2a1e28&lang=scss&scoped=true& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/Faces.vue?vue&type=style&index=0&id=2a2a1e28&lang=scss&scoped=true&");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Faces_vue_vue_type_style_index_0_id_2a2a1e28_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Faces_vue_vue_type_style_index_0_id_2a2a1e28_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Faces_vue_vue_type_style_index_0_id_2a2a1e28_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Faces_vue_vue_type_style_index_0_id_2a2a1e28_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/vue-material-design-icons/AccountBoxMultipleOutline.vue":
/*!******************************************************************************!*\
  !*** ./node_modules/vue-material-design-icons/AccountBoxMultipleOutline.vue ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _AccountBoxMultipleOutline_vue_vue_type_template_id_43a3bd50___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AccountBoxMultipleOutline.vue?vue&type=template&id=43a3bd50& */ "./node_modules/vue-material-design-icons/AccountBoxMultipleOutline.vue?vue&type=template&id=43a3bd50&");
/* harmony import */ var _AccountBoxMultipleOutline_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AccountBoxMultipleOutline.vue?vue&type=script&lang=js& */ "./node_modules/vue-material-design-icons/AccountBoxMultipleOutline.vue?vue&type=script&lang=js&");
/* harmony import */ var _vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _AccountBoxMultipleOutline_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _AccountBoxMultipleOutline_vue_vue_type_template_id_43a3bd50___WEBPACK_IMPORTED_MODULE_0__.render,
  _AccountBoxMultipleOutline_vue_vue_type_template_id_43a3bd50___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "node_modules/vue-material-design-icons/AccountBoxMultipleOutline.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/vue-material-design-icons/AccountBoxMultipleOutline.vue?vue&type=script&lang=js&":
/*!******************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/vue-material-design-icons/AccountBoxMultipleOutline.vue?vue&type=script&lang=js& ***!
  \******************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
//
//
//
//
//
//
//
//
//
//
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
  name: "AccountBoxMultipleOutlineIcon",
  emits: ['click'],
  props: {
    title: {
      type: String,
    },
    fillColor: {
      type: String,
      default: "currentColor"
    },
    size: {
      type: Number,
      default: 24
    }
  }
});


/***/ }),

/***/ "./src/views/Faces.vue":
/*!*****************************!*\
  !*** ./src/views/Faces.vue ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Faces_vue_vue_type_template_id_2a2a1e28_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Faces.vue?vue&type=template&id=2a2a1e28&scoped=true& */ "./src/views/Faces.vue?vue&type=template&id=2a2a1e28&scoped=true&");
/* harmony import */ var _Faces_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Faces.vue?vue&type=script&lang=js& */ "./src/views/Faces.vue?vue&type=script&lang=js&");
/* harmony import */ var _Faces_vue_vue_type_style_index_0_id_2a2a1e28_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Faces.vue?vue&type=style&index=0&id=2a2a1e28&lang=scss&scoped=true& */ "./src/views/Faces.vue?vue&type=style&index=0&id=2a2a1e28&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _Faces_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _Faces_vue_vue_type_template_id_2a2a1e28_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render,
  _Faces_vue_vue_type_template_id_2a2a1e28_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "2a2a1e28",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/views/Faces.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/views/Faces.vue?vue&type=script&lang=js&":
/*!******************************************************!*\
  !*** ./src/views/Faces.vue?vue&type=script&lang=js& ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Faces_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Faces.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/Faces.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Faces_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/views/Faces.vue?vue&type=style&index=0&id=2a2a1e28&lang=scss&scoped=true&":
/*!***************************************************************************************!*\
  !*** ./src/views/Faces.vue?vue&type=style&index=0&id=2a2a1e28&lang=scss&scoped=true& ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Faces_vue_vue_type_style_index_0_id_2a2a1e28_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/style-loader/dist/cjs.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Faces.vue?vue&type=style&index=0&id=2a2a1e28&lang=scss&scoped=true& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/Faces.vue?vue&type=style&index=0&id=2a2a1e28&lang=scss&scoped=true&");


/***/ }),

/***/ "./node_modules/vue-material-design-icons/AccountBoxMultipleOutline.vue?vue&type=script&lang=js&":
/*!*******************************************************************************************************!*\
  !*** ./node_modules/vue-material-design-icons/AccountBoxMultipleOutline.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _vue_loader_lib_index_js_vue_loader_options_AccountBoxMultipleOutline_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../vue-loader/lib/index.js??vue-loader-options!./AccountBoxMultipleOutline.vue?vue&type=script&lang=js& */ "./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/vue-material-design-icons/AccountBoxMultipleOutline.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_vue_loader_lib_index_js_vue_loader_options_AccountBoxMultipleOutline_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./node_modules/vue-material-design-icons/AccountBoxMultipleOutline.vue?vue&type=template&id=43a3bd50&":
/*!*************************************************************************************************************!*\
  !*** ./node_modules/vue-material-design-icons/AccountBoxMultipleOutline.vue?vue&type=template&id=43a3bd50& ***!
  \*************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _vue_loader_lib_loaders_templateLoader_js_vue_loader_options_vue_loader_lib_index_js_vue_loader_options_AccountBoxMultipleOutline_vue_vue_type_template_id_43a3bd50___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _vue_loader_lib_loaders_templateLoader_js_vue_loader_options_vue_loader_lib_index_js_vue_loader_options_AccountBoxMultipleOutline_vue_vue_type_template_id_43a3bd50___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _vue_loader_lib_loaders_templateLoader_js_vue_loader_options_vue_loader_lib_index_js_vue_loader_options_AccountBoxMultipleOutline_vue_vue_type_template_id_43a3bd50___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../vue-loader/lib/index.js??vue-loader-options!./AccountBoxMultipleOutline.vue?vue&type=template&id=43a3bd50& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/vue-material-design-icons/AccountBoxMultipleOutline.vue?vue&type=template&id=43a3bd50&");


/***/ }),

/***/ "./src/views/Faces.vue?vue&type=template&id=2a2a1e28&scoped=true&":
/*!************************************************************************!*\
  !*** ./src/views/Faces.vue?vue&type=template&id=2a2a1e28&scoped=true& ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Faces_vue_vue_type_template_id_2a2a1e28_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Faces_vue_vue_type_template_id_2a2a1e28_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Faces_vue_vue_type_template_id_2a2a1e28_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Faces.vue?vue&type=template&id=2a2a1e28&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/Faces.vue?vue&type=template&id=2a2a1e28&scoped=true&");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/vue-material-design-icons/AccountBoxMultipleOutline.vue?vue&type=template&id=43a3bd50&":
/*!****************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/vue-material-design-icons/AccountBoxMultipleOutline.vue?vue&type=template&id=43a3bd50& ***!
  \****************************************************************************************************************************************************************************************************************************************************/
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
    "span",
    _vm._b(
      {
        staticClass: "material-design-icon account-box-multiple-outline-icon",
        attrs: {
          "aria-hidden": !_vm.title,
          "aria-label": _vm.title,
          role: "img",
        },
        on: {
          click: function ($event) {
            return _vm.$emit("click", $event)
          },
        },
      },
      "span",
      _vm.$attrs,
      false
    ),
    [
      _c(
        "svg",
        {
          staticClass: "material-design-icon__svg",
          attrs: {
            fill: _vm.fillColor,
            width: _vm.size,
            height: _vm.size,
            viewBox: "0 0 24 24",
          },
        },
        [
          _c(
            "path",
            {
              attrs: {
                d: "M4 6H2V20C2 21.11 2.9 22 4 22H18V20H4V6M18.5 14.25C18.5 12.75 15.5 12 14 12S9.5 12.75 9.5 14.25V15H18.5M14 10.25C15.24 10.25 16.25 9.24 16.25 8S15.24 5.75 14 5.75 11.75 6.76 11.75 8 12.76 10.25 14 10.25M20 2H8C6.9 2 6 2.9 6 4V16C6 17.11 6.9 18 8 18H20C21.11 18 22 17.11 22 16V4C22 2.89 21.1 2 20 2M20 16H8V4H20V16Z",
              },
            },
            [_vm.title ? _c("title", [_vm._v(_vm._s(_vm.title))]) : _vm._e()]
          ),
        ]
      ),
    ]
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/Faces.vue?vue&type=template&id=2a2a1e28&scoped=true&":
/*!***************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/Faces.vue?vue&type=template&id=2a2a1e28&scoped=true& ***!
  \***************************************************************************************************************************************************************************************************************/
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
  return _vm.errorFetchingFaces
    ? _c("NcEmptyContent", [
        _vm._v("\n\t" + _vm._s(_vm.t("photos", "An error occurred")) + "\n"),
      ])
    : _c(
        "div",
        { staticClass: "faces" },
        [
          _vm.loadingFaces ? _c("NcLoadingIcon") : _vm._e(),
          _vm._v(" "),
          _vm.noFaces && !_vm.loadingFaces
            ? _c(
                "div",
                { staticClass: "faces__empty" },
                [
                  _c(
                    "NcEmptyContent",
                    {
                      staticClass: "empty-content-with-illustration",
                      scopedSlots: _vm._u(
                        [
                          {
                            key: "icon",
                            fn: function () {
                              return [_c("AccountBoxMultipleOutline")]
                            },
                            proxy: true,
                          },
                          {
                            key: "desc",
                            fn: function () {
                              return [
                                _vm._v(
                                  "\n\t\t\t\t" +
                                    _vm._s(
                                      _vm.t(
                                        "photos",
                                        "This might take some time depending on the size of your photo library."
                                      )
                                    ) +
                                    "\n\t\t\t"
                                ),
                              ]
                            },
                            proxy: true,
                          },
                        ],
                        null,
                        false,
                        3796275108
                      ),
                    },
                    [
                      _vm._v(" "),
                      _vm._v(
                        "\n\t\t\t" +
                          _vm._s(
                            _vm.t(
                              "photos",
                              "Recognized people will show up here"
                            )
                          ) +
                          "\n\t\t"
                      ),
                    ]
                  ),
                ],
                1
              )
            : !_vm.noFaces
            ? _c(
                "div",
                { staticClass: "faces__list" },
                _vm._l(_vm.orderedFaces, function (face) {
                  return _c(
                    "router-link",
                    {
                      key: face.basename,
                      attrs: { to: "/faces/" + face.basename },
                    },
                    [
                      _c("FaceCover", {
                        attrs: { "base-name": face.basename },
                      }),
                    ],
                    1
                  )
                }),
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
//# sourceMappingURL=photos-src_views_Faces_vue.js.map?v=73ae9b7be63b564ba1f5