const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { t as translate } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
import { u as useIsMobile } from "./video-C5pfp5p8.chunk.mjs";
import { N as NcButton, af as placesPrefix } from "./index-BOzawWmL.chunk.mjs";
import { N as NcEmptyContent } from "./NcEmptyContent-EDU4qhab.chunk.mjs";
import { w as ImagePlusOutline, P as Plus, n as normalizeComponent } from "./icons-BZLMM6Xn.chunk.mjs";
import { C as CollectionContent } from "./CollectionContent-CDkRvqND.chunk.mjs";
import { H as HeaderNavigation } from "./HeaderNavigation-BKsyJU73.chunk.mjs";
import { F as FetchCollectionContentMixin } from "./FetchCollectionContentMixin-ank00rhB.chunk.mjs";
import "./preload-helper-BO5AHt9u.chunk.mjs";
import "./index-Cokc0amN.chunk.mjs";
import "./FileComponent-CcjuR452.chunk.mjs";
import "./NcCheckboxRadioSwitch-VeztTzpz-CPNGlVnf.chunk.mjs";
import "./useModelMigration-EhAWvqDD-DYrjrJkv.chunk.mjs";
import "./FilesSelectionMixin-Bmgrjxxz.chunk.mjs";
import "./fileFetcher-UYL2it_6.chunk.mjs";
import "./collectionFetcher-COU0Vwo3.chunk.mjs";
import "./AbortControllerMixin-B_otrjDn.chunk.mjs";
const _sfc_main = {
  name: "PlaceContent",
  components: {
    Plus,
    ImagePlusOutline,
    NcEmptyContent,
    NcButton,
    CollectionContent,
    HeaderNavigation
  },
  mixins: [FetchCollectionContentMixin],
  props: {
    placeName: {
      type: String,
      default: "/"
    }
  },
  setup() {
    const isMobile = useIsMobile();
    return {
      isMobile
    };
  },
  data() {
    return {
      showAddPhotosModal: false,
      loadingCollection: false,
      errorFetchingCollection: null,
      loadingCount: 0,
      loadingAddFilesToPlace: false
    };
  },
  computed: {
    place() {
      return this.$store.getters.getPlace(this.placeName);
    },
    placeFileName() {
      return `${placesPrefix}/${this.placeName}`;
    },
    placeFileIds() {
      return this.$store.getters.getPlaceFiles(this.placeName);
    }
  },
  async beforeMount() {
    await this.fetchPlace();
    await this.fetchPlaceFiles();
  },
  methods: {
    async fetchPlace() {
      this.fetchCollection(this.placeFileName);
    },
    async fetchPlaceFiles() {
      this.fetchCollectionFiles(this.placeFileName);
    },
    t: translate
  }
};
var _sfc_render = function render() {
  var _vm = this, _c = _vm._self._c;
  return _c("div", [_c("CollectionContent", { ref: "collectionContent", attrs: { "collection": _vm.place, "collection-file-ids": _vm.placeFileIds, "allow-selection": false, "loading": _vm.loadingCollection || _vm.loadingCollectionFiles, "error": _vm.errorFetchingCollection || _vm.errorFetchingCollectionFiles } }, [_vm.place !== null ? _c("HeaderNavigation", { key: "navigation", attrs: { "slot": "header", "loading": _vm.loadingCollection || _vm.loadingCollectionFiles, "params": { placeName: _vm.placeName }, "path": "/" + _vm.placeName, "title": _vm.place.basename }, on: { "refresh": _vm.fetchPlaceFiles }, slot: "header" }) : _vm._e(), _c("NcEmptyContent", { staticClass: "place__empty", attrs: { "slot": "empty-content", "name": _vm.t("photos", "This place does not have any photos or videos yet!") }, slot: "empty-content" }, [_c("ImagePlusOutline", { attrs: { "slot": "icon" }, slot: "icon" }), _c("NcButton", { attrs: { "slot": "action", "type": "primary", "aria-label": _vm.t("photos", "Add photos to this place") }, on: { "click": function($event) {
    _vm.showAddPhotosModal = true;
  } }, slot: "action" }, [_c("Plus", { attrs: { "slot": "icon" }, slot: "icon" }), _vm._v(" " + _vm._s(_vm.t("photos", "Add")) + " ")], 1)], 1)], 1)], 1);
};
var _sfc_staticRenderFns = [];
_sfc_render._withStripped = true;
var __component__ = /* @__PURE__ */ normalizeComponent(
  _sfc_main,
  _sfc_render,
  _sfc_staticRenderFns,
  false,
  null,
  "bfd40e95"
);
__component__.options.__file = "/Users/effem/workbench/git/personel/photos/src/views/PlaceContent.vue";
const PlaceContent = __component__.exports;
export {
  PlaceContent as default
};
//# sourceMappingURL=PlaceContent-DzjCP_BX.chunk.mjs.map
