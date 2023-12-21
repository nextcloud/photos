"use strict";
(self["webpackChunkphotos"] = self["webpackChunkphotos"] || []).push([["src_views_PublicAlbumContent_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Collection/CollectionContent.vue?vue&type=script&lang=js&":
/*!**************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Collection/CollectionContent.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vue_material_design_icons_AlertCircle_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue-material-design-icons/AlertCircle.vue */ "./node_modules/vue-material-design-icons/AlertCircle.vue");
/* harmony import */ var vue_material_design_icons_FolderMultipleImage_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-material-design-icons/FolderMultipleImage.vue */ "./node_modules/vue-material-design-icons/FolderMultipleImage.vue");
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @nextcloud/vue */ "./node_modules/@nextcloud/vue/dist/index.mjs");
/* harmony import */ var _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @nextcloud/l10n */ "./node_modules/@nextcloud/l10n/dist/index.mjs");
/* harmony import */ var _mixins_FilesSelectionMixin_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../mixins/FilesSelectionMixin.js */ "./src/mixins/FilesSelectionMixin.js");
/* harmony import */ var _FilesListViewer_vue__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! .././FilesListViewer.vue */ "./src/components/FilesListViewer.vue");
/* harmony import */ var _File_vue__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! .././File.vue */ "./src/components/File.vue");







/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'CollectionContent',
  components: {
    AlertCircle: vue_material_design_icons_AlertCircle_vue__WEBPACK_IMPORTED_MODULE_0__["default"],
    FolderMultipleImage: vue_material_design_icons_FolderMultipleImage_vue__WEBPACK_IMPORTED_MODULE_1__["default"],
    NcEmptyContent: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_2__.NcEmptyContent,
    FilesListViewer: _FilesListViewer_vue__WEBPACK_IMPORTED_MODULE_5__["default"],
    File: _File_vue__WEBPACK_IMPORTED_MODULE_6__["default"]
  },
  mixins: [_mixins_FilesSelectionMixin_js__WEBPACK_IMPORTED_MODULE_4__["default"], _nextcloud_vue__WEBPACK_IMPORTED_MODULE_2__.isMobile],
  props: {
    /** @type {import('vue').PropType<import('../../services/collectionFetcher').Collection>} */
    collection: {
      type: Object,
      default: () => undefined
    },
    /** @type {import('vue').PropType<string[]>} */
    collectionFileIds: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    allowSelection: {
      type: Boolean,
      default: true
    },
    error: {
      type: [Error, Number],
      default: null
    }
  },
  data() {
    return {
      appContent: document.getElementById('app-content-vue')
    };
  },
  computed: {
    /** @return {import('../../services/collectionFetcher').IndexedCollectionFiles} */
    files() {
      return this.$store.getters.files;
    }
  },
  methods: {
    openViewer(fileId) {
      const file = this.files[fileId];
      OCA.Viewer.open({
        fileInfo: file,
        list: this.collectionFileIds.map(fileId => this.files[fileId]).filter(file => !file.sectionHeader),
        loadMore: file.loadMore ? async () => await file.loadMore(true) : () => [],
        canLoop: file.canLoop
      });
    },
    t: _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_3__.translate
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/PublicAlbumContent.vue?vue&type=script&lang=js&":
/*!***********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/PublicAlbumContent.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var webdav__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! webdav */ "./node_modules/webdav/dist/node/index.js");
/* harmony import */ var webdav__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(webdav__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var vue_material_design_icons_MapMarker_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-material-design-icons/MapMarker.vue */ "./node_modules/vue-material-design-icons/MapMarker.vue");
/* harmony import */ var vue_material_design_icons_ImageOff_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vue-material-design-icons/ImageOff.vue */ "./node_modules/vue-material-design-icons/ImageOff.vue");
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @nextcloud/vue */ "./node_modules/@nextcloud/vue/dist/index.mjs");
/* harmony import */ var _nextcloud_axios__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @nextcloud/axios */ "./node_modules/@nextcloud/axios/dist/index.esm.js");
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @nextcloud/router */ "./node_modules/@nextcloud/router/dist/index.js");
/* harmony import */ var _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @nextcloud/l10n */ "./node_modules/@nextcloud/l10n/dist/index.mjs");
/* harmony import */ var _components_Collection_CollectionContent_vue__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../components/Collection/CollectionContent.vue */ "./src/components/Collection/CollectionContent.vue");
/* harmony import */ var _components_HeaderNavigation_vue__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../components/HeaderNavigation.vue */ "./src/components/HeaderNavigation.vue");
/* harmony import */ var _mixins_FetchCollectionContentMixin_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../mixins/FetchCollectionContentMixin.js */ "./src/mixins/FetchCollectionContentMixin.js");



// import Plus from 'vue-material-design-icons/Plus.vue'
// import ImagePlus from 'vue-material-design-icons/ImagePlus.vue'

// import Download from 'vue-material-design-icons/Download.vue'
// import DownloadMultiple from 'vue-material-design-icons/DownloadMultiple.vue'







// import ActionDownload from '../components/Actions/ActionDownload.vue'

const publicRootPath = 'dav';

// force our axios
const patcher = (0,webdav__WEBPACK_IMPORTED_MODULE_0__.getPatcher)();
patcher.patch('request', _nextcloud_axios__WEBPACK_IMPORTED_MODULE_4__["default"]);

// init webdav client on default dav endpoint
const remote = (0,_nextcloud_router__WEBPACK_IMPORTED_MODULE_5__.generateRemoteUrl)(publicRootPath);
const publicRemote = remote;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'PublicAlbumContent',
  components: {
    MapMarker: vue_material_design_icons_MapMarker_vue__WEBPACK_IMPORTED_MODULE_1__["default"],
    // Plus,
    // Download,
    // DownloadMultiple,
    // ImagePlus,
    ImageOff: vue_material_design_icons_ImageOff_vue__WEBPACK_IMPORTED_MODULE_2__["default"],
    NcEmptyContent: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_3__.NcEmptyContent,
    NcActions: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_3__.NcActions,
    // NcActionSeparator,
    // NcButton,
    CollectionContent: _components_Collection_CollectionContent_vue__WEBPACK_IMPORTED_MODULE_7__["default"],
    // ActionDownload,
    HeaderNavigation: _components_HeaderNavigation_vue__WEBPACK_IMPORTED_MODULE_8__["default"]
  },
  mixins: [_mixins_FetchCollectionContentMixin_js__WEBPACK_IMPORTED_MODULE_9__["default"], _nextcloud_vue__WEBPACK_IMPORTED_MODULE_3__.isMobile],
  props: {
    token: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      showAddPhotosModal: false,
      loadingCount: 0,
      loadingAddFilesToAlbum: false,
      albumOriginalName: '',
      publicClient: (0,webdav__WEBPACK_IMPORTED_MODULE_0__.createClient)(publicRemote, {
        username: this.token,
        password: null
      })
    };
  },
  computed: {
    /**
     * @return {import('../store/publicAlbums.js').PublicAlbum} The album information for the current albumName.
     */
    album() {
      return this.$store.getters.getPublicAlbum(this.albumName);
    },
    /**
     * @return {string} The album's name is the token.
     */
    albumName() {
      return this.token;
    },
    /**
     * @return {string[]} The list of files for the current albumName.
     */
    albumFileIds() {
      return this.$store.getters.getPublicAlbumFiles(this.albumName);
    },
    /**
     * @return {string} The album's filename based on its name. Useful to fetch the location information and content.
     */
    publicAlbumFileName() {
      return this.$store.getters.getPublicAlbumName(this.albumName);
    }
  },
  async beforeMount() {
    await this.fetchAlbumInfo();
    await this.fetchAlbumContent();
  },
  methods: {
    ...(0,vuex__WEBPACK_IMPORTED_MODULE_10__.mapActions)(['appendFiles', 'addCollection', 'addFilesToCollection', 'removeFilesFromCollection']),
    async fetchAlbumInfo() {
      const album = await this.fetchCollection(`/photospublic/${this.token}`, ['<nc:location />', '<nc:dateRange />', '<nc:collaborators />', '<nc:original-name />'], this.publicClient);
      this.albumOriginalName = album.originalName;
    },
    async fetchAlbumContent() {
      await this.fetchCollectionFiles(`/photospublic/${this.token}`, ['<nc:location />', '<nc:dateRange />', '<nc:collaborators />', '<nc:original-name />'], this.publicClient, [file => ({
        ...file,
        // Use custom preview URL to avoid authentication prompt
        previewUrl: (0,_nextcloud_router__WEBPACK_IMPORTED_MODULE_5__.generateUrl)(`/apps/photos/api/v1/publicPreview/${file.fileid}?x=2048&y=2048&token=${this.token}`),
        // Disable use of generic file previews for public albums - for older versions of the Viewer app
        hasPreview: false
      })]);
    },
    async handleFilesPicked(fileIds) {
      this.showAddPhotosModal = false;
      await this.addFilesToCollection({
        collectionFileName: this.albumName,
        fileIdsToAdd: fileIds
      });
      // Re-fetch album content to have the proper filenames.
      await this.fetchAlbumContent();
    },
    async handleRemoveFilesFromAlbum(fileIds) {
      this.$refs.collectionContent.onUncheckFiles(fileIds);
      await this.removeFilesFromCollection({
        collectionFileName: this.albumName,
        fileIdsToRemove: fileIds
      });
    },
    t: _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_6__.translate
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Collection/CollectionContent.vue?vue&type=template&id=6a4155da&scoped=true&":
/*!*************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Collection/CollectionContent.vue?vue&type=template&id=6a4155da&scoped=true& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _vm.collection === undefined && !_vm.loading || _vm.error === 404 ? _c("NcEmptyContent", {
    staticClass: "empty-content-with-illustration",
    attrs: {
      name: _vm.t("photos", "This collection does not exist")
    }
  }, [_c("FolderMultipleImage", {
    attrs: {
      slot: "icon"
    },
    slot: "icon"
  })], 1) : _vm.error ? _c("NcEmptyContent", {
    attrs: {
      name: _vm.t("photos", "An error occurred")
    }
  }, [_c("AlertCircle", {
    attrs: {
      slot: "icon"
    },
    slot: "icon"
  })], 1) : _c("div", {
    staticClass: "collection"
  }, [_vm._t("header", null, {
    selectedFileIds: _vm.selectedFileIds,
    resetSelection: _vm.resetSelection
  }), _vm._v(" "), _vm.collectionFileIds.length === 0 && !_vm.loading ? _vm._t("empty-content") : _vm._e(), _vm._v(" "), _vm.collection !== undefined ? _c("FilesListViewer", {
    staticClass: "collection__media",
    attrs: {
      "container-element": _vm.appContent,
      "file-ids": _vm.collectionFileIds,
      "base-height": _vm.isMobile ? 120 : 200,
      loading: _vm.loading
    },
    scopedSlots: _vm._u([{
      key: "default",
      fn: function (_ref) {
        let {
          file,
          distance
        } = _ref;
        return _c("File", {
          attrs: {
            file: _vm.files[file.id],
            "allow-selection": _vm.allowSelection,
            selected: _vm.selection[file.id] === true,
            distance: distance
          },
          on: {
            click: _vm.openViewer,
            "select-toggled": _vm.onFileSelectToggle
          }
        });
      }
    }], null, false, 3813029717)
  }) : _vm._e()], 2);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/PublicAlbumContent.vue?vue&type=template&id=56b53b66&scoped=true&":
/*!**********************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/PublicAlbumContent.vue?vue&type=template&id=56b53b66&scoped=true& ***!
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
  return _c("div", [_c("CollectionContent", {
    ref: "collectionContent",
    attrs: {
      collection: _vm.album,
      "collection-file-ids": _vm.albumFileIds,
      "allow-selection": false,
      loading: _vm.loadingCollection || _vm.loadingCollectionFiles,
      error: _vm.errorFetchingCollection || _vm.errorFetchingCollectionFiles
    },
    scopedSlots: _vm._u([{
      key: "header",
      fn: function (_ref) {
        let {
          selectedFileIds
        } = _ref;
        return _vm.albumOriginalName !== "" ? _c("HeaderNavigation", {
          key: "navigation",
          attrs: {
            loading: _vm.loadingCollection || _vm.loadingCollectionFiles,
            params: {
              token: _vm.token
            },
            path: "/",
            "root-title": _vm.albumOriginalName,
            title: _vm.albumOriginalName
          },
          on: {
            refresh: _vm.fetchAlbumContent
          }
        }, [_vm.album.location !== "" ? _c("div", {
          staticClass: "album__location",
          attrs: {
            slot: "subtitle"
          },
          slot: "subtitle"
        }, [_c("MapMarker"), _vm._v(_vm._s(_vm.album.location) + "\n\t\t\t")], 1) : _vm._e(), _vm._v(" "), _vm.album !== undefined ? _c("template", {
          slot: "right"
        }, [_c("NcActions", {
          attrs: {
            "force-menu": true,
            "aria-label": _vm.t("photos", "Open actions menu")
          }
        }, [selectedFileIds.length > 0 ? void 0 : _vm._e()], 2)], 1) : _vm._e()], 2) : _vm._e();
      }
    }], null, true)
  }, [_vm._v(" "), _c("NcEmptyContent", {
    staticClass: "album__empty",
    attrs: {
      slot: "empty-content",
      name: _vm.t("photos", "This album does not have any photos or videos yet!")
    },
    slot: "empty-content"
  }, [_c("ImageOff", {
    attrs: {
      slot: "icon"
    },
    slot: "icon"
  })], 1)], 1)], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Collection/CollectionContent.vue?vue&type=style&index=0&id=6a4155da&lang=scss&scoped=true&":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Collection/CollectionContent.vue?vue&type=style&index=0&id=6a4155da&lang=scss&scoped=true& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

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
___CSS_LOADER_EXPORT___.push([module.id, ".collection[data-v-6a4155da] {\n  display: flex;\n  flex-direction: column;\n}\n.collection__media[data-v-6a4155da] {\n  padding: 0 64px;\n}\n@media only screen and (max-width: 1200px) {\n.collection__media[data-v-6a4155da] {\n    padding: 0 4px;\n}\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/PublicAlbumContent.vue?vue&type=style&index=0&id=56b53b66&lang=scss&scoped=true&":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/PublicAlbumContent.vue?vue&type=style&index=0&id=56b53b66&lang=scss&scoped=true& ***!
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
___CSS_LOADER_EXPORT___.push([module.id, ".album[data-v-56b53b66] {\n  display: flex;\n  flex-direction: column;\n}\n.album__title[data-v-56b53b66] {\n  width: 100%;\n}\n.album__name[data-v-56b53b66] {\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}\n.album__location[data-v-56b53b66] {\n  margin-left: -4px;\n  display: flex;\n  color: var(--color-text-lighter);\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Collection/CollectionContent.vue?vue&type=style&index=0&id=6a4155da&lang=scss&scoped=true&":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Collection/CollectionContent.vue?vue&type=style&index=0&id=6a4155da&lang=scss&scoped=true& ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_CollectionContent_vue_vue_type_style_index_0_id_6a4155da_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../node_modules/css-loader/dist/cjs.js!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/dist/cjs.js!../../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CollectionContent.vue?vue&type=style&index=0&id=6a4155da&lang=scss&scoped=true& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Collection/CollectionContent.vue?vue&type=style&index=0&id=6a4155da&lang=scss&scoped=true&");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_CollectionContent_vue_vue_type_style_index_0_id_6a4155da_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_CollectionContent_vue_vue_type_style_index_0_id_6a4155da_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_CollectionContent_vue_vue_type_style_index_0_id_6a4155da_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_CollectionContent_vue_vue_type_style_index_0_id_6a4155da_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/PublicAlbumContent.vue?vue&type=style&index=0&id=56b53b66&lang=scss&scoped=true&":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/PublicAlbumContent.vue?vue&type=style&index=0&id=56b53b66&lang=scss&scoped=true& ***!
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_PublicAlbumContent_vue_vue_type_style_index_0_id_56b53b66_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./PublicAlbumContent.vue?vue&type=style&index=0&id=56b53b66&lang=scss&scoped=true& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/PublicAlbumContent.vue?vue&type=style&index=0&id=56b53b66&lang=scss&scoped=true&");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_PublicAlbumContent_vue_vue_type_style_index_0_id_56b53b66_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_PublicAlbumContent_vue_vue_type_style_index_0_id_56b53b66_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_PublicAlbumContent_vue_vue_type_style_index_0_id_56b53b66_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_PublicAlbumContent_vue_vue_type_style_index_0_id_56b53b66_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/components/Collection/CollectionContent.vue":
/*!*********************************************************!*\
  !*** ./src/components/Collection/CollectionContent.vue ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _CollectionContent_vue_vue_type_template_id_6a4155da_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CollectionContent.vue?vue&type=template&id=6a4155da&scoped=true& */ "./src/components/Collection/CollectionContent.vue?vue&type=template&id=6a4155da&scoped=true&");
/* harmony import */ var _CollectionContent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CollectionContent.vue?vue&type=script&lang=js& */ "./src/components/Collection/CollectionContent.vue?vue&type=script&lang=js&");
/* harmony import */ var _CollectionContent_vue_vue_type_style_index_0_id_6a4155da_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CollectionContent.vue?vue&type=style&index=0&id=6a4155da&lang=scss&scoped=true& */ "./src/components/Collection/CollectionContent.vue?vue&type=style&index=0&id=6a4155da&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _CollectionContent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _CollectionContent_vue_vue_type_template_id_6a4155da_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render,
  _CollectionContent_vue_vue_type_template_id_6a4155da_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "6a4155da",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/components/Collection/CollectionContent.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/views/PublicAlbumContent.vue":
/*!******************************************!*\
  !*** ./src/views/PublicAlbumContent.vue ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _PublicAlbumContent_vue_vue_type_template_id_56b53b66_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PublicAlbumContent.vue?vue&type=template&id=56b53b66&scoped=true& */ "./src/views/PublicAlbumContent.vue?vue&type=template&id=56b53b66&scoped=true&");
/* harmony import */ var _PublicAlbumContent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PublicAlbumContent.vue?vue&type=script&lang=js& */ "./src/views/PublicAlbumContent.vue?vue&type=script&lang=js&");
/* harmony import */ var _PublicAlbumContent_vue_vue_type_style_index_0_id_56b53b66_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./PublicAlbumContent.vue?vue&type=style&index=0&id=56b53b66&lang=scss&scoped=true& */ "./src/views/PublicAlbumContent.vue?vue&type=style&index=0&id=56b53b66&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _PublicAlbumContent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _PublicAlbumContent_vue_vue_type_template_id_56b53b66_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render,
  _PublicAlbumContent_vue_vue_type_template_id_56b53b66_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "56b53b66",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/views/PublicAlbumContent.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/components/Collection/CollectionContent.vue?vue&type=script&lang=js&":
/*!**********************************************************************************!*\
  !*** ./src/components/Collection/CollectionContent.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CollectionContent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CollectionContent.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Collection/CollectionContent.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CollectionContent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/views/PublicAlbumContent.vue?vue&type=script&lang=js&":
/*!*******************************************************************!*\
  !*** ./src/views/PublicAlbumContent.vue?vue&type=script&lang=js& ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_PublicAlbumContent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./PublicAlbumContent.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/PublicAlbumContent.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_PublicAlbumContent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/components/Collection/CollectionContent.vue?vue&type=template&id=6a4155da&scoped=true&":
/*!****************************************************************************************************!*\
  !*** ./src/components/Collection/CollectionContent.vue?vue&type=template&id=6a4155da&scoped=true& ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_CollectionContent_vue_vue_type_template_id_6a4155da_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_CollectionContent_vue_vue_type_template_id_6a4155da_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_CollectionContent_vue_vue_type_template_id_6a4155da_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CollectionContent.vue?vue&type=template&id=6a4155da&scoped=true& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Collection/CollectionContent.vue?vue&type=template&id=6a4155da&scoped=true&");


/***/ }),

/***/ "./src/views/PublicAlbumContent.vue?vue&type=template&id=56b53b66&scoped=true&":
/*!*************************************************************************************!*\
  !*** ./src/views/PublicAlbumContent.vue?vue&type=template&id=56b53b66&scoped=true& ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_PublicAlbumContent_vue_vue_type_template_id_56b53b66_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_PublicAlbumContent_vue_vue_type_template_id_56b53b66_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_PublicAlbumContent_vue_vue_type_template_id_56b53b66_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./PublicAlbumContent.vue?vue&type=template&id=56b53b66&scoped=true& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/PublicAlbumContent.vue?vue&type=template&id=56b53b66&scoped=true&");


/***/ }),

/***/ "./src/components/Collection/CollectionContent.vue?vue&type=style&index=0&id=6a4155da&lang=scss&scoped=true&":
/*!*******************************************************************************************************************!*\
  !*** ./src/components/Collection/CollectionContent.vue?vue&type=style&index=0&id=6a4155da&lang=scss&scoped=true& ***!
  \*******************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_CollectionContent_vue_vue_type_style_index_0_id_6a4155da_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/style-loader/dist/cjs.js!../../../node_modules/css-loader/dist/cjs.js!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/dist/cjs.js!../../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CollectionContent.vue?vue&type=style&index=0&id=6a4155da&lang=scss&scoped=true& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Collection/CollectionContent.vue?vue&type=style&index=0&id=6a4155da&lang=scss&scoped=true&");


/***/ }),

/***/ "./src/views/PublicAlbumContent.vue?vue&type=style&index=0&id=56b53b66&lang=scss&scoped=true&":
/*!****************************************************************************************************!*\
  !*** ./src/views/PublicAlbumContent.vue?vue&type=style&index=0&id=56b53b66&lang=scss&scoped=true& ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_PublicAlbumContent_vue_vue_type_style_index_0_id_56b53b66_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/style-loader/dist/cjs.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./PublicAlbumContent.vue?vue&type=style&index=0&id=56b53b66&lang=scss&scoped=true& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/PublicAlbumContent.vue?vue&type=style&index=0&id=56b53b66&lang=scss&scoped=true&");


/***/ })

}]);
//# sourceMappingURL=photos-src_views_PublicAlbumContent_vue.js.map?v=aee5c91d3717b4c69ad9