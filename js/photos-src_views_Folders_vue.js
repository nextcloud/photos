(self["webpackChunkphotos"] = self["webpackChunkphotos"] || []).push([["src_views_Folders_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FileLegacy.vue?vue&type=script&lang=js&":
/*!********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FileLegacy.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/router */ "./node_modules/@nextcloud/router/dist/index.js");
/* harmony import */ var _mixins_UserConfig_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../mixins/UserConfig.js */ "./src/mixins/UserConfig.js");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'FileLegacy',
  mixins: [_mixins_UserConfig_js__WEBPACK_IMPORTED_MODULE_1__["default"]],
  inheritAttrs: false,
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loaded: false,
      error: false
    };
  },
  computed: {
    ariaUuid() {
      return `image-${this.item.injected.fileid}`;
    },
    ariaLabel() {
      return t('photos', 'Open the full size "{name}" image', {
        name: this.item.injected.basename
      });
    },
    isImage() {
      return this.item.injected.mime.startsWith('image');
    },
    decodedEtag() {
      return this.item.injected.etag.replace('&quot;', '').replace('&quot;', '');
    },
    src() {
      return (0,_nextcloud_router__WEBPACK_IMPORTED_MODULE_0__.generateUrl)(`/core/preview?fileId=${this.item.injected.fileid}&c=${this.decodedEtag}&x=${250}&y=${250}&forceIcon=0&a=${this.croppedLayout ? '0' : '1'}`);
    }
  },
  beforeDestroy() {
    // cancel any pending load
    this.$refs.src = '';
  },
  methods: {
    openViewer() {
      OCA.Viewer.open({
        fileInfo: this.item.injected,
        list: this.item.injected.list,
        loadMore: this.item.injected.loadMore ? async () => await this.item.injected.loadMore(true) : () => [],
        canLoop: this.item.injected.canLoop
      });
    },
    /** When the image is fully loaded by browser we remove the placeholder */
    onLoad() {
      this.loaded = true;
    },
    onError() {
      this.error = true;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Folder.vue?vue&type=script&lang=js&":
/*!****************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Folder.vue?vue&type=script&lang=js& ***!
  \****************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _nextcloud_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/auth */ "./node_modules/@nextcloud/auth/dist/index.es.mjs");
/* harmony import */ var _FolderTagPreview_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FolderTagPreview.vue */ "./src/components/FolderTagPreview.vue");
/* harmony import */ var _services_AlbumContent_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/AlbumContent.js */ "./src/services/AlbumContent.js");
/* harmony import */ var _mixins_AbortControllerMixin_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../mixins/AbortControllerMixin.js */ "./src/mixins/AbortControllerMixin.js");





/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'Folder',
  components: {
    FolderTagPreview: _FolderTagPreview_vue__WEBPACK_IMPORTED_MODULE_1__["default"]
  },
  mixins: [_mixins_AbortControllerMixin_js__WEBPACK_IMPORTED_MODULE_3__["default"]],
  inheritAttrs: false,
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      previewFolder: this.item.injected.fileid
    };
  },
  computed: {
    // global lists
    ...(0,vuex__WEBPACK_IMPORTED_MODULE_4__.mapGetters)(['files', 'folders']),
    // files list of the current folder
    folderContent() {
      return this.folders[this.item.injected.fileid];
    },
    previewFiles() {
      const previewFolderContent = this.folders[this.previewFolder];
      const previewFiles = previewFolderContent ? previewFolderContent.map(id => this.files[id]).slice(0, 4) // only get the 4 first images
      : [];

      // If we didn't found any previews in the folder we try the next subfolder
      // We limit to one subfolder for performance concerns
      if (previewFiles.length === 0 && this.files[this.previewFolder].folders && this.previewFolder === this.item.injected.fileid) {
        const firstChildFolder = this.files[this.previewFolder].folders[0];
        this.updatePreviewFolder(firstChildFolder);
        if (!this.folders[this.previewFolder]) {
          this.getFolderData(this.files[this.previewFolder].filename);
        }
      }
      return previewFiles;
    }
  },
  async created() {
    if (!this.folderContent) {
      await this.getFolderData(this.item.injected.filename);
    }
  },
  methods: {
    async getFolderData(filename) {
      try {
        // Remove leading /file/{userId}
        const prefix = `/files/${(0,_nextcloud_auth__WEBPACK_IMPORTED_MODULE_0__.getCurrentUser)()?.uid}`;
        const unPrefixedFileName = filename.replace(new RegExp(`^${prefix}`), '');

        // get data
        const {
          folder,
          folders,
          files
        } = await (0,_services_AlbumContent_js__WEBPACK_IMPORTED_MODULE_2__["default"])(unPrefixedFileName, {
          shared: this.item.injected.showShared,
          signal: this.abortController.signal
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
          console.error('Failed to get folder content', filename, error.response);
        }
      }
    },
    updatePreviewFolder(path) {
      this.previewFolder = path;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FolderTagPreview.vue?vue&type=script&lang=js&":
/*!**************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FolderTagPreview.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/router */ "./node_modules/@nextcloud/router/dist/index.js");
/* harmony import */ var _nextcloud_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/auth */ "./node_modules/@nextcloud/auth/dist/index.es.mjs");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'FolderTagPreview',
  props: {
    icon: {
      type: String,
      default: 'icon-folder'
    },
    id: {
      type: [Number, String],
      required: true
    },
    name: {
      type: String,
      required: true
    },
    path: {
      type: String,
      default: ''
    },
    fileList: {
      type: Array,
      default: () => []
    },
    to: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      loaded: false,
      failed: []
    };
  },
  computed: {
    // folder is empty
    isEmpty() {
      return this.previewList.length === 0;
    },
    ariaUuid() {
      return `folder-${this.id}`;
    },
    ariaLabel() {
      return t('photos', 'Open the "{name}" sub-directory', {
        name: this.name
      });
    },
    /**
     * Previews list without the failed ones
     *
     * @return {object[]} the previews fileinfo
     */
    previewList() {
      return this.fileList.filter(file => this.failed.indexOf(file.fileid) === -1);
    },
    /**
     * We do not want encoded slashes when browsing by folder
     * so we generate a new valid route object based on the
     * current named route, get the final url back, decode it
     * and use it as a direct string.
     * Which vue-router does not encode afterwards!
     *
     * @return {string}
     */
    toLink() {
      if (this.to) {
        return this.to;
      }

      // Remove leading /file/{userId}
      const prefix = `/files/${(0,_nextcloud_auth__WEBPACK_IMPORTED_MODULE_1__.getCurrentUser)()?.uid}`;
      let path = this.path.replace(new RegExp(`^${prefix}`), '');

      // always remove first slash, the router
      // manage it automatically
      const regex = /^\/?(.+)/i;
      path = regex.exec(path)[1];

      // apply to current route
      return Object.assign({}, this.$route, {
        params: {
          path: path.split('/')
        }
      });
    }
  },
  methods: {
    generateImgSrc(_ref) {
      let {
        fileid,
        etag
      } = _ref;
      // use etag to force cache reload if file changed
      return (0,_nextcloud_router__WEBPACK_IMPORTED_MODULE_0__.generateUrl)(`/core/preview?fileId=${fileid}&c=${etag}&x=${250}&y=${250}&forceIcon=0&a=0`);
    },
    onPreviewFail(_ref2) {
      let {
        fileid
      } = _ref2;
      this.failed.push(fileid);
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/Folders.vue?vue&type=script&lang=js&":
/*!************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/Folders.vue?vue&type=script&lang=js& ***!
  \************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _nextcloud_upload__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/upload */ "./node_modules/@nextcloud/upload/dist/index.esm.js");
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/vue */ "./node_modules/@nextcloud/vue/dist/index.mjs");
/* harmony import */ var vue_virtual_grid__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vue-virtual-grid */ "./node_modules/vue-virtual-grid/dist/vue-virtual-grid.es.js");
/* harmony import */ var _components_FileLegacy_vue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/FileLegacy.vue */ "./src/components/FileLegacy.vue");
/* harmony import */ var _components_Folder_vue__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/Folder.vue */ "./src/components/Folder.vue");
/* harmony import */ var _components_HeaderNavigation_vue__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../components/HeaderNavigation.vue */ "./src/components/HeaderNavigation.vue");
/* harmony import */ var _services_DavClient_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../services/DavClient.js */ "./src/services/DavClient.js");
/* harmony import */ var _services_AllowedMimes_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../services/AllowedMimes.js */ "./src/services/AllowedMimes.js");
/* harmony import */ var _services_AlbumContent_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../services/AlbumContent.js */ "./src/services/AlbumContent.js");
/* harmony import */ var _mixins_AbortControllerMixin_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../mixins/AbortControllerMixin.js */ "./src/mixins/AbortControllerMixin.js");
/* harmony import */ var _mixins_GridConfig_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../mixins/GridConfig.js */ "./src/mixins/GridConfig.js");
/* harmony import */ var _services_FileInfo_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../services/FileInfo.js */ "./src/services/FileInfo.js");













/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'Folders',
  components: {
    VirtualGrid: vue_virtual_grid__WEBPACK_IMPORTED_MODULE_2__["default"],
    HeaderNavigation: _components_HeaderNavigation_vue__WEBPACK_IMPORTED_MODULE_5__["default"],
    NcEmptyContent: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_1__.NcEmptyContent,
    UploadPicker: _nextcloud_upload__WEBPACK_IMPORTED_MODULE_0__.UploadPicker
  },
  mixins: [_mixins_AbortControllerMixin_js__WEBPACK_IMPORTED_MODULE_9__["default"], _mixins_GridConfig_js__WEBPACK_IMPORTED_MODULE_10__["default"]],
  props: {
    rootTitle: {
      type: String,
      required: true
    },
    path: {
      type: String,
      default: '/'
    },
    showShared: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      error: null,
      allowedMimes: _services_AllowedMimes_js__WEBPACK_IMPORTED_MODULE_7__["default"],
      initializing: true,
      loading: false,
      appContent: document.getElementById('app-content-vue'),
      uploader: (0,_nextcloud_upload__WEBPACK_IMPORTED_MODULE_0__.getUploader)()
    };
  },
  computed: {
    // global lists
    ...(0,vuex__WEBPACK_IMPORTED_MODULE_12__.mapGetters)(['files', 'folders']),
    // current folder id from current path
    folderId() {
      return this.$store.getters.folderId(this.path);
    },
    // files list of the current folder
    folder() {
      return this.files[this.folderId];
    },
    folderContent() {
      return this.folders[this.folderId];
    },
    fileList() {
      const list = this.folderContent && this.folderContent.map(id => this.files[id]).filter(file => !!file);
      return list;
    },
    // subfolders of the current folder
    subFolders() {
      return this.folderId && this.files[this.folderId] && this.files[this.folderId].folders;
    },
    folderList() {
      const list = this.subFolders && this.subFolders.map(id => this.files[id]).filter(file => !!file);
      return list;
    },
    contentList() {
      const folders = this.folderList?.map(folder => {
        return {
          id: `folder-${folder.fileid}`,
          injected: {
            ...folder,
            showShared: this.showShared
          },
          width: 256,
          height: 256,
          columnSpan: 1,
          renderComponent: _components_Folder_vue__WEBPACK_IMPORTED_MODULE_4__["default"]
        };
      });
      const files = this.fileList?.map(file => {
        return {
          id: `file-${file.fileid}`,
          injected: {
            ...file,
            list: this.fileList
          },
          width: 256,
          height: 256,
          columnSpan: 1,
          renderComponent: _components_FileLegacy_vue__WEBPACK_IMPORTED_MODULE_3__["default"]
        };
      });
      return [...(folders || []), ...(files || [])];
    },
    // is current folder empty?
    isEmpty() {
      return !this.haveFiles && !this.haveFolders;
    },
    haveFiles() {
      return !!this.fileList && this.fileList.length !== 0;
    },
    haveFolders() {
      return !!this.folderList && this.folderList.length !== 0;
    }
  },
  watch: {
    path() {
      this.fetchFolderContent();
    },
    showShared() {
      this.fetchFolderContent();
    }
  },
  beforeMount() {
    this.fetchFolderContent();
  },
  methods: {
    onRefresh() {
      this.fetchFolderContent();
    },
    async fetchFolderContent() {
      this.error = null;
      this.loading = true;

      // close any potential opened viewer & sidebar
      OCA?.Viewer?.close?.();
      OCA?.Files?.Sidebar?.close?.();

      // if we don't already have some cached data let's show a loader
      if (!this.files[this.folderId] || !this.folders[this.folderId]) {
        this.initializing = true;
      }
      try {
        // get content and current folder info
        const {
          folder,
          folders,
          files
        } = await (0,_services_AlbumContent_js__WEBPACK_IMPORTED_MODULE_8__["default"])(this.path, {
          shared: this.showShared,
          signal: this.abortController.signal
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
        }
        // cancelled request, moving on...
        console.error('Error fetching album data', error);
      } finally {
        // done loading even with errors
        this.loading = false;
        this.initializing = false;
      }
    },
    /**
     * Fetch file Info and add them into the store
     *
     * @param {Upload[]} uploads the newly uploaded files
     */
    onUpload(uploads) {
      uploads.forEach(async upload => {
        const relPath = upload.path.split(_services_DavClient_js__WEBPACK_IMPORTED_MODULE_6__.prefixPath).pop();
        const file = await (0,_services_FileInfo_js__WEBPACK_IMPORTED_MODULE_11__["default"])(relPath);
        this.$store.dispatch('appendFiles', [file]);
        this.$store.dispatch('addFilesToFolder', {
          fileid: this.folderId,
          files: [file]
        });
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FileLegacy.vue?vue&type=template&id=0fd72815&scoped=true&":
/*!*******************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FileLegacy.vue?vue&type=template&id=0fd72815&scoped=true& ***!
  \*******************************************************************************************************************************************************************************************************************************************************************/
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
  return _c("a", {
    staticClass: "file",
    class: {
      "file--cropped": _vm.croppedLayout
    },
    attrs: {
      href: _vm.item.injected.source,
      "aria-label": _vm.ariaLabel
    },
    on: {
      click: function ($event) {
        $event.preventDefault();
        return _vm.openViewer.apply(null, arguments);
      }
    }
  }, [_vm.item.injected.mime.includes("video") && _vm.item.injected.hasPreview ? _c("div", {
    staticClass: "icon-video-white"
  }) : _vm._e(), _vm._v(" "), _c("transition-group", {
    staticClass: "transition-group",
    attrs: {
      name: "fade"
    }
  }, [!_vm.error ? _c("img", {
    key: `${_vm.item.injected.basename}-img`,
    ref: "img",
    attrs: {
      src: _vm.src,
      alt: _vm.item.injected.basename,
      "aria-describedby": _vm.ariaUuid
    },
    on: {
      load: _vm.onLoad,
      error: _vm.onError
    }
  }) : _vm._e(), _vm._v(" "), !_vm.loaded || _vm.error ? _c("svg", {
    key: `${_vm.item.injected.basename}-svg`,
    attrs: {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 32 32",
      fill: "url(#placeholder__gradient)"
    }
  }, [_vm.isImage ? _c("use", {
    attrs: {
      href: "#placeholder--img"
    }
  }) : _c("use", {
    attrs: {
      href: "#placeholder--video"
    }
  })]) : _vm._e()]), _vm._v(" "), _c("p", {
    staticClass: "hidden-visually",
    attrs: {
      id: _vm.ariaUuid
    }
  }, [_vm._v(_vm._s(_vm.item.injected.basename))]), _vm._v(" "), _c("div", {
    staticClass: "cover",
    attrs: {
      role: "none"
    }
  })], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Folder.vue?vue&type=template&id=8ab848c4&scoped=true&":
/*!***************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Folder.vue?vue&type=template&id=8ab848c4&scoped=true& ***!
  \***************************************************************************************************************************************************************************************************************************************************************/
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
  return _c("FolderTagPreview", {
    attrs: {
      id: _vm.item.injected.fileid,
      name: _vm.item.injected.basename.toString(),
      path: _vm.item.injected.filename,
      "file-list": _vm.previewFiles
    }
  });
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FolderTagPreview.vue?vue&type=template&id=77915c0c&scoped=true&":
/*!*************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FolderTagPreview.vue?vue&type=template&id=77915c0c&scoped=true& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************/
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
  return _c("router-link", {
    staticClass: "folder",
    class: {
      "folder--clear": _vm.isEmpty
    },
    attrs: {
      to: _vm.toLink,
      "aria-label": _vm.ariaLabel
    }
  }, [_c("transition", {
    attrs: {
      name: "fade"
    }
  }, [_c("div", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.loaded,
      expression: "loaded"
    }],
    staticClass: "folder-content",
    class: `folder-content--grid-${_vm.previewList.length}`,
    attrs: {
      role: "none"
    }
  }, _vm._l(_vm.previewList, function (file) {
    return _c("img", {
      key: file.fileid,
      attrs: {
        src: _vm.generateImgSrc(file),
        alt: ""
      },
      on: {
        load: function ($event) {
          _vm.loaded = true;
        },
        error: function ($event) {
          return _vm.onPreviewFail(file);
        }
      }
    });
  }), 0)]), _vm._v(" "), _c("div", {
    staticClass: "folder-name"
  }, [_c("span", {
    staticClass: "folder-name__icon",
    class: [!_vm.isEmpty ? "icon-white" : "icon-dark", _vm.icon],
    attrs: {
      role: "img"
    }
  }), _vm._v(" "), _c("p", {
    staticClass: "folder-name__name",
    attrs: {
      id: _vm.ariaUuid
    }
  }, [_vm._v("\n\t\t\t" + _vm._s(_vm.name) + "\n\t\t")])]), _vm._v(" "), _c("div", {
    staticClass: "cover",
    attrs: {
      role: "none"
    }
  })], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/Folders.vue?vue&type=template&id=d4b5440a&scoped=true&":
/*!***********************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/Folders.vue?vue&type=template&id=d4b5440a&scoped=true& ***!
  \***********************************************************************************************************************************************************************************************************************************************************/
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
  return _vm.error === 404 ? _c("NcEmptyContent", {
    attrs: {
      "illustration-name": "folder"
    }
  }, [_vm._v("\n\t" + _vm._s(_vm.t("photos", "This folder does not exist")) + "\n")]) : _vm.error ? _c("NcEmptyContent", [_vm._v("\n\t" + _vm._s(_vm.t("photos", "An error occurred")) + "\n")]) : _vm.initializing ? _c("NcEmptyContent", {
    attrs: {
      icon: "icon-loading"
    }
  }, [_vm._v("\n\t" + _vm._s(_vm.t("photos", "Loading folders …")) + "\n")]) : !_vm.initializing ? _c("div", [_c("HeaderNavigation", {
    key: "navigation",
    class: {
      "photos-navigation--uploading": _vm.uploader.queue?.length > 0
    },
    attrs: {
      loading: _vm.loading,
      path: _vm.path,
      title: _vm.folder.basename.toString(),
      "root-title": _vm.rootTitle
    },
    on: {
      refresh: _vm.onRefresh
    }
  }, [_c("UploadPicker", {
    attrs: {
      accept: _vm.allowedMimes,
      destination: _vm.path,
      multiple: true
    },
    on: {
      uploaded: _vm.onUpload
    }
  })], 1), _vm._v(" "), _vm.isEmpty ? _c("NcEmptyContent", {
    key: "emptycontent",
    attrs: {
      "illustration-name": "empty"
    }
  }, [_vm._v("\n\t\t" + _vm._s(_vm.t("photos", "No photos in here")) + "\n\t")]) : _c("div", {
    staticClass: "grid-container"
  }, [_c("VirtualGrid", {
    ref: "virtualgrid",
    attrs: {
      items: _vm.contentList,
      "scroll-element": _vm.appContent,
      "get-column-count": () => _vm.gridConfig.count,
      "get-grid-gap": () => _vm.gridConfig.gap
    }
  })], 1)], 1) : _vm._e();
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./src/assets/grid-sizes.js":
/*!**********************************!*\
  !*** ./src/assets/grid-sizes.js ***!
  \**********************************/
/***/ ((module) => {

/**
 * @copyright Copyright (c) 2018 John Molakvoæ <skjnldsv@protonmail.com>
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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

// for now we want to keep the same gap everywhere
const gap = 8;

/**
 * Define the max width proportions
 * The number (key) indicate the MAX size
 *
 * needs to be compatible with webpack config
 * so no export default {}
 */
module.exports = {
  sizes: {
    400: {
      marginTop: 66,
      marginW: gap,
      count: 3,
      gap
    },
    700: {
      marginTop: 66,
      marginW: gap,
      count: 4,
      gap
    },
    1024: {
      marginTop: 66,
      marginW: 44,
      count: 5,
      gap
    },
    1280: {
      marginTop: 66,
      marginW: 44,
      count: 4,
      gap
    },
    1440: {
      marginTop: 88,
      marginW: 66,
      count: 5,
      gap
    },
    1600: {
      marginTop: 88,
      marginW: 66,
      count: 6,
      gap
    },
    2048: {
      marginTop: 88,
      marginW: 66,
      count: 7,
      gap
    },
    2560: {
      marginTop: 88,
      marginW: 88,
      count: 8,
      gap
    },
    3440: {
      marginTop: 88,
      marginW: 88,
      count: 9,
      gap
    },
    max: {
      marginTop: 88,
      marginW: 88,
      count: 10,
      gap
    }
  }
};

/***/ }),

/***/ "./src/mixins/GridConfig.js":
/*!**********************************!*\
  !*** ./src/mixins/GridConfig.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _services_GridConfig_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/GridConfig.js */ "./src/services/GridConfig.js");
/**
 * @copyright Copyright (c) 2018 John Molakvoæ <skjnldsv@protonmail.com>
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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */



/**
 * Get the current used grid config
 */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  data() {
    return {
      gridConfig: {}
    };
  },
  created() {
    _services_GridConfig_js__WEBPACK_IMPORTED_MODULE_0__["default"].$on('changed', val => {
      this.gridConfig = val;
    });
    console.debug(`[${"photos"}]`, 'Grid config', Object.assign({}, _services_GridConfig_js__WEBPACK_IMPORTED_MODULE_0__["default"].gridConfig));
    this.gridConfig = _services_GridConfig_js__WEBPACK_IMPORTED_MODULE_0__["default"].gridConfig;
  },
  beforeDestroy() {
    _services_GridConfig_js__WEBPACK_IMPORTED_MODULE_0__["default"].$off('changed', this.gridConfig);
  }
});

/***/ }),

/***/ "./src/mixins/UserConfig.js":
/*!**********************************!*\
  !*** ./src/mixins/UserConfig.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _nextcloud_event_bus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/event-bus */ "./node_modules/@nextcloud/event-bus/dist/index.mjs");
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/router */ "./node_modules/@nextcloud/router/dist/index.js");
/* harmony import */ var _nextcloud_initial_state__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @nextcloud/initial-state */ "./node_modules/@nextcloud/initial-state/dist/index.es.mjs");
/* harmony import */ var _nextcloud_axios__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @nextcloud/axios */ "./node_modules/@nextcloud/axios/dist/index.esm.js");
/**
 * @copyright Copyright (c) 2020 John Molakvoæ <skjnldsv@protonmail.com>
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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */





const eventName = 'photos:user-config-changed';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  data() {
    const croppedLayoutLocalStorage = localStorage.getItem('photos:croppedLayout');
    return {
      croppedLayout: croppedLayoutLocalStorage !== null ? croppedLayoutLocalStorage === 'true' : (0,_nextcloud_initial_state__WEBPACK_IMPORTED_MODULE_2__.loadState)('photos', 'croppedLayout', 'false') === 'true',
      photosLocation: (0,_nextcloud_initial_state__WEBPACK_IMPORTED_MODULE_2__.loadState)('photos', 'photosLocation', '')
    };
  },
  created() {
    (0,_nextcloud_event_bus__WEBPACK_IMPORTED_MODULE_0__.subscribe)(eventName, this.updateLocalSetting);
  },
  beforeDestroy() {
    (0,_nextcloud_event_bus__WEBPACK_IMPORTED_MODULE_0__.unsubscribe)(eventName, this.updateLocalSetting);
  },
  methods: {
    updateLocalSetting(_ref) {
      let {
        setting,
        value
      } = _ref;
      this[setting] = value;
    },
    updateSetting(setting) {
      const value = this[setting];
      // Long time save setting
      _nextcloud_axios__WEBPACK_IMPORTED_MODULE_3__["default"].put((0,_nextcloud_router__WEBPACK_IMPORTED_MODULE_1__.generateUrl)('apps/photos/api/v1/config/' + setting), {
        value: value.toString()
      });
      // Current session save setting
      localStorage.setItem('photos:' + setting, value);
      // Visible elements update setting
      (0,_nextcloud_event_bus__WEBPACK_IMPORTED_MODULE_0__.emit)(eventName, {
        setting,
        value
      });
    }
  }
});

/***/ }),

/***/ "./src/services/AlbumContent.js":
/*!**************************************!*\
  !*** ./src/services/AlbumContent.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _nextcloud_axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/axios */ "./node_modules/@nextcloud/axios/dist/index.esm.js");
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/router */ "./node_modules/@nextcloud/router/dist/index.js");
/* harmony import */ var _utils_fileUtils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/fileUtils.js */ "./src/utils/fileUtils.js");
/* harmony import */ var _AllowedMimes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./AllowedMimes.js */ "./src/services/AllowedMimes.js");
/* harmony import */ var _nextcloud_auth__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @nextcloud/auth */ "./node_modules/@nextcloud/auth/dist/index.es.mjs");
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
 * @return {Promise<object[]>} the file list
 */
/* harmony default export */ async function __WEBPACK_DEFAULT_EXPORT__() {
  let path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/';
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const endpoint = (0,_nextcloud_router__WEBPACK_IMPORTED_MODULE_1__.generateUrl)(`/apps/photos/api/v1/${options.shared ? 'shared' : 'albums'}`);
  const prefix = `/files/${(0,_nextcloud_auth__WEBPACK_IMPORTED_MODULE_4__.getCurrentUser)()?.uid}`;

  // fetch listing
  const response = await _nextcloud_axios__WEBPACK_IMPORTED_MODULE_0__["default"].get(endpoint + (0,_utils_fileUtils_js__WEBPACK_IMPORTED_MODULE_2__.encodeFilePath)(path), options);
  const list = response.data.map(data => ({
    ...data,
    filename: `${prefix}${data.filename}`
  })).map(data => (0,_utils_fileUtils_js__WEBPACK_IMPORTED_MODULE_2__.genFileInfo)(data));

  // filter all the files and folders
  let folder = {};
  const folders = [];
  const files = [];
  for (const entry of list) {
    // is this the current provided path ?
    if (entry.filename === `${prefix}${path}`) {
      folder = entry;
    } else if (entry.type !== 'file') {
      folders.push(entry);
    } else if (_AllowedMimes_js__WEBPACK_IMPORTED_MODULE_3__["default"].indexOf(entry.mime) > -1) {
      files.push(entry);
    }
  }

  // return current folder, subfolders and files
  return {
    folder,
    folders,
    files
  };
}

/***/ }),

/***/ "./src/services/FileInfo.js":
/*!**********************************!*\
  !*** ./src/services/FileInfo.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _DavClient_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DavClient.js */ "./src/services/DavClient.js");
/* harmony import */ var _DavRequest_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DavRequest.js */ "./src/services/DavRequest.js");
/* harmony import */ var _utils_fileUtils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/fileUtils.js */ "./src/utils/fileUtils.js");
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
 * Get a file info
 *
 * @param {string} path the path relative to the user root
 * @return {FileInfo} the file info
 */
/* harmony default export */ async function __WEBPACK_DEFAULT_EXPORT__(path) {
  // getDirectoryContents doesn't accept / for root
  const fixedPath = path === '/' ? '' : path;

  // fetch listing
  const response = await _DavClient_js__WEBPACK_IMPORTED_MODULE_0__["default"].stat(_DavClient_js__WEBPACK_IMPORTED_MODULE_0__.prefixPath + fixedPath, {
    data: _DavRequest_js__WEBPACK_IMPORTED_MODULE_1__["default"],
    details: true
  });
  return (0,_utils_fileUtils_js__WEBPACK_IMPORTED_MODULE_2__.genFileInfo)(response.data);
}

/***/ }),

/***/ "./src/services/GridConfig.js":
/*!************************************!*\
  !*** ./src/services/GridConfig.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm.js");
/* harmony import */ var _assets_grid_sizes_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../assets/grid-sizes.js */ "./src/assets/grid-sizes.js");
/* harmony import */ var _assets_grid_sizes_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_assets_grid_sizes_js__WEBPACK_IMPORTED_MODULE_0__);
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



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new vue__WEBPACK_IMPORTED_MODULE_1__["default"]({
  data() {
    return {
      gridConfig: _assets_grid_sizes_js__WEBPACK_IMPORTED_MODULE_0__.sizes.max
    };
  },
  watch: {
    gridConfig(val) {
      this.$emit('changed', val);
    }
  },
  created() {
    window.addEventListener('resize', this.handleWindowResize);
    this.handleWindowResize();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleWindowResize);
  },
  methods: {
    handleWindowResize() {
      // find the first grid size that fit the current window width
      const currentSize = Object.keys(_assets_grid_sizes_js__WEBPACK_IMPORTED_MODULE_0__.sizes).find(size => size > document.documentElement.clientWidth);
      this.gridConfig = _assets_grid_sizes_js__WEBPACK_IMPORTED_MODULE_0__.sizes[currentSize] || _assets_grid_sizes_js__WEBPACK_IMPORTED_MODULE_0__.sizes.max;
    }
  }
}));

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FileLegacy.vue?vue&type=style&index=0&id=0fd72815&lang=scss&scoped=true&":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FileLegacy.vue?vue&type=style&index=0&id=0fd72815&lang=scss&scoped=true& ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, "@charset \"UTF-8\";\n/**\n * @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>\n *\n * @author John Molakvoæ <skjnldsv@protonmail.com>\n *\n * @license AGPL-3.0-or-later\n *\n * This program is free software: you can redistribute it and/or modify\n * it under the terms of the GNU Affero General Public License as\n * published by the Free Software Foundation, either version 3 of the\n * License, or (at your option) any later version.\n *\n * This program is distributed in the hope that it will be useful,\n * but WITHOUT ANY WARRANTY; without even the implied warranty of\n * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the\n * GNU Affero General Public License for more details.\n *\n * You should have received a copy of the GNU Affero General Public License\n * along with this program. If not, see <http://www.gnu.org/licenses/>.\n *\n */\n.file[data-v-0fd72815],\n.folder[data-v-0fd72815] {\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  -webkit-user-select: none;\n          user-select: none;\n  border-radius: var(--border-radius);\n  overflow: hidden;\n}\n.file .cover[data-v-0fd72815],\n.folder .cover[data-v-0fd72815] {\n  z-index: 2;\n  width: 100%;\n  padding-bottom: 100%;\n  transition: opacity var(--animation-quick) ease-in-out;\n  opacity: 0;\n  background-color: var(--color-main-text);\n}\n.file.active .cover[data-v-0fd72815], .file:active .cover[data-v-0fd72815], .file:hover .cover[data-v-0fd72815], .file:focus .cover[data-v-0fd72815],\n.folder.active .cover[data-v-0fd72815],\n.folder:active .cover[data-v-0fd72815],\n.folder:hover .cover[data-v-0fd72815],\n.folder:focus .cover[data-v-0fd72815] {\n  opacity: 0.3;\n}\n.file--clear.active .cover[data-v-0fd72815], .file--clear:active .cover[data-v-0fd72815], .file--clear:hover .cover[data-v-0fd72815], .file--clear:focus .cover[data-v-0fd72815],\n.folder--clear.active .cover[data-v-0fd72815],\n.folder--clear:active .cover[data-v-0fd72815],\n.folder--clear:hover .cover[data-v-0fd72815],\n.folder--clear:focus .cover[data-v-0fd72815] {\n  opacity: 0.1;\n}\n.fade-enter-active[data-v-0fd72815], .fade-leave-active[data-v-0fd72815] {\n  transition: opacity var(--animation-quick) ease-in-out;\n}\n.fade-enter[data-v-0fd72815], .fade-leave-to[data-v-0fd72815] {\n  opacity: 0;\n}\n.transition-group[data-v-0fd72815] {\n  display: contents;\n}\n.icon-video-white[data-v-0fd72815] {\n  position: absolute;\n  top: 10px;\n  right: 10px;\n  z-index: 20;\n}\nimg[data-v-0fd72815] {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  z-index: 10;\n  color: transparent;\n  object-fit: contain;\n}\n.file--cropped img[data-v-0fd72815] {\n  object-fit: cover;\n}\nsvg[data-v-0fd72815] {\n  position: absolute;\n  width: 70%;\n  height: 70%;\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Folder.vue?vue&type=style&index=0&id=8ab848c4&lang=scss&scoped=true&":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Folder.vue?vue&type=style&index=0&id=8ab848c4&lang=scss&scoped=true& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, "@charset \"UTF-8\";\n/**\n * @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>\n *\n * @author John Molakvoæ <skjnldsv@protonmail.com>\n *\n * @license AGPL-3.0-or-later\n *\n * This program is free software: you can redistribute it and/or modify\n * it under the terms of the GNU Affero General Public License as\n * published by the Free Software Foundation, either version 3 of the\n * License, or (at your option) any later version.\n *\n * This program is distributed in the hope that it will be useful,\n * but WITHOUT ANY WARRANTY; without even the implied warranty of\n * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the\n * GNU Affero General Public License for more details.\n *\n * You should have received a copy of the GNU Affero General Public License\n * along with this program. If not, see <http://www.gnu.org/licenses/>.\n *\n */\n.file[data-v-8ab848c4],\n.folder[data-v-8ab848c4] {\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  -webkit-user-select: none;\n          user-select: none;\n  border-radius: var(--border-radius);\n  overflow: hidden;\n}\n.file .cover[data-v-8ab848c4],\n.folder .cover[data-v-8ab848c4] {\n  z-index: 2;\n  width: 100%;\n  padding-bottom: 100%;\n  transition: opacity var(--animation-quick) ease-in-out;\n  opacity: 0;\n  background-color: var(--color-main-text);\n}\n.file.active .cover[data-v-8ab848c4], .file:active .cover[data-v-8ab848c4], .file:hover .cover[data-v-8ab848c4], .file:focus .cover[data-v-8ab848c4],\n.folder.active .cover[data-v-8ab848c4],\n.folder:active .cover[data-v-8ab848c4],\n.folder:hover .cover[data-v-8ab848c4],\n.folder:focus .cover[data-v-8ab848c4] {\n  opacity: 0.3;\n}\n.file--clear.active .cover[data-v-8ab848c4], .file--clear:active .cover[data-v-8ab848c4], .file--clear:hover .cover[data-v-8ab848c4], .file--clear:focus .cover[data-v-8ab848c4],\n.folder--clear.active .cover[data-v-8ab848c4],\n.folder--clear:active .cover[data-v-8ab848c4],\n.folder--clear:hover .cover[data-v-8ab848c4],\n.folder--clear:focus .cover[data-v-8ab848c4] {\n  opacity: 0.1;\n}\n.fade-enter-active[data-v-8ab848c4], .fade-leave-active[data-v-8ab848c4] {\n  transition: opacity var(--animation-quick) ease-in-out;\n}\n.fade-enter[data-v-8ab848c4], .fade-leave-to[data-v-8ab848c4] {\n  opacity: 0;\n}\n.folder-content[data-v-8ab848c4] {\n  position: absolute;\n  display: grid;\n  width: 100%;\n  height: 100%;\n}\n.folder-content--grid-1[data-v-8ab848c4] {\n  grid-template-columns: 1fr;\n  grid-template-rows: 1fr;\n}\n.folder-content--grid-2[data-v-8ab848c4] {\n  grid-template-columns: 1fr;\n  grid-template-rows: 1fr 1fr;\n}\n.folder-content--grid-3[data-v-8ab848c4] {\n  grid-template-columns: 1fr 1fr;\n  grid-template-rows: 1fr 1fr;\n}\n.folder-content--grid-3 img[data-v-8ab848c4]:first-child {\n  grid-column: span 2;\n}\n.folder-content--grid-4[data-v-8ab848c4] {\n  grid-template-columns: 1fr 1fr;\n  grid-template-rows: 1fr 1fr;\n}\n.folder-content img[data-v-8ab848c4] {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}\n.folder-name[data-v-8ab848c4] {\n  position: absolute;\n  z-index: 3;\n  display: flex;\n  overflow: hidden;\n  flex-direction: column;\n  width: 100%;\n  height: 100%;\n  transition: opacity var(--animation-quick) ease-in-out;\n  opacity: 1;\n}\n.folder-name__icon[data-v-8ab848c4] {\n  height: 40%;\n  margin-top: calc(30% - 1rem / 2);\n  background-size: 40%;\n}\n.folder-name__name[data-v-8ab848c4] {\n  overflow: hidden;\n  height: 1rem;\n  padding: 0 10px;\n  text-align: center;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  color: var(--color-main-background);\n  text-shadow: 0 0 8px var(--color-main-text);\n  font-size: 1rem;\n  line-height: 1rem;\n}\n.folder--clear .folder-name__icon[data-v-8ab848c4] {\n  opacity: 0.3;\n}\n.folder--clear .folder-name__name[data-v-8ab848c4] {\n  color: var(--color-main-text);\n  text-shadow: 0 0 8px var(--color-main-background);\n}\n.folder:not(.folder--clear) .cover[data-v-8ab848c4] {\n  opacity: 0.3;\n}\n.folder:not(.folder--clear).active .folder-name[data-v-8ab848c4],\n.folder:not(.folder--clear).active .cover[data-v-8ab848c4], .folder:not(.folder--clear):active .folder-name[data-v-8ab848c4],\n.folder:not(.folder--clear):active .cover[data-v-8ab848c4], .folder:not(.folder--clear):hover .folder-name[data-v-8ab848c4],\n.folder:not(.folder--clear):hover .cover[data-v-8ab848c4], .folder:not(.folder--clear):focus .folder-name[data-v-8ab848c4],\n.folder:not(.folder--clear):focus .cover[data-v-8ab848c4] {\n  opacity: 0;\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FolderTagPreview.vue?vue&type=style&index=0&id=77915c0c&lang=scss&scoped=true&":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FolderTagPreview.vue?vue&type=style&index=0&id=77915c0c&lang=scss&scoped=true& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, "@charset \"UTF-8\";\n/**\n * @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>\n *\n * @author John Molakvoæ <skjnldsv@protonmail.com>\n *\n * @license AGPL-3.0-or-later\n *\n * This program is free software: you can redistribute it and/or modify\n * it under the terms of the GNU Affero General Public License as\n * published by the Free Software Foundation, either version 3 of the\n * License, or (at your option) any later version.\n *\n * This program is distributed in the hope that it will be useful,\n * but WITHOUT ANY WARRANTY; without even the implied warranty of\n * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the\n * GNU Affero General Public License for more details.\n *\n * You should have received a copy of the GNU Affero General Public License\n * along with this program. If not, see <http://www.gnu.org/licenses/>.\n *\n */\n.file[data-v-77915c0c],\n.folder[data-v-77915c0c] {\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  -webkit-user-select: none;\n          user-select: none;\n  border-radius: var(--border-radius);\n  overflow: hidden;\n}\n.file .cover[data-v-77915c0c],\n.folder .cover[data-v-77915c0c] {\n  z-index: 2;\n  width: 100%;\n  padding-bottom: 100%;\n  transition: opacity var(--animation-quick) ease-in-out;\n  opacity: 0;\n  background-color: var(--color-main-text);\n}\n.file.active .cover[data-v-77915c0c], .file:active .cover[data-v-77915c0c], .file:hover .cover[data-v-77915c0c], .file:focus .cover[data-v-77915c0c],\n.folder.active .cover[data-v-77915c0c],\n.folder:active .cover[data-v-77915c0c],\n.folder:hover .cover[data-v-77915c0c],\n.folder:focus .cover[data-v-77915c0c] {\n  opacity: 0.3;\n}\n.file--clear.active .cover[data-v-77915c0c], .file--clear:active .cover[data-v-77915c0c], .file--clear:hover .cover[data-v-77915c0c], .file--clear:focus .cover[data-v-77915c0c],\n.folder--clear.active .cover[data-v-77915c0c],\n.folder--clear:active .cover[data-v-77915c0c],\n.folder--clear:hover .cover[data-v-77915c0c],\n.folder--clear:focus .cover[data-v-77915c0c] {\n  opacity: 0.1;\n}\n.fade-enter-active[data-v-77915c0c], .fade-leave-active[data-v-77915c0c] {\n  transition: opacity var(--animation-quick) ease-in-out;\n}\n.fade-enter[data-v-77915c0c], .fade-leave-to[data-v-77915c0c] {\n  opacity: 0;\n}\n.folder-content[data-v-77915c0c] {\n  position: absolute;\n  display: grid;\n  width: 100%;\n  height: 100%;\n}\n.folder-content--grid-1[data-v-77915c0c] {\n  grid-template-columns: 1fr;\n  grid-template-rows: 1fr;\n}\n.folder-content--grid-2[data-v-77915c0c] {\n  grid-template-columns: 1fr;\n  grid-template-rows: 1fr 1fr;\n}\n.folder-content--grid-3[data-v-77915c0c] {\n  grid-template-columns: 1fr 1fr;\n  grid-template-rows: 1fr 1fr;\n}\n.folder-content--grid-3 img[data-v-77915c0c]:first-child {\n  grid-column: span 2;\n}\n.folder-content--grid-4[data-v-77915c0c] {\n  grid-template-columns: 1fr 1fr;\n  grid-template-rows: 1fr 1fr;\n}\n.folder-content img[data-v-77915c0c] {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}\n.folder-name[data-v-77915c0c] {\n  position: absolute;\n  z-index: 3;\n  display: flex;\n  overflow: hidden;\n  flex-direction: column;\n  width: 100%;\n  height: 100%;\n  transition: opacity var(--animation-quick) ease-in-out;\n  opacity: 1;\n}\n.folder-name__icon[data-v-77915c0c] {\n  height: 40%;\n  margin-top: calc(30% - 1rem / 2);\n  background-size: 40%;\n}\n.folder-name__name[data-v-77915c0c] {\n  overflow: hidden;\n  height: 1rem;\n  padding: 0 10px;\n  text-align: center;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  color: var(--color-main-background);\n  text-shadow: 0 0 8px var(--color-main-text);\n  font-size: 1rem;\n  line-height: 1rem;\n}\n.folder[data-v-77915c0c] {\n  border-radius: var(--border-radius-large);\n}\n.folder--clear .folder-name__icon[data-v-77915c0c] {\n  opacity: 0.3;\n}\n.folder--clear .folder-name__name[data-v-77915c0c] {\n  color: var(--color-main-text);\n  text-shadow: 0 0 8px var(--color-main-background);\n}\n.folder:not(.folder--clear) .cover[data-v-77915c0c] {\n  opacity: 0.3;\n}\n.folder:not(.folder--clear):active .folder-name[data-v-77915c0c],\n.folder:not(.folder--clear):active .cover[data-v-77915c0c], .folder:not(.folder--clear):hover .folder-name[data-v-77915c0c],\n.folder:not(.folder--clear):hover .cover[data-v-77915c0c], .folder:not(.folder--clear):focus .folder-name[data-v-77915c0c],\n.folder:not(.folder--clear):focus .cover[data-v-77915c0c] {\n  opacity: 0;\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/Folders.vue?vue&type=style&index=0&id=d4b5440a&lang=scss&scoped=true&":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/Folders.vue?vue&type=style&index=0&id=d4b5440a&lang=scss&scoped=true& ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, "@charset \"UTF-8\";\n/**\n * @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>\n *\n * @author John Molakvoæ <skjnldsv@protonmail.com>\n *\n * @license AGPL-3.0-or-later\n *\n * This program is free software: you can redistribute it and/or modify\n * it under the terms of the GNU Affero General Public License as\n * published by the Free Software Foundation, either version 3 of the\n * License, or (at your option) any later version.\n *\n * This program is distributed in the hope that it will be useful,\n * but WITHOUT ANY WARRANTY; without even the implied warranty of\n * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the\n * GNU Affero General Public License for more details.\n *\n * You should have received a copy of the GNU Affero General Public License\n * along with this program. If not, see <http://www.gnu.org/licenses/>.\n *\n */\n@media (min-width: 0px) and (max-width: 400px) {\n.grid-container[data-v-d4b5440a] {\n    padding: 0px 8px 256px 8px;\n}\n}\n@media (min-width: 400px) and (max-width: 700px) {\n.grid-container[data-v-d4b5440a] {\n    padding: 0px 8px 256px 8px;\n}\n}\n@media (min-width: 700px) and (max-width: 1024px) {\n.grid-container[data-v-d4b5440a] {\n    padding: 0px 44px 256px 44px;\n}\n}\n@media (min-width: 1024px) and (max-width: 1280px) {\n.grid-container[data-v-d4b5440a] {\n    padding: 0px 44px 256px 44px;\n}\n}\n@media (min-width: 1280px) and (max-width: 1440px) {\n.grid-container[data-v-d4b5440a] {\n    padding: 0px 66px 256px 66px;\n}\n}\n@media (min-width: 1440px) and (max-width: 1600px) {\n.grid-container[data-v-d4b5440a] {\n    padding: 0px 66px 256px 66px;\n}\n}\n@media (min-width: 1600px) and (max-width: 2048px) {\n.grid-container[data-v-d4b5440a] {\n    padding: 0px 66px 256px 66px;\n}\n}\n@media (min-width: 2048px) and (max-width: 2560px) {\n.grid-container[data-v-d4b5440a] {\n    padding: 0px 88px 256px 88px;\n}\n}\n@media (min-width: 2560px) and (max-width: 3440px) {\n.grid-container[data-v-d4b5440a] {\n    padding: 0px 88px 256px 88px;\n}\n}\n@media (min-width: 3440px) {\n.grid-container[data-v-d4b5440a] {\n    padding: 0px 88px 256px 88px;\n}\n}\n.photos-navigation[data-v-d4b5440a] {\n  position: relative;\n}\n.photos-navigation--uploading[data-v-d4b5440a] {\n  margin-bottom: 30px;\n}\n[data-v-d4b5440a] .upload-picker .upload-picker__progress {\n  position: absolute;\n  bottom: -30px;\n  left: 64px;\n  margin: 0;\n}\n[data-v-d4b5440a] .upload-picker .upload-picker__cancel {\n  position: absolute;\n  bottom: -24px;\n  right: 50px;\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FileLegacy.vue?vue&type=style&index=0&id=0fd72815&lang=scss&scoped=true&":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FileLegacy.vue?vue&type=style&index=0&id=0fd72815&lang=scss&scoped=true& ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FileLegacy_vue_vue_type_style_index_0_id_0fd72815_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FileLegacy.vue?vue&type=style&index=0&id=0fd72815&lang=scss&scoped=true& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FileLegacy.vue?vue&type=style&index=0&id=0fd72815&lang=scss&scoped=true&");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FileLegacy_vue_vue_type_style_index_0_id_0fd72815_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FileLegacy_vue_vue_type_style_index_0_id_0fd72815_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FileLegacy_vue_vue_type_style_index_0_id_0fd72815_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FileLegacy_vue_vue_type_style_index_0_id_0fd72815_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Folder.vue?vue&type=style&index=0&id=8ab848c4&lang=scss&scoped=true&":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Folder.vue?vue&type=style&index=0&id=8ab848c4&lang=scss&scoped=true& ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Folder_vue_vue_type_style_index_0_id_8ab848c4_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Folder.vue?vue&type=style&index=0&id=8ab848c4&lang=scss&scoped=true& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Folder.vue?vue&type=style&index=0&id=8ab848c4&lang=scss&scoped=true&");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Folder_vue_vue_type_style_index_0_id_8ab848c4_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Folder_vue_vue_type_style_index_0_id_8ab848c4_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Folder_vue_vue_type_style_index_0_id_8ab848c4_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Folder_vue_vue_type_style_index_0_id_8ab848c4_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FolderTagPreview.vue?vue&type=style&index=0&id=77915c0c&lang=scss&scoped=true&":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FolderTagPreview.vue?vue&type=style&index=0&id=77915c0c&lang=scss&scoped=true& ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FolderTagPreview_vue_vue_type_style_index_0_id_77915c0c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FolderTagPreview.vue?vue&type=style&index=0&id=77915c0c&lang=scss&scoped=true& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FolderTagPreview.vue?vue&type=style&index=0&id=77915c0c&lang=scss&scoped=true&");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FolderTagPreview_vue_vue_type_style_index_0_id_77915c0c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FolderTagPreview_vue_vue_type_style_index_0_id_77915c0c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FolderTagPreview_vue_vue_type_style_index_0_id_77915c0c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FolderTagPreview_vue_vue_type_style_index_0_id_77915c0c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/Folders.vue?vue&type=style&index=0&id=d4b5440a&lang=scss&scoped=true&":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/Folders.vue?vue&type=style&index=0&id=d4b5440a&lang=scss&scoped=true& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Folders_vue_vue_type_style_index_0_id_d4b5440a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Folders.vue?vue&type=style&index=0&id=d4b5440a&lang=scss&scoped=true& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/Folders.vue?vue&type=style&index=0&id=d4b5440a&lang=scss&scoped=true&");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Folders_vue_vue_type_style_index_0_id_d4b5440a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Folders_vue_vue_type_style_index_0_id_d4b5440a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Folders_vue_vue_type_style_index_0_id_d4b5440a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Folders_vue_vue_type_style_index_0_id_d4b5440a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/components/FileLegacy.vue":
/*!***************************************!*\
  !*** ./src/components/FileLegacy.vue ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _FileLegacy_vue_vue_type_template_id_0fd72815_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FileLegacy.vue?vue&type=template&id=0fd72815&scoped=true& */ "./src/components/FileLegacy.vue?vue&type=template&id=0fd72815&scoped=true&");
/* harmony import */ var _FileLegacy_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FileLegacy.vue?vue&type=script&lang=js& */ "./src/components/FileLegacy.vue?vue&type=script&lang=js&");
/* harmony import */ var _FileLegacy_vue_vue_type_style_index_0_id_0fd72815_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FileLegacy.vue?vue&type=style&index=0&id=0fd72815&lang=scss&scoped=true& */ "./src/components/FileLegacy.vue?vue&type=style&index=0&id=0fd72815&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _FileLegacy_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _FileLegacy_vue_vue_type_template_id_0fd72815_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render,
  _FileLegacy_vue_vue_type_template_id_0fd72815_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "0fd72815",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/components/FileLegacy.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/components/Folder.vue":
/*!***********************************!*\
  !*** ./src/components/Folder.vue ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Folder_vue_vue_type_template_id_8ab848c4_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Folder.vue?vue&type=template&id=8ab848c4&scoped=true& */ "./src/components/Folder.vue?vue&type=template&id=8ab848c4&scoped=true&");
/* harmony import */ var _Folder_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Folder.vue?vue&type=script&lang=js& */ "./src/components/Folder.vue?vue&type=script&lang=js&");
/* harmony import */ var _Folder_vue_vue_type_style_index_0_id_8ab848c4_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Folder.vue?vue&type=style&index=0&id=8ab848c4&lang=scss&scoped=true& */ "./src/components/Folder.vue?vue&type=style&index=0&id=8ab848c4&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _Folder_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _Folder_vue_vue_type_template_id_8ab848c4_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render,
  _Folder_vue_vue_type_template_id_8ab848c4_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "8ab848c4",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/components/Folder.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/components/FolderTagPreview.vue":
/*!*********************************************!*\
  !*** ./src/components/FolderTagPreview.vue ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _FolderTagPreview_vue_vue_type_template_id_77915c0c_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FolderTagPreview.vue?vue&type=template&id=77915c0c&scoped=true& */ "./src/components/FolderTagPreview.vue?vue&type=template&id=77915c0c&scoped=true&");
/* harmony import */ var _FolderTagPreview_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FolderTagPreview.vue?vue&type=script&lang=js& */ "./src/components/FolderTagPreview.vue?vue&type=script&lang=js&");
/* harmony import */ var _FolderTagPreview_vue_vue_type_style_index_0_id_77915c0c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FolderTagPreview.vue?vue&type=style&index=0&id=77915c0c&lang=scss&scoped=true& */ "./src/components/FolderTagPreview.vue?vue&type=style&index=0&id=77915c0c&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _FolderTagPreview_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _FolderTagPreview_vue_vue_type_template_id_77915c0c_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render,
  _FolderTagPreview_vue_vue_type_template_id_77915c0c_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "77915c0c",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/components/FolderTagPreview.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/views/Folders.vue":
/*!*******************************!*\
  !*** ./src/views/Folders.vue ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Folders_vue_vue_type_template_id_d4b5440a_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Folders.vue?vue&type=template&id=d4b5440a&scoped=true& */ "./src/views/Folders.vue?vue&type=template&id=d4b5440a&scoped=true&");
/* harmony import */ var _Folders_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Folders.vue?vue&type=script&lang=js& */ "./src/views/Folders.vue?vue&type=script&lang=js&");
/* harmony import */ var _Folders_vue_vue_type_style_index_0_id_d4b5440a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Folders.vue?vue&type=style&index=0&id=d4b5440a&lang=scss&scoped=true& */ "./src/views/Folders.vue?vue&type=style&index=0&id=d4b5440a&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _Folders_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _Folders_vue_vue_type_template_id_d4b5440a_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render,
  _Folders_vue_vue_type_template_id_d4b5440a_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "d4b5440a",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/views/Folders.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/components/FileLegacy.vue?vue&type=script&lang=js&":
/*!****************************************************************!*\
  !*** ./src/components/FileLegacy.vue?vue&type=script&lang=js& ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_FileLegacy_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FileLegacy.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FileLegacy.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_FileLegacy_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/components/Folder.vue?vue&type=script&lang=js&":
/*!************************************************************!*\
  !*** ./src/components/Folder.vue?vue&type=script&lang=js& ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Folder_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Folder.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Folder.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Folder_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/components/FolderTagPreview.vue?vue&type=script&lang=js&":
/*!**********************************************************************!*\
  !*** ./src/components/FolderTagPreview.vue?vue&type=script&lang=js& ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_FolderTagPreview_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FolderTagPreview.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FolderTagPreview.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_FolderTagPreview_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/views/Folders.vue?vue&type=script&lang=js&":
/*!********************************************************!*\
  !*** ./src/views/Folders.vue?vue&type=script&lang=js& ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Folders_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Folders.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/Folders.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Folders_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/components/FileLegacy.vue?vue&type=template&id=0fd72815&scoped=true&":
/*!**********************************************************************************!*\
  !*** ./src/components/FileLegacy.vue?vue&type=template&id=0fd72815&scoped=true& ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FileLegacy_vue_vue_type_template_id_0fd72815_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FileLegacy_vue_vue_type_template_id_0fd72815_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FileLegacy_vue_vue_type_template_id_0fd72815_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FileLegacy.vue?vue&type=template&id=0fd72815&scoped=true& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FileLegacy.vue?vue&type=template&id=0fd72815&scoped=true&");


/***/ }),

/***/ "./src/components/Folder.vue?vue&type=template&id=8ab848c4&scoped=true&":
/*!******************************************************************************!*\
  !*** ./src/components/Folder.vue?vue&type=template&id=8ab848c4&scoped=true& ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Folder_vue_vue_type_template_id_8ab848c4_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Folder_vue_vue_type_template_id_8ab848c4_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Folder_vue_vue_type_template_id_8ab848c4_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Folder.vue?vue&type=template&id=8ab848c4&scoped=true& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Folder.vue?vue&type=template&id=8ab848c4&scoped=true&");


/***/ }),

/***/ "./src/components/FolderTagPreview.vue?vue&type=template&id=77915c0c&scoped=true&":
/*!****************************************************************************************!*\
  !*** ./src/components/FolderTagPreview.vue?vue&type=template&id=77915c0c&scoped=true& ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FolderTagPreview_vue_vue_type_template_id_77915c0c_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FolderTagPreview_vue_vue_type_template_id_77915c0c_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FolderTagPreview_vue_vue_type_template_id_77915c0c_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FolderTagPreview.vue?vue&type=template&id=77915c0c&scoped=true& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FolderTagPreview.vue?vue&type=template&id=77915c0c&scoped=true&");


/***/ }),

/***/ "./src/views/Folders.vue?vue&type=template&id=d4b5440a&scoped=true&":
/*!**************************************************************************!*\
  !*** ./src/views/Folders.vue?vue&type=template&id=d4b5440a&scoped=true& ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Folders_vue_vue_type_template_id_d4b5440a_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Folders_vue_vue_type_template_id_d4b5440a_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Folders_vue_vue_type_template_id_d4b5440a_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Folders.vue?vue&type=template&id=d4b5440a&scoped=true& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/Folders.vue?vue&type=template&id=d4b5440a&scoped=true&");


/***/ }),

/***/ "./src/components/FileLegacy.vue?vue&type=style&index=0&id=0fd72815&lang=scss&scoped=true&":
/*!*************************************************************************************************!*\
  !*** ./src/components/FileLegacy.vue?vue&type=style&index=0&id=0fd72815&lang=scss&scoped=true& ***!
  \*************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FileLegacy_vue_vue_type_style_index_0_id_0fd72815_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/style-loader/dist/cjs.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FileLegacy.vue?vue&type=style&index=0&id=0fd72815&lang=scss&scoped=true& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FileLegacy.vue?vue&type=style&index=0&id=0fd72815&lang=scss&scoped=true&");


/***/ }),

/***/ "./src/components/Folder.vue?vue&type=style&index=0&id=8ab848c4&lang=scss&scoped=true&":
/*!*********************************************************************************************!*\
  !*** ./src/components/Folder.vue?vue&type=style&index=0&id=8ab848c4&lang=scss&scoped=true& ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Folder_vue_vue_type_style_index_0_id_8ab848c4_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/style-loader/dist/cjs.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Folder.vue?vue&type=style&index=0&id=8ab848c4&lang=scss&scoped=true& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Folder.vue?vue&type=style&index=0&id=8ab848c4&lang=scss&scoped=true&");


/***/ }),

/***/ "./src/components/FolderTagPreview.vue?vue&type=style&index=0&id=77915c0c&lang=scss&scoped=true&":
/*!*******************************************************************************************************!*\
  !*** ./src/components/FolderTagPreview.vue?vue&type=style&index=0&id=77915c0c&lang=scss&scoped=true& ***!
  \*******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FolderTagPreview_vue_vue_type_style_index_0_id_77915c0c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/style-loader/dist/cjs.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FolderTagPreview.vue?vue&type=style&index=0&id=77915c0c&lang=scss&scoped=true& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FolderTagPreview.vue?vue&type=style&index=0&id=77915c0c&lang=scss&scoped=true&");


/***/ }),

/***/ "./src/views/Folders.vue?vue&type=style&index=0&id=d4b5440a&lang=scss&scoped=true&":
/*!*****************************************************************************************!*\
  !*** ./src/views/Folders.vue?vue&type=style&index=0&id=d4b5440a&lang=scss&scoped=true& ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Folders_vue_vue_type_style_index_0_id_d4b5440a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/style-loader/dist/cjs.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Folders.vue?vue&type=style&index=0&id=d4b5440a&lang=scss&scoped=true& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/Folders.vue?vue&type=style&index=0&id=d4b5440a&lang=scss&scoped=true&");


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

/***/ }),

/***/ "?0cc0":
/*!**********************!*\
  !*** util (ignored) ***!
  \**********************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?aeb7":
/*!**********************!*\
  !*** util (ignored) ***!
  \**********************/
/***/ (() => {

/* (ignored) */

/***/ })

}]);
//# sourceMappingURL=photos-src_views_Folders_vue.js.map?v=7ba0e0e3591067920096