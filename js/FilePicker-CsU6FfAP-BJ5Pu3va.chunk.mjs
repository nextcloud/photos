const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { V as Vue, u as unsubscribe, s as subscribe, k as unref, d as defineComponent, b as ref$1, q as computed, ai as shallowRef, w as watch, A as toRef, o as onMounted, e as emit, G as getClient, l as loadState, T as isPublicShare, _, aj as getFavoriteNodes, U as pathBrowserifyExports, J as defaultRootPath, g as getCurrentUser, K as FileType, n as nextTick, z as onUnmounted, ak as CancelablePromise, al as getRecentSearch, L as resultToNode, O as getDefaultPropfind, v as watchEffect } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
import { n as normalizeComponent, N as NcButton, s as NcActions, ac as GenRandomId, au as normalizeComponent$1, am as t, aj as showError, k as cancelableClient, e as NcIconSvgWrapper } from "./index-BOzawWmL.chunk.mjs";
import { s as sortNodes, f as formatFileSize } from "./index-Cokc0amN.chunk.mjs";
import { N as NcCheckboxRadioSwitch } from "./NcCheckboxRadioSwitch-VeztTzpz-CPNGlVnf.chunk.mjs";
import { N as NcDateTime } from "./NcDateTime-DshRFtUU-w5TCTRwf.chunk.mjs";
import { S as ShareType } from "./index-DzppFRs6.chunk.mjs";
import { P as PQueue } from "./index-BrMrQMP2.chunk.mjs";
import { N as NcActionInput } from "./NcBreadcrumbs-CFRjXqRg-DcyK5KqK.chunk.mjs";
import { N as NcActionButton } from "./NcActionButton-CuVNJJtW-5eBS5Sv2.chunk.mjs";
import { N as NcActionLink, b as NcActionRouter } from "./NcAvatar-YSp2ORHc-CfTsACiM.chunk.mjs";
import { d as debounce } from "./index-ClkAjefD.chunk.mjs";
import { N as NcSelect } from "./NcSelect-CjUzohn5-OrPoxx8A.chunk.mjs";
import { a as NcTextField } from "./NcTextField-o_8gWurX-9cj68FP2.chunk.mjs";
import { N as NcDialog } from "./NcDialog-CKgpZOiy-CeLaNMKv.chunk.mjs";
import { N as NcEmptyContent } from "./NcEmptyContent-EDU4qhab.chunk.mjs";
import "./useModelMigration-EhAWvqDD-DYrjrJkv.chunk.mjs";
import "./NcDateTimePicker-D9wOztqD.chunk.mjs";
import "./video-C5pfp5p8.chunk.mjs";
import "./preload-helper-BO5AHt9u.chunk.mjs";
const _sfc_main$1$2 = {
  name: "ChevronRightIcon",
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
var _sfc_render$1$2 = function render() {
  var _vm = this, _c = _vm._self._c;
  return _c("span", _vm._b({ staticClass: "material-design-icon chevron-right-icon", attrs: { "aria-hidden": _vm.title ? null : "true", "aria-label": _vm.title, "role": "img" }, on: { "click": function($event) {
    return _vm.$emit("click", $event);
  } } }, "span", _vm.$attrs, false), [_c("svg", { staticClass: "material-design-icon__svg", attrs: { "fill": _vm.fillColor, "width": _vm.size, "height": _vm.size, "viewBox": "0 0 24 24" } }, [_c("path", { attrs: { "d": "M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" } }, [_vm.title ? _c("title", [_vm._v(_vm._s(_vm.title))]) : _vm._e()])])]);
};
var _sfc_staticRenderFns$1$2 = [];
var __component__$1$2 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$1$2,
  _sfc_render$1$2,
  _sfc_staticRenderFns$1$2,
  false,
  null,
  null
);
const ChevronRight = __component__$1$2.exports;
const _sfc_main$g = {
  name: "NcBreadcrumb",
  components: {
    NcActions,
    ChevronRight,
    NcButton
  },
  inheritAttrs: false,
  props: {
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
     * Route Location the link should navigate to when clicked on.
     *
     * @see https://v3.router.vuejs.org/api/#to
     */
    to: {
      type: [String, Object],
      default: void 0
    },
    /**
     * Match the complete route attributes (query and hash included)
     *
     * @see https://v3.router.vuejs.org/api/#exact
     */
    exact: {
      type: Boolean,
      default: false
    },
    /**
     * Set this prop if your app doesn't use vue-router, breadcrumbs will show as normal links.
     */
    href: {
      type: String,
      default: void 0
    },
    /**
     * Set a css icon-class to show an icon along name text (if forceIconText is provided, otherwise just icon).
     */
    icon: {
      type: String,
      default: ""
    },
    /**
     * Enables text to accompany the icon, if the icon was provided. The text that will be displayed is the name prop.
     */
    forceIconText: {
      type: Boolean,
      default: false
    },
    /**
     * Disable dropping on this breadcrumb.
     */
    disableDrop: {
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
     * Open state of the Actions menu
     */
    open: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    "update:open",
    "dropped"
  ],
  data() {
    return {
      /**
       * Variable to track if we hover over the breadcrumb
       */
      hovering: false,
      /**
       * The unique id of the breadcrumb. Necessary to append the
       * Actions menu to the correct crumb.
       */
      crumbId: `crumb-id-${GenRandomId()}`
    };
  },
  computed: {
    /**
     * The attributes to pass to `router-link` or `a`
     */
    linkAttributes() {
      return this.to ? { to: this.to, exact: this.exact, ...this.$attrs } : this.href ? { href: this.href, ...this.$attrs } : this.$attrs;
    }
  },
  methods: {
    /**
     * Function to handle changing the open state of the Actions menu
     * $emit the open state.
     *
     * @param {boolean} open The open state of the Actions menu
     */
    onOpenChange(open) {
      this.$emit("update:open", open);
    },
    /**
     * Function to handle a drop on the breadcrumb.
     * $emit the event and the path, remove the hovering state.
     *
     * @param {object} e The drop event
     * @return {boolean}
     */
    dropped(e) {
      if (this.disableDrop) {
        return false;
      }
      this.$emit("dropped", e, this.to || this.href);
      this.$parent.$emit("dropped", e, this.to || this.href);
      this.hovering = false;
      return false;
    },
    /**
     * Add the hovering state on drag enter
     *
     * @param {object} e The drag enter event
     */
    dragEnter(e) {
      if (this.disableDrop) {
        return;
      }
      this.hovering = true;
    },
    /**
     * Remove the hovering state on drag leave
     *
     * @param {object} e The drag leave event
     */
    dragLeave(e) {
      if (this.disableDrop) {
        return;
      }
      if (e.target.contains(e.relatedTarget) || this.$refs.crumb.contains(e.relatedTarget)) {
        return;
      }
      this.hovering = false;
    }
  }
};
var _sfc_render$g = function render2() {
  var _vm = this, _c = _vm._self._c;
  return _c("li", _vm._b({ ref: "crumb", staticClass: "vue-crumb", class: { "vue-crumb--hovered": _vm.hovering }, attrs: { "draggable": "false" }, on: { "dragstart": function($event) {
    $event.preventDefault();
    return (() => {
    }).apply(null, arguments);
  }, "drop": function($event) {
    $event.preventDefault();
    return _vm.dropped.apply(null, arguments);
  }, "dragover": function($event) {
    $event.preventDefault();
    return (() => {
    }).apply(null, arguments);
  }, "dragenter": _vm.dragEnter, "dragleave": _vm.dragLeave } }, "li", _vm._d({}, [_vm.crumbId, ""])), [(_vm.name || _vm.icon || _vm.$slots.icon) && !_vm.$slots.default ? _c("NcButton", _vm._g(_vm._b({ attrs: { "aria-label": _vm.icon ? _vm.name : void 0, "title": _vm.title, "variant": "tertiary" }, scopedSlots: _vm._u([_vm.$slots.icon || _vm.icon ? { key: "icon", fn: function() {
    return [_vm._t("icon", function() {
      return [_c("span", { staticClass: "icon", class: _vm.icon })];
    })];
  }, proxy: true } : null, !(_vm.$slots.icon || _vm.icon) || _vm.forceIconText ? { key: "default", fn: function() {
    return [_vm._v(" " + _vm._s(_vm.name) + " ")];
  }, proxy: true } : null], null, true) }, "NcButton", _vm.linkAttributes, false), _vm.$listeners)) : _vm._e(), _vm.$slots.default ? _c("NcActions", { ref: "actions", attrs: { "force-menu": _vm.forceMenu, "open": _vm.open, "menu-name": _vm.name, "title": _vm.title, "force-name": true, "container": `.vue-crumb[${_vm.crumbId}]`, "variant": "tertiary" }, on: { "update:open": _vm.onOpenChange }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
    return [_vm._t("menu-icon")];
  }, proxy: true }], null, true) }, [_vm._t("default")], 2) : _vm._e(), _c("ChevronRight", { staticClass: "vue-crumb__separator", attrs: { "size": 20 } })], 1);
};
var _sfc_staticRenderFns$g = [];
var __component__$g = /* @__PURE__ */ normalizeComponent(
  _sfc_main$g,
  _sfc_render$g,
  _sfc_staticRenderFns$g,
  false,
  null,
  "c55f5445"
);
const NcBreadcrumb = __component__$g.exports;
var $placeholder = Symbol();
var $fakeParent = Symbol();
var $nextSiblingPatched = Symbol();
var $childNodesPatched = Symbol();
var isFrag = function isFrag2(node) {
  return "frag" in node;
};
var parentNodeDescriptor = {
  get: function get() {
    return this[$fakeParent] || this.parentElement;
  },
  configurable: true
};
var patchParentNode = function patchParentNode2(node, fakeParent) {
  if ($fakeParent in node) {
    return;
  }
  node[$fakeParent] = fakeParent;
  Object.defineProperty(node, "parentNode", parentNodeDescriptor);
};
var nextSiblingDescriptor = {
  get: function get2() {
    var childNodes = this.parentNode.childNodes;
    var index = childNodes.indexOf(this);
    if (index > -1) {
      return childNodes[index + 1] || null;
    }
    return null;
  }
};
var patchNextSibling = function patchNextSibling2(node) {
  if ($nextSiblingPatched in node) {
    return;
  }
  node[$nextSiblingPatched] = true;
  Object.defineProperty(node, "nextSibling", nextSiblingDescriptor);
};
var getTopFragment = function getTopFragment2(node, fromParent) {
  while (node.parentNode !== fromParent) {
    var _node = node, parentNode = _node.parentNode;
    if (parentNode) {
      node = parentNode;
    }
  }
  return node;
};
var getChildNodes;
var getChildNodesWithFragments = function getChildNodesWithFragments2(node) {
  if (!getChildNodes) {
    var _childNodesDescriptor = Object.getOwnPropertyDescriptor(Node.prototype, "childNodes");
    getChildNodes = _childNodesDescriptor.get;
  }
  var realChildNodes = getChildNodes.apply(node);
  var childNodes = Array.from(realChildNodes).map(function(childNode) {
    return getTopFragment(childNode, node);
  });
  return childNodes.filter(function(childNode, index) {
    return childNode !== childNodes[index - 1];
  });
};
var childNodesDescriptor = {
  get: function get3() {
    return this.frag || getChildNodesWithFragments(this);
  }
};
var firstChildDescriptor = {
  get: function get4() {
    return this.childNodes[0] || null;
  }
};
function hasChildNodes() {
  return this.childNodes.length > 0;
}
var patchChildNodes = function patchChildNodes2(node) {
  if ($childNodesPatched in node) {
    return;
  }
  node[$childNodesPatched] = true;
  Object.defineProperties(node, {
    childNodes: childNodesDescriptor,
    firstChild: firstChildDescriptor
  });
  node.hasChildNodes = hasChildNodes;
};
function before() {
  var _this$frag$;
  (_this$frag$ = this.frag[0]).before.apply(_this$frag$, arguments);
}
function remove() {
  var frag2 = this.frag;
  var removed = frag2.splice(0, frag2.length);
  removed.forEach(function(node) {
    node.remove();
  });
}
var getFragmentLeafNodes = function getFragmentLeafNodes2(children) {
  var _Array$prototype;
  return (_Array$prototype = Array.prototype).concat.apply(_Array$prototype, children.map(function(childNode) {
    return isFrag(childNode) ? getFragmentLeafNodes2(childNode.frag) : childNode;
  }));
};
var addPlaceholder = function addPlaceholder2(node, insertBeforeNode) {
  var placeholder = node[$placeholder];
  insertBeforeNode.before(placeholder);
  patchParentNode(placeholder, node);
  node.frag.unshift(placeholder);
};
function removeChild(node) {
  if (isFrag(this)) {
    var hasChildInFragment = this.frag.indexOf(node);
    if (hasChildInFragment > -1) {
      var _this$frag$splice = this.frag.splice(hasChildInFragment, 1), removedNode = _this$frag$splice[0];
      if (this.frag.length === 0) {
        addPlaceholder(this, removedNode);
      }
      node.remove();
    }
  } else {
    var children = getChildNodesWithFragments(this);
    var hasChild = children.indexOf(node);
    if (hasChild > -1) {
      node.remove();
    }
  }
  return node;
}
function insertBefore(insertNode, insertBeforeNode) {
  var _this = this;
  var insertNodes = insertNode.frag || [insertNode];
  if (isFrag(this)) {
    if (insertNode[$fakeParent] === this && insertNode.parentElement) {
      return insertNode;
    }
    var _frag = this.frag;
    if (insertBeforeNode) {
      var index = _frag.indexOf(insertBeforeNode);
      if (index > -1) {
        _frag.splice.apply(_frag, [index, 0].concat(insertNodes));
        insertBeforeNode.before.apply(insertBeforeNode, insertNodes);
      }
    } else {
      var _lastNode = _frag[_frag.length - 1];
      _frag.push.apply(_frag, insertNodes);
      _lastNode.after.apply(_lastNode, insertNodes);
    }
    removePlaceholder(this);
  } else if (insertBeforeNode) {
    if (this.childNodes.includes(insertBeforeNode)) {
      insertBeforeNode.before.apply(insertBeforeNode, insertNodes);
    }
  } else {
    this.append.apply(this, insertNodes);
  }
  insertNodes.forEach(function(node) {
    patchParentNode(node, _this);
  });
  var lastNode = insertNodes[insertNodes.length - 1];
  patchNextSibling(lastNode);
  return insertNode;
}
function appendChild(node) {
  if (node[$fakeParent] === this && node.parentElement) {
    return node;
  }
  var frag2 = this.frag;
  var lastChild = frag2[frag2.length - 1];
  lastChild.after(node);
  patchParentNode(node, this);
  removePlaceholder(this);
  frag2.push(node);
  return node;
}
var removePlaceholder = function removePlaceholder2(node) {
  var placeholder = node[$placeholder];
  if (node.frag[0] === placeholder) {
    node.frag.shift();
    placeholder.remove();
  }
};
var innerHTMLDescriptor = {
  set: function set(htmlString) {
    var _this2 = this;
    if (this.frag[0] !== this[$placeholder]) {
      this.frag.slice().forEach(function(child) {
        return _this2.removeChild(child);
      });
    }
    if (htmlString) {
      var domify = document.createElement("div");
      domify.innerHTML = htmlString;
      Array.from(domify.childNodes).forEach(function(node) {
        _this2.appendChild(node);
      });
    }
  },
  get: function get5() {
    return "";
  }
};
var frag = {
  inserted: function inserted(element) {
    var parentNode = element.parentNode, nextSibling = element.nextSibling, previousSibling = element.previousSibling;
    var childNodes = Array.from(element.childNodes);
    var placeholder = document.createComment("");
    if (childNodes.length === 0) {
      childNodes.push(placeholder);
    }
    element.frag = childNodes;
    element[$placeholder] = placeholder;
    var fragment2 = document.createDocumentFragment();
    fragment2.append.apply(fragment2, getFragmentLeafNodes(childNodes));
    element.replaceWith(fragment2);
    childNodes.forEach(function(node) {
      patchParentNode(node, element);
      patchNextSibling(node);
    });
    patchChildNodes(element);
    Object.assign(element, {
      remove,
      appendChild,
      insertBefore,
      removeChild,
      before
    });
    Object.defineProperty(element, "innerHTML", innerHTMLDescriptor);
    if (parentNode) {
      Object.assign(parentNode, {
        removeChild,
        insertBefore
      });
      patchParentNode(element, parentNode);
      patchChildNodes(parentNode);
    }
    if (nextSibling) {
      patchNextSibling(element);
    }
    if (previousSibling) {
      patchNextSibling(previousSibling);
    }
  },
  unbind: function unbind(element) {
    element.remove();
  }
};
var fragment = {
  name: "Fragment",
  directives: {
    frag
  },
  render: function render3(h) {
    return h("div", {
      directives: [{
        name: "frag"
      }]
    }, this.$slots["default"]);
  }
};
const ValidateSlot = (slots, allowed, vm) => {
  if (slots === void 0) {
    return;
  }
  for (let index = slots.length - 1; index >= 0; index--) {
    const node = slots[index];
    const isHtmlElement = !node.componentOptions && node.tag && allowed.indexOf(node.tag) === -1;
    const isVueComponent = !!node.componentOptions && typeof node.componentOptions.tag === "string";
    const isForbiddenComponent = isVueComponent && allowed.indexOf(node.componentOptions.tag) === -1;
    if (isHtmlElement || !isVueComponent || isForbiddenComponent) {
      if (isHtmlElement || isForbiddenComponent) {
        Vue.util.warn(`${isHtmlElement ? node.tag : node.componentOptions.tag} is not allowed inside the ${vm.$options.name} component`, vm);
      }
      slots.splice(index, 1);
    }
  }
};
const _sfc_main$1$1 = {
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
var _sfc_render$1$1 = function render4() {
  var _vm = this, _c = _vm._self._c;
  return _c("span", _vm._b({ staticClass: "material-design-icon folder-icon", attrs: { "aria-hidden": _vm.title ? null : "true", "aria-label": _vm.title, "role": "img" }, on: { "click": function($event) {
    return _vm.$emit("click", $event);
  } } }, "span", _vm.$attrs, false), [_c("svg", { staticClass: "material-design-icon__svg", attrs: { "fill": _vm.fillColor, "width": _vm.size, "height": _vm.size, "viewBox": "0 0 24 24" } }, [_c("path", { attrs: { "d": "M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z" } }, [_vm.title ? _c("title", [_vm._v(_vm._s(_vm.title))]) : _vm._e()])])]);
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
const IconFolder$1 = __component__$1$1.exports;
const crumbClass = "vue-crumb";
const _sfc_main$f = {
  name: "NcBreadcrumbs",
  components: {
    NcActions,
    NcActionButton,
    NcActionRouter,
    NcActionLink,
    NcBreadcrumb,
    IconFolder: IconFolder$1
  },
  props: {
    /**
     * Set a css icon-class for the icon of the root breadcrumb to be used.
     */
    rootIcon: {
      type: String,
      default: "icon-home"
    },
    /**
     * Set the aria-label of the nav element.
     */
    ariaLabel: {
      type: String,
      default: null
    }
  },
  emits: ["dropped"],
  data() {
    return {
      /**
       * Array to track the hidden breadcrumbs by their index.
       * Comparing two crumbs somehow does not work, so we use the indices.
       */
      hiddenIndices: [],
      /**
       * This is the props of the middle Action menu
       * that show the ellipsised breadcrumbs
       */
      menuBreadcrumbProps: {
        // Don't show a name for this breadcrumb, only the Actions menu
        name: "",
        forceMenu: true,
        // Don't allow dropping directly on the actions breadcrumb
        disableDrop: true,
        // Is the menu open or not
        open: false
      },
      breadcrumbsRefs: {}
    };
  },
  beforeMount() {
    ValidateSlot(this.$slots.default, ["NcBreadcrumb"], this);
  },
  beforeUpdate() {
    ValidateSlot(this.$slots.default, ["NcBreadcrumb"], this);
  },
  created() {
    window.addEventListener("resize", debounce(() => {
      this.handleWindowResize();
    }, 100));
    subscribe("navigation-toggled", this.delayedResize);
  },
  mounted() {
    this.handleWindowResize();
  },
  updated() {
    this.delayedResize();
    this.$nextTick(() => {
      this.hideCrumbs();
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleWindowResize);
    unsubscribe("navigation-toggled", this.delayedResize);
  },
  methods: {
    /**
     * Close the actions menu
     *
     * @param {object} e The event
     */
    closeActions(e) {
      if (this.$refs.actionsBreadcrumb.$el.contains(e.relatedTarget)) {
        return;
      }
      this.menuBreadcrumbProps.open = false;
    },
    /**
     * Call the resize function after a delay
     */
    async delayedResize() {
      await this.$nextTick();
      this.handleWindowResize();
    },
    /**
     * Check the width of the breadcrumb and hide breadcrumbs
     * if we overflow otherwise.
     */
    handleWindowResize() {
      if (!this.$refs.container) {
        return;
      }
      const breadcrumbs = Object.values(this.breadcrumbsRefs);
      const nrCrumbs = breadcrumbs.length;
      const hiddenIndices = [];
      const availableWidth = this.$refs.container.offsetWidth;
      let totalWidth = this.getTotalWidth(breadcrumbs);
      if (this.$refs.breadcrumb__actions) {
        totalWidth += this.$refs.breadcrumb__actions.offsetWidth;
      }
      let overflow = totalWidth - availableWidth;
      overflow += overflow > 0 ? 64 : 0;
      let i = 0;
      const startIndex = Math.floor(nrCrumbs / 2);
      while (overflow > 0 && i < nrCrumbs - 2) {
        const currentIndex = startIndex + (i % 2 ? i + 1 : i) / 2 * Math.pow(-1, i + nrCrumbs % 2);
        overflow -= this.getWidth(breadcrumbs[currentIndex]?.elm, currentIndex === breadcrumbs.length - 1);
        hiddenIndices.push(currentIndex);
        i++;
      }
      if (!this.arraysEqual(this.hiddenIndices, hiddenIndices.sort((a, b) => a - b))) {
        this.hiddenIndices = hiddenIndices;
      }
    },
    /**
     * Checks if two arrays are equal.
     * Only works for primitive arrays, but that's enough here.
     *
     * @param {Array} a The first array
     * @param {Array} b The second array
     * @return {boolean} Wether the arrays are equal
     */
    arraysEqual(a, b) {
      if (a.length !== b.length) return false;
      if (a === b) return true;
      if (a === null || b === null) return false;
      for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) {
          return false;
        }
      }
      return true;
    },
    /**
     * Calculates the total width of all breadcrumbs
     *
     * @param {Array} breadcrumbs All breadcrumbs
     * @return {number} The total width
     */
    getTotalWidth(breadcrumbs) {
      return breadcrumbs.reduce((width, crumb, index) => width + this.getWidth(crumb?.elm, index === breadcrumbs.length - 1), 0);
    },
    /**
     * Calculates the width of the provided element
     *
     * @param {object} el The element
     * @param {boolean} isLast Is this the last crumb
     * @return {number} The width
     */
    getWidth(el, isLast) {
      if (!el?.classList) return 0;
      const hide = el.classList.contains(`${crumbClass}--hidden`);
      el.style.minWidth = "auto";
      if (isLast) {
        el.style.maxWidth = "210px";
      }
      el.classList.remove(`${crumbClass}--hidden`);
      const w = el.offsetWidth;
      if (hide) {
        el.classList.add(`${crumbClass}--hidden`);
      }
      el.style.minWidth = "";
      el.style.maxWidth = "";
      return w;
    },
    /**
     * Prevents the default of a provided event
     *
     * @param {object} e The event
     * @return {boolean}
     */
    preventDefault(e) {
      if (e.preventDefault) {
        e.preventDefault();
      }
      return false;
    },
    /**
     * Handles the drag start.
     * Prevents a breadcrumb from being draggable.
     *
     * @param {object} e The event
     * @return {boolean}
     */
    dragStart(e) {
      return this.preventDefault(e);
    },
    /**
     * Handles when something is dropped on the breadcrumb.
     *
     * @param {object} e The drop event
     * @param {string} path The path of the breadcrumb
     * @param {boolean} disabled Whether dropping is disabled for this breadcrumb
     * @return {boolean}
     */
    dropped(e, path, disabled) {
      if (!disabled) {
        this.$emit("dropped", e, path);
      }
      this.menuBreadcrumbProps.open = false;
      const crumbs = document.querySelectorAll(`.${crumbClass}`);
      crumbs.forEach((f) => {
        f.classList.remove(`${crumbClass}--hovered`);
      });
      return this.preventDefault(e);
    },
    /**
     * Handles the drag over event
     *
     * @param {object} e The drag over event
     * @return {boolean}
     */
    dragOver(e) {
      return this.preventDefault(e);
    },
    /**
     * Handles the drag enter event
     *
     * @param {object} e The drag over event
     * @param {boolean} disabled Whether dropping is disabled for this breadcrumb
     */
    dragEnter(e, disabled) {
      if (disabled) {
        return;
      }
      if (e.target.closest) {
        const target = e.target.closest(`.${crumbClass}`);
        if (target.classList && target.classList.contains(crumbClass)) {
          const crumbs = document.querySelectorAll(`.${crumbClass}`);
          crumbs.forEach((f) => {
            f.classList.remove(`${crumbClass}--hovered`);
          });
          target.classList.add(`${crumbClass}--hovered`);
        }
      }
    },
    /**
     * Handles the drag leave event
     *
     * @param {object} e The drag leave event
     * @param {boolean} disabled Whether dropping is disabled for this breadcrumb
     */
    dragLeave(e, disabled) {
      if (disabled) {
        return;
      }
      if (e.target.contains(e.relatedTarget)) {
        return;
      }
      if (e.target.closest) {
        const target = e.target.closest(`.${crumbClass}`);
        if (target.contains(e.relatedTarget)) {
          return;
        }
        if (target.classList && target.classList.contains(crumbClass)) {
          target.classList.remove(`${crumbClass}--hovered`);
        }
      }
    },
    /**
     * Check for each crumb if we have to hide it and
     * add it to the array of all crumbs.
     */
    hideCrumbs() {
      const crumbs = Object.values(this.breadcrumbsRefs);
      crumbs.forEach((crumb, i) => {
        if (crumb?.elm?.classList) {
          if (this.hiddenIndices.includes(i)) {
            crumb.elm.classList.add(`${crumbClass}--hidden`);
          } else {
            crumb.elm.classList.remove(`${crumbClass}--hidden`);
          }
        }
      });
    },
    isBreadcrumb(vnode) {
      return (vnode?.componentOptions?.tag || vnode?.tag || "").includes("NcBreadcrumb");
    }
  },
  /**
   * The render function to display the component
   *
   * @param {Function} h The function to create VNodes
   * @return {object|undefined} The created VNode
   */
  render(h) {
    const breadcrumbs = [];
    this.$slots.default.forEach((vnode) => {
      if (this.isBreadcrumb(vnode)) {
        breadcrumbs.push(vnode);
        return;
      }
      if (vnode?.type === fragment) {
        vnode?.children?.forEach?.((child) => {
          if (this.isBreadcrumb(child)) {
            breadcrumbs.push(child);
          }
        });
      }
    });
    if (breadcrumbs.length === 0) {
      return;
    }
    Vue.set(breadcrumbs[0].componentOptions.propsData, "icon", this.rootIcon);
    Vue.set(breadcrumbs[0].componentOptions.propsData, "ref", "breadcrumbs");
    const breadcrumbsRefs = {};
    breadcrumbs.forEach((crumb, index) => {
      Vue.set(crumb, "ref", `crumb-${index}`);
      breadcrumbsRefs[index] = crumb;
    });
    let crumbs = [];
    if (!this.hiddenIndices.length) {
      crumbs = breadcrumbs;
    } else {
      crumbs = breadcrumbs.slice(0, Math.round(breadcrumbs.length / 2));
      crumbs.push(
        h("NcBreadcrumb", {
          class: "dropdown",
          props: this.menuBreadcrumbProps,
          attrs: {
            // Hide the dropdown menu from screen-readers,
            // since the crumbs in the menu are still in the list.
            "aria-hidden": true
          },
          // Add a ref to the Actions menu
          ref: "actionsBreadcrumb",
          key: "actions-breadcrumb-1",
          // Add handlers so the Actions menu opens on hover
          nativeOn: {
            dragstart: this.dragStart,
            dragenter: () => {
              this.menuBreadcrumbProps.open = true;
            },
            dragleave: this.closeActions
          },
          on: {
            // Make sure we keep the same open state
            // as the Actions component
            "update:open": (open) => {
              this.menuBreadcrumbProps.open = open;
            }
          }
          // Add all hidden breadcrumbs as ActionRouter or ActionLink
        }, this.hiddenIndices.filter((index) => index <= breadcrumbs.length - 1).map((index) => {
          const crumb = breadcrumbs[index];
          const to = crumb.componentOptions.propsData.to;
          const href = crumb.componentOptions.propsData.href;
          const disabled = crumb.componentOptions.propsData.disableDrop;
          const title = crumb.componentOptions.propsData.title;
          const name = crumb.componentOptions.propsData.name;
          let element = "NcActionButton";
          let path = "";
          if (href) {
            element = "NcActionLink";
            path = href;
          }
          if (to) {
            element = "NcActionRouter";
            path = to;
          }
          const folderIcon = h("IconFolder", {
            props: {
              size: 20
            },
            slot: "icon"
          });
          return h(
            element,
            {
              class: crumbClass,
              props: {
                href: href || null,
                title,
                to: to || null
              },
              // Prevent the breadcrumbs from being draggable
              attrs: {
                draggable: false
              },
              on: {
                ...crumb.componentOptions.listeners
              },
              // Add the drag and drop handlers
              nativeOn: {
                dragstart: this.dragStart,
                drop: ($event) => this.dropped($event, path, disabled),
                dragover: this.dragOver,
                dragenter: ($event) => this.dragEnter($event, disabled),
                dragleave: ($event) => this.dragLeave($event, disabled)
              }
            },
            [folderIcon, name]
          );
        }))
      );
      const crumbs2 = breadcrumbs.slice(Math.round(breadcrumbs.length / 2));
      crumbs = crumbs.concat(crumbs2);
    }
    const wrapper = [h("nav", { attrs: { "aria-label": this.ariaLabel } }, [h("ul", { class: "breadcrumb__crumbs" }, [crumbs])])];
    if (this.$slots.actions) {
      wrapper.push(h("div", { class: "breadcrumb__actions", ref: "breadcrumb__actions" }, this.$slots.actions));
    }
    this.breadcrumbsRefs = breadcrumbsRefs;
    return h("div", { class: ["breadcrumb", { "breadcrumb--collapsed": this.hiddenIndices.length === breadcrumbs.length - 2 }], ref: "container" }, wrapper);
  }
};
const _sfc_render$f = null;
const _sfc_staticRenderFns$f = null;
var __component__$f = /* @__PURE__ */ normalizeComponent(
  _sfc_main$f,
  _sfc_render$f,
  _sfc_staticRenderFns$f,
  false,
  null,
  "629bf30f"
);
const NcBreadcrumbs = __component__$f.exports;
function toValue(r) {
  return typeof r === "function" ? r() : unref(r);
}
typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
var mdiAccountPlus = "M15,14C12.33,14 7,15.33 7,18V20H23V18C23,15.33 17.67,14 15,14M6,10V7H4V10H1V12H4V15H6V12H9V10M15,12A4,4 0 0,0 19,8A4,4 0 0,0 15,4A4,4 0 0,0 11,8A4,4 0 0,0 15,12Z";
var mdiClock = "M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z";
var mdiFolder = "M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z";
var mdiGroup = "M1,1V5H2V19H1V23H5V22H19V23H23V19H22V5H23V1H19V2H5V1M5,4H19V5H20V19H19V20H5V19H4V5H5M6,6V14H9V18H18V9H14V6M8,8H12V12H8M14,11H16V16H11V14H14";
var mdiLink = "M3.9,12C3.9,10.29 5.29,8.9 7,8.9H11V7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H11V15.1H7C5.29,15.1 3.9,13.71 3.9,12M8,13H16V11H8V13M17,7H13V8.9H17C18.71,8.9 20.1,10.29 20.1,12C20.1,13.71 18.71,15.1 17,15.1H13V17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7Z";
var mdiLock = "M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z";
var mdiNetwork = "M17,3A2,2 0 0,1 19,5V15A2,2 0 0,1 17,17H13V19H14A1,1 0 0,1 15,20H22V22H15A1,1 0 0,1 14,23H10A1,1 0 0,1 9,22H2V20H9A1,1 0 0,1 10,19H11V17H7C5.89,17 5,16.1 5,15V5A2,2 0 0,1 7,3H17Z";
var mdiStar = "M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z";
var mdiTag = "M5.5,7A1.5,1.5 0 0,1 4,5.5A1.5,1.5 0 0,1 5.5,4A1.5,1.5 0 0,1 7,5.5A1.5,1.5 0 0,1 5.5,7M21.41,11.58L12.41,2.58C12.05,2.22 11.55,2 11,2H4C2.89,2 2,2.89 2,4V11C2,11.55 2.22,12.05 2.59,12.41L11.58,21.41C11.95,21.77 12.45,22 13,22C13.55,22 14.05,21.77 14.41,21.41L21.41,14.41C21.78,14.05 22,13.55 22,13C22,12.44 21.77,11.94 21.41,11.58Z";
const _sfc_main$e = {
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
var _sfc_render$e = function render5() {
  var _vm = this, _c = _vm._self._c;
  return _c("span", _vm._b({ staticClass: "material-design-icon file-icon", attrs: { "aria-hidden": _vm.title ? null : "true", "aria-label": _vm.title, "role": "img" }, on: { "click": function($event) {
    return _vm.$emit("click", $event);
  } } }, "span", _vm.$attrs, false), [_c("svg", { staticClass: "material-design-icon__svg", attrs: { "fill": _vm.fillColor, "width": _vm.size, "height": _vm.size, "viewBox": "0 0 24 24" } }, [_c("path", { attrs: { "d": "M13,9V3.5L18.5,9M6,2C4.89,2 4,2.89 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2H6Z" } }, [_vm.title ? _c("title", [_vm._v(_vm._s(_vm.title))]) : _vm._e()])])]);
};
var _sfc_staticRenderFns$e = [];
var __component__$e = /* @__PURE__ */ normalizeComponent$1(
  _sfc_main$e,
  _sfc_render$e,
  _sfc_staticRenderFns$e,
  false,
  null,
  null
);
const IconFile = __component__$e.exports;
const useFilesSettings = () => {
  const filesUserState = loadState("files", "config", null);
  const showHiddenFiles = ref$1(filesUserState?.show_hidden ?? true);
  const sortFavoritesFirst = ref$1(filesUserState?.sort_favorites_first ?? true);
  const cropImagePreviews = ref$1(filesUserState?.crop_image_previews ?? true);
  onMounted(async () => {
    if (!isPublicShare()) {
      try {
        const { data } = await cancelableClient.get(_("/apps/files/api/v1/configs"));
        showHiddenFiles.value = data?.data?.show_hidden ?? false;
        sortFavoritesFirst.value = data?.data?.sort_favorites_first ?? true;
        cropImagePreviews.value = data?.data?.crop_image_previews ?? true;
      } catch (error) {
        console.error("Could not load files settings", error);
        showError(t("Could not load files settings"));
      }
    } else {
      console.debug("Skip loading files settings - currently on public share");
    }
  });
  return {
    showHiddenFiles,
    sortFavoritesFirst,
    cropImagePreviews
  };
};
const useFilesViews = (currentView) => {
  const convertOrder = (order2) => order2 === "asc" ? "ascending" : order2 === "desc" ? "descending" : "none";
  const filesViewsState = loadState("files", "viewConfigs", null);
  const filesViewConfig = ref$1({
    sortBy: filesViewsState?.files?.sorting_mode ?? "basename",
    order: convertOrder(filesViewsState?.files?.sorting_direction ?? "asc")
  });
  const recentViewConfig = ref$1({
    sortBy: filesViewsState?.recent?.sorting_mode ?? "basename",
    order: convertOrder(filesViewsState?.recent?.sorting_direction ?? "asc")
  });
  const favoritesViewConfig = ref$1({
    sortBy: filesViewsState?.favorites?.sorting_mode ?? "basename",
    order: convertOrder(filesViewsState?.favorites?.sorting_direction ?? "asc")
  });
  onMounted(async () => {
    if (!isPublicShare()) {
      try {
        const { data } = await cancelableClient.get(_("/apps/files/api/v1/views"));
        filesViewConfig.value = {
          sortBy: data?.data?.files?.sorting_mode ?? "basename",
          order: convertOrder(data?.data?.files?.sorting_direction)
        };
        favoritesViewConfig.value = {
          sortBy: data?.data?.favorites?.sorting_mode ?? "basename",
          order: convertOrder(data?.data?.favorites?.sorting_direction)
        };
        recentViewConfig.value = {
          sortBy: data?.data?.recent?.sorting_mode ?? "basename",
          order: convertOrder(data?.data?.recent?.sorting_direction)
        };
      } catch (error) {
        console.error("Could not load files views", error);
        showError(t("Could not load files views"));
      }
    } else {
      console.debug("Skip loading files views - currently on public share");
    }
  });
  const currentConfig = computed(() => toValue(currentView || "files") === "files" ? filesViewConfig.value : toValue(currentView) === "recent" ? recentViewConfig.value : favoritesViewConfig.value);
  const sortBy = computed(() => currentConfig.value.sortBy);
  const order = computed(() => currentConfig.value.order);
  return {
    filesViewConfig,
    favoritesViewConfig,
    recentViewConfig,
    currentConfig,
    sortBy,
    order
  };
};
const _sfc_main$d = {
  name: "MenuUpIcon",
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
var _sfc_render$d = function render22() {
  var _vm = this, _c = _vm._self._c;
  return _c("span", _vm._b({ staticClass: "material-design-icon menu-up-icon", attrs: { "aria-hidden": _vm.title ? null : "true", "aria-label": _vm.title, "role": "img" }, on: { "click": function($event) {
    return _vm.$emit("click", $event);
  } } }, "span", _vm.$attrs, false), [_c("svg", { staticClass: "material-design-icon__svg", attrs: { "fill": _vm.fillColor, "width": _vm.size, "height": _vm.size, "viewBox": "0 0 24 24" } }, [_c("path", { attrs: { "d": "M7,15L12,10L17,15H7Z" } }, [_vm.title ? _c("title", [_vm._v(_vm._s(_vm.title))]) : _vm._e()])])]);
};
var _sfc_staticRenderFns$d = [];
var __component__$d = /* @__PURE__ */ normalizeComponent$1(
  _sfc_main$d,
  _sfc_render$d,
  _sfc_staticRenderFns$d,
  false,
  null,
  null
);
const IconSortAscending = __component__$d.exports;
const _sfc_main$c = {
  name: "MenuDownIcon",
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
var _sfc_render$c = function render32() {
  var _vm = this, _c = _vm._self._c;
  return _c("span", _vm._b({ staticClass: "material-design-icon menu-down-icon", attrs: { "aria-hidden": _vm.title ? null : "true", "aria-label": _vm.title, "role": "img" }, on: { "click": function($event) {
    return _vm.$emit("click", $event);
  } } }, "span", _vm.$attrs, false), [_c("svg", { staticClass: "material-design-icon__svg", attrs: { "fill": _vm.fillColor, "width": _vm.size, "height": _vm.size, "viewBox": "0 0 24 24" } }, [_c("path", { attrs: { "d": "M7,10L12,15L17,10H7Z" } }, [_vm.title ? _c("title", [_vm._v(_vm._s(_vm.title))]) : _vm._e()])])]);
};
var _sfc_staticRenderFns$c = [];
var __component__$c = /* @__PURE__ */ normalizeComponent$1(
  _sfc_main$c,
  _sfc_render$c,
  _sfc_staticRenderFns$c,
  false,
  null,
  null
);
const IconSortDescending = __component__$c.exports;
const fileListIconStylesModule = {
  "file-picker__file-icon": "_file-picker__file-icon_3v9zx_9",
  "file-picker__file-icon--primary": "_file-picker__file-icon--primary_3v9zx_21",
  "file-picker__file-icon-overlay": "_file-picker__file-icon-overlay_3v9zx_25"
};
const _sfc_main$b = /* @__PURE__ */ defineComponent({
  __name: "LoadingTableRow",
  props: {
    showCheckbox: { type: Boolean }
  },
  setup(__props) {
    return { __sfc: true, fileListIconStyles: fileListIconStylesModule };
  }
});
var _sfc_render$b = function render42() {
  var _vm = this, _c = _vm._self._c, _setup = _vm._self._setupProxy;
  return _c("tr", { staticClass: "file-picker__row loading-row", attrs: { "aria-hidden": "true" } }, [_vm.showCheckbox ? _c("td", { staticClass: "row-checkbox" }, [_c("span")]) : _vm._e(), _c("td", { staticClass: "row-name" }, [_c("div", { staticClass: "row-wrapper" }, [_c("span", { class: _setup.fileListIconStyles["file-picker__file-icon"] }), _c("span")])]), _vm._m(0), _vm._m(1)]);
};
var _sfc_staticRenderFns$b = [function() {
  var _vm = this, _c = _vm._self._c;
  _vm._self._setupProxy;
  return _c("td", { staticClass: "row-size" }, [_c("span")]);
}, function() {
  var _vm = this, _c = _vm._self._c;
  _vm._self._setupProxy;
  return _c("td", { staticClass: "row-modified" }, [_c("span")]);
}];
var __component__$b = /* @__PURE__ */ normalizeComponent$1(
  _sfc_main$b,
  _sfc_render$b,
  _sfc_staticRenderFns$b,
  false,
  null,
  "15187afc"
);
const LoadingTableRow = __component__$b.exports;
const queue = new PQueue({ concurrency: 5 });
function preloadImage(url) {
  const { resolve, promise } = Promise.withResolvers();
  queue.add(() => {
    const image = new Image();
    image.onerror = () => resolve(false);
    image.onload = () => resolve(true);
    image.src = url;
    return promise;
  });
  return promise;
}
function getPreviewURL(node, options = {}) {
  options = { size: 32, cropPreview: false, mimeFallback: true, ...options };
  try {
    const previewUrl = node.attributes?.previewUrl || _("/core/preview?fileId={fileid}", {
      fileid: node.fileid
    });
    let url;
    try {
      url = new URL(previewUrl);
    } catch (e) {
      url = new URL(previewUrl, window.location.origin);
    }
    url.searchParams.set("x", `${options.size}`);
    url.searchParams.set("y", `${options.size}`);
    url.searchParams.set("mimeFallback", `${options.mimeFallback}`);
    url.searchParams.set("a", options.cropPreview === true ? "0" : "1");
    url.searchParams.set("c", `${node.attributes.etag}`);
    return url;
  } catch (e) {
    return null;
  }
}
const usePreviewURL = (node, options) => {
  const previewURL = ref$1(null);
  const previewLoaded = ref$1(false);
  watchEffect(() => {
    previewLoaded.value = false;
    previewURL.value = getPreviewURL(toValue(node), toValue(options || {}));
    if (previewURL.value && toValue(node).type === FileType.File) {
      preloadImage(previewURL.value.href).then((success) => {
        previewLoaded.value = success;
      });
    }
  });
  return {
    previewURL,
    previewLoaded
  };
};
const _sfc_main$a = {
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
var _sfc_render$a = function render52() {
  var _vm = this, _c = _vm._self._c;
  return _c("span", _vm._b({ staticClass: "material-design-icon folder-icon", attrs: { "aria-hidden": _vm.title ? null : "true", "aria-label": _vm.title, "role": "img" }, on: { "click": function($event) {
    return _vm.$emit("click", $event);
  } } }, "span", _vm.$attrs, false), [_c("svg", { staticClass: "material-design-icon__svg", attrs: { "fill": _vm.fillColor, "width": _vm.size, "height": _vm.size, "viewBox": "0 0 24 24" } }, [_c("path", { attrs: { "d": "M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z" } }, [_vm.title ? _c("title", [_vm._v(_vm._s(_vm.title))]) : _vm._e()])])]);
};
var _sfc_staticRenderFns$a = [];
var __component__$a = /* @__PURE__ */ normalizeComponent$1(
  _sfc_main$a,
  _sfc_render$a,
  _sfc_staticRenderFns$a,
  false,
  null,
  null
);
const IconFolder = __component__$a.exports;
const __default__$1 = {
  name: "FilePreview"
};
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  ...__default__$1,
  props: {
    node: null,
    cropImagePreviews: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    const fileListIconStyles = ref$1(fileListIconStylesModule);
    const {
      previewURL,
      previewLoaded
    } = usePreviewURL(toRef(props, "node"), computed(() => ({ cropPreview: props.cropImagePreviews })));
    const isFile = computed(() => props.node.type === FileType.File);
    const folderDecorationIcon = computed(() => {
      if (props.node.type !== FileType.Folder) {
        return null;
      }
      if (props.node.attributes?.["is-encrypted"] === 1) {
        return mdiLock;
      }
      if (props.node.attributes?.["is-tag"]) {
        return mdiTag;
      }
      const shareTypes = Object.values(props.node.attributes?.["share-types"] || {}).flat();
      if (shareTypes.some((type) => type === ShareType.Link || type === ShareType.Email)) {
        return mdiLink;
      }
      if (shareTypes.length > 0) {
        return mdiAccountPlus;
      }
      switch (props.node.attributes?.["mount-type"]) {
        case "external":
        case "external-session":
          return mdiNetwork;
        case "group":
          return mdiGroup;
        case "shared":
          return mdiAccountPlus;
      }
      return null;
    });
    return { __sfc: true, fileListIconStyles, props, previewURL, previewLoaded, isFile, folderDecorationIcon, NcIconSvgWrapper, IconFile, IconFolder };
  }
});
var _sfc_render$9 = function render6() {
  var _vm = this, _c = _vm._self._c, _setup = _vm._self._setupProxy;
  return _c("div", { class: _setup.fileListIconStyles["file-picker__file-icon"], style: _setup.previewLoaded ? { backgroundImage: `url(${_setup.previewURL})` } : void 0 }, [!_setup.previewLoaded ? [_setup.isFile ? _c(_setup.IconFile, { attrs: { "size": 32 } }) : [_setup.folderDecorationIcon ? _c(_setup.NcIconSvgWrapper, { class: _setup.fileListIconStyles["file-picker__file-icon-overlay"], attrs: { "inline": "", "path": _setup.folderDecorationIcon, "size": 16 } }) : _vm._e(), _c(_setup.IconFolder, { class: _setup.fileListIconStyles["file-picker__file-icon--primary"], attrs: { "size": 32 } })]] : _vm._e()], 2);
};
var _sfc_staticRenderFns$9 = [];
var __component__$9 = /* @__PURE__ */ normalizeComponent$1(
  _sfc_main$9,
  _sfc_render$9,
  _sfc_staticRenderFns$9,
  false,
  null,
  null
);
const FilePreview = __component__$9.exports;
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "FileListRow",
  props: {
    allowPickDirectory: { type: Boolean },
    selected: { type: Boolean },
    showCheckbox: { type: Boolean },
    canPick: { type: Boolean },
    node: null,
    cropImagePreviews: { type: Boolean }
  },
  emits: ["update:selected", "enter-directory"],
  setup(__props, { emit: emit2 }) {
    const props = __props;
    const displayName = computed(() => props.node.attributes?.displayName || props.node.basename.slice(0, props.node.extension ? -props.node.extension.length : void 0));
    const fileExtension = computed(() => props.node.extension);
    const isDirectory = computed(() => props.node.type === FileType.Folder);
    const isPickable = computed(() => props.canPick && (props.allowPickDirectory || !isDirectory.value));
    function toggleSelected() {
      emit2("update:selected", !props.selected);
    }
    function handleClick() {
      if (isDirectory.value) {
        emit2("enter-directory", props.node);
      } else {
        toggleSelected();
      }
    }
    function handleKeyDown(event) {
      if (event.key === "Enter") {
        handleClick();
      }
    }
    return { __sfc: true, props, emit: emit2, displayName, fileExtension, isDirectory, isPickable, toggleSelected, handleClick, handleKeyDown, formatFileSize, NcCheckboxRadioSwitch, NcDateTime, t, FilePreview };
  }
});
var _sfc_render$8 = function render7() {
  var _vm = this, _c = _vm._self._c, _setup = _vm._self._setupProxy;
  return _c("tr", _vm._g({ class: ["file-picker__row", {
    "file-picker__row--selected": _vm.selected && !_vm.showCheckbox
  }], attrs: { "tabindex": _vm.showCheckbox && !_setup.isDirectory ? void 0 : 0, "aria-selected": !_setup.isPickable ? void 0 : _vm.selected, "data-filename": _vm.node.basename, "data-testid": "file-list-row" } }, {
    click: _setup.handleClick,
    /* same as tabindex -> if we hide the checkbox or this is a directory we need keyboard access to enter the directory or select the node */
    ...!_vm.showCheckbox || _setup.isDirectory ? { keydown: _setup.handleKeyDown } : {}
  }), [_vm.showCheckbox ? _c("td", { staticClass: "row-checkbox", on: { "click": function($event) {
    $event.stopPropagation();
    return (() => {
    }).apply(null, arguments);
  } } }, [_c(_setup.NcCheckboxRadioSwitch, { attrs: { "aria-label": _setup.t("Select the row for {nodename}", { nodename: _setup.displayName }), "disabled": !_setup.isPickable, "data-testid": "row-checkbox", "model-value": _vm.selected }, on: { "update:model-value": _setup.toggleSelected } })], 1) : _vm._e(), _c("td", { staticClass: "row-name" }, [_c("div", { staticClass: "file-picker__name-container", attrs: { "data-testid": "row-name" } }, [_c(_setup.FilePreview, { attrs: { "node": _vm.node, "crop-image-previews": _vm.cropImagePreviews } }), _c("div", { staticClass: "file-picker__file-name", attrs: { "title": _setup.displayName }, domProps: { "textContent": _vm._s(_setup.displayName) } }), _c("div", { staticClass: "file-picker__file-extension", domProps: { "textContent": _vm._s(_setup.fileExtension) } })], 1)]), _c("td", { staticClass: "row-size" }, [_vm._v(" " + _vm._s(_setup.formatFileSize(_vm.node.size || 0)) + " ")]), _c("td", { staticClass: "row-modified" }, [_c(_setup.NcDateTime, { attrs: { "timestamp": _vm.node.mtime, "ignore-seconds": true } })], 1)]);
};
var _sfc_staticRenderFns$8 = [];
var __component__$8 = /* @__PURE__ */ normalizeComponent$1(
  _sfc_main$8,
  _sfc_render$8,
  _sfc_staticRenderFns$8,
  false,
  null,
  "4892c2a0"
);
const FileListRow = __component__$8.exports;
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "FileList",
  props: {
    currentView: null,
    multiselect: { type: Boolean },
    allowPickDirectory: { type: Boolean },
    loading: { type: Boolean },
    files: null,
    selectedFiles: null,
    path: null
  },
  emits: ["update:path", "update:selectedFiles"],
  setup(__props, { emit: emit2 }) {
    const props = __props;
    const customSortingConfig = ref$1();
    const { currentConfig: filesAppSorting } = useFilesViews(props.currentView);
    const sortingConfig = computed(() => customSortingConfig.value ?? filesAppSorting.value);
    const sortByName = computed(() => sortingConfig.value.sortBy === "basename" ? sortingConfig.value.order === "none" ? void 0 : sortingConfig.value.order : void 0);
    const sortBySize = computed(() => sortingConfig.value.sortBy === "size" ? sortingConfig.value.order === "none" ? void 0 : sortingConfig.value.order : void 0);
    const sortByModified = computed(() => sortingConfig.value.sortBy === "mtime" ? sortingConfig.value.order === "none" ? void 0 : sortingConfig.value.order : void 0);
    const toggleSorting = (sortBy) => {
      if (sortingConfig.value.sortBy === sortBy) {
        if (sortingConfig.value.order === "ascending") {
          customSortingConfig.value = { sortBy: sortingConfig.value.sortBy, order: "descending" };
        } else {
          customSortingConfig.value = { sortBy: sortingConfig.value.sortBy, order: "ascending" };
        }
      } else {
        customSortingConfig.value = { sortBy, order: "ascending" };
      }
    };
    const { sortFavoritesFirst, cropImagePreviews } = useFilesSettings();
    const sortedFiles = computed(() => {
      return sortNodes(props.files, {
        sortFoldersFirst: true,
        sortFavoritesFirst: sortFavoritesFirst.value,
        sortingOrder: sortingConfig.value.order === "descending" ? "desc" : "asc",
        sortingMode: sortingConfig.value.sortBy
      });
    });
    const selectableFiles = computed(() => props.files.filter((file) => props.allowPickDirectory || file.type !== FileType.Folder));
    const allSelected = computed(() => !props.loading && props.selectedFiles.length > 0 && props.selectedFiles.length >= selectableFiles.value.length);
    function onSelectAll() {
      if (props.selectedFiles.length < selectableFiles.value.length) {
        emit2("update:selectedFiles", selectableFiles.value);
      } else {
        emit2("update:selectedFiles", []);
      }
    }
    function onNodeSelected(file) {
      if (props.selectedFiles.includes(file)) {
        emit2("update:selectedFiles", props.selectedFiles.filter((f) => f.path !== file.path));
      } else {
        if (props.multiselect) {
          emit2("update:selectedFiles", [...props.selectedFiles, file]);
        } else {
          emit2("update:selectedFiles", [file]);
        }
      }
    }
    function onChangeDirectory(dir) {
      emit2("update:path", dir.path);
    }
    const skeletonNumber = ref$1(4);
    const fileContainer = ref$1();
    {
      const resize = () => nextTick(() => {
        const nodes = fileContainer.value?.parentElement?.children || [];
        let height = fileContainer.value?.parentElement?.clientHeight || 450;
        for (let index = 0; index < nodes.length; index++) {
          if (!fileContainer.value?.isSameNode(nodes[index])) {
            height -= nodes[index].clientHeight;
          }
        }
        skeletonNumber.value = Math.max(1, Math.floor((height - 50) / 50));
      });
      onMounted(() => {
        window.addEventListener("resize", resize);
        resize();
      });
      onUnmounted(() => {
        window.removeEventListener("resize", resize);
      });
    }
    return { __sfc: true, props, emit: emit2, customSortingConfig, filesAppSorting, sortingConfig, sortByName, sortBySize, sortByModified, toggleSorting, sortFavoritesFirst, cropImagePreviews, sortedFiles, selectableFiles, allSelected, onSelectAll, onNodeSelected, onChangeDirectory, skeletonNumber, fileContainer, NcButton, NcCheckboxRadioSwitch, t, IconSortAscending, IconSortDescending, LoadingTableRow, FileListRow };
  }
});
var _sfc_render$7 = function render8() {
  var _vm = this, _c = _vm._self._c, _setup = _vm._self._setupProxy;
  return _c("div", { ref: "fileContainer", staticClass: "file-picker__files" }, [_c("table", [_c("thead", [_c("tr", [_vm.multiselect ? _c("th", { staticClass: "row-checkbox" }, [_c("span", { staticClass: "hidden-visually" }, [_vm._v(" " + _vm._s(_setup.t("Select entry")) + " ")]), _vm.multiselect ? _c(_setup.NcCheckboxRadioSwitch, { attrs: { "aria-label": _setup.t("Select all entries"), "data-testid": "select-all-checkbox", "model-value": _setup.allSelected }, on: { "update:model-value": _setup.onSelectAll } }) : _vm._e()], 1) : _vm._e(), _c("th", { staticClass: "row-name", attrs: { "aria-sort": _setup.sortByName } }, [_c("div", { staticClass: "header-wrapper" }, [_c("span", { staticClass: "file-picker__header-preview" }), _c(_setup.NcButton, { attrs: { "wide": true, "type": "tertiary", "data-test": "file-picker_sort-name" }, on: { "click": function($event) {
    return _setup.toggleSorting("basename");
  } }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
    return [_setup.sortByName === "ascending" ? _c(_setup.IconSortAscending, { attrs: { "size": 20 } }) : _setup.sortByName === "descending" ? _c(_setup.IconSortDescending, { attrs: { "size": 20 } }) : _c("span", { staticStyle: { "width": "44px" } })];
  }, proxy: true }]) }, [_vm._v(" " + _vm._s(_setup.t("Name")) + " ")])], 1)]), _c("th", { staticClass: "row-size", attrs: { "aria-sort": _setup.sortBySize } }, [_c(_setup.NcButton, { attrs: { "wide": true, "type": "tertiary" }, on: { "click": function($event) {
    return _setup.toggleSorting("size");
  } }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
    return [_setup.sortBySize === "ascending" ? _c(_setup.IconSortAscending, { attrs: { "size": 20 } }) : _setup.sortBySize === "descending" ? _c(_setup.IconSortDescending, { attrs: { "size": 20 } }) : _c("span", { staticStyle: { "width": "44px" } })];
  }, proxy: true }]) }, [_vm._v(" " + _vm._s(_setup.t("Size")) + " ")])], 1), _c("th", { staticClass: "row-modified", attrs: { "aria-sort": _setup.sortByModified } }, [_c(_setup.NcButton, { attrs: { "wide": true, "type": "tertiary" }, on: { "click": function($event) {
    return _setup.toggleSorting("mtime");
  } }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
    return [_setup.sortByModified === "ascending" ? _c(_setup.IconSortAscending, { attrs: { "size": 20 } }) : _setup.sortByModified === "descending" ? _c(_setup.IconSortDescending, { attrs: { "size": 20 } }) : _c("span", { staticStyle: { "width": "44px" } })];
  }, proxy: true }]) }, [_vm._v(" " + _vm._s(_setup.t("Modified")) + " ")])], 1)])]), _c("tbody", [_vm.loading ? _vm._l(_setup.skeletonNumber, function(index) {
    return _c(_setup.LoadingTableRow, { key: index, attrs: { "show-checkbox": _vm.multiselect } });
  }) : _vm._l(_setup.sortedFiles, function(file) {
    return _c(_setup.FileListRow, { key: file.fileid || file.path, attrs: { "allow-pick-directory": _vm.allowPickDirectory, "show-checkbox": _vm.multiselect, "can-pick": _vm.multiselect || _vm.selectedFiles.length === 0 || _vm.selectedFiles.includes(file), "selected": _vm.selectedFiles.includes(file), "node": file, "crop-image-previews": _setup.cropImagePreviews }, on: { "update:selected": function($event) {
      return _setup.onNodeSelected(file);
    }, "enter-directory": _setup.onChangeDirectory } });
  })], 2)])]);
};
var _sfc_staticRenderFns$7 = [];
var __component__$7 = /* @__PURE__ */ normalizeComponent$1(
  _sfc_main$7,
  _sfc_render$7,
  _sfc_staticRenderFns$7,
  false,
  null,
  "4f5d2a56"
);
const FileList = __component__$7.exports;
const _sfc_main$6 = {
  name: "HomeIcon",
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
var _sfc_render$6 = function render9() {
  var _vm = this, _c = _vm._self._c;
  return _c("span", _vm._b({ staticClass: "material-design-icon home-icon", attrs: { "aria-hidden": _vm.title ? null : "true", "aria-label": _vm.title, "role": "img" }, on: { "click": function($event) {
    return _vm.$emit("click", $event);
  } } }, "span", _vm.$attrs, false), [_c("svg", { staticClass: "material-design-icon__svg", attrs: { "fill": _vm.fillColor, "width": _vm.size, "height": _vm.size, "viewBox": "0 0 24 24" } }, [_c("path", { attrs: { "d": "M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" } }, [_vm.title ? _c("title", [_vm._v(_vm._s(_vm.title))]) : _vm._e()])])]);
};
var _sfc_staticRenderFns$6 = [];
var __component__$6 = /* @__PURE__ */ normalizeComponent$1(
  _sfc_main$6,
  _sfc_render$6,
  _sfc_staticRenderFns$6,
  false,
  null,
  null
);
const IconHome = __component__$6.exports;
const _sfc_main$5 = {
  name: "PlusIcon",
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
var _sfc_render$5 = function render10() {
  var _vm = this, _c = _vm._self._c;
  return _c("span", _vm._b({ staticClass: "material-design-icon plus-icon", attrs: { "aria-hidden": _vm.title ? null : "true", "aria-label": _vm.title, "role": "img" }, on: { "click": function($event) {
    return _vm.$emit("click", $event);
  } } }, "span", _vm.$attrs, false), [_c("svg", { staticClass: "material-design-icon__svg", attrs: { "fill": _vm.fillColor, "width": _vm.size, "height": _vm.size, "viewBox": "0 0 24 24" } }, [_c("path", { attrs: { "d": "M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" } }, [_vm.title ? _c("title", [_vm._v(_vm._s(_vm.title))]) : _vm._e()])])]);
};
var _sfc_staticRenderFns$5 = [];
var __component__$5 = /* @__PURE__ */ normalizeComponent$1(
  _sfc_main$5,
  _sfc_render$5,
  _sfc_staticRenderFns$5,
  false,
  null,
  null
);
const IconPlus = __component__$5.exports;
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "FilePickerBreadcrumbs",
  props: {
    path: null,
    showMenu: { type: Boolean }
  },
  emits: ["update:path", "create-node"],
  setup(__props, { emit: emit2 }) {
    const props = __props;
    const actionsOpen = ref$1(false);
    const newNodeName = ref$1("");
    const nameInput = ref$1();
    function validateInput() {
      const name = newNodeName.value.trim();
      const input = nameInput.value?.$el?.querySelector("input");
      let validity = "";
      if (name.length === 0) {
        validity = t("Folder name cannot be empty.");
      } else if (name.includes("/")) {
        validity = t('"/" is not allowed inside a folder name.');
      } else if (["..", "."].includes(name)) {
        validity = t('"{name}" is an invalid folder name.', { name });
      } else if (window.OC.config?.blacklist_files_regex && name.match(window.OC.config?.blacklist_files_regex)) {
        validity = t('"{name}" is not an allowed folder name', { name });
      }
      if (input) {
        input.setCustomValidity(validity);
      }
      return validity === "";
    }
    const onSubmit = function() {
      const name = newNodeName.value.trim();
      if (validateInput()) {
        actionsOpen.value = false;
        emit2("create-node", name);
        newNodeName.value = "";
      }
    };
    const pathElements = computed(
      () => props.path.split("/").filter((v) => v !== "").map((v, i, elements) => ({
        name: v,
        path: "/" + elements.slice(0, i + 1).join("/")
      }))
    );
    return { __sfc: true, props, emit: emit2, actionsOpen, newNodeName, nameInput, validateInput, onSubmit, pathElements, IconFolder, IconHome, IconPlus, NcActions, NcActionInput, NcBreadcrumbs, NcBreadcrumb, t };
  }
});
var _sfc_render$4 = function render11() {
  var _vm = this, _c = _vm._self._c, _setup = _vm._self._setupProxy;
  return _c(_setup.NcBreadcrumbs, { staticClass: "file-picker__breadcrumbs", scopedSlots: _vm._u([{ key: "default", fn: function() {
    return [_c(_setup.NcBreadcrumb, { attrs: { "name": _setup.t("All files"), "title": _setup.t("Home") }, on: { "click": function($event) {
      return _setup.emit("update:path", "/");
    } }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
      return [_c(_setup.IconHome, { attrs: { "size": 20 } })];
    }, proxy: true }]) }), _vm._l(_setup.pathElements, function(dir) {
      return _c(_setup.NcBreadcrumb, { key: dir.path, attrs: { "name": dir.name, "title": dir.path }, on: { "click": function($event) {
        return _setup.emit("update:path", dir.path);
      } } });
    })];
  }, proxy: true }, _vm.showMenu ? { key: "actions", fn: function() {
    return [_c(_setup.NcActions, { attrs: { "open": _setup.actionsOpen, "aria-label": _setup.t("Create directory"), "force-menu": true, "force-name": true, "menu-name": _setup.t("New"), "type": "secondary" }, on: { "update:open": function($event) {
      _setup.actionsOpen = $event;
    }, "close": function($event) {
      _setup.newNodeName = "";
    } }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
      return [_c(_setup.IconPlus, { attrs: { "size": 20 } })];
    }, proxy: true }], null, false, 2971667417) }, [_c(_setup.NcActionInput, { ref: "nameInput", attrs: { "value": _setup.newNodeName, "label": _setup.t("New folder"), "placeholder": _setup.t("New folder name") }, on: { "update:value": function($event) {
      _setup.newNodeName = $event;
    }, "submit": _setup.onSubmit, "update:model-value": _setup.validateInput }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
      return [_c(_setup.IconFolder, { attrs: { "size": 20 } })];
    }, proxy: true }], null, false, 1614167509) })], 1)];
  }, proxy: true } : null], null, true) });
};
var _sfc_staticRenderFns$4 = [];
var __component__$4 = /* @__PURE__ */ normalizeComponent$1(
  _sfc_main$4,
  _sfc_render$4,
  _sfc_staticRenderFns$4,
  false,
  null,
  "ec4d392b"
);
const FilePickerBreadcrumbs = __component__$4.exports;
const _sfc_main$3 = {
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
var _sfc_render$3 = function render12() {
  var _vm = this, _c = _vm._self._c;
  return _c("span", _vm._b({ staticClass: "material-design-icon close-icon", attrs: { "aria-hidden": _vm.title ? null : "true", "aria-label": _vm.title, "role": "img" }, on: { "click": function($event) {
    return _vm.$emit("click", $event);
  } } }, "span", _vm.$attrs, false), [_c("svg", { staticClass: "material-design-icon__svg", attrs: { "fill": _vm.fillColor, "width": _vm.size, "height": _vm.size, "viewBox": "0 0 24 24" } }, [_c("path", { attrs: { "d": "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" } }, [_vm.title ? _c("title", [_vm._v(_vm._s(_vm.title))]) : _vm._e()])])]);
};
var _sfc_staticRenderFns$3 = [];
var __component__$3 = /* @__PURE__ */ normalizeComponent$1(
  _sfc_main$3,
  _sfc_render$3,
  _sfc_staticRenderFns$3,
  false,
  null,
  null
);
const IconClose = __component__$3.exports;
const _sfc_main$2 = {
  name: "MagnifyIcon",
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
var _sfc_render$2 = function render13() {
  var _vm = this, _c = _vm._self._c;
  return _c("span", _vm._b({ staticClass: "material-design-icon magnify-icon", attrs: { "aria-hidden": _vm.title ? null : "true", "aria-label": _vm.title, "role": "img" }, on: { "click": function($event) {
    return _vm.$emit("click", $event);
  } } }, "span", _vm.$attrs, false), [_c("svg", { staticClass: "material-design-icon__svg", attrs: { "fill": _vm.fillColor, "width": _vm.size, "height": _vm.size, "viewBox": "0 0 24 24" } }, [_c("path", { attrs: { "d": "M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" } }, [_vm.title ? _c("title", [_vm._v(_vm._s(_vm.title))]) : _vm._e()])])]);
};
var _sfc_staticRenderFns$2 = [];
var __component__$2 = /* @__PURE__ */ normalizeComponent$1(
  _sfc_main$2,
  _sfc_render$2,
  _sfc_staticRenderFns$2,
  false,
  null,
  null
);
const IconMagnify = __component__$2.exports;
const useViews = (isAnonymous) => {
  const allViews = [
    {
      id: "files",
      label: t("All files"),
      icon: mdiFolder
    },
    {
      id: "recent",
      label: t("Recent"),
      icon: mdiClock
    },
    {
      id: "favorites",
      label: t("Favorites"),
      icon: mdiStar
    }
  ];
  const availableViews = isAnonymous.value ? allViews.filter(({ id }) => id === "files") : allViews;
  return {
    allViews,
    availableViews
  };
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "FilePickerNavigation",
  props: {
    currentView: null,
    filterString: null,
    isCollapsed: { type: Boolean },
    disabledNavigation: { type: Boolean }
  },
  emits: ["update:currentView", "update:filterString"],
  setup(__props, { emit: emit2 }) {
    const props = __props;
    const { availableViews } = useViews(ref$1(getCurrentUser() === null));
    const currentViewObject = computed(() => availableViews.filter((v) => v.id === props.currentView)[0] ?? availableViews[0]);
    const updateFilterValue = (value) => emit2("update:filterString", value);
    return { __sfc: true, props, emit: emit2, availableViews, currentViewObject, updateFilterValue, IconClose, IconMagnify, NcButton, NcIconSvgWrapper, NcSelect, NcTextField, Fragment: fragment, t };
  }
});
var _sfc_render$1 = function render14() {
  var _vm = this, _c = _vm._self._c, _setup = _vm._self._setupProxy;
  return _c(_setup.Fragment, [_c(_setup.NcTextField, { staticClass: "file-picker__filter-input", attrs: { "label": _setup.t("Filter file list"), "show-trailing-button": !!_vm.filterString, "model-value": _vm.filterString }, on: { "update:model-value": _setup.updateFilterValue, "trailing-button-click": function($event) {
    return _setup.updateFilterValue("");
  } }, scopedSlots: _vm._u([{ key: "trailing-button-icon", fn: function() {
    return [_c(_setup.IconClose, { attrs: { "size": 16 } })];
  }, proxy: true }]) }, [_c(_setup.IconMagnify, { attrs: { "size": 16 } })], 1), _setup.availableViews.length > 1 && !_vm.disabledNavigation ? [!_vm.isCollapsed ? _c("ul", { staticClass: "file-picker__side" }, _vm._l(_setup.availableViews, function(view) {
    return _c("li", { key: view.id }, [_c(_setup.NcButton, { attrs: { "type": _vm.currentView === view.id ? "primary" : "tertiary", "wide": true }, on: { "click": function($event) {
      return _vm.$emit("update:currentView", view.id);
    } }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
      return [_c(_setup.NcIconSvgWrapper, { attrs: { "path": view.icon, "size": 20 } })];
    }, proxy: true }], null, true) }, [_vm._v(" " + _vm._s(view.label) + " ")])], 1);
  }), 0) : _c(_setup.NcSelect, { attrs: { "aria-label": _setup.t("Current view selector"), "clearable": false, "searchable": false, "options": _setup.availableViews, "model-value": _setup.currentViewObject }, on: { "update:model-value": function($event) {
    return _setup.emit("update:currentView", $event.id);
  } } })] : _vm._e()], 2);
};
var _sfc_staticRenderFns$1 = [];
var __component__$1 = /* @__PURE__ */ normalizeComponent$1(
  _sfc_main$1,
  _sfc_render$1,
  _sfc_staticRenderFns$1,
  false,
  null,
  "f5975252"
);
const FilePickerNavigation = __component__$1.exports;
function getRecentNodes(client) {
  const controller = new AbortController();
  const lastTwoWeek = Math.round(Date.now() / 1e3) - 60 * 60 * 24 * 14;
  return new CancelablePromise(async (resolve, reject, onCancel) => {
    onCancel(() => controller.abort());
    try {
      const { data } = await client.search("/", {
        signal: controller.signal,
        details: true,
        data: getRecentSearch(lastTwoWeek)
      });
      const nodes = data.results.map((result) => resultToNode(result));
      resolve(nodes);
    } catch (error) {
      reject(error);
    }
  });
}
function getNodes(client, directoryPath) {
  const controller = new AbortController();
  return new CancelablePromise(async (resolve, reject, onCancel) => {
    onCancel(() => controller.abort());
    try {
      const results = await client.getDirectoryContents(pathBrowserifyExports.join(defaultRootPath, directoryPath), {
        signal: controller.signal,
        details: true,
        includeSelf: true,
        data: getDefaultPropfind()
      });
      const nodes = results.data.map((result) => resultToNode(result));
      resolve({
        contents: nodes.filter(({ path }) => path !== directoryPath),
        folder: nodes.find(({ path }) => path === directoryPath)
      });
    } catch (error) {
      reject(error);
    }
  });
}
async function getFile(client, path) {
  const { data } = await client.stat(pathBrowserifyExports.join(defaultRootPath, path), {
    details: true,
    data: getDefaultPropfind()
  });
  return resultToNode(data);
}
const useDAVFiles = function(currentView, currentPath) {
  const client = getClient();
  const files = shallowRef([]);
  const folder = shallowRef(null);
  const isLoading = ref$1(true);
  const promise = ref$1(null);
  async function createDirectory(name) {
    const path = pathBrowserifyExports.join(currentPath.value, name);
    await client.createDirectory(pathBrowserifyExports.join(defaultRootPath, path));
    const directory = await getFile(client, path);
    files.value = [...files.value, directory];
    return directory;
  }
  async function loadDAVFiles() {
    if (promise.value) {
      promise.value.cancel();
    }
    isLoading.value = true;
    if (currentView.value === "favorites") {
      promise.value = getFavoriteNodes(client, currentPath.value);
    } else if (currentView.value === "recent") {
      promise.value = getRecentNodes(client);
    } else {
      promise.value = getNodes(client, currentPath.value);
    }
    const content = await promise.value;
    if ("folder" in content) {
      folder.value = content.folder;
      files.value = content.contents;
    } else {
      folder.value = null;
      files.value = content;
    }
    promise.value = null;
    isLoading.value = false;
  }
  watch([currentView, currentPath], () => loadDAVFiles());
  onMounted(() => loadDAVFiles());
  return {
    isLoading,
    files,
    folder,
    loadFiles: loadDAVFiles,
    createDirectory
  };
};
const useMimeFilter = function(allowedMIMETypes) {
  const splittedTypes = computed(() => allowedMIMETypes.value.map((filter) => filter.split("/")));
  const isSupportedMimeType = (mime) => {
    const mimeTypeArray = mime.split("/");
    return splittedTypes.value.some(
      ([type, subtype]) => (
        // check mime type matches or is wildcard
        (mimeTypeArray[0] === type || type === "*") && (mimeTypeArray[1] === subtype || subtype === "*")
      )
    );
  };
  return {
    isSupportedMimeType
  };
};
const __default__ = {
  name: "FilePicker"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...__default__,
  props: {
    buttons: null,
    name: null,
    allowPickDirectory: { type: Boolean, default: false },
    disabledNavigation: { type: Boolean, default: false },
    container: { default: "body" },
    filterFn: { default: void 0 },
    mimetypeFilter: { default: () => [] },
    multiselect: { type: Boolean, default: true },
    path: { default: void 0 }
  },
  emits: ["close"],
  setup(__props, { emit: emit$1 }) {
    const props = __props;
    const isOpen = ref$1(true);
    const dialogButtons = computed(() => {
      const nodes = selectedFiles.value.length === 0 && props.allowPickDirectory && currentFolder.value ? [currentFolder.value] : selectedFiles.value;
      const buttons = typeof props.buttons === "function" ? props.buttons(nodes, currentPath.value, currentView.value) : props.buttons;
      return buttons.map((button) => ({
        ...button,
        disabled: button.disabled || isLoading.value,
        callback: () => {
          isHandlingCallback = true;
          handleButtonClick(button.callback, nodes);
        }
      }));
    });
    let isHandlingCallback = false;
    const handleButtonClick = async (callback, nodes) => {
      callback(nodes);
      emit$1("close", nodes);
      isHandlingCallback = false;
    };
    const currentView = ref$1("files");
    const viewHeadline = computed(() => currentView.value === "favorites" ? t("Favorites") : currentView.value === "recent" ? t("Recent") : "");
    const selectedFiles = shallowRef([]);
    const savedPath = ref$1(window?.sessionStorage.getItem("NC.FilePicker.LastPath") || "/");
    const navigatedPath = ref$1("");
    watch([navigatedPath], () => {
      if (props.path === void 0 && navigatedPath.value) {
        window.sessionStorage.setItem("NC.FilePicker.LastPath", navigatedPath.value);
      }
      selectedFiles.value = [];
    });
    const currentPath = computed({
      get: () => {
        return currentView.value === "files" ? navigatedPath.value || props.path || savedPath.value : "/";
      },
      set: (path) => {
        navigatedPath.value = path;
      }
    });
    const filterString = ref$1("");
    const { isSupportedMimeType } = useMimeFilter(toRef(props, "mimetypeFilter"));
    const {
      files,
      folder: currentFolder,
      isLoading,
      loadFiles,
      createDirectory
    } = useDAVFiles(currentView, currentPath);
    onMounted(() => loadFiles());
    const { showHiddenFiles } = useFilesSettings();
    const filteredFiles = computed(() => {
      let filtered = files.value;
      if (!showHiddenFiles.value) {
        filtered = filtered.filter((file) => !file.basename.startsWith("."));
      }
      if (props.mimetypeFilter.length > 0) {
        filtered = filtered.filter((file) => file.type === "folder" || file.mime && isSupportedMimeType(file.mime));
      }
      if (filterString.value) {
        filtered = filtered.filter((file) => file.basename.toLowerCase().includes(filterString.value.toLowerCase()));
      }
      if (props.filterFn) {
        filtered = filtered.filter((f) => props.filterFn(f));
      }
      return filtered;
    });
    const noFilesDescription = computed(() => {
      if (currentView.value === "files") {
        return t("Upload some content or sync with your devices!");
      } else if (currentView.value === "recent") {
        return t("Files and folders you recently modified will show up here.");
      } else {
        return t("Files and folders you mark as favorite will show up here.");
      }
    });
    const onCreateFolder = async (name) => {
      try {
        const folder = await createDirectory(name);
        navigatedPath.value = folder.path;
        emit("files:node:created", files.value.filter((file) => file.basename === name)[0]);
      } catch (error) {
        console.warn("Could not create new folder", { name, error });
        showError(t("Could not create the new folder"));
      }
    };
    const handleClose = (open) => {
      if (!open && !isHandlingCallback) {
        emit$1("close");
      }
    };
    return { __sfc: true, props, emit: emit$1, isOpen, dialogButtons, isHandlingCallback, handleButtonClick, currentView, viewHeadline, selectedFiles, savedPath, navigatedPath, currentPath, filterString, isSupportedMimeType, files, currentFolder, isLoading, loadFiles, createDirectory, showHiddenFiles, filteredFiles, noFilesDescription, onCreateFolder, handleClose, IconFile, FileList, FilePickerBreadcrumbs, FilePickerNavigation, NcDialog, NcEmptyContent, t };
  }
});
var _sfc_render = function render15() {
  var _vm = this, _c = _vm._self._c, _setup = _vm._self._setupProxy;
  return _c(_setup.NcDialog, { attrs: { "open": _setup.isOpen, "container": _vm.container, "buttons": _setup.dialogButtons, "name": _vm.name, "size": "large", "content-classes": "file-picker__content", "dialog-classes": "file-picker", "navigation-classes": "file-picker__navigation" }, on: { "update:open": [function($event) {
    _setup.isOpen = $event;
  }, _setup.handleClose] }, scopedSlots: _vm._u([{ key: "navigation", fn: function({ isCollapsed }) {
    return [_c(_setup.FilePickerNavigation, { attrs: { "current-view": _setup.currentView, "filter-string": _setup.filterString, "is-collapsed": isCollapsed, "disabled-navigation": _vm.disabledNavigation }, on: { "update:currentView": function($event) {
      _setup.currentView = $event;
    }, "update:current-view": function($event) {
      _setup.currentView = $event;
    }, "update:filterString": function($event) {
      _setup.filterString = $event;
    }, "update:filter-string": function($event) {
      _setup.filterString = $event;
    } } })];
  } }]) }, [_c("div", { staticClass: "file-picker__main" }, [_setup.currentView === "files" ? _c(_setup.FilePickerBreadcrumbs, { attrs: { "path": _setup.currentPath, "show-menu": _vm.allowPickDirectory }, on: { "update:path": function($event) {
    _setup.currentPath = $event;
  }, "create-node": _setup.onCreateFolder } }) : _c("div", { staticClass: "file-picker__view" }, [_c("h3", [_vm._v(_vm._s(_setup.viewHeadline))])]), _setup.isLoading || _setup.filteredFiles.length > 0 ? _c(_setup.FileList, { attrs: { "path": _setup.currentPath, "selected-files": _setup.selectedFiles, "allow-pick-directory": _vm.allowPickDirectory, "current-view": _setup.currentView, "files": _setup.filteredFiles, "multiselect": _vm.multiselect, "loading": _setup.isLoading, "name": _setup.viewHeadline }, on: { "update:path": [function($event) {
    _setup.currentPath = $event;
  }, function($event) {
    _setup.currentView = "files";
  }], "update:selectedFiles": function($event) {
    _setup.selectedFiles = $event;
  }, "update:selected-files": function($event) {
    _setup.selectedFiles = $event;
  } } }) : _setup.filterString ? _c(_setup.NcEmptyContent, { attrs: { "name": _setup.t("No matching files"), "description": _setup.t("No files matching your filter were found.") }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
    return [_c(_setup.IconFile)];
  }, proxy: true }]) }) : _c(_setup.NcEmptyContent, { attrs: { "name": _setup.t("No files in here"), "description": _setup.noFilesDescription }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
    return [_c(_setup.IconFile)];
  }, proxy: true }]) })], 1)]);
};
var _sfc_staticRenderFns = [];
var __component__ = /* @__PURE__ */ normalizeComponent$1(
  _sfc_main,
  _sfc_render,
  _sfc_staticRenderFns,
  false,
  null,
  "552cc2f5"
);
const FilePicker = __component__.exports;
export {
  FilePicker as default
};
//# sourceMappingURL=FilePicker-CsU6FfAP-BJ5Pu3va.chunk.mjs.map
