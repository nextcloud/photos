const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { _, t as translate, V as Vue, a as translatePlural } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
import { N as NcContent, a as NcAppContent, v as videoplaceholder, i as imgplaceholder, b as svgplaceholder, c as vuexRouterSyncExports, d as router } from "./video-C5pfp5p8.chunk.mjs";
import { l as logger, p as photosStore } from "./index-BOzawWmL.chunk.mjs";
import { n as normalizeComponent } from "./icons-BZLMM6Xn.chunk.mjs";
import "./preload-helper-BO5AHt9u.chunk.mjs";
import "./index-Cokc0amN.chunk.mjs";
const _sfc_main = {
  name: "PhotosAppPublic",
  components: {
    NcAppContent,
    NcContent
  },
  data() {
    return {
      svgplaceholder,
      imgplaceholder,
      videoplaceholder
    };
  },
  async beforeMount() {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", async () => {
        try {
          const url = _("/apps/photos/service-worker.js", {}, { noRewrite: true });
          const registration = await navigator.serviceWorker.register(url, { scope: _("/apps/photos") });
          logger.debug("SW registered: ", { registration });
        } catch (error) {
          logger.error("SW registration failed: ", { error });
        }
      });
    } else {
      logger.debug("Service Worker is not enabled on this browser.");
    }
  },
  beforeDestroy() {
    window.removeEventListener("load", () => {
      navigator.serviceWorker.register(_("/apps/photos/service-worker.js", {}, {
        noRewrite: true
      }));
    });
  }
};
var _sfc_render = function render() {
  var _vm = this, _c = _vm._self._c;
  return _c("NcContent", { attrs: { "app-name": "photos" } }, [_c("input", { attrs: { "id": "isPublic", "type": "hidden", "name": "isPublic", "value": "1" } }), _c("NcAppContent", [_c("router-view"), _c("span", { staticClass: "hidden-visually", attrs: { "role": "none" }, domProps: { "innerHTML": _vm._s(_vm.svgplaceholder) } }), _c("span", { staticClass: "hidden-visually", attrs: { "role": "none" }, domProps: { "innerHTML": _vm._s(_vm.imgplaceholder) } }), _c("span", { staticClass: "hidden-visually", attrs: { "role": "none" }, domProps: { "innerHTML": _vm._s(_vm.videoplaceholder) } })], 1)], 1);
};
var _sfc_staticRenderFns = [];
_sfc_render._withStripped = true;
var __component__ = /* @__PURE__ */ normalizeComponent(
  _sfc_main,
  _sfc_render,
  _sfc_staticRenderFns,
  false,
  null,
  null
);
__component__.options.__file = "/Users/effem/workbench/git/personel/photos/src/PhotosAppPublic.vue";
const PhotosAppPublic = __component__.exports;
vuexRouterSyncExports.sync(photosStore, router);
Vue.prototype.t = translate;
Vue.prototype.n = translatePlural;
new Vue({
  el: "#content",
  name: "PhotosRoot",
  router,
  store: photosStore,
  render: (h) => h(PhotosAppPublic)
});
//# sourceMappingURL=photos-public.mjs.map
