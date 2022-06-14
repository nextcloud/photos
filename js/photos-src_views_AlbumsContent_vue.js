"use strict";
(self["webpackChunkphotos"] = self["webpackChunkphotos"] || []).push([["src_views_AlbumsContent_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/AlbumsContent.vue?vue&type=script&lang=js&":
/*!******************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/AlbumsContent.vue?vue&type=script&lang=js& ***!
  \******************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _services_AlbumContent_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/AlbumContent.js */ "./src/services/AlbumContent.js");
/* harmony import */ var _components_EmptyContent_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/EmptyContent.vue */ "./src/components/EmptyContent.vue");
/* harmony import */ var _components_Navigation_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/Navigation.vue */ "./src/components/Navigation.vue");
/* harmony import */ var _utils_CancelableRequest_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/CancelableRequest.js */ "./src/utils/CancelableRequest.js");
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





/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'AlbumsContent',
  components: {
    EmptyContent: _components_EmptyContent_vue__WEBPACK_IMPORTED_MODULE_1__["default"],
    Navigation: _components_Navigation_vue__WEBPACK_IMPORTED_MODULE_2__["default"]
  },
  props: {
    rootTitle: {
      type: String,
      required: true
    },
    path: {
      type: String,
      default: '/'
    }
  },

  data() {
    return {
      error: null,
      cancelRequest: () => {}
    };
  },

  computed: { // global lists
    ...(0,vuex__WEBPACK_IMPORTED_MODULE_4__.mapGetters)(['files', 'albums']),

    /**
     * @return {string} The album id from the current path.
     */
    albumId() {
      return this.path;
    },

    /**
     * @return {string[]} The album information for the current albumId.
     */
    album() {
      return this.albums[this.albumId];
    },

    /**
     * @return {string[]} The list of items for the current albumId.
     */
    albumItems() {
      return this.album?.items.map(itemId => this.files[itemId]) ?? [];
    }

  },
  watch: {
    albumId() {
      this.fetchAlbumContent();
    }

  },

  async beforeMount() {
    this.fetchAlbumContent();
  },

  beforeDestroy() {
    this.cancelRequest('Changed view');
  },

  methods: {
    async fetchAlbumContent() {
      // Cancel any pending requests.
      this.cancelRequest('Changed album'); // close any potential opened viewer & sidebar

      OCA.Viewer && OCA.Viewer.close && OCA.Viewer.close();
      OCA.Files && OCA.Files.Sidebar.close && OCA.Files.Sidebar.close();
      this.error = null; // init cancellable request

      const {
        request,
        cancel
      } = (0,_utils_CancelableRequest_js__WEBPACK_IMPORTED_MODULE_3__["default"])(_services_AlbumContent_js__WEBPACK_IMPORTED_MODULE_0__["default"]);
      this.cancelRequest = cancel;

      try {
        // Get the content for the current album.
        const {
          albumItems
        } = await request(this.path, {
          shared: this.showShared
        });
        this.$store.dispatch('addPath', {
          path: this.path,
          fileid: folder.fileid
        });
        this.$store.dispatch('updateFolders', {
          fileid: folder.fileid,
          files,
          folders
        });
        this.$store.dispatch('updateFiles', {
          folder,
          files,
          folders
        });
      } catch (error) {
        if (error.response && error.response.status) {
          if (error.response.status === 404) {
            this.error = 404;
            setTimeout(() => {
              this.$router.push({
                name: this.$route.name
              });
            }, 3000);
          } else {
            this.error = error;
          }
        } // cancelled request, moving on...


        console.error('Error fetching album data', error);
      } finally {
        // done loading even with errors
        this.$emit('update:loading', false);
      }
    }

  }
});

/***/ }),

/***/ "./src/services/AlbumContent.js":
/*!**************************************!*\
  !*** ./src/services/AlbumContent.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _nextcloud_axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/axios */ "./node_modules/@nextcloud/axios/dist/index.js");
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/router */ "./node_modules/@nextcloud/router/dist/index.js");
/* harmony import */ var _utils_fileUtils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/fileUtils */ "./src/utils/fileUtils.js");
/* harmony import */ var _AllowedMimes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./AllowedMimes */ "./src/services/AllowedMimes.js");
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




/**
 * List files from a folder and filter out unwanted mimes
 *
 * @param {string} path the path relative to the user root
 * @param {object} [options] optional options for axios
 * @param {boolean} [options.shared] fetch shared albums ?
 * @return {Array} the file list
 */

/* harmony default export */ async function __WEBPACK_DEFAULT_EXPORT__() {
  let path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/';
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const prefixPath = (0,_nextcloud_router__WEBPACK_IMPORTED_MODULE_1__.generateUrl)(`/apps/photos/api/v1/${options.shared ? 'shared' : 'albums'}`); // fetch listing

  const response = await _nextcloud_axios__WEBPACK_IMPORTED_MODULE_0__["default"].get(prefixPath + (0,_utils_fileUtils__WEBPACK_IMPORTED_MODULE_2__.encodeFilePath)(path), options);
  const list = response.data.map(data => (0,_utils_fileUtils__WEBPACK_IMPORTED_MODULE_2__.genFileInfo)(data)); // filter all the files and folders

  let folder = {};
  const folders = [];
  const files = [];

  for (const entry of list) {
    // is this the current provided path ?
    if (entry.filename === path) {
      folder = entry;
    } else if (entry.type !== 'file') {
      folders.push(entry);
    } else if (_AllowedMimes__WEBPACK_IMPORTED_MODULE_3__["default"].indexOf(entry.mime) > -1) {
      files.push(entry);
    }
  } // return current folder, subfolders and files


  return {
    folder,
    folders,
    files
  };
}

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/AlbumsContent.vue?vue&type=style&index=0&id=1c00d9ab&lang=scss&scoped=true&":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/AlbumsContent.vue?vue&type=style&index=0&id=1c00d9ab&lang=scss&scoped=true& ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, "@charset \"UTF-8\";\n/**\n * @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>\n *\n * @author John Molakvoæ <skjnldsv@protonmail.com>\n *\n * @license AGPL-3.0-or-later\n *\n * This program is free software: you can redistribute it and/or modify\n * it under the terms of the GNU Affero General Public License as\n * published by the Free Software Foundation, either version 3 of the\n * License, or (at your option) any later version.\n *\n * This program is distributed in the hope that it will be useful,\n * but WITHOUT ANY WARRANTY; without even the implied warranty of\n * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the\n * GNU Affero General Public License for more details.\n *\n * You should have received a copy of the GNU Affero General Public License\n * along with this program. If not, see <http://www.gnu.org/licenses/>.\n *\n */\n@media (min-width: 0px) and (max-width: 400px) {\n.grid-container[data-v-1c00d9ab] {\n    padding: 0px 8px 256px 8px;\n}\n}\n@media (min-width: 400px) and (max-width: 700px) {\n.grid-container[data-v-1c00d9ab] {\n    padding: 0px 8px 256px 8px;\n}\n}\n@media (min-width: 700px) and (max-width: 1024px) {\n.grid-container[data-v-1c00d9ab] {\n    padding: 0px 44px 256px 44px;\n}\n}\n@media (min-width: 1024px) and (max-width: 1280px) {\n.grid-container[data-v-1c00d9ab] {\n    padding: 0px 44px 256px 44px;\n}\n}\n@media (min-width: 1280px) and (max-width: 1440px) {\n.grid-container[data-v-1c00d9ab] {\n    padding: 0px 66px 256px 66px;\n}\n}\n@media (min-width: 1440px) and (max-width: 1600px) {\n.grid-container[data-v-1c00d9ab] {\n    padding: 0px 66px 256px 66px;\n}\n}\n@media (min-width: 1600px) and (max-width: 2048px) {\n.grid-container[data-v-1c00d9ab] {\n    padding: 0px 66px 256px 66px;\n}\n}\n@media (min-width: 2048px) and (max-width: 2560px) {\n.grid-container[data-v-1c00d9ab] {\n    padding: 0px 88px 256px 88px;\n}\n}\n@media (min-width: 2560px) and (max-width: 3440px) {\n.grid-container[data-v-1c00d9ab] {\n    padding: 0px 88px 256px 88px;\n}\n}\n@media (min-width: 3440px) {\n.grid-container[data-v-1c00d9ab] {\n    padding: 0px 88px 256px 88px;\n}\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/AlbumsContent.vue?vue&type=style&index=0&id=1c00d9ab&lang=scss&scoped=true&":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/AlbumsContent.vue?vue&type=style&index=0&id=1c00d9ab&lang=scss&scoped=true& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumsContent_vue_vue_type_style_index_0_id_1c00d9ab_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AlbumsContent.vue?vue&type=style&index=0&id=1c00d9ab&lang=scss&scoped=true& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/AlbumsContent.vue?vue&type=style&index=0&id=1c00d9ab&lang=scss&scoped=true&");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumsContent_vue_vue_type_style_index_0_id_1c00d9ab_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumsContent_vue_vue_type_style_index_0_id_1c00d9ab_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumsContent_vue_vue_type_style_index_0_id_1c00d9ab_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumsContent_vue_vue_type_style_index_0_id_1c00d9ab_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/views/AlbumsContent.vue":
/*!*************************************!*\
  !*** ./src/views/AlbumsContent.vue ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _AlbumsContent_vue_vue_type_template_id_1c00d9ab_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AlbumsContent.vue?vue&type=template&id=1c00d9ab&scoped=true& */ "./src/views/AlbumsContent.vue?vue&type=template&id=1c00d9ab&scoped=true&");
/* harmony import */ var _AlbumsContent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AlbumsContent.vue?vue&type=script&lang=js& */ "./src/views/AlbumsContent.vue?vue&type=script&lang=js&");
/* harmony import */ var _AlbumsContent_vue_vue_type_style_index_0_id_1c00d9ab_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AlbumsContent.vue?vue&type=style&index=0&id=1c00d9ab&lang=scss&scoped=true& */ "./src/views/AlbumsContent.vue?vue&type=style&index=0&id=1c00d9ab&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _AlbumsContent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _AlbumsContent_vue_vue_type_template_id_1c00d9ab_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render,
  _AlbumsContent_vue_vue_type_template_id_1c00d9ab_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "1c00d9ab",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/views/AlbumsContent.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/views/AlbumsContent.vue?vue&type=script&lang=js&":
/*!**************************************************************!*\
  !*** ./src/views/AlbumsContent.vue?vue&type=script&lang=js& ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumsContent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AlbumsContent.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/AlbumsContent.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumsContent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/views/AlbumsContent.vue?vue&type=style&index=0&id=1c00d9ab&lang=scss&scoped=true&":
/*!***********************************************************************************************!*\
  !*** ./src/views/AlbumsContent.vue?vue&type=style&index=0&id=1c00d9ab&lang=scss&scoped=true& ***!
  \***********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumsContent_vue_vue_type_style_index_0_id_1c00d9ab_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/style-loader/dist/cjs.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AlbumsContent.vue?vue&type=style&index=0&id=1c00d9ab&lang=scss&scoped=true& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/AlbumsContent.vue?vue&type=style&index=0&id=1c00d9ab&lang=scss&scoped=true&");


/***/ }),

/***/ "./src/views/AlbumsContent.vue?vue&type=template&id=1c00d9ab&scoped=true&":
/*!********************************************************************************!*\
  !*** ./src/views/AlbumsContent.vue?vue&type=template&id=1c00d9ab&scoped=true& ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumsContent_vue_vue_type_template_id_1c00d9ab_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumsContent_vue_vue_type_template_id_1c00d9ab_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumsContent_vue_vue_type_template_id_1c00d9ab_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AlbumsContent.vue?vue&type=template&id=1c00d9ab&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/AlbumsContent.vue?vue&type=template&id=1c00d9ab&scoped=true&");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/AlbumsContent.vue?vue&type=template&id=1c00d9ab&scoped=true&":
/*!***********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/AlbumsContent.vue?vue&type=template&id=1c00d9ab&scoped=true& ***!
  \***********************************************************************************************************************************************************************************************************************/
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
  return _vm.error === 404
    ? _c("EmptyContent", { attrs: { "illustration-name": "folder" } }, [
        _vm._v(
          "\n\t" + _vm._s(_vm.t("photos", "This album does not exist")) + "\n"
        ),
      ])
    : _vm.error
    ? _c("EmptyContent", [
        _vm._v("\n\t" + _vm._s(_vm.t("photos", "An error occurred")) + "\n"),
      ])
    : !_vm.loading
    ? _c(
        "div",
        [
          _vm.album
            ? _c(
                "Navigation",
                _vm._b(
                  {
                    key: "navigation",
                    attrs: {
                      "root-title": _vm.rootTitle,
                      "show-actions": true,
                    },
                  },
                  "Navigation",
                  _vm.album,
                  false
                )
              )
            : _vm._e(),
          _vm._v(" "),
          _vm.nbFetchedFiles === 0 && _vm.loading ? _c("Loader") : _vm._e(),
          _vm._v(" "),
          _c("TiledLayout", {
            attrs: { items: _vm.itemsList },
            scopedSlots: _vm._u([
              {
                key: "default",
                fn: function (ref) {
                  var rows = ref.rows
                  return _c("VirtualScrolling", {
                    attrs: { rows: rows },
                    on: { "need-content": _vm.getContent },
                    scopedSlots: _vm._u([
                      {
                        key: "default",
                        fn: function (ref) {
                          var renderedRows = ref.renderedRows
                          return _c("TiltedRows", {
                            attrs: { rows: renderedRows },
                            scopedSlots: _vm._u(
                              [
                                {
                                  key: "default",
                                  fn: function (ref) {
                                    var row = ref.row
                                    var item = ref.item
                                    return _c("File", {
                                      style: {
                                        width: row.height * item.ratio + "px",
                                        height: row.height + "px",
                                      },
                                      attrs: {
                                        item: _vm.files[item.id],
                                        "allow-selection": true,
                                        selected:
                                          _vm.selectedItems[item.id] === true,
                                        visibility: row.visibility,
                                        semaphore: _vm.semaphore,
                                      },
                                      on: {
                                        "on-click": _vm.openViewer,
                                        "select-toggled":
                                          _vm.onItemSelectToggle,
                                      },
                                    })
                                  },
                                },
                              ],
                              null,
                              true
                            ),
                          })
                        },
                      },
                    ]),
                  })
                },
              },
            ]),
          }),
          _vm._v(" "),
          _vm.nbFetchedFiles === 0 && !_vm.loading
            ? _c(
                "EmptyContent",
                {
                  key: "emptycontent",
                  attrs: { "illustration-name": "empty" },
                },
                [
                  _vm._v(
                    "\n\t\t" +
                      _vm._s(_vm.t("photos", "This album is empty")) +
                      "\n\t"
                  ),
                ]
              )
            : _vm._e(),
        ],
        1
      )
    : _vm._e()
}
var staticRenderFns = []
render._withStripped = true



/***/ })

}]);
//# sourceMappingURL=photos-src_views_AlbumsContent_vue.js.map?v=c21ff25047d9e98957eb