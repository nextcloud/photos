const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { n as normalizeComponent } from "./index-BOzawWmL.chunk.mjs";
const _sfc_main = {
  name: "NcVNodes",
  props: {
    /**
     * The vnodes to render
     */
    vnodes: {
      type: [Array, Object],
      default: null
    }
  },
  /**
   * The render function to display the component
   *
   * @param {Function} h The function to create VNodes
   * @return {object} The created VNode
   */
  render(h) {
    return this.vnodes || this.$slots?.default || this.$scopedSlots?.default?.();
  }
};
const _sfc_render = null;
const _sfc_staticRenderFns = null;
var __component__ = /* @__PURE__ */ normalizeComponent(
  _sfc_main,
  _sfc_render,
  _sfc_staticRenderFns,
  false,
  null,
  null
);
const NcVNodes = __component__.exports;
export {
  NcVNodes as N
};
//# sourceMappingURL=NcVNodes-8dPkIzmP.chunk.mjs.map
