const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { a as FaceCoverMixin, F as FetchFacesMixin, b as FaceCover } from "./FaceCover-D9Oq7nJI.chunk.mjs";
import { n as normalizeComponent } from "./icons-BZLMM6Xn.chunk.mjs";
const _sfc_main = {
  name: "FaceMergeForm",
  components: { FaceCover },
  mixins: [
    FaceCoverMixin,
    FetchFacesMixin
  ],
  props: {
    firstFace: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: false
    };
  },
  computed: {
    files() {
      return this.$store.state.files.files;
    },
    faces() {
      return this.$store.state.faces.faces;
    },
    facesFiles() {
      return this.$store.getters.facesFiles;
    },
    filteredFaces() {
      return Object.values(this.faces).filter((face) => face.basename !== this.firstFace).sort((a, b) => {
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
    handleSelect(faceName) {
      this.$emit("select", faceName);
      this.loading = true;
    }
  }
};
var _sfc_render = function render() {
  var _vm = this, _c = _vm._self._c;
  return _c("div", { staticClass: "merge-form face-list" }, _vm._l(_vm.filteredFaces, function(face) {
    return _c("FaceCover", { key: face.basename, attrs: { "base-name": face.basename, "small": "" }, on: { "click": function($event) {
      return _vm.handleSelect(face.basename);
    } } });
  }), 1);
};
var _sfc_staticRenderFns = [];
_sfc_render._withStripped = true;
var __component__ = /* @__PURE__ */ normalizeComponent(
  _sfc_main,
  _sfc_render,
  _sfc_staticRenderFns,
  false,
  null,
  "2fd738e4"
);
__component__.options.__file = "/Users/effem/workbench/git/personel/photos/src/components/Faces/FaceMergeForm.vue";
const FaceMergeForm = __component__.exports;
export {
  FaceMergeForm as F
};
//# sourceMappingURL=FaceMergeForm-DoeSX4qj.chunk.mjs.map
