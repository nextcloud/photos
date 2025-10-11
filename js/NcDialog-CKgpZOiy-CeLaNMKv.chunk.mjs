const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { n as normalizeComponent, m as NcModal, aJ as NcDialogButton, aK as useElementSize, ac as GenRandomId } from "./index-BOzawWmL.chunk.mjs";
import { d as defineComponent, b as ref$1, q as computed } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
const _sfc_main = defineComponent({
  name: "NcDialog",
  components: {
    NcDialogButton,
    NcModal
  },
  props: {
    /** Name of the dialog (the heading) */
    name: {
      type: String,
      required: true
    },
    /** Text of the dialog */
    message: {
      type: String,
      default: ""
    },
    /** Additional elements to add to the focus trap */
    additionalTrapElements: {
      type: Array,
      validator: (arr) => {
        return Array.isArray(arr) && arr.every(
          (element) => typeof element === "string" || element instanceof HTMLElement
        );
      },
      default: () => []
    },
    /**
     * The element where to mount the dialog, if `null` is passed the dialog is mounted in place
     * @default 'body'
     */
    container: {
      type: String,
      required: false,
      default: "body"
    },
    /**
     * Whether the dialog should be shown
     * @default true
     */
    open: {
      type: Boolean,
      default: true
    },
    /**
     * Size of the underlying NcModal
     * @default 'small'
     * @type {'small'|'normal'|'large'|'full'}
     */
    size: {
      type: String,
      required: false,
      default: "small",
      validator: (value) => typeof value === "string" && ["small", "normal", "large", "full"].includes(value)
    },
    /**
     * Buttons to display
     * @default []
     */
    buttons: {
      type: Array,
      required: false,
      default: () => [],
      validator: (value) => Array.isArray(value) && value.every((element) => typeof element === "object")
    },
    /**
     * Do not show the close button for the dialog.
     * @default false
     */
    noClose: {
      type: Boolean,
      default: false
    },
    /**
     * Set to false to no show a close button on the dialog
     * @deprecated - Use `noClose` instead. Will be removed in v9.
     * @default true
     */
    canClose: {
      type: Boolean,
      default: true
    },
    /**
     * Close the dialog if the user clicked outside of the dialog
     * Only relevant if `canClose` is set to true.
     */
    closeOnClickOutside: {
      type: Boolean,
      default: false
    },
    /**
     * Make the dialog wrapper a HTML form element.
     * The buttons will be wrapped within the form so they can be used as submit / reset buttons.
     * Please note that when using the property the `navigation` should not be used.
     */
    isForm: {
      type: Boolean,
      default: false
    },
    /**
     * Declare if hiding the modal should be animated
     * @default false
     */
    outTransition: {
      type: Boolean,
      default: false
    },
    /**
     * Optionally pass additional classes which will be set on the navigation for custom styling
     * @default ''
     * @example
     * ```html
     * <DialogBase :navigation-classes="['mydialog-navigation']"><!-- --></DialogBase>
     * <!-- ... -->
     * <style lang="scss">
     * :deep(.mydialog-navigation) {
     *     flex-direction: row-reverse;
     * }
     * </style>
     * ```
     */
    navigationClasses: {
      type: [String, Array, Object],
      required: false,
      default: ""
    },
    /**
     * aria-label for the dialog navigation.
     * Use it when you want to provide a more meaningful label than the dialog name.
     *
     * By default, navigation is labeled by the dialog name.
     */
    navigationAriaLabel: {
      type: String,
      required: false,
      default: ""
    },
    /**
     * aria-labelledby for the dialog navigation.
     * Use it when you have an implicit navigation label (e.g. a heading).
     *
     * By default, navigation is labeled by the dialog name.
     */
    navigationAriaLabelledby: {
      type: String,
      required: false,
      default: ""
    },
    /**
     * Optionally pass additional classes which will be set on the content wrapper for custom styling
     * @default ''
     */
    contentClasses: {
      type: [String, Array, Object],
      required: false,
      default: ""
    },
    /**
     * Optionally pass additional classes which will be set on the dialog itself
     * (the default `class` attribute will be set on the modal wrapper)
     * @default ''
     */
    dialogClasses: {
      type: [String, Array, Object],
      required: false,
      default: ""
    }
  },
  emits: ["closing", "update:open", "submit"],
  setup(props, { emit, slots }) {
    const wrapper = ref$1();
    const { width: dialogWidth } = useElementSize(wrapper, { width: 900 });
    const isNavigationCollapsed = computed(() => dialogWidth.value < 876);
    const hasNavigation = computed(() => slots?.navigation !== void 0);
    const navigationId = GenRandomId();
    const navigationAriaLabelAttr = computed(() => props.navigationAriaLabel || void 0);
    const navigationAriaLabelledbyAttr = computed(() => {
      if (props.navigationAriaLabel) {
        return void 0;
      }
      return props.navigationAriaLabelledby || navigationId;
    });
    const dialogElement = ref$1();
    const dialogTagName = computed(() => props.isForm && !hasNavigation.value ? "form" : "div");
    const dialogListeners = computed(
      () => dialogTagName.value === "form" ? {
        /**
         * @param {SubmitEvent} event Form submit event
         */
        submit(event) {
          event.preventDefault();
          emit("submit", event);
        },
        /**
         * @param {Event} event Form submit event
         */
        reset(event) {
          event.preventDefault();
          emit("reset", event);
        }
      } : {}
    );
    const showModal = ref$1(true);
    function handleButtonClose(button, result) {
      if (button.nativeType === "submit" && dialogTagName.value === "form" && !dialogElement.value.reportValidity()) {
        return;
      }
      handleClosing(result);
      window.setTimeout(() => handleClosed(), 300);
    }
    const handleClosing = (result) => {
      showModal.value = false;
      emit("closing", result);
    };
    const handleClosed = () => {
      showModal.value = true;
      emit("update:open", false);
    };
    const modalProps = computed(() => ({
      noClose: props.noClose || !props.canClose,
      container: props.container === void 0 ? "body" : props.container,
      // we do not pass the name as we already have the name as the headline
      // name: props.name,
      // But we need to set the correct label id so the dialog is labelled
      labelId: navigationId,
      size: props.size,
      show: props.open && showModal.value,
      outTransition: props.outTransition,
      closeOnClickOutside: props.closeOnClickOutside,
      additionalTrapElements: props.additionalTrapElements
    }));
    return {
      dialogElement,
      dialogListeners,
      dialogTagName,
      handleButtonClose,
      handleClosing,
      handleClosed,
      hasNavigation,
      navigationId,
      navigationAriaLabelAttr,
      navigationAriaLabelledbyAttr,
      isNavigationCollapsed,
      modalProps,
      wrapper
    };
  }
});
var _sfc_render = function render() {
  var _vm = this, _c = _vm._self._c;
  _vm._self._setupProxy;
  return _vm.open ? _c("NcModal", _vm._b({ staticClass: "dialog__modal", attrs: { "enable-slideshow": false, "enable-swipe": false }, on: { "close": _vm.handleClosed, "update:show": function($event) {
    return _vm.handleClosing();
  } } }, "NcModal", _vm.modalProps, false), [_c("h2", { staticClass: "dialog__name", attrs: { "id": _vm.navigationId }, domProps: { "textContent": _vm._s(_vm.name) } }), _c(_vm.dialogTagName, _vm._g({ ref: "dialogElement", tag: "component", staticClass: "dialog", class: _vm.dialogClasses }, _vm.dialogListeners), [_c("div", { ref: "wrapper", class: ["dialog__wrapper", { "dialog__wrapper--collapsed": _vm.isNavigationCollapsed }] }, [_vm.hasNavigation ? _c("nav", { staticClass: "dialog__navigation", class: _vm.navigationClasses, attrs: { "aria-label": _vm.navigationAriaLabelAttr, "aria-labelledby": _vm.navigationAriaLabelledbyAttr } }, [_vm._t("navigation", null, { "isCollapsed": _vm.isNavigationCollapsed })], 2) : _vm._e(), _c("div", { staticClass: "dialog__content", class: _vm.contentClasses }, [_vm._t("default", function() {
    return [_c("p", { staticClass: "dialog__text" }, [_vm._v(" " + _vm._s(_vm.message) + " ")])];
  })], 2)]), _c("div", { staticClass: "dialog__actions" }, [_vm._t("actions", function() {
    return _vm._l(_vm.buttons, function(button, idx) {
      return _c("NcDialogButton", _vm._b({ key: idx, on: { "click": (_, result) => _vm.handleButtonClose(button, result) } }, "NcDialogButton", button, false));
    });
  })], 2)])], 1) : _vm._e();
};
var _sfc_staticRenderFns = [];
var __component__ = /* @__PURE__ */ normalizeComponent(
  _sfc_main,
  _sfc_render,
  _sfc_staticRenderFns,
  false,
  null,
  "1aa5fbdd"
);
const NcDialog = __component__.exports;
export {
  NcDialog as N
};
//# sourceMappingURL=NcDialog-CKgpZOiy-CeLaNMKv.chunk.mjs.map
