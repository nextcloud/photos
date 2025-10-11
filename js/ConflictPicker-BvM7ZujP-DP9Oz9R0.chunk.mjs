const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { d as defineComponent, K as FileType, _ } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
import { N as NcButton, aj as showError } from "./index-BOzawWmL.chunk.mjs";
import { N as NcDialog } from "./NcDialog-CKgpZOiy-CeLaNMKv.chunk.mjs";
import { b as getUniqueName, f as formatFileSize } from "./index-Cokc0amN.chunk.mjs";
import { n as normalizeComponent, t, l as logger, i as isFileSystemEntry, a as n, b as isFileSystemFileEntry } from "./index-DdKmqUaK-5iZCstwH.chunk.mjs";
import { N as NcCheckboxRadioSwitch } from "./NcCheckboxRadioSwitch-VeztTzpz-CPNGlVnf.chunk.mjs";
import { N as NcDateTime } from "./NcDateTime-DshRFtUU-w5TCTRwf.chunk.mjs";
import "./preload-helper-BO5AHt9u.chunk.mjs";
import "./index-BrMrQMP2.chunk.mjs";
import "./useHotKey-CDShbxMN.chunk.mjs";
import "./NcActionButton-CuVNJJtW-5eBS5Sv2.chunk.mjs";
import "./NcProgressBar-DegJ2JjE-BAVaOw4q.chunk.mjs";
import "./index-DTU2Yy1K.chunk.mjs";
import "./dialog-CIZq3-6b.chunk.mjs";
import "./useModelMigration-EhAWvqDD-DYrjrJkv.chunk.mjs";
const _sfc_main$5 = {
  name: "ArrowRightIcon",
  emits: ["click"],
  props: {
    title: {
      type: String
    },
    fillColor: {
      type: String,
      default: "currentColor"
    },
    size: {
      type: Number,
      default: 24
    }
  }
};
var _sfc_render$5 = function render() {
  var _vm = this, _c = _vm._self._c;
  return _c("span", _vm._b({ staticClass: "material-design-icon arrow-right-icon", attrs: { "aria-hidden": _vm.title ? null : "true", "aria-label": _vm.title, "role": "img" }, on: { "click": function($event) {
    return _vm.$emit("click", $event);
  } } }, "span", _vm.$attrs, false), [_c("svg", { staticClass: "material-design-icon__svg", attrs: { "fill": _vm.fillColor, "width": _vm.size, "height": _vm.size, "viewBox": "0 0 24 24" } }, [_c("path", { attrs: { "d": "M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" } }, [_vm.title ? _c("title", [_vm._v(_vm._s(_vm.title))]) : _vm._e()])])]);
};
var _sfc_staticRenderFns$5 = [];
var __component__$5 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$5,
  _sfc_render$5,
  _sfc_staticRenderFns$5,
  false,
  null,
  null
);
const ArrowRight = __component__$5.exports;
const _sfc_main$4 = {
  name: "CloseIcon",
  emits: ["click"],
  props: {
    title: {
      type: String
    },
    fillColor: {
      type: String,
      default: "currentColor"
    },
    size: {
      type: Number,
      default: 24
    }
  }
};
var _sfc_render$4 = function render2() {
  var _vm = this, _c = _vm._self._c;
  return _c("span", _vm._b({ staticClass: "material-design-icon close-icon", attrs: { "aria-hidden": _vm.title ? null : "true", "aria-label": _vm.title, "role": "img" }, on: { "click": function($event) {
    return _vm.$emit("click", $event);
  } } }, "span", _vm.$attrs, false), [_c("svg", { staticClass: "material-design-icon__svg", attrs: { "fill": _vm.fillColor, "width": _vm.size, "height": _vm.size, "viewBox": "0 0 24 24" } }, [_c("path", { attrs: { "d": "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" } }, [_vm.title ? _c("title", [_vm._v(_vm._s(_vm.title))]) : _vm._e()])])]);
};
var _sfc_staticRenderFns$4 = [];
var __component__$4 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$4,
  _sfc_render$4,
  _sfc_staticRenderFns$4,
  false,
  null,
  null
);
const Close = __component__$4.exports;
const _sfc_main$3 = {
  name: "FileIcon",
  emits: ["click"],
  props: {
    title: {
      type: String
    },
    fillColor: {
      type: String,
      default: "currentColor"
    },
    size: {
      type: Number,
      default: 24
    }
  }
};
var _sfc_render$3 = function render3() {
  var _vm = this, _c = _vm._self._c;
  return _c("span", _vm._b({ staticClass: "material-design-icon file-icon", attrs: { "aria-hidden": _vm.title ? null : "true", "aria-label": _vm.title, "role": "img" }, on: { "click": function($event) {
    return _vm.$emit("click", $event);
  } } }, "span", _vm.$attrs, false), [_c("svg", { staticClass: "material-design-icon__svg", attrs: { "fill": _vm.fillColor, "width": _vm.size, "height": _vm.size, "viewBox": "0 0 24 24" } }, [_c("path", { attrs: { "d": "M13,9V3.5L18.5,9M6,2C4.89,2 4,2.89 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2H6Z" } }, [_vm.title ? _c("title", [_vm._v(_vm._s(_vm.title))]) : _vm._e()])])]);
};
var _sfc_staticRenderFns$3 = [];
var __component__$3 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$3,
  _sfc_render$3,
  _sfc_staticRenderFns$3,
  false,
  null,
  null
);
const FileSvg = __component__$3.exports;
const _sfc_main$2 = {
  name: "FolderIcon",
  emits: ["click"],
  props: {
    title: {
      type: String
    },
    fillColor: {
      type: String,
      default: "currentColor"
    },
    size: {
      type: Number,
      default: 24
    }
  }
};
var _sfc_render$2 = function render4() {
  var _vm = this, _c = _vm._self._c;
  return _c("span", _vm._b({ staticClass: "material-design-icon folder-icon", attrs: { "aria-hidden": _vm.title ? null : "true", "aria-label": _vm.title, "role": "img" }, on: { "click": function($event) {
    return _vm.$emit("click", $event);
  } } }, "span", _vm.$attrs, false), [_c("svg", { staticClass: "material-design-icon__svg", attrs: { "fill": _vm.fillColor, "width": _vm.size, "height": _vm.size, "viewBox": "0 0 24 24" } }, [_c("path", { attrs: { "d": "M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z" } }, [_vm.title ? _c("title", [_vm._v(_vm._s(_vm.title))]) : _vm._e()])])]);
};
var _sfc_staticRenderFns$2 = [];
var __component__$2 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$2,
  _sfc_render$2,
  _sfc_staticRenderFns$2,
  false,
  null,
  null
);
const FolderSvg = __component__$2.exports;
const PREVIEW_SIZE = 64;
const _sfc_main$1 = defineComponent({
  name: "NodesPicker",
  components: {
    FileSvg,
    FolderSvg,
    NcCheckboxRadioSwitch,
    NcDateTime
  },
  props: {
    incoming: {
      type: [File, Object],
      required: true
    },
    existing: {
      type: Object,
      required: true
    },
    newSelected: {
      type: Array,
      required: true
    },
    oldSelected: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      asyncPreview: null,
      incomingFile: null
    };
  },
  computed: {
    /**
     * Whether the incoming or existing file is selected.
     * This is used by the parent component to ensure
     * that the user has selected at least one of the two files.
     */
    isEnoughSelected() {
      return this.isChecked(this.incoming, this.newSelected) || this.isChecked(this.existing, this.oldSelected);
    },
    incomingPreview() {
      if (!this.incomingFile) {
        return null;
      }
      const preview = this.previewUrl(this.incomingFile);
      return preview ?? this.asyncPreview;
    },
    incomingLastModified() {
      if (!this.incomingFile) {
        return null;
      }
      return this.lastModified(this.incomingFile);
    },
    incomingSize() {
      if (!this.incomingFile) {
        return t("Unknown size");
      }
      return this.size(this.incomingFile);
    },
    existingPreview() {
      return this.previewUrl(this.existing);
    },
    existingLastModified() {
      return this.lastModified(this.existing);
    }
  },
  watch: {
    /**
     * Watch "incoming" to update "incomingFile"
     */
    incoming: {
      // Run the watcher also on mount with initial "incoming" value
      immediate: true,
      async handler() {
        if (this.incoming instanceof File) {
          this.incomingFile = this.incoming;
        } else if (isFileSystemFileEntry(this.incoming)) {
          this.incomingFile = await new Promise((resolve, reject) => this.incoming.file(resolve, reject));
        } else {
          this.incomingFile = null;
        }
      }
    }
  },
  methods: {
    lastModified(node) {
      const lastModified = node instanceof File ? new Date(node.lastModified) : node.mtime;
      return lastModified ?? null;
    },
    size(node) {
      if (node.size) {
        return formatFileSize(node.size, true);
      }
      return t("Unknown size");
    },
    previewUrl(node) {
      if (node instanceof File) {
        this.previewImage(node).then((url) => {
          this.asyncPreview = url;
        });
        return null;
      }
      if (node.type === FileType.Folder) {
        return null;
      }
      try {
        const previewUrl = node.attributes.previewUrl || _("/core/preview?fileId={fileid}", {
          fileid: node.fileid
        });
        const url = new URL(window.location.origin + previewUrl);
        url.searchParams.set("x", PREVIEW_SIZE.toString());
        url.searchParams.set("y", PREVIEW_SIZE.toString());
        url.searchParams.set("mimeFallback", "true");
        const etag = node.attributes?.etag || "";
        url.searchParams.set("v", etag.slice(0, 6));
        return url.href;
      } catch (e) {
        return null;
      }
    },
    isFolder(node) {
      if (isFileSystemEntry(node)) {
        return node.isDirectory;
      }
      node = node;
      return node.type === FileType.Folder || node.type === "httpd/unix-directory";
    },
    isChecked(node, selected) {
      return selected.includes(node);
    },
    onUpdateIncomingChecked(checked) {
      if (checked) {
        this.$emit("update:newSelected", [this.incoming, ...this.newSelected]);
      } else {
        this.$emit("update:newSelected", this.newSelected.filter((node) => node !== this.incoming));
      }
    },
    onUpdateExistingChecked(checked) {
      if (checked) {
        this.$emit("update:oldSelected", [this.existing, ...this.oldSelected]);
      } else {
        this.$emit("update:oldSelected", this.oldSelected.filter((node) => node !== this.existing));
      }
    },
    /**
     * Get the preview Image of a file
     * @param file the soon-to-be-uploaded File
     */
    async previewImage(file) {
      return new Promise((resolve) => {
        if (file instanceof File && file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = async (e) => {
            const result = e?.target?.result;
            if (result instanceof ArrayBuffer) {
              const blob = new Blob([result], { type: file.type });
              const url = URL.createObjectURL(blob);
              resolve(url);
              return;
            }
            resolve(null);
          };
          reader.readAsArrayBuffer(file);
        } else {
          resolve(null);
        }
      });
    },
    t
  }
});
var _sfc_render$1 = function render5() {
  var _vm = this, _c = _vm._self._c;
  _vm._self._setupProxy;
  return _c("fieldset", { staticClass: "node-picker__wrapper", attrs: { "data-cy-conflict-picker-fieldset": _vm.existing.basename } }, [_c("legend", [_vm._v(_vm._s(_vm.existing.basename))]), _c("NcCheckboxRadioSwitch", { attrs: { "checked": _vm.isChecked(_vm.incoming, _vm.newSelected), "required": !_vm.isEnoughSelected, "data-cy-conflict-picker-input-incoming": _vm.existing.basename }, on: { "update:checked": _vm.onUpdateIncomingChecked } }, [_c("span", { staticClass: "node-picker node-picker--incoming" }, [!_vm.incomingPreview ? [_vm.isFolder(_vm.incoming) ? _c("FolderSvg", { staticClass: "node-picker__icon", attrs: { "size": 48 } }) : _c("FileSvg", { staticClass: "node-picker__icon", attrs: { "size": 48 } })] : _c("img", { staticClass: "node-picker__preview", attrs: { "src": _vm.incomingPreview, "alt": _vm.t("Preview image"), "loading": "lazy" } }), _c("span", { staticClass: "node-picker__desc" }, [_c("span", { staticClass: "node-picker__name" }, [_vm._v(_vm._s(_vm.t("New version")))]), _vm.incomingLastModified ? _c("NcDateTime", { staticClass: "node-picker__mtime", attrs: { "timestamp": _vm.incomingLastModified, "relative-time": false, "format": { timeStyle: "short", dateStyle: "medium" } } }) : _c("span", { staticClass: "node-picker__mtime" }, [_vm._v(" " + _vm._s(_vm.t("Last modified date unknown")) + " ")]), _c("span", { staticClass: "node-picker__size" }, [_vm._v(_vm._s(_vm.incomingSize))])], 1)], 2)]), _c("NcCheckboxRadioSwitch", { attrs: { "checked": _vm.isChecked(_vm.existing, _vm.oldSelected), "required": !_vm.isEnoughSelected, "data-cy-conflict-picker-input-existing": _vm.existing.basename }, on: { "update:checked": _vm.onUpdateExistingChecked } }, [_c("span", { staticClass: "node-picker node-picker--existing" }, [!_vm.existingPreview ? [_vm.isFolder(_vm.existing) ? _c("FolderSvg", { staticClass: "node-picker__icon", attrs: { "size": 48 } }) : _c("FileSvg", { staticClass: "node-picker__icon", attrs: { "size": 48 } })] : _c("img", { staticClass: "node-picker__preview", attrs: { "src": _vm.existingPreview, "alt": _vm.t("Preview image"), "loading": "lazy" } }), _c("span", { staticClass: "node-picker__desc" }, [_c("span", { staticClass: "node-picker__name" }, [_vm._v(_vm._s(_vm.t("Existing version")))]), _vm.existingLastModified ? _c("NcDateTime", { staticClass: "node-picker__mtime", attrs: { "timestamp": _vm.existingLastModified, "relative-time": false, "format": { timeStyle: "short", dateStyle: "medium" } } }) : _c("span", { staticClass: "node-picker__mtime" }, [_vm._v(" " + _vm._s(_vm.t("Last modified date unknown")) + " ")]), _c("span", { staticClass: "node-picker__size" }, [_vm._v(_vm._s(_vm.size(_vm.existing)))])], 1)], 2)])], 1);
};
var _sfc_staticRenderFns$1 = [];
var __component__$1 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$1,
  _sfc_render$1,
  _sfc_staticRenderFns$1,
  false,
  null,
  "a1eb0469"
);
const NodesPicker = __component__$1.exports;
const _sfc_main = defineComponent({
  name: "ConflictPicker",
  components: {
    ArrowRight,
    Close,
    NcButton,
    NcCheckboxRadioSwitch,
    NcDialog,
    NodesPicker
  },
  props: {
    /** Directory/context file name */
    dirname: {
      type: String,
      default: ""
    },
    /** All the existing files in the current directory */
    content: {
      type: Array,
      required: true
    },
    /** New files being moved/uploaded */
    conflicts: {
      type: Array,
      required: true
    },
    /**
     * If set to true no hint about overwriting directory content will be shown
     */
    recursiveUpload: {
      type: Boolean,
      default: false
    }
  },
  emits: ["cancel", "submit"],
  setup() {
    return {
      blockedTitle: t("You need to select at least one version of each file to continue.")
    };
  },
  data() {
    return {
      // computed list of conflicting files already present in the directory
      files: [],
      opened: true,
      newSelected: [],
      oldSelected: []
    };
  },
  computed: {
    name() {
      if (this?.dirname?.trim?.() !== "") {
        return n("{count} file conflict in {dirname}", "{count} file conflicts in {dirname}", this.conflicts.length, {
          count: this.conflicts.length,
          dirname: this.dirname
        });
      }
      return n("{count} file conflict", "{count} files conflict", this.conflicts.length, { count: this.conflicts.length });
    },
    skipButtonLabel() {
      if (this.conflicts.length === 1) {
        return t("Skip this file");
      }
      return n("Skip {count} file", "Skip {count} files", this.conflicts.length, { count: this.conflicts.length });
    },
    // Select all incoming files
    selectAllNewBind() {
      const label = this.isNoneNewSelected || this.isSomeNewSelected ? this.t("Select all") : this.t("Unselect all");
      return {
        "aria-label": label,
        checked: this.isAllNewSelected,
        indeterminate: this.isSomeNewSelected,
        title: label
      };
    },
    isAllNewSelected() {
      return this.newSelected.length === this.conflicts.length;
    },
    isNoneNewSelected() {
      return this.newSelected.length === 0;
    },
    isSomeNewSelected() {
      return !this.isAllNewSelected && !this.isNoneNewSelected;
    },
    // Select all existing files
    selectAllOldBind() {
      const label = this.isNoneOldSelected || this.isSomeOldSelected ? this.t("Select all") : this.t("Unselect all");
      return {
        "aria-label": label,
        checked: this.isAllOldSelected,
        indeterminate: this.isSomeOldSelected,
        title: label
      };
    },
    isAllOldSelected() {
      return this.oldSelected.length === this.files.length;
    },
    isNoneOldSelected() {
      return this.oldSelected.length === 0;
    },
    isSomeOldSelected() {
      return !this.isAllOldSelected && !this.isNoneOldSelected;
    },
    // Global handlings
    isEnoughSelected() {
      if (this.isAllOldSelected || this.isAllNewSelected) {
        return true;
      }
      return this.$refs?.nodesPicker?.every?.((picker) => picker.isEnoughSelected);
    }
  },
  mounted() {
    this.files = this.conflicts.map((conflict) => {
      const name = conflict instanceof File || isFileSystemEntry(conflict) ? conflict.name : conflict.basename;
      return this.content.find((node) => node.basename === name);
    }).filter(Boolean);
    if (this.conflicts.length === 0 || this.files.length === 0) {
      const error = new Error("ConflictPicker: files and conflicts must not be empty");
      this.onCancel(error);
      throw error;
    }
    if (this.conflicts.length !== this.files.length) {
      const error = new Error("ConflictPicker: files and conflicts must have the same length. Make sure you filter out non conflicting files from the conflicts array.");
      this.onCancel(error);
      throw error;
    }
    logger.debug("ConflictPicker initialised", { files: this.files, conflicts: this.conflicts, content: this.content });
  },
  methods: {
    onCancel(error) {
      this.opened = false;
      this.$emit("cancel", error);
    },
    onSkip() {
      logger.debug("Conflict skipped. Ignoring all conflicting files");
      this.opened = false;
      this.$emit("submit", {
        selected: [],
        renamed: []
      });
    },
    onSubmit() {
      if (!this.isEnoughSelected) {
        this.scrollValidityInputIntoView();
        this.$refs.form.reportValidity();
        showError(this.blockedTitle);
        return;
      }
      const selectedOldNames = this.oldSelected.map((node) => node.basename);
      const directoryContent = this.content.map((node) => node.basename);
      const renamed = [];
      const toRename = this.newSelected.filter((node) => {
        const name = node instanceof File || isFileSystemEntry(node) ? node.name : node.basename;
        return selectedOldNames.includes(name);
      });
      if (toRename.length > 0) {
        toRename.forEach((file) => {
          const name = file instanceof File || isFileSystemEntry(file) ? file.name : file.basename;
          const newName = getUniqueName(name, directoryContent);
          if (file instanceof File || isFileSystemEntry(file)) {
            Object.defineProperty(file, "name", { value: newName });
            renamed.push(file);
            return;
          }
          file.rename(newName);
          renamed.push(file);
        });
      }
      const selected = this.newSelected.filter((node) => {
        const name = node instanceof File || isFileSystemEntry(node) ? node.name : node.basename;
        return !selectedOldNames.includes(name) && !toRename.includes(node);
      });
      logger.debug("Conflict resolved", { selected, renamed });
      this.opened = false;
      this.$emit("submit", {
        selected,
        renamed
      });
    },
    /**
     * Scroll the first invalid input into view.
     * This is needed because the browser uses behavior: "nearest" by default.
     */
    scrollValidityInputIntoView() {
      const selector = '.checkbox-radio-switch input[type="checkbox"]';
      const checkboxes = Array.from(this.$el.querySelectorAll(selector));
      checkboxes.forEach((input) => input?.setCustomValidity?.(""));
      const invalidInput = this.$el.querySelector(selector + ":invalid");
      if (invalidInput) {
        invalidInput.setCustomValidity(this.blockedTitle);
        invalidInput.scrollIntoView({ behavior: "instant", block: "center" });
      }
    },
    onSelectAllNew(selected) {
      if (selected) {
        logger.debug("Selected all new files");
        this.newSelected = this.conflicts;
      } else {
        logger.debug("Cleared new selection");
        this.newSelected = [];
      }
    },
    onSelectAllOld(selected) {
      if (selected) {
        logger.debug("Selected all existing files");
        this.oldSelected = this.files;
      } else {
        logger.debug("Cleared old selection");
        this.oldSelected = [];
      }
    },
    t
  }
});
var _sfc_render = function render6() {
  var _vm = this, _c = _vm._self._c;
  _vm._self._setupProxy;
  return _c("NcDialog", { staticClass: "conflict-picker", attrs: { "can-close": "", "data-cy-conflict-picker": "", "close-on-click-outside": false, "show": _vm.opened, "name": _vm.name, "size": "large" }, on: { "closing": _vm.onCancel }, scopedSlots: _vm._u([{ key: "actions", fn: function() {
    return [_c("NcButton", { attrs: { "aria-label": _vm.t("Cancel"), "title": _vm.t("Cancel the entire operation"), "data-cy-conflict-picker-cancel": "", "type": "tertiary" }, on: { "click": _vm.onCancel }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
      return [_c("Close", { attrs: { "size": 20 } })];
    }, proxy: true }]) }, [_vm._v(" " + _vm._s(_vm.t("Cancel")) + " ")]), _c("span", { staticClass: "dialog__actions-separator" }), _c("NcButton", { attrs: { "aria-label": _vm.skipButtonLabel, "data-cy-conflict-picker-skip": "" }, on: { "click": _vm.onSkip }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
      return [_c("Close", { attrs: { "size": 20 } })];
    }, proxy: true }]) }, [_vm._v(" " + _vm._s(_vm.skipButtonLabel) + " ")]), _c("NcButton", { class: { "button-vue--disabled": !_vm.isEnoughSelected }, attrs: { "aria-label": _vm.t("Continue"), "title": _vm.isEnoughSelected ? "" : _vm.blockedTitle, "data-cy-conflict-picker-submit": "", "native-type": "submit", "type": "primary" }, on: { "click": function($event) {
      $event.stopPropagation();
      $event.preventDefault();
      return _vm.onSubmit.apply(null, arguments);
    } }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
      return [_c("ArrowRight", { attrs: { "size": 20 } })];
    }, proxy: true }]) }, [_vm._v(" " + _vm._s(_vm.t("Continue")) + " ")])];
  }, proxy: true }]) }, [_c("div", { staticClass: "conflict-picker__header" }, [_c("p", { staticClass: "conflict-picker__description", attrs: { "id": "conflict-picker-description" } }, [_vm._v(" " + _vm._s(_vm.t("Which files do you want to keep?"))), _c("br"), _vm._v(" " + _vm._s(_vm.t("If you select both versions, the incoming file will have a number added to its name."))), _c("br"), _vm.recursiveUpload ? [_vm._v(" " + _vm._s(_vm.t("When an incoming folder is selected, the content is written into the existing folder and a recursive conflict resolution is performed.")) + " ")] : [_vm._v(" " + _vm._s(_vm.t("When an incoming folder is selected, any conflicting files within it will also be overwritten.")) + " ")]], 2)]), _c("form", { ref: "form", staticClass: "conflict-picker__form", attrs: { "aria-labelledby": "conflict-picker-description", "data-cy-conflict-picker-form": "" }, on: { "submit": function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    return _vm.onSubmit.apply(null, arguments);
  } } }, [_c("fieldset", { staticClass: "conflict-picker__all", attrs: { "data-cy-conflict-picker-fieldset": "all" } }, [_c("legend", { staticClass: "hidden-visually" }, [_vm._v(" " + _vm._s(_vm.t("Select all checkboxes")) + " ")]), _c("NcCheckboxRadioSwitch", _vm._b({ attrs: { "data-cy-conflict-picker-input-incoming": "all" }, on: { "update:checked": _vm.onSelectAllNew } }, "NcCheckboxRadioSwitch", _vm.selectAllNewBind, false), [_vm._v(" " + _vm._s(_vm.t("Select all new files")) + " ")]), _c("NcCheckboxRadioSwitch", _vm._b({ attrs: { "data-cy-conflict-picker-input-existing": "all" }, on: { "update:checked": _vm.onSelectAllOld } }, "NcCheckboxRadioSwitch", _vm.selectAllOldBind, false), [_vm._v(" " + _vm._s(_vm.t("Select all existing files")) + " ")])], 1), _vm._l(_vm.files, function(node, index) {
    return _c("NodesPicker", { key: node.fileid, ref: "nodesPicker", refInFor: true, attrs: { "incoming": _vm.conflicts[index], "existing": _vm.files[index], "new-selected": _vm.newSelected, "old-selected": _vm.oldSelected }, on: { "update:newSelected": function($event) {
      _vm.newSelected = $event;
    }, "update:new-selected": function($event) {
      _vm.newSelected = $event;
    }, "update:oldSelected": function($event) {
      _vm.oldSelected = $event;
    }, "update:old-selected": function($event) {
      _vm.oldSelected = $event;
    } } });
  })], 2)]);
};
var _sfc_staticRenderFns = [];
var __component__ = /* @__PURE__ */ normalizeComponent(
  _sfc_main,
  _sfc_render,
  _sfc_staticRenderFns,
  false,
  null,
  "9464bcea"
);
const ConflictPicker = __component__.exports;
export {
  ConflictPicker as default
};
//# sourceMappingURL=ConflictPicker-BvM7ZujP-DP9Oz9R0.chunk.mjs.map
