const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { a as translatePlural, t as translate, V as Vue } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
import { N as NcActionButton } from "./NcActionButton-CuVNJJtW-5eBS5Sv2.chunk.mjs";
import { N as NcButton, s as NcActions, f as NcLoadingIcon, l as logger, ag as toViewerFileInfo } from "./index-BOzawWmL.chunk.mjs";
import { N as NcDialog } from "./NcDialog-CKgpZOiy-CeLaNMKv.chunk.mjs";
import { N as NcEmptyContent } from "./NcEmptyContent-EDU4qhab.chunk.mjs";
import { W as AccountSwitchOutline, s as AccountBoxMultipleOutline, B as ArrowLeft, X as Merge, Q as SendOutline, z as AlertCircleOutline, x as Close, G as DownloadOutline, S as StarOutline, f as Star, v as PencilOutline, n as normalizeComponent } from "./icons-BZLMM6Xn.chunk.mjs";
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
  name: "FaceContent",
  components: {
    PencilOutline,
    Star,
    StarOutline,
    Download: DownloadOutline,
    Close,
    AlertCircleOutline,
    SendOutline,
    Merge,
    ArrowLeft,
    AccountBoxMultipleOutline,
    FaceMergeForm,
    FilesListViewer,
    FileComponent,
    NcLoadingIcon,
    NcEmptyContent,
    NcActions,
    NcActionButton,
    NcDialog,
    NcButton,
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
  props: {
    faceName: {
      type: String,
      default: "/"
    }
  },
  data() {
    return {
      showMoveModal: false,
      showMergeModal: false,
      showRenameModal: false,
      loadingCount: 0,
      appContent: document.getElementById("app-content-vue")
    };
  },
  computed: {
    files() {
      return this.$store.state.files.files;
    },
    facesFiles() {
      return this.$store.state.faces.facesFiles;
    },
    face() {
      return this.faces[this.faceName];
    },
    faceFileIds() {
      return this.facesFiles[this.faceName] || [];
    },
    shouldFavoriteSelection() {
      return this.selectedFileIds.some((fileId) => this.$store.state.files.files[fileId].attributes.favorite === 0);
    }
  },
  watch: {
    face() {
      if (this.face) {
        this.fetchFaceContent(this.faceName);
      }
    }
  },
  mounted() {
    this.fetchFaceContent(this.faceName);
  },
  methods: {
    openViewer(fileId) {
      window.OCA.Viewer.open({
        fileInfo: toViewerFileInfo(this.files[fileId]),
        list: this.faceFileIds.map((fileId2) => toViewerFileInfo(this.files[fileId2]))
      });
    },
    async handleRemoveFilesFromFace(fileIds) {
      try {
        this.loadingCount++;
        await this.$store.dispatch("removeFilesFromFace", { faceName: this.faceName, fileIdsToRemove: fileIds });
        this.resetSelection();
      } catch (error) {
        logger.error(error);
      } finally {
        this.loadingCount--;
      }
    },
    async handleDeleteFace() {
      try {
        this.loadingCount++;
        await this.$store.dispatch("deleteFace", { faceName: this.faceName });
        this.$router.push("/faces");
      } catch (error) {
        logger.error(error);
      } finally {
        this.loadingCount--;
      }
    },
    async handleRenameFace(faceName) {
      try {
        this.loadingCount++;
        this.showRenameModal = false;
        const oldName = this.faceName;
        await this.$store.dispatch("renameFace", { oldName, faceName });
        this.$router.push({ name: "facecontent", params: { faceName } });
      } catch (error) {
        logger.error(error);
      } finally {
        this.loadingCount--;
      }
    },
    async handleMerge(faceName) {
      try {
        this.loadingCount++;
        await this.$store.dispatch("moveFilesToFace", { oldFace: this.faceName, faceName, fileIdsToMove: this.facesFiles[this.faceName] });
        await this.$store.dispatch("deleteFace", { faceName: this.faceName });
        this.showMergeModal = false;
        this.$router.push({ name: "facecontent", params: { faceName } });
      } catch (error) {
        logger.error(error);
      } finally {
        this.loadingCount--;
      }
    },
    async handleMove(faceName, fileIds) {
      try {
        this.loadingCount++;
        await this.$store.dispatch("moveFilesToFace", { oldFace: this.faceName, faceName, fileIdsToMove: fileIds });
        this.showMoveModal = false;
      } catch (error) {
        logger.error(error);
      } finally {
        this.loadingCount--;
      }
    },
    async favoriteSelection() {
      try {
        this.loadingCount++;
        await this.$store.dispatch("toggleFavoriteForFiles", { fileIds: this.selectedFileIds, favoriteState: true });
      } catch (error) {
        logger.error(error);
      } finally {
        this.loadingCount--;
      }
    },
    async unFavoriteSelection() {
      try {
        this.loadingCount++;
        await this.$store.dispatch("toggleFavoriteForFiles", { fileIds: this.selectedFileIds, favoriteState: false });
      } catch (error) {
        logger.error(error);
      } finally {
        this.loadingCount--;
      }
    },
    async downloadSelection() {
      try {
        this.loadingCount++;
        await this.$store.dispatch("downloadFiles", this.selectedFileIds);
      } catch (error) {
        logger.error(error);
      } finally {
        this.loadingCount--;
      }
    },
    t: translate,
    n: translatePlural
  }
};
var _sfc_render = function render() {
  var _vm = this, _c = _vm._self._c;
  return _vm.face === void 0 && !_vm.loadingFiles && !_vm.loadingFaces ? _c("NcEmptyContent", { staticClass: "empty-content-with-illustration", scopedSlots: _vm._u([{ key: "icon", fn: function() {
    return [_c("AccountBoxMultipleOutline")];
  }, proxy: true }], null, false, 2861705255) }, [_vm._v(" " + _vm._s(_vm.t("photos", "This person could not be found")) + " ")]) : _vm.errorFetchingFiles || _vm.errorFetchingFaces ? _c("NcEmptyContent", { scopedSlots: _vm._u([{ key: "icon", fn: function() {
    return [_c("AlertCircleOutline")];
  }, proxy: true }]) }, [_vm._v(" " + _vm._s(_vm.t("photos", "An error occurred")) + " ")]) : _c("div", { staticClass: "face" }, [_c("div", { staticClass: "face__header" }, [_c("div", { staticClass: "face__header__left" }, [_c("NcActions", [_c("NcActionButton", { on: { "click": function($event) {
    return _vm.$router.push("/faces/");
  } }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
    return [_c("ArrowLeft")];
  }, proxy: true }]) }, [_vm._v(_vm._s(_vm.t("photos", "Back")) + " ")])], 1), _c("div", { staticClass: "face__header__title" }, [_vm.face !== void 0 ? _c("h2", { class: { "face-name": true, "hidden-visually": _vm.face.basename.match(/^[0-9]+$/) } }, [_vm._v(" " + _vm._s(_vm.face.basename) + " ")]) : _vm._e()]), _vm.loadingCount > 0 || _vm.loadingFaces ? _c("NcLoadingIcon") : _vm._e()], 1), _vm.face !== void 0 ? _c("div", { staticClass: "face__header__actions" }, [_c("NcActions", [_c("NcActionButton", { attrs: { "close-after-click": true, "aria-label": _vm.t("photos", "Rename person") }, on: { "click": function($event) {
    _vm.showRenameModal = true;
  } }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
    return [_c("PencilOutline")];
  }, proxy: true }], null, false, 347985790) }, [_vm._v(" " + _vm._s(_vm.t("photos", "Rename person")) + " ")])], 1), _c("NcActions", { attrs: { "force-menu": true } }, [Object.keys(_vm.faces).length > 1 ? _c("NcActionButton", { attrs: { "close-after-click": true, "aria-label": _vm.t("photos", "Merge with different person") }, on: { "click": function($event) {
    _vm.showMergeModal = true;
  } }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
    return [_c("Merge")];
  }, proxy: true }], null, false, 3117189691) }, [_vm._v(" " + _vm._s(_vm.t("photos", "Merge with different person")) + " ")]) : _vm._e(), _vm.selectedFileIds.length ? [_c("NcActionButton", { attrs: { "close-after-click": true, "aria-label": _vm.t("photos", "Download selected files") }, on: { "click": _vm.downloadSelection } }, [_c("Download", { attrs: { "slot": "icon" }, slot: "icon" }), _vm._v(" " + _vm._s(_vm.t("photos", "Download selected photos")) + " ")], 1), _vm.shouldFavoriteSelection ? _c("NcActionButton", { attrs: { "close-after-click": true, "aria-label": _vm.t("photos", "Mark selection as favorite") }, on: { "click": _vm.favoriteSelection } }, [_c("StarOutline", { attrs: { "slot": "icon" }, slot: "icon" }), _vm._v(" " + _vm._s(_vm.t("photos", "Favorite")) + " ")], 1) : _c("NcActionButton", { attrs: { "close-after-click": true, "aria-label": _vm.t("photos", "Remove selection from favorites") }, on: { "click": _vm.unFavoriteSelection } }, [_c("Star", { attrs: { "slot": "icon" }, slot: "icon" }), _vm._v(" " + _vm._s(_vm.t("photos", "Remove from favorites")) + " ")], 1), _c("NcActionButton", { attrs: { "close-after-click": true }, on: { "click": function($event) {
    _vm.showMoveModal = true;
  } }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
    return [_c("AccountSwitchOutline")];
  }, proxy: true }], null, false, 1476410576) }, [_vm._v(" " + _vm._s(_vm.n("photos", "Move photo to a different person", "Move photos to a different person", _vm.selectedFileIds.length)) + " ")]), _c("NcActionButton", { attrs: { "close-after-click": true }, on: { "click": function($event) {
    return _vm.handleRemoveFilesFromFace(_vm.selectedFileIds);
  } }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
    return [_c("Close")];
  }, proxy: true }], null, false, 1051939733) }, [_vm._v(" " + _vm._s(_vm.n("photos", "Remove photo from person", "Remove photos from person", _vm.selectedFileIds.length)) + " ")])] : _vm._e(), _c("NcActionButton", { attrs: { "close-after-click": true }, on: { "click": _vm.handleDeleteFace }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
    return [_c("Close")];
  }, proxy: true }], null, false, 1051939733) }, [_vm._v(" " + _vm._s(_vm.t("photos", "Remove person")) + " ")])], 2)], 1) : _vm._e()]), _vm.face !== void 0 ? _c("FilesListViewer", { staticClass: "face__photos", attrs: { "container-element": _vm.appContent, "file-ids": _vm.faceFileIds, "loading": _vm.loadingFiles || _vm.loadingFaces }, scopedSlots: _vm._u([{ key: "default", fn: function({ file, distance }) {
    return _c("FileComponent", { attrs: { "file": _vm.files[file.id], "allow-selection": true, "selected": _vm.selection[file.id] === true, "distance": distance }, on: { "click": _vm.openViewer, "select-toggled": _vm.onFileSelectToggle } });
  } }], null, false, 405762677) }) : _vm._e(), _vm.showRenameModal ? _c("NcDialog", { attrs: { "name": _vm.t("photos", "Rename person"), "close-on-click-outside": "", "size": "small" }, on: { "closing": function($event) {
    _vm.showRenameModal = false;
  } }, scopedSlots: _vm._u([{ key: "actions", fn: function() {
    return [_c("NcButton", { attrs: { "aria-label": _vm.t("photos", "Save."), "type": "primary", "disabled": _vm.$refs.nameInput && _vm.$refs.nameInput.value.trim() === "" }, on: { "click": function($event) {
      return _vm.handleRenameFace(_vm.$refs.nameInput.value);
    } }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
      return [_vm.loadingCount ? _c("NcLoadingIcon") : _c("SendOutline")];
    }, proxy: true }], null, false, 4093389955) }, [_vm._v(" " + _vm._s(_vm.t("photos", "Save")) + " ")])];
  }, proxy: true }], null, false, 732723997) }, [_c("div", { staticClass: "rename-form" }, [_c("input", { directives: [{ name: "focus", rawName: "v-focus" }], ref: "nameInput", attrs: { "type": "text", "name": "name", "required": "", "placeholder": _vm.t("photos", "Name of this person") }, domProps: { "value": _vm.faceName }, on: { "keydown": function($event) {
    if (!$event.type.indexOf("key") && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) return null;
    return _vm.handleRenameFace(_vm.$refs.nameInput.value);
  } } })])]) : _vm._e(), _vm.showMergeModal ? _c("NcDialog", { attrs: { "name": _vm.t("photos", "Merge person"), "close-on-click-outside": "", "size": "normal" }, on: { "closing": function($event) {
    _vm.showMergeModal = false;
  } } }, [_c("FaceMergeForm", { attrs: { "first-face": _vm.faceName }, on: { "select": function($event) {
    return _vm.handleMerge($event);
  } } })], 1) : _vm._e(), _vm.showMoveModal ? _c("NcDialog", { attrs: { "name": _vm.t("photos", "Move to different person"), "close-on-click-outside": "", "size": "normal" }, on: { "closing": function($event) {
    _vm.showMoveModal = false;
  } } }, [_c("FaceMergeForm", { attrs: { "first-face": _vm.faceName }, on: { "select": function($event) {
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
  "b58dc974"
);
__component__.options.__file = "/Users/effem/workbench/git/personel/photos/src/views/FaceContent.vue";
const FaceContent = __component__.exports;
export {
  FaceContent as default
};
//# sourceMappingURL=FaceContent-3Ms3YgAA.chunk.mjs.map
