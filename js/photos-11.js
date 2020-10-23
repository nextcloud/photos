(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[11],{

/***/ "./node_modules/@essentials/raf/dist/module/index.js":
/*!***********************************************************!*\
  !*** ./node_modules/@essentials/raf/dist/module/index.js ***!
  \***********************************************************/
/*! exports provided: raf, caf, now */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "raf", function() { return raf; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "caf", function() { return caf; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "now", function() { return now; });
let u = 'undefined',
    win = typeof window !== u ? window : {},
    p = typeof performance !== u ? performance : Date,
    now = () => p.now(),
    af = 'AnimationFrame',
    Caf = 'cancel' + af,
    Raf = 'request' + af,
    raf = win[Raf] && /*#__PURE__*/win[Raf].bind(win),
    caf = win[Caf] && /*#__PURE__*/win[Caf].bind(win);

function _ref(h) {
  return clearTimeout(h);
}

if (!raf || !caf) {
  let lastTime = 0;

  raf = callback => {
    let curr = now(),
        next = Math.max(lastTime + 1000 / 60, curr);
    return setTimeout(() => {
      callback(lastTime = next);
    }, next - curr);
  };

  caf = _ref;
}



/***/ }),

/***/ "./node_modules/@essentials/request-timeout/dist/module/index.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@essentials/request-timeout/dist/module/index.js ***!
  \***********************************************************************/
/*! exports provided: clearRequestTimeout, requestTimeout, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "clearRequestTimeout", function() { return clearRequestTimeout; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "requestTimeout", function() { return requestTimeout; });
/* harmony import */ var _essentials_raf__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @essentials/raf */ "./node_modules/@essentials/raf/dist/module/index.js");
/**
 * Copyright 2011, Joe Lambert.
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 **/

var clearRequestTimeout = function clearRequestTimeout(handle) {
  Object(_essentials_raf__WEBPACK_IMPORTED_MODULE_0__["caf"])(handle.v || -1);
};
var requestTimeout = function requestTimeout(fn, ms) {
  var start = Object(_essentials_raf__WEBPACK_IMPORTED_MODULE_0__["now"])(),
      handle = {};

  var loop = function loop() {
    Object(_essentials_raf__WEBPACK_IMPORTED_MODULE_0__["now"])() - start >= ms ? fn.call(null) : handle.v = Object(_essentials_raf__WEBPACK_IMPORTED_MODULE_0__["raf"])(loop);
  };

  handle.v = Object(_essentials_raf__WEBPACK_IMPORTED_MODULE_0__["raf"])(loop);
  return handle;
};
/* harmony default export */ __webpack_exports__["default"] = (requestTimeout);

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js?!./src/components/VirtualGrid.vue?vue&type=script&lang=js&":
/*!***************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/VirtualGrid.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************************************************************************/
/*! exports provided: DEFAULT_SCROLLING_RESET_TIME_INTERVAL, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DEFAULT_SCROLLING_RESET_TIME_INTERVAL", function() { return DEFAULT_SCROLLING_RESET_TIME_INTERVAL; });
/* harmony import */ var _essentials_request_timeout__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @essentials/request-timeout */ "./node_modules/@essentials/request-timeout/dist/module/index.js");
/* harmony import */ var _Grid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Grid */ "./src/components/Grid.vue");
/* harmony import */ var _mixins_GridConfig__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../mixins/GridConfig */ "./src/mixins/GridConfig.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/**
 * Specifies the number of miliseconds during which to disable pointer events while a scroll is in progress.
 * This improves performance and makes scrolling smoother.
 */

var DEFAULT_SCROLLING_RESET_TIME_INTERVAL = 150;
/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'VirtualGrid',
  components: {
    Grid: _Grid__WEBPACK_IMPORTED_MODULE_1__["default"]
  },
  mixins: [_mixins_GridConfig__WEBPACK_IMPORTED_MODULE_2__["default"]],
  props: {
    list: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    props: {
      type: Function,
      default: function _default() {
        return {};
      }
    },
    component: {
      type: Function,
      required: true
    },
    loadingPage: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      shownFirstRow: 0,
      shownLastRow: this.getRowNumber(this.list.length - 1)
    };
  },
  computed: {
    shownList: function shownList() {
      var _this = this;

      return this.list.filter(function (item, index) {
        return _this.isVisible(index);
      });
    },

    /**
     * Calculate the top filler needed padding
     * to compensate for the hidden items
     * @returns {string}
     */
    topPadding: function topPadding() {
      return "".concat(this.shownFirstRow * 100, "%");
    },

    /**
     * Calculate the bottom filler needed padding
     * to compensate for the hidden items
     * Because bottomShift indicate the index of the last visible item,
     * we need to calcuta ehow any rows there is to compensate
     * between bottomShift and the end of the list
     * @returns {string}
     */
    bottomPadding: function bottomPadding() {
      return "".concat((this.lastRow - this.shownLastRow) * 100, "%");
    },
    lastRow: function lastRow() {
      return this.getRowNumber(this.list.length - 1);
    }
  },
  created: function created() {
    window.addEventListener('resize', this.onDocumentScroll);
    window.addEventListener('scroll', this.onDocumentScroll);
  },
  mounted: function mounted() {
    this.onDocumentScroll();
  },
  beforeDestroy: function beforeDestroy() {
    window.removeEventListener('resize', this.onDocumentScroll);
    window.removeEventListener('scroll', this.onDocumentScroll);
  },
  methods: {
    /**
     * Request an animation frame and debounce the onScroll method
     */
    debounceOnDocumentScroll: function debounceOnDocumentScroll() {
      if (this.debounceOnDocumentScrollRequest) {
        Object(_essentials_request_timeout__WEBPACK_IMPORTED_MODULE_0__["clearRequestTimeout"])(this.debounceOnDocumentScrollRequest);
      }

      this.debounceOnDocumentScrollRequest = Object(_essentials_request_timeout__WEBPACK_IMPORTED_MODULE_0__["requestTimeout"])(this.onDocumentScroll, DEFAULT_SCROLLING_RESET_TIME_INTERVAL //
      );
    },

    /**
     * Handle document scroll
     * Detect first visible/hidden to implement virtual scrolling
     */
    onDocumentScroll: function onDocumentScroll() {
      // get the row height
      var gridContainer = this.$refs.grid.$el;
      var gridStyles = getComputedStyle(gridContainer);
      var rowHeight = parseFloat(gridStyles.gridTemplateColumns.split(' ')[0], 10); // scrolled content
      // rounding up to tens to make sure we only detect changes by steps of 10px

      var scrolled = this.roundToTen(window.pageYOffset - this.gridConfig.marginTop); // adding one above and one under to have a trigger area of one row

      var shownFirstRow = Math.floor(scrolled / (rowHeight + this.gridConfig.gap)) - 1;
      var shownLastRow = Math.ceil(window.innerHeight / rowHeight) + shownFirstRow + 1;
      this.shownFirstRow = Math.max(shownFirstRow, 0); // the first shown row cannot be negative

      this.shownLastRow = Math.min(shownLastRow, this.lastRow); // the last shown row cannot be lower than the last row

      if (this.shownLastRow >= this.lastRow) {
        this.$emit('bottomReached');
      }
    },
    isVisible: function isVisible(index) {
      var row = this.getRowNumber(index);
      return row >= this.shownFirstRow && row < this.shownLastRow + 1;
    },

    /**
     * Return the row number of the provided index
     *
     * @param {number} index the index
     * @returns {number}
     */
    getRowNumber: function getRowNumber(index) {
      // in case the grid config is not here yet, let's
      var count = this.gridConfig ? this.gridConfig.count : this.list.length;
      return Math.floor(index / count);
    },

    /**
     * Round the provided number to a tens of its value
     *
     * @param {number} number the number to round
     * @returns {number}
     */
    roundToTen: function roundToTen(number) {
      return Math.floor(number / 10) * 10;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js?!./src/views/Timeline.vue?vue&type=script&lang=js&":
/*!*******************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/views/Timeline.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var debounce__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! debounce */ "./node_modules/debounce/index.js");
/* harmony import */ var debounce__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(debounce__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _services_PhotoSearch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/PhotoSearch */ "./src/services/PhotoSearch.js");
/* harmony import */ var _components_EmptyContent__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/EmptyContent */ "./src/components/EmptyContent.vue");
/* harmony import */ var _components_File__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/File */ "./src/components/File.vue");
/* harmony import */ var _components_VirtualGrid__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../components/VirtualGrid */ "./src/components/VirtualGrid.vue");
/* harmony import */ var _components_Navigation__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../components/Navigation */ "./src/components/Navigation.vue");
/* harmony import */ var _utils_CancelableRequest__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/CancelableRequest */ "./src/utils/CancelableRequest.js");
/* harmony import */ var _mixins_GridConfig__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../mixins/GridConfig */ "./src/mixins/GridConfig.js");
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









/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'Timeline',
  components: {
    EmptyContent: _components_EmptyContent__WEBPACK_IMPORTED_MODULE_3__["default"],
    VirtualGrid: _components_VirtualGrid__WEBPACK_IMPORTED_MODULE_5__["default"],
    Navigation: _components_Navigation__WEBPACK_IMPORTED_MODULE_6__["default"]
  },
  mixins: [_mixins_GridConfig__WEBPACK_IMPORTED_MODULE_8__["default"]],
  props: {
    loading: {
      type: Boolean,
      required: true
    },
    onlyFavorites: {
      type: Boolean,
      default: false
    },
    rootTitle: {
      type: String,
      required: true
    },
    path: {
      type: String,
      default: ''
    }
  },
  data: function data() {
    return {
      cancelRequest: null,
      done: false,
      error: null,
      loadingPage: false,
      page: 0
    };
  },
  computed: _objectSpread(_objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapGetters"])(['files', 'timeline'])), {}, {
    fileList: function fileList() {
      var _this = this;

      return this.timeline.map(function (id) {
        return _this.files[id];
      }).filter(function (file) {
        return !!file;
      });
    },
    // is current folder empty?
    isEmpty: function isEmpty() {
      return this.fileList.length === 0;
    }
  }),
  watch: {
    onlyFavorites: function onlyFavorites() {
      var _this2 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                // reset component
                _this2.resetState(); // content is completely different


                _this2.$emit('update:loading', true);

                _this2.fetchContent();

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))();
    }
  },
  beforeMount: function beforeMount() {
    var _this3 = this;

    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _this3.resetState();

              _this3.fetchContent();

            case 2:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }))();
  },
  beforeDestroy: function beforeDestroy() {
    // cancel any pending requests
    if (this.cancelRequest) {
      this.cancelRequest('Changed view');
    }
  },
  methods: {
    fetchContent: function fetchContent() {
      var _this4 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var _cancelableRequest, request, cancel, files;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!_this4.loadingPage) {
                  _context3.next = 2;
                  break;
                }

                return _context3.abrupt("return");

              case 2:
                // cancel any pending requests
                if (_this4.cancelRequest) {
                  _this4.cancelRequest('Changed view');
                } // if we don't already have some cached data let's show a loader


                if (_this4.timeline.length === 0) {
                  _this4.$emit('update:loading', true);
                }

                _this4.error = null;
                _this4.loadingPage = true; // init cancellable request

                _cancelableRequest = Object(_utils_CancelableRequest__WEBPACK_IMPORTED_MODULE_7__["default"])(_services_PhotoSearch__WEBPACK_IMPORTED_MODULE_2__["default"]), request = _cancelableRequest.request, cancel = _cancelableRequest.cancel;
                _this4.cancelRequest = cancel;
                _context3.prev = 8;
                _context3.next = 11;
                return request(_this4.onlyFavorites, {
                  page: _this4.page,
                  perPage: _this4.gridConfig.count * 5 // we load 5 rows,

                });

              case 11:
                files = _context3.sent;

                _this4.$store.dispatch('updateTimeline', files);

                _this4.$store.dispatch('appendFiles', files); // next time we load this script, we load the next page if the list returned


                if (files.length === _this4.gridConfig.count * 5) {
                  _this4.page++;
                } else {
                  console.debug('We loaded the last page');
                  _this4.done = true;
                } // return for the viewer loadMore method


                return _context3.abrupt("return", files);

              case 18:
                _context3.prev = 18;
                _context3.t0 = _context3["catch"](8);

                if (_context3.t0.response && _context3.t0.response.status) {
                  if (_context3.t0.response.status === 404) {
                    _this4.error = 404;
                    setTimeout(function () {
                      _this4.$router.push({
                        name: _this4.$route.name
                      });
                    }, 3000);
                  } else {
                    _this4.error = _context3.t0;
                  }
                } // cancelled request, moving on...


                console.error('Error fetching timeline', _context3.t0);

              case 22:
                _context3.prev = 22;

                // done loading even with errors
                _this4.$emit('update:loading', false);

                _this4.loadingPage = false;
                _this4.cancelRequest = null;
                return _context3.finish(22);

              case 27:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[8, 18, 22, 27]]);
      }))();
    },

    /**
     * Return the props based on the element
     * Here we want to bind the full fileinfo
     * object so we stupidly return it whole!
     *
     * @param {Object} item the scoped item from the VirtualGrid
     * @returns {Object}
     */
    getProps: function getProps(item) {
      return Object.assign({}, item, {
        loadMore: this.fetchContent
      });
    },

    /**
     * Return the component based on the element
     * We only have files in the Timeline,
     * so we return Files!
     *
     * @returns {Object}
     */
    getComponent: function getComponent() {
      return _components_File__WEBPACK_IMPORTED_MODULE_4__["default"];
    },
    debounceOnBottomReached: debounce__WEBPACK_IMPORTED_MODULE_1___default()(function () {
      this.onBottomReached();
    }, 1000),

    /**
     * When virtual grid reach the bottom,
     * we load the next page
     */
    onBottomReached: function onBottomReached() {
      // if we're currently loading or if a previous
      // request returned the last page, we stop
      if (this.loadingPage || this.done) {
        return;
      }

      console.debug('Loading next page', this.page);
      this.fetchContent();
    },

    /**
     * Reset this component data to a pristine state
     */
    resetState: function resetState() {
      this.$store.dispatch('resetTimeline');
      this.done = false;
      this.error = null;
      this.loadingPage = false;
      this.page = 0;
      this.page = 0;
    }
  }
});

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/components/VirtualGrid.vue?vue&type=style&index=0&id=178c031e&lang=scss&scoped=true&":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??ref--1-3!./node_modules/vue-loader/lib??vue-loader-options!./src/components/VirtualGrid.vue?vue&type=style&index=0&id=178c031e&lang=scss&scoped=true& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".grid-filler[data-v-178c031e] {\n  grid-column-end: -1;\n}\n.grid-loading[data-v-178c031e] {\n  grid-column: 1/-1;\n  height: 88px;\n}\n", ""]);
// Exports
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/debounce/index.js":
/*!****************************************!*\
  !*** ./node_modules/debounce/index.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: ENOENT: no such file or directory, open '/home/admin/Docker/apps2/photos/node_modules/debounce/index.js'");

/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/components/VirtualGrid.vue?vue&type=style&index=0&id=178c031e&lang=scss&scoped=true&":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??ref--1-3!./node_modules/vue-loader/lib??vue-loader-options!./src/components/VirtualGrid.vue?vue&type=style&index=0&id=178c031e&lang=scss&scoped=true& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(/*! ../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
            var content = __webpack_require__(/*! !../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??ref--1-3!../../node_modules/vue-loader/lib??vue-loader-options!./VirtualGrid.vue?vue&type=style&index=0&id=178c031e&lang=scss&scoped=true& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/components/VirtualGrid.vue?vue&type=style&index=0&id=178c031e&lang=scss&scoped=true&");

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



module.exports = content.locals || {};

/***/ }),

/***/ "./node_modules/url-parse/index.js":
/*!*****************************************!*\
  !*** ./node_modules/url-parse/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: ENOENT: no such file or directory, open '/home/admin/Docker/apps2/photos/node_modules/url-parse/index.js'");

/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/components/VirtualGrid.vue?vue&type=template&id=178c031e&scoped=true&":
/*!*****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/VirtualGrid.vue?vue&type=template&id=178c031e&scoped=true& ***!
  \*****************************************************************************************************************************************************************************************************************/
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
  return _c(
    "Grid",
    { ref: "grid" },
    [
      _c("span", {
        directives: [
          {
            name: "show",
            rawName: "v-show",
            value: _vm.shownFirstRow > 0,
            expression: "shownFirstRow > 0"
          }
        ],
        key: "filler-top",
        ref: "filler-top",
        staticClass: "grid-filler grid-filler--top",
        style: { paddingBottom: _vm.topPadding },
        attrs: { role: "none" }
      }),
      _vm._v(" "),
      _vm._l(_vm.shownList, function(item, index) {
        return _c(
          _vm.component(item),
          _vm._b(
            {
              key: item.fileid,
              ref: "item-" + index,
              refInFor: true,
              tag: "component",
              class: "row-" + _vm.getRowNumber(index),
              attrs: { list: _vm.list }
            },
            "component",
            _vm.props(item),
            false
          )
        )
      }),
      _vm._v(" "),
      _vm.loadingPage
        ? _c("div", {
            key: "grid-loading",
            staticClass: "grid-loading icon-loading",
            attrs: { role: "none" }
          })
        : _vm._e(),
      _vm._v(" "),
      _c("span", {
        directives: [
          {
            name: "show",
            rawName: "v-show",
            value: _vm.shownLastRow < _vm.lastRow,
            expression: "shownLastRow < lastRow"
          }
        ],
        key: "filler-bottom",
        ref: "filler-bottom",
        staticClass: "grid-filler grid-filler--bottom",
        style: { paddingBottom: _vm.bottomPadding },
        attrs: { role: "none" }
      })
    ],
    2
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/views/Timeline.vue?vue&type=template&id=e945440a&":
/*!*********************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/views/Timeline.vue?vue&type=template&id=e945440a& ***!
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
    : !_vm.loading && _vm.isEmpty
    ? _c("EmptyContent", { attrs: { "illustration-name": "empty" } }, [
        _vm._v("\n\t" + _vm._s(_vm.t("photos", "No photos in here")) + "\n")
      ])
    : !_vm.loading
    ? _c(
        "div",
        [
          _c("Navigation", {
            key: "navigation",
            attrs: {
              basename: _vm.path,
              filename: "/",
              "root-title": _vm.rootTitle
            }
          }),
          _vm._v(" "),
          _c("VirtualGrid", {
            attrs: {
              component: _vm.getComponent,
              list: _vm.fileList,
              "loading-page": _vm.loadingPage,
              props: _vm.getProps
            },
            on: { bottomReached: _vm.onBottomReached }
          })
        ],
        1
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

/***/ "./src/assets/grid-sizes.js":
/*!**********************************!*\
  !*** ./src/assets/grid-sizes.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * @copyright Copyright (c) 2018 John Molakvoæ <skjnldsv@protonmail.com>
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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
// for now we want to keep the same gap everywhere
var gap = 8;
/**
 * Define the max width proportions
 * The number (key) indicate the MAX size
 *
 * needs to be ompatible with webpack config
 * so no export default {}
 */

module.exports = {
  sizes: {
    400: {
      marginTop: 66,
      // same as grid-gap
      marginW: gap,
      // same as grid-gap
      count: 3,
      gap: gap
    },
    700: {
      marginTop: 66,
      marginW: 8,
      // same as grid-gap
      count: 4,
      gap: gap
    },
    1024: {
      marginTop: 66,
      marginW: 44,
      count: 5,
      gap: gap
    },
    1280: {
      marginTop: 66,
      marginW: 44,
      count: 4,
      gap: gap
    },
    1440: {
      marginTop: 88,
      marginW: 66,
      count: 5,
      gap: gap
    },
    1600: {
      marginTop: 88,
      marginW: 66,
      count: 6,
      gap: gap
    },
    2048: {
      marginTop: 88,
      marginW: 66,
      count: 7,
      gap: gap
    },
    2560: {
      marginTop: 88,
      marginW: 88,
      count: 8,
      gap: gap
    },
    3440: {
      marginTop: 88,
      marginW: 88,
      count: 9,
      gap: gap
    },
    max: {
      marginTop: 88,
      marginW: 88,
      count: 10,
      gap: gap
    }
  }
};

/***/ }),

/***/ "./src/components/VirtualGrid.vue":
/*!****************************************!*\
  !*** ./src/components/VirtualGrid.vue ***!
  \****************************************/
/*! exports provided: DEFAULT_SCROLLING_RESET_TIME_INTERVAL, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _VirtualGrid_vue_vue_type_template_id_178c031e_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./VirtualGrid.vue?vue&type=template&id=178c031e&scoped=true& */ "./src/components/VirtualGrid.vue?vue&type=template&id=178c031e&scoped=true&");
/* harmony import */ var _VirtualGrid_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./VirtualGrid.vue?vue&type=script&lang=js& */ "./src/components/VirtualGrid.vue?vue&type=script&lang=js&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DEFAULT_SCROLLING_RESET_TIME_INTERVAL", function() { return _VirtualGrid_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["DEFAULT_SCROLLING_RESET_TIME_INTERVAL"]; });

/* harmony import */ var _VirtualGrid_vue_vue_type_style_index_0_id_178c031e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./VirtualGrid.vue?vue&type=style&index=0&id=178c031e&lang=scss&scoped=true& */ "./src/components/VirtualGrid.vue?vue&type=style&index=0&id=178c031e&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _VirtualGrid_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _VirtualGrid_vue_vue_type_template_id_178c031e_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _VirtualGrid_vue_vue_type_template_id_178c031e_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "178c031e",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/components/VirtualGrid.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/components/VirtualGrid.vue?vue&type=script&lang=js&":
/*!*****************************************************************!*\
  !*** ./src/components/VirtualGrid.vue?vue&type=script&lang=js& ***!
  \*****************************************************************/
/*! exports provided: default, DEFAULT_SCROLLING_RESET_TIME_INTERVAL */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_VirtualGrid_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib!../../node_modules/vue-loader/lib??vue-loader-options!./VirtualGrid.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js?!./src/components/VirtualGrid.vue?vue&type=script&lang=js&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DEFAULT_SCROLLING_RESET_TIME_INTERVAL", function() { return _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_VirtualGrid_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["DEFAULT_SCROLLING_RESET_TIME_INTERVAL"]; });

 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_VirtualGrid_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/components/VirtualGrid.vue?vue&type=style&index=0&id=178c031e&lang=scss&scoped=true&":
/*!**************************************************************************************************!*\
  !*** ./src/components/VirtualGrid.vue?vue&type=style&index=0&id=178c031e&lang=scss&scoped=true& ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_ref_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_VirtualGrid_vue_vue_type_style_index_0_id_178c031e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/style-loader/dist/cjs.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??ref--1-3!../../node_modules/vue-loader/lib??vue-loader-options!./VirtualGrid.vue?vue&type=style&index=0&id=178c031e&lang=scss&scoped=true& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/components/VirtualGrid.vue?vue&type=style&index=0&id=178c031e&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_ref_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_VirtualGrid_vue_vue_type_style_index_0_id_178c031e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_ref_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_VirtualGrid_vue_vue_type_style_index_0_id_178c031e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_ref_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_VirtualGrid_vue_vue_type_style_index_0_id_178c031e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_ref_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_VirtualGrid_vue_vue_type_style_index_0_id_178c031e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_ref_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_VirtualGrid_vue_vue_type_style_index_0_id_178c031e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./src/components/VirtualGrid.vue?vue&type=template&id=178c031e&scoped=true&":
/*!***********************************************************************************!*\
  !*** ./src/components/VirtualGrid.vue?vue&type=template&id=178c031e&scoped=true& ***!
  \***********************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_VirtualGrid_vue_vue_type_template_id_178c031e_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib??vue-loader-options!./VirtualGrid.vue?vue&type=template&id=178c031e&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/components/VirtualGrid.vue?vue&type=template&id=178c031e&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_VirtualGrid_vue_vue_type_template_id_178c031e_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_VirtualGrid_vue_vue_type_template_id_178c031e_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/mixins/GridConfig.js":
/*!**********************************!*\
  !*** ./src/mixins/GridConfig.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _services_GridConfig__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/GridConfig */ "./src/services/GridConfig.js");
/**
 * @copyright Copyright (c) 2018 John Molakvoæ <skjnldsv@protonmail.com>
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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

/**
 * Get the current used grid config
 */

/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {
      gridConfig: {}
    };
  },
  created: function created() {
    var _this = this;

    _services_GridConfig__WEBPACK_IMPORTED_MODULE_0__["default"].$on('changed', function (val) {
      _this.gridConfig = val;
    });
    console.debug('Current grid config', _services_GridConfig__WEBPACK_IMPORTED_MODULE_0__["default"].gridConfig);
    this.gridConfig = _services_GridConfig__WEBPACK_IMPORTED_MODULE_0__["default"].gridConfig;
  },
  beforeDestroy: function beforeDestroy() {
    _services_GridConfig__WEBPACK_IMPORTED_MODULE_0__["default"].$off('changed', this.gridConfig);
  }
});

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

/***/ "./src/services/GridConfig.js":
/*!************************************!*\
  !*** ./src/services/GridConfig.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm.js");
/* harmony import */ var _assets_grid_sizes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../assets/grid-sizes */ "./src/assets/grid-sizes.js");
/* harmony import */ var _assets_grid_sizes__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_assets_grid_sizes__WEBPACK_IMPORTED_MODULE_1__);
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


/* harmony default export */ __webpack_exports__["default"] = (new vue__WEBPACK_IMPORTED_MODULE_0__["default"]({
  data: function data() {
    return {
      gridConfig: _assets_grid_sizes__WEBPACK_IMPORTED_MODULE_1__["sizes"].max
    };
  },
  watch: {
    gridConfig: function gridConfig(val) {
      this.$emit('changed', val);
    }
  },
  created: function created() {
    window.addEventListener('resize', this.handleWindowResize);
    this.handleWindowResize();
  },
  beforeDestroy: function beforeDestroy() {
    window.removeEventListener('resize', this.handleWindowResize);
  },
  methods: {
    handleWindowResize: function handleWindowResize() {
      // find the first grid size that fit the current window width
      var currentSize = Object.keys(_assets_grid_sizes__WEBPACK_IMPORTED_MODULE_1__["sizes"]).find(function (size) {
        return size > document.documentElement.clientWidth;
      });
      this.gridConfig = _assets_grid_sizes__WEBPACK_IMPORTED_MODULE_1__["sizes"][currentSize];
    }
  }
}));

/***/ }),

/***/ "./src/services/PhotoSearch.js":
/*!*************************************!*\
  !*** ./src/services/PhotoSearch.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_fileUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/fileUtils */ "./src/utils/fileUtils.js");
/* harmony import */ var _nextcloud_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/auth */ "./node_modules/@nextcloud/auth/dist/index.js");
/* harmony import */ var _nextcloud_auth__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_auth__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _AllowedMimes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AllowedMimes */ "./src/services/AllowedMimes.js");
/* harmony import */ var _DavClient__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./DavClient */ "./src/services/DavClient.js");
/* harmony import */ var _DavRequest__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./DavRequest */ "./src/services/DavRequest.js");
/* harmony import */ var _assets_grid_sizes__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../assets/grid-sizes */ "./src/assets/grid-sizes.js");
/* harmony import */ var _assets_grid_sizes__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_assets_grid_sizes__WEBPACK_IMPORTED_MODULE_5__);
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
 * @param {boolean} [onlyFavorites=false] not used
 * @param {Object} [options] used for the cancellable requests
 * @param {number} [options.page=0] which page to start (starts at 0)
 * @param {number} [options.perPage] how many to display per page default is 5 times the max number per line from the grid-sizes config file
 * @param {boolean} [options.full=false] get full data of the files
 * @returns {Array} the file list
 */

/* harmony default export */ __webpack_exports__["default"] = (function () {
  return _ref.apply(this, arguments);
});

function _ref() {
  _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var onlyFavorites,
        options,
        prefixPath,
        orMime,
        eqFavorites,
        response,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            onlyFavorites = _args.length > 0 && _args[0] !== undefined ? _args[0] : false;
            options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
            // default function options
            options = Object.assign({}, {
              page: 0,
              // start at the first page
              perPage: _assets_grid_sizes__WEBPACK_IMPORTED_MODULE_5__["sizes"].max.count * 10 // ten rows of the max width

            }, options);
            prefixPath = "/files/".concat(Object(_nextcloud_auth__WEBPACK_IMPORTED_MODULE_1__["getCurrentUser"])().uid); // generating the search or condition
            // based on the allowed mimetypes

            orMime = _AllowedMimes__WEBPACK_IMPORTED_MODULE_2__["default"].reduce(function (str, mime) {
              return "".concat(str, "\n\t\t<d:eq>\n\t\t\t<d:prop>\n\t\t\t\t<d:getcontenttype/>\n\t\t\t</d:prop>\n\t\t\t<d:literal>").concat(mime, "</d:literal>\n\t\t</d:eq>\n\t");
            }, '');
            eqFavorites = onlyFavorites ? "<d:eq>\n\t\t\t\t<d:prop>\n\t\t\t\t\t<oc:favorite/>\n\t\t\t\t</d:prop>\n\t\t\t\t<d:literal>1</d:literal>\n\t\t\t</d:eq>" : '';
            options = Object.assign({
              method: 'SEARCH',
              headers: {
                'content-Type': 'text/xml'
              },
              data: "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n\t\t\t<d:searchrequest xmlns:d=\"DAV:\"\n\t\t\t\txmlns:oc=\"http://owncloud.org/ns\"\n\t\t\t\txmlns:nc=\"http://nextcloud.org/ns\"\n\t\t\t\txmlns:ns=\"https://github.com/icewind1991/SearchDAV/ns\"\n\t\t\t\txmlns:ocs=\"http://open-collaboration-services.org/ns\">\n\t\t\t\t<d:basicsearch>\n\t\t\t\t\t<d:select>\n\t\t\t\t\t\t<d:prop>\n\t\t\t\t\t\t\t".concat(_DavRequest__WEBPACK_IMPORTED_MODULE_4__["props"], "\n\t\t\t\t\t\t</d:prop>\n\t\t\t\t\t</d:select>\n\t\t\t\t\t<d:from>\n\t\t\t\t\t\t<d:scope>\n\t\t\t\t\t\t\t<d:href>").concat(prefixPath, "</d:href>\n\t\t\t\t\t\t\t<d:depth>infinity</d:depth>\n\t\t\t\t\t\t</d:scope>\n\t\t\t\t\t</d:from>\n\t\t\t\t\t<d:where>\n\t\t\t\t\t\t<d:and>\n\t\t\t\t\t\t\t<d:or>\n\t\t\t\t\t\t\t\t").concat(orMime, "\n\t\t\t\t\t\t\t</d:or>\n\t\t\t\t\t\t\t").concat(eqFavorites, "\n\t\t\t\t\t\t\t<d:eq>\n\t\t\t\t\t\t\t\t<d:prop>\n\t\t\t\t\t\t\t\t\t<oc:owner-id/>\n\t\t\t\t\t\t\t\t</d:prop>\n\t\t\t\t\t\t\t\t<d:literal>").concat(Object(_nextcloud_auth__WEBPACK_IMPORTED_MODULE_1__["getCurrentUser"])().uid, "</d:literal>\n\t\t\t\t\t\t\t</d:eq>\n\t\t\t\t\t\t</d:and>\n\t\t\t\t\t</d:where>\n\t\t\t\t\t<d:orderby>\n\t\t\t\t\t\t<d:order>\n\t\t\t\t\t\t\t<d:prop><d:getlastmodified/></d:prop>\n\t\t\t\t\t\t\t<d:descending/>\n\t\t\t\t\t\t</d:order>\n\t\t\t\t\t</d:orderby>\n\t\t\t\t\t<d:limit>\n\t\t\t\t\t\t<d:nresults>").concat(options.perPage, "</d:nresults>\n\t\t\t\t\t\t<ns:firstresult>").concat(options.page * options.perPage, "</ns:firstresult>\n\t\t\t\t\t</d:limit>\n\t\t\t\t</d:basicsearch>\n\t\t\t</d:searchrequest>"),
              deep: true,
              details: true
            }, options);
            _context.next = 9;
            return _DavClient__WEBPACK_IMPORTED_MODULE_3__["default"].getDirectoryContents('', options);

          case 9:
            response = _context.sent;
            return _context.abrupt("return", response.data.map(function (data) {
              return Object(_utils_fileUtils__WEBPACK_IMPORTED_MODULE_0__["genFileInfo"])(data);
            }) // remove prefix path from full file path
            .map(function (data) {
              return Object.assign({}, data, {
                filename: data.filename.replace(prefixPath, '')
              });
            }));

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _ref.apply(this, arguments);
}

/***/ }),

/***/ "./src/views/Timeline.vue":
/*!********************************!*\
  !*** ./src/views/Timeline.vue ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Timeline_vue_vue_type_template_id_e945440a___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Timeline.vue?vue&type=template&id=e945440a& */ "./src/views/Timeline.vue?vue&type=template&id=e945440a&");
/* harmony import */ var _Timeline_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Timeline.vue?vue&type=script&lang=js& */ "./src/views/Timeline.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _Timeline_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _Timeline_vue_vue_type_template_id_e945440a___WEBPACK_IMPORTED_MODULE_0__["render"],
  _Timeline_vue_vue_type_template_id_e945440a___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/views/Timeline.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/views/Timeline.vue?vue&type=script&lang=js&":
/*!*********************************************************!*\
  !*** ./src/views/Timeline.vue?vue&type=script&lang=js& ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Timeline_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib!../../node_modules/vue-loader/lib??vue-loader-options!./Timeline.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js?!./src/views/Timeline.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Timeline_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/views/Timeline.vue?vue&type=template&id=e945440a&":
/*!***************************************************************!*\
  !*** ./src/views/Timeline.vue?vue&type=template&id=e945440a& ***!
  \***************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Timeline_vue_vue_type_template_id_e945440a___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib??vue-loader-options!./Timeline.vue?vue&type=template&id=e945440a& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/views/Timeline.vue?vue&type=template&id=e945440a&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Timeline_vue_vue_type_template_id_e945440a___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Timeline_vue_vue_type_template_id_e945440a___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=photos-11.js.map?v=d2fa0deec7b86dcbd507