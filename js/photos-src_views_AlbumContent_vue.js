"use strict";
(self["webpackChunkphotos"] = self["webpackChunkphotos"] || []).push([["src_views_AlbumContent_vue"],{

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

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/AlbumContent.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/AlbumContent.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _nextcloud_files__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/files */ "./node_modules/@nextcloud/files/dist/index.mjs");
/* harmony import */ var _nextcloud_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/auth */ "./node_modules/@nextcloud/auth/dist/index.es.mjs");
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @nextcloud/vue */ "./node_modules/@nextcloud/vue/dist/index.mjs");
/* harmony import */ var _nextcloud_upload__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @nextcloud/upload */ "./node_modules/@nextcloud/upload/dist/index.esm.js");
/* harmony import */ var _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @nextcloud/l10n */ "./node_modules/@nextcloud/l10n/dist/index.mjs");
/* harmony import */ var debounce__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! debounce */ "./node_modules/debounce/index.js");
/* harmony import */ var debounce__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(debounce__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var vue_material_design_icons_Close_vue__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! vue-material-design-icons/Close.vue */ "./node_modules/vue-material-design-icons/Close.vue");
/* harmony import */ var vue_material_design_icons_Delete_vue__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! vue-material-design-icons/Delete.vue */ "./node_modules/vue-material-design-icons/Delete.vue");
/* harmony import */ var vue_material_design_icons_ImagePlus_vue__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! vue-material-design-icons/ImagePlus.vue */ "./node_modules/vue-material-design-icons/ImagePlus.vue");
/* harmony import */ var vue_material_design_icons_MapMarker_vue__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! vue-material-design-icons/MapMarker.vue */ "./node_modules/vue-material-design-icons/MapMarker.vue");
/* harmony import */ var vue_material_design_icons_Pencil_vue__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! vue-material-design-icons/Pencil.vue */ "./node_modules/vue-material-design-icons/Pencil.vue");
/* harmony import */ var vue_material_design_icons_Plus_vue__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! vue-material-design-icons/Plus.vue */ "./node_modules/vue-material-design-icons/Plus.vue");
/* harmony import */ var _mdi_svg_svg_plus_svg__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @mdi/svg/svg/plus.svg */ "./node_modules/@mdi/svg/svg/plus.svg");
/* harmony import */ var vue_material_design_icons_ShareVariant_vue__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! vue-material-design-icons/ShareVariant.vue */ "./node_modules/vue-material-design-icons/ShareVariant.vue");
/* harmony import */ var _mixins_FetchFilesMixin_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../mixins/FetchFilesMixin.js */ "./src/mixins/FetchFilesMixin.js");
/* harmony import */ var _mixins_FetchCollectionContentMixin_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../mixins/FetchCollectionContentMixin.js */ "./src/mixins/FetchCollectionContentMixin.js");
/* harmony import */ var _mixins_UserConfig_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../mixins/UserConfig.js */ "./src/mixins/UserConfig.js");
/* harmony import */ var _components_Actions_ActionFavorite_vue__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../components/Actions/ActionFavorite.vue */ "./src/components/Actions/ActionFavorite.vue");
/* harmony import */ var _components_Albums_AlbumForm_vue__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../components/Albums/AlbumForm.vue */ "./src/components/Albums/AlbumForm.vue");
/* harmony import */ var _components_Albums_CollaboratorsSelectionForm_vue__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../components/Albums/CollaboratorsSelectionForm.vue */ "./src/components/Albums/CollaboratorsSelectionForm.vue");
/* harmony import */ var _components_Collection_CollectionContent_vue__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../components/Collection/CollectionContent.vue */ "./src/components/Collection/CollectionContent.vue");
/* harmony import */ var _components_FilesPicker_vue__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../components/FilesPicker.vue */ "./src/components/FilesPicker.vue");
/* harmony import */ var _components_HeaderNavigation_vue__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ../components/HeaderNavigation.vue */ "./src/components/HeaderNavigation.vue");
/* harmony import */ var _services_AllowedMimes_js__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ../services/AllowedMimes.js */ "./src/services/AllowedMimes.js");
/* harmony import */ var _services_logger_js__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ../services/logger.js */ "./src/services/logger.js");









// import Download from 'vue-material-design-icons/Download.vue'
// import DownloadMultiple from 'vue-material-design-icons/DownloadMultiple.vue'










// import ActionDownload from '../components/Actions/ActionDownload.vue'








/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'AlbumContent',
  components: {
    // ActionDownload,
    ActionFavorite: _components_Actions_ActionFavorite_vue__WEBPACK_IMPORTED_MODULE_17__["default"],
    AlbumForm: _components_Albums_AlbumForm_vue__WEBPACK_IMPORTED_MODULE_18__["default"],
    Close: vue_material_design_icons_Close_vue__WEBPACK_IMPORTED_MODULE_6__["default"],
    CollaboratorsSelectionForm: _components_Albums_CollaboratorsSelectionForm_vue__WEBPACK_IMPORTED_MODULE_19__["default"],
    CollectionContent: _components_Collection_CollectionContent_vue__WEBPACK_IMPORTED_MODULE_20__["default"],
    Delete: vue_material_design_icons_Delete_vue__WEBPACK_IMPORTED_MODULE_7__["default"],
    // Download,
    // DownloadMultiple,
    FilesPicker: _components_FilesPicker_vue__WEBPACK_IMPORTED_MODULE_21__["default"],
    HeaderNavigation: _components_HeaderNavigation_vue__WEBPACK_IMPORTED_MODULE_22__["default"],
    ImagePlus: vue_material_design_icons_ImagePlus_vue__WEBPACK_IMPORTED_MODULE_8__["default"],
    MapMarker: vue_material_design_icons_MapMarker_vue__WEBPACK_IMPORTED_MODULE_9__["default"],
    NcActionButton: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_2__.NcActionButton,
    NcActions: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_2__.NcActions,
    NcActionSeparator: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_2__.NcActionSeparator,
    NcButton: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_2__.NcButton,
    NcEmptyContent: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_2__.NcEmptyContent,
    NcLoadingIcon: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_2__.NcLoadingIcon,
    NcModal: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_2__.NcModal,
    Pencil: vue_material_design_icons_Pencil_vue__WEBPACK_IMPORTED_MODULE_10__["default"],
    Plus: vue_material_design_icons_Plus_vue__WEBPACK_IMPORTED_MODULE_11__["default"],
    ShareVariant: vue_material_design_icons_ShareVariant_vue__WEBPACK_IMPORTED_MODULE_13__["default"],
    UploadPicker: _nextcloud_upload__WEBPACK_IMPORTED_MODULE_3__.UploadPicker
  },
  mixins: [_mixins_FetchCollectionContentMixin_js__WEBPACK_IMPORTED_MODULE_15__["default"], _mixins_FetchFilesMixin_js__WEBPACK_IMPORTED_MODULE_14__["default"], _nextcloud_vue__WEBPACK_IMPORTED_MODULE_2__.isMobile, _mixins_UserConfig_js__WEBPACK_IMPORTED_MODULE_16__["default"]],
  props: {
    albumName: {
      type: String,
      default: '/'
    }
  },
  data() {
    return {
      allowedMimes: _services_AllowedMimes_js__WEBPACK_IMPORTED_MODULE_23__["default"],
      showAddPhotosModal: false,
      showManageCollaboratorView: false,
      showEditAlbumForm: false,
      loadingAddCollaborators: false,
      uploader: (0,_nextcloud_upload__WEBPACK_IMPORTED_MODULE_3__.getUploader)(),
      newFileMenuEntry: {
        id: 'album-add',
        displayName: t('photos', 'Add photos to this album'),
        templateName: '',
        if: context => context.route === this.$route.name,
        /** Existing icon css class */
        iconSvgInline: _mdi_svg_svg_plus_svg__WEBPACK_IMPORTED_MODULE_12__,
        /** Function to be run after creation */
        handler: () => {
          this.showAddPhotosModal = true;
        }
      }
    };
  },
  computed: {
    /**
     * @return {import('../store/albums.js').Album|undefined} The album information for the current albumName.
     */
    album() {
      return this.$store.getters.getAlbum(this.albumName);
    },
    /**
     * @return {string[]} The list of files for the current albumName.
     */
    albumFileIds() {
      return this.$store.getters.getAlbumFiles(this.albumName);
    },
    /**
     * @return {boolean} Whether sharing is enabled.
     */
    sharingEnabled() {
      return OC.Share !== undefined;
    },
    /**
     * The upload picker context
     * We're uploading to the album folder, and the backend handle
     * the writing to the default location as well as the album update.
     * The context is also used for the NewFileMenu.
     *
     * @return {Album&{route: string, root: string}}
     */
    uploadContext() {
      return {
        ...this.album,
        route: this.$route.name,
        root: `dav/photos/${(0,_nextcloud_auth__WEBPACK_IMPORTED_MODULE_1__.getCurrentUser)()?.uid}/albums`
      };
    },
    /**
     * @return {string} The album's filename based on its name. Useful to fetch the location information and content.
     */
    albumFileName() {
      return this.$store.getters.getAlbumName(this.albumName);
    }
  },
  async mounted() {
    this.fetchAlbum();
    this.fetchAlbumContent();
    (0,_nextcloud_files__WEBPACK_IMPORTED_MODULE_0__.addNewFileMenuEntry)(this.newFileMenuEntry);
  },
  destroyed() {
    (0,_nextcloud_files__WEBPACK_IMPORTED_MODULE_0__.removeNewFileMenuEntry)(this.newFileMenuEntry);
  },
  methods: {
    ...(0,vuex__WEBPACK_IMPORTED_MODULE_25__.mapActions)(['addFilesToCollection', 'removeFilesFromCollection', 'deleteCollection', 'updateCollection']),
    async fetchAlbum() {
      await this.fetchCollection(this.albumFileName, ['<nc:location />', '<nc:dateRange />', '<nc:collaborators />']);
    },
    async fetchAlbumContent() {
      await this.fetchCollectionFiles(this.albumFileName);
    },
    redirectToNewName(_ref) {
      let {
        album
      } = _ref;
      this.showEditAlbumForm = false;
      if (this.album.basename !== album.basename) {
        this.$router.push(`/albums/${album.basename}`);
      }
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
      this.$router.push('/albums');
    },
    async handleSetCollaborators(collaborators) {
      try {
        this.loadingAddCollaborators = true;
        this.showManageCollaboratorView = false;
        await this.updateCollection({
          collectionFileName: this.album.filename,
          properties: {
            collaborators
          }
        });
      } catch (error) {
        _services_logger_js__WEBPACK_IMPORTED_MODULE_24__["default"].error('Error while setting album collaborators', {
          error
        });
      } finally {
        this.loadingAddCollaborators = false;
      }
    },
    /**
     * A new File has been uploaded, let's add it
     *
     * @param {Upload[]} uploads
     */
    onUpload: debounce__WEBPACK_IMPORTED_MODULE_5___default()(function () {
      this.fetchAlbumContent();
    }, 500),
    t: _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_4__.translate
  }
});

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

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/AlbumContent.vue?vue&type=template&id=36505f44&scoped=true&":
/*!****************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/AlbumContent.vue?vue&type=template&id=36505f44&scoped=true& ***!
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
          class: {
            "photos-navigation--uploading": _vm.uploader.queue?.length > 0
          },
          attrs: {
            loading: _vm.loadingCollectionFiles,
            params: {
              albumName: _vm.albumName
            },
            path: "/" + _vm.albumName,
            title: _vm.albumName
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
        }, [_c("MapMarker"), _vm._v(_vm._s(_vm.album.location) + "\n\t\t\t")], 1) : _vm._e(), _vm._v(" "), _c("template", {
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
        }, [_vm.album.nbItems !== 0 ? _c("UploadPicker", {
          attrs: {
            accept: _vm.allowedMimes,
            context: _vm.uploadContext,
            destination: _vm.album.basename,
            root: _vm.uploadContext.root,
            multiple: true
          },
          on: {
            uploaded: _vm.onUpload
          }
        }) : _vm._e(), _vm._v(" "), _vm.sharingEnabled ? _c("NcButton", {
          attrs: {
            type: "tertiary",
            "aria-label": _vm.t("photos", "Manage collaborators for this album")
          },
          on: {
            click: function ($event) {
              _vm.showManageCollaboratorView = true;
            }
          }
        }, [_c("ShareVariant", {
          attrs: {
            slot: "icon"
          },
          slot: "icon"
        })], 1) : _vm._e(), _vm._v(" "), _c("NcActions", {
          attrs: {
            "aria-label": _vm.t("photos", "Open actions menu")
          }
        }, [_c("NcActionButton", {
          attrs: {
            "close-after-click": true,
            "aria-label": _vm.t("photos", "Edit album details")
          },
          on: {
            click: function ($event) {
              _vm.showEditAlbumForm = true;
            }
          }
        }, [_vm._v("\n\t\t\t\t\t\t" + _vm._s(_vm.t("photos", "Edit album details")) + "\n\t\t\t\t\t\t"), _c("Pencil", {
          attrs: {
            slot: "icon"
          },
          slot: "icon"
        })], 1), _vm._v(" "), _c("NcActionButton", {
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
        })], 1), _vm._v(" "), selectedFileIds.length > 0 ? [_c("NcActionSeparator"), _vm._v(" "), _c("ActionFavorite", {
          attrs: {
            "selected-file-ids": selectedFileIds
          }
        }), _vm._v(" "), _c("NcActionButton", {
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
    }], null, false, 749312566)
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
        albumName: _vm.albumName
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
      "blacklist-ids": _vm.albumFileIds
    },
    on: {
      "files-picked": _vm.handleFilesPicked
    }
  }) : _vm._e()], 1) : _vm._e(), _vm._v(" "), _vm.showManageCollaboratorView && _vm.album !== undefined ? _c("NcModal", {
    attrs: {
      name: _vm.t("photos", "Manage collaborators")
    },
    on: {
      close: function ($event) {
        _vm.showManageCollaboratorView = false;
      }
    }
  }, [_c("CollaboratorsSelectionForm", {
    attrs: {
      "album-name": _vm.album.basename,
      collaborators: _vm.album.collaborators
    },
    scopedSlots: _vm._u([{
      key: "default",
      fn: function (_ref2) {
        let {
          collaborators
        } = _ref2;
        return [_c("NcButton", {
          attrs: {
            "aria-label": _vm.t("photos", "Save collaborators for this album."),
            type: "primary",
            disabled: _vm.loadingAddCollaborators
          },
          on: {
            click: function ($event) {
              return _vm.handleSetCollaborators(collaborators);
            }
          },
          scopedSlots: _vm._u([{
            key: "icon",
            fn: function () {
              return [_vm.loadingAddCollaborators ? _c("NcLoadingIcon") : _vm._e()];
            },
            proxy: true
          }], null, true)
        }, [_vm._v("\n\t\t\t\t\t" + _vm._s(_vm.t("photos", "Save")) + "\n\t\t\t\t")])];
      }
    }], null, false, 4058924180)
  })], 1) : _vm._e(), _vm._v(" "), _vm.showEditAlbumForm ? _c("NcModal", {
    attrs: {
      name: _vm.t("photos", "Edit album details")
    },
    on: {
      close: function ($event) {
        _vm.showEditAlbumForm = false;
      }
    }
  }, [_c("AlbumForm", {
    attrs: {
      album: _vm.album
    },
    on: {
      done: _vm.redirectToNewName
    }
  })], 1) : _vm._e()], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/AlbumContent.vue?vue&type=style&index=0&id=36505f44&lang=scss&scoped=true&":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/AlbumContent.vue?vue&type=style&index=0&id=36505f44&lang=scss&scoped=true& ***!
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
___CSS_LOADER_EXPORT___.push([module.id, ".album__title[data-v-36505f44] {\n  width: 100%;\n}\n.album__name[data-v-36505f44] {\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}\n.album__location[data-v-36505f44] {\n  margin-left: -4px;\n  display: flex;\n  color: var(--color-text-lighter);\n}\n.photos-navigation[data-v-36505f44] {\n  position: relative;\n}\n.photos-navigation--uploading[data-v-36505f44] {\n  margin-bottom: 30px;\n}\n[data-v-36505f44] .upload-picker .upload-picker__progress {\n  position: absolute;\n  bottom: -30px;\n  left: 64px;\n  margin: 0;\n}\n[data-v-36505f44] .upload-picker .upload-picker__cancel {\n  position: absolute;\n  bottom: -24px;\n  right: 50px;\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/AlbumContent.vue?vue&type=style&index=0&id=36505f44&lang=scss&scoped=true&":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/AlbumContent.vue?vue&type=style&index=0&id=36505f44&lang=scss&scoped=true& ***!
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumContent_vue_vue_type_style_index_0_id_36505f44_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AlbumContent.vue?vue&type=style&index=0&id=36505f44&lang=scss&scoped=true& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/AlbumContent.vue?vue&type=style&index=0&id=36505f44&lang=scss&scoped=true&");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumContent_vue_vue_type_style_index_0_id_36505f44_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumContent_vue_vue_type_style_index_0_id_36505f44_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumContent_vue_vue_type_style_index_0_id_36505f44_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumContent_vue_vue_type_style_index_0_id_36505f44_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


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

/***/ "./src/views/AlbumContent.vue?vue&type=template&id=36505f44&scoped=true&":
/*!*******************************************************************************!*\
  !*** ./src/views/AlbumContent.vue?vue&type=template&id=36505f44&scoped=true& ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumContent_vue_vue_type_template_id_36505f44_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumContent_vue_vue_type_template_id_36505f44_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumContent_vue_vue_type_template_id_36505f44_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AlbumContent.vue?vue&type=template&id=36505f44&scoped=true& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/AlbumContent.vue?vue&type=template&id=36505f44&scoped=true&");


/***/ }),

/***/ "./src/views/AlbumContent.vue?vue&type=style&index=0&id=36505f44&lang=scss&scoped=true&":
/*!**********************************************************************************************!*\
  !*** ./src/views/AlbumContent.vue?vue&type=style&index=0&id=36505f44&lang=scss&scoped=true& ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumContent_vue_vue_type_style_index_0_id_36505f44_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/style-loader/dist/cjs.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AlbumContent.vue?vue&type=style&index=0&id=36505f44&lang=scss&scoped=true& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/AlbumContent.vue?vue&type=style&index=0&id=36505f44&lang=scss&scoped=true&");


/***/ })

}]);
//# sourceMappingURL=photos-src_views_AlbumContent_vue.js.map?v=0ab44a99e3c017a21011