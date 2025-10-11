const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { d as defineComponent, a as translatePlural, t as translate, _ } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
import { N as NcEmptyContent } from "./NcEmptyContent-EDU4qhab.chunk.mjs";
import { f as NcLoadingIcon, l as logger } from "./index-BOzawWmL.chunk.mjs";
import { L as Link } from "./video-C5pfp5p8.chunk.mjs";
import { j as ImageMultipleOutline, n as normalizeComponent } from "./icons-BZLMM6Xn.chunk.mjs";
import { A as AbortControllerMixin } from "./AbortControllerMixin-B_otrjDn.chunk.mjs";
import "./index-Cokc0amN.chunk.mjs";
import "./preload-helper-BO5AHt9u.chunk.mjs";
const _sfc_main$1 = defineComponent({
  name: "TagCover",
  components: {
    RouterLink: Link,
    ImageMultipleOutline
  },
  mixins: [AbortControllerMixin],
  props: {
    tag: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loadCover: false,
      observer: null
    };
  },
  computed: {
    tags() {
      return this.$store.state.systemtags.tags;
    },
    files() {
      return this.$store.state.files.files;
    },
    coverUrl() {
      if (!this.loadCover) {
        return "";
      }
      return _(`/core/preview?fileId=${this.tag.attributes["reference-fileid"]}&x=${512}&y=${512}&forceIcon=0&a=1`);
    },
    count() {
      return this.tag.attributes["files-assigned"];
    }
  },
  watch: {
    loadCover() {
      if (this.tag.attributes["files-assigned"]) {
        return;
      }
      this.$store.dispatch("fetchTagFiles", { id: this.tag.attributes.id, signal: this.abortController.signal });
    }
  },
  mounted() {
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.loadCover = true;
        this.observer?.disconnect();
      }
    });
    this.observer.observe(this.$el);
  },
  methods: {
    t: translate,
    n: translatePlural
  }
});
var _sfc_render$1 = function render() {
  var _vm = this, _c = _vm._self._c;
  _vm._self._setupProxy;
  return _c("RouterLink", { staticClass: "tag-cover", attrs: { "to": `/tags/${_vm.tag.attributes["display-name"]}` } }, [_vm.tag.attributes["files-assigned"] !== 0 ? _c("img", { staticClass: "tag-cover__image", attrs: { "src": _vm.coverUrl } }) : _c("div", { staticClass: "tag-cover__image tag-cover__image--placeholder" }, [_c("ImageMultipleOutline", { attrs: { "size": 128 } })], 1), _c("div", { staticClass: "tag-cover__details" }, [_c("div", { staticClass: "tag-cover__details__first-line" }, [_c("h3", { staticClass: "tag-cover__details__name" }, [_vm._v(" " + _vm._s(_vm.t("recognize", _vm.tag.attributes["display-name"])) + " ")])]), _c("div", { staticClass: "tag-cover__details__second-line" }, [_vm._v(" " + _vm._s(_vm.n("photos", "%n photo", "%n photos", _vm.count)) + " ")])])]);
};
var _sfc_staticRenderFns$1 = [];
_sfc_render$1._withStripped = true;
var __component__$1 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$1,
  _sfc_render$1,
  _sfc_staticRenderFns$1,
  false,
  null,
  "928a2a69"
);
__component__$1.options.__file = "/Users/effem/workbench/git/personel/photos/src/components/TagCover.vue";
const TagCover = __component__$1.exports;
const _sfc_main = defineComponent({
  name: "TagsView",
  components: {
    TagCover,
    NcLoadingIcon,
    NcEmptyContent
  },
  mixins: [AbortControllerMixin],
  data() {
    return {
      error: null,
      loading: false,
      showTags: false
    };
  },
  computed: {
    files() {
      return this.$store.state.files.files;
    },
    tags() {
      return this.$store.state.systemtags.tags;
    },
    tagsNames() {
      return this.$store.state.systemtags.names;
    },
    tagsList() {
      return Object.keys(this.tagsNames).map((tagName) => this.tags[this.tagsNames[tagName]]).filter((tag) => tag && tag.attributes.id);
    },
    popularTags() {
      return Object.keys(this.tagsNames).filter((tagName) => this.tags[this.tagsNames[tagName]].attributes["files-assigned"] > 50).sort((a, b) => this.tags[this.tagsNames[b]]["files-assigned"] - this.tags[this.tagsNames[a]]["files-assigned"]).slice(0, 9).map((tagName) => this.tags[this.tagsNames[tagName]]);
    }
  },
  async beforeMount() {
    await this.fetchRootContent();
  },
  methods: {
    async fetchRootContent() {
      window.OCA.Viewer.close();
      this.error = null;
      try {
        if (!this.tagsList.length) {
          this.loading = true;
          await this.$store.dispatch("fetchAllTags", {
            signal: this.abortController.signal
          });
        }
      } catch (error) {
        logger.error("Failed to fetch tags", { error });
        this.error = true;
      } finally {
        this.loading = false;
      }
    },
    t: translate
  }
});
var _sfc_render = function render2() {
  var _vm = this, _c = _vm._self._c;
  _vm._self._setupProxy;
  return _c("div", [_vm.error ? _c("NcEmptyContent", { attrs: { "name": _vm.t("photos", "An error occurred") } }) : _vm._e(), !_vm.loading && _vm.tagsList.length === 0 ? _c("NcEmptyContent", { attrs: { "name": _vm.t("photos", "No tags yet"), "description": _vm.t("photos", "Photos with tags will show up here") } }) : _vm._e(), _vm.loading ? _c("NcLoadingIcon", { staticClass: "loader" }) : _c("div", { staticClass: "container" }, [_vm.popularTags.length ? _c("h2", [_vm._v(" " + _vm._s(_vm.t("photos", "Popular tags")) + " ")]) : _vm._e(), _c("div", { staticClass: "popular-tags" }, _vm._l(_vm.popularTags, function(tag) {
    return _c("TagCover", { key: tag.attributes.id, attrs: { "tag": tag } });
  }), 1), _vm.tagsList.length ? _c("h2", [_vm._v(" " + _vm._s(_vm.t("photos", "All tags")) + " ")]) : _vm._e(), _c("div", { staticClass: "tags" }, _vm._l(_vm.tagsList, function(tag) {
    return _c("TagCover", { key: tag.attributes.id, attrs: { "tag": tag } });
  }), 1)])], 1);
};
var _sfc_staticRenderFns = [];
_sfc_render._withStripped = true;
var __component__ = /* @__PURE__ */ normalizeComponent(
  _sfc_main,
  _sfc_render,
  _sfc_staticRenderFns,
  false,
  null,
  "4303f992"
);
__component__.options.__file = "/Users/effem/workbench/git/personel/photos/src/views/TagsView.vue";
const TagsView = __component__.exports;
export {
  TagsView as default
};
//# sourceMappingURL=TagsView-541Ha9is.chunk.mjs.map
