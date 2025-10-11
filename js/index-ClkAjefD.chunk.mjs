const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { I as getDefaultExportFromCjs } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
var debounce$1 = { exports: {} };
var hasRequiredDebounce;
function requireDebounce() {
  if (hasRequiredDebounce) return debounce$1.exports;
  hasRequiredDebounce = 1;
  function debounce2(function_, wait = 100, options = {}) {
    if (typeof function_ !== "function") {
      throw new TypeError(`Expected the first parameter to be a function, got \`${typeof function_}\`.`);
    }
    if (wait < 0) {
      throw new RangeError("`wait` must not be negative.");
    }
    const { immediate } = typeof options === "boolean" ? { immediate: options } : options;
    let storedContext;
    let storedArguments;
    let timeoutId;
    let timestamp;
    let result;
    function run() {
      const callContext = storedContext;
      const callArguments = storedArguments;
      storedContext = void 0;
      storedArguments = void 0;
      result = function_.apply(callContext, callArguments);
      return result;
    }
    function later() {
      const last = Date.now() - timestamp;
      if (last < wait && last >= 0) {
        timeoutId = setTimeout(later, wait - last);
      } else {
        timeoutId = void 0;
        if (!immediate) {
          result = run();
        }
      }
    }
    const debounced = function(...arguments_) {
      if (storedContext && this !== storedContext && Object.getPrototypeOf(this) === Object.getPrototypeOf(storedContext)) {
        throw new Error("Debounced method called with different contexts of the same prototype.");
      }
      storedContext = this;
      storedArguments = arguments_;
      timestamp = Date.now();
      const callNow = immediate && !timeoutId;
      if (!timeoutId) {
        timeoutId = setTimeout(later, wait);
      }
      if (callNow) {
        result = run();
      }
      return result;
    };
    Object.defineProperty(debounced, "isPending", {
      get() {
        return timeoutId !== void 0;
      }
    });
    debounced.clear = () => {
      if (!timeoutId) {
        return;
      }
      clearTimeout(timeoutId);
      timeoutId = void 0;
    };
    debounced.flush = () => {
      if (!timeoutId) {
        return;
      }
      debounced.trigger();
    };
    debounced.trigger = () => {
      result = run();
      debounced.clear();
    };
    return debounced;
  }
  debounce$1.exports.debounce = debounce2;
  debounce$1.exports = debounce2;
  return debounce$1.exports;
}
var debounceExports = /* @__PURE__ */ requireDebounce();
const debounce = /* @__PURE__ */ getDefaultExportFromCjs(debounceExports);
export {
  debounce as d
};
//# sourceMappingURL=index-ClkAjefD.chunk.mjs.map
