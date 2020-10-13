(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[7],{

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js?!./src/components/Folder.vue?vue&type=script&lang=js&":
/*!**********************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Folder.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _services_AlbumContent__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/AlbumContent */ "./src/services/AlbumContent.js");
/* harmony import */ var _utils_CancelableRequest__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/CancelableRequest */ "./src/utils/CancelableRequest.js");
/* harmony import */ var _FolderTagPreview__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./FolderTagPreview */ "./src/components/FolderTagPreview.vue");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

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




/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'Folder',
  components: {
    FolderTagPreview: _FolderTagPreview__WEBPACK_IMPORTED_MODULE_3__["default"]
  },
  inheritAttrs: false,
  props: {
    basename: {
      type: String,
      required: true
    },
    filename: {
      type: String,
      required: true
    },
    fileid: {
      type: Number,
      required: true
    },
    showShared: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      cancelRequest: null
    };
  },
  computed: _objectSpread(_objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapGetters"])(['files', 'folders'])), {}, {
    // files list of the current folder
    folderContent: function folderContent() {
      return this.folders[this.fileid];
    },
    fileList: function fileList() {
      var _this = this;

      return this.folderContent ? this.folderContent.map(function (id) {
        return _this.files[id];
      }).filter(function (file) {
        return !!file;
      }).slice(0, 4) // only get the 4 first images
      : [];
    }
  }),
  created: function created() {
    var _this2 = this;

    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var _cancelableRequest, request, cancel, _yield$request, folder, folders, files;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              // init cancellable request
              _cancelableRequest = Object(_utils_CancelableRequest__WEBPACK_IMPORTED_MODULE_2__["default"])(_services_AlbumContent__WEBPACK_IMPORTED_MODULE_1__["default"]), request = _cancelableRequest.request, cancel = _cancelableRequest.cancel;
              _this2.cancelRequest = cancel;
              _context.prev = 2;
              _context.next = 5;
              return request(_this2.filename, {
                shared: _this2.showShared
              });

            case 5:
              _yield$request = _context.sent;
              folder = _yield$request.folder;
              folders = _yield$request.folders;
              files = _yield$request.files;

              _this2.$store.dispatch('updateFolders', {
                fileid: folder.fileid,
                files: files,
                folders: folders
              });

              _this2.$store.dispatch('updateFiles', {
                folder: folder,
                files: files,
                folders: folders
              });

              _context.next = 16;
              break;

            case 13:
              _context.prev = 13;
              _context.t0 = _context["catch"](2);

              if (_context.t0.response && _context.t0.response.status) {
                console.error('Failed to get folder content', _this2.folder, _context.t0.response);
              } // else we just cancelled the request


            case 16:
              _context.prev = 16;
              _this2.cancelRequest = null;
              return _context.finish(16);

            case 19:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[2, 13, 16, 19]]);
    }))();
  },
  beforeDestroy: function beforeDestroy() {
    // cancel any pending requests
    if (this.cancelRequest) {
      this.cancelRequest('Navigated away');
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js?!./src/views/Albums.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/views/Albums.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _services_AlbumContent__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/AlbumContent */ "./src/services/AlbumContent.js");
/* harmony import */ var _components_EmptyContent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/EmptyContent */ "./src/components/EmptyContent.vue");
/* harmony import */ var _components_Folder__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/Folder */ "./src/components/Folder.vue");
/* harmony import */ var _components_File__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/File */ "./src/components/File.vue");
/* harmony import */ var _components_Grid__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../components/Grid */ "./src/components/Grid.vue");
/* harmony import */ var _components_Navigation__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../components/Navigation */ "./src/components/Navigation.vue");
/* harmony import */ var _utils_CancelableRequest__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/CancelableRequest */ "./src/utils/CancelableRequest.js");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

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








/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'Albums',
  components: {
    EmptyContent: _components_EmptyContent__WEBPACK_IMPORTED_MODULE_2__["default"],
    File: _components_File__WEBPACK_IMPORTED_MODULE_4__["default"],
    Folder: _components_Folder__WEBPACK_IMPORTED_MODULE_3__["default"],
    Grid: _components_Grid__WEBPACK_IMPORTED_MODULE_5__["default"],
    Navigation: _components_Navigation__WEBPACK_IMPORTED_MODULE_6__["default"]
  },
  props: {
    rootTitle: {
      type: String,
      required: true
    },
    path: {
      type: String,
      default: '/'
    },
    loading: {
      type: Boolean,
      required: true
    },
    showShared: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      error: null,
      cancelRequest: function cancelRequest() {}
    };
  },
  computed: _objectSpread(_objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapGetters"])(['files', 'folders'])), {}, {
    // current folder id from current path
    folderId: function folderId() {
      return this.$store.getters.folderId(this.path);
    },
    // files list of the current folder
    folder: function folder() {
      return this.files[this.folderId];
    },
    folderContent: function folderContent() {
      return this.folders[this.folderId];
    },
    fileList: function fileList() {
      var _this = this;

      var list = this.folderContent && this.folderContent.map(function (id) {
        return _this.files[id];
      }).filter(function (file) {
        return !!file;
      });
      return list;
    },
    // subfolders of the current folder
    subFolders: function subFolders() {
      return this.folderId && this.files[this.folderId] && this.files[this.folderId].folders;
    },
    folderList: function folderList() {
      var _this2 = this;

      var list = this.subFolders && this.subFolders.map(function (id) {
        return _this2.files[id];
      }).filter(function (file) {
        return !!file;
      });
      return list;
    },
    // is current folder empty?
    isEmpty: function isEmpty() {
      return !this.haveFiles && !this.haveFolders;
    },
    haveFiles: function haveFiles() {
      return !!this.fileList && this.fileList.length !== 0;
    },
    haveFolders: function haveFolders() {
      return !!this.folderList && this.folderList.length !== 0;
    }
  }),
  watch: {
    path: function path() {
      this.fetchFolderContent();
    },
    showShared: function showShared() {
      this.fetchFolderContent();
    }
  },
  beforeMount: function beforeMount() {
    var _this3 = this;

    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _this3.fetchFolderContent();

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  },
  beforeDestroy: function beforeDestroy() {
    this.cancelRequest('Changed view');
  },
  methods: {
    fetchFolderContent: function fetchFolderContent() {
      var _this4 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var _cancelableRequest, request, cancel, _yield$request, folder, folders, files;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                // cancel any pending requests
                _this4.cancelRequest('Changed folder'); // close any potential opened viewer & sidebar


                OCA.Viewer && OCA.Viewer.close && OCA.Viewer.close();
                OCA.Files && OCA.Files.Sidebar.close && OCA.Files.Sidebar.close(); // if we don't already have some cached data let's show a loader

                if (!_this4.files[_this4.folderId] || !_this4.folders[_this4.folderId]) {
                  _this4.$emit('update:loading', true);
                }

                _this4.error = null; // init cancellable request

                _cancelableRequest = Object(_utils_CancelableRequest__WEBPACK_IMPORTED_MODULE_7__["default"])(_services_AlbumContent__WEBPACK_IMPORTED_MODULE_1__["default"]), request = _cancelableRequest.request, cancel = _cancelableRequest.cancel;
                _this4.cancelRequest = cancel;
                _context2.prev = 7;
                _context2.next = 10;
                return request(_this4.path, {
                  shared: _this4.showShared
                });

              case 10:
                _yield$request = _context2.sent;
                folder = _yield$request.folder;
                folders = _yield$request.folders;
                files = _yield$request.files;

                _this4.$store.dispatch('addPath', {
                  path: _this4.path,
                  fileid: folder.fileid
                });

                _this4.$store.dispatch('updateFolders', {
                  fileid: folder.fileid,
                  files: files,
                  folders: folders
                });

                _this4.$store.dispatch('updateFiles', {
                  folder: folder,
                  files: files,
                  folders: folders
                });

                _context2.next = 23;
                break;

              case 19:
                _context2.prev = 19;
                _context2.t0 = _context2["catch"](7);

                if (_context2.t0.response && _context2.t0.response.status) {
                  if (_context2.t0.response.status === 404) {
                    _this4.error = 404;
                    setTimeout(function () {
                      _this4.$router.push({
                        name: _this4.$route.name
                      });
                    }, 3000);
                  } else {
                    _this4.error = _context2.t0;
                  }
                } // cancelled request, moving on...


                console.error('Error fetching album data', _context2.t0);

              case 23:
                _context2.prev = 23;

                // done loading even with errors
                _this4.$emit('update:loading', false);

                return _context2.finish(23);

              case 26:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[7, 19, 23, 26]]);
      }))();
    }
  }
});

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/components/Folder.vue?vue&type=style&index=0&id=8ab848c4&lang=scss&scoped=true&":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??ref--1-3!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Folder.vue?vue&type=style&index=0&id=8ab848c4&lang=scss&scoped=true& ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, "@charset \"UTF-8\";\n/**\n * @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>\n *\n * @author John Molakvoæ <skjnldsv@protonmail.com>\n *\n * @license GNU AGPL version 3 or any later version\n *\n * This program is free software: you can redistribute it and/or modify\n * it under the terms of the GNU Affero General Public License as\n * published by the Free Software Foundation, either version 3 of the\n * License, or (at your option) any later version.\n *\n * This program is distributed in the hope that it will be useful,\n * but WITHOUT ANY WARRANTY; without even the implied warranty of\n * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the\n * GNU Affero General Public License for more details.\n *\n * You should have received a copy of the GNU Affero General Public License\n * along with this program. If not, see <http://www.gnu.org/licenses/>.\n *\n */\n.file[data-v-8ab848c4],\n.folder[data-v-8ab848c4] {\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  border-radius: var(--border-radius);\n  overflow: hidden;\n}\n.file .cover[data-v-8ab848c4],\n  .folder .cover[data-v-8ab848c4] {\n    z-index: 2;\n    width: 100%;\n    padding-bottom: 100%;\n    transition: opacity var(--animation-quick) ease-in-out;\n    opacity: 0;\n    background-color: var(--color-main-text);\n}\n.file.active .cover[data-v-8ab848c4], .file:active .cover[data-v-8ab848c4], .file:hover .cover[data-v-8ab848c4], .file:focus .cover[data-v-8ab848c4],\n  .folder.active .cover[data-v-8ab848c4],\n  .folder:active .cover[data-v-8ab848c4],\n  .folder:hover .cover[data-v-8ab848c4],\n  .folder:focus .cover[data-v-8ab848c4] {\n    opacity: .3;\n}\n.file--clear.active .cover[data-v-8ab848c4], .file--clear:active .cover[data-v-8ab848c4], .file--clear:hover .cover[data-v-8ab848c4], .file--clear:focus .cover[data-v-8ab848c4],\n  .folder--clear.active .cover[data-v-8ab848c4],\n  .folder--clear:active .cover[data-v-8ab848c4],\n  .folder--clear:hover .cover[data-v-8ab848c4],\n  .folder--clear:focus .cover[data-v-8ab848c4] {\n    opacity: .1;\n}\n.fade-enter-active[data-v-8ab848c4], .fade-leave-active[data-v-8ab848c4] {\n  transition: opacity var(--animation-quick) ease-in-out;\n}\n.fade-enter[data-v-8ab848c4], .fade-leave-to[data-v-8ab848c4] {\n  opacity: 0;\n}\n.folder-content[data-v-8ab848c4] {\n  position: absolute;\n  display: grid;\n  width: 100%;\n  height: 100%;\n}\n.folder-content--grid-1[data-v-8ab848c4] {\n    grid-template-columns: 1fr;\n    grid-template-rows: 1fr;\n}\n.folder-content--grid-2[data-v-8ab848c4] {\n    grid-template-columns: 1fr;\n    grid-template-rows: 1fr 1fr;\n}\n.folder-content--grid-3[data-v-8ab848c4] {\n    grid-template-columns: 1fr 1fr;\n    grid-template-rows: 1fr 1fr;\n}\n.folder-content--grid-3 img[data-v-8ab848c4]:first-child {\n      grid-column: span 2;\n}\n.folder-content--grid-4[data-v-8ab848c4] {\n    grid-template-columns: 1fr 1fr;\n    grid-template-rows: 1fr 1fr;\n}\n.folder-content img[data-v-8ab848c4] {\n    width: 100%;\n    height: 100%;\n    -o-object-fit: cover;\n       object-fit: cover;\n}\n.folder-name[data-v-8ab848c4] {\n  position: absolute;\n  z-index: 3;\n  display: flex;\n  overflow: hidden;\n  flex-direction: column;\n  width: 100%;\n  height: 100%;\n  transition: opacity var(--animation-quick) ease-in-out;\n  opacity: 1;\n}\n.folder-name__icon[data-v-8ab848c4] {\n    height: 40%;\n    margin-top: calc(30% - 1rem / 2);\n    background-size: 40%;\n}\n.folder-name__name[data-v-8ab848c4] {\n    overflow: hidden;\n    height: 1rem;\n    padding: 0 10px;\n    text-align: center;\n    white-space: nowrap;\n    text-overflow: ellipsis;\n    color: var(--color-main-background);\n    text-shadow: 0 0 8px var(--color-main-text);\n    font-size: 1rem;\n    line-height: 1rem;\n}\n.folder--clear .folder-name__icon[data-v-8ab848c4] {\n  opacity: .3;\n}\n.folder--clear .folder-name__name[data-v-8ab848c4] {\n  color: var(--color-main-text);\n  text-shadow: 0 0 8px var(--color-main-background);\n}\n.folder:not(.folder--clear) .cover[data-v-8ab848c4] {\n  opacity: .3;\n}\n.folder:not(.folder--clear).active .folder-name[data-v-8ab848c4],\n.folder:not(.folder--clear).active .cover[data-v-8ab848c4], .folder:not(.folder--clear):active .folder-name[data-v-8ab848c4],\n.folder:not(.folder--clear):active .cover[data-v-8ab848c4], .folder:not(.folder--clear):hover .folder-name[data-v-8ab848c4],\n.folder:not(.folder--clear):hover .cover[data-v-8ab848c4], .folder:not(.folder--clear):focus .folder-name[data-v-8ab848c4],\n.folder:not(.folder--clear):focus .cover[data-v-8ab848c4] {\n  opacity: 0;\n}\n", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/components/Folder.vue?vue&type=template&id=8ab848c4&scoped=true&":
/*!************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Folder.vue?vue&type=template&id=8ab848c4&scoped=true& ***!
  \************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("FolderTagPreview", {
    attrs: {
      id: _vm.fileid,
      name: _vm.basename,
      path: _vm.filename,
      "file-list": _vm.fileList
    }
  })
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/views/Albums.vue?vue&type=template&id=28345ec4&":
/*!*******************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/views/Albums.vue?vue&type=template&id=28345ec4& ***!
  \*******************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _vm.error === 404
    ? _c("EmptyContent", { attrs: { "illustration-name": "folder" } }, [
        _vm._v(
          "\n\t" + _vm._s(_vm.t("photos", "This folder does not exists")) + "\n"
        )
      ])
    : _vm.error
    ? _c("EmptyContent", [
        _vm._v("\n\t" + _vm._s(_vm.t("photos", "An error occurred")) + "\n")
      ])
    : !_vm.loading
    ? _c(
        "div",
        [
          _vm.folder
            ? _c(
                "Navigation",
                _vm._b(
                  {
                    key: "navigation",
                    attrs: { "root-title": _vm.rootTitle, "show-actions": true }
                  },
                  "Navigation",
                  _vm.folder,
                  false
                )
              )
            : _vm._e(),
          _vm._v(" "),
          _c(
            "Grid",
            [
              _vm.isEmpty
                ? _c(
                    "EmptyContent",
                    {
                      key: "emptycontent",
                      attrs: { "illustration-name": "empty" }
                    },
                    [
                      _vm._v(
                        "\n\t\t\t" +
                          _vm._s(_vm.t("photos", "No photos in here")) +
                          "\n\t\t"
                      )
                    ]
                  )
                : [
                    _vm._l(_vm.folderList, function(dir) {
                      return _c(
                        "Folder",
                        _vm._b(
                          {
                            key: dir.fileid,
                            attrs: { "show-shared": _vm.showShared }
                          },
                          "Folder",
                          dir,
                          false
                        )
                      )
                    }),
                    _vm._v(" "),
                    _vm._l(_vm.fileList, function(file) {
                      return _c(
                        "File",
                        _vm._b(
                          { key: file.fileid, attrs: { list: _vm.fileList } },
                          "File",
                          file,
                          false
                        )
                      )
                    })
                  ]
            ],
            2
          )
        ],
        1
      )
    : _vm._e()
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/components/Folder.vue?vue&type=style&index=0&id=8ab848c4&lang=scss&scoped=true&":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-style-loader!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??ref--1-3!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Folder.vue?vue&type=style&index=0&id=8ab848c4&lang=scss&scoped=true& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??ref--1-3!../../node_modules/vue-loader/lib??vue-loader-options!./Folder.vue?vue&type=style&index=0&id=8ab848c4&lang=scss&scoped=true& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/components/Folder.vue?vue&type=style&index=0&id=8ab848c4&lang=scss&scoped=true&");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(/*! ../../node_modules/vue-style-loader/lib/addStylesClient.js */ "./node_modules/vue-style-loader/lib/addStylesClient.js").default
var update = add("20cc90cc", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ "./src/components/Folder.vue":
/*!***********************************!*\
  !*** ./src/components/Folder.vue ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Folder_vue_vue_type_template_id_8ab848c4_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Folder.vue?vue&type=template&id=8ab848c4&scoped=true& */ "./src/components/Folder.vue?vue&type=template&id=8ab848c4&scoped=true&");
/* harmony import */ var _Folder_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Folder.vue?vue&type=script&lang=js& */ "./src/components/Folder.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _Folder_vue_vue_type_style_index_0_id_8ab848c4_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Folder.vue?vue&type=style&index=0&id=8ab848c4&lang=scss&scoped=true& */ "./src/components/Folder.vue?vue&type=style&index=0&id=8ab848c4&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _Folder_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _Folder_vue_vue_type_template_id_8ab848c4_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _Folder_vue_vue_type_template_id_8ab848c4_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "8ab848c4",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/components/Folder.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/components/Folder.vue?vue&type=script&lang=js&":
/*!************************************************************!*\
  !*** ./src/components/Folder.vue?vue&type=script&lang=js& ***!
  \************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Folder_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib!../../node_modules/vue-loader/lib??vue-loader-options!./Folder.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js?!./src/components/Folder.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Folder_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/components/Folder.vue?vue&type=style&index=0&id=8ab848c4&lang=scss&scoped=true&":
/*!*********************************************************************************************!*\
  !*** ./src/components/Folder.vue?vue&type=style&index=0&id=8ab848c4&lang=scss&scoped=true& ***!
  \*********************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_ref_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Folder_vue_vue_type_style_index_0_id_8ab848c4_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-style-loader!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??ref--1-3!../../node_modules/vue-loader/lib??vue-loader-options!./Folder.vue?vue&type=style&index=0&id=8ab848c4&lang=scss&scoped=true& */ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/components/Folder.vue?vue&type=style&index=0&id=8ab848c4&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_ref_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Folder_vue_vue_type_style_index_0_id_8ab848c4_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_ref_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Folder_vue_vue_type_style_index_0_id_8ab848c4_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_ref_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Folder_vue_vue_type_style_index_0_id_8ab848c4_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_ref_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Folder_vue_vue_type_style_index_0_id_8ab848c4_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_ref_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Folder_vue_vue_type_style_index_0_id_8ab848c4_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./src/components/Folder.vue?vue&type=template&id=8ab848c4&scoped=true&":
/*!******************************************************************************!*\
  !*** ./src/components/Folder.vue?vue&type=template&id=8ab848c4&scoped=true& ***!
  \******************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Folder_vue_vue_type_template_id_8ab848c4_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib??vue-loader-options!./Folder.vue?vue&type=template&id=8ab848c4&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/components/Folder.vue?vue&type=template&id=8ab848c4&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Folder_vue_vue_type_template_id_8ab848c4_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Folder_vue_vue_type_template_id_8ab848c4_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/services/AlbumContent.js":
/*!**************************************!*\
  !*** ./src/services/AlbumContent.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _nextcloud_axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/axios */ "./node_modules/@nextcloud/axios/dist/index.js");
/* harmony import */ var _nextcloud_axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/router */ "./node_modules/@nextcloud/router/dist/index.js");
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_router__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_fileUtils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/fileUtils */ "./src/utils/fileUtils.js");
/* harmony import */ var _AllowedMimes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./AllowedMimes */ "./src/services/AllowedMimes.js");
function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @license GNU AGPL version 3 or any later version
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
 * @param {String} path the path relative to the user root
 * @param {Object} [options] optional options for axios
 * @param {boolean} [shared] fetch shared albums ?
 * @returns {Array} the file list
 */

/* harmony default export */ __webpack_exports__["default"] = (function () {
  return _ref.apply(this, arguments);
});

function _ref() {
  _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var path,
        options,
        prefixPath,
        response,
        list,
        folder,
        folders,
        files,
        _iterator,
        _step,
        entry,
        _args = arguments;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            path = _args.length > 0 && _args[0] !== undefined ? _args[0] : '/';
            options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
            prefixPath = Object(_nextcloud_router__WEBPACK_IMPORTED_MODULE_1__["generateUrl"])("/apps/photos/api/v1/".concat(options.shared ? 'shared' : 'albums')); // fetch listing

            _context.next = 5;
            return _nextcloud_axios__WEBPACK_IMPORTED_MODULE_0___default.a.get(prefixPath + Object(_utils_fileUtils__WEBPACK_IMPORTED_MODULE_2__["encodeFilePath"])(path), options);

          case 5:
            response = _context.sent;
            list = response.data.map(function (data) {
              return Object(_utils_fileUtils__WEBPACK_IMPORTED_MODULE_2__["genFileInfo"])(data);
            }); // filter all the files and folders

            folder = {};
            folders = [];
            files = [];
            _iterator = _createForOfIteratorHelper(list);

            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                entry = _step.value;

                // is this the current provided path ?
                if (entry.filename === path) {
                  folder = entry;
                } else if (entry.type !== 'file') {
                  folders.push(entry);
                } else if (_AllowedMimes__WEBPACK_IMPORTED_MODULE_3__["default"].indexOf(entry.mime) > -1) {
                  files.push(entry);
                }
              } // return current folder, subfolders and files

            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }

            return _context.abrupt("return", {
              folder: folder,
              folders: folders,
              files: files
            });

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _ref.apply(this, arguments);
}

/***/ }),

/***/ "./src/views/Albums.vue":
/*!******************************!*\
  !*** ./src/views/Albums.vue ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Albums_vue_vue_type_template_id_28345ec4___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Albums.vue?vue&type=template&id=28345ec4& */ "./src/views/Albums.vue?vue&type=template&id=28345ec4&");
/* harmony import */ var _Albums_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Albums.vue?vue&type=script&lang=js& */ "./src/views/Albums.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _Albums_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _Albums_vue_vue_type_template_id_28345ec4___WEBPACK_IMPORTED_MODULE_0__["render"],
  _Albums_vue_vue_type_template_id_28345ec4___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/views/Albums.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/views/Albums.vue?vue&type=script&lang=js&":
/*!*******************************************************!*\
  !*** ./src/views/Albums.vue?vue&type=script&lang=js& ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Albums_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib!../../node_modules/vue-loader/lib??vue-loader-options!./Albums.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js?!./src/views/Albums.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Albums_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/views/Albums.vue?vue&type=template&id=28345ec4&":
/*!*************************************************************!*\
  !*** ./src/views/Albums.vue?vue&type=template&id=28345ec4& ***!
  \*************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Albums_vue_vue_type_template_id_28345ec4___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib??vue-loader-options!./Albums.vue?vue&type=template&id=28345ec4& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/views/Albums.vue?vue&type=template&id=28345ec4&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Albums_vue_vue_type_template_id_28345ec4___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Albums_vue_vue_type_template_id_28345ec4___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=photos-7.js.map?v=9207e8f25dfdcd66d4be