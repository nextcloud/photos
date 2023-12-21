"use strict";
(self["webpackChunkphotos"] = self["webpackChunkphotos"] || []).push([["src_views_SharedAlbumContent_vue"],{

/***/ "./node_modules/@nextcloud/sharing/dist/index.js":
/*!*******************************************************!*\
  !*** ./node_modules/@nextcloud/sharing/dist/index.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Type = void 0;
var Type;
exports.Type = Type;

(function (Type) {
  Type[Type["SHARE_TYPE_USER"] = 0] = "SHARE_TYPE_USER";
  Type[Type["SHARE_TYPE_GROUP"] = 1] = "SHARE_TYPE_GROUP";
  Type[Type["SHARE_TYPE_LINK"] = 3] = "SHARE_TYPE_LINK";
  Type[Type["SHARE_TYPE_EMAIL"] = 4] = "SHARE_TYPE_EMAIL";
  Type[Type["SHARE_TYPE_REMOTE"] = 6] = "SHARE_TYPE_REMOTE";
  Type[Type["SHARE_TYPE_CIRCLE"] = 7] = "SHARE_TYPE_CIRCLE";
  Type[Type["SHARE_TYPE_GUEST"] = 8] = "SHARE_TYPE_GUEST";
  Type[Type["SHARE_TYPE_REMOTE_GROUP"] = 9] = "SHARE_TYPE_REMOTE_GROUP";
  Type[Type["SHARE_TYPE_ROOM"] = 10] = "SHARE_TYPE_ROOM";
  Type[Type["SHARE_TYPE_DECK"] = 12] = "SHARE_TYPE_DECK";
})(Type || (exports.Type = Type = {}));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/SharedAlbumContent.vue?vue&type=script&lang=js&":
/*!***********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/SharedAlbumContent.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/vue */ "./node_modules/@nextcloud/vue/dist/index.mjs");
/* harmony import */ var _nextcloud_sharing__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/sharing */ "./node_modules/@nextcloud/sharing/dist/index.js");
/* harmony import */ var _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @nextcloud/l10n */ "./node_modules/@nextcloud/l10n/dist/index.mjs");
/* harmony import */ var vue_material_design_icons_MapMarker_vue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! vue-material-design-icons/MapMarker.vue */ "./node_modules/vue-material-design-icons/MapMarker.vue");
/* harmony import */ var vue_material_design_icons_Plus_vue__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! vue-material-design-icons/Plus.vue */ "./node_modules/vue-material-design-icons/Plus.vue");
/* harmony import */ var vue_material_design_icons_Delete_vue__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! vue-material-design-icons/Delete.vue */ "./node_modules/vue-material-design-icons/Delete.vue");
/* harmony import */ var vue_material_design_icons_ImagePlus_vue__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! vue-material-design-icons/ImagePlus.vue */ "./node_modules/vue-material-design-icons/ImagePlus.vue");
/* harmony import */ var vue_material_design_icons_Close_vue__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! vue-material-design-icons/Close.vue */ "./node_modules/vue-material-design-icons/Close.vue");
/* harmony import */ var _mixins_FetchFilesMixin_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../mixins/FetchFilesMixin.js */ "./src/mixins/FetchFilesMixin.js");
/* harmony import */ var _mixins_FetchCollectionContentMixin_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../mixins/FetchCollectionContentMixin.js */ "./src/mixins/FetchCollectionContentMixin.js");
/* harmony import */ var _components_Collection_CollectionContent_vue__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../components/Collection/CollectionContent.vue */ "./src/components/Collection/CollectionContent.vue");
/* harmony import */ var _components_HeaderNavigation_vue__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../components/HeaderNavigation.vue */ "./src/components/HeaderNavigation.vue");
/* harmony import */ var _components_FilesPicker_vue__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../components/FilesPicker.vue */ "./src/components/FilesPicker.vue");









// import Download from 'vue-material-design-icons/Download.vue'
// import DownloadMultiple from 'vue-material-design-icons/DownloadMultiple.vue'





// import ActionDownload from '../components/Actions/ActionDownload.vue'

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'SharedAlbumContent',
  components: {
    MapMarker: vue_material_design_icons_MapMarker_vue__WEBPACK_IMPORTED_MODULE_3__["default"],
    Plus: vue_material_design_icons_Plus_vue__WEBPACK_IMPORTED_MODULE_4__["default"],
    Close: vue_material_design_icons_Close_vue__WEBPACK_IMPORTED_MODULE_7__["default"],
    // Download,
    // DownloadMultiple,
    Delete: vue_material_design_icons_Delete_vue__WEBPACK_IMPORTED_MODULE_5__["default"],
    ImagePlus: vue_material_design_icons_ImagePlus_vue__WEBPACK_IMPORTED_MODULE_6__["default"],
    NcEmptyContent: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_0__.NcEmptyContent,
    NcActions: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_0__.NcActions,
    NcActionButton: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_0__.NcActionButton,
    NcActionSeparator: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_0__.NcActionSeparator,
    NcButton: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_0__.NcButton,
    NcModal: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_0__.NcModal,
    NcUserBubble: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_0__.NcUserBubble,
    CollectionContent: _components_Collection_CollectionContent_vue__WEBPACK_IMPORTED_MODULE_10__["default"],
    // ActionDownload,
    FilesPicker: _components_FilesPicker_vue__WEBPACK_IMPORTED_MODULE_12__["default"],
    HeaderNavigation: _components_HeaderNavigation_vue__WEBPACK_IMPORTED_MODULE_11__["default"]
  },
  mixins: [_mixins_FetchCollectionContentMixin_js__WEBPACK_IMPORTED_MODULE_9__["default"], _mixins_FetchFilesMixin_js__WEBPACK_IMPORTED_MODULE_8__["default"], _nextcloud_vue__WEBPACK_IMPORTED_MODULE_0__.isMobile],
  props: {
    albumName: {
      type: String,
      default: '/'
    }
  },
  data() {
    return {
      showAddPhotosModal: false,
      loadingCount: 0,
      loadingAddFilesToAlbum: false,
      collaboratorTypes: _nextcloud_sharing__WEBPACK_IMPORTED_MODULE_1__.Type
    };
  },
  computed: {
    ...(0,vuex__WEBPACK_IMPORTED_MODULE_13__.mapGetters)(['files', 'sharedAlbumsFiles']),
    /**
     * @return {import('../store/sharedAlbums.js').SharedAlbum|undefined} The album information for the current albumName.
     */
    album() {
      return this.$store.getters.getSharedAlbum(this.albumName);
    },
    /**
     * @return {string[]} The list of files for the current albumName.
     */
    albumFileIds() {
      return this.$store.getters.getSharedAlbumFiles(this.albumName);
    },
    /**
     * @return {string} The album name without the userId between parentheses.
     */
    albumOriginalName() {
      return this.albumName.replace(new RegExp(`\\(${this.album.collaborators[0].id}\\)$`), '');
    },
    /**
     * @return {string} The album's filename based on its name. Useful to fetch the location information and content.
     */
    albumFileName() {
      return this.$store.getters.getSharedAlbumName(this.albumName);
    }
  },
  async mounted() {
    this.fetchAlbum();
    this.fetchAlbumContent();
  },
  methods: {
    ...(0,vuex__WEBPACK_IMPORTED_MODULE_13__.mapActions)(['addFilesToCollection', 'removeFilesFromCollection', 'deleteCollection']),
    async fetchAlbum() {
      await this.fetchCollection(this.albumFileName, ['<nc:location />', '<nc:dateRange />', '<nc:collaborators />']);
    },
    async fetchAlbumContent() {
      await this.fetchCollectionFiles(this.albumFileName);
    },
    async handleFilesPicked(fileIds) {
      this.showAddPhotosModal = false;
      await this.addFilesToCollection({
        collectionFileName: this.album.filename,
        fileIdsToAdd: fileIds
      });
      // Re-fetch album content to have the proper filenames.
      await this.fetchAlbumContent();
    },
    async handleRemoveFilesFromAlbum(fileIds) {
      this.$refs.collectionContent.onUncheckFiles(fileIds);
      await this.removeFilesFromCollection({
        collectionFileName: this.album.filename,
        fileIdsToRemove: fileIds
      });
    },
    async handleDeleteAlbum() {
      await this.deleteCollection({
        collectionFileName: this.album.filename
      });
      this.$router.push('/sharedalbums');
    },
    t: _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_2__.translate
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/SharedAlbumContent.vue?vue&type=template&id=259e376e&scoped=true&":
/*!**********************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/SharedAlbumContent.vue?vue&type=template&id=259e376e&scoped=true& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", [ true ? _c("CollectionContent", {
    ref: "collectionContent",
    attrs: {
      collection: _vm.album,
      "collection-file-ids": _vm.albumFileIds,
      loading: _vm.loadingCollection || _vm.loadingCollectionFiles,
      error: _vm.errorFetchingCollection || _vm.errorFetchingCollectionFiles
    },
    scopedSlots: _vm._u([{
      key: "header",
      fn: function (_ref) {
        let {
          selectedFileIds,
          resetSelection
        } = _ref;
        return _c("HeaderNavigation", {
          key: "navigation",
          attrs: {
            loading: _vm.loadingCollectionFiles,
            params: {
              albumName: _vm.albumName
            },
            path: "/" + _vm.albumName,
            title: _vm.albumOriginalName
          },
          on: {
            refresh: _vm.fetchAlbumContent
          }
        }, [_vm.album !== undefined && _vm.album.location !== "" ? _c("div", {
          staticClass: "album__location",
          attrs: {
            slot: "subtitle"
          },
          slot: "subtitle"
        }, [_c("MapMarker"), _vm._v(_vm._s(_vm.album.location) + " ⸱ " + _vm._s(_vm.t("photos", "Shared by")) + " "), _c("NcUserBubble", {
          attrs: {
            "display-name": _vm.album.collaborators[0].label,
            user: _vm.album.collaborators[0].id
          }
        })], 1) : _vm._e(), _vm._v(" "), _c("template", {
          slot: "default"
        }, [selectedFileIds.length > 0 ? _c("NcButton", {
          attrs: {
            "aria-label": _vm.t("photos", "Unselect all")
          },
          on: {
            click: resetSelection
          },
          scopedSlots: _vm._u([{
            key: "icon",
            fn: function () {
              return [_c("Close")];
            },
            proxy: true
          }], null, true)
        }, [_vm._v("\n\t\t\t\t\t" + _vm._s(_vm.t("photos", "Unselect all")) + "\n\t\t\t\t")]) : _vm._e()], 1), _vm._v(" "), _vm.album !== undefined ? _c("template", {
          slot: "right"
        }, [_vm.album.nbItems !== 0 ? _c("NcButton", {
          attrs: {
            type: "secondary",
            "aria-label": _vm.t("photos", "Add photos to this album")
          },
          on: {
            click: function ($event) {
              _vm.showAddPhotosModal = true;
            }
          }
        }, [_c("Plus", {
          attrs: {
            slot: "icon"
          },
          slot: "icon"
        }), _vm._v("\n\t\t\t\t\t" + _vm._s(_vm.t("photos", "Add")) + "\n\t\t\t\t")], 1) : _vm._e(), _vm._v(" "), _c("NcActions", {
          attrs: {
            "force-menu": true,
            "aria-label": _vm.t("photos", "Open actions menu")
          }
        }, [_vm.album.collaborators[0].type === _vm.collaboratorTypes.SHARE_TYPE_USER ? _c("NcActionButton", {
          attrs: {
            "close-after-click": true
          },
          on: {
            click: _vm.handleDeleteAlbum
          }
        }, [_vm._v("\n\t\t\t\t\t\t" + _vm._s(_vm.t("photos", "Delete album")) + "\n\t\t\t\t\t\t"), _c("Delete", {
          attrs: {
            slot: "icon"
          },
          slot: "icon"
        })], 1) : _vm._e(), _vm._v(" "), selectedFileIds.length > 0 ? [_c("NcActionSeparator"), _vm._v(" "), _c("NcActionButton", {
          attrs: {
            "close-after-click": true
          },
          on: {
            click: function ($event) {
              return _vm.handleRemoveFilesFromAlbum(selectedFileIds);
            }
          }
        }, [_vm._v("\n\t\t\t\t\t\t\t" + _vm._s(_vm.t("photos", "Remove selection from album")) + "\n\t\t\t\t\t\t\t"), _c("Close", {
          attrs: {
            slot: "icon"
          },
          slot: "icon"
        })], 1)] : _vm._e()], 2)], 1) : _vm._e()], 2);
      }
    }], null, false, 284801126)
  }, [_vm._v(" "), _vm.album !== undefined && _vm.album.nbItems === 0 && !(_vm.loadingCollectionFiles || _vm.loadingCollection) ? _c("NcEmptyContent", {
    staticClass: "album__empty",
    attrs: {
      slot: "empty-content",
      name: _vm.t("photos", "This album does not have any photos or videos yet!")
    },
    slot: "empty-content"
  }, [_c("ImagePlus", {
    attrs: {
      slot: "icon"
    },
    slot: "icon"
  }), _vm._v(" "), _c("NcButton", {
    staticClass: "album__empty__button",
    attrs: {
      slot: "action",
      type: "primary",
      "aria-label": _vm.t("photos", "Add photos to this album")
    },
    on: {
      click: function ($event) {
        _vm.showAddPhotosModal = true;
      }
    },
    slot: "action"
  }, [_c("Plus", {
    attrs: {
      slot: "icon"
    },
    slot: "icon"
  }), _vm._v("\n\t\t\t\t" + _vm._s(_vm.t("photos", "Add")) + "\n\t\t\t")], 1)], 1) : _vm._e()], 1) : 0, _vm._v(" "), _vm.showAddPhotosModal ? _c("NcModal", {
    attrs: {
      size: "large",
      name: _vm.t("photos", "Add photos to {albumName}", {
        albumName: _vm.albumOriginalName
      })
    },
    on: {
      close: function ($event) {
        _vm.showAddPhotosModal = false;
      }
    }
  }, [_vm.album !== undefined ? _c("FilesPicker", {
    attrs: {
      destination: _vm.album.basename,
      "blacklist-ids": _vm.albumFileIds,
      loading: _vm.loadingAddFilesToAlbum
    },
    on: {
      "files-picked": _vm.handleFilesPicked
    }
  }) : _vm._e()], 1) : _vm._e()], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/SharedAlbumContent.vue?vue&type=style&index=0&id=259e376e&lang=scss&scoped=true&":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/SharedAlbumContent.vue?vue&type=style&index=0&id=259e376e&lang=scss&scoped=true& ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, ".album[data-v-259e376e] {\n  display: flex;\n  flex-direction: column;\n}\n.album__title[data-v-259e376e] {\n  width: 100%;\n}\n.album__name[data-v-259e376e] {\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}\n.album__location[data-v-259e376e] {\n  margin-left: -4px;\n  display: flex;\n  color: var(--color-text-lighter);\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/SharedAlbumContent.vue?vue&type=style&index=0&id=259e376e&lang=scss&scoped=true&":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/SharedAlbumContent.vue?vue&type=style&index=0&id=259e376e&lang=scss&scoped=true& ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SharedAlbumContent_vue_vue_type_style_index_0_id_259e376e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./SharedAlbumContent.vue?vue&type=style&index=0&id=259e376e&lang=scss&scoped=true& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/SharedAlbumContent.vue?vue&type=style&index=0&id=259e376e&lang=scss&scoped=true&");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SharedAlbumContent_vue_vue_type_style_index_0_id_259e376e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SharedAlbumContent_vue_vue_type_style_index_0_id_259e376e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SharedAlbumContent_vue_vue_type_style_index_0_id_259e376e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SharedAlbumContent_vue_vue_type_style_index_0_id_259e376e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/vue-material-design-icons/Close.vue":
/*!**********************************************************!*\
  !*** ./node_modules/vue-material-design-icons/Close.vue ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Close_vue_vue_type_template_id_3cc2737c___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Close.vue?vue&type=template&id=3cc2737c& */ "./node_modules/vue-material-design-icons/Close.vue?vue&type=template&id=3cc2737c&");
/* harmony import */ var _Close_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Close.vue?vue&type=script&lang=js& */ "./node_modules/vue-material-design-icons/Close.vue?vue&type=script&lang=js&");
/* harmony import */ var _vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _Close_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _Close_vue_vue_type_template_id_3cc2737c___WEBPACK_IMPORTED_MODULE_0__.render,
  _Close_vue_vue_type_template_id_3cc2737c___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "node_modules/vue-material-design-icons/Close.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/vue-material-design-icons/Close.vue?vue&type=script&lang=js&":
/*!**********************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/vue-material-design-icons/Close.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "CloseIcon",
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

/***/ "./node_modules/vue-material-design-icons/MapMarker.vue":
/*!**************************************************************!*\
  !*** ./node_modules/vue-material-design-icons/MapMarker.vue ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _MapMarker_vue_vue_type_template_id_c80f3d8c___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MapMarker.vue?vue&type=template&id=c80f3d8c& */ "./node_modules/vue-material-design-icons/MapMarker.vue?vue&type=template&id=c80f3d8c&");
/* harmony import */ var _MapMarker_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./MapMarker.vue?vue&type=script&lang=js& */ "./node_modules/vue-material-design-icons/MapMarker.vue?vue&type=script&lang=js&");
/* harmony import */ var _vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _MapMarker_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _MapMarker_vue_vue_type_template_id_c80f3d8c___WEBPACK_IMPORTED_MODULE_0__.render,
  _MapMarker_vue_vue_type_template_id_c80f3d8c___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "node_modules/vue-material-design-icons/MapMarker.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/vue-material-design-icons/MapMarker.vue?vue&type=script&lang=js&":
/*!**************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/vue-material-design-icons/MapMarker.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "MapMarkerIcon",
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

/***/ "./node_modules/vue-material-design-icons/Plus.vue":
/*!*********************************************************!*\
  !*** ./node_modules/vue-material-design-icons/Plus.vue ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Plus_vue_vue_type_template_id_18bbb6c6___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Plus.vue?vue&type=template&id=18bbb6c6& */ "./node_modules/vue-material-design-icons/Plus.vue?vue&type=template&id=18bbb6c6&");
/* harmony import */ var _Plus_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Plus.vue?vue&type=script&lang=js& */ "./node_modules/vue-material-design-icons/Plus.vue?vue&type=script&lang=js&");
/* harmony import */ var _vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _Plus_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _Plus_vue_vue_type_template_id_18bbb6c6___WEBPACK_IMPORTED_MODULE_0__.render,
  _Plus_vue_vue_type_template_id_18bbb6c6___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "node_modules/vue-material-design-icons/Plus.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/vue-material-design-icons/Plus.vue?vue&type=script&lang=js&":
/*!*********************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/vue-material-design-icons/Plus.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "PlusIcon",
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

/***/ "./src/views/SharedAlbumContent.vue":
/*!******************************************!*\
  !*** ./src/views/SharedAlbumContent.vue ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _SharedAlbumContent_vue_vue_type_template_id_259e376e_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SharedAlbumContent.vue?vue&type=template&id=259e376e&scoped=true& */ "./src/views/SharedAlbumContent.vue?vue&type=template&id=259e376e&scoped=true&");
/* harmony import */ var _SharedAlbumContent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SharedAlbumContent.vue?vue&type=script&lang=js& */ "./src/views/SharedAlbumContent.vue?vue&type=script&lang=js&");
/* harmony import */ var _SharedAlbumContent_vue_vue_type_style_index_0_id_259e376e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SharedAlbumContent.vue?vue&type=style&index=0&id=259e376e&lang=scss&scoped=true& */ "./src/views/SharedAlbumContent.vue?vue&type=style&index=0&id=259e376e&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _SharedAlbumContent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _SharedAlbumContent_vue_vue_type_template_id_259e376e_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render,
  _SharedAlbumContent_vue_vue_type_template_id_259e376e_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "259e376e",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/views/SharedAlbumContent.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/views/SharedAlbumContent.vue?vue&type=script&lang=js&":
/*!*******************************************************************!*\
  !*** ./src/views/SharedAlbumContent.vue?vue&type=script&lang=js& ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_SharedAlbumContent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./SharedAlbumContent.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/SharedAlbumContent.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_SharedAlbumContent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/views/SharedAlbumContent.vue?vue&type=template&id=259e376e&scoped=true&":
/*!*************************************************************************************!*\
  !*** ./src/views/SharedAlbumContent.vue?vue&type=template&id=259e376e&scoped=true& ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SharedAlbumContent_vue_vue_type_template_id_259e376e_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SharedAlbumContent_vue_vue_type_template_id_259e376e_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SharedAlbumContent_vue_vue_type_template_id_259e376e_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./SharedAlbumContent.vue?vue&type=template&id=259e376e&scoped=true& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/SharedAlbumContent.vue?vue&type=template&id=259e376e&scoped=true&");


/***/ }),

/***/ "./src/views/SharedAlbumContent.vue?vue&type=style&index=0&id=259e376e&lang=scss&scoped=true&":
/*!****************************************************************************************************!*\
  !*** ./src/views/SharedAlbumContent.vue?vue&type=style&index=0&id=259e376e&lang=scss&scoped=true& ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SharedAlbumContent_vue_vue_type_style_index_0_id_259e376e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/style-loader/dist/cjs.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./SharedAlbumContent.vue?vue&type=style&index=0&id=259e376e&lang=scss&scoped=true& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/SharedAlbumContent.vue?vue&type=style&index=0&id=259e376e&lang=scss&scoped=true&");


/***/ }),

/***/ "./node_modules/vue-material-design-icons/Close.vue?vue&type=script&lang=js&":
/*!***********************************************************************************!*\
  !*** ./node_modules/vue-material-design-icons/Close.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _vue_loader_lib_index_js_vue_loader_options_Close_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../vue-loader/lib/index.js??vue-loader-options!./Close.vue?vue&type=script&lang=js& */ "./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/vue-material-design-icons/Close.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_vue_loader_lib_index_js_vue_loader_options_Close_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./node_modules/vue-material-design-icons/MapMarker.vue?vue&type=script&lang=js&":
/*!***************************************************************************************!*\
  !*** ./node_modules/vue-material-design-icons/MapMarker.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _vue_loader_lib_index_js_vue_loader_options_MapMarker_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../vue-loader/lib/index.js??vue-loader-options!./MapMarker.vue?vue&type=script&lang=js& */ "./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/vue-material-design-icons/MapMarker.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_vue_loader_lib_index_js_vue_loader_options_MapMarker_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./node_modules/vue-material-design-icons/Plus.vue?vue&type=script&lang=js&":
/*!**********************************************************************************!*\
  !*** ./node_modules/vue-material-design-icons/Plus.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _vue_loader_lib_index_js_vue_loader_options_Plus_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../vue-loader/lib/index.js??vue-loader-options!./Plus.vue?vue&type=script&lang=js& */ "./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/vue-material-design-icons/Plus.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_vue_loader_lib_index_js_vue_loader_options_Plus_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./node_modules/vue-material-design-icons/Close.vue?vue&type=template&id=3cc2737c&":
/*!*****************************************************************************************!*\
  !*** ./node_modules/vue-material-design-icons/Close.vue?vue&type=template&id=3cc2737c& ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_vue_loader_lib_index_js_vue_loader_options_Close_vue_vue_type_template_id_3cc2737c___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_vue_loader_lib_index_js_vue_loader_options_Close_vue_vue_type_template_id_3cc2737c___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_vue_loader_lib_index_js_vue_loader_options_Close_vue_vue_type_template_id_3cc2737c___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!../vue-loader/lib/index.js??vue-loader-options!./Close.vue?vue&type=template&id=3cc2737c& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/vue-material-design-icons/Close.vue?vue&type=template&id=3cc2737c&");


/***/ }),

/***/ "./node_modules/vue-material-design-icons/MapMarker.vue?vue&type=template&id=c80f3d8c&":
/*!*********************************************************************************************!*\
  !*** ./node_modules/vue-material-design-icons/MapMarker.vue?vue&type=template&id=c80f3d8c& ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_vue_loader_lib_index_js_vue_loader_options_MapMarker_vue_vue_type_template_id_c80f3d8c___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_vue_loader_lib_index_js_vue_loader_options_MapMarker_vue_vue_type_template_id_c80f3d8c___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_vue_loader_lib_index_js_vue_loader_options_MapMarker_vue_vue_type_template_id_c80f3d8c___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!../vue-loader/lib/index.js??vue-loader-options!./MapMarker.vue?vue&type=template&id=c80f3d8c& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/vue-material-design-icons/MapMarker.vue?vue&type=template&id=c80f3d8c&");


/***/ }),

/***/ "./node_modules/vue-material-design-icons/Plus.vue?vue&type=template&id=18bbb6c6&":
/*!****************************************************************************************!*\
  !*** ./node_modules/vue-material-design-icons/Plus.vue?vue&type=template&id=18bbb6c6& ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_vue_loader_lib_index_js_vue_loader_options_Plus_vue_vue_type_template_id_18bbb6c6___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_vue_loader_lib_index_js_vue_loader_options_Plus_vue_vue_type_template_id_18bbb6c6___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_vue_loader_lib_index_js_vue_loader_options_Plus_vue_vue_type_template_id_18bbb6c6___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!../vue-loader/lib/index.js??vue-loader-options!./Plus.vue?vue&type=template&id=18bbb6c6& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/vue-material-design-icons/Plus.vue?vue&type=template&id=18bbb6c6&");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/vue-material-design-icons/Close.vue?vue&type=template&id=3cc2737c&":
/*!*********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/vue-material-design-icons/Close.vue?vue&type=template&id=3cc2737c& ***!
  \*********************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c
  return _c(
    "span",
    _vm._b(
      {
        staticClass: "material-design-icon close-icon",
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
                d: "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",
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

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/vue-material-design-icons/MapMarker.vue?vue&type=template&id=c80f3d8c&":
/*!*************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/vue-material-design-icons/MapMarker.vue?vue&type=template&id=c80f3d8c& ***!
  \*************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c
  return _c(
    "span",
    _vm._b(
      {
        staticClass: "material-design-icon map-marker-icon",
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
                d: "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z",
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

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/vue-material-design-icons/Plus.vue?vue&type=template&id=18bbb6c6&":
/*!********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/vue-material-design-icons/Plus.vue?vue&type=template&id=18bbb6c6& ***!
  \********************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c
  return _c(
    "span",
    _vm._b(
      {
        staticClass: "material-design-icon plus-icon",
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
            { attrs: { d: "M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" } },
            [_vm.title ? _c("title", [_vm._v(_vm._s(_vm.title))]) : _vm._e()]
          ),
        ]
      ),
    ]
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ })

}]);
//# sourceMappingURL=photos-src_views_SharedAlbumContent_vue.js.map?v=4a2596ba2ca55ffc9c14