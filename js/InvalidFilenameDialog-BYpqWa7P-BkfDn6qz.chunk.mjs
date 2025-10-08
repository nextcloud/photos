const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { I as InvalidFilenameError, c as InvalidFilenameErrorReason } from "./index-Cokc0amN.chunk.mjs";
import { d as defineComponent } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
import { n as normalizeComponent, t } from "./index-DdKmqUaK-5iZCstwH.chunk.mjs";
import { N as NcDialog } from "./NcDialog-CKgpZOiy-CeLaNMKv.chunk.mjs";
import { a as NcTextField } from "./NcTextField-o_8gWurX-9cj68FP2.chunk.mjs";
import { N as NcNoteCard } from "./NcNoteCard-D-_SVIMX.chunk.mjs";
import "./preload-helper-BO5AHt9u.chunk.mjs";
import "./index-BOzawWmL.chunk.mjs";
import "./index-BrMrQMP2.chunk.mjs";
import "./useHotKey-CDShbxMN.chunk.mjs";
import "./NcActionButton-CuVNJJtW-5eBS5Sv2.chunk.mjs";
import "./NcProgressBar-DegJ2JjE-BAVaOw4q.chunk.mjs";
import "./index-DTU2Yy1K.chunk.mjs";
import "./dialog-CIZq3-6b.chunk.mjs";
import "./useModelMigration-EhAWvqDD-DYrjrJkv.chunk.mjs";
import "./video-C5pfp5p8.chunk.mjs";
const _sfc_main = defineComponent({
  components: {
    NcDialog,
    NcNoteCard,
    NcTextField
  },
  props: {
    error: {
      type: InvalidFilenameError,
      required: true
    },
    /**
     * @deprecated just for legacy reasons, replace with function from @nextcloud/files in future
     */
    validateFilename: {
      type: Function,
      required: true
    }
  },
  setup() {
    return {
      t
    };
  },
  data() {
    return {
      newName: "",
      validationError: ""
    };
  },
  computed: {
    isValidName() {
      return this.validationError === "";
    },
    isInvalidFileType() {
      return this.error.reason === InvalidFilenameErrorReason.Extension && this.error.segment.match(/^\.\w/) !== null;
    },
    canRename() {
      return !this.isInvalidFileType;
    },
    dialogButtons() {
      const buttons = [
        {
          label: t("Cancel"),
          type: "error",
          callback: () => {
            this.$emit("close", { cancel: true });
          }
        },
        {
          label: t("Skip"),
          callback: () => {
            this.$emit("close", { skip: true });
          }
        }
      ];
      if (this.canRename) {
        buttons.push({
          label: t("Rename"),
          type: "primary",
          disabled: !this.isValidName,
          callback: () => {
            this.$emit("close", { rename: this.newName.trimEnd() });
          }
        });
      }
      return buttons;
    }
  },
  watch: {
    error: {
      handler() {
        this.validationError = this.getErrorText(this.error);
        this.newName = this.error.filename;
      },
      immediate: true
    },
    newName() {
      try {
        this.validateFilename(this.newName.trimEnd());
        this.validationError = "";
      } catch (error) {
        this.validationError = this.getErrorText(error);
      } finally {
        const textfield = this.$refs.textfield?.$el.querySelector("input");
        if (textfield) {
          textfield.setCustomValidity(this.validationError);
          textfield.reportValidity();
        }
      }
    }
  },
  methods: {
    getErrorText(error) {
      switch (error.reason) {
        case InvalidFilenameErrorReason.Character:
          return t('"{segment}" is not allowed inside a file or folder name.', { segment: error.segment });
        case InvalidFilenameErrorReason.ReservedName:
          return t('"{segment}" is a forbidden file or folder name.', { segment: error.segment });
        case InvalidFilenameErrorReason.Extension:
          return error.segment.match(/\.\w/) ? t('"{segment}" is a forbidden file type.', { segment: error.segment }) : t('Filenames must not end with "{segment}".', { segment: error.segment });
      }
    }
  }
});
var _sfc_render = function render() {
  var _vm = this, _c = _vm._self._c;
  _vm._self._setupProxy;
  return _c("NcDialog", { attrs: { "buttons": _vm.dialogButtons, "name": _vm.t("Invalid filename") }, on: { "close": function($event) {
    return _vm.$emit("close", { cancel: true });
  } } }, [_c("NcNoteCard", { attrs: { "severity": "error" } }, [_vm._v(" " + _vm._s(_vm.getErrorText(_vm.error)) + " " + _vm._s(_vm.t("You can either rename the file, skip this file or cancel the whole operation.")) + " ")]), _vm.canRename ? _c("NcTextField", { ref: "textfield", staticClass: "invalid-filename-dialog__input", attrs: { "error": !_vm.isValidName, "helper-text": _vm.validationError, "label": _vm.t("New filename"), "value": _vm.newName }, on: { "update:value": function($event) {
    _vm.newName = $event;
  } } }) : _vm._e()], 1);
};
var _sfc_staticRenderFns = [];
var __component__ = /* @__PURE__ */ normalizeComponent(
  _sfc_main,
  _sfc_render,
  _sfc_staticRenderFns,
  false,
  null,
  "3a479259"
);
const InvalidFilenameDialog = __component__.exports;
export {
  InvalidFilenameDialog as default
};
//# sourceMappingURL=InvalidFilenameDialog-BYpqWa7P-BkfDn6qz.chunk.mjs.map
