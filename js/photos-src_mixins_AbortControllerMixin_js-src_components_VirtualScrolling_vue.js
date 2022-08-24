"use strict";
(self["webpackChunkphotos"] = self["webpackChunkphotos"] || []).push([["src_mixins_AbortControllerMixin_js-src_components_VirtualScrolling_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/VirtualScrolling.vue?vue&type=script&lang=js&":
/*!**************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/VirtualScrolling.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var debounce__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! debounce */ "./node_modules/debounce/index.js");
/* harmony import */ var debounce__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(debounce__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_logger_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/logger.js */ "./src/services/logger.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
 * @typedef {object} Row
 * @property {number} height - The height of the row.
 */

/**
 * @typedef {Row} VisibleRow
 * @property {'none'|'near'|'visible'} visibility - The visibility state of the row
 * @property {boolean} shouldRender - Whether the row should be renderer in the DOM
 */

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'VirtualScrolling',
  props: {
    rows: {
      type: Array,
      required: true
    },
    containerElement: {
      type: HTMLElement,
      default: null
    },
    useWindow: {
      type: Boolean,
      default: false
    },
    renderWindowRatio: {
      type: Number,
      default: 4
    },
    willBeVisibleWindowRatio: {
      type: Number,
      default: 4
    },
    visibleWindowRatio: {
      type: Number,
      // A little bit more than the container's height to include items at its edges.
      default: 0
    },
    bottomBufferRatio: {
      type: Number,
      default: 5
    },
    scrollToKey: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      scrollPosition: 0,
      containerHeight: 0,
      rowsContainerHeight: 0,

      /** @type {ResizeObserver} */
      resizeObserver: null
    };
  },

  computed: {
    /**
     * @return {VisibleRow[]}
     */
    visibleRows() {
      _services_logger_js__WEBPACK_IMPORTED_MODULE_1__["default"].debug('[VirtualScrolling] Computing visible rows', this.rows); // Optimisation: get those computed properties once to not go through vue's internal every time we need them.

      const scrollPosition = this.scrollPosition;
      const containerHeight = this.containerHeight; // Optimisation: different windows to hint the items how they should render themselves.
      // This will be forwarded with the visibility props.

      const shouldRenderedWindow = containerHeight * this.renderWindowRatio;
      const willBeVisibleWindow = containerHeight * this.willBeVisibleWindowRatio;
      const visibleWindow = containerHeight * this.visibleWindowRatio;
      let currentRowTopDistanceFromTop = 0;
      let currentRowBottomDistanceFromTop = 0; // Compute whether a row should be included in the DOM (shouldRender)
      // And how visible the row is.

      return this.rows.reduce((visibleRows, row) => {
        currentRowTopDistanceFromTop = currentRowBottomDistanceFromTop;
        currentRowBottomDistanceFromTop += row.height;

        if (currentRowTopDistanceFromTop < scrollPosition - shouldRenderedWindow || scrollPosition + containerHeight + shouldRenderedWindow < currentRowTopDistanceFromTop) {
          return visibleRows;
        }

        let visibility = 'none';

        if (scrollPosition - willBeVisibleWindow < currentRowTopDistanceFromTop && currentRowTopDistanceFromTop < scrollPosition + containerHeight + willBeVisibleWindow) {
          visibility = 'near';

          if (scrollPosition - visibleWindow < currentRowTopDistanceFromTop && currentRowTopDistanceFromTop < scrollPosition + containerHeight + visibleWindow) {
            visibility = 'visible';
          }

          if (scrollPosition - visibleWindow < currentRowBottomDistanceFromTop && currentRowBottomDistanceFromTop < scrollPosition + containerHeight + visibleWindow) {
            visibility = 'visible';
          }
        }

        return [...visibleRows, { ...row,
          visibility
        }];
      }, []);
    },

    /**
     * Total height of all the rows + some room for the loader.
     *
     * @return {number}
     */
    rowsHeight() {
      const loaderHeight = 200;
      return this.rows.map(row => row.height).reduce((totalHeight, rowHeight) => totalHeight + rowHeight, 0) + loaderHeight;
    },

    /**
     * @return {number}
     */
    paddingTop() {
      if (this.visibleRows.length === 0) {
        return 0;
      }

      const firstVisibleRowIndex = this.rows.findIndex(row => row.items === this.visibleRows[0].items);
      return this.rows.map(row => row.height).slice(0, firstVisibleRowIndex).reduce((totalHeight, rowHeight) => totalHeight + rowHeight, 0);
    },

    /**
     * padding-top is used to replace not included item in the container.
     *
     * @return {object}
     */
    rowsContainerStyle() {
      return {
        height: `${this.rowsHeight}px`,
        paddingTop: `${this.paddingTop}px`
      };
    },

    /**
     * Whether the user is near the bottom.
     * If true, then the need-content event will be emitted.
     *
     * @return {boolean}
     */
    isNearBottom() {
      const buffer = this.containerHeight * this.bottomBufferRatio;
      return this.scrollPosition + this.containerHeight >= this.rowsHeight - buffer;
    },

    /**
     * @return {HTMLElement}
     */
    container() {
      _services_logger_js__WEBPACK_IMPORTED_MODULE_1__["default"].debug('[VirtualScrolling] Computing container');

      if (this.containerElement !== null) {
        return this.containerElement;
      } else if (this.useWindow) {
        return window;
      } else {
        return this.$refs.container;
      }
    }

  },
  watch: {
    isNearBottom(value) {
      if (value) {
        this.$emit('need-content');
      }
    },

    rows() {
      // Re-emit need-content when rows is updated and isNearBottom is still true.
      // If the height of added rows is under `bottomBufferRatio`, `isNearBottom` will still be true so we need more content.
      if (this.isNearBottom) {
        this.$emit('need-content');
      }
    },

    scrollToKey(key) {
      let currentRowTopDistanceFromTop = 0;

      for (const row of this.rows) {
        if (row.key === key) {
          this.$refs.container.scrollTo({
            top: currentRowTopDistanceFromTop,
            behavior: 'smooth'
          });
          return;
        }

        currentRowTopDistanceFromTop += row.height;
      }
    }

  },

  mounted() {
    this.resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const cr = entry.contentRect;

        if (entry.target === this.container) {
          this.containerHeight = cr.height;
        }

        if (entry.target.classList.contains('vs-rows-container')) {
          this.rowsContainerHeight = cr.height;
        }
      }
    });

    if (this.useWindow) {
      window.addEventListener('resize', this.updateContainerSize);
      this.containerHeight = window.innerHeight;
    } else {
      this.resizeObserver.observe(this.container);
    }

    this.resizeObserver.observe(this.$refs.rowsContainer);
    this.container.addEventListener('scroll', this.updateScrollPosition);
  },

  beforeDestroy() {
    if (this.useWindow) {
      window.removeEventListener('resize', this.updateContainerSize);
    }

    this.resizeObserver.disconnect();
    this.container.removeEventListener('scroll', this.updateScrollPosition);
  },

  methods: {
    updateScrollPosition: (0,debounce__WEBPACK_IMPORTED_MODULE_0__.debounce)(function () {
      if (this.useWindow) {
        this.scrollPosition = this.container.scrollY;
      } else {
        this.scrollPosition = this.container.scrollTop;
      }
    }, 200),

    updateContainerSize() {
      this.containerHeight = window.innerHeight;
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

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/VirtualScrolling.vue?vue&type=style&index=0&id=3d9f7b4c&scoped=true&lang=scss&":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/VirtualScrolling.vue?vue&type=style&index=0&id=3d9f7b4c&scoped=true&lang=scss& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, ".vs-container[data-v-3d9f7b4c] {\n  overflow-y: scroll;\n  height: 100%;\n}\n.vs-rows-container[data-v-3d9f7b4c] {\n  box-sizing: border-box;\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/VirtualScrolling.vue?vue&type=style&index=0&id=3d9f7b4c&scoped=true&lang=scss&":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/VirtualScrolling.vue?vue&type=style&index=0&id=3d9f7b4c&scoped=true&lang=scss& ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_VirtualScrolling_vue_vue_type_style_index_0_id_3d9f7b4c_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./VirtualScrolling.vue?vue&type=style&index=0&id=3d9f7b4c&scoped=true&lang=scss& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/VirtualScrolling.vue?vue&type=style&index=0&id=3d9f7b4c&scoped=true&lang=scss&");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_VirtualScrolling_vue_vue_type_style_index_0_id_3d9f7b4c_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_VirtualScrolling_vue_vue_type_style_index_0_id_3d9f7b4c_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_VirtualScrolling_vue_vue_type_style_index_0_id_3d9f7b4c_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_VirtualScrolling_vue_vue_type_style_index_0_id_3d9f7b4c_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/components/VirtualScrolling.vue":
/*!*********************************************!*\
  !*** ./src/components/VirtualScrolling.vue ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _VirtualScrolling_vue_vue_type_template_id_3d9f7b4c_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./VirtualScrolling.vue?vue&type=template&id=3d9f7b4c&scoped=true& */ "./src/components/VirtualScrolling.vue?vue&type=template&id=3d9f7b4c&scoped=true&");
/* harmony import */ var _VirtualScrolling_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./VirtualScrolling.vue?vue&type=script&lang=js& */ "./src/components/VirtualScrolling.vue?vue&type=script&lang=js&");
/* harmony import */ var _VirtualScrolling_vue_vue_type_style_index_0_id_3d9f7b4c_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./VirtualScrolling.vue?vue&type=style&index=0&id=3d9f7b4c&scoped=true&lang=scss& */ "./src/components/VirtualScrolling.vue?vue&type=style&index=0&id=3d9f7b4c&scoped=true&lang=scss&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _VirtualScrolling_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _VirtualScrolling_vue_vue_type_template_id_3d9f7b4c_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render,
  _VirtualScrolling_vue_vue_type_template_id_3d9f7b4c_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "3d9f7b4c",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/components/VirtualScrolling.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/components/VirtualScrolling.vue?vue&type=script&lang=js&":
/*!**********************************************************************!*\
  !*** ./src/components/VirtualScrolling.vue?vue&type=script&lang=js& ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_VirtualScrolling_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./VirtualScrolling.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/VirtualScrolling.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_VirtualScrolling_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/components/VirtualScrolling.vue?vue&type=style&index=0&id=3d9f7b4c&scoped=true&lang=scss&":
/*!*******************************************************************************************************!*\
  !*** ./src/components/VirtualScrolling.vue?vue&type=style&index=0&id=3d9f7b4c&scoped=true&lang=scss& ***!
  \*******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_VirtualScrolling_vue_vue_type_style_index_0_id_3d9f7b4c_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/style-loader/dist/cjs.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./VirtualScrolling.vue?vue&type=style&index=0&id=3d9f7b4c&scoped=true&lang=scss& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/VirtualScrolling.vue?vue&type=style&index=0&id=3d9f7b4c&scoped=true&lang=scss&");


/***/ }),

/***/ "./src/components/VirtualScrolling.vue?vue&type=template&id=3d9f7b4c&scoped=true&":
/*!****************************************************************************************!*\
  !*** ./src/components/VirtualScrolling.vue?vue&type=template&id=3d9f7b4c&scoped=true& ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_VirtualScrolling_vue_vue_type_template_id_3d9f7b4c_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_VirtualScrolling_vue_vue_type_template_id_3d9f7b4c_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_VirtualScrolling_vue_vue_type_template_id_3d9f7b4c_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./VirtualScrolling.vue?vue&type=template&id=3d9f7b4c&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/VirtualScrolling.vue?vue&type=template&id=3d9f7b4c&scoped=true&");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/VirtualScrolling.vue?vue&type=template&id=3d9f7b4c&scoped=true&":
/*!*******************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/VirtualScrolling.vue?vue&type=template&id=3d9f7b4c&scoped=true& ***!
  \*******************************************************************************************************************************************************************************************************************************/
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
  return !_vm.useWindow && _vm.containerElement === null
    ? _c("div", { ref: "container", staticClass: "vs-container" }, [
        _c(
          "div",
          {
            ref: "rowsContainer",
            staticClass: "vs-rows-container",
            style: _vm.rowsContainerStyle,
          },
          [
            _vm._t("default", null, { renderedRows: _vm.visibleRows }),
            _vm._v(" "),
            _vm._t("loader"),
          ],
          2
        ),
      ])
    : _c(
        "div",
        {
          ref: "rowsContainer",
          staticClass: "vs-rows-container",
          style: _vm.rowsContainerStyle,
        },
        [
          _vm._t("default", null, { renderedRows: _vm.visibleRows }),
          _vm._v(" "),
          _vm._t("loader"),
        ],
        2
      )
}
var staticRenderFns = []
render._withStripped = true



/***/ })

}]);
//# sourceMappingURL=photos-src_mixins_AbortControllerMixin_js-src_components_VirtualScrolling_vue.js.map?v=16fa9a9802b33c9dd642