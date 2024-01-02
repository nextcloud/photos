"use strict";
(self["webpackChunkphotos"] = self["webpackChunkphotos"] || []).push([["src_mixins_FetchFilesMixin_js"],{

/***/ "./src/mixins/FetchFilesMixin.js":
/*!***************************************!*\
  !*** ./src/mixins/FetchFilesMixin.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _nextcloud_moment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/moment */ "./node_modules/@nextcloud/moment/dist/index.js");
/* harmony import */ var _nextcloud_moment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_moment__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_logger_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/logger.js */ "./src/services/logger.js");
/* harmony import */ var _services_PhotoSearch_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/PhotoSearch.js */ "./src/services/PhotoSearch.js");
/* harmony import */ var _utils_semaphoreWithPriority_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/semaphoreWithPriority.js */ "./src/utils/semaphoreWithPriority.js");
/* harmony import */ var _AbortControllerMixin_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./AbortControllerMixin.js */ "./src/mixins/AbortControllerMixin.js");
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
  name: 'FetchFilesMixin',
  mixins: [_AbortControllerMixin_js__WEBPACK_IMPORTED_MODULE_4__["default"]],
  data() {
    const dateTimeUpperBound = undefined;
    const dateTimeLowerBound = _nextcloud_moment__WEBPACK_IMPORTED_MODULE_0___default()().subtract(4, 'months');
    return {
      errorFetchingFiles: null,
      loadingFiles: false,
      doneFetchingFiles: false,
      fetchSemaphore: new _utils_semaphoreWithPriority_js__WEBPACK_IMPORTED_MODULE_3__["default"](1),
      fetchedFileIds: [],
      dateTimeUpperBound,
      dateTimeLowerBound,
      timeWindowSteps: 4,
      firstResultOffset: 0
    };
  },
  watch: {
    '$route.path'() {
      this.resetFetchFilesState();
    }
  },
  methods: {
    /**
     * @param {string} path - Path to pass to getPhotos.
     * @param {object} options - Options to pass to getPhotos.
     * @param {string[]} [blacklist=[]] - Array of ids to filter out.
     * @param {boolean} [force=false] - Force fetching even if doneFetchingFiles is true
     * @return {Promise<string[]>} - The next batch of data depending on global offset.
     */
    async fetchFiles() {
      let path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      let blacklist = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      let force = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      if (this.doneFetchingFiles && !force || this.loadingFiles) {
        return [];
      }
      const fetchSemaphoreSymbol = await this.fetchSemaphore.acquire();
      try {
        this.errorFetchingFiles = null;
        this.loadingFiles = true;
        const numberOfImagesPerBatch = 200;
        _services_logger_js__WEBPACK_IMPORTED_MODULE_1__["default"].debug(`[FetchFilesMixin] Fetching file between ${this.dateTimeUpperBound?.format('L')} 'and' ${this.dateTimeLowerBound?.format('L')}`);

        // Load next batch of images
        const fetchedFiles = await (0,_services_PhotoSearch_js__WEBPACK_IMPORTED_MODULE_2__["default"])(path, {
          firstResult: this.firstResultOffset,
          nbResults: numberOfImagesPerBatch,
          dateTimeUpperBound: this.dateTimeUpperBound?.unix(),
          dateTimeLowerBound: this.dateTimeLowerBound?.unix(),
          ...options,
          signal: this.abortController.signal
        });
        if (fetchedFiles.length === numberOfImagesPerBatch) {
          // If we have the same number of files than as requested
          // then the time window probably contains more, so we simply bump the first result offset.
          this.firstResultOffset += fetchedFiles.length;
        } else if (fetchedFiles.length === 0 && this.firstResultOffset === 0) {
          // If we tried a new window and it is empty
          if (this.dateTimeUpperBound === undefined && this.dateTimeLowerBound === undefined) {
            // if upper bound has been cleared, then we are done fetching files.
            this.doneFetchingFiles = true;
          } else if (this.dateTimeLowerBound === undefined) {
            // else if lower bound has been cleared, then we clear upper bound
            // this will allow the server to return all files with either empty or above than now original date time
            this.dateTimeUpperBound = undefined;
          } else if (this.dateTimeUpperBound === undefined) {
            this.dateTimeUpperBound = this.dateTimeLowerBound;
          } else if (this.timeWindowSteps === 64) {
            // else if we reach 64 months, we clear the lower bound.
            this.dateTimeUpperBound = this.dateTimeLowerBound;
            this.dateTimeLowerBound = undefined;
          } else {
            // else we progressively increase the time window until we reach 64 months (3 requests)
            this.timeWindowSteps *= 4;
            this.dateTimeUpperBound = this.dateTimeLowerBound;
            this.dateTimeLowerBound = _nextcloud_moment__WEBPACK_IMPORTED_MODULE_0___default()(this.dateTimeLowerBound).subtract(this.timeWindowSteps, 'months');
          }
        } else if (fetchedFiles.length !== numberOfImagesPerBatch) {
          // If we get less files than requested,
          // we are at the end for the current time window, so we move to the next one.
          this.timeWindowSteps = 4;
          this.dateTimeUpperBound = this.dateTimeLowerBound;
          if (this.dateTimeUpperBound !== undefined) {
            this.dateTimeLowerBound = _nextcloud_moment__WEBPACK_IMPORTED_MODULE_0___default()(this.dateTimeUpperBound).subtract(this.timeWindowSteps, 'months');
          } else {
            this.doneFetchingFiles = true;
          }
        }
        const fileIds = fetchedFiles.map(file => file.fileid).filter(fileId => !this.fetchedFileIds.includes(fileId.toString())); // Filter to prevent duplicate fileIds.

        this.fetchedFileIds.push(...fileIds.map(fileId => fileId.toString()).filter(fileId => !blacklist.includes(fileId)));
        this.$store.dispatch('appendFiles', fetchedFiles);
        _services_logger_js__WEBPACK_IMPORTED_MODULE_1__["default"].debug(`[FetchFilesMixin] Fetched ${fileIds.length} new files: `, fileIds);
        return fileIds;
      } catch (error) {
        if (error.response?.status === 404) {
          this.errorFetchingFiles = 404;
        } else if (error.code === 'ERR_CANCELED') {
          return [];
        } else {
          this.errorFetchingFiles = error;
        }

        // cancelled request, moving on...
        _services_logger_js__WEBPACK_IMPORTED_MODULE_1__["default"].error('Error fetching files', {
          error
        });
        console.error(error);
      } finally {
        this.loadingFiles = false;
        this.fetchSemaphore.release(fetchSemaphoreSymbol);
      }
      return [];
    },
    resetFetchFilesState() {
      this.doneFetchingFiles = false;
      this.errorFetchingFiles = null;
      this.loadingFiles = false;
      this.timeWindowSteps = 4;
      this.dateTimeUpperBound = undefined;
      this.dateTimeLowerBound = _nextcloud_moment__WEBPACK_IMPORTED_MODULE_0___default()(this.dateTimeUpperBound).subtract(this.timeWindowSteps, 'months');
      this.fetchedFileIds = [];
    }
  }
});

/***/ }),

/***/ "./src/services/PhotoSearch.js":
/*!*************************************!*\
  !*** ./src/services/PhotoSearch.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ photosSearch)
/* harmony export */ });
/* harmony import */ var _utils_fileUtils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/fileUtils.js */ "./src/utils/fileUtils.js");
/* harmony import */ var _nextcloud_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/auth */ "./node_modules/@nextcloud/auth/dist/index.es.mjs");
/* harmony import */ var _AllowedMimes_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AllowedMimes.js */ "./src/services/AllowedMimes.js");
/* harmony import */ var _DavClient_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./DavClient.js */ "./src/services/DavClient.js");
/* harmony import */ var _DavRequest_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./DavRequest.js */ "./src/services/DavRequest.js");
/* harmony import */ var _nextcloud_moment__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @nextcloud/moment */ "./node_modules/@nextcloud/moment/dist/index.js");
/* harmony import */ var _nextcloud_moment__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_moment__WEBPACK_IMPORTED_MODULE_5__);
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







const eqFavorites = `
	<d:eq>
		<d:prop>
			<oc:favorite/>
		</d:prop>
		<d:literal>1</d:literal>
	</d:eq>`;
const metadataNotNull = `
	<d:not>
		<d:is-defined>
			<d:prop><nc:metadata-photos-original_date_time/></d:prop>
		</d:is-defined>
	</d:not>`;
const orderByMetadata = `
	<d:order>
		<d:prop><nc:metadata-photos-original_date_time/></d:prop>
		<d:descending/>
	</d:order>`;
const orderByLastModified = `
	<d:>
		<d:prop><d:getlastmodified/></d:prop>
		<d:descending/>
	</d: order >`;

/**
 * List files from a folder and filter out unwanted mimes
 *
 * @param {object} path the lookup path
 * @param {object} [opts] used for the cancellable requests
 * @param {number} [opts.firstResult=0] Index of the first result that we want (starts at 0)
 * @param {number} [opts.nbResults=200] The number of file to fetch
 * @param {string[]} [opts.mimesType=allMimes] Mime type of the files
 * @param {boolean} [opts.full=false] get full data of the files
 * @param {boolean} [opts.onThisDay=false] get only items from this day of year
 * @param {boolean} [opts.onlyFavorites=false] get only favorite items
 * @param {number} [opts.dateTimeUpperBound] limit the search to photos taken before this lower bound
 * @param {number} [opts.dateTimeLowerBound] limit the search to photos taken after this lower bound
 * @return {Promise<object[]>} the file list
 */
async function photosSearch() {
  let path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  // default function options
  const options = {
    firstResult: 0,
    nbResults: 200,
    mimesType: _AllowedMimes_js__WEBPACK_IMPORTED_MODULE_2__.allMimes,
    onThisDay: false,
    onlyFavorites: false,
    ...opts
  };
  const prefixPath = `/files/${(0,_nextcloud_auth__WEBPACK_IMPORTED_MODULE_1__.getCurrentUser)()?.uid}`;

  // generating the search or condition
  // based on the allowed mimetypes
  const orMime = getMtimeConstraint(options.mimesType);
  const favorites = options.onlyFavorites ? eqFavorites : '';
  const onThisDay = options.onThisDay ? getOnThisDayConstraint() : '';
  // To improve the performance of the request, we create time boundaries to limit the number of file that the requests handles in the DB.
  // Having constraints on both last modified (mtime) and metadata-original_taken_date in the same request does not improve performance
  // But having two requests with boundaries on one property and then the other, drastically increase the performances.
  // So here we are with this little hack.
  // We do not need this hack when onThisDay and onlyFavorites constraints are on.
  const timeBoundaries = !options.onThisDay && !options.onlyFavorites ? getTimeBoundariesConstraint(options.dateTimeUpperBound, options.dateTimeLowerBound) : [[]];
  const requests = timeBoundaries.map(_ref => {
    let [timeBoundaries] = _ref;
    const requestParams = {
      ...options,
      method: 'SEARCH',
      headers: {
        'content-Type': 'text/xml'
      },
      deep: true,
      details: true,
      data: getSearchRequestData(prefixPath, path, `<d:and>${[orMime, favorites, onThisDay, ...timeBoundaries].join('\n')}</d:and>`, [orderByMetadata, orderByLastModified].join('\n'), options)
    };
    return _DavClient_js__WEBPACK_IMPORTED_MODULE_3__["default"].getDirectoryContents('', requestParams);
  });
  const responses = await Promise.all(requests);
  return responses.flat().data.map(data => (0,_utils_fileUtils_js__WEBPACK_IMPORTED_MODULE_0__.genFileInfo)(data));
}

/**
 *
 * @param {string} prefixPath
 * @param {string} path
 * @param {string} constraints
 * @param {string} orderBy
 * @param {object} options
 * @param {number} options.firstResult
 * @param {number} options.nbResults
 */
function getSearchRequestData(prefixPath, path, constraints, orderBy, options) {
  return `<?xml version="1.0" encoding="UTF-8"?>
	<d:searchrequest xmlns:d="DAV:"
		xmlns:oc="http://owncloud.org/ns"
		xmlns:nc="http://nextcloud.org/ns"
		xmlns:ns="https://github.com/icewind1991/SearchDAV/ns"
		xmlns:ocs="http://open-collaboration-services.org/ns">
		<d:basicsearch>
			<d:select>
				<d:prop>
					${_DavRequest_js__WEBPACK_IMPORTED_MODULE_4__.props}
				</d:prop>
			</d:select>
			<d:from>
				<d:scope>
					<d:href>${prefixPath}/${path}</d:href>
					<d:depth>infinity</d:depth>
				</d:scope>
			</d:from>
			<d:where>
				${constraints}
			</d:where>
			<d:orderby>${orderBy}</d:orderby>
			<d:limit>
				<d:nresults>${options.nbResults}</d:nresults>
				<ns:firstresult>${options.firstResult}</ns:firstresult>
			</d:limit>
		</d:basicsearch>
	</d:searchrequest>`;
}

/**
 *
 * @param {string[]} mimesType
 */
function getMtimeConstraint(mimesType) {
  const mtimeConstraints = mimesType.map(mime => `
				<d:eq>
					<d:prop><d:getcontenttype/></d:prop>
					<d:literal>${mime}</d:literal>
				</d:eq>`).join('');
  return `<d:or>${mtimeConstraints}</d:or>`;
}
function getOnThisDayConstraint() {
  const targetedDays = Array(20).fill(1).map((_, years) => {
    const start = _nextcloud_moment__WEBPACK_IMPORTED_MODULE_5___default()(Date.now()).startOf('day').subtract(3, 'd').subtract(years + 1, 'y');
    const end = _nextcloud_moment__WEBPACK_IMPORTED_MODULE_5___default()(Date.now()).endOf('day').add(3, 'd').subtract(years + 1, 'y');
    return `
				<d:and>
					<d:gt>
						<d:prop>
							<d:getlastmodified />
						</d:prop>
						<d:literal>${start.format((_nextcloud_moment__WEBPACK_IMPORTED_MODULE_5___default().defaultFormatUtc))}</d:literal>
					</d:gt>
					<d:lt>
						<d:prop>
							<d:getlastmodified />
						</d:prop>
						<d:literal>${end.format((_nextcloud_moment__WEBPACK_IMPORTED_MODULE_5___default().defaultFormatUtc))}</d:literal>
					</d:lt>
				</d:and>
			`;
  }).join('\n');
  return `<d:or>${targetedDays}</d:or>`;
}

/**
 *
 * @param {number} [upperBound]
 * @param {number} [lowerBound]
 */
function getTimeBoundariesConstraint(upperBound, lowerBound) {
  const timeBoundariesMetadata = [];
  const timeBoundariesLastModified = [metadataNotNull];
  if (upperBound !== undefined) {
    timeBoundariesMetadata.push(`
			<d:lte>
				<d:prop><nc:metadata-photos-original_date_time/></d:prop>
				<d:literal>${upperBound}</d:literal>
			</d:lte>`);
    timeBoundariesLastModified.push(`
			<d:lte>
				<d:prop><d:getlastmodified/></d:prop>
				<d:literal>${upperBound}</d:literal>
			</d:lte>`);
  }
  if (lowerBound !== undefined) {
    timeBoundariesMetadata.push(`
			<d:gt>
				<d:prop><nc:metadata-photos-original_date_time/></d:prop>
				<d:literal>${lowerBound}</d:literal>
			</d:gt>`);
    timeBoundariesLastModified.push(`
			<d:gt>
				<d:prop><d:getlastmodified/></d:prop>
				<d:literal>${lowerBound}</d:literal>
			</d:gt>`);
  }
  return [timeBoundariesMetadata, timeBoundariesLastModified];
}

/***/ })

}]);
//# sourceMappingURL=photos-src_mixins_FetchFilesMixin_js.js.map?v=fe680790d6fc69075821