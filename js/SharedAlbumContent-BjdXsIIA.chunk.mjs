const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { t as translate } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
import { S as ShareType } from "./index-DzppFRs6.chunk.mjs";
import { u as useIsMobile } from "./video-C5pfp5p8.chunk.mjs";
import { N as NcActionButton } from "./NcActionButton-CuVNJJtW-5eBS5Sv2.chunk.mjs";
import { N as NcButton, s as NcActions, w as albumFilesExtraProps, q as albumsExtraProps } from "./index-BOzawWmL.chunk.mjs";
import { N as NcActionSeparator } from "./index-DdKmqUaK-5iZCstwH.chunk.mjs";
import { N as NcEmptyContent } from "./NcEmptyContent-EDU4qhab.chunk.mjs";
import { N as NcUserBubble } from "./NcUserBubble-B3-E-5F5-B3tz6PYr.chunk.mjs";
import { w as ImagePlusOutline, D as DeleteOutline, x as Close, P as Plus, M as MapMarkerOutline, n as normalizeComponent } from "./icons-BZLMM6Xn.chunk.mjs";
import { C as CollectionContent } from "./CollectionContent-CDkRvqND.chunk.mjs";
import { H as HeaderNavigation } from "./HeaderNavigation-BKsyJU73.chunk.mjs";
import { P as PhotosPicker } from "./PhotosPicker-CNnGJqQC.chunk.mjs";
import { F as FetchCollectionContentMixin } from "./FetchCollectionContentMixin-ank00rhB.chunk.mjs";
import { F as FetchFilesMixin } from "./FetchFilesMixin-CM-yM5E8.chunk.mjs";
import "./preload-helper-BO5AHt9u.chunk.mjs";
import "./index-Cokc0amN.chunk.mjs";
import "./index-BrMrQMP2.chunk.mjs";
import "./useHotKey-CDShbxMN.chunk.mjs";
import "./NcProgressBar-DegJ2JjE-BAVaOw4q.chunk.mjs";
import "./index-DTU2Yy1K.chunk.mjs";
import "./dialog-CIZq3-6b.chunk.mjs";
import "./NcAvatar-YSp2ORHc-CfTsACiM.chunk.mjs";
import "./FileComponent-CcjuR452.chunk.mjs";
import "./NcCheckboxRadioSwitch-VeztTzpz-CPNGlVnf.chunk.mjs";
import "./useModelMigration-EhAWvqDD-DYrjrJkv.chunk.mjs";
import "./FilesSelectionMixin-Bmgrjxxz.chunk.mjs";
import "./fileFetcher-UYL2it_6.chunk.mjs";
import "./NcDialog-CKgpZOiy-CeLaNMKv.chunk.mjs";
import "./NcNoteCard-D-_SVIMX.chunk.mjs";
import "./NcSelect-CjUzohn5-OrPoxx8A.chunk.mjs";
import "./FilesByMonthMixin-AkjqRtVI.chunk.mjs";
import "./collectionFetcher-COU0Vwo3.chunk.mjs";
import "./AbortControllerMixin-B_otrjDn.chunk.mjs";
import "./PhotoSearch-Y02mQqQD.chunk.mjs";
const _sfc_main = {
  name: "SharedAlbumContent",
  components: {
    MapMarkerOutline,
    Plus,
    Close,
    // Download,
    // DownloadMultiple,
    DeleteOutline,
    ImagePlusOutline,
    NcEmptyContent,
    NcActions,
    NcActionButton,
    NcActionSeparator,
    NcButton,
    NcUserBubble,
    CollectionContent,
    // ActionDownload,
    PhotosPicker,
    HeaderNavigation
  },
  mixins: [
    FetchCollectionContentMixin,
    FetchFilesMixin
  ],
  props: {
    albumName: {
      type: String,
      default: "/"
    }
  },
  setup() {
    const isMobile = useIsMobile();
    return {
      isMobile
    };
  },
  data() {
    return {
      showAddPhotosModal: false,
      loadingCount: 0,
      loadingAddFilesToAlbum: false,
      collaboratorTypes: ShareType
    };
  },
  computed: {
    files() {
      return this.$store.state.files.files;
    },
    album() {
      return this.$store.getters.getSharedAlbum(this.albumName);
    },
    albumFileIds() {
      return this.$store.getters.getSharedAlbumFiles(this.albumName);
    },
    albumOriginalName() {
      return this.albumName.replace(new RegExp(`\\(${this.album?.attributes.collaborators[0].id}\\)$`), "");
    },
    albumFileName() {
      return this.$store.getters.getSharedAlbumName(this.albumName);
    },
    removableSelectedFiles() {
      return (this.$refs.collectionContent?.selectedFileIds).map((fileId) => this.$store.state.files.files[fileId]).filter((file) => file.attributes["photos-album-file-origin"] !== "filters").map((file) => file.fileid.toString());
    }
  },
  async mounted() {
    this.fetchAlbum();
    this.fetchAlbumContent();
  },
  methods: {
    async fetchAlbum() {
      await this.fetchCollection(
        this.albumFileName,
        albumsExtraProps
      );
    },
    async fetchAlbumContent() {
      await this.fetchCollectionFiles(this.albumFileName, albumFilesExtraProps);
    },
    async handleFilesPicked(fileIds) {
      this.showAddPhotosModal = false;
      await this.$store.dispatch("addFilesToCollection", { collectionFileName: this.album.root + this.album.path, fileIdsToAdd: fileIds });
      await this.fetchAlbumContent();
    },
    async handleRemoveFilesFromAlbum(fileIds) {
      this.$refs.collectionContent?.onUncheckFiles(fileIds);
      await this.$store.dispatch("removeFilesFromCollection", { collectionFileName: this.album.root + this.album.path, fileIdsToRemove: fileIds });
    },
    async handleDeleteAlbum() {
      await this.$store.dispatch("deleteCollection", { collectionFileName: this.album.root + this.album.path });
      this.$router.push("/sharedalbums");
    },
    t: translate
  }
};
var _sfc_render = function render() {
  var _vm = this, _c = _vm._self._c;
  return _c("div", [_c("CollectionContent", { ref: "collectionContent", attrs: { "collection": _vm.album, "collection-file-ids": _vm.albumFileIds, "loading": _vm.loadingCollection || _vm.loadingCollectionFiles, "error": _vm.errorFetchingCollection || _vm.errorFetchingCollectionFiles }, scopedSlots: _vm._u([{ key: "header", fn: function({ selectedFileIds, resetSelection }) {
    return _c("HeaderNavigation", { key: "navigation", attrs: { "loading": _vm.loadingCollectionFiles, "params": { albumName: _vm.albumName }, "path": "/" + _vm.albumName, "title": _vm.albumOriginalName }, on: { "refresh": _vm.fetchAlbumContent } }, [_vm.album !== void 0 && _vm.album.attributes.location !== "" ? _c("div", { staticClass: "album__location", attrs: { "slot": "subtitle" }, slot: "subtitle" }, [_c("MapMarkerOutline"), _vm._v(_vm._s(_vm.album.attributes.location) + " ⸱ " + _vm._s(_vm.t("photos", "Shared by")) + "  "), _c("NcUserBubble", { attrs: { "display-name": _vm.album.attributes.collaborators[0].label, "user": _vm.album.attributes.collaborators[0].id } })], 1) : _vm._e(), _c("template", { slot: "default" }, [selectedFileIds.length > 0 ? _c("NcButton", { attrs: { "aria-label": _vm.t("photos", "Unselect all") }, on: { "click": resetSelection }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
      return [_c("Close")];
    }, proxy: true }], null, true) }, [_vm._v(" " + _vm._s(_vm.t("photos", "Unselect all")) + " ")]) : _vm._e()], 1), _vm.album !== void 0 ? _c("template", { slot: "right" }, [_vm.album.attributes.nbItems !== 0 ? _c("NcButton", { attrs: { "type": "secondary", "aria-label": _vm.t("photos", "Add photos to this album") }, on: { "click": function($event) {
      _vm.showAddPhotosModal = true;
    } } }, [_c("Plus", { attrs: { "slot": "icon" }, slot: "icon" }), _vm._v(" " + _vm._s(_vm.t("photos", "Add")) + " ")], 1) : _vm._e(), _c("NcActions", { attrs: { "force-menu": true, "aria-label": _vm.t("photos", "Open actions menu") } }, [_vm.album.attributes.collaborators[0].type === _vm.collaboratorTypes.User ? _c("NcActionButton", { attrs: { "close-after-click": true }, on: { "click": _vm.handleDeleteAlbum } }, [_vm._v(" " + _vm._s(_vm.t("photos", "Delete album")) + " "), _c("DeleteOutline", { attrs: { "slot": "icon" }, slot: "icon" })], 1) : _vm._e(), selectedFileIds.length > 0 ? [_c("NcActionSeparator"), _vm.removableSelectedFiles.length !== 0 ? _c("NcActionButton", { attrs: { "close-after-click": true }, on: { "click": function($event) {
      return _vm.handleRemoveFilesFromAlbum(_vm.removableSelectedFiles);
    } } }, [_vm._v(" " + _vm._s(_vm.t("photos", "Remove selection from album")) + " "), _c("Close", { attrs: { "slot": "icon" }, slot: "icon" })], 1) : _vm._e()] : _vm._e()], 2)], 1) : _vm._e()], 2);
  } }], null, false, 3869514490) }, [_vm.album !== void 0 && _vm.album.attributes.nbItems === 0 && !(_vm.loadingCollectionFiles || _vm.loadingCollection) ? _c("NcEmptyContent", { staticClass: "album__empty", attrs: { "slot": "empty-content", "name": _vm.t("photos", "This album does not have any photos or videos yet!") }, slot: "empty-content" }, [_c("ImagePlusOutline", { attrs: { "slot": "icon" }, slot: "icon" }), _c("NcButton", { staticClass: "album__empty__button", attrs: { "slot": "action", "type": "primary", "aria-label": _vm.t("photos", "Add photos to this album") }, on: { "click": function($event) {
    _vm.showAddPhotosModal = true;
  } }, slot: "action" }, [_c("Plus", { attrs: { "slot": "icon" }, slot: "icon" }), _vm._v(" " + _vm._s(_vm.t("photos", "Add")) + " ")], 1)], 1) : _vm._e()], 1), _vm.album !== void 0 ? _c("PhotosPicker", { attrs: { "open": _vm.showAddPhotosModal, "name": _vm.t("photos", "Add photos to {albumName}", { albumName: _vm.albumOriginalName }), "destination": _vm.album.basename, "blacklist-ids": _vm.albumFileIds, "loading": _vm.loadingAddFilesToAlbum }, on: { "update:open": function($event) {
    _vm.showAddPhotosModal = $event;
  }, "files-picked": _vm.handleFilesPicked } }) : _vm._e()], 1);
};
var _sfc_staticRenderFns = [];
_sfc_render._withStripped = true;
var __component__ = /* @__PURE__ */ normalizeComponent(
  _sfc_main,
  _sfc_render,
  _sfc_staticRenderFns,
  false,
  null,
  "62af3c7b"
);
__component__.options.__file = "/Users/effem/workbench/git/personel/photos/src/views/SharedAlbumContent.vue";
const SharedAlbumContent = __component__.exports;
export {
  SharedAlbumContent as default
};
//# sourceMappingURL=SharedAlbumContent-BjdXsIIA.chunk.mjs.map
