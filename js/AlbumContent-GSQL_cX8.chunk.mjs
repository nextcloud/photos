const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { t as translate } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
import { u as useIsMobile } from "./video-C5pfp5p8.chunk.mjs";
import { N as NcActionButton } from "./NcActionButton-CuVNJJtW-5eBS5Sv2.chunk.mjs";
import { m as NcModal, f as NcLoadingIcon, N as NcButton, s as NcActions, l as logger, w as albumFilesExtraProps, q as albumsExtraProps } from "./index-BOzawWmL.chunk.mjs";
import { N as NcActionSeparator } from "./index-DdKmqUaK-5iZCstwH.chunk.mjs";
import { N as NcDialog } from "./NcDialog-CKgpZOiy-CeLaNMKv.chunk.mjs";
import { N as NcEmptyContent } from "./NcEmptyContent-EDU4qhab.chunk.mjs";
import { g as ShareVariantOutline, P as Plus, v as PencilOutline, M as MapMarkerOutline, w as ImagePlusOutline, D as DeleteOutline, x as Close, n as normalizeComponent } from "./icons-BZLMM6Xn.chunk.mjs";
import { A as ActionFavorite } from "./ActionFavorite-DMIHOXEO.chunk.mjs";
import { C as CollaboratorsSelectionForm, A as AlbumForm } from "./AlbumForm-DS-1aALG.chunk.mjs";
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
import "./NcTextField-o_8gWurX-9cj68FP2.chunk.mjs";
import "./useModelMigration-EhAWvqDD-DYrjrJkv.chunk.mjs";
import "./PhotosFiltersInput-C83ZrtRE.chunk.mjs";
import "./NcSelect-CjUzohn5-OrPoxx8A.chunk.mjs";
import "./NcAvatar-YSp2ORHc-CfTsACiM.chunk.mjs";
import "./NcDateTimePicker-D9wOztqD.chunk.mjs";
import "./NcDateTime-DshRFtUU-w5TCTRwf.chunk.mjs";
import "./collectionFetcher-COU0Vwo3.chunk.mjs";
import "./index-DzppFRs6.chunk.mjs";
import "./FileComponent-CcjuR452.chunk.mjs";
import "./NcCheckboxRadioSwitch-VeztTzpz-CPNGlVnf.chunk.mjs";
import "./FilesSelectionMixin-Bmgrjxxz.chunk.mjs";
import "./fileFetcher-UYL2it_6.chunk.mjs";
import "./NcNoteCard-D-_SVIMX.chunk.mjs";
import "./FilesByMonthMixin-AkjqRtVI.chunk.mjs";
import "./AbortControllerMixin-B_otrjDn.chunk.mjs";
import "./PhotoSearch-Y02mQqQD.chunk.mjs";
const _sfc_main = {
  name: "AlbumContent",
  components: {
    // ActionDownload,
    ActionFavorite,
    AlbumForm,
    Close,
    CollaboratorsSelectionForm,
    CollectionContent,
    DeleteOutline,
    // Download,
    // DownloadMultiple,
    PhotosPicker,
    HeaderNavigation,
    ImagePlusOutline,
    MapMarkerOutline,
    NcActionButton,
    NcActions,
    NcActionSeparator,
    NcButton,
    NcDialog,
    NcEmptyContent,
    NcLoadingIcon,
    NcModal,
    PencilOutline,
    Plus,
    ShareVariantOutline
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
      showManageCollaboratorView: false,
      showEditAlbumForm: false,
      loadingAddCollaborators: false
    };
  },
  computed: {
    album() {
      return this.$store.getters.getAlbum(this.albumName);
    },
    albumFileIds() {
      return this.$store.getters.getAlbumFiles(this.albumName);
    },
    sharingEnabled() {
      return OC.Share !== void 0;
    },
    albumFileName() {
      return this.$store.getters.getAlbumName(this.albumName);
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
    async handleAlbumUpdate({ album, changes }) {
      this.showEditAlbumForm = false;
      if (changes.includes("name")) {
        await this.$router.push(`/albums/${album.basename}`);
      }
      if (changes.includes("filters")) {
        this.fetchAlbumContent();
      }
    },
    async handleFilesPicked(fileIds) {
      this.showAddPhotosModal = false;
      await this.$store.dispatch("addFilesToCollection", { collectionFileName: this.album?.root + this.album?.path, fileIdsToAdd: fileIds });
      await this.fetchAlbumContent();
    },
    async handleRemoveFilesFromAlbum(fileIds) {
      this.$refs.collectionContent?.onUncheckFiles(fileIds);
      await this.$store.dispatch("removeFilesFromCollection", { collectionFileName: this.album?.root + this.album?.path, fileIdsToRemove: fileIds });
    },
    async handleDeleteAlbum() {
      await this.$store.dispatch("deleteCollection", { collectionFileName: this.album?.root + this.album?.path });
      this.$router.push("/albums");
    },
    async handleSetCollaborators(collaborators) {
      try {
        this.loadingAddCollaborators = true;
        this.showManageCollaboratorView = false;
        await this.$store.dispatch("updateCollection", { collectionFileName: this.album?.root + this.album?.path, properties: { collaborators } });
      } catch (error) {
        logger.error("Error while setting album collaborators", { error });
      } finally {
        this.loadingAddCollaborators = false;
      }
    },
    async handleFiltersChange(filters) {
      await this.$store.dispatch("updateCollection", { collectionFileName: this.album?.root + this.album?.path, properties: { filters } });
      this.fetchAlbumContent();
    },
    t: translate
  }
};
var _sfc_render = function render() {
  var _vm = this, _c = _vm._self._c;
  return _c("div", { staticClass: "album-container" }, [_c("CollectionContent", { ref: "collectionContent", attrs: { "collection": _vm.album, "collection-file-ids": _vm.albumFileIds, "loading": _vm.loadingCollection || _vm.loadingCollectionFiles, "error": _vm.errorFetchingCollection || _vm.errorFetchingCollectionFiles }, scopedSlots: _vm._u([{ key: "header", fn: function({ selectedFileIds, resetSelection }) {
    return _c("HeaderNavigation", { key: "navigation", attrs: { "loading": _vm.loadingCollectionFiles, "params": { albumName: _vm.albumName }, "path": "/" + _vm.albumName, "title": _vm.albumName }, on: { "refresh": _vm.fetchAlbumContent } }, [_vm.album !== void 0 && _vm.album.attributes.location !== "" ? _c("div", { staticClass: "album__location", attrs: { "slot": "subtitle" }, slot: "subtitle" }, [_c("MapMarkerOutline"), _vm._v(_vm._s(_vm.album.attributes.location) + " ")], 1) : _vm._e(), _c("template", { slot: "default" }, [selectedFileIds.length > 0 ? _c("NcButton", { attrs: { "aria-label": _vm.t("photos", "Unselect all") }, on: { "click": resetSelection }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
      return [_c("Close")];
    }, proxy: true }], null, true) }, [_vm._v(" " + _vm._s(_vm.t("photos", "Unselect all")) + " ")]) : _vm._e()], 1), _vm.album !== void 0 ? _c("template", { slot: "right" }, [_c("NcButton", { on: { "click": function($event) {
      _vm.showAddPhotosModal = true;
    } }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
      return [_c("Plus", { attrs: { "size": 20 } })];
    }, proxy: true }], null, true) }, [_vm._v(" " + _vm._s(_vm.t("photos", "Add photos to this album")) + " ")]), _vm.sharingEnabled ? _c("NcButton", { attrs: { "type": "tertiary", "aria-label": _vm.t("photos", "Manage collaborators for this album") }, on: { "click": function($event) {
      _vm.showManageCollaboratorView = true;
    } } }, [_c("ShareVariantOutline", { attrs: { "slot": "icon" }, slot: "icon" })], 1) : _vm._e(), _c("NcActions", { attrs: { "aria-label": _vm.t("photos", "Open actions menu") } }, [_c("NcActionButton", { attrs: { "close-after-click": true, "aria-label": _vm.t("photos", "Edit album details") }, on: { "click": function($event) {
      _vm.showEditAlbumForm = true;
    } } }, [_vm._v(" " + _vm._s(_vm.t("photos", "Edit album details")) + " "), _c("PencilOutline", { attrs: { "slot": "icon" }, slot: "icon" })], 1), _c("NcActionButton", { attrs: { "close-after-click": true }, on: { "click": _vm.handleDeleteAlbum } }, [_vm._v(" " + _vm._s(_vm.t("photos", "Delete album")) + " "), _c("DeleteOutline", { attrs: { "slot": "icon" }, slot: "icon" })], 1), selectedFileIds.length > 0 ? [_c("NcActionSeparator"), _c("ActionFavorite", { attrs: { "selected-file-ids": selectedFileIds } }), _vm.removableSelectedFiles.length !== 0 ? _c("NcActionButton", { attrs: { "close-after-click": true }, on: { "click": function($event) {
      return _vm.handleRemoveFilesFromAlbum(_vm.removableSelectedFiles);
    } } }, [_vm._v(" " + _vm._s(_vm.t("photos", "Remove selection from album")) + " "), _c("Close", { attrs: { "slot": "icon" }, slot: "icon" })], 1) : _vm._e()] : _vm._e()], 2)], 1) : _vm._e()], 2);
  } }]) }, [_vm.album !== void 0 && _vm.album.attributes.nbItems === 0 && !(_vm.loadingCollectionFiles || _vm.loadingCollection) ? _c("NcEmptyContent", { staticClass: "album__empty", attrs: { "slot": "empty-content", "name": _vm.t("photos", "This album does not have any photos or videos yet!") }, slot: "empty-content" }, [_c("ImagePlusOutline", { attrs: { "slot": "icon" }, slot: "icon" }), _c("NcButton", { staticClass: "album__empty__button", attrs: { "slot": "action", "type": "primary", "aria-label": _vm.t("photos", "Add photos to this album") }, on: { "click": function($event) {
    _vm.showAddPhotosModal = true;
  } }, slot: "action" }, [_c("Plus", { attrs: { "slot": "icon" }, slot: "icon" }), _vm._v(" " + _vm._s(_vm.t("photos", "Add")) + " ")], 1)], 1) : _vm._e()], 1), _vm.album !== void 0 ? _c("PhotosPicker", { attrs: { "open": _vm.showAddPhotosModal, "blacklist-ids": _vm.albumFileIds, "destination": _vm.album.basename, "name": _vm.t("photos", "Add photos to {albumName}", { albumName: _vm.albumName }) }, on: { "update:open": function($event) {
    _vm.showAddPhotosModal = $event;
  }, "files-picked": _vm.handleFilesPicked } }) : _vm._e(), _vm.showManageCollaboratorView && _vm.album !== void 0 ? _c("NcModal", { attrs: { "name": _vm.t("photos", "Manage collaborators") }, on: { "close": function($event) {
    _vm.showManageCollaboratorView = false;
  } } }, [_c("CollaboratorsSelectionForm", { attrs: { "album-name": _vm.album.basename, "collaborators": _vm.album.attributes.collaborators }, scopedSlots: _vm._u([{ key: "default", fn: function({ collaborators }) {
    return [_c("NcButton", { attrs: { "aria-label": _vm.t("photos", "Save collaborators for this album."), "type": "primary", "disabled": _vm.loadingAddCollaborators }, on: { "click": function($event) {
      return _vm.handleSetCollaborators(collaborators);
    } }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
      return [_vm.loadingAddCollaborators ? _c("NcLoadingIcon") : _vm._e()];
    }, proxy: true }], null, true) }, [_vm._v(" " + _vm._s(_vm.t("photos", "Save")) + " ")])];
  } }], null, false, 4241097308) })], 1) : _vm._e(), _vm.showEditAlbumForm ? _c("NcDialog", { attrs: { "name": _vm.t("photos", "Edit album details"), "close-on-click-outside": "", "size": "normal" }, on: { "closing": function($event) {
    _vm.showEditAlbumForm = false;
  } } }, [_c("AlbumForm", { attrs: { "album": _vm.album }, on: { "done": (event) => _vm.handleAlbumUpdate(event) } })], 1) : _vm._e()], 1);
};
var _sfc_staticRenderFns = [];
_sfc_render._withStripped = true;
var __component__ = /* @__PURE__ */ normalizeComponent(
  _sfc_main,
  _sfc_render,
  _sfc_staticRenderFns,
  false,
  null,
  "9ef5f385"
);
__component__.options.__file = "/Users/effem/workbench/git/personel/photos/src/views/AlbumContent.vue";
const AlbumContent = __component__.exports;
export {
  AlbumContent as default
};
//# sourceMappingURL=AlbumContent-GSQL_cX8.chunk.mjs.map
