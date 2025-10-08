const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { n as normalizeComponent } from "./index-BOzawWmL.chunk.mjs";
const _sfc_main = {
  name: "NcEmptyContent",
  props: {
    /**
     * A header message about an empty content shown
     * @example 'No comments'
     */
    name: {
      type: String,
      default: ""
    },
    /**
     * Desription of the empty content
     * @example 'No comments yet, start the conversation!'
     */
    description: {
      type: String,
      default: ""
    }
  },
  computed: {
    hasName() {
      return this.name !== "";
    },
    /**
     * Check if a description is given as either property or slot
     */
    hasDescription() {
      return this.description !== "" || this.$slots.description?.[0];
    }
  }
};
var _sfc_render = function render() {
  var _vm = this, _c = _vm._self._c;
  return _c("div", { staticClass: "empty-content", attrs: { "role": "note" } }, [_vm.$slots.icon ? _c("div", { staticClass: "empty-content__icon", attrs: { "aria-hidden": "true" } }, [_vm._t("icon")], 2) : _vm._e(), _vm._t("name", function() {
    return [_vm.hasName ? _c("span", { staticClass: "empty-content__name" }, [_vm._v(" " + _vm._s(_vm.name) + " ")]) : _vm._e()];
  }), _vm.hasDescription ? _c("p", { staticClass: "empty-content__description" }, [_vm._t("description", function() {
    return [_vm._v(" " + _vm._s(_vm.description) + " ")];
  })], 2) : _vm._e(), _vm.$slots.action ? _c("div", { staticClass: "empty-content__action" }, [_vm._t("action")], 2) : _vm._e()], 2);
};
var _sfc_staticRenderFns = [];
var __component__ = /* @__PURE__ */ normalizeComponent(
  _sfc_main,
  _sfc_render,
  _sfc_staticRenderFns,
  false,
  null,
  "8aaa3146"
);
const NcEmptyContent = __component__.exports;
export {
  NcEmptyContent as N
};
//# sourceMappingURL=NcEmptyContent-EDU4qhab.chunk.mjs.map
