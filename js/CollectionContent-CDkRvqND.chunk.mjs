const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { d as defineComponent, t as translate } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
import { u as useIsMobile } from "./video-C5pfp5p8.chunk.mjs";
import { N as NcEmptyContent } from "./NcEmptyContent-EDU4qhab.chunk.mjs";
import { j as ImageMultipleOutline, z as AlertCircleOutline, n as normalizeComponent } from "./icons-BZLMM6Xn.chunk.mjs";
import { F as FileComponent } from "./FileComponent-CcjuR452.chunk.mjs";
import { F as FilesSelectionMixin, a as FilesListViewer } from "./FilesSelectionMixin-Bmgrjxxz.chunk.mjs";
import { ag as toViewerFileInfo } from "./index-BOzawWmL.chunk.mjs";
const _sfc_main = defineComponent({
  name: "CollectionContent",
  components: {
    AlertCircleOutline,
    ImageMultipleOutline,
    NcEmptyContent,
    FilesListViewer,
    FileComponent
  },
  mixins: [FilesSelectionMixin],
  props: {
    collection: {
      type: Object,
      default: () => void 0
    },
    collectionFileIds: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    allowSelection: {
      type: Boolean,
      default: true
    },
    error: {
      type: [Error, Number],
      default: null
    }
  },
  setup() {
    return {
      isMobile: useIsMobile()
    };
  },
  data() {
    return {
      appContent: document.getElementById("app-content-vue")
    };
  },
  computed: {
    files() {
      return this.$store.getters.files;
    },
    sortedCollectionFileIds() {
      return this.collectionFileIds.toSorted((fileId1, fileId2) => this.files[fileId1].attributes.timestamp < this.files[fileId2].attributes.timestamp ? -1 : 1);
    }
  },
  methods: {
    openViewer(fileId) {
      window.OCA.Viewer.open({
        fileInfo: toViewerFileInfo(this.files[fileId]),
        list: this.sortedCollectionFileIds.map((fileId2) => toViewerFileInfo(this.files[fileId2]))
      });
    },
    t: translate
  }
});
var _sfc_render = function render() {
  var _vm = this, _c = _vm._self._c;
  _vm._self._setupProxy;
  return _vm.collection === void 0 && !_vm.loading || _vm.error === 404 ? _c("NcEmptyContent", { staticClass: "empty-content-with-illustration", attrs: { "name": _vm.t("photos", "This collection does not exist") } }, [_c("ImageMultipleOutline", { attrs: { "slot": "icon" }, slot: "icon" })], 1) : _vm.error ? _c("NcEmptyContent", { attrs: { "name": _vm.t("photos", "An error occurred") } }, [_c("AlertCircleOutline", { attrs: { "slot": "icon" }, slot: "icon" })], 1) : _c("div", { staticClass: "collection" }, [_vm._t("header", null, { "selectedFileIds": _vm.selectedFileIds, "resetSelection": _vm.resetSelection }), _vm.sortedCollectionFileIds.length === 0 && !_vm.loading ? _vm._t("empty-content") : _vm._e(), _vm.collection !== void 0 && _vm.sortedCollectionFileIds.length > 0 ? _c("FilesListViewer", { staticClass: "collection__media", attrs: { "container-element": _vm.appContent, "file-ids": _vm.sortedCollectionFileIds, "base-height": _vm.isMobile ? 120 : 200, "loading": _vm.loading }, scopedSlots: _vm._u([{ key: "default", fn: function({ file, distance }) {
    return _c("FileComponent", { attrs: { "file": _vm.files[file.id], "allow-selection": _vm.allowSelection, "selected": _vm.selection[file.id] === true, "distance": distance }, on: { "click": _vm.openViewer, "select-toggled": _vm.onFileSelectToggle } });
  } }], null, false, 1238834138) }) : _vm._e()], 2);
};
var _sfc_staticRenderFns = [];
_sfc_render._withStripped = true;
var __component__ = /* @__PURE__ */ normalizeComponent(
  _sfc_main,
  _sfc_render,
  _sfc_staticRenderFns,
  false,
  null,
  "f6dfec12"
);
__component__.options.__file = "/Users/effem/workbench/git/personel/photos/src/components/Collection/CollectionContent.vue";
const CollectionContent = __component__.exports;
export {
  CollectionContent as C
};
//# sourceMappingURL=CollectionContent-CDkRvqND.chunk.mjs.map
