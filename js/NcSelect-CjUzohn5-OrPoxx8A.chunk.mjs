const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { V as Vue } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
import { n as normalizeComponent, e as NcIconSvgWrapper, r as register, aA as t35, a0 as t15, a as t, ac as GenRandomId, f as NcLoadingIcon, D as Close } from "./index-BOzawWmL.chunk.mjs";
import { u as userStatus, a as NcAvatar } from "./NcAvatar-YSp2ORHc-CfTsACiM.chunk.mjs";
import "./video-C5pfp5p8.chunk.mjs";
import { u as useModelMigration } from "./useModelMigration-EhAWvqDD-DYrjrJkv.chunk.mjs";
const _sfc_main$4 = {
  name: "ChevronDownIcon",
  emits: ["click"],
  props: {
    title: {
      type: String
    },
    fillColor: {
      type: String,
      default: "currentColor"
    },
    size: {
      type: Number,
      default: 24
    }
  }
};
var _sfc_render$4 = function render() {
  var _vm = this, _c = _vm._self._c;
  return _c("span", _vm._b({ staticClass: "material-design-icon chevron-down-icon", attrs: { "aria-hidden": _vm.title ? null : "true", "aria-label": _vm.title, "role": "img" }, on: { "click": function($event) {
    return _vm.$emit("click", $event);
  } } }, "span", _vm.$attrs, false), [_c("svg", { staticClass: "material-design-icon__svg", attrs: { "fill": _vm.fillColor, "width": _vm.size, "height": _vm.size, "viewBox": "0 0 24 24" } }, [_c("path", { attrs: { "d": "M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" } }, [_vm.title ? _c("title", [_vm._v(_vm._s(_vm.title))]) : _vm._e()])])]);
};
var _sfc_staticRenderFns$4 = [];
var __component__$4 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$4,
  _sfc_render$4,
  _sfc_staticRenderFns$4,
  false,
  null,
  null
);
const ChevronDown = __component__$4.exports;
var vueSelect$1 = { exports: {} };
var vueSelect = vueSelect$1.exports;
var hasRequiredVueSelect;
function requireVueSelect() {
  if (hasRequiredVueSelect) return vueSelect$1.exports;
  hasRequiredVueSelect = 1;
  (function(module, exports) {
    !function(e, t2) {
      module.exports = t2();
    }("undefined" != typeof self ? self : vueSelect, function() {
      return (() => {
        var e = { 646: (e2) => {
          e2.exports = function(e3) {
            if (Array.isArray(e3)) {
              for (var t3 = 0, n2 = new Array(e3.length); t3 < e3.length; t3++) n2[t3] = e3[t3];
              return n2;
            }
          };
        }, 713: (e2) => {
          e2.exports = function(e3, t3, n2) {
            return t3 in e3 ? Object.defineProperty(e3, t3, { value: n2, enumerable: true, configurable: true, writable: true }) : e3[t3] = n2, e3;
          };
        }, 860: (e2) => {
          e2.exports = function(e3) {
            if (Symbol.iterator in Object(e3) || "[object Arguments]" === Object.prototype.toString.call(e3)) return Array.from(e3);
          };
        }, 206: (e2) => {
          e2.exports = function() {
            throw new TypeError("Invalid attempt to spread non-iterable instance");
          };
        }, 319: (e2, t3, n2) => {
          var o2 = n2(646), i = n2(860), s = n2(206);
          e2.exports = function(e3) {
            return o2(e3) || i(e3) || s();
          };
        }, 8: (e2) => {
          function t3(n2) {
            return "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? e2.exports = t3 = function(e3) {
              return typeof e3;
            } : e2.exports = t3 = function(e3) {
              return e3 && "function" == typeof Symbol && e3.constructor === Symbol && e3 !== Symbol.prototype ? "symbol" : typeof e3;
            }, t3(n2);
          }
          e2.exports = t3;
        } }, t2 = {};
        function n(o2) {
          var i = t2[o2];
          if (void 0 !== i) return i.exports;
          var s = t2[o2] = { exports: {} };
          return e[o2](s, s.exports, n), s.exports;
        }
        n.n = (e2) => {
          var t3 = e2 && e2.__esModule ? () => e2.default : () => e2;
          return n.d(t3, { a: t3 }), t3;
        }, n.d = (e2, t3) => {
          for (var o2 in t3) n.o(t3, o2) && !n.o(e2, o2) && Object.defineProperty(e2, o2, { enumerable: true, get: t3[o2] });
        }, n.o = (e2, t3) => Object.prototype.hasOwnProperty.call(e2, t3), n.r = (e2) => {
          "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e2, "__esModule", { value: true });
        };
        var o = {};
        return (() => {
          n.r(o), n.d(o, { VueSelect: () => m, default: () => _, mixins: () => O });
          var e2 = n(319), t3 = n.n(e2), i = n(8), s = n.n(i), r = n(713), a = n.n(r);
          const l = { props: { autoscroll: { type: Boolean, default: true } }, watch: { typeAheadPointer: function() {
            this.autoscroll && this.maybeAdjustScroll();
          }, open: function(e3) {
            var t4 = this;
            this.autoscroll && e3 && this.$nextTick(function() {
              return t4.maybeAdjustScroll();
            });
          } }, methods: { maybeAdjustScroll: function() {
            var e3, t4 = (null === (e3 = this.$refs.dropdownMenu) || void 0 === e3 ? void 0 : e3.children[this.typeAheadPointer]) || false;
            if (t4) {
              var n2 = this.getDropdownViewport(), o2 = t4.getBoundingClientRect(), i2 = o2.top, s2 = o2.bottom, r2 = o2.height;
              if (i2 < n2.top) return this.$refs.dropdownMenu.scrollTop = t4.offsetTop;
              if (s2 > n2.bottom) return this.$refs.dropdownMenu.scrollTop = t4.offsetTop - (n2.height - r2);
            }
          }, getDropdownViewport: function() {
            return this.$refs.dropdownMenu ? this.$refs.dropdownMenu.getBoundingClientRect() : { height: 0, top: 0, bottom: 0 };
          } } }, c = { data: function() {
            return { typeAheadPointer: -1 };
          }, watch: { filteredOptions: function() {
            if (this.resetFocusOnOptionsChange) {
              for (var e3 = 0; e3 < this.filteredOptions.length; e3++) if (this.selectable(this.filteredOptions[e3])) {
                this.typeAheadPointer = e3;
                break;
              }
            }
          }, open: function(e3) {
            e3 && this.typeAheadToLastSelected();
          }, selectedValue: function() {
            this.open && this.typeAheadToLastSelected();
          } }, methods: { typeAheadUp: function() {
            for (var e3 = this.typeAheadPointer - 1; e3 >= 0; e3--) if (this.selectable(this.filteredOptions[e3])) {
              this.typeAheadPointer = e3;
              break;
            }
          }, typeAheadDown: function() {
            for (var e3 = this.typeAheadPointer + 1; e3 < this.filteredOptions.length; e3++) if (this.selectable(this.filteredOptions[e3])) {
              this.typeAheadPointer = e3;
              break;
            }
          }, typeAheadSelect: function() {
            var e3 = this.filteredOptions[this.typeAheadPointer];
            e3 && this.selectable(e3) && this.select(e3);
          }, typeAheadToLastSelected: function() {
            var e3 = 0 !== this.selectedValue.length ? this.filteredOptions.indexOf(this.selectedValue[this.selectedValue.length - 1]) : -1;
            -1 !== e3 && (this.typeAheadPointer = e3);
          } } }, u = { props: { loading: { type: Boolean, default: false } }, data: function() {
            return { mutableLoading: false };
          }, watch: { search: function() {
            this.$emit("search", this.search, this.toggleLoading);
          }, loading: function(e3) {
            this.mutableLoading = e3;
          } }, methods: { toggleLoading: function() {
            var e3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null;
            return this.mutableLoading = null == e3 ? !this.mutableLoading : e3;
          } } };
          function p(e3, t4, n2, o2, i2, s2, r2, a2) {
            var l2, c2 = "function" == typeof e3 ? e3.options : e3;
            if (t4 && (c2.render = t4, c2.staticRenderFns = n2, c2._compiled = true), l2) ;
            return { exports: e3, options: c2 };
          }
          const d = { Deselect: p({}, function() {
            var e3 = this.$createElement, t4 = this._self._c || e3;
            return t4("svg", { attrs: { xmlns: "http://www.w3.org/2000/svg", width: "10", height: "10" } }, [t4("path", { attrs: { d: "M6.895455 5l2.842897-2.842898c.348864-.348863.348864-.914488 0-1.263636L9.106534.261648c-.348864-.348864-.914489-.348864-1.263636 0L5 3.104545 2.157102.261648c-.348863-.348864-.914488-.348864-1.263636 0L.261648.893466c-.348864.348864-.348864.914489 0 1.263636L3.104545 5 .261648 7.842898c-.348864.348863-.348864.914488 0 1.263636l.631818.631818c.348864.348864.914773.348864 1.263636 0L5 6.895455l2.842898 2.842897c.348863.348864.914772.348864 1.263636 0l.631818-.631818c.348864-.348864.348864-.914489 0-1.263636L6.895455 5z" } })]);
          }, []).exports, OpenIndicator: p({}, function() {
            var e3 = this.$createElement, t4 = this._self._c || e3;
            return t4("svg", { attrs: { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "10" } }, [t4("path", { attrs: { d: "M9.211364 7.59931l4.48338-4.867229c.407008-.441854.407008-1.158247 0-1.60046l-.73712-.80023c-.407008-.441854-1.066904-.441854-1.474243 0L7 5.198617 2.51662.33139c-.407008-.441853-1.066904-.441853-1.474243 0l-.737121.80023c-.407008.441854-.407008 1.158248 0 1.600461l4.48338 4.867228L7 10l2.211364-2.40069z" } })]);
          }, []).exports }, h = { inserted: function(e3, t4, n2) {
            var o2 = n2.context;
            if (o2.appendToBody) {
              document.body.appendChild(e3);
              var i2 = o2.$refs.toggle.getBoundingClientRect(), s2 = i2.height, r2 = i2.top, a2 = i2.left, l2 = i2.width, c2 = window.scrollX || window.pageXOffset, u2 = window.scrollY || window.pageYOffset;
              e3.unbindPosition = o2.calculatePosition(e3, o2, { width: l2 + "px", left: c2 + a2 + "px", top: u2 + r2 + s2 + "px" });
            }
          }, unbind: function(e3, t4, n2) {
            n2.context.appendToBody && (e3.unbindPosition && "function" == typeof e3.unbindPosition && e3.unbindPosition(), e3.parentNode && e3.parentNode.removeChild(e3));
          } };
          const f = function(e3) {
            var t4 = {};
            return Object.keys(e3).sort().forEach(function(n2) {
              t4[n2] = e3[n2];
            }), JSON.stringify(t4);
          };
          var y = 0;
          const b = function() {
            return ++y;
          };
          function g(e3, t4) {
            var n2 = Object.keys(e3);
            if (Object.getOwnPropertySymbols) {
              var o2 = Object.getOwnPropertySymbols(e3);
              t4 && (o2 = o2.filter(function(t5) {
                return Object.getOwnPropertyDescriptor(e3, t5).enumerable;
              })), n2.push.apply(n2, o2);
            }
            return n2;
          }
          function v(e3) {
            for (var t4 = 1; t4 < arguments.length; t4++) {
              var n2 = null != arguments[t4] ? arguments[t4] : {};
              t4 % 2 ? g(Object(n2), true).forEach(function(t5) {
                a()(e3, t5, n2[t5]);
              }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e3, Object.getOwnPropertyDescriptors(n2)) : g(Object(n2)).forEach(function(t5) {
                Object.defineProperty(e3, t5, Object.getOwnPropertyDescriptor(n2, t5));
              });
            }
            return e3;
          }
          const m = p({ components: v({}, d), directives: { appendToBody: h }, mixins: [l, c, u], props: { value: {}, components: { type: Object, default: function() {
            return {};
          } }, options: { type: Array, default: function() {
            return [];
          } }, limit: { type: Number, default: null }, disabled: { type: Boolean, default: false }, clearable: { type: Boolean, default: true }, deselectFromDropdown: { type: Boolean, default: false }, searchable: { type: Boolean, default: true }, multiple: { type: Boolean, default: false }, placeholder: { type: String, default: "" }, transition: { type: String, default: "vs__fade" }, clearSearchOnSelect: { type: Boolean, default: true }, closeOnSelect: { type: Boolean, default: true }, label: { type: String, default: "label" }, ariaLabelCombobox: { type: String, default: "Search for options" }, ariaLabelListbox: { type: String, default: "Options" }, ariaLabelClearSelected: { type: String, default: "Clear selected" }, ariaLabelDeselectOption: { type: Function, default: function(e3) {
            return "Deselect ".concat(e3);
          } }, autocomplete: { type: String, default: "off" }, reduce: { type: Function, default: function(e3) {
            return e3;
          } }, selectable: { type: Function, default: function(e3) {
            return true;
          } }, getOptionLabel: { type: Function, default: function(e3) {
            return "object" === s()(e3) ? e3.hasOwnProperty(this.label) ? e3[this.label] : console.warn('[vue-select warn]: Label key "option.'.concat(this.label, '" does not') + " exist in options object ".concat(JSON.stringify(e3), ".\n") + "https://vue-select.org/api/props.html#getoptionlabel") : e3;
          } }, getOptionKey: { type: Function, default: function(e3) {
            if ("object" !== s()(e3)) return e3;
            try {
              return e3.hasOwnProperty("id") ? e3.id : f(e3);
            } catch (t4) {
              return console.warn("[vue-select warn]: Could not stringify this option to generate unique key. Please provide'getOptionKey' prop to return a unique key for each option.\nhttps://vue-select.org/api/props.html#getoptionkey", e3, t4);
            }
          } }, onTab: { type: Function, default: function() {
            this.selectOnTab && !this.isComposing && this.typeAheadSelect();
          } }, taggable: { type: Boolean, default: false }, tabindex: { type: Number, default: null }, pushTags: { type: Boolean, default: false }, filterable: { type: Boolean, default: true }, filterBy: { type: Function, default: function(e3, t4, n2) {
            return (t4 || "").toLocaleLowerCase().indexOf(n2.toLocaleLowerCase()) > -1;
          } }, filter: { type: Function, default: function(e3, t4) {
            var n2 = this;
            return e3.filter(function(e4) {
              var o2 = n2.getOptionLabel(e4);
              return "number" == typeof o2 && (o2 = o2.toString()), n2.filterBy(e4, o2, t4);
            });
          } }, createOption: { type: Function, default: function(e3) {
            return "object" === s()(this.optionList[0]) ? a()({}, this.label, e3) : e3;
          } }, resetFocusOnOptionsChange: { type: Boolean, default: true }, resetOnOptionsChange: { default: false, validator: function(e3) {
            return ["function", "boolean"].includes(s()(e3));
          } }, clearSearchOnBlur: { type: Function, default: function(e3) {
            var t4 = e3.clearSearchOnSelect, n2 = e3.multiple;
            return t4 && !n2;
          } }, noDrop: { type: Boolean, default: false }, inputId: { type: String }, dir: { type: String, default: "auto" }, selectOnTab: { type: Boolean, default: false }, selectOnKeyCodes: { type: Array, default: function() {
            return [13];
          } }, searchInputQuerySelector: { type: String, default: "[type=search]" }, mapKeydown: { type: Function, default: function(e3, t4) {
            return e3;
          } }, appendToBody: { type: Boolean, default: false }, calculatePosition: { type: Function, default: function(e3, t4, n2) {
            var o2 = n2.width, i2 = n2.top, s2 = n2.left;
            e3.style.top = i2, e3.style.left = s2, e3.style.width = o2;
          } }, dropdownShouldOpen: { type: Function, default: function(e3) {
            var t4 = e3.noDrop, n2 = e3.open, o2 = e3.mutableLoading;
            return !t4 && (n2 && !o2);
          } }, keyboardFocusBorder: { type: Boolean, default: false }, uid: { type: [String, Number], default: function() {
            return b();
          } } }, data: function() {
            return { search: "", open: false, isComposing: false, isKeyboardNavigation: false, pushedTags: [], _value: [] };
          }, computed: { isTrackingValues: function() {
            return void 0 === this.value || this.$options.propsData.hasOwnProperty("reduce");
          }, selectedValue: function() {
            var e3 = this.value;
            return this.isTrackingValues && (e3 = this.$data._value), null != e3 && "" !== e3 ? [].concat(e3) : [];
          }, optionList: function() {
            return this.options.concat(this.pushTags ? this.pushedTags : []);
          }, searchEl: function() {
            return this.$scopedSlots.search ? this.$refs.selectedOptions.querySelector(this.searchInputQuerySelector) : this.$refs.search;
          }, scope: function() {
            var e3 = this, t4 = { search: this.search, loading: this.loading, searching: this.searching, filteredOptions: this.filteredOptions };
            return { search: { attributes: v({ id: this.inputId, disabled: this.disabled, placeholder: this.searchPlaceholder, tabindex: this.tabindex, readonly: !this.searchable, role: "combobox", "aria-autocomplete": "list", "aria-label": this.ariaLabelCombobox, "aria-controls": "vs-".concat(this.uid, "__listbox"), "aria-owns": "vs-".concat(this.uid, "__listbox"), "aria-expanded": this.dropdownOpen.toString(), ref: "search", type: "search", autocomplete: this.autocomplete, value: this.search }, this.dropdownOpen && this.filteredOptions[this.typeAheadPointer] ? { "aria-activedescendant": "vs-".concat(this.uid, "__option-").concat(this.typeAheadPointer) } : {}), events: { compositionstart: function() {
              return e3.isComposing = true;
            }, compositionend: function() {
              return e3.isComposing = false;
            }, keydown: this.onSearchKeyDown, keypress: this.onSearchKeyPress, blur: this.onSearchBlur, focus: this.onSearchFocus, input: function(t5) {
              return e3.search = t5.target.value;
            } } }, spinner: { loading: this.mutableLoading }, noOptions: { search: this.search, loading: this.mutableLoading, searching: this.searching }, openIndicator: { attributes: { ref: "openIndicator", role: "presentation", class: "vs__open-indicator" } }, listHeader: t4, listFooter: t4, header: v({}, t4, { deselect: this.deselect }), footer: v({}, t4, { deselect: this.deselect }) };
          }, childComponents: function() {
            return v({}, d, {}, this.components);
          }, stateClasses: function() {
            return { "vs--open": this.dropdownOpen, "vs--single": !this.multiple, "vs--multiple": this.multiple, "vs--searching": this.searching && !this.noDrop, "vs--searchable": this.searchable && !this.noDrop, "vs--unsearchable": !this.searchable, "vs--loading": this.mutableLoading, "vs--disabled": this.disabled };
          }, searching: function() {
            return !!this.search;
          }, dropdownOpen: function() {
            return this.dropdownShouldOpen(this);
          }, searchPlaceholder: function() {
            return this.isValueEmpty && this.placeholder ? this.placeholder : void 0;
          }, filteredOptions: function() {
            var e3 = this, t4 = function(t5) {
              return null !== e3.limit ? t5.slice(0, e3.limit) : t5;
            }, n2 = [].concat(this.optionList);
            if (!this.filterable && !this.taggable) return t4(n2);
            var o2 = this.search.length ? this.filter(n2, this.search, this) : n2;
            if (this.taggable && this.search.length) {
              var i2 = this.createOption(this.search);
              this.optionExists(i2) || o2.unshift(i2);
            }
            return t4(o2);
          }, isValueEmpty: function() {
            return 0 === this.selectedValue.length;
          }, showClearButton: function() {
            return !this.multiple && this.clearable && !this.open && !this.isValueEmpty;
          } }, watch: { options: function(e3, t4) {
            var n2 = this;
            !this.taggable && ("function" == typeof n2.resetOnOptionsChange ? n2.resetOnOptionsChange(e3, t4, n2.selectedValue) : n2.resetOnOptionsChange) && this.clearSelection(), this.value && this.isTrackingValues && this.setInternalValueFromOptions(this.value);
          }, value: { immediate: true, handler: function(e3) {
            this.isTrackingValues && this.setInternalValueFromOptions(e3);
          } }, multiple: function() {
            this.clearSelection();
          }, open: function(e3) {
            this.$emit(e3 ? "open" : "close");
          }, search: function(e3) {
            e3.length && (this.open = true);
          } }, created: function() {
            this.mutableLoading = this.loading, this.$on("option:created", this.pushTag);
          }, methods: { setInternalValueFromOptions: function(e3) {
            var t4 = this;
            Array.isArray(e3) ? this.$data._value = e3.map(function(e4) {
              return t4.findOptionFromReducedValue(e4);
            }) : this.$data._value = this.findOptionFromReducedValue(e3);
          }, select: function(e3) {
            this.$emit("option:selecting", e3), this.isOptionSelected(e3) ? this.deselectFromDropdown && (this.clearable || this.multiple && this.selectedValue.length > 1) && this.deselect(e3) : (this.taggable && !this.optionExists(e3) && this.$emit("option:created", e3), this.multiple && (e3 = this.selectedValue.concat(e3)), this.updateValue(e3), this.$emit("option:selected", e3)), this.onAfterSelect(e3);
          }, deselect: function(e3) {
            var t4 = this;
            this.$emit("option:deselecting", e3), this.updateValue(this.selectedValue.filter(function(n2) {
              return !t4.optionComparator(n2, e3);
            })), this.$emit("option:deselected", e3);
          }, keyboardDeselect: function(e3, t4) {
            var n2, o2;
            this.deselect(e3);
            var i2 = null === (n2 = this.$refs.deselectButtons) || void 0 === n2 ? void 0 : n2[t4 + 1], s2 = null === (o2 = this.$refs.deselectButtons) || void 0 === o2 ? void 0 : o2[t4 - 1], r2 = null != i2 ? i2 : s2;
            r2 ? r2.focus() : this.searchEl.focus();
          }, clearSelection: function() {
            this.updateValue(this.multiple ? [] : null), this.searchEl.focus();
          }, onAfterSelect: function(e3) {
            var t4 = this;
            this.closeOnSelect && (this.open = !this.open), this.clearSearchOnSelect && (this.search = ""), this.noDrop && this.multiple && this.$nextTick(function() {
              return t4.$refs.search.focus();
            });
          }, updateValue: function(e3) {
            var t4 = this;
            void 0 === this.value && (this.$data._value = e3), null !== e3 && (e3 = Array.isArray(e3) ? e3.map(function(e4) {
              return t4.reduce(e4);
            }) : this.reduce(e3)), this.$emit("input", e3);
          }, toggleDropdown: function(e3) {
            var n2 = e3.target !== this.searchEl;
            n2 && e3.preventDefault();
            var o2 = [].concat(t3()(this.$refs.deselectButtons || []), t3()([this.$refs.clearButton]));
            void 0 === this.searchEl || o2.filter(Boolean).some(function(t4) {
              return t4.contains(e3.target) || t4 === e3.target;
            }) ? e3.preventDefault() : this.open && n2 ? this.searchEl.blur() : this.disabled || (this.open = true, this.searchEl.focus());
          }, isOptionSelected: function(e3) {
            var t4 = this;
            return this.selectedValue.some(function(n2) {
              return t4.optionComparator(n2, e3);
            });
          }, isOptionDeselectable: function(e3) {
            return this.isOptionSelected(e3) && this.deselectFromDropdown;
          }, hasKeyboardFocusBorder: function(e3) {
            return !(!this.keyboardFocusBorder || !this.isKeyboardNavigation) && e3 === this.typeAheadPointer;
          }, optionComparator: function(e3, t4) {
            return this.getOptionKey(e3) === this.getOptionKey(t4);
          }, findOptionFromReducedValue: function(e3) {
            var n2 = this, o2 = [].concat(t3()(this.options), t3()(this.pushedTags)).filter(function(t4) {
              return JSON.stringify(n2.reduce(t4)) === JSON.stringify(e3);
            });
            return 1 === o2.length ? o2[0] : o2.find(function(e4) {
              return n2.optionComparator(e4, n2.$data._value);
            }) || e3;
          }, closeSearchOptions: function() {
            this.open = false, this.$emit("search:blur");
          }, maybeDeleteValue: function() {
            if (!this.searchEl.value.length && this.selectedValue && this.selectedValue.length && this.clearable) {
              var e3 = null;
              this.multiple && (e3 = t3()(this.selectedValue.slice(0, this.selectedValue.length - 1))), this.updateValue(e3);
            }
          }, optionExists: function(e3) {
            var t4 = this;
            return this.optionList.some(function(n2) {
              return t4.optionComparator(n2, e3);
            });
          }, optionAriaSelected: function(e3) {
            return this.selectable(e3) ? String(this.isOptionSelected(e3)) : null;
          }, normalizeOptionForSlot: function(e3) {
            return "object" === s()(e3) ? e3 : a()({}, this.label, e3);
          }, pushTag: function(e3) {
            this.pushedTags.push(e3);
          }, onEscape: function() {
            this.search.length ? this.search = "" : this.open = false;
          }, onSearchBlur: function() {
            if (!this.mousedown || this.searching) {
              var e3 = this.clearSearchOnSelect, t4 = this.multiple;
              return this.clearSearchOnBlur({ clearSearchOnSelect: e3, multiple: t4 }) && (this.search = ""), void this.closeSearchOptions();
            }
            this.mousedown = false, 0 !== this.search.length || 0 !== this.options.length || this.closeSearchOptions();
          }, onSearchFocus: function() {
            this.open = true, this.$emit("search:focus");
          }, onMousedown: function() {
            this.mousedown = true;
          }, onMouseUp: function() {
            this.mousedown = false;
          }, onMouseMove: function(e3, t4) {
            this.isKeyboardNavigation = false, this.selectable(e3) && (this.typeAheadPointer = t4);
          }, onSearchKeyDown: function(e3) {
            var t4 = this, n2 = function(e4) {
              if (e4.preventDefault(), t4.open) return !t4.isComposing && t4.typeAheadSelect();
              t4.open = true;
            }, o2 = { 8: function(e4) {
              return t4.maybeDeleteValue();
            }, 9: function(e4) {
              return t4.onTab();
            }, 27: function(e4) {
              return t4.onEscape();
            }, 38: function(e4) {
              if (e4.preventDefault(), t4.isKeyboardNavigation = true, t4.open) return t4.typeAheadUp();
              t4.open = true;
            }, 40: function(e4) {
              if (e4.preventDefault(), t4.isKeyboardNavigation = true, t4.open) return t4.typeAheadDown();
              t4.open = true;
            } };
            this.selectOnKeyCodes.forEach(function(e4) {
              return o2[e4] = n2;
            });
            var i2 = this.mapKeydown(o2, this);
            if ("function" == typeof i2[e3.keyCode]) return i2[e3.keyCode](e3);
          }, onSearchKeyPress: function(e3) {
            this.open || 32 !== e3.keyCode || (e3.preventDefault(), this.open = true);
          } } }, function() {
            var e3 = this, t4 = e3.$createElement, n2 = e3._self._c || t4;
            return n2("div", { staticClass: "v-select", class: e3.stateClasses, attrs: { id: "v-select-" + e3.uid, dir: e3.dir } }, [e3._t("header", null, null, e3.scope.header), e3._v(" "), n2("div", { ref: "toggle", staticClass: "vs__dropdown-toggle" }, [n2("div", { ref: "selectedOptions", staticClass: "vs__selected-options", on: { mousedown: e3.toggleDropdown } }, [e3._l(e3.selectedValue, function(t5, o2) {
              return e3._t("selected-option-container", [n2("span", { key: e3.getOptionKey(t5), staticClass: "vs__selected" }, [e3._t("selected-option", [e3._v("\n            " + e3._s(e3.getOptionLabel(t5)) + "\n          ")], null, e3.normalizeOptionForSlot(t5)), e3._v(" "), e3.multiple ? n2("button", { ref: "deselectButtons", refInFor: true, staticClass: "vs__deselect", attrs: { disabled: e3.disabled, type: "button", title: e3.ariaLabelDeselectOption(e3.getOptionLabel(t5)), "aria-label": e3.ariaLabelDeselectOption(e3.getOptionLabel(t5)) }, on: { mousedown: function(n3) {
                return n3.stopPropagation(), e3.deselect(t5);
              }, keydown: function(n3) {
                return !n3.type.indexOf("key") && e3._k(n3.keyCode, "enter", 13, n3.key, "Enter") ? null : e3.keyboardDeselect(t5, o2);
              } } }, [n2(e3.childComponents.Deselect, { tag: "component" })], 1) : e3._e()], 2)], { option: e3.normalizeOptionForSlot(t5), deselect: e3.deselect, multiple: e3.multiple, disabled: e3.disabled });
            }), e3._v(" "), e3._t("search", [n2("input", e3._g(e3._b({ staticClass: "vs__search" }, "input", e3.scope.search.attributes, false), e3.scope.search.events))], null, e3.scope.search)], 2), e3._v(" "), n2("div", { ref: "actions", staticClass: "vs__actions" }, [n2("button", { directives: [{ name: "show", rawName: "v-show", value: e3.showClearButton, expression: "showClearButton" }], ref: "clearButton", staticClass: "vs__clear", attrs: { disabled: e3.disabled, type: "button", title: e3.ariaLabelClearSelected, "aria-label": e3.ariaLabelClearSelected }, on: { click: e3.clearSelection } }, [n2(e3.childComponents.Deselect, { tag: "component" })], 1), e3._v(" "), e3.noDrop ? e3._e() : n2("button", { ref: "openIndicatorButton", staticClass: "vs__open-indicator-button", attrs: { type: "button", tabindex: "-1", "aria-labelledby": "vs-" + e3.uid + "__listbox", "aria-controls": "vs-" + e3.uid + "__listbox", "aria-expanded": e3.dropdownOpen.toString() }, on: { mousedown: e3.toggleDropdown } }, [e3._t("open-indicator", [n2(e3.childComponents.OpenIndicator, e3._b({ tag: "component" }, "component", e3.scope.openIndicator.attributes, false))], null, e3.scope.openIndicator)], 2), e3._v(" "), e3._t("spinner", [n2("div", { directives: [{ name: "show", rawName: "v-show", value: e3.mutableLoading, expression: "mutableLoading" }], staticClass: "vs__spinner" }, [e3._v("Loading...")])], null, e3.scope.spinner)], 2)]), e3._v(" "), n2("transition", { attrs: { name: e3.transition } }, [e3.dropdownOpen ? n2("ul", { directives: [{ name: "append-to-body", rawName: "v-append-to-body" }], key: "vs-" + e3.uid + "__listbox", ref: "dropdownMenu", staticClass: "vs__dropdown-menu", attrs: { id: "vs-" + e3.uid + "__listbox", role: "listbox", "aria-label": e3.ariaLabelListbox, "aria-multiselectable": e3.multiple, tabindex: "-1" }, on: { mousedown: function(t5) {
              return t5.preventDefault(), e3.onMousedown(t5);
            }, mouseup: e3.onMouseUp } }, [e3._t("list-header", null, null, e3.scope.listHeader), e3._v(" "), e3._l(e3.filteredOptions, function(t5, o2) {
              return n2("li", { key: e3.getOptionKey(t5), staticClass: "vs__dropdown-option", class: { "vs__dropdown-option--deselect": e3.isOptionDeselectable(t5) && o2 === e3.typeAheadPointer, "vs__dropdown-option--selected": e3.isOptionSelected(t5), "vs__dropdown-option--highlight": o2 === e3.typeAheadPointer, "vs__dropdown-option--kb-focus": e3.hasKeyboardFocusBorder(o2), "vs__dropdown-option--disabled": !e3.selectable(t5) }, attrs: { id: "vs-" + e3.uid + "__option-" + o2, role: "option", "aria-selected": e3.optionAriaSelected(t5) }, on: { mousemove: function(n3) {
                return e3.onMouseMove(t5, o2);
              }, click: function(n3) {
                n3.preventDefault(), n3.stopPropagation(), e3.selectable(t5) && e3.select(t5);
              } } }, [e3._t("option", [e3._v("\n          " + e3._s(e3.getOptionLabel(t5)) + "\n        ")], null, e3.normalizeOptionForSlot(t5))], 2);
            }), e3._v(" "), 0 === e3.filteredOptions.length ? n2("li", { staticClass: "vs__no-options" }, [e3._t("no-options", [e3._v("\n          Sorry, no matching options.\n        ")], null, e3.scope.noOptions)], 2) : e3._e(), e3._v(" "), e3._t("list-footer", null, null, e3.scope.listFooter)], 2) : n2("ul", { staticStyle: { display: "none", visibility: "hidden" }, attrs: { id: "vs-" + e3.uid + "__listbox", role: "listbox", "aria-label": e3.ariaLabelListbox } })]), e3._v(" "), e3._t("footer", null, null, e3.scope.footer)], 2);
          }, []).exports, O = { ajax: u, pointer: c, pointerScroll: l }, _ = m;
        })(), o;
      })();
    });
  })(vueSelect$1);
  return vueSelect$1.exports;
}
var vueSelectExports = requireVueSelect();
function getAlignment(placement) {
  return placement.split("-")[1];
}
function getLengthFromAxis(axis) {
  return axis === "y" ? "height" : "width";
}
function getSide(placement) {
  return placement.split("-")[0];
}
function getMainAxisFromPlacement(placement) {
  return ["top", "bottom"].includes(getSide(placement)) ? "x" : "y";
}
function computeCoordsFromPlacement(_ref, placement, rtl) {
  let {
    reference,
    floating
  } = _ref;
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const mainAxis = getMainAxisFromPlacement(placement);
  const length = getLengthFromAxis(mainAxis);
  const commonAlign = reference[length] / 2 - floating[length] / 2;
  const side = getSide(placement);
  const isVertical = mainAxis === "x";
  let coords;
  switch (side) {
    case "top":
      coords = {
        x: commonX,
        y: reference.y - floating.height
      };
      break;
    case "bottom":
      coords = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;
    case "right":
      coords = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;
    case "left":
      coords = {
        x: reference.x - floating.width,
        y: commonY
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y
      };
  }
  switch (getAlignment(placement)) {
    case "start":
      coords[mainAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    case "end":
      coords[mainAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
      break;
  }
  return coords;
}
const computePosition$1 = async (reference, floating, config) => {
  const {
    placement = "bottom",
    strategy = "absolute",
    middleware = [],
    platform: platform2
  } = config;
  const validMiddleware = middleware.filter(Boolean);
  const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(floating));
  let rects = await platform2.getElementRects({
    reference,
    floating,
    strategy
  });
  let {
    x,
    y
  } = computeCoordsFromPlacement(rects, placement, rtl);
  let statefulPlacement = placement;
  let middlewareData = {};
  let resetCount = 0;
  for (let i = 0; i < validMiddleware.length; i++) {
    const {
      name,
      fn
    } = validMiddleware[i];
    const {
      x: nextX,
      y: nextY,
      data,
      reset
    } = await fn({
      x,
      y,
      initialPlacement: placement,
      placement: statefulPlacement,
      strategy,
      middlewareData,
      rects,
      platform: platform2,
      elements: {
        reference,
        floating
      }
    });
    x = nextX != null ? nextX : x;
    y = nextY != null ? nextY : y;
    middlewareData = {
      ...middlewareData,
      [name]: {
        ...middlewareData[name],
        ...data
      }
    };
    if (reset && resetCount <= 50) {
      resetCount++;
      if (typeof reset === "object") {
        if (reset.placement) {
          statefulPlacement = reset.placement;
        }
        if (reset.rects) {
          rects = reset.rects === true ? await platform2.getElementRects({
            reference,
            floating,
            strategy
          }) : reset.rects;
        }
        ({
          x,
          y
        } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
      }
      i = -1;
      continue;
    }
  }
  return {
    x,
    y,
    placement: statefulPlacement,
    strategy,
    middlewareData
  };
};
function expandPaddingObject(padding) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...padding
  };
}
function getSideObjectFromPadding(padding) {
  return typeof padding !== "number" ? expandPaddingObject(padding) : {
    top: padding,
    right: padding,
    bottom: padding,
    left: padding
  };
}
function rectToClientRect(rect) {
  return {
    ...rect,
    top: rect.y,
    left: rect.x,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  };
}
async function detectOverflow(state, options) {
  var _await$platform$isEle;
  if (options === void 0) {
    options = {};
  }
  const {
    x,
    y,
    platform: platform2,
    rects,
    elements,
    strategy
  } = state;
  const {
    boundary = "clippingAncestors",
    rootBoundary = "viewport",
    elementContext = "floating",
    altBoundary = false,
    padding = 0
  } = options;
  const paddingObject = getSideObjectFromPadding(padding);
  const altContext = elementContext === "floating" ? "reference" : "floating";
  const element = elements[altBoundary ? altContext : elementContext];
  const clippingClientRect = rectToClientRect(await platform2.getClippingRect({
    element: ((_await$platform$isEle = await (platform2.isElement == null ? void 0 : platform2.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || await (platform2.getDocumentElement == null ? void 0 : platform2.getDocumentElement(elements.floating)),
    boundary,
    rootBoundary,
    strategy
  }));
  const rect = elementContext === "floating" ? {
    ...rects.floating,
    x,
    y
  } : rects.reference;
  const offsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(elements.floating));
  const offsetScale = await (platform2.isElement == null ? void 0 : platform2.isElement(offsetParent)) ? await (platform2.getScale == null ? void 0 : platform2.getScale(offsetParent)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  };
  const elementClientRect = rectToClientRect(platform2.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform2.convertOffsetParentRelativeRectToViewportRelativeRect({
    rect,
    offsetParent,
    strategy
  }) : rect);
  return {
    top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
    bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
    left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
    right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
  };
}
const min$1 = Math.min;
const max$1 = Math.max;
function within(min$1$1, value, max$1$1) {
  return max$1(min$1$1, min$1(value, max$1$1));
}
const oppositeSideMap = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, (side) => oppositeSideMap[side]);
}
function getAlignmentSides(placement, rects, rtl) {
  if (rtl === void 0) {
    rtl = false;
  }
  const alignment = getAlignment(placement);
  const mainAxis = getMainAxisFromPlacement(placement);
  const length = getLengthFromAxis(mainAxis);
  let mainAlignmentSide = mainAxis === "x" ? alignment === (rtl ? "end" : "start") ? "right" : "left" : alignment === "start" ? "bottom" : "top";
  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }
  return {
    main: mainAlignmentSide,
    cross: getOppositePlacement(mainAlignmentSide)
  };
}
const oppositeAlignmentMap = {
  start: "end",
  end: "start"
};
function getOppositeAlignmentPlacement(placement) {
  return placement.replace(/start|end/g, (alignment) => oppositeAlignmentMap[alignment]);
}
function getExpandedPlacements(placement) {
  const oppositePlacement = getOppositePlacement(placement);
  return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
}
function getSideList(side, isStart, rtl) {
  const lr = ["left", "right"];
  const rl = ["right", "left"];
  const tb = ["top", "bottom"];
  const bt = ["bottom", "top"];
  switch (side) {
    case "top":
    case "bottom":
      if (rtl) return isStart ? rl : lr;
      return isStart ? lr : rl;
    case "left":
    case "right":
      return isStart ? tb : bt;
    default:
      return [];
  }
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
  const alignment = getAlignment(placement);
  let list = getSideList(getSide(placement), direction === "start", rtl);
  if (alignment) {
    list = list.map((side) => side + "-" + alignment);
    if (flipAlignment) {
      list = list.concat(list.map(getOppositeAlignmentPlacement));
    }
  }
  return list;
}
const flip = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "flip",
    options,
    async fn(state) {
      var _middlewareData$flip;
      const {
        placement,
        middlewareData,
        rects,
        initialPlacement,
        platform: platform2,
        elements
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true,
        fallbackPlacements: specifiedFallbackPlacements,
        fallbackStrategy = "bestFit",
        fallbackAxisSideDirection = "none",
        flipAlignment = true,
        ...detectOverflowOptions
      } = options;
      const side = getSide(placement);
      const isBasePlacement = getSide(initialPlacement) === initialPlacement;
      const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
      const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
      if (!specifiedFallbackPlacements && fallbackAxisSideDirection !== "none") {
        fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
      }
      const placements = [initialPlacement, ...fallbackPlacements];
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const overflows = [];
      let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
      if (checkMainAxis) {
        overflows.push(overflow[side]);
      }
      if (checkCrossAxis) {
        const {
          main,
          cross
        } = getAlignmentSides(placement, rects, rtl);
        overflows.push(overflow[main], overflow[cross]);
      }
      overflowsData = [...overflowsData, {
        placement,
        overflows
      }];
      if (!overflows.every((side2) => side2 <= 0)) {
        var _middlewareData$flip2, _overflowsData$filter;
        const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
        const nextPlacement = placements[nextIndex];
        if (nextPlacement) {
          return {
            data: {
              index: nextIndex,
              overflows: overflowsData
            },
            reset: {
              placement: nextPlacement
            }
          };
        }
        let resetPlacement = (_overflowsData$filter = overflowsData.filter((d) => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;
        if (!resetPlacement) {
          switch (fallbackStrategy) {
            case "bestFit": {
              var _overflowsData$map$so;
              const placement2 = (_overflowsData$map$so = overflowsData.map((d) => [d.placement, d.overflows.filter((overflow2) => overflow2 > 0).reduce((acc, overflow2) => acc + overflow2, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$map$so[0];
              if (placement2) {
                resetPlacement = placement2;
              }
              break;
            }
            case "initialPlacement":
              resetPlacement = initialPlacement;
              break;
          }
        }
        if (placement !== resetPlacement) {
          return {
            reset: {
              placement: resetPlacement
            }
          };
        }
      }
      return {};
    }
  };
};
async function convertValueToCoords(state, value) {
  const {
    placement,
    platform: platform2,
    elements
  } = state;
  const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
  const side = getSide(placement);
  getAlignment(placement);
  const isVertical = getMainAxisFromPlacement(placement) === "x";
  const mainAxisMulti = ["left", "top"].includes(side) ? -1 : 1;
  const crossAxisMulti = rtl && isVertical ? -1 : 1;
  const rawValue = value;
  let {
    mainAxis,
    crossAxis
  } = {
    mainAxis: rawValue,
    crossAxis: 0
  };
  return isVertical ? {
    x: crossAxis * crossAxisMulti,
    y: mainAxis * mainAxisMulti
  } : {
    x: mainAxis * mainAxisMulti,
    y: crossAxis * crossAxisMulti
  };
}
const offset = function(value) {
  return {
    name: "offset",
    options: value,
    async fn(state) {
      const {
        x,
        y
      } = state;
      const diffCoords = await convertValueToCoords(state, value);
      return {
        x: x + diffCoords.x,
        y: y + diffCoords.y,
        data: diffCoords
      };
    }
  };
};
function getCrossAxis(axis) {
  return axis === "x" ? "y" : "x";
}
const shift = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "shift",
    options,
    async fn(state) {
      const {
        x,
        y,
        placement
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = false,
        limiter = {
          fn: (_ref) => {
            let {
              x: x2,
              y: y2
            } = _ref;
            return {
              x: x2,
              y: y2
            };
          }
        },
        ...detectOverflowOptions
      } = options;
      const coords = {
        x,
        y
      };
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const mainAxis = getMainAxisFromPlacement(getSide(placement));
      const crossAxis = getCrossAxis(mainAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      if (checkMainAxis) {
        const minSide = mainAxis === "y" ? "top" : "left";
        const maxSide = mainAxis === "y" ? "bottom" : "right";
        const min2 = mainAxisCoord + overflow[minSide];
        const max2 = mainAxisCoord - overflow[maxSide];
        mainAxisCoord = within(min2, mainAxisCoord, max2);
      }
      if (checkCrossAxis) {
        const minSide = crossAxis === "y" ? "top" : "left";
        const maxSide = crossAxis === "y" ? "bottom" : "right";
        const min2 = crossAxisCoord + overflow[minSide];
        const max2 = crossAxisCoord - overflow[maxSide];
        crossAxisCoord = within(min2, crossAxisCoord, max2);
      }
      const limitedCoords = limiter.fn({
        ...state,
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      });
      return {
        ...limitedCoords,
        data: {
          x: limitedCoords.x - x,
          y: limitedCoords.y - y
        }
      };
    }
  };
};
const limitShift = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    options,
    fn(state) {
      const {
        x,
        y,
        placement,
        rects,
        middlewareData
      } = state;
      const {
        offset: offset2 = 0,
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true
      } = options;
      const coords = {
        x,
        y
      };
      const mainAxis = getMainAxisFromPlacement(placement);
      const crossAxis = getCrossAxis(mainAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      const rawOffset = typeof offset2 === "function" ? offset2(state) : offset2;
      const computedOffset = typeof rawOffset === "number" ? {
        mainAxis: rawOffset,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...rawOffset
      };
      if (checkMainAxis) {
        const len = mainAxis === "y" ? "height" : "width";
        const limitMin = rects.reference[mainAxis] - rects.floating[len] + computedOffset.mainAxis;
        const limitMax = rects.reference[mainAxis] + rects.reference[len] - computedOffset.mainAxis;
        if (mainAxisCoord < limitMin) {
          mainAxisCoord = limitMin;
        } else if (mainAxisCoord > limitMax) {
          mainAxisCoord = limitMax;
        }
      }
      if (checkCrossAxis) {
        var _middlewareData$offse, _middlewareData$offse2;
        const len = mainAxis === "y" ? "width" : "height";
        const isOriginSide = ["top", "left"].includes(getSide(placement));
        const limitMin = rects.reference[crossAxis] - rects.floating[len] + (isOriginSide ? ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse[crossAxis]) || 0 : 0) + (isOriginSide ? 0 : computedOffset.crossAxis);
        const limitMax = rects.reference[crossAxis] + rects.reference[len] + (isOriginSide ? 0 : ((_middlewareData$offse2 = middlewareData.offset) == null ? void 0 : _middlewareData$offse2[crossAxis]) || 0) - (isOriginSide ? computedOffset.crossAxis : 0);
        if (crossAxisCoord < limitMin) {
          crossAxisCoord = limitMin;
        } else if (crossAxisCoord > limitMax) {
          crossAxisCoord = limitMax;
        }
      }
      return {
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      };
    }
  };
};
function getWindow(node) {
  var _node$ownerDocument;
  return ((_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getComputedStyle$1(element) {
  return getWindow(element).getComputedStyle(element);
}
function isNode(value) {
  return value instanceof getWindow(value).Node;
}
function getNodeName(node) {
  return isNode(node) ? (node.nodeName || "").toLowerCase() : "";
}
let uaString;
function getUAString() {
  if (uaString) {
    return uaString;
  }
  const uaData = navigator.userAgentData;
  if (uaData && Array.isArray(uaData.brands)) {
    uaString = uaData.brands.map((item) => item.brand + "/" + item.version).join(" ");
    return uaString;
  }
  return navigator.userAgent;
}
function isHTMLElement(value) {
  return value instanceof getWindow(value).HTMLElement;
}
function isElement(value) {
  return value instanceof getWindow(value).Element;
}
function isShadowRoot(node) {
  if (typeof ShadowRoot === "undefined") {
    return false;
  }
  const OwnElement = getWindow(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}
function isOverflowElement(element) {
  const {
    overflow,
    overflowX,
    overflowY,
    display
  } = getComputedStyle$1(element);
  return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !["inline", "contents"].includes(display);
}
function isTableElement(element) {
  return ["table", "td", "th"].includes(getNodeName(element));
}
function isContainingBlock(element) {
  const isFirefox = /firefox/i.test(getUAString());
  const css = getComputedStyle$1(element);
  const backdropFilter = css.backdropFilter || css.WebkitBackdropFilter;
  return css.transform !== "none" || css.perspective !== "none" || (backdropFilter ? backdropFilter !== "none" : false) || isFirefox && css.willChange === "filter" || isFirefox && (css.filter ? css.filter !== "none" : false) || ["transform", "perspective"].some((value) => css.willChange.includes(value)) || ["paint", "layout", "strict", "content"].some((value) => {
    const contain = css.contain;
    return contain != null ? contain.includes(value) : false;
  });
}
function isClientRectVisualViewportBased() {
  return /^((?!chrome|android).)*safari/i.test(getUAString());
}
function isLastTraversableNode(node) {
  return ["html", "body", "#document"].includes(getNodeName(node));
}
const min = Math.min;
const max = Math.max;
const round = Math.round;
function getCssDimensions(element) {
  const css = getComputedStyle$1(element);
  let width = parseFloat(css.width);
  let height = parseFloat(css.height);
  const hasOffset = isHTMLElement(element);
  const offsetWidth = hasOffset ? element.offsetWidth : width;
  const offsetHeight = hasOffset ? element.offsetHeight : height;
  const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
  if (shouldFallback) {
    width = offsetWidth;
    height = offsetHeight;
  }
  return {
    width,
    height,
    fallback: shouldFallback
  };
}
function unwrapElement(element) {
  return !isElement(element) ? element.contextElement : element;
}
const FALLBACK_SCALE = {
  x: 1,
  y: 1
};
function getScale(element) {
  const domElement = unwrapElement(element);
  if (!isHTMLElement(domElement)) {
    return FALLBACK_SCALE;
  }
  const rect = domElement.getBoundingClientRect();
  const {
    width,
    height,
    fallback
  } = getCssDimensions(domElement);
  let x = (fallback ? round(rect.width) : rect.width) / width;
  let y = (fallback ? round(rect.height) : rect.height) / height;
  if (!x || !Number.isFinite(x)) {
    x = 1;
  }
  if (!y || !Number.isFinite(y)) {
    y = 1;
  }
  return {
    x,
    y
  };
}
function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
  var _win$visualViewport, _win$visualViewport2;
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  const clientRect = element.getBoundingClientRect();
  const domElement = unwrapElement(element);
  let scale = FALLBACK_SCALE;
  if (includeScale) {
    if (offsetParent) {
      if (isElement(offsetParent)) {
        scale = getScale(offsetParent);
      }
    } else {
      scale = getScale(element);
    }
  }
  const win = domElement ? getWindow(domElement) : window;
  const addVisualOffsets = isClientRectVisualViewportBased() && isFixedStrategy;
  let x = (clientRect.left + (addVisualOffsets ? ((_win$visualViewport = win.visualViewport) == null ? void 0 : _win$visualViewport.offsetLeft) || 0 : 0)) / scale.x;
  let y = (clientRect.top + (addVisualOffsets ? ((_win$visualViewport2 = win.visualViewport) == null ? void 0 : _win$visualViewport2.offsetTop) || 0 : 0)) / scale.y;
  let width = clientRect.width / scale.x;
  let height = clientRect.height / scale.y;
  if (domElement) {
    const win2 = getWindow(domElement);
    const offsetWin = offsetParent && isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
    let currentIFrame = win2.frameElement;
    while (currentIFrame && offsetParent && offsetWin !== win2) {
      const iframeScale = getScale(currentIFrame);
      const iframeRect = currentIFrame.getBoundingClientRect();
      const css = getComputedStyle(currentIFrame);
      iframeRect.x += (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
      iframeRect.y += (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
      x *= iframeScale.x;
      y *= iframeScale.y;
      width *= iframeScale.x;
      height *= iframeScale.y;
      x += iframeRect.x;
      y += iframeRect.y;
      currentIFrame = getWindow(currentIFrame).frameElement;
    }
  }
  return rectToClientRect({
    width,
    height,
    x,
    y
  });
}
function getDocumentElement(node) {
  return ((isNode(node) ? node.ownerDocument : node.document) || window.document).documentElement;
}
function getNodeScroll(element) {
  if (isElement(element)) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }
  return {
    scrollLeft: element.pageXOffset,
    scrollTop: element.pageYOffset
  };
}
function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
  let {
    rect,
    offsetParent,
    strategy
  } = _ref;
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  if (offsetParent === documentElement) {
    return rect;
  }
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  let scale = {
    x: 1,
    y: 1
  };
  const offsets = {
    x: 0,
    y: 0
  };
  if (isOffsetParentAnElement || !isOffsetParentAnElement && strategy !== "fixed") {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent);
      scale = getScale(offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }
  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x,
    y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y
  };
}
function getWindowScrollBarX(element) {
  return getBoundingClientRect(getDocumentElement(element)).left + getNodeScroll(element).scrollLeft;
}
function getDocumentRect(element) {
  const html = getDocumentElement(element);
  const scroll = getNodeScroll(element);
  const body = element.ownerDocument.body;
  const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
  const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
  let x = -scroll.scrollLeft + getWindowScrollBarX(element);
  const y = -scroll.scrollTop;
  if (getComputedStyle$1(body).direction === "rtl") {
    x += max(html.clientWidth, body.clientWidth) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
}
function getParentNode(node) {
  if (getNodeName(node) === "html") {
    return node;
  }
  const result = (
    // Step into the shadow DOM of the parent of a slotted node.
    node.assignedSlot || // DOM Element detected.
    node.parentNode || // ShadowRoot detected.
    isShadowRoot(node) && node.host || // Fallback.
    getDocumentElement(node)
  );
  return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
  const parentNode = getParentNode(node);
  if (isLastTraversableNode(parentNode)) {
    return parentNode.ownerDocument.body;
  }
  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }
  return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list) {
  var _node$ownerDocument;
  if (list === void 0) {
    list = [];
  }
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === ((_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.body);
  const win = getWindow(scrollableAncestor);
  if (isBody) {
    return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : []);
  }
  return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor));
}
function getViewportRect(element, strategy) {
  const win = getWindow(element);
  const html = getDocumentElement(element);
  const visualViewport = win.visualViewport;
  let width = html.clientWidth;
  let height = html.clientHeight;
  let x = 0;
  let y = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    const visualViewportBased = isClientRectVisualViewportBased();
    if (!visualViewportBased || visualViewportBased && strategy === "fixed") {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x,
    y
  };
}
function getInnerBoundingClientRect(element, strategy) {
  const clientRect = getBoundingClientRect(element, true, strategy === "fixed");
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  const scale = isHTMLElement(element) ? getScale(element) : {
    x: 1,
    y: 1
  };
  const width = element.clientWidth * scale.x;
  const height = element.clientHeight * scale.y;
  const x = left * scale.x;
  const y = top * scale.y;
  return {
    width,
    height,
    x,
    y
  };
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
  let rect;
  if (clippingAncestor === "viewport") {
    rect = getViewportRect(element, strategy);
  } else if (clippingAncestor === "document") {
    rect = getDocumentRect(getDocumentElement(element));
  } else if (isElement(clippingAncestor)) {
    rect = getInnerBoundingClientRect(clippingAncestor, strategy);
  } else {
    const mutableRect = {
      ...clippingAncestor
    };
    if (isClientRectVisualViewportBased()) {
      var _win$visualViewport, _win$visualViewport2;
      const win = getWindow(element);
      mutableRect.x -= ((_win$visualViewport = win.visualViewport) == null ? void 0 : _win$visualViewport.offsetLeft) || 0;
      mutableRect.y -= ((_win$visualViewport2 = win.visualViewport) == null ? void 0 : _win$visualViewport2.offsetTop) || 0;
    }
    rect = mutableRect;
  }
  return rectToClientRect(rect);
}
function getClippingElementAncestors(element, cache) {
  const cachedResult = cache.get(element);
  if (cachedResult) {
    return cachedResult;
  }
  let result = getOverflowAncestors(element).filter((el) => isElement(el) && getNodeName(el) !== "body");
  let currentContainingBlockComputedStyle = null;
  const elementIsFixed = getComputedStyle$1(element).position === "fixed";
  let currentNode = elementIsFixed ? getParentNode(element) : element;
  while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
    const computedStyle = getComputedStyle$1(currentNode);
    const containingBlock = isContainingBlock(currentNode);
    if (computedStyle.position === "fixed") {
      currentContainingBlockComputedStyle = null;
    }
    const shouldDropCurrentNode = elementIsFixed ? !containingBlock && !currentContainingBlockComputedStyle : !containingBlock && computedStyle.position === "static" && !!currentContainingBlockComputedStyle && ["absolute", "fixed"].includes(currentContainingBlockComputedStyle.position);
    if (shouldDropCurrentNode) {
      result = result.filter((ancestor) => ancestor !== currentNode);
    } else {
      currentContainingBlockComputedStyle = computedStyle;
    }
    currentNode = getParentNode(currentNode);
  }
  cache.set(element, result);
  return result;
}
function getClippingRect(_ref) {
  let {
    element,
    boundary,
    rootBoundary,
    strategy
  } = _ref;
  const elementClippingAncestors = boundary === "clippingAncestors" ? getClippingElementAncestors(element, this._c) : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
  const firstClippingAncestor = clippingAncestors[0];
  const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
    const rect = getClientRectFromClippingAncestor(element, clippingAncestor, strategy);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
  return {
    width: clippingRect.right - clippingRect.left,
    height: clippingRect.bottom - clippingRect.top,
    x: clippingRect.left,
    y: clippingRect.top
  };
}
function getDimensions(element) {
  return getCssDimensions(element);
}
function getTrueOffsetParent(element, polyfill) {
  if (!isHTMLElement(element) || getComputedStyle$1(element).position === "fixed") {
    return null;
  }
  if (polyfill) {
    return polyfill(element);
  }
  return element.offsetParent;
}
function getContainingBlock(element) {
  let currentNode = getParentNode(element);
  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else {
      currentNode = getParentNode(currentNode);
    }
  }
  return null;
}
function getOffsetParent(element, polyfill) {
  const window2 = getWindow(element);
  if (!isHTMLElement(element)) {
    return window2;
  }
  let offsetParent = getTrueOffsetParent(element, polyfill);
  while (offsetParent && isTableElement(offsetParent) && getComputedStyle$1(offsetParent).position === "static") {
    offsetParent = getTrueOffsetParent(offsetParent, polyfill);
  }
  if (offsetParent && (getNodeName(offsetParent) === "html" || getNodeName(offsetParent) === "body" && getComputedStyle$1(offsetParent).position === "static" && !isContainingBlock(offsetParent))) {
    return window2;
  }
  return offsetParent || getContainingBlock(element) || window2;
}
function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  const rect = getBoundingClientRect(element, true, strategy === "fixed", offsetParent);
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const offsets = {
    x: 0,
    y: 0
  };
  if (isOffsetParentAnElement || !isOffsetParentAnElement && strategy !== "fixed") {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent, true);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }
  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}
const platform = {
  getClippingRect,
  convertOffsetParentRelativeRectToViewportRelativeRect,
  isElement,
  getDimensions,
  getOffsetParent,
  getDocumentElement,
  getScale,
  async getElementRects(_ref) {
    let {
      reference,
      floating,
      strategy
    } = _ref;
    const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
    const getDimensionsFn = this.getDimensions;
    return {
      reference: getRectRelativeToOffsetParent(reference, await getOffsetParentFn(floating), strategy),
      floating: {
        x: 0,
        y: 0,
        ...await getDimensionsFn(floating)
      }
    };
  },
  getClientRects: (element) => Array.from(element.getClientRects()),
  isRTL: (element) => getComputedStyle$1(element).direction === "rtl"
};
function autoUpdate(reference, floating, update, options) {
  if (options === void 0) {
    options = {};
  }
  const {
    ancestorScroll: _ancestorScroll = true,
    ancestorResize = true,
    elementResize = true,
    animationFrame = false
  } = options;
  const ancestorScroll = _ancestorScroll && !animationFrame;
  const ancestors = ancestorScroll || ancestorResize ? [...isElement(reference) ? getOverflowAncestors(reference) : reference.contextElement ? getOverflowAncestors(reference.contextElement) : [], ...getOverflowAncestors(floating)] : [];
  ancestors.forEach((ancestor) => {
    ancestorScroll && ancestor.addEventListener("scroll", update, {
      passive: true
    });
    ancestorResize && ancestor.addEventListener("resize", update);
  });
  let observer = null;
  if (elementResize) {
    observer = new ResizeObserver(() => {
      update();
    });
    isElement(reference) && !animationFrame && observer.observe(reference);
    if (!isElement(reference) && reference.contextElement && !animationFrame) {
      observer.observe(reference.contextElement);
    }
    observer.observe(floating);
  }
  let frameId;
  let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
  if (animationFrame) {
    frameLoop();
  }
  function frameLoop() {
    const nextRefRect = getBoundingClientRect(reference);
    if (prevRefRect && (nextRefRect.x !== prevRefRect.x || nextRefRect.y !== prevRefRect.y || nextRefRect.width !== prevRefRect.width || nextRefRect.height !== prevRefRect.height)) {
      update();
    }
    prevRefRect = nextRefRect;
    frameId = requestAnimationFrame(frameLoop);
  }
  update();
  return () => {
    var _observer;
    ancestors.forEach((ancestor) => {
      ancestorScroll && ancestor.removeEventListener("scroll", update);
      ancestorResize && ancestor.removeEventListener("resize", update);
    });
    (_observer = observer) == null ? void 0 : _observer.disconnect();
    observer = null;
    if (animationFrame) {
      cancelAnimationFrame(frameId);
    }
  };
}
const computePosition = (reference, floating, options) => {
  const cache = /* @__PURE__ */ new Map();
  const mergedOptions = {
    platform,
    ...options
  };
  const platformWithCache = {
    ...mergedOptions.platform,
    _c: cache
  };
  return computePosition$1(reference, floating, {
    ...mergedOptions,
    platform: platformWithCache
  });
};
const FindRanges = (text, search) => {
  const ranges = [];
  let currentIndex = 0;
  let index = text.toLowerCase().indexOf(search.toLowerCase(), currentIndex);
  let i = 0;
  while (index > -1 && i < text.length) {
    currentIndex = index + search.length;
    ranges.push({ start: index, end: currentIndex });
    index = text.toLowerCase().indexOf(search.toLowerCase(), currentIndex);
    i++;
  }
  return ranges;
};
const _sfc_main$3 = {
  name: "NcHighlight",
  props: {
    /**
     * The string to display
     */
    text: {
      type: String,
      default: ""
    },
    /**
     * The string to match and highlight
     */
    search: {
      type: String,
      default: ""
    },
    /**
     * The ranges to highlight, takes precedence over the search prop.
     */
    highlight: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    /**
     * The indice ranges which should be highlighted.
     * If an array with ranges is provided, we use it. Otherwise
     * we calculate it based on the provided substring to highlight.
     *
     * @return {Array} The array of ranges to highlight
     */
    ranges() {
      let ranges = [];
      if (!this.search && this.highlight.length === 0) {
        return ranges;
      }
      if (this.highlight.length > 0) {
        ranges = this.highlight;
      } else {
        ranges = FindRanges(this.text, this.search);
      }
      ranges.forEach((range, i) => {
        if (range.end < range.start) {
          ranges[i] = {
            start: range.end,
            end: range.start
          };
        }
      });
      ranges = ranges.reduce((validRanges, range) => {
        if (range.start < this.text.length && range.end > 0) {
          validRanges.push({
            start: range.start < 0 ? 0 : range.start,
            end: range.end > this.text.length ? this.text.length : range.end
          });
        }
        return validRanges;
      }, []);
      ranges.sort((a, b) => {
        return a.start - b.start;
      });
      ranges = ranges.reduce((mergedRanges, range) => {
        if (!mergedRanges.length) {
          mergedRanges.push(range);
        } else {
          const idx = mergedRanges.length - 1;
          if (mergedRanges[idx].end >= range.start) {
            mergedRanges[idx] = {
              start: mergedRanges[idx].start,
              end: Math.max(mergedRanges[idx].end, range.end)
            };
          } else {
            mergedRanges.push(range);
          }
        }
        return mergedRanges;
      }, []);
      return ranges;
    },
    /**
     * Calculate the different chunks to show based on the ranges to highlight.
     *
     * @return {Array} The chunks
     */
    chunks() {
      if (this.ranges.length === 0) {
        return [{
          start: 0,
          end: this.text.length,
          highlight: false,
          text: this.text
        }];
      }
      const chunks = [];
      let currentIndex = 0;
      let currentRange = 0;
      while (currentIndex < this.text.length) {
        const range = this.ranges[currentRange];
        if (range.start === currentIndex) {
          chunks.push({
            ...range,
            highlight: true,
            text: this.text.slice(range.start, range.end)
          });
          currentRange++;
          currentIndex = range.end;
          if (currentRange >= this.ranges.length && currentIndex < this.text.length) {
            chunks.push({
              start: currentIndex,
              end: this.text.length,
              highlight: false,
              text: this.text.slice(currentIndex)
            });
            currentIndex = this.text.length;
          }
          continue;
        }
        chunks.push({
          start: currentIndex,
          end: range.start,
          highlight: false,
          text: this.text.slice(currentIndex, range.start)
        });
        currentIndex = range.start;
      }
      return chunks;
    }
  },
  /**
   * The render function to display the component
   *
   * @param {Function} h The function to create VNodes
   * @return {object} The created VNode
   */
  render(h) {
    if (!this.ranges.length) {
      return h("span", {}, this.text);
    }
    return h("span", {}, this.chunks.map((chunk) => {
      return chunk.highlight ? h("strong", {}, chunk.text) : chunk.text;
    }));
  }
};
const _sfc_render$3 = null;
const _sfc_staticRenderFns$3 = null;
var __component__$3 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$3,
  _sfc_render$3,
  _sfc_staticRenderFns$3,
  false,
  null,
  null
);
const NcHighlight = __component__$3.exports;
const _sfc_main$2 = {
  name: "NcEllipsisedOption",
  components: {
    NcHighlight
  },
  props: {
    /**
     * The text to be display in one line. If it is longer than 10 characters, it is be truncated with ellipsis in the end but keeping up to 10 last characters to fit the parent container.
     */
    name: {
      type: String,
      default: ""
    },
    /**
     * The search value to highlight in the text
     */
    search: {
      type: String,
      default: ""
    }
  },
  computed: {
    needsTruncate() {
      return this.name && this.name.length >= 10;
    },
    /**
     * Index at which to split the name if it is longer than 10 characters.
     *
     * @return {number} The position at which to split
     */
    split() {
      return this.name.length - Math.min(Math.floor(this.name.length / 2), 10);
    },
    part1() {
      if (this.needsTruncate) {
        return this.name.slice(0, this.split);
      }
      return this.name;
    },
    part2() {
      if (this.needsTruncate) {
        return this.name.slice(this.split);
      }
      return "";
    },
    /**
     * The ranges to highlight. Since we split the string for ellipsising,
     * the Highlight component cannot figure this out itself and needs the ranges provided.
     *
     * @return {Array} The array with the ranges to highlight
     */
    highlight1() {
      if (!this.search) {
        return [];
      }
      return FindRanges(this.name, this.search);
    },
    /**
     * We shift the ranges for the second part by the position of the split.
     * Ranges out of the string length are discarded by the Highlight component,
     * so we don't need to take care of this here.
     *
     * @return {Array} The array with the ranges to highlight
     */
    highlight2() {
      return this.highlight1.map((range) => {
        return {
          start: range.start - this.split,
          end: range.end - this.split
        };
      });
    }
  }
};
var _sfc_render$2 = function render2() {
  var _vm = this, _c = _vm._self._c;
  return _c("span", { staticClass: "name-parts", attrs: { "dir": "auto", "title": _vm.name } }, [_c("NcHighlight", { staticClass: "name-parts__first", attrs: { "text": _vm.part1, "search": _vm.search, "highlight": _vm.highlight1 } }), _vm.part2 ? _c("NcHighlight", { staticClass: "name-parts__last", attrs: { "text": _vm.part2, "search": _vm.search, "highlight": _vm.highlight2 } }) : _vm._e()], 1);
};
var _sfc_staticRenderFns$2 = [];
var __component__$2 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$2,
  _sfc_render$2,
  _sfc_staticRenderFns$2,
  false,
  null,
  "f6384352"
);
const NcEllipsisedOption = __component__$2.exports;
const margin = 8;
const defaultSize = 32;
const _sfc_main$1 = {
  name: "NcListItemIcon",
  components: {
    NcAvatar,
    NcHighlight,
    NcIconSvgWrapper
  },
  mixins: [
    userStatus
  ],
  props: {
    /**
     * Default first line text
     */
    name: {
      type: String,
      required: true
    },
    /**
     * Secondary optional line
     * Only visible on size of 32 and above
     */
    subname: {
      type: String,
      default: ""
    },
    /**
     * Icon class to be displayed at the end of the component
     */
    icon: {
      type: String,
      default: ""
    },
    /**
     * SVG icon to be displayed at the end of the component
     */
    iconSvg: {
      type: String,
      default: ""
    },
    /**
     * Descriptive name for the icon
     */
    iconName: {
      type: String,
      default: ""
    },
    /**
     * Search within the highlight of name/subname
     */
    search: {
      type: String,
      default: ""
    },
    /**
     * Set a size in px that will define the avatar height/width
     * and therefore, the height of the component
     */
    avatarSize: {
      type: Number,
      default: defaultSize
    },
    /**
     * Disable the margins of this component.
     * Useful for integration in `NcSelect` for example
     */
    noMargin: {
      type: Boolean,
      default: false
    },
    /**
     * See the [Avatar](#Avatar) displayName prop
     * Fallback to name
     */
    displayName: {
      type: String,
      default: null
    },
    /**
     * See the [Avatar](#Avatar) isNoUser prop
     * Enable/disable the UserStatus fetching
     */
    isNoUser: {
      type: Boolean,
      default: false
    },
    /**
     * Unique list item ID
     */
    id: {
      type: String,
      default: null
    }
  },
  setup() {
    return {
      margin,
      defaultSize
    };
  },
  computed: {
    hasIcon() {
      return this.icon !== "";
    },
    hasIconSvg() {
      return this.iconSvg !== "";
    },
    isValidSubname() {
      return this.subname?.trim?.() !== "";
    },
    isSizeBigEnough() {
      return this.avatarSize >= 26;
    },
    cssVars() {
      const margin2 = this.noMargin ? 0 : this.margin;
      return {
        "--height": this.avatarSize + 2 * margin2 + "px",
        "--margin": this.margin + "px"
      };
    },
    /**
     * Seperates the search property into two parts, the first one is the search part on the name, the second on the subname.
     * @return {[string, string]}
     */
    searchParts() {
      const EMAIL_NOTATION = /^([^<]*)<([^>]+)>?$/;
      const match = this.search.match(EMAIL_NOTATION);
      if (this.isNoUser || !match) {
        return [this.search, this.search];
      }
      return [match[1].trim(), match[2]];
    }
  },
  beforeMount() {
    if (!this.isNoUser && !this.subname) {
      this.fetchUserStatus(this.user);
    }
  }
};
var _sfc_render$1 = function render3() {
  var _vm = this, _c = _vm._self._c;
  return _c("span", _vm._g({ staticClass: "option", class: { "option--compact": _vm.avatarSize < _vm.defaultSize }, style: _vm.cssVars, attrs: { "id": _vm.id } }, _vm.$listeners), [_c("NcAvatar", _vm._b({ staticClass: "option__avatar", attrs: { "disable-menu": true, "disable-tooltip": true, "display-name": _vm.displayName || _vm.name, "is-no-user": _vm.isNoUser, "size": _vm.avatarSize } }, "NcAvatar", _vm.$attrs, false)), _c("div", { staticClass: "option__details" }, [_c("NcHighlight", { staticClass: "option__lineone", attrs: { "text": _vm.name, "search": _vm.searchParts[0] } }), _vm.isValidSubname && _vm.isSizeBigEnough ? _c("NcHighlight", { staticClass: "option__linetwo", attrs: { "text": _vm.subname, "search": _vm.searchParts[1] } }) : _vm.hasStatus ? _c("span", [_c("span", [_vm._v(_vm._s(_vm.userStatus.icon))]), _c("span", [_vm._v(_vm._s(_vm.userStatus.message))])]) : _vm._e()], 1), _vm._t("default", function() {
    return [_vm.hasIconSvg ? _c("NcIconSvgWrapper", { staticClass: "option__icon", attrs: { "svg": _vm.iconSvg, "name": _vm.iconName } }) : _vm.hasIcon ? _c("span", { staticClass: "icon option__icon", class: _vm.icon, attrs: { "aria-label": _vm.iconName } }) : _vm._e()];
  })], 2);
};
var _sfc_staticRenderFns$1 = [];
var __component__$1 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$1,
  _sfc_render$1,
  _sfc_staticRenderFns$1,
  false,
  null,
  "a0f4d73a"
);
const NcListItemIcon = __component__$1.exports;
register(t15, t35);
const _sfc_main = {
  name: "NcSelect",
  components: {
    ChevronDown,
    NcEllipsisedOption,
    NcListItemIcon,
    NcLoadingIcon,
    VueSelect: vueSelectExports.VueSelect
  },
  model: {
    prop: "modelValue",
    event: "update:modelValue"
  },
  props: {
    // Add VueSelect props to $props
    ...vueSelectExports.VueSelect.props,
    ...vueSelectExports.VueSelect.mixins.reduce((allProps, mixin) => ({ ...allProps, ...mixin.props }), {}),
    /**
     * `aria-label` for the clear input button
     */
    ariaLabelClearSelected: {
      type: String,
      default: t("Clear selected")
    },
    /**
     * `aria-label` for the search input
     *
     * A descriptive `inputLabel` is preferred as this is not visible.
     */
    ariaLabelCombobox: {
      type: String,
      default: null
    },
    /**
     * `aria-label` for the listbox element
     */
    ariaLabelListbox: {
      type: String,
      default: t("Options")
    },
    /**
     * Allows to customize the `aria-label` for the deselect-option button
     * The default is "Deselect " + optionLabel
     * @type {(optionLabel: string) => string}
     */
    ariaLabelDeselectOption: {
      type: Function,
      default: (optionLabel) => t("Deselect {option}", { option: optionLabel })
    },
    /**
     * Append the dropdown element to the end of the body
     * and size/position it dynamically.
     *
     * @see https://vue-select.org/api/props.html#appendtobody
     */
    appendToBody: {
      type: Boolean,
      default: true
    },
    /**
     * When `appendToBody` is true, this function is responsible for
     * positioning the drop down list.
     *
     * If a function is returned from `calculatePosition`, it will
     * be called when the drop down list is removed from the DOM.
     * This allows for any garbage collection you may need to do.
     *
     * @see https://vue-select.org/api/props.html#calculateposition
     */
    calculatePosition: {
      type: Function,
      default: null
    },
    /**
     * Close the dropdown when selecting an option.
     *
     * @deprecated Use the `keepOpen` prop instead
     */
    closeOnSelect: {
      type: Boolean,
      default: true
    },
    /**
     * Keep the dropdown open after selecting an option.
     *
     * @default false
     * @since 8.25.0
     */
    keepOpen: {
      type: Boolean,
      default: false
    },
    /**
     * Replace default vue-select components
     *
     * @see https://vue-select.org/api/props.html#components
     */
    components: {
      type: Object,
      default: () => ({
        Deselect: {
          render: (createElement) => createElement(Close, {
            props: {
              size: 20,
              fillColor: "var(--vs-controls-color)"
            },
            style: {
              cursor: "pointer"
            }
          })
        }
      })
    },
    /**
     * Sets the maximum number of options to display in the dropdown list
     */
    limit: {
      type: Number,
      default: null
    },
    /**
     * Disable the component
     *
     * @see https://vue-select.org/api/props.html#disabled
     */
    disabled: {
      type: Boolean,
      default: false
    },
    /**
     * Determines whether the dropdown should be open.
     * Receives the component instance as the only argument.
     *
     * @see https://vue-select.org/api/props.html#dropdownshouldopen
     */
    dropdownShouldOpen: {
      type: Function,
      default: ({ noDrop, open }) => {
        return noDrop ? false : open;
      }
    },
    /**
     * Callback to determine if the provided option should
     * match the current search text. Used to determine
     * if the option should be displayed.
     *
     * Defaults to the internal vue-select function documented at the link
     * below
     *
     * Enabling `userSelect` will automatically set this to filter by the
     * `displayName` and `subname` properties of the user option object
     * unless this prop is set explicitly
     *
     * @see https://vue-select.org/api/props.html#filterby
     */
    filterBy: {
      type: Function,
      default: null
    },
    /**
     * Class for the `input`
     *
     * Necessary for use in NcActionInput
     */
    inputClass: {
      type: [String, Object],
      default: null
    },
    /**
     * Input element id
     */
    inputId: {
      type: String,
      default: () => `select-input-${GenRandomId()}`
    },
    /**
     * Visible label for the input element
     *
     * @todo Set default for @nextcloud/vue 9
     */
    inputLabel: {
      type: String,
      default: null
    },
    /**
     * Pass true if you are using an external label
     */
    labelOutside: {
      type: Boolean,
      default: false
    },
    /**
     * Display a visible border around dropdown options
     * which have keyboard focus
     */
    keyboardFocusBorder: {
      type: Boolean,
      default: true
    },
    /**
     * Key of the displayed label for object options
     *
     * Defaults to the internal vue-select string documented at the link
     * below
     *
     * Enabling `userSelect` will automatically set this to `'displayName'`
     * unless this prop is set explicitly
     *
     * @see https://vue-select.org/api/props.html#label
     */
    label: {
      type: String,
      default: null
    },
    /**
     * Show the loading icon
     *
     * @see https://vue-select.org/api/props.html#loading
     */
    loading: {
      type: Boolean,
      default: false
    },
    /**
     * Allow selection of multiple options
     *
     * @see https://vue-select.org/api/props.html#multiple
     */
    multiple: {
      type: Boolean,
      default: false
    },
    /**
     * Disable automatic wrapping when selected options overflow the width
     */
    noWrap: {
      type: Boolean,
      default: false
    },
    /**
     * Array of options
     *
     * @type {Array<string | number | Record<string | number, any>>}
     *
     * @see https://vue-select.org/api/props.html#options
     */
    options: {
      type: Array,
      default: () => []
    },
    /**
     * Placeholder text
     *
     * @see https://vue-select.org/api/props.html#placeholder
     */
    placeholder: {
      type: String,
      default: ""
    },
    /**
     * Customized component's response to keydown events while the search input has focus
     *
     * @see https://vue-select.org/guide/keydown.html#mapkeydown
     */
    mapKeydown: {
      type: Function,
      /**
       * Patched Vue-Select keydown events handlers map to stop Escape propagation in open select
       *
       * @param {Record<number, Function>} map - Mapped keyCode to handlers { <keyCode>:<callback> }
       * @param {import('@nextcloud/vue-select').VueSelect} vm - VueSelect instance
       * @return {Record<number, Function>} patched keydown event handlers
       */
      default(map, vm) {
        return {
          ...map,
          /**
           * Patched Escape handler to stop propagation from open select
           *
           * @param {KeyboardEvent} event - default keydown event handler
           */
          27: (event) => {
            if (vm.open) {
              event.stopPropagation();
            }
            map[27](event);
          }
        };
      }
    },
    /**
     * A unique identifier used to generate IDs and DOM attributes. Must be unique for every instance of the component.
     *
     * @see https://vue-select.org/api/props.html#uid
     */
    uid: {
      type: String,
      default: () => GenRandomId()
    },
    /**
     * When `appendToBody` is true, this sets the placement of the dropdown
     *
     * @type {'bottom' | 'top'}
     */
    placement: {
      type: String,
      default: "bottom"
    },
    /**
     * If false, the focused dropdown option will not be reset when filtered
     * options change
     */
    resetFocusOnOptionsChange: {
      type: Boolean,
      default: true
    },
    /**
     * Enable the user selector with avatars
     *
     * Objects must contain the data expected by the
     * [NcListItemIcon](#/Components/NcListItemIcon) and
     * [NcAvatar](#/Components/NcAvatar) components
     *
     * @deprecated Use the `NcSelectUsers` component instead
     */
    userSelect: {
      type: Boolean,
      default: false
    },
    /**
     * Removed in v9 - use `modelValue` (`v-model`) instead
     * @deprecated
     */
    value: {
      type: [String, Number, Object, Array],
      default: void 0
    },
    /**
     * Currently selected value
     *
     * The `v-model` directive may be used for two-way data binding
     *
     * @type {string | number | Record<string | number, any> | Array<any>}
     *
     * @see https://vue-select.org/api/props.html#value
     */
    modelValue: {
      type: [String, Number, Object, Array],
      default: null
    },
    /**
     * Enable if a value is required for native form validation
     */
    required: {
      type: Boolean,
      default: false
    },
    /**
     * Any available prop
     *
     * @see https://vue-select.org/api/props.html
     */
    // Not an actual prop but needed to show in vue-styleguidist docs
    // eslint-disable-next-line
    " ": {}
  },
  emits: [
    /**
     * All events from https://vue-select.org/api/events.html
     */
    // Not an actual event but needed to show in vue-styleguidist docs
    " ",
    /**
     * Removed in v9 - use `update:modelValue` (`v-model`) instead
     * @deprecated
     */
    "input",
    "update:modelValue",
    /** Same as update:modelValue for Vue 2 compatibility */
    "update:model-value"
  ],
  setup() {
    const clickableArea = Number.parseInt(window.getComputedStyle(document.body).getPropertyValue("--default-clickable-area"));
    const gridBaseLine = Number.parseInt(window.getComputedStyle(document.body).getPropertyValue("--default-grid-baseline"));
    const avatarSize = clickableArea - 2 * gridBaseLine;
    const model = useModelMigration("value", "input");
    return {
      avatarSize,
      model
    };
  },
  data() {
    return {
      search: ""
    };
  },
  computed: {
    inputRequired() {
      if (!this.required) {
        return null;
      }
      return this.model === null || Array.isArray(this.model) && this.model.length === 0;
    },
    localCalculatePosition() {
      if (this.calculatePosition !== null) {
        return this.calculatePosition;
      }
      return (dropdownMenu, component, { width }) => {
        dropdownMenu.style.width = width;
        const addClass = {
          name: "addClass",
          fn(_middlewareArgs) {
            dropdownMenu.classList.add("vs__dropdown-menu--floating");
            return {};
          }
        };
        const togglePlacementClass = {
          name: "togglePlacementClass",
          fn({ placement }) {
            component.$el.classList.toggle(
              "select--drop-up",
              placement === "top"
            );
            dropdownMenu.classList.toggle(
              "vs__dropdown-menu--floating-placement-top",
              placement === "top"
            );
            return {};
          }
        };
        const updatePosition = () => {
          computePosition(component.$refs.toggle, dropdownMenu, {
            placement: this.placement,
            middleware: [
              offset(-1),
              addClass,
              togglePlacementClass,
              // Match popperjs default collision prevention behavior by appending the following middleware in order
              flip(),
              shift({ limiter: limitShift() })
            ]
          }).then(({ x, y }) => {
            Object.assign(dropdownMenu.style, {
              left: `${x}px`,
              top: `${y}px`,
              width: `${component.$refs.toggle.getBoundingClientRect().width}px`
            });
          });
        };
        const cleanup = autoUpdate(
          component.$refs.toggle,
          dropdownMenu,
          updatePosition
        );
        return cleanup;
      };
    },
    localFilterBy() {
      const EMAIL_NOTATION = /[^<]*<([^>]+)/;
      if (this.filterBy !== null) {
        return this.filterBy;
      }
      if (this.userSelect) {
        return (option, label, search) => {
          const match = search.match(EMAIL_NOTATION);
          return match && option.subname?.toLocaleLowerCase?.()?.indexOf(match[1].toLocaleLowerCase()) > -1 || `${label} ${option.subname}`.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) > -1;
        };
      }
      return vueSelectExports.VueSelect.props.filterBy.default;
    },
    localLabel() {
      if (this.label !== null) {
        return this.label;
      }
      if (this.userSelect) {
        return "displayName";
      }
      return vueSelectExports.VueSelect.props.label.default;
    },
    propsToForward() {
      const vueSelectKeys = [
        ...Object.keys(vueSelectExports.VueSelect.props),
        ...vueSelectExports.VueSelect.mixins.flatMap((mixin) => Object.keys(mixin.props ?? {}))
      ];
      const initialPropsToForward = Object.fromEntries(
        Object.entries(this.$props).filter(([key, _value]) => vueSelectKeys.includes(key))
      );
      const propsToForward = {
        ...initialPropsToForward,
        // Custom overrides of vue-select props
        value: this.model,
        calculatePosition: this.localCalculatePosition,
        closeOnSelect: this.closeOnSelect && !this.keepOpen,
        filterBy: this.localFilterBy,
        label: this.localLabel
      };
      return propsToForward;
    },
    listenersToForward() {
      return {
        ...this.$listeners,
        input: ($event) => {
          this.model = $event;
        }
      };
    }
  },
  mounted() {
    if (!this.labelOutside && !this.inputLabel && !this.ariaLabelCombobox) {
      Vue.util.warn("[NcSelect] An `inputLabel` or `ariaLabelCombobox` should be set. If an external label is used, `labelOutside` should be set to `true`.");
    }
    if (this.inputLabel && this.ariaLabelCombobox) {
      Vue.util.warn("[NcSelect] Only one of `inputLabel` or `ariaLabelCombobox` should to be set.");
    }
  },
  methods: {
    t
  }
};
var _sfc_render = function render4() {
  var _vm = this, _c = _vm._self._c;
  return _c("VueSelect", _vm._g(_vm._b({ staticClass: "select", class: {
    "select--no-wrap": _vm.noWrap,
    "user-select": _vm.userSelect
  }, on: { "search": (searchString) => _vm.search = searchString }, scopedSlots: _vm._u([!_vm.labelOutside && _vm.inputLabel ? { key: "header", fn: function() {
    return [_c("label", { staticClass: "select__label", attrs: { "for": _vm.inputId } }, [_vm._v(" " + _vm._s(_vm.inputLabel) + " ")])];
  }, proxy: true } : null, { key: "search", fn: function({ attributes, events }) {
    return [_c("input", _vm._g(_vm._b({ class: ["vs__search", _vm.inputClass], attrs: { "required": _vm.inputRequired, "dir": "auto" } }, "input", attributes, false), events))];
  } }, { key: "open-indicator", fn: function({ attributes }) {
    return [_c("ChevronDown", _vm._b({ style: {
      cursor: !_vm.disabled ? "pointer" : null
    }, attrs: { "fill-color": "var(--vs-controls-color)", "size": 26 } }, "ChevronDown", attributes, false))];
  } }, { key: "option", fn: function(option) {
    return [_vm._t("option", function() {
      return [_vm.userSelect ? _c("NcListItemIcon", _vm._b({ attrs: { "avatar-size": 32, "name": option[_vm.localLabel], "search": _vm.search } }, "NcListItemIcon", option, false)) : _c("NcEllipsisedOption", { attrs: { "name": String(option[_vm.localLabel]), "search": _vm.search } })];
    }, null, option)];
  } }, { key: "selected-option", fn: function(selectedOption) {
    return [_vm._t("selected-option", function() {
      return [_vm.userSelect ? _c("NcListItemIcon", _vm._b({ attrs: { "avatar-size": _vm.avatarSize, "name": selectedOption[_vm.localLabel], "no-margin": "", "search": _vm.search } }, "NcListItemIcon", selectedOption, false)) : _c("NcEllipsisedOption", { attrs: { "name": String(selectedOption[_vm.localLabel]), "search": _vm.search } })];
    }, { "vBind": selectedOption })];
  } }, { key: "spinner", fn: function(spinner) {
    return [spinner.loading ? _c("NcLoadingIcon") : _vm._e()];
  } }, { key: "no-options", fn: function() {
    return [_vm._v(" " + _vm._s(_vm.t("No results")) + " ")];
  }, proxy: true }, _vm._l(_vm.$scopedSlots, function(_, name) {
    return { key: name, fn: function(data) {
      return [_vm._t(name, null, null, data)];
    } };
  })], null, true) }, "VueSelect", _vm.propsToForward, false), _vm.listenersToForward));
};
var _sfc_staticRenderFns = [];
var __component__ = /* @__PURE__ */ normalizeComponent(
  _sfc_main,
  _sfc_render,
  _sfc_staticRenderFns,
  false,
  null,
  null
);
const NcSelect = __component__.exports;
export {
  ChevronDown as C,
  NcSelect as N,
  NcListItemIcon as a
};
//# sourceMappingURL=NcSelect-CjUzohn5-OrPoxx8A.chunk.mjs.map
