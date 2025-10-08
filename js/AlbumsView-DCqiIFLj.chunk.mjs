const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { d as defineComponent, a as translatePlural, t as translate, _ } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
import { e as useIsSmallMobile } from "./video-C5pfp5p8.chunk.mjs";
import { N as NcButton, m as NcModal, o as albumsPrefix, q as albumsExtraProps } from "./index-BOzawWmL.chunk.mjs";
import { N as NcEmptyContent } from "./NcEmptyContent-EDU4qhab.chunk.mjs";
import { u as CogOutline, j as ImageMultipleOutline, P as Plus, n as normalizeComponent } from "./icons-BZLMM6Xn.chunk.mjs";
import { A as AlbumForm } from "./AlbumForm-DS-1aALG.chunk.mjs";
import { C as CollectionCover, a as CollectionsList } from "./CollectionsList-D9fG4CRR.chunk.mjs";
import { H as HeaderNavigation } from "./HeaderNavigation-BKsyJU73.chunk.mjs";
import { F as FetchCollectionsMixin } from "./FetchCollectionsMixin-BaPcOLwP.chunk.mjs";
import "./preload-helper-BO5AHt9u.chunk.mjs";
import "./index-Cokc0amN.chunk.mjs";
import "./NcTextField-o_8gWurX-9cj68FP2.chunk.mjs";
import "./useModelMigration-EhAWvqDD-DYrjrJkv.chunk.mjs";
import "./PhotosFiltersInput-C83ZrtRE.chunk.mjs";
import "./NcSelect-CjUzohn5-OrPoxx8A.chunk.mjs";
import "./NcAvatar-YSp2ORHc-CfTsACiM.chunk.mjs";
import "./NcActionButton-CuVNJJtW-5eBS5Sv2.chunk.mjs";
import "./dialog-CIZq3-6b.chunk.mjs";
import "./NcDateTimePicker-D9wOztqD.chunk.mjs";
import "./NcDialog-CKgpZOiy-CeLaNMKv.chunk.mjs";
import "./NcDateTime-DshRFtUU-w5TCTRwf.chunk.mjs";
import "./collectionFetcher-COU0Vwo3.chunk.mjs";
import "./index-DzppFRs6.chunk.mjs";
import "./FetchCollectionContentMixin-ank00rhB.chunk.mjs";
import "./AbortControllerMixin-B_otrjDn.chunk.mjs";
const _sfc_main = defineComponent({
  name: "AlbumsView",
  components: {
    Plus,
    ImageMultipleOutline,
    NcModal,
    NcButton,
    NcEmptyContent,
    CollectionsList,
    CollectionCover,
    HeaderNavigation,
    AlbumForm,
    CogOutline
  },
  filters: {
    coverUrl(lastPhoto) {
      if (lastPhoto === -1) {
        return "";
      }
      return _(`/apps/photos/api/v1/preview/${lastPhoto}?x=${512}&y=${512}`);
    }
  },
  mixins: [FetchCollectionsMixin],
  setup() {
    const isMobile = useIsSmallMobile();
    return {
      isMobile
    };
  },
  data() {
    return {
      showAlbumCreationForm: false
    };
  },
  computed: {
    albums() {
      return this.$store.getters.albums;
    }
  },
  async beforeMount() {
    this.fetchAlbums();
  },
  methods: {
    fetchAlbums() {
      this.fetchCollections(
        albumsPrefix,
        albumsExtraProps
      );
    },
    handleAlbumCreated({ album }) {
      this.showAlbumCreationForm = false;
      this.$router.push(`/albums/${album.basename}`);
    },
    t: translate,
    n: translatePlural
  }
});
var _sfc_render = function render() {
  var _vm = this, _c = _vm._self._c;
  _vm._self._setupProxy;
  return _c("div", [_c("CollectionsList", { staticClass: "albums-list", attrs: { "collections": _vm.albums, "loading": _vm.loadingCollections, "error": _vm.errorFetchingCollections }, scopedSlots: _vm._u([{ key: "header", fn: function() {
    return [_c("HeaderNavigation", { key: "navigation", attrs: { "loading": _vm.loadingCollections, "title": _vm.t("photos", "Albums"), "root-title": _vm.t("photos", "Albums") }, on: { "refresh": _vm.fetchAlbums } }, [_c("NcButton", { attrs: { "aria-label": _vm.isMobile ? _vm.t("photos", "New album") : void 0 }, on: { "click": function($event) {
      _vm.showAlbumCreationForm = true;
    } }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
      return [_c("Plus", { attrs: { "size": 20 } })];
    }, proxy: true }, !_vm.isMobile ? { key: "default", fn: function() {
      return [_vm._v(" " + _vm._s(_vm.t("photos", "New album")) + " ")];
    }, proxy: true } : null], null, true) })], 1)];
  }, proxy: true }, { key: "default", fn: function({ collection }) {
    return [_c("CollectionCover", { key: collection.basename, attrs: { "parent-route": "/albums", "collection-name": collection.basename, "alt-img": _vm.t("photos", "Cover photo for album {albumName}", { albumName: collection.basename }), "cover-url": _vm._f("coverUrl")(collection.attributes["last-photo"]) }, scopedSlots: _vm._u([{ key: "default", fn: function() {
      return [_c("span", { staticClass: "album__name" }, [_vm._v(" " + _vm._s(collection.basename) + " ")]), Object.keys(collection.attributes.filters).length !== 0 ? _c("CogOutline", { attrs: { "fill-color": "var(--color-text-lighter)" } }) : _vm._e()];
    }, proxy: true }, { key: "subtitle", fn: function() {
      return [_c("div", { staticClass: "album__details" }, [_vm._v(" " + _vm._s(collection.attributes.date) + " ⸱ " + _vm._s(_vm.n("photos", "%n item", "%n photos and videos", collection.attributes.nbItems)) + " ")])];
    }, proxy: true }], null, true) })];
  } }, { key: "empty-collections-list", fn: function() {
    return [_c("NcEmptyContent", { attrs: { "name": _vm.t("photos", "There is no album yet!") }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
      return [_c("ImageMultipleOutline")];
    }, proxy: true }]) })];
  }, proxy: true }]) }), _vm.showAlbumCreationForm ? _c("NcModal", { attrs: { "label-id": "new-album-form" }, on: { "close": function($event) {
    _vm.showAlbumCreationForm = false;
  } } }, [_c("h2", { staticClass: "album-creation__heading" }, [_vm._v(" " + _vm._s(_vm.t("photos", "New album")) + " ")]), _c("AlbumForm", { on: { "done": _vm.handleAlbumCreated } })], 1) : _vm._e()], 1);
};
var _sfc_staticRenderFns = [];
_sfc_render._withStripped = true;
var __component__ = /* @__PURE__ */ normalizeComponent(
  _sfc_main,
  _sfc_render,
  _sfc_staticRenderFns,
  false,
  null,
  "711b963c"
);
__component__.options.__file = "/Users/effem/workbench/git/personel/photos/src/views/AlbumsView.vue";
const AlbumsView = __component__.exports;
export {
  AlbumsView as default
};
//# sourceMappingURL=AlbumsView-DCqiIFLj.chunk.mjs.map
