"use strict";
(self["webpackChunkphotos"] = self["webpackChunkphotos"] || []).push([["src_components_FaceCover_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FaceCover.vue?vue&type=script&lang=js&":
/*!*******************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FaceCover.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/router */ "./node_modules/@nextcloud/router/dist/index.js");
/* harmony import */ var _mixins_FetchFacesMixin_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../mixins/FetchFacesMixin.js */ "./src/mixins/FetchFacesMixin.js");
/* harmony import */ var _mixins_FaceCoverMixin_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../mixins/FaceCoverMixin.js */ "./src/mixins/FaceCoverMixin.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
  name: 'FaceCover',
  mixins: [_mixins_FetchFacesMixin_js__WEBPACK_IMPORTED_MODULE_1__["default"], _mixins_FaceCoverMixin_js__WEBPACK_IMPORTED_MODULE_2__["default"]],
  props: {
    baseName: {
      type: String,
      required: true
    },
    small: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      observer: null
    };
  },

  computed: { ...(0,vuex__WEBPACK_IMPORTED_MODULE_3__.mapGetters)(['files', 'faces', 'facesFiles']),

    /**
     * @return {Face}
     */
    face() {
      return this.faces[this.baseName];
    },

    /**
     * @return {string}
     */
    coverUrl() {
      if (!this.cover) {
        return '';
      }

      return (0,_nextcloud_router__WEBPACK_IMPORTED_MODULE_0__.generateUrl)(`/apps/photos/api/v1/preview/${this.cover.fileid}?x=${512}&y=${512}`);
    },

    cover() {
      return this.getFaceCover(this.face.basename);
    },

    coverDimensions() {
      if (!this.cover) return {};
      return this.getCoverStyle(this.face.basename);
    }

  },

  async mounted() {
    this.waitForVisible(this.$el, isVisible => {
      if (!this.facesFiles[this.face.basename]) {
        this.fetchFiles();
      }
    });
  },

  beforeDestroy() {
    this.observer.disconnect();
  },

  methods: {
    async fetchFiles() {
      await this.fetchFaceContent(this.face.basename);
    },

    waitForVisible(el, listener) {
      this.observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.intersectionRatio > 0) {
            listener();
            observer.disconnect();
          }
        });
      });
      this.observer.observe(el);
    }

  }
});

/***/ }),

/***/ "./src/mixins/AbortControllerMixin.js":
/*!********************************************!*\
  !*** ./src/mixins/AbortControllerMixin.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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
  name: 'AbortControllerMixin',

  data() {
    return {
      abortController: new AbortController()
    };
  },

  beforeDestroy() {
    this.abortController.abort();
  },

  beforeRouteLeave(from, to, next) {
    this.abortController.abort();
    this.abortController = new AbortController();
    next();
  }

});

/***/ }),

/***/ "./src/mixins/FaceCoverMixin.js":
/*!**************************************!*\
  !*** ./src/mixins/FaceCoverMixin.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/**
 * @copyright Copyright (c) 2022 Marcel Klehr <mklehr@gmx.net>
 *
 * @author Marcel Klehr <mklehr@gmx.net>
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
  name: 'FaceCoverMixin',
  computed: { ...(0,vuex__WEBPACK_IMPORTED_MODULE_0__.mapGetters)(['faces', 'facesFiles', 'files'])
  },
  methods: {
    getFaceCover(faceName) {
      // Give high scores for faces that intersect with the edge of the picture (with a margin of half the face size)
      const scoreFacePosition = faceDetection => {
        return Math.max(0, -1 * (faceDetection.x - faceDetection.width * 0.5)) + Math.max(0, -1 * (faceDetection.y - faceDetection.height * 0.5)) + Math.max(0, -1 * (1 - (faceDetection.x + faceDetection.width) - faceDetection.width * 0.5)) + Math.max(0, -1 * (1 - (faceDetection.y + faceDetection.height) - faceDetection.height * 0.5));
      };

      return (this.facesFiles[faceName] || []).slice(0, 25).map(fileId => this.files[fileId]) // sort larges face first
      .sort((a, b) => b.faceDetections.find(d => d.title === faceName).width - a.faceDetections.find(d => d.title === faceName).width) // sort fewest face detections first
      .sort((a, b) => a.faceDetections.length - b.faceDetections.length) // Sort faces that are at the edge last
      .sort((a, b) => scoreFacePosition(a.faceDetections.find(d => d.title === faceName)) - scoreFacePosition(b.faceDetections.find(d => d.title === faceName)))[0];
    },

    /**
     * This will produce an inline style to apply to images
     * to zoom toward the detected face
     *
     * @param faceName
     * @return {{}|{transform: string, width: string, transformOrigin: string}}
     */
    getCoverStyle(faceName) {
      const cover = this.getFaceCover(faceName);

      if (!cover) {
        return {};
      }

      const detections = cover.faceDetections;
      const detection = detections.find(detection => detection.title === faceName); // Zoom into the picture so that the face fills the --photos-face-width box nicely
      // if the face is larger than the image, we don't zoom out (reason for the Math.max)

      const zoom = Math.max(1, 1 / detection.width * 0.4);
      const horizontalCenterOfFace = (detection.x + detection.width / 2) * 100;
      const verticalCenterOfFace = (detection.y + detection.height / 2) * 100;
      return {
        // We assume that the image is inside a div with width: var(--photos-face-width)
        width: '100%',
        // we translate the image so that the center of the detected face is in the center of the --photos-face-width box
        // and add the zoom
        transform: `translate(calc( var(--photos-face-width)/2 - ${horizontalCenterOfFace}% ), calc( var(--photos-face-width)/2 - ${verticalCenterOfFace}% )) scale(${zoom})`,
        // this is necessary for the zoom to zoom toward the center of the face
        transformOrigin: `${horizontalCenterOfFace}% ${verticalCenterOfFace}%`
      };
    }

  }
});

/***/ }),

/***/ "./src/mixins/FetchFacesMixin.js":
/*!***************************************!*\
  !*** ./src/mixins/FetchFacesMixin.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/dialogs */ "./node_modules/@nextcloud/dialogs/dist/index.es.js");
/* harmony import */ var _nextcloud_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/auth */ "./node_modules/@nextcloud/auth/dist/index.esm.js");
/* harmony import */ var _services_DavClient_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/DavClient.js */ "./src/services/DavClient.js");
/* harmony import */ var _services_logger_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/logger.js */ "./src/services/logger.js");
/* harmony import */ var _services_DavRequest__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../services/DavRequest */ "./src/services/DavRequest.js");
/* harmony import */ var _utils_fileUtils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/fileUtils */ "./src/utils/fileUtils.js");
/* harmony import */ var _AbortControllerMixin__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./AbortControllerMixin */ "./src/mixins/AbortControllerMixin.js");
/* harmony import */ var he__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! he */ "./node_modules/he/he.js");
/* harmony import */ var he__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(he__WEBPACK_IMPORTED_MODULE_7__);
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
  name: 'FetchFacesMixin',

  data() {
    return {
      errorFetchingFaces: null,
      loadingFaces: false,
      errorFetchingFiles: null,
      loadingFiles: false
    };
  },

  mixins: [_AbortControllerMixin__WEBPACK_IMPORTED_MODULE_6__["default"]],

  async beforeMount() {
    this.fetchFaces();
  },

  computed: { ...(0,vuex__WEBPACK_IMPORTED_MODULE_8__.mapGetters)(['faces'])
  },
  methods: { ...(0,vuex__WEBPACK_IMPORTED_MODULE_8__.mapActions)(['appendFiles']),

    async fetchFaces() {
      if (this.loadingFaces) {
        return;
      }

      if (Object.keys(this.faces).length) {
        return;
      }

      try {
        this.loadingFaces = true;
        this.errorFetchingFaces = null;
        const {
          data: faces
        } = await _services_DavClient_js__WEBPACK_IMPORTED_MODULE_2__["default"].getDirectoryContents(`/recognize/${(0,_nextcloud_auth__WEBPACK_IMPORTED_MODULE_1__.getCurrentUser)()?.uid}/faces/`, {
          data: _services_DavRequest__WEBPACK_IMPORTED_MODULE_4__["default"],
          details: true,
          signal: this.abortController.signal
        });
        this.$store.dispatch('addFaces', {
          faces
        });
        _services_logger_js__WEBPACK_IMPORTED_MODULE_3__["default"].debug(`[FetchFacesMixin] Fetched ${faces.length} new faces: `, faces);
      } catch (error) {
        if (error.response && error.response.status) {
          if (error.response.status === 404) {
            this.errorFetchingFaces = 404;
          } else {
            this.errorFetchingFaces = error;
          }
        }

        _services_logger_js__WEBPACK_IMPORTED_MODULE_3__["default"].error(t('photos', 'Failed to fetch faces list.'), {
          error
        });
        (0,_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_0__.showError)(t('photos', 'Failed to fetch faces list.'));
      } finally {
        this.loadingFaces = false;
      }
    },

    async fetchFaceContent(faceName, force) {
      if (this.loadingFiles) {
        return;
      }

      if (!force && this.facesFiles[faceName] && this.facesFiles[faceName].length) {
        return;
      }

      try {
        this.errorFetchingFiles = null;
        this.loadingFiles = true;
        let {
          data: fetchedFiles
        } = await _services_DavClient_js__WEBPACK_IMPORTED_MODULE_2__["default"].getDirectoryContents(`/recognize/${(0,_nextcloud_auth__WEBPACK_IMPORTED_MODULE_1__.getCurrentUser)()?.uid}/faces/${faceName}`, {
          data: _services_DavRequest__WEBPACK_IMPORTED_MODULE_4__["default"],
          details: true,
          signal: this.abortController.signal
        });
        fetchedFiles = fetchedFiles.map(file => (0,_utils_fileUtils__WEBPACK_IMPORTED_MODULE_5__.genFileInfo)(file)).map(file => ({ ...file,
          filename: he__WEBPACK_IMPORTED_MODULE_7___default().decode(file.realpath).replace(`/${(0,_nextcloud_auth__WEBPACK_IMPORTED_MODULE_1__.getCurrentUser)().uid}/files`, `/files/${(0,_nextcloud_auth__WEBPACK_IMPORTED_MODULE_1__.getCurrentUser)().uid}`)
        })).map(file => ({ ...file,
          faceDetections: JSON.parse(he__WEBPACK_IMPORTED_MODULE_7___default().decode(file.faceDetections))
        }));
        const fileIds = fetchedFiles.map(file => '' + file.fileid);
        this.appendFiles(fetchedFiles);

        if (fetchedFiles.length > 0) {
          await this.$store.commit('addFilesToFace', {
            faceName,
            fileIdsToAdd: fileIds
          });
        }

        _services_logger_js__WEBPACK_IMPORTED_MODULE_3__["default"].debug(`[FetchFacesMixin] Fetched ${fileIds.length} new files: `, fileIds);
      } catch (error) {
        if (error.response && error.response.status) {
          if (error.response.status === 404) {
            this.errorFetchingFiles = 404;
          } else {
            this.errorFetchingFiles = error;
          }
        } // cancelled request, moving on...


        _services_logger_js__WEBPACK_IMPORTED_MODULE_3__["default"].error('Error fetching face files', {
          error
        });
      } finally {
        this.loadingFiles = false;
      }
    }

  }
});

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FaceCover.vue?vue&type=style&index=0&id=acc68b4c&lang=scss&scoped=true&":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FaceCover.vue?vue&type=style&index=0&id=acc68b4c&lang=scss&scoped=true& ***!
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
___CSS_LOADER_EXPORT___.push([module.id, ".face-cover[data-v-acc68b4c] {\n  display: flex;\n  flex-direction: column;\n  padding: 10px;\n  border-radius: var(--border-radius-large);\n}\n.face-cover__crop-container[data-v-acc68b4c] {\n  overflow: hidden;\n  width: 128px;\n  height: 128px;\n  border-radius: 128px;\n  position: relative;\n  background: var(--color-background-darker);\n  --photos-face-width: 128px;\n}\n@media only screen and (max-width: 1020px) {\n.face-cover__crop-container[data-v-acc68b4c] {\n    width: 95px;\n    height: 95px;\n    --photos-face-width: 95px;\n}\n}\n.face-cover[data-v-acc68b4c]:hover, .face-cover[data-v-acc68b4c]:focus {\n  background: var(--color-background-hover);\n}\n.face-cover__details[data-v-acc68b4c] {\n  display: flex;\n  flex-direction: column;\n  width: 128px;\n  margin-top: 4px;\n  text-align: center;\n}\n@media only screen and (max-width: 1020px) {\n.face-cover__details[data-v-acc68b4c] {\n    width: 95px;\n}\n}\n.face-cover__details__first-line[data-v-acc68b4c] {\n  display: flex;\n  height: 2em;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.face-cover__details__second-line[data-v-acc68b4c] {\n  margin-top: 6px;\n  color: var(--color-text-maxcontrast);\n}\n.face-cover__details__name[data-v-acc68b4c] {\n  flex-grow: 1;\n  margin: 0;\n}\n.face-cover--small *[data-v-acc68b4c] {\n  font-size: 15px !important;\n}\n.face-cover--small .face-cover__details[data-v-acc68b4c] {\n  width: 60px !important;\n}\n.face-cover--small .face-cover__crop-container[data-v-acc68b4c] {\n  width: 60px !important;\n  height: 60px !important;\n  --photos-face-width: 60px !important;\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FaceCover.vue?vue&type=style&index=0&id=acc68b4c&lang=scss&scoped=true&":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FaceCover.vue?vue&type=style&index=0&id=acc68b4c&lang=scss&scoped=true& ***!
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceCover_vue_vue_type_style_index_0_id_acc68b4c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FaceCover.vue?vue&type=style&index=0&id=acc68b4c&lang=scss&scoped=true& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FaceCover.vue?vue&type=style&index=0&id=acc68b4c&lang=scss&scoped=true&");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceCover_vue_vue_type_style_index_0_id_acc68b4c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceCover_vue_vue_type_style_index_0_id_acc68b4c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceCover_vue_vue_type_style_index_0_id_acc68b4c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceCover_vue_vue_type_style_index_0_id_acc68b4c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/components/FaceCover.vue":
/*!**************************************!*\
  !*** ./src/components/FaceCover.vue ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _FaceCover_vue_vue_type_template_id_acc68b4c_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FaceCover.vue?vue&type=template&id=acc68b4c&scoped=true& */ "./src/components/FaceCover.vue?vue&type=template&id=acc68b4c&scoped=true&");
/* harmony import */ var _FaceCover_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FaceCover.vue?vue&type=script&lang=js& */ "./src/components/FaceCover.vue?vue&type=script&lang=js&");
/* harmony import */ var _FaceCover_vue_vue_type_style_index_0_id_acc68b4c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FaceCover.vue?vue&type=style&index=0&id=acc68b4c&lang=scss&scoped=true& */ "./src/components/FaceCover.vue?vue&type=style&index=0&id=acc68b4c&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _FaceCover_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _FaceCover_vue_vue_type_template_id_acc68b4c_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render,
  _FaceCover_vue_vue_type_template_id_acc68b4c_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "acc68b4c",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/components/FaceCover.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/components/FaceCover.vue?vue&type=script&lang=js&":
/*!***************************************************************!*\
  !*** ./src/components/FaceCover.vue?vue&type=script&lang=js& ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceCover_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FaceCover.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FaceCover.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceCover_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/components/FaceCover.vue?vue&type=style&index=0&id=acc68b4c&lang=scss&scoped=true&":
/*!************************************************************************************************!*\
  !*** ./src/components/FaceCover.vue?vue&type=style&index=0&id=acc68b4c&lang=scss&scoped=true& ***!
  \************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceCover_vue_vue_type_style_index_0_id_acc68b4c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/style-loader/dist/cjs.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FaceCover.vue?vue&type=style&index=0&id=acc68b4c&lang=scss&scoped=true& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FaceCover.vue?vue&type=style&index=0&id=acc68b4c&lang=scss&scoped=true&");


/***/ }),

/***/ "./src/components/FaceCover.vue?vue&type=template&id=acc68b4c&scoped=true&":
/*!*********************************************************************************!*\
  !*** ./src/components/FaceCover.vue?vue&type=template&id=acc68b4c&scoped=true& ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceCover_vue_vue_type_template_id_acc68b4c_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceCover_vue_vue_type_template_id_acc68b4c_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceCover_vue_vue_type_template_id_acc68b4c_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FaceCover.vue?vue&type=template&id=acc68b4c&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FaceCover.vue?vue&type=template&id=acc68b4c&scoped=true&");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FaceCover.vue?vue&type=template&id=acc68b4c&scoped=true&":
/*!************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FaceCover.vue?vue&type=template&id=acc68b4c&scoped=true& ***!
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
  return _c(
    "div",
    {
      class: ["face-cover", _vm.small && "face-cover--small"],
      on: {
        click: function ($event) {
          return _vm.$emit("click")
        },
      },
    },
    [
      _c("div", { staticClass: "face-cover__crop-container" }, [
        _c("img", {
          ref: "image",
          staticClass: "face-cover__image",
          style: _vm.coverDimensions,
          attrs: { src: _vm.coverUrl },
        }),
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "face-cover__details" }, [
        !_vm.baseName.match(/^[0-9]+$/)
          ? _c("div", { staticClass: "face-cover__details__first-line" }, [
              _c("h2", { staticClass: "face-cover__details__name" }, [
                _vm._v("\n\t\t\t\t" + _vm._s(_vm.baseName) + "\n\t\t\t"),
              ]),
            ])
          : _vm._e(),
        _vm._v(" "),
        _vm.facesFiles[_vm.baseName] && !_vm.small
          ? _c("div", { staticClass: "face-cover__details__second-line" }, [
              _vm._v(
                "\n\t\t\t" +
                  _vm._s(
                    _vm.n(
                      "photos",
                      "%n photos",
                      "%n photos",
                      _vm.facesFiles[_vm.baseName].length
                    )
                  ) +
                  "\n\t\t"
              ),
            ])
          : _vm._e(),
      ]),
    ]
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ })

}]);
//# sourceMappingURL=photos-src_components_FaceCover_vue.js.map?v=6970a926bae38aa1c5db