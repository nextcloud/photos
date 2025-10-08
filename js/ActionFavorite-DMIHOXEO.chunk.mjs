const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { d as defineComponent, t as translate } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
import { N as NcActionButton } from "./NcActionButton-CuVNJJtW-5eBS5Sv2.chunk.mjs";
import { S as StarOutline, f as Star, n as normalizeComponent } from "./icons-BZLMM6Xn.chunk.mjs";
const _sfc_main = defineComponent({
  name: "ActionFavorite",
  components: {
    Star,
    StarOutline,
    NcActionButton
  },
  props: {
    selectedFileIds: {
      type: Array,
      required: true
    }
  },
  computed: {
    files() {
      return this.$store.state.files.files;
    },
    shouldFavoriteSelection() {
      return this.selectedFileIds.some((fileId) => this.files[fileId].attributes.favorite === 0);
    }
  },
  methods: {
    async favoriteSelection() {
      await this.$store.dispatch("toggleFavoriteForFiles", { fileIds: this.selectedFileIds, favoriteState: 1 });
    },
    async unFavoriteSelection() {
      await this.$store.dispatch("toggleFavoriteForFiles", { fileIds: this.selectedFileIds, favoriteState: 0 });
    },
    t: translate
  }
});
var _sfc_render = function render() {
  var _vm = this, _c = _vm._self._c;
  _vm._self._setupProxy;
  return _vm.shouldFavoriteSelection ? _c("NcActionButton", { attrs: { "close-after-click": true, "aria-label": _vm.t("photos", "Mark selection as favorite") }, on: { "click": _vm.favoriteSelection } }, [_vm._v(" " + _vm._s(_vm.t("photos", "Add selection to favorites")) + " "), _c("StarOutline", { attrs: { "slot": "icon" }, slot: "icon" })], 1) : _c("NcActionButton", { attrs: { "close-after-click": true, "aria-label": _vm.t("photos", "Remove selection from favorites") }, on: { "click": _vm.unFavoriteSelection } }, [_vm._v(" " + _vm._s(_vm.t("photos", "Remove selection from favorites")) + " "), _c("Star", { attrs: { "slot": "icon" }, slot: "icon" })], 1);
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
__component__.options.__file = "/Users/effem/workbench/git/personel/photos/src/components/Actions/ActionFavorite.vue";
const ActionFavorite = __component__.exports;
export {
  ActionFavorite as A
};
//# sourceMappingURL=ActionFavorite-DMIHOXEO.chunk.mjs.map
