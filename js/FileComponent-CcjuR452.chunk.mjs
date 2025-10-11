const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { d as defineComponent, t as translate, _ } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
import { N as NcCheckboxRadioSwitch } from "./NcCheckboxRadioSwitch-VeztTzpz-CPNGlVnf.chunk.mjs";
import { n as normalizeComponent, Z as PlayCircleOutlineIcon, V as VideoOutline } from "./icons-BZLMM6Xn.chunk.mjs";
import { e as NcIconSvgWrapper } from "./index-BOzawWmL.chunk.mjs";
var q = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "#", "$", "%", "*", "+", ",", "-", ".", ":", ";", "=", "?", "@", "[", "]", "^", "_", "{", "|", "}", "~"], x = (t) => {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    let n = t[r], l = q.indexOf(n);
    e = e * 83 + l;
  }
  return e;
};
var f = (t) => {
  let e = t / 255;
  return e <= 0.04045 ? e / 12.92 : Math.pow((e + 0.055) / 1.055, 2.4);
}, h = (t) => {
  let e = Math.max(0, Math.min(1, t));
  return e <= 31308e-7 ? Math.trunc(e * 12.92 * 255 + 0.5) : Math.trunc((1.055 * Math.pow(e, 0.4166666666666667) - 0.055) * 255 + 0.5);
}, F = (t) => t < 0 ? -1 : 1, M = (t, e) => F(t) * Math.pow(Math.abs(t), e);
var d = class extends Error {
  constructor(e) {
    super(e), this.name = "ValidationError", this.message = e;
  }
};
var C = (t) => {
  if (!t || t.length < 6) throw new d("The blurhash string must be at least 6 characters");
  let e = x(t[0]), r = Math.floor(e / 9) + 1, n = e % 9 + 1;
  if (t.length !== 4 + 2 * n * r) throw new d(`blurhash length mismatch: length is ${t.length} but it should be ${4 + 2 * n * r}`);
}, z = (t) => {
  let e = t >> 16, r = t >> 8 & 255, n = t & 255;
  return [f(e), f(r), f(n)];
}, L = (t, e) => {
  let r = Math.floor(t / 361), n = Math.floor(t / 19) % 19, l = t % 19;
  return [M((r - 9) / 9, 2) * e, M((n - 9) / 9, 2) * e, M((l - 9) / 9, 2) * e];
}, U = (t, e, r, n) => {
  C(t), n = n | 1;
  let l = x(t[0]), m = Math.floor(l / 9) + 1, b = l % 9 + 1, i = (x(t[1]) + 1) / 166, u = new Array(b * m);
  for (let o = 0; o < u.length; o++) if (o === 0) {
    let a = x(t.substring(2, 6));
    u[o] = z(a);
  } else {
    let a = x(t.substring(4 + o * 2, 6 + o * 2));
    u[o] = L(a, i * n);
  }
  let c = e * 4, s = new Uint8ClampedArray(c * r);
  for (let o = 0; o < r; o++) for (let a = 0; a < e; a++) {
    let y = 0, B = 0, R = 0;
    for (let w = 0; w < m; w++) for (let P = 0; P < b; P++) {
      let G = Math.cos(Math.PI * a * P / e) * Math.cos(Math.PI * o * w / r), T = u[P + w * b];
      y += T[0] * G, B += T[1] * G, R += T[2] * G;
    }
    let V = h(y), I = h(B), E = h(R);
    s[4 * a + 0 + o * c] = V, s[4 * a + 1 + o * c] = I, s[4 * a + 2 + o * c] = E, s[4 * a + 3 + o * c] = 255;
  }
  return s;
}, j = U;
const StarSvg = '<svg xmlns="http://www.w3.org/2000/svg" id="mdi-star" viewBox="0 0 24 24"><path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" /></svg>';
const _sfc_main$1 = defineComponent({
  name: "FavoriteIcon",
  components: {
    NcIconSvgWrapper
  },
  data() {
    return {
      StarSvg
    };
  },
  mounted() {
    this.$nextTick(() => {
      const el = this.$el.querySelector("svg");
      el?.setAttribute?.("viewBox", "-4 -4 30 30");
    });
  },
  methods: {
    t: translate
  }
});
var _sfc_render$1 = function render() {
  var _vm = this, _c = _vm._self._c;
  _vm._self._setupProxy;
  return _c("NcIconSvgWrapper", { staticClass: "favorite-marker-icon", attrs: { "name": _vm.t("photos", "Favorite"), "svg": _vm.StarSvg } });
};
var _sfc_staticRenderFns$1 = [];
_sfc_render$1._withStripped = true;
var __component__$1 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$1,
  _sfc_render$1,
  _sfc_staticRenderFns$1,
  false,
  null,
  "d953cc34"
);
__component__$1.options.__file = "/Users/effem/workbench/git/personel/photos/src/components/FavoriteIcon.vue";
const FavoriteIcon = __component__$1.exports;
const SWCacheName = "images";
const hotCache = [];
const isCachedPreview = async function(previewUrl) {
  try {
    if (!hotCache[previewUrl]) {
      const cache = await window.caches?.open(SWCacheName);
      const response = await cache?.match(previewUrl);
      hotCache[previewUrl] = response !== void 0;
    }
    return hotCache[previewUrl];
  } catch {
    return false;
  }
};
const _sfc_main = {
  name: "FileComponent",
  components: {
    FavoriteIcon,
    NcCheckboxRadioSwitch,
    VideoOutline,
    PlayCircleOutlineIcon
  },
  inheritAttrs: false,
  props: {
    file: {
      type: Object,
      required: true
    },
    selected: {
      type: Boolean,
      default: false
    },
    allowSelection: {
      type: Boolean,
      default: true
    },
    distance: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      initialized: false,
      loadedSmall: false,
      errorSmall: false,
      loadedLarge: false,
      errorLarge: false
    };
  },
  computed: {
    ariaLabel() {
      if (this.file.attributes.favorite) {
        return translate("photos", 'Favorite image, open the full size "{name}" image', { name: this.file.basename });
      }
      return translate("photos", 'Open the full size "{name}" image', { name: this.file.basename });
    },
    isImage() {
      return this.file.mime?.startsWith("image") ?? false;
    },
    decodedEtag() {
      return this.file.attributes.etag.replace("&quot;", "").replace("&quot;", "");
    },
    srcLarge() {
      return this.getItemURL(512);
    },
    srcSmall() {
      return this.getItemURL(64);
    },
    isVisible() {
      return this.distance === 0;
    },
    hasBlurhash() {
      return this.file.attributes.metadataBlurhash !== void 0;
    }
  },
  watch: {
    async file() {
      this.initialized = false;
      this.loadedSmall = false;
      this.errorSmall = false;
      this.loadedLarge = false;
      this.errorLarge = false;
      await this.init();
    }
  },
  async mounted() {
    await this.init();
  },
  beforeDestroy() {
    if (this.$refs.imgSmall !== void 0) {
      this.$refs.imgSmall.src = "";
    }
    if (this.$refs.srcLarge !== void 0) {
      this.$refs.srcLarge.src = "";
    }
  },
  methods: {
    async init() {
      [this.loadedSmall, this.loadedLarge] = await Promise.all([
        await isCachedPreview(this.srcSmall),
        await isCachedPreview(this.srcLarge)
      ]);
      this.initialized = true;
      await this.$nextTick();
      this.drawBlurhash();
    },
    emitClick() {
      this.$emit("click", this.file.fileid);
    },
    onLoadSmall() {
      this.loadedSmall = true;
    },
    onLoadLarge() {
      this.loadedLarge = true;
    },
    onErrorSmall() {
      this.errorSmall = true;
    },
    onErrorLarge() {
      this.errorLarge = true;
    },
    onToggle(value) {
      this.$emit("select-toggled", { id: this.file.fileid, value });
    },
    getItemURL(size) {
      const token = this.$route?.params.token;
      if (token) {
        return _(`/apps/photos/api/v1/publicPreview/${this.file.fileid}?etag=${this.decodedEtag}&x=${size}&y=${size}&token=${token}`);
      } else {
        return _(`/apps/photos/api/v1/preview/${this.file.fileid}?etag=${this.decodedEtag}&x=${size}&y=${size}`);
      }
    },
    drawBlurhash() {
      if (!this.hasBlurhash || !this.$refs.canvas) {
        return;
      }
      const width = this.$refs.canvas.width;
      const height = this.$refs.canvas.height;
      const pixels = j(this.file.attributes.metadataBlurhash, width, height);
      const ctx = this.$refs.canvas.getContext("2d");
      const imageData = ctx.createImageData(width, height);
      imageData.data.set(pixels);
      ctx.putImageData(imageData, 0, 0);
    },
    t: translate
  }
};
var _sfc_render = function render2() {
  var _vm = this, _c = _vm._self._c;
  return _c("div", { staticClass: "file-container", class: { selected: _vm.selected }, attrs: { "data-test": "media" } }, [_c("a", { staticClass: "file", attrs: { "href": _vm.file.source, "aria-label": _vm.ariaLabel }, on: { "click": function($event) {
    $event.stopPropagation();
    $event.preventDefault();
    return _vm.emitClick.apply(null, arguments);
  } } }, [_c("div", { staticClass: "file__images" }, [_vm.file.mime?.includes("video") ? _c("VideoOutline", { staticClass: "icon-overlay", attrs: { "size": 64 } }) : _vm.file.attributes["metadata-files-live-photo"] !== void 0 ? _c("PlayCircleOutlineIcon", { staticClass: "icon-overlay", attrs: { "size": 64 } }) : _vm._e(), _vm.initialized ? [_vm.hasBlurhash && !_vm.loadedSmall && !_vm.loadedLarge ? _c("canvas", { ref: "canvas", staticClass: "file__blurhash", attrs: { "aria-hidden": "true" } }) : _vm._e(), !_vm.loadedLarge && (_vm.loadedSmall || _vm.distance < 5 && !_vm.errorSmall) ? _c("img", { key: `${_vm.file.basename}-small`, ref: "imgSmall", attrs: { "src": _vm.srcSmall, "alt": _vm.file.basename, "decoding": _vm.loadedSmall || _vm.isVisible ? "sync" : "async", "fetchpriority": _vm.loadedSmall || _vm.isVisible ? "high" : "low", "loading": _vm.loadedSmall || _vm.isVisible ? "eager" : _vm.distance < 2 ? "auto" : "lazy" }, on: { "load": _vm.onLoadSmall, "error": _vm.onErrorSmall } }) : _vm._e(), _vm.loadedLarge || (_vm.isVisible || _vm.distance < 2 && (_vm.loadedSmall || _vm.errorSmall)) && !_vm.errorLarge ? _c("img", { key: `${_vm.file.basename}-large`, ref: "imgLarge", attrs: { "src": _vm.srcLarge, "alt": _vm.file.basename, "decoding": _vm.loadedLarge || _vm.isVisible ? "sync" : "async", "fetchpriority": _vm.loadedLarge || _vm.isVisible ? "high" : "low", "loading": _vm.loadedLarge || _vm.isVisible ? "auto" : "lazy" }, on: { "load": _vm.onLoadLarge, "error": _vm.onErrorLarge } }) : _vm._e()] : _vm._e()], 2)]), _vm.allowSelection ? _c("NcCheckboxRadioSwitch", { staticClass: "selection-checkbox", attrs: { "aria-label": _vm.t("photos", "Select image {imageName}", { imageName: _vm.file.basename }), "checked": _vm.selected }, on: { "update:checked": _vm.onToggle } }) : _vm._e(), _vm.file.attributes.favorite === 1 ? _vm._m(0) : _vm._e()], 1);
};
var _sfc_staticRenderFns = [function() {
  var _vm = this, _c = _vm._self._c;
  return _c("FavoriteIcon", { staticClass: "favorite-state" });
}];
_sfc_render._withStripped = true;
var __component__ = /* @__PURE__ */ normalizeComponent(
  _sfc_main,
  _sfc_render,
  _sfc_staticRenderFns,
  false,
  null,
  "7756f5c8"
);
__component__.options.__file = "/Users/effem/workbench/git/personel/photos/src/components/FileComponent.vue";
const FileComponent = __component__.exports;
export {
  FileComponent as F
};
//# sourceMappingURL=FileComponent-CcjuR452.chunk.mjs.map
