const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { n as normalizeComponent, e as NcIconSvgWrapper, ar as mdiChevronRight, as as mdiCheck } from "./index-BOzawWmL.chunk.mjs";
const ActionGlobalMixin = {
  beforeUpdate() {
    this.text = this.getText();
  },
  data() {
    return {
      // $slots are not reactive.
      // We need to update  the content manually
      text: this.getText()
    };
  },
  computed: {
    isLongText() {
      return this.text && this.text.trim().length > 20;
    }
  },
  methods: {
    getText() {
      return this.$slots.default ? this.$slots.default[0].text.trim() : "";
    }
  }
};
const GetParent = function(context, name) {
  let parent = context.$parent;
  while (parent) {
    if (parent.$options.name === name) {
      return parent;
    }
    parent = parent.$parent;
  }
};
const ActionTextMixin = {
  mixins: [ActionGlobalMixin],
  props: {
    /**
     * Icon to show with the action, can be either a CSS class or an URL
     */
    icon: {
      type: String,
      default: ""
    },
    /**
     * The main text content of the entry.
     */
    name: {
      type: String,
      default: ""
    },
    /**
     * The title attribute of the element.
     */
    title: {
      type: String,
      default: ""
    },
    /**
     * Whether we close the Actions menu after the click
     */
    closeAfterClick: {
      type: Boolean,
      default: false
    },
    /**
     * Aria label for the button. Not needed if the button has text.
     */
    ariaLabel: {
      type: String,
      default: null
    },
    /**
     * @deprecated To be removed in @nextcloud/vue 9. Migration guide: remove ariaHidden prop from NcAction* components.
     * @todo Add a check in @nextcloud/vue 9 that this prop is not provided,
     * otherwise root element will inherit incorrect aria-hidden.
     */
    ariaHidden: {
      type: Boolean,
      default: null
    }
  },
  emits: [
    "click"
  ],
  computed: {
    /**
     * Check if icon prop is an URL
     * @return {boolean} Whether the icon prop is an URL
     */
    isIconUrl() {
      try {
        return !!new URL(this.icon, this.icon.startsWith("/") ? window.location.origin : void 0);
      } catch (error) {
        return false;
      }
    }
  },
  methods: {
    onClick(event) {
      this.$emit("click", event);
      if (this.closeAfterClick) {
        const parent = GetParent(this, "NcActions");
        if (parent && parent.closeMenu) {
          parent.closeMenu(false);
        }
      }
    }
  }
};
const _sfc_main = {
  name: "NcActionButton",
  components: {
    NcIconSvgWrapper
  },
  mixins: [ActionTextMixin],
  inject: {
    isInSemanticMenu: {
      from: "NcActions:isSemanticMenu",
      default: false
    }
  },
  props: {
    /**
     * @deprecated To be removed in @nextcloud/vue 9. Migration guide: remove ariaHidden prop from NcAction* components.
     * @todo Add a check in @nextcloud/vue 9 that this prop is not provided,
     * otherwise root element will inherit incorrect aria-hidden.
     */
    ariaHidden: {
      type: Boolean,
      default: null
    },
    /**
     * disabled state of the action button
     */
    disabled: {
      type: Boolean,
      default: false
    },
    /**
     * If this is a menu, a chevron icon will
     * be added at the end of the line
     */
    isMenu: {
      type: Boolean,
      default: false
    },
    /**
     * The button's behavior, by default the button acts like a normal button with optional toggle button behavior if `modelValue` is `true` or `false`.
     * But you can also set to checkbox button behavior with tri-state or radio button like behavior.
     * This extends the native HTML button type attribute.
     */
    type: {
      type: String,
      default: "button",
      validator: (behavior) => ["button", "checkbox", "radio", "reset", "submit"].includes(behavior)
    },
    /**
     * The buttons state if `type` is 'checkbox' or 'radio' (meaning if it is pressed / selected).
     * For checkbox and toggle button behavior - boolean value.
     * For radio button behavior - could be a boolean checked or a string with the value of the button.
     * Note: Unlike native radio buttons, NcActionButton are not grouped by name, so you need to connect them by bind correct modelValue.
     *
     *  **This is not availabe for `type='submit'` or `type='reset'`**
     *
     * If using `type='checkbox'` a `model-value` of `true` means checked, `false` means unchecked and `null` means indeterminate (tri-state)
     * For `type='radio'` `null` is equal to `false`
     */
    modelValue: {
      type: [Boolean, String],
      default: null
    },
    /**
     * The value used for the `modelValue` when this component is used with radio behavior
     * Similar to the `value` attribute of `<input type="radio">`
     */
    value: {
      type: String,
      default: null
    },
    /**
     * Small underlying text content of the entry
     */
    description: {
      type: String,
      default: ""
    }
  },
  setup() {
    return {
      mdiCheck,
      mdiChevronRight
    };
  },
  computed: {
    /**
     * determines if the action is focusable
     *
     * @return {boolean} is the action focusable ?
     */
    isFocusable() {
      return !this.disabled;
    },
    /**
     * The current "checked" or "pressed" state for the model behavior
     */
    isChecked() {
      if (this.type === "radio" && typeof this.modelValue !== "boolean") {
        return this.modelValue === this.value;
      }
      return this.modelValue;
    },
    /**
     * The native HTML type to set on the button
     */
    nativeType() {
      if (this.type === "submit" || this.type === "reset") {
        return this.type;
      }
      return "button";
    },
    /**
     * HTML attributes to bind to the <button>
     */
    buttonAttributes() {
      const attributes = {};
      if (this.isInSemanticMenu) {
        attributes.role = "menuitem";
        if (this.type === "radio") {
          attributes.role = "menuitemradio";
          attributes["aria-checked"] = this.isChecked ? "true" : "false";
        } else if (this.type === "checkbox" || this.nativeType === "button" && this.modelValue !== null) {
          attributes.role = "menuitemcheckbox";
          attributes["aria-checked"] = this.modelValue === null ? "mixed" : this.modelValue ? "true" : "false";
        }
      } else if (this.modelValue !== null && this.nativeType === "button") {
        attributes["aria-pressed"] = this.modelValue ? "true" : "false";
      }
      return attributes;
    }
  },
  methods: {
    /**
     * Forward click event, let mixin handle the close-after-click and emit new modelValue if needed
     * @param {MouseEvent} event The click event
     */
    handleClick(event) {
      this.onClick(event);
      if (this.modelValue !== null || this.type !== "button") {
        if (this.type === "radio") {
          if (typeof this.modelValue !== "boolean") {
            if (!this.isChecked) {
              this.$emit("update:modelValue", this.value);
            }
          } else {
            this.$emit("update:modelValue", !this.isChecked);
          }
        } else {
          this.$emit("update:modelValue", !this.isChecked);
        }
      }
    }
  }
};
var _sfc_render = function render() {
  var _vm = this, _c = _vm._self._c;
  return _c("li", { staticClass: "action", class: { "action--disabled": _vm.disabled }, attrs: { "role": _vm.isInSemanticMenu && "presentation" } }, [_c("button", _vm._b({ class: ["action-button button-vue", {
    "action-button--active": _vm.isChecked,
    focusable: _vm.isFocusable
  }], attrs: { "aria-label": _vm.ariaLabel, "disabled": _vm.disabled, "title": _vm.title, "type": _vm.nativeType }, on: { "click": _vm.handleClick } }, "button", _vm.buttonAttributes, false), [_vm._t("icon", function() {
    return [_c("span", { staticClass: "action-button__icon", class: [_vm.isIconUrl ? "action-button__icon--url" : _vm.icon], style: { backgroundImage: _vm.isIconUrl ? `url(${_vm.icon})` : null }, attrs: { "aria-hidden": "true" } })];
  }), _c("span", { staticClass: "action-button__longtext-wrapper" }, [_vm.name ? _c("strong", { staticClass: "action-button__name" }, [_vm._v(" " + _vm._s(_vm.name) + " ")]) : _vm._e(), _vm.isLongText ? _c("span", { staticClass: "action-button__longtext", domProps: { "textContent": _vm._s(_vm.text) } }) : _c("span", { staticClass: "action-button__text" }, [_vm._v(" " + _vm._s(_vm.text) + " ")]), _vm.description ? _c("span", { staticClass: "action-button__description", domProps: { "textContent": _vm._s(_vm.description) } }) : _vm._e()]), _vm.isMenu ? _c("NcIconSvgWrapper", { staticClass: "action-button__menu-icon", attrs: { "directional": "", "path": _vm.mdiChevronRight } }) : _vm.isChecked ? _c("NcIconSvgWrapper", { staticClass: "action-button__pressed-icon", attrs: { "path": _vm.mdiCheck } }) : _vm.isChecked === false ? _c("span", { staticClass: "action-button__pressed-icon material-design-icon" }) : _vm._e(), _vm._e()], 2)]);
};
var _sfc_staticRenderFns = [];
var __component__ = /* @__PURE__ */ normalizeComponent(
  _sfc_main,
  _sfc_render,
  _sfc_staticRenderFns,
  false,
  null,
  "02eeec54"
);
const NcActionButton = __component__.exports;
export {
  ActionGlobalMixin as A,
  NcActionButton as N,
  ActionTextMixin as a
};
//# sourceMappingURL=NcActionButton-CuVNJJtW-5eBS5Sv2.chunk.mjs.map
