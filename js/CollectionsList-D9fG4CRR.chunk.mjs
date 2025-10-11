const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { d as defineComponent, b as ref$1, q as computed, t as translate } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
import { L as Link } from "./video-C5pfp5p8.chunk.mjs";
import { j as ImageMultipleOutline, n as normalizeComponent, z as AlertCircleOutline } from "./icons-BZLMM6Xn.chunk.mjs";
import { N as NcEmptyContent } from "./NcEmptyContent-EDU4qhab.chunk.mjs";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "CollectionCover",
  props: {
    coverUrl: { type: String, required: true },
    altImg: { type: String, required: true },
    parentRoute: { type: String, required: true },
    collectionName: { type: String, required: true }
  },
  setup(__props) {
    const props = __props;
    const coverLoadingError = ref$1(false);
    const link = computed(() => `${props.parentRoute}/${encodeURIComponent(props.collectionName)}`);
    return { __sfc: true, props, coverLoadingError, link, RouterLink: Link, ImageMultipleOutline };
  }
});
var _sfc_render$1 = function render() {
  var _vm = this, _c = _vm._self._c, _setup = _vm._self._setupProxy;
  return _c(_setup.RouterLink, { staticClass: "collection-cover", attrs: { "to": _setup.link } }, [_vm.coverUrl !== "" && _setup.coverLoadingError === false ? _c("img", { staticClass: "collection-cover__image", attrs: { "src": _vm.coverUrl, "alt": _vm.altImg }, on: { "error": function($event) {
    _setup.coverLoadingError = true;
  } } }) : _c("div", { staticClass: "collection-cover__image collection-cover__image--placeholder" }, [_c(_setup.ImageMultipleOutline, { attrs: { "size": 128 } })], 1), _c("div", { staticClass: "collection-cover__details" }, [_c("div", { staticClass: "collection-cover__details__title" }, [_vm._t("default")], 2), _c("div", { staticClass: "collection-cover__details__subtitle" }, [_vm._t("subtitle")], 2)])]);
};
var _sfc_staticRenderFns$1 = [];
_sfc_render$1._withStripped = true;
var __component__$1 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$1,
  _sfc_render$1,
  _sfc_staticRenderFns$1,
  false,
  null,
  "c847e9b5"
);
__component__$1.options.__file = "/Users/effem/workbench/git/personel/photos/src/components/Collection/CollectionCover.vue";
const CollectionCover = __component__$1.exports;
const _sfc_main = {
  name: "CollectionsList",
  components: {
    AlertCircleOutline,
    NcEmptyContent
  },
  props: {
    collections: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    error: {
      type: Error,
      default: null
    }
  },
  computed: {
    noCollection() {
      return Object.keys(this.collections).length === 0;
    }
  },
  methods: {
    t: translate
  }
};
var _sfc_render = function render2() {
  var _vm = this, _c = _vm._self._c;
  return _vm.error ? _c("NcEmptyContent", { attrs: { "name": _vm.t("photos", "An error occurred") } }, [_c("AlertCircleOutline", { attrs: { "slot": "icon" }, slot: "icon" })], 1) : _c("div", { staticClass: "collections" }, [_vm._t("header"), _vm.noCollection && !_vm.loading ? _vm._t("empty-collections-list") : !_vm.noCollection ? _c("ul", { staticClass: "collections__list" }, _vm._l(_vm.collections, function(collection) {
    return _c("li", { key: collection.basename, attrs: { "data-cy-collections-list-collection": collection.basename } }, [_vm._t("default", null, { "collection": collection })], 2);
  }), 0) : _vm._e()], 2);
};
var _sfc_staticRenderFns = [];
_sfc_render._withStripped = true;
var __component__ = /* @__PURE__ */ normalizeComponent(
  _sfc_main,
  _sfc_render,
  _sfc_staticRenderFns,
  false,
  null,
  "96f12389"
);
__component__.options.__file = "/Users/effem/workbench/git/personel/photos/src/components/Collection/CollectionsList.vue";
const CollectionsList = __component__.exports;
export {
  CollectionCover as C,
  CollectionsList as a
};
//# sourceMappingURL=CollectionsList-D9fG4CRR.chunk.mjs.map
