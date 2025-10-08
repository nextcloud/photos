const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { L as Link } from "./video-C5pfp5p8.chunk.mjs";
import { a as translatePlural, t as translate } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
import { N as NcEmptyContent } from "./NcEmptyContent-EDU4qhab.chunk.mjs";
import { f as NcLoadingIcon } from "./index-BOzawWmL.chunk.mjs";
import { U as AccountOffOutlineIcon, n as normalizeComponent, s as AccountBoxMultipleOutline } from "./icons-BZLMM6Xn.chunk.mjs";
import { F as FetchFacesMixin, a as FaceCoverMixin, b as FaceCover } from "./FaceCover-D9Oq7nJI.chunk.mjs";
import "./preload-helper-BO5AHt9u.chunk.mjs";
import "./index-Cokc0amN.chunk.mjs";
import "./AbortControllerMixin-B_otrjDn.chunk.mjs";
const _sfc_main$1 = {
  name: "UnassignedFacesCover",
  components: { AccountOffOutlineIcon },
  mixins: [
    FetchFacesMixin,
    FaceCoverMixin
  ],
  props: {
    small: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    unassignedFilesCount() {
      return this.$store.state.faces.unassignedFilesCount;
    },
    colorMainBackground() {
      return getComputedStyle(document.documentElement).getPropertyValue("--color-main-background");
    }
  },
  async mounted() {
    await this.fetchUnassignedFacesCount();
  },
  methods: {
    n: translatePlural
  }
};
var _sfc_render$1 = function render() {
  var _vm = this, _c = _vm._self._c;
  return _c("div", { class: ["face-cover", _vm.small && "face-cover--small"], on: { "click": function($event) {
    return _vm.$emit("click");
  } } }, [_c("div", { staticClass: "face-cover__crop-container" }, [_c("AccountOffOutlineIcon", { attrs: { "size": 128, "fill-color": _vm.colorMainBackground } })], 1), _c("div", { staticClass: "face-cover__details" }, [!_vm.small ? _c("div", { staticClass: "face-cover__details__second-line" }, [_vm._v(" " + _vm._s(_vm.n("photos", "%n unassigned photo", "%n unassigned photos", _vm.unassignedFilesCount)) + " ")]) : _vm._e()])]);
};
var _sfc_staticRenderFns$1 = [];
_sfc_render$1._withStripped = true;
var __component__$1 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$1,
  _sfc_render$1,
  _sfc_staticRenderFns$1,
  false,
  null,
  "d2056b7d"
);
__component__$1.options.__file = "/Users/effem/workbench/git/personel/photos/src/components/Faces/UnassignedFacesCover.vue";
const UnassignedFacesCover = __component__$1.exports;
const _sfc_main = {
  name: "FacesView",
  components: {
    UnassignedFacesCover,
    FaceCover,
    NcEmptyContent,
    NcLoadingIcon,
    RouterLink: Link,
    AccountBoxMultipleOutline
  },
  mixins: [FetchFacesMixin],
  computed: {
    facesFiles() {
      return this.$store.state.faces.facesFiles;
    },
    unassignedFilesCount() {
      return this.$store.state.faces.unassignedFilesCount;
    },
    noFaces() {
      return Object.keys(this.faces).length === 0;
    },
    orderedFaces() {
      return Object.values(this.faces).sort((a, b) => {
        if (a.attributes.nbItems && b.attributes.nbItems) {
          return b.attributes.nbItems - a.attributes.nbItems;
        }
        if (!this.facesFiles[b.basename] || !this.facesFiles[a.basename]) {
          return 0;
        }
        return this.facesFiles[b.basename].length - this.facesFiles[a.basename].length;
      });
    }
  },
  methods: {
    t: translate
  }
};
var _sfc_render = function render2() {
  var _vm = this, _c = _vm._self._c;
  return _vm.errorFetchingFaces ? _c("NcEmptyContent", [_vm._v(" " + _vm._s(_vm.t("photos", "An error occurred")) + " ")]) : _c("div", { staticClass: "faces" }, [_vm.loadingFaces ? _c("NcLoadingIcon") : _vm._e(), _vm.noFaces && !_vm.loadingFaces ? _c("div", { staticClass: "faces__empty" }, [_c("NcEmptyContent", { staticClass: "empty-content-with-illustration", scopedSlots: _vm._u([{ key: "icon", fn: function() {
    return [_c("AccountBoxMultipleOutline")];
  }, proxy: true }, { key: "desc", fn: function() {
    return [_vm._v(" " + _vm._s(_vm.t("photos", "This might take some time depending on the size of your photo library.")) + " ")];
  }, proxy: true }], null, false, 149048332) }, [_vm._v(" " + _vm._s(_vm.t("photos", "Recognized people will show up here")) + " ")])], 1) : !_vm.noFaces ? _c("div", { staticClass: "faces__list" }, [_vm._l(_vm.orderedFaces, function(face) {
    return _c("RouterLink", { key: face.basename, attrs: { "to": `/faces/${encodeURIComponent(face.basename)}` } }, [_c("FaceCover", { attrs: { "base-name": face.basename } })], 1);
  }), _c("RouterLink", { key: "unassigned", attrs: { "to": `/faces/unassigned` } }, [_c("UnassignedFacesCover")], 1)], 2) : _vm._e()], 1);
};
var _sfc_staticRenderFns = [];
_sfc_render._withStripped = true;
var __component__ = /* @__PURE__ */ normalizeComponent(
  _sfc_main,
  _sfc_render,
  _sfc_staticRenderFns,
  false,
  null,
  "d2f21a57"
);
__component__.options.__file = "/Users/effem/workbench/git/personel/photos/src/views/FacesView.vue";
const FacesView = __component__.exports;
export {
  FacesView as default
};
//# sourceMappingURL=FacesView-BoU8nD_z.chunk.mjs.map
