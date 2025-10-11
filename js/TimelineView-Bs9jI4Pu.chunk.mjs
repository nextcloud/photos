const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { _, d as defineComponent, a as translatePlural, t as translate, g as getCurrentUser, u as unsubscribe, s as subscribe } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
import { m as moment } from "./index-Cokc0amN.chunk.mjs";
import { u as useIsMobile } from "./video-C5pfp5p8.chunk.mjs";
import { a as PhotosSourceLocationsSettings, u as useFilterStore, s as storeToRefs } from "./filters-BdPaD1pk.chunk.mjs";
import { N as NcActionButton } from "./NcActionButton-CuVNJJtW-5eBS5Sv2.chunk.mjs";
import { n as normalizeComponent, s as NcActions, f as NcLoadingIcon, N as NcButton, q as albumsExtraProps, h as allMimes, m as NcModal, ag as toViewerFileInfo, ah as configChangedEvent } from "./index-BOzawWmL.chunk.mjs";
import { N as NcEmptyContent } from "./NcEmptyContent-EDU4qhab.chunk.mjs";
import { n as normalizeComponent$1, j as ImageMultipleOutline, P as Plus, z as AlertCircleOutline, E as FolderAlertOutline, x as Close, G as DownloadOutline, J as PlusBoxMultipleOutline, D as DeleteOutline } from "./icons-BZLMM6Xn.chunk.mjs";
import { N as NcActionLink } from "./NcAvatar-YSp2ORHc-CfTsACiM.chunk.mjs";
import { A as ActionFavorite } from "./ActionFavorite-DMIHOXEO.chunk.mjs";
import { A as AlbumForm } from "./AlbumForm-DS-1aALG.chunk.mjs";
import { N as NcCounterBubble } from "./NcListItem-DfaWGP5A-M_EBAoWK.chunk.mjs";
import { N as NcVNodes } from "./NcVNodes-8dPkIzmP.chunk.mjs";
import { N as NcUserBubble } from "./NcUserBubble-B3-E-5F5-B3tz6PYr.chunk.mjs";
import { F as FetchCollectionsMixin } from "./FetchCollectionsMixin-BaPcOLwP.chunk.mjs";
import { F as FileComponent } from "./FileComponent-CcjuR452.chunk.mjs";
import { F as FilesSelectionMixin, a as FilesListViewer } from "./FilesSelectionMixin-Bmgrjxxz.chunk.mjs";
import { H as HeaderNavigation } from "./HeaderNavigation-BKsyJU73.chunk.mjs";
import { F as FetchFilesMixin } from "./FetchFilesMixin-CM-yM5E8.chunk.mjs";
import { F as FilesByMonthMixin } from "./FilesByMonthMixin-AkjqRtVI.chunk.mjs";
import "./preload-helper-BO5AHt9u.chunk.mjs";
import "./index-DTU2Yy1K.chunk.mjs";
import "./dialog-CIZq3-6b.chunk.mjs";
import "./index-ClkAjefD.chunk.mjs";
import "./PhotosFiltersInput-C83ZrtRE.chunk.mjs";
import "./NcSelect-CjUzohn5-OrPoxx8A.chunk.mjs";
import "./useModelMigration-EhAWvqDD-DYrjrJkv.chunk.mjs";
import "./NcDateTimePicker-D9wOztqD.chunk.mjs";
import "./NcDialog-CKgpZOiy-CeLaNMKv.chunk.mjs";
import "./NcDateTime-DshRFtUU-w5TCTRwf.chunk.mjs";
import "./collectionFetcher-COU0Vwo3.chunk.mjs";
import "./NcTextField-o_8gWurX-9cj68FP2.chunk.mjs";
import "./index-DzppFRs6.chunk.mjs";
import "./FetchCollectionContentMixin-ank00rhB.chunk.mjs";
import "./AbortControllerMixin-B_otrjDn.chunk.mjs";
import "./NcCheckboxRadioSwitch-VeztTzpz-CPNGlVnf.chunk.mjs";
import "./fileFetcher-UYL2it_6.chunk.mjs";
import "./PhotoSearch-Y02mQqQD.chunk.mjs";
const _sfc_main$3 = {
  name: "NcListItem",
  components: {
    NcActions,
    NcCounterBubble,
    NcVNodes
  },
  props: {
    /**
     * The details text displayed in the upper right part of the component
     */
    details: {
      type: String,
      default: ""
    },
    /**
     * Name (first line of text)
     */
    name: {
      type: String,
      default: void 0
    },
    /**
     * Pass in `true` if you want the matching behavior to
     * be non-inclusive: https://router.vuejs.org/api/#exact
     */
    exact: {
      type: Boolean,
      default: false
    },
    /**
     * The route for the router link.
     */
    to: {
      type: [String, Object],
      default: null
    },
    /**
     * The value for the external link
     */
    href: {
      type: String,
      default: "#"
    },
    target: {
      type: String,
      default: ""
    },
    /**
     * Id for the `<a>` element
     */
    anchorId: {
      type: String,
      default: ""
    },
    /**
     * Make subname bold
     */
    bold: {
      type: Boolean,
      default: false
    },
    /**
     * Show the NcListItem in compact design
     */
    compact: {
      type: Boolean,
      default: false
    },
    /**
     * Toggle the active state of the component
     */
    active: {
      type: Boolean,
      default: false
    },
    /**
     * Aria label for the wrapper element
     */
    linkAriaLabel: {
      type: String,
      default: ""
    },
    /**
     * Aria label for the actions toggle
     */
    actionsAriaLabel: {
      type: String,
      default: void 0
    },
    /**
     * If different from 0 this component will display the
     * NcCounterBubble component
     */
    counterNumber: {
      type: [Number, String],
      default: 0
    },
    /**
     * Outlined or highlighted state of the counter
     */
    counterType: {
      type: String,
      default: "",
      validator(value) {
        return ["highlighted", "outlined", ""].indexOf(value) !== -1;
      }
    },
    /**
     * To be used only when the elements in the actions menu are very important
     */
    forceDisplayActions: {
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
     * Show the list component layout
     */
    oneLine: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    "click",
    "update:menuOpen"
  ],
  setup() {
    const [major] = window._oc_config?.version.split(".", 2) ?? [];
    const isLegacy = major && Number.parseInt(major) < 30;
    return {
      isLegacy
    };
  },
  data() {
    return {
      hovered: false,
      hasActions: false,
      hasSubname: false,
      displayActionsOnHoverFocus: false,
      menuOpen: false,
      hasIndicator: false,
      hasDetails: false
    };
  },
  computed: {
    showAdditionalElements() {
      return !this.displayActionsOnHoverFocus || this.forceDisplayActions;
    },
    showDetails() {
      return (this.details !== "" || this.hasDetails) && (!this.displayActionsOnHoverFocus || this.forceDisplayActions);
    }
  },
  watch: {
    menuOpen(newValue) {
      if (!newValue && !this.hovered) {
        this.displayActionsOnHoverFocus = false;
      }
    }
  },
  mounted() {
    this.checkSlots();
  },
  updated() {
    this.checkSlots();
  },
  methods: {
    /**
     * Handle link click
     *
     * @param {MouseEvent|KeyboardEvent} event - Native click or keydown event
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
    showActions() {
      if (this.hasActions) {
        this.displayActionsOnHoverFocus = true;
      }
      this.hovered = false;
    },
    hideActions() {
      this.displayActionsOnHoverFocus = false;
    },
    /**
     * @param {FocusEvent} event UI event
     */
    handleBlur(event) {
      if (this.menuOpen) {
        return;
      }
      if (this.$refs["list-item"].contains(event.relatedTarget)) {
        return;
      }
      this.hideActions();
    },
    /**
     * Hide the actions on mouseleave unless the menu is open
     */
    handleMouseleave() {
      if (!this.menuOpen) {
        this.displayActionsOnHoverFocus = false;
      }
      this.hovered = false;
    },
    handleMouseover() {
      this.showActions();
      this.hovered = true;
    },
    handleActionsUpdateOpen(e) {
      this.menuOpen = e;
      this.$emit("update:menuOpen", e);
    },
    // Check if subname and actions slots are populated
    checkSlots() {
      if (this.hasActions !== !!this.$slots.actions) {
        this.hasActions = !!this.$slots.actions;
      }
      if (this.hasSubname !== !!this.$slots.subname) {
        this.hasSubname = !!this.$slots.subname;
      }
      if (this.hasIndicator !== !!this.$slots.indicator) {
        this.hasIndicator = !!this.$slots.indicator;
      }
      if (this.hasDetails !== !!this.$slots.details) {
        this.hasDetails = !!this.$slots.details;
      }
    }
  }
};
var _sfc_render$3 = function render() {
  var _vm = this, _c = _vm._self._c;
  return _c(_vm.to ? "router-link" : "NcVNodes", { tag: "component", attrs: { "custom": _vm.to ? true : null, "to": _vm.to, "exact": _vm.to ? _vm.exact : null }, scopedSlots: _vm._u([{ key: "default", fn: function({ href: routerLinkHref, navigate, isActive }) {
    return [_c("li", { staticClass: "list-item__wrapper", class: { "list-item__wrapper--active": isActive || _vm.active } }, [_c("div", { ref: "list-item", staticClass: "list-item", class: {
      "list-item--compact": _vm.compact,
      "list-item--legacy": _vm.isLegacy,
      "list-item--one-line": _vm.oneLine
    }, on: { "mouseover": _vm.handleMouseover, "mouseleave": _vm.handleMouseleave } }, [_c("a", { staticClass: "list-item__anchor", attrs: { "id": _vm.anchorId || void 0, "aria-label": _vm.linkAriaLabel, "href": routerLinkHref || _vm.href, "target": _vm.target || (_vm.href === "#" ? void 0 : "_blank"), "rel": _vm.href === "#" ? void 0 : "noopener noreferrer" }, on: { "focus": _vm.showActions, "focusout": _vm.handleBlur, "click": function($event) {
      return _vm.onClick($event, navigate, routerLinkHref);
    }, "keydown": function($event) {
      if (!$event.type.indexOf("key") && _vm._k($event.keyCode, "esc", 27, $event.key, ["Esc", "Escape"])) return null;
      return _vm.hideActions.apply(null, arguments);
    } } }, [_vm._t("icon"), _c("div", { staticClass: "list-item-content" }, [_c("div", { staticClass: "list-item-content__main" }, [_c("div", { staticClass: "list-item-content__name" }, [_vm._t("name", function() {
      return [_vm._v(_vm._s(_vm.name))];
    })], 2), _vm.hasSubname ? _c("div", { staticClass: "list-item-content__subname", class: { "list-item-content__subname--bold": _vm.bold } }, [_vm._t("subname")], 2) : _vm._e()]), _c("div", { staticClass: "list-item-content__details" }, [_vm.showDetails ? _c("div", { staticClass: "list-item-details__details" }, [_vm._t("details", function() {
      return [_vm._v(_vm._s(_vm.details))];
    })], 2) : _vm._e(), _vm.counterNumber || _vm.hasIndicator ? _c("div", { directives: [{ name: "show", rawName: "v-show", value: _vm.showAdditionalElements, expression: "showAdditionalElements" }], staticClass: "list-item-details__extra" }, [_vm.counterNumber ? _c("NcCounterBubble", { staticClass: "list-item-details__counter", attrs: { "active": isActive || _vm.active, "type": _vm.counterType } }, [_vm._v(" " + _vm._s(_vm.counterNumber) + " ")]) : _vm._e(), _vm.hasIndicator ? _c("span", { staticClass: "list-item-details__indicator" }, [_vm._t("indicator")], 2) : _vm._e()], 1) : _vm._e()])])], 2), _vm.$slots["extra-actions"] ? _c("div", { staticClass: "list-item-content__extra-actions" }, [_vm._t("extra-actions")], 2) : _vm._e(), _c("div", { directives: [{ name: "show", rawName: "v-show", value: _vm.forceDisplayActions || _vm.displayActionsOnHoverFocus, expression: "forceDisplayActions || displayActionsOnHoverFocus" }], staticClass: "list-item-content__actions", on: { "focusout": _vm.handleBlur } }, [_c("NcActions", { ref: "actions", attrs: { "primary": isActive || _vm.active, "force-menu": _vm.forceMenu, "aria-label": _vm.actionsAriaLabel }, on: { "update:open": _vm.handleActionsUpdateOpen }, scopedSlots: _vm._u([_vm.$slots["actions-icon"] ? { key: "icon", fn: function() {
      return [_vm._t("actions-icon")];
    }, proxy: true } : null], null, true) }, [_vm._t("actions")], 2)], 1), _vm.$slots.extra ? _c("div", { staticClass: "list-item__extra" }, [_vm._t("extra")], 2) : _vm._e()])])];
  } }], null, true) });
};
var _sfc_staticRenderFns$3 = [];
var __component__$3 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$3,
  _sfc_render$3,
  _sfc_staticRenderFns$3,
  false,
  null,
  "40599719"
);
const NcListItem = __component__$3.exports;
const _sfc_main$2 = {
  name: "ActionDownload",
  components: {
    NcActionLink
  },
  props: {
    title: {
      type: String,
      required: true
    },
    selectedFileIds: {
      type: Array,
      required: true
    }
  },
  computed: {
    files() {
      return this.$store.state.files.files;
    },
    downloadUrl() {
      const params = new URLSearchParams();
      params.append("files", JSON.stringify(this.paths));
      return _(`/apps/files/ajax/download.php?${params}`);
    },
    paths() {
      return this.selectedFileIds.map((fileId) => this.files[fileId].path);
    }
  }
};
var _sfc_render$2 = function render2() {
  var _vm = this, _c = _vm._self._c;
  return _c("NcActionLink", { attrs: { "close-after-click": true, "href": _vm.downloadUrl, "download": _vm.downloadUrl, "aria-label": _vm.title } }, [_vm._v(" " + _vm._s(_vm.title) + " "), _vm._t("icon", null, { "slot": "icon" })], 2);
};
var _sfc_staticRenderFns$2 = [];
_sfc_render$2._withStripped = true;
var __component__$2 = /* @__PURE__ */ normalizeComponent$1(
  _sfc_main$2,
  _sfc_render$2,
  _sfc_staticRenderFns$2,
  false,
  null,
  null
);
__component__$2.options.__file = "/Users/effem/workbench/git/personel/photos/src/components/Actions/ActionDownload.vue";
const ActionDownload = __component__$2.exports;
const _sfc_main$1 = defineComponent({
  name: "AlbumPicker",
  components: {
    Plus,
    ImageMultipleOutline,
    NcButton,
    NcListItem,
    NcLoadingIcon,
    NcUserBubble,
    AlbumForm
  },
  filters: {
    toCoverUrl(fileId) {
      return _(`/apps/photos/api/v1/preview/${fileId}?x=${64}&y=${64}`);
    }
  },
  mixins: [FetchCollectionsMixin],
  data() {
    return {
      showAlbumCreationForm: false
    };
  },
  computed: {
    albums() {
      return this.$store.getters.albums;
    },
    sharedAlbums() {
      return this.$store.getters.sharedAlbums;
    },
    allAlbums() {
      return [...Object.values(this.albums), ...Object.values(this.sharedAlbums)];
    }
  },
  mounted() {
    this.fetchAlbumList();
  },
  methods: {
    async fetchAlbumList() {
      await this.fetchCollections(`/photos/${getCurrentUser()?.uid}/albums`, albumsExtraProps);
      await this.fetchCollections(`/photos/${getCurrentUser()?.uid}/sharedalbums`, albumsExtraProps);
    },
    albumCreatedHandler() {
      this.showAlbumCreationForm = false;
      this.fetchAlbumList();
    },
    pickAlbum(album) {
      this.$emit("album-picked", album);
    },
    isSharedAlbum(album) {
      return album.path.match(/^\/photos\/.+\/sharedalbums\//) !== null;
    },
    originalName(album) {
      if (this.isSharedAlbum(album)) {
        return album.basename.replace(new RegExp(`\\(${album.attributes.collaborators[0].id}\\)$`), "");
      } else {
        return album.basename;
      }
    },
    t: translate,
    n: translatePlural
  }
});
var _sfc_render$1 = function render3() {
  var _vm = this, _c = _vm._self._c;
  _vm._self._setupProxy;
  return !_vm.showAlbumCreationForm ? _c("div", { staticClass: "album-picker" }, [_c("h2", [_vm._v(" " + _vm._s(_vm.t("photos", "Add to Album")) + " "), _vm.loadingCollections ? _c("NcLoadingIcon", { staticClass: "loading-icon" }) : _vm._e()], 1), _c("ul", { staticClass: "albums-container" }, _vm._l(_vm.allAlbums, function(album) {
    return _c("NcListItem", { key: album.attributes.filename, staticClass: "album", attrs: { "name": _vm.originalName(album), "aria-label": _vm.t("photos", "Add selection to album {albumName}", { albumName: album.basename }) }, on: { "click": function($event) {
      return _vm.pickAlbum(album);
    } }, scopedSlots: _vm._u([{ key: "subname", fn: function() {
      return [_vm._v(" " + _vm._s(_vm.n("photos", "%n item", "%n photos and videos", album.attributes.nbItems)) + " "), _vm.isSharedAlbum(album) ? [_vm._v(" ⸱ " + _vm._s(_vm.t("photos", "Shared by")) + " "), _c("NcUserBubble", { attrs: { "display-name": album.attributes.collaborators[0].label, "user": album.attributes.collaborators[0].id } })] : _vm._e()];
    }, proxy: true }], null, true) }, [_c("template", { slot: "icon" }, [album.attributes["last-photo"] !== -1 ? _c("img", { staticClass: "album__image", attrs: { "src": _vm._f("toCoverUrl")(album.attributes["last-photo"]) } }) : _c("div", { staticClass: "album__image album__image--placeholder" }, [_c("ImageMultipleOutline", { attrs: { "size": 32 } })], 1)])], 2);
  }), 1), _c("NcButton", { staticClass: "new-album-button", attrs: { "aria-label": _vm.t("photos", "Create a new album."), "type": "tertiary" }, on: { "click": function($event) {
    _vm.showAlbumCreationForm = true;
  } }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
    return [_c("Plus")];
  }, proxy: true }], null, false, 1489515321) }, [_vm._v(" " + _vm._s(_vm.t("photos", "Create new album")) + " ")])], 1) : _c("AlbumForm", { attrs: { "display-back-button": true, "title": _vm.t("photos", "New album") }, on: { "back": function($event) {
    _vm.showAlbumCreationForm = false;
  }, "done": _vm.albumCreatedHandler } });
};
var _sfc_staticRenderFns$1 = [];
_sfc_render$1._withStripped = true;
var __component__$1 = /* @__PURE__ */ normalizeComponent$1(
  _sfc_main$1,
  _sfc_render$1,
  _sfc_staticRenderFns$1,
  false,
  null,
  "394b1c4b"
);
__component__$1.options.__file = "/Users/effem/workbench/git/personel/photos/src/components/Albums/AlbumPicker.vue";
const AlbumPicker = __component__$1.exports;
const _sfc_main = {
  name: "TimelineView",
  components: {
    DeleteOutline,
    PlusBoxMultipleOutline,
    DownloadOutline,
    Close,
    Plus,
    FolderAlertOutline,
    NcEmptyContent,
    NcModal,
    NcActions,
    NcActionButton,
    NcButton,
    AlbumForm,
    AlbumPicker,
    FilesListViewer,
    FileComponent,
    ActionFavorite,
    ActionDownload,
    HeaderNavigation,
    PhotosSourceLocationsSettings,
    AlertCircleOutline
  },
  filters: {
    dateMonth(date) {
      return moment(date, "YYYYMM").format("MMMM");
    },
    dateYear(date) {
      return moment(date, "YYYYMM").format("YYYY");
    }
  },
  mixins: [
    FetchFilesMixin,
    FilesSelectionMixin,
    FilesByMonthMixin
  ],
  beforeRouteLeave(to, from, next) {
    window.scrollTo(0, 0);
    next();
    Object.keys(this.selectedFilters).forEach((key) => {
      this.selectedFilters[key] = [];
    });
  },
  props: {
    onlyFavorites: {
      type: Boolean,
      default: false
    },
    mimesType: {
      type: Array,
      default: () => allMimes
    },
    onThisDay: {
      type: Boolean,
      default: false
    },
    rootTitle: {
      type: String,
      required: true
    }
  },
  setup() {
    const isMobile = useIsMobile();
    const filtersStore = useFilterStore();
    const { selectedFilters, filtersQuery } = storeToRefs(filtersStore);
    return {
      isMobile,
      selectedFilters,
      filtersQuery
    };
  },
  data() {
    return {
      loadingCount: 0,
      showAlbumCreationForm: false,
      showAlbumPicker: false,
      appContent: document.getElementById("app-content-vue"),
      showFilters: false
    };
  },
  computed: {
    files() {
      return this.$store.state.files.files;
    },
    createAlbumButtonLabel() {
      if (Object.keys(this.selectedFilters).length > 0) {
        return this.t("photos", "Create new album from filters");
      } else {
        return this.t("photos", "Create new album");
      }
    }
  },
  watch: {
    filtersQuery() {
      this.resetFetchFilesState();
      this.getContent();
    }
  },
  mounted() {
    subscribe(configChangedEvent, this.handleUserConfigChange);
  },
  destroyed() {
    unsubscribe(configChangedEvent, this.handleUserConfigChange);
  },
  methods: {
    getContent() {
      this.fetchFiles({
        mimesType: this.mimesType,
        onThisDay: this.onThisDay,
        onlyFavorites: this.onlyFavorites,
        extraFilters: this.filtersQuery
      });
    },
    openViewer(fileId) {
      window.OCA.Viewer.open({
        fileInfo: toViewerFileInfo(this.files[fileId]),
        list: Object.values(this.fileIdsByMonth).flat().map((fileId2) => toViewerFileInfo(this.files[fileId2]))
      });
    },
    openUploader() {
    },
    async addSelectionToAlbum(album) {
      this.showAlbumPicker = false;
      await this.$store.dispatch("addFilesToCollection", { collectionFileName: album.root + album.path, fileIdsToAdd: this.selectedFileIds });
    },
    async deleteSelection() {
      const fileIds = this.selectedFileIds;
      this.onUncheckFiles(fileIds);
      this.fetchedFileIds = this.fetchedFileIds.filter((fileid) => !fileIds.includes(fileid));
      await this.$store.dispatch("deleteFiles", fileIds);
    },
    handleUserConfigChange({ key }) {
      if (key === "photosSourceFolders") {
        this.resetFetchFilesState();
      }
    },
    handleFormCreationDone({ album }) {
      this.showAlbumCreationForm = false;
      this.$router.push(`/albums/${album.basename}`);
    },
    t: translate
  }
};
var _sfc_render = function render4() {
  var _vm = this, _c = _vm._self._c;
  return _vm.errorFetchingFiles ? _c("div", { staticClass: "timeline__empty-content" }, [_vm.errorFetchingFiles === 404 ? _c("NcEmptyContent", { attrs: { "name": _vm.t("photos", "One of the source folders does not exist") } }, [_c("FolderAlertOutline", { attrs: { "slot": "icon" }, slot: "icon" }), _c("PhotosSourceLocationsSettings", { staticClass: "timeline__update_source_directory", attrs: { "slot": "action" }, slot: "action" })], 1) : _c("NcEmptyContent", { attrs: { "name": _vm.t("photos", "An error occurred") } }, [_c("AlertCircleOutline", { attrs: { "slot": "icon" }, slot: "icon" })], 1)], 1) : _c("div", { staticClass: "timeline" }, [_c("HeaderNavigation", { key: "navigation", attrs: { "loading": _vm.loadingCount > 0, "path": "/", "title": _vm.rootTitle, "root-title": _vm.rootTitle }, on: { "refresh": _vm.resetFetchFilesState } }, [_c("div", { staticClass: "timeline__header__left" }, [_vm.selectedFileIds.length === 0 ? _c("NcButton", { ref: "newAlbumButton", attrs: { "aria-label": _vm.createAlbumButtonLabel, "data-cy-header-action": "create-album" }, on: { "click": function($event) {
    _vm.showAlbumCreationForm = true;
  } }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
    return [_c("PlusBoxMultipleOutline")];
  }, proxy: true }], null, false, 2448450972) }, [_vm._v(" " + _vm._s(_vm.createAlbumButtonLabel) + " ")]) : [_c("NcButton", { attrs: { "close-after-click": true, "type": "primary", "aria-label": _vm.t("photos", "Add to album"), "data-cy-header-action": "add-to-album" }, on: { "click": function($event) {
    _vm.showAlbumPicker = true;
  } }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
    return [_c("Plus")];
  }, proxy: true }, !_vm.isMobile ? { key: "default", fn: function() {
    return [_vm._v(" " + _vm._s(_vm.t("photos", "Add to album")) + " ")];
  }, proxy: true } : null], null, true) }), _vm.selectedFileIds.length > 0 ? _c("NcButton", { attrs: { "aria-label": _vm.t("photos", "Unselect all"), "data-cy-header-action": "unselect-all" }, on: { "click": _vm.resetSelection }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
    return [_c("Close")];
  }, proxy: true }, !_vm.isMobile ? { key: "default", fn: function() {
    return [_vm._v(" " + _vm._s(_vm.t("photos", "Unselect all")) + " ")];
  }, proxy: true } : null], null, true) }) : _vm._e(), _c("NcActions", { attrs: { "aria-label": _vm.t("photos", "Open actions menu") } }, [_c("ActionDownload", { attrs: { "selected-file-ids": _vm.selectedFileIds, "title": _vm.t("photos", "Download selected files"), "data-cy-header-action": "download-selection" } }, [_c("DownloadOutline", { attrs: { "slot": "icon" }, slot: "icon" })], 1), _c("ActionFavorite", { attrs: { "selected-file-ids": _vm.selectedFileIds } }), _c("NcActionButton", { attrs: { "close-after-click": true, "aria-label": _vm.t("photos", "Delete selection"), "data-cy-header-action": "delete-selection" }, on: { "click": _vm.deleteSelection }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
    return [_c("DeleteOutline")];
  }, proxy: true }]) }, [_vm._v(" " + _vm._s(_vm.t("photos", "Delete selection")) + " ")])], 1)]], 2)]), _c("FilesListViewer", { ref: "filesListViewer", staticClass: "timeline__file-list", attrs: { "container-element": _vm.appContent, "file-ids-by-section": _vm.fileIdsByMonth, "sections": _vm.monthsList, "loading": _vm.loadingFiles, "base-height": _vm.isMobile ? 120 : 200, "empty-message": _vm.t("photos", "No photos or videos in here") }, on: { "need-content": _vm.getContent }, scopedSlots: _vm._u([{ key: "default", fn: function({ file, isHeader, distance }) {
    return [isHeader ? _c("h2", { staticClass: "section-header", attrs: { "id": `file-picker-section-header-${file.id}` } }, [_c("b", [_vm._v(_vm._s(_vm._f("dateMonth")(file.id)))]), _vm._v(" " + _vm._s(_vm._f("dateYear")(file.id)) + " ")]) : _c("FileComponent", { attrs: { "file": _vm.files[file.id], "allow-selection": true, "selected": _vm.selection[file.id] === true, "distance": distance }, on: { "click": _vm.openViewer, "select-toggled": _vm.onFileSelectToggle } })];
  } }]) }), _vm.showAlbumCreationForm ? _c("NcModal", { key: "albumCreationForm", attrs: { "label-id": "new-album-form", "set-return-focus": _vm.$refs.newAlbumButton?.$el }, on: { "close": function($event) {
    _vm.showAlbumCreationForm = false;
  } } }, [_c("h2", { staticClass: "timeline__heading" }, [_vm._v(" " + _vm._s(_vm.t("photos", "New album")) + " ")]), _c("AlbumForm", { attrs: { "filters-value": _vm.selectedFilters }, on: { "done": _vm.handleFormCreationDone } })], 1) : _vm._e(), _vm.showAlbumPicker ? _c("NcModal", { key: "albumPicker", attrs: { "label-id": "album-picker" }, on: { "close": function($event) {
    _vm.showAlbumPicker = false;
  } } }, [_c("AlbumPicker", { on: { "album-picked": _vm.addSelectionToAlbum } })], 1) : _vm._e()], 1);
};
var _sfc_staticRenderFns = [];
_sfc_render._withStripped = true;
var __component__ = /* @__PURE__ */ normalizeComponent$1(
  _sfc_main,
  _sfc_render,
  _sfc_staticRenderFns,
  false,
  null,
  "76e36349"
);
__component__.options.__file = "/Users/effem/workbench/git/personel/photos/src/views/TimelineView.vue";
const TimelineView = __component__.exports;
export {
  TimelineView as default
};
//# sourceMappingURL=TimelineView-Bs9jI4Pu.chunk.mjs.map
