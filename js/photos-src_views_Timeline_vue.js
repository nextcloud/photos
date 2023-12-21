"use strict";
(self["webpackChunkphotos"] = self["webpackChunkphotos"] || []).push([["src_views_Timeline_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Actions/ActionDownload.vue?vue&type=script&lang=js&":
/*!********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Actions/ActionDownload.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/router */ "./node_modules/@nextcloud/router/dist/index.js");
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/vue */ "./node_modules/@nextcloud/vue/dist/index.mjs");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'ActionDownload',
  components: {
    NcActionLink: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_1__.NcActionLink
  },
  props: {
    title: {
      type: String,
      required: true
    },
    selectedFileIds: {
      type: Array,
      required: true
    }
  },
  computed: {
    ...(0,vuex__WEBPACK_IMPORTED_MODULE_2__.mapGetters)(['files']),
    downloadUrl() {
      const params = new URLSearchParams();
      const filePaths = this.fileNames.map(fileName => '/' + fileName.split('/').splice(3).join('/'));
      params.append('files', JSON.stringify(filePaths));
      return (0,_nextcloud_router__WEBPACK_IMPORTED_MODULE_0__.generateUrl)(`/apps/files/ajax/download.php?${params}`);
    },
    fileNames() {
      return this.selectedFileIds.map(fileId => this.files[fileId].filename);
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Actions/ActionFavorite.vue?vue&type=script&lang=js&":
/*!********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Actions/ActionFavorite.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var vue_material_design_icons_Star_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue-material-design-icons/Star.vue */ "./node_modules/vue-material-design-icons/Star.vue");
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/vue */ "./node_modules/@nextcloud/vue/dist/index.mjs");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'ActionFavorite',
  components: {
    Star: vue_material_design_icons_Star_vue__WEBPACK_IMPORTED_MODULE_0__["default"],
    NcActionButton: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_1__.NcActionButton
  },
  props: {
    selectedFileIds: {
      type: Array,
      required: true
    }
  },
  computed: {
    ...(0,vuex__WEBPACK_IMPORTED_MODULE_2__.mapGetters)(['files']),
    /** @return {boolean} */
    shouldFavoriteSelection() {
      // Favorite all selection if at least one file is not in the favorites.
      return this.selectedFileIds.some(fileId => this.files[fileId].favorite === 0);
    }
  },
  methods: {
    ...(0,vuex__WEBPACK_IMPORTED_MODULE_2__.mapActions)(['toggleFavoriteForFiles']),
    async favoriteSelection() {
      await this.toggleFavoriteForFiles({
        fileIds: this.selectedFileIds,
        favoriteState: 1
      });
    },
    async unFavoriteSelection() {
      await this.toggleFavoriteForFiles({
        fileIds: this.selectedFileIds,
        favoriteState: 0
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/AlbumPicker.vue?vue&type=script&lang=js&":
/*!****************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/AlbumPicker.vue?vue&type=script&lang=js& ***!
  \****************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var vue_material_design_icons_Plus_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue-material-design-icons/Plus.vue */ "./node_modules/vue-material-design-icons/Plus.vue");
/* harmony import */ var vue_material_design_icons_ImageMultiple_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-material-design-icons/ImageMultiple.vue */ "./node_modules/vue-material-design-icons/ImageMultiple.vue");
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @nextcloud/vue */ "./node_modules/@nextcloud/vue/dist/index.mjs");
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @nextcloud/router */ "./node_modules/@nextcloud/router/dist/index.js");
/* harmony import */ var _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @nextcloud/l10n */ "./node_modules/@nextcloud/l10n/dist/index.mjs");
/* harmony import */ var _nextcloud_auth__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @nextcloud/auth */ "./node_modules/@nextcloud/auth/dist/index.es.mjs");
/* harmony import */ var _mixins_FetchCollectionsMixin_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../mixins/FetchCollectionsMixin.js */ "./src/mixins/FetchCollectionsMixin.js");
/* harmony import */ var _AlbumForm_vue__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./AlbumForm.vue */ "./src/components/Albums/AlbumForm.vue");









/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'AlbumPicker',
  components: {
    Plus: vue_material_design_icons_Plus_vue__WEBPACK_IMPORTED_MODULE_0__["default"],
    ImageMultiple: vue_material_design_icons_ImageMultiple_vue__WEBPACK_IMPORTED_MODULE_1__["default"],
    NcButton: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_2__.NcButton,
    NcListItem: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_2__.NcListItem,
    NcLoadingIcon: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_2__.NcLoadingIcon,
    NcUserBubble: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_2__.NcUserBubble,
    AlbumForm: _AlbumForm_vue__WEBPACK_IMPORTED_MODULE_7__["default"]
  },
  filters: {
    /**
     * @param {string} fileId - The id of the file.
     * @return {string}
     */
    toCoverUrl(fileId) {
      return (0,_nextcloud_router__WEBPACK_IMPORTED_MODULE_3__.generateUrl)(`/apps/photos/api/v1/preview/${fileId}?x=${64}&y=${64}`);
    }
  },
  mixins: [_mixins_FetchCollectionsMixin_js__WEBPACK_IMPORTED_MODULE_6__["default"]],
  data() {
    return {
      showAlbumCreationForm: false
    };
  },
  computed: {
    ...(0,vuex__WEBPACK_IMPORTED_MODULE_8__.mapGetters)(['albums', 'sharedAlbums']),
    /**
     * @return {import('../../store/albums.js').Album[]}
     */
    allAlbums() {
      return [...Object.values(this.albums), ...Object.values(this.sharedAlbums)];
    }
  },
  mounted() {
    this.fetchAlbumList();
  },
  methods: {
    async fetchAlbumList() {
      await this.fetchCollections(`/photos/${(0,_nextcloud_auth__WEBPACK_IMPORTED_MODULE_5__.getCurrentUser)()?.uid}/albums`, ['<nc:location />', '<nc:dateRange />', '<nc:collaborators />']);
      await this.fetchCollections(`/photos/${(0,_nextcloud_auth__WEBPACK_IMPORTED_MODULE_5__.getCurrentUser)()?.uid}/sharedalbums`, ['<nc:location />', '<nc:dateRange />', '<nc:collaborators />']);
    },
    albumCreatedHandler() {
      this.showAlbumCreationForm = false;
      this.fetchAlbumList();
    },
    pickAlbum(album) {
      this.$emit('album-picked', album);
    },
    /**
     * @param {object} album
     * @return {boolean}
     */
    isSharedAlbum(album) {
      return album.filename.match(/^\/photos\/.+\/sharedalbums\//) !== null;
    },
    /**
     * @param {object} album The album's full name, including the userid.
     * @return {string} The album name without the userId between parentheses.
     */
    originalName(album) {
      if (this.isSharedAlbum(album)) {
        return album.basename.replace(new RegExp(`\\(${album.collaborators[0].id}\\)$`), '');
      } else {
        return album.basename;
      }
    },
    t: _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_4__.translate,
    n: _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_4__.translatePlural
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/Timeline.vue?vue&type=script&lang=js&":
/*!*************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/Timeline.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var vue_material_design_icons_Plus_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue-material-design-icons/Plus.vue */ "./node_modules/vue-material-design-icons/Plus.vue");
/* harmony import */ var vue_material_design_icons_Delete_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-material-design-icons/Delete.vue */ "./node_modules/vue-material-design-icons/Delete.vue");
/* harmony import */ var vue_material_design_icons_PlusBoxMultiple_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vue-material-design-icons/PlusBoxMultiple.vue */ "./node_modules/vue-material-design-icons/PlusBoxMultiple.vue");
/* harmony import */ var vue_material_design_icons_Download_vue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! vue-material-design-icons/Download.vue */ "./node_modules/vue-material-design-icons/Download.vue");
/* harmony import */ var vue_material_design_icons_Close_vue__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! vue-material-design-icons/Close.vue */ "./node_modules/vue-material-design-icons/Close.vue");
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @nextcloud/vue */ "./node_modules/@nextcloud/vue/dist/index.mjs");
/* harmony import */ var _nextcloud_moment__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @nextcloud/moment */ "./node_modules/@nextcloud/moment/dist/index.js");
/* harmony import */ var _nextcloud_moment__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_moment__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _services_AllowedMimes_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../services/AllowedMimes.js */ "./src/services/AllowedMimes.js");
/* harmony import */ var _mixins_FetchFilesMixin_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../mixins/FetchFilesMixin.js */ "./src/mixins/FetchFilesMixin.js");
/* harmony import */ var _mixins_FilesByMonthMixin_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../mixins/FilesByMonthMixin.js */ "./src/mixins/FilesByMonthMixin.js");
/* harmony import */ var _mixins_FilesSelectionMixin_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../mixins/FilesSelectionMixin.js */ "./src/mixins/FilesSelectionMixin.js");
/* harmony import */ var _components_FilesListViewer_vue__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../components/FilesListViewer.vue */ "./src/components/FilesListViewer.vue");
/* harmony import */ var _components_File_vue__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../components/File.vue */ "./src/components/File.vue");
/* harmony import */ var _components_Albums_AlbumForm_vue__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../components/Albums/AlbumForm.vue */ "./src/components/Albums/AlbumForm.vue");
/* harmony import */ var _components_Albums_AlbumPicker_vue__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../components/Albums/AlbumPicker.vue */ "./src/components/Albums/AlbumPicker.vue");
/* harmony import */ var _components_Actions_ActionFavorite_vue__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../components/Actions/ActionFavorite.vue */ "./src/components/Actions/ActionFavorite.vue");
/* harmony import */ var _components_Actions_ActionDownload_vue__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../components/Actions/ActionDownload.vue */ "./src/components/Actions/ActionDownload.vue");
/* harmony import */ var _components_HeaderNavigation_vue__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../components/HeaderNavigation.vue */ "./src/components/HeaderNavigation.vue");
/* harmony import */ var _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @nextcloud/l10n */ "./node_modules/@nextcloud/l10n/dist/index.mjs");




















/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'Timeline',
  components: {
    Delete: vue_material_design_icons_Delete_vue__WEBPACK_IMPORTED_MODULE_1__["default"],
    PlusBoxMultiple: vue_material_design_icons_PlusBoxMultiple_vue__WEBPACK_IMPORTED_MODULE_2__["default"],
    Download: vue_material_design_icons_Download_vue__WEBPACK_IMPORTED_MODULE_3__["default"],
    Close: vue_material_design_icons_Close_vue__WEBPACK_IMPORTED_MODULE_4__["default"],
    Plus: vue_material_design_icons_Plus_vue__WEBPACK_IMPORTED_MODULE_0__["default"],
    NcEmptyContent: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_5__.NcEmptyContent,
    NcModal: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_5__.NcModal,
    NcActions: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_5__.NcActions,
    NcActionButton: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_5__.NcActionButton,
    NcButton: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_5__.NcButton,
    AlbumForm: _components_Albums_AlbumForm_vue__WEBPACK_IMPORTED_MODULE_13__["default"],
    AlbumPicker: _components_Albums_AlbumPicker_vue__WEBPACK_IMPORTED_MODULE_14__["default"],
    FilesListViewer: _components_FilesListViewer_vue__WEBPACK_IMPORTED_MODULE_11__["default"],
    File: _components_File_vue__WEBPACK_IMPORTED_MODULE_12__["default"],
    ActionFavorite: _components_Actions_ActionFavorite_vue__WEBPACK_IMPORTED_MODULE_15__["default"],
    ActionDownload: _components_Actions_ActionDownload_vue__WEBPACK_IMPORTED_MODULE_16__["default"],
    HeaderNavigation: _components_HeaderNavigation_vue__WEBPACK_IMPORTED_MODULE_17__["default"]
  },
  filters: {
    /**
     * @param {string} date - In the following format: YYYYMM
     */
    dateMonth(date) {
      return _nextcloud_moment__WEBPACK_IMPORTED_MODULE_6___default()(date, 'YYYYMM').format('MMMM');
    },
    /**
     * @param {string} date - In the following format: YYYYMM
     */
    dateYear(date) {
      return _nextcloud_moment__WEBPACK_IMPORTED_MODULE_6___default()(date, 'YYYYMM').format('YYYY');
    }
  },
  mixins: [_mixins_FetchFilesMixin_js__WEBPACK_IMPORTED_MODULE_8__["default"], _mixins_FilesSelectionMixin_js__WEBPACK_IMPORTED_MODULE_10__["default"], _mixins_FilesByMonthMixin_js__WEBPACK_IMPORTED_MODULE_9__["default"], _nextcloud_vue__WEBPACK_IMPORTED_MODULE_5__.isMobile],
  beforeRouteLeave(to, from, next) {
    window.scrollTo(0, 0);
    next();
  },
  props: {
    onlyFavorites: {
      type: Boolean,
      default: false
    },
    mimesType: {
      type: Array,
      default: () => _services_AllowedMimes_js__WEBPACK_IMPORTED_MODULE_7__.allMimes
    },
    onThisDay: {
      type: Boolean,
      default: false
    },
    rootTitle: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loadingCount: 0,
      showAlbumCreationForm: false,
      showAlbumPicker: false,
      appContent: document.getElementById('app-content-vue')
    };
  },
  computed: {
    ...(0,vuex__WEBPACK_IMPORTED_MODULE_19__.mapGetters)(['files'])
  },
  methods: {
    ...(0,vuex__WEBPACK_IMPORTED_MODULE_19__.mapActions)(['deleteFiles', 'addFilesToCollection']),
    getContent() {
      this.fetchFiles('', {
        mimesType: this.mimesType,
        onThisDay: this.onThisDay,
        onlyFavorites: this.onlyFavorites
      });
    },
    openViewer(fileId) {
      const file = this.files[fileId];
      OCA.Viewer.open({
        fileInfo: file,
        list: Object.values(this.fileIdsByMonth).flat().map(fileId => this.files[fileId]),
        loadMore: file.loadMore ? async () => await file.loadMore(true) : () => [],
        canLoop: file.canLoop
      });
    },
    openUploader() {
      // TODO: finish when implementing upload
    },
    async addSelectionToAlbum(album) {
      this.showAlbumPicker = false;
      await this.addFilesToCollection({
        collectionFileName: album.filename,
        fileIdsToAdd: this.selectedFileIds
      });
    },
    async deleteSelection() {
      // Need to store the file ids so it is not changed before the deleteFiles call.
      const fileIds = this.selectedFileIds;
      this.onUncheckFiles(fileIds);
      this.fetchedFileIds = this.fetchedFileIds.filter(fileid => !fileIds.includes(fileid));
      await this.deleteFiles(fileIds);
    },
    t: _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_18__.translate
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Actions/ActionDownload.vue?vue&type=template&id=1aefa300&":
/*!*******************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Actions/ActionDownload.vue?vue&type=template&id=1aefa300& ***!
  \*******************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("NcActionLink", {
    attrs: {
      "close-after-click": true,
      href: _vm.downloadUrl,
      download: _vm.downloadUrl,
      "aria-label": _vm.title
    }
  }, [_vm._v("\n\t" + _vm._s(_vm.title) + "\n\t"), _vm._t("icon", null, {
    slot: "icon"
  })], 2);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Actions/ActionFavorite.vue?vue&type=template&id=607ef4d8&":
/*!*******************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Actions/ActionFavorite.vue?vue&type=template&id=607ef4d8& ***!
  \*******************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _vm.shouldFavoriteSelection ? _c("NcActionButton", {
    attrs: {
      "close-after-click": true,
      "aria-label": _vm.t("photos", "Mark selection as favorite")
    },
    on: {
      click: _vm.favoriteSelection
    }
  }, [_vm._v("\n\t" + _vm._s(_vm.t("photos", "Add selection to favorites")) + "\n\t"), _c("Star", {
    attrs: {
      slot: "icon"
    },
    slot: "icon"
  })], 1) : _c("NcActionButton", {
    attrs: {
      "close-after-click": true,
      "aria-label": _vm.t("photos", "Remove selection from favorites")
    },
    on: {
      click: _vm.unFavoriteSelection
    }
  }, [_vm._v("\n\t" + _vm._s(_vm.t("photos", "Remove selection from favorites")) + "\n\t"), _c("Star", {
    attrs: {
      slot: "icon"
    },
    slot: "icon"
  })], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/AlbumPicker.vue?vue&type=template&id=0acbeb42&scoped=true&":
/*!***************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/AlbumPicker.vue?vue&type=template&id=0acbeb42&scoped=true& ***!
  \***************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return !_vm.showAlbumCreationForm ? _c("div", {
    staticClass: "album-picker"
  }, [_c("h2", [_vm._v("\n\t\t" + _vm._s(_vm.t("photos", "Add to Album")) + "\n\t\t"), _vm.loadingCollections ? _c("NcLoadingIcon", {
    staticClass: "loading-icon"
  }) : _vm._e()], 1), _vm._v(" "), _c("ul", {
    staticClass: "albums-container"
  }, _vm._l(_vm.allAlbums, function (album) {
    return _c("NcListItem", {
      key: album.filename,
      staticClass: "album",
      attrs: {
        name: _vm.originalName(album),
        "aria-label": _vm.t("photos", "Add selection to album {albumName}", {
          albumName: album.basename
        })
      },
      on: {
        click: function ($event) {
          return _vm.pickAlbum(album);
        }
      },
      scopedSlots: _vm._u([{
        key: "subname",
        fn: function () {
          return [_vm._v("\n\t\t\t\t" + _vm._s(_vm.n("photos", "%n item", "%n photos and videos", album.nbItems)) + "\n\t\t\t\t"), _vm.isSharedAlbum(album) ? [_vm._v("\n\t\t\t\t\t⸱ " + _vm._s(_vm.t("photos", "Shared by")) + " "), _c("NcUserBubble", {
            attrs: {
              "display-name": album.collaborators[0].label,
              user: album.collaborators[0].id
            }
          })] : _vm._e()];
        },
        proxy: true
      }], null, true)
    }, [_c("template", {
      slot: "icon"
    }, [album.lastPhoto !== -1 ? _c("img", {
      staticClass: "album__image",
      attrs: {
        src: _vm._f("toCoverUrl")(album.lastPhoto)
      }
    }) : _c("div", {
      staticClass: "album__image album__image--placeholder"
    }, [_c("ImageMultiple", {
      attrs: {
        size: 32
      }
    })], 1)])], 2);
  }), 1), _vm._v(" "), _c("NcButton", {
    staticClass: "new-album-button",
    attrs: {
      "aria-label": _vm.t("photos", "Create a new album."),
      type: "tertiary"
    },
    on: {
      click: function ($event) {
        _vm.showAlbumCreationForm = true;
      }
    },
    scopedSlots: _vm._u([{
      key: "icon",
      fn: function () {
        return [_c("Plus")];
      },
      proxy: true
    }], null, false, 1489515321)
  }, [_vm._v("\n\t\t" + _vm._s(_vm.t("photos", "Create new album")) + "\n\t")])], 1) : _c("AlbumForm", {
    attrs: {
      "display-back-button": true,
      title: _vm.t("photos", "New album")
    },
    on: {
      back: function ($event) {
        _vm.showAlbumCreationForm = false;
      },
      done: _vm.albumCreatedHandler
    }
  });
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/Timeline.vue?vue&type=template&id=e945440a&scoped=true&":
/*!************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/Timeline.vue?vue&type=template&id=e945440a&scoped=true& ***!
  \************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _vm.errorFetchingFiles ? _c("NcEmptyContent", [_vm._v("\n\t" + _vm._s(_vm.t("photos", "An error occurred")) + "\n")]) : _c("div", {
    staticClass: "timeline"
  }, [_c("HeaderNavigation", {
    key: "navigation",
    attrs: {
      loading: _vm.loadingCount > 0,
      path: "/",
      title: _vm.rootTitle,
      "root-title": _vm.rootTitle
    },
    on: {
      refresh: _vm.resetFetchFilesState
    }
  }, [_c("div", {
    staticClass: "timeline__header__left"
  }, [_vm.selectedFileIds.length === 0 ? _c("NcActions", {
    attrs: {
      "force-menu": true,
      "menu-name": _vm.t("photos", "Add")
    },
    scopedSlots: _vm._u([{
      key: "icon",
      fn: function () {
        return [_c("Plus")];
      },
      proxy: true
    }], null, false, 1489515321)
  }, [_vm._v(" "), _c("NcActionButton", {
    attrs: {
      "close-after-click": true,
      "aria-label": _vm.t("photos", "Create new album")
    },
    on: {
      click: function ($event) {
        _vm.showAlbumCreationForm = true;
      }
    },
    scopedSlots: _vm._u([{
      key: "icon",
      fn: function () {
        return [_c("PlusBoxMultiple")];
      },
      proxy: true
    }], null, false, 2640725948)
  }, [_vm._v("\n\t\t\t\t\t" + _vm._s(_vm.t("photos", "Create new album")) + "\n\t\t\t\t\t")])], 1) : [_c("NcButton", {
    attrs: {
      "close-after-click": true,
      type: "primary",
      "aria-label": _vm.t("photos", "Add to album")
    },
    on: {
      click: function ($event) {
        _vm.showAlbumPicker = true;
      }
    },
    scopedSlots: _vm._u([{
      key: "icon",
      fn: function () {
        return [_c("Plus")];
      },
      proxy: true
    }])
  }, [_vm._v(" "), !_vm.isMobile ? [_vm._v("\n\t\t\t\t\t\t" + _vm._s(_vm.t("photos", "Add to album")) + "\n\t\t\t\t\t")] : _vm._e()], 2), _vm._v(" "), _vm.selectedFileIds.length > 0 ? _c("NcButton", {
    attrs: {
      "aria-label": _vm.t("photos", "Unselect all")
    },
    on: {
      click: _vm.resetSelection
    },
    scopedSlots: _vm._u([{
      key: "icon",
      fn: function () {
        return [_c("Close")];
      },
      proxy: true
    }], null, false, 1051939733)
  }, [_vm._v(" "), !_vm.isMobile ? [_vm._v("\n\t\t\t\t\t\t" + _vm._s(_vm.t("photos", "Unselect all")) + "\n\t\t\t\t\t")] : _vm._e()], 2) : _vm._e(), _vm._v(" "), _c("NcActions", {
    attrs: {
      "aria-label": _vm.t("photos", "Open actions menu")
    }
  }, [_c("ActionDownload", {
    attrs: {
      "selected-file-ids": _vm.selectedFileIds,
      title: _vm.t("photos", "Download selected files")
    }
  }, [_c("Download", {
    attrs: {
      slot: "icon"
    },
    slot: "icon"
  })], 1), _vm._v(" "), _c("ActionFavorite", {
    attrs: {
      "selected-file-ids": _vm.selectedFileIds
    }
  }), _vm._v(" "), _c("NcActionButton", {
    attrs: {
      "close-after-click": true,
      "aria-label": _vm.t("photos", "Delete selection")
    },
    on: {
      click: _vm.deleteSelection
    },
    scopedSlots: _vm._u([{
      key: "icon",
      fn: function () {
        return [_c("Delete")];
      },
      proxy: true
    }])
  }, [_vm._v("\n\t\t\t\t\t\t" + _vm._s(_vm.t("photos", "Delete selection")) + "\n\t\t\t\t\t\t")])], 1)]], 2)]), _vm._v(" "), _c("FilesListViewer", {
    ref: "filesListViewer",
    staticClass: "timeline__file-list",
    attrs: {
      "container-element": _vm.appContent,
      "file-ids-by-section": _vm.fileIdsByMonth,
      sections: _vm.monthsList,
      loading: _vm.loadingFiles,
      "base-height": _vm.isMobile ? 120 : 200,
      "empty-message": _vm.t("photos", "No photos or videos in here")
    },
    on: {
      "need-content": _vm.getContent
    },
    scopedSlots: _vm._u([{
      key: "default",
      fn: function (_ref) {
        let {
          file,
          isHeader,
          distance
        } = _ref;
        return [isHeader ? _c("h2", {
          staticClass: "section-header",
          attrs: {
            id: `file-picker-section-header-${file.id}`
          }
        }, [_c("b", [_vm._v(_vm._s(_vm._f("dateMonth")(file.id)))]), _vm._v("\n\t\t\t\t" + _vm._s(_vm._f("dateYear")(file.id)) + "\n\t\t\t")]) : _c("File", {
          attrs: {
            file: _vm.files[file.id],
            "allow-selection": true,
            selected: _vm.selection[file.id] === true,
            distance: distance
          },
          on: {
            click: _vm.openViewer,
            "select-toggled": _vm.onFileSelectToggle
          }
        })];
      }
    }])
  }), _vm._v(" "), _vm.showAlbumCreationForm ? _c("NcModal", {
    key: "albumCreationForm",
    on: {
      close: function ($event) {
        _vm.showAlbumCreationForm = false;
      }
    }
  }, [_c("h2", {
    staticClass: "timeline__heading"
  }, [_vm._v(_vm._s(_vm.t("photos", "New album")))]), _vm._v(" "), _c("AlbumForm", {
    on: {
      done: function ($event) {
        _vm.showAlbumCreationForm = false;
      }
    }
  })], 1) : _vm._e(), _vm._v(" "), _vm.showAlbumPicker ? _c("NcModal", {
    key: "albumPicker",
    on: {
      close: function ($event) {
        _vm.showAlbumPicker = false;
      }
    }
  }, [_c("AlbumPicker", {
    on: {
      "album-picked": _vm.addSelectionToAlbum
    }
  })], 1) : _vm._e()], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./src/mixins/FetchCollectionsMixin.js":
/*!*********************************************!*\
  !*** ./src/mixins/FetchCollectionsMixin.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _AbortControllerMixin_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbortControllerMixin.js */ "./src/mixins/AbortControllerMixin.js");
/* harmony import */ var _services_collectionFetcher_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/collectionFetcher.js */ "./src/services/collectionFetcher.js");
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
  name: 'FetchCollectionsMixin',
  data() {
    return {
      errorFetchingCollections: null,
      loadingCollections: false
    };
  },
  mixins: [_AbortControllerMixin_js__WEBPACK_IMPORTED_MODULE_0__["default"]],
  methods: {
    ...(0,vuex__WEBPACK_IMPORTED_MODULE_2__.mapActions)(['addCollections']),
    /**
     * @param {string} collectionHome
     * @param {string[]} [extraProps] - Extra properties to add to the DAV request.
     * @param {import('webdav').WebDAVClient} [client] - The DAV client to use.
     * @return {Promise<import('../services/collectionFetcher.js').Collection[]>}
     */
    async fetchCollections(collectionHome, extraProps, client) {
      if (this.loadingCollections) {
        return [];
      }
      try {
        this.loadingCollections = true;
        this.errorFetchingCollections = null;
        const collections = await (0,_services_collectionFetcher_js__WEBPACK_IMPORTED_MODULE_1__.fetchCollections)(collectionHome, {
          signal: this.abortController.signal
        }, extraProps, client);
        this.addCollections({
          collections
        });
        return collections;
      } catch (error) {
        if (error.response?.status === 404) {
          this.errorFetchingCollections = 404;
        } else {
          this.errorFetchingCollections = error;
        }
      } finally {
        this.loadingCollections = false;
      }
      return [];
    }
  }
});

/***/ }),

/***/ "./src/mixins/FilesByMonthMixin.js":
/*!*****************************************!*\
  !*** ./src/mixins/FilesByMonthMixin.js ***!
  \*****************************************/
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
  name: 'FilesByMonthMixin',
  computed: {
    /**
     * @return {Object<string, []>}
     */
    fileIdsByMonth() {
      const filesByMonth = {};
      for (const fileId of this.fetchedFileIds) {
        const file = this.files[fileId];
        if (file) {
          filesByMonth[file.month] = filesByMonth[file.month] ?? [];
          filesByMonth[file.month].push(file.fileid);
        }
      }

      // Sort files in sections.
      Object.keys(filesByMonth).forEach(month => filesByMonth[month].sort(this.sortFilesByTimestamp));
      return filesByMonth;
    },
    /**
     * @return {string[]}
     */
    monthsList() {
      return Object.keys(this.fileIdsByMonth).sort((month1, month2) => month1 > month2 ? -1 : 1);
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
    }
  }
});

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/AlbumPicker.vue?vue&type=style&index=0&id=0acbeb42&lang=scss&scoped=true&":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/AlbumPicker.vue?vue&type=style&index=0&id=0acbeb42&lang=scss&scoped=true& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, ".album-picker[data-v-0acbeb42] {\n  padding: 32px;\n  padding-top: 16px;\n}\n.album-picker h2[data-v-0acbeb42] {\n  display: flex;\n  align-items: center;\n  height: 60px;\n}\n.album-picker h2 .loading-icon[data-v-0acbeb42] {\n  margin-left: 32px;\n}\n.album-picker .albums-container[data-v-0acbeb42] {\n  min-height: 150px;\n  max-height: 350px;\n  overflow-x: scroll;\n  padding: 2px;\n}\n.album-picker .albums-container .album[data-v-0acbeb42] .list-item {\n  padding: 8px 16px;\n  box-sizing: border-box;\n}\n.album-picker .albums-container .album[data-v-0acbeb42]:not(:last-child) {\n  margin-bottom: 16px;\n}\n.album-picker .albums-container .album__image[data-v-0acbeb42] {\n  width: 40px;\n  height: 40px;\n  object-fit: none;\n  border-radius: var(--border-radius);\n}\n.album-picker .albums-container .album__image--placeholder[data-v-0acbeb42] {\n  background: var(--color-primary-element-light);\n}\n.album-picker .albums-container .album__image--placeholder[data-v-0acbeb42] .material-design-icon {\n  width: 100%;\n  height: 100%;\n}\n.album-picker .albums-container .album__image--placeholder[data-v-0acbeb42] .material-design-icon .material-design-icon__svg {\n  fill: var(--color-primary-element);\n}\n.album-picker .new-album-button[data-v-0acbeb42] {\n  margin-top: 32px;\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/Timeline.vue?vue&type=style&index=0&id=e945440a&lang=scss&scoped=true&":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/Timeline.vue?vue&type=style&index=0&id=e945440a&lang=scss&scoped=true& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, ".timeline[data-v-e945440a] {\n  display: flex;\n  flex-direction: column;\n}\n.timeline__header__left[data-v-e945440a] {\n  display: flex;\n  gap: 4px;\n}\n.timeline__heading[data-v-e945440a] {\n  padding: calc(var(--default-grid-baseline) * 4);\n  margin-bottom: 0px;\n  padding-bottom: 0px;\n}\n.timeline__file-list[data-v-e945440a] {\n  padding: 0 64px;\n}\n@media only screen and (max-width: 1200px) {\n.timeline__file-list[data-v-e945440a] {\n    padding: 0 4px;\n}\n}\n.timeline__file-list[data-v-e945440a] .files-list-viewer__section-header {\n  top: var(--photos-navigation-height);\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/AlbumPicker.vue?vue&type=style&index=0&id=0acbeb42&lang=scss&scoped=true&":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/AlbumPicker.vue?vue&type=style&index=0&id=0acbeb42&lang=scss&scoped=true& ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumPicker_vue_vue_type_style_index_0_id_0acbeb42_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../node_modules/css-loader/dist/cjs.js!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/dist/cjs.js!../../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AlbumPicker.vue?vue&type=style&index=0&id=0acbeb42&lang=scss&scoped=true& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/AlbumPicker.vue?vue&type=style&index=0&id=0acbeb42&lang=scss&scoped=true&");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumPicker_vue_vue_type_style_index_0_id_0acbeb42_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumPicker_vue_vue_type_style_index_0_id_0acbeb42_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumPicker_vue_vue_type_style_index_0_id_0acbeb42_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumPicker_vue_vue_type_style_index_0_id_0acbeb42_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/Timeline.vue?vue&type=style&index=0&id=e945440a&lang=scss&scoped=true&":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/Timeline.vue?vue&type=style&index=0&id=e945440a&lang=scss&scoped=true& ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Timeline_vue_vue_type_style_index_0_id_e945440a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Timeline.vue?vue&type=style&index=0&id=e945440a&lang=scss&scoped=true& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/Timeline.vue?vue&type=style&index=0&id=e945440a&lang=scss&scoped=true&");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Timeline_vue_vue_type_style_index_0_id_e945440a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Timeline_vue_vue_type_style_index_0_id_e945440a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Timeline_vue_vue_type_style_index_0_id_e945440a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Timeline_vue_vue_type_style_index_0_id_e945440a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/components/Actions/ActionDownload.vue":
/*!***************************************************!*\
  !*** ./src/components/Actions/ActionDownload.vue ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ActionDownload_vue_vue_type_template_id_1aefa300___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ActionDownload.vue?vue&type=template&id=1aefa300& */ "./src/components/Actions/ActionDownload.vue?vue&type=template&id=1aefa300&");
/* harmony import */ var _ActionDownload_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ActionDownload.vue?vue&type=script&lang=js& */ "./src/components/Actions/ActionDownload.vue?vue&type=script&lang=js&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _ActionDownload_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _ActionDownload_vue_vue_type_template_id_1aefa300___WEBPACK_IMPORTED_MODULE_0__.render,
  _ActionDownload_vue_vue_type_template_id_1aefa300___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/components/Actions/ActionDownload.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/components/Actions/ActionFavorite.vue":
/*!***************************************************!*\
  !*** ./src/components/Actions/ActionFavorite.vue ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ActionFavorite_vue_vue_type_template_id_607ef4d8___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ActionFavorite.vue?vue&type=template&id=607ef4d8& */ "./src/components/Actions/ActionFavorite.vue?vue&type=template&id=607ef4d8&");
/* harmony import */ var _ActionFavorite_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ActionFavorite.vue?vue&type=script&lang=js& */ "./src/components/Actions/ActionFavorite.vue?vue&type=script&lang=js&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _ActionFavorite_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _ActionFavorite_vue_vue_type_template_id_607ef4d8___WEBPACK_IMPORTED_MODULE_0__.render,
  _ActionFavorite_vue_vue_type_template_id_607ef4d8___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/components/Actions/ActionFavorite.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/components/Albums/AlbumPicker.vue":
/*!***********************************************!*\
  !*** ./src/components/Albums/AlbumPicker.vue ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _AlbumPicker_vue_vue_type_template_id_0acbeb42_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AlbumPicker.vue?vue&type=template&id=0acbeb42&scoped=true& */ "./src/components/Albums/AlbumPicker.vue?vue&type=template&id=0acbeb42&scoped=true&");
/* harmony import */ var _AlbumPicker_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AlbumPicker.vue?vue&type=script&lang=js& */ "./src/components/Albums/AlbumPicker.vue?vue&type=script&lang=js&");
/* harmony import */ var _AlbumPicker_vue_vue_type_style_index_0_id_0acbeb42_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AlbumPicker.vue?vue&type=style&index=0&id=0acbeb42&lang=scss&scoped=true& */ "./src/components/Albums/AlbumPicker.vue?vue&type=style&index=0&id=0acbeb42&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _AlbumPicker_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _AlbumPicker_vue_vue_type_template_id_0acbeb42_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render,
  _AlbumPicker_vue_vue_type_template_id_0acbeb42_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "0acbeb42",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/components/Albums/AlbumPicker.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/views/Timeline.vue":
/*!********************************!*\
  !*** ./src/views/Timeline.vue ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Timeline_vue_vue_type_template_id_e945440a_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Timeline.vue?vue&type=template&id=e945440a&scoped=true& */ "./src/views/Timeline.vue?vue&type=template&id=e945440a&scoped=true&");
/* harmony import */ var _Timeline_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Timeline.vue?vue&type=script&lang=js& */ "./src/views/Timeline.vue?vue&type=script&lang=js&");
/* harmony import */ var _Timeline_vue_vue_type_style_index_0_id_e945440a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Timeline.vue?vue&type=style&index=0&id=e945440a&lang=scss&scoped=true& */ "./src/views/Timeline.vue?vue&type=style&index=0&id=e945440a&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _Timeline_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _Timeline_vue_vue_type_template_id_e945440a_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render,
  _Timeline_vue_vue_type_template_id_e945440a_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "e945440a",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/views/Timeline.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/components/Actions/ActionDownload.vue?vue&type=script&lang=js&":
/*!****************************************************************************!*\
  !*** ./src/components/Actions/ActionDownload.vue?vue&type=script&lang=js& ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ActionDownload_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ActionDownload.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Actions/ActionDownload.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ActionDownload_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/components/Actions/ActionFavorite.vue?vue&type=script&lang=js&":
/*!****************************************************************************!*\
  !*** ./src/components/Actions/ActionFavorite.vue?vue&type=script&lang=js& ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ActionFavorite_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ActionFavorite.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Actions/ActionFavorite.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ActionFavorite_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/components/Albums/AlbumPicker.vue?vue&type=script&lang=js&":
/*!************************************************************************!*\
  !*** ./src/components/Albums/AlbumPicker.vue?vue&type=script&lang=js& ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumPicker_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AlbumPicker.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/AlbumPicker.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumPicker_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/views/Timeline.vue?vue&type=script&lang=js&":
/*!*********************************************************!*\
  !*** ./src/views/Timeline.vue?vue&type=script&lang=js& ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Timeline_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Timeline.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/Timeline.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Timeline_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/components/Actions/ActionDownload.vue?vue&type=template&id=1aefa300&":
/*!**********************************************************************************!*\
  !*** ./src/components/Actions/ActionDownload.vue?vue&type=template&id=1aefa300& ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_ActionDownload_vue_vue_type_template_id_1aefa300___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_ActionDownload_vue_vue_type_template_id_1aefa300___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_ActionDownload_vue_vue_type_template_id_1aefa300___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ActionDownload.vue?vue&type=template&id=1aefa300& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Actions/ActionDownload.vue?vue&type=template&id=1aefa300&");


/***/ }),

/***/ "./src/components/Actions/ActionFavorite.vue?vue&type=template&id=607ef4d8&":
/*!**********************************************************************************!*\
  !*** ./src/components/Actions/ActionFavorite.vue?vue&type=template&id=607ef4d8& ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_ActionFavorite_vue_vue_type_template_id_607ef4d8___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_ActionFavorite_vue_vue_type_template_id_607ef4d8___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_ActionFavorite_vue_vue_type_template_id_607ef4d8___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ActionFavorite.vue?vue&type=template&id=607ef4d8& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Actions/ActionFavorite.vue?vue&type=template&id=607ef4d8&");


/***/ }),

/***/ "./src/components/Albums/AlbumPicker.vue?vue&type=template&id=0acbeb42&scoped=true&":
/*!******************************************************************************************!*\
  !*** ./src/components/Albums/AlbumPicker.vue?vue&type=template&id=0acbeb42&scoped=true& ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumPicker_vue_vue_type_template_id_0acbeb42_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumPicker_vue_vue_type_template_id_0acbeb42_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumPicker_vue_vue_type_template_id_0acbeb42_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AlbumPicker.vue?vue&type=template&id=0acbeb42&scoped=true& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/AlbumPicker.vue?vue&type=template&id=0acbeb42&scoped=true&");


/***/ }),

/***/ "./src/views/Timeline.vue?vue&type=template&id=e945440a&scoped=true&":
/*!***************************************************************************!*\
  !*** ./src/views/Timeline.vue?vue&type=template&id=e945440a&scoped=true& ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Timeline_vue_vue_type_template_id_e945440a_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Timeline_vue_vue_type_template_id_e945440a_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Timeline_vue_vue_type_template_id_e945440a_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Timeline.vue?vue&type=template&id=e945440a&scoped=true& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/Timeline.vue?vue&type=template&id=e945440a&scoped=true&");


/***/ }),

/***/ "./src/components/Albums/AlbumPicker.vue?vue&type=style&index=0&id=0acbeb42&lang=scss&scoped=true&":
/*!*********************************************************************************************************!*\
  !*** ./src/components/Albums/AlbumPicker.vue?vue&type=style&index=0&id=0acbeb42&lang=scss&scoped=true& ***!
  \*********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumPicker_vue_vue_type_style_index_0_id_0acbeb42_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/style-loader/dist/cjs.js!../../../node_modules/css-loader/dist/cjs.js!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/dist/cjs.js!../../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AlbumPicker.vue?vue&type=style&index=0&id=0acbeb42&lang=scss&scoped=true& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/AlbumPicker.vue?vue&type=style&index=0&id=0acbeb42&lang=scss&scoped=true&");


/***/ }),

/***/ "./src/views/Timeline.vue?vue&type=style&index=0&id=e945440a&lang=scss&scoped=true&":
/*!******************************************************************************************!*\
  !*** ./src/views/Timeline.vue?vue&type=style&index=0&id=e945440a&lang=scss&scoped=true& ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Timeline_vue_vue_type_style_index_0_id_e945440a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/style-loader/dist/cjs.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Timeline.vue?vue&type=style&index=0&id=e945440a&lang=scss&scoped=true& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/Timeline.vue?vue&type=style&index=0&id=e945440a&lang=scss&scoped=true&");


/***/ })

}]);
//# sourceMappingURL=photos-src_views_Timeline_vue.js.map?v=081033a4818e771cb09c