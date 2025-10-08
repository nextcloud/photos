const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { n as normalizeComponent, r as register, aB as t10, aC as t50, a as t, k as cancelableClient, aD as t3, aE as t9, f as NcLoadingIcon, e as NcIconSvgWrapper, N as NcButton, s as NcActions, aF as DotsHorizontal } from "./index-BOzawWmL.chunk.mjs";
import { a as ActionTextMixin, N as NcActionButton } from "./NcActionButton-CuVNJJtW-5eBS5Sv2.chunk.mjs";
import { H as getLoggerBuilder, ad as v, I as getDefaultExportFromCjs, _, Y as w, am as f, b as ref$1, c as readonly, k as unref, m as getCurrentScope, p as onScopeDispose, A as toRef$1, an as customRef, w as watch, q as computed, f as distExports, g as getCurrentUser, u as unsubscribe, s as subscribe } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
import { e } from "./index-Cokc0amN.chunk.mjs";
import "./video-C5pfp5p8.chunk.mjs";
const logger = getLoggerBuilder().detectUser().setApp("@nextcloud/vue").build();
const _sfc_main$4 = {
  name: "NcActionLink",
  mixins: [ActionTextMixin],
  inject: {
    isInSemanticMenu: {
      from: "NcActions:isSemanticMenu",
      default: false
    }
  },
  props: {
    /**
     * destionation to link to
     */
    href: {
      type: String,
      default: "#",
      required: true,
      validator: (value) => {
        try {
          return new URL(value);
        } catch (error) {
          return value.startsWith("#") || value.startsWith("/");
        }
      }
    },
    /**
     * download the link instead of opening
     */
    download: {
      type: String,
      default: null
    },
    /**
     * target to open the link
     */
    target: {
      type: String,
      default: "_self",
      validator: (value) => {
        return value && (!value.startsWith("_") || ["_blank", "_self", "_parent", "_top"].indexOf(value) > -1);
      }
    },
    /**
     * Declares a native tooltip when not null
     */
    title: {
      type: String,
      default: null
    },
    /**
     * @deprecated To be removed in @nextcloud/vue 9. Migration guide: remove ariaHidden prop from NcAction* components.
     * @todo Add a check in @nextcloud/vue 9 that this prop is not provided,
     * otherwise root element will inherit incorrect aria-hidden.
     */
    ariaHidden: {
      type: Boolean,
      default: null
    }
  }
};
var _sfc_render$4 = function render() {
  var _vm = this, _c = _vm._self._c;
  return _c("li", { staticClass: "action", attrs: { "role": _vm.isInSemanticMenu && "presentation" } }, [_c("a", { staticClass: "action-link focusable", attrs: { "download": _vm.download, "href": _vm.href, "aria-label": _vm.ariaLabel, "target": _vm.target, "title": _vm.title, "rel": "nofollow noreferrer noopener", "role": _vm.isInSemanticMenu && "menuitem" }, on: { "click": _vm.onClick } }, [_vm._t("icon", function() {
    return [_c("span", { staticClass: "action-link__icon", class: [_vm.isIconUrl ? "action-link__icon--url" : _vm.icon], style: { backgroundImage: _vm.isIconUrl ? `url(${_vm.icon})` : null }, attrs: { "aria-hidden": "true" } })];
  }), _vm.name ? _c("span", { staticClass: "action-link__longtext-wrapper" }, [_c("strong", { staticClass: "action-link__name" }, [_vm._v(" " + _vm._s(_vm.name) + " ")]), _c("br"), _c("span", { staticClass: "action-link__longtext", domProps: { "textContent": _vm._s(_vm.text) } })]) : _vm.isLongText ? _c("span", { staticClass: "action-link__longtext", domProps: { "textContent": _vm._s(_vm.text) } }) : _c("span", { staticClass: "action-link__text" }, [_vm._v(_vm._s(_vm.text))]), _vm._e()], 2)]);
};
var _sfc_staticRenderFns$4 = [];
var __component__$4 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$4,
  _sfc_render$4,
  _sfc_staticRenderFns$4,
  false,
  null,
  "30c015f0"
);
const NcActionLink = __component__$4.exports;
const _sfc_main$3 = {
  name: "NcActionRouter",
  mixins: [ActionTextMixin],
  inject: {
    isInSemanticMenu: {
      from: "NcActions:isSemanticMenu",
      default: false
    }
  },
  props: {
    /**
     * router-link to prop [https://router.vuejs.org/api/#to](https://router.vuejs.org/api/#to)
     */
    to: {
      type: [String, Object],
      default: "",
      required: true
    },
    /**
     * router-link exact prop [https://router.vuejs.org/api/#exact](https://router.vuejs.org/api/#exact)
     */
    exact: {
      type: Boolean,
      default: false
    }
  }
};
var _sfc_render$3 = function render2() {
  var _vm = this, _c = _vm._self._c;
  return _c("li", { staticClass: "action", attrs: { "role": _vm.isInSemanticMenu && "presentation" } }, [_c("RouterLink", { staticClass: "action-router focusable", attrs: { "to": _vm.to, "aria-label": _vm.ariaLabel, "exact": _vm.exact, "title": _vm.title, "rel": "nofollow noreferrer noopener", "role": _vm.isInSemanticMenu && "menuitem" }, nativeOn: { "click": function($event) {
    return _vm.onClick.apply(null, arguments);
  } } }, [_vm._t("icon", function() {
    return [_c("span", { staticClass: "action-router__icon", class: [_vm.isIconUrl ? "action-router__icon--url" : _vm.icon], style: { backgroundImage: _vm.isIconUrl ? `url(${_vm.icon})` : null }, attrs: { "aria-hidden": "true" } })];
  }), _vm.name ? _c("span", { staticClass: "action-router__longtext-wrapper" }, [_c("strong", { staticClass: "action-router__name" }, [_vm._v(" " + _vm._s(_vm.name) + " ")]), _c("br"), _c("span", { staticClass: "action-router__longtext", domProps: { "textContent": _vm._s(_vm.text) } })]) : _vm.isLongText ? _c("span", { staticClass: "action-router__longtext", domProps: { "textContent": _vm._s(_vm.text) } }) : _c("span", { staticClass: "action-router__text" }, [_vm._v(_vm._s(_vm.text))]), _vm._e()], 2)], 1);
};
var _sfc_staticRenderFns$3 = [];
var __component__$3 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$3,
  _sfc_render$3,
  _sfc_staticRenderFns$3,
  false,
  null,
  "579c6b4d"
);
const NcActionRouter = __component__$3.exports;
const _sfc_main$2 = {
  name: "NcActionText",
  mixins: [ActionTextMixin],
  inject: {
    isInSemanticMenu: {
      from: "NcActions:isSemanticMenu",
      default: false
    }
  }
};
var _sfc_render$2 = function render3() {
  var _vm = this, _c = _vm._self._c;
  return _c("li", { staticClass: "action", attrs: { "role": _vm.isInSemanticMenu && "presentation" } }, [_c("span", { staticClass: "action-text", on: { "click": _vm.onClick } }, [_vm._t("icon", function() {
    return [_vm.icon !== "" ? _c("span", { staticClass: "action-text__icon", class: [_vm.isIconUrl ? "action-text__icon--url" : _vm.icon], style: { backgroundImage: _vm.isIconUrl ? `url(${_vm.icon})` : null }, attrs: { "aria-hidden": "true" } }) : _vm._e()];
  }), _vm.name ? _c("span", { staticClass: "action-text__longtext-wrapper" }, [_c("strong", { staticClass: "action-text__name" }, [_vm._v(" " + _vm._s(_vm.name) + " ")]), _c("br"), _c("span", { staticClass: "action-text__longtext", domProps: { "textContent": _vm._s(_vm.text) } })]) : _vm.isLongText ? _c("span", { staticClass: "action-text__longtext", domProps: { "textContent": _vm._s(_vm.text) } }) : _c("span", { staticClass: "action-text__text" }, [_vm._v(_vm._s(_vm.text))]), _vm._e()], 2)]);
};
var _sfc_staticRenderFns$2 = [];
var __component__$2 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$2,
  _sfc_render$2,
  _sfc_staticRenderFns$2,
  false,
  null,
  "824615f4"
);
const NcActionText = __component__$2.exports;
const onlineSvg = '<!--\n  - SPDX-FileCopyrightText: 2020 Google Inc.\n  - SPDX-License-Identifier: Apache-2.0\n-->\n<svg viewBox="0 0 16 16" width="16" height="16" xmlns="http://www.w3.org/2000/svg">\n	<path fill="var(--color-success)" d="M4.8 11.2h6.4V4.8H4.8v6.4zM8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8z" />\n</svg>\n';
const awaySvg = '<!--\n  - SPDX-FileCopyrightText: 2020 Google Inc.\n  - SPDX-License-Identifier: Apache-2.0\n-->\n<svg viewBox="0 0 16 16" width="16" height="16" xmlns="http://www.w3.org/2000/svg">\n	<path fill="none" d="M-4-4h24v24H-4z" />\n	<path fill="var(--color-warning)" d="M6.9.1C3 .6-.1 4-.1 8c0 4.4 3.6 8 8 8 4 0 7.4-3 8-6.9-1.2 1.3-2.9 2.1-4.7 2.1-3.5 0-6.4-2.9-6.4-6.4 0-1.9.8-3.6 2.1-4.7z" />\n</svg>\n';
const dndSvg = '<!--\n  - SPDX-FileCopyrightText: 2020 Google Inc.\n  - SPDX-License-Identifier: Apache-2.0\n-->\n<svg viewBox="0 0 16 16" width="16" height="16" xmlns="http://www.w3.org/2000/svg">\n	<path fill="none" d="M-4-4h24v24H-4V-4z" />\n	<path fill="var(--color-error)" d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8z" />\n	<path fill="#fdffff" d="M5 6.5h6c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5H5c-.8 0-1.5-.7-1.5-1.5S4.2 6.5 5 6.5z" />\n</svg>\n';
const invisibleSvg = '<!--\n  - SPDX-FileCopyrightText: 2020 Google Inc.\n  - SPDX-License-Identifier: Apache-2.0\n-->\n<svg viewBox="0 0 16 16" width="16" height="16" xmlns="http://www.w3.org/2000/svg">\n	<path fill="none" d="M-4-4h24v24H-4V-4z" />\n	<path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 3.2c2.7 0 4.8 2.1 4.8 4.8s-2.1 4.8-4.8 4.8S3.2 10.7 3.2 8 5.3 3.2 8 3.2z" />\n</svg>\n';
register(t10);
const getUserStatusText = (status) => {
  switch (status) {
    case "away":
      return t("away");
    // TRANSLATORS: User status if the user is currently away from keyboard
    case "busy":
      return t("busy");
    case "dnd":
      return t("do not disturb");
    case "online":
      return t("online");
    case "invisible":
      return t("invisible");
    case "offline":
      return t("offline");
    default:
      return status;
  }
};
register(t50);
const _sfc_main$1 = {
  name: "NcUserStatusIcon",
  props: {
    /**
     * Set the user id to fetch the status
     */
    user: {
      type: String,
      default: null
    },
    /**
     * Set the status
     *
     * @type {'online' | 'away' | 'busy' | 'dnd' | 'invisible' | 'offline'}
     */
    status: {
      type: String,
      default: null,
      validator: (value) => [
        "online",
        "away",
        "busy",
        "dnd",
        "invisible",
        "offline"
      ].includes(value)
    },
    /**
     * Set the `aria-hidden` attribute
     *
     * @type {'true' | 'false'}
     */
    ariaHidden: {
      type: String,
      default: null,
      validator: (value) => [
        "true",
        "false"
      ].includes(value)
    }
  },
  data() {
    return {
      fetchedUserStatus: null
    };
  },
  computed: {
    activeStatus() {
      return this.status ?? this.fetchedUserStatus;
    },
    activeSvg() {
      const matchSvg = {
        online: onlineSvg,
        away: awaySvg,
        busy: awaySvg,
        dnd: dndSvg,
        invisible: invisibleSvg,
        offline: invisibleSvg
      };
      return matchSvg[this.activeStatus] ?? null;
    },
    ariaLabel() {
      if (this.ariaHidden === "true") {
        return null;
      }
      return t("User status: {status}", { status: getUserStatusText(this.activeStatus) });
    }
  },
  watch: {
    user: {
      immediate: true,
      async handler(user, _oldUser) {
        if (!user || !e()?.user_status?.enabled) {
          this.fetchedUserStatus = null;
          return;
        }
        try {
          const { data } = await cancelableClient.get(v("/apps/user_status/api/v1/statuses/{user}", { user }));
          this.fetchedUserStatus = data.ocs?.data?.status;
        } catch (error) {
          this.fetchedUserStatus = null;
        }
      }
    }
  }
};
var _sfc_render$1 = function render4() {
  var _vm = this, _c = _vm._self._c;
  return _vm.activeStatus ? _c("span", { staticClass: "user-status-icon", class: {
    "user-status-icon--invisible": ["invisible", "offline"].includes(_vm.status)
  }, attrs: { "role": "img", "aria-hidden": _vm.ariaHidden, "aria-label": _vm.ariaLabel }, domProps: { "innerHTML": _vm._s(_vm.activeSvg) } }) : _vm._e();
};
var _sfc_staticRenderFns$1 = [];
var __component__$1 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$1,
  _sfc_render$1,
  _sfc_staticRenderFns$1,
  false,
  null,
  "0555d8d0"
);
const NcUserStatusIcon = __component__$1.exports;
register(t3);
class Color {
  /**
   * @param {number} r The red value
   * @param {number} g The green value
   * @param {number} b The blue value
   * @param {string} [name] The name of the color
   */
  constructor(r, g, b, name) {
    this.r = r;
    this.g = g;
    this.b = b;
    if (name) {
      this.name = name;
    }
  }
  get color() {
    const toHex = (num) => `00${num.toString(16)}`.slice(-2);
    return `#${toHex(this.r)}${toHex(this.g)}${toHex(this.b)}`;
  }
}
function stepCalc(steps, ends) {
  const step = new Array(3);
  step[0] = (ends[1].r - ends[0].r) / steps;
  step[1] = (ends[1].g - ends[0].g) / steps;
  step[2] = (ends[1].b - ends[0].b) / steps;
  return step;
}
function mixPalette(steps, color1, color2) {
  const palette = [];
  palette.push(color1);
  const step = stepCalc(steps, [color1, color2]);
  for (let i = 1; i < steps; i++) {
    const r = Math.floor(color1.r + step[0] * i);
    const g = Math.floor(color1.g + step[1] * i);
    const b = Math.floor(color1.b + step[2] * i);
    palette.push(new Color(r, g, b));
  }
  return palette;
}
[
  new Color(182, 70, 157, t("Purple")),
  new Color(
    191,
    103,
    139,
    t("Rosy brown")
    // TRANSLATORS: A color name for RGB(191, 103, 139)
  ),
  new Color(
    201,
    136,
    121,
    t("Feldspar")
    // TRANSLATORS: A color name for RGB(201, 136, 121)
  ),
  new Color(
    211,
    169,
    103,
    t("Whiskey")
    // TRANSLATORS: A color name for RGB(211, 169, 103)
  ),
  new Color(
    221,
    203,
    85,
    t("Gold")
  ),
  new Color(
    165,
    184,
    114,
    t("Olivine")
    // TRANSLATORS: A color name for RGB(165, 184, 114)
  ),
  new Color(
    110,
    166,
    143,
    t("Acapulco")
    // TRANSLATORS: A color name for RGB(110, 166, 143)
  ),
  new Color(
    55,
    148,
    172,
    t("Boston Blue")
    // TRANSLATORS: A color name for RGB(55, 148, 172)
  ),
  new Color(
    0,
    130,
    201,
    t("Nextcloud blue")
  ),
  new Color(
    45,
    115,
    190,
    t("Mariner")
    // TRANSLATORS: A color name for RGB(45, 115, 190)
  ),
  new Color(
    91,
    100,
    179,
    t("Blue Violet")
    // TRANSLATORS: A color name for RGB(91, 100, 179)
  ),
  new Color(
    136,
    85,
    168,
    t("Deluge")
    // TRANSLATORS: A color name for RGB(136, 85, 168)
  )
];
function GenColors(steps) {
  const red = new Color(182, 70, 157, t("Purple"));
  const yellow = new Color(221, 203, 85, t("Gold"));
  const blue = new Color(0, 130, 201, t("Nextcloud blue"));
  const palette1 = mixPalette(steps, red, yellow);
  const palette2 = mixPalette(steps, yellow, blue);
  const palette3 = mixPalette(steps, blue, red);
  return palette1.concat(palette2).concat(palette3);
}
var md5$1 = { exports: {} };
var crypt = { exports: {} };
var hasRequiredCrypt;
function requireCrypt() {
  if (hasRequiredCrypt) return crypt.exports;
  hasRequiredCrypt = 1;
  (function() {
    var base64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", crypt$1 = {
      // Bit-wise rotation left
      rotl: function(n, b) {
        return n << b | n >>> 32 - b;
      },
      // Bit-wise rotation right
      rotr: function(n, b) {
        return n << 32 - b | n >>> b;
      },
      // Swap big-endian to little-endian and vice versa
      endian: function(n) {
        if (n.constructor == Number) {
          return crypt$1.rotl(n, 8) & 16711935 | crypt$1.rotl(n, 24) & 4278255360;
        }
        for (var i = 0; i < n.length; i++)
          n[i] = crypt$1.endian(n[i]);
        return n;
      },
      // Generate an array of any length of random bytes
      randomBytes: function(n) {
        for (var bytes = []; n > 0; n--)
          bytes.push(Math.floor(Math.random() * 256));
        return bytes;
      },
      // Convert a byte array to big-endian 32-bit words
      bytesToWords: function(bytes) {
        for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
          words[b >>> 5] |= bytes[i] << 24 - b % 32;
        return words;
      },
      // Convert big-endian 32-bit words to a byte array
      wordsToBytes: function(words) {
        for (var bytes = [], b = 0; b < words.length * 32; b += 8)
          bytes.push(words[b >>> 5] >>> 24 - b % 32 & 255);
        return bytes;
      },
      // Convert a byte array to a hex string
      bytesToHex: function(bytes) {
        for (var hex = [], i = 0; i < bytes.length; i++) {
          hex.push((bytes[i] >>> 4).toString(16));
          hex.push((bytes[i] & 15).toString(16));
        }
        return hex.join("");
      },
      // Convert a hex string to a byte array
      hexToBytes: function(hex) {
        for (var bytes = [], c = 0; c < hex.length; c += 2)
          bytes.push(parseInt(hex.substr(c, 2), 16));
        return bytes;
      },
      // Convert a byte array to a base-64 string
      bytesToBase64: function(bytes) {
        for (var base64 = [], i = 0; i < bytes.length; i += 3) {
          var triplet = bytes[i] << 16 | bytes[i + 1] << 8 | bytes[i + 2];
          for (var j = 0; j < 4; j++)
            if (i * 8 + j * 6 <= bytes.length * 8)
              base64.push(base64map.charAt(triplet >>> 6 * (3 - j) & 63));
            else
              base64.push("=");
        }
        return base64.join("");
      },
      // Convert a base-64 string to a byte array
      base64ToBytes: function(base64) {
        base64 = base64.replace(/[^A-Z0-9+\/]/ig, "");
        for (var bytes = [], i = 0, imod4 = 0; i < base64.length; imod4 = ++i % 4) {
          if (imod4 == 0) continue;
          bytes.push((base64map.indexOf(base64.charAt(i - 1)) & Math.pow(2, -2 * imod4 + 8) - 1) << imod4 * 2 | base64map.indexOf(base64.charAt(i)) >>> 6 - imod4 * 2);
        }
        return bytes;
      }
    };
    crypt.exports = crypt$1;
  })();
  return crypt.exports;
}
var charenc_1;
var hasRequiredCharenc;
function requireCharenc() {
  if (hasRequiredCharenc) return charenc_1;
  hasRequiredCharenc = 1;
  var charenc = {
    // UTF-8 encoding
    utf8: {
      // Convert a string to a byte array
      stringToBytes: function(str) {
        return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));
      },
      // Convert a byte array to a string
      bytesToString: function(bytes) {
        return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));
      }
    },
    // Binary encoding
    bin: {
      // Convert a string to a byte array
      stringToBytes: function(str) {
        for (var bytes = [], i = 0; i < str.length; i++)
          bytes.push(str.charCodeAt(i) & 255);
        return bytes;
      },
      // Convert a byte array to a string
      bytesToString: function(bytes) {
        for (var str = [], i = 0; i < bytes.length; i++)
          str.push(String.fromCharCode(bytes[i]));
        return str.join("");
      }
    }
  };
  charenc_1 = charenc;
  return charenc_1;
}
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
var isBuffer_1;
var hasRequiredIsBuffer;
function requireIsBuffer() {
  if (hasRequiredIsBuffer) return isBuffer_1;
  hasRequiredIsBuffer = 1;
  isBuffer_1 = function(obj) {
    return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer);
  };
  function isBuffer(obj) {
    return !!obj.constructor && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj);
  }
  function isSlowBuffer(obj) {
    return typeof obj.readFloatLE === "function" && typeof obj.slice === "function" && isBuffer(obj.slice(0, 0));
  }
  return isBuffer_1;
}
var hasRequiredMd5;
function requireMd5() {
  if (hasRequiredMd5) return md5$1.exports;
  hasRequiredMd5 = 1;
  (function() {
    var crypt2 = requireCrypt(), utf8 = requireCharenc().utf8, isBuffer = requireIsBuffer(), bin = requireCharenc().bin, md52 = function(message, options) {
      if (message.constructor == String)
        if (options && options.encoding === "binary")
          message = bin.stringToBytes(message);
        else
          message = utf8.stringToBytes(message);
      else if (isBuffer(message))
        message = Array.prototype.slice.call(message, 0);
      else if (!Array.isArray(message) && message.constructor !== Uint8Array)
        message = message.toString();
      var m = crypt2.bytesToWords(message), l = message.length * 8, a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
      for (var i = 0; i < m.length; i++) {
        m[i] = (m[i] << 8 | m[i] >>> 24) & 16711935 | (m[i] << 24 | m[i] >>> 8) & 4278255360;
      }
      m[l >>> 5] |= 128 << l % 32;
      m[(l + 64 >>> 9 << 4) + 14] = l;
      var FF = md52._ff, GG = md52._gg, HH = md52._hh, II = md52._ii;
      for (var i = 0; i < m.length; i += 16) {
        var aa = a, bb = b, cc = c, dd = d;
        a = FF(a, b, c, d, m[i + 0], 7, -680876936);
        d = FF(d, a, b, c, m[i + 1], 12, -389564586);
        c = FF(c, d, a, b, m[i + 2], 17, 606105819);
        b = FF(b, c, d, a, m[i + 3], 22, -1044525330);
        a = FF(a, b, c, d, m[i + 4], 7, -176418897);
        d = FF(d, a, b, c, m[i + 5], 12, 1200080426);
        c = FF(c, d, a, b, m[i + 6], 17, -1473231341);
        b = FF(b, c, d, a, m[i + 7], 22, -45705983);
        a = FF(a, b, c, d, m[i + 8], 7, 1770035416);
        d = FF(d, a, b, c, m[i + 9], 12, -1958414417);
        c = FF(c, d, a, b, m[i + 10], 17, -42063);
        b = FF(b, c, d, a, m[i + 11], 22, -1990404162);
        a = FF(a, b, c, d, m[i + 12], 7, 1804603682);
        d = FF(d, a, b, c, m[i + 13], 12, -40341101);
        c = FF(c, d, a, b, m[i + 14], 17, -1502002290);
        b = FF(b, c, d, a, m[i + 15], 22, 1236535329);
        a = GG(a, b, c, d, m[i + 1], 5, -165796510);
        d = GG(d, a, b, c, m[i + 6], 9, -1069501632);
        c = GG(c, d, a, b, m[i + 11], 14, 643717713);
        b = GG(b, c, d, a, m[i + 0], 20, -373897302);
        a = GG(a, b, c, d, m[i + 5], 5, -701558691);
        d = GG(d, a, b, c, m[i + 10], 9, 38016083);
        c = GG(c, d, a, b, m[i + 15], 14, -660478335);
        b = GG(b, c, d, a, m[i + 4], 20, -405537848);
        a = GG(a, b, c, d, m[i + 9], 5, 568446438);
        d = GG(d, a, b, c, m[i + 14], 9, -1019803690);
        c = GG(c, d, a, b, m[i + 3], 14, -187363961);
        b = GG(b, c, d, a, m[i + 8], 20, 1163531501);
        a = GG(a, b, c, d, m[i + 13], 5, -1444681467);
        d = GG(d, a, b, c, m[i + 2], 9, -51403784);
        c = GG(c, d, a, b, m[i + 7], 14, 1735328473);
        b = GG(b, c, d, a, m[i + 12], 20, -1926607734);
        a = HH(a, b, c, d, m[i + 5], 4, -378558);
        d = HH(d, a, b, c, m[i + 8], 11, -2022574463);
        c = HH(c, d, a, b, m[i + 11], 16, 1839030562);
        b = HH(b, c, d, a, m[i + 14], 23, -35309556);
        a = HH(a, b, c, d, m[i + 1], 4, -1530992060);
        d = HH(d, a, b, c, m[i + 4], 11, 1272893353);
        c = HH(c, d, a, b, m[i + 7], 16, -155497632);
        b = HH(b, c, d, a, m[i + 10], 23, -1094730640);
        a = HH(a, b, c, d, m[i + 13], 4, 681279174);
        d = HH(d, a, b, c, m[i + 0], 11, -358537222);
        c = HH(c, d, a, b, m[i + 3], 16, -722521979);
        b = HH(b, c, d, a, m[i + 6], 23, 76029189);
        a = HH(a, b, c, d, m[i + 9], 4, -640364487);
        d = HH(d, a, b, c, m[i + 12], 11, -421815835);
        c = HH(c, d, a, b, m[i + 15], 16, 530742520);
        b = HH(b, c, d, a, m[i + 2], 23, -995338651);
        a = II(a, b, c, d, m[i + 0], 6, -198630844);
        d = II(d, a, b, c, m[i + 7], 10, 1126891415);
        c = II(c, d, a, b, m[i + 14], 15, -1416354905);
        b = II(b, c, d, a, m[i + 5], 21, -57434055);
        a = II(a, b, c, d, m[i + 12], 6, 1700485571);
        d = II(d, a, b, c, m[i + 3], 10, -1894986606);
        c = II(c, d, a, b, m[i + 10], 15, -1051523);
        b = II(b, c, d, a, m[i + 1], 21, -2054922799);
        a = II(a, b, c, d, m[i + 8], 6, 1873313359);
        d = II(d, a, b, c, m[i + 15], 10, -30611744);
        c = II(c, d, a, b, m[i + 6], 15, -1560198380);
        b = II(b, c, d, a, m[i + 13], 21, 1309151649);
        a = II(a, b, c, d, m[i + 4], 6, -145523070);
        d = II(d, a, b, c, m[i + 11], 10, -1120210379);
        c = II(c, d, a, b, m[i + 2], 15, 718787259);
        b = II(b, c, d, a, m[i + 9], 21, -343485551);
        a = a + aa >>> 0;
        b = b + bb >>> 0;
        c = c + cc >>> 0;
        d = d + dd >>> 0;
      }
      return crypt2.endian([a, b, c, d]);
    };
    md52._ff = function(a, b, c, d, x, s, t2) {
      var n = a + (b & c | ~b & d) + (x >>> 0) + t2;
      return (n << s | n >>> 32 - s) + b;
    };
    md52._gg = function(a, b, c, d, x, s, t2) {
      var n = a + (b & d | c & ~d) + (x >>> 0) + t2;
      return (n << s | n >>> 32 - s) + b;
    };
    md52._hh = function(a, b, c, d, x, s, t2) {
      var n = a + (b ^ c ^ d) + (x >>> 0) + t2;
      return (n << s | n >>> 32 - s) + b;
    };
    md52._ii = function(a, b, c, d, x, s, t2) {
      var n = a + (c ^ (b | ~d)) + (x >>> 0) + t2;
      return (n << s | n >>> 32 - s) + b;
    };
    md52._blocksize = 16;
    md52._digestsize = 16;
    md5$1.exports = function(message, options) {
      if (message === void 0 || message === null)
        throw new Error("Illegal argument " + message);
      var digestbytes = crypt2.wordsToBytes(md52(message, options));
      return options && options.asBytes ? digestbytes : options && options.asString ? bin.bytesToString(digestbytes) : crypt2.bytesToHex(digestbytes);
    };
  })();
  return md5$1.exports;
}
var md5Exports = requireMd5();
const md5 = /* @__PURE__ */ getDefaultExportFromCjs(md5Exports);
const usernameToColor = function(username) {
  let hash = username.toLowerCase();
  if (hash.match(/^([0-9a-f]{4}-?){8}$/) === null) {
    hash = md5(hash);
  }
  hash = hash.replace(/[^0-9a-f]/g, "");
  const steps = 6;
  const finalPalette = GenColors(steps);
  function hashToInt(hash2, maximum) {
    let finalInt = 0;
    const result = [];
    for (let i = 0; i < hash2.length; i++) {
      result.push(parseInt(hash2.charAt(i), 16) % 16);
    }
    for (const j in result) {
      finalInt += result[j];
    }
    return parseInt(parseInt(finalInt, 10) % maximum, 10);
  }
  return finalPalette[hashToInt(hash, steps * 3)];
};
const getAvatarUrl = (user, size, isGuest) => {
  const darkTheme = window.getComputedStyle(document.body).getPropertyValue("--background-invert-if-dark") === "invert(100%)";
  return _("/avatar" + (isGuest ? "/guest" : "") + "/{user}/{size}" + (darkTheme ? "/dark" : ""), {
    user,
    size
  });
};
function getEnabledContactsMenuActions(entry) {
  if (!window._nc_contacts_menu_hooks) {
    return [];
  }
  return Object.values(window._nc_contacts_menu_hooks).filter((action) => action.enabled(entry));
}
const getRoute = (router, url) => {
  const removePrefix = (str, prefix) => str.startsWith(prefix) ? str.slice(prefix.length) : str;
  const removePrefixes = (str, ...prefixes) => prefixes.reduce((acc, prefix) => removePrefix(acc, prefix), str);
  if (!router) {
    return null;
  }
  const isAbsoluteURL = /^https?:\/\//.test(url);
  const isNonHttpLink = /^[a-z][a-z0-9+.-]*:.+/.test(url);
  if (!isAbsoluteURL && isNonHttpLink) {
    return null;
  }
  if (isAbsoluteURL && !url.startsWith(w())) {
    return null;
  }
  if (!isAbsoluteURL && !url.startsWith("/")) {
    return null;
  }
  const relativeUrl = isAbsoluteURL ? removePrefixes(url, w(), "/index.php") : url;
  const relativeRouterBase = removePrefixes(router.history.base, f(), "/index.php");
  const potentialRouterPath = removePrefixes(relativeUrl, relativeRouterBase) || "/";
  const route = router.resolve(potentialRouterPath).route;
  if (!route.matched.length) {
    return null;
  }
  return route.fullPath;
};
const isFullscreen = ref$1(checkIfIsFullscreen());
window.addEventListener("resize", () => {
  isFullscreen.value = checkIfIsFullscreen();
});
function checkIfIsFullscreen() {
  return window.outerHeight === window.screen.height;
}
readonly(isFullscreen);
var striptags$1 = { exports: {} };
var striptags = striptags$1.exports;
var hasRequiredStriptags;
function requireStriptags() {
  if (hasRequiredStriptags) return striptags$1.exports;
  hasRequiredStriptags = 1;
  (function(module) {
    (function(global) {
      if (typeof Symbol !== "function") {
        var Symbol = function(name) {
          return name;
        };
        Symbol.nonNative = true;
      }
      const STATE_PLAINTEXT = Symbol("plaintext");
      const STATE_HTML = Symbol("html");
      const STATE_COMMENT = Symbol("comment");
      const ALLOWED_TAGS_REGEX = /<(\w*)>/g;
      const NORMALIZE_TAG_REGEX = /<\/?([^\s\/>]+)/;
      function striptags2(html, allowable_tags, tag_replacement) {
        html = html || "";
        allowable_tags = allowable_tags || [];
        tag_replacement = tag_replacement || "";
        let context = init_context(allowable_tags, tag_replacement);
        return striptags_internal(html, context);
      }
      function init_striptags_stream(allowable_tags, tag_replacement) {
        allowable_tags = allowable_tags || [];
        tag_replacement = tag_replacement || "";
        let context = init_context(allowable_tags, tag_replacement);
        return function striptags_stream(html) {
          return striptags_internal(html || "", context);
        };
      }
      striptags2.init_streaming_mode = init_striptags_stream;
      function init_context(allowable_tags, tag_replacement) {
        allowable_tags = parse_allowable_tags(allowable_tags);
        return {
          allowable_tags,
          tag_replacement,
          state: STATE_PLAINTEXT,
          tag_buffer: "",
          depth: 0,
          in_quote_char: ""
        };
      }
      function striptags_internal(html, context) {
        if (typeof html != "string") {
          throw new TypeError("'html' parameter must be a string");
        }
        let allowable_tags = context.allowable_tags;
        let tag_replacement = context.tag_replacement;
        let state = context.state;
        let tag_buffer = context.tag_buffer;
        let depth = context.depth;
        let in_quote_char = context.in_quote_char;
        let output = "";
        for (let idx = 0, length = html.length; idx < length; idx++) {
          let char = html[idx];
          if (state === STATE_PLAINTEXT) {
            switch (char) {
              case "<":
                state = STATE_HTML;
                tag_buffer += char;
                break;
              default:
                output += char;
                break;
            }
          } else if (state === STATE_HTML) {
            switch (char) {
              case "<":
                if (in_quote_char) {
                  break;
                }
                depth++;
                break;
              case ">":
                if (in_quote_char) {
                  break;
                }
                if (depth) {
                  depth--;
                  break;
                }
                in_quote_char = "";
                state = STATE_PLAINTEXT;
                tag_buffer += ">";
                if (allowable_tags.has(normalize_tag(tag_buffer))) {
                  output += tag_buffer;
                } else {
                  output += tag_replacement;
                }
                tag_buffer = "";
                break;
              case '"':
              case "'":
                if (char === in_quote_char) {
                  in_quote_char = "";
                } else {
                  in_quote_char = in_quote_char || char;
                }
                tag_buffer += char;
                break;
              case "-":
                if (tag_buffer === "<!-") {
                  state = STATE_COMMENT;
                }
                tag_buffer += char;
                break;
              case " ":
              case "\n":
                if (tag_buffer === "<") {
                  state = STATE_PLAINTEXT;
                  output += "< ";
                  tag_buffer = "";
                  break;
                }
                tag_buffer += char;
                break;
              default:
                tag_buffer += char;
                break;
            }
          } else if (state === STATE_COMMENT) {
            switch (char) {
              case ">":
                if (tag_buffer.slice(-2) == "--") {
                  state = STATE_PLAINTEXT;
                }
                tag_buffer = "";
                break;
              default:
                tag_buffer += char;
                break;
            }
          }
        }
        context.state = state;
        context.tag_buffer = tag_buffer;
        context.depth = depth;
        context.in_quote_char = in_quote_char;
        return output;
      }
      function parse_allowable_tags(allowable_tags) {
        let tag_set = /* @__PURE__ */ new Set();
        if (typeof allowable_tags === "string") {
          let match;
          while (match = ALLOWED_TAGS_REGEX.exec(allowable_tags)) {
            tag_set.add(match[1]);
          }
        } else if (!Symbol.nonNative && typeof allowable_tags[Symbol.iterator] === "function") {
          tag_set = new Set(allowable_tags);
        } else if (typeof allowable_tags.forEach === "function") {
          allowable_tags.forEach(tag_set.add, tag_set);
        }
        return tag_set;
      }
      function normalize_tag(tag_buffer) {
        let match = NORMALIZE_TAG_REGEX.exec(tag_buffer);
        return match ? match[1].toLowerCase() : null;
      }
      if (module.exports) {
        module.exports = striptags2;
      } else {
        global.striptags = striptags2;
      }
    })(striptags);
  })(striptags$1);
  return striptags$1.exports;
}
requireStriptags();
function tryOnScopeDispose(fn) {
  if (getCurrentScope()) {
    onScopeDispose(fn);
    return true;
  }
  return false;
}
function toValue(r) {
  return typeof r === "function" ? r() : unref(r);
}
const directiveHooks = {
  mounted: "inserted",
  unmounted: "unbind"
};
const isClient = typeof window !== "undefined" && typeof document !== "undefined";
typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
const toString = Object.prototype.toString;
const isObject = (val) => toString.call(val) === "[object Object]";
const noop = () => {
};
const isIOS = /* @__PURE__ */ getIsIOS();
function getIsIOS() {
  var _a, _b;
  return isClient && ((_a = window == null ? void 0 : window.navigator) == null ? void 0 : _a.userAgent) && (/iP(?:ad|hone|od)/.test(window.navigator.userAgent) || ((_b = window == null ? void 0 : window.navigator) == null ? void 0 : _b.maxTouchPoints) > 2 && /iPad|Macintosh/.test(window == null ? void 0 : window.navigator.userAgent));
}
function toRef(...args) {
  if (args.length !== 1)
    return toRef$1(...args);
  const r = args[0];
  return typeof r === "function" ? readonly(customRef(() => ({ get: r, set: noop }))) : ref$1(r);
}
const defaultWindow = isClient ? window : void 0;
function unrefElement(elRef) {
  var _a;
  const plain = toValue(elRef);
  return (_a = plain == null ? void 0 : plain.$el) != null ? _a : plain;
}
function useEventListener(...args) {
  let target;
  let events;
  let listeners;
  let options;
  if (typeof args[0] === "string" || Array.isArray(args[0])) {
    [events, listeners, options] = args;
    target = defaultWindow;
  } else {
    [target, events, listeners, options] = args;
  }
  if (!target)
    return noop;
  if (!Array.isArray(events))
    events = [events];
  if (!Array.isArray(listeners))
    listeners = [listeners];
  const cleanups = [];
  const cleanup = () => {
    cleanups.forEach((fn) => fn());
    cleanups.length = 0;
  };
  const register2 = (el, event, listener, options2) => {
    el.addEventListener(event, listener, options2);
    return () => el.removeEventListener(event, listener, options2);
  };
  const stopWatch = watch(
    () => [unrefElement(target), toValue(options)],
    ([el, options2]) => {
      cleanup();
      if (!el)
        return;
      const optionsClone = isObject(options2) ? { ...options2 } : options2;
      cleanups.push(
        ...events.flatMap((event) => {
          return listeners.map((listener) => register2(el, event, listener, optionsClone));
        })
      );
    },
    { immediate: true, flush: "post" }
  );
  const stop = () => {
    stopWatch();
    cleanup();
  };
  tryOnScopeDispose(stop);
  return stop;
}
let _iOSWorkaround = false;
function onClickOutside(target, handler, options = {}) {
  const { window: window2 = defaultWindow, ignore = [], capture = true, detectIframe = false } = options;
  if (!window2)
    return noop;
  if (isIOS && !_iOSWorkaround) {
    _iOSWorkaround = true;
    Array.from(window2.document.body.children).forEach((el) => el.addEventListener("click", noop));
    window2.document.documentElement.addEventListener("click", noop);
  }
  let shouldListen = true;
  const shouldIgnore = (event) => {
    return toValue(ignore).some((target2) => {
      if (typeof target2 === "string") {
        return Array.from(window2.document.querySelectorAll(target2)).some((el) => el === event.target || event.composedPath().includes(el));
      } else {
        const el = unrefElement(target2);
        return el && (event.target === el || event.composedPath().includes(el));
      }
    });
  };
  function hasMultipleRoots(target2) {
    const vm = toValue(target2);
    return vm && vm.$.subTree.shapeFlag === 16;
  }
  function checkMultipleRoots(target2, event) {
    const vm = toValue(target2);
    const children = vm.$.subTree && vm.$.subTree.children;
    if (children == null || !Array.isArray(children))
      return false;
    return children.some((child) => child.el === event.target || event.composedPath().includes(child.el));
  }
  const listener = (event) => {
    const el = unrefElement(target);
    if (event.target == null)
      return;
    if (!(el instanceof Element) && hasMultipleRoots(target) && checkMultipleRoots(target, event))
      return;
    if (!el || el === event.target || event.composedPath().includes(el))
      return;
    if (event.detail === 0)
      shouldListen = !shouldIgnore(event);
    if (!shouldListen) {
      shouldListen = true;
      return;
    }
    handler(event);
  };
  let isProcessingClick = false;
  const cleanup = [
    useEventListener(window2, "click", (event) => {
      if (!isProcessingClick) {
        isProcessingClick = true;
        setTimeout(() => {
          isProcessingClick = false;
        }, 0);
        listener(event);
      }
    }, { passive: true, capture }),
    useEventListener(window2, "pointerdown", (e2) => {
      const el = unrefElement(target);
      shouldListen = !shouldIgnore(e2) && !!(el && !e2.composedPath().includes(el));
    }, { passive: true }),
    detectIframe && useEventListener(window2, "blur", (event) => {
      setTimeout(() => {
        var _a;
        const el = unrefElement(target);
        if (((_a = window2.document.activeElement) == null ? void 0 : _a.tagName) === "IFRAME" && !(el == null ? void 0 : el.contains(window2.document.activeElement))) {
          handler(event);
        }
      }, 0);
    })
  ].filter(Boolean);
  const stop = () => cleanup.forEach((fn) => fn());
  return stop;
}
const vOnClickOutside = {
  [directiveHooks.mounted](el, binding) {
    const capture = !binding.modifiers.bubble;
    if (typeof binding.value === "function") {
      el.__onClickOutside_stop = onClickOutside(el, binding.value, { capture });
    } else {
      const [handler, options] = binding.value;
      el.__onClickOutside_stop = onClickOutside(el, handler, Object.assign({ capture }, options));
    }
  },
  [directiveHooks.unmounted](el) {
    el.__onClickOutside_stop();
  }
};
function resolveElement(el) {
  if (typeof Window !== "undefined" && el instanceof Window)
    return el.document.documentElement;
  if (typeof Document !== "undefined" && el instanceof Document)
    return el.documentElement;
  return el;
}
function checkOverflowScroll(ele) {
  const style = window.getComputedStyle(ele);
  if (style.overflowX === "scroll" || style.overflowY === "scroll" || style.overflowX === "auto" && ele.clientWidth < ele.scrollWidth || style.overflowY === "auto" && ele.clientHeight < ele.scrollHeight) {
    return true;
  } else {
    const parent = ele.parentNode;
    if (!parent || parent.tagName === "BODY")
      return false;
    return checkOverflowScroll(parent);
  }
}
function preventDefault(rawEvent) {
  const e2 = rawEvent || window.event;
  const _target = e2.target;
  if (checkOverflowScroll(_target))
    return false;
  if (e2.touches.length > 1)
    return true;
  if (e2.preventDefault)
    e2.preventDefault();
  return false;
}
const elInitialOverflow = /* @__PURE__ */ new WeakMap();
function useScrollLock(element, initialState = false) {
  const isLocked = ref$1(initialState);
  let stopTouchMoveListener = null;
  let initialOverflow = "";
  watch(toRef(element), (el) => {
    const target = resolveElement(toValue(el));
    if (target) {
      const ele = target;
      if (!elInitialOverflow.get(ele))
        elInitialOverflow.set(ele, ele.style.overflow);
      if (ele.style.overflow !== "hidden")
        initialOverflow = ele.style.overflow;
      if (ele.style.overflow === "hidden")
        return isLocked.value = true;
      if (isLocked.value)
        return ele.style.overflow = "hidden";
    }
  }, {
    immediate: true
  });
  const lock = () => {
    const el = resolveElement(toValue(element));
    if (!el || isLocked.value)
      return;
    if (isIOS) {
      stopTouchMoveListener = useEventListener(
        el,
        "touchmove",
        (e2) => {
          preventDefault(e2);
        },
        { passive: false }
      );
    }
    el.style.overflow = "hidden";
    isLocked.value = true;
  };
  const unlock = () => {
    const el = resolveElement(toValue(element));
    if (!el || !isLocked.value)
      return;
    if (isIOS)
      stopTouchMoveListener == null ? void 0 : stopTouchMoveListener();
    el.style.overflow = initialOverflow;
    elInitialOverflow.delete(el);
    isLocked.value = false;
  };
  tryOnScopeDispose(unlock);
  return computed({
    get() {
      return isLocked.value;
    },
    set(v2) {
      if (v2)
        lock();
      else unlock();
    }
  });
}
function onScrollLock() {
  let isMounted = false;
  const state = ref$1(false);
  return (el, binding) => {
    state.value = binding.value;
    if (isMounted)
      return;
    isMounted = true;
    const isLocked = useScrollLock(el, binding.value);
    watch(state, (v2) => isLocked.value = v2);
  };
}
onScrollLock();
register(t9);
const userStatus = {
  data() {
    return {
      hasStatus: false,
      userStatus: {
        status: null,
        message: null,
        icon: null
      }
    };
  },
  methods: {
    /**
     * Fetches the user-status from the server
     *
     * @param {string} userId UserId of the user to fetch the status for
     *
     * @return {Promise<void>}
     */
    async fetchUserStatus(userId) {
      if (!userId) {
        return;
      }
      const capabilities = e();
      if (!Object.prototype.hasOwnProperty.call(capabilities, "user_status") || !capabilities.user_status.enabled) {
        return;
      }
      if (!getCurrentUser()) {
        return;
      }
      try {
        const { data } = await cancelableClient.get(v("apps/user_status/api/v1/statuses/{userId}", { userId }));
        const {
          status,
          message,
          icon
        } = data.ocs.data;
        this.userStatus.status = status;
        this.userStatus.message = message || "";
        this.userStatus.icon = icon || "";
        this.hasStatus = true;
      } catch (e2) {
        if (e2.response.status === 404 && e2.response.data.ocs?.data?.length === 0) {
          return;
        }
        console.error(e2);
      }
    }
  }
};
const browserStorage = distExports.getBuilder("nextcloud").persist().build();
function getUserHasAvatar(userId) {
  const flag = browserStorage.getItem("user-has-avatar." + userId);
  if (typeof flag === "string") {
    return Boolean(flag);
  }
  return null;
}
function setUserHasAvatar(userId, flag) {
  if (userId) {
    browserStorage.setItem("user-has-avatar." + userId, flag);
  }
}
const _sfc_main = {
  name: "NcAvatar",
  directives: {
    ClickOutside: vOnClickOutside
  },
  components: {
    DotsHorizontal,
    NcActions,
    NcButton,
    NcIconSvgWrapper,
    NcLoadingIcon,
    NcUserStatusIcon
  },
  mixins: [userStatus],
  props: {
    /**
     * Set a custom url to the avatar image
     * either the url, user or displayName property must be defined
     */
    url: {
      type: String,
      default: void 0
    },
    /**
     * Set a css icon-class for an icon to be used instead of the avatar.
     */
    iconClass: {
      type: String,
      default: void 0
    },
    /**
     * Set the user id to fetch the avatar
     * either the url, user or displayName property must be defined
     */
    user: {
      type: String,
      default: void 0
    },
    /**
     * Do not show the user status on the avatar.
     */
    hideStatus: {
      type: Boolean,
      default: false
    },
    /**
     * Whether or not to display the user-status.
     * @deprecated - Use `hideStatus` instead. Will be removed with v9.
     */
    showUserStatus: {
      type: Boolean,
      default: true
    },
    /**
     * Show the verbose user status (e.g. "online" / "away") instead of just the status icon.
     */
    verboseStatus: {
      type: Boolean,
      default: false
    },
    /**
     * Whether or not to the status-icon should be used instead of online/away
     * @deprecated - Use `verboseStatus` instead. Will be removed with v9.
     */
    showUserStatusCompact: {
      type: Boolean,
      default: true
    },
    /**
     * When the user status was preloaded via another source it can be handed in with this property to save the request.
     * If this property is not set the status will be fetched automatically.
     * If a preloaded no-status is available provide this object with properties "status", "icon" and "message" set to null.
     */
    preloadedUserStatus: {
      type: Object,
      default: void 0
    },
    /**
     * Is the user a guest user (then we have to user a different endpoint)
     */
    isGuest: {
      type: Boolean,
      default: false
    },
    /**
     * Set a display name that will be rendered as a tooltip
     * either the url, user or displayName property must be defined
     * specify just the displayname to generate a placeholder avatar without
     * trying to fetch the avatar based on the user id
     */
    displayName: {
      type: String,
      default: void 0
    },
    /**
     * Set a size in px for the rendered avatar
     */
    size: {
      type: Number,
      default: 32
    },
    /**
     * Do not automatically generate a placeholder avatars if there is no real avatar is available.
     */
    noPlaceholder: {
      type: Boolean,
      default: false
    },
    /**
     * Placeholder avatars will be automatically generated when this is set to true.
     * @deprecated - Use `noPlaceholder` instead. Will be removed in v9.
     */
    allowPlaceholder: {
      type: Boolean,
      default: true
    },
    /**
     * Disable the tooltip
     */
    disableTooltip: {
      type: Boolean,
      default: false
    },
    /**
     * Disable the menu
     */
    disableMenu: {
      type: Boolean,
      default: false
    },
    /**
     * Declares a custom tooltip when not null
     * Fallback will be the displayName
     *
     * requires disableTooltip not to be set to true
     */
    tooltipMessage: {
      type: String,
      default: null
    },
    /**
     * Declares username is not a user's name, when true.
     * Prevents loading user's avatar from server and forces generating colored initials,
     * i.e. if the user is a group
     */
    isNoUser: {
      type: Boolean,
      default: false
    },
    /**
     * Selector for the popover menu container
     */
    menuContainer: {
      type: [String, Object, Element, Boolean],
      default: "body"
    }
  },
  data() {
    return {
      avatarUrlLoaded: null,
      avatarSrcSetLoaded: null,
      userDoesNotExist: false,
      isAvatarLoaded: false,
      isMenuLoaded: false,
      contactsMenuLoading: false,
      contactsMenuData: {},
      contactsMenuActions: [],
      contactsMenuOpenState: false
    };
  },
  computed: {
    avatarAriaLabel() {
      if (!this.hasMenu) {
        return;
      }
      if (this.canDisplayUserStatus || this.showUserStatusIconOnAvatar) {
        return t("Avatar of {displayName}, {status}", { displayName: this.displayName ?? this.user, status: getUserStatusText(this.userStatus.status) });
      }
      return t("Avatar of {displayName}", { displayName: this.displayName ?? this.user });
    },
    canDisplayUserStatus() {
      return !this.hideStatus && this.showUserStatus && this.hasStatus && ["online", "away", "busy", "dnd"].includes(this.userStatus.status);
    },
    showUserStatusIconOnAvatar() {
      return !this.hideStatus && this.showUserStatus && !this.verboseStatus && this.showUserStatusCompact && this.hasStatus && this.userStatus.status !== "dnd" && this.userStatus.icon;
    },
    /**
     * The user identifier, either the display name if set or the user property
     * If both properties are not set an empty string is returned
     */
    userIdentifier() {
      if (this.isDisplayNameDefined) {
        return this.displayName;
      }
      if (this.isUserDefined) {
        return this.user;
      }
      return "";
    },
    isUserDefined() {
      return typeof this.user !== "undefined";
    },
    isDisplayNameDefined() {
      return typeof this.displayName !== "undefined";
    },
    isUrlDefined() {
      return typeof this.url !== "undefined";
    },
    hasMenu() {
      if (this.disableMenu) {
        return false;
      }
      if (this.isMenuLoaded) {
        return this.menu.length > 0;
      }
      return !(this.user === getCurrentUser()?.uid || this.userDoesNotExist || this.url);
    },
    /**
     * True if initials should be shown as the user icon fallback
     */
    showInitials() {
      return !this.noPlaceholder && this.allowPlaceholder && this.userDoesNotExist && !(this.iconClass || this.$slots.icon);
    },
    avatarStyle() {
      return {
        "--size": this.size + "px",
        lineHeight: this.showInitials ? this.size + "px" : 0,
        fontSize: Math.round(this.size * 0.45) + "px"
      };
    },
    initialsWrapperStyle() {
      const { r, g, b } = usernameToColor(this.userIdentifier);
      return {
        backgroundColor: `rgba(${r}, ${g}, ${b}, 0.1)`
      };
    },
    initialsStyle() {
      const { r, g, b } = usernameToColor(this.userIdentifier);
      return {
        color: `rgb(${r}, ${g}, ${b})`
      };
    },
    tooltip() {
      if (this.disableTooltip) {
        return false;
      }
      if (this.tooltipMessage) {
        return this.tooltipMessage;
      }
      return this.displayName;
    },
    /**
     * Get the (max. two) initials of the user as uppcase string
     */
    initials() {
      let initials = "?";
      if (this.showInitials) {
        const user = this.userIdentifier.trim();
        if (user === "") {
          return initials;
        }
        const filteredChars = user.match(/[\p{L}\p{N}\s]/gu);
        if (filteredChars == null) {
          return initials;
        }
        const filtered = filteredChars.join("");
        const idx = filtered.lastIndexOf(" ");
        initials = String.fromCodePoint(filtered.codePointAt(0));
        if (idx !== -1) {
          initials = initials.concat(String.fromCodePoint(filtered.codePointAt(idx + 1)));
        }
      }
      return initials.toLocaleUpperCase();
    },
    menu() {
      const actions = this.contactsMenuActions.map((item) => {
        const route = getRoute(this.$router, item.hyperlink);
        return {
          ncActionComponent: route ? NcActionRouter : NcActionLink,
          ncActionComponentProps: route ? {
            to: route,
            icon: item.icon
          } : {
            href: item.hyperlink,
            icon: item.icon
          },
          text: item.title
        };
      });
      for (const action of getEnabledContactsMenuActions(this.contactsMenuData)) {
        try {
          actions.push({
            ncActionComponent: NcActionButton,
            ncActionComponentProps: {},
            ncActionComponentHandlers: {
              click: () => action.callback(this.contactsMenuData)
            },
            text: action.displayName(this.contactsMenuData),
            iconSvg: action.iconSvg(this.contactsMenuData)
          });
        } catch (error) {
          logger.error(`Failed to render ContactsMenu action ${action.id}`, {
            error,
            action
          });
        }
      }
      function escape2(html) {
        const text = document.createTextNode(html);
        const p = document.createElement("p");
        p.appendChild(text);
        return p.innerHTML;
      }
      if (!this.hideStatus && this.showUserStatus && (this.userStatus.icon || this.userStatus.message)) {
        const emojiIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
					<text x="50%" y="50%" text-anchor="middle" style="dominant-baseline: central; font-size: 85%">${escape2(this.userStatus.icon)}</text>
				</svg>`;
        return [{
          ncActionComponent: NcActionText,
          ncActionComponentProps: {},
          iconSvg: this.userStatus.icon ? emojiIcon : void 0,
          text: `${this.userStatus.message}`
        }].concat(actions);
      }
      return actions;
    }
  },
  watch: {
    url() {
      this.userDoesNotExist = false;
      this.loadAvatarUrl();
    },
    user() {
      this.userDoesNotExist = false;
      this.isMenuLoaded = false;
      this.loadAvatarUrl();
    }
  },
  mounted() {
    this.loadAvatarUrl();
    subscribe("settings:avatar:updated", this.loadAvatarUrl);
    subscribe("settings:display-name:updated", this.loadAvatarUrl);
    if (!this.hideStatus && this.showUserStatus && this.user && !this.isNoUser) {
      if (!this.preloadedUserStatus) {
        this.fetchUserStatus(this.user);
      } else {
        this.userStatus.status = this.preloadedUserStatus.status || "";
        this.userStatus.message = this.preloadedUserStatus.message || "";
        this.userStatus.icon = this.preloadedUserStatus.icon || "";
        this.hasStatus = this.preloadedUserStatus.status !== null;
      }
      subscribe("user_status:status.updated", this.handleUserStatusUpdated);
    }
  },
  beforeDestroy() {
    unsubscribe("settings:avatar:updated", this.loadAvatarUrl);
    unsubscribe("settings:display-name:updated", this.loadAvatarUrl);
    unsubscribe("user_status:status.updated", this.handleUserStatusUpdated);
  },
  methods: {
    t,
    handleUserStatusUpdated(state) {
      if (this.user === state.userId) {
        this.userStatus = {
          status: state.status,
          icon: state.icon,
          message: state.message
        };
      }
    },
    /**
     * Toggle the popover menu on click or enter
     * @param {KeyboardEvent|MouseEvent} event the UI event
     */
    async toggleMenu(event) {
      if (event.type === "keydown" && event.key !== "Enter") {
        return;
      }
      if (!this.contactsMenuOpenState) {
        await this.fetchContactsMenu();
      }
      this.contactsMenuOpenState = !this.contactsMenuOpenState;
    },
    closeMenu() {
      this.contactsMenuOpenState = false;
    },
    async fetchContactsMenu() {
      this.contactsMenuLoading = true;
      try {
        const user = encodeURIComponent(this.user);
        const { data } = await cancelableClient.post(_("contactsmenu/findOne"), `shareType=0&shareWith=${user}`);
        this.contactsMenuData = data;
        this.contactsMenuActions = data.topAction ? [data.topAction].concat(data.actions) : data.actions;
      } catch (e2) {
        this.contactsMenuOpenState = false;
      }
      this.contactsMenuLoading = false;
      this.isMenuLoaded = true;
    },
    /**
     * Handle avatar loading if user or url defined
     */
    loadAvatarUrl() {
      this.isAvatarLoaded = false;
      if (!this.isUrlDefined && (!this.isUserDefined || this.isNoUser || this.iconClass)) {
        this.isAvatarLoaded = true;
        this.userDoesNotExist = true;
        return;
      }
      if (this.isUrlDefined) {
        this.updateImageIfValid(this.url);
        return;
      }
      if (this.size <= 64) {
        const avatarUrl = this.avatarUrlGenerator(this.user, 64);
        const srcset = [
          avatarUrl + " 1x",
          this.avatarUrlGenerator(this.user, 512) + " 8x"
        ].join(", ");
        this.updateImageIfValid(avatarUrl, srcset);
      } else {
        const avatarUrl = this.avatarUrlGenerator(this.user, 512);
        this.updateImageIfValid(avatarUrl);
      }
    },
    /**
     * Generate an avatar url from the server's avatar endpoint
     *
     * @param {string} user the user id
     * @param {number} size the desired size
     * @return {string}
     */
    avatarUrlGenerator(user, size) {
      let avatarUrl = getAvatarUrl(user, size, this.isGuest);
      if (user === getCurrentUser()?.uid && typeof oc_userconfig !== "undefined") {
        avatarUrl += "?v=" + oc_userconfig.avatar.version;
      }
      return avatarUrl;
    },
    /**
     * Check if the provided url is valid and update Avatar if so
     *
     * @param {string} url the avatar url
     * @param {Array} srcset the avatar srcset
     */
    updateImageIfValid(url, srcset = null) {
      const userHasAvatar = getUserHasAvatar(this.user);
      if (this.isUserDefined && typeof userHasAvatar === "boolean") {
        this.isAvatarLoaded = true;
        this.avatarUrlLoaded = url;
        if (srcset) {
          this.avatarSrcSetLoaded = srcset;
        }
        if (userHasAvatar === false) {
          this.userDoesNotExist = true;
        }
        return;
      }
      const img = new Image();
      img.onload = () => {
        this.avatarUrlLoaded = url;
        if (srcset) {
          this.avatarSrcSetLoaded = srcset;
        }
        this.isAvatarLoaded = true;
        setUserHasAvatar(this.user, true);
      };
      img.onerror = () => {
        console.debug("Invalid avatar url", url);
        this.avatarUrlLoaded = null;
        this.avatarSrcSetLoaded = null;
        this.userDoesNotExist = true;
        this.isAvatarLoaded = false;
        setUserHasAvatar(this.user, false);
      };
      if (srcset) {
        img.srcset = srcset;
      }
      img.src = url;
    }
  }
};
var _sfc_render = function render5() {
  var _vm = this, _c = _vm._self._c;
  return _c("span", { directives: [{ name: "click-outside", rawName: "v-click-outside", value: _vm.closeMenu, expression: "closeMenu" }], ref: "main", staticClass: "avatardiv popovermenu-wrapper", class: {
    "avatardiv--unknown": _vm.userDoesNotExist,
    "avatardiv--with-menu": _vm.hasMenu,
    "avatardiv--with-menu-loading": _vm.contactsMenuLoading
  }, style: _vm.avatarStyle, attrs: { "title": _vm.tooltip } }, [_vm._t("icon", function() {
    return [_vm.iconClass ? _c("span", { staticClass: "avatar-class-icon", class: _vm.iconClass }) : _vm.isAvatarLoaded && !_vm.userDoesNotExist ? _c("img", { attrs: { "src": _vm.avatarUrlLoaded, "srcset": _vm.avatarSrcSetLoaded, "alt": "" } }) : _vm._e()];
  }), _vm.hasMenu && _vm.menu.length === 0 ? _c("NcButton", { staticClass: "action-item action-item__menutoggle", attrs: { "aria-label": _vm.avatarAriaLabel, "variant": "tertiary-no-background" }, on: { "click": _vm.toggleMenu }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
    return [_vm.contactsMenuLoading ? _c("NcLoadingIcon") : _c("DotsHorizontal", { attrs: { "size": 20 } })];
  }, proxy: true }], null, false, 2617833509) }) : _vm.hasMenu ? _c("NcActions", { attrs: { "aria-label": _vm.avatarAriaLabel, "container": _vm.menuContainer, "force-menu": "", "manual-open": "", "open": _vm.contactsMenuOpenState, "variant": "tertiary-no-background" }, on: { "update:open": function($event) {
    _vm.contactsMenuOpenState = $event;
  }, "click": _vm.toggleMenu }, scopedSlots: _vm._u([_vm.contactsMenuLoading ? { key: "icon", fn: function() {
    return [_c("NcLoadingIcon")];
  }, proxy: true } : null], null, true) }, _vm._l(_vm.menu, function(item, key) {
    return _c(item.ncActionComponent, _vm._g(_vm._b({ key, tag: "component", scopedSlots: _vm._u([item.iconSvg ? { key: "icon", fn: function() {
      return [_c("NcIconSvgWrapper", { attrs: { "svg": item.iconSvg } })];
    }, proxy: true } : null], null, true) }, "component", item.ncActionComponentProps, false), item.ncActionComponentHandlers), [_vm._v(" " + _vm._s(item.text) + " ")]);
  }), 1) : _vm._e(), _vm.showUserStatusIconOnAvatar ? _c("span", { staticClass: "avatardiv__user-status avatardiv__user-status--icon" }, [_vm._v(" " + _vm._s(_vm.userStatus.icon) + " ")]) : _vm.canDisplayUserStatus ? _c("NcUserStatusIcon", { staticClass: "avatardiv__user-status", attrs: { "status": _vm.userStatus.status, "aria-hidden": String(_vm.hasMenu) } }) : _vm._e(), _vm.showInitials ? _c("span", { staticClass: "avatardiv__initials-wrapper", style: _vm.initialsWrapperStyle }, [_c("span", { staticClass: "avatardiv__initials", style: _vm.initialsStyle }, [_vm._v(" " + _vm._s(_vm.initials) + " ")])]) : _vm._e()], 2);
};
var _sfc_staticRenderFns = [];
var __component__ = /* @__PURE__ */ normalizeComponent(
  _sfc_main,
  _sfc_render,
  _sfc_staticRenderFns,
  false,
  null,
  "f132fa9c"
);
const NcAvatar = __component__.exports;
export {
  Color as C,
  NcActionLink as N,
  NcAvatar as a,
  NcActionRouter as b,
  logger as l,
  userStatus as u
};
//# sourceMappingURL=NcAvatar-YSp2ORHc-CfTsACiM.chunk.mjs.map
