const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { m as moment, v as validateFilename, I as InvalidFilenameError, c as InvalidFilenameErrorReason } from "./index-Cokc0amN.chunk.mjs";
import { t as translate, ad as v, _, g as getCurrentUser, L as resultToNode, $ as U } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
import { N as NcButton, l as logger, aj as showError, q as albumsExtraProps, k as cancelableClient, f as NcLoadingIcon, o as albumsPrefix } from "./index-BOzawWmL.chunk.mjs";
import { a as NcTextField } from "./NcTextField-o_8gWurX-9cj68FP2.chunk.mjs";
import { L as Earth, N as Check, O as ContentCopy, A as AccountGroupOutline, x as Close, n as normalizeComponent, Q as SendOutline, R as AccountMultiplePlusOutline, M as MapMarkerOutline } from "./icons-BZLMM6Xn.chunk.mjs";
import { P as PhotosFiltersDisplay, a as PhotosFiltersInput, f as filters } from "./PhotosFiltersInput-C83ZrtRE.chunk.mjs";
import { S as ShareType } from "./index-DzppFRs6.chunk.mjs";
import { N as NcSelect, a as NcListItemIcon } from "./NcSelect-CjUzohn5-OrPoxx8A.chunk.mjs";
import { F as FetchCollectionContentMixin } from "./FetchCollectionContentMixin-ank00rhB.chunk.mjs";
const AccountGroupOutlineSvg = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20id='mdi-account-group-outline'%20viewBox='0%200%2024%2024'%3e%3cpath%20d='M12,5A3.5,3.5%200%200,0%208.5,8.5A3.5,3.5%200%200,0%2012,12A3.5,3.5%200%200,0%2015.5,8.5A3.5,3.5%200%200,0%2012,5M12,7A1.5,1.5%200%200,1%2013.5,8.5A1.5,1.5%200%200,1%2012,10A1.5,1.5%200%200,1%2010.5,8.5A1.5,1.5%200%200,1%2012,7M5.5,8A2.5,2.5%200%200,0%203,10.5C3,11.44%203.53,12.25%204.29,12.68C4.65,12.88%205.06,13%205.5,13C5.94,13%206.35,12.88%206.71,12.68C7.08,12.47%207.39,12.17%207.62,11.81C6.89,10.86%206.5,9.7%206.5,8.5C6.5,8.41%206.5,8.31%206.5,8.22C6.2,8.08%205.86,8%205.5,8M18.5,8C18.14,8%2017.8,8.08%2017.5,8.22C17.5,8.31%2017.5,8.41%2017.5,8.5C17.5,9.7%2017.11,10.86%2016.38,11.81C16.5,12%2016.63,12.15%2016.78,12.3C16.94,12.45%2017.1,12.58%2017.29,12.68C17.65,12.88%2018.06,13%2018.5,13C18.94,13%2019.35,12.88%2019.71,12.68C20.47,12.25%2021,11.44%2021,10.5A2.5,2.5%200%200,0%2018.5,8M12,14C9.66,14%205,15.17%205,17.5V19H19V17.5C19,15.17%2014.34,14%2012,14M4.71,14.55C2.78,14.78%200,15.76%200,17.5V19H3V17.07C3,16.06%203.69,15.22%204.71,14.55M19.29,14.55C20.31,15.22%2021,16.06%2021,17.07V19H24V17.5C24,15.76%2021.22,14.78%2019.29,14.55M12,16C13.53,16%2015.24,16.5%2016.23,17H7.77C8.76,16.5%2010.47,16%2012,16Z'%20/%3e%3c/svg%3e";
const _sfc_main$1 = {
  name: "CollaboratorsSelectionForm",
  components: {
    Close,
    AccountGroupOutline,
    ContentCopy,
    Check,
    Earth,
    NcButton,
    NcListItemIcon,
    NcSelect
  },
  mixins: [FetchCollectionContentMixin],
  props: {
    albumName: {
      type: String,
      required: true
    },
    collaborators: {
      type: Array,
      default: () => []
    },
    allowPublicLink: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      searchText: null,
      availableCollaborators: {},
      selectedCollaboratorsKeys: [],
      currentSearchResults: [],
      loadingCollaborators: false,
      randomId: Math.random().toString().substring(2, 10),
      publicLinkCopied: false,
      collaboratorTypes: ShareType,
      config: {
        minSearchStringLength: parseInt(OC.config["sharing.minSearchStringLength"], 10) || 0
      }
    };
  },
  computed: {
    searchResults() {
      return this.currentSearchResults.filter(({ id }) => id !== getCurrentUser()?.uid).map((collaborator) => {
        return {
          ...collaborator,
          key: `${collaborator.type}:${collaborator.id}`,
          iconSvg: collaborator.type === ShareType.Group ? AccountGroupOutlineSvg : void 0
        };
      }).filter(({ key }) => !this.selectedCollaboratorsKeys.includes(key));
    },
    listableSelectedCollaboratorsKeys() {
      return this.selectedCollaboratorsKeys.filter((collaboratorKey) => this.availableCollaborators[collaboratorKey].type !== ShareType.Link);
    },
    selectedCollaborators() {
      return this.selectedCollaboratorsKeys.map((collaboratorKey) => this.availableCollaborators[collaboratorKey]);
    },
    isPublicLinkSelected() {
      return this.selectedCollaboratorsKeys.includes(`${ShareType.Link}`);
    },
    publicLink() {
      return this.availableCollaborators[ShareType.Link];
    },
    publicLinkURL() {
      return `${window.location.protocol}//${window.location.host}${_(`apps/photos/public/${this.publicLink.id}`)}`;
    },
    albumFileName() {
      return this.$store.getters.getAlbumName(this.albumName);
    }
  },
  watch: {
    collaborators(collaborators) {
      this.populateCollaborators(collaborators);
    }
  },
  mounted() {
    this.populateCollaborators(this.collaborators);
  },
  methods: {
    /**
     * Fetch possible collaborators.
     *
     * @param query
     */
    async searchCollaborators(query) {
      if (query === void 0) {
        return;
      }
      query = query.trim();
      if (query.length < this.config.minSearchStringLength) {
        return;
      }
      try {
        this.loadingCollaborators = true;
        const response = await cancelableClient.get(v("core/autocomplete/get"), {
          params: {
            search: query,
            itemType: "share-recipients",
            shareTypes: [
              ShareType.User,
              ShareType.Group
            ]
          }
        });
        this.currentSearchResults = response.data.ocs.data.map((collaborator) => {
          switch (collaborator.source) {
            case "users":
              return { id: collaborator.id, label: collaborator.label, type: ShareType.User };
            case "groups":
              return { id: collaborator.id, label: collaborator.label, type: ShareType.Group };
            default:
              throw new Error(`Invalid collaborator source ${collaborator.source}`);
          }
        });
        this.availableCollaborators = {
          ...this.availableCollaborators,
          ...this.currentSearchResults.reduce(this.indexCollaborators, {})
        };
      } catch (error) {
        this.errorFetchingCollaborators = error;
        logger.error(this.t("photos", "Failed to fetch collaborators list."), { error });
        showError(this.t("photos", "Failed to fetch collaborators list."));
      } finally {
        this.loadingCollaborators = false;
      }
    },
    /**
     * Populate selectedCollaboratorsKeys and availableCollaborators.
     *
     * @param collaborators
     */
    populateCollaborators(collaborators) {
      const initialCollaborators = collaborators.reduce(this.indexCollaborators, {});
      this.selectedCollaboratorsKeys = Object.keys(initialCollaborators);
      this.availableCollaborators = {
        3: {
          id: "",
          label: this.t("photos", "Public link"),
          type: ShareType.Link
        },
        ...this.availableCollaborators,
        ...initialCollaborators
      };
    },
    indexCollaborators(collaborators, collaborator) {
      return { ...collaborators, [`${collaborator.type}${collaborator.type === ShareType.Link ? "" : ":"}${collaborator.type === ShareType.Link ? "" : collaborator.id}`]: collaborator };
    },
    async createPublicLinkForAlbum() {
      this.selectEntity(`${ShareType.Link}`);
      await this.updateAlbumCollaborators();
      await this.fetchCollection(
        this.albumFileName,
        albumsExtraProps
      );
    },
    async deletePublicLink() {
      this.unselectEntity(`${ShareType.Link}`);
      this.availableCollaborators[3] = {
        id: "",
        label: this.t("photos", "Public link"),
        type: ShareType.Link
      };
      this.publicLinkCopied = false;
      await this.updateAlbumCollaborators();
    },
    async updateAlbumCollaborators() {
      try {
        await this.$store.dispatch("updateCollection", {
          collectionFileName: this.albumFileName,
          properties: {
            collaborators: this.selectedCollaborators
          }
        });
      } catch (error) {
        logger.error("[PublicAlbumContent] Error updating album", { error });
        showError(this.t("photos", "Failed to update album."));
      }
    },
    async copyPublicLink() {
      await navigator.clipboard.writeText(this.publicLinkURL);
      this.publicLinkCopied = true;
      setTimeout(() => {
        this.publicLinkCopied = false;
      }, 1e4);
    },
    selectEntity(collaboratorKey) {
      this.searchText = null;
      if (this.selectedCollaboratorsKeys.includes(collaboratorKey)) {
        return;
      }
      this.selectedCollaboratorsKeys.push(collaboratorKey);
    },
    unselectEntity(collaboratorKey) {
      const index = this.selectedCollaboratorsKeys.indexOf(collaboratorKey);
      if (index === -1) {
        return;
      }
      this.selectedCollaboratorsKeys.splice(index, 1);
    },
    t: translate
  }
};
var _sfc_render$1 = function render() {
  var _vm = this, _c = _vm._self._c;
  return _c("div", { staticClass: "manage-collaborators" }, [_c("h2", { staticClass: "manage-collaborators__title" }, [_vm._v(" " + _vm._s(_vm.t("photos", "Add collaborators")) + " ")]), _c("form", { staticClass: "manage-collaborators__form", on: { "submit": function($event) {
    $event.preventDefault();
  } } }, [_c("NcSelect", { attrs: { "input-id": "sharing-search-input", "input-label": _vm.t("photos", "Add people or groups who can edit your album"), "loading": _vm.loadingCollaborators, "label": "label", "filterable": false, "placeholder": _vm.t("photos", "Search people or groups"), "clear-search-on-blur": () => false, "user-select": true, "append-to-body": false, "options": _vm.searchResults }, on: { "search": _vm.searchCollaborators, "option:selected": ({ key }) => _vm.selectEntity(key) }, model: { value: _vm.searchText, callback: function($$v) {
    _vm.searchText = $$v;
  }, expression: "searchText" } }, [_vm._v(" " + _vm._s(_vm.t("photos", "No recommendations. Start typing.")) + " ")])], 1), _c("ul", { staticClass: "manage-collaborators__selection" }, _vm._l(_vm.listableSelectedCollaboratorsKeys, function(collaboratorKey) {
    return _c("li", { key: collaboratorKey, staticClass: "manage-collaborators__selection__item" }, [_c("NcListItemIcon", { attrs: { "id": _vm.availableCollaborators[collaboratorKey].id, "display-name": _vm.availableCollaborators[collaboratorKey].label, "name": _vm.availableCollaborators[collaboratorKey].label, "user": _vm.availableCollaborators[collaboratorKey].id, "is-no-user": _vm.availableCollaborators[collaboratorKey].type !== _vm.collaboratorTypes.User } }, [_vm.availableCollaborators[collaboratorKey].type === _vm.collaboratorTypes.Group ? _c("AccountGroupOutline", { attrs: { "title": _vm.t("photos", "Group") } }) : _vm._e(), _c("NcButton", { attrs: { "type": "tertiary", "aria-label": _vm.t("photos", "Remove {collaboratorLabel} from the collaborators list", { collaboratorLabel: _vm.availableCollaborators[collaboratorKey].label }) }, on: { "click": function($event) {
      return _vm.unselectEntity(collaboratorKey);
    } } }, [_c("Close", { attrs: { "slot": "icon", "size": 20 }, slot: "icon" })], 1)], 1)], 1);
  }), 0), _c("div", { staticClass: "actions" }, [_vm.allowPublicLink ? _c("div", { staticClass: "actions__public-link" }, [_vm.isPublicLinkSelected && _vm.publicLink.id !== "" ? [_c("NcButton", { staticClass: "manage-collaborators__public-link-button", attrs: { "aria-label": _vm.t("photos", "Copy the public link"), "title": _vm.publicLinkURL }, on: { "click": _vm.copyPublicLink }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
    return [_vm.publicLinkCopied ? _c("Check") : _c("ContentCopy")];
  }, proxy: true }], null, false, 845538853) }, [_vm.publicLinkCopied ? [_vm._v(" " + _vm._s(_vm.t("photos", "Public link copied!")) + " ")] : [_vm._v(" " + _vm._s(_vm.t("photos", "Copy public link")) + " ")]], 2), _c("NcButton", { attrs: { "type": "tertiary", "aria-label": _vm.t("photos", "Delete the public link") }, on: { "click": _vm.deletePublicLink } }, [_c("Close", { attrs: { "slot": "icon" }, slot: "icon" })], 1)] : _c("NcButton", { staticClass: "manage-collaborators__public-link-button", attrs: { "disabled": _vm.isPublicLinkSelected && _vm.publicLink.id === "", "aria-label": _vm.t("photos", "Create public link share") }, on: { "click": _vm.createPublicLinkForAlbum } }, [_c("Earth", { attrs: { "slot": "icon" }, slot: "icon" }), _vm._v(" " + _vm._s(_vm.t("photos", "Share via public link")) + " ")], 1)], 2) : _vm._e(), _c("div", { staticClass: "actions__slot" }, [_vm._t("default", null, { "collaborators": _vm.selectedCollaborators })], 2)])]);
};
var _sfc_staticRenderFns$1 = [];
_sfc_render$1._withStripped = true;
var __component__$1 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$1,
  _sfc_render$1,
  _sfc_staticRenderFns$1,
  false,
  null,
  "96455bc4"
);
__component__$1.options.__file = "/Users/effem/workbench/git/personel/photos/src/components/Albums/CollaboratorsSelectionForm.vue";
const CollaboratorsSelectionForm = __component__$1.exports;
const _sfc_main = {
  name: "AlbumForm",
  components: {
    MapMarkerOutline,
    AccountMultiplePlusOutline,
    SendOutline,
    NcButton,
    NcLoadingIcon,
    NcTextField,
    CollaboratorsSelectionForm,
    PhotosFiltersInput,
    PhotosFiltersDisplay
  },
  props: {
    album: {
      type: Object,
      default: null
    },
    filtersValue: {
      type: Object,
      default: () => ({})
    },
    displayBackButton: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showCollaboratorView: false,
      albumName: "",
      albumLocation: "",
      albumFilters: filters.reduce((acc, filter) => ({ ...acc, [filter.id]: [] }), {}),
      loading: false
    };
  },
  computed: {
    editMode() {
      return this.album !== null;
    },
    sharingEnabled() {
      return OC.Share !== void 0;
    },
    albumFileName() {
      return this.$store.getters.getAlbumName(this.albumName);
    },
    albumNameValidationError() {
      const existingAlbum = this.$store.getters.albums[this.albumFileName];
      if (existingAlbum !== void 0 && this.album !== existingAlbum && !this.loading) {
        return translate("files", "This name is already in use.");
      }
      try {
        validateFilename(this.albumName);
      } catch (error) {
        if (!(error instanceof InvalidFilenameError)) {
          throw error;
        }
        switch (error.reason) {
          case InvalidFilenameErrorReason.Character:
            return translate("files", '"{char}" is not allowed inside a filename.', { char: error.segment });
          case InvalidFilenameErrorReason.ReservedName:
            return void 0;
          // We don't need to enforce that for albums.
          case InvalidFilenameErrorReason.Extension:
            return void 0;
          // We don't need to enforce that for albums.
          default:
            return translate("files", "Invalid filename.");
        }
      }
      return void 0;
    },
    canSubmit() {
      return this.albumName !== "" && this.albumNameValidationError === void 0 && !this.loading;
    }
  },
  mounted() {
    if (this.editMode) {
      this.albumName = this.album?.basename;
      this.albumLocation = this.album?.attributes.location ?? "";
      this.albumFilters = {
        ...this.albumFilters,
        ...structuredClone(this.album?.attributes.filters ?? {})
      };
    } else {
      this.albumFilters = {
        ...this.albumFilters,
        ...structuredClone(this.filtersValue)
      };
    }
    this.$nextTick(() => {
      this.$refs.nameInput.$el.getElementsByTagName("input")[0].focus();
    });
  },
  methods: {
    submit(collaborators = []) {
      if (!this.canSubmit) {
        return;
      }
      if (this.editMode) {
        this.handleUpdateAlbum();
      } else {
        this.handleCreateAlbum(collaborators);
      }
    },
    async handleCreateAlbum(collaborators = []) {
      try {
        this.loading = true;
        const localAlbum = resultToNode({
          basename: this.albumName,
          filename: albumsPrefix + "/" + this.albumName,
          lastmod: "",
          size: 0,
          type: "directory",
          etag: null,
          props: {
            displayname: this.albumName,
            resourcetype: {},
            nbItems: 0,
            location: this.albumLocation,
            "last-photo": -1,
            date: moment().format("MMMM YYYY"),
            collaborators,
            filters: this.filtersValue,
            source: U(`dav/${this.albumFileName}`)
          }
        }, albumsPrefix);
        let album = await this.$store.dispatch("createCollection", { collection: localAlbum });
        if (album === void 0) {
          return;
        }
        const propertiesToUpdate = {};
        if (this.albumLocation !== "") {
          propertiesToUpdate.location = this.albumLocation;
        }
        if (this.albumLocation !== "" || collaborators.length !== 0) {
          propertiesToUpdate.collaborators = collaborators;
        }
        if (Object.keys(this.filtersValue).length > 0) {
          propertiesToUpdate.filters = this.filtersValue;
        }
        album = await this.$store.dispatch("updateCollection", {
          collectionFileName: this.albumFileName,
          properties: propertiesToUpdate
        });
        this.$emit("done", { album });
      } finally {
        this.loading = false;
      }
    },
    async handleUpdateAlbum() {
      try {
        this.loading = true;
        let album = this.album?.clone();
        const changes = [];
        if (this.album !== null && this.album.basename !== this.albumName) {
          changes.push("name");
          album = await this.$store.dispatch("renameCollection", { collectionFileName: this.album.root + this.album.path, newBaseName: this.albumName });
        }
        if (this.album !== null && this.album.attributes.location !== this.albumLocation) {
          changes.push("location");
          album = await this.$store.dispatch("updateCollection", { collectionFileName: album.root + album.path, properties: { location: this.albumLocation } });
        }
        if (this.album !== null && JSON.stringify(this.album.attributes.filters) !== JSON.stringify(this.albumFilters)) {
          changes.push("filters");
          album = await this.$store.dispatch("updateCollection", { collectionFileName: album.root + album.path, properties: { filters: this.albumFilters } });
        }
        this.$emit("done", { album, changes });
      } finally {
        this.loading = false;
      }
    },
    selectFilter(filterOption) {
      this.albumFilters[filterOption.filterId].push(filterOption.value);
    },
    deselectFilter(filterOption) {
      const index = this.albumFilters[filterOption.filterId].indexOf(filterOption.value);
      if (index !== -1) {
        this.albumFilters[filterOption.filterId].splice(index, 1);
      }
    },
    back() {
      this.$emit("back");
    },
    t: translate
  }
};
var _sfc_render = function render2() {
  var _vm = this, _c = _vm._self._c;
  return !_vm.showCollaboratorView ? _c("form", { staticClass: "album-form", on: { "submit": function($event) {
    $event.preventDefault();
    return _vm.submit();
  } } }, [_c("div", { staticClass: "form-inputs" }, [_c("NcTextField", { ref: "nameInput", attrs: { "value": _vm.albumName, "type": "text", "name": "name", "helper-text": _vm.albumNameValidationError, "error": _vm.albumNameValidationError !== void 0, "required": true, "label": _vm.t("photos", "Name of the album") }, on: { "update:value": function($event) {
    _vm.albumName = $event;
  } } }), _c("NcTextField", { attrs: { "value": _vm.albumLocation, "name": "location", "type": "text", "label": _vm.t("photos", "Location of the album") }, on: { "update:value": function($event) {
    _vm.albumLocation = $event;
  } }, scopedSlots: _vm._u([{ key: "default", fn: function() {
    return [_c("MapMarkerOutline", { attrs: { "size": 20 } })];
  }, proxy: true }], null, false, 3863723734) })], 1), _c("PhotosFiltersInput", { attrs: { "selected-filters": _vm.albumFilters }, on: { "select-filter": _vm.selectFilter } }), _c("PhotosFiltersDisplay", { attrs: { "selected-filters": _vm.albumFilters }, on: { "deselect-filter": _vm.deselectFilter } }), _c("div", { staticClass: "form-buttons" }, [_c("span", { staticClass: "left-buttons" }, [_vm.displayBackButton ? _c("NcButton", { attrs: { "type": "tertiary" }, on: { "click": _vm.back } }, [_vm._v(" " + _vm._s(_vm.t("photos", "Back")) + " ")]) : _vm._e()], 1), _c("span", { staticClass: "right-buttons" }, [_vm.sharingEnabled && !_vm.editMode ? _c("NcButton", { attrs: { "type": "secondary", "disabled": !_vm.canSubmit }, on: { "click": function($event) {
    _vm.showCollaboratorView = true;
  } }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
    return [_c("AccountMultiplePlusOutline", { attrs: { "size": 20 } })];
  }, proxy: true }], null, false, 1381680579) }, [_vm._v(" " + _vm._s(_vm.t("photos", "Add collaborators")) + " ")]) : _vm._e(), _c("NcButton", { attrs: { "type": "primary", "disabled": !_vm.canSubmit }, on: { "click": function($event) {
    return _vm.submit();
  } }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
    return [_vm.loading ? _c("NcLoadingIcon", { attrs: { "size": 20 } }) : _c("SendOutline", { attrs: { "size": 20 } })];
  }, proxy: true }], null, false, 2348760288) }, [_vm._v(" " + _vm._s(_vm.editMode ? _vm.t("photos", "Save") : _vm.t("photos", "Create album")) + " ")])], 1)])], 1) : _c("CollaboratorsSelectionForm", { attrs: { "album-name": _vm.albumName, "allow-public-link": false }, scopedSlots: _vm._u([{ key: "default", fn: function({ collaborators }) {
    return [_c("span", { staticClass: "left-buttons" }, [_c("NcButton", { attrs: { "type": "tertiary" }, on: { "click": function($event) {
      _vm.showCollaboratorView = false;
    } } }, [_vm._v(" " + _vm._s(_vm.t("photos", "Back")) + " ")])], 1), _c("span", { staticClass: "right-buttons" }, [_c("NcButton", { attrs: { "type": "primary", "disabled": _vm.albumName.trim() === "" || _vm.loading }, on: { "click": function($event) {
      return _vm.submit(collaborators);
    } }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
      return [_vm.loading ? _c("NcLoadingIcon", { attrs: { "size": 20 } }) : _c("SendOutline", { attrs: { "size": 20 } })];
    }, proxy: true }], null, true) }, [_vm._v(" " + _vm._s(_vm.editMode ? _vm.t("photos", "Save") : _vm.t("photos", "Create album")) + " ")])], 1)];
  } }]) });
};
var _sfc_staticRenderFns = [];
_sfc_render._withStripped = true;
var __component__ = /* @__PURE__ */ normalizeComponent(
  _sfc_main,
  _sfc_render,
  _sfc_staticRenderFns,
  false,
  null,
  "3e711de0"
);
__component__.options.__file = "/Users/effem/workbench/git/personel/photos/src/components/Albums/AlbumForm.vue";
const AlbumForm = __component__.exports;
export {
  AlbumForm as A,
  CollaboratorsSelectionForm as C
};
//# sourceMappingURL=AlbumForm-DS-1aALG.chunk.mjs.map
