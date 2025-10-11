const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { ae as getCanonicalLocale } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
import { n as normalizeComponent } from "./index-BOzawWmL.chunk.mjs";
const _sfc_main = {
  name: "NcCounterBubble",
  props: {
    type: {
      type: String,
      default: "",
      validator(value) {
        return ["highlighted", "outlined", ""].includes(value);
      }
    },
    /**
     * Specifies whether the component is used within a component that is
     * active and therefore has a primary background. Inverts the color of
     * this component when that is the case.
     */
    active: {
      type: Boolean,
      default: false
    },
    /**
     * The count to display in the counter bubble.
     * Alternatively, you can pass any value to the default slot.
     */
    count: {
      type: Number,
      required: false,
      default: void 0
    },
    /**
     * Disables humanization to display count or content as it is
     */
    raw: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    counterClassObject() {
      return {
        "counter-bubble__counter--highlighted": this.type === "highlighted",
        "counter-bubble__counter--outlined": this.type === "outlined",
        active: this.active
      };
    },
    humanizedCount() {
      return this.humanizeCount(this.count);
    }
  },
  methods: {
    humanizeCount(count) {
      if (this.raw) {
        return count.toString();
      }
      const formatter = new Intl.NumberFormat(getCanonicalLocale(), {
        notation: "compact",
        compactDisplay: "short"
      });
      return formatter.format(count);
    },
    /**
     * Get the humanized count from `count` prop
     * @return {{ humanized: string, original: string} | undefined}
     */
    getHumanizedCount() {
      if (this.count !== void 0) {
        return {
          humanized: this.humanizedCount,
          original: this.count.toString()
        };
      }
      if (this.raw) {
        return void 0;
      }
      if (this.$slots.default?.length === 1) {
        const slotContent = this.$slots.default[0].text?.trim();
        if (slotContent && /^\d+$/.test(slotContent)) {
          const count = parseInt(slotContent, 10);
          return {
            humanized: this.humanizeCount(count),
            original: slotContent
          };
        }
      }
    }
  },
  render(h) {
    const count = this.getHumanizedCount();
    return h("div", {
      staticClass: "counter-bubble__counter",
      class: this.counterClassObject,
      attrs: {
        // Show original count in title if humanized
        title: count && count.original !== count.humanized ? count.original : void 0
      }
    }, [count?.humanized ?? this.$slots.default]);
  }
};
const _sfc_render = null;
const _sfc_staticRenderFns = null;
var __component__ = /* @__PURE__ */ normalizeComponent(
  _sfc_main,
  _sfc_render,
  _sfc_staticRenderFns,
  false,
  null,
  "f1abaa29"
);
const NcCounterBubble = __component__.exports;
export {
  NcCounterBubble as N
};
//# sourceMappingURL=NcListItem-DfaWGP5A-M_EBAoWK.chunk.mjs.map
