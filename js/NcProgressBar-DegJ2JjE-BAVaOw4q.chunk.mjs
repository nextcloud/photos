const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { C as useCssVars } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
import { n as normalizeComponent } from "./index-BOzawWmL.chunk.mjs";
const __default__ = {
  name: "NcProgressBar",
  props: {
    /**
     * An integer between 1 and 100
     */
    value: {
      type: Number,
      default: 0,
      validator(value) {
        return value >= 0 && value <= 100;
      }
    },
    /**
     * Determines the height of the progressbar.
     * Possible values:
     * - 'small' (default)
     * - 'medium'
     * - Number
     * @type {'small'|'medium'|number}
     */
    size: {
      type: [String, Number],
      default: "small",
      validator(value) {
        return ["small", "medium"].includes(value) || typeof value === "number";
      }
    },
    /**
     * Applies an error color to the progressbar if true.
     */
    error: {
      type: Boolean,
      default: false
    },
    /**
     * ProgressBar type
     */
    type: {
      type: String,
      default: "linear",
      validator(value) {
        return ["linear", "circular"].includes(value);
      }
    },
    color: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      stroke: 4
    };
  },
  computed: {
    height() {
      if (this.type === "circular") {
        if (Number.isInteger(this.size)) {
          return this.size;
        }
        return 44;
      }
      if (this.size === "small") {
        return 4;
      } else if (this.size === "medium") {
        return 6;
      }
      return this.size;
    },
    progress() {
      return this.value / 100;
    },
    radius() {
      return this.height / 2;
    },
    radiusNormalized() {
      return this.radius - 3 * this.stroke;
    },
    circumference() {
      return this.radiusNormalized * 2 * Math.PI;
    }
  }
};
const __injectCSSVars__ = () => {
  useCssVars((_vm, _setup) => ({
    "497e8a2b": _vm.color
  }));
};
const __setup__ = __default__.setup;
__default__.setup = __setup__ ? (props, ctx) => {
  __injectCSSVars__();
  return __setup__(props, ctx);
} : __injectCSSVars__;
const _sfc_main = __default__;
var _sfc_render = function render() {
  var _vm = this, _c = _vm._self._c;
  return _vm.type === "circular" ? _c("span", { staticClass: "progress-bar progress-bar--circular", class: { "progress-bar--error": _vm.error }, style: { "--progress-bar-height": _vm.height + "px" }, attrs: { "role": "progressbar", "aria-valuenow": _vm.value } }, [_c("svg", { attrs: { "height": _vm.height, "width": _vm.height } }, [_c("circle", { attrs: { "stroke": "currentColor", "fill": "transparent", "stroke-dasharray": `${_vm.progress * _vm.circumference} ${(1 - _vm.progress) * _vm.circumference}`, "stroke-dashoffset": 0.25 * _vm.circumference, "stroke-width": _vm.stroke, "r": _vm.radiusNormalized, "cx": _vm.radius, "cy": _vm.radius } }), _c("circle", { attrs: { "stroke": "var(--color-background-darker)", "fill": "transparent", "stroke-dasharray": `${(1 - _vm.progress) * _vm.circumference} ${_vm.progress * _vm.circumference}`, "stroke-dashoffset": (0.25 - _vm.progress) * _vm.circumference, "stroke-width": _vm.stroke, "r": _vm.radiusNormalized, "cx": _vm.radius, "cy": _vm.radius } })])]) : _c("progress", { staticClass: "progress-bar progress-bar--linear vue", class: { "progress-bar--error": _vm.error }, style: { "--progress-bar-height": _vm.height + "px" }, attrs: { "max": "100" }, domProps: { "value": _vm.value } });
};
var _sfc_staticRenderFns = [];
var __component__ = /* @__PURE__ */ normalizeComponent(
  _sfc_main,
  _sfc_render,
  _sfc_staticRenderFns,
  false,
  null,
  "5e97fe1f"
);
const NcProgressBar = __component__.exports;
export {
  NcProgressBar as N
};
//# sourceMappingURL=NcProgressBar-DegJ2JjE-BAVaOw4q.chunk.mjs.map
