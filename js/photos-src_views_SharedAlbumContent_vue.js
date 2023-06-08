"use strict";
(self["webpackChunkphotos"] = self["webpackChunkphotos"] || []).push([["src_views_SharedAlbumContent_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/SharedAlbumContent.vue?vue&type=script&lang=js&":
/*!***********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/SharedAlbumContent.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var vue_material_design_icons_MapMarker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue-material-design-icons/MapMarker */ "./node_modules/vue-material-design-icons/MapMarker.vue");
/* harmony import */ var vue_material_design_icons_Plus__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-material-design-icons/Plus */ "./node_modules/vue-material-design-icons/Plus.vue");
/* harmony import */ var vue_material_design_icons_Delete__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vue-material-design-icons/Delete */ "./node_modules/vue-material-design-icons/Delete.vue");
/* harmony import */ var vue_material_design_icons_ImagePlus__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! vue-material-design-icons/ImagePlus */ "./node_modules/vue-material-design-icons/ImagePlus.vue");
/* harmony import */ var vue_material_design_icons_Close__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! vue-material-design-icons/Close */ "./node_modules/vue-material-design-icons/Close.vue");
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @nextcloud/vue */ "./node_modules/@nextcloud/vue/dist/ncvuecomponents.js");
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_vue__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _nextcloud_auth__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @nextcloud/auth */ "./node_modules/@nextcloud/auth/dist/index.esm.js");
/* harmony import */ var _mixins_FetchSharedAlbumsMixin_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../mixins/FetchSharedAlbumsMixin.js */ "./src/mixins/FetchSharedAlbumsMixin.js");
/* harmony import */ var _mixins_FetchFilesMixin_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../mixins/FetchFilesMixin.js */ "./src/mixins/FetchFilesMixin.js");
/* harmony import */ var _mixins_AbortControllerMixin_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../mixins/AbortControllerMixin.js */ "./src/mixins/AbortControllerMixin.js");
/* harmony import */ var _components_Collection_CollectionContent_vue__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../components/Collection/CollectionContent.vue */ "./src/components/Collection/CollectionContent.vue");
/* harmony import */ var _components_HeaderNavigation_vue__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../components/HeaderNavigation.vue */ "./src/components/HeaderNavigation.vue");
/* harmony import */ var _components_FilesPicker_vue__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../components/FilesPicker.vue */ "./src/components/FilesPicker.vue");
/* harmony import */ var _services_logger_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../services/logger.js */ "./src/services/logger.js");
/* harmony import */ var _services_DavClient_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../services/DavClient.js */ "./src/services/DavClient.js");
/* harmony import */ var _services_DavRequest_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../services/DavRequest.js */ "./src/services/DavRequest.js");
/* harmony import */ var _utils_fileUtils_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../utils/fileUtils.js */ "./src/utils/fileUtils.js");
/* harmony import */ var _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @nextcloud/l10n */ "./node_modules/@nextcloud/l10n/dist/index.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





 // import Download from 'vue-material-design-icons/Download'
// import DownloadMultiple from 'vue-material-design-icons/DownloadMultiple'







 // import ActionDownload from '../components/Actions/ActionDownload.vue'







/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'SharedAlbumContent',
  components: {
    MapMarker: vue_material_design_icons_MapMarker__WEBPACK_IMPORTED_MODULE_0__["default"],
    Plus: vue_material_design_icons_Plus__WEBPACK_IMPORTED_MODULE_1__["default"],
    Close: vue_material_design_icons_Close__WEBPACK_IMPORTED_MODULE_4__["default"],
    // Download,
    // DownloadMultiple,
    Delete: vue_material_design_icons_Delete__WEBPACK_IMPORTED_MODULE_2__["default"],
    ImagePlus: vue_material_design_icons_ImagePlus__WEBPACK_IMPORTED_MODULE_3__["default"],
    NcEmptyContent: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_5__.NcEmptyContent,
    NcActions: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_5__.NcActions,
    NcActionButton: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_5__.NcActionButton,
    NcActionSeparator: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_5__.NcActionSeparator,
    NcButton: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_5__.NcButton,
    NcModal: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_5__.NcModal,
    NcUserBubble: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_5__.NcUserBubble,
    CollectionContent: _components_Collection_CollectionContent_vue__WEBPACK_IMPORTED_MODULE_10__["default"],
    // ActionDownload,
    FilesPicker: _components_FilesPicker_vue__WEBPACK_IMPORTED_MODULE_12__["default"],
    HeaderNavigation: _components_HeaderNavigation_vue__WEBPACK_IMPORTED_MODULE_11__["default"]
  },
  mixins: [_mixins_FetchSharedAlbumsMixin_js__WEBPACK_IMPORTED_MODULE_7__["default"], _mixins_FetchFilesMixin_js__WEBPACK_IMPORTED_MODULE_8__["default"], _mixins_AbortControllerMixin_js__WEBPACK_IMPORTED_MODULE_9__["default"], _nextcloud_vue__WEBPACK_IMPORTED_MODULE_5__.isMobile],
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
      loadingAddFilesToAlbum: false
    };
  },

  computed: { ...(0,vuex__WEBPACK_IMPORTED_MODULE_18__.mapGetters)(['files', 'sharedAlbumsFiles']),

    /**
     * @return {object} The album information for the current albumName.
     */
    album() {
      return this.sharedAlbums[this.albumName] || {};
    },

    /**
     * @return {string[]} The list of files for the current albumName.
     */
    albumFileIds() {
      return this.sharedAlbumsFiles[this.albumName] || [];
    },

    /**
     * @return {string} The album name without the userId between parentheses.
     */
    albumOriginalName() {
      return this.albumName.replace(new RegExp(`\\(${this.album.collaborators[0].id}\\)$`), '');
    }

  },
  watch: {
    album() {
      this.fetchAlbumContent();
    }

  },
  methods: { ...(0,vuex__WEBPACK_IMPORTED_MODULE_18__.mapActions)(['appendFiles', 'deleteSharedAlbum', 'addFilesToSharedAlbum', 'removeFilesFromSharedAlbum']),

    async fetchAlbumContent() {
      if (this.loadingFiles || this.showEditAlbumForm) {
        return [];
      }

      const semaphoreSymbol = await this.semaphore.acquire(() => 0, 'fetchFiles');
      const fetchSemaphoreSymbol = await this.fetchSemaphore.acquire();

      try {
        this.errorFetchingFiles = null;
        this.loadingFiles = true;
        this.semaphoreSymbol = semaphoreSymbol;
        const response = await _services_DavClient_js__WEBPACK_IMPORTED_MODULE_14__["default"].getDirectoryContents(`/photos/${(0,_nextcloud_auth__WEBPACK_IMPORTED_MODULE_6__.getCurrentUser)()?.uid}/sharedalbums/${this.albumName}`, {
          data: _services_DavRequest_js__WEBPACK_IMPORTED_MODULE_15__["default"],
          details: true,
          signal: this.abortController.signal
        });
        const fetchedFiles = response.data.map(file => (0,_utils_fileUtils_js__WEBPACK_IMPORTED_MODULE_16__.genFileInfo)(file));
        const fileIds = fetchedFiles.map(file => file.fileid).map(fileId => fileId.toString());
        this.appendFiles(fetchedFiles);

        if (fetchedFiles.length > 0) {
          await this.$store.commit('addFilesToSharedAlbum', {
            albumName: this.albumName,
            fileIdsToAdd: fileIds
          });
        }

        _services_logger_js__WEBPACK_IMPORTED_MODULE_13__["default"].debug(`[SharedAlbumContent] Fetched ${fileIds.length} new files: `, fileIds);
      } catch (error) {
        if (error.response?.status === 404) {
          this.errorFetchingFiles = 404;
        } else if (error.code === 'ERR_CANCELED') {
          return;
        } else {
          this.errorFetchingFiles = error;
        } // cancelled request, moving on...


        _services_logger_js__WEBPACK_IMPORTED_MODULE_13__["default"].error('[SharedAlbumContent] Error fetching album files', {
          error
        });
      } finally {
        this.loadingFiles = false;
        this.semaphore.release(semaphoreSymbol);
        this.fetchSemaphore.release(fetchSemaphoreSymbol);
      }

      return [];
    },

    async handleFilesPicked(fileIds) {
      this.showAddPhotosModal = false;
      await this.addFilesToSharedAlbum({
        albumName: this.albumName,
        fileIdsToAdd: fileIds
      }); // Re-fetch album content to have the proper filenames.

      await this.fetchAlbumContent();
    },

    async handleRemoveFilesFromAlbum(fileIds) {
      this.$refs.collectionContent.onUncheckFiles(fileIds);
      await this.removeFilesFromSharedAlbum({
        albumName: this.albumName,
        fileIdsToRemove: fileIds
      });
    },

    async handleDeleteAlbum() {
      await this.deleteSharedAlbum({
        albumName: this.albumName
      });
      this.$router.push('/sharedalbums');
    },

    t: _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_17__.translate
  }
});

/***/ }),

/***/ "./src/mixins/FetchSharedAlbumsMixin.js":
/*!**********************************************!*\
  !*** ./src/mixins/FetchSharedAlbumsMixin.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _nextcloud_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/auth */ "./node_modules/@nextcloud/auth/dist/index.esm.js");
/* harmony import */ var _AbortControllerMixin_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AbortControllerMixin.js */ "./src/mixins/AbortControllerMixin.js");
/* harmony import */ var _services_Albums_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/Albums.js */ "./src/services/Albums.js");
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
  name: 'FetchSharedAlbumsMixin',

  data() {
    return {
      errorFetchingAlbums: null,
      loadingAlbums: false
    };
  },

  mixins: [_AbortControllerMixin_js__WEBPACK_IMPORTED_MODULE_1__["default"]],

  async beforeMount() {
    this.fetchAlbums();
  },

  computed: { ...(0,vuex__WEBPACK_IMPORTED_MODULE_3__.mapGetters)(['sharedAlbums'])
  },
  methods: { ...(0,vuex__WEBPACK_IMPORTED_MODULE_3__.mapActions)(['addSharedAlbums']),

    async fetchAlbums() {
      if (this.loadingAlbums) {
        return;
      }

      try {
        this.loadingAlbums = true;
        this.errorFetchingAlbums = null;
        const albums = await (0,_services_Albums_js__WEBPACK_IMPORTED_MODULE_2__.fetchAlbums)(`/photos/${(0,_nextcloud_auth__WEBPACK_IMPORTED_MODULE_0__.getCurrentUser)()?.uid}/sharedalbums`, this.abortController.signal);
        this.addSharedAlbums({
          albums
        });
      } catch (error) {
        if (error.response?.status === 404) {
          this.errorFetchingAlbums = 404;
        } else {
          this.errorFetchingAlbums = error;
        }
      } finally {
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

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fetchAlbum": () => (/* binding */ fetchAlbum),
/* harmony export */   "fetchAlbumContent": () => (/* binding */ fetchAlbumContent),
/* harmony export */   "fetchAlbums": () => (/* binding */ fetchAlbums)
/* harmony export */ });
/* harmony import */ var _nextcloud_moment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/moment */ "./node_modules/@nextcloud/moment/dist/index.js");
/* harmony import */ var _nextcloud_moment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_moment__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/l10n */ "./node_modules/@nextcloud/l10n/dist/index.js");
/* harmony import */ var _services_DavClient_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/DavClient.js */ "./src/services/DavClient.js");
/* harmony import */ var _services_logger_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/logger.js */ "./src/services/logger.js");
/* harmony import */ var _services_DavRequest_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../services/DavRequest.js */ "./src/services/DavRequest.js");
/* harmony import */ var _utils_fileUtils_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/fileUtils.js */ "./src/utils/fileUtils.js");
/* provided dependency */ var console = __webpack_require__(/*! ./node_modules/console-browserify/index.js */ "./node_modules/console-browserify/index.js");
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
 * @param {string} extraProps - Extra properties to add to the DAV request.
 * @return {string}
 */

function getDavRequest() {
  let extraProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return `<?xml version="1.0"?>
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
					${extraProps}
				</d:prop>
			</d:propfind>`;
}
/**
 *
 * @param {string} path - Albums' root path.
 * @param {import('webdav').StatOptions} options - Options to forward to the webdav client.
 * @param {string} extraProps - Extra properties to add to the DAV request.
 * @param {import('webdav').WebDAVClient} client - The DAV client to use.
 * @return {Promise<Album|null>}
 */


async function fetchAlbum(path, options) {
  let extraProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  let client = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _services_DavClient_js__WEBPACK_IMPORTED_MODULE_2__["default"];

  try {
    const response = await client.stat(path, {
      data: getDavRequest(extraProps),
      details: true,
      ...options
    });
    _services_logger_js__WEBPACK_IMPORTED_MODULE_3__["default"].debug('[Albums] Fetched an album: ', {
      data: response.data
    });
    return formatAlbum(response.data);
  } catch (error) {
    if (error.code === 'ERR_CANCELED') {
      return null;
    }

    throw error;
  }
}
/**
 *
 * @param {string} path - Albums' root path.
 * @param {import('webdav').StatOptions} options - Options to forward to the webdav client.
 * @param {string} extraProps - Extra properties to add to the DAV request.
 * @param {import('webdav').WebDAVClient} client - The DAV client to use.
 * @return {Promise<Album[]>}
 */

async function fetchAlbums(path, options) {
  let extraProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  let client = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _services_DavClient_js__WEBPACK_IMPORTED_MODULE_2__["default"];

  try {
    const response = await client.getDirectoryContents(path, {
      data: getDavRequest(extraProps),
      details: true,
      ...options
    });
    _services_logger_js__WEBPACK_IMPORTED_MODULE_3__["default"].debug(`[Albums] Fetched ${response.data.length} albums: `, {
      data: response.data
    });
    return response.data.filter(album => album.filename !== path).map(formatAlbum);
  } catch (error) {
    if (error.code === 'ERR_CANCELED') {
      return [];
    }

    throw error;
  }
}
/**
 *
 * @param {object} album - An album received from a webdav request.
 * @return {Album}
 */

function formatAlbum(album) {
  // Ensure that we have a proper collaborators array.
  if (album.props.collaborators === '') {
    album.props.collaborators = [];
  } else if (typeof album.props.collaborators.collaborator === 'object') {
    if (Array.isArray(album.props.collaborators.collaborator)) {
      album.props.collaborators = album.props.collaborators.collaborator;
    } else {
      album.props.collaborators = [album.props.collaborators.collaborator];
    }
  } // Extract custom props.


  album = (0,_utils_fileUtils_js__WEBPACK_IMPORTED_MODULE_5__.genFileInfo)(album); // Compute date range label.

  const dateRange = JSON.parse(album.dateRange?.replace(/&quot;/g, '"') ?? '{}');

  if (dateRange.start === null) {
    dateRange.start = _nextcloud_moment__WEBPACK_IMPORTED_MODULE_0___default()().unix();
    dateRange.end = _nextcloud_moment__WEBPACK_IMPORTED_MODULE_0___default()().unix();
  }

  const dateRangeFormatted = {
    startDate: _nextcloud_moment__WEBPACK_IMPORTED_MODULE_0___default().unix(dateRange.start).format('MMMM YYYY'),
    endDate: _nextcloud_moment__WEBPACK_IMPORTED_MODULE_0___default().unix(dateRange.end).format('MMMM YYYY')
  };

  if (dateRangeFormatted.startDate === dateRangeFormatted.endDate) {
    album.date = dateRangeFormatted.startDate;
  } else {
    album.date = (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_1__.translate)('photos', '{startDate} to {endDate}', dateRangeFormatted);
  }

  return album;
}
/**
 *
 * @param {string} path - Albums' root path.
 * @param {import('webdav').StatOptions} options - Options to forward to the webdav client.
 * @param {import('webdav').WebDAVClient} client - The DAV client to use.
 * @return {Promise<Array>}
 */


async function fetchAlbumContent(path, options) {
  let client = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _services_DavClient_js__WEBPACK_IMPORTED_MODULE_2__["default"];

  try {
    const response = await client.getDirectoryContents(path, {
      data: _services_DavRequest_js__WEBPACK_IMPORTED_MODULE_4__["default"],
      details: true,
      ...options
    });
    const fetchedFiles = response.data.map(file => (0,_utils_fileUtils_js__WEBPACK_IMPORTED_MODULE_5__.genFileInfo)(file)).filter(file => file.fileid);
    _services_logger_js__WEBPACK_IMPORTED_MODULE_3__["default"].debug(`[Albums] Fetched ${fetchedFiles.length} new files: `, fetchedFiles);
    return fetchedFiles;
  } catch (error) {
    if (error.code === 'ERR_CANCELED') {
      return [];
    }

    _services_logger_js__WEBPACK_IMPORTED_MODULE_3__["default"].error('Error fetching album files', {
      error
    });
    console.error(error);
    throw error;
  }
}

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/SharedAlbumContent.vue?vue&type=style&index=0&id=259e376e&lang=scss&scoped=true&":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/SharedAlbumContent.vue?vue&type=style&index=0&id=259e376e&lang=scss&scoped=true& ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/SharedAlbumContent.vue?vue&type=style&index=0&id=259e376e&lang=scss&scoped=true&":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/SharedAlbumContent.vue?vue&type=style&index=0&id=259e376e&lang=scss&scoped=true& ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SharedAlbumContent_vue_vue_type_style_index_0_id_259e376e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./SharedAlbumContent.vue?vue&type=style&index=0&id=259e376e&lang=scss&scoped=true& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/SharedAlbumContent.vue?vue&type=style&index=0&id=259e376e&lang=scss&scoped=true&");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SharedAlbumContent_vue_vue_type_style_index_0_id_259e376e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SharedAlbumContent_vue_vue_type_style_index_0_id_259e376e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SharedAlbumContent_vue_vue_type_style_index_0_id_259e376e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SharedAlbumContent_vue_vue_type_style_index_0_id_259e376e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


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

/***/ "./src/views/SharedAlbumContent.vue?vue&type=style&index=0&id=259e376e&lang=scss&scoped=true&":
/*!****************************************************************************************************!*\
  !*** ./src/views/SharedAlbumContent.vue?vue&type=style&index=0&id=259e376e&lang=scss&scoped=true& ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SharedAlbumContent_vue_vue_type_style_index_0_id_259e376e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/style-loader/dist/cjs.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./SharedAlbumContent.vue?vue&type=style&index=0&id=259e376e&lang=scss&scoped=true& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/SharedAlbumContent.vue?vue&type=style&index=0&id=259e376e&lang=scss&scoped=true&");


/***/ }),

/***/ "./src/views/SharedAlbumContent.vue?vue&type=template&id=259e376e&scoped=true&":
/*!*************************************************************************************!*\
  !*** ./src/views/SharedAlbumContent.vue?vue&type=template&id=259e376e&scoped=true& ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SharedAlbumContent_vue_vue_type_template_id_259e376e_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SharedAlbumContent_vue_vue_type_template_id_259e376e_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SharedAlbumContent_vue_vue_type_template_id_259e376e_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./SharedAlbumContent.vue?vue&type=template&id=259e376e&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/SharedAlbumContent.vue?vue&type=template&id=259e376e&scoped=true&");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/SharedAlbumContent.vue?vue&type=template&id=259e376e&scoped=true&":
/*!****************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/SharedAlbumContent.vue?vue&type=template&id=259e376e&scoped=true& ***!
  \****************************************************************************************************************************************************************************************************************************/
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
    "div",
    [
       true
        ? _c(
            "CollectionContent",
            {
              ref: "collectionContent",
              attrs: {
                collection: _vm.album,
                "collection-file-ids": _vm.albumFileIds,
                semaphore: _vm.semaphore,
                loading: _vm.loadingAlbums || _vm.loadingFiles,
                error: _vm.errorFetchingAlbums || _vm.errorFetchingFiles,
              },
              scopedSlots: _vm._u(
                [
                  {
                    key: "header",
                    fn: function (ref) {
                      var selectedFileIds = ref.selectedFileIds
                      return _c(
                        "HeaderNavigation",
                        {
                          key: "navigation",
                          attrs: {
                            loading: _vm.loadingFiles,
                            params: { albumName: _vm.albumName },
                            path: "/" + _vm.albumName,
                            title: _vm.albumOriginalName,
                          },
                          on: { refresh: _vm.fetchAlbumContent },
                        },
                        [
                          _vm.album.location !== ""
                            ? _c(
                                "div",
                                {
                                  staticClass: "album__location",
                                  attrs: { slot: "subtitle" },
                                  slot: "subtitle",
                                },
                                [
                                  _c("MapMarker"),
                                  _vm._v(
                                    _vm._s(_vm.album.location) +
                                      " ⸱ " +
                                      _vm._s(_vm.t("photos", "Shared by")) +
                                      " "
                                  ),
                                  _c("NcUserBubble", {
                                    attrs: {
                                      "display-name":
                                        _vm.album.collaborators[0].label,
                                      user: _vm.album.collaborators[0].id,
                                    },
                                  }),
                                ],
                                1
                              )
                            : _vm._e(),
                          _vm._v(" "),
                          _vm.album !== undefined
                            ? _c(
                                "template",
                                { slot: "right" },
                                [
                                  _vm.album.nbItems !== 0
                                    ? _c(
                                        "NcButton",
                                        {
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
                                        },
                                        [
                                          _c("Plus", {
                                            attrs: { slot: "icon" },
                                            slot: "icon",
                                          }),
                                        ],
                                        1
                                      )
                                    : _vm._e(),
                                  _vm._v(" "),
                                  _c(
                                    "NcActions",
                                    {
                                      attrs: {
                                        "force-menu": true,
                                        "aria-label": _vm.t(
                                          "photos",
                                          "Open actions menu"
                                        ),
                                      },
                                    },
                                    [
                                      _c(
                                        "NcActionButton",
                                        {
                                          attrs: { "close-after-click": true },
                                          on: { click: _vm.handleDeleteAlbum },
                                        },
                                        [
                                          _vm._v(
                                            "\n\t\t\t\t\t\t" +
                                              _vm._s(
                                                _vm.t("photos", "Delete album")
                                              ) +
                                              "\n\t\t\t\t\t\t"
                                          ),
                                          _c("Delete", {
                                            attrs: { slot: "icon" },
                                            slot: "icon",
                                          }),
                                        ],
                                        1
                                      ),
                                      _vm._v(" "),
                                      selectedFileIds.length > 0
                                        ? [
                                            _c("NcActionSeparator"),
                                            _vm._v(" "),
                                            _c(
                                              "NcActionButton",
                                              {
                                                attrs: {
                                                  "close-after-click": true,
                                                },
                                                on: {
                                                  click: function ($event) {
                                                    return _vm.handleRemoveFilesFromAlbum(
                                                      selectedFileIds
                                                    )
                                                  },
                                                },
                                              },
                                              [
                                                _vm._v(
                                                  "\n\t\t\t\t\t\t\t" +
                                                    _vm._s(
                                                      _vm.t(
                                                        "photos",
                                                        "Remove selection from album"
                                                      )
                                                    ) +
                                                    "\n\t\t\t\t\t\t\t"
                                                ),
                                                _c("Close", {
                                                  attrs: { slot: "icon" },
                                                  slot: "icon",
                                                }),
                                              ],
                                              1
                                            ),
                                          ]
                                        : _vm._e(),
                                    ],
                                    2
                                  ),
                                ],
                                1
                              )
                            : _vm._e(),
                        ],
                        2
                      )
                    },
                  },
                ],
                null,
                false,
                327359241
              ),
            },
            [
              _vm._v(" "),
              _c(
                "NcEmptyContent",
                {
                  staticClass: "album__empty",
                  attrs: {
                    slot: "empty-content",
                    title: _vm.t(
                      "photos",
                      "This album does not have any photos or videos yet!"
                    ),
                  },
                  slot: "empty-content",
                },
                [
                  _c("ImagePlus", { attrs: { slot: "icon" }, slot: "icon" }),
                  _vm._v(" "),
                  _c(
                    "NcButton",
                    {
                      attrs: {
                        slot: "action",
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
                      slot: "action",
                    },
                    [
                      _c("Plus", { attrs: { slot: "icon" }, slot: "icon" }),
                      _vm._v(
                        "\n\t\t\t\t" +
                          _vm._s(_vm.t("photos", "Add")) +
                          "\n\t\t\t"
                      ),
                    ],
                    1
                  ),
                ],
                1
              ),
            ],
            1
          )
        : 0,
      _vm._v(" "),
      _vm.showAddPhotosModal
        ? _c(
            "NcModal",
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
                attrs: {
                  destination: _vm.album.basename,
                  "blacklist-ids": _vm.albumFileIds,
                  loading: _vm.loadingAddFilesToAlbum,
                },
                on: { "files-picked": _vm.handleFilesPicked },
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



/***/ })

}]);
//# sourceMappingURL=photos-src_views_SharedAlbumContent_vue.js.map?v=91bfedf6a5d68e376255