"use strict";
(self["webpackChunkphotos"] = self["webpackChunkphotos"] || []).push([["src_components_Albums_AlbumForm_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/AlbumForm.vue?vue&type=script&lang=js&":
/*!**************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/AlbumForm.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var vue_material_design_icons_MapMarker_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue-material-design-icons/MapMarker.vue */ "./node_modules/vue-material-design-icons/MapMarker.vue");
/* harmony import */ var vue_material_design_icons_AccountMultiplePlus_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-material-design-icons/AccountMultiplePlus.vue */ "./node_modules/vue-material-design-icons/AccountMultiplePlus.vue");
/* harmony import */ var vue_material_design_icons_Send_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vue-material-design-icons/Send.vue */ "./node_modules/vue-material-design-icons/Send.vue");
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @nextcloud/vue */ "./node_modules/@nextcloud/vue/dist/index.mjs");
/* harmony import */ var _nextcloud_moment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @nextcloud/moment */ "./node_modules/@nextcloud/moment/dist/index.js");
/* harmony import */ var _nextcloud_moment__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_moment__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @nextcloud/l10n */ "./node_modules/@nextcloud/l10n/dist/index.mjs");
/* harmony import */ var _CollaboratorsSelectionForm_vue__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./CollaboratorsSelectionForm.vue */ "./src/components/Albums/CollaboratorsSelectionForm.vue");








/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'AlbumForm',
  components: {
    MapMarker: vue_material_design_icons_MapMarker_vue__WEBPACK_IMPORTED_MODULE_0__["default"],
    AccountMultiplePlus: vue_material_design_icons_AccountMultiplePlus_vue__WEBPACK_IMPORTED_MODULE_1__["default"],
    Send: vue_material_design_icons_Send_vue__WEBPACK_IMPORTED_MODULE_2__["default"],
    NcButton: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_3__.NcButton,
    NcLoadingIcon: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_3__.NcLoadingIcon,
    NcTextField: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_3__.NcTextField,
    CollaboratorsSelectionForm: _CollaboratorsSelectionForm_vue__WEBPACK_IMPORTED_MODULE_6__["default"]
  },
  props: {
    /** @type {import('vue').PropType<import('../../store/albums.js').Album|null>} */
    album: {
      type: Object,
      default: null
    },
    displayBackButton: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showCollaboratorView: false,
      albumName: '',
      albumLocation: '',
      loading: false
    };
  },
  computed: {
    /**
     * @return {boolean} Whether sharing is enabled.
     */
    editMode() {
      return this.album !== null;
    },
    /**
     * @return {boolean} Whether sharing is enabled.
     */
    sharingEnabled() {
      return OC.Share !== undefined;
    },
    /**
     * @return {string} The album's filename based on its name. Useful to fetch the location information and content.
     */
    albumFileName() {
      return this.$store.getters.getAlbumName(this.albumName);
    }
  },
  mounted() {
    if (this.editMode) {
      this.albumName = this.album.basename;
      this.albumLocation = this.album.location ?? '';
    }
    this.$nextTick(() => {
      this.$refs.nameInput.$el.getElementsByTagName('input')[0].focus();
    });
  },
  methods: {
    ...(0,vuex__WEBPACK_IMPORTED_MODULE_7__.mapActions)(['createCollection', 'renameCollection', 'updateCollection']),
    /** @param {import('../../store/albums.js').Collaborator[]} collaborators */
    submit() {
      let collaborators = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      if (this.albumName === '' || this.loading) {
        return;
      }
      if (this.editMode) {
        this.handleUpdateAlbum();
      } else {
        this.handleCreateAlbum(collaborators);
      }
    },
    /** @param {import('../../store/albums.js').Collaborator[]} collaborators */
    async handleCreateAlbum() {
      let collaborators = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      try {
        this.loading = true;
        let album = await this.createCollection({
          collection: {
            basename: this.albumName,
            filename: this.albumFileName,
            nbItems: 0,
            location: this.albumLocation,
            lastPhoto: -1,
            date: _nextcloud_moment__WEBPACK_IMPORTED_MODULE_4___default()().format('MMMM YYYY'),
            collaborators
          }
        });
        if (this.albumLocation !== '' || collaborators.length !== 0) {
          album = await this.updateCollection({
            collectionFileName: this.albumFileName,
            properties: {
              location: this.albumLocation,
              collaborators
            }
          });
        }
        this.$emit('done', {
          album
        });
      } finally {
        this.loading = false;
      }
    },
    async handleUpdateAlbum() {
      try {
        this.loading = true;
        let album = {
          ...this.album
        };
        if (this.album.basename !== this.albumName) {
          album = await this.renameCollection({
            collectionFileName: this.album.filename,
            newBaseName: this.albumName
          });
        }
        if (this.album.location !== this.albumLocation) {
          album = await this.updateCollection({
            collectionFileName: album.filename,
            properties: {
              location: this.albumLocation
            }
          });
        }
        this.$emit('done', {
          album
        });
      } finally {
        this.loading = false;
      }
    },
    back() {
      this.$emit('back');
    },
    t: _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_5__.translate
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=script&lang=js&":
/*!*******************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var vue_material_design_icons_Close_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue-material-design-icons/Close.vue */ "./node_modules/vue-material-design-icons/Close.vue");
/* harmony import */ var vue_material_design_icons_Check_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-material-design-icons/Check.vue */ "./node_modules/vue-material-design-icons/Check.vue");
/* harmony import */ var vue_material_design_icons_ContentCopy_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vue-material-design-icons/ContentCopy.vue */ "./node_modules/vue-material-design-icons/ContentCopy.vue");
/* harmony import */ var vue_material_design_icons_AccountGroup_vue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! vue-material-design-icons/AccountGroup.vue */ "./node_modules/vue-material-design-icons/AccountGroup.vue");
/* harmony import */ var vue_material_design_icons_Earth_vue__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! vue-material-design-icons/Earth.vue */ "./node_modules/vue-material-design-icons/Earth.vue");
/* harmony import */ var _mdi_svg_svg_account_group_svg__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @mdi/svg/svg/account-group.svg */ "./node_modules/@mdi/svg/svg/account-group.svg");
/* harmony import */ var _nextcloud_axios__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @nextcloud/axios */ "./node_modules/@nextcloud/axios/dist/index.esm.js");
/* harmony import */ var _nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @nextcloud/dialogs */ "./node_modules/@nextcloud/dialogs/dist/index.mjs");
/* harmony import */ var _nextcloud_auth__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @nextcloud/auth */ "./node_modules/@nextcloud/auth/dist/index.es.mjs");
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @nextcloud/router */ "./node_modules/@nextcloud/router/dist/index.js");
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @nextcloud/vue */ "./node_modules/@nextcloud/vue/dist/index.mjs");
/* harmony import */ var _nextcloud_sharing__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @nextcloud/sharing */ "./node_modules/@nextcloud/sharing/dist/index.js");
/* harmony import */ var _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @nextcloud/l10n */ "./node_modules/@nextcloud/l10n/dist/index.mjs");
/* harmony import */ var _services_logger_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../services/logger.js */ "./src/services/logger.js");
/* harmony import */ var _mixins_FetchCollectionContentMixin_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../mixins/FetchCollectionContentMixin.js */ "./src/mixins/FetchCollectionContentMixin.js");

















/**
 * @typedef {object} Collaborator
 * @property {string} id - The id of the collaborator.
 * @property {string} label - The label of the collaborator for display.
 * @property {Type.SHARE_TYPE_USER|Type.SHARE_TYPE_GROUP|Type.SHARE_TYPE_LINK} type - The type of the collaborator.
 */

/**
 * @typedef {Collaborator} SearchResult
 * @property {string} key
 * @property {string} displayName - The label of the collaborator for display.
 * @property {Element} [iconSvg] - An icon to differentiate the collaborator type.
 */

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'CollaboratorsSelectionForm',
  components: {
    Close: vue_material_design_icons_Close_vue__WEBPACK_IMPORTED_MODULE_0__["default"],
    AccountGroup: vue_material_design_icons_AccountGroup_vue__WEBPACK_IMPORTED_MODULE_3__["default"],
    ContentCopy: vue_material_design_icons_ContentCopy_vue__WEBPACK_IMPORTED_MODULE_2__["default"],
    Check: vue_material_design_icons_Check_vue__WEBPACK_IMPORTED_MODULE_1__["default"],
    Earth: vue_material_design_icons_Earth_vue__WEBPACK_IMPORTED_MODULE_4__["default"],
    NcButton: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_10__.NcButton,
    NcListItemIcon: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_10__.NcListItemIcon,
    NcSelect: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_10__.NcSelect
  },
  mixins: [_mixins_FetchCollectionContentMixin_js__WEBPACK_IMPORTED_MODULE_14__["default"]],
  props: {
    albumName: {
      type: String,
      required: true
    },
    /** @type {import('vue').PropType<import('../../store/albums.js').Collaborator[]>} */
    collaborators: {
      type: Array,
      default: () => []
    },
    allowPublicLink: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      searchText: null,
      /** @type {import('../../store/albums.js').IndexedCollaborators} */
      availableCollaborators: {},
      /** @type {string[]} */
      selectedCollaboratorsKeys: [],
      /** @type {import('../../store/albums.js').Collaborator[]} */
      currentSearchResults: [],
      loadingCollaborators: false,
      randomId: Math.random().toString().substring(2, 10),
      publicLinkCopied: false,
      collaboratorTypes: _nextcloud_sharing__WEBPACK_IMPORTED_MODULE_11__.Type,
      config: {
        minSearchStringLength: parseInt(OC.config['sharing.minSearchStringLength'], 10) || 0
      }
    };
  },
  computed: {
    /**
     * @return {SearchResult[]}
     */
    searchResults() {
      return this.currentSearchResults.filter(_ref => {
        let {
          id
        } = _ref;
        return id !== (0,_nextcloud_auth__WEBPACK_IMPORTED_MODULE_8__.getCurrentUser)().uid;
      }).map(collaborator => {
        return {
          ...collaborator,
          key: `${collaborator.type}:${collaborator.id}`,
          iconSvg: collaborator.type === _nextcloud_sharing__WEBPACK_IMPORTED_MODULE_11__.Type.SHARE_TYPE_GROUP ? _mdi_svg_svg_account_group_svg__WEBPACK_IMPORTED_MODULE_5__ : undefined
        };
      }).filter(_ref2 => {
        let {
          key
        } = _ref2;
        return !this.selectedCollaboratorsKeys.includes(key);
      });
    },
    /**
     * @return {string[]}
     */
    listableSelectedCollaboratorsKeys() {
      return this.selectedCollaboratorsKeys.filter(collaboratorKey => this.availableCollaborators[collaboratorKey].type !== _nextcloud_sharing__WEBPACK_IMPORTED_MODULE_11__.Type.SHARE_TYPE_LINK);
    },
    /**
     * @return {import('../../store/albums.js').Collaborator[]}
     */
    selectedCollaborators() {
      return this.selectedCollaboratorsKeys.map(collaboratorKey => this.availableCollaborators[collaboratorKey]);
    },
    /**
     * @return {boolean}
     */
    isPublicLinkSelected() {
      return this.selectedCollaboratorsKeys.includes(`${_nextcloud_sharing__WEBPACK_IMPORTED_MODULE_11__.Type.SHARE_TYPE_LINK}`);
    },
    /** @return {import('../../store/albums.js').Collaborator} */
    publicLink() {
      return this.availableCollaborators[_nextcloud_sharing__WEBPACK_IMPORTED_MODULE_11__.Type.SHARE_TYPE_LINK];
    },
    /** @return {string} */
    publicLinkURL() {
      return `${window.location.protocol}//${window.location.host}${(0,_nextcloud_router__WEBPACK_IMPORTED_MODULE_9__.generateUrl)(`apps/photos/public/${this.publicLink.id}`)}`;
    },
    /**
     * @return {string} The album's filename based on its name. Useful to fetch the location information and content.
     */
    albumFileName() {
      return this.$store.getters.getAlbumName(this.albumName);
    }
  },
  watch: {
    collaborators(collaborators) {
      this.populateCollaborators(collaborators);
    }
  },
  mounted() {
    this.populateCollaborators(this.collaborators);
  },
  methods: {
    ...(0,vuex__WEBPACK_IMPORTED_MODULE_15__.mapActions)(['updateCollection']),
    /**
     * Fetch possible collaborators.
     *
     * @param {string} query
     */
    async searchCollaborators(query) {
      if (query === undefined) {
        return;
      }
      query = query.trim();
      if (query.length < this.config.minSearchStringLength) {
        return;
      }
      try {
        this.loadingCollaborators = true;
        const response = await _nextcloud_axios__WEBPACK_IMPORTED_MODULE_6__["default"].get((0,_nextcloud_router__WEBPACK_IMPORTED_MODULE_9__.generateOcsUrl)('core/autocomplete/get'), {
          params: {
            search: query,
            itemType: 'share-recipients',
            shareTypes: [_nextcloud_sharing__WEBPACK_IMPORTED_MODULE_11__.Type.SHARE_TYPE_USER, _nextcloud_sharing__WEBPACK_IMPORTED_MODULE_11__.Type.SHARE_TYPE_GROUP]
          }
        });
        this.currentSearchResults = response.data.ocs.data.map(collaborator => {
          switch (collaborator.source) {
            case 'users':
              return {
                id: collaborator.id,
                label: collaborator.label,
                type: _nextcloud_sharing__WEBPACK_IMPORTED_MODULE_11__.Type.SHARE_TYPE_USER
              };
            case 'groups':
              return {
                id: collaborator.id,
                label: collaborator.label,
                type: _nextcloud_sharing__WEBPACK_IMPORTED_MODULE_11__.Type.SHARE_TYPE_GROUP
              };
            default:
              throw new Error(`Invalid collaborator source ${collaborator.source}`);
          }
        });
        this.availableCollaborators = {
          ...this.availableCollaborators,
          ...this.currentSearchResults.reduce(this.indexCollaborators, {})
        };
      } catch (error) {
        this.errorFetchingCollaborators = error;
        _services_logger_js__WEBPACK_IMPORTED_MODULE_13__["default"].error(t('photos', 'Failed to fetch collaborators list.'), error);
        (0,_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_7__.showError)(t('photos', 'Failed to fetch collaborators list.'));
      } finally {
        this.loadingCollaborators = false;
      }
    },
    /**
     * Populate selectedCollaboratorsKeys and availableCollaborators.
     *
     * @param {import('../../store/albums.js').Collaborator[]} collaborators - The list of collaborators
     */
    populateCollaborators(collaborators) {
      const initialCollaborators = collaborators.reduce(this.indexCollaborators, {});
      this.selectedCollaboratorsKeys = Object.keys(initialCollaborators);
      this.availableCollaborators = {
        3: {
          id: '',
          label: t('photos', 'Public link'),
          type: _nextcloud_sharing__WEBPACK_IMPORTED_MODULE_11__.Type.SHARE_TYPE_LINK
        },
        ...this.availableCollaborators,
        ...initialCollaborators
      };
    },
    /**
     * @param {import('../../store/albums.js').IndexedCollaborators} collaborators - Index of collaborators
     * @param {import('../../store/albums.js').Collaborator} collaborator - A collaborator
     */
    indexCollaborators(collaborators, collaborator) {
      return {
        ...collaborators,
        [`${collaborator.type}${collaborator.type === _nextcloud_sharing__WEBPACK_IMPORTED_MODULE_11__.Type.SHARE_TYPE_LINK ? '' : ':'}${collaborator.type === _nextcloud_sharing__WEBPACK_IMPORTED_MODULE_11__.Type.SHARE_TYPE_LINK ? '' : collaborator.id}`]: collaborator
      };
    },
    async createPublicLinkForAlbum() {
      this.selectEntity(`${_nextcloud_sharing__WEBPACK_IMPORTED_MODULE_11__.Type.SHARE_TYPE_LINK}`);
      await this.updateAlbumCollaborators();
      await this.fetchCollection(this.albumFileName, ['<nc:location />', '<nc:dateRange />', '<nc:collaborators />']);
    },
    async deletePublicLink() {
      this.unselectEntity(`${_nextcloud_sharing__WEBPACK_IMPORTED_MODULE_11__.Type.SHARE_TYPE_LINK}`);
      this.availableCollaborators[3] = {
        id: '',
        label: t('photos', 'Public link'),
        type: _nextcloud_sharing__WEBPACK_IMPORTED_MODULE_11__.Type.SHARE_TYPE_LINK
      };
      this.publicLinkCopied = false;
      await this.updateAlbumCollaborators();
    },
    async updateAlbumCollaborators() {
      try {
        await this.updateCollection({
          collectionFileName: this.albumFileName,
          properties: {
            collaborators: this.selectedCollaborators
          }
        });
      } catch (error) {
        _services_logger_js__WEBPACK_IMPORTED_MODULE_13__["default"].error('[PublicAlbumContent] Error updating album', {
          error
        });
        (0,_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_7__.showError)(this.t('photos', 'Failed to update album.'));
      }
    },
    async copyPublicLink() {
      await navigator.clipboard.writeText(this.publicLinkURL);
      this.publicLinkCopied = true;
      setTimeout(() => {
        this.publicLinkCopied = false;
      }, 10000);
    },
    selectEntity(collaboratorKey) {
      this.searchText = null;
      if (this.selectedCollaboratorsKeys.includes(collaboratorKey)) {
        return;
      }
      this.selectedCollaboratorsKeys.push(collaboratorKey);
    },
    unselectEntity(collaboratorKey) {
      const index = this.selectedCollaboratorsKeys.indexOf(collaboratorKey);
      if (index === -1) {
        return;
      }
      this.selectedCollaboratorsKeys.splice(index, 1);
    },
    t: _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_12__.translate
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/AlbumForm.vue?vue&type=template&id=1d54fb78&scoped=true&":
/*!*************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/AlbumForm.vue?vue&type=template&id=1d54fb78&scoped=true& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return !_vm.showCollaboratorView ? _c("form", {
    staticClass: "album-form",
    on: {
      submit: function ($event) {
        $event.preventDefault();
        return _vm.submit.apply(null, arguments);
      }
    }
  }, [_c("div", {
    staticClass: "form-inputs"
  }, [_c("NcTextField", {
    ref: "nameInput",
    attrs: {
      value: _vm.albumName,
      type: "text",
      name: "name",
      required: true,
      autofocus: "true",
      label: _vm.t("photos", "Name of the album")
    },
    on: {
      "update:value": function ($event) {
        _vm.albumName = $event;
      }
    }
  }), _vm._v(" "), _c("NcTextField", {
    attrs: {
      value: _vm.albumLocation,
      name: "location",
      type: "text",
      label: _vm.t("photos", "Location of the album")
    },
    on: {
      "update:value": function ($event) {
        _vm.albumLocation = $event;
      }
    },
    scopedSlots: _vm._u([{
      key: "default",
      fn: function () {
        return [_c("MapMarker", {
          attrs: {
            size: 20
          }
        })];
      },
      proxy: true
    }], null, false, 2964444886)
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "form-buttons"
  }, [_c("span", {
    staticClass: "left-buttons"
  }, [_vm.displayBackButton ? _c("NcButton", {
    attrs: {
      type: "tertiary"
    },
    on: {
      click: _vm.back
    }
  }, [_vm._v("\n\t\t\t\t" + _vm._s(_vm.t("photos", "Back")) + "\n\t\t\t")]) : _vm._e()], 1), _vm._v(" "), _c("span", {
    staticClass: "right-buttons"
  }, [_vm.sharingEnabled && !_vm.editMode ? _c("NcButton", {
    attrs: {
      type: "secondary",
      disabled: _vm.albumName.trim() === "" || _vm.loading
    },
    on: {
      click: function ($event) {
        _vm.showCollaboratorView = true;
      }
    },
    scopedSlots: _vm._u([{
      key: "icon",
      fn: function () {
        return [_c("AccountMultiplePlus", {
          attrs: {
            size: 20
          }
        })];
      },
      proxy: true
    }], null, false, 3656768963)
  }, [_vm._v("\n\t\t\t\t" + _vm._s(_vm.t("photos", "Add collaborators")) + "\n\t\t\t")]) : _vm._e(), _vm._v(" "), _c("NcButton", {
    attrs: {
      type: "primary",
      disabled: _vm.albumName === "" || _vm.loading
    },
    on: {
      click: function ($event) {
        return _vm.submit();
      }
    },
    scopedSlots: _vm._u([{
      key: "icon",
      fn: function () {
        return [_vm.loading ? _c("NcLoadingIcon", {
          attrs: {
            size: 20
          }
        }) : _c("Send", {
          attrs: {
            size: 20
          }
        })];
      },
      proxy: true
    }], null, false, 2302891232)
  }, [_vm._v("\n\t\t\t\t" + _vm._s(_vm.editMode ? _vm.t("photos", "Save") : _vm.t("photos", "Create album")) + "\n\t\t\t")])], 1)])]) : _c("CollaboratorsSelectionForm", {
    attrs: {
      "album-name": _vm.albumName,
      "allow-public-link": false
    },
    scopedSlots: _vm._u([{
      key: "default",
      fn: function (_ref) {
        let {
          collaborators
        } = _ref;
        return [_c("span", {
          staticClass: "left-buttons"
        }, [_c("NcButton", {
          attrs: {
            type: "tertiary"
          },
          on: {
            click: function ($event) {
              _vm.showCollaboratorView = false;
            }
          }
        }, [_vm._v("\n\t\t\t\t" + _vm._s(_vm.t("photos", "Back")) + "\n\t\t\t")])], 1), _vm._v(" "), _c("span", {
          staticClass: "right-buttons"
        }, [_c("NcButton", {
          attrs: {
            type: "primary",
            disabled: _vm.albumName.trim() === "" || _vm.loading
          },
          on: {
            click: function ($event) {
              return _vm.submit(collaborators);
            }
          },
          scopedSlots: _vm._u([{
            key: "icon",
            fn: function () {
              return [_vm.loading ? _c("NcLoadingIcon", {
                attrs: {
                  size: 20
                }
              }) : _c("Send", {
                attrs: {
                  size: 20
                }
              })];
            },
            proxy: true
          }], null, true)
        }, [_vm._v("\n\t\t\t\t" + _vm._s(_vm.editMode ? _vm.t("photos", "Save") : _vm.t("photos", "Create album")) + "\n\t\t\t")])], 1)];
      }
    }])
  });
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=template&id=02023324&scoped=true&":
/*!******************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=template&id=02023324&scoped=true& ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "manage-collaborators"
  }, [_c("h2", {
    staticClass: "manage-collaborators__title"
  }, [_vm._v("\n\t\t" + _vm._s(_vm.t("photos", "Add collaborators")) + "\n\t")]), _vm._v(" "), _c("label", {
    staticClass: "manage-collaborators__subtitle",
    attrs: {
      for: "sharing-search-input"
    }
  }, [_vm._v("\n\t\t" + _vm._s(_vm.t("photos", "Add people or groups who can edit your album")) + "\n\t")]), _vm._v(" "), _c("form", {
    staticClass: "manage-collaborators__form",
    on: {
      submit: function ($event) {
        $event.preventDefault();
      }
    }
  }, [_c("NcSelect", {
    attrs: {
      "input-id": "sharing-search-input",
      loading: _vm.loadingCollaborators,
      label: "label",
      filterable: false,
      placeholder: _vm.t("photos", "Search people or groups"),
      "clear-search-on-blur": () => false,
      "user-select": true,
      "append-to-body": false,
      options: _vm.searchResults
    },
    on: {
      search: _vm.searchCollaborators,
      "option:selected": _ref => {
        let {
          key
        } = _ref;
        return _vm.selectEntity(key);
      }
    },
    model: {
      value: _vm.searchText,
      callback: function ($$v) {
        _vm.searchText = $$v;
      },
      expression: "searchText"
    }
  }, [_vm._v("\n\t\t\t" + _vm._s(_vm.t("photos", "No recommendations. Start typing.")) + "\n\t\t")])], 1), _vm._v(" "), _c("ul", {
    staticClass: "manage-collaborators__selection"
  }, _vm._l(_vm.listableSelectedCollaboratorsKeys, function (collaboratorKey) {
    return _c("li", {
      key: collaboratorKey,
      staticClass: "manage-collaborators__selection__item"
    }, [_c("NcListItemIcon", {
      attrs: {
        id: _vm.availableCollaborators[collaboratorKey].id,
        "display-name": _vm.availableCollaborators[collaboratorKey].label,
        name: _vm.availableCollaborators[collaboratorKey].label,
        user: _vm.availableCollaborators[collaboratorKey].id,
        "is-no-user": _vm.availableCollaborators[collaboratorKey].type !== _vm.collaboratorTypes.SHARE_TYPE_USER
      }
    }, [_vm.availableCollaborators[collaboratorKey].type === _vm.collaboratorTypes.SHARE_TYPE_GROUP ? _c("AccountGroup", {
      attrs: {
        title: _vm.t("photos", "Group")
      }
    }) : _vm._e(), _vm._v(" "), _c("NcButton", {
      attrs: {
        type: "tertiary",
        "aria-label": _vm.t("photos", "Remove {collaboratorLabel} from the collaborators list", {
          collaboratorLabel: _vm.availableCollaborators[collaboratorKey].label
        })
      },
      on: {
        click: function ($event) {
          return _vm.unselectEntity(collaboratorKey);
        }
      }
    }, [_c("Close", {
      attrs: {
        slot: "icon",
        size: 20
      },
      slot: "icon"
    })], 1)], 1)], 1);
  }), 0), _vm._v(" "), _c("div", {
    staticClass: "actions"
  }, [_vm.allowPublicLink ? _c("div", {
    staticClass: "actions__public-link"
  }, [_vm.isPublicLinkSelected && _vm.publicLink.id !== "" ? [_c("NcButton", {
    staticClass: "manage-collaborators__public-link-button",
    attrs: {
      "aria-label": _vm.t("photos", "Copy the public link"),
      title: _vm.publicLinkURL
    },
    on: {
      click: _vm.copyPublicLink
    },
    scopedSlots: _vm._u([{
      key: "icon",
      fn: function () {
        return [_vm.publicLinkCopied ? _c("Check") : _c("ContentCopy")];
      },
      proxy: true
    }], null, false, 845538853)
  }, [_vm.publicLinkCopied ? [_vm._v("\n\t\t\t\t\t\t" + _vm._s(_vm.t("photos", "Public link copied!")) + "\n\t\t\t\t\t")] : [_vm._v("\n\t\t\t\t\t\t" + _vm._s(_vm.t("photos", "Copy public link")) + "\n\t\t\t\t\t")]], 2), _vm._v(" "), _c("NcButton", {
    attrs: {
      type: "tertiary",
      "aria-label": _vm.t("photos", "Delete the public link")
    },
    on: {
      click: _vm.deletePublicLink
    }
  }, [_c("Close", {
    attrs: {
      slot: "icon"
    },
    slot: "icon"
  })], 1)] : _c("NcButton", {
    staticClass: "manage-collaborators__public-link-button",
    attrs: {
      disabled: _vm.isPublicLinkSelected && _vm.publicLink.id === "",
      "aria-label": _vm.t("photos", "Create public link share")
    },
    on: {
      click: _vm.createPublicLinkForAlbum
    }
  }, [_c("Earth", {
    attrs: {
      slot: "icon"
    },
    slot: "icon"
  }), _vm._v("\n\t\t\t\t" + _vm._s(_vm.t("photos", "Share via public link")) + "\n\t\t\t")], 1)], 2) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "actions__slot"
  }, [_vm._t("default", null, {
    collaborators: _vm.selectedCollaborators
  })], 2)])]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/AlbumForm.vue?vue&type=style&index=0&id=1d54fb78&lang=scss&scoped=true&":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/AlbumForm.vue?vue&type=style&index=0&id=1d54fb78&lang=scss&scoped=true& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, ".album-form[data-v-1d54fb78] {\n  display: flex;\n  flex-direction: column;\n  height: 350px;\n  padding: calc(var(--default-grid-baseline) * 4);\n}\n.album-form .form-title[data-v-1d54fb78] {\n  font-weight: bold;\n}\n.album-form .form-subtitle[data-v-1d54fb78] {\n  color: var(--color-text-lighter);\n}\n.album-form .form-inputs[data-v-1d54fb78] {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  gap: calc(var(--default-grid-baseline) * 4);\n}\n.album-form .form-buttons[data-v-1d54fb78] {\n  display: flex;\n  justify-content: space-between;\n  flex-direction: column;\n}\n.album-form .form-buttons .left-buttons[data-v-1d54fb78], .album-form .form-buttons .right-buttons[data-v-1d54fb78] {\n  display: flex;\n  gap: calc(var(--default-grid-baseline) * 4);\n}\n.album-form .form-buttons .right-buttons[data-v-1d54fb78] {\n  justify-content: flex-end;\n}\n.left-buttons[data-v-1d54fb78] {\n  flex-grow: 1;\n}\n@media only screen and (max-width: 1020px) {\n.right-buttons[data-v-1d54fb78] {\n    justify-content: flex-end;\n    flex-direction: column;\n}\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=02023324&lang=scss&scoped=true&":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=02023324&lang=scss&scoped=true& ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, ".manage-collaborators[data-v-02023324] {\n  display: flex;\n  flex-direction: column;\n  padding: 20px;\n  height: 500px;\n}\n.manage-collaborators__title[data-v-02023324] {\n  font-weight: bold;\n}\n.manage-collaborators__subtitle[data-v-02023324] {\n  color: var(--color-text-lighter);\n}\n.manage-collaborators__public-link-button[data-v-02023324] {\n  margin: 4px 0;\n}\n.manage-collaborators__form[data-v-02023324] {\n  margin-top: 4px 0;\n  display: flex;\n  flex-direction: column;\n}\n.manage-collaborators__form__input[data-v-02023324] {\n  position: relative;\n  display: block;\n}\n.manage-collaborators__form__input input[data-v-02023324] {\n  width: 100%;\n  padding-left: 34px;\n}\n.manage-collaborators__form__input .loading-icon[data-v-02023324] {\n  position: absolute;\n  top: 8px;\n  right: 8px;\n}\n.manage-collaborators__form__list[data-v-02023324] {\n  padding: 8px;\n  height: 350px;\n  overflow: scroll;\n}\n.manage-collaborators__form__list__result[data-v-02023324] {\n  padding: 8px;\n  border-radius: 100px;\n  box-sizing: border-box;\n}\n.manage-collaborators__form__list__result[data-v-02023324], .manage-collaborators__form__list__result *[data-v-02023324] {\n  cursor: pointer !important;\n}\n.manage-collaborators__form__list__result[data-v-02023324]:hover {\n  background: var(--color-background-dark);\n}\n.manage-collaborators__form__list--empty[data-v-02023324] {\n  margin: 100px 0;\n}\n.manage-collaborators__selection[data-v-02023324] {\n  display: flex;\n  flex-direction: column;\n  margin-top: 32px;\n  flex-grow: 1;\n}\n.manage-collaborators__selection__item[data-v-02023324] {\n  border-radius: var(--border-radius-pill);\n  padding: 0 8px;\n}\n.manage-collaborators__selection__item[data-v-02023324]:hover {\n  background: var(--color-background-dark);\n}\n.manage-collaborators__selection__item[data-v-02023324] .option {\n  gap: 4px;\n}\n.manage-collaborators .actions[data-v-02023324] {\n  display: flex;\n  margin-top: 8px;\n}\n.manage-collaborators .actions__public-link[data-v-02023324] {\n  display: flex;\n  align-items: center;\n}\n.manage-collaborators .actions__public-link button[data-v-02023324] {\n  margin-left: 8px;\n}\n.manage-collaborators .actions__slot[data-v-02023324] {\n  flex-grow: 1;\n  display: flex;\n  justify-content: flex-end;\n  align-items: center;\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/AlbumForm.vue?vue&type=style&index=0&id=1d54fb78&lang=scss&scoped=true&":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/AlbumForm.vue?vue&type=style&index=0&id=1d54fb78&lang=scss&scoped=true& ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumForm_vue_vue_type_style_index_0_id_1d54fb78_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../node_modules/css-loader/dist/cjs.js!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/dist/cjs.js!../../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AlbumForm.vue?vue&type=style&index=0&id=1d54fb78&lang=scss&scoped=true& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/AlbumForm.vue?vue&type=style&index=0&id=1d54fb78&lang=scss&scoped=true&");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumForm_vue_vue_type_style_index_0_id_1d54fb78_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumForm_vue_vue_type_style_index_0_id_1d54fb78_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumForm_vue_vue_type_style_index_0_id_1d54fb78_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumForm_vue_vue_type_style_index_0_id_1d54fb78_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=02023324&lang=scss&scoped=true&":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=02023324&lang=scss&scoped=true& ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaboratorsSelectionForm_vue_vue_type_style_index_0_id_02023324_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../node_modules/css-loader/dist/cjs.js!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/dist/cjs.js!../../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=02023324&lang=scss&scoped=true& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=02023324&lang=scss&scoped=true&");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaboratorsSelectionForm_vue_vue_type_style_index_0_id_02023324_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaboratorsSelectionForm_vue_vue_type_style_index_0_id_02023324_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaboratorsSelectionForm_vue_vue_type_style_index_0_id_02023324_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaboratorsSelectionForm_vue_vue_type_style_index_0_id_02023324_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/components/Albums/AlbumForm.vue":
/*!*********************************************!*\
  !*** ./src/components/Albums/AlbumForm.vue ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _AlbumForm_vue_vue_type_template_id_1d54fb78_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AlbumForm.vue?vue&type=template&id=1d54fb78&scoped=true& */ "./src/components/Albums/AlbumForm.vue?vue&type=template&id=1d54fb78&scoped=true&");
/* harmony import */ var _AlbumForm_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AlbumForm.vue?vue&type=script&lang=js& */ "./src/components/Albums/AlbumForm.vue?vue&type=script&lang=js&");
/* harmony import */ var _AlbumForm_vue_vue_type_style_index_0_id_1d54fb78_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AlbumForm.vue?vue&type=style&index=0&id=1d54fb78&lang=scss&scoped=true& */ "./src/components/Albums/AlbumForm.vue?vue&type=style&index=0&id=1d54fb78&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _AlbumForm_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _AlbumForm_vue_vue_type_template_id_1d54fb78_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render,
  _AlbumForm_vue_vue_type_template_id_1d54fb78_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "1d54fb78",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/components/Albums/AlbumForm.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/components/Albums/CollaboratorsSelectionForm.vue":
/*!**************************************************************!*\
  !*** ./src/components/Albums/CollaboratorsSelectionForm.vue ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _CollaboratorsSelectionForm_vue_vue_type_template_id_02023324_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CollaboratorsSelectionForm.vue?vue&type=template&id=02023324&scoped=true& */ "./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=template&id=02023324&scoped=true&");
/* harmony import */ var _CollaboratorsSelectionForm_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CollaboratorsSelectionForm.vue?vue&type=script&lang=js& */ "./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=script&lang=js&");
/* harmony import */ var _CollaboratorsSelectionForm_vue_vue_type_style_index_0_id_02023324_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=02023324&lang=scss&scoped=true& */ "./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=02023324&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _CollaboratorsSelectionForm_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _CollaboratorsSelectionForm_vue_vue_type_template_id_02023324_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render,
  _CollaboratorsSelectionForm_vue_vue_type_template_id_02023324_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "02023324",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/components/Albums/CollaboratorsSelectionForm.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/components/Albums/AlbumForm.vue?vue&type=script&lang=js&":
/*!**********************************************************************!*\
  !*** ./src/components/Albums/AlbumForm.vue?vue&type=script&lang=js& ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumForm_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AlbumForm.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/AlbumForm.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumForm_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=script&lang=js&":
/*!***************************************************************************************!*\
  !*** ./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaboratorsSelectionForm_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CollaboratorsSelectionForm.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaboratorsSelectionForm_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/components/Albums/AlbumForm.vue?vue&type=template&id=1d54fb78&scoped=true&":
/*!****************************************************************************************!*\
  !*** ./src/components/Albums/AlbumForm.vue?vue&type=template&id=1d54fb78&scoped=true& ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumForm_vue_vue_type_template_id_1d54fb78_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumForm_vue_vue_type_template_id_1d54fb78_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumForm_vue_vue_type_template_id_1d54fb78_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AlbumForm.vue?vue&type=template&id=1d54fb78&scoped=true& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/AlbumForm.vue?vue&type=template&id=1d54fb78&scoped=true&");


/***/ }),

/***/ "./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=template&id=02023324&scoped=true&":
/*!*********************************************************************************************************!*\
  !*** ./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=template&id=02023324&scoped=true& ***!
  \*********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaboratorsSelectionForm_vue_vue_type_template_id_02023324_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaboratorsSelectionForm_vue_vue_type_template_id_02023324_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaboratorsSelectionForm_vue_vue_type_template_id_02023324_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CollaboratorsSelectionForm.vue?vue&type=template&id=02023324&scoped=true& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=template&id=02023324&scoped=true&");


/***/ }),

/***/ "./src/components/Albums/AlbumForm.vue?vue&type=style&index=0&id=1d54fb78&lang=scss&scoped=true&":
/*!*******************************************************************************************************!*\
  !*** ./src/components/Albums/AlbumForm.vue?vue&type=style&index=0&id=1d54fb78&lang=scss&scoped=true& ***!
  \*******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumForm_vue_vue_type_style_index_0_id_1d54fb78_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/style-loader/dist/cjs.js!../../../node_modules/css-loader/dist/cjs.js!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/dist/cjs.js!../../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AlbumForm.vue?vue&type=style&index=0&id=1d54fb78&lang=scss&scoped=true& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/AlbumForm.vue?vue&type=style&index=0&id=1d54fb78&lang=scss&scoped=true&");


/***/ }),

/***/ "./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=02023324&lang=scss&scoped=true&":
/*!************************************************************************************************************************!*\
  !*** ./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=02023324&lang=scss&scoped=true& ***!
  \************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaboratorsSelectionForm_vue_vue_type_style_index_0_id_02023324_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/style-loader/dist/cjs.js!../../../node_modules/css-loader/dist/cjs.js!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/dist/cjs.js!../../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=02023324&lang=scss&scoped=true& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=02023324&lang=scss&scoped=true&");


/***/ })

}]);
//# sourceMappingURL=photos-src_components_Albums_AlbumForm_vue.js.map?v=18a001e0202317c6b2aa