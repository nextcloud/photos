(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[3],{

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js?!./src/components/Tag.vue?vue&type=script&lang=js&":
/*!*******************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Tag.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _services_TaggedImages__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/TaggedImages */ "./src/services/TaggedImages.js");
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
//




/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'Tag',
  components: {
    FolderTagPreview: _FolderTagPreview__WEBPACK_IMPORTED_MODULE_3__["default"]
  },
  inheritAttrs: false,
  props: {
    displayName: {
      type: String,
      required: true
    },
    id: {
      type: Number,
      required: true
    }
  },
  data: function data() {
    return {
      cancelRequest: null
    };
  },
  computed: _objectSpread(_objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapGetters"])(['files', 'tags'])), {}, {
    // files list of the current folder
    folderContent: function folderContent() {
      return this.tags[this.id].files;
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
  beforeDestroy: function beforeDestroy() {
    // cancel any pending requests
    if (this.cancelRequest) {
      this.cancelRequest('Navigated away');
    }
  },
  created: function created() {
    var _this2 = this;

    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var _cancelableRequest, request, cancel, files;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              // init cancellable request
              _cancelableRequest = Object(_utils_CancelableRequest__WEBPACK_IMPORTED_MODULE_2__["default"])(_services_TaggedImages__WEBPACK_IMPORTED_MODULE_1__["default"]), request = _cancelableRequest.request, cancel = _cancelableRequest.cancel;
              _this2.cancelRequest = cancel;
              _context.prev = 2;
              _context.next = 5;
              return request(_this2.id);

            case 5:
              files = _context.sent;

              _this2.$store.dispatch('updateTag', {
                id: _this2.id,
                files: files
              });

              _this2.$store.dispatch('appendFiles', files);

              _context.next = 13;
              break;

            case 10:
              _context.prev = 10;
              _context.t0 = _context["catch"](2);

              if (_context.t0.response && _context.t0.response.status) {
                console.error('Failed to get folder content', _this2.id, _context.t0.response);
              }

            case 13:
              _context.prev = 13;
              _this2.cancelRequest = null;
              return _context.finish(13);

            case 16:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[2, 10, 13, 16]]);
    }))();
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js?!./src/views/Tags.vue?vue&type=script&lang=js&":
/*!***************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/views/Tags.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _services_SystemTags__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/SystemTags */ "./src/services/SystemTags.js");
/* harmony import */ var _services_TaggedImages__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/TaggedImages */ "./src/services/TaggedImages.js");
/* harmony import */ var _components_EmptyContent__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/EmptyContent */ "./src/components/EmptyContent.vue");
/* harmony import */ var _components_Tag__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/Tag */ "./src/components/Tag.vue");
/* harmony import */ var _components_File__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../components/File */ "./src/components/File.vue");
/* harmony import */ var _components_Grid__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../components/Grid */ "./src/components/Grid.vue");
/* harmony import */ var _components_Navigation__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../components/Navigation */ "./src/components/Navigation.vue");
/* harmony import */ var _utils_CancelableRequest__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../utils/CancelableRequest */ "./src/utils/CancelableRequest.js");
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
//
//
//









/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'Tags',
  components: {
    EmptyContent: _components_EmptyContent__WEBPACK_IMPORTED_MODULE_3__["default"],
    File: _components_File__WEBPACK_IMPORTED_MODULE_5__["default"],
    Tag: _components_Tag__WEBPACK_IMPORTED_MODULE_4__["default"],
    Grid: _components_Grid__WEBPACK_IMPORTED_MODULE_6__["default"],
    Navigation: _components_Navigation__WEBPACK_IMPORTED_MODULE_7__["default"]
  },
  props: {
    rootTitle: {
      type: String,
      required: true
    },
    path: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      required: true
    },
    isRoot: {
      type: Boolean,
      default: true
    }
  },
  data: function data() {
    return {
      error: null,
      cancelRequest: null
    };
  },
  computed: _objectSpread(_objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapGetters"])(['files', 'tags', 'tagsNames'])), {}, {
    // current tag id from current path
    tagId: function tagId() {
      return this.$store.getters.tagId(this.path);
    },
    // current tag
    tag: function tag() {
      return this.tags[this.tagId];
    },
    // files list of the current tag
    fileList: function fileList() {
      var _this = this;

      return this.tag && this.tag.files.map(function (id) {
        return _this.files[id];
      }).filter(function (file) {
        return !!file;
      });
    },
    isEmpty: function isEmpty() {
      if (this.isRoot) {
        return Object.keys(this.tagsNames).length === 0;
      }

      return this.fileList.length === 0;
    }
  }),
  watch: {
    path: function path() {
      var _this2 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (_this2.tagId) {
                  _context.next = 3;
                  break;
                }

                _context.next = 3;
                return _this2.fetchRootContent();

              case 3:
                // if we're not in the root, we fetch the data
                if (!_this2.isRoot) {
                  _this2.fetchContent();
                }

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))();
    }
  },
  beforeDestroy: function beforeDestroy() {
    // cancel any pending requests
    if (this.cancelRequest) {
      this.cancelRequest('Navigated away');
    }
  },
  beforeMount: function beforeMount() {
    var _this3 = this;

    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (_this3.tagId) {
                _context2.next = 3;
                break;
              }

              _context2.next = 3;
              return _this3.fetchRootContent();

            case 3:
              // if we're not in the root, we fetch the data
              if (!_this3.isRoot) {
                _this3.fetchContent();
              }

            case 4:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }))();
  },
  methods: {
    fetchRootContent: function fetchRootContent() {
      var _this4 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var _cancelableRequest, request, cancel, tags;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                // cancel any pending requests
                if (_this4.cancelRequest) {
                  _this4.cancelRequest('Changed folder');
                } // close any potential opened viewer


                OCA.Viewer.close(); // if we don't already have some cached data let's show a loader

                if (!_this4.tags[_this4.tagId]) {
                  _this4.$emit('update:loading', true);
                }

                _this4.error = null; // init cancellable request

                _cancelableRequest = Object(_utils_CancelableRequest__WEBPACK_IMPORTED_MODULE_8__["default"])(_services_SystemTags__WEBPACK_IMPORTED_MODULE_1__["default"]), request = _cancelableRequest.request, cancel = _cancelableRequest.cancel;
                _this4.cancelRequest = cancel;
                _context3.prev = 6;
                _context3.next = 9;
                return request();

              case 9:
                tags = _context3.sent;

                _this4.$store.dispatch('updateTags', tags);

                _context3.next = 17;
                break;

              case 13:
                _context3.prev = 13;
                _context3.t0 = _context3["catch"](6);
                console.error(_context3.t0);
                _this4.error = true;

              case 17:
                _context3.prev = 17;

                // done loading
                _this4.$emit('update:loading', false);

                _this4.cancelRequest = null;
                return _context3.finish(17);

              case 21:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[6, 13, 17, 21]]);
      }))();
    },
    fetchContent: function fetchContent() {
      var _this5 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var _cancelableRequest2, request, cancel, files;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                // cancel any pending requests
                if (_this5.cancelRequest) {
                  _this5.cancelRequest();
                } // close any potential opened viewer


                OCA.Viewer.close(); // if we don't already have some cached data let's show a loader

                if (!_this5.tags[_this5.tagId]) {
                  _this5.$emit('update:loading', true);
                }

                _this5.error = null; // init cancellable request

                _cancelableRequest2 = Object(_utils_CancelableRequest__WEBPACK_IMPORTED_MODULE_8__["default"])(_services_TaggedImages__WEBPACK_IMPORTED_MODULE_2__["default"]), request = _cancelableRequest2.request, cancel = _cancelableRequest2.cancel;
                _this5.cancelRequest = cancel;
                _context4.prev = 6;
                _context4.next = 9;
                return request(_this5.tagId);

              case 9:
                files = _context4.sent;

                _this5.$store.dispatch('updateTag', {
                  id: _this5.tagId,
                  files: files
                });

                _this5.$store.dispatch('appendFiles', files);

                _context4.next = 18;
                break;

              case 14:
                _context4.prev = 14;
                _context4.t0 = _context4["catch"](6);
                console.error(_context4.t0);
                _this5.error = true;

              case 18:
                _context4.prev = 18;

                // done loading
                _this5.$emit('update:loading', false);

                _this5.cancelRequest = null;
                return _context4.finish(18);

              case 22:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[6, 14, 18, 22]]);
      }))();
    }
  }
});

/***/ }),

/***/ "./node_modules/url-parse/index.js":
/*!*****************************************!*\
  !*** ./node_modules/url-parse/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: ENOENT: no such file or directory, open '/home/admin/Docker/apps2/photos/node_modules/url-parse/index.js'");

/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/components/Tag.vue?vue&type=template&id=bb7ceecc&":
/*!*********************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Tag.vue?vue&type=template&id=bb7ceecc& ***!
  \*********************************************************************************************************************************************************************************************/
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
      id: _vm.id,
      icon: "icon-tag",
      name: _vm.displayName,
      path: _vm.displayName,
      "file-list": _vm.fileList
    }
  })
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/views/Tags.vue?vue&type=template&id=730c32d3&":
/*!*****************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/views/Tags.vue?vue&type=template&id=730c32d3& ***!
  \*****************************************************************************************************************************************************************************************/
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
  return _vm.error
    ? _c("EmptyContent", [
        _vm._v("\n\t" + _vm._s(_vm.t("photos", "An error occurred")) + "\n")
      ])
    : !_vm.loading
    ? _c(
        "Grid",
        [
          _c("Navigation", {
            key: "navigation",
            attrs: {
              basename: _vm.path,
              filename: "/" + _vm.path,
              "root-title": _vm.rootTitle
            }
          }),
          _vm._v(" "),
          _vm.isRoot
            ? _vm._l(_vm.tagsNames, function(id) {
                return _c(
                  "Tag",
                  _vm._b(
                    {
                      key: id,
                      attrs: { fileid: id, basename: _vm.tags[id].displayName }
                    },
                    "Tag",
                    _vm.tags[id],
                    false
                  )
                )
              })
            : [
                _vm.isEmpty
                  ? _c(
                      "EmptyContent",
                      {
                        key: "emptycontent",
                        attrs: { "illustration-name": "empty" },
                        scopedSlots: _vm._u(
                          [
                            {
                              key: "desc",
                              fn: function() {
                                return [
                                  _vm._v(
                                    "\n\t\t\t\t" +
                                      _vm._s(
                                        _vm.t(
                                          "photos",
                                          "Photos with tags will show up here"
                                        )
                                      ) +
                                      "\n\t\t\t"
                                  )
                                ]
                              },
                              proxy: true
                            }
                          ],
                          null,
                          false,
                          3269923249
                        )
                      },
                      [
                        _vm._v(
                          "\n\t\t\t" +
                            _vm._s(_vm.t("photos", "No tags yet")) +
                            "\n\t\t\t"
                        )
                      ]
                    )
                  : _vm._e(),
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
    : _vm._e()
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/webdav/dist/node/index.js":
/*!************************************************!*\
  !*** ./node_modules/webdav/dist/node/index.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

throw new Error("Module build failed (from ./node_modules/babel-loader/lib/index.js):\nError: ENOENT: no such file or directory, open '/home/admin/Docker/apps2/photos/node_modules/webdav/dist/node/index.js'");

/***/ }),

/***/ "./src/components/Tag.vue":
/*!********************************!*\
  !*** ./src/components/Tag.vue ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Tag_vue_vue_type_template_id_bb7ceecc___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Tag.vue?vue&type=template&id=bb7ceecc& */ "./src/components/Tag.vue?vue&type=template&id=bb7ceecc&");
/* harmony import */ var _Tag_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Tag.vue?vue&type=script&lang=js& */ "./src/components/Tag.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _Tag_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _Tag_vue_vue_type_template_id_bb7ceecc___WEBPACK_IMPORTED_MODULE_0__["render"],
  _Tag_vue_vue_type_template_id_bb7ceecc___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/components/Tag.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/components/Tag.vue?vue&type=script&lang=js&":
/*!*********************************************************!*\
  !*** ./src/components/Tag.vue?vue&type=script&lang=js& ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Tag_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib!../../node_modules/vue-loader/lib??vue-loader-options!./Tag.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js?!./src/components/Tag.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Tag_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/components/Tag.vue?vue&type=template&id=bb7ceecc&":
/*!***************************************************************!*\
  !*** ./src/components/Tag.vue?vue&type=template&id=bb7ceecc& ***!
  \***************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Tag_vue_vue_type_template_id_bb7ceecc___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib??vue-loader-options!./Tag.vue?vue&type=template&id=bb7ceecc& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/components/Tag.vue?vue&type=template&id=bb7ceecc&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Tag_vue_vue_type_template_id_bb7ceecc___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Tag_vue_vue_type_template_id_bb7ceecc___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/services/DavClient.js":
/*!***********************************!*\
  !*** ./src/services/DavClient.js ***!
  \***********************************/
/*! exports provided: remotePath, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "remotePath", function() { return remotePath; });
/* harmony import */ var webdav__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! webdav */ "./node_modules/webdav/dist/node/index.js");
/* harmony import */ var webdav__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(webdav__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _nextcloud_axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/axios */ "./node_modules/@nextcloud/axios/dist/index.js");
/* harmony import */ var _nextcloud_axios__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_axios__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var url_parse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! url-parse */ "./node_modules/url-parse/index.js");
/* harmony import */ var url_parse__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(url_parse__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @nextcloud/router */ "./node_modules/@nextcloud/router/dist/index.js");
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_router__WEBPACK_IMPORTED_MODULE_3__);
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



 // force our axios

var patcher = webdav__WEBPACK_IMPORTED_MODULE_0___default.a.getPatcher();
patcher.patch('request', _nextcloud_axios__WEBPACK_IMPORTED_MODULE_1___default.a); // init webdav client on default dav endpoint

var remote = Object(_nextcloud_router__WEBPACK_IMPORTED_MODULE_3__["generateRemoteUrl"])('dav');
var client = webdav__WEBPACK_IMPORTED_MODULE_0___default.a.createClient(remote);
var remotePath = url_parse__WEBPACK_IMPORTED_MODULE_2___default()(remote).pathname;
/* harmony default export */ __webpack_exports__["default"] = (client);

/***/ }),

/***/ "./src/services/DavRequest.js":
/*!************************************!*\
  !*** ./src/services/DavRequest.js ***!
  \************************************/
/*! exports provided: props, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "props", function() { return props; });
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
var props = "\n\t<oc:fileid />\n\t<d:getlastmodified />\n\t<d:getetag />\n\t<d:getcontenttype />\n\t<d:getcontentlength />\n\t<nc:has-preview />\n\t<oc:favorite />\n\t<d:resourcetype />";

/* harmony default export */ __webpack_exports__["default"] = ("<?xml version=\"1.0\"?>\n\t\t\t<d:propfind xmlns:d=\"DAV:\"\n\t\t\t\txmlns:oc=\"http://owncloud.org/ns\"\n\t\t\t\txmlns:nc=\"http://nextcloud.org/ns\"\n\t\t\t\txmlns:ocs=\"http://open-collaboration-services.org/ns\">\n\t\t\t\t<d:prop>\n\t\t\t\t\t".concat(props, "\n\t\t\t\t</d:prop>\n\t\t\t</d:propfind>"));

/***/ }),

/***/ "./src/services/SystemTags.js":
/*!************************************!*\
  !*** ./src/services/SystemTags.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _DavClient__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DavClient */ "./src/services/DavClient.js");
/* harmony import */ var _utils_fileUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/fileUtils */ "./src/utils/fileUtils.js");
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
 * List system tags
 *
 * @param {String} path the path relative to the user root
 * @param {Object} [options] optional options for axios
 * @returns {Array} the file list
 */

/* harmony default export */ __webpack_exports__["default"] = (function (_x) {
  return _ref.apply(this, arguments);
});

function _ref() {
  _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(path) {
    var options,
        response,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
            _context.next = 3;
            return _DavClient__WEBPACK_IMPORTED_MODULE_0__["default"].getDirectoryContents('/systemtags/', Object.assign({}, {
              data: "<?xml version=\"1.0\"?>\n\t\t\t<d:propfind  xmlns:d=\"DAV:\"\n\t\t\t\txmlns:oc=\"http://owncloud.org/ns\">\n\t\t\t\t<d:prop>\n\t\t\t\t\t<oc:id />\n\t\t\t\t\t<oc:display-name />\n\t\t\t\t\t<oc:user-visible />\n\t\t\t\t\t<oc:user-assignable />\n\t\t\t\t\t<oc:can-assign />\n\t\t\t\t</d:prop>\n\t\t\t</d:propfind>",
              details: true
            }, options));

          case 3:
            response = _context.sent;
            return _context.abrupt("return", response.data.map(function (data) {
              return Object(_utils_fileUtils__WEBPACK_IMPORTED_MODULE_1__["genFileInfo"])(data);
            }));

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _ref.apply(this, arguments);
}

/***/ }),

/***/ "./src/services/TaggedImages.js":
/*!**************************************!*\
  !*** ./src/services/TaggedImages.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_fileUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/fileUtils */ "./src/utils/fileUtils.js");
/* harmony import */ var _nextcloud_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/auth */ "./node_modules/@nextcloud/auth/dist/index.js");
/* harmony import */ var _nextcloud_auth__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_auth__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _DavRequest__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DavRequest */ "./src/services/DavRequest.js");
/* harmony import */ var _AllowedMimes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./AllowedMimes */ "./src/services/AllowedMimes.js");
/* harmony import */ var _DavClient__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./DavClient */ "./src/services/DavClient.js");
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
 * Get tagged files based on provided tag id
 *
 * @param {number} id the tag id to filter
 * @param {Object} [options] optional options for axios
 * @returns {Array} the file list
 */

/* harmony default export */ __webpack_exports__["default"] = (function (_x) {
  return _ref.apply(this, arguments);
});

function _ref() {
  _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(id) {
    var options,
        prefixPath,
        response,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
            options = Object.assign({
              method: 'REPORT',
              data: "<?xml version=\"1.0\"?>\n\t\t\t<oc:filter-files\n\t\t\t\txmlns:d=\"DAV:\"\n\t\t\t\txmlns:oc=\"http://owncloud.org/ns\"\n\t\t\t\txmlns:nc=\"http://nextcloud.org/ns\"\n\t\t\t\txmlns:ocs=\"http://open-collaboration-services.org/ns\">\n\t\t\t\t<d:prop>\n\t\t\t\t\t".concat(_DavRequest__WEBPACK_IMPORTED_MODULE_2__["props"], "\n\t\t\t\t</d:prop>\n\t\t\t\t<oc:filter-rules>\n\t\t\t\t\t<oc:systemtag>").concat(id, "</oc:systemtag>\n\t\t\t\t</oc:filter-rules>\n\t\t\t</oc:filter-files>"),
              details: true
            }, options);
            prefixPath = "/files/".concat(Object(_nextcloud_auth__WEBPACK_IMPORTED_MODULE_1__["getCurrentUser"])().uid);
            _context.next = 5;
            return _DavClient__WEBPACK_IMPORTED_MODULE_4__["default"].getDirectoryContents(prefixPath, options);

          case 5:
            response = _context.sent;
            return _context.abrupt("return", response.data.map(function (data) {
              return Object(_utils_fileUtils__WEBPACK_IMPORTED_MODULE_0__["genFileInfo"])(data);
            }) // filter out unwanted mime because server REPORT service only support
            // hardcoded props and mime is not one of them
            // https://github.com/nextcloud/server/blob/5bf3d1bb384da56adbf205752be8f840aac3b0c5/apps/dav/lib/Connector/Sabre/FilesReportPlugin.php#L274
            .filter(function (file) {
              return file.mime && _AllowedMimes__WEBPACK_IMPORTED_MODULE_3__["default"].indexOf(file.mime) !== -1;
            }) // remove prefix path from full file path
            .map(function (data) {
              return Object.assign({}, data, {
                filename: data.filename.replace(prefixPath, '')
              });
            }));

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _ref.apply(this, arguments);
}

/***/ }),

/***/ "./src/views/Tags.vue":
/*!****************************!*\
  !*** ./src/views/Tags.vue ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Tags_vue_vue_type_template_id_730c32d3___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Tags.vue?vue&type=template&id=730c32d3& */ "./src/views/Tags.vue?vue&type=template&id=730c32d3&");
/* harmony import */ var _Tags_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Tags.vue?vue&type=script&lang=js& */ "./src/views/Tags.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _Tags_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _Tags_vue_vue_type_template_id_730c32d3___WEBPACK_IMPORTED_MODULE_0__["render"],
  _Tags_vue_vue_type_template_id_730c32d3___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/views/Tags.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/views/Tags.vue?vue&type=script&lang=js&":
/*!*****************************************************!*\
  !*** ./src/views/Tags.vue?vue&type=script&lang=js& ***!
  \*****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Tags_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib!../../node_modules/vue-loader/lib??vue-loader-options!./Tags.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js?!./src/views/Tags.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Tags_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/views/Tags.vue?vue&type=template&id=730c32d3&":
/*!***********************************************************!*\
  !*** ./src/views/Tags.vue?vue&type=template&id=730c32d3& ***!
  \***********************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Tags_vue_vue_type_template_id_730c32d3___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib??vue-loader-options!./Tags.vue?vue&type=template&id=730c32d3& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/views/Tags.vue?vue&type=template&id=730c32d3&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Tags_vue_vue_type_template_id_730c32d3___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Tags_vue_vue_type_template_id_730c32d3___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=photos-3.js.map?v=b18c2da98bc2f229b251