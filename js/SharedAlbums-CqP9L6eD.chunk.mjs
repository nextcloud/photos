const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { a as translatePlural, t as translate, g as getCurrentUser, _ } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
import { N as NcEmptyContent } from "./NcEmptyContent-EDU4qhab.chunk.mjs";
import { N as NcUserBubble } from "./NcUserBubble-B3-E-5F5-B3tz6PYr.chunk.mjs";
import { j as ImageMultipleOutline, n as normalizeComponent } from "./icons-BZLMM6Xn.chunk.mjs";
import { C as CollectionCover, a as CollectionsList } from "./CollectionsList-D9fG4CRR.chunk.mjs";
import { H as HeaderNavigation } from "./HeaderNavigation-BKsyJU73.chunk.mjs";
import { F as FetchCollectionsMixin } from "./FetchCollectionsMixin-BaPcOLwP.chunk.mjs";
import { q as albumsExtraProps } from "./index-BOzawWmL.chunk.mjs";
import "./NcAvatar-YSp2ORHc-CfTsACiM.chunk.mjs";
import "./NcActionButton-CuVNJJtW-5eBS5Sv2.chunk.mjs";
import "./index-Cokc0amN.chunk.mjs";
import "./video-C5pfp5p8.chunk.mjs";
import "./preload-helper-BO5AHt9u.chunk.mjs";
import "./collectionFetcher-COU0Vwo3.chunk.mjs";
import "./AbortControllerMixin-B_otrjDn.chunk.mjs";
const _sfc_main = {
  name: "SharedAlbums",
  components: {
    ImageMultipleOutline,
    NcEmptyContent,
    CollectionsList,
    CollectionCover,
    HeaderNavigation,
    NcUserBubble
  },
  filters: {
    coverUrl(lastPhoto) {
      if (lastPhoto === -1) {
        return "";
      }
      return _(`/apps/photos/api/v1/preview/${lastPhoto}?x=${512}&y=${512}`);
    },
    albumOriginalName(album) {
      return album.basename.replace(new RegExp(`\\(${album.attributes.collaborators[0].id}\\)$`), "");
    }
  },
  mixins: [FetchCollectionsMixin],
  computed: {
    sharedAlbums() {
      return this.$store.getters.sharedAlbums;
    }
  },
  async beforeMount() {
    this.fetchSharedAlbums();
  },
  methods: {
    fetchSharedAlbums() {
      this.fetchCollections(
        `/photos/${getCurrentUser()?.uid}/sharedalbums`,
        albumsExtraProps
      );
    },
    t: translate,
    n: translatePlural
  }
};
var _sfc_render = function render() {
  var _vm = this, _c = _vm._self._c;
  return _c("CollectionsList", { staticClass: "albums-list", attrs: { "collections": _vm.sharedAlbums, "loading": _vm.loadingCollections, "error": _vm.errorFetchingCollections }, scopedSlots: _vm._u([{ key: "default", fn: function({ collection }) {
    return _c("CollectionCover", { key: collection.basename, attrs: { "parent-route": "/sharedalbums", "collection-name": collection.basename, "alt-img": _vm.t("photos", "Cover photo for shared album {albumName}", { albumName: collection.basename }), "data-test": collection.basename, "cover-url": _vm._f("coverUrl")(collection.attributes["last-photo"]) } }, [_c("span", { staticClass: "album__name" }, [_vm._v(" " + _vm._s(_vm._f("albumOriginalName")(collection)) + " ")]), _c("div", { staticClass: "album__details", attrs: { "slot": "subtitle" }, slot: "subtitle" }, [_vm._v(" " + _vm._s(collection.attributes.date) + " ⸱ " + _vm._s(_vm.n("photos", "%n item", "%n photos and videos", collection.attributes.nbItems)) + " "), _c("br"), _vm._v(" " + _vm._s(_vm.t("photos", "Shared by")) + " "), _c("NcUserBubble", { attrs: { "display-name": collection.attributes.collaborators[0].label, "user": collection.attributes.collaborators[0].id } })], 1)]);
  } }]) }, [_c("HeaderNavigation", { key: "navigation", attrs: { "slot": "header", "loading": _vm.loadingCollections, "title": _vm.t("photos", "Collaborative albums"), "root-title": _vm.t("photos", "Collaborative albums") }, on: { "refresh": _vm.fetchSharedAlbums }, slot: "header" }), _c("NcEmptyContent", { attrs: { "slot": "empty-collections-list", "name": _vm.t("photos", "There is no album yet!") }, slot: "empty-collections-list" }, [_c("ImageMultipleOutline", { attrs: { "slot": "icon" }, slot: "icon" })], 1)], 1);
};
var _sfc_staticRenderFns = [];
_sfc_render._withStripped = true;
var __component__ = /* @__PURE__ */ normalizeComponent(
  _sfc_main,
  _sfc_render,
  _sfc_staticRenderFns,
  false,
  null,
  "a5a807b0"
);
__component__.options.__file = "/Users/effem/workbench/git/personel/photos/src/views/SharedAlbums.vue";
const SharedAlbums = __component__.exports;
export {
  SharedAlbums as default
};
//# sourceMappingURL=SharedAlbums-CqP9L6eD.chunk.mjs.map
