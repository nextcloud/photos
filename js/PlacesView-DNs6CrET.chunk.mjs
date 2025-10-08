const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { a as translatePlural, t as translate, _ } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
import { N as NcEmptyContent } from "./NcEmptyContent-EDU4qhab.chunk.mjs";
import { j as ImageMultipleOutline, n as normalizeComponent } from "./icons-BZLMM6Xn.chunk.mjs";
import { C as CollectionCover, a as CollectionsList } from "./CollectionsList-D9fG4CRR.chunk.mjs";
import { H as HeaderNavigation } from "./HeaderNavigation-BKsyJU73.chunk.mjs";
import { F as FetchCollectionsMixin } from "./FetchCollectionsMixin-BaPcOLwP.chunk.mjs";
import { af as placesPrefix } from "./index-BOzawWmL.chunk.mjs";
import "./video-C5pfp5p8.chunk.mjs";
import "./preload-helper-BO5AHt9u.chunk.mjs";
import "./collectionFetcher-COU0Vwo3.chunk.mjs";
import "./index-Cokc0amN.chunk.mjs";
import "./AbortControllerMixin-B_otrjDn.chunk.mjs";
const _sfc_main = {
  name: "PlacesView",
  components: {
    ImageMultipleOutline,
    NcEmptyContent,
    CollectionsList,
    CollectionCover,
    HeaderNavigation
  },
  filters: {
    coverUrl(fileId) {
      if (fileId === -1) {
        return "";
      }
      return _(`/apps/photos/api/v1/preview/${fileId}?x=${512}&y=${512}`);
    }
  },
  mixins: [FetchCollectionsMixin],
  computed: {
    places() {
      return this.$store.getters.places;
    }
  },
  async beforeMount() {
    this.fetchPlaces();
  },
  methods: {
    fetchPlaces() {
      this.fetchCollections(placesPrefix);
    },
    t: translate,
    n: translatePlural
  }
};
var _sfc_render = function render() {
  var _vm = this, _c = _vm._self._c;
  return _c("div", [_c("CollectionsList", { staticClass: "places-list", attrs: { "collections": _vm.places, "loading": _vm.loadingCollections, "error": _vm.errorFetchingCollections }, scopedSlots: _vm._u([{ key: "default", fn: function({ collection }) {
    return _c("CollectionCover", { key: collection.basename, attrs: { "parent-route": "/places", "collection-name": collection.basename, "alt-img": _vm.t("photos", "Cover photo for place {placeName}", { placeName: collection.basename }), "cover-url": _vm._f("coverUrl")(collection.attributes["last-photo"]) } }, [_c("span", { staticClass: "place__name" }, [_vm._v(" " + _vm._s(collection.basename) + " ")]), _c("div", { staticClass: "place__details", attrs: { "slot": "subtitle" }, slot: "subtitle" }, [_vm._v(" " + _vm._s(_vm.n("photos", "%n item", "%n photos and videos", collection.attributes.nbItems)) + " ")])]);
  } }]) }, [_c("HeaderNavigation", { key: "navigation", attrs: { "slot": "header", "loading": _vm.loadingCollections, "title": _vm.t("photos", "Places"), "root-title": _vm.t("photos", "Places") }, on: { "refresh": _vm.fetchPlaces }, slot: "header" }), _c("NcEmptyContent", { attrs: { "slot": "empty-collections-list", "name": _vm.t("photos", "There is no place yet!") }, slot: "empty-collections-list" }, [_c("ImageMultipleOutline", { attrs: { "slot": "icon" }, slot: "icon" })], 1)], 1)], 1);
};
var _sfc_staticRenderFns = [];
_sfc_render._withStripped = true;
var __component__ = /* @__PURE__ */ normalizeComponent(
  _sfc_main,
  _sfc_render,
  _sfc_staticRenderFns,
  false,
  null,
  "7f60f757"
);
__component__.options.__file = "/Users/effem/workbench/git/personel/photos/src/views/PlacesView.vue";
const PlacesView = __component__.exports;
export {
  PlacesView as default
};
//# sourceMappingURL=PlacesView-DNs6CrET.chunk.mjs.map
