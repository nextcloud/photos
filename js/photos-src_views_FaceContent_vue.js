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
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
  data: function data() {
    return {
      loading: false
    };
  },
  computed: _objectSpread(_objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_3__.mapGetters)(['files', 'faces', 'facesFiles'])), {}, {
    filteredFaces: function filteredFaces() {
      var _this = this;

      return Object.values(this.faces).filter(function (face) {
        return face.basename !== _this.firstFace;
      }).sort(function (a, b) {
        if (a.props.nbItems && b.props.nbItems) {
          return b.props.nbItems - a.props.nbItems;
        }

        if (!_this.facesFiles[b.basename] || !_this.facesFiles[a.basename]) {
          return 0;
        }

        return _this.facesFiles[b.basename].length - _this.facesFiles[a.basename].length;
      });
    }
  }),
  methods: {
    handleSelect: function handleSelect(faceName) {
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
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
    focus: function focus(el) {
      vue__WEBPACK_IMPORTED_MODULE_17__["default"].nextTick(function () {
        return el.focus();
      });
    }
  },
  mixins: [_mixins_FetchFacesMixin_js__WEBPACK_IMPORTED_MODULE_15__["default"], _mixins_FetchFilesMixin_js__WEBPACK_IMPORTED_MODULE_10__["default"], _mixins_FilesSelectionMixin_js__WEBPACK_IMPORTED_MODULE_11__["default"]],
  props: {
    faceName: {
      type: String,
      default: '/'
    }
  },
  data: function data() {
    return {
      showMergeModal: false,
      showRenameModal: false,
      loadingCount: 0,
      appContent: document.getElementById('app-content-vue')
    };
  },
  computed: _objectSpread(_objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_18__.mapGetters)(['files', 'facesFiles'])), {}, {
    /**
     * @return {string[]} The face information for the current faceName.
     */
    face: function face() {
      return this.faces[this.faceName];
    },

    /**
     * @return {string[]} The list of files for the current faceName.
     */
    faceFileIds: function faceFileIds() {
      return this.facesFiles[this.faceName] || [];
    },

    /** @type {boolean} */
    shouldFavoriteSelection: function shouldFavoriteSelection() {
      var _this = this;

      // Favorite all selection if at least one file is not on the favorites.
      return this.selectedFileIds.some(function (fileId) {
        return _this.$store.state.files.files[fileId].favorite === 0;
      });
    }
  }),
  watch: {
    face: function face() {
      if (this.face) {
        this.fetchFaceContent(this.faceName);
      }
    }
  },
  methods: _objectSpread(_objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_18__.mapActions)(['appendFiles', 'deleteFace', 'renameFace', 'downloadFiles', 'toggleFavoriteForFiles', 'removeFilesFromFace', 'moveFilesToFace'])), {}, {
    openViewer: function openViewer(fileId) {
      var _this2 = this;

      var file = this.files[fileId];
      OCA.Viewer.open({
        // remove /username/files/ from the start
        path: '/' + file.filename.split('/').slice(3).join('/'),
        list: this.faceFileIds.map(function (fileId) {
          return _objectSpread(_objectSpread({}, _this2.files[fileId]), {}, {
            basename: _this2.files[fileId].basename.split('-').slice(1).join('-')
          });
        }).filter(function (file) {
          return !file.sectionHeader;
        }),
        loadMore: file.loadMore ? /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return file.loadMore(true);

                case 2:
                  return _context.abrupt("return", _context.sent);

                case 3:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        })) : function () {
          return [];
        },
        canLoop: file.canLoop
      });
    },
    handleRemoveFilesFromFace: function handleRemoveFilesFromFace(fileIds) {
      var _this3 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _this3.loadingCount++;
                _context2.next = 4;
                return _this3.removeFilesFromFace({
                  faceName: _this3.faceName,
                  fileIdsToRemove: fileIds
                });

              case 4:
                _this3.resetSelection();

                _context2.next = 10;
                break;

              case 7:
                _context2.prev = 7;
                _context2.t0 = _context2["catch"](0);
                _services_logger_js__WEBPACK_IMPORTED_MODULE_14__["default"].error(_context2.t0);

              case 10:
                _context2.prev = 10;
                _this3.loadingCount--;
                return _context2.finish(10);

              case 13:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 7, 10, 13]]);
      }))();
    },
    handleDeleteFace: function handleDeleteFace() {
      var _this4 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _this4.loadingCount++;
                _context3.next = 4;
                return _this4.deleteFace({
                  faceName: _this4.faceName
                });

              case 4:
                _this4.$router.push('/faces');

                _context3.next = 10;
                break;

              case 7:
                _context3.prev = 7;
                _context3.t0 = _context3["catch"](0);
                _services_logger_js__WEBPACK_IMPORTED_MODULE_14__["default"].error(_context3.t0);

              case 10:
                _context3.prev = 10;
                _this4.loadingCount--;
                return _context3.finish(10);

              case 13:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[0, 7, 10, 13]]);
      }))();
    },
    handleRenameFace: function handleRenameFace(faceName) {
      var _this5 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var oldName;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                _this5.loadingCount++;
                _this5.showRenameModal = false;
                oldName = _this5.faceName;
                _context4.next = 6;
                return _this5.renameFace({
                  oldName: oldName,
                  faceName: faceName
                });

              case 6:
                _this5.$router.push({
                  name: 'facecontent',
                  params: {
                    faceName: faceName
                  }
                });

                _context4.next = 12;
                break;

              case 9:
                _context4.prev = 9;
                _context4.t0 = _context4["catch"](0);
                _services_logger_js__WEBPACK_IMPORTED_MODULE_14__["default"].error(_context4.t0);

              case 12:
                _context4.prev = 12;
                _this5.loadingCount--;
                return _context4.finish(12);

              case 15:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[0, 9, 12, 15]]);
      }))();
    },
    handleMerge: function handleMerge(faceName) {
      var _this6 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                _this6.loadingCount++;
                _context5.next = 4;
                return _this6.moveFilesToFace({
                  oldFace: _this6.faceName,
                  faceName: faceName,
                  fileIdsToMove: _this6.facesFiles[_this6.faceName]
                });

              case 4:
                _context5.next = 6;
                return _this6.deleteFace({
                  faceName: _this6.faceName
                });

              case 6:
                _this6.showMergeModal = false;

                _this6.$router.push({
                  name: 'facecontent',
                  params: {
                    faceName: faceName
                  }
                });

                _context5.next = 13;
                break;

              case 10:
                _context5.prev = 10;
                _context5.t0 = _context5["catch"](0);
                _services_logger_js__WEBPACK_IMPORTED_MODULE_14__["default"].error(_context5.t0);

              case 13:
                _context5.prev = 13;
                _this6.loadingCount--;
                return _context5.finish(13);

              case 16:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, null, [[0, 10, 13, 16]]);
      }))();
    },
    favoriteSelection: function favoriteSelection() {
      var _this7 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                _this7.loadingCount++;
                _context6.next = 4;
                return _this7.toggleFavoriteForFiles({
                  fileIds: _this7.selectedFileIds,
                  favoriteState: true
                });

              case 4:
                _context6.next = 9;
                break;

              case 6:
                _context6.prev = 6;
                _context6.t0 = _context6["catch"](0);
                _services_logger_js__WEBPACK_IMPORTED_MODULE_14__["default"].error(_context6.t0);

              case 9:
                _context6.prev = 9;
                _this7.loadingCount--;
                return _context6.finish(9);

              case 12:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, null, [[0, 6, 9, 12]]);
      }))();
    },
    unFavoriteSelection: function unFavoriteSelection() {
      var _this8 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;
                _this8.loadingCount++;
                _context7.next = 4;
                return _this8.toggleFavoriteForFiles({
                  fileIds: _this8.selectedFileIds,
                  favoriteState: false
                });

              case 4:
                _context7.next = 9;
                break;

              case 6:
                _context7.prev = 6;
                _context7.t0 = _context7["catch"](0);
                _services_logger_js__WEBPACK_IMPORTED_MODULE_14__["default"].error(_context7.t0);

              case 9:
                _context7.prev = 9;
                _this8.loadingCount--;
                return _context7.finish(9);

              case 12:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, null, [[0, 6, 9, 12]]);
      }))();
    },
    downloadSelection: function downloadSelection() {
      var _this9 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.prev = 0;
                _this9.loadingCount++;
                _context8.next = 4;
                return _this9.downloadFiles(_this9.selectedFileIds);

              case 4:
                _context8.next = 9;
                break;

              case 6:
                _context8.prev = 6;
                _context8.t0 = _context8["catch"](0);
                _services_logger_js__WEBPACK_IMPORTED_MODULE_14__["default"].error(_context8.t0);

              case 9:
                _context8.prev = 9;
                _this9.loadingCount--;
                return _context8.finish(9);

              case 12:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, null, [[0, 6, 9, 12]]);
      }))();
    }
  })
});

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
___CSS_LOADER_EXPORT___.push([module.id, ".face[data-v-03238d12] {\n  display: flex;\n  flex-direction: column;\n}\n.face__empty[data-v-03238d12] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n.face__empty__button[data-v-03238d12] {\n  margin-top: 32px;\n}\n.face__header[data-v-03238d12] {\n  display: flex;\n  min-height: 60px;\n  align-items: center;\n  justify-content: space-between;\n  position: -webkit-sticky;\n  position: sticky;\n  z-index: 3;\n  background: var(--color-main-background);\n  padding: 0 64px;\n}\n@media only screen and (max-width: 1020px) {\n.face__header[data-v-03238d12] {\n    padding: 0;\n    padding-left: 64px;\n}\n}\n.face__header__left[data-v-03238d12] {\n  height: 100%;\n  display: flex;\n  align-items: center;\n}\n.face__header__title[data-v-03238d12] {\n  margin-left: 10px;\n}\n.face__header__title h2[data-v-03238d12] {\n  margin-bottom: 0;\n}\n.face__header__loader[data-v-03238d12] {\n  margin-left: 32px;\n}\n.face__header__actions[data-v-03238d12] {\n  display: flex;\n  align-items: center;\n}\n.face__header__actions button[data-v-03238d12] {\n  margin-left: 16px;\n}\n.face__photos[data-v-03238d12] {\n  margin-top: 16px;\n  height: 100%;\n  min-height: 0;\n  padding: 0 64px;\n}\n@media only screen and (max-width: 1020px) {\n.face__photos[data-v-03238d12] {\n    padding: 0;\n}\n}\n.empty-content-with-illustration[data-v-03238d12]  .empty-content__icon {\n  width: 200px;\n  height: 200px;\n}\n.empty-content-with-illustration[data-v-03238d12]  .empty-content__icon svg {\n  width: 200px;\n  height: 200px;\n}\n.rename-form[data-v-03238d12] {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  height: 70px;\n  padding: 16px;\n}\n.rename-form input[data-v-03238d12] {\n  width: 80%;\n}", ""]);
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
//# sourceMappingURL=photos-src_views_FaceContent_vue.js.map?v=7f4869cc789f9f95d6a1