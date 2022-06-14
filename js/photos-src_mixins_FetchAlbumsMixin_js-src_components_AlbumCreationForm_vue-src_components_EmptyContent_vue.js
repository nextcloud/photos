(self["webpackChunkphotos"] = self["webpackChunkphotos"] || []).push([["src_mixins_FetchAlbumsMixin_js-src_components_AlbumCreationForm_vue-src_components_EmptyContent_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/AlbumCreationForm.vue?vue&type=script&lang=js&":
/*!***************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/AlbumCreationForm.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vue_material_design_icons_MapMarker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue-material-design-icons/MapMarker */ "./node_modules/vue-material-design-icons/MapMarker.vue");
/* harmony import */ var vue_material_design_icons_AccountMultiplePlus__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-material-design-icons/AccountMultiplePlus */ "./node_modules/vue-material-design-icons/AccountMultiplePlus.vue");
/* harmony import */ var vue_material_design_icons_Send__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vue-material-design-icons/Send */ "./node_modules/vue-material-design-icons/Send.vue");
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @nextcloud/vue */ "./node_modules/@nextcloud/vue/dist/ncvuecomponents.js");
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_vue__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _components_Loader_vue__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/Loader.vue */ "./src/components/Loader.vue");
/* harmony import */ var _components_CollaboratorsSelectionForm_vue__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../components/CollaboratorsSelectionForm.vue */ "./src/components/CollaboratorsSelectionForm.vue");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
  name: 'AlbumCreationForm',
  components: {
    Button: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_3__.Button,
    MapMarker: vue_material_design_icons_MapMarker__WEBPACK_IMPORTED_MODULE_0__["default"],
    AccountMultiplePlus: vue_material_design_icons_AccountMultiplePlus__WEBPACK_IMPORTED_MODULE_1__["default"],
    Send: vue_material_design_icons_Send__WEBPACK_IMPORTED_MODULE_2__["default"],
    Loader: _components_Loader_vue__WEBPACK_IMPORTED_MODULE_4__["default"],
    CollaboratorsSelectionForm: _components_CollaboratorsSelectionForm_vue__WEBPACK_IMPORTED_MODULE_5__["default"]
  },
  props: {
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

  mounted() {
    this.$nextTick(() => {
      this.$refs.nameInput.focus();
    });
  },

  methods: {
    async createAlbum() {
      let collaborators = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      try {
        this.loading = true;
        const album = await this.$store.dispatch('createAlbum', {
          album: {
            name: this.albumName,
            location: this.albumLocation,
            collaborators
          }
        });
        this.$emit('album-created', {
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

"use strict";
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
  },

  methods: {}
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/EmptyContent.vue?vue&type=script&lang=js&":
/*!**********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/EmptyContent.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'EmptyContent',
  props: {
    illustrationName: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      illustration: ''
    };
  },

  computed: {
    /**
     * Does this component have an illustration
     *
     * @return {boolean}
     */
    haveIllustration() {
      return this.illustrationName !== '';
    },

    /**
     * Is the illustration loaded
     *
     * @return {boolean}
     */
    isLoaded() {
      if (!this.haveIllustration) {
        return true;
      }

      return this.illustration !== '';
    },

    /**
     * The component is ready if the illustration
     * is done loading or if there is none
     *
     * @return {boolean}
     */
    isReady() {
      return !this.haveIllustration || this.haveIllustration && this.isLoaded;
    }

  },

  /**
   * Fetch the new illustration as soon as it changes
   */
  watch: {
    illustrationName() {
      this.getIllustration();
    }

  },

  beforeMount() {
    this.getIllustration();
  },

  methods: {
    /**
     * Fetch the illustration as webpack chunk
     */
    async getIllustration() {
      this.illustration = '';

      if (this.illustrationName !== '') {
        try {
          const illustration = await __webpack_require__("./src/assets/Illustrations lazy recursive ^\\.\\/.*\\.svg$")(`./${this.illustrationName}.svg`);
          this.illustration = illustration.default;
        } catch (error) {
          console.error('Could not get the error illustration', error);
        }
      }
    }

  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Loader.vue?vue&type=script&lang=js&":
/*!****************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Loader.vue?vue&type=script&lang=js& ***!
  \****************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
  name: 'Loader'
});

/***/ }),

/***/ "./src/mixins/FetchAlbumsMixin.js":
/*!****************************************!*\
  !*** ./src/mixins/FetchAlbumsMixin.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _services_Albums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/Albums.js */ "./src/services/Albums.js");
/* harmony import */ var _utils_CancelableRequest_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/CancelableRequest.js */ "./src/utils/CancelableRequest.js");
/* provided dependency */ var console = __webpack_require__(/*! ./node_modules/console-browserify/index.js */ "./node_modules/console-browserify/index.js");
/**
 * @copyright Copyright (c) 2019 Louis Chemineau <louis@chmn.me>
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
      loadingAlbums: false,
      cancelAlbumsRequest: () => {}
    };
  },

  async beforeMount() {
    this.fetchAlbums();
  },

  beforeDestroy() {
    this.cancelAlbumsRequest('Changed view');
  },

  computed: { ...(0,vuex__WEBPACK_IMPORTED_MODULE_2__.mapGetters)(['albums'])
  },
  methods: {
    async fetchAlbums() {
      if (this.loadingAlbums) {
        return;
      }

      try {
        this.loadingAlbums = true;
        this.errorFetchingAlbums = null;
        const {
          request,
          cancel
        } = (0,_utils_CancelableRequest_js__WEBPACK_IMPORTED_MODULE_1__["default"])(_services_Albums_js__WEBPACK_IMPORTED_MODULE_0__["default"]);
        this.cancelAlbumsRequest = cancel;
        const albums = await request();
        this.$store.dispatch('addAlbums', {
          albums
        });
      } catch (error) {
        if (error.response && error.response.status) {
          if (error.response.status === 404) {
            this.errorFetchingAlbums = 404;
          } else {
            this.errorFetchingAlbums = error;
          }
        } // cancelled request, moving on...


        console.error('Error fetching albums', error);
      } finally {
        this.cancelAlbumsRequest = () => {};

        this.loadingAlbums = false;
      }
    }

  }
});

/***/ }),

/***/ "./src/services/Albums.js":
/*!********************************!*\
  !*** ./src/services/Albums.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _nextcloud_axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/axios */ "./node_modules/@nextcloud/axios/dist/index.js");
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/router */ "./node_modules/@nextcloud/router/dist/index.js");
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


/**
 * @typedef {object} Album
 * @property {string} id - The id of the album.
 * @property {string} name - The name of the album.
 * @property {number} creationDate - The creation date of the album.
 * @property {string} isShared - Whether the current user as shared the album.
 * @property {string} isCollaborative - Whether the album can be edited by other users.
 * @property {number} itemCount - The number of item in the album.
 * @property {number} cover - The cover of the album.
 */

/**
 * List albums.
 *
 * @return {Promise<Album[]>} the album list
 */

/* harmony default export */ async function __WEBPACK_DEFAULT_EXPORT__() {
  const response = await _nextcloud_axios__WEBPACK_IMPORTED_MODULE_0__["default"].get((0,_nextcloud_router__WEBPACK_IMPORTED_MODULE_1__.generateUrl)('/apps/photos/api/v1/albums'));
  return response.data.map(album => ({
    id: `${album.fileid}`,
    name: album.basename,
    location: 'Paris',
    creationDate: album.lastmod,
    state: 0,
    itemCount: 100,
    cover: '13397'
  }));
}

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/AlbumCreationForm.vue?vue&type=style&index=0&id=91dab95c&lang=scss&scoped=true&":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/AlbumCreationForm.vue?vue&type=style&index=0&id=91dab95c&lang=scss&scoped=true& ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, ".album-creation-form[data-v-91dab95c] {\n  display: flex;\n  flex-direction: column;\n  height: 350px;\n  padding: 16px;\n}\n.album-creation-form .form-title[data-v-91dab95c] {\n  font-weight: bold;\n}\n.album-creation-form .form-subtitle[data-v-91dab95c] {\n  color: var(--color-text-lighter);\n}\n.album-creation-form .form-inputs[data-v-91dab95c] {\n  flex-grow: 1;\n  justify-items: flex-end;\n}\n.album-creation-form .form-inputs input[data-v-91dab95c] {\n  width: 100%;\n}\n.album-creation-form .form-inputs label[data-v-91dab95c] {\n  display: flex;\n  margin-top: 16px;\n}\n.album-creation-form .form-inputs label[data-v-91dab95c]  svg {\n  margin-right: 12px;\n}\n.album-creation-form .form-buttons[data-v-91dab95c] {\n  display: flex;\n  justify-content: space-between;\n}\n.album-creation-form .form-buttons .left-buttons[data-v-91dab95c], .album-creation-form .form-buttons .right-buttons[data-v-91dab95c] {\n  display: flex;\n}\n.album-creation-form .form-buttons .right-buttons[data-v-91dab95c] {\n  justify-content: flex-end;\n}\n.album-creation-form .form-buttons button[data-v-91dab95c] {\n  margin-right: 16px;\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=414c8cf3&lang=scss&scoped=true&":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=414c8cf3&lang=scss&scoped=true& ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, ".add-collaborators-form[data-v-414c8cf3] {\n  display: flex;\n  flex-direction: column;\n  height: 500px;\n  padding: 16px;\n}\n.add-collaborators-form .form-title[data-v-414c8cf3] {\n  font-weight: bold;\n}\n.add-collaborators-form .form-subtitle[data-v-414c8cf3] {\n  color: var(--color-text-lighter);\n}\n.add-collaborators-form .form-inputs[data-v-414c8cf3] {\n  flex-grow: 1;\n  justify-items: flex-end;\n}\n.add-collaborators-form .form-inputs input[data-v-414c8cf3] {\n  width: 100%;\n}\n.add-collaborators-form .form-inputs label[data-v-414c8cf3] {\n  display: flex;\n  margin-top: 16px;\n}\n.add-collaborators-form .form-inputs label[data-v-414c8cf3]  svg {\n  margin-right: 12px;\n}\n.add-collaborators-form .form-buttons[data-v-414c8cf3] {\n  display: flex;\n  justify-content: space-between;\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/EmptyContent.vue?vue&type=style&index=0&lang=scss&":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/EmptyContent.vue?vue&type=style&index=0&lang=scss& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, ".emptycontent {\n  grid-column: 1/-1;\n  margin-top: 20vh;\n}\n.illustration {\n  min-width: 200px;\n  max-width: 15%;\n  width: 300px;\n  margin: auto;\n  margin-bottom: 20px;\n  position: relative;\n}\n.illustration svg {\n  width: 100%;\n  height: 100%;\n  max-height: 40vh;\n}\n.illustration [fill*=\"6c63ff\"] {\n  fill: var(--color-primary-element);\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Loader.vue?vue&type=style&index=0&lang=scss&":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Loader.vue?vue&type=style&index=0&lang=scss& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, ".loader {\n  display: grid;\n  height: 60px;\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/AlbumCreationForm.vue?vue&type=style&index=0&id=91dab95c&lang=scss&scoped=true&":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/AlbumCreationForm.vue?vue&type=style&index=0&id=91dab95c&lang=scss&scoped=true& ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumCreationForm_vue_vue_type_style_index_0_id_91dab95c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AlbumCreationForm.vue?vue&type=style&index=0&id=91dab95c&lang=scss&scoped=true& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/AlbumCreationForm.vue?vue&type=style&index=0&id=91dab95c&lang=scss&scoped=true&");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumCreationForm_vue_vue_type_style_index_0_id_91dab95c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumCreationForm_vue_vue_type_style_index_0_id_91dab95c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumCreationForm_vue_vue_type_style_index_0_id_91dab95c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumCreationForm_vue_vue_type_style_index_0_id_91dab95c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=414c8cf3&lang=scss&scoped=true&":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=414c8cf3&lang=scss&scoped=true& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/EmptyContent.vue?vue&type=style&index=0&lang=scss&":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/EmptyContent.vue?vue&type=style&index=0&lang=scss& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_EmptyContent_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./EmptyContent.vue?vue&type=style&index=0&lang=scss& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/EmptyContent.vue?vue&type=style&index=0&lang=scss&");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_EmptyContent_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_EmptyContent_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_EmptyContent_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_EmptyContent_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Loader.vue?vue&type=style&index=0&lang=scss&":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Loader.vue?vue&type=style&index=0&lang=scss& ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Loader_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Loader.vue?vue&type=style&index=0&lang=scss& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Loader.vue?vue&type=style&index=0&lang=scss&");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Loader_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Loader_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Loader_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Loader_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/components/AlbumCreationForm.vue":
/*!**********************************************!*\
  !*** ./src/components/AlbumCreationForm.vue ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _AlbumCreationForm_vue_vue_type_template_id_91dab95c_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AlbumCreationForm.vue?vue&type=template&id=91dab95c&scoped=true& */ "./src/components/AlbumCreationForm.vue?vue&type=template&id=91dab95c&scoped=true&");
/* harmony import */ var _AlbumCreationForm_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AlbumCreationForm.vue?vue&type=script&lang=js& */ "./src/components/AlbumCreationForm.vue?vue&type=script&lang=js&");
/* harmony import */ var _AlbumCreationForm_vue_vue_type_style_index_0_id_91dab95c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AlbumCreationForm.vue?vue&type=style&index=0&id=91dab95c&lang=scss&scoped=true& */ "./src/components/AlbumCreationForm.vue?vue&type=style&index=0&id=91dab95c&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _AlbumCreationForm_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _AlbumCreationForm_vue_vue_type_template_id_91dab95c_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render,
  _AlbumCreationForm_vue_vue_type_template_id_91dab95c_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "91dab95c",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/components/AlbumCreationForm.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/components/CollaboratorsSelectionForm.vue":
/*!*******************************************************!*\
  !*** ./src/components/CollaboratorsSelectionForm.vue ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

/***/ "./src/components/EmptyContent.vue":
/*!*****************************************!*\
  !*** ./src/components/EmptyContent.vue ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _EmptyContent_vue_vue_type_template_id_6c3ea49c___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EmptyContent.vue?vue&type=template&id=6c3ea49c& */ "./src/components/EmptyContent.vue?vue&type=template&id=6c3ea49c&");
/* harmony import */ var _EmptyContent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EmptyContent.vue?vue&type=script&lang=js& */ "./src/components/EmptyContent.vue?vue&type=script&lang=js&");
/* harmony import */ var _EmptyContent_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./EmptyContent.vue?vue&type=style&index=0&lang=scss& */ "./src/components/EmptyContent.vue?vue&type=style&index=0&lang=scss&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _EmptyContent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _EmptyContent_vue_vue_type_template_id_6c3ea49c___WEBPACK_IMPORTED_MODULE_0__.render,
  _EmptyContent_vue_vue_type_template_id_6c3ea49c___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/components/EmptyContent.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/components/Loader.vue":
/*!***********************************!*\
  !*** ./src/components/Loader.vue ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Loader_vue_vue_type_template_id_04a0d67a___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Loader.vue?vue&type=template&id=04a0d67a& */ "./src/components/Loader.vue?vue&type=template&id=04a0d67a&");
/* harmony import */ var _Loader_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Loader.vue?vue&type=script&lang=js& */ "./src/components/Loader.vue?vue&type=script&lang=js&");
/* harmony import */ var _Loader_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Loader.vue?vue&type=style&index=0&lang=scss& */ "./src/components/Loader.vue?vue&type=style&index=0&lang=scss&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _Loader_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _Loader_vue_vue_type_template_id_04a0d67a___WEBPACK_IMPORTED_MODULE_0__.render,
  _Loader_vue_vue_type_template_id_04a0d67a___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/components/Loader.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/components/AlbumCreationForm.vue?vue&type=script&lang=js&":
/*!***********************************************************************!*\
  !*** ./src/components/AlbumCreationForm.vue?vue&type=script&lang=js& ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumCreationForm_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AlbumCreationForm.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/AlbumCreationForm.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumCreationForm_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/components/CollaboratorsSelectionForm.vue?vue&type=script&lang=js&":
/*!********************************************************************************!*\
  !*** ./src/components/CollaboratorsSelectionForm.vue?vue&type=script&lang=js& ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaboratorsSelectionForm_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CollaboratorsSelectionForm.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/CollaboratorsSelectionForm.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaboratorsSelectionForm_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/components/EmptyContent.vue?vue&type=script&lang=js&":
/*!******************************************************************!*\
  !*** ./src/components/EmptyContent.vue?vue&type=script&lang=js& ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_EmptyContent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./EmptyContent.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/EmptyContent.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_EmptyContent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/components/Loader.vue?vue&type=script&lang=js&":
/*!************************************************************!*\
  !*** ./src/components/Loader.vue?vue&type=script&lang=js& ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Loader_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Loader.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Loader.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Loader_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/components/AlbumCreationForm.vue?vue&type=style&index=0&id=91dab95c&lang=scss&scoped=true&":
/*!********************************************************************************************************!*\
  !*** ./src/components/AlbumCreationForm.vue?vue&type=style&index=0&id=91dab95c&lang=scss&scoped=true& ***!
  \********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumCreationForm_vue_vue_type_style_index_0_id_91dab95c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/style-loader/dist/cjs.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AlbumCreationForm.vue?vue&type=style&index=0&id=91dab95c&lang=scss&scoped=true& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/AlbumCreationForm.vue?vue&type=style&index=0&id=91dab95c&lang=scss&scoped=true&");


/***/ }),

/***/ "./src/components/CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=414c8cf3&lang=scss&scoped=true&":
/*!*****************************************************************************************************************!*\
  !*** ./src/components/CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=414c8cf3&lang=scss&scoped=true& ***!
  \*****************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaboratorsSelectionForm_vue_vue_type_style_index_0_id_414c8cf3_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/style-loader/dist/cjs.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=414c8cf3&lang=scss&scoped=true& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=414c8cf3&lang=scss&scoped=true&");


/***/ }),

/***/ "./src/components/EmptyContent.vue?vue&type=style&index=0&lang=scss&":
/*!***************************************************************************!*\
  !*** ./src/components/EmptyContent.vue?vue&type=style&index=0&lang=scss& ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_EmptyContent_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/style-loader/dist/cjs.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./EmptyContent.vue?vue&type=style&index=0&lang=scss& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/EmptyContent.vue?vue&type=style&index=0&lang=scss&");


/***/ }),

/***/ "./src/components/Loader.vue?vue&type=style&index=0&lang=scss&":
/*!*********************************************************************!*\
  !*** ./src/components/Loader.vue?vue&type=style&index=0&lang=scss& ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Loader_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/style-loader/dist/cjs.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Loader.vue?vue&type=style&index=0&lang=scss& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Loader.vue?vue&type=style&index=0&lang=scss&");


/***/ }),

/***/ "./src/components/AlbumCreationForm.vue?vue&type=template&id=91dab95c&scoped=true&":
/*!*****************************************************************************************!*\
  !*** ./src/components/AlbumCreationForm.vue?vue&type=template&id=91dab95c&scoped=true& ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumCreationForm_vue_vue_type_template_id_91dab95c_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumCreationForm_vue_vue_type_template_id_91dab95c_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumCreationForm_vue_vue_type_template_id_91dab95c_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AlbumCreationForm.vue?vue&type=template&id=91dab95c&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/AlbumCreationForm.vue?vue&type=template&id=91dab95c&scoped=true&");


/***/ }),

/***/ "./src/components/CollaboratorsSelectionForm.vue?vue&type=template&id=414c8cf3&scoped=true&":
/*!**************************************************************************************************!*\
  !*** ./src/components/CollaboratorsSelectionForm.vue?vue&type=template&id=414c8cf3&scoped=true& ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaboratorsSelectionForm_vue_vue_type_template_id_414c8cf3_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaboratorsSelectionForm_vue_vue_type_template_id_414c8cf3_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaboratorsSelectionForm_vue_vue_type_template_id_414c8cf3_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CollaboratorsSelectionForm.vue?vue&type=template&id=414c8cf3&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/CollaboratorsSelectionForm.vue?vue&type=template&id=414c8cf3&scoped=true&");


/***/ }),

/***/ "./src/components/EmptyContent.vue?vue&type=template&id=6c3ea49c&":
/*!************************************************************************!*\
  !*** ./src/components/EmptyContent.vue?vue&type=template&id=6c3ea49c& ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_EmptyContent_vue_vue_type_template_id_6c3ea49c___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_EmptyContent_vue_vue_type_template_id_6c3ea49c___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_EmptyContent_vue_vue_type_template_id_6c3ea49c___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./EmptyContent.vue?vue&type=template&id=6c3ea49c& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/EmptyContent.vue?vue&type=template&id=6c3ea49c&");


/***/ }),

/***/ "./src/components/Loader.vue?vue&type=template&id=04a0d67a&":
/*!******************************************************************!*\
  !*** ./src/components/Loader.vue?vue&type=template&id=04a0d67a& ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Loader_vue_vue_type_template_id_04a0d67a___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Loader_vue_vue_type_template_id_04a0d67a___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Loader_vue_vue_type_template_id_04a0d67a___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Loader.vue?vue&type=template&id=04a0d67a& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Loader.vue?vue&type=template&id=04a0d67a&");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/AlbumCreationForm.vue?vue&type=template&id=91dab95c&scoped=true&":
/*!********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/AlbumCreationForm.vue?vue&type=template&id=91dab95c&scoped=true& ***!
  \********************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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
    ? _c("form", { staticClass: "album-creation-form" }, [
        _c("div", { staticClass: "form-inputs" }, [
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.albumName,
                expression: "albumName",
              },
            ],
            ref: "nameInput",
            attrs: {
              type: "text",
              name: "name",
              required: "",
              autofocus: "true",
              placeholder: _vm.t("photos", "Name of the new album"),
            },
            domProps: { value: _vm.albumName },
            on: {
              input: function ($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.albumName = $event.target.value
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
                    rawName: "v-model",
                    value: _vm.albumLocation,
                    expression: "albumLocation",
                  },
                ],
                attrs: {
                  type: "text",
                  name: "location",
                  placeholder: _vm.t("photos", "Add location"),
                },
                domProps: { value: _vm.albumLocation },
                on: {
                  input: function ($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.albumLocation = $event.target.value
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
                          "photo",
                          "Go back to the previous view"
                        ),
                        type: "tertiary",
                      },
                      on: { click: _vm.back },
                    },
                    [
                      _vm._v(
                        "\n\t\t\t\t" +
                          _vm._s(_vm.t("photo", "Back")) +
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
                    "aria-label": _vm.t(
                      "photo",
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
                      _vm._s(_vm.t("photo", "Add collaborators")) +
                      "\n\t\t\t"
                  ),
                ]
              ),
              _vm._v(" "),
              _c(
                "Button",
                {
                  attrs: {
                    "aria-label": _vm.t("photo", "Create the album."),
                    type: "primary",
                    disabled: _vm.albumName.trim() === "" || _vm.loading,
                  },
                  on: { click: _vm.createAlbum },
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
                      _vm._s(_vm.t("photo", "Create album")) +
                      "\n\t\t\t"
                  ),
                ]
              ),
            ],
            1
          ),
        ]),
      ])
    : _c("CollaboratorsSelectionForm", {
        staticClass: "add-collaborators-form",
        on: {
          cancel: function ($event) {
            _vm.showCollaboratorView = true
          },
          submit: _vm.createAlbum,
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
                            "photo",
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
                            _vm._s(_vm.t("photo", "Back")) +
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
                          "aria-label": _vm.t("photo", "Create the album."),
                          type: "primary",
                          disabled: _vm.albumName.trim() === "" || _vm.loading,
                        },
                        on: {
                          click: function ($event) {
                            return _vm.createAlbum(collaborators)
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
                            _vm._s(_vm.t("photo", "Create album")) +
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

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("form", { staticClass: "add-collaborators-form" }, [
    _c("h2", { staticClass: "form-title" }, [
      _vm._v("\n\t\t" + _vm._s(_vm.t("photos", "Add collaborators")) + "\n\t"),
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
        "\n\t\t" + _vm._s(_vm.t("photos", "Share this album via link")) + "\n\t"
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
              "Search users, email or federated cloud ID"
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
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/EmptyContent.vue?vue&type=template&id=6c3ea49c&":
/*!***************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/EmptyContent.vue?vue&type=template&id=6c3ea49c& ***!
  \***************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _vm.isReady
    ? _c("div", { staticClass: "emptycontent" }, [
        _vm.haveIllustration
          ? _c("div", {
              staticClass: "illustration",
              domProps: { innerHTML: _vm._s(_vm.illustration) },
            })
          : _c("div", { staticClass: "icon-error" }),
        _vm._v(" "),
        _c("h2", [_vm._t("default")], 2),
        _vm._v(" "),
        _c(
          "p",
          {
            directives: [
              {
                name: "show",
                rawName: "v-show",
                value: _vm.$slots.desc,
                expression: "$slots.desc",
              },
            ],
          },
          [_vm._t("desc")],
          2
        ),
      ])
    : _vm._e()
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Loader.vue?vue&type=template&id=04a0d67a&":
/*!*********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Loader.vue?vue&type=template&id=04a0d67a& ***!
  \*********************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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
    "div",
    { staticClass: "loader" },
    [
      _vm._t("icon", function () {
        return [_c("span", { staticClass: "icon-loading" })]
      }),
    ],
    2
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./src/assets/Illustrations lazy recursive ^\\.\\/.*\\.svg$":
/*!***********************************************************************!*\
  !*** ./src/assets/Illustrations/ lazy ^\.\/.*\.svg$ namespace object ***!
  \***********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./empty.svg": [
		"./src/assets/Illustrations/empty.svg",
		"src_assets_Illustrations_empty_svg"
	],
	"./folder.svg": [
		"./src/assets/Illustrations/folder.svg",
		"src_assets_Illustrations_folder_svg"
	],
	"./images.svg": [
		"./src/assets/Illustrations/images.svg",
		"src_assets_Illustrations_images_svg"
	]
};
function webpackAsyncContext(req) {
	if(!__webpack_require__.o(map, req)) {
		return Promise.resolve().then(() => {
			var e = new Error("Cannot find module '" + req + "'");
			e.code = 'MODULE_NOT_FOUND';
			throw e;
		});
	}

	var ids = map[req], id = ids[0];
	return __webpack_require__.e(ids[1]).then(() => {
		return __webpack_require__.t(id, 1 | 16);
	});
}
webpackAsyncContext.keys = () => (Object.keys(map));
webpackAsyncContext.id = "./src/assets/Illustrations lazy recursive ^\\.\\/.*\\.svg$";
module.exports = webpackAsyncContext;

/***/ })

}]);
//# sourceMappingURL=photos-src_mixins_FetchAlbumsMixin_js-src_components_AlbumCreationForm_vue-src_components_EmptyContent_vue.js.map?v=c8b0a7f1512ec8d35fa8