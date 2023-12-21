"use strict";
(self["webpackChunkphotos"] = self["webpackChunkphotos"] || []).push([["src_views_SharedAlbums_vue-src_services_collectionFetcher_js"],{

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/SharedAlbums.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/SharedAlbums.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vue_material_design_icons_FolderMultipleImage_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue-material-design-icons/FolderMultipleImage.vue */ "./node_modules/vue-material-design-icons/FolderMultipleImage.vue");
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/router */ "./node_modules/@nextcloud/router/dist/index.js");
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @nextcloud/vue */ "./node_modules/@nextcloud/vue/dist/index.mjs");
/* harmony import */ var _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @nextcloud/l10n */ "./node_modules/@nextcloud/l10n/dist/index.mjs");
/* harmony import */ var _nextcloud_auth__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @nextcloud/auth */ "./node_modules/@nextcloud/auth/dist/index.es.mjs");
/* harmony import */ var _components_Collection_CollectionsList_vue__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../components/Collection/CollectionsList.vue */ "./src/components/Collection/CollectionsList.vue");
/* harmony import */ var _components_Collection_CollectionCover_vue__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../components/Collection/CollectionCover.vue */ "./src/components/Collection/CollectionCover.vue");
/* harmony import */ var _components_HeaderNavigation_vue__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../components/HeaderNavigation.vue */ "./src/components/HeaderNavigation.vue");
/* harmony import */ var _mixins_FetchCollectionsMixin_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../mixins/FetchCollectionsMixin.js */ "./src/mixins/FetchCollectionsMixin.js");









/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'SharedAlbums',
  components: {
    FolderMultipleImage: vue_material_design_icons_FolderMultipleImage_vue__WEBPACK_IMPORTED_MODULE_0__["default"],
    NcEmptyContent: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_2__.NcEmptyContent,
    CollectionsList: _components_Collection_CollectionsList_vue__WEBPACK_IMPORTED_MODULE_5__["default"],
    CollectionCover: _components_Collection_CollectionCover_vue__WEBPACK_IMPORTED_MODULE_6__["default"],
    HeaderNavigation: _components_HeaderNavigation_vue__WEBPACK_IMPORTED_MODULE_7__["default"],
    NcUserBubble: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_2__.NcUserBubble
  },
  filters: {
    /**
     * @param {string} lastPhoto The album's last photos.
     * @return {string}
     */
    coverUrl(lastPhoto) {
      if (lastPhoto === -1) {
        return '';
      }
      return (0,_nextcloud_router__WEBPACK_IMPORTED_MODULE_1__.generateUrl)(`/apps/photos/api/v1/preview/${lastPhoto}?x=${512}&y=${512}`);
    },
    /**
     * @param {import('../services/Albums.js').Album} album The album's full name, including the userid.
     * @return {string} The album name without the userId between parentheses.
     */
    albumOriginalName(album) {
      return album.basename.replace(new RegExp(`\\(${album.collaborators[0].id}\\)$`), '');
    }
  },
  mixins: [_mixins_FetchCollectionsMixin_js__WEBPACK_IMPORTED_MODULE_8__["default"]],
  computed: {
    /**
     * @return {import('../services/Albums').IndexedAlbums}
     */
    sharedAlbums() {
      return this.$store.getters.sharedAlbums;
    }
  },
  async beforeMount() {
    this.fetchSharedAlbums();
  },
  methods: {
    fetchSharedAlbums() {
      this.fetchCollections(`/photos/${(0,_nextcloud_auth__WEBPACK_IMPORTED_MODULE_4__.getCurrentUser)()?.uid}/sharedalbums`, ['<nc:location />', '<nc:dateRange />', '<nc:collaborators />']);
    },
    t: _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_3__.translate,
    n: _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_3__.translatePlural
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/SharedAlbums.vue?vue&type=template&id=3a88853a&scoped=true&":
/*!****************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/SharedAlbums.vue?vue&type=template&id=3a88853a&scoped=true& ***!
  \****************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("CollectionsList", {
    staticClass: "albums-list",
    attrs: {
      collections: _vm.sharedAlbums,
      loading: _vm.loadingCollections,
      error: _vm.errorFetchingCollections
    },
    scopedSlots: _vm._u([{
      key: "default",
      fn: function (_ref) {
        let {
          collection
        } = _ref;
        return _c("CollectionCover", {
          key: collection.basename,
          attrs: {
            link: `/sharedalbums/${collection.basename}`,
            "alt-img": _vm.t("photos", "Cover photo for shared album {albumName}.", {
              albumName: collection.basename
            }),
            "data-test": collection.basename,
            "cover-url": _vm._f("coverUrl")(collection.lastPhoto)
          }
        }, [_c("h2", {
          staticClass: "album__name"
        }, [_vm._v("\n\t\t\t" + _vm._s(_vm._f("albumOriginalName")(collection)) + "\n\t\t")]), _vm._v(" "), _c("div", {
          staticClass: "album__details",
          attrs: {
            slot: "subtitle"
          },
          slot: "subtitle"
        }, [_vm._v("\n\t\t\t" + _vm._s(collection.date) + " ⸱ " + _vm._s(_vm.n("photos", "%n item", "%n photos and videos", collection.nbItems)) + "\n\t\t\t"), _c("br"), _vm._v("\n\t\t\t" + _vm._s(_vm.t("photos", "Shared by")) + " "), _c("NcUserBubble", {
          attrs: {
            "display-name": collection.collaborators[0].label,
            user: collection.collaborators[0].id
          }
        })], 1)]);
      }
    }])
  }, [_c("HeaderNavigation", {
    key: "navigation",
    attrs: {
      slot: "header",
      loading: _vm.loadingCollections,
      title: _vm.t("photos", "Collaborative albums"),
      "root-title": _vm.t("photos", "Collaborative albums")
    },
    on: {
      refresh: _vm.fetchSharedAlbums
    },
    slot: "header"
  }), _vm._v(" "), _vm._v(" "), _c("NcEmptyContent", {
    attrs: {
      slot: "empty-collections-list",
      name: _vm.t("photos", "There is no album yet!")
    },
    slot: "empty-collections-list"
  }, [_c("FolderMultipleImage", {
    attrs: {
      slot: "icon"
    },
    slot: "icon"
  })], 1)], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/SharedAlbums.vue?vue&type=style&index=0&id=3a88853a&lang=scss&scoped=true&":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/SharedAlbums.vue?vue&type=style&index=0&id=3a88853a&lang=scss&scoped=true& ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, ".albums-list[data-v-3a88853a] {\n  display: flex;\n  flex-direction: column;\n}\n.albums-list .album__name[data-v-3a88853a] {\n  font-weight: normal;\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/SharedAlbums.vue?vue&type=style&index=0&id=3a88853a&lang=scss&scoped=true&":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/SharedAlbums.vue?vue&type=style&index=0&id=3a88853a&lang=scss&scoped=true& ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SharedAlbums_vue_vue_type_style_index_0_id_3a88853a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./SharedAlbums.vue?vue&type=style&index=0&id=3a88853a&lang=scss&scoped=true& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/SharedAlbums.vue?vue&type=style&index=0&id=3a88853a&lang=scss&scoped=true&");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SharedAlbums_vue_vue_type_style_index_0_id_3a88853a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SharedAlbums_vue_vue_type_style_index_0_id_3a88853a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SharedAlbums_vue_vue_type_style_index_0_id_3a88853a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SharedAlbums_vue_vue_type_style_index_0_id_3a88853a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/views/SharedAlbums.vue":
/*!************************************!*\
  !*** ./src/views/SharedAlbums.vue ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _SharedAlbums_vue_vue_type_template_id_3a88853a_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SharedAlbums.vue?vue&type=template&id=3a88853a&scoped=true& */ "./src/views/SharedAlbums.vue?vue&type=template&id=3a88853a&scoped=true&");
/* harmony import */ var _SharedAlbums_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SharedAlbums.vue?vue&type=script&lang=js& */ "./src/views/SharedAlbums.vue?vue&type=script&lang=js&");
/* harmony import */ var _SharedAlbums_vue_vue_type_style_index_0_id_3a88853a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SharedAlbums.vue?vue&type=style&index=0&id=3a88853a&lang=scss&scoped=true& */ "./src/views/SharedAlbums.vue?vue&type=style&index=0&id=3a88853a&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _SharedAlbums_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _SharedAlbums_vue_vue_type_template_id_3a88853a_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render,
  _SharedAlbums_vue_vue_type_template_id_3a88853a_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "3a88853a",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/views/SharedAlbums.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/views/SharedAlbums.vue?vue&type=script&lang=js&":
/*!*************************************************************!*\
  !*** ./src/views/SharedAlbums.vue?vue&type=script&lang=js& ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_SharedAlbums_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./SharedAlbums.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/SharedAlbums.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_SharedAlbums_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/views/SharedAlbums.vue?vue&type=template&id=3a88853a&scoped=true&":
/*!*******************************************************************************!*\
  !*** ./src/views/SharedAlbums.vue?vue&type=template&id=3a88853a&scoped=true& ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SharedAlbums_vue_vue_type_template_id_3a88853a_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SharedAlbums_vue_vue_type_template_id_3a88853a_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SharedAlbums_vue_vue_type_template_id_3a88853a_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./SharedAlbums.vue?vue&type=template&id=3a88853a&scoped=true& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/SharedAlbums.vue?vue&type=template&id=3a88853a&scoped=true&");


/***/ }),

/***/ "./src/views/SharedAlbums.vue?vue&type=style&index=0&id=3a88853a&lang=scss&scoped=true&":
/*!**********************************************************************************************!*\
  !*** ./src/views/SharedAlbums.vue?vue&type=style&index=0&id=3a88853a&lang=scss&scoped=true& ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SharedAlbums_vue_vue_type_style_index_0_id_3a88853a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/style-loader/dist/cjs.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./SharedAlbums.vue?vue&type=style&index=0&id=3a88853a&lang=scss&scoped=true& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/SharedAlbums.vue?vue&type=style&index=0&id=3a88853a&lang=scss&scoped=true&");


/***/ }),

/***/ "./src/services/collectionFetcher.js":
/*!*******************************************!*\
  !*** ./src/services/collectionFetcher.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fetchCollection": () => (/* binding */ fetchCollection),
/* harmony export */   "fetchCollectionFiles": () => (/* binding */ fetchCollectionFiles),
/* harmony export */   "fetchCollections": () => (/* binding */ fetchCollections)
/* harmony export */ });
/* harmony import */ var _nextcloud_moment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/moment */ "./node_modules/@nextcloud/moment/dist/index.js");
/* harmony import */ var _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/l10n */ "./node_modules/@nextcloud/l10n/dist/index.mjs");
/* harmony import */ var _DavClient_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DavClient.js */ "./src/services/DavClient.js");
/* harmony import */ var _logger_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./logger.js */ "./src/services/logger.js");
/* harmony import */ var _utils_fileUtils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/fileUtils.js */ "./src/utils/fileUtils.js");
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







/**
 * @typedef {object} Collection
 * @property {string} basename - The name of the collection (ex: "Athens").
 * @property {string} filename - The filename of the collection (ex: "/photos/admin/places/Athens").
 * @property {string} source - The full source of the collection (ex: "https://nextcloud_server1.test/remote.php/dav//photos/admin/places/Athens").
 * @property {number} nbItems - The number of item in the collection.
 * @property {number} lastPhoto - The file id for the cover of the collection.
 */

/**
 * @typedef {object} CollectionFile
 * @property {string} fileid - The id of the file.
 * @property {string} basename - The name of the file (ex: "790-IMG_20180906_085724.jpg").
 * @property {string} filename - The file name of the file (ex: "/photos/admin/places/Athens/790-IMG_20180906_085724.jpg").
 * @property {string} source - The full source of the collection (ex: "https://nextcloud_server1.test/remote.php/dav//photos/admin/places/Athens/790-IMG_20180906_085724.jpg").
 * @property {object} metadataPhotosSize - The metadata of the file.
 * @property {number} metadataPhotosSize.width - The width of the file.
 * @property {number} metadataPhotosSize.height - The height of the file.
 */

/** @typedef {Object<string, Collection>} IndexedCollections */
/** @typedef {Object<string, CollectionFile>} IndexedCollectionFiles */

/**
 * @param {string[]} extraProps - Extra properties to add to the DAV request.
 * @return {string}
 */
function getCollectionDavRequest() {
  let extraProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return `<?xml version="1.0"?>
			<d:propfind xmlns:d="DAV:"
				xmlns:oc="http://owncloud.org/ns"
				xmlns:nc="http://nextcloud.org/ns"
				xmlns:ocs="http://open-collaboration-services.org/ns">
				<d:prop>
					<nc:last-photo />
					<nc:nbItems />
					${extraProps.join('')}
				</d:prop>
			</d:propfind>`;
}

/**
 * @param {string[]} extraProps - Extra properties to add to the DAV request.
 * @return {string}
 */
function getCollectionFilesDavRequest() {
  let extraProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return `<?xml version="1.0"?>
			<d:propfind xmlns:d="DAV:"
				xmlns:oc="http://owncloud.org/ns"
				xmlns:nc="http://nextcloud.org/ns"
				xmlns:ocs="http://open-collaboration-services.org/ns">
				<d:prop>
					<d:getcontentlength />
					<d:getcontenttype />
					<d:getetag />
					<d:getlastmodified />
					<d:resourcetype />
					<nc:metadata-photos-size />
					<nc:metadata-photos-original_date_time />
					<nc:metadata-files-live-photo />
					<nc:has-preview />
					<nc:hidden />
					<oc:favorite />
					<oc:fileid />
					<oc:permissions />
					${extraProps.join('')}
				</d:prop>
			</d:propfind>`;
}

/**
 * @param {string} path - Collections' root path.
 * @param {import('webdav').StatOptions} options - Options to forward to the webdav client.
 * @param {string[]} extraProps - Extra properties to add to the DAV request.
 * @param {import('webdav').WebDAVClient} client - The DAV client to use.
 * @return {Promise<Collection|null>}
 */
async function fetchCollection(path, options) {
  let extraProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  let client = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _DavClient_js__WEBPACK_IMPORTED_MODULE_2__["default"];
  try {
    const response = await client.stat(path, {
      data: getCollectionDavRequest(extraProps),
      details: true,
      ...options
    });
    _logger_js__WEBPACK_IMPORTED_MODULE_3__["default"].debug('[Collections] Fetched a collection: ', {
      data: response.data
    });
    return formatCollection(response.data);
  } catch (error) {
    if (error.code === 'ERR_CANCELED') {
      return null;
    }
    throw error;
  }
}

/**
 *
 * @param {string} path - Collections' root path.
 * @param {import('webdav').StatOptions} options - Options to forward to the webdav client.
 * @param {string[]} extraProps - Extra properties to add to the DAV request.
 * @param {import('webdav').WebDAVClient} client - The DAV client to use.
 * @return {Promise<Collection[]>}
 */
async function fetchCollections(path, options) {
  let extraProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  let client = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _DavClient_js__WEBPACK_IMPORTED_MODULE_2__["default"];
  try {
    const response = await client.getDirectoryContents(path, {
      data: getCollectionDavRequest(extraProps),
      details: true,
      ...options
    });
    _logger_js__WEBPACK_IMPORTED_MODULE_3__["default"].debug(`[Collections] Fetched ${response.data.length} collections: `, {
      data: response.data
    });
    return response.data.filter(collection => collection.filename !== path).map(formatCollection);
  } catch (error) {
    if (error.code === 'ERR_CANCELED') {
      return [];
    }
    throw error;
  }
}

/**
 *
 * @param {object} rawCollection - An collection received from a webdav request.
 * @return {Collection}
 */
function formatCollection(rawCollection) {
  // Ensure that we have a proper collaborators array.
  if (rawCollection.props.collaborators === undefined || rawCollection.props.collaborators === '') {
    rawCollection.props.collaborators = [];
  } else if (typeof rawCollection.props.collaborators.collaborator === 'object') {
    if (Array.isArray(rawCollection.props.collaborators.collaborator)) {
      rawCollection.props.collaborators = rawCollection.props.collaborators.collaborator;
    } else {
      rawCollection.props.collaborators = [rawCollection.props.collaborators.collaborator];
    }
  }

  // Extract custom props.
  rawCollection = (0,_utils_fileUtils_js__WEBPACK_IMPORTED_MODULE_4__.genFileInfo)(rawCollection);

  // Compute date range label.
  const dateRange = JSON.parse(rawCollection.dateRange?.replace(/&quot;/g, '"') ?? '{}');
  if (dateRange.start === null) {
    dateRange.start = _nextcloud_moment__WEBPACK_IMPORTED_MODULE_0__().unix();
    dateRange.end = _nextcloud_moment__WEBPACK_IMPORTED_MODULE_0__().unix();
  }
  const dateRangeFormatted = {
    startDate: _nextcloud_moment__WEBPACK_IMPORTED_MODULE_0__.unix(dateRange.start).format('MMMM YYYY'),
    endDate: _nextcloud_moment__WEBPACK_IMPORTED_MODULE_0__.unix(dateRange.end).format('MMMM YYYY')
  };
  if (dateRangeFormatted.startDate === dateRangeFormatted.endDate) {
    rawCollection.date = dateRangeFormatted.startDate;
  } else {
    rawCollection.date = (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_1__.translate)('photos', '{startDate} to {endDate}', dateRangeFormatted);
  }
  return rawCollection;
}

/**
 *
 * @param {string} path - Collections' root path.
 * @param {import('webdav').StatOptions} options - Options to forward to the webdav client.
 * @param {string[]} extraProps - Extra properties to add to the DAV request.
 * @param {import('webdav').WebDAVClient} client - The DAV client to use.
 * @return {Promise<CollectionFile[]>}
 */
async function fetchCollectionFiles(path, options) {
  let extraProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  let client = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _DavClient_js__WEBPACK_IMPORTED_MODULE_2__["default"];
  try {
    const response = await client.getDirectoryContents(path, {
      data: getCollectionFilesDavRequest(extraProps),
      details: true,
      ...options
    });
    const fetchedFiles = response.data.map(file => (0,_utils_fileUtils_js__WEBPACK_IMPORTED_MODULE_4__.genFileInfo)(file)).filter(file => file.fileid);
    _logger_js__WEBPACK_IMPORTED_MODULE_3__["default"].debug(`[Collections] Fetched ${fetchedFiles.length} new files: `, fetchedFiles);
    return fetchedFiles;
  } catch (error) {
    if (error.code === 'ERR_CANCELED') {
      return [];
    }
    _logger_js__WEBPACK_IMPORTED_MODULE_3__["default"].error('Error fetching collection files', {
      error
    });
    console.error(error);
    throw error;
  }
}

/***/ })

}]);
//# sourceMappingURL=photos-src_views_SharedAlbums_vue-src_services_collectionFetcher_js.js.map?v=9eedc6cd4aedd660c9e6