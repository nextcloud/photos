"use strict";
(self["webpackChunkphotos"] = self["webpackChunkphotos"] || []).push([["src_views_FaceContent_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FaceMergeForm.vue?vue&type=script&lang=js&":
/*!***********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FaceMergeForm.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _mixins_FaceCoverMixin_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../mixins/FaceCoverMixin.js */ "./src/mixins/FaceCoverMixin.js");
/* harmony import */ var _mixins_FetchFacesMixin_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../mixins/FetchFacesMixin.js */ "./src/mixins/FetchFacesMixin.js");
/* harmony import */ var _FaceCover_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FaceCover.vue */ "./src/components/FaceCover.vue");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
  name: 'FaceMergeForm',
  components: {
    FaceCover: _FaceCover_vue__WEBPACK_IMPORTED_MODULE_2__["default"]
  },
  mixins: [_mixins_FaceCoverMixin_js__WEBPACK_IMPORTED_MODULE_0__["default"], _mixins_FetchFacesMixin_js__WEBPACK_IMPORTED_MODULE_1__["default"]],
  props: {
    firstFace: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      loading: false
    };
  },

  computed: { ...(0,vuex__WEBPACK_IMPORTED_MODULE_3__.mapGetters)(['files', 'faces', 'facesFiles']),

    filteredFaces() {
      return Object.values(this.faces).filter(face => face.basename !== this.firstFace).sort((a, b) => {
        if (a.props.nbItems && b.props.nbItems) {
          return b.props.nbItems - a.props.nbItems;
        }

        if (!this.facesFiles[b.basename] || !this.facesFiles[a.basename]) {
          return 0;
        }

        return this.facesFiles[b.basename].length - this.facesFiles[a.basename].length;
      });
    }

  },
  methods: {
    handleSelect(faceName) {
      this.$emit('select', faceName);
      this.loading = true;
    }

  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/FaceContent.vue?vue&type=script&lang=js&":
/*!****************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/FaceContent.vue?vue&type=script&lang=js& ***!
  \****************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var vue_material_design_icons_Pencil__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue-material-design-icons/Pencil */ "./node_modules/vue-material-design-icons/Pencil.vue");
/* harmony import */ var vue_material_design_icons_Close__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-material-design-icons/Close */ "./node_modules/vue-material-design-icons/Close.vue");
/* harmony import */ var vue_material_design_icons_AlertCircle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vue-material-design-icons/AlertCircle */ "./node_modules/vue-material-design-icons/AlertCircle.vue");
/* harmony import */ var vue_material_design_icons_Star__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! vue-material-design-icons/Star */ "./node_modules/vue-material-design-icons/Star.vue");
/* harmony import */ var vue_material_design_icons_Download__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! vue-material-design-icons/Download */ "./node_modules/vue-material-design-icons/Download.vue");
/* harmony import */ var vue_material_design_icons_Send__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! vue-material-design-icons/Send */ "./node_modules/vue-material-design-icons/Send.vue");
/* harmony import */ var vue_material_design_icons_Merge__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! vue-material-design-icons/Merge */ "./node_modules/vue-material-design-icons/Merge.vue");
/* harmony import */ var vue_material_design_icons_ArrowLeft__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! vue-material-design-icons/ArrowLeft */ "./node_modules/vue-material-design-icons/ArrowLeft.vue");
/* harmony import */ var vue_material_design_icons_AccountBoxMultipleOutline__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! vue-material-design-icons/AccountBoxMultipleOutline */ "./node_modules/vue-material-design-icons/AccountBoxMultipleOutline.vue");
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @nextcloud/vue */ "./node_modules/@nextcloud/vue/dist/ncvuecomponents.js");
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_vue__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _mixins_FetchFilesMixin_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../mixins/FetchFilesMixin.js */ "./src/mixins/FetchFilesMixin.js");
/* harmony import */ var _mixins_FilesSelectionMixin_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../mixins/FilesSelectionMixin.js */ "./src/mixins/FilesSelectionMixin.js");
/* harmony import */ var _components_FilesListViewer_vue__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../components/FilesListViewer.vue */ "./src/components/FilesListViewer.vue");
/* harmony import */ var _components_File_vue__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../components/File.vue */ "./src/components/File.vue");
/* harmony import */ var _services_logger_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../services/logger.js */ "./src/services/logger.js");
/* harmony import */ var _mixins_FetchFacesMixin_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../mixins/FetchFacesMixin.js */ "./src/mixins/FetchFacesMixin.js");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm.js");
/* harmony import */ var _components_FaceMergeForm_vue__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../components/FaceMergeForm.vue */ "./src/components/FaceMergeForm.vue");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
  name: 'FaceContent',
  components: {
    Pencil: vue_material_design_icons_Pencil__WEBPACK_IMPORTED_MODULE_0__["default"],
    Star: vue_material_design_icons_Star__WEBPACK_IMPORTED_MODULE_3__["default"],
    Download: vue_material_design_icons_Download__WEBPACK_IMPORTED_MODULE_4__["default"],
    Close: vue_material_design_icons_Close__WEBPACK_IMPORTED_MODULE_1__["default"],
    AlertCircle: vue_material_design_icons_AlertCircle__WEBPACK_IMPORTED_MODULE_2__["default"],
    Send: vue_material_design_icons_Send__WEBPACK_IMPORTED_MODULE_5__["default"],
    Merge: vue_material_design_icons_Merge__WEBPACK_IMPORTED_MODULE_6__["default"],
    ArrowLeft: vue_material_design_icons_ArrowLeft__WEBPACK_IMPORTED_MODULE_7__["default"],
    AccountBoxMultipleOutline: vue_material_design_icons_AccountBoxMultipleOutline__WEBPACK_IMPORTED_MODULE_8__["default"],
    FaceMergeForm: _components_FaceMergeForm_vue__WEBPACK_IMPORTED_MODULE_16__["default"],
    FilesListViewer: _components_FilesListViewer_vue__WEBPACK_IMPORTED_MODULE_12__["default"],
    File: _components_File_vue__WEBPACK_IMPORTED_MODULE_13__["default"],
    NcLoadingIcon: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_9__.NcLoadingIcon,
    NcEmptyContent: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_9__.NcEmptyContent,
    NcActions: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_9__.NcActions,
    NcActionButton: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_9__.NcActionButton,
    NcModal: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_9__.NcModal,
    NcButton: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_9__.NcButton
  },
  directives: {
    focus(el) {
      vue__WEBPACK_IMPORTED_MODULE_17__["default"].nextTick(() => el.focus());
    }

  },
  mixins: [_mixins_FetchFacesMixin_js__WEBPACK_IMPORTED_MODULE_15__["default"], _mixins_FetchFilesMixin_js__WEBPACK_IMPORTED_MODULE_10__["default"], _mixins_FilesSelectionMixin_js__WEBPACK_IMPORTED_MODULE_11__["default"]],
  props: {
    faceName: {
      type: String,
      default: '/'
    }
  },

  data() {
    return {
      showMergeModal: false,
      showRenameModal: false,
      loadingCount: 0,
      appContent: document.getElementById('app-content-vue')
    };
  },

  computed: { ...(0,vuex__WEBPACK_IMPORTED_MODULE_18__.mapGetters)(['files', 'facesFiles']),

    /**
     * @return {string[]} The face information for the current faceName.
     */
    face() {
      return this.faces[this.faceName];
    },

    /**
     * @return {string[]} The list of files for the current faceName.
     */
    faceFileIds() {
      return this.facesFiles[this.faceName] || [];
    },

    /** @type {boolean} */
    shouldFavoriteSelection() {
      // Favorite all selection if at least one file is not on the favorites.
      return this.selectedFileIds.some(fileId => this.$store.state.files.files[fileId].favorite === 0);
    }

  },
  watch: {
    face() {
      if (this.face) {
        this.fetchFaceContent(this.faceName);
      }
    }

  },
  methods: { ...(0,vuex__WEBPACK_IMPORTED_MODULE_18__.mapActions)(['appendFiles', 'deleteFace', 'renameFace', 'downloadFiles', 'toggleFavoriteForFiles', 'removeFilesFromFace', 'moveFilesToFace']),

    openViewer(fileId) {
      const file = this.files[fileId];
      OCA.Viewer.open({
        // remove /username/files/ from the start
        path: '/' + file.filename.split('/').slice(3).join('/'),
        list: this.faceFileIds.map(fileId => ({ ...this.files[fileId],
          basename: this.files[fileId].basename.split('-').slice(1).join('-')
        })).filter(file => !file.sectionHeader),
        loadMore: file.loadMore ? async () => await file.loadMore(true) : () => [],
        canLoop: file.canLoop
      });
    },

    async handleRemoveFilesFromFace(fileIds) {
      try {
        this.loadingCount++;
        await this.removeFilesFromFace({
          faceName: this.faceName,
          fileIdsToRemove: fileIds
        });
        this.resetSelection();
      } catch (error) {
        _services_logger_js__WEBPACK_IMPORTED_MODULE_14__["default"].error(error);
      } finally {
        this.loadingCount--;
      }
    },

    async handleDeleteFace() {
      try {
        this.loadingCount++;
        await this.deleteFace({
          faceName: this.faceName
        });
        this.$router.push('/faces');
      } catch (error) {
        _services_logger_js__WEBPACK_IMPORTED_MODULE_14__["default"].error(error);
      } finally {
        this.loadingCount--;
      }
    },

    async handleRenameFace(faceName) {
      try {
        this.loadingCount++;
        this.showRenameModal = false;
        const oldName = this.faceName;
        await this.renameFace({
          oldName,
          faceName
        });
        this.$router.push({
          name: 'facecontent',
          params: {
            faceName
          }
        });
      } catch (error) {
        _services_logger_js__WEBPACK_IMPORTED_MODULE_14__["default"].error(error);
      } finally {
        this.loadingCount--;
      }
    },

    async handleMerge(faceName) {
      try {
        this.loadingCount++;
        await this.moveFilesToFace({
          oldFace: this.faceName,
          faceName,
          fileIdsToMove: this.facesFiles[this.faceName]
        });
        await this.deleteFace({
          faceName: this.faceName
        });
        this.showMergeModal = false;
        this.$router.push({
          name: 'facecontent',
          params: {
            faceName
          }
        });
      } catch (error) {
        _services_logger_js__WEBPACK_IMPORTED_MODULE_14__["default"].error(error);
      } finally {
        this.loadingCount--;
      }
    },

    async favoriteSelection() {
      try {
        this.loadingCount++;
        await this.toggleFavoriteForFiles({
          fileIds: this.selectedFileIds,
          favoriteState: true
        });
      } catch (error) {
        _services_logger_js__WEBPACK_IMPORTED_MODULE_14__["default"].error(error);
      } finally {
        this.loadingCount--;
      }
    },

    async unFavoriteSelection() {
      try {
        this.loadingCount++;
        await this.toggleFavoriteForFiles({
          fileIds: this.selectedFileIds,
          favoriteState: false
        });
      } catch (error) {
        _services_logger_js__WEBPACK_IMPORTED_MODULE_14__["default"].error(error);
      } finally {
        this.loadingCount--;
      }
    },

    async downloadSelection() {
      try {
        this.loadingCount++;
        await this.downloadFiles(this.selectedFileIds);
      } catch (error) {
        _services_logger_js__WEBPACK_IMPORTED_MODULE_14__["default"].error(error);
      } finally {
        this.loadingCount--;
      }
    }

  }
});

/***/ }),

/***/ "./src/mixins/FetchFilesMixin.js":
/*!***************************************!*\
  !*** ./src/mixins/FetchFilesMixin.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _services_logger_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/logger.js */ "./src/services/logger.js");
/* harmony import */ var _services_PhotoSearch_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/PhotoSearch.js */ "./src/services/PhotoSearch.js");
/* harmony import */ var _utils_semaphoreWithPriority_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/semaphoreWithPriority.js */ "./src/utils/semaphoreWithPriority.js");
/* harmony import */ var _AbortControllerMixin_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./AbortControllerMixin.js */ "./src/mixins/AbortControllerMixin.js");
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




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'FetchFilesMixin',
  mixins: [_AbortControllerMixin_js__WEBPACK_IMPORTED_MODULE_3__["default"]],

  data() {
    return {
      errorFetchingFiles: null,
      loadingFiles: false,
      doneFetchingFiles: false,
      semaphore: new _utils_semaphoreWithPriority_js__WEBPACK_IMPORTED_MODULE_2__["default"](30),
      fetchSemaphore: new _utils_semaphoreWithPriority_js__WEBPACK_IMPORTED_MODULE_2__["default"](1),
      semaphoreSymbol: null,
      fetchedFileIds: []
    };
  },

  watch: {
    $route() {
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

      const semaphoreSymbol = await this.semaphore.acquire(() => 0, 'fetchFiles');
      const fetchSemaphoreSymbol = await this.fetchSemaphore.acquire();

      try {
        this.errorFetchingFiles = null;
        this.loadingFiles = true;
        this.semaphoreSymbol = semaphoreSymbol;
        const numberOfImagesPerBatch = 200; // Load next batch of images

        const fetchedFiles = await (0,_services_PhotoSearch_js__WEBPACK_IMPORTED_MODULE_1__["default"])(path, {
          firstResult: this.fetchedFileIds.length,
          nbResults: numberOfImagesPerBatch,
          ...options,
          signal: this.abortController.signal
        }); // If we get less files than requested that means we got to the end

        if (fetchedFiles.length !== numberOfImagesPerBatch) {
          this.doneFetchingFiles = true;
        }

        const fileIds = fetchedFiles.map(file => file.fileid).filter(fileId => !this.fetchedFileIds.includes(fileId)); // Filter to prevent duplicate fileIds.

        this.fetchedFileIds.push(...fileIds.map(fileId => fileId.toString()).filter(fileId => !blacklist.includes(fileId)));
        this.$store.dispatch('appendFiles', fetchedFiles);
        _services_logger_js__WEBPACK_IMPORTED_MODULE_0__["default"].debug(`[FetchFilesMixin] Fetched ${fileIds.length} new files: `, fileIds);
        return fileIds;
      } catch (error) {
        if (error.response?.status === 404) {
          this.errorFetchingFiles = 404;
        } else if (error.code === 'ERR_CANCELED') {
          return [];
        } else {
          this.errorFetchingFiles = error;
        } // cancelled request, moving on...


        _services_logger_js__WEBPACK_IMPORTED_MODULE_0__["default"].error('Error fetching files', {
          error
        });
        console.error(error);
      } finally {
        this.loadingFiles = false;
        this.semaphore.release(semaphoreSymbol);
        this.fetchSemaphore.release(fetchSemaphoreSymbol);
      }

      return [];
    },

    resetFetchFilesState() {
      this.doneFetchingFiles = false;
      this.errorFetchingFiles = null;
      this.loadingFiles = false;
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
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_fileUtils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/fileUtils.js */ "./src/utils/fileUtils.js");
/* harmony import */ var _nextcloud_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/auth */ "./node_modules/@nextcloud/auth/dist/index.esm.js");
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






/**
 * List files from a folder and filter out unwanted mimes
 *
 * @param {object} path the lookup path
 * @param {object} [options] used for the cancellable requests
 * @param {number} [options.firstResult=0] Index of the first result that we want (starts at 0)
 * @param {number} [options.nbResults=200] The number of file to fetch
 * @param {string[]} [options.mimesType=allMimes] Mime type of the files
 * @param {boolean} [options.full=false] get full data of the files
 * @param {boolean} [options.onThisDay=false] get only items from this day of year
 * @param {boolean} [options.onlyFavorites=false] get only favorite items
 * @return {Promise<object[]>} the file list
 */

/* harmony default export */ async function __WEBPACK_DEFAULT_EXPORT__() {
  let path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  // default function options
  options = {
    firstResult: 0,
    nbResults: 200,
    mimesType: _AllowedMimes_js__WEBPACK_IMPORTED_MODULE_2__.allMimes,
    onThisDay: false,
    onlyFavorites: false,
    ...options
  };
  const prefixPath = `/files/${(0,_nextcloud_auth__WEBPACK_IMPORTED_MODULE_1__.getCurrentUser)().uid}`; // generating the search or condition
  // based on the allowed mimetypes

  const orMime = options.mimesType.reduce((str, mime) => `${str}
		<d:eq>
			<d:prop>
				<d:getcontenttype/>
			</d:prop>
			<d:literal>${mime}</d:literal>
		</d:eq>
	`, '');
  const eqFavorites = options.onlyFavorites ? `<d:eq>
				<d:prop>
					<oc:favorite/>
				</d:prop>
				<d:literal>1</d:literal>
			</d:eq>` : '';
  const onThisDay = options.onThisDay ? `<d:or>${Array(20).fill(1).map((_, years) => {
    const start = _nextcloud_moment__WEBPACK_IMPORTED_MODULE_5___default()(Date.now()).startOf('day').subtract(3, 'd').subtract(years + 1, 'y');
    const end = _nextcloud_moment__WEBPACK_IMPORTED_MODULE_5___default()(Date.now()).endOf('day').add(3, 'd').subtract(years + 1, 'y');
    return `<d:and>
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
			</d:and>`;
  }).join('\n')}</d:or>` : '';
  options = Object.assign({
    method: 'SEARCH',
    headers: {
      'content-Type': 'text/xml'
    },
    data: `<?xml version="1.0" encoding="UTF-8"?>
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
						<d:and>
							<d:or>
								${orMime}
							</d:or>
							${eqFavorites}
							${onThisDay}
						</d:and>
					</d:where>
					<d:orderby>
						<d:order>
							<d:prop><d:getlastmodified/></d:prop>
							<d:descending/>
						</d:order>
					</d:orderby>
					<d:limit>
						<d:nresults>${options.nbResults}</d:nresults>
						<ns:firstresult>${options.firstResult}</ns:firstresult>
					</d:limit>
				</d:basicsearch>
			</d:searchrequest>`,
    deep: true,
    details: true
  }, options);
  const response = await _DavClient_js__WEBPACK_IMPORTED_MODULE_3__["default"].getDirectoryContents('', options);
  return response.data.map(data => (0,_utils_fileUtils_js__WEBPACK_IMPORTED_MODULE_0__.genFileInfo)(data));
}

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FaceMergeForm.vue?vue&type=style&index=0&id=1591b7bf&scoped=true&lang=scss&":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FaceMergeForm.vue?vue&type=style&index=0&id=1591b7bf&scoped=true&lang=scss& ***!
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
___CSS_LOADER_EXPORT___.push([module.id, ".face-list[data-v-1591b7bf] {\n  display: flex;\n  flex-direction: row;\n  height: 350px;\n  flex-wrap: wrap;\n  padding: 12px;\n}\n.loader[data-v-1591b7bf] {\n  margin: 25% auto;\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/FaceContent.vue?vue&type=style&index=0&id=03238d12&lang=scss&scoped=true&":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/FaceContent.vue?vue&type=style&index=0&id=03238d12&lang=scss&scoped=true& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, ".face[data-v-03238d12] {\n  display: flex;\n  flex-direction: column;\n}\n.face__empty[data-v-03238d12] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n.face__empty__button[data-v-03238d12] {\n  margin-top: 32px;\n}\n.face__header[data-v-03238d12] {\n  display: flex;\n  min-height: 60px;\n  align-items: center;\n  justify-content: space-between;\n  position: sticky;\n  z-index: 3;\n  background: var(--color-main-background);\n  padding: 0 64px;\n}\n@media only screen and (max-width: 1020px) {\n.face__header[data-v-03238d12] {\n    padding: 0;\n    padding-left: 64px;\n}\n}\n.face__header__left[data-v-03238d12] {\n  height: 100%;\n  display: flex;\n  align-items: center;\n}\n.face__header__title[data-v-03238d12] {\n  margin-left: 10px;\n}\n.face__header__title h2[data-v-03238d12] {\n  margin-bottom: 0;\n}\n.face__header__loader[data-v-03238d12] {\n  margin-left: 32px;\n}\n.face__header__actions[data-v-03238d12] {\n  display: flex;\n  align-items: center;\n}\n.face__header__actions button[data-v-03238d12] {\n  margin-left: 16px;\n}\n.face__photos[data-v-03238d12] {\n  margin-top: 16px;\n  height: 100%;\n  min-height: 0;\n  padding: 0 64px;\n}\n@media only screen and (max-width: 1020px) {\n.face__photos[data-v-03238d12] {\n    padding: 0;\n}\n}\n.empty-content-with-illustration[data-v-03238d12]  .empty-content__icon {\n  width: 200px;\n  height: 200px;\n}\n.empty-content-with-illustration[data-v-03238d12]  .empty-content__icon svg {\n  width: 200px;\n  height: 200px;\n}\n.rename-form[data-v-03238d12] {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  height: 70px;\n  padding: 16px;\n}\n.rename-form input[data-v-03238d12] {\n  width: 80%;\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FaceMergeForm.vue?vue&type=style&index=0&id=1591b7bf&scoped=true&lang=scss&":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FaceMergeForm.vue?vue&type=style&index=0&id=1591b7bf&scoped=true&lang=scss& ***!
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceMergeForm_vue_vue_type_style_index_0_id_1591b7bf_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FaceMergeForm.vue?vue&type=style&index=0&id=1591b7bf&scoped=true&lang=scss& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FaceMergeForm.vue?vue&type=style&index=0&id=1591b7bf&scoped=true&lang=scss&");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceMergeForm_vue_vue_type_style_index_0_id_1591b7bf_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceMergeForm_vue_vue_type_style_index_0_id_1591b7bf_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceMergeForm_vue_vue_type_style_index_0_id_1591b7bf_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceMergeForm_vue_vue_type_style_index_0_id_1591b7bf_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/FaceContent.vue?vue&type=style&index=0&id=03238d12&lang=scss&scoped=true&":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/FaceContent.vue?vue&type=style&index=0&id=03238d12&lang=scss&scoped=true& ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceContent_vue_vue_type_style_index_0_id_03238d12_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FaceContent.vue?vue&type=style&index=0&id=03238d12&lang=scss&scoped=true& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/FaceContent.vue?vue&type=style&index=0&id=03238d12&lang=scss&scoped=true&");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceContent_vue_vue_type_style_index_0_id_03238d12_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceContent_vue_vue_type_style_index_0_id_03238d12_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceContent_vue_vue_type_style_index_0_id_03238d12_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceContent_vue_vue_type_style_index_0_id_03238d12_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/components/FaceMergeForm.vue":
/*!******************************************!*\
  !*** ./src/components/FaceMergeForm.vue ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _FaceMergeForm_vue_vue_type_template_id_1591b7bf_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FaceMergeForm.vue?vue&type=template&id=1591b7bf&scoped=true& */ "./src/components/FaceMergeForm.vue?vue&type=template&id=1591b7bf&scoped=true&");
/* harmony import */ var _FaceMergeForm_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FaceMergeForm.vue?vue&type=script&lang=js& */ "./src/components/FaceMergeForm.vue?vue&type=script&lang=js&");
/* harmony import */ var _FaceMergeForm_vue_vue_type_style_index_0_id_1591b7bf_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FaceMergeForm.vue?vue&type=style&index=0&id=1591b7bf&scoped=true&lang=scss& */ "./src/components/FaceMergeForm.vue?vue&type=style&index=0&id=1591b7bf&scoped=true&lang=scss&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _FaceMergeForm_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _FaceMergeForm_vue_vue_type_template_id_1591b7bf_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render,
  _FaceMergeForm_vue_vue_type_template_id_1591b7bf_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "1591b7bf",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/components/FaceMergeForm.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/views/FaceContent.vue":
/*!***********************************!*\
  !*** ./src/views/FaceContent.vue ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _FaceContent_vue_vue_type_template_id_03238d12_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FaceContent.vue?vue&type=template&id=03238d12&scoped=true& */ "./src/views/FaceContent.vue?vue&type=template&id=03238d12&scoped=true&");
/* harmony import */ var _FaceContent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FaceContent.vue?vue&type=script&lang=js& */ "./src/views/FaceContent.vue?vue&type=script&lang=js&");
/* harmony import */ var _FaceContent_vue_vue_type_style_index_0_id_03238d12_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FaceContent.vue?vue&type=style&index=0&id=03238d12&lang=scss&scoped=true& */ "./src/views/FaceContent.vue?vue&type=style&index=0&id=03238d12&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _FaceContent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _FaceContent_vue_vue_type_template_id_03238d12_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render,
  _FaceContent_vue_vue_type_template_id_03238d12_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "03238d12",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/views/FaceContent.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/components/FaceMergeForm.vue?vue&type=script&lang=js&":
/*!*******************************************************************!*\
  !*** ./src/components/FaceMergeForm.vue?vue&type=script&lang=js& ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceMergeForm_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FaceMergeForm.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FaceMergeForm.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceMergeForm_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/views/FaceContent.vue?vue&type=script&lang=js&":
/*!************************************************************!*\
  !*** ./src/views/FaceContent.vue?vue&type=script&lang=js& ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceContent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FaceContent.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/FaceContent.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceContent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/components/FaceMergeForm.vue?vue&type=style&index=0&id=1591b7bf&scoped=true&lang=scss&":
/*!****************************************************************************************************!*\
  !*** ./src/components/FaceMergeForm.vue?vue&type=style&index=0&id=1591b7bf&scoped=true&lang=scss& ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceMergeForm_vue_vue_type_style_index_0_id_1591b7bf_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/style-loader/dist/cjs.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FaceMergeForm.vue?vue&type=style&index=0&id=1591b7bf&scoped=true&lang=scss& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FaceMergeForm.vue?vue&type=style&index=0&id=1591b7bf&scoped=true&lang=scss&");


/***/ }),

/***/ "./src/views/FaceContent.vue?vue&type=style&index=0&id=03238d12&lang=scss&scoped=true&":
/*!*********************************************************************************************!*\
  !*** ./src/views/FaceContent.vue?vue&type=style&index=0&id=03238d12&lang=scss&scoped=true& ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceContent_vue_vue_type_style_index_0_id_03238d12_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/style-loader/dist/cjs.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FaceContent.vue?vue&type=style&index=0&id=03238d12&lang=scss&scoped=true& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/FaceContent.vue?vue&type=style&index=0&id=03238d12&lang=scss&scoped=true&");


/***/ }),

/***/ "./src/components/FaceMergeForm.vue?vue&type=template&id=1591b7bf&scoped=true&":
/*!*************************************************************************************!*\
  !*** ./src/components/FaceMergeForm.vue?vue&type=template&id=1591b7bf&scoped=true& ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceMergeForm_vue_vue_type_template_id_1591b7bf_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceMergeForm_vue_vue_type_template_id_1591b7bf_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceMergeForm_vue_vue_type_template_id_1591b7bf_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FaceMergeForm.vue?vue&type=template&id=1591b7bf&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FaceMergeForm.vue?vue&type=template&id=1591b7bf&scoped=true&");


/***/ }),

/***/ "./src/views/FaceContent.vue?vue&type=template&id=03238d12&scoped=true&":
/*!******************************************************************************!*\
  !*** ./src/views/FaceContent.vue?vue&type=template&id=03238d12&scoped=true& ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceContent_vue_vue_type_template_id_03238d12_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceContent_vue_vue_type_template_id_03238d12_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceContent_vue_vue_type_template_id_03238d12_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FaceContent.vue?vue&type=template&id=03238d12&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/FaceContent.vue?vue&type=template&id=03238d12&scoped=true&");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FaceMergeForm.vue?vue&type=template&id=1591b7bf&scoped=true&":
/*!****************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FaceMergeForm.vue?vue&type=template&id=1591b7bf&scoped=true& ***!
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
    { staticClass: "merge-form face-list" },
    _vm._l(_vm.filteredFaces, function (face) {
      return _c("FaceCover", {
        key: face.basename,
        attrs: { "base-name": face.basename, small: "" },
        on: {
          click: function ($event) {
            return _vm.handleSelect(face.basename)
          },
        },
      })
    }),
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/FaceContent.vue?vue&type=template&id=03238d12&scoped=true&":
/*!*********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/FaceContent.vue?vue&type=template&id=03238d12&scoped=true& ***!
  \*********************************************************************************************************************************************************************************************************************/
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
  return _vm.face === undefined && !_vm.loadingFiles && !_vm.loadingFaces
    ? _c(
        "NcEmptyContent",
        {
          staticClass: "empty-content-with-illustration",
          scopedSlots: _vm._u(
            [
              {
                key: "icon",
                fn: function () {
                  return [_c("AccountBoxMultipleOutline")]
                },
                proxy: true,
              },
            ],
            null,
            false,
            2861705255
          ),
        },
        [
          _vm._v(
            "\n\t" +
              _vm._s(_vm.t("photos", "This person could not be found")) +
              "\n"
          ),
        ]
      )
    : _vm.errorFetchingFiles || _vm.errorFetchingFaces
    ? _c(
        "NcEmptyContent",
        {
          scopedSlots: _vm._u([
            {
              key: "icon",
              fn: function () {
                return [_c("AlertCircle")]
              },
              proxy: true,
            },
          ]),
        },
        [_vm._v("\n\t" + _vm._s(_vm.t("photos", "An error occurred")) + "\n")]
      )
    : _c(
        "div",
        { staticClass: "face" },
        [
          _c("div", { staticClass: "face__header" }, [
            _c(
              "div",
              { staticClass: "face__header__left" },
              [
                _c(
                  "NcActions",
                  [
                    _c(
                      "NcActionButton",
                      {
                        on: {
                          click: function ($event) {
                            return _vm.$router.push("/faces/")
                          },
                        },
                        scopedSlots: _vm._u([
                          {
                            key: "icon",
                            fn: function () {
                              return [_c("ArrowLeft")]
                            },
                            proxy: true,
                          },
                        ]),
                      },
                      [_vm._v(_vm._s(_vm.t("photos", "Back")) + "\n\t\t\t\t")]
                    ),
                  ],
                  1
                ),
                _vm._v(" "),
                _c("div", { staticClass: "face__header__title" }, [
                  _vm.face !== undefined
                    ? _c(
                        "h2",
                        {
                          class: {
                            "face-name": true,
                            "hidden-visually":
                              _vm.face.basename.match(/^[0-9]+$/),
                          },
                        },
                        [
                          _vm._v(
                            "\n\t\t\t\t\t" +
                              _vm._s(_vm.face.basename) +
                              "\n\t\t\t\t"
                          ),
                        ]
                      )
                    : _vm._e(),
                ]),
                _vm._v(" "),
                _vm.loadingCount > 0 || _vm.loadingFaces
                  ? _c("NcLoadingIcon")
                  : _vm._e(),
              ],
              1
            ),
            _vm._v(" "),
            _vm.face !== undefined
              ? _c(
                  "div",
                  { staticClass: "face__header__actions" },
                  [
                    _c(
                      "NcActions",
                      [
                        _c(
                          "NcActionButton",
                          {
                            attrs: {
                              "close-after-click": true,
                              "aria-label": _vm.t("photos", "Rename person"),
                            },
                            on: {
                              click: function ($event) {
                                _vm.showRenameModal = true
                              },
                            },
                            scopedSlots: _vm._u(
                              [
                                {
                                  key: "icon",
                                  fn: function () {
                                    return [_c("Pencil")]
                                  },
                                  proxy: true,
                                },
                              ],
                              null,
                              false,
                              514409694
                            ),
                          },
                          [
                            _vm._v(
                              "\n\t\t\t\t\t" +
                                _vm._s(_vm.t("photos", "Rename person")) +
                                "\n\t\t\t\t"
                            ),
                          ]
                        ),
                      ],
                      1
                    ),
                    _vm._v(" "),
                    _c(
                      "NcActions",
                      { attrs: { "force-menu": true } },
                      [
                        Object.keys(_vm.faces).length > 1
                          ? _c(
                              "NcActionButton",
                              {
                                attrs: {
                                  "close-after-click": true,
                                  "aria-label": _vm.t(
                                    "photos",
                                    "Merge with different person"
                                  ),
                                },
                                on: {
                                  click: function ($event) {
                                    _vm.showMergeModal = true
                                  },
                                },
                                scopedSlots: _vm._u(
                                  [
                                    {
                                      key: "icon",
                                      fn: function () {
                                        return [_c("Merge")]
                                      },
                                      proxy: true,
                                    },
                                  ],
                                  null,
                                  false,
                                  3117189691
                                ),
                              },
                              [
                                _vm._v(
                                  "\n\t\t\t\t\t" +
                                    _vm._s(
                                      _vm.t(
                                        "photos",
                                        "Merge with different person"
                                      )
                                    ) +
                                    "\n\t\t\t\t"
                                ),
                              ]
                            )
                          : _vm._e(),
                        _vm._v(" "),
                        _vm.selectedFileIds.length
                          ? [
                              _c(
                                "NcActionButton",
                                {
                                  attrs: {
                                    "close-after-click": true,
                                    "aria-label": _vm.t(
                                      "photos",
                                      "Download selected files"
                                    ),
                                  },
                                  on: { click: _vm.downloadSelection },
                                },
                                [
                                  _c("Download", {
                                    attrs: { slot: "icon" },
                                    slot: "icon",
                                  }),
                                  _vm._v(
                                    "\n\t\t\t\t\t\t" +
                                      _vm._s(
                                        _vm.t(
                                          "photos",
                                          "Download selected photos"
                                        )
                                      ) +
                                      "\n\t\t\t\t\t"
                                  ),
                                ],
                                1
                              ),
                              _vm._v(" "),
                              _vm.shouldFavoriteSelection
                                ? _c(
                                    "NcActionButton",
                                    {
                                      attrs: {
                                        "close-after-click": true,
                                        "aria-label": _vm.t(
                                          "photos",
                                          "Mark selection as favorite"
                                        ),
                                      },
                                      on: { click: _vm.favoriteSelection },
                                    },
                                    [
                                      _c("Star", {
                                        attrs: { slot: "icon" },
                                        slot: "icon",
                                      }),
                                      _vm._v(
                                        "\n\t\t\t\t\t\t" +
                                          _vm._s(_vm.t("photos", "Favorite")) +
                                          "\n\t\t\t\t\t"
                                      ),
                                    ],
                                    1
                                  )
                                : _c(
                                    "NcActionButton",
                                    {
                                      attrs: {
                                        "close-after-click": true,
                                        "aria-label": _vm.t(
                                          "photos",
                                          "Remove selection from favorites"
                                        ),
                                      },
                                      on: { click: _vm.unFavoriteSelection },
                                    },
                                    [
                                      _c("Star", {
                                        attrs: { slot: "icon" },
                                        slot: "icon",
                                      }),
                                      _vm._v(
                                        "\n\t\t\t\t\t\t" +
                                          _vm._s(
                                            _vm.t(
                                              "photos",
                                              "Remove from favorites"
                                            )
                                          ) +
                                          "\n\t\t\t\t\t"
                                      ),
                                    ],
                                    1
                                  ),
                              _vm._v(" "),
                              _c(
                                "NcActionButton",
                                {
                                  attrs: { "close-after-click": true },
                                  on: {
                                    click: function ($event) {
                                      return _vm.handleRemoveFilesFromFace(
                                        _vm.selectedFileIds
                                      )
                                    },
                                  },
                                  scopedSlots: _vm._u(
                                    [
                                      {
                                        key: "icon",
                                        fn: function () {
                                          return [_c("Close")]
                                        },
                                        proxy: true,
                                      },
                                    ],
                                    null,
                                    false,
                                    1051939733
                                  ),
                                },
                                [
                                  _vm._v(
                                    "\n\t\t\t\t\t\t" +
                                      _vm._s(
                                        _vm.n(
                                          "photos",
                                          "Remove photo from person",
                                          "Remove photos from person",
                                          _vm.selectedFileIds.length
                                        )
                                      ) +
                                      "\n\t\t\t\t\t"
                                  ),
                                ]
                              ),
                            ]
                          : _vm._e(),
                        _vm._v(" "),
                        _c(
                          "NcActionButton",
                          {
                            attrs: { "close-after-click": true },
                            on: { click: _vm.handleDeleteFace },
                            scopedSlots: _vm._u(
                              [
                                {
                                  key: "icon",
                                  fn: function () {
                                    return [_c("Close")]
                                  },
                                  proxy: true,
                                },
                              ],
                              null,
                              false,
                              1051939733
                            ),
                          },
                          [
                            _vm._v(
                              "\n\t\t\t\t\t" +
                                _vm._s(_vm.t("photos", "Remove person")) +
                                "\n\t\t\t\t"
                            ),
                          ]
                        ),
                      ],
                      2
                    ),
                  ],
                  1
                )
              : _vm._e(),
          ]),
          _vm._v(" "),
          _vm.face !== undefined
            ? _c("FilesListViewer", {
                staticClass: "face__photos",
                attrs: {
                  "container-element": _vm.appContent,
                  "file-ids": _vm.faceFileIds,
                  loading: _vm.loadingFiles || _vm.loadingFaces,
                },
                scopedSlots: _vm._u(
                  [
                    {
                      key: "default",
                      fn: function (ref) {
                        var file = ref.file
                        var visibility = ref.visibility
                        return _c("File", {
                          attrs: {
                            file: _vm.files[file.id],
                            "allow-selection": true,
                            selected: _vm.selection[file.id] === true,
                            visibility: visibility,
                            semaphore: _vm.semaphore,
                          },
                          on: {
                            click: _vm.openViewer,
                            "select-toggled": _vm.onFileSelectToggle,
                          },
                        })
                      },
                    },
                  ],
                  null,
                  false,
                  3592900521
                ),
              })
            : _vm._e(),
          _vm._v(" "),
          _vm.showRenameModal
            ? _c(
                "NcModal",
                {
                  attrs: { title: _vm.t("photos", "Rename person") },
                  on: {
                    close: function ($event) {
                      _vm.showRenameModal = false
                    },
                  },
                },
                [
                  _c(
                    "div",
                    { staticClass: "rename-form" },
                    [
                      _c("input", {
                        directives: [{ name: "focus", rawName: "v-focus" }],
                        ref: "nameInput",
                        attrs: {
                          type: "text",
                          name: "name",
                          required: "",
                          placeholder: _vm.t("photos", "Name of this person"),
                        },
                        domProps: { value: _vm.faceName },
                        on: {
                          keydown: function ($event) {
                            if (
                              !$event.type.indexOf("key") &&
                              _vm._k(
                                $event.keyCode,
                                "enter",
                                13,
                                $event.key,
                                "Enter"
                              )
                            ) {
                              return null
                            }
                            return _vm.handleRenameFace(
                              _vm.$refs.nameInput.value
                            )
                          },
                        },
                      }),
                      _vm._v(" "),
                      _c(
                        "NcButton",
                        {
                          attrs: {
                            "aria-label": _vm.t("photos", "Save."),
                            type: "primary",
                            disabled:
                              _vm.$refs.nameInput &&
                              _vm.$refs.nameInput.value.trim() === "",
                          },
                          on: {
                            click: function ($event) {
                              return _vm.handleRenameFace(
                                _vm.$refs.nameInput.value
                              )
                            },
                          },
                          scopedSlots: _vm._u(
                            [
                              {
                                key: "icon",
                                fn: function () {
                                  return [
                                    _vm.loadingCount
                                      ? _c("NcLoadingIcon")
                                      : _c("Send"),
                                  ]
                                },
                                proxy: true,
                              },
                            ],
                            null,
                            false,
                            564208483
                          ),
                        },
                        [
                          _vm._v(
                            "\n\t\t\t\t" +
                              _vm._s(_vm.t("photos", "Save")) +
                              "\n\t\t\t"
                          ),
                        ]
                      ),
                    ],
                    1
                  ),
                ]
              )
            : _vm._e(),
          _vm._v(" "),
          _vm.showMergeModal
            ? _c(
                "NcModal",
                {
                  attrs: { title: _vm.t("photos", "Merge person") },
                  on: {
                    close: function ($event) {
                      _vm.showMergeModal = false
                    },
                  },
                },
                [
                  _c("FaceMergeForm", {
                    attrs: { "first-face": _vm.faceName },
                    on: {
                      select: function ($event) {
                        return _vm.handleMerge($event)
                      },
                    },
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
//# sourceMappingURL=photos-src_views_FaceContent_vue.js.map?v=27b000556139a42fa242