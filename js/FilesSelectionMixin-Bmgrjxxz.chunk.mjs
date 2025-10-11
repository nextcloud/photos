const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { u as unsubscribe, s as subscribe, d as defineComponent } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
import { N as NcEmptyContent } from "./NcEmptyContent-EDU4qhab.chunk.mjs";
import { l as logger, f as NcLoadingIcon } from "./index-BOzawWmL.chunk.mjs";
import { n as normalizeComponent, Y as PackageVariant } from "./icons-BZLMM6Xn.chunk.mjs";
import { f as fetchFile } from "./fileFetcher-UYL2it_6.chunk.mjs";
const _sfc_main$3 = {};
var _sfc_render$3 = function render(_c, _vm) {
  return _c("ul", _vm._l(_vm.props.rows, function(row) {
    return _c("div", { key: row.key, staticClass: "tiled-row", style: { height: `${row.height}px` } }, _vm._l(row.items, function(item) {
      return _c("li", { key: item.id, style: { width: item.ratio ? `${row.height * item.ratio}px` : "100%", height: `${row.height}px` } }, [_vm._t("default", null, { "row": row, "item": item })], 2);
    }), 0);
  }), 0);
};
var _sfc_staticRenderFns$3 = [];
_sfc_render$3._withStripped = true;
var __component__$3 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$3,
  _sfc_render$3,
  _sfc_staticRenderFns$3,
  true,
  null,
  "776f249f"
);
__component__$3.options.__file = "/Users/effem/workbench/git/personel/photos/src/components/TiledLayout/TiledRows.vue";
const TiledRows = __component__$3.exports;
function splitItemsInRows(items, containerWidth, baseHeight = 200) {
  if (containerWidth === 0) {
    return [];
  }
  const rows = [];
  let rowNumber = 0;
  let currentItem = 0;
  while (currentItem < items.length) {
    const rowItems = [];
    do {
      rowItems.push(items[currentItem++]);
    } while (currentItem < items.length && computeRowWidth([...rowItems, items[currentItem]], baseHeight) <= containerWidth);
    const rowHeight = computeRowHeight(
      rowItems,
      containerWidth,
      items.length === currentItem,
      baseHeight
    );
    rows[rowNumber] = {
      items: rowItems.map((item) => ({ ...item, width: rowHeight * item.ratio, height: rowHeight })),
      // Key to help vue to keep track of the row in VirtualScrolling.
      height: rowHeight,
      key: rowItems.map((item) => item.id).join("-")
    };
    rowNumber += 1;
  }
  return rows;
}
function computeRowWidth(items, baseHeight) {
  return items.map((item) => baseHeight * item.ratio).reduce((sum, itemWidth) => sum + itemWidth);
}
function computeRowHeight(items, containerWidth, isLastRow, baseHeight) {
  const sumOfItemsRatio = items.map((item) => item.ratio).reduce((sum, itemRatio) => sum + itemRatio);
  let rowHeight = containerWidth / sumOfItemsRatio;
  if (items.length === 1 && items[0].width > containerWidth) {
    rowHeight = containerWidth / items[0].ratio;
  }
  if (isLastRow) {
    rowHeight = Math.min(baseHeight + 20, rowHeight);
  }
  return rowHeight;
}
const _sfc_main$2 = {
  name: "TiledLayout",
  components: {
    TiledRows
  },
  props: {
    sections: {
      type: Array,
      required: true
    },
    baseHeight: {
      type: Number,
      default: 200
    }
  },
  data() {
    return {
      containerWidth: 0,
      resizeObserver: null
    };
  },
  computed: {
    tiledSections() {
      logger.debug("[TiledLayout] Computing rows", { items: this.sections });
      return this.sections.map((section) => {
        const rows = splitItemsInRows(section.items, this.containerWidth, this.baseHeight);
        return {
          ...section,
          key: section.id,
          rows: rows.map((row) => ({ ...row, sectionKey: section.id })),
          height: rows.reduce((totalHeight, row) => totalHeight + row.height, 0)
        };
      });
    }
  },
  mounted() {
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cr = entry.contentRect;
        if (entry.target.classList.contains("tiled-container")) {
          this.containerWidth = cr.width;
        }
      }
    });
    this.resizeObserver.observe(this.$refs.tiledLayoutContainer);
  },
  beforeDestroy() {
    this.resizeObserver?.disconnect();
  }
};
var _sfc_render$2 = function render2() {
  var _vm = this, _c = _vm._self._c;
  return _c("div", { ref: "tiledLayoutContainer", staticClass: "tiled-container" }, [_vm._t("default", function() {
    return [_c("TiledRows", { attrs: { "rows": _vm.tiledSections } })];
  }, { "tiledSections": _vm.tiledSections })], 2);
};
var _sfc_staticRenderFns$2 = [];
_sfc_render$2._withStripped = true;
var __component__$2 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$2,
  _sfc_render$2,
  _sfc_staticRenderFns$2,
  false,
  null,
  "a50355a5"
);
__component__$2.options.__file = "/Users/effem/workbench/git/personel/photos/src/components/TiledLayout/TiledLayout.vue";
const TiledLayout = __component__$2.exports;
const _sfc_main$1 = {
  name: "VirtualScrolling",
  props: {
    sections: {
      type: Array,
      required: true
    },
    containerElement: {
      type: HTMLElement,
      default: null
    },
    useWindow: {
      type: Boolean,
      default: false
    },
    headerHeight: {
      type: Number,
      default: 75
    },
    renderDistance: {
      type: Number,
      default: 0.5
    },
    bottomBufferRatio: {
      type: Number,
      default: 2
    },
    scrollToKey: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      scrollPosition: 0,
      containerHeight: 0,
      rowsContainerHeight: 0,
      resizeObserver: null
    };
  },
  computed: {
    visibleSections() {
      logger.debug("[VirtualScrolling] Computing visible section", { sections: this.sections });
      const containerHeight = this.containerHeight;
      const containerTop = this.scrollPosition;
      const containerBottom = containerTop + containerHeight;
      let currentRowTop = 0;
      let currentRowBottom = 0;
      const visibleSections = this.sections.map((section) => {
        currentRowBottom += this.headerHeight;
        return {
          ...section,
          rows: section.rows.reduce((visibleRows, row) => {
            currentRowTop = currentRowBottom;
            currentRowBottom += row.height;
            let distance = 0;
            if (currentRowBottom < containerTop) {
              distance = (containerTop - currentRowBottom) / containerHeight;
            } else if (currentRowTop > containerBottom) {
              distance = (currentRowTop - containerBottom) / containerHeight;
            }
            if (distance > this.renderDistance) {
              return visibleRows;
            }
            return [
              ...visibleRows,
              {
                ...row,
                distance
              }
            ];
          }, [])
        };
      }).filter((section) => section.rows.length > 0);
      const visibleItems = visibleSections.flatMap(({ rows }) => rows).flatMap(({ items }) => items);
      visibleItems.forEach((item) => item.key = this.rowIdToKeyMap[item.id]);
      const usedTokens = visibleItems.map(({ key }) => key).filter((key) => key !== void 0);
      const unusedTokens = Object.values(this.rowIdToKeyMap).filter((key) => !usedTokens.includes(key));
      visibleItems.filter(({ key }) => key === void 0).forEach((item) => item.key = unusedTokens.pop() ?? Math.random().toString(36).substr(2));
      this.rowIdToKeyMap = visibleItems.reduce((finalMapping, { id, key }) => ({ ...finalMapping, [`${id}`]: key }), {});
      return visibleSections;
    },
    /**
     * Total height of all the rows + some room for the loader.
     */
    totalHeight() {
      const loaderHeight = 200;
      return this.sections.map((section) => this.headerHeight + section.height).reduce((totalHeight, sectionHeight) => totalHeight + sectionHeight, 0) + loaderHeight;
    },
    paddingTop() {
      if (this.visibleSections.length === 0) {
        return 0;
      }
      let paddingTop = 0;
      for (const section of this.sections) {
        if (section.key !== this.visibleSections[0].rows[0].sectionKey) {
          paddingTop += this.headerHeight + section.height;
          continue;
        }
        for (const row of section.rows) {
          if (row.key === this.visibleSections[0].rows[0].key) {
            return paddingTop;
          }
          paddingTop += row.height;
        }
        paddingTop += this.headerHeight;
      }
      return paddingTop;
    },
    /**
     * padding-top is used to replace not included item in the container.
     */
    rowsContainerStyle() {
      return {
        height: `${this.totalHeight}px`,
        paddingTop: `${this.paddingTop}px`
      };
    },
    /**
     * Whether the user is near the bottom.
     * If true, then the need-content event will be emitted.
     */
    isNearBottom() {
      const buffer = this.containerHeight * this.bottomBufferRatio;
      return this.scrollPosition + this.containerHeight >= this.totalHeight - buffer;
    },
    container() {
      logger.debug("[VirtualScrolling] Computing container");
      if (this.containerElement !== null) {
        return this.containerElement;
      } else if (this.useWindow) {
        return window;
      } else {
        return this.$refs.container;
      }
    }
  },
  watch: {
    isNearBottom(value) {
      logger.debug("[VirtualScrolling] isNearBottom changed", { value });
      if (value) {
        this.$emit("need-content");
      }
    },
    visibleSections() {
      if (this.isNearBottom) {
        this.$emit("need-content");
      }
    },
    scrollToKey(key) {
      let currentRowTopDistanceFromTop = 0;
      for (const section of this.sections) {
        if (section.key !== key) {
          currentRowTopDistanceFromTop += this.headerHeight + section.height;
          continue;
        }
        break;
      }
      logger.debug("[VirtualScrolling] Scrolling to", { currentRowTopDistanceFromTop });
      this.$refs.container.scrollTo({ top: currentRowTopDistanceFromTop, behavior: "smooth" });
    }
  },
  beforeCreate() {
    this.rowIdToKeyMap = {};
  },
  mounted() {
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cr = entry.contentRect;
        if (entry.target === this.container) {
          this.containerHeight = cr.height;
        }
        if (entry.target.classList.contains("vs-rows-container")) {
          this.rowsContainerHeight = cr.height;
        }
      }
    });
    if (this.useWindow) {
      window.addEventListener("resize", this.updateContainerSize, { passive: true });
      this.containerHeight = window.innerHeight;
    } else {
      this.resizeObserver.observe(this.container);
    }
    this.resizeObserver.observe(this.$refs.rowsContainer);
    this.container?.addEventListener("scroll", this.updateScrollPosition, { passive: true });
  },
  beforeDestroy() {
    if (this.useWindow) {
      window.removeEventListener("resize", this.updateContainerSize);
    }
    this.resizeObserver?.disconnect();
    this.container?.removeEventListener("scroll", this.updateScrollPosition);
  },
  methods: {
    updateScrollPosition() {
      this._onScrollHandle ??= requestAnimationFrame(() => {
        this._onScrollHandle = null;
        if (this.useWindow) {
          this.scrollPosition = this.container.scrollY;
        } else {
          this.scrollPosition = this.container.scrollTop;
        }
      });
    },
    updateContainerSize() {
      this.containerHeight = window.innerHeight;
    }
  }
};
var _sfc_render$1 = function render3() {
  var _vm = this, _c = _vm._self._c;
  return !_vm.useWindow && _vm.containerElement === null ? _c("div", { ref: "container", staticClass: "vs-container" }, [_c("div", { ref: "rowsContainer", staticClass: "vs-rows-container", style: _vm.rowsContainerStyle }, [_vm._t("default", null, { "visibleSections": _vm.visibleSections }), _vm._t("loader")], 2)]) : _c("div", { ref: "rowsContainer", staticClass: "vs-rows-container", style: _vm.rowsContainerStyle }, [_vm._t("default", null, { "visibleSections": _vm.visibleSections }), _vm._t("loader")], 2);
};
var _sfc_staticRenderFns$1 = [];
_sfc_render$1._withStripped = true;
var __component__$1 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$1,
  _sfc_render$1,
  _sfc_staticRenderFns$1,
  false,
  null,
  "5ad12665"
);
__component__$1.options.__file = "/Users/effem/workbench/git/personel/photos/src/components/VirtualScrolling.vue";
const VirtualScrolling = __component__$1.exports;
const _sfc_main = {
  name: "FilesListViewer",
  components: {
    PackageVariant,
    NcEmptyContent,
    NcLoadingIcon,
    TiledLayout,
    VirtualScrolling
  },
  props: {
    // Array of file ids that should be rendered.
    fileIds: {
      type: Array,
      default: void 0
    },
    // An object mapping a list of section to a list of fileIds.
    fileIdsBySection: {
      type: Object,
      default: void 0
    },
    // The list of sorted sections.
    sections: {
      type: Array,
      default: void 0
    },
    // Whether we should display a loading indicator.
    loading: {
      type: Boolean,
      default: false
    },
    // Message to display when there is no files.
    emptyMessage: {
      type: String,
      default: ""
    },
    // The base height to forward to TileLayout.
    baseHeight: {
      type: Number,
      default: 200
    },
    // The height to use for section headers.
    sectionHeaderHeight: {
      type: Number,
      default: 75
    },
    // Instruct VirtualScrolling to scroll to the given section id.
    scrollToSection: {
      type: String,
      default: ""
    },
    // The containerElement props to forward to TileLayout.
    containerElement: {
      type: [HTMLElement, null],
      default: null
    },
    // The useWindow props to forward to TileLayout.
    useWindow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      placeholderFiles: Array(20).fill(0).map((_, index) => {
        const height = 200;
        const width = this.croppedLayout ? height : height * (1 + Math.random() * 2);
        return {
          id: index.toString(),
          width,
          height,
          ratio: width / height
        };
      })
    };
  },
  computed: {
    files() {
      return this.$store.state.files.files;
    },
    showPlaceholders() {
      return this.loading && (this.fileIds?.length === 0 || this.sections?.length === 0);
    },
    itemsBySections() {
      if (this.fileIds !== void 0) {
        if (this.showPlaceholders) {
          return [{ id: "", items: this.placeholderFiles }];
        }
        return [
          {
            id: "",
            items: this.fileIds.filter((fileId) => this.files[fileId]).map(this.mapFileToItem)
          }
        ];
      }
      if (this.sections !== void 0) {
        if (this.showPlaceholders) {
          return [{ id: "placeholder", items: this.placeholderFiles }];
        }
        return this.sections.map((sectionId) => {
          return {
            id: sectionId,
            items: this.fileIdsBySection[sectionId].filter((fileId) => this.files[fileId]).map(this.mapFileToItem)
          };
        });
      }
      return [];
    },
    photosCount() {
      return this.itemsBySections.map(({ items }) => items.length).reduce((total, length) => total + length, 0);
    },
    showLoader() {
      return this.loading && (this.fileIds?.length !== 0 || this.sections?.length !== 0);
    },
    croppedLayout() {
      return this.$store.state.userConfig.croppedLayout;
    }
  },
  mounted() {
    subscribe("files:node:updated", this.handleFileUpdated);
  },
  destroyed() {
    unsubscribe("files:node:updated", this.handleFileUpdated);
  },
  methods: {
    // Ask the parent for more content.
    needContent() {
      this.$emit("need-content");
    },
    mapFileToItem(fileId) {
      const file = this.files[fileId];
      return {
        id: file.fileid?.toString(),
        width: file.attributes["metadata-photos-size"].width,
        height: file.attributes["metadata-photos-size"].height,
        ratio: this.croppedLayout ? 1 : file.attributes["metadata-photos-size"].width / file.attributes["metadata-photos-size"].height
      };
    },
    async handleFileUpdated({ fileid }) {
      const fetchedFile = await fetchFile(this.files[fileid].path);
      this.$store.dispatch("appendFiles", [fetchedFile]);
    }
  }
};
var _sfc_render = function render4() {
  var _vm = this, _c = _vm._self._c;
  return _c("div", { staticClass: "files-list-viewer" }, [_vm.emptyMessage !== "" && _vm.photosCount === 0 && !_vm.loading ? _c("NcEmptyContent", { key: "emptycontent", attrs: { "name": _vm.emptyMessage } }, [_c("PackageVariant", { attrs: { "slot": "icon" }, slot: "icon" })], 1) : _vm._e(), _c("TiledLayout", { attrs: { "base-height": _vm.baseHeight, "sections": _vm.itemsBySections }, scopedSlots: _vm._u([{ key: "default", fn: function({ tiledSections }) {
    return _c("VirtualScrolling", { attrs: { "use-window": _vm.useWindow, "container-element": _vm.containerElement, "sections": tiledSections, "scroll-to-key": _vm.scrollToSection, "header-height": _vm.sectionHeaderHeight }, on: { "need-content": _vm.needContent }, scopedSlots: _vm._u([{ key: "default", fn: function({ visibleSections }) {
      return _vm._l(visibleSections, function(section) {
        return _c("div", { key: section.id }, [section.id !== "" ? [_vm.showPlaceholders ? _c("div", { staticClass: "files-list-viewer__placeholder", style: { "flex-basis": "100%", height: `${_vm.sectionHeaderHeight}px` } }) : _vm._t("default", null, { "file": { id: section.id }, "isHeader": true })] : _vm._e(), _c("ul", [_vm._l(section.rows, function(row, rowIndex) {
          return _vm._l(row.items, function(item) {
            return _c("li", { key: item.key, class: { "last-tiled-rows": rowIndex === section.rows.length - 1 }, style: { "flex-basis": `${item.width - 1}px`, height: `${item.height}px` } }, [_vm.showPlaceholders ? _c("div", { staticClass: "files-list-viewer__placeholder" }) : _vm._t("default", null, { "file": item, "distance": row.distance })], 2);
          });
        })], 2)], 2);
      });
    } }]) }, [_vm.loading && !_vm.showPlaceholders ? _c("NcLoadingIcon", { staticClass: "files-list-viewer__loader", attrs: { "slot": "loader" }, slot: "loader" }) : _vm._e()], 1);
  } }]) })], 1);
};
var _sfc_staticRenderFns = [];
_sfc_render._withStripped = true;
var __component__ = /* @__PURE__ */ normalizeComponent(
  _sfc_main,
  _sfc_render,
  _sfc_staticRenderFns,
  false,
  null,
  "0c9c045e"
);
__component__.options.__file = "/Users/effem/workbench/git/personel/photos/src/components/FilesListViewer.vue";
const FilesListViewer = __component__.exports;
const FilesSelectionMixin = defineComponent({
  name: "FilesSelectionMixin",
  data() {
    return {
      selection: {}
    };
  },
  watch: {
    $route() {
      this.resetSelection();
    }
  },
  methods: {
    onFileSelectToggle({ id, value }) {
      this.$set(this.selection, id, value);
    },
    onUncheckFiles(filesIds) {
      filesIds.forEach((filesId) => this.$set(this.selection, filesId, false));
    },
    resetSelection() {
      this.selection = {};
    }
  },
  computed: {
    selectedFileIds() {
      return Object.keys(this.selection).filter((fileId) => this.selection[fileId]);
    }
  }
});
export {
  FilesSelectionMixin as F,
  FilesListViewer as a
};
//# sourceMappingURL=FilesSelectionMixin-Bmgrjxxz.chunk.mjs.map
