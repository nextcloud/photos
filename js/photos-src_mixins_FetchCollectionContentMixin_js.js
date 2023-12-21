"use strict";
(self["webpackChunkphotos"] = self["webpackChunkphotos"] || []).push([["src_mixins_FetchCollectionContentMixin_js"],{

/***/ "./src/mixins/FetchCollectionContentMixin.js":
/*!***************************************************!*\
  !*** ./src/mixins/FetchCollectionContentMixin.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/dialogs */ "./node_modules/@nextcloud/dialogs/dist/index.mjs");
/* harmony import */ var _AbortControllerMixin_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AbortControllerMixin.js */ "./src/mixins/AbortControllerMixin.js");
/* harmony import */ var _services_collectionFetcher_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/collectionFetcher.js */ "./src/services/collectionFetcher.js");
/* harmony import */ var _services_logger_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/logger.js */ "./src/services/logger.js");
/* harmony import */ var _utils_semaphoreWithPriority_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/semaphoreWithPriority.js */ "./src/utils/semaphoreWithPriority.js");
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
  name: 'FetchCollectionContentMixin',
  data() {
    return {
      fetchSemaphore: new _utils_semaphoreWithPriority_js__WEBPACK_IMPORTED_MODULE_4__["default"](1),
      loadingCollection: false,
      loadingCollectionFiles: false,
      errorFetchingCollection: null,
      errorFetchingCollectionFiles: null
    };
  },
  mixins: [_AbortControllerMixin_js__WEBPACK_IMPORTED_MODULE_1__["default"]],
  methods: {
    ...(0,vuex__WEBPACK_IMPORTED_MODULE_5__.mapActions)(['appendFiles', 'addCollections', 'setCollectionFiles']),
    /**
     * @param {string} collectionFileName
     * @param {string[]} [extraProps] - Extra properties to add to the DAV request.
     * @param {import('webdav').WebDAVClient} [client] - The DAV client to use.
     * @return {Promise<import('../services/collectionFetcher.js').Collection|null>}
     */
    async fetchCollection(collectionFileName, extraProps, client) {
      if (this.loadingCollection) {
        return null;
      }
      try {
        this.loadingCollection = true;
        this.errorFetchingCollection = null;
        const collection = await (0,_services_collectionFetcher_js__WEBPACK_IMPORTED_MODULE_2__.fetchCollection)(collectionFileName, {
          signal: this.abortController.signal
        }, extraProps, client);
        this.addCollections({
          collections: [collection]
        });
        return collection;
      } catch (error) {
        if (error.response?.status === 404) {
          this.errorFetchingCollection = 404;
          return null;
        }
        this.errorFetchingCollection = error;
        _services_logger_js__WEBPACK_IMPORTED_MODULE_3__["default"].error('[PublicCollectionContent] Error fetching collection', {
          error
        });
        (0,_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_0__.showError)(this.t('photos', 'Failed to fetch collection.'));
      } finally {
        this.loadingCollection = false;
      }
      return null;
    },
    /**
     * @param {string} collectionFileName
     * @param {string[]} [extraProps] - Extra properties to add to the DAV request.
     * @param {import('webdav').WebDAVClient} [client] - The DAV client to use.
     * @param {((value: import('../services/collectionFetcher.js').CollectionFile, index: number, array: import('../services/collectionFetcher.js').CollectionFile[]) => any)[]} [mappers] - Callback that can transform files before they are appended.
     * @return {Promise<import('../services/collectionFetcher.js').CollectionFile[]>}
     */
    async fetchCollectionFiles(collectionFileName, extraProps, client) {
      let mappers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
      if (this.loadingCollectionFiles) {
        return [];
      }
      const fetchSemaphoreSymbol = await this.fetchSemaphore.acquire();
      try {
        this.errorFetchingCollectionFiles = null;
        this.loadingCollectionFiles = true;
        let fetchedFiles = await (0,_services_collectionFetcher_js__WEBPACK_IMPORTED_MODULE_2__.fetchCollectionFiles)(collectionFileName, {
          signal: this.abortController.signal
        }, extraProps, client);
        const fileIds = fetchedFiles.map(file => file.fileid.toString());
        mappers.forEach(mapper => fetchedFiles = fetchedFiles.map(mapper));
        this.appendFiles(fetchedFiles);
        if (fetchedFiles.length > 0) {
          await this.$store.commit('setCollectionFiles', {
            collectionFileName,
            fileIds
          });
        }
        return fetchedFiles;
      } catch (error) {
        if (error.response?.status === 404) {
          this.errorFetchingCollectionFiles = 404;
          return [];
        }
        this.errorFetchingCollectionFiles = error;
        (0,_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_0__.showError)(this.t('photos', 'Failed to fetch collections list.'));
        _services_logger_js__WEBPACK_IMPORTED_MODULE_3__["default"].error('[PublicCollectionContent] Error fetching collection files', {
          error
        });
      } finally {
        this.loadingCollectionFiles = false;
        this.fetchSemaphore.release(fetchSemaphoreSymbol);
      }
      return [];
    }
  }
});

/***/ }),

/***/ "./src/services/collectionFetcher.js":
/*!*******************************************!*\
  !*** ./src/services/collectionFetcher.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fetchCollection": () => (/* binding */ fetchCollection),
/* harmony export */   "fetchCollectionFiles": () => (/* binding */ fetchCollectionFiles),
/* harmony export */   "fetchCollections": () => (/* binding */ fetchCollections)
/* harmony export */ });
/* harmony import */ var _nextcloud_moment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/moment */ "./node_modules/@nextcloud/moment/dist/index.js");
/* harmony import */ var _nextcloud_moment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_moment__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _nextcloud_l10n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/l10n */ "./node_modules/@nextcloud/l10n/dist/index.mjs");
/* harmony import */ var _DavClient_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DavClient.js */ "./src/services/DavClient.js");
/* harmony import */ var _logger_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./logger.js */ "./src/services/logger.js");
/* harmony import */ var _utils_fileUtils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/fileUtils.js */ "./src/utils/fileUtils.js");
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
 * @typedef {object} Collection
 * @property {string} basename - The name of the collection (ex: "Athens").
 * @property {string} filename - The filename of the collection (ex: "/photos/admin/places/Athens").
 * @property {string} source - The full source of the collection (ex: "https://nextcloud_server1.test/remote.php/dav//photos/admin/places/Athens").
 * @property {number} nbItems - The number of item in the collection.
 * @property {number} lastPhoto - The file id for the cover of the collection.
 */

/**
 * @typedef {object} CollectionFile
 * @property {string} fileid - The id of the file.
 * @property {string} basename - The name of the file (ex: "790-IMG_20180906_085724.jpg").
 * @property {string} filename - The file name of the file (ex: "/photos/admin/places/Athens/790-IMG_20180906_085724.jpg").
 * @property {string} source - The full source of the collection (ex: "https://nextcloud_server1.test/remote.php/dav//photos/admin/places/Athens/790-IMG_20180906_085724.jpg").
 * @property {object} metadataPhotosSize - The metadata of the file.
 * @property {number} metadataPhotosSize.width - The width of the file.
 * @property {number} metadataPhotosSize.height - The height of the file.
 */

/** @typedef {Object<string, Collection>} IndexedCollections */
/** @typedef {Object<string, CollectionFile>} IndexedCollectionFiles */

/**
 * @param {string[]} extraProps - Extra properties to add to the DAV request.
 * @return {string}
 */
function getCollectionDavRequest() {
  let extraProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return `<?xml version="1.0"?>
			<d:propfind xmlns:d="DAV:"
				xmlns:oc="http://owncloud.org/ns"
				xmlns:nc="http://nextcloud.org/ns"
				xmlns:ocs="http://open-collaboration-services.org/ns">
				<d:prop>
					<nc:last-photo />
					<nc:nbItems />
					${extraProps.join('')}
				</d:prop>
			</d:propfind>`;
}

/**
 * @param {string[]} extraProps - Extra properties to add to the DAV request.
 * @return {string}
 */
function getCollectionFilesDavRequest() {
  let extraProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return `<?xml version="1.0"?>
			<d:propfind xmlns:d="DAV:"
				xmlns:oc="http://owncloud.org/ns"
				xmlns:nc="http://nextcloud.org/ns"
				xmlns:ocs="http://open-collaboration-services.org/ns">
				<d:prop>
					<d:getcontentlength />
					<d:getcontenttype />
					<d:getetag />
					<d:getlastmodified />
					<d:resourcetype />
					<nc:metadata-photos-size />
					<nc:metadata-photos-original_date_time />
					<nc:metadata-files-live-photo />
					<nc:has-preview />
					<nc:hidden />
					<oc:favorite />
					<oc:fileid />
					<oc:permissions />
					${extraProps.join('')}
				</d:prop>
			</d:propfind>`;
}

/**
 * @param {string} path - Collections' root path.
 * @param {import('webdav').StatOptions} options - Options to forward to the webdav client.
 * @param {string[]} extraProps - Extra properties to add to the DAV request.
 * @param {import('webdav').WebDAVClient} client - The DAV client to use.
 * @return {Promise<Collection|null>}
 */
async function fetchCollection(path, options) {
  let extraProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  let client = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _DavClient_js__WEBPACK_IMPORTED_MODULE_2__["default"];
  try {
    const response = await client.stat(path, {
      data: getCollectionDavRequest(extraProps),
      details: true,
      ...options
    });
    _logger_js__WEBPACK_IMPORTED_MODULE_3__["default"].debug('[Collections] Fetched a collection: ', {
      data: response.data
    });
    return formatCollection(response.data);
  } catch (error) {
    if (error.code === 'ERR_CANCELED') {
      return null;
    }
    throw error;
  }
}

/**
 *
 * @param {string} path - Collections' root path.
 * @param {import('webdav').StatOptions} options - Options to forward to the webdav client.
 * @param {string[]} extraProps - Extra properties to add to the DAV request.
 * @param {import('webdav').WebDAVClient} client - The DAV client to use.
 * @return {Promise<Collection[]>}
 */
async function fetchCollections(path, options) {
  let extraProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  let client = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _DavClient_js__WEBPACK_IMPORTED_MODULE_2__["default"];
  try {
    const response = await client.getDirectoryContents(path, {
      data: getCollectionDavRequest(extraProps),
      details: true,
      ...options
    });
    _logger_js__WEBPACK_IMPORTED_MODULE_3__["default"].debug(`[Collections] Fetched ${response.data.length} collections: `, {
      data: response.data
    });
    return response.data.filter(collection => collection.filename !== path).map(formatCollection);
  } catch (error) {
    if (error.code === 'ERR_CANCELED') {
      return [];
    }
    throw error;
  }
}

/**
 *
 * @param {object} rawCollection - An collection received from a webdav request.
 * @return {Collection}
 */
function formatCollection(rawCollection) {
  // Ensure that we have a proper collaborators array.
  if (rawCollection.props.collaborators === undefined || rawCollection.props.collaborators === '') {
    rawCollection.props.collaborators = [];
  } else if (typeof rawCollection.props.collaborators.collaborator === 'object') {
    if (Array.isArray(rawCollection.props.collaborators.collaborator)) {
      rawCollection.props.collaborators = rawCollection.props.collaborators.collaborator;
    } else {
      rawCollection.props.collaborators = [rawCollection.props.collaborators.collaborator];
    }
  }

  // Extract custom props.
  rawCollection = (0,_utils_fileUtils_js__WEBPACK_IMPORTED_MODULE_4__.genFileInfo)(rawCollection);

  // Compute date range label.
  const dateRange = JSON.parse(rawCollection.dateRange?.replace(/&quot;/g, '"') ?? '{}');
  if (dateRange.start === null) {
    dateRange.start = _nextcloud_moment__WEBPACK_IMPORTED_MODULE_0___default()().unix();
    dateRange.end = _nextcloud_moment__WEBPACK_IMPORTED_MODULE_0___default()().unix();
  }
  const dateRangeFormatted = {
    startDate: _nextcloud_moment__WEBPACK_IMPORTED_MODULE_0___default().unix(dateRange.start).format('MMMM YYYY'),
    endDate: _nextcloud_moment__WEBPACK_IMPORTED_MODULE_0___default().unix(dateRange.end).format('MMMM YYYY')
  };
  if (dateRangeFormatted.startDate === dateRangeFormatted.endDate) {
    rawCollection.date = dateRangeFormatted.startDate;
  } else {
    rawCollection.date = (0,_nextcloud_l10n__WEBPACK_IMPORTED_MODULE_1__.translate)('photos', '{startDate} to {endDate}', dateRangeFormatted);
  }
  return rawCollection;
}

/**
 *
 * @param {string} path - Collections' root path.
 * @param {import('webdav').StatOptions} options - Options to forward to the webdav client.
 * @param {string[]} extraProps - Extra properties to add to the DAV request.
 * @param {import('webdav').WebDAVClient} client - The DAV client to use.
 * @return {Promise<CollectionFile[]>}
 */
async function fetchCollectionFiles(path, options) {
  let extraProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  let client = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _DavClient_js__WEBPACK_IMPORTED_MODULE_2__["default"];
  try {
    const response = await client.getDirectoryContents(path, {
      data: getCollectionFilesDavRequest(extraProps),
      details: true,
      ...options
    });
    const fetchedFiles = response.data.map(file => (0,_utils_fileUtils_js__WEBPACK_IMPORTED_MODULE_4__.genFileInfo)(file)).filter(file => file.fileid);
    _logger_js__WEBPACK_IMPORTED_MODULE_3__["default"].debug(`[Collections] Fetched ${fetchedFiles.length} new files: `, fetchedFiles);
    return fetchedFiles;
  } catch (error) {
    if (error.code === 'ERR_CANCELED') {
      return [];
    }
    _logger_js__WEBPACK_IMPORTED_MODULE_3__["default"].error('Error fetching collection files', {
      error
    });
    console.error(error);
    throw error;
  }
}

/***/ })

}]);
//# sourceMappingURL=photos-src_mixins_FetchCollectionContentMixin_js.js.map?v=51427cd203cde0eb0e8b