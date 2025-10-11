const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { t as translate, V as Vue } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
import { N as NcActionButton } from "./NcActionButton-CuVNJJtW-5eBS5Sv2.chunk.mjs";
import { s as NcActions, f as NcLoadingIcon, l as logger, ag as toViewerFileInfo } from "./index-BOzawWmL.chunk.mjs";
import { N as NcDialog } from "./NcDialog-CKgpZOiy-CeLaNMKv.chunk.mjs";
import { N as NcEmptyContent } from "./NcEmptyContent-EDU4qhab.chunk.mjs";
import { W as AccountSwitchOutline, B as ArrowLeft, z as AlertCircleOutline, G as DownloadOutline, S as StarOutline, f as Star, n as normalizeComponent } from "./icons-BZLMM6Xn.chunk.mjs";
import { F as FaceMergeForm } from "./FaceMergeForm-DoeSX4qj.chunk.mjs";
import { F as FileComponent } from "./FileComponent-CcjuR452.chunk.mjs";
import { F as FilesSelectionMixin, a as FilesListViewer } from "./FilesSelectionMixin-Bmgrjxxz.chunk.mjs";
import { F as FetchFacesMixin } from "./FaceCover-D9Oq7nJI.chunk.mjs";
import { F as FetchFilesMixin } from "./FetchFilesMixin-CM-yM5E8.chunk.mjs";
import "./index-Cokc0amN.chunk.mjs";
import "./NcCheckboxRadioSwitch-VeztTzpz-CPNGlVnf.chunk.mjs";
import "./useModelMigration-EhAWvqDD-DYrjrJkv.chunk.mjs";
import "./fileFetcher-UYL2it_6.chunk.mjs";
import "./AbortControllerMixin-B_otrjDn.chunk.mjs";
import "./PhotoSearch-Y02mQqQD.chunk.mjs";
const _sfc_main = {
  name: "UnassignedFaces",
  components: {
    Star,
    StarOutline,
    DownloadOutline,
    AlertCircleOutline,
    ArrowLeft,
    FaceMergeForm,
    FilesListViewer,
    FileComponent,
    NcLoadingIcon,
    NcEmptyContent,
    NcActions,
    NcActionButton,
    NcDialog,
    AccountSwitchOutline
  },
  directives: {
    focus(el) {
      Vue.nextTick(() => el.focus());
    }
  },
  mixins: [
    FetchFacesMixin,
    FetchFilesMixin,
    FilesSelectionMixin
  ],
  data() {
    return {
      showMoveModal: false,
      loadingCount: 0,
      appContent: document.getElementById("app-content-vue")
    };
  },
  computed: {
    files() {
      return this.$store.state.files.files;
    },
    unassignedFiles() {
      return this.$store.state.faces.unassignedFiles;
    },
    faceFileIds() {
      return this.unassignedFiles || [];
    },
    shouldFavoriteSelection() {
      return this.selectedFileIds.some((fileId) => this.$store.state.files.files[fileId].attributes.favorite === 0);
    }
  },
  mounted() {
    this.fetchUnassignedFaces();
  },
  methods: {
    openViewer(fileId) {
      window.OCA.Viewer.open({
        fileInfo: toViewerFileInfo(this.files[fileId]),
        list: this.faceFileIds.map((fileId2) => toViewerFileInfo(this.files[fileId2]))
      });
    },
    async handleMove(faceName, fileIds) {
      try {
        this.loadingCount++;
        await this.$store.dispatch("moveFilesToFace", { oldFace: null, faceName, fileIdsToMove: fileIds });
        this.showMoveModal = false;
      } catch (error) {
        logger.error("Failed to move selection", { error });
      } finally {
        this.loadingCount--;
      }
    },
    async favoriteSelection() {
      try {
        this.loadingCount++;
        await this.$store.dispatch("toggleFavoriteForFiles", { fileIds: this.selectedFileIds, favoriteState: true });
      } catch (error) {
        logger.error("Failed to favorite selection", { error });
      } finally {
        this.loadingCount--;
      }
    },
    async unFavoriteSelection() {
      try {
        this.loadingCount++;
        await this.$store.dispatch("toggleFavoriteForFiles", { fileIds: this.selectedFileIds, favoriteState: false });
      } catch (error) {
        logger.error("Failed to unfavorite selection", { error });
      } finally {
        this.loadingCount--;
      }
    },
    async downloadSelection() {
      try {
        this.loadingCount++;
        await this.$store.dispatch("downloadFiles", this.selectedFileIds);
      } catch (error) {
        logger.error("Faile to download selection", { error });
      } finally {
        this.loadingCount--;
      }
    },
    t: translate
  }
};
var _sfc_render = function render() {
  var _vm = this, _c = _vm._self._c;
  return _vm.errorFetchingFiles ? _c("NcEmptyContent", { scopedSlots: _vm._u([{ key: "icon", fn: function() {
    return [_c("AlertCircleOutline")];
  }, proxy: true }], null, false, 2159780319) }, [_vm._v(" " + _vm._s(_vm.t("photos", "An error occurred")) + " ")]) : _c("div", { staticClass: "face" }, [_c("div", { staticClass: "face__header" }, [_c("div", { staticClass: "face__header__left" }, [_c("NcActions", [_c("NcActionButton", { on: { "click": function($event) {
    return _vm.$router.push("/faces/");
  } }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
    return [_c("ArrowLeft")];
  }, proxy: true }]) }, [_vm._v(_vm._s(_vm.t("photos", "Back")) + " ")])], 1), _c("div", { staticClass: "face__header__title" }, [_c("h2", { class: { "face-name": true } }, [_vm._v(" " + _vm._s(_vm.t("photos", "Unassigned faces")) + " ")])]), _vm.loadingCount > 0 || _vm.loadingFaces ? _c("NcLoadingIcon") : _vm._e()], 1), _c("div", { staticClass: "face__header__actions" }, [_c("NcActions", { attrs: { "force-menu": true } }, [_vm.selectedFileIds.length ? [_c("NcActionButton", { attrs: { "close-after-click": true, "aria-label": _vm.t("photos", "Download selected files") }, on: { "click": _vm.downloadSelection } }, [_c("DownloadOutline", { attrs: { "slot": "icon" }, slot: "icon" }), _vm._v(" " + _vm._s(_vm.t("photos", "Download selected photos")) + " ")], 1), _vm.shouldFavoriteSelection ? _c("NcActionButton", { attrs: { "close-after-click": true, "aria-label": _vm.t("photos", "Mark selection as favorite") }, on: { "click": _vm.favoriteSelection } }, [_c("StarOutline", { attrs: { "slot": "icon" }, slot: "icon" }), _vm._v(" " + _vm._s(_vm.t("photos", "Favorite")) + " ")], 1) : _c("NcActionButton", { attrs: { "close-after-click": true, "aria-label": _vm.t("photos", "Remove selection from favorites") }, on: { "click": _vm.unFavoriteSelection } }, [_c("Star", { attrs: { "slot": "icon" }, slot: "icon" }), _vm._v(" " + _vm._s(_vm.t("photos", "Remove from favorites")) + " ")], 1), _c("NcActionButton", { attrs: { "close-after-click": true }, on: { "click": function($event) {
    _vm.showMoveModal = true;
  } }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
    return [_c("AccountSwitchOutline")];
  }, proxy: true }], null, false, 1476410576) }, [_vm._v(" " + _vm._s(_vm.n("photos", "Move photo to a different person", "Move photos to a different person", _vm.selectedFileIds.length)) + " ")])] : _vm._e()], 2)], 1)]), _c("FilesListViewer", { staticClass: "face__photos", attrs: { "container-element": _vm.appContent, "file-ids": _vm.faceFileIds, "loading": _vm.loadingFiles || _vm.loadingFaces }, scopedSlots: _vm._u([{ key: "default", fn: function({ file, distance }) {
    return _c("FileComponent", { attrs: { "file": _vm.files[file.id], "allow-selection": true, "selected": _vm.selection[file.id] === true, "distance": distance }, on: { "click": _vm.openViewer, "select-toggled": _vm.onFileSelectToggle } });
  } }]) }), _vm.showMoveModal ? _c("NcDialog", { attrs: { "name": _vm.t("photos", "Move to different person"), "close-on-click-outside": "", "size": "normal" }, on: { "closing": function($event) {
    _vm.showMoveModal = false;
  } } }, [_c("FaceMergeForm", { attrs: { "first-face": "-1" }, on: { "select": function($event) {
    return _vm.handleMove($event, _vm.selectedFileIds);
  } } })], 1) : _vm._e()], 1);
};
var _sfc_staticRenderFns = [];
_sfc_render._withStripped = true;
var __component__ = /* @__PURE__ */ normalizeComponent(
  _sfc_main,
  _sfc_render,
  _sfc_staticRenderFns,
  false,
  null,
  "3e0b44cb"
);
__component__.options.__file = "/Users/effem/workbench/git/personel/photos/src/views/UnassignedFaces.vue";
const UnassignedFaces = __component__.exports;
export {
  UnassignedFaces as default
};
//# sourceMappingURL=UnassignedFaces-CyTlpx8E.chunk.mjs.map
