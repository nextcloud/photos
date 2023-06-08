"use strict";
(self["webpackChunkphotos"] = self["webpackChunkphotos"] || []).push([["src_views_PublicAlbumContent_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/PublicAlbumContent.vue?vue&type=script&lang=js&":
/*!***********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/PublicAlbumContent.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var webdav__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! webdav */ "./node_modules/webdav/dist/node/index.js");
/* harmony import */ var webdav__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(webdav__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var vue_material_design_icons_MapMarker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-material-design-icons/MapMarker */ "./node_modules/vue-material-design-icons/MapMarker.vue");
/* harmony import */ var vue_material_design_icons_ImageOff__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vue-material-design-icons/ImageOff */ "./node_modules/vue-material-design-icons/ImageOff.vue");
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @nextcloud/vue */ "./node_modules/@nextcloud/vue/dist/ncvuecomponents.js");
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_vue__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @nextcloud/dialogs */ "./node_modules/@nextcloud/dialogs/dist/index.es.js");
/* harmony import */ var _nextcloud_axios__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @nextcloud/axios */ "./node_modules/@nextcloud/axios/dist/index.esm.js");
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @nextcloud/router */ "./node_modules/@nextcloud/router/dist/index.js");
/* harmony import */ var _mixins_FetchFilesMixin_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../mixins/FetchFilesMixin.js */ "./src/mixins/FetchFilesMixin.js");
/* harmony import */ var _mixins_AbortControllerMixin_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../mixins/AbortControllerMixin.js */ "./src/mixins/AbortControllerMixin.js");
/* harmony import */ var _components_Collection_CollectionContent_vue__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../components/Collection/CollectionContent.vue */ "./src/components/Collection/CollectionContent.vue");
/* harmony import */ var _components_HeaderNavigation_vue__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../components/HeaderNavigation.vue */ "./src/components/HeaderNavigation.vue");
/* harmony import */ var _services_Albums_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../services/Albums.js */ "./src/services/Albums.js");
/* harmony import */ var _services_logger_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../services/logger.js */ "./src/services/logger.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


 // import Plus from 'vue-material-design-icons/Plus'
// import ImagePlus from 'vue-material-design-icons/ImagePlus'

 // import Download from 'vue-material-design-icons/Download'
// import DownloadMultiple from 'vue-material-design-icons/DownloadMultiple'








 // import ActionDownload from '../components/Actions/ActionDownload.vue'



const publicRootPath = 'dav'; // force our axios

const patcher = (0,webdav__WEBPACK_IMPORTED_MODULE_0__.getPatcher)();
patcher.patch('request', _nextcloud_axios__WEBPACK_IMPORTED_MODULE_5__["default"]); // init webdav client on default dav endpoint

const remote = (0,_nextcloud_router__WEBPACK_IMPORTED_MODULE_6__.generateRemoteUrl)(publicRootPath);
const publicRemote = remote;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'PublicAlbumContent',
  components: {
    MapMarker: vue_material_design_icons_MapMarker__WEBPACK_IMPORTED_MODULE_1__["default"],
    // Plus,
    // Download,
    // DownloadMultiple,
    // ImagePlus,
    ImageOff: vue_material_design_icons_ImageOff__WEBPACK_IMPORTED_MODULE_2__["default"],
    NcEmptyContent: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_3__.NcEmptyContent,
    NcActions: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_3__.NcActions,
    // NcActionSeparator,
    // NcButton,
    CollectionContent: _components_Collection_CollectionContent_vue__WEBPACK_IMPORTED_MODULE_9__["default"],
    // ActionDownload,
    HeaderNavigation: _components_HeaderNavigation_vue__WEBPACK_IMPORTED_MODULE_10__["default"]
  },
  mixins: [_mixins_FetchFilesMixin_js__WEBPACK_IMPORTED_MODULE_7__["default"], _mixins_AbortControllerMixin_js__WEBPACK_IMPORTED_MODULE_8__["default"], _nextcloud_vue__WEBPACK_IMPORTED_MODULE_3__.isMobile],
  props: {
    token: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      showAddPhotosModal: false,
      loadingAlbum: false,
      errorFetchingAlbum: null,
      loadingCount: 0,
      loadingAddFilesToAlbum: false,
      albumOriginalName: '',
      publicClient: (0,webdav__WEBPACK_IMPORTED_MODULE_0__.createClient)(publicRemote, {
        username: this.token,
        password: null
      })
    };
  },

  computed: { ...(0,vuex__WEBPACK_IMPORTED_MODULE_13__.mapGetters)(['files', 'publicAlbums', 'publicAlbumsFiles']),

    /**
     * @return {object} The album information for the current albumName.
     */
    album() {
      return this.publicAlbums[this.albumName] || {};
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
      return this.publicAlbumsFiles[this.albumName] || [];
    }

  },

  async beforeMount() {
    await this.fetchAlbumInfo();
    await this.fetchAlbumContent();
  },

  methods: { ...(0,vuex__WEBPACK_IMPORTED_MODULE_13__.mapActions)(['appendFiles', 'addPublicAlbums', 'addFilesToPublicAlbum', 'removeFilesFromPublicAlbum']),

    async fetchAlbumInfo() {
      if (this.loadingAlbum) {
        return;
      }

      try {
        this.loadingAlbum = true;
        this.errorFetchingAlbum = null;
        const album = await (0,_services_Albums_js__WEBPACK_IMPORTED_MODULE_11__.fetchAlbum)(`/photospublic/${this.token}`, this.abortController.signal, '<nc:original-name />', this.publicClient);
        this.addPublicAlbums({
          collections: [album]
        });
        this.albumOriginalName = album.originalName;
      } catch (error) {
        if (error.response?.status === 404) {
          this.errorFetchingAlbum = 404;
          return;
        }

        this.errorFetchingAlbum = error;
        _services_logger_js__WEBPACK_IMPORTED_MODULE_12__["default"].error('[PublicAlbumContent] Error fetching album', {
          error
        });
        (0,_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_4__.showError)(this.t('photos', 'Failed to fetch album.'));
      } finally {
        this.loadingAlbum = false;
      }
    },

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
        const fetchedFiles = await (0,_services_Albums_js__WEBPACK_IMPORTED_MODULE_11__.fetchAlbumContent)(`/photospublic/${this.token}`, this.abortController.signal, this.publicClient);
        const fileIds = fetchedFiles.map(file => file.fileid.toString());
        fetchedFiles.forEach(file => {
          // Use custom preview URL to avoid authentication prompt
          file.previewUrl = (0,_nextcloud_router__WEBPACK_IMPORTED_MODULE_6__.generateUrl)(`/apps/photos/api/v1/publicPreview/${file.fileid}?x=2048&y=2048&token=${this.token}`); // Disable use of generic file previews for public albums - for older versions of the Viewer app

          file.hasPreview = false;
        });
        this.appendFiles(fetchedFiles);

        if (fetchedFiles.length > 0) {
          await this.$store.commit('addFilesToPublicAlbum', {
            collectionId: this.albumName,
            fileIdsToAdd: fileIds
          });
        }

        return fetchedFiles;
      } catch (error) {
        if (error.response?.status === 404) {
          this.errorFetchingFiles = 404;
          return [];
        }

        this.errorFetchingFiles = error;
        (0,_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_4__.showError)(this.t('photos', 'Failed to fetch albums list.'));
        _services_logger_js__WEBPACK_IMPORTED_MODULE_12__["default"].error('[PublicAlbumContent] Error fetching album files', {
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
      await this.addFilesToPublicAlbum({
        collectionId: this.albumName,
        fileIdsToAdd: fileIds
      }); // Re-fetch album content to have the proper filenames.

      await this.fetchAlbumContent();
    },

    async handleRemoveFilesFromAlbum(fileIds) {
      this.$refs.collectionContent.onUncheckFiles(fileIds);
      await this.removeFilesFromPublicAlbum({
        collectionId: this.albumName,
        fileIdsToRemove: fileIds
      });
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

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/PublicAlbumContent.vue?vue&type=style&index=0&id=56b53b66&lang=scss&scoped=true&":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/PublicAlbumContent.vue?vue&type=style&index=0&id=56b53b66&lang=scss&scoped=true& ***!
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
___CSS_LOADER_EXPORT___.push([module.id, ".album[data-v-56b53b66] {\n  display: flex;\n  flex-direction: column;\n}\n.album__title[data-v-56b53b66] {\n  width: 100%;\n}\n.album__name[data-v-56b53b66] {\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}\n.album__location[data-v-56b53b66] {\n  margin-left: -4px;\n  display: flex;\n  color: var(--color-text-lighter);\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/PublicAlbumContent.vue?vue&type=style&index=0&id=56b53b66&lang=scss&scoped=true&":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/PublicAlbumContent.vue?vue&type=style&index=0&id=56b53b66&lang=scss&scoped=true& ***!
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_PublicAlbumContent_vue_vue_type_style_index_0_id_56b53b66_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./PublicAlbumContent.vue?vue&type=style&index=0&id=56b53b66&lang=scss&scoped=true& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/PublicAlbumContent.vue?vue&type=style&index=0&id=56b53b66&lang=scss&scoped=true&");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_PublicAlbumContent_vue_vue_type_style_index_0_id_56b53b66_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_PublicAlbumContent_vue_vue_type_style_index_0_id_56b53b66_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_PublicAlbumContent_vue_vue_type_style_index_0_id_56b53b66_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_PublicAlbumContent_vue_vue_type_style_index_0_id_56b53b66_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/vue-material-design-icons/ImageOff.vue":
/*!*************************************************************!*\
  !*** ./node_modules/vue-material-design-icons/ImageOff.vue ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ImageOff_vue_vue_type_template_id_5c708780___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ImageOff.vue?vue&type=template&id=5c708780& */ "./node_modules/vue-material-design-icons/ImageOff.vue?vue&type=template&id=5c708780&");
/* harmony import */ var _ImageOff_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ImageOff.vue?vue&type=script&lang=js& */ "./node_modules/vue-material-design-icons/ImageOff.vue?vue&type=script&lang=js&");
/* harmony import */ var _vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _ImageOff_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _ImageOff_vue_vue_type_template_id_5c708780___WEBPACK_IMPORTED_MODULE_0__.render,
  _ImageOff_vue_vue_type_template_id_5c708780___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "node_modules/vue-material-design-icons/ImageOff.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/vue-material-design-icons/ImageOff.vue?vue&type=script&lang=js&":
/*!*************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/vue-material-design-icons/ImageOff.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "ImageOffIcon",
  emits: ['click'],
  props: {
    title: {
      type: String,
    },
    fillColor: {
      type: String,
      default: "currentColor"
    },
    size: {
      type: Number,
      default: 24
    }
  }
});


/***/ }),

/***/ "./node_modules/vue-material-design-icons/MapMarker.vue":
/*!**************************************************************!*\
  !*** ./node_modules/vue-material-design-icons/MapMarker.vue ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _MapMarker_vue_vue_type_template_id_c80f3d8c___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MapMarker.vue?vue&type=template&id=c80f3d8c& */ "./node_modules/vue-material-design-icons/MapMarker.vue?vue&type=template&id=c80f3d8c&");
/* harmony import */ var _MapMarker_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./MapMarker.vue?vue&type=script&lang=js& */ "./node_modules/vue-material-design-icons/MapMarker.vue?vue&type=script&lang=js&");
/* harmony import */ var _vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _MapMarker_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _MapMarker_vue_vue_type_template_id_c80f3d8c___WEBPACK_IMPORTED_MODULE_0__.render,
  _MapMarker_vue_vue_type_template_id_c80f3d8c___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "node_modules/vue-material-design-icons/MapMarker.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/vue-material-design-icons/MapMarker.vue?vue&type=script&lang=js&":
/*!**************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/vue-material-design-icons/MapMarker.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "MapMarkerIcon",
  emits: ['click'],
  props: {
    title: {
      type: String,
    },
    fillColor: {
      type: String,
      default: "currentColor"
    },
    size: {
      type: Number,
      default: 24
    }
  }
});


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

/***/ "./src/views/PublicAlbumContent.vue?vue&type=style&index=0&id=56b53b66&lang=scss&scoped=true&":
/*!****************************************************************************************************!*\
  !*** ./src/views/PublicAlbumContent.vue?vue&type=style&index=0&id=56b53b66&lang=scss&scoped=true& ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_PublicAlbumContent_vue_vue_type_style_index_0_id_56b53b66_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/style-loader/dist/cjs.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./PublicAlbumContent.vue?vue&type=style&index=0&id=56b53b66&lang=scss&scoped=true& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/PublicAlbumContent.vue?vue&type=style&index=0&id=56b53b66&lang=scss&scoped=true&");


/***/ }),

/***/ "./node_modules/vue-material-design-icons/ImageOff.vue?vue&type=script&lang=js&":
/*!**************************************************************************************!*\
  !*** ./node_modules/vue-material-design-icons/ImageOff.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _vue_loader_lib_index_js_vue_loader_options_ImageOff_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../vue-loader/lib/index.js??vue-loader-options!./ImageOff.vue?vue&type=script&lang=js& */ "./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/vue-material-design-icons/ImageOff.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_vue_loader_lib_index_js_vue_loader_options_ImageOff_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./node_modules/vue-material-design-icons/ImageOff.vue?vue&type=template&id=5c708780&":
/*!********************************************************************************************!*\
  !*** ./node_modules/vue-material-design-icons/ImageOff.vue?vue&type=template&id=5c708780& ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _vue_loader_lib_loaders_templateLoader_js_vue_loader_options_vue_loader_lib_index_js_vue_loader_options_ImageOff_vue_vue_type_template_id_5c708780___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _vue_loader_lib_loaders_templateLoader_js_vue_loader_options_vue_loader_lib_index_js_vue_loader_options_ImageOff_vue_vue_type_template_id_5c708780___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _vue_loader_lib_loaders_templateLoader_js_vue_loader_options_vue_loader_lib_index_js_vue_loader_options_ImageOff_vue_vue_type_template_id_5c708780___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../vue-loader/lib/index.js??vue-loader-options!./ImageOff.vue?vue&type=template&id=5c708780& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/vue-material-design-icons/ImageOff.vue?vue&type=template&id=5c708780&");


/***/ }),

/***/ "./node_modules/vue-material-design-icons/MapMarker.vue?vue&type=script&lang=js&":
/*!***************************************************************************************!*\
  !*** ./node_modules/vue-material-design-icons/MapMarker.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _vue_loader_lib_index_js_vue_loader_options_MapMarker_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../vue-loader/lib/index.js??vue-loader-options!./MapMarker.vue?vue&type=script&lang=js& */ "./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/vue-material-design-icons/MapMarker.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_vue_loader_lib_index_js_vue_loader_options_MapMarker_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./node_modules/vue-material-design-icons/MapMarker.vue?vue&type=template&id=c80f3d8c&":
/*!*********************************************************************************************!*\
  !*** ./node_modules/vue-material-design-icons/MapMarker.vue?vue&type=template&id=c80f3d8c& ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _vue_loader_lib_loaders_templateLoader_js_vue_loader_options_vue_loader_lib_index_js_vue_loader_options_MapMarker_vue_vue_type_template_id_c80f3d8c___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _vue_loader_lib_loaders_templateLoader_js_vue_loader_options_vue_loader_lib_index_js_vue_loader_options_MapMarker_vue_vue_type_template_id_c80f3d8c___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _vue_loader_lib_loaders_templateLoader_js_vue_loader_options_vue_loader_lib_index_js_vue_loader_options_MapMarker_vue_vue_type_template_id_c80f3d8c___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../vue-loader/lib/index.js??vue-loader-options!./MapMarker.vue?vue&type=template&id=c80f3d8c& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/vue-material-design-icons/MapMarker.vue?vue&type=template&id=c80f3d8c&");


/***/ }),

/***/ "./src/views/PublicAlbumContent.vue?vue&type=template&id=56b53b66&scoped=true&":
/*!*************************************************************************************!*\
  !*** ./src/views/PublicAlbumContent.vue?vue&type=template&id=56b53b66&scoped=true& ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_PublicAlbumContent_vue_vue_type_template_id_56b53b66_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_PublicAlbumContent_vue_vue_type_template_id_56b53b66_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_PublicAlbumContent_vue_vue_type_template_id_56b53b66_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./PublicAlbumContent.vue?vue&type=template&id=56b53b66&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/PublicAlbumContent.vue?vue&type=template&id=56b53b66&scoped=true&");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/vue-material-design-icons/ImageOff.vue?vue&type=template&id=5c708780&":
/*!***********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/vue-material-design-icons/ImageOff.vue?vue&type=template&id=5c708780& ***!
  \***********************************************************************************************************************************************************************************************************************************/
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
    "span",
    _vm._b(
      {
        staticClass: "material-design-icon image-off-icon",
        attrs: {
          "aria-hidden": !_vm.title,
          "aria-label": _vm.title,
          role: "img",
        },
        on: {
          click: function ($event) {
            return _vm.$emit("click", $event)
          },
        },
      },
      "span",
      _vm.$attrs,
      false
    ),
    [
      _c(
        "svg",
        {
          staticClass: "material-design-icon__svg",
          attrs: {
            fill: _vm.fillColor,
            width: _vm.size,
            height: _vm.size,
            viewBox: "0 0 24 24",
          },
        },
        [
          _c(
            "path",
            {
              attrs: {
                d: "M21 17.2L6.8 3H19C20.1 3 21 3.9 21 5V17.2M20.7 22L19.7 21H5C3.9 21 3 20.1 3 19V4.3L2 3.3L3.3 2L22 20.7L20.7 22M16.8 18L12.9 14.1L11 16.5L8.5 13.5L5 18H16.8Z",
              },
            },
            [_vm.title ? _c("title", [_vm._v(_vm._s(_vm.title))]) : _vm._e()]
          ),
        ]
      ),
    ]
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/vue-material-design-icons/MapMarker.vue?vue&type=template&id=c80f3d8c&":
/*!************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./node_modules/vue-material-design-icons/MapMarker.vue?vue&type=template&id=c80f3d8c& ***!
  \************************************************************************************************************************************************************************************************************************************/
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
    "span",
    _vm._b(
      {
        staticClass: "material-design-icon map-marker-icon",
        attrs: {
          "aria-hidden": !_vm.title,
          "aria-label": _vm.title,
          role: "img",
        },
        on: {
          click: function ($event) {
            return _vm.$emit("click", $event)
          },
        },
      },
      "span",
      _vm.$attrs,
      false
    ),
    [
      _c(
        "svg",
        {
          staticClass: "material-design-icon__svg",
          attrs: {
            fill: _vm.fillColor,
            width: _vm.size,
            height: _vm.size,
            viewBox: "0 0 24 24",
          },
        },
        [
          _c(
            "path",
            {
              attrs: {
                d: "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z",
              },
            },
            [_vm.title ? _c("title", [_vm._v(_vm._s(_vm.title))]) : _vm._e()]
          ),
        ]
      ),
    ]
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/PublicAlbumContent.vue?vue&type=template&id=56b53b66&scoped=true&":
/*!****************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/PublicAlbumContent.vue?vue&type=template&id=56b53b66&scoped=true& ***!
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
      _c(
        "CollectionContent",
        {
          ref: "collectionContent",
          attrs: {
            collection: _vm.album,
            "collection-file-ids": _vm.albumFileIds,
            semaphore: _vm.semaphore,
            loading: _vm.loadingAlbum || _vm.loadingFiles,
            error: _vm.errorFetchingAlbum || _vm.errorFetchingFiles,
          },
          scopedSlots: _vm._u(
            [
              {
                key: "header",
                fn: function (ref) {
                  var selectedFileIds = ref.selectedFileIds
                  return _vm.albumOriginalName !== ""
                    ? _c(
                        "HeaderNavigation",
                        {
                          key: "navigation",
                          attrs: {
                            loading: _vm.loadingAlbum || _vm.loadingFiles,
                            params: { token: _vm.token },
                            path: "/",
                            "root-title": _vm.albumOriginalName,
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
                                    _vm._s(_vm.album.location) + "\n\t\t\t"
                                  ),
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
                                      selectedFileIds.length > 0
                                        ? void 0
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
                    : _vm._e()
                },
              },
            ],
            null,
            true
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
            [_c("ImageOff", { attrs: { slot: "icon" }, slot: "icon" })],
            1
          ),
        ],
        1
      ),
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ })

}]);
//# sourceMappingURL=photos-src_views_PublicAlbumContent_vue.js.map?v=410ac1afd2bbe7280771