"use strict";
(self["webpackChunkphotos"] = self["webpackChunkphotos"] || []).push([["src_views_AlbumContent_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FilesPicker.vue?vue&type=script&lang=js&":
/*!*********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FilesPicker.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vue_material_design_icons_ImagePlus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue-material-design-icons/ImagePlus */ "./node_modules/vue-material-design-icons/ImagePlus.vue");
/* harmony import */ var vue_material_design_icons_Upload__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-material-design-icons/Upload */ "./node_modules/vue-material-design-icons/Upload.vue");
/* harmony import */ var _nextcloud_moment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @nextcloud/moment */ "./node_modules/@nextcloud/moment/dist/index.js");
/* harmony import */ var _nextcloud_moment__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_moment__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @nextcloud/vue */ "./node_modules/@nextcloud/vue/dist/ncvuecomponents.js");
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_vue__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _mixins_FetchFilesMixin_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../mixins/FetchFilesMixin.js */ "./src/mixins/FetchFilesMixin.js");
/* harmony import */ var _mixins_FilesSelectionMixin_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../mixins/FilesSelectionMixin.js */ "./src/mixins/FilesSelectionMixin.js");
/* harmony import */ var _FilesListViewer_vue__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./FilesListViewer.vue */ "./src/components/FilesListViewer.vue");
/* harmony import */ var _File_vue__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./File.vue */ "./src/components/File.vue");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
    ImagePlus: vue_material_design_icons_ImagePlus__WEBPACK_IMPORTED_MODULE_0__["default"],
    Upload: vue_material_design_icons_Upload__WEBPACK_IMPORTED_MODULE_1__["default"],
    Button: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_3__.Button,
    FilesListViewer: _FilesListViewer_vue__WEBPACK_IMPORTED_MODULE_6__["default"],
    File: _File_vue__WEBPACK_IMPORTED_MODULE_7__["default"]
  },
  filters: {
    /**
     * @param {string} date - In the following format: YYYYMM
     */
    dateMonthAndYear(date) {
      return _nextcloud_moment__WEBPACK_IMPORTED_MODULE_2___default()(date, 'YYYYMM').format('MMMM YYYY');
    }

  },
  mixins: [_mixins_FetchFilesMixin_js__WEBPACK_IMPORTED_MODULE_4__["default"], _mixins_FilesSelectionMixin_js__WEBPACK_IMPORTED_MODULE_5__["default"]],
  // TODO: add filter out ids
  props: {},

  data() {
    return {
      targetMonth: null
    };
  },

  computed: {
    /**
     * @return {string[]}
     */
    filesListByMonth() {
      const filesByMonth = {};

      for (const fileId of Object.keys(this.files)) {
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
      return Object.keys(this.filesListByMonth).sort((month1, month2) => month1 > month2 ? -1 : 1);
    }

  },
  watch: {
    monthsList(value) {
      if (this.targetMonth === null) {
        this.targetMonth = value[0];
      }
    }

  },
  methods: {
    /**
     * @param {string} fileId1 The first file ID
     * @param {string} fileId2 The second file ID
     * @return {-1 | 1}
     */
    sortFilesByTimestamp(fileId1, fileId2) {
      return this.files[fileId1].timestamp > this.files[fileId2].timestamp ? -1 : 1;
    },

    emitPickedEvent() {
      this.$emit('files-picked', this.selectedFileIds);
    }

  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/ShareAlbumForm.vue?vue&type=script&lang=js&":
/*!************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/ShareAlbumForm.vue?vue&type=script&lang=js& ***!
  \************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
//
//
//
//
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'ShareAlbumForm'
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/AlbumContent.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/AlbumContent.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var vue_material_design_icons_MapMarker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue-material-design-icons/MapMarker */ "./node_modules/vue-material-design-icons/MapMarker.vue");
/* harmony import */ var vue_material_design_icons_ShareVariant__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-material-design-icons/ShareVariant */ "./node_modules/vue-material-design-icons/ShareVariant.vue");
/* harmony import */ var vue_material_design_icons_Plus__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vue-material-design-icons/Plus */ "./node_modules/vue-material-design-icons/Plus.vue");
/* harmony import */ var vue_material_design_icons_TrashCan__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! vue-material-design-icons/TrashCan */ "./node_modules/vue-material-design-icons/TrashCan.vue");
/* harmony import */ var vue_material_design_icons_ImagePlus__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! vue-material-design-icons/ImagePlus */ "./node_modules/vue-material-design-icons/ImagePlus.vue");
/* harmony import */ var vue_material_design_icons_AlertCircle__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! vue-material-design-icons/AlertCircle */ "./node_modules/vue-material-design-icons/AlertCircle.vue");
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @nextcloud/vue */ "./node_modules/@nextcloud/vue/dist/ncvuecomponents.js");
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_vue__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _mixins_FetchAlbumsMixin_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../mixins/FetchAlbumsMixin.js */ "./src/mixins/FetchAlbumsMixin.js");
/* harmony import */ var _mixins_FetchFilesMixin_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../mixins/FetchFilesMixin.js */ "./src/mixins/FetchFilesMixin.js");
/* harmony import */ var _mixins_FilesSelectionMixin_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../mixins/FilesSelectionMixin.js */ "./src/mixins/FilesSelectionMixin.js");
/* harmony import */ var _components_FilesListViewer_vue__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../components/FilesListViewer.vue */ "./src/components/FilesListViewer.vue");
/* harmony import */ var _components_File_vue__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../components/File.vue */ "./src/components/File.vue");
/* harmony import */ var _components_Loader_vue__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../components/Loader.vue */ "./src/components/Loader.vue");
/* harmony import */ var _components_FilesPicker_vue__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../components/FilesPicker.vue */ "./src/components/FilesPicker.vue");
/* harmony import */ var _components_ShareAlbumForm_vue__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../components/ShareAlbumForm.vue */ "./src/components/ShareAlbumForm.vue");
/* harmony import */ var _assets_Illustrations_folder_svg__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../assets/Illustrations/folder.svg */ "./src/assets/Illustrations/folder.svg");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
  name: 'AlbumContent',
  components: {
    MapMarker: vue_material_design_icons_MapMarker__WEBPACK_IMPORTED_MODULE_0__["default"],
    ShareVariant: vue_material_design_icons_ShareVariant__WEBPACK_IMPORTED_MODULE_1__["default"],
    Plus: vue_material_design_icons_Plus__WEBPACK_IMPORTED_MODULE_2__["default"],
    TrashCan: vue_material_design_icons_TrashCan__WEBPACK_IMPORTED_MODULE_3__["default"],
    ImagePlus: vue_material_design_icons_ImagePlus__WEBPACK_IMPORTED_MODULE_4__["default"],
    AlertCircle: vue_material_design_icons_AlertCircle__WEBPACK_IMPORTED_MODULE_5__["default"],
    FilesListViewer: _components_FilesListViewer_vue__WEBPACK_IMPORTED_MODULE_10__["default"],
    File: _components_File_vue__WEBPACK_IMPORTED_MODULE_11__["default"],
    EmptyContent: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_6__.EmptyContent,
    Loader: _components_Loader_vue__WEBPACK_IMPORTED_MODULE_12__["default"],
    Actions: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_6__.Actions,
    ActionButton: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_6__.ActionButton,
    Button: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_6__.Button,
    Modal: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_6__.Modal,
    FilesPicker: _components_FilesPicker_vue__WEBPACK_IMPORTED_MODULE_13__["default"],
    ShareAlbumForm: _components_ShareAlbumForm_vue__WEBPACK_IMPORTED_MODULE_14__["default"]
  },
  mixins: [_mixins_FetchAlbumsMixin_js__WEBPACK_IMPORTED_MODULE_7__["default"], _mixins_FetchFilesMixin_js__WEBPACK_IMPORTED_MODULE_8__["default"], _mixins_FilesSelectionMixin_js__WEBPACK_IMPORTED_MODULE_9__["default"]],
  props: {
    albumId: {
      type: String,
      default: '/'
    }
  },

  data() {
    return {
      showAddPhotosModal: false,
      showShareModal: false,
      FolderIllustration: _assets_Illustrations_folder_svg__WEBPACK_IMPORTED_MODULE_15__
    };
  },

  computed: { ...(0,vuex__WEBPACK_IMPORTED_MODULE_16__.mapGetters)(['files', 'albumsFiles']),

    /**
     * @return {string[]} The album information for the current albumId.
     */
    album() {
      return this.albums[this.albumId];
    },

    /**
     * @return {string[]} The list of files for the current albumId.
     */
    albumFiles() {
      return this.albumsFiles[this.albumId] || [];
    }

  },
  watch: {
    album() {
      this.fetchAlbumContent();
    }

  },
  methods: {
    async fetchAlbumContent() {
      const files = await this.fetchFiles(this.album.name);

      if (files.length > 0) {
        this.$store.commit('addFilesToAlbum', {
          albumId: this.albumId,
          fileIdsToAdd: files.map(file => file.fileid)
        });
      }
    },

    openViewer(fileId) {
      const file = this.files[fileId];
      OCA.Viewer.open({
        path: file.filename,
        list: this.albumFiles.map(fileId => this.files[fileId]).filter(file => !file.sectionHeader),
        loadMore: file.loadMore ? async () => await file.loadMore(true) : () => [],
        canLoop: file.canLoop
      });
    },

    addFilesToAlbum(fileIds) {
      this.$store.dispatch('addFilesToAlbum', {
        albumId: this.albumId,
        fileIdsToAdd: fileIds
      });
      this.showAddPhotosModal = false;
    },

    removeFilesFromAlbum(fileIds) {
      this.$store.dispatch('removeFilesFromAlbum', {
        albumId: this.albumId,
        fileIdsToAdd: fileIds
      });
    },

    // TODO: Check delete album.
    deleteAlbum() {
      this.$store.dispatch('deleteAlbum', {
        albumId: this.albumId
      });
    }

  }
});

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FilesPicker.vue?vue&type=style&index=0&id=10d87d65&lang=scss&scoped=true&":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FilesPicker.vue?vue&type=style&index=0&id=10d87d65&lang=scss&scoped=true& ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, ".file-picker[data-v-10d87d65] {\n  display: flex;\n  flex-direction: column;\n  padding: 12px;\n}\n.file-picker__content[data-v-10d87d65] {\n  display: flex;\n  flex-grow: 1;\n  height: 500px;\n}\n.file-picker__navigation[data-v-10d87d65] {\n  flex-basis: 200px;\n  overflow: scroll;\n  margin-right: 8px;\n  padding-right: 8px;\n}\n.file-picker__navigation__month[data-v-10d87d65] {\n  font-weight: bold;\n  font-size: 16px;\n  border-radius: 48px;\n  padding: 8px 16px;\n  margin: 4px 0;\n  cursor: pointer;\n}\n.file-picker__navigation__month[data-v-10d87d65]:hover {\n  background: var(--color-background-dark);\n}\n.file-picker__navigation__month.selected[data-v-10d87d65] {\n  background: var(--color-primary-element-lighter);\n}\n.file-picker__file-list[data-v-10d87d65] {\n  flex-grow: 1;\n  min-width: 0;\n}\n.file-picker__file-list .section-header[data-v-10d87d65] {\n  font-weight: bold;\n  font-size: 20px;\n  padding: 8px 0 4px 0;\n}\n.file-picker__actions[data-v-10d87d65] {\n  display: flex;\n  justify-content: space-between;\n  justify-items: center;\n  padding-top: 16px;\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/AlbumContent.vue?vue&type=style&index=0&id=36505f44&lang=scss&scoped=true&":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/AlbumContent.vue?vue&type=style&index=0&id=36505f44&lang=scss&scoped=true& ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, ".album-container[data-v-36505f44] {\n  height: calc(100vh - var(--header-height));\n  display: flex;\n  flex-direction: column;\n  padding: 8px 64px;\n}\n.album-container .empty-album[data-v-36505f44] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n.album-container .empty-album__button[data-v-36505f44] {\n  margin-top: 32px;\n}\n.album-container .album-header[data-v-36505f44] {\n  display: flex;\n  min-height: 60px;\n  align-items: center;\n  justify-content: space-between;\n}\n.album-container .album-header .album-title[data-v-36505f44] {\n  min-width: 300px;\n}\n.album-container .album-header .album-title .album-location[data-v-36505f44] {\n  margin-left: -4px;\n  display: flex;\n  color: var(--color-text-lighter);\n}\n.album-container .album-header .album-actions[data-v-36505f44] {\n  display: flex;\n  align-items: baseline;\n}\n.album-container .album-header .album-actions button[data-v-36505f44] {\n  margin-left: 16px;\n}\n.album-container .album-photos[data-v-36505f44] {\n  margin-top: 16px;\n  height: 100%;\n  min-height: 0;\n}\n.empty-content-with-illustration[data-v-36505f44]  .empty-content__icon {\n  width: 200px;\n  height: 200px;\n}\n.empty-content-with-illustration[data-v-36505f44]  .empty-content__icon svg {\n  width: 200px;\n  height: 200px;\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FilesPicker.vue?vue&type=style&index=0&id=10d87d65&lang=scss&scoped=true&":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FilesPicker.vue?vue&type=style&index=0&id=10d87d65&lang=scss&scoped=true& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/AlbumContent.vue?vue&type=style&index=0&id=36505f44&lang=scss&scoped=true&":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/AlbumContent.vue?vue&type=style&index=0&id=36505f44&lang=scss&scoped=true& ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumContent_vue_vue_type_style_index_0_id_36505f44_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AlbumContent.vue?vue&type=style&index=0&id=36505f44&lang=scss&scoped=true& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/AlbumContent.vue?vue&type=style&index=0&id=36505f44&lang=scss&scoped=true&");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumContent_vue_vue_type_style_index_0_id_36505f44_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumContent_vue_vue_type_style_index_0_id_36505f44_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumContent_vue_vue_type_style_index_0_id_36505f44_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumContent_vue_vue_type_style_index_0_id_36505f44_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/components/FilesPicker.vue":
/*!****************************************!*\
  !*** ./src/components/FilesPicker.vue ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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

/***/ "./src/components/ShareAlbumForm.vue":
/*!*******************************************!*\
  !*** ./src/components/ShareAlbumForm.vue ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ShareAlbumForm_vue_vue_type_template_id_6adf0238___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ShareAlbumForm.vue?vue&type=template&id=6adf0238& */ "./src/components/ShareAlbumForm.vue?vue&type=template&id=6adf0238&");
/* harmony import */ var _ShareAlbumForm_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ShareAlbumForm.vue?vue&type=script&lang=js& */ "./src/components/ShareAlbumForm.vue?vue&type=script&lang=js&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _ShareAlbumForm_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _ShareAlbumForm_vue_vue_type_template_id_6adf0238___WEBPACK_IMPORTED_MODULE_0__.render,
  _ShareAlbumForm_vue_vue_type_template_id_6adf0238___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/components/ShareAlbumForm.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/views/AlbumContent.vue":
/*!************************************!*\
  !*** ./src/views/AlbumContent.vue ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _AlbumContent_vue_vue_type_template_id_36505f44_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AlbumContent.vue?vue&type=template&id=36505f44&scoped=true& */ "./src/views/AlbumContent.vue?vue&type=template&id=36505f44&scoped=true&");
/* harmony import */ var _AlbumContent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AlbumContent.vue?vue&type=script&lang=js& */ "./src/views/AlbumContent.vue?vue&type=script&lang=js&");
/* harmony import */ var _AlbumContent_vue_vue_type_style_index_0_id_36505f44_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AlbumContent.vue?vue&type=style&index=0&id=36505f44&lang=scss&scoped=true& */ "./src/views/AlbumContent.vue?vue&type=style&index=0&id=36505f44&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _AlbumContent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _AlbumContent_vue_vue_type_template_id_36505f44_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render,
  _AlbumContent_vue_vue_type_template_id_36505f44_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "36505f44",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/views/AlbumContent.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/components/FilesPicker.vue?vue&type=script&lang=js&":
/*!*****************************************************************!*\
  !*** ./src/components/FilesPicker.vue?vue&type=script&lang=js& ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_FilesPicker_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FilesPicker.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FilesPicker.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_FilesPicker_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/components/ShareAlbumForm.vue?vue&type=script&lang=js&":
/*!********************************************************************!*\
  !*** ./src/components/ShareAlbumForm.vue?vue&type=script&lang=js& ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ShareAlbumForm_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ShareAlbumForm.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/ShareAlbumForm.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ShareAlbumForm_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/views/AlbumContent.vue?vue&type=script&lang=js&":
/*!*************************************************************!*\
  !*** ./src/views/AlbumContent.vue?vue&type=script&lang=js& ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumContent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AlbumContent.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/AlbumContent.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumContent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/components/FilesPicker.vue?vue&type=style&index=0&id=10d87d65&lang=scss&scoped=true&":
/*!**************************************************************************************************!*\
  !*** ./src/components/FilesPicker.vue?vue&type=style&index=0&id=10d87d65&lang=scss&scoped=true& ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FilesPicker_vue_vue_type_style_index_0_id_10d87d65_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/style-loader/dist/cjs.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FilesPicker.vue?vue&type=style&index=0&id=10d87d65&lang=scss&scoped=true& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FilesPicker.vue?vue&type=style&index=0&id=10d87d65&lang=scss&scoped=true&");


/***/ }),

/***/ "./src/views/AlbumContent.vue?vue&type=style&index=0&id=36505f44&lang=scss&scoped=true&":
/*!**********************************************************************************************!*\
  !*** ./src/views/AlbumContent.vue?vue&type=style&index=0&id=36505f44&lang=scss&scoped=true& ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumContent_vue_vue_type_style_index_0_id_36505f44_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/style-loader/dist/cjs.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AlbumContent.vue?vue&type=style&index=0&id=36505f44&lang=scss&scoped=true& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/AlbumContent.vue?vue&type=style&index=0&id=36505f44&lang=scss&scoped=true&");


/***/ }),

/***/ "./src/components/FilesPicker.vue?vue&type=template&id=10d87d65&scoped=true&":
/*!***********************************************************************************!*\
  !*** ./src/components/FilesPicker.vue?vue&type=template&id=10d87d65&scoped=true& ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FilesPicker_vue_vue_type_template_id_10d87d65_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FilesPicker_vue_vue_type_template_id_10d87d65_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FilesPicker_vue_vue_type_template_id_10d87d65_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FilesPicker.vue?vue&type=template&id=10d87d65&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FilesPicker.vue?vue&type=template&id=10d87d65&scoped=true&");


/***/ }),

/***/ "./src/components/ShareAlbumForm.vue?vue&type=template&id=6adf0238&":
/*!**************************************************************************!*\
  !*** ./src/components/ShareAlbumForm.vue?vue&type=template&id=6adf0238& ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ShareAlbumForm_vue_vue_type_template_id_6adf0238___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ShareAlbumForm_vue_vue_type_template_id_6adf0238___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ShareAlbumForm_vue_vue_type_template_id_6adf0238___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ShareAlbumForm.vue?vue&type=template&id=6adf0238& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/ShareAlbumForm.vue?vue&type=template&id=6adf0238&");


/***/ }),

/***/ "./src/views/AlbumContent.vue?vue&type=template&id=36505f44&scoped=true&":
/*!*******************************************************************************!*\
  !*** ./src/views/AlbumContent.vue?vue&type=template&id=36505f44&scoped=true& ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumContent_vue_vue_type_template_id_36505f44_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumContent_vue_vue_type_template_id_36505f44_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumContent_vue_vue_type_template_id_36505f44_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AlbumContent.vue?vue&type=template&id=36505f44&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/AlbumContent.vue?vue&type=template&id=36505f44&scoped=true&");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FilesPicker.vue?vue&type=template&id=10d87d65&scoped=true&":
/*!**************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FilesPicker.vue?vue&type=template&id=10d87d65&scoped=true& ***!
  \**************************************************************************************************************************************************************************************************************************/
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
  return _c("div", { staticClass: "file-picker" }, [
    _c(
      "div",
      { staticClass: "file-picker__content" },
      [
        _c(
          "div",
          { staticClass: "file-picker__navigation" },
          _vm._l(_vm.monthsList, function (month) {
            return _c(
              "div",
              {
                key: month,
                staticClass: "file-picker__navigation__month",
                class: { selected: _vm.targetMonth === month },
                on: {
                  click: function ($event) {
                    return _vm.scrollTo(month)
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
          attrs: {
            "file-ids-by-section": _vm.filesListByMonth,
            sections: _vm.monthsList,
            loading: _vm.loadingFiles && _vm.nbFetchedFiles !== 0,
            "base-height": 100,
            "section-header-height": 50,
            "scroll-to-section": _vm.targetMonth,
          },
          on: { "need-content": _vm.fetchFiles },
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
                        style: {
                          width: height * file.ratio + "px",
                          height: height + "px",
                        },
                        attrs: {
                          item: _vm.files[file.id],
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
        _c(
          "Button",
          {
            attrs: { type: "tertiary" },
            scopedSlots: _vm._u([
              {
                key: "icon",
                fn: function () {
                  return [_c("Upload")]
                },
                proxy: true,
              },
            ]),
          },
          [
            _vm._v(
              "\n\t\t\t" +
                _vm._s(_vm.t("photos", "Upload from computer")) +
                "\n\t\t"
            ),
          ]
        ),
        _vm._v(" "),
        _c(
          "Button",
          {
            attrs: { type: "primary" },
            on: { click: _vm.emitPickedEvent },
            scopedSlots: _vm._u([
              {
                key: "icon",
                fn: function () {
                  return [_c("ImagePlus")]
                },
                proxy: true,
              },
            ]),
          },
          [
            _vm._v(
              "\n\t\t\t" + _vm._s(_vm.t("photos", "Add photos")) + "\n\t\t"
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

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/ShareAlbumForm.vue?vue&type=template&id=6adf0238&":
/*!*****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/ShareAlbumForm.vue?vue&type=template&id=6adf0238& ***!
  \*****************************************************************************************************************************************************************************************************************/
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
  return _c("div", [_vm._v("ShareAlbumForm")])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/AlbumContent.vue?vue&type=template&id=36505f44&scoped=true&":
/*!**********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/AlbumContent.vue?vue&type=template&id=36505f44&scoped=true& ***!
  \**********************************************************************************************************************************************************************************************************************/
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
  return _vm.errorFetchingFiles === 404
    ? _c(
        "EmptyContent",
        {
          staticClass: "empty-content-with-illustration",
          scopedSlots: _vm._u(
            [
              {
                key: "icon",
                fn: function () {
                  return [
                    _c("span", {
                      staticClass: "empty-content-illustration",
                      domProps: { innerHTML: _vm._s(_vm.FolderIllustration) },
                    }),
                  ]
                },
                proxy: true,
              },
            ],
            null,
            false,
            3945105199
          ),
        },
        [
          _vm._v(
            "\n\t" + _vm._s(_vm.t("photos", "This album does not exist")) + "\n"
          ),
        ]
      )
    : _vm.errorFetchingFiles || _vm.errorFetchingAlbums
    ? _c(
        "EmptyContent",
        {
          scopedSlots: _vm._u([
            {
              key: "icon",
              fn: function () {
                return [_c("AlertCircle")]
              },
              proxy: true,
            },
          ]),
        },
        [_vm._v("\n\t" + _vm._s(_vm.t("photos", "An error occurred")) + "\n")]
      )
    : _c(
        "div",
        { staticClass: "album-container" },
        [
          _c("div", { staticClass: "album-header" }, [
            _c(
              "div",
              { staticClass: "album-header-left" },
              [
                _c("div", { staticClass: "album-title" }, [
                  _vm.album !== undefined
                    ? _c("b", { staticClass: "album-name" }, [
                        _vm._v(
                          "\n\t\t\t\t\t" +
                            _vm._s(_vm.album.name || "All") +
                            "\n\n\t\t\t\t"
                        ),
                      ])
                    : _vm._e(),
                  _vm._v(" "),
                  _vm.album !== undefined
                    ? _c(
                        "div",
                        { staticClass: "album-location" },
                        [
                          _c("MapMarker"),
                          _vm._v(_vm._s(_vm.album.location) + "\n\t\t\t\t"),
                        ],
                        1
                      )
                    : _vm._e(),
                ]),
                _vm._v(" "),
                (_vm.loadingAlbums || _vm.loadingFiles) &&
                _vm.nbFetchedFiles !== 0
                  ? _c("Loader")
                  : _vm._e(),
              ],
              1
            ),
            _vm._v(" "),
            _vm.album !== undefined
              ? _c(
                  "div",
                  { staticClass: "album-actions" },
                  [
                    _vm.album.itemCount !== 0
                      ? _c("Button", {
                          attrs: {
                            type: "tertiary",
                            "aria-label": _vm.t(
                              "photos",
                              "Add photos to this album"
                            ),
                          },
                          on: {
                            click: function ($event) {
                              _vm.showAddPhotosModal = true
                            },
                          },
                          scopedSlots: _vm._u(
                            [
                              {
                                key: "icon",
                                fn: function () {
                                  return [_c("Plus")]
                                },
                                proxy: true,
                              },
                            ],
                            null,
                            false,
                            1489515321
                          ),
                        })
                      : _vm._e(),
                    _vm._v(" "),
                    _c("Button", {
                      attrs: {
                        type: "tertiary",
                        "aria-label": _vm.t("photos", "Share this album"),
                      },
                      on: {
                        click: function ($event) {
                          _vm.showShareModal = true
                        },
                      },
                      scopedSlots: _vm._u(
                        [
                          {
                            key: "icon",
                            fn: function () {
                              return [_c("ShareVariant")]
                            },
                            proxy: true,
                          },
                        ],
                        null,
                        false,
                        372598617
                      ),
                    }),
                    _vm._v(" "),
                    _c(
                      "Actions",
                      { attrs: { "force-menu": true } },
                      [
                        _c("ActionButton", {
                          attrs: {
                            "close-after-click": true,
                            title: _vm.t("photos", "Delete album"),
                          },
                          on: { click: _vm.deleteAlbum },
                          scopedSlots: _vm._u(
                            [
                              {
                                key: "icon",
                                fn: function () {
                                  return [_c("TrashCan")]
                                },
                                proxy: true,
                              },
                            ],
                            null,
                            false,
                            2019846067
                          ),
                        }),
                        _vm._v(" "),
                        _vm.selection.length === 0
                          ? _c("ActionButton", {
                              attrs: {
                                "close-after-click": true,
                                title: _vm.n(
                                  "photos",
                                  "Remove file from album",
                                  "Remove files from album",
                                  _vm.selection.length
                                ),
                              },
                              on: {
                                click: function ($event) {
                                  return _vm.removeFilesFromAlbum(
                                    _vm.selectedFileIds
                                  )
                                },
                              },
                              scopedSlots: _vm._u(
                                [
                                  {
                                    key: "icon",
                                    fn: function () {
                                      return [_c("TrashCan")]
                                    },
                                    proxy: true,
                                  },
                                ],
                                null,
                                false,
                                2019846067
                              ),
                            })
                          : _vm._e(),
                      ],
                      1
                    ),
                  ],
                  1
                )
              : _vm._e(),
          ]),
          _vm._v(" "),
          _vm.album !== undefined &&
          _vm.album.itemCount === 0 &&
          !(_vm.loadingFiles || _vm.loadingAlbums)
            ? _c(
                "div",
                { staticClass: "empty-album" },
                [
                  _c("EmptyContent", {
                    scopedSlots: _vm._u(
                      [
                        {
                          key: "icon",
                          fn: function () {
                            return [_c("ImagePlus")]
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
                                      "This album doesn't have any photos or videos yet!"
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
                      589841004
                    ),
                  }),
                  _vm._v(" "),
                  _c(
                    "Button",
                    {
                      staticClass: "empty-album__button",
                      attrs: {
                        type: "primary",
                        "aria-label": _vm.t(
                          "photos",
                          "Add photos to this album"
                        ),
                      },
                      on: {
                        click: function ($event) {
                          _vm.showAddPhotosModal = true
                        },
                      },
                      scopedSlots: _vm._u(
                        [
                          {
                            key: "icon",
                            fn: function () {
                              return [_c("Plus")]
                            },
                            proxy: true,
                          },
                        ],
                        null,
                        false,
                        1489515321
                      ),
                    },
                    [
                      _vm._v(
                        "\n\t\t\t" + _vm._s(_vm.t("photos", "Add")) + "\n\t\t"
                      ),
                    ]
                  ),
                ],
                1
              )
            : _vm._e(),
          _vm._v(" "),
          _vm.album !== undefined
            ? _c("FilesListViewer", {
                staticClass: "album-photos",
                attrs: {
                  "files-ids": _vm.albumFiles,
                  loading:
                    (_vm.loadingFiles || _vm.loadingAlbums) &&
                    _vm.nbFetchedFiles !== 0,
                },
                on: { "need-content": _vm.fetchAlbumContent },
                scopedSlots: _vm._u(
                  [
                    {
                      key: "default",
                      fn: function (ref) {
                        var file = ref.file
                        var height = ref.height
                        var visibility = ref.visibility
                        return _c("File", {
                          style: {
                            width: height * file.ratio + "px",
                            height: height + "px",
                          },
                          attrs: {
                            item: _vm.files[file.id],
                            "allow-selection": true,
                            selected: _vm.selection[file.id] === true,
                            visibility: visibility,
                            semaphore: _vm.semaphore,
                          },
                          on: {
                            "on-click": _vm.openViewer,
                            "select-toggled": _vm.onFileSelectToggle,
                          },
                        })
                      },
                    },
                  ],
                  null,
                  false,
                  1536688757
                ),
              })
            : _vm._e(),
          _vm._v(" "),
          _vm.showAddPhotosModal
            ? _c(
                "Modal",
                {
                  attrs: {
                    size: "large",
                    title: _vm.t("photos", "Add photos to the album"),
                  },
                  on: {
                    close: function ($event) {
                      _vm.showAddPhotosModal = false
                    },
                  },
                },
                [
                  _c("FilesPicker", {
                    on: { "files-picked": _vm.addFilesToAlbum },
                  }),
                ],
                1
              )
            : _vm.showShareModal
            ? _c(
                "Modal",
                {
                  attrs: { title: _vm.t("photos", "Share the album") },
                  on: {
                    close: function ($event) {
                      _vm.showShareModal = false
                    },
                  },
                },
                [
                  _c("ShareAlbumForm", {
                    on: {
                      albumShared: function ($event) {
                        _vm.showShareModal = false
                      },
                    },
                  }),
                ],
                1
              )
            : _vm._e(),
        ],
        1
      )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./src/assets/Illustrations/folder.svg":
/*!*********************************************!*\
  !*** ./src/assets/Illustrations/folder.svg ***!
  \*********************************************/
/***/ ((module) => {

module.exports = "<svg id=\"3ecf9745-447a-4766-8a86-6837975429df\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"729.47\" height=\"695.09\" viewBox=\"0 0 729.47 695.09\" style=\"margin-left:calc(50% * (730 - 615) / 730)\"><defs><linearGradient id=\"fc2ce546-a06c-4acb-8cca-fc7989cc5e45\" x1=\"611.98\" y1=\"687.2\" x2=\"611.98\" y2=\"258.73\" gradientUnits=\"userSpaceOnUse\"><stop offset=\"0\" stop-color=\"gray\" stop-opacity=\"0.25\"/><stop offset=\"0.54\" stop-color=\"gray\" stop-opacity=\"0.12\"/><stop offset=\"1\" stop-color=\"gray\" stop-opacity=\"0.1\"/></linearGradient><linearGradient id=\"8de405ef-36e0-4554-af41-d0565e95cbca\" x1=\"410.91\" y1=\"358.56\" x2=\"452.61\" y2=\"86.08\" gradientTransform=\"matrix(1.01, 0.13, -0.13, 1.02, 62.29, -41.05)\" xlink:href=\"#fc2ce546-a06c-4acb-8cca-fc7989cc5e45\"/><linearGradient id=\"90a47f5c-11a4-432e-bbe5-e819485e2974\" x1=\"597.01\" y1=\"453.03\" x2=\"597.01\" y2=\"138.64\" gradientTransform=\"translate(140.76 -189.73) rotate(20.42)\" xlink:href=\"#fc2ce546-a06c-4acb-8cca-fc7989cc5e45\"/><linearGradient id=\"c3d8783b-6f33-4c65-b7a9-7a0b4c25dfb1\" x1=\"756.62\" y1=\"488.3\" x2=\"772.25\" y2=\"249.01\" gradientTransform=\"matrix(0.26, 0.99, -1.02, 0.25, 910.43, -476.82)\" xlink:href=\"#fc2ce546-a06c-4acb-8cca-fc7989cc5e45\"/><linearGradient id=\"1441cd83-913d-413c-98d4-824021df009a\" x1=\"310\" y1=\"695.09\" x2=\"310\" y2=\"203.86\" xlink:href=\"#fc2ce546-a06c-4acb-8cca-fc7989cc5e45\"/><linearGradient id=\"4913d3bc-5f66-46f4-9c65-3645c89ed5d3\" x1=\"545.79\" y1=\"695.81\" x2=\"545.79\" y2=\"464.64\" gradientUnits=\"userSpaceOnUse\"><stop offset=\"0\" stop-color=\"#b3b3b3\" stop-opacity=\"0.25\"/><stop offset=\"0.54\" stop-color=\"#b3b3b3\" stop-opacity=\"0.1\"/><stop offset=\"1\" stop-color=\"#b3b3b3\" stop-opacity=\"0.05\"/></linearGradient><linearGradient id=\"0cf8a40c-444c-472e-8722-d672ac4b1674\" x1=\"310.8\" y1=\"580.62\" x2=\"310.8\" y2=\"375.85\" xlink:href=\"#4913d3bc-5f66-46f4-9c65-3645c89ed5d3\"/><clipPath id=\"f4edd298-8257-4895-a91b-ae15b3b0d94f\" transform=\"translate(-235.26 -102.45)\"><rect x=\"400.07\" y=\"483.3\" width=\"291.69\" height=\"194.01\" rx=\"8.85\" ry=\"8.85\" fill=\"#fff\"/></clipPath></defs><title>folder</title><polygon points=\"618.97 687.2 513.53 687.2 513.53 258.73 710.42 258.73 618.97 687.2\" fill=\"url(#fc2ce546-a06c-4acb-8cca-fc7989cc5e45)\"/><polygon points=\"613.72 687.2 510.37 687.2 510.37 258.73 703.35 258.73 613.72 687.2\" fill=\"#f5f5f5\"/><rect x=\"249.88\" y=\"158.45\" width=\"439.19\" height=\"168.85\" transform=\"translate(-283.32 32.9) rotate(-15.62)\" fill=\"url(#8de405ef-36e0-4554-af41-d0565e95cbca)\"/><rect x=\"254.32\" y=\"160.66\" width=\"431.85\" height=\"163.44\" transform=\"translate(-283.15 33.09) rotate(-15.62)\" fill=\"#f4f4f4\"/><rect x=\"367.9\" y=\"230.63\" width=\"108.65\" height=\"8.29\" transform=\"translate(-282.88 19.88) rotate(-15.62)\" fill=\"#f5f5f5\"/><rect x=\"376.82\" y=\"262.55\" width=\"108.65\" height=\"8.29\" transform=\"translate(-291.14 23.46) rotate(-15.62)\" fill=\"#fff\"/><rect x=\"371.14\" y=\"237.71\" width=\"174.6\" height=\"8.29\" transform=\"translate(-283.45 29.89) rotate(-15.62)\" fill=\"#fff\"/><circle cx=\"329.58\" cy=\"277.88\" r=\"19.34\" transform=\"translate(-297.9 -3.47) rotate(-15.62)\" fill=\"#fff\"/><rect x=\"376.38\" y=\"210.25\" width=\"441.26\" height=\"171.17\" transform=\"translate(-300.97 124.47) rotate(-20.42)\" fill=\"url(#90a47f5c-11a4-432e-bbe5-e819485e2974)\"/><rect x=\"381.03\" y=\"214.81\" width=\"431.85\" height=\"163.44\" transform=\"translate(-301.21 124.5) rotate(-20.42)\" fill=\"#f7f7f7\"/><rect x=\"494.14\" y=\"288.83\" width=\"108.65\" height=\"8.29\" transform=\"translate(-303.02 107.35) rotate(-20.42)\" fill=\"#f5f5f5\"/><rect x=\"505.71\" y=\"319.89\" width=\"108.65\" height=\"8.29\" transform=\"translate(-313.13 113.34) rotate(-20.42)\" fill=\"#fff\"/><rect x=\"497.85\" y=\"292.85\" width=\"174.6\" height=\"8.29\" transform=\"matrix(0.94, -0.35, 0.35, 0.94, -302.12, 120.41)\" fill=\"#fff\"/><circle cx=\"459.76\" cy=\"343.69\" r=\"19.34\" transform=\"translate(-326.29 79.59) rotate(-20.42)\" fill=\"#fff\"/><rect x=\"646.89\" y=\"150.88\" width=\"172.17\" height=\"440.14\" transform=\"translate(3.97 925.06) rotate(-79.9)\" fill=\"url(#c3d8783b-6f33-4c65-b7a9-7a0b4c25dfb1)\"/><rect x=\"515.81\" y=\"288.22\" width=\"431.85\" height=\"163.44\" transform=\"translate(-159.05 -225.04) rotate(10.1)\" fill=\"#fafafa\"/><rect x=\"687.63\" y=\"287.92\" width=\"8.29\" height=\"108.65\" transform=\"translate(-1.75 860.83) rotate(-79.9)\" fill=\"#f5f5f5\"/><rect x=\"681.81\" y=\"320.56\" width=\"8.29\" height=\"108.65\" transform=\"translate(-38.67 882.02) rotate(-79.9)\" fill=\"#fff\"/><rect x=\"717.18\" y=\"277.05\" width=\"8.29\" height=\"174.6\" transform=\"translate(0.86 908.15) rotate(-79.9)\" fill=\"#fff\"/><circle cx=\"589.6\" cy=\"340.88\" r=\"19.34\" transform=\"translate(-84.66 759.11) rotate(-79.9)\" fill=\"#fff\"/><polygon points=\"171.78 253.69 100.61 203.86 2.07 203.86 2.07 253.69 2.07 278.1 2.07 695.09 617.93 695.09 617.93 253.69 171.78 253.69\" fill=\"url(#1441cd83-913d-413c-98d4-824021df009a)\"/><polygon points=\"174.44 258.73 104.36 210.36 7.34 210.36 7.34 258.73 7.34 282.43 7.34 687.2 613.72 687.2 613.72 258.73 174.44 258.73\" fill=\"#fff\"/><path d=\"M711.54,688.53a7.25,7.25,0,0,1-7.21,7.28H387.26a7.25,7.25,0,0,1-7.21-7.28V471.93a7.25,7.25,0,0,1,7.21-7.28H704.33a7.25,7.25,0,0,1,7.21,7.28\" transform=\"translate(-235.26 -102.45)\" fill=\"url(#4913d3bc-5f66-46f4-9c65-3645c89ed5d3)\"/><path d=\"M707.81,685a7,7,0,0,1-7,7H391.05a7,7,0,0,1-7-7V475.62a7,7,0,0,1,7-7H700.77a7,7,0,0,1,7,7\" transform=\"translate(-235.26 -102.45)\" fill=\"#fff\"/><g id=\"114cebd5-d8fe-4021-8e49-fe55d7dac6be\" data-name=\"&lt;Rectangle&gt;\"><rect x=\"161.12\" y=\"375.85\" width=\"299.37\" height=\"204.76\" rx=\"8.85\" ry=\"8.85\" fill=\"url(#0cf8a40c-444c-472e-8722-d672ac4b1674)\"/></g><rect x=\"164.8\" y=\"380.84\" width=\"291.69\" height=\"194.01\" rx=\"8.85\" ry=\"8.85\" fill=\"#fff\"/><g clip-path=\"url(#f4edd298-8257-4895-a91b-ae15b3b0d94f)\"><path d=\"M383.84,675.53l81.44-93.31a16.21,16.21,0,0,1,22.94-1.5L511,600.84a16.21,16.21,0,0,0,21.16.25l69.7-58.58A16.21,16.21,0,0,1,624.3,544l85.53,94.14a16.21,16.21,0,0,1,4.15,9.47l3.3,37.13a16.21,16.21,0,0,1-16.15,17.65H396.06a16.21,16.21,0,0,1-16.2-15.72h0A16.21,16.21,0,0,1,383.84,675.53Z\" transform=\"translate(-235.26 -102.45)\" fill=\"#6c63ff\"/></g><circle cx=\"199.93\" cy=\"411.95\" r=\"18.06\" fill=\"#ff5252\"/></svg>";

/***/ })

}]);
//# sourceMappingURL=photos-src_views_AlbumContent_vue.js.map?v=975647e77b910d24236f