const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { r as register, a7 as t18, n as normalizeComponent, N as NcButton, a as t, a8 as t12, D as Close, a9 as t19, aa as t49, ab as t20, f as NcLoadingIcon, s as NcActions, ac as GenRandomId, ad as t46 } from "./index-BOzawWmL.chunk.mjs";
import { N as NcActionButton } from "./NcActionButton-CuVNJJtW-5eBS5Sv2.chunk.mjs";
import { N as NcVNodes } from "./NcVNodes-8dPkIzmP.chunk.mjs";
import { C as ChevronDown } from "./NcSelect-CjUzohn5-OrPoxx8A.chunk.mjs";
import { A as ArrowRight, u as useIsMobile } from "./video-C5pfp5p8.chunk.mjs";
import { N as NcDialog } from "./NcDialog-CKgpZOiy-CeLaNMKv.chunk.mjs";
import { d as debounce } from "./index-ClkAjefD.chunk.mjs";
import { V as Vue } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
register(t18);
const _sfc_main$2$1 = {
  name: "MenuIcon",
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
var _sfc_render$2$1 = function render() {
  var _vm = this, _c = _vm._self._c;
  return _c("span", _vm._b({ staticClass: "material-design-icon menu-icon", attrs: { "aria-hidden": _vm.title ? null : "true", "aria-label": _vm.title, "role": "img" }, on: { "click": function($event) {
    return _vm.$emit("click", $event);
  } } }, "span", _vm.$attrs, false), [_c("svg", { staticClass: "material-design-icon__svg", attrs: { "fill": _vm.fillColor, "width": _vm.size, "height": _vm.size, "viewBox": "0 0 24 24" } }, [_c("path", { attrs: { "d": "M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" } }, [_vm.title ? _c("title", [_vm._v(_vm._s(_vm.title))]) : _vm._e()])])]);
};
var _sfc_staticRenderFns$2$1 = [];
var __component__$2$1 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$2$1,
  _sfc_render$2$1,
  _sfc_staticRenderFns$2$1,
  false,
  null,
  null
);
const MenuIcon = __component__$2$1.exports;
const _sfc_main$1$1 = {
  name: "MenuOpenIcon",
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
var _sfc_render$1$1 = function render2() {
  var _vm = this, _c = _vm._self._c;
  return _c("span", _vm._b({ staticClass: "material-design-icon menu-open-icon", attrs: { "aria-hidden": _vm.title ? null : "true", "aria-label": _vm.title, "role": "img" }, on: { "click": function($event) {
    return _vm.$emit("click", $event);
  } } }, "span", _vm.$attrs, false), [_c("svg", { staticClass: "material-design-icon__svg", attrs: { "fill": _vm.fillColor, "width": _vm.size, "height": _vm.size, "viewBox": "0 0 24 24" } }, [_c("path", { attrs: { "d": "M21,15.61L19.59,17L14.58,12L19.59,7L21,8.39L17.44,12L21,15.61M3,6H16V8H3V6M3,13V11H13V13H3M3,18V16H16V18H3Z" } }, [_vm.title ? _c("title", [_vm._v(_vm._s(_vm.title))]) : _vm._e()])])]);
};
var _sfc_staticRenderFns$1$1 = [];
var __component__$1$1 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$1$1,
  _sfc_render$1$1,
  _sfc_staticRenderFns$1$1,
  false,
  null,
  null
);
const MenuOpenIcon = __component__$1$1.exports;
const disableKeyboardShortcuts = window.OCP?.Accessibility?.disableKeyboardShortcuts?.();
const _sfc_main$7 = {
  name: "NcAppNavigationToggle",
  components: {
    NcButton,
    MenuIcon,
    MenuOpenIcon
  },
  props: {
    /**
     * Tracks whether the toggle has been clicked or not.
     * If it has been clicked, switches between the different MenuIcons
     * and emits a boolean indicating its opened status
     */
    open: {
      type: Boolean,
      required: true
    }
  },
  emits: ["update:open"],
  setup() {
    return { disableKeyboardShortcuts };
  },
  computed: {
    label() {
      return this.open ? t("Close navigation") : t("Open navigation {shortcut}", { shortcut: disableKeyboardShortcuts ? "" : "[n]" }).trim();
    }
  },
  methods: {
    /**
     * Once the toggle has been clicked, emits the toggle status
     * so parent components can gauge the status of the navigation button
     */
    toggleNavigation() {
      this.$emit("update:open", !this.open);
    }
  }
};
var _sfc_render$7 = function render3() {
  var _vm = this, _c = _vm._self._c;
  return _c("div", { staticClass: "app-navigation-toggle-wrapper" }, [_c("NcButton", { staticClass: "app-navigation-toggle", attrs: { "aria-controls": "app-navigation-vue", "aria-expanded": _vm.open ? "true" : "false", "aria-keyshortcuts": _vm.disableKeyboardShortcuts ? "" : "n", "aria-label": _vm.label, "title": _vm.label, "variant": "tertiary" }, on: { "click": _vm.toggleNavigation }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
    return [_vm.open ? _c("MenuOpenIcon", { attrs: { "size": 20 } }) : _c("MenuIcon", { attrs: { "size": 20 } })];
  }, proxy: true }]) })], 1);
};
var _sfc_staticRenderFns$7 = [];
var __component__$7 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$7,
  _sfc_render$7,
  _sfc_staticRenderFns$7,
  false,
  null,
  "f7da2749"
);
const NcAppNavigationToggle = __component__$7.exports;
const _sfc_main$6 = {
  name: "ChevronUpIcon",
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
var _sfc_render$6 = function render4() {
  var _vm = this, _c = _vm._self._c;
  return _c("span", _vm._b({ staticClass: "material-design-icon chevron-up-icon", attrs: { "aria-hidden": _vm.title ? null : "true", "aria-label": _vm.title, "role": "img" }, on: { "click": function($event) {
    return _vm.$emit("click", $event);
  } } }, "span", _vm.$attrs, false), [_c("svg", { staticClass: "material-design-icon__svg", attrs: { "fill": _vm.fillColor, "width": _vm.size, "height": _vm.size, "viewBox": "0 0 24 24" } }, [_c("path", { attrs: { "d": "M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z" } }, [_vm.title ? _c("title", [_vm._v(_vm._s(_vm.title))]) : _vm._e()])])]);
};
var _sfc_staticRenderFns$6 = [];
var __component__$6 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$6,
  _sfc_render$6,
  _sfc_staticRenderFns$6,
  false,
  null,
  null
);
const ChevronUp = __component__$6.exports;
register(t12);
const _sfc_main$5 = {
  name: "NcInputConfirmCancel",
  components: {
    NcButton,
    ArrowRight,
    Close
  },
  props: {
    /**
     * If this element is used on a primary element set to true for primary styling.
     */
    primary: {
      default: false,
      type: Boolean
    },
    placeholder: {
      default: "",
      type: String
    },
    value: {
      default: "",
      type: String
    }
  },
  emits: [
    "input",
    "confirm",
    "cancel"
  ],
  data() {
    return {
      labelConfirm: t("Confirm changes"),
      labelCancel: t("Cancel changes")
    };
  },
  computed: {
    valueModel: {
      get() {
        return this.value;
      },
      set(newValue) {
        this.$emit("input", newValue);
      }
    }
  },
  methods: {
    confirm() {
      this.$emit("confirm");
    },
    cancel() {
      this.$emit("cancel");
    },
    focusInput() {
      this.$refs.input.focus();
    }
  }
};
var _sfc_render$5 = function render5() {
  var _vm = this, _c = _vm._self._c;
  return _c("div", { staticClass: "app-navigation-input-confirm" }, [_c("form", { on: { "submit": function($event) {
    $event.preventDefault();
    return _vm.confirm.apply(null, arguments);
  }, "keydown": function($event) {
    if (!$event.type.indexOf("key") && _vm._k($event.keyCode, "esc", 27, $event.key, ["Esc", "Escape"])) return null;
    if ($event.ctrlKey || $event.shiftKey || $event.altKey || $event.metaKey) return null;
    $event.stopPropagation();
    $event.preventDefault();
    return _vm.cancel.apply(null, arguments);
  }, "click": function($event) {
    $event.stopPropagation();
    $event.preventDefault();
  } } }, [_c("input", { directives: [{ name: "model", rawName: "v-model", value: _vm.valueModel, expression: "valueModel" }], ref: "input", staticClass: "app-navigation-input-confirm__input", attrs: { "type": "text", "placeholder": _vm.placeholder }, domProps: { "value": _vm.valueModel }, on: { "input": function($event) {
    if ($event.target.composing) return;
    _vm.valueModel = $event.target.value;
  } } }), _c("NcButton", { attrs: { "aria-label": _vm.labelConfirm, "type": "submit", "variant": "primary" }, on: { "click": function($event) {
    $event.stopPropagation();
    $event.preventDefault();
    return _vm.confirm.apply(null, arguments);
  } }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
    return [_c("ArrowRight", { attrs: { "size": 20 } })];
  }, proxy: true }]) }), _c("NcButton", { attrs: { "aria-label": _vm.labelCancel, "type": "reset", "variant": _vm.primary ? "primary" : "tertiary" }, on: { "click": function($event) {
    $event.stopPropagation();
    $event.preventDefault();
    return _vm.cancel.apply(null, arguments);
  } }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
    return [_c("Close", { attrs: { "size": 20 } })];
  }, proxy: true }]) })], 1)]);
};
var _sfc_staticRenderFns$5 = [];
var __component__$5 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$5,
  _sfc_render$5,
  _sfc_staticRenderFns$5,
  false,
  null,
  "ac67c789"
);
const NcInputConfirmCancel = __component__$5.exports;
register(t19);
const _sfc_main$3 = {
  name: "NcAppNavigationIconCollapsible",
  components: {
    NcButton,
    ChevronDown,
    ChevronUp
  },
  props: {
    open: {
      type: Boolean,
      default: true
    }
  },
  emits: ["click"],
  computed: {
    labelButton() {
      return this.open ? t("Collapse menu") : t("Open menu");
    }
  },
  methods: {
    onClick(e) {
      this.$emit("click", e);
    }
  }
};
var _sfc_render$3 = function render6() {
  var _vm = this, _c = _vm._self._c;
  return _c("NcButton", { staticClass: "icon-collapse", class: { "icon-collapse--open": _vm.open }, attrs: { "aria-label": _vm.labelButton, "variant": "tertiary" }, on: { "click": _vm.onClick }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
    return [_vm.open ? _c("ChevronUp", { attrs: { "size": 20 } }) : _c("ChevronDown", { attrs: { "size": 20 } })];
  }, proxy: true }]) });
};
var _sfc_staticRenderFns$3 = [];
var __component__$3 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$3,
  _sfc_render$3,
  _sfc_staticRenderFns$3,
  false,
  null,
  "607590bd"
);
const NcAppNavigationIconCollapsible = __component__$3.exports;
register(t20, t49);
const _sfc_main$2 = {
  name: "PencilIcon",
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
var _sfc_render$2 = function render22() {
  var _vm = this, _c = _vm._self._c;
  return _c("span", _vm._b({ staticClass: "material-design-icon pencil-icon", attrs: { "aria-hidden": _vm.title ? null : "true", "aria-label": _vm.title, "role": "img" }, on: { "click": function($event) {
    return _vm.$emit("click", $event);
  } } }, "span", _vm.$attrs, false), [_c("svg", { staticClass: "material-design-icon__svg", attrs: { "fill": _vm.fillColor, "width": _vm.size, "height": _vm.size, "viewBox": "0 0 24 24" } }, [_c("path", { attrs: { "d": "M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" } }, [_vm.title ? _c("title", [_vm._v(_vm._s(_vm.title))]) : _vm._e()])])]);
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
const Pencil = __component__$2.exports;
const _sfc_main$1 = {
  name: "UndoIcon",
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
var _sfc_render$1 = function render32() {
  var _vm = this, _c = _vm._self._c;
  return _c("span", _vm._b({ staticClass: "material-design-icon undo-icon", attrs: { "aria-hidden": _vm.title ? null : "true", "aria-label": _vm.title, "role": "img" }, on: { "click": function($event) {
    return _vm.$emit("click", $event);
  } } }, "span", _vm.$attrs, false), [_c("svg", { staticClass: "material-design-icon__svg", attrs: { "fill": _vm.fillColor, "width": _vm.size, "height": _vm.size, "viewBox": "0 0 24 24" } }, [_c("path", { attrs: { "d": "M12.5,8C9.85,8 7.45,9 5.6,10.6L2,7V16H11L7.38,12.38C8.77,11.22 10.54,10.5 12.5,10.5C16.04,10.5 19.05,12.81 20.1,16L22.47,15.22C21.08,11.03 17.15,8 12.5,8Z" } }, [_vm.title ? _c("title", [_vm._v(_vm._s(_vm.title))]) : _vm._e()])])]);
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
const Undo = __component__$1.exports;
const _sfc_main$4 = {
  name: "NcAppNavigationItem",
  components: {
    NcActions,
    NcActionButton,
    NcAppNavigationIconCollapsible,
    NcInputConfirmCancel,
    NcLoadingIcon,
    NcVNodes,
    Pencil,
    Undo
  },
  props: {
    /**
     * If you are not using vue-router you can use the property to set this item as the active navigation entry.
     * When using vue-router and the `to` property this is set automatically.
     */
    active: {
      type: Boolean,
      default: false
    },
    /**
     * The main text content of the entry.
     */
    name: {
      type: String,
      required: true
    },
    /**
     * The title attribute of the element.
     */
    title: {
      type: String,
      default: null
    },
    /**
     * id attribute of the list item element
     */
    id: {
      type: String,
      default: () => "app-navigation-item-" + GenRandomId(),
      validator: (id) => id.trim() !== ""
    },
    /**
     * Refers to the icon on the left, this prop accepts a class
     * like 'icon-category-enabled'.
     */
    icon: {
      type: String,
      default: ""
    },
    /**
     * Displays a loading animated icon on the left of the element
     * instead of the icon.
     */
    loading: {
      type: Boolean,
      default: false
    },
    /**
     * Passing in a route will make the root element of this
     * component a `<router-link />` that points to that route.
     * By leaving this blank, the root element will be a `<li>`.
     */
    to: {
      type: [String, Object],
      default: null
    },
    /**
     * A direct link. This will be used as the `href` attribute.
     * This will ignore any `to` prop being defined.
     */
    href: {
      type: String,
      default: null
    },
    /**
     * Pass in `true` if you want the matching behaviour to
     * be non-inclusive: https://router.vuejs.org/api/#exact
     */
    exact: {
      type: Boolean,
      default: false
    },
    /**
     * Gives the possibility to collapse the children elements into the
     * parent element (true) or expands the children elements (false).
     */
    allowCollapse: {
      type: Boolean,
      default: false
    },
    /**
     * Makes the name of the item editable by providing an `ActionButton`
     * component that toggles a form
     */
    editable: {
      type: Boolean,
      default: false
    },
    /**
     * Only for 'editable' items, sets label for the edit action button.
     */
    editLabel: {
      type: String,
      default: ""
    },
    /**
     * Only for items in 'editable' mode, sets the placeholder text for the editing form.
     */
    editPlaceholder: {
      type: String,
      default: ""
    },
    /**
     * Pins the item to the bottom left area, above the settings. Do not
     * place 'non-pinned' `AppnavigationItem` components below `pinned`
     * ones.
     */
    pinned: {
      type: Boolean,
      default: false
    },
    /**
     * Puts the item in the 'undo' state.
     */
    undo: {
      type: Boolean,
      default: false
    },
    /**
     * The navigation collapsible state (synced)
     */
    open: {
      type: Boolean,
      default: false
    },
    /**
     * The actions menu open state (synced)
     */
    menuOpen: {
      type: Boolean,
      default: false
    },
    /**
     * Force the actions to display in a three dot menu
     */
    forceMenu: {
      type: Boolean,
      default: false
    },
    /**
     * The action's menu default icon
     */
    menuIcon: {
      type: String,
      default: void 0
    },
    /**
     * The action's menu direction
     */
    menuPlacement: {
      type: String,
      default: "bottom"
    },
    /**
     * Entry aria details
     */
    ariaDescription: {
      type: String,
      default: null
    },
    /**
     * To be used only when the elements in the actions menu are very important
     */
    forceDisplayActions: {
      type: Boolean,
      default: false
    },
    /**
     * Number of action items outside the menu
     */
    inlineActions: {
      type: Number,
      default: 0
    }
  },
  emits: [
    "update:menuOpen",
    "update:open",
    "update:name",
    "click",
    "undo"
  ],
  setup() {
    return {
      isMobile: useIsMobile()
    };
  },
  data() {
    return {
      editingValue: "",
      opened: this.open,
      // Collapsible state
      editingActive: false,
      /**
       * Tracks the open state of the actions menu
       */
      menuOpenLocalValue: false,
      focused: false,
      actionsBoundariesElement: void 0
    };
  },
  computed: {
    isRouterLink() {
      return this.to && !this.href;
    },
    // Checks if the component is already a children of another
    // instance of AppNavigationItem
    canHaveChildren() {
      if (this.$parent.$options._componentTag === "AppNavigationItem") {
        return false;
      } else {
        return true;
      }
    },
    hasUtils() {
      if (this.$scopedSlots.actions || this.$scopedSlots.counter || this.editable || this.undo) {
        return true;
      }
      return false;
    },
    editButtonAriaLabel() {
      return this.editLabel ? this.editLabel : t("Edit item");
    },
    undoButtonAriaLabel() {
      return t("Undo changes");
    }
  },
  watch: {
    open(newVal) {
      this.opened = newVal;
    }
  },
  mounted() {
    this.actionsBoundariesElement = document.querySelector("#content-vue") || void 0;
  },
  methods: {
    // sync opened menu state with prop
    onMenuToggle(state) {
      this.$emit("update:menuOpen", state);
      this.menuOpenLocalValue = state;
    },
    // toggle the collapsible state
    toggleCollapse() {
      this.opened = !this.opened;
      this.$emit("update:open", this.opened);
    },
    /**
     * Handle link click
     *
     * @param {PointerEvent} event - Native click event
     * @param {Function} [navigate] - VueRouter link's navigate if any
     * @param {string} [routerLinkHref] - VueRouter link's href
     */
    onClick(event, navigate, routerLinkHref) {
      this.$emit("click", event);
      if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) {
        return;
      }
      if (routerLinkHref) {
        navigate?.(event);
        event.preventDefault();
      }
    },
    // Edition methods
    handleEdit() {
      this.editingValue = this.name;
      this.editingActive = true;
      this.onMenuToggle(false);
      this.$nextTick(() => {
        this.$refs.editingInput.focusInput();
      });
    },
    cancelEditing() {
      this.editingActive = false;
    },
    handleEditingDone() {
      this.$emit("update:name", this.editingValue);
      this.editingValue = "";
      this.editingActive = false;
    },
    // Undo methods
    handleUndo() {
      this.$emit("undo");
    },
    /**
     * Does this item have children and is collapsing allowed via the prop?
     *
     * @return {boolean} True, if the item can be collapsed
     */
    isCollapsible() {
      return this.allowCollapse && !!this.$scopedSlots.default;
    },
    /**
     * Show actions upon focus
     */
    handleFocus() {
      this.focused = true;
    },
    handleBlur() {
      this.focused = false;
    },
    /**
     * This method checks if the root element of the component is focused and
     * if that's the case it focuses the actions button if available
     *
     * @param {Event} e the keydown event
     */
    handleTab(e) {
      if (!this.$refs.actions) {
        return;
      }
      if (this.focused) {
        e.preventDefault();
        this.$refs.actions.$refs.triggerButton.$el.focus();
        this.focused = false;
      } else {
        this.$refs.actions.$refs.triggerButton.$el.blur();
      }
    },
    /**
     * Is this an external link
     *
     * @param {string} href The link to check
     * @return {boolean} Whether it is external or not
     */
    isExternal(href) {
      return href && href.match(/[a-z]+:\/\//i);
    }
  }
};
var _sfc_render$4 = function render42() {
  var _vm = this, _c = _vm._self._c;
  return _c("li", { staticClass: "app-navigation-entry-wrapper", class: {
    "app-navigation-entry--opened": _vm.opened,
    "app-navigation-entry--pinned": _vm.pinned,
    "app-navigation-entry--collapsible": _vm.isCollapsible()
  }, attrs: { "id": _vm.id } }, [_c(_vm.isRouterLink ? "router-link" : "NcVNodes", { tag: "component", attrs: { "custom": _vm.isRouterLink ? true : false, "to": _vm.to, "exact": _vm.isRouterLink ? _vm.exact : null }, scopedSlots: _vm._u([{ key: "default", fn: function({ href: routerLinkHref, navigate, isActive }) {
    return [_c("div", { staticClass: "app-navigation-entry", class: {
      "app-navigation-entry--editing": _vm.editingActive,
      "app-navigation-entry--deleted": _vm.undo,
      "active": isActive && _vm.to || _vm.active
    } }, [!_vm.undo ? _c("a", { staticClass: "app-navigation-entry-link", attrs: { "aria-current": _vm.active || isActive && _vm.to ? "page" : void 0, "aria-description": _vm.ariaDescription, "aria-expanded": _vm.$scopedSlots.default ? _vm.opened.toString() : void 0, "href": _vm.href || routerLinkHref || "#", "target": _vm.isExternal(_vm.href) ? "_blank" : void 0, "title": _vm.title || _vm.name }, on: { "blur": _vm.handleBlur, "click": function($event) {
      return _vm.onClick($event, navigate, routerLinkHref);
    }, "focus": _vm.handleFocus, "keydown": function($event) {
      if (!$event.type.indexOf("key") && _vm._k($event.keyCode, "tab", 9, $event.key, "Tab")) return null;
      if ($event.ctrlKey || $event.shiftKey || $event.altKey || $event.metaKey) return null;
      return _vm.handleTab.apply(null, arguments);
    } } }, [_c("div", { staticClass: "app-navigation-entry-icon", class: { [_vm.icon]: _vm.icon } }, [_vm.loading ? _c("NcLoadingIcon") : _vm._t("icon")], 2), !_vm.editingActive ? _c("span", { staticClass: "app-navigation-entry__name" }, [_vm._v(" " + _vm._s(_vm.name) + " ")]) : _vm._e(), _vm.editingActive ? _c("div", { staticClass: "editingContainer" }, [_c("NcInputConfirmCancel", { ref: "editingInput", attrs: { "placeholder": _vm.editPlaceholder !== "" ? _vm.editPlaceholder : _vm.name, "primary": isActive && _vm.to || _vm.active }, on: { "cancel": _vm.cancelEditing, "confirm": _vm.handleEditingDone }, model: { value: _vm.editingValue, callback: function($$v) {
      _vm.editingValue = $$v;
    }, expression: "editingValue" } })], 1) : _vm._e()]) : _vm._e(), _vm.undo ? _c("div", { staticClass: "app-navigation-entry__deleted" }, [_c("div", { staticClass: "app-navigation-entry__deleted-description" }, [_vm._v(" " + _vm._s(_vm.name) + " ")])]) : _vm._e(), _vm.hasUtils && !_vm.editingActive ? _c("div", { staticClass: "app-navigation-entry__utils", class: { "app-navigation-entry__utils--display-actions": _vm.forceDisplayActions || _vm.menuOpenLocalValue || _vm.menuOpen } }, [_vm.$scopedSlots.counter ? _c("div", { staticClass: "app-navigation-entry__counter-wrapper" }, [_vm._t("counter")], 2) : _vm._e(), _vm.$scopedSlots.actions || _vm.editable && !_vm.editingActive || _vm.undo ? _c("NcActions", { ref: "actions", staticClass: "app-navigation-entry__actions", attrs: { "inline": _vm.inlineActions, "container": "#app-navigation-vue", "boundaries-element": _vm.actionsBoundariesElement, "placement": _vm.menuPlacement, "open": _vm.menuOpen, "type": isActive && _vm.to || _vm.active ? "primary" : null, "force-menu": _vm.forceMenu, "default-icon": _vm.menuIcon }, on: { "update:open": _vm.onMenuToggle }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
      return [_vm._t("menu-icon")];
    }, proxy: true }], null, true) }, [_vm.editable && !_vm.editingActive ? _c("NcActionButton", { attrs: { "aria-label": _vm.editButtonAriaLabel }, on: { "click": _vm.handleEdit }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
      return [_c("Pencil", { attrs: { "size": 20 } })];
    }, proxy: true }], null, true) }, [_vm._v(" " + _vm._s(_vm.editLabel) + " ")]) : _vm._e(), _vm.undo ? _c("NcActionButton", { attrs: { "aria-label": _vm.undoButtonAriaLabel }, on: { "click": _vm.handleUndo }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
      return [_c("Undo", { attrs: { "size": 20 } })];
    }, proxy: true }], null, true) }) : _vm._e(), _vm._t("actions")], 2) : _vm._e()], 1) : _vm._e(), _vm.isCollapsible() ? _c("NcAppNavigationIconCollapsible", { attrs: { "open": _vm.opened }, on: { "click": function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      return _vm.toggleCollapse.apply(null, arguments);
    } } }) : _vm._e(), _vm._t("extra")], 2)];
  } }], null, true) }), _vm.canHaveChildren && _vm.$scopedSlots.default ? _c("ul", { staticClass: "app-navigation-entry__children" }, [_vm._t("default")], 2) : _vm._e()], 1);
};
var _sfc_staticRenderFns$4 = [];
var __component__$4 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$4,
  _sfc_render$4,
  _sfc_staticRenderFns$4,
  false,
  null,
  "54906a49"
);
const NcAppNavigationItem = __component__$4.exports;
register(t46);
const _sfc_main = {
  name: "NcAppSettingsDialog",
  components: {
    NcDialog,
    NcVNodes
  },
  provide() {
    return {
      registerSection: this.registerSection,
      unregisterSection: this.unregisterSection
    };
  },
  props: {
    /**
     * Determines the open / closed state of the modal
     */
    open: {
      type: Boolean,
      required: true
    },
    /**
     * Shows the navigation on desktop if true
     */
    showNavigation: {
      type: Boolean,
      default: false
    },
    /**
     * Selector for the popover container
     */
    container: {
      type: String,
      default: "body"
    },
    /**
     * Name of the settings
     */
    name: {
      type: String,
      default: ""
    },
    /**
     * Additional elements to add to the focus trap
     */
    additionalTrapElements: {
      type: Array,
      default: () => []
    }
  },
  emits: ["update:open"],
  setup() {
    return {
      isMobile: useIsMobile()
    };
  },
  data() {
    return {
      selectedSection: "",
      linkClicked: false,
      addedScrollListener: false,
      scroller: null,
      /**
       * Currently registered settings sections
       * @type {{ id: string, name: string, icon?: import('vue').VNode[] }[]}
       */
      sections: []
    };
  },
  computed: {
    dialogProperties() {
      return {
        additionalTrapElements: this.additionalTrapElements,
        closeOnClickOutside: true,
        class: "app-settings",
        container: this.container,
        contentClasses: "app-settings__content",
        size: "large",
        name: this.name,
        navigationClasses: "app-settings__navigation"
      };
    },
    /**
     * Check if one or more navigation entries provide icons
     */
    hasNavigationIcons() {
      return this.sections.some(({ icon }) => !!icon);
    },
    hasNavigation() {
      if (this.isMobile || !this.showNavigation) {
        return false;
      } else {
        return true;
      }
    },
    settingsNavigationAriaLabel() {
      return t("Settings navigation");
    }
  },
  updated() {
    if (!this.$refs.settingsScroller) {
      return;
    }
    this.scroller = this.$refs.settingsScroller;
    if (!this.addedScrollListener) {
      this.scroller.addEventListener("scroll", this.handleScroll);
      this.addedScrollListener = true;
    }
  },
  methods: {
    /**
     * Called when a new section is registered
     * @param {string} id The section ID
     * @param {string} name The section name
     * @param {import('vue').VNode[]|undefined} icon Optional icon component
     */
    registerSection(id, name, icon) {
      if (this.sections.some(({ id: otherId }) => id === otherId)) {
        throw new Error(`Duplicate section id found: ${id}. Settings navigation sections must have unique section ids.`);
      }
      if (this.sections.some(({ name: otherName }) => name === otherName)) {
        Vue.util.warn(`Duplicate section name found: ${name}. Settings navigation sections must have unique section names.`);
      }
      const newSections = [...this.sections, { id, name, icon }];
      this.sections = newSections.sort(({ id: idA }, { id: idB }) => {
        const indexOf = (id2) => this.$slots.default?.findIndex?.((vnode) => vnode?.componentOptions?.propsData?.id === id2) ?? -1;
        return indexOf(idA) - indexOf(idB);
      });
      if (this.sections.length === 1) {
        this.selectedSection = id;
      }
    },
    /**
     * Called when a section is unregistered to remove it from dialog
     * @param {string} id The section ID
     */
    unregisterSection(id) {
      this.sections = this.sections.filter(({ id: otherId }) => id !== otherId);
      if (this.selectedSection === id) {
        this.selectedSection = this.sections[0]?.id ?? "";
      }
    },
    /**
     * Scrolls the content to the selected settings section.absolute
     *
     * @param {string} item the ID of the section
     */
    handleSettingsNavigationClick(item) {
      this.linkClicked = true;
      document.getElementById("settings-section_" + item).scrollIntoView({
        behavior: "smooth",
        inline: "nearest"
      });
      this.selectedSection = item;
      setTimeout(() => {
        this.linkClicked = false;
      }, 1e3);
    },
    handleCloseModal(isOpen) {
      if (isOpen) {
        return;
      }
      this.$emit("update:open", false);
      this.scroller.removeEventListener("scroll", this.handleScroll);
      this.addedScrollListener = false;
      this.scroller.scrollTop = 0;
    },
    handleScroll() {
      if (!this.linkClicked) {
        this.unfocusNavigationItem();
      }
    },
    // Remove selected section once the user starts scrolling
    unfocusNavigationItem: debounce(function() {
      this.selectedSection = "";
      if (document.activeElement.className.includes("navigation-list__link")) {
        document.activeElement.blur();
      }
    }, 300)
  }
};
var _sfc_render = function render7() {
  var _vm = this, _c = _vm._self._c;
  return _vm.open ? _c("NcDialog", _vm._b({ attrs: { "navigation-aria-label": _vm.settingsNavigationAriaLabel }, on: { "update:open": _vm.handleCloseModal }, scopedSlots: _vm._u([_vm.hasNavigation ? { key: "navigation", fn: function({ isCollapsed }) {
    return [!isCollapsed ? _c("ul", { staticClass: "navigation-list" }, _vm._l(_vm.sections, function(section) {
      return _c("li", { key: section.id }, [_c("a", { class: {
        "navigation-list__link": true,
        "navigation-list__link--active": section.id === _vm.selectedSection,
        "navigation-list__link--icon": _vm.hasNavigationIcons
      }, attrs: { "aria-current": `${section.id === _vm.selectedSection}`, "href": `#settings-section_${section.id}`, "tabindex": "0" }, on: { "click": function($event) {
        $event.preventDefault();
        return _vm.handleSettingsNavigationClick(section.id);
      }, "keydown": function($event) {
        if (!$event.type.indexOf("key") && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) return null;
        return _vm.handleSettingsNavigationClick(section.id);
      } } }, [_vm.hasNavigationIcons ? _c("div", { staticClass: "navigation-list__link-icon" }, [section.icon ? _c("NcVNodes", { attrs: { "vnodes": section.icon } }) : _vm._e()], 1) : _vm._e(), _c("span", { staticClass: "navigation-list__link-text" }, [_vm._v(" " + _vm._s(section.name) + " ")])])]);
    }), 0) : _vm._e()];
  } } : null], null, true) }, "NcDialog", _vm.dialogProperties, false), [_c("div", { ref: "settingsScroller" }, [_vm._t("default")], 2)]) : _vm._e();
};
var _sfc_staticRenderFns = [];
var __component__ = /* @__PURE__ */ normalizeComponent(
  _sfc_main,
  _sfc_render,
  _sfc_staticRenderFns,
  false,
  null,
  "0674bd2e"
);
const NcAppSettingsDialog = __component__.exports;
export {
  NcAppNavigationToggle as N,
  NcAppSettingsDialog as a,
  NcAppNavigationItem as b
};
//# sourceMappingURL=NcAppSettingsSection-Bl2-D3_g-BYPSoxk3.chunk.mjs.map
