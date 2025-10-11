const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { d as defineComponent, t as translate, g as getCurrentUser } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
import { m as moment } from "./index-Cokc0amN.chunk.mjs";
import { U as UploadPicker } from "./index-DdKmqUaK-5iZCstwH.chunk.mjs";
import { u as useIsMobile } from "./video-C5pfp5p8.chunk.mjs";
import { f as NcLoadingIcon, N as NcButton, h as allMimes } from "./index-BOzawWmL.chunk.mjs";
import { N as NcDialog } from "./NcDialog-CKgpZOiy-CeLaNMKv.chunk.mjs";
import { N as NcNoteCard } from "./NcNoteCard-D-_SVIMX.chunk.mjs";
import { N as NcSelect } from "./NcSelect-CjUzohn5-OrPoxx8A.chunk.mjs";
import { w as ImagePlusOutline, n as normalizeComponent } from "./icons-BZLMM6Xn.chunk.mjs";
import { F as FileComponent } from "./FileComponent-CcjuR452.chunk.mjs";
import { F as FilesSelectionMixin, a as FilesListViewer } from "./FilesSelectionMixin-Bmgrjxxz.chunk.mjs";
import { F as FetchFilesMixin } from "./FetchFilesMixin-CM-yM5E8.chunk.mjs";
import { F as FilesByMonthMixin } from "./FilesByMonthMixin-AkjqRtVI.chunk.mjs";
const _sfc_main = defineComponent({
  name: "PhotosPicker",
  components: {
    FileComponent,
    FilesListViewer,
    ImagePlusOutline,
    NcButton,
    NcDialog,
    NcLoadingIcon,
    NcSelect,
    NcNoteCard,
    UploadPicker
  },
  mixins: [
    FetchFilesMixin,
    FilesByMonthMixin,
    FilesSelectionMixin
  ],
  props: {
    /**
     * If the photos picker should be opened
     */
    open: {
      type: Boolean,
      default: true
    },
    /**
     * Name to be used as heading
     */
    name: {
      type: String,
      required: true
    },
    // Label to show in the submit button.
    destination: {
      type: String,
      required: true
    },
    // List of file ids to not show.
    blacklistIds: {
      type: Array,
      default: () => []
    },
    // Whether we should disable the submit button and show a spinner.
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ["files-picked", "update:open"],
  setup() {
    return {
      isMobile: useIsMobile()
    };
  },
  data() {
    return {
      allowedMimes: allMimes,
      targetMonth: null,
      uploadContext: {
        route: "albumpicker"
      },
      currentUser: getCurrentUser()?.uid
    };
  },
  computed: {
    files() {
      return this.$store.state.files.files;
    },
    photosLocationFolder() {
      return this.$store.state.userConfig.photosLocationFolder;
    }
  },
  watch: {
    monthsList(value) {
      if (this.targetMonth === null) {
        this.targetMonth = value[0];
      }
    }
  },
  methods: {
    onFocusOut(event) {
      if (event.relatedTarget === null) {
        event.target?.focus({ preventScroll: true });
      }
    },
    getFiles() {
      this.fetchFiles({}, this.blacklistIds);
    },
    refreshFiles() {
      this.fetchFiles({ firstResult: 0 }, [...this.blacklistIds, ...this.fetchedFileIds], true);
    },
    emitPickedEvent() {
      this.$emit("files-picked", this.selectedFileIds);
    },
    /**
     * @param date - In the following format: YYYYMM
     */
    dateMonthAndYear(date) {
      if (this.isMobile) {
        return moment(date, "YYYYMM").format("MMM YYYY");
      }
      return moment(date, "YYYYMM").format("MMMM YYYY");
    },
    t: translate
  }
});
var _sfc_render = function render() {
  var _vm = this, _c = _vm._self._c;
  _vm._self._setupProxy;
  return _c("NcDialog", { attrs: { "content-classes": "photos-picker", "name": _vm.name, "open": _vm.open, "out-transition": "", "size": "large" }, on: { "update:open": (open) => _vm.$emit("update:open", open) }, scopedSlots: _vm._u([_vm.monthsList.length > 0 ? { key: "navigation", fn: function({ isCollapsed }) {
    return [isCollapsed ? _c("NcSelect", { staticClass: "photos-picker__navigation__month-select", attrs: { "aria-label-listbox": _vm.t("photos", "Dates"), "clearable": false, "input-label": _vm.t("photos", "Jump to specific date in list"), "options": _vm.monthsList }, scopedSlots: _vm._u([{ key: "selected-option", fn: function({ label }) {
      return [_vm._v(" " + _vm._s(_vm.dateMonthAndYear(label)) + " ")];
    } }, { key: "option", fn: function({ label }) {
      return [_vm._v(" " + _vm._s(_vm.dateMonthAndYear(label)) + " ")];
    } }], null, true), model: { value: _vm.targetMonth, callback: function($$v) {
      _vm.targetMonth = $$v;
    }, expression: "targetMonth" } }) : _c("ul", { attrs: { "aria-label": _vm.t("photos", "Dates") } }, _vm._l(_vm.monthsList, function(month) {
      return _c("li", { key: month, staticClass: "photos-picker__navigation__month" }, [_c("NcButton", { attrs: { "type": _vm.targetMonth === month ? "secondary" : "tertiary", "aria-label": _vm.t("photos", "Jump to {date}", { date: _vm.dateMonthAndYear(month) }) }, on: { "click": function($event) {
        _vm.targetMonth = month;
      } } }, [_vm._v(" " + _vm._s(_vm.dateMonthAndYear(month)) + " ")])], 1);
    }), 0)];
  } } : null, { key: "actions", fn: function() {
    return [_c("div", { staticClass: "photos-picker__actions" }, [_c("div", { staticClass: "photos-picker__actions__buttons" }, [_c("UploadPicker", { attrs: { "accept": _vm.allowedMimes, "context": _vm.uploadContext, "destination": _vm.photosLocationFolder, "multiple": "" }, on: { "uploaded": _vm.refreshFiles } }), _c("NcButton", { attrs: { "type": "primary", "disabled": _vm.loading || _vm.selectedFileIds.length === 0 }, on: { "click": _vm.emitPickedEvent }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
      return [!_vm.loading ? _c("ImagePlusOutline") : _vm._e(), _vm.loading ? _c("NcLoadingIcon") : _vm._e()];
    }, proxy: true }]) }, [_vm._v(" " + _vm._s(_vm.t("photos", "Add to {destination}", { destination: _vm.destination })) + " ")])], 1), _vm.photosLocationFolder?.attributes["owner-id"] !== _vm.currentUser ? _c("NcNoteCard", { attrs: { "type": "warning" } }, [_vm._v(" " + _vm._s(_vm.t("photos", "The destination folder is owned by {owner}", { owner: _vm.photosLocationFolder?.attributes["owner-id"] })) + " ")]) : _vm._e()], 1)];
  }, proxy: true }], null, true) }, [_c("FilesListViewer", { staticClass: "photos-picker__file-list", class: { "photos-picker__file-list--placeholder": _vm.monthsList.length === 0 }, attrs: { "file-ids-by-section": _vm.fileIdsByMonth, "empty-message": _vm.t("photos", "There are no photos or videos yet!"), "sections": _vm.monthsList, "loading": _vm.loadingFiles, "base-height": 100, "section-header-height": 50, "scroll-to-section": _vm.targetMonth }, on: { "need-content": _vm.getFiles }, nativeOn: { "focusout": function($event) {
    return _vm.onFocusOut.apply(null, arguments);
  } }, scopedSlots: _vm._u([{ key: "default", fn: function({ file, height, isHeader, distance }) {
    return [isHeader ? _c("h3", { staticClass: "section-header", style: { height: `${height}px` }, attrs: { "id": `photos-picker-section-header-${file.id}` } }, [_vm._v(" " + _vm._s(_vm.dateMonthAndYear(file.id)) + " ")]) : _c("FileComponent", { attrs: { "file": _vm.files[file.id], "allow-selection": true, "selected": _vm.selection[file.id] === true, "distance": distance }, on: { "select-toggled": _vm.onFileSelectToggle } })];
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
  "c877268b"
);
__component__.options.__file = "/Users/effem/workbench/git/personel/photos/src/components/PhotosPicker.vue";
const PhotosPicker = __component__.exports;
export {
  PhotosPicker as P
};
//# sourceMappingURL=PhotosPicker-CNnGJqQC.chunk.mjs.map
