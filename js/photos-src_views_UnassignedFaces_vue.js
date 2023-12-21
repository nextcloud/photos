"use strict";
(self["webpackChunkphotos"] = self["webpackChunkphotos"] || []).push([["src_views_UnassignedFaces_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Faces/FaceMergeForm.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Faces/FaceMergeForm.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _mixins_FaceCoverMixin_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../mixins/FaceCoverMixin.js */ "./src/mixins/FaceCoverMixin.js");
/* harmony import */ var _mixins_FetchFacesMixin_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../mixins/FetchFacesMixin.js */ "./src/mixins/FetchFacesMixin.js");
/* harmony import */ var _FaceCover_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FaceCover.vue */ "./src/components/Faces/FaceCover.vue");




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
  computed: {
    ...(0,vuex__WEBPACK_IMPORTED_MODULE_3__.mapGetters)(['files', 'faces', 'facesFiles']),
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

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/UnassignedFaces.vue?vue&type=script&lang=js&":
/*!********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/UnassignedFaces.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var vue_material_design_icons_AlertCircle_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue-material-design-icons/AlertCircle.vue */ "./node_modules/vue-material-design-icons/AlertCircle.vue");
/* harmony import */ var vue_material_design_icons_Star_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-material-design-icons/Star.vue */ "./node_modules/vue-material-design-icons/Star.vue");
/* harmony import */ var vue_material_design_icons_Download_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vue-material-design-icons/Download.vue */ "./node_modules/vue-material-design-icons/Download.vue");
/* harmony import */ var vue_material_design_icons_ArrowLeft_vue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! vue-material-design-icons/ArrowLeft.vue */ "./node_modules/vue-material-design-icons/ArrowLeft.vue");
/* harmony import */ var vue_material_design_icons_AccountSwitch_vue__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! vue-material-design-icons/AccountSwitch.vue */ "./node_modules/vue-material-design-icons/AccountSwitch.vue");
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @nextcloud/vue */ "./node_modules/@nextcloud/vue/dist/index.mjs");
/* harmony import */ var _mixins_FetchFilesMixin_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../mixins/FetchFilesMixin.js */ "./src/mixins/FetchFilesMixin.js");
/* harmony import */ var _mixins_FilesSelectionMixin_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../mixins/FilesSelectionMixin.js */ "./src/mixins/FilesSelectionMixin.js");
/* harmony import */ var _components_FilesListViewer_vue__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../components/FilesListViewer.vue */ "./src/components/FilesListViewer.vue");
/* harmony import */ var _components_File_vue__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../components/File.vue */ "./src/components/File.vue");
/* harmony import */ var _services_logger_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../services/logger.js */ "./src/services/logger.js");
/* harmony import */ var _mixins_FetchFacesMixin_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../mixins/FetchFacesMixin.js */ "./src/mixins/FetchFacesMixin.js");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm.js");
/* harmony import */ var _components_Faces_FaceMergeForm_vue__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../components/Faces/FaceMergeForm.vue */ "./src/components/Faces/FaceMergeForm.vue");















/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'UnassignedFaces',
  components: {
    Star: vue_material_design_icons_Star_vue__WEBPACK_IMPORTED_MODULE_1__["default"],
    Download: vue_material_design_icons_Download_vue__WEBPACK_IMPORTED_MODULE_2__["default"],
    AlertCircle: vue_material_design_icons_AlertCircle_vue__WEBPACK_IMPORTED_MODULE_0__["default"],
    ArrowLeft: vue_material_design_icons_ArrowLeft_vue__WEBPACK_IMPORTED_MODULE_3__["default"],
    FaceMergeForm: _components_Faces_FaceMergeForm_vue__WEBPACK_IMPORTED_MODULE_12__["default"],
    FilesListViewer: _components_FilesListViewer_vue__WEBPACK_IMPORTED_MODULE_8__["default"],
    File: _components_File_vue__WEBPACK_IMPORTED_MODULE_9__["default"],
    NcLoadingIcon: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_5__.NcLoadingIcon,
    NcEmptyContent: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_5__.NcEmptyContent,
    NcActions: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_5__.NcActions,
    NcActionButton: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_5__.NcActionButton,
    NcModal: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_5__.NcModal,
    AccountSwitch: vue_material_design_icons_AccountSwitch_vue__WEBPACK_IMPORTED_MODULE_4__["default"]
  },
  directives: {
    focus(el) {
      vue__WEBPACK_IMPORTED_MODULE_13__["default"].nextTick(() => el.focus());
    }
  },
  mixins: [_mixins_FetchFacesMixin_js__WEBPACK_IMPORTED_MODULE_11__["default"], _mixins_FetchFilesMixin_js__WEBPACK_IMPORTED_MODULE_6__["default"], _mixins_FilesSelectionMixin_js__WEBPACK_IMPORTED_MODULE_7__["default"]],
  data() {
    return {
      showMoveModal: false,
      loadingCount: 0,
      appContent: document.getElementById('app-content-vue')
    };
  },
  computed: {
    ...(0,vuex__WEBPACK_IMPORTED_MODULE_14__.mapGetters)(['files', 'unassignedFiles']),
    /**
     * @return {string[]} The list of files for the current faceName.
     */
    faceFileIds() {
      return this.unassignedFiles || [];
    },
    /** @type {boolean} */
    shouldFavoriteSelection() {
      // Favorite all selection if at least one file is not on the favorites.
      return this.selectedFileIds.some(fileId => this.$store.state.files.files[fileId].favorite === 0);
    }
  },
  mounted() {
    this.fetchUnassignedFaces();
  },
  methods: {
    ...(0,vuex__WEBPACK_IMPORTED_MODULE_14__.mapActions)(['appendFiles', 'deleteFace', 'renameFace', 'downloadFiles', 'toggleFavoriteForFiles', 'removeFilesFromFace', 'moveFilesToFace']),
    openViewer(fileId) {
      const file = this.files[fileId];
      OCA.Viewer.open({
        // remove /username/files/ from the start
        path: '/' + file.filename.split('/').slice(3).join('/'),
        list: this.faceFileIds.map(fileId => ({
          ...this.files[fileId],
          basename: this.files[fileId].basename.split('-').slice(1).join('-')
        })).filter(file => !file.sectionHeader),
        loadMore: file.loadMore ? async () => await file.loadMore(true) : () => [],
        canLoop: file.canLoop
      });
    },
    async handleMove(faceName, fileIds) {
      try {
        this.loadingCount++;
        await this.moveFilesToFace({
          oldFace: null,
          faceName,
          fileIdsToMove: fileIds
        });
        this.showMoveModal = false;
      } catch (error) {
        _services_logger_js__WEBPACK_IMPORTED_MODULE_10__["default"].error(error);
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
        _services_logger_js__WEBPACK_IMPORTED_MODULE_10__["default"].error(error);
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
        _services_logger_js__WEBPACK_IMPORTED_MODULE_10__["default"].error(error);
      } finally {
        this.loadingCount--;
      }
    },
    async downloadSelection() {
      try {
        this.loadingCount++;
        await this.downloadFiles(this.selectedFileIds);
      } catch (error) {
        _services_logger_js__WEBPACK_IMPORTED_MODULE_10__["default"].error(error);
      } finally {
        this.loadingCount--;
      }
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Faces/FaceMergeForm.vue?vue&type=template&id=a9c1fcf4&scoped=true&":
/*!****************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Faces/FaceMergeForm.vue?vue&type=template&id=a9c1fcf4&scoped=true& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************/
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
    staticClass: "merge-form face-list"
  }, _vm._l(_vm.filteredFaces, function (face) {
    return _c("FaceCover", {
      key: face.basename,
      attrs: {
        "base-name": face.basename,
        small: ""
      },
      on: {
        click: function ($event) {
          return _vm.handleSelect(face.basename);
        }
      }
    });
  }), 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/UnassignedFaces.vue?vue&type=template&id=e00dd876&scoped=true&":
/*!*******************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/UnassignedFaces.vue?vue&type=template&id=e00dd876&scoped=true& ***!
  \*******************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _vm.errorFetchingFiles ? _c("NcEmptyContent", {
    scopedSlots: _vm._u([{
      key: "icon",
      fn: function () {
        return [_c("AlertCircle")];
      },
      proxy: true
    }], null, false, 794036927)
  }, [_vm._v("\n\t" + _vm._s(_vm.t("photos", "An error occurred")) + "\n")]) : _c("div", {
    staticClass: "face"
  }, [_c("div", {
    staticClass: "face__header"
  }, [_c("div", {
    staticClass: "face__header__left"
  }, [_c("NcActions", [_c("NcActionButton", {
    on: {
      click: function ($event) {
        return _vm.$router.push("/faces/");
      }
    },
    scopedSlots: _vm._u([{
      key: "icon",
      fn: function () {
        return [_c("ArrowLeft")];
      },
      proxy: true
    }])
  }, [_vm._v(_vm._s(_vm.t("photos", "Back")) + "\n\t\t\t\t")])], 1), _vm._v(" "), _c("div", {
    staticClass: "face__header__title"
  }, [_c("h2", {
    class: {
      "face-name": true
    }
  }, [_vm._v("\n\t\t\t\t\t" + _vm._s(_vm.t("photos", "Unassigned faces")) + "\n\t\t\t\t")])]), _vm._v(" "), _vm.loadingCount > 0 || _vm.loadingFaces ? _c("NcLoadingIcon") : _vm._e()], 1), _vm._v(" "), _c("div", {
    staticClass: "face__header__actions"
  }, [_c("NcActions", {
    attrs: {
      "force-menu": true
    }
  }, [_vm.selectedFileIds.length ? [_c("NcActionButton", {
    attrs: {
      "close-after-click": true,
      "aria-label": _vm.t("photos", "Download selected files")
    },
    on: {
      click: _vm.downloadSelection
    }
  }, [_c("Download", {
    attrs: {
      slot: "icon"
    },
    slot: "icon"
  }), _vm._v("\n\t\t\t\t\t\t" + _vm._s(_vm.t("photos", "Download selected photos")) + "\n\t\t\t\t\t")], 1), _vm._v(" "), _vm.shouldFavoriteSelection ? _c("NcActionButton", {
    attrs: {
      "close-after-click": true,
      "aria-label": _vm.t("photos", "Mark selection as favorite")
    },
    on: {
      click: _vm.favoriteSelection
    }
  }, [_c("Star", {
    attrs: {
      slot: "icon"
    },
    slot: "icon"
  }), _vm._v("\n\t\t\t\t\t\t" + _vm._s(_vm.t("photos", "Favorite")) + "\n\t\t\t\t\t")], 1) : _c("NcActionButton", {
    attrs: {
      "close-after-click": true,
      "aria-label": _vm.t("photos", "Remove selection from favorites")
    },
    on: {
      click: _vm.unFavoriteSelection
    }
  }, [_c("Star", {
    attrs: {
      slot: "icon"
    },
    slot: "icon"
  }), _vm._v("\n\t\t\t\t\t\t" + _vm._s(_vm.t("photos", "Remove from favorites")) + "\n\t\t\t\t\t")], 1), _vm._v(" "), _c("NcActionButton", {
    attrs: {
      "close-after-click": true
    },
    on: {
      click: function ($event) {
        _vm.showMoveModal = true;
      }
    },
    scopedSlots: _vm._u([{
      key: "icon",
      fn: function () {
        return [_c("AccountSwitch")];
      },
      proxy: true
    }], null, false, 2937983280)
  }, [_vm._v("\n\t\t\t\t\t\t" + _vm._s(_vm.n("photos", "Move photo to a different person", "Move photos to a different person", _vm.selectedFileIds.length)) + "\n\t\t\t\t\t")])] : _vm._e()], 2)], 1)]), _vm._v(" "), _c("FilesListViewer", {
    staticClass: "face__photos",
    attrs: {
      "container-element": _vm.appContent,
      "file-ids": _vm.faceFileIds,
      loading: _vm.loadingFiles || _vm.loadingFaces
    },
    scopedSlots: _vm._u([{
      key: "default",
      fn: function (_ref) {
        let {
          file,
          distance
        } = _ref;
        return _c("File", {
          attrs: {
            file: _vm.files[file.id],
            "allow-selection": true,
            selected: _vm.selection[file.id] === true,
            distance: distance
          },
          on: {
            click: _vm.openViewer,
            "select-toggled": _vm.onFileSelectToggle
          }
        });
      }
    }])
  }), _vm._v(" "), _vm.showMoveModal ? _c("NcModal", {
    attrs: {
      name: _vm.t("photos", "Move to different person")
    },
    on: {
      close: function ($event) {
        _vm.showMoveModal = false;
      }
    }
  }, [_c("FaceMergeForm", {
    attrs: {
      "first-face": "-1"
    },
    on: {
      select: function ($event) {
        return _vm.handleMove($event, _vm.selectedFileIds);
      }
    }
  })], 1) : _vm._e()], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Faces/FaceMergeForm.vue?vue&type=style&index=0&id=a9c1fcf4&scoped=true&lang=scss&":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Faces/FaceMergeForm.vue?vue&type=style&index=0&id=a9c1fcf4&scoped=true&lang=scss& ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, ".face-list[data-v-a9c1fcf4] {\n  display: flex;\n  flex-direction: row;\n  height: 350px;\n  flex-wrap: wrap;\n  padding: 12px;\n}\n.loader[data-v-a9c1fcf4] {\n  margin: 25% auto;\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/UnassignedFaces.vue?vue&type=style&index=0&id=e00dd876&lang=scss&scoped=true&":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/UnassignedFaces.vue?vue&type=style&index=0&id=e00dd876&lang=scss&scoped=true& ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, "/**\n * @copyright Copyright (c) 2023 Marcel Klehr <mklehr@gmx.net>\n *\n * @author Marcel Klehr <mklehr@gmx.net>\n *\n * @license AGPL-3.0-or-later\n *\n * This program is free software: you can redistribute it and/or modify\n * it under the terms of the GNU Affero General Public License as\n * published by the Free Software Foundation, either version 3 of the\n * License, or (at your option) any later version.\n *\n * This program is distributed in the hope that it will be useful,\n * but WITHOUT ANY WARRANTY; without even the implied warranty of\n * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the\n * GNU Affero General Public License for more details.\n *\n * You should have received a copy of the GNU Affero General Public License\n * along with this program. If not, see <http://www.gnu.org/licenses/>.\n *\n */\n.face[data-v-e00dd876] {\n  display: flex;\n  flex-direction: column;\n}\n.face__empty[data-v-e00dd876] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n.face__empty__button[data-v-e00dd876] {\n  margin-top: 32px;\n}\n.face__header[data-v-e00dd876] {\n  display: flex;\n  min-height: 60px;\n  align-items: center;\n  justify-content: space-between;\n  position: sticky;\n  z-index: 3;\n  background: var(--color-main-background);\n  padding: 0 64px;\n}\n@media only screen and (max-width: 1020px) {\n.face__header[data-v-e00dd876] {\n    padding: 0;\n    padding-left: 64px;\n}\n}\n.face__header__left[data-v-e00dd876] {\n  height: 100%;\n  display: flex;\n  align-items: center;\n}\n.face__header__title[data-v-e00dd876] {\n  margin-left: 10px;\n}\n.face__header__title h2[data-v-e00dd876] {\n  margin-bottom: 0;\n}\n.face__header__loader[data-v-e00dd876] {\n  margin-left: 32px;\n}\n.face__header__actions[data-v-e00dd876] {\n  display: flex;\n  align-items: center;\n}\n.face__header__actions button[data-v-e00dd876] {\n  margin-left: 16px;\n}\n.face__photos[data-v-e00dd876] {\n  margin-top: 16px;\n  height: 100%;\n  min-height: 0;\n  padding: 0 64px;\n}\n@media only screen and (max-width: 1020px) {\n.face__photos[data-v-e00dd876] {\n    padding: 0;\n}\n}\n.empty-content-with-illustration[data-v-e00dd876] .empty-content__icon {\n  width: 200px;\n  height: 200px;\n}\n.empty-content-with-illustration[data-v-e00dd876] .empty-content__icon svg {\n  width: 200px;\n  height: 200px;\n}\n.rename-form[data-v-e00dd876] {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  height: 70px;\n  padding: 16px;\n}\n.rename-form input[data-v-e00dd876] {\n  width: 80%;\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Faces/FaceMergeForm.vue?vue&type=style&index=0&id=a9c1fcf4&scoped=true&lang=scss&":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Faces/FaceMergeForm.vue?vue&type=style&index=0&id=a9c1fcf4&scoped=true&lang=scss& ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceMergeForm_vue_vue_type_style_index_0_id_a9c1fcf4_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../node_modules/css-loader/dist/cjs.js!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/dist/cjs.js!../../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FaceMergeForm.vue?vue&type=style&index=0&id=a9c1fcf4&scoped=true&lang=scss& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Faces/FaceMergeForm.vue?vue&type=style&index=0&id=a9c1fcf4&scoped=true&lang=scss&");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceMergeForm_vue_vue_type_style_index_0_id_a9c1fcf4_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceMergeForm_vue_vue_type_style_index_0_id_a9c1fcf4_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceMergeForm_vue_vue_type_style_index_0_id_a9c1fcf4_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceMergeForm_vue_vue_type_style_index_0_id_a9c1fcf4_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/UnassignedFaces.vue?vue&type=style&index=0&id=e00dd876&lang=scss&scoped=true&":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/UnassignedFaces.vue?vue&type=style&index=0&id=e00dd876&lang=scss&scoped=true& ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_UnassignedFaces_vue_vue_type_style_index_0_id_e00dd876_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./UnassignedFaces.vue?vue&type=style&index=0&id=e00dd876&lang=scss&scoped=true& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/UnassignedFaces.vue?vue&type=style&index=0&id=e00dd876&lang=scss&scoped=true&");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_UnassignedFaces_vue_vue_type_style_index_0_id_e00dd876_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_UnassignedFaces_vue_vue_type_style_index_0_id_e00dd876_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_UnassignedFaces_vue_vue_type_style_index_0_id_e00dd876_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_UnassignedFaces_vue_vue_type_style_index_0_id_e00dd876_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/components/Faces/FaceMergeForm.vue":
/*!************************************************!*\
  !*** ./src/components/Faces/FaceMergeForm.vue ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _FaceMergeForm_vue_vue_type_template_id_a9c1fcf4_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FaceMergeForm.vue?vue&type=template&id=a9c1fcf4&scoped=true& */ "./src/components/Faces/FaceMergeForm.vue?vue&type=template&id=a9c1fcf4&scoped=true&");
/* harmony import */ var _FaceMergeForm_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FaceMergeForm.vue?vue&type=script&lang=js& */ "./src/components/Faces/FaceMergeForm.vue?vue&type=script&lang=js&");
/* harmony import */ var _FaceMergeForm_vue_vue_type_style_index_0_id_a9c1fcf4_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FaceMergeForm.vue?vue&type=style&index=0&id=a9c1fcf4&scoped=true&lang=scss& */ "./src/components/Faces/FaceMergeForm.vue?vue&type=style&index=0&id=a9c1fcf4&scoped=true&lang=scss&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _FaceMergeForm_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _FaceMergeForm_vue_vue_type_template_id_a9c1fcf4_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render,
  _FaceMergeForm_vue_vue_type_template_id_a9c1fcf4_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "a9c1fcf4",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/components/Faces/FaceMergeForm.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/views/UnassignedFaces.vue":
/*!***************************************!*\
  !*** ./src/views/UnassignedFaces.vue ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _UnassignedFaces_vue_vue_type_template_id_e00dd876_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UnassignedFaces.vue?vue&type=template&id=e00dd876&scoped=true& */ "./src/views/UnassignedFaces.vue?vue&type=template&id=e00dd876&scoped=true&");
/* harmony import */ var _UnassignedFaces_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./UnassignedFaces.vue?vue&type=script&lang=js& */ "./src/views/UnassignedFaces.vue?vue&type=script&lang=js&");
/* harmony import */ var _UnassignedFaces_vue_vue_type_style_index_0_id_e00dd876_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./UnassignedFaces.vue?vue&type=style&index=0&id=e00dd876&lang=scss&scoped=true& */ "./src/views/UnassignedFaces.vue?vue&type=style&index=0&id=e00dd876&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _UnassignedFaces_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _UnassignedFaces_vue_vue_type_template_id_e00dd876_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render,
  _UnassignedFaces_vue_vue_type_template_id_e00dd876_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "e00dd876",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/views/UnassignedFaces.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/components/Faces/FaceMergeForm.vue?vue&type=script&lang=js&":
/*!*************************************************************************!*\
  !*** ./src/components/Faces/FaceMergeForm.vue?vue&type=script&lang=js& ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceMergeForm_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FaceMergeForm.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Faces/FaceMergeForm.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceMergeForm_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/views/UnassignedFaces.vue?vue&type=script&lang=js&":
/*!****************************************************************!*\
  !*** ./src/views/UnassignedFaces.vue?vue&type=script&lang=js& ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_UnassignedFaces_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./UnassignedFaces.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/UnassignedFaces.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_UnassignedFaces_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/components/Faces/FaceMergeForm.vue?vue&type=template&id=a9c1fcf4&scoped=true&":
/*!*******************************************************************************************!*\
  !*** ./src/components/Faces/FaceMergeForm.vue?vue&type=template&id=a9c1fcf4&scoped=true& ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceMergeForm_vue_vue_type_template_id_a9c1fcf4_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceMergeForm_vue_vue_type_template_id_a9c1fcf4_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceMergeForm_vue_vue_type_template_id_a9c1fcf4_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FaceMergeForm.vue?vue&type=template&id=a9c1fcf4&scoped=true& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Faces/FaceMergeForm.vue?vue&type=template&id=a9c1fcf4&scoped=true&");


/***/ }),

/***/ "./src/views/UnassignedFaces.vue?vue&type=template&id=e00dd876&scoped=true&":
/*!**********************************************************************************!*\
  !*** ./src/views/UnassignedFaces.vue?vue&type=template&id=e00dd876&scoped=true& ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_UnassignedFaces_vue_vue_type_template_id_e00dd876_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_UnassignedFaces_vue_vue_type_template_id_e00dd876_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_UnassignedFaces_vue_vue_type_template_id_e00dd876_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./UnassignedFaces.vue?vue&type=template&id=e00dd876&scoped=true& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/UnassignedFaces.vue?vue&type=template&id=e00dd876&scoped=true&");


/***/ }),

/***/ "./src/components/Faces/FaceMergeForm.vue?vue&type=style&index=0&id=a9c1fcf4&scoped=true&lang=scss&":
/*!**********************************************************************************************************!*\
  !*** ./src/components/Faces/FaceMergeForm.vue?vue&type=style&index=0&id=a9c1fcf4&scoped=true&lang=scss& ***!
  \**********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FaceMergeForm_vue_vue_type_style_index_0_id_a9c1fcf4_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/style-loader/dist/cjs.js!../../../node_modules/css-loader/dist/cjs.js!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/dist/cjs.js!../../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FaceMergeForm.vue?vue&type=style&index=0&id=a9c1fcf4&scoped=true&lang=scss& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Faces/FaceMergeForm.vue?vue&type=style&index=0&id=a9c1fcf4&scoped=true&lang=scss&");


/***/ }),

/***/ "./src/views/UnassignedFaces.vue?vue&type=style&index=0&id=e00dd876&lang=scss&scoped=true&":
/*!*************************************************************************************************!*\
  !*** ./src/views/UnassignedFaces.vue?vue&type=style&index=0&id=e00dd876&lang=scss&scoped=true& ***!
  \*************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_UnassignedFaces_vue_vue_type_style_index_0_id_e00dd876_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/style-loader/dist/cjs.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./UnassignedFaces.vue?vue&type=style&index=0&id=e00dd876&lang=scss&scoped=true& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2.use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/views/UnassignedFaces.vue?vue&type=style&index=0&id=e00dd876&lang=scss&scoped=true&");


/***/ })

}]);
//# sourceMappingURL=photos-src_views_UnassignedFaces_vue.js.map?v=7e9e7f60be3e2caa06f8