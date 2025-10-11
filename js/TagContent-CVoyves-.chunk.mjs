const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { a as translatePlural, t as translate } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
import { u as useIsMobile } from "./video-C5pfp5p8.chunk.mjs";
import { N as NcActionButton } from "./NcActionButton-CuVNJJtW-5eBS5Sv2.chunk.mjs";
import { f as NcLoadingIcon, s as NcActions, ag as toViewerFileInfo, l as logger } from "./index-BOzawWmL.chunk.mjs";
import { N as NcEmptyContent } from "./NcEmptyContent-EDU4qhab.chunk.mjs";
import { B as ArrowLeft, n as normalizeComponent } from "./icons-BZLMM6Xn.chunk.mjs";
import { F as FileComponent } from "./FileComponent-CcjuR452.chunk.mjs";
import { F as FilesSelectionMixin, a as FilesListViewer } from "./FilesSelectionMixin-Bmgrjxxz.chunk.mjs";
import { A as AbortControllerMixin } from "./AbortControllerMixin-B_otrjDn.chunk.mjs";
import "./preload-helper-BO5AHt9u.chunk.mjs";
import "./index-Cokc0amN.chunk.mjs";
import "./NcCheckboxRadioSwitch-VeztTzpz-CPNGlVnf.chunk.mjs";
import "./useModelMigration-EhAWvqDD-DYrjrJkv.chunk.mjs";
import "./fileFetcher-UYL2it_6.chunk.mjs";
const _sfc_main = {
  name: "TagContent",
  components: {
    FileComponent,
    FilesListViewer,
    NcEmptyContent,
    NcActions,
    NcActionButton,
    NcLoadingIcon,
    ArrowLeft
  },
  mixins: [
    FilesSelectionMixin,
    AbortControllerMixin
  ],
  props: {
    path: {
      type: String,
      default: ""
    }
  },
  setup() {
    return {
      isMobile: useIsMobile()
    };
  },
  data() {
    return {
      error: null,
      loading: false,
      appContent: document.getElementById("app-content-vue")
    };
  },
  computed: {
    files() {
      return this.$store.state.files.files;
    },
    tags() {
      return this.$store.state.systemtags.tags;
    },
    // current tag id from current path
    tagId() {
      return this.$store.getters.tagId(this.path);
    },
    // current tag
    tag() {
      return this.tags[this.tagId];
    },
    // files list of the current tag
    fileIds() {
      return this.$store.state.systemtags.tagsFiles[this.tagId];
    },
    isEmpty() {
      return this.fileIds.length === 0;
    }
  },
  watch: {
    async path() {
      this.fetchContent();
    }
  },
  async beforeMount() {
    this.fetchContent();
  },
  methods: {
    async fetchContent() {
      window.OCA.Viewer.close();
      this.loading = true;
      this.error = null;
      try {
        if (!this.tags[this.tagId]) {
          await this.$store.dispatch("fetchAllTags", { signal: this.abortController.signal });
        }
        if (this.tag && !this.fileIds) {
          await this.$store.dispatch("fetchTagFiles", { id: this.tagId, signal: this.abortController.signal });
        }
      } catch (error) {
        logger.error("Failed to fetch tags", { error });
        this.error = true;
      } finally {
        this.loading = false;
      }
    },
    openViewer(fileId) {
      window.OCA.Viewer.open({
        fileInfo: toViewerFileInfo(this.files[fileId]),
        list: this.fileIds.map((fileId2) => toViewerFileInfo(this.files[fileId2]))
      });
    },
    t: translate,
    n: translatePlural
  }
};
var _sfc_render = function render() {
  var _vm = this, _c = _vm._self._c;
  return _vm.error ? _c("NcEmptyContent", { attrs: { "name": _vm.t("photos", "An error occurred") } }) : _vm.loading ? _c("NcLoadingIcon", { staticClass: "loader" }) : _c("div", [_c("div", { staticClass: "photos-navigation" }, [_c("NcActions", { staticClass: "photos-navigation__back" }, [_c("NcActionButton", { on: { "click": function($event) {
    return _vm.$router.push({ name: "tags" });
  } }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
    return [_c("ArrowLeft")];
  }, proxy: true }]) }, [_vm._v(" " + _vm._s(_vm.t("photos", "Back to tags overview")) + " ")])], 1), _c("h2", { staticClass: "photos-navigation__title" }, [_vm._v(" " + _vm._s(_vm.path) + " ")])], 1), _c("div", { staticClass: "heading-subline" }, [_vm._v(" " + _vm._s(_vm.n("photos", "%n photo", "%n photos", _vm.fileIds.length)) + " ")]), _vm.isEmpty ? _c("NcEmptyContent", { attrs: { "name": _vm.t("photos", "No photos with this tag yet") } }) : _vm._e(), _c("FilesListViewer", { staticClass: "tag__photos", attrs: { "container-element": _vm.appContent, "file-ids": _vm.fileIds, "base-height": _vm.isMobile ? 120 : 200, "loading": _vm.loading }, scopedSlots: _vm._u([{ key: "default", fn: function({ file, distance }) {
    return _c("FileComponent", { attrs: { "file": _vm.files[file.id], "allow-selection": true, "selected": _vm.selection[file.id] === true, "distance": distance }, on: { "click": _vm.openViewer, "select-toggled": _vm.onFileSelectToggle } });
  } }]) })], 1);
};
var _sfc_staticRenderFns = [];
_sfc_render._withStripped = true;
var __component__ = /* @__PURE__ */ normalizeComponent(
  _sfc_main,
  _sfc_render,
  _sfc_staticRenderFns,
  false,
  null,
  "99d92c38"
);
__component__.options.__file = "/Users/effem/workbench/git/personel/photos/src/views/TagContent.vue";
const TagContent = __component__.exports;
export {
  TagContent as default
};
//# sourceMappingURL=TagContent-CVoyves-.chunk.mjs.map
