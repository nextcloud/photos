(self["webpackChunkphotos"] = self["webpackChunkphotos"] || []).push([["src_components_Faces_FaceMergeForm_vue-src_mixins_FetchFilesMixin_js"],{

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Faces/FaceMergeForm.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Faces/FaceMergeForm.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _mixins_FaceCoverMixin_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../mixins/FaceCoverMixin.js */ "./src/mixins/FaceCoverMixin.js");
/* harmony import */ var _mixins_FetchFacesMixin_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../mixins/FetchFacesMixin.js */ "./src/mixins/FetchFacesMixin.js");
/* harmony import */ var _FaceCover_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FaceCover.vue */ "./src/components/Faces/FaceCover.vue");




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'FaceMergeForm',
  components: {
    FaceCover: _FaceCover_vue__WEBPACK_IMPORTED_MODULE_2__["default"]
  },
  mixins: [_mixins_FaceCoverMixin_js__WEBPACK_IMPORTED_MODULE_0__["default"], _mixins_FetchFacesMixin_js__WEBPACK_IMPORTED_MODULE_1__["default"]],
  props: {
    firstFace: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: false
    };
  },
  computed: {
    ...(0,vuex__WEBPACK_IMPORTED_MODULE_3__.mapGetters)(['files', 'faces', 'facesFiles']),
    filteredFaces() {
      return Object.values(this.faces).filter(face => face.basename !== this.firstFace).sort((a, b) => {
        if (a.props.nbItems && b.props.nbItems) {
          return b.props.nbItems - a.props.nbItems;
        }
        if (!this.facesFiles[b.basename] || !this.facesFiles[a.basename]) {
          return 0;
        }
        return this.facesFiles[b.basename].length - this.facesFiles[a.basename].length;
      });
    }
  },
  methods: {
    handleSelect(faceName) {
      this.$emit('select', faceName);
      this.loading = true;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Faces/FaceMergeForm.vue?vue&type=template&id=a9c1fcf4&scoped=true&":
/*!****************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Faces/FaceMergeForm.vue?vue&type=template&id=a9c1fcf4&scoped=true& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "merge-form face-list"
  }, _vm._l(_vm.filteredFaces, function (face) {
    return _c("FaceCover", {
      key: face.basename,
      attrs: {
        "base-name": face.basename,
        small: ""
      },
      on: {
        click: function ($event) {
          return _vm.handleSelect(face.basename);
        }
      }
    });
  }), 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./src/services/PhotoSearch.ts":
/*!*************************************!*\
  !*** ./src/services/PhotoSearch.ts ***!
  \*************************************/
/***/ (() => {

throw new Error("Module build failed (from ./node_modules/babel-loader/lib/index.js):\nSyntaxError: /home/louis/workspace/nextcloud/apps/photos/src/services/PhotoSearch.ts: Unexpected reserved word 'interface'. (30:0)\n\n\u001b[0m \u001b[90m 28 |\u001b[39m \u001b[36mimport\u001b[39m moment \u001b[36mfrom\u001b[39m \u001b[32m'@nextcloud/moment'\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 29 |\u001b[39m\u001b[0m\n\u001b[0m\u001b[31m\u001b[1m>\u001b[22m\u001b[39m\u001b[90m 30 |\u001b[39m \u001b[36minterface\u001b[39m \u001b[33mSearchOptions\u001b[39m {\u001b[0m\n\u001b[0m \u001b[90m    |\u001b[39m \u001b[31m\u001b[1m^\u001b[22m\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 31 |\u001b[39m \tfirstResult\u001b[33m:\u001b[39m number\u001b[33m;\u001b[39m \u001b[90m// Index of the first result that we want (starts at 0)\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 32 |\u001b[39m \tnbResults\u001b[33m:\u001b[39m number\u001b[33m;\u001b[39m \u001b[90m// The number of file to fetch\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 33 |\u001b[39m \tmimesType\u001b[33m:\u001b[39m string[]\u001b[33m;\u001b[39m \u001b[90m// Mime type of the files\u001b[39m\u001b[0m\n    at constructor (/home/louis/workspace/nextcloud/apps/photos/node_modules/@babel/parser/lib/index.js:356:19)\n    at Parser.raise (/home/louis/workspace/nextcloud/apps/photos/node_modules/@babel/parser/lib/index.js:3223:19)\n    at Parser.checkReservedWord (/home/louis/workspace/nextcloud/apps/photos/node_modules/@babel/parser/lib/index.js:12077:12)\n    at Parser.parseIdentifierName (/home/louis/workspace/nextcloud/apps/photos/node_modules/@babel/parser/lib/index.js:12056:12)\n    at Parser.parseIdentifier (/home/louis/workspace/nextcloud/apps/photos/node_modules/@babel/parser/lib/index.js:12031:23)\n    at Parser.parseExprAtom (/home/louis/workspace/nextcloud/apps/photos/node_modules/@babel/parser/lib/index.js:11236:27)\n    at Parser.parseExprSubscripts (/home/louis/workspace/nextcloud/apps/photos/node_modules/@babel/parser/lib/index.js:10862:23)\n    at Parser.parseUpdate (/home/louis/workspace/nextcloud/apps/photos/node_modules/@babel/parser/lib/index.js:10845:21)\n    at Parser.parseMaybeUnary (/home/louis/workspace/nextcloud/apps/photos/node_modules/@babel/parser/lib/index.js:10821:23)\n    at Parser.parseMaybeUnaryOrPrivate (/home/louis/workspace/nextcloud/apps/photos/node_modules/@babel/parser/lib/index.js:10659:61)\n    at Parser.parseExprOps (/home/louis/workspace/nextcloud/apps/photos/node_modules/@babel/parser/lib/index.js:10664:23)\n    at Parser.parseMaybeConditional (/home/louis/workspace/nextcloud/apps/photos/node_modules/@babel/parser/lib/index.js:10641:23)\n    at Parser.parseMaybeAssign (/home/louis/workspace/nextcloud/apps/photos/node_modules/@babel/parser/lib/index.js:10602:21)\n    at Parser.parseExpressionBase (/home/louis/workspace/nextcloud/apps/photos/node_modules/@babel/parser/lib/index.js:10556:23)\n    at /home/louis/workspace/nextcloud/apps/photos/node_modules/@babel/parser/lib/index.js:10552:39\n    at Parser.allowInAnd (/home/louis/workspace/nextcloud/apps/photos/node_modules/@babel/parser/lib/index.js:12284:16)\n    at Parser.parseExpression (/home/louis/workspace/nextcloud/apps/photos/node_modules/@babel/parser/lib/index.js:10552:17)\n    at Parser.parseStatementContent (/home/louis/workspace/nextcloud/apps/photos/node_modules/@babel/parser/lib/index.js:12742:23)\n    at Parser.parseStatementLike (/home/louis/workspace/nextcloud/apps/photos/node_modules/@babel/parser/lib/index.js:12593:17)\n    at Parser.parseModuleItem (/home/louis/workspace/nextcloud/apps/photos/node_modules/@babel/parser/lib/index.js:12570:17)\n    at Parser.parseBlockOrModuleBlockBody (/home/louis/workspace/nextcloud/apps/photos/node_modules/@babel/parser/lib/index.js:13194:36)\n    at Parser.parseBlockBody (/home/louis/workspace/nextcloud/apps/photos/node_modules/@babel/parser/lib/index.js:13187:10)\n    at Parser.parseProgram (/home/louis/workspace/nextcloud/apps/photos/node_modules/@babel/parser/lib/index.js:12469:10)\n    at Parser.parseTopLevel (/home/louis/workspace/nextcloud/apps/photos/node_modules/@babel/parser/lib/index.js:12459:25)\n    at Parser.parse (/home/louis/workspace/nextcloud/apps/photos/node_modules/@babel/parser/lib/index.js:14381:10)\n    at parse (/home/louis/workspace/nextcloud/apps/photos/node_modules/@babel/parser/lib/index.js:14422:38)\n    at parser (/home/louis/workspace/nextcloud/apps/photos/node_modules/@babel/core/lib/parser/index.js:41:34)\n    at parser.next (<anonymous>)\n    at normalizeFile (/home/louis/workspace/nextcloud/apps/photos/node_modules/@babel/core/lib/transformation/normalize-file.js:64:38)\n    at normalizeFile.next (<anonymous>)\n    at run (/home/louis/workspace/nextcloud/apps/photos/node_modules/@babel/core/lib/transformation/index.js:21:50)\n    at run.next (<anonymous>)\n    at transform (/home/louis/workspace/nextcloud/apps/photos/node_modules/@babel/core/lib/transform.js:22:41)\n    at transform.next (<anonymous>)\n    at step (/home/louis/workspace/nextcloud/apps/photos/node_modules/gensync/index.js:261:32)\n    at /home/louis/workspace/nextcloud/apps/photos/node_modules/gensync/index.js:273:13\n    at async.call.result.err.err (/home/louis/workspace/nextcloud/apps/photos/node_modules/gensync/index.js:223:11)\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (node:internal/process/task_queues:96:5)");

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Faces/FaceMergeForm.vue?vue&type=style&index=0&id=a9c1fcf4&scoped=true&lang=scss&":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Faces/FaceMergeForm.vue?vue&type=style&index=0&id=a9c1fcf4&scoped=true&lang=scss& ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, ".face-list[data-v-a9c1fcf4] {\n  display: flex;\n  flex-direction: row;\n  height: 350px;\n  flex-wrap: wrap;\n  padding: 12px;\n}\n.loader[data-v-a9c1fcf4] {\n  margin: 25% auto;\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Faces/FaceMergeForm.vue?vue&type=style&index=0&id=a9c1fcf4&scoped=true&lang=scss&":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Faces/FaceMergeForm.vue?vue&type=style&index=0&id=a9c1fcf4&scoped=true&lang=scss& ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceMergeForm_vue_vue_type_style_index_0_id_a9c1fcf4_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../node_modules/css-loader/dist/cjs.js!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/dist/cjs.js!../../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FaceMergeForm.vue?vue&type=style&index=0&id=a9c1fcf4&scoped=true&lang=scss& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Faces/FaceMergeForm.vue?vue&type=style&index=0&id=a9c1fcf4&scoped=true&lang=scss&");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceMergeForm_vue_vue_type_style_index_0_id_a9c1fcf4_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceMergeForm_vue_vue_type_style_index_0_id_a9c1fcf4_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceMergeForm_vue_vue_type_style_index_0_id_a9c1fcf4_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceMergeForm_vue_vue_type_style_index_0_id_a9c1fcf4_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/components/Faces/FaceMergeForm.vue":
/*!************************************************!*\
  !*** ./src/components/Faces/FaceMergeForm.vue ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _FaceMergeForm_vue_vue_type_template_id_a9c1fcf4_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FaceMergeForm.vue?vue&type=template&id=a9c1fcf4&scoped=true& */ "./src/components/Faces/FaceMergeForm.vue?vue&type=template&id=a9c1fcf4&scoped=true&");
/* harmony import */ var _FaceMergeForm_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FaceMergeForm.vue?vue&type=script&lang=js& */ "./src/components/Faces/FaceMergeForm.vue?vue&type=script&lang=js&");
/* harmony import */ var _FaceMergeForm_vue_vue_type_style_index_0_id_a9c1fcf4_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FaceMergeForm.vue?vue&type=style&index=0&id=a9c1fcf4&scoped=true&lang=scss& */ "./src/components/Faces/FaceMergeForm.vue?vue&type=style&index=0&id=a9c1fcf4&scoped=true&lang=scss&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _FaceMergeForm_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _FaceMergeForm_vue_vue_type_template_id_a9c1fcf4_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render,
  _FaceMergeForm_vue_vue_type_template_id_a9c1fcf4_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "a9c1fcf4",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/components/Faces/FaceMergeForm.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/components/Faces/FaceMergeForm.vue?vue&type=script&lang=js&":
/*!*************************************************************************!*\
  !*** ./src/components/Faces/FaceMergeForm.vue?vue&type=script&lang=js& ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceMergeForm_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FaceMergeForm.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Faces/FaceMergeForm.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceMergeForm_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/components/Faces/FaceMergeForm.vue?vue&type=template&id=a9c1fcf4&scoped=true&":
/*!*******************************************************************************************!*\
  !*** ./src/components/Faces/FaceMergeForm.vue?vue&type=template&id=a9c1fcf4&scoped=true& ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceMergeForm_vue_vue_type_template_id_a9c1fcf4_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceMergeForm_vue_vue_type_template_id_a9c1fcf4_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceMergeForm_vue_vue_type_template_id_a9c1fcf4_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FaceMergeForm.vue?vue&type=template&id=a9c1fcf4&scoped=true& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Faces/FaceMergeForm.vue?vue&type=template&id=a9c1fcf4&scoped=true&");


/***/ }),

/***/ "./src/components/Faces/FaceMergeForm.vue?vue&type=style&index=0&id=a9c1fcf4&scoped=true&lang=scss&":
/*!**********************************************************************************************************!*\
  !*** ./src/components/Faces/FaceMergeForm.vue?vue&type=style&index=0&id=a9c1fcf4&scoped=true&lang=scss& ***!
  \**********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceMergeForm_vue_vue_type_style_index_0_id_a9c1fcf4_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/style-loader/dist/cjs.js!../../../node_modules/css-loader/dist/cjs.js!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/dist/cjs.js!../../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FaceMergeForm.vue?vue&type=style&index=0&id=a9c1fcf4&scoped=true&lang=scss& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Faces/FaceMergeForm.vue?vue&type=style&index=0&id=a9c1fcf4&scoped=true&lang=scss&");


/***/ }),

/***/ "./src/mixins/FetchFilesMixin.js":
/*!***************************************!*\
  !*** ./src/mixins/FetchFilesMixin.js ***!
  \***************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _nextcloud_moment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/moment */ "./node_modules/@nextcloud/moment/dist/index.js");
/* harmony import */ var _services_logger_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/logger.js */ "./src/services/logger.js");
/* harmony import */ var _services_PhotoSearch_ts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/PhotoSearch.ts */ "./src/services/PhotoSearch.ts");
/* harmony import */ var _utils_semaphoreWithPriority_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/semaphoreWithPriority.js */ "./src/utils/semaphoreWithPriority.js");
/* harmony import */ var _AbortControllerMixin_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./AbortControllerMixin.js */ "./src/mixins/AbortControllerMixin.js");
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
  name: 'FetchFilesMixin',
  mixins: [_AbortControllerMixin_js__WEBPACK_IMPORTED_MODULE_4__["default"]],
  data() {
    const dateTimeUpperBound = undefined;
    const dateTimeLowerBound = _nextcloud_moment__WEBPACK_IMPORTED_MODULE_0__().subtract(4, 'months');
    return {
      errorFetchingFiles: null,
      loadingFiles: false,
      doneFetchingFiles: false,
      fetchSemaphore: new _utils_semaphoreWithPriority_js__WEBPACK_IMPORTED_MODULE_3__["default"](1),
      fetchedFileIds: [],
      dateTimeUpperBound,
      dateTimeLowerBound,
      timeWindowSteps: 4,
      firstResultOffset: 0
    };
  },
  watch: {
    '$route.path'() {
      this.resetFetchFilesState();
    }
  },
  methods: {
    /**
     * @param {string} path - Path to pass to getPhotos.
     * @param {object} options - Options to pass to getPhotos.
     * @param {string[]} [blacklist=[]] - Array of ids to filter out.
     * @param {boolean} [force=false] - Force fetching even if doneFetchingFiles is true
     * @return {Promise<string[]>} - The next batch of data depending on global offset.
     */
    async fetchFiles() {
      let path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      let blacklist = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      let force = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      if (this.doneFetchingFiles && !force || this.loadingFiles) {
        return [];
      }
      const fetchSemaphoreSymbol = await this.fetchSemaphore.acquire();
      try {
        this.errorFetchingFiles = null;
        this.loadingFiles = true;
        const numberOfImagesPerBatch = 200;
        _services_logger_js__WEBPACK_IMPORTED_MODULE_1__["default"].debug(`[FetchFilesMixin] Fetching file between ${this.dateTimeUpperBound?.format('L')} 'and' ${this.dateTimeLowerBound?.format('L')}`);

        // Load next batch of images
        const fetchedFiles = await _services_PhotoSearch_ts__WEBPACK_IMPORTED_MODULE_2__(path, {
          firstResult: this.firstResultOffset,
          nbResults: numberOfImagesPerBatch,
          dateTimeUpperBound: this.dateTimeUpperBound?.unix(),
          dateTimeLowerBound: this.dateTimeLowerBound?.unix(),
          ...options,
          signal: this.abortController.signal
        });
        if (fetchedFiles.length === numberOfImagesPerBatch) {
          // If we have the same number of files than as requested
          // then the time window probably contains more, so we simply bump the first result offset.
          this.firstResultOffset += fetchedFiles.length;
        } else if (fetchedFiles.length === 0 && this.firstResultOffset === 0) {
          // If we tried a new window and it is empty
          if (this.dateTimeUpperBound === undefined && this.dateTimeLowerBound === undefined) {
            // if upper bound has been cleared, then we are done fetching files.
            this.doneFetchingFiles = true;
          } else if (this.dateTimeLowerBound === undefined) {
            // else if lower bound has been cleared, then we clear upper bound
            // this will allow the server to return all files with either empty or above than now original date time
            this.dateTimeUpperBound = undefined;
          } else if (this.dateTimeUpperBound === undefined) {
            this.dateTimeUpperBound = this.dateTimeLowerBound;
          } else if (this.timeWindowSteps === 64) {
            // else if we reach 64 months, we clear the lower bound.
            this.dateTimeUpperBound = this.dateTimeLowerBound;
            this.dateTimeLowerBound = undefined;
          } else {
            // else we progressively increase the time window until we reach 64 months (3 requests)
            this.timeWindowSteps *= 4;
            this.dateTimeUpperBound = this.dateTimeLowerBound;
            this.dateTimeLowerBound = _nextcloud_moment__WEBPACK_IMPORTED_MODULE_0__(this.dateTimeLowerBound).subtract(this.timeWindowSteps, 'months');
          }
        } else if (fetchedFiles.length !== numberOfImagesPerBatch) {
          // If we get less files than requested,
          // we are at the end for the current time window, so we move to the next one.
          this.timeWindowSteps = 4;
          this.dateTimeUpperBound = this.dateTimeLowerBound;
          if (this.dateTimeUpperBound !== undefined) {
            this.dateTimeLowerBound = _nextcloud_moment__WEBPACK_IMPORTED_MODULE_0__(this.dateTimeUpperBound).subtract(this.timeWindowSteps, 'months');
          } else {
            this.doneFetchingFiles = true;
          }
        }
        const fileIds = fetchedFiles.map(file => file.fileid).filter(fileId => !this.fetchedFileIds.includes(fileId.toString())); // Filter to prevent duplicate fileIds.

        this.fetchedFileIds.push(...fileIds.map(fileId => fileId.toString()).filter(fileId => !blacklist.includes(fileId)));
        this.$store.dispatch('appendFiles', fetchedFiles);
        _services_logger_js__WEBPACK_IMPORTED_MODULE_1__["default"].debug(`[FetchFilesMixin] Fetched ${fileIds.length} new files: `, fileIds);
        return fileIds;
      } catch (error) {
        if (error.response?.status === 404) {
          this.errorFetchingFiles = 404;
        } else if (error.code === 'ERR_CANCELED') {
          return [];
        } else {
          this.errorFetchingFiles = error;
        }

        // cancelled request, moving on...
        _services_logger_js__WEBPACK_IMPORTED_MODULE_1__["default"].error('Error fetching files', {
          error
        });
        console.error(error);
      } finally {
        this.loadingFiles = false;
        this.fetchSemaphore.release(fetchSemaphoreSymbol);
      }
      return [];
    },
    resetFetchFilesState() {
      this.doneFetchingFiles = false;
      this.errorFetchingFiles = null;
      this.loadingFiles = false;
      this.timeWindowSteps = 4;
      this.dateTimeUpperBound = undefined;
      this.dateTimeLowerBound = _nextcloud_moment__WEBPACK_IMPORTED_MODULE_0__(this.dateTimeUpperBound).subtract(this.timeWindowSteps, 'months');
      this.fetchedFileIds = [];
    }
  }
});

/***/ })

}]);
//# sourceMappingURL=photos-src_components_Faces_FaceMergeForm_vue-src_mixins_FetchFilesMixin_js.js.map?v=7f77fbe892c301aeb790