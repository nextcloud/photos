const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { t as translate } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
import { f as NcLoadingIcon, N as NcButton } from "./index-BOzawWmL.chunk.mjs";
import { B as ArrowLeft, n as normalizeComponent } from "./icons-BZLMM6Xn.chunk.mjs";
const _sfc_main = {
  name: "HeaderNavigation",
  components: {
    ArrowLeft,
    NcButton,
    NcLoadingIcon
  },
  inheritAttrs: false,
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    path: {
      type: String,
      default: "/"
    },
    title: {
      type: String,
      required: true
    },
    rootTitle: {
      type: String,
      default: translate("photos", "Photos")
    }
  },
  computed: {
    isRoot() {
      const isRoot = this.path === "/";
      this.toggleNavigationButton(!isRoot);
      return isRoot;
    },
    name() {
      if (this.isRoot) {
        return this.rootTitle;
      }
      return this.title;
    }
  },
  methods: {
    folderUp() {
      this.$router.push(this.$route.path.split("/").slice(0, -1).join("/"));
    },
    refresh() {
      this.$emit("refresh");
    },
    toggleNavigationButton(hide) {
      const navigationToggle = document.querySelector("button.app-navigation-toggle");
      if (navigationToggle !== null && hide) {
        navigationToggle.style.display = "none";
      }
    },
    t: translate
  }
};
var _sfc_render = function render() {
  var _vm = this, _c = _vm._self._c;
  return _c("div", { staticClass: "photos-navigation", class: { "photos-navigation--root": _vm.isRoot }, attrs: { "role": "toolbar" } }, [!_vm.isRoot ? _c("NcButton", { staticClass: "photos-navigation__back", attrs: { "aria-label": _vm.t("photos", "Go back"), "type": "tertiary" }, on: { "click": _vm.folderUp }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
    return [_c("ArrowLeft", { attrs: { "size": 20 } })];
  }, proxy: true }], null, false, 1821202730) }) : _vm._e(), _c("div", { staticClass: "photos-navigation__title" }, [_c("h1", { staticClass: "photos-navigation__title__main", on: { "click": _vm.refresh } }, [_vm._v(" " + _vm._s(_vm.name) + " ")]), _c("div", { staticClass: "photos-navigation__title__sub" }), _vm._t("subtitle")], 2), _c("div", { staticClass: "photos-navigation__content" }, [_vm.$slots.default ? _c("div", { staticClass: "photos-navigation__content__left" }, [_vm._t("default")], 2) : _vm._e(), _c("NcLoadingIcon", { directives: [{ name: "show", rawName: "v-show", value: _vm.loading, expression: "loading" }], staticClass: "photos-navigation__loader" }), _c("div", { staticClass: "photos-navigation__content__right" }, [_vm._t("right")], 2)], 1)], 1);
};
var _sfc_staticRenderFns = [];
_sfc_render._withStripped = true;
var __component__ = /* @__PURE__ */ normalizeComponent(
  _sfc_main,
  _sfc_render,
  _sfc_staticRenderFns,
  false,
  null,
  "5c4e36ed"
);
__component__.options.__file = "/Users/effem/workbench/git/personel/photos/src/components/HeaderNavigation.vue";
const HeaderNavigation = __component__.exports;
export {
  HeaderNavigation as H
};
//# sourceMappingURL=HeaderNavigation-BKsyJU73.chunk.mjs.map
