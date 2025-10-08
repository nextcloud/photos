const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { ae as onKeyStroke } from "./index-BOzawWmL.chunk.mjs";
const disableKeyboardShortcuts = window.OCP?.Accessibility?.disableKeyboardShortcuts?.();
const isMac = /mac|ipad|iphone|darwin/i.test(navigator.userAgent);
function shouldIgnoreEvent(event) {
  if (!(event.target instanceof HTMLElement) || event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement || event.target.isContentEditable) {
    return true;
  }
  return document.getElementsByClassName("modal-mask").length !== 0;
}
function eventHandler(callback, options) {
  return (event) => {
    const ctrlKeyPressed = isMac ? event.metaKey : event.ctrlKey;
    if (ctrlKeyPressed !== Boolean(options.ctrl)) {
      return;
    } else if (event.altKey !== Boolean(options.alt)) {
      return;
    } else if (options.shift !== void 0 && event.shiftKey !== Boolean(options.shift)) {
      return;
    } else if (shouldIgnoreEvent(event)) {
      return;
    }
    if (options.prevent) {
      event.preventDefault();
    }
    if (options.stop) {
      event.stopPropagation();
    }
    callback(event);
  };
}
function useHotKey(keysOrFilter, callback = () => {
}, options = {}) {
  if (disableKeyboardShortcuts) {
    return () => {
    };
  }
  const validateKeyEvent = (event, key) => {
    if (options.caseSensitive) {
      return event.key === key;
    }
    return event.key.toLowerCase() === key.toLowerCase();
  };
  const keyFilter = (event) => {
    if (typeof keysOrFilter === "function") {
      return keysOrFilter(event);
    } else if (typeof keysOrFilter === "string") {
      return validateKeyEvent(event, keysOrFilter);
    } else if (Array.isArray(keysOrFilter)) {
      return keysOrFilter.some((key) => validateKeyEvent(event, key));
    } else {
      return true;
    }
  };
  const stopKeyDown = onKeyStroke(keyFilter, eventHandler(callback, options), {
    eventName: "keydown",
    dedupe: true,
    passive: !options.prevent
  });
  const stopKeyUp = options.push ? onKeyStroke(keyFilter, eventHandler(callback, options), {
    eventName: "keyup",
    passive: !options.prevent
  }) : () => {
  };
  return () => {
    stopKeyDown();
    stopKeyUp();
  };
}
export {
  useHotKey as u
};
//# sourceMappingURL=useHotKey-CDShbxMN.chunk.mjs.map
