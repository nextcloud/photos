const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { N as NcDateTimePicker } from "./NcDateTimePicker-D9wOztqD.chunk.mjs";
import { u as useModelMigration } from "./useModelMigration-EhAWvqDD-DYrjrJkv.chunk.mjs";
import { av as ScopeComponent, n as normalizeComponent, ac as GenRandomId, r as register, aw as t27, k as cancelableClient, a as t, a1 as t47 } from "./index-BOzawWmL.chunk.mjs";
import { l as loadState, ad as v } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
import { d as debounce } from "./index-ClkAjefD.chunk.mjs";
import { l as logger } from "./NcAvatar-YSp2ORHc-CfTsACiM.chunk.mjs";
import { N as NcInputField, a as NcTextField } from "./NcTextField-o_8gWurX-9cj68FP2.chunk.mjs";
import { N as NcSelect } from "./NcSelect-CjUzohn5-OrPoxx8A.chunk.mjs";
import { A as ActionGlobalMixin } from "./NcActionButton-CuVNJJtW-5eBS5Sv2.chunk.mjs";
const inputDateTypes = ["date", "datetime-local", "month", "time", "week"];
const _sfc_main$4 = {
  name: "NcDateTimePickerNative",
  inheritAttrs: false,
  model: {
    prop: "modelValue",
    event: "update:modelValue"
  },
  props: {
    /**
     * Removed in v9 - use `modelValue` (`v-model`) instead
     * @deprecated
     */
    value: {
      type: Date,
      default: void 0
    },
    /**
     * The date is – like the `Date` object in JavaScript – tied to UTC.
     * The selected time zone does not have an influence of the selected time and date value.
     * You have to translate the time yourself when you want to factor in time zones.
     * Pass null to clear the input field.
     */
    modelValue: {
      type: Date,
      default: null
    },
    /**
     * id attribute of the input field
     */
    id: {
      type: String,
      default: () => "date-time-picker-" + GenRandomId(),
      validator: (id) => id.trim() !== ""
    },
    /**
     * type attribute of the input field
     * default type: String
     * The type of the input element, it can be `date`, `datetime-local`, `month`, `time`, `week`
     */
    type: {
      type: String,
      default: "date",
      validate: (name) => inputDateTypes.includes(name)
    },
    /**
     * text inside the label element
     * default type: String
     */
    label: {
      type: String,
      default: "Please choose a date"
    },
    /**
     * min attribute of the input field
     * default type: null
     */
    min: {
      type: [Date, Boolean],
      default: null
    },
    /**
     * max attribute of the input field
     * default type: null
     */
    max: {
      type: [Date, Boolean],
      default: null
    },
    /**
     * Flag to hide the label
     * default type: String
     * The hidden input label for accessibility purposes.
     */
    hideLabel: {
      type: Boolean,
      default: false
    },
    /**
     * Class to add to the input field.
     * Necessary to use NcDateTimePickerNative in the NcActionInput component.
     */
    inputClass: {
      type: [Object, String],
      default: ""
    }
  },
  emits: [
    /**
     * Removed in v9 - use `update:modelValue` (`v-model`) instead
     * @deprecated
     */
    "input",
    /**
     * Emitted when the input value changes
     *
     * @return {Date} new chosen Date()
     */
    "update:modelValue",
    /** Same as update:modelValue for Vue 2 compatibility */
    "update:model-value"
  ],
  setup() {
    const model = useModelMigration("value", "input");
    return {
      model
    };
  },
  computed: {
    formattedValue() {
      return this.formatValue(this.model);
    },
    formattedMin() {
      if (this.min) {
        return this.formatValue(this.min);
      }
      return false;
    },
    formattedMax() {
      if (this.max) {
        return this.formatValue(this.max);
      }
      return false;
    },
    listeners() {
      return {
        ...this.$listeners,
        /**
         * Handle the input event
         *
         * @param {InputEvent} $event input event payloads
         */
        input: ($event) => {
          if (isNaN($event.target.valueAsNumber)) {
            this.model = null;
          } else if (this.type === "time") {
            const time = $event.target.value;
            if (this.model === "") {
              const { yyyy, MM, dd } = this.getReadableDate(/* @__PURE__ */ new Date());
              this.model = /* @__PURE__ */ new Date(`${yyyy}-${MM}-${dd}T${time}`);
            } else {
              const { yyyy, MM, dd } = this.getReadableDate(this.model);
              this.model = /* @__PURE__ */ new Date(`${yyyy}-${MM}-${dd}T${time}`);
            }
          } else if (this.type === "month") {
            const MM = (new Date($event.target.value).getMonth() + 1).toString().padStart(2, "0");
            if (this.model === "") {
              const { yyyy, dd, hh, mm } = this.getReadableDate(/* @__PURE__ */ new Date());
              this.model = /* @__PURE__ */ new Date(`${yyyy}-${MM}-${dd}T${hh}:${mm}`);
            } else {
              const { yyyy, dd, hh, mm } = this.getReadableDate(this.model);
              this.model = /* @__PURE__ */ new Date(`${yyyy}-${MM}-${dd}T${hh}:${mm}`);
            }
          } else {
            const timezoneOffsetSeconds = new Date($event.target.valueAsNumber).getTimezoneOffset() * 1e3 * 60;
            const inputDateWithTimezone = $event.target.valueAsNumber + timezoneOffsetSeconds;
            this.model = new Date(inputDateWithTimezone);
          }
        }
      };
    }
  },
  methods: {
    /**
     * Returns Object with string values of a Date
     *
     * @param {Date} value The selected value
     * @return {object|undefined}
     */
    getReadableDate(value) {
      if (value instanceof Date) {
        const yyyy = value.getFullYear().toString().padStart(4, "0");
        const MM = (value.getMonth() + 1).toString().padStart(2, "0");
        const dd = value.getDate().toString().padStart(2, "0");
        const hh = value.getHours().toString().padStart(2, "0");
        const mm = value.getMinutes().toString().padStart(2, "0");
        return { yyyy, MM, dd, hh, mm };
      }
    },
    /**
     * Returns preformatted value for the input field
     *
     * @param {Date} value The selected value
     * @return {string|undefined}
     */
    formatValue(value) {
      if (value instanceof Date) {
        const { yyyy, MM, dd, hh, mm } = this.getReadableDate(value);
        if (this.type === "datetime-local") {
          return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
        } else if (this.type === "date") {
          return `${yyyy}-${MM}-${dd}`;
        } else if (this.type === "month") {
          return `${yyyy}-${MM}`;
        } else if (this.type === "time") {
          return `${hh}:${mm}`;
        } else if (this.type === "week") {
          const startDate = new Date(yyyy, 0, 1);
          const daysSinceBeginningOfYear = Math.floor((value - startDate) / (24 * 60 * 60 * 1e3));
          const weekNumber = Math.ceil(daysSinceBeginningOfYear / 7);
          return `${yyyy}-W${weekNumber}`;
        }
      } else {
        return "";
      }
    }
  }
};
var _sfc_render$4 = function render() {
  var _vm = this, _c = _vm._self._c;
  return _c("div", { staticClass: "native-datetime-picker" }, [_c("label", { staticClass: "native-datetime-picker--label", class: { "hidden-visually": _vm.hideLabel }, attrs: { "for": _vm.id } }, [_vm._v(" " + _vm._s(_vm.label) + " ")]), _c("input", _vm._g(_vm._b({ staticClass: "native-datetime-picker--input", class: _vm.inputClass, attrs: { "id": _vm.id, "type": _vm.type, "min": _vm.formattedMin, "max": _vm.formattedMax }, domProps: { "value": _vm.formattedValue } }, "input", _vm.$attrs, false), _vm.listeners))]);
};
var _sfc_staticRenderFns$4 = [];
var __component__$4 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$4,
  _sfc_render$4,
  _sfc_staticRenderFns$4,
  false,
  null,
  "9e776556"
);
const NcDateTimePickerNative = __component__$4.exports;
ScopeComponent(NcDateTimePickerNative);
const _sfc_main$2 = {
  name: "EyeIcon",
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
var _sfc_render$2 = function render2() {
  var _vm = this, _c = _vm._self._c;
  return _c("span", _vm._b({ staticClass: "material-design-icon eye-icon", attrs: { "aria-hidden": _vm.title ? null : "true", "aria-label": _vm.title, "role": "img" }, on: { "click": function($event) {
    return _vm.$emit("click", $event);
  } } }, "span", _vm.$attrs, false), [_c("svg", { staticClass: "material-design-icon__svg", attrs: { "fill": _vm.fillColor, "width": _vm.size, "height": _vm.size, "viewBox": "0 0 24 24" } }, [_c("path", { attrs: { "d": "M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" } }, [_vm.title ? _c("title", [_vm._v(_vm._s(_vm.title))]) : _vm._e()])])]);
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
const Eye = __component__$2.exports;
const _sfc_main$1 = {
  name: "EyeOffIcon",
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
var _sfc_render$1 = function render22() {
  var _vm = this, _c = _vm._self._c;
  return _c("span", _vm._b({ staticClass: "material-design-icon eye-off-icon", attrs: { "aria-hidden": _vm.title ? null : "true", "aria-label": _vm.title, "role": "img" }, on: { "click": function($event) {
    return _vm.$emit("click", $event);
  } } }, "span", _vm.$attrs, false), [_c("svg", { staticClass: "material-design-icon__svg", attrs: { "fill": _vm.fillColor, "width": _vm.size, "height": _vm.size, "viewBox": "0 0 24 24" } }, [_c("path", { attrs: { "d": "M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.08L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.74,7.13 11.35,7 12,7Z" } }, [_vm.title ? _c("title", [_vm._v(_vm._s(_vm.title))]) : _vm._e()])])]);
};
var _sfc_staticRenderFns$1 = [];
var __component__$1 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$1,
  _sfc_render$1,
  _sfc_staticRenderFns$1,
  false,
  null,
  null
);
const EyeOff = __component__$1.exports;
register(t27);
const passwordPolicy = loadState("core", "capabilities", {}).password_policy || null;
const NcInputFieldProps = new Set(Object.keys(NcInputField.props));
const _sfc_main$3 = {
  name: "NcPasswordField",
  components: {
    NcInputField,
    Eye,
    EyeOff
  },
  // Allow forwarding all attributes
  inheritAttrs: false,
  model: {
    prop: "modelValue",
    event: "update:modelValue"
  },
  props: {
    /**
     * Any [NcInputField](#/Components/NcFields?id=ncinputfield) props
     */
    // Not an actual prop but needed to show in vue-styleguidist docs
    // eslint-disable-next-line
    " ": {},
    // Reuse all the props from NcInputField for better typing and documentation
    ...NcInputField.props,
    // Redefined props
    /**
     * Controls whether to display the trailing button.
     */
    showTrailingButton: {
      type: Boolean,
      default: true
    },
    // Removed NcInputField props, defined only by this component
    trailingButtonLabel: void 0,
    // Custom props
    /**
     * Check if the user entered a valid password using the password_policy
     * app if available.
     *
     * Warning: this doesn't replace server side checking and will do nothing
     * if the password_policy app is disabled.
     */
    checkPasswordStrength: {
      type: Boolean,
      default: false
    },
    /**
     * The minlength property defines the minimum number of characters
     * (as UTF-16 code units) the user can enter
     */
    minlength: {
      type: Number,
      default: 0
    },
    /**
     * The maxlength property defines the maximum number of characters
     * (as UTF-16 code units) the user can enter
     */
    maxlength: {
      type: Number,
      default: null
    },
    /**
     * Render as input[type=text] that looks like password field.
     * Allows to avoid unwanted password-specific browser behavior,
     * such as save or generate password prompt.
     * Useful for secret token fields.
     * Note: autocomplete="off" is ignored by browsers.
     */
    asText: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    "valid",
    "invalid",
    /**
     * Removed in v9 - use `update:modelValue` (`v-model`) instead
     * @deprecated
     */
    "update:value",
    /**
     * Triggers when the value inside the password field is
     * updated.
     *
     * @property {string} The new value
     */
    "update:modelValue",
    /** Same as update:modelValue for Vue 2 compatibility */
    "update:model-value"
  ],
  setup() {
    const model = useModelMigration("value", "update:value");
    return {
      model
    };
  },
  data() {
    return {
      isPasswordHidden: true,
      internalHelpMessage: "",
      isValid: null
    };
  },
  computed: {
    computedError() {
      return this.error || this.isValid === false;
    },
    computedSuccess() {
      return this.success || this.isValid === true;
    },
    computedHelperText() {
      if (this.helperText.length > 0) {
        return this.helperText;
      }
      return this.internalHelpMessage;
    },
    rules() {
      const { minlength } = this;
      return {
        minlength: minlength ?? passwordPolicy?.minLength
      };
    },
    trailingButtonLabelPassword() {
      return this.isPasswordHidden ? t("Show password") : t("Hide password");
    },
    propsAndAttrsToForward() {
      return {
        // Proxy all the HTML attributes
        ...this.$attrs,
        // Proxy original NcInputField's props
        ...Object.fromEntries(
          Object.entries(this.$props).filter(([key]) => NcInputFieldProps.has(key))
        )
      };
    }
  },
  watch: {
    model(newValue) {
      if (this.checkPasswordStrength) {
        if (passwordPolicy === null) {
          return;
        }
        this.checkPassword(newValue);
      }
    }
  },
  methods: {
    /**
     * Focus the input element
     *
     * @public
     */
    focus() {
      this.$refs.inputField.focus();
    },
    /**
     * Select all the text in the input
     *
     * @public
     */
    select() {
      this.$refs.inputField.select();
    },
    handleInput(event) {
      this.model = event.target.value;
    },
    togglePasswordVisibility() {
      this.isPasswordHidden = !this.isPasswordHidden;
    },
    checkPassword: debounce(async function(password) {
      try {
        const { data } = await cancelableClient.post(v("apps/password_policy/api/v1/validate"), { password });
        this.isValid = data.ocs.data.passed;
        if (data.ocs.data.passed) {
          this.internalHelpMessage = t("Password is secure");
          this.$emit("valid");
          return;
        }
        this.internalHelpMessage = data.ocs.data.reason;
        this.$emit("invalid");
      } catch (e) {
        logger.error("Password policy returned an error", e);
      }
    }, 500)
  }
};
var _sfc_render$3 = function render3() {
  var _vm = this, _c = _vm._self._c;
  return _c("NcInputField", _vm._g(_vm._b({ ref: "inputField", attrs: { "type": _vm.isPasswordHidden && !_vm.asText ? "password" : "text", "trailing-button-label": _vm.trailingButtonLabelPassword, "helper-text": _vm.computedHelperText, "error": _vm.computedError, "success": _vm.computedSuccess, "minlength": _vm.rules.minlength, "input-class": { "password-field__input--secure-text": _vm.isPasswordHidden && _vm.asText } }, on: { "trailing-button-click": _vm.togglePasswordVisibility, "input": _vm.handleInput }, scopedSlots: _vm._u([!!_vm.$scopedSlots.icon || !!_vm.$slots.default || !!_vm.$scopedSlots.default ? { key: "icon", fn: function() {
    return [_vm._t("icon", function() {
      return [_vm._t("default")];
    })];
  }, proxy: true } : null, { key: "trailing-button-icon", fn: function() {
    return [_vm.isPasswordHidden ? _c("Eye", { attrs: { "size": 18 } }) : _c("EyeOff", { attrs: { "size": 18 } })];
  }, proxy: true }], null, true) }, "NcInputField", _vm.propsAndAttrsToForward, false), _vm.$listeners));
};
var _sfc_staticRenderFns$3 = [];
var __component__$3 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$3,
  _sfc_render$3,
  _sfc_staticRenderFns$3,
  false,
  null,
  "09fb8faa"
);
const NcPasswordField = __component__$3.exports;
register(t47);
const _sfc_main = {
  name: "NcActionInput",
  components: {
    NcDateTimePicker,
    NcDateTimePickerNative,
    NcPasswordField,
    NcSelect,
    NcTextField
  },
  mixins: [ActionGlobalMixin],
  model: {
    prop: "modelValue",
    event: "update:modelValue"
  },
  props: {
    /**
     * id attribute of the checkbox element
     */
    id: {
      type: String,
      default: () => "action-" + GenRandomId(),
      validator: (id) => id.trim() !== ""
    },
    /**
     * id attribute of the text input element
     */
    inputId: {
      type: String,
      default: () => "action-input-" + GenRandomId(),
      validator: (id) => id.trim() !== ""
    },
    /**
     * Icon to show with the action, can be either a CSS class or an URL
     */
    icon: {
      type: String,
      default: ""
    },
    /**
     * type attribute of the input field
     */
    type: {
      type: String,
      default: "text",
      validator(type) {
        return [
          "date",
          "datetime-local",
          "month",
          "multiselect",
          "number",
          "password",
          "search",
          "tel",
          "text",
          "time",
          "url",
          "week",
          "color",
          "email"
        ].indexOf(type) > -1;
      }
    },
    /**
     * id attribute for the native date time picker
     */
    idNativeDateTimePicker: {
      type: String,
      default: "date-time-picker_id"
    },
    /**
     * Flag to use a native date time picker
     */
    isNativePicker: {
      type: Boolean,
      default: false
    },
    /**
     * The visible input label for accessibility purposes.
     */
    label: {
      type: String,
      default: null
    },
    /**
     * If you want to show the label just above the
     * input field, pass in `true` to this prop.
     */
    labelOutside: {
      type: Boolean,
      default: true
    },
    /**
     * Removed in v9 - use `update:modelValue` (`v-model`) instead
     * @deprecated
     */
    value: {
      type: [String, Date, Number, Array],
      default: void 0
    },
    /**
     * value attribute of the input field
     */
    modelValue: {
      type: [String, Date, Number, Array],
      default: ""
    },
    /**
     * disabled state of the input field
     */
    disabled: {
      type: Boolean,
      default: false
    },
    /**
     * aria-label attribute of the input field
     */
    ariaLabel: {
      type: String,
      default: ""
    },
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
     * Attribute forwarded to the underlying NcPasswordField and NcTextField
     */
    showTrailingButton: {
      type: Boolean,
      default: true
    },
    /**
     * Trailing button label forwarded to the underlying NcTextField
     */
    trailingButtonLabel: {
      type: String,
      default: t("Submit")
    }
  },
  emits: [
    "input",
    "submit",
    "change",
    /**
     * Removed in v9 - use `update:modelValue` (`v-model`) instead
     * @deprecated
     */
    "update:value",
    /**
     * Emitted when the inputs value changes
     * ! DatetimePicker only send the value
     *
     * @type {string|Date}
     */
    "update:modelValue",
    /** Same as `update:modelValue` but with a different event name */
    "update:model-value"
  ],
  setup() {
    const model = useModelMigration("value", "update:value");
    return {
      model
    };
  },
  computed: {
    isIconUrl() {
      try {
        return new URL(this.icon);
      } catch (error) {
        return false;
      }
    },
    isMultiselectType() {
      return this.type === "multiselect";
    },
    nativeDatePickerType() {
      switch (this.type) {
        case "date":
        case "month":
        case "time":
        case "week":
        case "datetime-local":
          return this.type;
      }
      return false;
    },
    datePickerType() {
      if (!this.isNativePicker) {
        switch (this.type) {
          case "date":
          case "month":
          case "time":
            return this.type;
          case "datetime-local":
            return "datetime";
        }
      }
      return false;
    },
    /**
     * determines if the action is focusable
     *
     * @return {boolean} is the action focusable ?
     */
    isFocusable() {
      return !this.disabled;
    }
  },
  methods: {
    // closing datepicker popup on mouseleave = unfocus
    onLeave() {
      if (this.$refs.datetimepicker && this.$refs.datetimepicker.$refs.datepicker) {
        this.$refs.datetimepicker.$refs.datepicker.closePopup();
      }
    },
    onInput(event) {
      this.$emit("input", event);
      this.model = event.target ? event.target.value : event;
    },
    onSubmit(event) {
      event.preventDefault();
      event.stopPropagation();
      if (!this.disabled) {
        this.$emit("submit", event);
      } else {
        return false;
      }
    },
    onChange(event) {
      this.$emit("change", event);
    }
  }
};
var _sfc_render = function render4() {
  var _vm = this, _c = _vm._self._c;
  return _c("li", { staticClass: "action", class: { "action--disabled": _vm.disabled } }, [_c("span", { staticClass: "action-input", class: {
    "action-input-picker--disabled": _vm.disabled,
    "action-input--visible-label": _vm.labelOutside && _vm.label
  }, on: { "mouseleave": _vm.onLeave } }, [_c("span", { staticClass: "action-input__icon-wrapper" }, [_vm._t("icon", function() {
    return [_c("span", { staticClass: "action-input__icon", class: [_vm.isIconUrl ? "action-input__icon--url" : _vm.icon], style: { backgroundImage: _vm.isIconUrl ? `url(${_vm.icon})` : null }, attrs: { "aria-hidden": "true" } })];
  })], 2), _c("form", { ref: "form", staticClass: "action-input__form", attrs: { "disabled": _vm.disabled }, on: { "submit": function($event) {
    $event.preventDefault();
    return _vm.onSubmit.apply(null, arguments);
  } } }, [_c("div", { staticClass: "action-input__container" }, [_vm.label && _vm.labelOutside ? _c("label", { staticClass: "action-input__text-label", class: { "action-input__text-label--hidden": !_vm.labelOutside }, attrs: { "for": _vm.inputId } }, [_vm._v(" " + _vm._s(_vm.label) + " ")]) : _vm._e(), _c("div", { staticClass: "action-input__input-container" }, [_vm.datePickerType ? _c("NcDateTimePicker", _vm._b({ ref: "datetimepicker", staticClass: "action-input__datetimepicker", staticStyle: { "z-index": "99999999999" }, attrs: { "value": _vm.model, "placeholder": _vm.text, "disabled": _vm.disabled, "type": _vm.datePickerType, "input-class": ["mx-input", { focusable: _vm.isFocusable }] }, on: { "input": _vm.onInput, "change": _vm.onChange } }, "NcDateTimePicker", _vm.$attrs, false)) : _vm.isNativePicker ? _c("NcDateTimePickerNative", _vm._b({ staticClass: "action-input__datetimepicker", attrs: { "id": _vm.idNativeDateTimePicker, "value": _vm.model, "type": _vm.nativeDatePickerType, "input-class": { focusable: _vm.isFocusable } }, on: { "update:model-value": function($event) {
    _vm.model = $event;
  }, "change": function($event) {
    return _vm.$emit("change", $event);
  } } }, "NcDateTimePickerNative", _vm.$attrs, false)) : _vm.isMultiselectType ? _c("NcSelect", _vm._g(_vm._b({ staticClass: "action-input__multi", attrs: { "value": _vm.model, "placeholder": _vm.text, "disabled": _vm.disabled, "append-to-body": _vm.$attrs.appendToBody || _vm.$attrs["append-to-body"] || false, "input-class": { focusable: _vm.isFocusable } } }, "NcSelect", _vm.$attrs, false), _vm.$listeners)) : _vm.type === "password" ? _c("NcPasswordField", _vm._g(_vm._b({ attrs: { "id": _vm.inputId, "value": _vm.model, "label": _vm.label, "label-outside": !_vm.label || _vm.labelOutside, "placeholder": _vm.text, "disabled": _vm.disabled, "input-class": { focusable: _vm.isFocusable }, "show-trailing-button": _vm.showTrailingButton && !_vm.disabled }, on: { "input": _vm.onInput, "change": _vm.onChange } }, "NcPasswordField", _vm.$attrs, false), _vm.$listeners)) : _vm.type === "color" ? _c("div", { staticClass: "action-input__container" }, [_vm.label && _vm.type === "color" ? _c("label", { staticClass: "action-input__text-label", class: { "action-input__text-label--hidden": !_vm.labelOutside }, attrs: { "for": _vm.inputId } }, [_vm._v(" " + _vm._s(_vm.label) + " ")]) : _vm._e(), _c("div", { staticClass: "action-input__input-container" }, [_c("NcColorPicker", _vm._g(_vm._b({ staticClass: "colorpicker__trigger", attrs: { "id": "inputId", "value": _vm.model }, on: { "update:model-value": _vm.onInput, "submit": function($event) {
    return _vm.$refs.form.requestSubmit();
  } } }, "NcColorPicker", _vm.$attrs, false), _vm.$listeners), [_c("button", { staticClass: "colorpicker__preview", class: { focusable: _vm.isFocusable }, style: { "background-color": _vm.model } })])], 1)]) : _c("NcTextField", _vm._g(_vm._b({ attrs: { "id": _vm.inputId, "value": _vm.model, "label": _vm.label, "label-outside": !_vm.label || _vm.labelOutside, "placeholder": _vm.text, "disabled": _vm.disabled, "input-class": { focusable: _vm.isFocusable }, "type": _vm.type, "trailing-button-icon": "arrowRight", "trailing-button-label": _vm.trailingButtonLabel, "show-trailing-button": _vm.showTrailingButton && !_vm.disabled }, on: { "trailing-button-click": function($event) {
    return _vm.$refs.form.requestSubmit();
  }, "input": _vm.onInput, "change": _vm.onChange } }, "NcTextField", _vm.$attrs, false), _vm.$listeners))], 1)])])])]);
};
var _sfc_staticRenderFns = [];
var __component__ = /* @__PURE__ */ normalizeComponent(
  _sfc_main,
  _sfc_render,
  _sfc_staticRenderFns,
  false,
  null,
  "d174eb12"
);
const NcActionInput = __component__.exports;
export {
  NcActionInput as N
};
//# sourceMappingURL=NcBreadcrumbs-CFRjXqRg-DcyK5KqK.chunk.mjs.map
