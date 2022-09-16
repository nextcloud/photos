"use strict";
(self["webpackChunkphotos"] = self["webpackChunkphotos"] || []).push([["src_mixins_FetchAlbumsMixin_js-src_components_Actions_ActionFavorite_vue-src_components_Album-1e5e7f"],{

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
/* harmony import */ var vue_material_design_icons_Star__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue-material-design-icons/Star */ "./node_modules/vue-material-design-icons/Star.vue");
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/vue */ "./node_modules/@nextcloud/vue/dist/ncvuecomponents.js");
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_vue__WEBPACK_IMPORTED_MODULE_1__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
  name: 'ActionFavorite',
  components: {
    Star: vue_material_design_icons_Star__WEBPACK_IMPORTED_MODULE_0__["default"],
    NcActionButton: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_1__.NcActionButton
  },
  props: {
    selectedFileIds: {
      type: Array,
      required: true
    }
  },
  computed: { ...(0,vuex__WEBPACK_IMPORTED_MODULE_2__.mapGetters)(['files']),

    /** @return {boolean} */
    shouldFavoriteSelection() {
      // Favorite all selection if at least one file is not in the favorites.
      return this.selectedFileIds.some(fileId => this.files[fileId].favorite === 0);
    }

  },
  methods: { ...(0,vuex__WEBPACK_IMPORTED_MODULE_2__.mapActions)(['toggleFavoriteForFiles']),

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

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/AlbumForm.vue?vue&type=script&lang=js&":
/*!**************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/AlbumForm.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var vue_material_design_icons_MapMarker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue-material-design-icons/MapMarker */ "./node_modules/vue-material-design-icons/MapMarker.vue");
/* harmony import */ var vue_material_design_icons_AccountMultiplePlus__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-material-design-icons/AccountMultiplePlus */ "./node_modules/vue-material-design-icons/AccountMultiplePlus.vue");
/* harmony import */ var vue_material_design_icons_Send__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vue-material-design-icons/Send */ "./node_modules/vue-material-design-icons/Send.vue");
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @nextcloud/vue */ "./node_modules/@nextcloud/vue/dist/ncvuecomponents.js");
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_vue__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _nextcloud_moment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @nextcloud/moment */ "./node_modules/@nextcloud/moment/dist/index.js");
/* harmony import */ var _nextcloud_moment__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_moment__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _CollaboratorsSelectionForm_vue__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./CollaboratorsSelectionForm.vue */ "./src/components/Albums/CollaboratorsSelectionForm.vue");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
  name: 'AlbumForm',
  components: {
    MapMarker: vue_material_design_icons_MapMarker__WEBPACK_IMPORTED_MODULE_0__["default"],
    AccountMultiplePlus: vue_material_design_icons_AccountMultiplePlus__WEBPACK_IMPORTED_MODULE_1__["default"],
    Send: vue_material_design_icons_Send__WEBPACK_IMPORTED_MODULE_2__["default"],
    NcButton: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_3__.NcButton,
    NcLoadingIcon: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_3__.NcLoadingIcon,
    NcTextField: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_3__.NcTextField,
    CollaboratorsSelectionForm: _CollaboratorsSelectionForm_vue__WEBPACK_IMPORTED_MODULE_5__["default"]
  },
  props: {
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
    }

  },

  mounted() {
    if (this.editMode) {
      this.albumName = this.album.basename;
      this.albumLocation = this.album.location;
    }

    this.$nextTick(() => {
      this.$refs.nameInput.$el.getElementsByTagName('input')[0].focus();
    });
  },

  methods: { ...(0,vuex__WEBPACK_IMPORTED_MODULE_6__.mapActions)(['createAlbum', 'renameAlbum', 'updateAlbum']),

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

    async handleCreateAlbum() {
      let collaborators = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      try {
        this.loading = true;
        let album = await this.createAlbum({
          album: {
            basename: this.albumName,
            nbItems: 0,
            location: this.albumLocation,
            lastPhoto: -1,
            date: _nextcloud_moment__WEBPACK_IMPORTED_MODULE_4___default()().format('MMMM YYYY'),
            collaborators
          }
        });

        if (this.albumLocation !== '' || collaborators.length !== 0) {
          album = await this.updateAlbum({
            albumName: this.albumName,
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
        let album = { ...this.album
        };

        if (this.album.basename !== this.albumName) {
          album = await this.renameAlbum({
            currentAlbumName: this.album.basename,
            newAlbumName: this.albumName
          });
        }

        if (this.album.location !== this.albumLocation) {
          album.location = await this.updateAlbum({
            albumName: this.albumName,
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
    }

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
/* harmony import */ var vue_material_design_icons_Magnify__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue-material-design-icons/Magnify */ "./node_modules/vue-material-design-icons/Magnify.vue");
/* harmony import */ var vue_material_design_icons_Close__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-material-design-icons/Close */ "./node_modules/vue-material-design-icons/Close.vue");
/* harmony import */ var _nextcloud_axios__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @nextcloud/axios */ "./node_modules/@nextcloud/axios/dist/index.esm.js");
/* harmony import */ var _nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @nextcloud/dialogs */ "./node_modules/@nextcloud/dialogs/dist/index.es.js");
/* harmony import */ var _nextcloud_auth__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @nextcloud/auth */ "./node_modules/@nextcloud/auth/dist/index.esm.js");
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @nextcloud/router */ "./node_modules/@nextcloud/router/dist/index.js");
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @nextcloud/vue */ "./node_modules/@nextcloud/vue/dist/ncvuecomponents.js");
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_vue__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _services_logger_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../services/logger.js */ "./src/services/logger.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//








const SHARE = {
  TYPE: {
    USER: 0,
    GROUP: 1 // LINK: 3,

  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'CollaboratorsSelectionForm',
  components: {
    Magnify: vue_material_design_icons_Magnify__WEBPACK_IMPORTED_MODULE_0__["default"],
    Close: vue_material_design_icons_Close__WEBPACK_IMPORTED_MODULE_1__["default"],
    NcLoadingIcon: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_6__.NcLoadingIcon,
    NcButton: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_6__.NcButton,
    NcListItemIcon: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_6__.NcListItemIcon,
    NcTextField: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_6__.NcTextField,
    NcPopover: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_6__.NcPopover
  },
  props: {
    albumName: {
      type: String,
      required: true
    },
    collaborators: {
      type: Array,
      default: () => []
    },
    publicLink: {
      type: String,
      default: ''
    },
    allowPublicLink: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      searchText: '',
      availableCollaborators: {},
      selectedCollaboratorsKeys: [],
      currentSearchResults: [],
      loadingCollaborators: false,
      randomId: Math.random().toString().substring(2, 10),
      publicLinkCopied: false,
      config: {
        minSearchStringLength: parseInt(OC.config['sharing.minSearchStringLength'], 10) || 0
      }
    };
  },

  computed: {
    /**
     * @return {string[]}
     */
    searchResults() {
      return this.currentSearchResults.filter(_ref => {
        let {
          id
        } = _ref;
        return id !== (0,_nextcloud_auth__WEBPACK_IMPORTED_MODULE_4__.getCurrentUser)().uid;
      }).map(_ref2 => {
        let {
          source,
          id
        } = _ref2;
        return `${source}:${id}`;
      }).filter(key => !this.selectedCollaboratorsKeys.includes(key)).map(key => ({
        key,
        height: 48
      }));
    },

    /**
     * @return {object[]}
     */
    selectedCollaborators() {
      return this.selectedCollaboratorsKeys.map(collaboratorKey => this.availableCollaborators[collaboratorKey]);
    }

  },

  mounted() {
    this.searchCollaborators();
    this.selectedCollaboratorsKeys = this.collaborators.map(_ref3 => {
      let {
        source,
        id
      } = _ref3;
      return `${source}:${id}`;
    });
    this.availableCollaborators = { ...this.availableCollaborators,
      ...this.collaborators.reduce((collaborators, collaborator) => ({ ...collaborators,
        [`${collaborator.source}:${collaborator.id}`]: collaborator
      }), {})
    };
  },

  methods: {
    /**
     * Fetch possible collaborators.
     */
    async searchCollaborators() {
      try {
        if (this.searchText.length < this.config.minSearchStringLength) {
          return;
        }

        this.loadingCollaborators = true;
        const response = await _nextcloud_axios__WEBPACK_IMPORTED_MODULE_2__["default"].get((0,_nextcloud_router__WEBPACK_IMPORTED_MODULE_5__.generateOcsUrl)('core/autocomplete/get'), {
          params: {
            search: this.searchText,
            itemType: 'share-recipients',
            shareTypes: [SHARE.TYPE.USER, SHARE.TYPE.GROUP]
          }
        });
        this.currentSearchResults = response.data.ocs.data;
        this.availableCollaborators = { ...this.availableCollaborators,
          ...response.data.ocs.data.reduce((collaborators, collaborator) => ({ ...collaborators,
            [`${collaborator.source}:${collaborator.id}`]: collaborator
          }), {})
        };
      } catch (error) {
        this.errorFetchingCollaborators = error;
        _services_logger_js__WEBPACK_IMPORTED_MODULE_7__["default"].error(t('photos', 'Failed to fetch collaborators list.'), error);
        (0,_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_3__.showError)(t('photos', 'Failed to fetch collaborators list.'));
      } finally {
        this.loadingCollaborators = false;
      }
    },

    // TODO: implement public sharing
    // async createPublicLinkForAlbum() {
    // return axios.put(generateOcsUrl(`apps/photos/createPublicLink/${this.albumName}`))
    // },
    // async deletePublicLink() {
    // return axios.delete(generateOcsUrl(`apps/photos/createPublicLink/${this.albumName}`))
    // },
    // async copyPublicLink() {
    // await navigator.clipboard.writeText(this.publicLink)
    // this.publicLinkCopied = true
    // setTimeout(() => {
    // this.publicLinkCopied = false
    // }, 10000)
    // },
    selectEntity(collaboratorKey) {
      if (this.selectedCollaboratorsKeys.includes(collaboratorKey)) {
        return;
      }

      this.$refs.popover.$refs.popover.hide();
      this.selectedCollaboratorsKeys.push(collaboratorKey);
    },

    unselectEntity(collaboratorKey) {
      const index = this.selectedCollaboratorsKeys.indexOf(collaboratorKey);
      this.selectedCollaboratorsKeys.splice(index, 1);
    }

  }
});

/***/ }),

/***/ "./src/mixins/FetchAlbumsMixin.js":
/*!****************************************!*\
  !*** ./src/mixins/FetchAlbumsMixin.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _nextcloud_moment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/moment */ "./node_modules/@nextcloud/moment/dist/index.js");
/* harmony import */ var _nextcloud_moment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_moment__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/dialogs */ "./node_modules/@nextcloud/dialogs/dist/index.es.js");
/* harmony import */ var _nextcloud_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @nextcloud/auth */ "./node_modules/@nextcloud/auth/dist/index.esm.js");
/* harmony import */ var _services_DavClient_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/DavClient.js */ "./src/services/DavClient.js");
/* harmony import */ var _services_logger_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../services/logger.js */ "./src/services/logger.js");
/* harmony import */ var _utils_fileUtils_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/fileUtils.js */ "./src/utils/fileUtils.js");
/* harmony import */ var _AbortControllerMixin_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./AbortControllerMixin.js */ "./src/mixins/AbortControllerMixin.js");
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
  name: 'FetchAlbumsMixin',

  data() {
    return {
      errorFetchingAlbums: null,
      loadingAlbums: false
    };
  },

  mixins: [_AbortControllerMixin_js__WEBPACK_IMPORTED_MODULE_6__["default"]],

  async beforeMount() {
    this.fetchAlbums();
  },

  computed: { ...(0,vuex__WEBPACK_IMPORTED_MODULE_7__.mapGetters)(['albums'])
  },
  methods: {
    async fetchAlbums() {
      if (this.loadingAlbums) {
        return;
      }

      try {
        this.loadingAlbums = true;
        this.errorFetchingAlbums = null;
        const response = await _services_DavClient_js__WEBPACK_IMPORTED_MODULE_3__["default"].getDirectoryContents(`/photos/${(0,_nextcloud_auth__WEBPACK_IMPORTED_MODULE_2__.getCurrentUser)()?.uid}/albums`, {
          data: `<?xml version="1.0"?>
							<d:propfind xmlns:d="DAV:"
								xmlns:oc="http://owncloud.org/ns"
								xmlns:nc="http://nextcloud.org/ns"
								xmlns:ocs="http://open-collaboration-services.org/ns">
								<d:prop>
									<nc:last-photo />
									<nc:nbItems />
									<nc:location />
									<nc:dateRange />
									<nc:collaborators />
									</d:prop>
									</d:propfind>`,
          // TODO: implement public sharing
          // <nc:publicLink />
          details: true,
          signal: this.abortController.signal
        });
        const albums = response.data.filter(album => album.filename !== `/photos/${(0,_nextcloud_auth__WEBPACK_IMPORTED_MODULE_2__.getCurrentUser)()?.uid}/albums`) // Ensure that we have a proper collaborators array.
        .map(album => {
          if (album.props.collaborators === '') {
            album.props.collaborators = [];
          } else if (typeof album.props.collaborators.collaborator === 'object') {
            if (Array.isArray(album.props.collaborators.collaborator)) {
              album.props.collaborators = album.props.collaborators.collaborator;
            } else {
              album.props.collaborators = [album.props.collaborators.collaborator];
            }
          }

          return album;
        }).map(album => (0,_utils_fileUtils_js__WEBPACK_IMPORTED_MODULE_5__.genFileInfo)(album)).map(album => {
          const dateRange = JSON.parse(album.dateRange?.replace(/&quot;/g, '"') ?? '{}');

          if (dateRange.start === null) {
            dateRange.start = _nextcloud_moment__WEBPACK_IMPORTED_MODULE_0___default()().unix();
            dateRange.end = _nextcloud_moment__WEBPACK_IMPORTED_MODULE_0___default()().unix();
          }

          const dateRangeFormated = {
            startDate: _nextcloud_moment__WEBPACK_IMPORTED_MODULE_0___default().unix(dateRange.start).format('MMMM YYYY'),
            endDate: _nextcloud_moment__WEBPACK_IMPORTED_MODULE_0___default().unix(dateRange.end).format('MMMM YYYY')
          };

          if (dateRangeFormated.startDate === dateRangeFormated.endDate) {
            return { ...album,
              date: dateRangeFormated.startDate
            };
          } else {
            return { ...album,
              date: this.t('photos', '{startDate} to {endDate}', dateRangeFormated)
            };
          }
        });
        this.$store.dispatch('addAlbums', {
          albums
        });
        _services_logger_js__WEBPACK_IMPORTED_MODULE_4__["default"].debug(`[FetchAlbumsMixin] Fetched ${albums.length} new files: `, albums);
      } catch (error) {
        if (error.response?.status === 404) {
          this.errorFetchingAlbums = 404;
        } else if (error.code === 'ERR_CANCELED') {
          return;
        } else {
          this.errorFetchingAlbums = error;
        }

        _services_logger_js__WEBPACK_IMPORTED_MODULE_4__["default"].error(t('photos', 'Failed to fetch albums list.'), error);
        (0,_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_1__.showError)(t('photos', 'Failed to fetch albums list.'));
      } finally {
        this.loadingAlbums = false;
      }
    }

  }
});

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/AlbumForm.vue?vue&type=style&index=0&id=1d54fb78&lang=scss&scoped=true&":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/AlbumForm.vue?vue&type=style&index=0&id=1d54fb78&lang=scss&scoped=true& ***!
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
___CSS_LOADER_EXPORT___.push([module.id, ".album-form[data-v-1d54fb78] {\n  display: flex;\n  flex-direction: column;\n  height: 350px;\n  padding: 16px;\n}\n.album-form .form-title[data-v-1d54fb78] {\n  font-weight: bold;\n}\n.album-form .form-subtitle[data-v-1d54fb78] {\n  color: var(--color-text-lighter);\n}\n.album-form .form-inputs[data-v-1d54fb78] {\n  flex-grow: 1;\n  justify-items: flex-end;\n}\n.album-form .form-inputs input[data-v-1d54fb78] {\n  width: 100%;\n}\n.album-form .form-inputs label[data-v-1d54fb78] {\n  display: flex;\n  margin-top: 16px;\n}\n.album-form .form-inputs label[data-v-1d54fb78]  svg {\n  margin-right: 12px;\n}\n.album-form .form-buttons[data-v-1d54fb78] {\n  display: flex;\n  justify-content: space-between;\n}\n.album-form .form-buttons .left-buttons[data-v-1d54fb78], .album-form .form-buttons .right-buttons[data-v-1d54fb78] {\n  display: flex;\n}\n.album-form .form-buttons .right-buttons[data-v-1d54fb78] {\n  justify-content: flex-end;\n}\n.album-form .form-buttons button[data-v-1d54fb78] {\n  margin-right: 16px;\n}\n.left-buttons[data-v-1d54fb78] {\n  flex-grow: 1;\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=02023324&lang=scss&scoped=true&":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=02023324&lang=scss&scoped=true& ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, ".manage-collaborators[data-v-02023324] {\n  display: flex;\n  flex-direction: column;\n  padding: 20px;\n  height: 500px;\n}\n.manage-collaborators__title[data-v-02023324] {\n  font-weight: bold;\n}\n.manage-collaborators__subtitle[data-v-02023324] {\n  color: var(--color-text-lighter);\n}\n.manage-collaborators__public-link-button[data-v-02023324] {\n  margin: 4px 0;\n}\n.manage-collaborators__form[data-v-02023324] {\n  margin-top: 4px 0;\n  display: flex;\n  flex-direction: column;\n}\n.manage-collaborators__form__input[data-v-02023324] {\n  position: relative;\n  display: block;\n}\n.manage-collaborators__form__input input[data-v-02023324] {\n  width: 100%;\n  padding-left: 34px;\n}\n.manage-collaborators__form__input .loading-icon[data-v-02023324] {\n  position: absolute;\n  top: 8px;\n  right: 8px;\n}\n.manage-collaborators__form__list[data-v-02023324] {\n  padding: 8px;\n}\n.manage-collaborators__form__list__result[data-v-02023324] {\n  padding: 8px;\n  border-radius: 100px;\n  box-sizing: border-box;\n}\n.manage-collaborators__form__list__result[data-v-02023324], .manage-collaborators__form__list__result *[data-v-02023324] {\n  cursor: pointer !important;\n}\n.manage-collaborators__form__list__result[data-v-02023324]:hover {\n  background: var(--color-background-dark);\n}\n.manage-collaborators__selection[data-v-02023324] {\n  display: flex;\n  flex-direction: column;\n  margin-top: 8px;\n  flex-grow: 1;\n}\n.manage-collaborators__selection__item[data-v-02023324] {\n  border-radius: var(--border-radius-pill);\n  padding: 0 8px;\n}\n.manage-collaborators__selection__item[data-v-02023324]:hover {\n  background: var(--color-background-dark);\n}\n.manage-collaborators .actions[data-v-02023324] {\n  display: flex;\n  margin-top: 8px;\n}\n.manage-collaborators .actions__public-link[data-v-02023324] {\n  display: flex;\n  align-items: center;\n}\n.manage-collaborators .actions__slot[data-v-02023324] {\n  flex-grow: 1;\n  display: flex;\n  justify-content: flex-end;\n  align-items: center;\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/AlbumForm.vue?vue&type=style&index=0&id=1d54fb78&lang=scss&scoped=true&":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/AlbumForm.vue?vue&type=style&index=0&id=1d54fb78&lang=scss&scoped=true& ***!
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumForm_vue_vue_type_style_index_0_id_1d54fb78_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../node_modules/css-loader/dist/cjs.js!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/dist/cjs.js!../../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AlbumForm.vue?vue&type=style&index=0&id=1d54fb78&lang=scss&scoped=true& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/AlbumForm.vue?vue&type=style&index=0&id=1d54fb78&lang=scss&scoped=true&");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumForm_vue_vue_type_style_index_0_id_1d54fb78_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumForm_vue_vue_type_style_index_0_id_1d54fb78_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumForm_vue_vue_type_style_index_0_id_1d54fb78_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumForm_vue_vue_type_style_index_0_id_1d54fb78_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=02023324&lang=scss&scoped=true&":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=02023324&lang=scss&scoped=true& ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaboratorsSelectionForm_vue_vue_type_style_index_0_id_02023324_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../node_modules/css-loader/dist/cjs.js!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/dist/cjs.js!../../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=02023324&lang=scss&scoped=true& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=02023324&lang=scss&scoped=true&");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaboratorsSelectionForm_vue_vue_type_style_index_0_id_02023324_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaboratorsSelectionForm_vue_vue_type_style_index_0_id_02023324_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaboratorsSelectionForm_vue_vue_type_style_index_0_id_02023324_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaboratorsSelectionForm_vue_vue_type_style_index_0_id_02023324_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


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

/***/ "./src/components/Albums/AlbumForm.vue?vue&type=style&index=0&id=1d54fb78&lang=scss&scoped=true&":
/*!*******************************************************************************************************!*\
  !*** ./src/components/Albums/AlbumForm.vue?vue&type=style&index=0&id=1d54fb78&lang=scss&scoped=true& ***!
  \*******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumForm_vue_vue_type_style_index_0_id_1d54fb78_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/style-loader/dist/cjs.js!../../../node_modules/css-loader/dist/cjs.js!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/dist/cjs.js!../../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AlbumForm.vue?vue&type=style&index=0&id=1d54fb78&lang=scss&scoped=true& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/AlbumForm.vue?vue&type=style&index=0&id=1d54fb78&lang=scss&scoped=true&");


/***/ }),

/***/ "./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=02023324&lang=scss&scoped=true&":
/*!************************************************************************************************************************!*\
  !*** ./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=02023324&lang=scss&scoped=true& ***!
  \************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaboratorsSelectionForm_vue_vue_type_style_index_0_id_02023324_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/style-loader/dist/cjs.js!../../../node_modules/css-loader/dist/cjs.js!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/dist/cjs.js!../../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=02023324&lang=scss&scoped=true& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=02023324&lang=scss&scoped=true&");


/***/ }),

/***/ "./src/components/Actions/ActionFavorite.vue?vue&type=template&id=607ef4d8&":
/*!**********************************************************************************!*\
  !*** ./src/components/Actions/ActionFavorite.vue?vue&type=template&id=607ef4d8& ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ActionFavorite_vue_vue_type_template_id_607ef4d8___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ActionFavorite_vue_vue_type_template_id_607ef4d8___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ActionFavorite_vue_vue_type_template_id_607ef4d8___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ActionFavorite.vue?vue&type=template&id=607ef4d8& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Actions/ActionFavorite.vue?vue&type=template&id=607ef4d8&");


/***/ }),

/***/ "./src/components/Albums/AlbumForm.vue?vue&type=template&id=1d54fb78&scoped=true&":
/*!****************************************************************************************!*\
  !*** ./src/components/Albums/AlbumForm.vue?vue&type=template&id=1d54fb78&scoped=true& ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumForm_vue_vue_type_template_id_1d54fb78_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumForm_vue_vue_type_template_id_1d54fb78_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumForm_vue_vue_type_template_id_1d54fb78_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AlbumForm.vue?vue&type=template&id=1d54fb78&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/AlbumForm.vue?vue&type=template&id=1d54fb78&scoped=true&");


/***/ }),

/***/ "./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=template&id=02023324&scoped=true&":
/*!*********************************************************************************************************!*\
  !*** ./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=template&id=02023324&scoped=true& ***!
  \*********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaboratorsSelectionForm_vue_vue_type_template_id_02023324_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaboratorsSelectionForm_vue_vue_type_template_id_02023324_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaboratorsSelectionForm_vue_vue_type_template_id_02023324_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CollaboratorsSelectionForm.vue?vue&type=template&id=02023324&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=template&id=02023324&scoped=true&");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Actions/ActionFavorite.vue?vue&type=template&id=607ef4d8&":
/*!*************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Actions/ActionFavorite.vue?vue&type=template&id=607ef4d8& ***!
  \*************************************************************************************************************************************************************************************************************************/
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
  return _vm.shouldFavoriteSelection
    ? _c(
        "NcActionButton",
        {
          attrs: {
            "close-after-click": true,
            "aria-label": _vm.t("photos", "Mark selection as favorite"),
          },
          on: { click: _vm.favoriteSelection },
        },
        [
          _vm._v(
            "\n\t" +
              _vm._s(_vm.t("photos", "Add selection to favorites")) +
              "\n\t"
          ),
          _c("Star", { attrs: { slot: "icon" }, slot: "icon" }),
        ],
        1
      )
    : _c(
        "NcActionButton",
        {
          attrs: {
            "close-after-click": true,
            "aria-label": _vm.t("photos", "Remove selection from favorites"),
          },
          on: { click: _vm.unFavoriteSelection },
        },
        [
          _vm._v(
            "\n\t" +
              _vm._s(_vm.t("photos", "Remove selection from favorites")) +
              "\n\t"
          ),
          _c("Star", { attrs: { slot: "icon" }, slot: "icon" }),
        ],
        1
      )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/AlbumForm.vue?vue&type=template&id=1d54fb78&scoped=true&":
/*!*******************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/AlbumForm.vue?vue&type=template&id=1d54fb78&scoped=true& ***!
  \*******************************************************************************************************************************************************************************************************************************/
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
  return !_vm.showCollaboratorView
    ? _c(
        "form",
        {
          staticClass: "album-form",
          on: {
            submit: function ($event) {
              $event.preventDefault()
              return _vm.submit.apply(null, arguments)
            },
          },
        },
        [
          _c(
            "div",
            { staticClass: "form-inputs" },
            [
              _c("NcTextField", {
                ref: "nameInput",
                attrs: {
                  value: _vm.albumName,
                  type: "text",
                  name: "name",
                  required: true,
                  autofocus: "true",
                  placeholder: _vm.t("photos", "Name of the album"),
                },
                on: {
                  "update:value": function ($event) {
                    _vm.albumName = $event
                  },
                },
              }),
              _vm._v(" "),
              _c(
                "label",
                [
                  _c("MapMarker"),
                  _c("NcTextField", {
                    attrs: {
                      value: _vm.albumLocation,
                      name: "location",
                      type: "text",
                      placeholder: _vm.t("photos", "Location of the album"),
                    },
                    on: {
                      "update:value": function ($event) {
                        _vm.albumLocation = $event
                      },
                    },
                  }),
                ],
                1
              ),
            ],
            1
          ),
          _vm._v(" "),
          _c("div", { staticClass: "form-buttons" }, [
            _c(
              "span",
              { staticClass: "left-buttons" },
              [
                _vm.displayBackButton
                  ? _c(
                      "NcButton",
                      {
                        attrs: {
                          "aria-label": _vm.t(
                            "photos",
                            "Go back to the previous view."
                          ),
                          type: "tertiary",
                        },
                        on: { click: _vm.back },
                      },
                      [
                        _vm._v(
                          "\n\t\t\t\t" +
                            _vm._s(_vm.t("photos", "Back")) +
                            "\n\t\t\t"
                        ),
                      ]
                    )
                  : _vm._e(),
              ],
              1
            ),
            _vm._v(" "),
            _c(
              "span",
              { staticClass: "right-buttons" },
              [
                _vm.sharingEnabled && !_vm.editMode
                  ? _c(
                      "NcButton",
                      {
                        attrs: {
                          "aria-label": _vm.t(
                            "photos",
                            "Go to the add collaborators view."
                          ),
                          type: "secondary",
                          disabled: _vm.albumName.trim() === "" || _vm.loading,
                        },
                        on: {
                          click: function ($event) {
                            _vm.showCollaboratorView = true
                          },
                        },
                        scopedSlots: _vm._u(
                          [
                            {
                              key: "icon",
                              fn: function () {
                                return [_c("AccountMultiplePlus")]
                              },
                              proxy: true,
                            },
                          ],
                          null,
                          false,
                          1531126728
                        ),
                      },
                      [
                        _vm._v(
                          "\n\t\t\t\t" +
                            _vm._s(_vm.t("photos", "Add collaborators")) +
                            "\n\t\t\t"
                        ),
                      ]
                    )
                  : _vm._e(),
                _vm._v(" "),
                _c(
                  "NcButton",
                  {
                    attrs: {
                      "aria-label": _vm.editMode
                        ? _vm.t("photos", "Save.")
                        : _vm.t("photos", "Create the album."),
                      type: "primary",
                      disabled: _vm.albumName === "" || _vm.loading,
                    },
                    on: {
                      click: function ($event) {
                        return _vm.submit()
                      },
                    },
                    scopedSlots: _vm._u(
                      [
                        {
                          key: "icon",
                          fn: function () {
                            return [
                              _vm.loading ? _c("NcLoadingIcon") : _c("Send"),
                            ]
                          },
                          proxy: true,
                        },
                      ],
                      null,
                      false,
                      3914512768
                    ),
                  },
                  [
                    _vm._v(
                      "\n\t\t\t\t" +
                        _vm._s(
                          _vm.editMode
                            ? _vm.t("photos", "Save")
                            : _vm.t("photos", "Create album")
                        ) +
                        "\n\t\t\t"
                    ),
                  ]
                ),
              ],
              1
            ),
          ]),
        ]
      )
    : _c("CollaboratorsSelectionForm", {
        attrs: { "album-name": _vm.albumName, "allow-public-link": false },
        scopedSlots: _vm._u([
          {
            key: "default",
            fn: function (ref) {
              var collaborators = ref.collaborators
              return [
                _c(
                  "span",
                  { staticClass: "left-buttons" },
                  [
                    _c(
                      "NcButton",
                      {
                        attrs: {
                          "aria-label": _vm.t(
                            "photos",
                            "Back to the new album form."
                          ),
                          type: "tertiary",
                        },
                        on: {
                          click: function ($event) {
                            _vm.showCollaboratorView = false
                          },
                        },
                      },
                      [
                        _vm._v(
                          "\n\t\t\t\t" +
                            _vm._s(_vm.t("photos", "Back")) +
                            "\n\t\t\t"
                        ),
                      ]
                    ),
                  ],
                  1
                ),
                _vm._v(" "),
                _c(
                  "span",
                  { staticClass: "right-buttons" },
                  [
                    _c(
                      "NcButton",
                      {
                        attrs: {
                          "aria-label": _vm.editMode
                            ? _vm.t("photos", "Save.")
                            : _vm.t("photos", "Create the album."),
                          type: "primary",
                          disabled: _vm.albumName.trim() === "" || _vm.loading,
                        },
                        on: {
                          click: function ($event) {
                            return _vm.submit(collaborators)
                          },
                        },
                        scopedSlots: _vm._u(
                          [
                            {
                              key: "icon",
                              fn: function () {
                                return [
                                  _vm.loading
                                    ? _c("NcLoadingIcon")
                                    : _c("Send"),
                                ]
                              },
                              proxy: true,
                            },
                          ],
                          null,
                          true
                        ),
                      },
                      [
                        _vm._v(
                          "\n\t\t\t\t" +
                            _vm._s(
                              _vm.editMode
                                ? _vm.t("photos", "Save")
                                : _vm.t("photos", "Create album")
                            ) +
                            "\n\t\t\t"
                        ),
                      ]
                    ),
                  ],
                  1
                ),
              ]
            },
          },
        ]),
      })
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=template&id=02023324&scoped=true&":
/*!************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=template&id=02023324&scoped=true& ***!
  \************************************************************************************************************************************************************************************************************************************************/
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
  return _c("div", { staticClass: "manage-collaborators" }, [
    _c("h2", { staticClass: "manage-collaborators__title" }, [
      _vm._v("\n\t\t" + _vm._s(_vm.t("photos", "Add collaborators")) + "\n\t"),
    ]),
    _vm._v(" "),
    _c("div", { staticClass: "manage-collaborators__subtitle" }, [
      _vm._v(
        "\n\t\t" +
          _vm._s(
            _vm.t("photos", "Add people or groups who can edit your album")
          ) +
          "\n\t"
      ),
    ]),
    _vm._v(" "),
    _c(
      "form",
      {
        staticClass: "manage-collaborators__form",
        on: {
          submit: function ($event) {
            $event.preventDefault()
          },
        },
      },
      [
        _c(
          "NcPopover",
          { ref: "popover", attrs: { "auto-size": true, distance: 0 } },
          [
            _c(
              "label",
              {
                staticClass: "manage-collaborators__form__input",
                attrs: { slot: "trigger" },
                slot: "trigger",
              },
              [
                _c(
                  "NcTextField",
                  {
                    attrs: {
                      value: _vm.searchText,
                      autocomplete: "off",
                      type: "search",
                      name: "search",
                      "aria-label": _vm.t("photos", "Search for collaborators"),
                      "aria-autocomplete": "list",
                      "aria-controls":
                        "manage-collaborators__form__selection-" +
                        _vm.randomId +
                        " manage-collaborators__form__list-" +
                        _vm.randomId,
                      placeholder: _vm.t("photos", "Search people or groups"),
                    },
                    on: {
                      "update:value": function ($event) {
                        _vm.searchText = $event
                      },
                      input: _vm.searchCollaborators,
                    },
                  },
                  [_c("Magnify", { attrs: { size: 16 } })],
                  1
                ),
                _vm._v(" "),
                _vm.loadingCollaborators ? _c("NcLoadingIcon") : _vm._e(),
              ],
              1
            ),
            _vm._v(" "),
            _c(
              "ul",
              {
                staticClass: "manage-collaborators__form__list",
                attrs: {
                  id: "manage-collaborators__form__list-" + _vm.randomId,
                },
              },
              _vm._l(_vm.searchResults, function (result) {
                return _c("li", { key: result.key }, [
                  _c(
                    "a",
                    [
                      _c("NcListItemIcon", {
                        staticClass: "manage-collaborators__form__list__result",
                        attrs: {
                          id: _vm.availableCollaborators[result.key].id,
                          title: _vm.availableCollaborators[result.key].id,
                          search: _vm.searchText,
                          "display-name":
                            _vm.availableCollaborators[result.key].label,
                          "aria-label": _vm.t(
                            "photos",
                            "Add {collaboratorLabel} to the collaborators list",
                            {
                              collaboratorLabel:
                                _vm.availableCollaborators[result.key].label,
                            }
                          ),
                        },
                        on: {
                          click: function ($event) {
                            return _vm.selectEntity(result.key)
                          },
                        },
                      }),
                    ],
                    1
                  ),
                ])
              }),
              0
            ),
          ]
        ),
      ],
      1
    ),
    _vm._v(" "),
    _c(
      "ul",
      { staticClass: "manage-collaborators__selection" },
      _vm._l(_vm.selectedCollaboratorsKeys, function (collaboratorKey) {
        return _c(
          "li",
          {
            key: collaboratorKey,
            staticClass: "manage-collaborators__selection__item",
          },
          [
            _c(
              "NcListItemIcon",
              {
                attrs: {
                  id: _vm.availableCollaborators[collaboratorKey].id,
                  title: _vm.availableCollaborators[collaboratorKey].id,
                  "display-name":
                    _vm.availableCollaborators[collaboratorKey].label,
                  "aria-label": _vm.t(
                    "photos",
                    "Remove {collaboratorLabel} from the collaborators list",
                    {
                      collaboratorLabel:
                        _vm.availableCollaborators[collaboratorKey].label,
                    }
                  ),
                },
              },
              [
                _c(
                  "NcButton",
                  {
                    attrs: {
                      type: "tertiary",
                      "aria-label": _vm.t(
                        "photos",
                        "Remove {collaboratorLabel} from the collaborators list",
                        {
                          collaboratorLabel:
                            _vm.availableCollaborators[collaboratorKey].label,
                        }
                      ),
                    },
                    on: {
                      click: function ($event) {
                        return _vm.unselectEntity(collaboratorKey)
                      },
                    },
                  },
                  [
                    _c("Close", {
                      attrs: { slot: "icon", size: 20 },
                      slot: "icon",
                    }),
                  ],
                  1
                ),
              ],
              1
            ),
          ],
          1
        )
      }),
      0
    ),
    _vm._v(" "),
    _c("div", { staticClass: "actions" }, [
      _c(
        "div",
        { staticClass: "actions__slot" },
        [_vm._t("default", null, { collaborators: _vm.selectedCollaborators })],
        2
      ),
    ]),
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ })

}]);
//# sourceMappingURL=photos-src_mixins_FetchAlbumsMixin_js-src_components_Actions_ActionFavorite_vue-src_components_Album-1e5e7f.js.map?v=f5e6627287126f7a1cb6