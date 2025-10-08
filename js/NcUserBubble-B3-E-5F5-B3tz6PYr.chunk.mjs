const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { n as normalizeComponent, ao as NcPopover } from "./index-BOzawWmL.chunk.mjs";
import { a as NcAvatar } from "./NcAvatar-YSp2ORHc-CfTsACiM.chunk.mjs";
import { V as Vue } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
import { L as Link } from "./video-C5pfp5p8.chunk.mjs";
const _sfc_main$1 = {
  name: "NcUserBubbleDiv"
};
var _sfc_render$1 = function render() {
  var _vm = this, _c = _vm._self._c;
  return _c("div", [_vm._t("trigger")], 2);
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
const NcUserBubbleDiv = __component__$1.exports;
const _sfc_main = {
  name: "NcUserBubble",
  components: {
    NcAvatar,
    NcPopover,
    NcUserBubbleDiv
  },
  props: {
    /**
     * Override generated avatar, can be an url or an icon class
     */
    avatarImage: {
      type: String,
      default: void 0
    },
    /**
     * Provide the user id if this is a user
     */
    user: {
      type: String,
      default: void 0
    },
    /**
     * Displayed label
     */
    displayName: {
      type: String,
      default: void 0
    },
    /**
     * Whether or not to display the user-status
     */
    showUserStatus: {
      type: Boolean,
      default: false
    },
    /**
     * Define the whole bubble as a link
     */
    url: {
      type: String,
      default: void 0,
      validator: (url) => {
        try {
          url = new URL(url, url?.startsWith?.("/") ? window.location.href : void 0);
          return true;
        } catch (error) {
          return false;
        }
      }
    },
    /**
     * Use bubble as a router-link for in-app navigation
     */
    to: {
      type: [String, Object],
      default: void 0
    },
    /**
     * Default popover state. Requires the UserBubble
     * to have some content to render inside the popover
     */
    open: {
      type: Boolean,
      default: false
    },
    /**
     * Use the primary colour
     */
    primary: {
      type: Boolean,
      default: false
    },
    /**
     * This is the height of the component
     */
    size: {
      type: Number,
      default: 20
    },
    /**
     * This is the margin of the avatar (size - margin = avatar size)
     */
    margin: {
      type: Number,
      default: 2
    }
  },
  emits: [
    "click",
    "update:open"
  ],
  computed: {
    /**
     * If userbubble is empty, let's NOT
     * use the Popover component
     * We need a component instead of a simple div here,
     * because otherwise the trigger template will not be shown.
     *
     * @return {string} 'Popover' or 'UserBubbleDiv'
     */
    isPopoverComponent() {
      return !this.popoverEmpty ? "NcPopover" : "NcUserBubbleDiv";
    },
    /**
     * Is the provided avatar url valid or not
     *
     * @return {boolean}
     */
    isAvatarUrl() {
      if (!this.avatarImage) {
        return false;
      }
      try {
        const url = new URL(this.avatarImage);
        return !!url;
      } catch (error) {
        return false;
      }
    },
    /**
     * Do we have a custom avatar or not
     *
     * @return {boolean}
     */
    isCustomAvatar() {
      return !!this.avatarImage;
    },
    hasUrl() {
      return this.url && this.url.trim() !== "";
    },
    isLinkComponent() {
      if (this.hasUrl) {
        return "a";
      } else if (this.to) {
        return Link;
      } else {
        return "div";
      }
    },
    popoverEmpty() {
      if ("default" in this.$slots) {
        return false;
      }
      return true;
    },
    styles() {
      return {
        content: {
          height: this.size + "px",
          lineHeight: this.size + "px",
          borderRadius: this.size / 2 + "px"
        },
        avatar: {
          marginInlineStart: this.margin + "px"
        }
      };
    }
  },
  mounted() {
    if (!this.displayName && !this.user) {
      Vue.util.warn("[NcUserBubble] At least `displayName` or `user` property should be set.");
    }
  },
  methods: {
    onOpenChange(state) {
      this.$emit("update:open", state);
    },
    /**
     * Catch and forward click event to parent
     *
     * @param {Event} event the click event
     */
    onClick(event) {
      this.$emit("click", event);
    }
  }
};
var _sfc_render = function render2() {
  var _vm = this, _c = _vm._self._c;
  return _c(_vm.isPopoverComponent, { tag: "component", staticClass: "user-bubble__wrapper", attrs: { "trigger": "hover focus", "shown": _vm.open }, on: { "update:open": _vm.onOpenChange }, scopedSlots: _vm._u([{ key: "trigger", fn: function({ attrs }) {
    return [_c(_vm.isLinkComponent, _vm._b({ tag: "component", staticClass: "user-bubble__content", class: { "user-bubble__content--primary": _vm.primary }, style: _vm.styles.content, attrs: { "to": _vm.to, "href": _vm.hasUrl ? _vm.url : null }, on: { "click": _vm.onClick } }, "component", attrs, false), [_c("NcAvatar", { staticClass: "user-bubble__avatar", style: _vm.styles.avatar, attrs: { "url": _vm.isCustomAvatar && _vm.isAvatarUrl ? _vm.avatarImage : void 0, "icon-class": _vm.isCustomAvatar && !_vm.isAvatarUrl ? _vm.avatarImage : void 0, "user": _vm.user, "display-name": _vm.displayName, "size": _vm.size - _vm.margin * 2, "disable-tooltip": true, "disable-menu": true, "show-user-status": _vm.showUserStatus } }), _c("span", { staticClass: "user-bubble__name" }, [_vm._v(" " + _vm._s(_vm.displayName || _vm.user) + " ")]), _vm.$slots.name ? _c("span", { staticClass: "user-bubble__secondary" }, [_vm._t("name")], 2) : _vm._e()], 1)];
  } }], null, true) }, [_vm._t("default")], 2);
};
var _sfc_staticRenderFns = [];
var __component__ = /* @__PURE__ */ normalizeComponent(
  _sfc_main,
  _sfc_render,
  _sfc_staticRenderFns,
  false,
  null,
  "a62a9496"
);
const NcUserBubble = __component__.exports;
export {
  NcUserBubble as N
};
//# sourceMappingURL=NcUserBubble-B3-E-5F5-B3tz6PYr.chunk.mjs.map
