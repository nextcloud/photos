"use strict";
(self["webpackChunkphotos"] = self["webpackChunkphotos"] || []).push([["src_mixins_FetchAlbumsMixin_js-src_components_AlbumForm_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/AlbumForm.vue?vue&type=script&lang=js&":
/*!*******************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/AlbumForm.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var vue_material_design_icons_Send__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue-material-design-icons/Send */ "./node_modules/vue-material-design-icons/Send.vue");
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/vue */ "./node_modules/@nextcloud/vue/dist/ncvuecomponents.js");
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_vue__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _nextcloud_moment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @nextcloud/moment */ "./node_modules/@nextcloud/moment/dist/index.js");
/* harmony import */ var _nextcloud_moment__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_moment__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _Loader_vue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Loader.vue */ "./src/components/Loader.vue");
/* harmony import */ var _CollaboratorsSelectionForm_vue__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./CollaboratorsSelectionForm.vue */ "./src/components/CollaboratorsSelectionForm.vue");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
 // import MapMarker from 'vue-material-design-icons/MapMarker'
// import AccountMultiplePlus from 'vue-material-design-icons/AccountMultiplePlus'






/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'AlbumForm',
  components: {
    Button: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_1__.Button,
    // MapMarker,
    // AccountMultiplePlus,
    Send: vue_material_design_icons_Send__WEBPACK_IMPORTED_MODULE_0__["default"],
    Loader: _Loader_vue__WEBPACK_IMPORTED_MODULE_3__["default"],
    CollaboratorsSelectionForm: _CollaboratorsSelectionForm_vue__WEBPACK_IMPORTED_MODULE_4__["default"]
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
    editMode() {
      return this.album !== null;
    }

  },

  mounted() {
    if (this.editMode) {
      this.albumName = this.album.basename;
      this.albumLocation = this.album.location;
    }

    this.$nextTick(() => {
      this.$refs.nameInput.focus();
    });
  },

  methods: { ...(0,vuex__WEBPACK_IMPORTED_MODULE_5__.mapActions)(['createAlbum', 'renameAlbum', 'updateAlbumLocation']),

    submit() {
      let collaborators = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (this.albumName === '' || this.loading) {
        return;
      }

      if (this.editMode) {
        this.handleUpdateAlbum(collaborators);
      } else {
        this.handleCreateAlbum(collaborators);
      }
    },

    async handleCreateAlbum() {
      let collaborators = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      try {
        this.loading = true;
        const album = await this.createAlbum({
          album: {
            basename: this.albumName,
            nbItems: 0,
            location: this.albumLocation,
            lastPhoto: '',
            date: _nextcloud_moment__WEBPACK_IMPORTED_MODULE_2___default()().format('MMMM YYYY'),
            collaborators
          }
        });
        this.$emit('done', {
          album
        });
      } finally {
        this.loading = false;
      }
    },

    async handleUpdateAlbum() {
      let collaborators = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

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
          album.location = await this.updateAlbumLocation({
            albumName: this.albumName,
            newLocation: this.albumLocation
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

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/CollaboratorsSelectionForm.vue?vue&type=script&lang=js&":
/*!************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/CollaboratorsSelectionForm.vue?vue&type=script&lang=js& ***!
  \************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vue_material_design_icons_Magnify__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue-material-design-icons/Magnify */ "./node_modules/vue-material-design-icons/Magnify.vue");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
  name: 'CollaboratorsSelectionForm',
  components: {
    Magnify: vue_material_design_icons_Magnify__WEBPACK_IMPORTED_MODULE_0__["default"]
  },

  data() {
    return {
      loading: false
    };
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
/* harmony import */ var _AbortControllerMixin__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./AbortControllerMixin */ "./src/mixins/AbortControllerMixin.js");
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

  mixins: [_AbortControllerMixin__WEBPACK_IMPORTED_MODULE_6__["default"]],

  async beforeMount() {
    this.fetchAlbums();
  },

  beforeDestroy() {
    this.cancelAlbumsRequest('Changed view');
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
								</d:prop>
							</d:propfind>`,
          details: true,
          signal: this.abortController.signal
        });
        const albums = response.data.filter(album => album.filename !== '/photos/admin/albums').map(album => (0,_utils_fileUtils_js__WEBPACK_IMPORTED_MODULE_5__.genFileInfo)(album)).map(album => {
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
              date: dateRangeFormated
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

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/AlbumForm.vue?vue&type=style&index=0&id=59290653&lang=scss&scoped=true&":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/AlbumForm.vue?vue&type=style&index=0&id=59290653&lang=scss&scoped=true& ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, ".album-form[data-v-59290653] {\n  display: flex;\n  flex-direction: column;\n  height: 350px;\n  padding: 16px;\n}\n.album-form .form-title[data-v-59290653] {\n  font-weight: bold;\n}\n.album-form .form-subtitle[data-v-59290653] {\n  color: var(--color-text-lighter);\n}\n.album-form .form-inputs[data-v-59290653] {\n  flex-grow: 1;\n  justify-items: flex-end;\n}\n.album-form .form-inputs input[data-v-59290653] {\n  width: 100%;\n}\n.album-form .form-inputs label[data-v-59290653] {\n  display: flex;\n  margin-top: 16px;\n}\n.album-form .form-inputs label[data-v-59290653]  svg {\n  margin-right: 12px;\n}\n.album-form .form-buttons[data-v-59290653] {\n  display: flex;\n  justify-content: space-between;\n}\n.album-form .form-buttons .left-buttons[data-v-59290653], .album-form .form-buttons .right-buttons[data-v-59290653] {\n  display: flex;\n}\n.album-form .form-buttons .right-buttons[data-v-59290653] {\n  justify-content: flex-end;\n}\n.album-form .form-buttons button[data-v-59290653] {\n  margin-right: 16px;\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=414c8cf3&lang=scss&scoped=true&":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=414c8cf3&lang=scss&scoped=true& ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, ".add-collaborators-form[data-v-414c8cf3] {\n  display: flex;\n  flex-direction: column;\n  height: 500px;\n  padding: 16px;\n}\n.add-collaborators-form .form-title[data-v-414c8cf3] {\n  font-weight: bold;\n}\n.add-collaborators-form .form-subtitle[data-v-414c8cf3] {\n  color: var(--color-text-lighter);\n}\n.add-collaborators-form .form-inputs[data-v-414c8cf3] {\n  flex-grow: 1;\n  justify-items: flex-end;\n}\n.add-collaborators-form .form-inputs input[data-v-414c8cf3] {\n  width: 100%;\n}\n.add-collaborators-form .form-inputs label[data-v-414c8cf3] {\n  display: flex;\n  margin-top: 16px;\n}\n.add-collaborators-form .form-inputs label[data-v-414c8cf3]  svg {\n  margin-right: 12px;\n}\n.add-collaborators-form .form-buttons[data-v-414c8cf3] {\n  display: flex;\n  justify-content: space-between;\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/AlbumForm.vue?vue&type=style&index=0&id=59290653&lang=scss&scoped=true&":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/AlbumForm.vue?vue&type=style&index=0&id=59290653&lang=scss&scoped=true& ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumForm_vue_vue_type_style_index_0_id_59290653_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AlbumForm.vue?vue&type=style&index=0&id=59290653&lang=scss&scoped=true& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/AlbumForm.vue?vue&type=style&index=0&id=59290653&lang=scss&scoped=true&");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumForm_vue_vue_type_style_index_0_id_59290653_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumForm_vue_vue_type_style_index_0_id_59290653_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumForm_vue_vue_type_style_index_0_id_59290653_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumForm_vue_vue_type_style_index_0_id_59290653_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=414c8cf3&lang=scss&scoped=true&":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=414c8cf3&lang=scss&scoped=true& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaboratorsSelectionForm_vue_vue_type_style_index_0_id_414c8cf3_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=414c8cf3&lang=scss&scoped=true& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=414c8cf3&lang=scss&scoped=true&");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaboratorsSelectionForm_vue_vue_type_style_index_0_id_414c8cf3_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaboratorsSelectionForm_vue_vue_type_style_index_0_id_414c8cf3_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaboratorsSelectionForm_vue_vue_type_style_index_0_id_414c8cf3_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaboratorsSelectionForm_vue_vue_type_style_index_0_id_414c8cf3_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/components/AlbumForm.vue":
/*!**************************************!*\
  !*** ./src/components/AlbumForm.vue ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _AlbumForm_vue_vue_type_template_id_59290653_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AlbumForm.vue?vue&type=template&id=59290653&scoped=true& */ "./src/components/AlbumForm.vue?vue&type=template&id=59290653&scoped=true&");
/* harmony import */ var _AlbumForm_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AlbumForm.vue?vue&type=script&lang=js& */ "./src/components/AlbumForm.vue?vue&type=script&lang=js&");
/* harmony import */ var _AlbumForm_vue_vue_type_style_index_0_id_59290653_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AlbumForm.vue?vue&type=style&index=0&id=59290653&lang=scss&scoped=true& */ "./src/components/AlbumForm.vue?vue&type=style&index=0&id=59290653&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _AlbumForm_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _AlbumForm_vue_vue_type_template_id_59290653_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render,
  _AlbumForm_vue_vue_type_template_id_59290653_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "59290653",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/components/AlbumForm.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/components/CollaboratorsSelectionForm.vue":
/*!*******************************************************!*\
  !*** ./src/components/CollaboratorsSelectionForm.vue ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _CollaboratorsSelectionForm_vue_vue_type_template_id_414c8cf3_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CollaboratorsSelectionForm.vue?vue&type=template&id=414c8cf3&scoped=true& */ "./src/components/CollaboratorsSelectionForm.vue?vue&type=template&id=414c8cf3&scoped=true&");
/* harmony import */ var _CollaboratorsSelectionForm_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CollaboratorsSelectionForm.vue?vue&type=script&lang=js& */ "./src/components/CollaboratorsSelectionForm.vue?vue&type=script&lang=js&");
/* harmony import */ var _CollaboratorsSelectionForm_vue_vue_type_style_index_0_id_414c8cf3_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=414c8cf3&lang=scss&scoped=true& */ "./src/components/CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=414c8cf3&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _CollaboratorsSelectionForm_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _CollaboratorsSelectionForm_vue_vue_type_template_id_414c8cf3_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render,
  _CollaboratorsSelectionForm_vue_vue_type_template_id_414c8cf3_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "414c8cf3",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/components/CollaboratorsSelectionForm.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/components/AlbumForm.vue?vue&type=script&lang=js&":
/*!***************************************************************!*\
  !*** ./src/components/AlbumForm.vue?vue&type=script&lang=js& ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumForm_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AlbumForm.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/AlbumForm.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumForm_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/components/CollaboratorsSelectionForm.vue?vue&type=script&lang=js&":
/*!********************************************************************************!*\
  !*** ./src/components/CollaboratorsSelectionForm.vue?vue&type=script&lang=js& ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaboratorsSelectionForm_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CollaboratorsSelectionForm.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/CollaboratorsSelectionForm.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaboratorsSelectionForm_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/components/AlbumForm.vue?vue&type=style&index=0&id=59290653&lang=scss&scoped=true&":
/*!************************************************************************************************!*\
  !*** ./src/components/AlbumForm.vue?vue&type=style&index=0&id=59290653&lang=scss&scoped=true& ***!
  \************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumForm_vue_vue_type_style_index_0_id_59290653_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/style-loader/dist/cjs.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AlbumForm.vue?vue&type=style&index=0&id=59290653&lang=scss&scoped=true& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/AlbumForm.vue?vue&type=style&index=0&id=59290653&lang=scss&scoped=true&");


/***/ }),

/***/ "./src/components/CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=414c8cf3&lang=scss&scoped=true&":
/*!*****************************************************************************************************************!*\
  !*** ./src/components/CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=414c8cf3&lang=scss&scoped=true& ***!
  \*****************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaboratorsSelectionForm_vue_vue_type_style_index_0_id_414c8cf3_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/style-loader/dist/cjs.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=414c8cf3&lang=scss&scoped=true& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=414c8cf3&lang=scss&scoped=true&");


/***/ }),

/***/ "./src/components/AlbumForm.vue?vue&type=template&id=59290653&scoped=true&":
/*!*********************************************************************************!*\
  !*** ./src/components/AlbumForm.vue?vue&type=template&id=59290653&scoped=true& ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumForm_vue_vue_type_template_id_59290653_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumForm_vue_vue_type_template_id_59290653_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumForm_vue_vue_type_template_id_59290653_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AlbumForm.vue?vue&type=template&id=59290653&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/AlbumForm.vue?vue&type=template&id=59290653&scoped=true&");


/***/ }),

/***/ "./src/components/CollaboratorsSelectionForm.vue?vue&type=template&id=414c8cf3&scoped=true&":
/*!**************************************************************************************************!*\
  !*** ./src/components/CollaboratorsSelectionForm.vue?vue&type=template&id=414c8cf3&scoped=true& ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaboratorsSelectionForm_vue_vue_type_template_id_414c8cf3_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaboratorsSelectionForm_vue_vue_type_template_id_414c8cf3_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaboratorsSelectionForm_vue_vue_type_template_id_414c8cf3_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CollaboratorsSelectionForm.vue?vue&type=template&id=414c8cf3&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/CollaboratorsSelectionForm.vue?vue&type=template&id=414c8cf3&scoped=true&");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/AlbumForm.vue?vue&type=template&id=59290653&scoped=true&":
/*!************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/AlbumForm.vue?vue&type=template&id=59290653&scoped=true& ***!
  \************************************************************************************************************************************************************************************************************************/
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
          _c("div", { staticClass: "form-inputs" }, [
            _c("input", {
              directives: [
                {
                  name: "model",
                  rawName: "v-model.trim",
                  value: _vm.albumName,
                  expression: "albumName",
                  modifiers: { trim: true },
                },
              ],
              ref: "nameInput",
              attrs: {
                type: "text",
                name: "name",
                required: "",
                autofocus: "true",
                placeholder: _vm.t("photos", "Name of the album"),
              },
              domProps: { value: _vm.albumName },
              on: {
                input: function ($event) {
                  if ($event.target.composing) {
                    return
                  }
                  _vm.albumName = $event.target.value.trim()
                },
                blur: function ($event) {
                  return _vm.$forceUpdate()
                },
              },
            }),
            _vm._v(" "),
            _c(
              "label",
              [
                _c("MapMarker"),
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model.trim",
                      value: _vm.albumLocation,
                      expression: "albumLocation",
                      modifiers: { trim: true },
                    },
                  ],
                  attrs: {
                    name: "location",
                    type: "text",
                    placeholder: _vm.t("photos", "Location of the album"),
                  },
                  domProps: { value: _vm.albumLocation },
                  on: {
                    input: function ($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.albumLocation = $event.target.value.trim()
                    },
                    blur: function ($event) {
                      return _vm.$forceUpdate()
                    },
                  },
                }),
              ],
              1
            ),
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "form-buttons" }, [
            _c(
              "span",
              { staticClass: "left-buttons" },
              [
                _vm.displayBackButton
                  ? _c(
                      "Button",
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
                _c(
                  "Button",
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
                            return [_vm.loading ? _c("Loader") : _c("Send")]
                          },
                          proxy: true,
                        },
                      ],
                      null,
                      false,
                      862849841
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
        staticClass: "add-collaborators-form",
        on: {
          cancel: function ($event) {
            _vm.showCollaboratorView = true
          },
        },
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
                      "Button",
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
                      "Button",
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
                                return [_vm.loading ? _c("Loader") : _c("Send")]
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

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/CollaboratorsSelectionForm.vue?vue&type=template&id=414c8cf3&scoped=true&":
/*!*****************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/CollaboratorsSelectionForm.vue?vue&type=template&id=414c8cf3&scoped=true& ***!
  \*****************************************************************************************************************************************************************************************************************************************/
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
  return _c(
    "form",
    {
      staticClass: "add-collaborators-form",
      on: {
        submit: function ($event) {
          $event.preventDefault()
        },
      },
    },
    [
      _c("h2", { staticClass: "form-title" }, [
        _vm._v(
          "\n\t\t" + _vm._s(_vm.t("photos", "Add collaborators")) + "\n\t"
        ),
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "form-subtitle" }, [
        _vm._v(
          "\n\t\t" +
            _vm._s(_vm.t("photos", "Add users who can edit your album")) +
            "\n\t"
        ),
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "form-subtitle" }, [
        _vm._v(
          "\n\t\t" +
            _vm._s(_vm.t("photos", "Share this album via link")) +
            "\n\t"
        ),
      ]),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "form-inputs" },
        [
          _c("Magnify"),
          _c("input", {
            attrs: {
              type: "text",
              name: "search",
              placeholder: _vm.t(
                "photos",
                "Search users, email or Federated Cloud ID"
              ),
            },
          }),
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "form-buttons" },
        [_vm._t("default", null, { collaborators: "collaborators" })],
        2
      ),
    ]
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ })

}]);
//# sourceMappingURL=photos-src_mixins_FetchAlbumsMixin_js-src_components_AlbumForm_vue.js.map?v=192eb855e0bfa19da939