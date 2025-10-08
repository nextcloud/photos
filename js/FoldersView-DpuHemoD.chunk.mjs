const appName = "photos";
const appVersion = "5.0.0-dev.1";
import "./index-Cokc0amN.chunk.mjs";
import { V as Vue, t as translate, _, g as getCurrentUser, J as defaultRootPath, Q as defaultRemoteURL, d as defineComponent, R as Folder, S as parsePermissions } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
import { U as UploadPicker, g as getUploader } from "./index-DdKmqUaK-5iZCstwH.chunk.mjs";
import { N as NcEmptyContent } from "./NcEmptyContent-EDU4qhab.chunk.mjs";
import { j as legacyToViewerFileInfo, k as cancelableClient, h as allMimes, l as logger, f as NcLoadingIcon } from "./index-BOzawWmL.chunk.mjs";
import { n as normalizeComponent$1, F as FolderOutline } from "./icons-BZLMM6Xn.chunk.mjs";
import { L as Link } from "./video-C5pfp5p8.chunk.mjs";
import { A as AbortControllerMixin } from "./AbortControllerMixin-B_otrjDn.chunk.mjs";
import { H as HeaderNavigation } from "./HeaderNavigation-BKsyJU73.chunk.mjs";
import { f as fetchFile } from "./fileFetcher-UYL2it_6.chunk.mjs";
import "./preload-helper-BO5AHt9u.chunk.mjs";
import "./index-BrMrQMP2.chunk.mjs";
import "./useHotKey-CDShbxMN.chunk.mjs";
import "./NcActionButton-CuVNJJtW-5eBS5Sv2.chunk.mjs";
import "./NcProgressBar-DegJ2JjE-BAVaOw4q.chunk.mjs";
import "./index-DTU2Yy1K.chunk.mjs";
import "./dialog-CIZq3-6b.chunk.mjs";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
/**
  * vue-class-component v7.2.6
  * (c) 2015-present Evan You
  * @license MIT
  */
function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof = function(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof(obj);
}
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++)
      arr2[i] = arr[i];
    return arr2;
  }
}
function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]")
    return Array.from(iter);
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}
function reflectionIsSupported() {
  return typeof Reflect !== "undefined" && Reflect.defineMetadata && Reflect.getOwnMetadataKeys;
}
function copyReflectionMetadata(to, from) {
  forwardMetadata(to, from);
  Object.getOwnPropertyNames(from.prototype).forEach(function(key) {
    forwardMetadata(to.prototype, from.prototype, key);
  });
  Object.getOwnPropertyNames(from).forEach(function(key) {
    forwardMetadata(to, from, key);
  });
}
function forwardMetadata(to, from, propertyKey) {
  var metaKeys = propertyKey ? Reflect.getOwnMetadataKeys(from, propertyKey) : Reflect.getOwnMetadataKeys(from);
  metaKeys.forEach(function(metaKey) {
    var metadata = propertyKey ? Reflect.getOwnMetadata(metaKey, from, propertyKey) : Reflect.getOwnMetadata(metaKey, from);
    if (propertyKey) {
      Reflect.defineMetadata(metaKey, metadata, to, propertyKey);
    } else {
      Reflect.defineMetadata(metaKey, metadata, to);
    }
  });
}
var fakeArray = {
  __proto__: []
};
var hasProto = fakeArray instanceof Array;
function createDecorator(factory) {
  return function(target, key, index) {
    var Ctor = typeof target === "function" ? target : target.constructor;
    if (!Ctor.__decorators__) {
      Ctor.__decorators__ = [];
    }
    if (typeof index !== "number") {
      index = void 0;
    }
    Ctor.__decorators__.push(function(options) {
      return factory(options, key, index);
    });
  };
}
function isPrimitive(value) {
  var type = _typeof(value);
  return value == null || type !== "object" && type !== "function";
}
function collectDataFromConstructor(vm, Component2) {
  var originalInit = Component2.prototype._init;
  Component2.prototype._init = function() {
    var _this = this;
    var keys = Object.getOwnPropertyNames(vm);
    if (vm.$options.props) {
      for (var key in vm.$options.props) {
        if (!vm.hasOwnProperty(key)) {
          keys.push(key);
        }
      }
    }
    keys.forEach(function(key2) {
      Object.defineProperty(_this, key2, {
        get: function get() {
          return vm[key2];
        },
        set: function set(value) {
          vm[key2] = value;
        },
        configurable: true
      });
    });
  };
  var data = new Component2();
  Component2.prototype._init = originalInit;
  var plainData = {};
  Object.keys(data).forEach(function(key) {
    if (data[key] !== void 0) {
      plainData[key] = data[key];
    }
  });
  return plainData;
}
var $internalHooks = [
  "data",
  "beforeCreate",
  "created",
  "beforeMount",
  "mounted",
  "beforeDestroy",
  "destroyed",
  "beforeUpdate",
  "updated",
  "activated",
  "deactivated",
  "render",
  "errorCaptured",
  "serverPrefetch"
];
function componentFactory(Component2) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  options.name = options.name || Component2._componentTag || Component2.name;
  var proto = Component2.prototype;
  Object.getOwnPropertyNames(proto).forEach(function(key) {
    if (key === "constructor") {
      return;
    }
    if ($internalHooks.indexOf(key) > -1) {
      options[key] = proto[key];
      return;
    }
    var descriptor = Object.getOwnPropertyDescriptor(proto, key);
    if (descriptor.value !== void 0) {
      if (typeof descriptor.value === "function") {
        (options.methods || (options.methods = {}))[key] = descriptor.value;
      } else {
        (options.mixins || (options.mixins = [])).push({
          data: function data() {
            return _defineProperty({}, key, descriptor.value);
          }
        });
      }
    } else if (descriptor.get || descriptor.set) {
      (options.computed || (options.computed = {}))[key] = {
        get: descriptor.get,
        set: descriptor.set
      };
    }
  });
  (options.mixins || (options.mixins = [])).push({
    data: function data() {
      return collectDataFromConstructor(this, Component2);
    }
  });
  var decorators = Component2.__decorators__;
  if (decorators) {
    decorators.forEach(function(fn) {
      return fn(options);
    });
    delete Component2.__decorators__;
  }
  var superProto = Object.getPrototypeOf(Component2.prototype);
  var Super = superProto instanceof Vue ? superProto.constructor : Vue;
  var Extended = Super.extend(options);
  forwardStaticMembers(Extended, Component2, Super);
  if (reflectionIsSupported()) {
    copyReflectionMetadata(Extended, Component2);
  }
  return Extended;
}
var shouldIgnore = {
  prototype: true,
  arguments: true,
  callee: true,
  caller: true
};
function forwardStaticMembers(Extended, Original, Super) {
  Object.getOwnPropertyNames(Original).forEach(function(key) {
    if (shouldIgnore[key]) {
      return;
    }
    var extendedDescriptor = Object.getOwnPropertyDescriptor(Extended, key);
    if (extendedDescriptor && !extendedDescriptor.configurable) {
      return;
    }
    var descriptor = Object.getOwnPropertyDescriptor(Original, key);
    if (!hasProto) {
      if (key === "cid") {
        return;
      }
      var superDescriptor = Object.getOwnPropertyDescriptor(Super, key);
      if (!isPrimitive(descriptor.value) && superDescriptor && superDescriptor.value === descriptor.value) {
        return;
      }
    }
    Object.defineProperty(Extended, key, descriptor);
  });
}
function Component(options) {
  if (typeof options === "function") {
    return componentFactory(options);
  }
  return function(Component2) {
    return componentFactory(Component2, options);
  };
}
Component.registerHooks = function registerHooks(keys) {
  $internalHooks.push.apply($internalHooks, _toConsumableArray(keys));
};
function needToProduceProvide(original) {
  return typeof original !== "function" || !original.managed && !original.managedReactive;
}
function produceProvide(original) {
  var provide = function() {
    var _this = this;
    var rv = typeof original === "function" ? original.call(this) : original;
    rv = Object.create(rv || null);
    rv[reactiveInjectKey] = Object.create(this[reactiveInjectKey] || {});
    for (var i in provide.managed) {
      rv[provide.managed[i]] = this[i];
    }
    var _loop_1 = function(i2) {
      rv[provide.managedReactive[i2]] = this_1[i2];
      Object.defineProperty(rv[reactiveInjectKey], provide.managedReactive[i2], {
        enumerable: true,
        configurable: true,
        get: function() {
          return _this[i2];
        }
      });
    };
    var this_1 = this;
    for (var i in provide.managedReactive) {
      _loop_1(i);
    }
    return rv;
  };
  provide.managed = {};
  provide.managedReactive = {};
  return provide;
}
var reactiveInjectKey = "__reactiveInject__";
function inheritInjected(componentOptions) {
  if (!Array.isArray(componentOptions.inject)) {
    componentOptions.inject = componentOptions.inject || {};
    componentOptions.inject[reactiveInjectKey] = {
      from: reactiveInjectKey,
      default: {}
    };
  }
}
var reflectMetadataIsSupported = typeof Reflect !== "undefined" && typeof Reflect.getMetadata !== "undefined";
function applyMetadata(options, target, key) {
  if (reflectMetadataIsSupported) {
    if (!Array.isArray(options) && typeof options !== "function" && !options.hasOwnProperty("type") && typeof options.type === "undefined") {
      var type = Reflect.getMetadata("design:type", target, key);
      if (type !== Object) {
        options.type = type;
      }
    }
  }
}
function Prop(options) {
  if (options === void 0) {
    options = {};
  }
  return function(target, key) {
    applyMetadata(options, target, key);
    createDecorator(function(componentOptions, k) {
      (componentOptions.props || (componentOptions.props = {}))[k] = options;
    })(target, key);
  };
}
function ProvideReactive(key) {
  return createDecorator(function(componentOptions, k) {
    var provide = componentOptions.provide;
    inheritInjected(componentOptions);
    if (needToProduceProvide(provide)) {
      provide = componentOptions.provide = produceProvide(provide);
    }
    provide.managedReactive[k] = k;
  });
}
function Watch(path, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.deep, deep = _a === void 0 ? false : _a, _b = options.immediate, immediate = _b === void 0 ? false : _b;
  return createDecorator(function(componentOptions, handler) {
    if (typeof componentOptions.watch !== "object") {
      componentOptions.watch = /* @__PURE__ */ Object.create(null);
    }
    var watch = componentOptions.watch;
    if (typeof watch[path] === "object" && !Array.isArray(watch[path])) {
      watch[path] = [watch[path]];
    } else if (typeof watch[path] === "undefined") {
      watch[path] = [];
    }
    watch[path].push({ handler, deep, immediate });
  });
}
const getGridGapDefault = (elementWidth, windowHeight) => {
  if (elementWidth > 720 && windowHeight > 480) {
    return 10;
  } else {
    return 5;
  }
};
const getColumnCountDefault = (elementWidth) => {
  return Math.floor(elementWidth / 250);
};
const getWindowMarginDefault = (windowHeight) => {
  return Math.round(windowHeight * 1.5);
};
const getItemRatioHeightDefault = (height, width, columnWidth) => {
  const imageRatio = height / width;
  return Math.round(columnWidth * imageRatio);
};
const debugLog = (condition, ...args) => {
  if (condition) {
    console.debug(...args);
  }
};
var __defProp2 = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp2(target, key, result);
  return result;
};
let VirtualGrid$1 = class extends Vue {
  constructor() {
    super(...arguments);
    this.updateLock = false;
    this.bottomReached = false;
    this.ref = null;
    this.containerData = {
      windowSize: { height: 0, width: 0 },
      windowScroll: { x: 0, y: 0 },
      elementWindowOffset: 0,
      elementSize: { height: 0, width: 0 }
    };
  }
  get loadingBatch() {
    return this.loader && this.updateLock;
  }
  get configData() {
    return this.computeConfigData(this.containerData, this.items);
  }
  get layoutData() {
    return this.computeLayoutData(this.configData);
  }
  get renderData() {
    return this.computeRenderData(this.configData, this.containerData, this.layoutData);
  }
  mounted() {
    var _a;
    this.ref = this.$refs.virtualGrid;
    this.initiliazeGrid();
    window.addEventListener("resize", this.resize);
    ((_a = this.scrollElement) != null ? _a : window).addEventListener("scroll", this.scroll);
  }
  beforeDestroy() {
    var _a;
    window.removeEventListener("resize", this.resize);
    ((_a = this.scrollElement) != null ? _a : window).removeEventListener("scroll", this.scroll);
  }
  onScrollElementChanged(scrollElement, oldScrollElement) {
    (oldScrollElement != null ? oldScrollElement : window).removeEventListener("scroll", this.scroll);
    (scrollElement != null ? scrollElement : window).addEventListener("scroll", this.scroll);
  }
  resize() {
    this.loadMoreData();
  }
  scroll() {
    this.loadMoreData();
  }
  initiliazeGrid() {
    this.computeContainerData();
    this.$nextTick(async () => {
      this.loadMoreData();
    });
  }
  loadMoreData() {
    this.loadMoreDataAsync().catch((error) => {
      if (error) {
        console.error("Fail to load next data batch", error);
      }
    }).then();
  }
  async loadMoreDataAsync() {
    this.computeContainerData();
    const windowTop = this.containerData.windowScroll.y;
    const windowBottom = windowTop + this.containerData.windowSize.height;
    const bottomTrigger = Math.max(0, this.containerData.elementWindowOffset + this.containerData.elementSize.height - this.updateTriggerMargin);
    if (!this.bottomReached && windowBottom >= bottomTrigger && !this.updateLock) {
      this.updateLock = true;
      debugLog(this.debug, "Loading next batch");
      const isLastBatch = await this.updateFunction();
      if (isLastBatch) {
        debugLog(this.debug, "Bottom reached");
        this.bottomReached = true;
      }
      this.updateLock = false;
      await this.loadMoreDataAsync();
    }
    return;
  }
  computeContainerData() {
    if (this.ref === null) {
      return;
    }
    const windowSize = this.getWindowSize();
    const windowScroll = this.getWindowScroll();
    const elementWindowOffset = this.getElementOffset(this.ref);
    const elementSize = this.getElementSize(this.ref);
    this.containerData = { windowSize, windowScroll, elementWindowOffset, elementSize };
  }
  computeConfigData(containerData, items) {
    if (containerData === null || items === null) {
      return {
        windowMargin: 0,
        gridGap: 0,
        columnCount: 1,
        entries: []
      };
    }
    const elementWidth = containerData.elementSize ? containerData.elementSize.width : 0;
    const windowMargin = this.getWindowMargin(containerData.windowSize.height);
    const gridGap = this.getGridGap(elementWidth, containerData.windowSize.height);
    const columnCount = this.getColumnCount(elementWidth);
    const columnWidth = this.getColumnWidth(columnCount, gridGap, elementWidth);
    const entries = items.map((item) => {
      if (!item.width) {
        return item;
      }
      const imageWidth = columnWidth * item.columnSpan + gridGap * (item.columnSpan - 1);
      return __spreadProps(__spreadValues({}, item), {
        height: this.getItemRatioHeight(item.height, item.width, imageWidth),
        width: imageWidth
      });
    });
    return {
      windowMargin,
      gridGap,
      columnCount,
      entries
    };
  }
  computeLayoutData(configData) {
    if (configData === null) {
      return { cells: [], totalHeight: 0 };
    }
    let currentRowNumber = 1;
    let prevRowsTotalHeight = 0;
    let currentRowMaxHeight = 0;
    let columnShift = 0;
    const cells = configData.entries.map((entry, index) => {
      const { columnCount, gridGap } = configData;
      let columnSpanRecompute = entry.columnSpan;
      let heightRecompute = entry.height;
      if (columnSpanRecompute < 1) {
        columnSpanRecompute = columnCount;
      }
      const distanceToRowStart = (index + columnShift) % columnCount;
      if (entry.newRow && distanceToRowStart !== 0) {
        columnShift += columnCount - distanceToRowStart;
      }
      const shiftedIndex = index + columnShift;
      const columnNumber = shiftedIndex % columnCount + 1;
      const rowNumber = Math.floor(shiftedIndex / columnCount) + 1;
      if (columnNumber + columnSpanRecompute > columnCount + 1) {
        const overlapNumber = columnNumber + columnSpanRecompute - columnCount - 1;
        const overlapRatio = overlapNumber / columnSpanRecompute;
        heightRecompute = heightRecompute * (1 - overlapRatio);
        columnSpanRecompute -= overlapNumber;
      }
      if (columnSpanRecompute > 1) {
        columnShift += columnSpanRecompute - 1;
      }
      if (rowNumber !== currentRowNumber) {
        currentRowNumber = rowNumber;
        prevRowsTotalHeight += currentRowMaxHeight + gridGap;
        currentRowMaxHeight = 0;
      }
      const offset = prevRowsTotalHeight;
      const height = Math.round(heightRecompute);
      currentRowMaxHeight = Math.max(currentRowMaxHeight, height);
      return __spreadProps(__spreadValues({}, entry), { columnNumber, rowNumber, offset, height, columnSpan: columnSpanRecompute });
    });
    const totalHeight = prevRowsTotalHeight + currentRowMaxHeight;
    return { cells, totalHeight };
  }
  computeRenderData(configData, containerData, layoutData) {
    if (layoutData === null || configData === null) {
      return { cellsToRender: [], firstRenderedRowNumber: 0, firstRenderedRowOffset: 0 };
    }
    const cellsToRender = [];
    let firstRenderedRowNumber = null;
    let firstRenderedRowOffset = null;
    if (containerData.elementWindowOffset !== null) {
      const elementWindowOffset = containerData.elementWindowOffset;
      for (const cell of layoutData.cells) {
        const cellTop = elementWindowOffset + cell.offset;
        const cellBottom = cellTop + cell.height;
        const windowTop = containerData.windowScroll.y;
        const windowBottom = windowTop + containerData.windowSize.height;
        const renderTop = windowTop - configData.windowMargin;
        const renderBottom = windowBottom + configData.windowMargin;
        if (cellTop > renderBottom) {
          continue;
        }
        if (cellBottom < renderTop) {
          continue;
        }
        if (firstRenderedRowNumber === null) {
          firstRenderedRowNumber = cell.rowNumber;
        }
        if (cell.rowNumber === firstRenderedRowNumber) {
          firstRenderedRowOffset = firstRenderedRowOffset ? Math.min(firstRenderedRowOffset, cell.offset) : cell.offset;
        }
        cellsToRender.push(cell);
      }
    }
    return { cellsToRender, firstRenderedRowNumber, firstRenderedRowOffset };
  }
  getColumnWidth(columnCount, gridGap, elementWidth) {
    if (columnCount === null || gridGap === null || elementWidth === null) {
      return 0;
    }
    const totalGapSpace = (columnCount - 1) * gridGap;
    const columnWidth = Math.round((elementWidth - totalGapSpace) / columnCount);
    return columnWidth;
  }
  getGridRowStart(cell, renderData) {
    if (renderData === null) {
      return void 0;
    }
    const offset = renderData.firstRenderedRowNumber !== null ? renderData.firstRenderedRowNumber - 1 : 0;
    const gridRowStart = cell.rowNumber - offset;
    return `${gridRowStart}`;
  }
  resetGrid() {
    this.bottomReached = false;
    this.loadMoreData();
  }
  isSameElementSize(a, b) {
    return a.width === b.width && a.height === b.height;
  }
  getWindowSize() {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }
  getElementSize(element) {
    const rect = element.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height
    };
  }
  isSameElementScroll(a, b) {
    return a.x === b.x && a.y === b.y;
  }
  getWindowScroll() {
    return {
      x: window.scrollX,
      y: window.scrollY
    };
  }
  getElementOffset(element) {
    return window.scrollY + element.getBoundingClientRect().top;
  }
};
__decorateClass([
  Prop({ required: true })
], VirtualGrid$1.prototype, "items", 2);
__decorateClass([
  Prop({ default: () => () => true })
], VirtualGrid$1.prototype, "updateFunction", 2);
__decorateClass([
  Prop({ default: () => getGridGapDefault })
], VirtualGrid$1.prototype, "getGridGap", 2);
__decorateClass([
  Prop({ default: () => getColumnCountDefault })
], VirtualGrid$1.prototype, "getColumnCount", 2);
__decorateClass([
  Prop({ default: () => getWindowMarginDefault })
], VirtualGrid$1.prototype, "getWindowMargin", 2);
__decorateClass([
  Prop({ default: () => getItemRatioHeightDefault })
], VirtualGrid$1.prototype, "getItemRatioHeight", 2);
__decorateClass([
  Prop({ default: null })
], VirtualGrid$1.prototype, "scrollElement", 2);
__decorateClass([
  Prop({ default: 500 })
], VirtualGrid$1.prototype, "updateTriggerMargin", 2);
__decorateClass([
  Prop({ default: null })
], VirtualGrid$1.prototype, "loader", 2);
__decorateClass([
  Prop({ default: false })
], VirtualGrid$1.prototype, "debug", 2);
__decorateClass([
  ProvideReactive()
], VirtualGrid$1.prototype, "updateLock", 2);
__decorateClass([
  ProvideReactive()
], VirtualGrid$1.prototype, "bottomReached", 2);
__decorateClass([
  ProvideReactive()
], VirtualGrid$1.prototype, "ref", 2);
__decorateClass([
  ProvideReactive()
], VirtualGrid$1.prototype, "containerData", 2);
__decorateClass([
  Watch("scrollElement")
], VirtualGrid$1.prototype, "onScrollElementChanged", 1);
VirtualGrid$1 = __decorateClass([
  Component({
    name: "VirtualGrid"
  })
], VirtualGrid$1);
var render = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { ref: "virtualGrid", style: {
    boxSizing: "border-box",
    height: _vm.layoutData.totalHeight + "px",
    paddingTop: _vm.renderData !== null && _vm.renderData.firstRenderedRowOffset !== null ? _vm.renderData.firstRenderedRowOffset + "px" : "0px"
  } }, [_c("div", { staticClass: "grid", style: {
    "display": "-ms-grid",
    "display": "grid",
    "align-items": "center",
    "grid-template-columns": "repeat(" + _vm.configData.columnCount + ", 1fr)",
    "gap": _vm.configData.gridGap + "px"
  } }, _vm._l(_vm.renderData.cellsToRender, function(item) {
    return _c("div", { key: item.id, staticClass: "grid-item-wrapper", style: {
      "height": item.height + "px",
      "grid-column-start": item.columnNumber,
      "grid-column-end": item.columnNumber + item.columnSpan,
      "grid-row-start": _vm.getGridRowStart(item, _vm.renderData)
    } }, [_c(item.renderComponent, _vm._g({ tag: "component", attrs: { "item": item } }, _vm.$listeners))], 1);
  }), 0), _c(_vm.loadingBatch && _vm.loader, { tag: "component" })], 1);
};
var staticRenderFns = [];
function normalizeComponent(scriptExports, render22, staticRenderFns2, functionalTemplate, injectStyles, scopeId, moduleIdentifier, shadowMode) {
  var options = typeof scriptExports === "function" ? scriptExports.options : scriptExports;
  if (render22) {
    options.render = render22;
    options.staticRenderFns = staticRenderFns2;
    options._compiled = true;
  }
  var hook;
  if (injectStyles) {
    hook = injectStyles;
  }
  if (hook) {
    if (options.functional) {
      options._injectStyles = hook;
      var originalRender = options.render;
      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }
  return {
    exports: scriptExports,
    options
  };
}
const __cssModules = {};
var __component__$4 = /* @__PURE__ */ normalizeComponent(VirtualGrid$1, render, staticRenderFns, false, __vue2_injectStyles);
function __vue2_injectStyles(context) {
  for (let o in __cssModules) {
    this[o] = __cssModules[o];
  }
}
var VirtualGrid = /* @__PURE__ */ function() {
  return __component__$4.exports;
}();
const _sfc_main$3 = {
  name: "FileLegacy",
  inheritAttrs: false,
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loaded: false,
      error: false
    };
  },
  computed: {
    ariaUuid() {
      return `image-${this.item.injected.fileid}`;
    },
    ariaLabel() {
      return translate("photos", 'Open the full size "{name}" image', { name: this.item.injected.basename });
    },
    isImage() {
      return this.item.injected.mime.startsWith("image");
    },
    decodedEtag() {
      return this.item.injected.etag.replace("&quot;", "").replace("&quot;", "");
    },
    src() {
      return _(`/core/preview?fileId=${this.item.injected.fileid}&c=${this.decodedEtag}&x=${250}&y=${250}&forceIcon=0&a=${this.croppedLayout ? "0" : "1"}`);
    },
    croppedLayout() {
      return this.$store.state.userConfig.croppedLayout;
    }
  },
  beforeDestroy() {
    this.$refs.src = "";
  },
  methods: {
    openViewer() {
      window.OCA.Viewer.open({
        fileInfo: legacyToViewerFileInfo(this.item.injected),
        list: this.item.injected.list.map((file) => legacyToViewerFileInfo(file))
      });
    },
    /** When the image is fully loaded by browser we remove the placeholder */
    onLoad() {
      this.loaded = true;
    },
    onError() {
      this.error = true;
    },
    t: translate
  }
};
var _sfc_render$3 = function render2() {
  var _vm = this, _c = _vm._self._c;
  return _c("a", { staticClass: "file", class: {
    "file--cropped": _vm.croppedLayout
  }, attrs: { "href": _vm.item.injected.source, "aria-label": _vm.ariaLabel }, on: { "click": function($event) {
    $event.preventDefault();
    return _vm.openViewer.apply(null, arguments);
  } } }, [_vm.item.injected.mime.includes("video") && _vm.item.injected.hasPreview ? _c("div", { staticClass: "icon-video-white" }) : _vm._e(), _c("transition-group", { staticClass: "transition-group", attrs: { "name": "fade" } }, [!_vm.error ? _c("img", { key: `${_vm.item.injected.basename}-img`, ref: "img", attrs: { "src": _vm.src, "alt": _vm.item.injected.basename, "aria-describedby": _vm.ariaUuid }, on: { "load": _vm.onLoad, "error": _vm.onError } }) : _vm._e(), !_vm.loaded || _vm.error ? _c("svg", { key: `${_vm.item.injected.basename}-svg`, attrs: { "xmlns": "http://www.w3.org/2000/svg", "viewBox": "0 0 32 32", "fill": "url(#placeholder__gradient)" } }, [_vm.isImage ? _c("use", { attrs: { "href": "#placeholder--img" } }) : _c("use", { attrs: { "href": "#placeholder--video" } })]) : _vm._e()]), _c("p", { staticClass: "hidden-visually", attrs: { "id": _vm.ariaUuid } }, [_vm._v(_vm._s(_vm.item.injected.basename))]), _c("div", { staticClass: "cover", attrs: { "role": "none" } })], 1);
};
var _sfc_staticRenderFns$3 = [];
_sfc_render$3._withStripped = true;
var __component__$3 = /* @__PURE__ */ normalizeComponent$1(
  _sfc_main$3,
  _sfc_render$3,
  _sfc_staticRenderFns$3,
  false,
  null,
  "486ff8aa"
);
__component__$3.options.__file = "/Users/effem/workbench/git/personel/photos/src/components/FileLegacy.vue";
const FileLegacy = __component__$3.exports;
const _sfc_main$2 = {
  name: "FolderTagPreview",
  components: {
    FolderOutline,
    RouterLink: Link
  },
  props: {
    name: {
      type: String,
      required: true
    },
    path: {
      type: String,
      default: ""
    },
    fileList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      failed: []
    };
  },
  computed: {
    // folder is empty
    isEmpty() {
      return this.previewList.length === 0;
    },
    ariaLabel() {
      return translate("photos", 'Open the "{name}" folder', { name: this.name });
    },
    /**
     * Previews list without the failed ones
     */
    previewList() {
      return this.fileList.filter((file) => this.failed.indexOf(file.fileid) === -1);
    },
    previewUrl() {
      if (this.previewList.length === 0) {
        return null;
      }
      const { fileid, etag } = this.previewList.at(-1);
      return _(`/core/preview?fileId=${fileid}&c=${etag}&x=${250}&y=${250}&forceIcon=0&a=0`);
    },
    /**
     * We do not want encoded slashes when browsing by folder
     * so we generate a new valid route object based on the
     * current named route, get the final url back, decode it
     * and use it as a direct string.
     * Which vue-router does not encode afterwards!
     */
    toLink() {
      const prefix = `/files/${getCurrentUser()?.uid}`;
      let path = this.path.replace(new RegExp(`^${prefix}`), "");
      const regex = /^\/?(.+)/i;
      path = regex.exec(path)[1];
      return { ...this.$route, params: { path: path.split("/") } };
    }
  },
  methods: {
    onPreviewFail({ fileid }) {
      this.failed.push(fileid);
    },
    t: translate
  }
};
var _sfc_render$2 = function render3() {
  var _vm = this, _c = _vm._self._c;
  return _c("RouterLink", { staticClass: "folder", attrs: { "to": _vm.toLink, "aria-label": _vm.ariaLabel } }, [_vm.previewUrl ? _c("img", { staticClass: "folder__image", attrs: { "src": _vm.previewUrl, "alt": "" }, on: { "error": function($event) {
    return _vm.onPreviewFail(_vm.file);
  } } }) : _c("span", { staticClass: "folder__image folder__image--placeholder" }, [_c("FolderOutline", { staticClass: "folder__icon", attrs: { "size": 96, "fill-color": "var(--color-primary-element)" } })], 1), _c("span", { staticClass: "folder__details" }, [_c("FolderOutline"), _c("span", { staticClass: "folder__title" }, [_vm._v(_vm._s(_vm.name))])], 1)]);
};
var _sfc_staticRenderFns$2 = [];
_sfc_render$2._withStripped = true;
var __component__$2 = /* @__PURE__ */ normalizeComponent$1(
  _sfc_main$2,
  _sfc_render$2,
  _sfc_staticRenderFns$2,
  false,
  null,
  "cd0478b3"
);
__component__$2.options.__file = "/Users/effem/workbench/git/personel/photos/src/components/FolderTagPreview.vue";
const FolderTagPreview = __component__$2.exports;
async function getFolderContent(path = "/", options = {}) {
  const endpoint = _(`/apps/photos/api/v1/${options.shared ? "shared" : "albums"}`);
  const response = await cancelableClient.get(endpoint + path, options);
  const list = response.data.map((data) => ({
    ...data,
    filename: `${defaultRootPath}${data.filename}`,
    source: decodeURI(defaultRemoteURL + `${defaultRootPath}${data.filename}`)
  }));
  let folder;
  const folders = [];
  const files = [];
  for (const entry of list) {
    if (entry.filename === `${defaultRootPath}${path}`) {
      folder = entry;
    } else if (entry.type !== "file") {
      folders.push(entry);
    } else if (allMimes.indexOf(entry.mime) > -1) {
      files.push(entry);
    }
  }
  return { folder, folders, files };
}
const _sfc_main$1 = defineComponent({
  name: "FolderComponent",
  components: {
    FolderTagPreview
  },
  mixins: [AbortControllerMixin],
  inheritAttrs: false,
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      previewFolder: this.item.injected.fileid
    };
  },
  computed: {
    files() {
      return this.$store.state.folders.files;
    },
    subFolders() {
      return this.$store.state.folders.subFolders;
    },
    folders() {
      return this.$store.state.folders.folders;
    },
    // files list of the current folder
    folderContent() {
      return this.folders[this.item.injected.fileid];
    },
    previewFiles() {
      const previewFolderContent = this.folders[this.previewFolder];
      const previewFiles = previewFolderContent ? previewFolderContent.map((id) => this.files[id]).slice(0, 4) : [];
      if (previewFiles.length === 0 && this.subFolders[this.previewFolder] && this.previewFolder === this.item.injected.fileid) {
        const firstChildFolder = this.subFolders[this.previewFolder][0];
        this.updatePreviewFolder(firstChildFolder);
        if (!this.folders[this.previewFolder]) {
          this.getFolderData(this.files[this.previewFolder].filename);
        }
      }
      return previewFiles;
    }
  },
  async created() {
    if (!this.folderContent) {
      await this.getFolderData(this.item.injected.filename);
    }
  },
  methods: {
    async getFolderData(filename) {
      try {
        const prefix = `/files/${getCurrentUser()?.uid}`;
        const unPrefixedFileName = filename.replace(new RegExp(`^${prefix}`), "");
        const { folder, folders, files } = await getFolderContent(unPrefixedFileName, {
          shared: this.item.injected.showShared,
          signal: this.abortController.signal
        });
        this.$store.dispatch("updateFolders", { fileid: folder?.fileid, files, folders });
        this.$store.dispatch("updateFoldersFiles", { folder, files, folders });
      } catch (error) {
        logger.error("Failed to get folder content", { error, filename });
      }
    },
    updatePreviewFolder(path) {
      this.previewFolder = path;
    }
  }
});
var _sfc_render$1 = function render4() {
  var _vm = this, _c = _vm._self._c;
  _vm._self._setupProxy;
  return _c("FolderTagPreview", { attrs: { "id": _vm.item.injected.fileid, "name": _vm.item.injected.basename.toString(), "path": _vm.item.injected.filename, "file-list": _vm.previewFiles } });
};
var _sfc_staticRenderFns$1 = [];
_sfc_render$1._withStripped = true;
var __component__$1 = /* @__PURE__ */ normalizeComponent$1(
  _sfc_main$1,
  _sfc_render$1,
  _sfc_staticRenderFns$1,
  false,
  null,
  "1daf2420"
);
__component__$1.options.__file = "/Users/effem/workbench/git/personel/photos/src/components/FolderComponent.vue";
const FolderComponent = __component__$1.exports;
const sizes = {
  400: {
    marginTop: 66,
    marginW: 8,
    count: 3,
    folderCount: 1
  },
  700: {
    marginTop: 66,
    marginW: 8,
    count: 4,
    folderCount: 1
  },
  1024: {
    marginTop: 66,
    marginW: 44,
    count: 5,
    folderCount: 2
  },
  1280: {
    marginTop: 66,
    marginW: 44,
    count: 4,
    folderCount: 2
  },
  1440: {
    marginTop: 88,
    marginW: 66,
    count: 5,
    folderCount: 3
  },
  1600: {
    marginTop: 88,
    marginW: 66,
    count: 6,
    folderCount: 4
  },
  2048: {
    marginTop: 88,
    marginW: 66,
    count: 7,
    folderCount: 4
  },
  2560: {
    marginTop: 88,
    marginW: 88,
    count: 8,
    folderCount: 6
  },
  3440: {
    marginTop: 88,
    marginW: 88,
    count: 9,
    folderCount: 8
  },
  max: {
    marginTop: 88,
    marginW: 88,
    count: 10,
    folderCount: 10
  }
};
const getGridConfig = new Vue({
  data() {
    return {
      gridConfig: sizes.max
    };
  },
  watch: {
    gridConfig(val) {
      this.$emit("changed", val);
    }
  },
  created() {
    window.addEventListener("resize", this.handleWindowResize);
    this.handleWindowResize();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleWindowResize);
  },
  methods: {
    handleWindowResize() {
      const currentSize = Object.keys(sizes).map((size) => Number.parseInt(size)).find((size) => size > document.documentElement.clientWidth);
      this.gridConfig = sizes[currentSize] || sizes.max;
    }
  }
});
const GridConfigMixin = defineComponent({
  data() {
    return {
      gridConfig: {}
    };
  },
  created() {
    getGridConfig.$on("changed", this.handleGridConfigChange);
    logger.debug("Grid config", { gridConfig: getGridConfig.gridConfig });
    this.gridConfig = getGridConfig.gridConfig;
  },
  beforeDestroy() {
    getGridConfig.$off("changed", this.handleGridConfigChange);
  },
  methods: {
    handleGridConfigChange(val) {
      this.gridConfig = val;
    }
  }
});
const _sfc_main = {
  name: "FoldersView",
  components: {
    FolderOutline,
    HeaderNavigation,
    NcEmptyContent,
    NcLoadingIcon,
    UploadPicker,
    VirtualGrid
  },
  mixins: [
    AbortControllerMixin,
    GridConfigMixin
  ],
  props: {
    rootTitle: {
      type: String,
      required: true
    },
    path: {
      type: String,
      default: "/"
    },
    showShared: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      error: null,
      allowedMimes: allMimes,
      initializing: true,
      loading: false,
      appContent: document.getElementById("app-content-vue"),
      uploader: getUploader()
    };
  },
  computed: {
    files() {
      return this.$store.state.folders.files;
    },
    folders() {
      return this.$store.state.folders.folders;
    },
    // current folder id from current path
    folderId() {
      return this.$store.state.folders.paths[this.path];
    },
    // files list of the current folder
    folder() {
      return this.files[this.folderId];
    },
    folderAsFolder() {
      if (!this.folder) {
        return void 0;
      }
      return new Folder({
        ...this.folder,
        permissions: parsePermissions(this.folder.permissions),
        owner: null
      });
    },
    folderContent() {
      return this.folders[this.folderId] || [];
    },
    fileList() {
      const list = this.folderContent && this.folderContent.map((id) => this.files[id]).filter((file) => !!file);
      return list;
    },
    // subfolders of the current folder
    subFolders() {
      return this.folderId && this.files[this.folderId] && this.$store.state.folders.subFolders[this.folderId];
    },
    folderList() {
      const list = this.subFolders && this.subFolders.map((id) => this.files[id]).filter((file) => !!file);
      return list;
    },
    contentList() {
      const folders = this.folderList && this.folderList.map((folder) => {
        return {
          id: `folder-${folder.fileid}`,
          injected: {
            ...folder,
            showShared: this.showShared
          },
          width: 232,
          height: 280,
          columnSpan: 1,
          renderComponent: FolderComponent
        };
      });
      const files = this.fileList?.map((file) => {
        return {
          id: `file-${file.fileid}`,
          injected: {
            ...file,
            list: this.fileList
          },
          width: 256,
          height: 256,
          columnSpan: 1,
          renderComponent: FileLegacy
        };
      });
      return [...folders || [], ...files || []];
    },
    // is current folder empty?
    isEmpty() {
      return !this.haveFiles && !this.haveFolders;
    },
    haveFiles() {
      return !!this.fileList && this.fileList.length !== 0;
    },
    haveFolders() {
      return !!this.folderList && this.folderList.length !== 0;
    }
  },
  watch: {
    path() {
      this.fetchFolderContent();
    },
    showShared() {
      this.fetchFolderContent();
    }
  },
  beforeMount() {
    this.fetchFolderContent();
  },
  methods: {
    onRefresh() {
      this.fetchFolderContent();
    },
    async fetchFolderContent() {
      this.error = null;
      this.loading = true;
      window.OCA?.Viewer?.close?.();
      window.OCA?.Files?.Sidebar?.close?.();
      if (!this.files[this.folderId] || !this.folders[this.folderId]) {
        this.initializing = true;
      }
      try {
        const { folder, folders, files } = await getFolderContent(this.path, {
          shared: this.showShared,
          signal: this.abortController.signal
        });
        this.$store.dispatch("addPath", { path: this.path, fileid: folder?.fileid });
        this.$store.dispatch("updateFolders", { fileid: folder?.fileid, files, folders });
        this.$store.dispatch("updateFoldersFiles", { folder, files, folders });
      } catch (error) {
        if (error?.response && error.response.status) {
          if (error.response.status === 404) {
            this.error = 404;
            setTimeout(() => {
              this.$router.push({ name: this.$route.name ?? void 0 });
            }, 3e3);
          } else {
            this.error = error;
          }
        }
        logger.error("Error fetching album data", { error });
      } finally {
        this.loading = false;
        this.initializing = false;
      }
    },
    /**
     * Fetch file Info and add them into the store
     *
     * @param upload
     */
    async onUpload(upload) {
      const relPath = upload.source.split(defaultRootPath).pop();
      const node = await fetchFile(defaultRootPath + relPath);
      if (node === null) {
        logger.error("Failed to fetch file", { relPath });
        return;
      }
      const file = {
        fileid: node.fileid,
        basename: node.basename,
        etag: node.attributes.etag,
        filename: node.root + node.path,
        source: node.source,
        lastmod: node.mtime?.getTime(),
        mime: node.mime,
        size: node.size,
        type: "file",
        permissions: "",
        // HACK: we don't need it but the format is not the expected one
        hasPreview: node.attributes.hasPreview
      };
      this.$store.dispatch("appendFoldersFiles", [file]);
      this.$store.dispatch("addFilesToFolder", { fileid: this.folderId, files: [file] });
    },
    t: translate
  }
};
var _sfc_render = function render5() {
  var _vm = this, _c = _vm._self._c;
  return _vm.error === 404 ? _c("NcEmptyContent", { attrs: { "name": _vm.t("photos", "This folder does not exist") }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
    return [_c("FolderOutline")];
  }, proxy: true }], null, false, 610611029) }) : _vm.error ? _c("NcEmptyContent", { attrs: { "name": _vm.t("photos", "An error occurred") } }) : _vm.initializing ? _c("NcEmptyContent", { attrs: { "name": _vm.t("photos", "Loading folders …") }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
    return [_c("NcLoadingIcon")];
  }, proxy: true }]) }) : !_vm.initializing ? _c("div", [_c("HeaderNavigation", { key: "navigation", class: { "photos-navigation--uploading": _vm.uploader.queue?.length > 0 }, attrs: { "loading": _vm.loading, "path": _vm.path, "title": _vm.folder?.basename?.toString?.() || _vm.rootTitle, "root-title": _vm.rootTitle }, on: { "refresh": _vm.onRefresh } }, [_c("UploadPicker", { attrs: { "accept": _vm.allowedMimes, "destination": _vm.folderAsFolder, "multiple": true }, on: { "uploaded": _vm.onUpload } })], 1), _vm.isEmpty ? _c("NcEmptyContent", { key: "emptycontent", attrs: { "name": _vm.t("photos", "No photos in here") }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
    return [_c("FolderOutline")];
  }, proxy: true }], null, false, 610611029) }) : _c("div", { staticClass: "grid-container", class: {
    "grid-container--folders": _vm.haveFolders
  } }, [_c("VirtualGrid", { ref: "virtualgrid", attrs: { "items": _vm.contentList, "scroll-element": _vm.appContent, "get-column-count": () => _vm.haveFolders ? _vm.gridConfig.folderCount : _vm.gridConfig.count, "get-grid-gap": () => _vm.haveFolders ? 16 : 8 } })], 1)], 1) : _vm._e();
};
var _sfc_staticRenderFns = [];
_sfc_render._withStripped = true;
var __component__ = /* @__PURE__ */ normalizeComponent$1(
  _sfc_main,
  _sfc_render,
  _sfc_staticRenderFns,
  false,
  null,
  "3c72304c"
);
__component__.options.__file = "/Users/effem/workbench/git/personel/photos/src/views/FoldersView.vue";
const FoldersView = __component__.exports;
export {
  FoldersView as default
};
//# sourceMappingURL=FoldersView-DpuHemoD.chunk.mjs.map
