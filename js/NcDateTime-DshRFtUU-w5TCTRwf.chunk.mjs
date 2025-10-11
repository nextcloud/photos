const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { q as computed, b as ref$1, k as unref, ae as getCanonicalLocale, y as getLanguage, w as watch, o as onMounted, z as onUnmounted } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
import { r as register, aH as t2, a as t, n as normalizeComponent } from "./index-BOzawWmL.chunk.mjs";
register(t2);
const FEW_SECONDS_AGO = {
  long: t("a few seconds ago"),
  short: t("seconds ago"),
  // FOR TRANSLATORS: Shorter version of 'a few seconds ago'
  narrow: t("sec. ago")
  // FOR TRANSLATORS: If possible in your language an even shorter version of 'a few seconds ago'
};
function useFormatDateTime(timestamp = Date.now(), opts = {}) {
  const currentTime = ref$1(Date.now());
  let intervalId;
  const options = ref$1({
    format: {
      timeStyle: "medium",
      dateStyle: "short"
    },
    relativeTime: "long",
    ignoreSeconds: false,
    ...unref(opts)
  });
  const wrappedOptions = computed(() => ({ ...unref(opts), ...options.value }));
  const date = computed(() => new Date(unref(timestamp)));
  const formattedFullTime = computed(() => {
    const formatter = new Intl.DateTimeFormat(getCanonicalLocale(), wrappedOptions.value.format);
    return formatter.format(date.value);
  });
  const formattedTime = computed(() => {
    if (wrappedOptions.value.relativeTime !== false) {
      const formatter = new Intl.RelativeTimeFormat(getLanguage(), { numeric: "auto", style: wrappedOptions.value.relativeTime });
      const diff = date.value.getTime() - currentTime.value;
      const seconds = diff / 1e3;
      if (Math.abs(seconds) < 59.5) {
        if (wrappedOptions.value.ignoreSeconds) {
          return FEW_SECONDS_AGO[wrappedOptions.value.relativeTime];
        } else {
          return formatter.format(Math.round(seconds), "second");
        }
      }
      const minutes = seconds / 60;
      if (Math.abs(minutes) <= 59) {
        return formatter.format(Math.round(minutes), "minute");
      }
      const hours = minutes / 60;
      if (Math.abs(hours) < 23.5) {
        return formatter.format(Math.round(hours), "hour");
      }
      const days = hours / 24;
      if (Math.abs(days) < 6.5) {
        return formatter.format(Math.round(days), "day");
      }
      if (Math.abs(days) < 27.5) {
        const weeks = days / 7;
        return formatter.format(Math.round(weeks), "week");
      }
      const months = days / 30;
      if (Math.abs(months) < 11.5) {
        return formatter.format(Math.round(months), "month");
      }
      return formatter.format(Math.round(days / 365), "year");
    }
    return formattedFullTime.value;
  });
  watch([wrappedOptions], () => {
    window.clearInterval(intervalId);
    intervalId = void 0;
    if (wrappedOptions.value.relativeTime) {
      intervalId = window.setInterval(() => {
        currentTime.value = Date.now();
      }, 1e3);
    }
  });
  onMounted(() => {
    if (wrappedOptions.value.relativeTime !== false) {
      intervalId = window.setInterval(() => {
        currentTime.value = Date.now();
      }, 1e3);
    }
  });
  onUnmounted(() => {
    window.clearInterval(intervalId);
  });
  return {
    formattedTime,
    formattedFullTime,
    options
  };
}
const _sfc_main = {
  name: "NcDateTime",
  props: {
    /**
     * The timestamp to display, either an unix timestamp (in milliseconds) or a Date object
     */
    timestamp: {
      type: [Date, Number],
      required: true
    },
    /**
     * The format used for displaying, or if relative time is used the format used for the title (optional)
     *
     * @type {Intl.DateTimeFormatOptions}
     */
    format: {
      type: Object,
      default: () => ({ timeStyle: "medium", dateStyle: "short" })
    },
    /**
     * Wether to display the timestamp as time from now (optional)
     *
     * - `false`: Disable relative time
     * - `'long'`: Long text, like *2 seconds ago* (default)
     * - `'short'`: Short text, like *2 sec. ago*
     * - `'narrow'`: Even shorter text (same as `'short'` on some languages)
     */
    relativeTime: {
      type: [Boolean, String],
      default: "long",
      validator: (v) => v === false || ["long", "short", "narrow"].includes(v)
    },
    /**
     * Ignore seconds when displaying the relative time and just show `a few seconds ago`
     */
    ignoreSeconds: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const timestamp = computed(() => props.timestamp);
    const { formattedTime, formattedFullTime } = useFormatDateTime(timestamp, props);
    return {
      formattedTime,
      formattedFullTime
    };
  }
};
var _sfc_render = function render() {
  var _vm = this, _c = _vm._self._c;
  return _c("span", { staticClass: "nc-datetime", attrs: { "data-timestamp": _vm.timestamp, "title": _vm.formattedFullTime }, domProps: { "textContent": _vm._s(_vm.formattedTime) } });
};
var _sfc_staticRenderFns = [];
var __component__ = /* @__PURE__ */ normalizeComponent(
  _sfc_main,
  _sfc_render,
  _sfc_staticRenderFns,
  false,
  null,
  null
);
const NcDateTime = __component__.exports;
export {
  NcDateTime as N
};
//# sourceMappingURL=NcDateTime-DshRFtUU-w5TCTRwf.chunk.mjs.map
