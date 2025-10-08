const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { V as Vue, e as emit, u as unsubscribe, s as subscribe, d as defineComponent, t as translate, l as loadState, _, g as getCurrentUser, a as translatePlural, r as registerDavProperty } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
import { P as PhotosFolder, a as PhotosSourceLocationsSettings, u as useFilterStore, s as storeToRefs, b as PiniaVuePlugin, c as createPinia } from "./filters-BdPaD1pk.chunk.mjs";
import { u as useIsMobile, N as NcContent, a as NcAppContent, r as recognize, m as maps, s as systemtags, v as videoplaceholder, i as imgplaceholder, b as svgplaceholder, c as vuexRouterSyncExports, d as router } from "./video-C5pfp5p8.chunk.mjs";
import { N as NcAppNavigationToggle, a as NcAppSettingsDialog, b as NcAppNavigationItem } from "./NcAppSettingsSection-Bl2-D3_g-BYPSoxk3.chunk.mjs";
import { n as normalizeComponent, t as tabbable, c as createFocusTrap, g as getTrapStack, N as NcButton, l as logger$1, p as photosStore } from "./index-BOzawWmL.chunk.mjs";
import { l as logger } from "./NcAvatar-YSp2ORHc-CfTsACiM.chunk.mjs";
import { u as useHotKey } from "./useHotKey-CDShbxMN.chunk.mjs";
import { n as normalizeComponent$1, H as HomeOutline, M as MapMarkerOutline, a as MapMarker, b as MapOutline, c as MapIcon, V as VideoOutline, d as VideoIcon, T as TagOutline, e as Tag, S as StarOutline, f as Star, g as ShareVariantOutline, h as ShareVariant, I as ImageOutlineIcon, i as ImageIcon, j as ImageMultipleOutline, k as ImageMultiple, F as FolderOutline, l as Folder, A as AccountGroupOutline, m as AccountGroup, C as CameraOutline, o as Camera, p as CalendarTodayOutline, q as CalendarToday, r as CogOutline, s as AccountBoxMultipleOutline, t as AccountBoxMultiple } from "./icons-BZLMM6Xn.chunk.mjs";
import { P as PhotosFiltersDisplay, a as PhotosFiltersInput } from "./PhotosFiltersInput-C83ZrtRE.chunk.mjs";
import { N as NcCheckboxRadioSwitch } from "./NcCheckboxRadioSwitch-VeztTzpz-CPNGlVnf.chunk.mjs";
import { g as getFilePickerBuilder } from "./index-DTU2Yy1K.chunk.mjs";
import { d as debounce } from "./index-ClkAjefD.chunk.mjs";
import "./preload-helper-BO5AHt9u.chunk.mjs";
import "./NcActionButton-CuVNJJtW-5eBS5Sv2.chunk.mjs";
import "./NcVNodes-8dPkIzmP.chunk.mjs";
import "./NcSelect-CjUzohn5-OrPoxx8A.chunk.mjs";
import "./useModelMigration-EhAWvqDD-DYrjrJkv.chunk.mjs";
import "./NcDialog-CKgpZOiy-CeLaNMKv.chunk.mjs";
import "./index-Cokc0amN.chunk.mjs";
import "./dialog-CIZq3-6b.chunk.mjs";
import "./NcDateTimePicker-D9wOztqD.chunk.mjs";
import "./NcDateTime-DshRFtUU-w5TCTRwf.chunk.mjs";
import "./collectionFetcher-COU0Vwo3.chunk.mjs";
const _sfc_main$6 = {
  name: "NcAppNavigationList"
};
var _sfc_render$6 = function render() {
  var _vm = this, _c = _vm._self._c;
  return _c("ul", { staticClass: "app-navigation-list" }, [_vm._t("default")], 2);
};
var _sfc_staticRenderFns$6 = [];
var __component__$6 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$6,
  _sfc_render$6,
  _sfc_staticRenderFns$6,
  false,
  null,
  "058e6060"
);
const NcAppNavigationList = __component__$6.exports;
const _sfc_main$5 = {
  name: "NcAppNavigation",
  components: {
    NcAppNavigationList,
    NcAppNavigationToggle
  },
  // Injected from NcContent
  inject: {
    setHasAppNavigation: {
      default: () => () => Vue.util.warn("NcAppNavigation is not mounted inside NcContent, this is probably an error."),
      from: "NcContent:setHasAppNavigation"
    }
  },
  props: {
    /**
     * The aria label to describe the navigation
     */
    ariaLabel: {
      type: String,
      default: ""
    },
    /**
     * aria-labelledby attribute to describe the navigation
     */
    ariaLabelledby: {
      type: String,
      default: ""
    }
  },
  setup() {
    return {
      isMobile: useIsMobile()
    };
  },
  data() {
    return {
      open: !this.isMobile,
      focusTrap: null
    };
  },
  watch: {
    isMobile() {
      this.open = !this.isMobile;
      this.toggleFocusTrap();
    },
    open() {
      this.toggleFocusTrap();
    }
  },
  mounted() {
    this.setHasAppNavigation(true);
    subscribe("toggle-navigation", this.toggleNavigationByEventBus);
    emit("navigation-toggled", {
      open: this.open
    });
    this.focusTrap = createFocusTrap(this.$refs.appNavigationContainer, {
      allowOutsideClick: true,
      fallbackFocus: this.$refs.appNavigationContainer,
      trapStack: getTrapStack(),
      escapeDeactivates: false
    });
    this.toggleFocusTrap();
    useHotKey("n", this.onKeyDown, {
      prevent: true,
      stop: true
    });
  },
  unmounted() {
    this.setHasAppNavigation(false);
    unsubscribe("toggle-navigation", this.toggleNavigationByEventBus);
    this.focusTrap.deactivate();
  },
  methods: {
    /**
     * Toggle the navigation
     *
     * @param {boolean} [state] set the state instead of inverting the current one
     */
    async toggleNavigation(state) {
      if (this.open === state) {
        emit("navigation-toggled", {
          open: this.open
        });
        return;
      }
      this.open = typeof state === "undefined" ? !this.open : state;
      const bodyStyles = getComputedStyle(document.body);
      const animationLength = parseInt(bodyStyles.getPropertyValue("--animation-quick")) || 100;
      if (this.open) {
        await this.$nextTick();
        this.focusFirstElement();
      }
      setTimeout(() => {
        emit("navigation-toggled", {
          open: this.open
        });
      }, 1.5 * animationLength);
    },
    toggleNavigationByEventBus({ open }) {
      this.toggleNavigation(open);
    },
    /**
     * Activate focus trap if it is currently needed, otherwise deactivate
     */
    toggleFocusTrap() {
      if (this.isMobile && this.open) {
        this.focusTrap.activate();
      } else {
        this.focusTrap.deactivate();
      }
    },
    handleEsc() {
      if (this.isMobile && this.open) {
        this.toggleNavigation(false);
      }
    },
    focusFirstElement() {
      const element = tabbable(this.$refs.appNavigationContainer)[0];
      if (element) {
        element.focus();
        logger.debug("Focusing first element in the navigation", { element });
      }
    },
    onKeyDown(event) {
      if (event.key === "n") {
        if (!this.open) {
          this.toggleNavigation(true);
          return;
        }
        if (this.isFocusWithinNavigation()) {
          this.toggleNavigation(false);
        }
      }
    },
    isFocusWithinNavigation() {
      const activeElement = document.activeElement;
      return this.$refs.appNavigationContainer?.contains(activeElement);
    }
  }
};
var _sfc_render$5 = function render2() {
  var _vm = this, _c = _vm._self._c;
  return _c("div", { ref: "appNavigationContainer", staticClass: "app-navigation", class: { "app-navigation--close": !_vm.open } }, [_c("nav", { staticClass: "app-navigation__content", attrs: { "id": "app-navigation-vue", "aria-hidden": _vm.open ? "false" : "true", "aria-label": _vm.ariaLabel || void 0, "aria-labelledby": _vm.ariaLabelledby || void 0, "inert": !_vm.open || void 0 }, on: { "keydown": function($event) {
    if (!$event.type.indexOf("key") && _vm._k($event.keyCode, "esc", 27, $event.key, ["Esc", "Escape"])) return null;
    return _vm.handleEsc.apply(null, arguments);
  } } }, [_c("div", { staticClass: "app-navigation__search" }, [_vm._t("search")], 2), _c("div", { staticClass: "app-navigation__body", class: { "app-navigation__body--no-list": !_vm.$scopedSlots.list } }, [_vm._t("default")], 2), _vm.$scopedSlots.list ? _c("NcAppNavigationList", { staticClass: "app-navigation__list" }, [_vm._t("list")], 2) : _vm._e(), _vm._t("footer")], 2), _c("NcAppNavigationToggle", { attrs: { "open": _vm.open }, on: { "update:open": _vm.toggleNavigation } })], 1);
};
var _sfc_staticRenderFns$5 = [];
var __component__$5 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$5,
  _sfc_render$5,
  _sfc_staticRenderFns$5,
  false,
  null,
  "6d2acd3d"
);
const NcAppNavigation = __component__$5.exports;
const _sfc_main$4 = {
  name: "NcAppSettingsSection",
  inject: ["registerSection", "unregisterSection"],
  props: {
    name: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true,
      validator(id) {
        return /^[a-z0-9\-_]+$/.test(id);
      }
    }
  },
  computed: {
    // generate an id for each settingssection based on the name without whitespaces
    htmlId() {
      return "settings-section_" + this.id;
    }
  },
  // Reactive changes for section navigation
  watch: {
    id(newId, oldId) {
      this.unregisterSection(oldId);
      this.registerSection(newId, this.name, this.$slots?.icon);
    },
    name(newName) {
      this.unregisterSection(this.id);
      this.registerSection(this.id, newName, this.$slots?.icon);
    }
  },
  mounted() {
    this.registerSection(this.id, this.name, this.$slots?.icon);
  },
  beforeDestroy() {
    this.unregisterSection(this.id);
  }
};
var _sfc_render$4 = function render3() {
  var _vm = this, _c = _vm._self._c;
  return _c("section", { staticClass: "app-settings-section", attrs: { "id": _vm.htmlId, "aria-labelledby": `${_vm.htmlId}--label` } }, [_c("h3", { staticClass: "app-settings-section__name", attrs: { "id": `${_vm.htmlId}--label` } }, [_vm._v(" " + _vm._s(_vm.name) + " ")]), _vm._t("default"), _vm._e()], 2);
};
var _sfc_staticRenderFns$4 = [];
var __component__$4 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$4,
  _sfc_render$4,
  _sfc_staticRenderFns$4,
  false,
  null,
  "e970c9f7"
);
const NcAppSettingsSection = __component__$4.exports;
const _sfc_main$3 = {
  name: "CroppedLayoutSettings",
  components: {
    NcCheckboxRadioSwitch
  },
  computed: {
    croppedLayout() {
      return this.$store.state.userConfig.croppedLayout;
    }
  },
  methods: {
    updateSetting(value) {
      this.$store.dispatch("updateUserConfig", { key: "croppedLayout", value });
    }
  }
};
var _sfc_render$3 = function render4() {
  var _vm = this, _c = _vm._self._c;
  return _c("NcCheckboxRadioSwitch", { attrs: { "checked": _vm.croppedLayout, "type": "switch" }, on: { "update:checked": _vm.updateSetting } }, [_vm._v(" " + _vm._s(_vm.t("photos", "Enable squared photos view")) + " ")]);
};
var _sfc_staticRenderFns$3 = [];
_sfc_render$3._withStripped = true;
var __component__$3 = /* @__PURE__ */ normalizeComponent$1(
  _sfc_main$3,
  _sfc_render$3,
  _sfc_staticRenderFns$3,
  false,
  null,
  null
);
__component__$3.options.__file = "/Users/effem/workbench/git/personel/photos/src/components/Settings/CroppedLayoutSettings.vue";
const CroppedLayoutSettings = __component__$3.exports;
const _sfc_main$2 = defineComponent({
  name: "PhotosUploadLocationSettings",
  components: {
    NcButton,
    PhotosFolder
  },
  data() {
    return {
      HomeOutline
    };
  },
  computed: {
    photosLocation() {
      return this.$store.state.userConfig.photosLocation;
    }
  },
  methods: {
    debounceSelectPhotosFolder: debounce(function() {
      this.selectPhotosFolder();
    }),
    async selectPhotosFolder() {
      const pickedFolder = await this.openFilePicker(translate("photos", "Select the default upload location for your media"));
      this.updatePhotosFolder(pickedFolder);
    },
    async openFilePicker(title) {
      const picker = getFilePickerBuilder(title).setMultiSelect(false).addMimeTypeFilter("httpd/unix-directory").allowDirectories().startAt(this.photosLocation).addButton({
        label: translate("photos", "Pick folder"),
        callback: (nodes) => logger$1.debug("Picked", { nodes })
      }).build();
      return picker.pick();
    },
    updatePhotosFolder(path) {
      this.$store.dispatch("updateUserConfig", { key: "photosLocation", value: path });
    },
    t: translate
  }
});
var _sfc_render$2 = function render5() {
  var _vm = this, _c = _vm._self._c;
  _vm._self._setupProxy;
  return _c("div", { staticClass: "photos-location" }, [_c("PhotosFolder", { attrs: { "path": _vm.photosLocation, "root-folder-label": _vm.t("photos", "Home"), "root-folder-icon": _vm.HomeOutline } }), _c("NcButton", { attrs: { "aria-label": _vm.t("photos", "Choose default Photos upload and Albums location") }, on: { "click": _vm.debounceSelectPhotosFolder } }, [_vm._v(" " + _vm._s(_vm.t("photos", "Choose a different folder")) + " ")])], 1);
};
var _sfc_staticRenderFns$2 = [];
_sfc_render$2._withStripped = true;
var __component__$2 = /* @__PURE__ */ normalizeComponent$1(
  _sfc_main$2,
  _sfc_render$2,
  _sfc_staticRenderFns$2,
  false,
  null,
  "4524a52e"
);
__component__$2.options.__file = "/Users/effem/workbench/git/personel/photos/src/components/Settings/PhotosUploadLocationSettings.vue";
const PhotosUploadLocationSettings = __component__$2.exports;
const _sfc_main$1 = {
  name: "SettingsDialog",
  components: {
    NcAppSettingsDialog,
    NcAppSettingsSection,
    CroppedLayoutSettings,
    PhotosSourceLocationsSettings,
    PhotosUploadLocationSettings
  },
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // This can only be called if the AppSettingsDialog
    // is shown. So closing only
    onClose() {
      this.$emit("update:open", false);
    },
    t: translate
  }
};
var _sfc_render$1 = function render6() {
  var _vm = this, _c = _vm._self._c;
  return _c("NcAppSettingsDialog", { attrs: { "open": _vm.open, "show-navigation": true, "name": _vm.t("photos", "Photos settings") }, on: { "update:open": _vm.onClose } }, [_c("NcAppSettingsSection", { attrs: { "id": "layout-settings", "name": _vm.t("photos", "View") } }, [_c("CroppedLayoutSettings")], 1), _c("NcAppSettingsSection", { attrs: { "id": "source-directories-settings", "name": _vm.t("photos", "Media folders") } }, [_c("div", { staticClass: "setting-section-subline" }, [_vm._v(" " + _vm._s(_vm.t("photos", "Choose the folders from where photos and videos are shown.")) + " ")]), _c("PhotosSourceLocationsSettings")], 1), _c("NcAppSettingsSection", { attrs: { "id": "upload-directory-settings", "name": _vm.t("photos", "Upload folder") } }, [_c("div", { staticClass: "setting-section-subline" }, [_vm._v(" " + _vm._s(_vm.t("photos", "Choose the folder where photos and albums are uploaded to.")) + " ")]), _c("PhotosUploadLocationSettings")], 1)], 1);
};
var _sfc_staticRenderFns$1 = [];
_sfc_render$1._withStripped = true;
var __component__$1 = /* @__PURE__ */ normalizeComponent$1(
  _sfc_main$1,
  _sfc_render$1,
  _sfc_staticRenderFns$1,
  false,
  null,
  null
);
__component__$1.options.__file = "/Users/effem/workbench/git/personel/photos/src/components/Settings/SettingsDialog.vue";
const SettingsDialog = __component__$1.exports;
const appStoreEnabled = loadState("photos", "appStoreEnabled", false);
const _sfc_main = {
  name: "PhotosApp",
  components: {
    AccountBoxMultiple,
    AccountBoxMultipleOutline,
    CogOutline,
    CalendarToday,
    CalendarTodayOutline,
    Camera,
    CameraOutline,
    AccountGroup,
    AccountGroupOutline,
    Folder,
    FolderOutline,
    ImageMultiple,
    ImageMultipleOutline,
    ImageIcon,
    ImageOutline: ImageOutlineIcon,
    ShareVariant,
    ShareVariantOutline,
    Star,
    StarOutline,
    Tag,
    TagOutline,
    VideoIcon,
    VideoOutline,
    MapIcon,
    MapOutline,
    MapMarker,
    MapMarkerOutline,
    NcAppContent,
    NcAppNavigation,
    NcAppNavigationItem,
    NcButton,
    NcContent,
    SettingsDialog,
    PhotosFiltersInput,
    PhotosFiltersDisplay
  },
  setup() {
    const filtersStore = useFilterStore();
    const { selectedFilters } = storeToRefs(filtersStore);
    return {
      selectedFilters
    };
  },
  data() {
    return {
      svgplaceholder,
      imgplaceholder,
      videoplaceholder,
      areTagsInstalled: systemtags,
      showLocationMenuEntry: getCurrentUser() === null ? false : getCurrentUser().isAdmin && appStoreEnabled || maps,
      showPeopleMenuEntry: getCurrentUser() === null ? false : getCurrentUser().isAdmin && loadState("photos", "showPeopleMenuEntry", true) && appStoreEnabled || recognize,
      openedSettings: false
    };
  },
  computed: {
    isTimelineView() {
      return ["all_media", "photos", "videos"].includes(this.$store.state.route.name || "");
    }
  },
  async beforeMount() {
    const files = loadState("photos", "nomedia-paths", []);
    this.$store.dispatch("setNomediaPaths", files);
    logger$1.debug("Known .nomedia and .noimage  paths", { files });
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register(_("/apps/photos/service-worker.js", {}, {
          noRewrite: true
        }), {
          scope: _("/apps/photos")
        }).then((registration) => {
          logger$1.debug("SW registered: ", { registration });
        }).catch((registrationError) => {
          logger$1.error("SW registration failed: ", { registrationError });
        });
      });
    } else {
      logger$1.debug("Service Worker is not enabled on this browser.");
    }
  },
  beforeDestroy() {
    window.removeEventListener("load", () => {
      navigator.serviceWorker.register(_("/apps/photos/service-worker.js", {}, {
        noRewrite: true
      }));
    });
  },
  methods: {
    showSettings() {
      this.openedSettings = true;
    },
    selectFilter(filterOption) {
      this.selectedFilters[filterOption.filterId].push(filterOption.value);
    },
    deselectFilter(filterOption) {
      const index = this.selectedFilters[filterOption.filterId].indexOf(filterOption.value);
      if (index !== -1) {
        this.selectedFilters[filterOption.filterId].splice(index, 1);
      }
    },
    t: translate
  }
};
var _sfc_render = function render7() {
  var _vm = this, _c = _vm._self._c;
  return _c("NcContent", { attrs: { "app-name": "photos" } }, [_c("NcAppNavigation", { attrs: { "aria-label": _vm.t("photos", "Photos") }, scopedSlots: _vm._u([_vm.isTimelineView ? { key: "search", fn: function() {
    return [_c("PhotosFiltersInput", { attrs: { "selected-filters": _vm.selectedFilters }, on: { "select-filter": _vm.selectFilter } }), _c("PhotosFiltersDisplay", { attrs: { "selected-filters": _vm.selectedFilters }, on: { "deselect-filter": _vm.deselectFilter } })];
  }, proxy: true } : null, { key: "list", fn: function() {
    return [_c("NcAppNavigationItem", { staticClass: "app-navigation__all_media", attrs: { "to": { name: "all_media" }, "name": _vm.t("photos", "All media"), "data-id-app-nav-item": "all-media", "exact": "" }, scopedSlots: _vm._u([{ key: "icon", fn: function({ active }) {
      return [active ? _c("ImageIcon", { attrs: { "size": 20 } }) : _c("ImageOutline", { attrs: { "size": 20 } })];
    } }]) }), _c("NcAppNavigationItem", { attrs: { "to": "/photos", "name": _vm.t("photos", "Photos"), "data-id-app-nav-item": "photos" }, scopedSlots: _vm._u([{ key: "icon", fn: function({ active }) {
      return [active ? _c("Camera", { attrs: { "size": 20 } }) : _c("CameraOutline", { attrs: { "size": 20 } })];
    } }]) }), _c("NcAppNavigationItem", { attrs: { "to": "/videos", "name": _vm.t("photos", "Videos"), "data-id-app-nav-item": "videos" }, scopedSlots: _vm._u([{ key: "icon", fn: function({ active }) {
      return [active ? _c("VideoIcon", { attrs: { "size": 20 } }) : _c("VideoOutline", { attrs: { "size": 20 } })];
    } }]) }), _c("NcAppNavigationItem", { attrs: { "to": { name: "albums" }, "name": _vm.t("photos", "Albums"), "data-id-app-nav-item": "albums" }, scopedSlots: _vm._u([{ key: "icon", fn: function({ active }) {
      return [active ? _c("ImageMultiple", { attrs: { "size": 20 } }) : _c("ImageMultipleOutline", { attrs: { "size": 20 } })];
    } }]) }), _c("NcAppNavigationItem", { attrs: { "to": { name: "sharedAlbums" }, "name": _vm.t("photos", "Collaborative albums"), "data-id-app-nav-item": "sharedalbums" }, scopedSlots: _vm._u([{ key: "icon", fn: function({ active }) {
      return [active ? _c("AccountGroup", { attrs: { "size": 20 } }) : _c("AccountGroupOutline", { attrs: { "size": 20 } })];
    } }]) }), _vm.showPeopleMenuEntry ? _c("NcAppNavigationItem", { attrs: { "to": { name: "faces" }, "name": _vm.t("photos", "People"), "data-id-app-nav-item": "faces" }, scopedSlots: _vm._u([{ key: "icon", fn: function({ active }) {
      return [active ? _c("AccountBoxMultiple", { attrs: { "size": 20 } }) : _c("AccountBoxMultipleOutline", { attrs: { "size": 20 } })];
    } }], null, false, 3295904880) }) : _vm._e(), _c("NcAppNavigationItem", { attrs: { "to": { name: "folders" }, "name": _vm.t("photos", "Folders"), "data-id-app-nav-item": "folders" }, scopedSlots: _vm._u([{ key: "icon", fn: function({ active }) {
      return [active ? _c("Folder", { attrs: { "size": 20 } }) : _c("FolderOutline", { attrs: { "size": 20 } })];
    } }]) }), _c("NcAppNavigationItem", { attrs: { "to": "/favorites", "name": _vm.t("photos", "Favorites"), "data-id-app-nav-item": "favorites" }, scopedSlots: _vm._u([{ key: "icon", fn: function({ active }) {
      return [active ? _c("Star", { attrs: { "size": 20 } }) : _c("StarOutline", { attrs: { "size": 20 } })];
    } }]) }), _c("NcAppNavigationItem", { attrs: { "to": { name: "thisday" }, "name": _vm.t("photos", "On this day"), "data-id-app-nav-item": "this-day" }, scopedSlots: _vm._u([{ key: "icon", fn: function({ active }) {
      return [active ? _c("CalendarToday", { attrs: { "size": 20 } }) : _c("CalendarTodayOutline", { attrs: { "size": 20 } })];
    } }]) }), _c("NcAppNavigationItem", { attrs: { "to": { name: "shared" }, "name": _vm.t("photos", "Shared with you"), "data-id-app-nav-item": "shared" }, scopedSlots: _vm._u([{ key: "icon", fn: function({ active }) {
      return [active ? _c("ShareVariant", { attrs: { "size": 20 } }) : _c("ShareVariantOutline", { attrs: { "size": 20 } })];
    } }]) }), _vm.areTagsInstalled ? _c("NcAppNavigationItem", { attrs: { "to": { name: "tags" }, "name": _vm.t("photos", "Tags"), "data-id-app-nav-item": "tags" }, scopedSlots: _vm._u([{ key: "icon", fn: function({ active }) {
      return [active ? _c("Tag", { attrs: { "size": 20 } }) : _c("TagOutline", { attrs: { "size": 20 } })];
    } }], null, false, 346180464) }) : _vm._e(), _c("NcAppNavigationItem", { attrs: { "to": { name: "places" }, "name": _vm.t("photos", "Places"), "data-id-app-nav-item": "places" }, scopedSlots: _vm._u([{ key: "icon", fn: function({ active }) {
      return [active ? _c("MapMarker", { attrs: { "size": 20 } }) : _c("MapMarkerOutline", { attrs: { "size": 20 } })];
    } }]) }), _vm.showLocationMenuEntry ? _c("NcAppNavigationItem", { attrs: { "to": { name: "maps" }, "name": _vm.t("photos", "Map"), "data-id-app-nav-item": "maps" }, scopedSlots: _vm._u([{ key: "icon", fn: function({ active }) {
      return [active ? _c("MapIcon", { attrs: { "size": 20 } }) : _c("MapOutline", { attrs: { "size": 20 } })];
    } }], null, false, 257739259) }) : _vm._e()];
  }, proxy: true }, { key: "footer", fn: function() {
    return [_c("div", { staticClass: "app-navigation__footer" }, [_c("NcButton", { attrs: { "type": "tertiary", "alignment": "start", "wide": "" }, on: { "click": _vm.showSettings }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
      return [_c("CogOutline", { attrs: { "size": 20 } })];
    }, proxy: true }]) }, [_vm._v(" " + _vm._s(_vm.t("photos", "Photos settings")) + " ")])], 1)];
  }, proxy: true }], null, true) }), _c("NcAppContent", [_c("RouterView"), _c("span", { staticClass: "hidden-visually", attrs: { "role": "none" }, domProps: { "innerHTML": _vm._s(_vm.svgplaceholder) } }), _c("span", { staticClass: "hidden-visually", attrs: { "role": "none" }, domProps: { "innerHTML": _vm._s(_vm.imgplaceholder) } }), _c("span", { staticClass: "hidden-visually", attrs: { "role": "none" }, domProps: { "innerHTML": _vm._s(_vm.videoplaceholder) } })], 1), _c("SettingsDialog", { attrs: { "open": _vm.openedSettings }, on: { "update:open": function($event) {
    _vm.openedSettings = $event;
  } } })], 1);
};
var _sfc_staticRenderFns = [];
_sfc_render._withStripped = true;
var __component__ = /* @__PURE__ */ normalizeComponent$1(
  _sfc_main,
  _sfc_render,
  _sfc_staticRenderFns,
  false,
  null,
  null
);
__component__.options.__file = "/Users/effem/workbench/git/personel/photos/src/PhotosApp.vue";
const PhotosApp = __component__.exports;
vuexRouterSyncExports.sync(photosStore, router);
Vue.prototype.t = translate;
Vue.prototype.n = translatePlural;
registerDavProperty("nc:metadata-photos-size");
registerDavProperty("nc:metadata-files-live-photo");
registerDavProperty("nc:metadata-blurhash");
registerDavProperty("nc:metadata-photos-original_date_time");
Vue.use(PiniaVuePlugin);
new Vue({
  el: "#content",
  name: "PhotosRoot",
  router,
  store: photosStore,
  pinia: createPinia(),
  render: (h) => h(PhotosApp)
});
//# sourceMappingURL=photos-main.mjs.map
