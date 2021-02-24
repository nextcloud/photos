(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[6],{

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js?!./src/components/Tag.vue?vue&type=script&lang=js&":
/*!*******************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Tag.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _services_TaggedImages__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/TaggedImages */ "./src/services/TaggedImages.js");
/* harmony import */ var _utils_CancelableRequest__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/CancelableRequest */ "./src/utils/CancelableRequest.js");
/* harmony import */ var _FolderTagPreview__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./FolderTagPreview */ "./src/components/FolderTagPreview.vue");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'Tag',
  components: {
    FolderTagPreview: _FolderTagPreview__WEBPACK_IMPORTED_MODULE_3__["default"]
  },
  inheritAttrs: false,
  props: {
    item: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      cancelRequest: null
    };
  },

  computed: { // global lists
    ...Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapGetters"])(['files', 'tags']),

    // files list of the current folder
    folderContent() {
      return this.tags[this.item.injected.id].files;
    },

    fileList() {
      return this.folderContent ? this.folderContent.map(id => this.files[id]).filter(file => !!file).slice(0, 4) // only get the 4 first images
      : [];
    }

  },

  beforeDestroy() {
    // cancel any pending requests
    if (this.cancelRequest) {
      this.cancelRequest('Navigated away');
    }
  },

  async created() {
    // init cancellable request
    const {
      request,
      cancel
    } = Object(_utils_CancelableRequest__WEBPACK_IMPORTED_MODULE_2__["default"])(_services_TaggedImages__WEBPACK_IMPORTED_MODULE_1__["default"]);
    this.cancelRequest = cancel;

    try {
      // get data
      const files = await request(this.item.injected.id);
      this.$store.dispatch('updateTag', {
        id: this.item.injected.id,
        files
      });
      this.$store.dispatch('appendFiles', files);
    } catch (error) {
      if (error.response && error.response.status) {
        console.error('Failed to get folder content', this.item.injected.id, error.response);
      }
    } finally {
      this.cancelRequest = null;
    }
  }

});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js?!./src/views/Tags.vue?vue&type=script&lang=js&":
/*!***************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/views/Tags.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var vue_virtual_grid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-virtual-grid */ "./node_modules/vue-virtual-grid/dist/virtual-grid.common.js");
/* harmony import */ var vue_virtual_grid__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(vue_virtual_grid__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _services_SystemTags__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/SystemTags */ "./src/services/SystemTags.js");
/* harmony import */ var _services_TaggedImages__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/TaggedImages */ "./src/services/TaggedImages.js");
/* harmony import */ var _components_EmptyContent__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/EmptyContent */ "./src/components/EmptyContent.vue");
/* harmony import */ var _components_Tag__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../components/Tag */ "./src/components/Tag.vue");
/* harmony import */ var _components_File__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../components/File */ "./src/components/File.vue");
/* harmony import */ var _components_Navigation__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../components/Navigation */ "./src/components/Navigation.vue");
/* harmony import */ var _mixins_GridConfig__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../mixins/GridConfig */ "./src/mixins/GridConfig.js");
/* harmony import */ var _utils_CancelableRequest__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../utils/CancelableRequest */ "./src/utils/CancelableRequest.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//










/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'Tags',
  components: {
    VirtualGrid: (vue_virtual_grid__WEBPACK_IMPORTED_MODULE_1___default()),
    EmptyContent: _components_EmptyContent__WEBPACK_IMPORTED_MODULE_4__["default"],
    Navigation: _components_Navigation__WEBPACK_IMPORTED_MODULE_7__["default"]
  },
  mixins: [_mixins_GridConfig__WEBPACK_IMPORTED_MODULE_8__["default"]],
  props: {
    rootTitle: {
      type: String,
      required: true
    },
    path: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      required: true
    },
    isRoot: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      error: null,
      cancelRequest: null
    };
  },

  computed: { // global lists
    ...Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapGetters"])(['files', 'tags', 'tagsNames']),

    // current tag id from current path
    tagId() {
      return this.$store.getters.tagId(this.path);
    },

    // current tag
    tag() {
      return this.tags[this.tagId];
    },

    tagsList() {
      return Object.values(this.tagsNames).map(tagsId => this.tags[tagsId]);
    },

    // files list of the current tag
    fileList() {
      return this.tag && this.tag.files.map(id => this.files[id]).filter(file => !!file);
    },

    contentList() {
      if (this.isRoot) {
        return this.tagsList.flatMap(tag => {
          return tag.id === '' ? [] : [{
            id: "tag-".concat(tag.id),
            injected: { ...tag
            },
            width: 256,
            height: 256,
            columnSpan: 1,
            renderComponent: _components_Tag__WEBPACK_IMPORTED_MODULE_5__["default"]
          }];
        });
      }

      return this.fileList.map(file => {
        return {
          id: "file-".concat(file.fileid),
          injected: { ...file,
            list: this.fileList
          },
          width: 256,
          height: 256,
          columnSpan: 1,
          renderComponent: _components_File__WEBPACK_IMPORTED_MODULE_6__["default"]
        };
      });
    },

    isEmpty() {
      if (this.isRoot) {
        return Object.keys(this.tagsNames).length === 0;
      }

      return this.fileList.length === 0;
    }

  },
  watch: {
    async path() {
      // if we don't have the tag in the store yet,
      // we need to fetch the list first
      if (!this.tagId) {
        await this.fetchRootContent();
      } // if we're not in the root, we fetch the data


      if (!this.isRoot) {
        this.fetchContent();
      }
    }

  },

  beforeDestroy() {
    // cancel any pending requests
    if (this.cancelRequest) {
      this.cancelRequest('Navigated away');
    }
  },

  async beforeMount() {
    // if we don't have the tag in the store yet,
    // we need to fetch the list first
    if (!this.tagId) {
      await this.fetchRootContent();
    } // if we're not in the root, we fetch the data


    if (!this.isRoot) {
      this.fetchContent();
    }
  },

  methods: {
    async fetchRootContent() {
      // cancel any pending requests
      if (this.cancelRequest) {
        this.cancelRequest('Changed folder');
      } // close any potential opened viewer


      OCA.Viewer.close(); // if we don't already have some cached data let's show a loader

      if (!this.tags[this.tagId]) {
        this.$emit('update:loading', true);
      }

      this.error = null; // init cancellable request

      const {
        request,
        cancel
      } = Object(_utils_CancelableRequest__WEBPACK_IMPORTED_MODULE_9__["default"])(_services_SystemTags__WEBPACK_IMPORTED_MODULE_2__["default"]);
      this.cancelRequest = cancel;

      try {
        // fetch content
        const tags = await request();
        this.$store.dispatch('updateTags', tags);
      } catch (error) {
        console.error(error);
        this.error = true;
      } finally {
        // done loading
        this.$emit('update:loading', false);
        this.cancelRequest = null;
      }
    },

    async fetchContent() {
      // cancel any pending requests
      if (this.cancelRequest) {
        this.cancelRequest();
      } // close any potential opened viewer


      OCA.Viewer.close(); // if we don't already have some cached data let's show a loader

      if (!this.tags[this.tagId]) {
        this.$emit('update:loading', true);
      }

      this.error = null; // init cancellable request

      const {
        request,
        cancel
      } = Object(_utils_CancelableRequest__WEBPACK_IMPORTED_MODULE_9__["default"])(_services_TaggedImages__WEBPACK_IMPORTED_MODULE_3__["default"]);
      this.cancelRequest = cancel;

      try {
        // get data
        const files = await request(this.tagId);
        this.$store.dispatch('updateTag', {
          id: this.tagId,
          files
        });
        this.$store.dispatch('appendFiles', files);
      } catch (error) {
        console.error(error);
        this.error = true;
      } finally {
        // done loading
        this.$emit('update:loading', false);
        this.cancelRequest = null;
      }
    }

  }
});

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/views/Tags.vue?vue&type=style&index=0&id=730c32d3&lang=scss&scoped=true&":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??ref--1-3!./node_modules/vue-loader/lib??vue-loader-options!./src/views/Tags.vue?vue&type=style&index=0&id=730c32d3&lang=scss&scoped=true& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "@media (min-width: 0px) and (max-width: 400px) {\n.grid-container[data-v-730c32d3] {\n    padding: 66px 8px 256px 8px;\n}\n}\n@media (min-width: 400px) and (max-width: 700px) {\n.grid-container[data-v-730c32d3] {\n    padding: 66px 8px 256px 8px;\n}\n}\n@media (min-width: 700px) and (max-width: 1024px) {\n.grid-container[data-v-730c32d3] {\n    padding: 66px 44px 256px 44px;\n}\n}\n@media (min-width: 1024px) and (max-width: 1280px) {\n.grid-container[data-v-730c32d3] {\n    padding: 66px 44px 256px 44px;\n}\n}\n@media (min-width: 1280px) and (max-width: 1440px) {\n.grid-container[data-v-730c32d3] {\n    padding: 88px 66px 256px 66px;\n}\n}\n@media (min-width: 1440px) and (max-width: 1600px) {\n.grid-container[data-v-730c32d3] {\n    padding: 88px 66px 256px 66px;\n}\n}\n@media (min-width: 1600px) and (max-width: 2048px) {\n.grid-container[data-v-730c32d3] {\n    padding: 88px 66px 256px 66px;\n}\n}\n@media (min-width: 2048px) and (max-width: 2560px) {\n.grid-container[data-v-730c32d3] {\n    padding: 88px 88px 256px 88px;\n}\n}\n@media (min-width: 2560px) and (max-width: 3440px) {\n.grid-container[data-v-730c32d3] {\n    padding: 88px 88px 256px 88px;\n}\n}\n@media (min-width: 3440px) {\n.grid-container[data-v-730c32d3] {\n    padding: 88px 88px 256px 88px;\n}\n}\n", ""]);
// Exports
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/views/Tags.vue?vue&type=style&index=0&id=730c32d3&lang=scss&scoped=true&":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??ref--1-3!./node_modules/vue-loader/lib??vue-loader-options!./src/views/Tags.vue?vue&type=style&index=0&id=730c32d3&lang=scss&scoped=true& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_ref_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Tags_vue_vue_type_style_index_0_id_730c32d3_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??ref--1-3!../../node_modules/vue-loader/lib??vue-loader-options!./Tags.vue?vue&type=style&index=0&id=730c32d3&lang=scss&scoped=true& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/views/Tags.vue?vue&type=style&index=0&id=730c32d3&lang=scss&scoped=true&");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_ref_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Tags_vue_vue_type_style_index_0_id_730c32d3_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ __webpack_exports__["default"] = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_ref_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Tags_vue_vue_type_style_index_0_id_730c32d3_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/components/Tag.vue?vue&type=template&id=bb7ceecc&":
/*!*********************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Tag.vue?vue&type=template&id=bb7ceecc& ***!
  \*********************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("FolderTagPreview", {
    attrs: {
      id: _vm.item.injected.id,
      icon: "icon-tag",
      name: _vm.item.injected.displayName,
      path: _vm.item.injected.displayName,
      "file-list": _vm.fileList
    }
  })
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/views/Tags.vue?vue&type=template&id=730c32d3&scoped=true&":
/*!*****************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/views/Tags.vue?vue&type=template&id=730c32d3&scoped=true& ***!
  \*****************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _vm.error
    ? _c("EmptyContent", [
        _vm._v("\n\t" + _vm._s(_vm.t("photos", "An error occurred")) + "\n")
      ])
    : !_vm.loading
    ? _c(
        "div",
        [
          _c("Navigation", {
            key: "navigation",
            attrs: {
              basename: _vm.path,
              filename: "/" + _vm.path,
              "root-title": _vm.rootTitle
            }
          }),
          _vm._v(" "),
          _vm.isEmpty
            ? _c(
                "EmptyContent",
                {
                  key: "emptycontent",
                  attrs: { "illustration-name": "empty" },
                  scopedSlots: _vm._u(
                    [
                      {
                        key: "desc",
                        fn: function() {
                          return [
                            _vm._v(
                              "\n\t\t\t" +
                                _vm._s(
                                  _vm.t(
                                    "photos",
                                    "Photos with tags will show up here"
                                  )
                                ) +
                                "\n\t\t"
                            )
                          ]
                        },
                        proxy: true
                      }
                    ],
                    null,
                    false,
                    4132175345
                  )
                },
                [
                  _vm._v(
                    "\n\t\t" + _vm._s(_vm.t("photos", "No tags yet")) + "\n\t\t"
                  )
                ]
              )
            : _c(
                "div",
                { staticClass: "grid-container" },
                [
                  _c("VirtualGrid", {
                    ref: "virtualgrid",
                    attrs: {
                      items: _vm.contentList,
                      "get-column-count": function() {
                        return _vm.gridConfig.count
                      },
                      "get-grid-gap": function() {
                        return _vm.gridConfig.gap
                      }
                    }
                  })
                ],
                1
              )
        ],
        1
      )
    : _vm._e()
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./src/components/Tag.vue":
/*!********************************!*\
  !*** ./src/components/Tag.vue ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Tag_vue_vue_type_template_id_bb7ceecc___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Tag.vue?vue&type=template&id=bb7ceecc& */ "./src/components/Tag.vue?vue&type=template&id=bb7ceecc&");
/* harmony import */ var _Tag_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Tag.vue?vue&type=script&lang=js& */ "./src/components/Tag.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _Tag_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _Tag_vue_vue_type_template_id_bb7ceecc___WEBPACK_IMPORTED_MODULE_0__["render"],
  _Tag_vue_vue_type_template_id_bb7ceecc___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/components/Tag.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/components/Tag.vue?vue&type=script&lang=js&":
/*!*********************************************************!*\
  !*** ./src/components/Tag.vue?vue&type=script&lang=js& ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Tag_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib!../../node_modules/vue-loader/lib??vue-loader-options!./Tag.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js?!./src/components/Tag.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Tag_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/components/Tag.vue?vue&type=template&id=bb7ceecc&":
/*!***************************************************************!*\
  !*** ./src/components/Tag.vue?vue&type=template&id=bb7ceecc& ***!
  \***************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Tag_vue_vue_type_template_id_bb7ceecc___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib??vue-loader-options!./Tag.vue?vue&type=template&id=bb7ceecc& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/components/Tag.vue?vue&type=template&id=bb7ceecc&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Tag_vue_vue_type_template_id_bb7ceecc___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Tag_vue_vue_type_template_id_bb7ceecc___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/patchedRequest.js":
/*!*******************************!*\
  !*** ./src/patchedRequest.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @license GNU AGPL version 3 or any later version
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
const request = __webpack_require__(/*! webdav/dist/node/request */ "./node_modules/webdav/dist/node/request.js");

const oldPrepareRequestOptions = request.prepareRequestOptions; // While we wait for official cancellable webdav requests
// https://github.com/perry-mitchell/webdav-client/issues/179
// let's properly forward our axios options through webdav to axios

request.prepareRequestOptions = function (requestOptions, methodOptions) {
  // add our cancelToken support
  if (methodOptions.cancelToken && typeof methodOptions.cancelToken === 'object') {
    requestOptions.cancelToken = methodOptions.cancelToken;
  } // exploit old method


  oldPrepareRequestOptions(requestOptions, methodOptions); // allow us to override the request method

  if (methodOptions.method && typeof methodOptions.method === 'string') {
    requestOptions.method = methodOptions.method;
  }
};

module.exports = request;

/***/ }),

/***/ "./src/services/DavClient.js":
/*!***********************************!*\
  !*** ./src/services/DavClient.js ***!
  \***********************************/
/*! exports provided: remotePath, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "remotePath", function() { return remotePath; });
/* harmony import */ var webdav__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! webdav */ "./node_modules/webdav/dist/node/index.js");
/* harmony import */ var webdav__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(webdav__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _nextcloud_axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/axios */ "./node_modules/@nextcloud/axios/dist/index.js");
/* harmony import */ var _nextcloud_axios__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_axios__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var url_parse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! url-parse */ "./node_modules/url-parse/index.js");
/* harmony import */ var url_parse__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(url_parse__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @nextcloud/router */ "./node_modules/@nextcloud/router/dist/index.js");
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_router__WEBPACK_IMPORTED_MODULE_3__);
/**
 * @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @license GNU AGPL version 3 or any later version
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



 // force our axios

const patcher = webdav__WEBPACK_IMPORTED_MODULE_0___default.a.getPatcher();
patcher.patch('request', _nextcloud_axios__WEBPACK_IMPORTED_MODULE_1___default.a); // init webdav client on default dav endpoint

const remote = Object(_nextcloud_router__WEBPACK_IMPORTED_MODULE_3__["generateRemoteUrl"])('dav');
const client = webdav__WEBPACK_IMPORTED_MODULE_0___default.a.createClient(remote);
const remotePath = url_parse__WEBPACK_IMPORTED_MODULE_2___default()(remote).pathname;
/* harmony default export */ __webpack_exports__["default"] = (client);

/***/ }),

/***/ "./src/services/DavRequest.js":
/*!************************************!*\
  !*** ./src/services/DavRequest.js ***!
  \************************************/
/*! exports provided: props, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "props", function() { return props; });
/**
 * @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @license GNU AGPL version 3 or any later version
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
const props = "\n\t<oc:fileid />\n\t<d:getlastmodified />\n\t<d:getetag />\n\t<d:getcontenttype />\n\t<d:getcontentlength />\n\t<nc:has-preview />\n\t<oc:favorite />\n\t<d:resourcetype />";

/* harmony default export */ __webpack_exports__["default"] = ("<?xml version=\"1.0\"?>\n\t\t\t<d:propfind xmlns:d=\"DAV:\"\n\t\t\t\txmlns:oc=\"http://owncloud.org/ns\"\n\t\t\t\txmlns:nc=\"http://nextcloud.org/ns\"\n\t\t\t\txmlns:ocs=\"http://open-collaboration-services.org/ns\">\n\t\t\t\t<d:prop>\n\t\t\t\t\t".concat(props, "\n\t\t\t\t</d:prop>\n\t\t\t</d:propfind>"));

/***/ }),

/***/ "./src/services/SystemTags.js":
/*!************************************!*\
  !*** ./src/services/SystemTags.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _DavClient__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DavClient */ "./src/services/DavClient.js");
/* harmony import */ var _utils_fileUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/fileUtils */ "./src/utils/fileUtils.js");
/**
 * @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @license GNU AGPL version 3 or any later version
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
 * List system tags
 *
 * @param {String} path the path relative to the user root
 * @param {Object} [options] optional options for axios
 * @returns {Array} the file list
 */

/* harmony default export */ __webpack_exports__["default"] = (async function (path, options = {}) {
  const response = await _DavClient__WEBPACK_IMPORTED_MODULE_0__["default"].getDirectoryContents('/systemtags/', Object.assign({}, {
    data: "<?xml version=\"1.0\"?>\n\t\t\t<d:propfind  xmlns:d=\"DAV:\"\n\t\t\t\txmlns:oc=\"http://owncloud.org/ns\">\n\t\t\t\t<d:prop>\n\t\t\t\t\t<oc:id />\n\t\t\t\t\t<oc:display-name />\n\t\t\t\t\t<oc:user-visible />\n\t\t\t\t\t<oc:user-assignable />\n\t\t\t\t\t<oc:can-assign />\n\t\t\t\t</d:prop>\n\t\t\t</d:propfind>",
    details: true
  }, options));
  return response.data.map(data => Object(_utils_fileUtils__WEBPACK_IMPORTED_MODULE_1__["genFileInfo"])(data));
});

/***/ }),

/***/ "./src/services/TaggedImages.js":
/*!**************************************!*\
  !*** ./src/services/TaggedImages.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_fileUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/fileUtils */ "./src/utils/fileUtils.js");
/* harmony import */ var _nextcloud_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/auth */ "./node_modules/@nextcloud/auth/dist/index.js");
/* harmony import */ var _nextcloud_auth__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_auth__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _DavRequest__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DavRequest */ "./src/services/DavRequest.js");
/* harmony import */ var _AllowedMimes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./AllowedMimes */ "./src/services/AllowedMimes.js");
/* harmony import */ var _DavClient__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./DavClient */ "./src/services/DavClient.js");
/**
 * @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @license GNU AGPL version 3 or any later version
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
 * Get tagged files based on provided tag id
 *
 * @param {number} id the tag id to filter
 * @param {Object} [options] optional options for axios
 * @returns {Array} the file list
 */

/* harmony default export */ __webpack_exports__["default"] = (async function (id, options = {}) {
  options = Object.assign({
    method: 'REPORT',
    data: "<?xml version=\"1.0\"?>\n\t\t\t<oc:filter-files\n\t\t\t\txmlns:d=\"DAV:\"\n\t\t\t\txmlns:oc=\"http://owncloud.org/ns\"\n\t\t\t\txmlns:nc=\"http://nextcloud.org/ns\"\n\t\t\t\txmlns:ocs=\"http://open-collaboration-services.org/ns\">\n\t\t\t\t<d:prop>\n\t\t\t\t\t".concat(_DavRequest__WEBPACK_IMPORTED_MODULE_2__["props"], "\n\t\t\t\t</d:prop>\n\t\t\t\t<oc:filter-rules>\n\t\t\t\t\t<oc:systemtag>").concat(id, "</oc:systemtag>\n\t\t\t\t</oc:filter-rules>\n\t\t\t</oc:filter-files>"),
    details: true
  }, options);
  const prefixPath = "/files/".concat(Object(_nextcloud_auth__WEBPACK_IMPORTED_MODULE_1__["getCurrentUser"])().uid);
  const response = await _DavClient__WEBPACK_IMPORTED_MODULE_4__["default"].getDirectoryContents(prefixPath, options);
  return response.data.map(data => Object(_utils_fileUtils__WEBPACK_IMPORTED_MODULE_0__["genFileInfo"])(data)) // filter out unwanted mime because server REPORT service only support
  // hardcoded props and mime is not one of them
  // https://github.com/nextcloud/server/blob/5bf3d1bb384da56adbf205752be8f840aac3b0c5/apps/dav/lib/Connector/Sabre/FilesReportPlugin.php#L274
  .filter(file => file.mime && _AllowedMimes__WEBPACK_IMPORTED_MODULE_3__["default"].indexOf(file.mime) !== -1) // remove prefix path from full file path
  .map(data => Object.assign({}, data, {
    filename: data.filename.replace(prefixPath, '')
  }));
});

/***/ }),

/***/ "./src/views/Tags.vue":
/*!****************************!*\
  !*** ./src/views/Tags.vue ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Tags_vue_vue_type_template_id_730c32d3_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Tags.vue?vue&type=template&id=730c32d3&scoped=true& */ "./src/views/Tags.vue?vue&type=template&id=730c32d3&scoped=true&");
/* harmony import */ var _Tags_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Tags.vue?vue&type=script&lang=js& */ "./src/views/Tags.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _Tags_vue_vue_type_style_index_0_id_730c32d3_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Tags.vue?vue&type=style&index=0&id=730c32d3&lang=scss&scoped=true& */ "./src/views/Tags.vue?vue&type=style&index=0&id=730c32d3&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _Tags_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _Tags_vue_vue_type_template_id_730c32d3_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _Tags_vue_vue_type_template_id_730c32d3_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "730c32d3",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/views/Tags.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/views/Tags.vue?vue&type=script&lang=js&":
/*!*****************************************************!*\
  !*** ./src/views/Tags.vue?vue&type=script&lang=js& ***!
  \*****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Tags_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib!../../node_modules/vue-loader/lib??vue-loader-options!./Tags.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js?!./src/views/Tags.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Tags_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/views/Tags.vue?vue&type=style&index=0&id=730c32d3&lang=scss&scoped=true&":
/*!**************************************************************************************!*\
  !*** ./src/views/Tags.vue?vue&type=style&index=0&id=730c32d3&lang=scss&scoped=true& ***!
  \**************************************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_ref_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Tags_vue_vue_type_style_index_0_id_730c32d3_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/style-loader/dist/cjs.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??ref--1-3!../../node_modules/vue-loader/lib??vue-loader-options!./Tags.vue?vue&type=style&index=0&id=730c32d3&lang=scss&scoped=true& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/views/Tags.vue?vue&type=style&index=0&id=730c32d3&lang=scss&scoped=true&");
/* empty/unused harmony star reexport */

/***/ }),

/***/ "./src/views/Tags.vue?vue&type=template&id=730c32d3&scoped=true&":
/*!***********************************************************************!*\
  !*** ./src/views/Tags.vue?vue&type=template&id=730c32d3&scoped=true& ***!
  \***********************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Tags_vue_vue_type_template_id_730c32d3_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib??vue-loader-options!./Tags.vue?vue&type=template&id=730c32d3&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/views/Tags.vue?vue&type=template&id=730c32d3&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Tags_vue_vue_type_template_id_730c32d3_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Tags_vue_vue_type_template_id_730c32d3_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ 0:
/*!**********************!*\
  !*** util (ignored) ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 1:
/*!**********************!*\
  !*** util (ignored) ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 10:
/*!************************!*\
  !*** buffer (ignored) ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 11:
/*!************************!*\
  !*** buffer (ignored) ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 12:
/*!************************!*\
  !*** buffer (ignored) ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 13:
/*!************************!*\
  !*** buffer (ignored) ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 2:
/*!**********************!*\
  !*** util (ignored) ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 3:
/*!**********************!*\
  !*** util (ignored) ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 4:
/*!************************!*\
  !*** buffer (ignored) ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 5:
/*!************************!*\
  !*** buffer (ignored) ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 6:
/*!************************!*\
  !*** crypto (ignored) ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 7:
/*!**********************!*\
  !*** util (ignored) ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 8:
/*!**********************!*\
  !*** util (ignored) ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 9:
/*!************************!*\
  !*** buffer (ignored) ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ })

}]);
//# sourceMappingURL=photos-6.js.map?v=b42a06c3c057277c1e66