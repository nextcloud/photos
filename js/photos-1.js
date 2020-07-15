(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[1],{

/***/ "./node_modules/@nextcloud/axios/dist/index.js":
/*!*****************************************************!*\
  !*** ./node_modules/@nextcloud/axios/dist/index.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.object.assign */ "./node_modules/core-js/modules/es.object.assign.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _axios = _interopRequireDefault(__webpack_require__(/*! axios */ "./node_modules/axios/index.js"));

var _auth = __webpack_require__(/*! @nextcloud/auth */ "./node_modules/@nextcloud/auth/dist/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var client = _axios.default.create({
  headers: {
    requesttoken: (0, _auth.getRequestToken)()
  }
});

var cancelableClient = Object.assign(client, {
  CancelToken: _axios.default.CancelToken,
  isCancel: _axios.default.isCancel
});
(0, _auth.onRequestTokenUpdate)(function (token) {
  return client.defaults.headers.requesttoken = token;
});
var _default = cancelableClient;
exports.default = _default;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@nextcloud/vue/dist/Components/ActionButton.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@nextcloud/vue/dist/Components/ActionButton.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

!function(t,e){ true?module.exports=e():undefined}(window,(function(){return function(t){var e={};function n(o){if(e[o])return e[o].exports;var r=e[o]={i:o,l:!1,exports:{}};return t[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=t,n.c=e,n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(o,r,function(e){return t[e]}.bind(null,r));return o},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="/dist/",n(n.s=106)}({0:function(t,e,n){"use strict";function o(t,e,n,o,r,i,a,s){var c,u="function"==typeof t?t.options:t;if(e&&(u.render=e,u.staticRenderFns=n,u._compiled=!0),o&&(u.functional=!0),i&&(u._scopeId="data-v-"+i),a?(c=function(t){(t=t||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(t=__VUE_SSR_CONTEXT__),r&&r.call(this,t),t&&t._registeredComponents&&t._registeredComponents.add(a)},u._ssrRegister=c):r&&(c=s?function(){r.call(this,(u.functional?this.parent:this).$root.$options.shadowRoot)}:r),c)if(u.functional){u._injectStyles=c;var d=u.render;u.render=function(t,e){return c.call(e),d(t,e)}}else{var l=u.beforeCreate;u.beforeCreate=l?[].concat(l,c):[c]}return{exports:t,options:u}}n.d(e,"a",(function(){return o}))},1:function(t,e,n){"use strict";t.exports=function(t){var e=[];return e.toString=function(){return this.map((function(e){var n=function(t,e){var n=t[1]||"",o=t[3];if(!o)return n;if(e&&"function"==typeof btoa){var r=(a=o,s=btoa(unescape(encodeURIComponent(JSON.stringify(a)))),c="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(s),"/*# ".concat(c," */")),i=o.sources.map((function(t){return"/*# sourceURL=".concat(o.sourceRoot||"").concat(t," */")}));return[n].concat(i).concat([r]).join("\n")}var a,s,c;return[n].join("\n")}(e,t);return e[2]?"@media ".concat(e[2]," {").concat(n,"}"):n})).join("")},e.i=function(t,n,o){"string"==typeof t&&(t=[[null,t,""]]);var r={};if(o)for(var i=0;i<this.length;i++){var a=this[i][0];null!=a&&(r[a]=!0)}for(var s=0;s<t.length;s++){var c=[].concat(t[s]);o&&r[c[0]]||(n&&(c[2]?c[2]="".concat(n," and ").concat(c[2]):c[2]=n),e.push(c))}},e}},106:function(t,e,n){"use strict";n.r(e);var o=n(92);
/**
 * @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */e.default=o.a},14:function(t,e){t.exports=__webpack_require__(/*! core-js/modules/es.function.name */ "./node_modules/core-js/modules/es.function.name.js")},142:function(t,e,n){"use strict";var o=n(57);n.n(o).a},143:function(t,e,n){(e=n(1)(!1)).push([t.i,"li.active[data-v-d7c2d478]{box-shadow:inset 4px 0 var(--color-primary)}.action--disabled[data-v-d7c2d478]{pointer-events:none;opacity:.5}.action--disabled[data-v-d7c2d478]:hover,.action--disabled[data-v-d7c2d478]:focus{cursor:default;opacity:.5}.action--disabled *[data-v-d7c2d478]{opacity:1 !important}.action-button[data-v-d7c2d478]{display:flex;align-items:flex-start;width:100%;height:auto;margin:0;padding:0;padding-right:14px;cursor:pointer;white-space:nowrap;opacity:.7;color:var(--color-main-text);border:0;border-radius:0;background-color:transparent;box-shadow:none;font-weight:normal;line-height:44px}.action-button[data-v-d7c2d478]:hover,.action-button[data-v-d7c2d478]:focus{opacity:1}.action-button>span[data-v-d7c2d478]{cursor:pointer;white-space:nowrap}.action-button__icon[data-v-d7c2d478]{width:44px;height:44px;opacity:1;background-position:14px center;background-size:16px}.action-button p[data-v-d7c2d478]{width:150px;padding:7px 0;margin:auto;cursor:pointer;text-align:left;line-height:1.6em}.action-button__longtext[data-v-d7c2d478]{cursor:pointer;white-space:pre-wrap}.action-button__title[data-v-d7c2d478]{font-weight:bold}\n",""]),t.exports=e},19:function(t,e){t.exports=__webpack_require__(/*! core-js/modules/es.array.iterator */ "./node_modules/core-js/modules/es.array.iterator.js")},2:function(t,e,n){"use strict";function o(t,e){for(var n=[],o={},r=0;r<e.length;r++){var i=e[r],a=i[0],s={id:t+":"+r,css:i[1],media:i[2],sourceMap:i[3]};o[a]?o[a].parts.push(s):n.push(o[a]={id:a,parts:[s]})}return n}n.r(e),n.d(e,"default",(function(){return p}));var r="undefined"!=typeof document;if("undefined"!=typeof DEBUG&&DEBUG&&!r)throw new Error("vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment.");var i={},a=r&&(document.head||document.getElementsByTagName("head")[0]),s=null,c=0,u=!1,d=function(){},l=null,f="undefined"!=typeof navigator&&/msie [6-9]\b/.test(navigator.userAgent.toLowerCase());function p(t,e,n,r){u=n,l=r||{};var a=o(t,e);return h(a),function(e){for(var n=[],r=0;r<a.length;r++){var s=a[r];(c=i[s.id]).refs--,n.push(c)}e?h(a=o(t,e)):a=[];for(r=0;r<n.length;r++){var c;if(0===(c=n[r]).refs){for(var u=0;u<c.parts.length;u++)c.parts[u]();delete i[c.id]}}}}function h(t){for(var e=0;e<t.length;e++){var n=t[e],o=i[n.id];if(o){o.refs++;for(var r=0;r<o.parts.length;r++)o.parts[r](n.parts[r]);for(;r<n.parts.length;r++)o.parts.push(m(n.parts[r]));o.parts.length>n.parts.length&&(o.parts.length=n.parts.length)}else{var a=[];for(r=0;r<n.parts.length;r++)a.push(m(n.parts[r]));i[n.id]={id:n.id,refs:1,parts:a}}}}function v(){var t=document.createElement("style");return t.type="text/css",a.appendChild(t),t}function m(t){var e,n,o=document.querySelector('style[data-vue-ssr-id~="'+t.id+'"]');if(o){if(u)return d;o.parentNode.removeChild(o)}if(f){var r=c++;o=s||(s=v()),e=x.bind(null,o,r,!1),n=x.bind(null,o,r,!0)}else o=v(),e=y.bind(null,o),n=function(){o.parentNode.removeChild(o)};return e(t),function(o){if(o){if(o.css===t.css&&o.media===t.media&&o.sourceMap===t.sourceMap)return;e(t=o)}else n()}}var b,g=(b=[],function(t,e){return b[t]=e,b.filter(Boolean).join("\n")});function x(t,e,n,o){var r=n?"":o.css;if(t.styleSheet)t.styleSheet.cssText=g(e,r);else{var i=document.createTextNode(r),a=t.childNodes;a[e]&&t.removeChild(a[e]),a.length?t.insertBefore(i,a[e]):t.appendChild(i)}}function y(t,e){var n=e.css,o=e.media,r=e.sourceMap;if(o&&t.setAttribute("media",o),l.ssrId&&t.setAttribute("data-vue-ssr-id",e.id),r&&(n+="\n/*# sourceURL="+r.sources[0]+" */",n+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(r))))+" */"),t.styleSheet)t.styleSheet.cssText=n;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(n))}}},20:function(t,e){t.exports=__webpack_require__(/*! core-js/modules/es.string.iterator */ "./node_modules/core-js/modules/es.string.iterator.js")},21:function(t,e){t.exports=__webpack_require__(/*! core-js/modules/web.dom-collections.iterator */ "./node_modules/core-js/modules/web.dom-collections.iterator.js")},23:function(t,e,n){"use strict";n(14),n(24);var o=n(5),r=n.n(o);
/**
 * @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */e.a={before:function(){this.$slots.default&&""!==this.text.trim()||(r.a.util.warn("".concat(this.$options.name," cannot be empty and requires a meaningful text content"),this),this.$destroy(),this.$el.remove())},beforeUpdate:function(){this.text=this.getText()},data:function(){return{text:this.getText()}},computed:{isLongText:function(){return this.text&&this.text.trim().length>20}},methods:{getText:function(){return this.$slots.default?this.$slots.default[0].text.trim():""}}}},24:function(t,e){t.exports=__webpack_require__(/*! core-js/modules/es.string.trim */ "./node_modules/core-js/modules/es.string.trim.js")},25:function(t,e){t.exports=__webpack_require__(/*! core-js/modules/web.url */ "./node_modules/core-js/modules/web.url.js")},30:function(t,e,n){"use strict";n(19),n(4),n(20),n(21),n(25);var o=n(23),r=(n(14),function(t,e){for(var n=t.$parent;n;){if(n.$options.name===e)return n;n=n.$parent}});e.a={mixins:[o.a],props:{icon:{type:String,default:""},title:{type:String,default:""},closeAfterClick:{type:Boolean,default:!1},ariaLabel:{type:String,default:""}},computed:{isIconUrl:function(){try{return new URL(this.icon)}catch(t){return!1}}},methods:{onClick:function(t){if(this.$emit("click",t),this.closeAfterClick){var e=r(this,"Actions");e&&e.closeMenu&&e.closeMenu()}}}}},4:function(t,e){t.exports=__webpack_require__(/*! core-js/modules/es.object.to-string */ "./node_modules/core-js/modules/es.object.to-string.js")},5:function(t,e){t.exports=__webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm.js")},57:function(t,e,n){var o=n(143);"string"==typeof o&&(o=[[t.i,o,""]]),o.locals&&(t.exports=o.locals);(0,n(2).default)("d994391e",o,!0,{})},67:function(t,e){},92:function(t,e,n){"use strict";var o={name:"ActionButton",mixins:[n(30).a],props:{disabled:{type:Boolean,default:!1}},computed:{isFocusable:function(){return!this.disabled}}},r=(n(142),n(0)),i=n(67),a=n.n(i),s=Object(r.a)(o,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("li",{staticClass:"action",class:{"action--disabled":t.disabled}},[n("button",{staticClass:"action-button",class:{focusable:t.isFocusable},attrs:{"aria-label":t.ariaLabel},on:{click:t.onClick}},[n("span",{staticClass:"action-button__icon",class:[t.isIconUrl?"action-button__icon--url":t.icon],style:{backgroundImage:t.isIconUrl?"url("+t.icon+")":null}}),t._v(" "),t.title?n("p",[n("strong",{staticClass:"action-button__title"},[t._v("\n\t\t\t\t"+t._s(t.title)+"\n\t\t\t")]),t._v(" "),n("br"),t._v(" "),n("span",{staticClass:"action-button__longtext",domProps:{textContent:t._s(t.text)}})]):t.isLongText?n("p",{staticClass:"action-button__longtext",domProps:{textContent:t._s(t.text)}}):n("span",{staticClass:"action-button__text"},[t._v(t._s(t.text))]),t._v(" "),t._e()],2)])}),[],!1,null,"d7c2d478",null);"function"==typeof a.a&&a()(s);e.a=s.exports}})}));
//# sourceMappingURL=ActionButton.js.map

/***/ }),

/***/ "./node_modules/@nextcloud/vue/dist/Components/Actions.js":
/*!****************************************************************!*\
  !*** ./node_modules/@nextcloud/vue/dist/Components/Actions.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

!function(e,t){ true?module.exports=t():undefined}(window,(function(){return function(e){var t={};function s(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,s),o.l=!0,o.exports}return s.m=e,s.c=t,s.d=function(e,t,n){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},s.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(s.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)s.d(n,o,function(t){return e[t]}.bind(null,o));return n},s.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="/dist/",s(s.s=42)}([function(e,t,s){"use strict";function n(e,t,s,n,o,A,r,a){var c,i="function"==typeof e?e.options:e;if(t&&(i.render=t,i.staticRenderFns=s,i._compiled=!0),n&&(i.functional=!0),A&&(i._scopeId="data-v-"+A),r?(c=function(e){(e=e||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(e=__VUE_SSR_CONTEXT__),o&&o.call(this,e),e&&e._registeredComponents&&e._registeredComponents.add(r)},i._ssrRegister=c):o&&(c=a?function(){o.call(this,(i.functional?this.parent:this).$root.$options.shadowRoot)}:o),c)if(i.functional){i._injectStyles=c;var l=i.render;i.render=function(e,t){return c.call(t),l(e,t)}}else{var m=i.beforeCreate;i.beforeCreate=m?[].concat(m,c):[c]}return{exports:e,options:i}}s.d(t,"a",(function(){return n}))},function(e,t,s){"use strict";e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var s=function(e,t){var s=e[1]||"",n=e[3];if(!n)return s;if(t&&"function"==typeof btoa){var o=(r=n,a=btoa(unescape(encodeURIComponent(JSON.stringify(r)))),c="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(a),"/*# ".concat(c," */")),A=n.sources.map((function(e){return"/*# sourceURL=".concat(n.sourceRoot||"").concat(e," */")}));return[s].concat(A).concat([o]).join("\n")}var r,a,c;return[s].join("\n")}(t,e);return t[2]?"@media ".concat(t[2]," {").concat(s,"}"):s})).join("")},t.i=function(e,s,n){"string"==typeof e&&(e=[[null,e,""]]);var o={};if(n)for(var A=0;A<this.length;A++){var r=this[A][0];null!=r&&(o[r]=!0)}for(var a=0;a<e.length;a++){var c=[].concat(e[a]);n&&o[c[0]]||(s&&(c[2]?c[2]="".concat(s," and ").concat(c[2]):c[2]=s),t.push(c))}},t}},function(e,t,s){"use strict";function n(e,t){for(var s=[],n={},o=0;o<t.length;o++){var A=t[o],r=A[0],a={id:e+":"+o,css:A[1],media:A[2],sourceMap:A[3]};n[r]?n[r].parts.push(a):s.push(n[r]={id:r,parts:[a]})}return s}s.r(t),s.d(t,"default",(function(){return u}));var o="undefined"!=typeof document;if("undefined"!=typeof DEBUG&&DEBUG&&!o)throw new Error("vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment.");var A={},r=o&&(document.head||document.getElementsByTagName("head")[0]),a=null,c=0,i=!1,l=function(){},m=null,g="undefined"!=typeof navigator&&/msie [6-9]\b/.test(navigator.userAgent.toLowerCase());function u(e,t,s,o){i=s,m=o||{};var r=n(e,t);return d(r),function(t){for(var s=[],o=0;o<r.length;o++){var a=r[o];(c=A[a.id]).refs--,s.push(c)}t?d(r=n(e,t)):r=[];for(o=0;o<s.length;o++){var c;if(0===(c=s[o]).refs){for(var i=0;i<c.parts.length;i++)c.parts[i]();delete A[c.id]}}}}function d(e){for(var t=0;t<e.length;t++){var s=e[t],n=A[s.id];if(n){n.refs++;for(var o=0;o<n.parts.length;o++)n.parts[o](s.parts[o]);for(;o<s.parts.length;o++)n.parts.push(M(s.parts[o]));n.parts.length>s.parts.length&&(n.parts.length=s.parts.length)}else{var r=[];for(o=0;o<s.parts.length;o++)r.push(M(s.parts[o]));A[s.id]={id:s.id,refs:1,parts:r}}}}function p(){var e=document.createElement("style");return e.type="text/css",r.appendChild(e),e}function M(e){var t,s,n=document.querySelector('style[data-vue-ssr-id~="'+e.id+'"]');if(n){if(i)return l;n.parentNode.removeChild(n)}if(g){var o=c++;n=a||(a=p()),t=h.bind(null,n,o,!1),s=h.bind(null,n,o,!0)}else n=p(),t=T.bind(null,n),s=function(){n.parentNode.removeChild(n)};return t(e),function(n){if(n){if(n.css===e.css&&n.media===e.media&&n.sourceMap===e.sourceMap)return;t(e=n)}else s()}}var f,v=(f=[],function(e,t){return f[e]=t,f.filter(Boolean).join("\n")});function h(e,t,s,n){var o=s?"":n.css;if(e.styleSheet)e.styleSheet.cssText=v(t,o);else{var A=document.createTextNode(o),r=e.childNodes;r[t]&&e.removeChild(r[t]),r.length?e.insertBefore(A,r[t]):e.appendChild(A)}}function T(e,t){var s=t.css,n=t.media,o=t.sourceMap;if(n&&e.setAttribute("media",n),m.ssrId&&e.setAttribute("data-vue-ssr-id",t.id),o&&(s+="\n/*# sourceURL="+o.sources[0]+" */",s+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(o))))+" */"),e.styleSheet)e.styleSheet.cssText=s;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(s))}}},function(e,t){e.exports=__webpack_require__(/*! v-tooltip */ "./node_modules/v-tooltip/dist/v-tooltip.esm.js")},function(e,t){e.exports=__webpack_require__(/*! core-js/modules/es.object.to-string */ "./node_modules/core-js/modules/es.object.to-string.js")},function(e,t){e.exports=__webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm.js")},function(e,t,s){"use strict";s.d(t,"b",(function(){return a})),s.d(t,"a",(function(){return r}));s(12);var n=s(28),o=Object(n.getGettextBuilder)().detectLocale();[{locale:"br",json:{charset:"utf-8",headers:{"Last-Translator":"Kervoas-Le Nabat Ewen <ewenkervoas@free.fr>, 2020","Language-Team":"Breton (https://www.transifex.com/nextcloud/teams/64236/br/)","Content-Type":"text/plain; charset=UTF-8",Language:"br","Plural-Forms":"nplurals=5; plural=((n%10 == 1) && (n%100 != 11) && (n%100 !=71) && (n%100 !=91) ? 0 :(n%10 == 2) && (n%100 != 12) && (n%100 !=72) && (n%100 !=92) ? 1 :(n%10 ==3 || n%10==4 || n%10==9) && (n%100 < 10 || n% 100 > 19) && (n%100 < 70 || n%100 > 79) && (n%100 < 90 || n%100 > 99) ? 2 :(n != 0 && n % 1000000 == 0) ? 3 : 4);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nKervoas-Le Nabat Ewen <ewenkervoas@free.fr>, 2020\n"},msgstr:["Last-Translator: Kervoas-Le Nabat Ewen <ewenkervoas@free.fr>, 2020\nLanguage-Team: Breton (https://www.transifex.com/nextcloud/teams/64236/br/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: br\nPlural-Forms: nplurals=5; plural=((n%10 == 1) && (n%100 != 11) && (n%100 !=71) && (n%100 !=91) ? 0 :(n%10 == 2) && (n%100 != 12) && (n%100 !=72) && (n%100 !=92) ? 1 :(n%10 ==3 || n%10==4 || n%10==9) && (n%100 < 10 || n% 100 > 19) && (n%100 < 70 || n%100 > 79) && (n%100 < 90 || n%100 > 99) ? 2 :(n != 0 && n % 1000000 == 0) ? 3 : 4);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (diwelus)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (bevennet)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:249"},msgstr:["Oberenn"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Dibab"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Seriñ"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Da heul"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["Disoc'h ebet"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Arsav an diaporama"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["A-raok"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Chaoz un tag"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Arvetoù"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Kregiñ an diaporama"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["N'eo ket evit klask ar strollad"]}}}}},{locale:"ca",json:{charset:"utf-8",headers:{"Last-Translator":"Carles Ferrando Garcia <carles.ferrando@gnuescultura.eu>, 2020","Language-Team":"Catalan (https://www.transifex.com/nextcloud/teams/64236/ca/)","Content-Type":"text/plain; charset=UTF-8",Language:"ca","Plural-Forms":"nplurals=2; plural=(n != 1);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nMarc Riera <marcriera@softcatala.org>, 2020\nCarles Ferrando Garcia <carles.ferrando@gnuescultura.eu>, 2020\n"},msgstr:["Last-Translator: Carles Ferrando Garcia <carles.ferrando@gnuescultura.eu>, 2020\nLanguage-Team: Catalan (https://www.transifex.com/nextcloud/teams/64236/ca/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: ca\nPlural-Forms: nplurals=2; plural=(n != 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (invisible)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (restringit)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:249"},msgstr:["Accions"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Trieu"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Tanca"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Següent"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["Sense resultats"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Atura la presentació"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Anterior"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Selecciona una etiqueta"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Paràmetres"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Inicia la presentació"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["No es pot cercar el grup"]}}}}},{locale:"cs_CZ",json:{charset:"utf-8",headers:{"Last-Translator":"Pavel Borecki <pavel.borecki@gmail.com>, 2020","Language-Team":"Czech (Czech Republic) (https://www.transifex.com/nextcloud/teams/64236/cs_CZ/)","Content-Type":"text/plain; charset=UTF-8",Language:"cs_CZ","Plural-Forms":"nplurals=4; plural=(n == 1 && n % 1 == 0) ? 0 : (n >= 2 && n <= 4 && n % 1 == 0) ? 1: (n % 1 != 0 ) ? 2 : 3;"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nPavel Borecki <pavel.borecki@gmail.com>, 2020\n"},msgstr:["Last-Translator: Pavel Borecki <pavel.borecki@gmail.com>, 2020\nLanguage-Team: Czech (Czech Republic) (https://www.transifex.com/nextcloud/teams/64236/cs_CZ/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: cs_CZ\nPlural-Forms: nplurals=4; plural=(n == 1 && n % 1 == 0) ? 0 : (n >= 2 && n <= 4 && n % 1 == 0) ? 1: (n % 1 != 0 ) ? 2 : 3;\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (neviditelný)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (omezený)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:247"},msgstr:["Akce"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Zvolit"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Zavřít"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Následující"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:34"},msgstr:["Žádné výsledky"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Pozastavit prezentaci"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Předchozí"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Vybrat štítek"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Nastavení"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Spustit prezentaci"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:138"},msgstr:["Nedaří se hledat skupinu"]}}}}},{locale:"da",json:{charset:"utf-8",headers:{"Last-Translator":"Thomas Nielsen <thsnielsen@gmail.com>, 2020","Language-Team":"Danish (https://www.transifex.com/nextcloud/teams/64236/da/)","Content-Type":"text/plain; charset=UTF-8",Language:"da","Plural-Forms":"nplurals=2; plural=(n != 1);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nThomas Nielsen <thsnielsen@gmail.com>, 2020\n"},msgstr:["Last-Translator: Thomas Nielsen <thsnielsen@gmail.com>, 2020\nLanguage-Team: Danish (https://www.transifex.com/nextcloud/teams/64236/da/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: da\nPlural-Forms: nplurals=2; plural=(n != 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (usynlig)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (begrænset)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:247"},msgstr:["Handlinger"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Vælg"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Luk"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Videre"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:172\nsrc/components/MultiselectTags/MultiselectTags.vue:78"},msgstr:["Ingen resultater"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Suspender fremvisning"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Forrige"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Vælg et mærke"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Indstillinger"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Start fremvisning"]}}}}},{locale:"de",json:{charset:"utf-8",headers:{"Last-Translator":"Andreas Eitel <github-aneitel@online.de>, 2020","Language-Team":"German (https://www.transifex.com/nextcloud/teams/64236/de/)","Content-Type":"text/plain; charset=UTF-8",Language:"de","Plural-Forms":"nplurals=2; plural=(n != 1);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nMark Ziegler <mark.ziegler@rakekniven.de>, 2020\nPhilipp Fischbeck <pfischbeck@googlemail.com>, 2020\nAndreas Eitel <github-aneitel@online.de>, 2020\n"},msgstr:["Last-Translator: Andreas Eitel <github-aneitel@online.de>, 2020\nLanguage-Team: German (https://www.transifex.com/nextcloud/teams/64236/de/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: de\nPlural-Forms: nplurals=2; plural=(n != 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (unsichtbar)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (eingeschränkt)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:247"},msgstr:["Aktionen"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Auswählen"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Schließen"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Weiter"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["Keine Ergebnisse"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Diashow pausieren"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Vorherige"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Schlagwort auswählen"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Einstellungen"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Diashow starten"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["Die Gruppe konnte nicht durchsucht werden"]}}}}},{locale:"de_DE",json:{charset:"utf-8",headers:{"Last-Translator":"ProfDrJones <jones@fs.cs.hm.edu>, 2020","Language-Team":"German (Germany) (https://www.transifex.com/nextcloud/teams/64236/de_DE/)","Content-Type":"text/plain; charset=UTF-8",Language:"de_DE","Plural-Forms":"nplurals=2; plural=(n != 1);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nMark Ziegler <mark.ziegler@rakekniven.de>, 2020\nPhilipp Fischbeck <pfischbeck@googlemail.com>, 2020\nProfDrJones <jones@fs.cs.hm.edu>, 2020\n"},msgstr:["Last-Translator: ProfDrJones <jones@fs.cs.hm.edu>, 2020\nLanguage-Team: German (Germany) (https://www.transifex.com/nextcloud/teams/64236/de_DE/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: de_DE\nPlural-Forms: nplurals=2; plural=(n != 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (unsichtbar)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (eingeschränkt)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:247"},msgstr:["Aktionen"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Auswählen"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Schließen"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Weiter"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:34"},msgstr:["Keine Ergebnisse"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Diashow pausieren"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Vorherige"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Schlagwort auswählen"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Einstellungen"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Diashow starten"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:138"},msgstr:["Die Gruppe kann nicht durchsucht werden"]}}}}},{locale:"el",json:{charset:"utf-8",headers:{"Last-Translator":"george k <norhorn@gmail.com>, 2020","Language-Team":"Greek (https://www.transifex.com/nextcloud/teams/64236/el/)","Content-Type":"text/plain; charset=UTF-8",Language:"el","Plural-Forms":"nplurals=2; plural=(n != 1);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nEfstathios Iosifidis <iefstathios@gmail.com>, 2020\ngeorge k <norhorn@gmail.com>, 2020\n"},msgstr:["Last-Translator: george k <norhorn@gmail.com>, 2020\nLanguage-Team: Greek (https://www.transifex.com/nextcloud/teams/64236/el/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: el\nPlural-Forms: nplurals=2; plural=(n != 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (αόρατο)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (περιορισμένο)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:247"},msgstr:["Ενέργειες"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Επιλογή"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Κλείσιμο"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Επόμενο"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:34"},msgstr:["Κανένα αποτέλεσμα"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Παύση προβολής διαφανειών"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Προηγούμενο"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Επιλογή ετικέτας"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Ρυθμίσεις"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Έναρξη προβολής διαφανειών"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:138"},msgstr:["Δεν είναι δυνατή η αναζήτηση της ομάδας"]}}}}},{locale:"es",json:{charset:"utf-8",headers:{"Last-Translator":"asd fgh <c1@cgps.xyz>, 2020","Language-Team":"Spanish (https://www.transifex.com/nextcloud/teams/64236/es/)","Content-Type":"text/plain; charset=UTF-8",Language:"es","Plural-Forms":"nplurals=2; plural=(n != 1);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\njavier san felipe <jsanfe@gmail.com>, 2020\nasd fgh <c1@cgps.xyz>, 2020\n"},msgstr:["Last-Translator: asd fgh <c1@cgps.xyz>, 2020\nLanguage-Team: Spanish (https://www.transifex.com/nextcloud/teams/64236/es/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: es\nPlural-Forms: nplurals=2; plural=(n != 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{etiqueta} (invisible)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{etiqueta} (restringido)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:247"},msgstr:["acciones"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Elige"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Cierra"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Siguiente"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:172\nsrc/components/MultiselectTags/MultiselectTags.vue:78"},msgstr:[" Ningún resultado"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Pausa la presentación "]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Anterior"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Selecciona una etiqueta"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Ajustes"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Comienza la presentación "]}}}}},{locale:"eu",json:{charset:"utf-8",headers:{"Last-Translator":"Asier Iturralde Sarasola <asier.iturralde@gmail.com>, 2020","Language-Team":"Basque (https://www.transifex.com/nextcloud/teams/64236/eu/)","Content-Type":"text/plain; charset=UTF-8",Language:"eu","Plural-Forms":"nplurals=2; plural=(n != 1);"},translations:{"":{"":{msgid:"",comments:{translator:"Translators:\nAsier Iturralde Sarasola <asier.iturralde@gmail.com>, 2020\n"},msgstr:["Last-Translator: Asier Iturralde Sarasola <asier.iturralde@gmail.com>, 2020\nLanguage-Team: Basque (https://www.transifex.com/nextcloud/teams/64236/eu/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: eu\nPlural-Forms: nplurals=2; plural=(n != 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:169"},msgstr:["{tag} (ikusezina)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:172"},msgstr:["{tag} (mugatua)"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Aukeratu"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:109"},msgstr:["Itxi"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:154"},msgstr:["Hurrengoa"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:169\nsrc/components/MultiselectTags/MultiselectTags.vue:78"},msgstr:["Emaitzarik ez"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:290"},msgstr:["Pausatu diaporama"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:134"},msgstr:["Aurrekoa"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Hautatu etiketa bat"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Ezarpenak"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:290"},msgstr:["Hasi diaporama"]}}}}},{locale:"fi_FI",json:{charset:"utf-8",headers:{"Last-Translator":"Robin Lahtinen <robin.lahtinen@gmail.com>, 2020","Language-Team":"Finnish (Finland) (https://www.transifex.com/nextcloud/teams/64236/fi_FI/)","Content-Type":"text/plain; charset=UTF-8",Language:"fi_FI","Plural-Forms":"nplurals=2; plural=(n != 1);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nRobin Lahtinen <robin.lahtinen@gmail.com>, 2020\n"},msgstr:["Last-Translator: Robin Lahtinen <robin.lahtinen@gmail.com>, 2020\nLanguage-Team: Finnish (Finland) (https://www.transifex.com/nextcloud/teams/64236/fi_FI/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: fi_FI\nPlural-Forms: nplurals=2; plural=(n != 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (näkymätön)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (rajoitettu)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:247"},msgstr:["Toiminnot"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Valitse"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Sulje"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Seuraava"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["Ei tuloksia"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Keskeytä diaesitys"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Edellinen"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Valitse tagi"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Asetukset"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Aloita diaesitys"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["Ryhmää ei voi hakea"]}}}}},{locale:"fr",json:{charset:"utf-8",headers:{"Last-Translator":"Luclu7 <theluc7andcompagnie@gmail.com>, 2020","Language-Team":"French (https://www.transifex.com/nextcloud/teams/64236/fr/)","Content-Type":"text/plain; charset=UTF-8",Language:"fr","Plural-Forms":"nplurals=2; plural=(n > 1);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nBrendan Abolivier <transifex@brendanabolivier.com>, 2020\ngud bes <gudbes@protonmail.com>, 2020\nGreg Greg <grena@grenabox.fr>, 2020\nLuclu7 <theluc7andcompagnie@gmail.com>, 2020\n"},msgstr:["Last-Translator: Luclu7 <theluc7andcompagnie@gmail.com>, 2020\nLanguage-Team: French (https://www.transifex.com/nextcloud/teams/64236/fr/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: fr\nPlural-Forms: nplurals=2; plural=(n > 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (invisible)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (restreint)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:247"},msgstr:["Actions"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Choisir"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Fermer"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Suivant"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["Aucun résultat"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Mettre le diaporama en pause"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Précédent"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Sélectionnez une balise"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Paramètres"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Démarrer le diaporama"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["Impossible de chercher le groupe"]}}}}},{locale:"gl",json:{charset:"utf-8",headers:{"Last-Translator":"Anonymous Person <pessoaemluta@protonmail.com>, 2020","Language-Team":"Galician (https://www.transifex.com/nextcloud/teams/64236/gl/)","Content-Type":"text/plain; charset=UTF-8",Language:"gl","Plural-Forms":"nplurals=2; plural=(n != 1);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nMiguel Anxo Bouzada <mbouzada@gmail.com>, 2020\nAnonymous Person <pessoaemluta@protonmail.com>, 2020\n"},msgstr:["Last-Translator: Anonymous Person <pessoaemluta@protonmail.com>, 2020\nLanguage-Team: Galician (https://www.transifex.com/nextcloud/teams/64236/gl/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: gl\nPlural-Forms: nplurals=2; plural=(n != 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (invisíbel)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (restrinxido)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:247"},msgstr:["Accións"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Escoller"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Pechar"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Seguinte"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["Sen resultados"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Pausar o diaporama"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Anterir"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Seleccione unha etiqueta"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Axustes"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Iniciar o diaporama"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["Non se puido procurar o grupo."]}}}}},{locale:"he",json:{charset:"utf-8",headers:{"Last-Translator":"Yaron Shahrabani <sh.yaron@gmail.com>, 2020","Language-Team":"Hebrew (https://www.transifex.com/nextcloud/teams/64236/he/)","Content-Type":"text/plain; charset=UTF-8",Language:"he","Plural-Forms":"nplurals=4; plural=(n == 1 && n % 1 == 0) ? 0 : (n == 2 && n % 1 == 0) ? 1: (n % 10 == 0 && n % 1 == 0 && n > 10) ? 2 : 3;"},translations:{"":{"":{msgid:"",comments:{translator:"Translators:\nYaron Shahrabani <sh.yaron@gmail.com>, 2020\n"},msgstr:["Last-Translator: Yaron Shahrabani <sh.yaron@gmail.com>, 2020\nLanguage-Team: Hebrew (https://www.transifex.com/nextcloud/teams/64236/he/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: he\nPlural-Forms: nplurals=4; plural=(n == 1 && n % 1 == 0) ? 0 : (n == 2 && n % 1 == 0) ? 1: (n % 10 == 0 && n % 1 == 0 && n > 10) ? 2 : 3;\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:169"},msgstr:["{tag} (נסתר)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:172"},msgstr:["{tag} (מוגבל)"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["בחירה"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:109"},msgstr:["סגירה"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:154"},msgstr:["הבא"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:169\nsrc/components/MultiselectTags/MultiselectTags.vue:78"},msgstr:["אין תוצאות"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:290"},msgstr:["השהיית מצגת"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:134"},msgstr:["הקודם"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["בחירת תגית"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["הגדרות"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:290"},msgstr:["התחלת המצגת"]}}}}},{locale:"hu_HU",json:{charset:"utf-8",headers:{"Last-Translator":"asbot10 <asbot000@gmail.com>, 2020","Language-Team":"Hungarian (Hungary) (https://www.transifex.com/nextcloud/teams/64236/hu_HU/)","Content-Type":"text/plain; charset=UTF-8",Language:"hu_HU","Plural-Forms":"nplurals=2; plural=(n != 1);"},translations:{"":{"":{msgid:"",comments:{translator:"Translators:\nBalázs Meskó <mesko.balazs@fsf.hu>, 2020\nasbot10 <asbot000@gmail.com>, 2020\n"},msgstr:["Last-Translator: asbot10 <asbot000@gmail.com>, 2020\nLanguage-Team: Hungarian (Hungary) (https://www.transifex.com/nextcloud/teams/64236/hu_HU/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: hu_HU\nPlural-Forms: nplurals=2; plural=(n != 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (láthatatlan)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (korlátozott)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:197"},msgstr:["Műveletek"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Válassszon"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Bezárás"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Következő"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:172\nsrc/components/MultiselectTags/MultiselectTags.vue:78"},msgstr:["Nincs találat"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Diavetítés szüneteltetése"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Előző"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Válasszon címkét"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Beállítások"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Diavetítés indítása"]}}}}},{locale:"is",json:{charset:"utf-8",headers:{"Last-Translator":"Sveinn í Felli <sv1@fellsnet.is>, 2020","Language-Team":"Icelandic (https://www.transifex.com/nextcloud/teams/64236/is/)","Content-Type":"text/plain; charset=UTF-8",Language:"is","Plural-Forms":"nplurals=2; plural=(n % 10 != 1 || n % 100 == 11);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nSveinn í Felli <sv1@fellsnet.is>, 2020\n"},msgstr:["Last-Translator: Sveinn í Felli <sv1@fellsnet.is>, 2020\nLanguage-Team: Icelandic (https://www.transifex.com/nextcloud/teams/64236/is/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: is\nPlural-Forms: nplurals=2; plural=(n % 10 != 1 || n % 100 == 11);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (ósýnilegt)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (takmarkað)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:247"},msgstr:["Aðgerðir"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Velja"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Loka"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Næsta"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["Engar niðurstöður"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Gera hlé á skyggnusýningu"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Fyrri"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Veldu merki"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Stillingar"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Byrja skyggnusýningu"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["Get ekki leitað í hópnum"]}}}}},{locale:"it",json:{charset:"utf-8",headers:{"Last-Translator":"Random_R, 2020","Language-Team":"Italian (https://www.transifex.com/nextcloud/teams/64236/it/)","Content-Type":"text/plain; charset=UTF-8",Language:"it","Plural-Forms":"nplurals=2; plural=(n != 1);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nRandom_R, 2020\n"},msgstr:["Last-Translator: Random_R, 2020\nLanguage-Team: Italian (https://www.transifex.com/nextcloud/teams/64236/it/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: it\nPlural-Forms: nplurals=2; plural=(n != 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (invisibile)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (limitato)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:247"},msgstr:["Azioni"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Scegli"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Chiudi"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Successivo"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:34"},msgstr:["Nessun risultato"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Presentazione in pausa"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Precedente"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Seleziona un'etichetta"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Impostazioni"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Avvia presentazione"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:138"},msgstr:["Impossibile cercare il gruppo"]}}}}},{locale:"ja_JP",json:{charset:"utf-8",headers:{"Last-Translator":"YANO Tetsu <tetuyano+transi@gmail.com>, 2020","Language-Team":"Japanese (Japan) (https://www.transifex.com/nextcloud/teams/64236/ja_JP/)","Content-Type":"text/plain; charset=UTF-8",Language:"ja_JP","Plural-Forms":"nplurals=1; plural=0;"},translations:{"":{"":{msgid:"",comments:{translator:"Translators:\nYANO Tetsu <tetuyano+transi@gmail.com>, 2020\n"},msgstr:["Last-Translator: YANO Tetsu <tetuyano+transi@gmail.com>, 2020\nLanguage-Team: Japanese (Japan) (https://www.transifex.com/nextcloud/teams/64236/ja_JP/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: ja_JP\nPlural-Forms: nplurals=1; plural=0;\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{タグ} (不可視)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{タグ} (制限付)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:196"},msgstr:["操作"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["選択"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["閉じる"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["次"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:172\nsrc/components/MultiselectTags/MultiselectTags.vue:78"},msgstr:["なし"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["スライドショーを一時停止"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["前"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["タグを選択"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["設定"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["スライドショーを開始"]}}}}},{locale:"lt_LT",json:{charset:"utf-8",headers:{"Last-Translator":"Moo, 2020","Language-Team":"Lithuanian (Lithuania) (https://www.transifex.com/nextcloud/teams/64236/lt_LT/)","Content-Type":"text/plain; charset=UTF-8",Language:"lt_LT","Plural-Forms":"nplurals=4; plural=(n % 10 == 1 && (n % 100 > 19 || n % 100 < 11) ? 0 : (n % 10 >= 2 && n % 10 <=9) && (n % 100 > 19 || n % 100 < 11) ? 1 : n % 1 != 0 ? 2: 3);"},translations:{"":{"":{msgid:"",comments:{translator:"Translators:\nMoo, 2020\n"},msgstr:["Last-Translator: Moo, 2020\nLanguage-Team: Lithuanian (Lithuania) (https://www.transifex.com/nextcloud/teams/64236/lt_LT/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: lt_LT\nPlural-Forms: nplurals=4; plural=(n % 10 == 1 && (n % 100 > 19 || n % 100 < 11) ? 0 : (n % 10 >= 2 && n % 10 <=9) && (n % 100 > 19 || n % 100 < 11) ? 1 : n % 1 != 0 ? 2: 3);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:169"},msgstr:["{tag} (nematoma)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:172"},msgstr:["{tag} (apribota)"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Pasirinkti"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:109"},msgstr:["Užverti"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:154"},msgstr:["Kitas"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:169\nsrc/components/MultiselectTags/MultiselectTags.vue:78"},msgstr:["Nėra rezultatų"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:290"},msgstr:["Pristabdyti skaidrių rodymą"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:134"},msgstr:["Ankstesnis"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Pasirinkti žymę"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Nustatymai"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:290"},msgstr:["Pradėti skaidrių rodymą"]}}}}},{locale:"lv",json:{charset:"utf-8",headers:{"Last-Translator":"stendec <stendec@inbox.lv>, 2020","Language-Team":"Latvian (https://www.transifex.com/nextcloud/teams/64236/lv/)","Content-Type":"text/plain; charset=UTF-8",Language:"lv","Plural-Forms":"nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n != 0 ? 1 : 2);"},translations:{"":{"":{msgid:"",comments:{translator:"Translators:\nstendec <stendec@inbox.lv>, 2020\n"},msgstr:["Last-Translator: stendec <stendec@inbox.lv>, 2020\nLanguage-Team: Latvian (https://www.transifex.com/nextcloud/teams/64236/lv/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: lv\nPlural-Forms: nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n != 0 ? 1 : 2);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:169"},msgstr:["{tag} (neredzams)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:172"},msgstr:["{tag} (ierobežots)"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Izvēlēties"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:109"},msgstr:["Aizvērt"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:154"},msgstr:["Nākamais"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:169\nsrc/components/MultiselectTags/MultiselectTags.vue:78"},msgstr:["Nav rezultātu"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:290"},msgstr:["Pauzēt slaidrādi"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:134"},msgstr:["Iepriekšējais"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Izvēlēties birku"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Iestatījumi"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:290"},msgstr:["Sākt slaidrādi"]}}}}},{locale:"mk",json:{charset:"utf-8",headers:{"Last-Translator":"Сашко Тодоров, 2020","Language-Team":"Macedonian (https://www.transifex.com/nextcloud/teams/64236/mk/)","Content-Type":"text/plain; charset=UTF-8",Language:"mk","Plural-Forms":"nplurals=2; plural=(n % 10 == 1 && n % 100 != 11) ? 0 : 1;"},translations:{"":{"":{msgid:"",comments:{translator:"Translators:\nСашко Тодоров, 2020\n"},msgstr:["Last-Translator: Сашко Тодоров, 2020\nLanguage-Team: Macedonian (https://www.transifex.com/nextcloud/teams/64236/mk/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: mk\nPlural-Forms: nplurals=2; plural=(n % 10 == 1 && n % 100 != 11) ? 0 : 1;\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:169"},msgstr:["{tag} (невидливо)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:172"},msgstr:["{tag} (ограничено)"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Избери"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:109"},msgstr:["Затвори"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:154"},msgstr:["Следно"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:169\nsrc/components/MultiselectTags/MultiselectTags.vue:78"},msgstr:["Нема резултати"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:290"},msgstr:["Пузирај слајдшоу"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:134"},msgstr:["Предходно"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Избери ознака"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Параметри"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:290"},msgstr:["Стартувај слајдшоу"]}}}}},{locale:"nb_NO",json:{charset:"utf-8",headers:{"Last-Translator":"Ole Jakob Brustad <ole.jakob@brustadbuss.no>, 2020","Language-Team":"Norwegian Bokmål (Norway) (https://www.transifex.com/nextcloud/teams/64236/nb_NO/)","Content-Type":"text/plain; charset=UTF-8",Language:"nb_NO","Plural-Forms":"nplurals=2; plural=(n != 1);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nOle Jakob Brustad <ole.jakob@brustadbuss.no>, 2020\n"},msgstr:["Last-Translator: Ole Jakob Brustad <ole.jakob@brustadbuss.no>, 2020\nLanguage-Team: Norwegian Bokmål (Norway) (https://www.transifex.com/nextcloud/teams/64236/nb_NO/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: nb_NO\nPlural-Forms: nplurals=2; plural=(n != 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (usynlig)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (beskyttet)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:247"},msgstr:["Handlinger"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Velg"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Lukk"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Neste"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:172\nsrc/components/MultiselectTags/MultiselectTags.vue:78"},msgstr:["Ingen resultat"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Pause lysbildefremvisning"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Forrige"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Velg et merke"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Instillinger"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Start lysbildefremvisning"]}}}}},{locale:"nl",json:{charset:"utf-8",headers:{"Last-Translator":"Arjan van S, 2020","Language-Team":"Dutch (https://www.transifex.com/nextcloud/teams/64236/nl/)","Content-Type":"text/plain; charset=UTF-8",Language:"nl","Plural-Forms":"nplurals=2; plural=(n != 1);"},translations:{"":{"":{msgid:"",comments:{translator:"Translators:\nRoeland Jago Douma <roeland@famdouma.nl>, 2020\nArjan van S, 2020\n"},msgstr:["Last-Translator: Arjan van S, 2020\nLanguage-Team: Dutch (https://www.transifex.com/nextcloud/teams/64236/nl/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: nl\nPlural-Forms: nplurals=2; plural=(n != 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (onzichtbaar)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (beperkt)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:196"},msgstr:["Acties"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Kies"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Sluiten"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Volgende"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:172\nsrc/components/MultiselectTags/MultiselectTags.vue:78"},msgstr:["Geen resultaten"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Pauzeer diavoorstelling"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Vorige"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Selecteer een label"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Instellingen"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Start diavoorstelling"]}}}}},{locale:"oc",json:{charset:"utf-8",headers:{"Last-Translator":"Quentin PAGÈS, 2020","Language-Team":"Occitan (post 1500) (https://www.transifex.com/nextcloud/teams/64236/oc/)","Content-Type":"text/plain; charset=UTF-8",Language:"oc","Plural-Forms":"nplurals=2; plural=(n > 1);"},translations:{"":{"":{msgid:"",comments:{translator:"Translators:\nQuentin PAGÈS, 2020\n"},msgstr:["Last-Translator: Quentin PAGÈS, 2020\nLanguage-Team: Occitan (post 1500) (https://www.transifex.com/nextcloud/teams/64236/oc/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: oc\nPlural-Forms: nplurals=2; plural=(n > 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (invisible)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (limit)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:194"},msgstr:["Accions"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Causir"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Tampar"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Seguent"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:172\nsrc/components/MultiselectTags/MultiselectTags.vue:78"},msgstr:["Cap de resultat"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Metre en pausa lo diaporama"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Precedent"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Seleccionar una etiqueta"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Paramètres"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Lançar lo diaporama"]}}}}},{locale:"pl",json:{charset:"utf-8",headers:{"Last-Translator":"Valdnet, 2020","Language-Team":"Polish (https://www.transifex.com/nextcloud/teams/64236/pl/)","Content-Type":"text/plain; charset=UTF-8",Language:"pl","Plural-Forms":"nplurals=4; plural=(n==1 ? 0 : (n%10>=2 && n%10<=4) && (n%100<12 || n%100>14) ? 1 : n!=1 && (n%10>=0 && n%10<=1) || (n%10>=5 && n%10<=9) || (n%100>=12 && n%100<=14) ? 2 : 3);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nValdnet, 2020\n"},msgstr:["Last-Translator: Valdnet, 2020\nLanguage-Team: Polish (https://www.transifex.com/nextcloud/teams/64236/pl/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: pl\nPlural-Forms: nplurals=4; plural=(n==1 ? 0 : (n%10>=2 && n%10<=4) && (n%100<12 || n%100>14) ? 1 : n!=1 && (n%10>=0 && n%10<=1) || (n%10>=5 && n%10<=9) || (n%100>=12 && n%100<=14) ? 2 : 3);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (niewidoczna)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (ograniczona)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:247"},msgstr:["Działania"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Wybierz"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Zamknij"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Następny"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:34"},msgstr:["Brak wyników"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Wstrzymaj pokaz slajdów"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Poprzedni"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Wybierz etykietę"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Ustawienia"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Rozpocznij pokaz slajdów"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:138"},msgstr:["Nie można przeszukać grupy"]}}}}},{locale:"pt_BR",json:{charset:"utf-8",headers:{"Last-Translator":"Paulo Schopf, 2020","Language-Team":"Portuguese (Brazil) (https://www.transifex.com/nextcloud/teams/64236/pt_BR/)","Content-Type":"text/plain; charset=UTF-8",Language:"pt_BR","Plural-Forms":"nplurals=2; plural=(n > 1);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nMaurício Gardini <accounts@mauriciogardini.com>, 2020\nPaulo Schopf, 2020\n"},msgstr:["Last-Translator: Paulo Schopf, 2020\nLanguage-Team: Portuguese (Brazil) (https://www.transifex.com/nextcloud/teams/64236/pt_BR/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: pt_BR\nPlural-Forms: nplurals=2; plural=(n > 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (invisível)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (restrito) "]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:247"},msgstr:["Ações"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Escolher"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Fechar"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Próximo"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:34"},msgstr:["Sem resultados"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Pausar apresentação de slides"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Anterior"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Selecionar uma tag"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Configurações"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Iniciar apresentação de slides"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:138"},msgstr:["Não foi possível pesquisar o grupo"]}}}}},{locale:"pt_PT",json:{charset:"utf-8",headers:{"Last-Translator":"fpapoila <fpapoila@gmail.com>, 2020","Language-Team":"Portuguese (Portugal) (https://www.transifex.com/nextcloud/teams/64236/pt_PT/)","Content-Type":"text/plain; charset=UTF-8",Language:"pt_PT","Plural-Forms":"nplurals=2; plural=(n != 1);"},translations:{"":{"":{msgid:"",comments:{translator:"Translators:\nfpapoila <fpapoila@gmail.com>, 2020\n"},msgstr:["Last-Translator: fpapoila <fpapoila@gmail.com>, 2020\nLanguage-Team: Portuguese (Portugal) (https://www.transifex.com/nextcloud/teams/64236/pt_PT/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: pt_PT\nPlural-Forms: nplurals=2; plural=(n != 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:169"},msgstr:["{tag} (invisivel)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:172"},msgstr:["{tag} (restrito)"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Escolher"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:109"},msgstr:["Fechar"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:154"},msgstr:["Proximo"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:169\nsrc/components/MultiselectTags/MultiselectTags.vue:78"},msgstr:["Sem resultados"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:290"},msgstr:["Pausar apresentação de slides"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:134"},msgstr:["Anterior"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Selecionar etiqueta"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Definições"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:290"},msgstr:["Iniciar apresentação de slides"]}}}}},{locale:"ru",json:{charset:"utf-8",headers:{"Last-Translator":"Alex <kekcuha@gmail.com>, 2020","Language-Team":"Russian (https://www.transifex.com/nextcloud/teams/64236/ru/)","Content-Type":"text/plain; charset=UTF-8",Language:"ru","Plural-Forms":"nplurals=4; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<12 || n%100>14) ? 1 : n%10==0 || (n%10>=5 && n%10<=9) || (n%100>=11 && n%100<=14)? 2 : 3);"},translations:{"":{"":{msgid:"",comments:{translator:"Translators:\nAlex <kekcuha@gmail.com>, 2020\n"},msgstr:["Last-Translator: Alex <kekcuha@gmail.com>, 2020\nLanguage-Team: Russian (https://www.transifex.com/nextcloud/teams/64236/ru/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: ru\nPlural-Forms: nplurals=4; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<12 || n%100>14) ? 1 : n%10==0 || (n%10>=5 && n%10<=9) || (n%100>=11 && n%100<=14)? 2 : 3);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:169"},msgstr:["{tag} (невидимое)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:172"},msgstr:["{tag} (ограниченное)"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Выберите"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:109"},msgstr:["Закрыть"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:154"},msgstr:["Следующее"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:169\nsrc/components/MultiselectTags/MultiselectTags.vue:78"},msgstr:["Результаты отсуствуют"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:290"},msgstr:["Приостановить показ слйдов"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:134"},msgstr:["Предыдущее"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Выберите метку"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Параметры"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:290"},msgstr:["Начать показ слайдов"]}}}}},{locale:"sk_SK",json:{charset:"utf-8",headers:{"Last-Translator":"Anton Kuchár <tonokuc@pobox.sk>, 2020","Language-Team":"Slovak (Slovakia) (https://www.transifex.com/nextcloud/teams/64236/sk_SK/)","Content-Type":"text/plain; charset=UTF-8",Language:"sk_SK","Plural-Forms":"nplurals=4; plural=(n % 1 == 0 && n == 1 ? 0 : n % 1 == 0 && n >= 2 && n <= 4 ? 1 : n % 1 != 0 ? 2: 3);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nAnton Kuchár <tonokuc@pobox.sk>, 2020\n"},msgstr:["Last-Translator: Anton Kuchár <tonokuc@pobox.sk>, 2020\nLanguage-Team: Slovak (Slovakia) (https://www.transifex.com/nextcloud/teams/64236/sk_SK/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: sk_SK\nPlural-Forms: nplurals=4; plural=(n % 1 == 0 && n == 1 ? 0 : n % 1 == 0 && n >= 2 && n <= 4 ? 1 : n % 1 != 0 ? 2: 3);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (neviditeľný)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (obmedzený)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:247"},msgstr:["Akcie"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Vybrať"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Zatvoriť"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Ďalší"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["Žiadne výsledky"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Pozastaviť prezentáciu"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Predchádzajúci"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Vybrať štítok"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Nastavenia"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Začať prezentáciu"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["Skupinu sa nepodarilo nájsť"]}}}}},{locale:"sv",json:{charset:"utf-8",headers:{"Last-Translator":"Jonatan Nyberg, 2020","Language-Team":"Swedish (https://www.transifex.com/nextcloud/teams/64236/sv/)","Content-Type":"text/plain; charset=UTF-8",Language:"sv","Plural-Forms":"nplurals=2; plural=(n != 1);"},translations:{"":{"":{msgid:"",comments:{translator:"Translators:\nGabriel Ekström <gabriel.ekstrom06@gmail.com>, 2020\nErik Lennartsson, 2020\nJonatan Nyberg, 2020\n"},msgstr:["Last-Translator: Jonatan Nyberg, 2020\nLanguage-Team: Swedish (https://www.transifex.com/nextcloud/teams/64236/sv/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: sv\nPlural-Forms: nplurals=2; plural=(n != 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (osynlig)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (begränsad)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:194"},msgstr:["Åtgärder"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Välj"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Stäng"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Nästa"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:172\nsrc/components/MultiselectTags/MultiselectTags.vue:78"},msgstr:["Inga resultat"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Pausa bildspel"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Föregående"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Välj en tag"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Inställningar"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Starta bildspel"]}}}}},{locale:"tr",json:{charset:"utf-8",headers:{"Last-Translator":"Hüseyin Fahri Uzun <mail@fahriuzun.com>, 2020","Language-Team":"Turkish (https://www.transifex.com/nextcloud/teams/64236/tr/)","Content-Type":"text/plain; charset=UTF-8",Language:"tr","Plural-Forms":"nplurals=2; plural=(n > 1);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nKemal Oktay Aktoğan <oktayaktogan@gmail.com>, 2020\nabc Def <hdogan1974@gmail.com>, 2020\nHüseyin Fahri Uzun <mail@fahriuzun.com>, 2020\n"},msgstr:["Last-Translator: Hüseyin Fahri Uzun <mail@fahriuzun.com>, 2020\nLanguage-Team: Turkish (https://www.transifex.com/nextcloud/teams/64236/tr/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: tr\nPlural-Forms: nplurals=2; plural=(n > 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (görünmez)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (kısıtlı)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:247"},msgstr:["Eylemler"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Seç"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Kapat"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Sonraki"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["Sonuçlar yok"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Slayt gösterisini duraklat"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Önceki"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Bir etiket seçin"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Ayarlar"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Slayt gösterisini başlat"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["Grupta arama yapılamıyor"]}}}}},{locale:"uk",json:{charset:"utf-8",headers:{"Last-Translator":"Oleksa Stasevych <oleksiy.stasevych@gmail.com>, 2020","Language-Team":"Ukrainian (https://www.transifex.com/nextcloud/teams/64236/uk/)","Content-Type":"text/plain; charset=UTF-8",Language:"uk","Plural-Forms":"nplurals=4; plural=(n % 1 == 0 && n % 10 == 1 && n % 100 != 11 ? 0 : n % 1 == 0 && n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? 1 : n % 1 == 0 && (n % 10 ==0 || (n % 10 >=5 && n % 10 <=9) || (n % 100 >=11 && n % 100 <=14 )) ? 2: 3);"},translations:{"":{"":{msgid:"",comments:{translator:"Translators:\nOleksa Stasevych <oleksiy.stasevych@gmail.com>, 2020\n"},msgstr:["Last-Translator: Oleksa Stasevych <oleksiy.stasevych@gmail.com>, 2020\nLanguage-Team: Ukrainian (https://www.transifex.com/nextcloud/teams/64236/uk/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: uk\nPlural-Forms: nplurals=4; plural=(n % 1 == 0 && n % 10 == 1 && n % 100 != 11 ? 0 : n % 1 == 0 && n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? 1 : n % 1 == 0 && (n % 10 ==0 || (n % 10 >=5 && n % 10 <=9) || (n % 100 >=11 && n % 100 <=14 )) ? 2: 3);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (invisible)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (restricted)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:197"},msgstr:["Дії"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Виберіть"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Закрити"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Вперед"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:172\nsrc/components/MultiselectTags/MultiselectTags.vue:78"},msgstr:["Відсутні результати"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Пауза у показі слайдів"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Назад"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Виберіть позначку"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Налаштування"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Почати показ слайдів"]}}}}},{locale:"zh_CN",json:{charset:"utf-8",headers:{"Last-Translator":"Pascal Janus <pascal_janus@163.com>, 2020","Language-Team":"Chinese (China) (https://www.transifex.com/nextcloud/teams/64236/zh_CN/)","Content-Type":"text/plain; charset=UTF-8",Language:"zh_CN","Plural-Forms":"nplurals=1; plural=0;"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nSleepyJesse <Jesse_Xu@live.com>, 2020\nJianming Liang <fuufuukun@163.com>, 2020\nPascal Janus <pascal_janus@163.com>, 2020\n"},msgstr:["Last-Translator: Pascal Janus <pascal_janus@163.com>, 2020\nLanguage-Team: Chinese (China) (https://www.transifex.com/nextcloud/teams/64236/zh_CN/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: zh_CN\nPlural-Forms: nplurals=1; plural=0;\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} （不可见）"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} （受限）"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:247"},msgstr:["行为"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["选择"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["关闭"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["下一个"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["无结果"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["暂停幻灯片"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["上一个"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["选择一个标签"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["设置"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["开始幻灯片"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["无法搜索分组"]}}}}},{locale:"zh_TW",json:{charset:"utf-8",headers:{"Last-Translator":"byStarTW (pan93412) <pan93412@gmail.com>, 2020","Language-Team":"Chinese (Taiwan) (https://www.transifex.com/nextcloud/teams/64236/zh_TW/)","Content-Type":"text/plain; charset=UTF-8",Language:"zh_TW","Plural-Forms":"nplurals=1; plural=0;"},translations:{"":{"":{msgid:"",comments:{translator:"Translators:\nbyStarTW (pan93412) <pan93412@gmail.com>, 2020\n"},msgstr:["Last-Translator: byStarTW (pan93412) <pan93412@gmail.com>, 2020\nLanguage-Team: Chinese (Taiwan) (https://www.transifex.com/nextcloud/teams/64236/zh_TW/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: zh_TW\nPlural-Forms: nplurals=1; plural=0;\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:169"},msgstr:["{tag} (隱藏)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:172"},msgstr:["{tag} (受限)"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["選擇"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:109"},msgstr:["關閉"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:154"},msgstr:["下一個"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:169\nsrc/components/MultiselectTags/MultiselectTags.vue:78"},msgstr:["無結果"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:290"},msgstr:["暫停幻燈片"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:134"},msgstr:["上一個"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["選擇標籤"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["設定"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:290"},msgstr:["開始幻燈片"]}}}}}].map((function(e){return o.addTranslation(e.locale,e.json)}));var A=o.build(),r=A.ngettext.bind(A),a=A.gettext.bind(A)},function(e,t,s){"use strict";e.exports=function(e,t){return t||(t={}),"string"!=typeof(e=e&&e.__esModule?e.default:e)?e:(/^['"].*['"]$/.test(e)&&(e=e.slice(1,-1)),t.hash&&(e+=t.hash),/["'() \t\n]/.test(e)||t.needQuotes?'"'.concat(e.replace(/"/g,'\\"').replace(/\n/g,"\\n"),'"'):e)}},function(e,t,s){"use strict";s.r(t),t.default="data:application/vnd.ms-fontobject;base64,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"},function(e,t,s){"use strict";s.r(t),t.default="data:font/woff;base64,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DDUAAgAACQIE4gTiBOIMNfseBOAAAQAAAAEAAAbpB9lfDzz1AAsTiAAAAADbKjHOAAAAANrZVc7//wAAE5MTiAAAAAgAAgAAAAAAAAABAAATiAAAAAATiP////UTkwABAAAAAAAAAAAAAAAAAAAABwAAAAATiAAAE4gAABOIAAATiAAABjYAABOIAAAAAP//AAAAAAAAAAAAAAAAAAAAAAAiADYAWABsAIAAlAC0AQ4BfAGaAhACJgI0AkIAAQAAAA8ASwADAAAAAAACAAAACgAKAAAA/wAAAAAAAAAAABAAxgABAAAAAAABABQAAAABAAAAAAACAAcAFAABAAAAAAADABQAGwABAAAAAAAEABQALwABAAAAAAAFAAsAQwABAAAAAAAGABQATgABAAAAAAAKACsAYgABAAAAAAALABMAjQADAAEECQABACgAoAADAAEECQACAA4AyAADAAEECQADACgA1gADAAEECQAEACgA/gADAAEECQAFABYBJgADAAEECQAGACgBPAADAAEECQAKAFYBZAADAAEECQALACYBumljb25mb250LXZ1ZS00NGEyOGI5UmVndWxhcmljb25mb250LXZ1ZS00NGEyOGI5aWNvbmZvbnQtdnVlLTQ0YTI4YjlWZXJzaW9uIDEuMGljb25mb250LXZ1ZS00NGEyOGI5R2VuZXJhdGVkIGJ5IHN2ZzJ0dGYgZnJvbSBGb250ZWxsbyBwcm9qZWN0Lmh0dHA6Ly9mb250ZWxsby5jb20AaQBjAG8AbgBmAG8AbgB0AC0AdgB1AGUALQA0ADQAYQAyADgAYgA5AFIAZQBnAHUAbABhAHIAaQBjAG8AbgBmAG8AbgB0AC0AdgB1AGUALQA0ADQAYQAyADgAYgA5AGkAYwBvAG4AZgBvAG4AdAAtAHYAdQBlAC0ANAA0AGEAMgA4AGIAOQBWAGUAcgBzAGkAbwBuACAAMQAuADAAaQBjAG8AbgBmAG8AbgB0AC0AdgB1AGUALQA0ADQAYQAyADgAYgA5AEcAZQBuAGUAcgBhAHQAZQBkACAAYgB5ACAAcwB2AGcAMgB0AHQAZgAgAGYAcgBvAG0AIABGAG8AbgB0AGUAbABsAG8AIABwAHIAbwBqAGUAYwB0AC4AaAB0AHQAcAA6AC8ALwBmAG8AbgB0AGUAbABsAG8ALgBjAG8AbQAAAAIAAAAAAAAAMgAAAAAAAAAAAAAAAAAAAAAAAAAAAA8ADwAAAQIBAwEEAQUBBgEHAQgBCQEKAQsBDAENAQ4BDxFhcnJvdy1sZWZ0LWRvdWJsZQphcnJvdy1sZWZ0EmFycm93LXJpZ2h0LWRvdWJsZQthcnJvdy1yaWdodApicmVhZGNydW1iCWNoZWNrbWFyawVjbG9zZQdjb25maXJtBGluZm8EbWVudQRtb3JlBXBhdXNlBHBsYXkKdHJpYW5nbGUtcw=="},function(e,t,s){"use strict";s.r(t),t.default="data:font/ttf;base64,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"},function(e,t,s){"use strict";s.r(t),t.default="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCIgPjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48bWV0YWRhdGE+PC9tZXRhZGF0YT48ZGVmcz48Zm9udCBpZD0iaWNvbmZvbnQtdnVlLTQ0YTI4YjkiIGhvcml6LWFkdi14PSI1MDAwIj48Zm9udC1mYWNlIGZvbnQtZmFtaWx5PSJpY29uZm9udC12dWUtNDRhMjhiOSIgZm9udC13ZWlnaHQ9IjQwMCIgZm9udC1zdHJldGNoPSJub3JtYWwiIHVuaXRzLXBlci1lbT0iNTAwMCIgcGFub3NlLTE9IjIgMCA1IDMgMCAwIDAgMCAwIDAiIGFzY2VudD0iNTAwMCIgZGVzY2VudD0iMCIgeC1oZWlnaHQ9IjAiIGJib3g9Ii0xIDAgNTAxMSA1MDAwIiB1bmRlcmxpbmUtdGhpY2tuZXNzPSIwIiB1bmRlcmxpbmUtcG9zaXRpb249IjUwIiB1bmljb2RlLXJhbmdlPSJVK2VhMDEtZWEwZSIgLz48bWlzc2luZy1nbHlwaCBob3Jpei1hZHYteD0iMCIgIC8+PGdseXBoIGdseXBoLW5hbWU9ImFycm93LWxlZnQtZG91YmxlIiB1bmljb2RlPSImI3hlYTAxOyIgZD0iTTM3NTAgMzkwNiBsLTE0MDYgLTE0MDYgbDE0MDYgLTE0MDYgbDAgMzEyIGwtMTA5NCAxMDk0IGwxMDk0IDEwOTQgbDAgMzEyIFpNMjM0NCAzOTA2IGwtMTQwNiAtMTQwNiBsMTQwNiAtMTQwNiBsMCAzMTIgbC0xMDk0IDEwOTQgbDEwOTQgMTA5NCBsMCAzMTIgWiIgLz48Z2x5cGggZ2x5cGgtbmFtZT0iYXJyb3ctbGVmdCIgdW5pY29kZT0iJiN4ZWEwMjsiIGQ9Ik0xNTYzIDI1MDAgbDE4NzUgLTE4NzUgbDAgLTMxMiBsLTIxODggMjE4NyBsMjE4OCAyMTg4IGwwIC0zMTMgbC0xODc1IC0xODc1IFoiIC8+PGdseXBoIGdseXBoLW5hbWU9ImFycm93LXJpZ2h0LWRvdWJsZSIgdW5pY29kZT0iJiN4ZWEwMzsiIGQ9Ik0xMjUwIDEwOTQgbDE0MDYgMTQwNiBsLTE0MDYgMTQwNiBsMCAtMzEyIGwxMDk0IC0xMDk0IGwtMTA5NCAtMTA5NCBsMCAtMzEyIFpNMjY1NiAxMDk0IGwxNDA3IDE0MDYgbC0xNDA3IDE0MDYgbDAgLTMxMiBsMTA5NCAtMTA5NCBsLTEwOTQgLTEwOTQgbDAgLTMxMiBaIiAvPjxnbHlwaCBnbHlwaC1uYW1lPSJhcnJvdy1yaWdodCIgdW5pY29kZT0iJiN4ZWEwNDsiIGQ9Ik0zNDM4IDI1MDAgbC0xODc1IDE4NzUgbDAgMzEzIGwyMTg3IC0yMTg4IGwtMjE4NyAtMjE4NyBsMCAzMTIgbDE4NzUgMTg3NSBaIiAvPjxnbHlwaCBnbHlwaC1uYW1lPSJicmVhZGNydW1iIiB1bmljb2RlPSImI3hlYTA1OyIgZD0iTTE0OCA1MDAwIGwtMTQ4IC04NSBsMTM5NCAtMjQxNSBsLTEzOTQgLTI0MTUgbDE0OCAtODUgbDE0NDMgMjUwMCBsLTE0NDMgMjUwMCBaIiAvPjxnbHlwaCBnbHlwaC1uYW1lPSJjaGVja21hcmsiIHVuaWNvZGU9IiYjeGVhMDY7IiBkPSJNNDA0NSAzOTcxIGwtMjA2MSAtMjA2MSBsLTEwMjkgMTAyOSBsLTQ0MiAtNDQxIGwxNDcxIC0xNDcxIGwyNTAzIDI1MDIgbC00NDIgNDQyIFoiIC8+PGdseXBoIGdseXBoLW5hbWU9ImNsb3NlIiB1bmljb2RlPSImI3hlYTA3OyIgZD0iTTQzNzUgMTE1NiBsLTUzMSAtNTMxIGwtMTM0NCAxMzQ0IGwtMTM0NCAtMTM0NCBsLTUzMSA1MzEgbDEzNDQgMTM0NCBsLTEzNDQgMTM0NCBsNTMxIDUzMSBsMTM0NCAtMTM0NCBsMTM0NCAxMzQ0IGw1MzEgLTUzMSBsLTEzNDQgLTEzNDQgbDEzNDQgLTEzNDQgWiIgLz48Z2x5cGggZ2x5cGgtbmFtZT0iY29uZmlybSIgdW5pY29kZT0iJiN4ZWEwODsiIGQ9Ik0yNjU2IDQ4NDQgcS0xMDEgMCAtMTgwIC01NyBxLTc0IC01MiAtMTA5IC0xMzggcS0zNSAtODYgLTE5IC0xNzUgcTE4IC05NiA5MCAtMTY3IGwxNDk1IC0xNDk0IGwtMzYxNiAwIHEtNzcgMSAtMTM5IC0yNiBxLTU4IC0yNCAtOTkgLTcwIHEtMzkgLTQ0IC01OSAtMTAxIHEtMjAgLTU2IC0yMCAtMTE2IHEwIC02MCAyMCAtMTE2IHEyMCAtNTcgNTkgLTEwMSBxNDEgLTQ2IDk5IC03MCBxNjIgLTI3IDEzOSAtMjUgbDM2MTYgMCBsLTE0OTUgLTE0OTUgcS01NSAtNTMgLTgxIC0xMTYgcS0yNCAtNTkgLTIxIC0xMjEgcTMgLTU4IDMwIC0xMTMgcTI1IC01NCA2OCAtOTcgcTQzIC00MyA5NiAtNjggcTU1IC0yNiAxMTQgLTI5IHE2MiAtMyAxMjAgMjEgcTYzIDI1IDExNiA4MSBsMjAyOSAyMDI4IHE1OSA2MCA4MCAxNDEgcTIxIDgwIDEgMTU5IHEtMjEgODIgLTgxIDE0MiBsLTIwMjkgMjAyOCBxLTQ0IDQ1IC0xMDIgNzAgcS01OCAyNSAtMTIyIDI1IFoiIC8+PGdseXBoIGdseXBoLW5hbWU9ImluZm8iIHVuaWNvZGU9IiYjeGVhMDk7IiBkPSJNMjQyMiA0Njg4IHEtMTExIDAgLTIxMyAtNDMgcS05OCAtNDIgLTE3NCAtMTE3LjUgcS03NiAtNzUuNSAtMTE3IC0xNzQuNSBxLTQzIC0xMDEgLTQzIC0yMTIuNSBxMCAtMTExLjUgNDMgLTIxMi41IHE0MSAtOTggMTE3IC0xNzQgcTc2IC03NiAxNzQgLTExNyBxMTAyIC00MyAyMTMgLTQzIHExMTEgMCAyMTMgNDMgcTk4IDQxIDE3My41IDExNyBxNzUuNSA3NiAxMTcuNSAxNzQgcTQzIDEwMSA0MyAyMTIuNSBxMCAxMTEuNSAtNDMgMjEyLjUgcS00MiA5OSAtMTE3LjUgMTc0LjUgcS03NS41IDc1LjUgLTE3My41IDExNy41IHEtMTAyIDQzIC0yMTMgNDMgWk0xNTYzIDMxMjUgcS04NiAwIC0xNTggLTQzIHEtNzEgLTQxIC0xMTIgLTExMiBxLTQzIC03MiAtNDMgLTE1Ny41IHEwIC04NS41IDQzIC0xNTcuNSBxNDEgLTcxIDExMiAtMTEyIHE3MiAtNDMgMTU4IC00MyBsNjI1IDAgbDAgLTE1NjIgbC02MjUgMCBxLTg2IDAgLTE1OCAtNDMgcS03MSAtNDEgLTExMiAtMTEyIHEtNDMgLTczIC00MyAtMTU4IHEwIC04NSA0MyAtMTU4IHE0MSAtNzEgMTEyIC0xMTIgcTcyIC00MyAxNTggLTQyIGwxODc1IDAgcTg1IDAgMTU3IDQyIHE3MSA0MSAxMTIgMTEyIHE0MyA3MyA0MyAxNTggcTAgODUgLTQzIDE1OCBxLTQxIDcxIC0xMTIgMTEyIHEtNzIgNDMgLTE1NyA0MyBsLTYyNSAwIGwwIDE4NzUgcTAgODUgLTQzIDE1NyBxLTQxIDcxIC0xMTIgMTEyIHEtNzMgNDMgLTE1OCA0MyBsLTkzNyAwIFoiIC8+PGdseXBoIGdseXBoLW5hbWU9Im1lbnUiIHVuaWNvZGU9IiYjeGVhMGE7IiBkPSJNNjI1IDQzNzUgbDAgLTYyNSBsMzc1MCAwIGwwIDYyNSBsLTM3NTAgMCBaTTYyNSAyODEzIGwwIC02MjUgbDM3NTAgMCBsMCA2MjUgbC0zNzUwIDAgWk02MjUgMTI1MCBsMCAtNjI1IGwzNzUwIDAgbDAgNjI1IGwtMzc1MCAwIFoiIC8+PGdseXBoIGdseXBoLW5hbWU9Im1vcmUiIHVuaWNvZGU9IiYjeGVhMGI7IiBkPSJNNzgxIDMwNDcgcTExMiAwIDIxMyAtNDMgcTk4IC00MiAxNzQgLTExNy41IHE3NiAtNzUuNSAxMTcgLTE3My41IHE0MyAtMTAyIDQzIC0yMTMgcTAgLTExMSAtNDMgLTIxMyBxLTQxIC05OCAtMTE3IC0xNzMuNSBxLTc2IC03NS41IC0xNzQgLTExNy41IHEtMTAxIC00MyAtMjEyLjUgLTQzIHEtMTExLjUgMCAtMjEzLjUgNDMgcS05OCA0MiAtMTczLjUgMTE3LjUgcS03NS41IDc1LjUgLTExNy41IDE3My41IHEtNDMgMTAyIC00MyAyMTMgcTAgMTExIDQzIDIxMyBxNDIgOTggMTE3LjUgMTczLjUgcTc1LjUgNzUuNSAxNzMuNSAxMTcuNSBxMTAyIDQzIDIxMyA0MyBaTTI1MDAgMzA0NyBxMTExIDAgMjEzIC00MyBxOTggLTQyIDE3My41IC0xMTcuNSBxNzUuNSAtNzUuNSAxMTcuNSAtMTczLjUgcTQzIC0xMDIgNDMgLTIxMyBxMCAtMTExIC00MyAtMjEzIHEtNDIgLTk4IC0xMTcuNSAtMTczLjUgcS03NS41IC03NS41IC0xNzMuNSAtMTE3LjUgcS0xMDIgLTQzIC0yMTMgLTQzIHEtMTExIDAgLTIxMyA0MyBxLTk4IDQyIC0xNzMuNSAxMTcuNSBxLTc1LjUgNzUuNSAtMTE3LjUgMTczLjUgcS00MyAxMDIgLTQzIDIxMyBxMCAxMTEgNDMgMjEzIHE0MiA5OCAxMTcuNSAxNzMuNSBxNzUuNSA3NS41IDE3My41IDExNy41IHExMDIgNDMgMjEzIDQzIFpNNDIxOSAzMDQ3IHExMTEgMCAyMTMgLTQzIHE5OCAtNDIgMTczLjUgLTExNy41IHE3NS41IC03NS41IDExNy41IC0xNzMuNSBxNDMgLTEwMiA0MyAtMjEzIHEwIC0xMTEgLTQzIC0yMTMgcS00MiAtOTggLTExNy41IC0xNzMuNSBxLTc1LjUgLTc1LjUgLTE3My41IC0xMTcuNSBxLTEwMiAtNDMgLTIxMy41IC00MyBxLTExMS41IDAgLTIxMi41IDQzIHEtOTggNDIgLTE3NCAxMTcuNSBxLTc2IDc1LjUgLTExNyAxNzMuNSBxLTQzIDEwMiAtNDMgMjEzIHEwIDExMSA0MyAyMTMgcTQxIDk4IDExNyAxNzMuNSBxNzYgNzUuNSAxNzQgMTE3LjUgcTEwMSA0MyAyMTMgNDMgWiIgLz48Z2x5cGggZ2x5cGgtbmFtZT0icGF1c2UiIHVuaWNvZGU9IiYjeGVhMGM7IiBkPSJNOTM4IDQwNjMgbDAgLTMxMjUgbDEyNTAgMCBsMCAzMTI1IGwtMTI1MCAwIFpNMjgxMyA0MDYzIGwwIC0zMTI1IGwxMjUwIDAgbDAgMzEyNSBsLTEyNTAgMCBaIiAvPjxnbHlwaCBnbHlwaC1uYW1lPSJwbGF5IiB1bmljb2RlPSImI3hlYTBkOyIgZD0iTTYyNSA0Mzc1IGwzNzUwIC0xODc1IGwtMzc1MCAtMTg3NSBsMCAzNzUwIFoiIC8+PGdseXBoIGdseXBoLW5hbWU9InRyaWFuZ2xlLXMiIHVuaWNvZGU9IiYjeGVhMGU7IiBkPSJNMTI1MCAzMTI1IGwxMjUwIC0xMjUwIGwxMjUwIDEyNDggbC0yNTAwIDIgWiIgLz48L2ZvbnQ+PC9kZWZzPjwvc3ZnPg=="},function(e,t){e.exports=__webpack_require__(/*! core-js/modules/es.array.map */ "./node_modules/core-js/modules/es.array.map.js")},function(e,t,s){"use strict";s.r(t);var n=s(3);s(43);
/**
 * @copyright Copyright (c) 2019 Julius Härtl <jus@bitgrid.net>
 *
 * @author Julius Härtl <jus@bitgrid.net>
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
n.VTooltip.options.defaultTemplate='<div class="vue-tooltip" role="tooltip" data-v-'.concat("44a28b9",'><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'),n.VTooltip.options.defaultHtml=!1,t.default=n.VTooltip},function(e,t){e.exports=__webpack_require__(/*! core-js/modules/es.function.name */ "./node_modules/core-js/modules/es.function.name.js")},function(e,t){e.exports=__webpack_require__(/*! core-js/modules/es.array.index-of */ "./node_modules/core-js/modules/es.array.index-of.js")},function(e,t){e.exports=__webpack_require__(/*! v-click-outside */ "./node_modules/v-click-outside/dist/v-click-outside.umd.js")},function(e,t){e.exports=__webpack_require__(/*! core-js/modules/es.regexp.exec */ "./node_modules/core-js/modules/es.regexp.exec.js")},function(e,t,s){"use strict";s(4),s(17),s(27),s(31);t.a=function(e){return Math.random().toString(36).replace(/[^a-z]+/g,"").substr(0,e||5)}},,,,function(e,t){e.exports=__webpack_require__(/*! core-js/modules/es.array.concat */ "./node_modules/core-js/modules/es.array.concat.js")},,,,,function(e,t){e.exports=__webpack_require__(/*! core-js/modules/es.regexp.to-string */ "./node_modules/core-js/modules/es.regexp.to-string.js")},function(e,t){e.exports=__webpack_require__(/*! @nextcloud/l10n/dist/gettext */ "./node_modules/@nextcloud/l10n/dist/gettext.js")},,,function(e,t){e.exports=__webpack_require__(/*! core-js/modules/es.string.replace */ "./node_modules/core-js/modules/es.string.replace.js")},function(e,t,s){var n=s(83);"string"==typeof n&&(n=[[e.i,n,""]]),n.locals&&(e.exports=n.locals);(0,s(2).default)("3ff88b8a",n,!0,{})},,,,function(e,t,s){"use strict";s(22),s(15),s(81),s(14);var n=s(5),o=s.n(n);t.a=function(e,t,s){if(void 0!==e)for(var n=e.length-1;n>=0;n--){var A=e[n],r=!A.componentOptions&&A.tag&&-1===t.indexOf(A.tag),a=!!A.componentOptions&&"string"==typeof A.componentOptions.tag,c=a&&-1===t.indexOf(A.componentOptions.tag);(r||!a||c)&&((r||c)&&o.a.util.warn("".concat(r?A.tag:A.componentOptions.tag," is not allowed inside the ").concat(s.$options.name," component"),s),e.splice(n,1))}}},,,function(e,t){e.exports=__webpack_require__(/*! core-js/modules/es.array.filter */ "./node_modules/core-js/modules/es.array.filter.js")},function(e,t){},,function(e,t,s){"use strict";s.r(t);var n=s(50);
/**
 * @copyright Copyright (c) 2018 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */t.default=n.a},function(e,t,s){var n=s(44);"string"==typeof n&&(n=[[e.i,n,""]]),n.locals&&(e.exports=n.locals);(0,s(2).default)("941c791e",n,!0,{})},function(e,t,s){(t=s(1)(!1)).push([e.i,".vue-tooltip[data-v-44a28b9]{position:absolute;z-index:100000;right:auto;left:auto;display:block;margin:0;margin-top:-3px;padding:10px 0;text-align:left;text-align:start;opacity:0;line-height:1.6;line-break:auto;filter:drop-shadow(0 1px 10px var(--color-box-shadow))}.vue-tooltip[data-v-44a28b9][x-placement^='top'] .tooltip-arrow{bottom:0;margin-top:0;margin-bottom:0;border-width:10px 10px 0 10px;border-right-color:transparent;border-bottom-color:transparent;border-left-color:transparent}.vue-tooltip[data-v-44a28b9][x-placement^='bottom'] .tooltip-arrow{top:0;margin-top:0;margin-bottom:0;border-width:0 10px 10px 10px;border-top-color:transparent;border-right-color:transparent;border-left-color:transparent}.vue-tooltip[data-v-44a28b9][x-placement^='right'] .tooltip-arrow{right:100%;margin-right:0;margin-left:0;border-width:10px 10px 10px 0;border-top-color:transparent;border-bottom-color:transparent;border-left-color:transparent}.vue-tooltip[data-v-44a28b9][x-placement^='left'] .tooltip-arrow{left:100%;margin-right:0;margin-left:0;border-width:10px 0 10px 10px;border-top-color:transparent;border-right-color:transparent;border-bottom-color:transparent}.vue-tooltip[data-v-44a28b9][aria-hidden='true']{visibility:hidden;transition:opacity .15s, visibility .15s;opacity:0}.vue-tooltip[data-v-44a28b9][aria-hidden='false']{visibility:visible;transition:opacity .15s;opacity:1}.vue-tooltip[data-v-44a28b9] .tooltip-inner{max-width:350px;padding:5px 8px;text-align:center;color:var(--color-main-text);border-radius:var(--border-radius);background-color:var(--color-main-background)}.vue-tooltip[data-v-44a28b9] .tooltip-arrow{position:absolute;z-index:1;width:0;height:0;margin:0;border-style:solid;border-color:var(--color-main-background)}\n",""]),e.exports=t},,,,,,function(e,t,s){"use strict";s(22),s(39),s(15);var n=s(16),o=s(13),A=s(18),r=(s(80),function(e){var t=e.getBoundingClientRect(),s=document.documentElement.clientHeight,n=document.documentElement.clientWidth,o=Object.assign({});return o.top=t.top<0,o.left=t.left<0,o.bottom=t.bottom>s,o.right=t.right>n,o.any=o.top||o.left||o.bottom||o.right,o.all=o.top&&o.left&&o.bottom&&o.right,o.offsetY=o.top?t.top:o.bottom?t.bottom-s:0,o.offsetX=o.left?t.left:o.right?t.right-n:0,o}),a=s(36),c=s(6),i=["ActionButton","ActionCheckbox","ActionInput","ActionLink","ActionRadio","ActionRouter","ActionSeparator","ActionText","ActionTextEditable"],l={name:"Actions",directives:{ClickOutside:n.directive,tooltip:o.default},props:{open:{type:Boolean,default:!1},forceMenu:{type:Boolean,default:!1},menuAlign:{type:String,default:"center",validator:function(e){return["left","center","right"].indexOf(e)>-1}},menuTitle:{type:String,default:null},primary:{type:Boolean,default:!1},defaultIcon:{type:String,default:"action-item__menutoggle--default-icon"},ariaLabel:{type:String,default:Object(c.b)("Actions")}},data:function(){return{actions:[],opened:this.open,focusIndex:0,randomId:"menu-"+Object(A.a)(),offsetX:0,offsetY:0,offsetYArrow:0,rotateArrow:!1,children:this.$children}},computed:{hasMultipleActions:function(){return this.actions.length>1},isValidSingleAction:function(){return 1===this.actions.length&&null!==this.firstActionElement},firstActionVNode:function(){return this.actions[0]},firstAction:function(){return this.children[0]?this.children[0]:{}},firstActionBinding:function(){if(this.firstActionVNode&&this.firstActionVNode.componentOptions){var e=this.firstActionVNode.componentOptions.tag;if("ActionLink"===e)return{is:"a",href:this.firstAction.href,target:this.firstAction.target,"aria-label":this.firstAction.ariaLabel};if("ActionRouter"===e)return{is:"router-link",to:this.firstAction.to,exact:this.firstAction.exact,"aria-label":this.firstAction.ariaLabel};if("ActionButton"===e)return{is:"button","aria-label":this.firstAction.ariaLabel}}return null},firstActionEvent:function(){return this.firstActionVNode&&this.firstActionVNode.componentOptions&&this.firstActionVNode.componentOptions.listeners&&this.firstActionVNode.componentOptions.listeners.click},firstActionEventBinding:function(){return this.firstActionEvent?"click":null},firstActionClass:function(){var e=this.firstActionVNode&&this.firstActionVNode.data.staticClass,t=this.firstActionVNode&&this.firstActionVNode.data.class;return"".concat(e," ").concat(t)}},watch:{open:function(e){var t=this;this.opened=e,this.opened&&this.$nextTick((function(){t.onOpen()}))}},beforeMount:function(){this.initActions(),Object(a.a)(this.$slots.default,i,this)},beforeUpdate:function(){this.initActions(),Object(a.a)(this.$slots.default,i,this)},methods:{toggleMenu:function(e){var t=this;this.opened="boolean"==typeof e?e:!this.opened,this.opened?(this.$nextTick((function(){t.onOpen()})),this.$emit("open")):(this.offsetX=0,this.offsetY=0,this.offsetYArrow=0,this.rotateArrow=!1,this.$emit("close")),this.$emit("update:open",this.opened)},closeMenu:function(e){this.opened&&(this.$emit("update:open",!1),this.$emit("close"),this.opened=!1,this.focusIndex=0,this.offsetX=0,this.offsetY=0,this.offsetYArrow=0,this.rotateArrow=!1)},onOpen:function(){this.offsetX=0,this.offsetY=0,this.offsetYArrow=0,this.rotateArrow=!1;var e=r(this.$refs.menu);e.bottom&&(this.offsetY=0-Math.round(this.$refs.menu.clientHeight)-42,this.offsetYArrow=Math.round(this.$refs.menu.clientHeight)+18,this.rotateArrow=!0),"center"===this.menuAlign&&(e.left||e.right)&&(this.offsetX=e.offsetX>0?Math.round(e.offsetX)+5:Math.round(e.offsetX)-5)},onMouseFocusAction:function(e){if(document.activeElement!==e.target){var t=e.target.closest("li");if(t){var s=t.querySelector(".focusable");if(s){var n=this.$refs.fullmenu.querySelectorAll(".focusable"),o=Array.prototype.indexOf.call(n,s);o>-1&&(this.focusIndex=o,this.focusAction())}}}},removeCurrentActive:function(){var e=this.$refs.fullmenu.querySelector("li.active");e&&e.classList.remove("active")},focusAction:function(){var e=this.$refs.fullmenu.querySelectorAll(".focusable")[this.focusIndex];if(e){this.removeCurrentActive();var t=e.closest("li.action");e.focus(),t&&t.classList.add("active")}},focusPreviousAction:function(e){this.opened&&(0===this.focusIndex?this.closeMenu():(e.preventDefault(),this.focusIndex=this.focusIndex-1),this.focusAction())},focusNextAction:function(e){if(this.opened){var t=this.$refs.fullmenu.querySelectorAll(".focusable").length-1;this.focusIndex===t?this.closeMenu():(e.preventDefault(),this.focusIndex=this.focusIndex+1),this.focusAction()}},focusFirstAction:function(e){this.opened&&(e.preventDefault(),this.focusIndex=0,this.focusAction())},focusLastAction:function(e){this.opened&&(e.preventDefault(),this.focusIndex=this.$el.querySelectorAll(".focusable").length-1,this.focusAction())},execFirstAction:function(e){this.firstActionEvent&&this.firstActionEvent(e)},initActions:function(){this.actions=(this.$slots.default||[]).filter((function(e){return!!e&&!!e.componentOptions}))}}},m=(s(82),s(0)),g=s(40),u=s.n(g),d=Object(m.a)(l,(function(){var e,t=this,s=t.$createElement,n=t._self._c||s;return t.isValidSingleAction&&!t.forceMenu?n("element",t._b({directives:[{name:"tooltip",rawName:"v-tooltip.auto",value:t.firstAction.text,expression:"firstAction.text",modifiers:{auto:!0}}],staticClass:"action-item action-item--single",class:[t.firstAction.icon,t.firstActionClass],attrs:{rel:"noreferrer noopener"},on:t._d({},[t.firstActionEventBinding,t.execFirstAction])},"element",t.firstActionBinding,!1),[n("span",{attrs:{"aria-hidden":!0,hidden:""}},[t._t("default")],2)]):n("div",{directives:[{name:"show",rawName:"v-show",value:t.hasMultipleActions||t.forceMenu,expression:"hasMultipleActions || forceMenu"},{name:"click-outside",rawName:"v-click-outside",value:t.closeMenu,expression:"closeMenu"}],ref:"fullmenu",staticClass:"action-item",class:{"action-item--open":t.opened},on:{keydown:[function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"up",38,e.key,["Up","ArrowUp"])?null:e.ctrlKey||e.shiftKey||e.altKey||e.metaKey?null:t.focusPreviousAction(e)},function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"down",40,e.key,["Down","ArrowDown"])?null:e.ctrlKey||e.shiftKey||e.altKey||e.metaKey?null:t.focusNextAction(e)},function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"tab",9,e.key,"Tab")?null:e.ctrlKey||e.shiftKey||e.altKey||e.metaKey?null:t.focusNextAction(e)},function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"tab",9,e.key,"Tab")?null:e.shiftKey?e.ctrlKey||e.altKey||e.metaKey?null:t.focusPreviousAction(e):null},function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"page-up",void 0,e.key,void 0)?null:e.ctrlKey||e.shiftKey||e.altKey||e.metaKey?null:t.focusFirstAction(e)},function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"page-down",void 0,e.key,void 0)?null:e.ctrlKey||e.shiftKey||e.altKey||e.metaKey?null:t.focusLastAction(e)},function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"esc",27,e.key,["Esc","Escape"])?null:e.ctrlKey||e.shiftKey||e.altKey||e.metaKey?null:(e.preventDefault(),t.closeMenu(e))}]}},[n("button",{staticClass:"icon action-item__menutoggle focusable",class:(e={},e[t.defaultIcon]=!0,e["action-item__menutoggle--with-title"]=t.menuTitle,e["action-item__menutoggle--primary"]=t.primary,e),attrs:{"aria-label":t.ariaLabel,"aria-haspopup":"true","aria-controls":t.randomId,"aria-expanded":t.opened},on:{click:function(e){return e.preventDefault(),t.toggleMenu(e)},keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"space",32,e.key,[" ","Spacebar"])?null:e.ctrlKey||e.shiftKey||e.altKey||e.metaKey?null:(e.preventDefault(),t.toggleMenu(e))}}},[t._v("\n\t\t"+t._s(t.menuTitle)+"\n\t")]),t._v(" "),n("div",{directives:[{name:"show",rawName:"v-show",value:t.opened,expression:"opened"}],ref:"menu",staticClass:"action-item__menu",class:["menu-"+t.menuAlign,{open:t.opened}],style:{marginRight:t.offsetX+"px",marginTop:t.offsetY+"px"},attrs:{tabindex:"-1"},on:{mousemove:t.onMouseFocusAction}},[n("div",{staticClass:"action-item__menu_arrow",style:{transform:"translateX("+t.offsetX+"px) translateY("+t.offsetYArrow+"px) "+(t.rotateArrow?" rotate(180deg)":"")}}),t._v(" "),n("ul",{attrs:{id:t.randomId,tabindex:"-1"}},[t.opened?[t._t("default")]:t._e()],2)])])}),[],!1,null,"03498935",null);"function"==typeof u.a&&u()(d);t.a=d.exports},,,,,,,,,,,,,,,,,,,,,,,,,,,,,,function(e,t){e.exports=__webpack_require__(/*! core-js/modules/es.object.assign */ "./node_modules/core-js/modules/es.object.assign.js")},function(e,t){e.exports=__webpack_require__(/*! core-js/modules/es.array.splice */ "./node_modules/core-js/modules/es.array.splice.js")},function(e,t,s){"use strict";var n=s(32);s.n(n).a},function(e,t,s){var n=s(1),o=s(7),A=s(8),r=s(9),a=s(10),c=s(11);t=n(!1);var i=o(A),l=o(r),m=o(a),g=o(c);t.push([e.i,'@font-face{font-family:"iconfont-vue-44a28b9";src:url('+i+");src:url("+i+') format("embedded-opentype"),url('+l+') format("woff"),url('+m+') format("truetype"),url('+g+') format("svg")}.icon[data-v-03498935]{font-style:normal;font-weight:400}.icon.arrow-left-double[data-v-03498935]:before{font-family:"iconfont-vue-44a28b9";content:""}.icon.arrow-left[data-v-03498935]:before{font-family:"iconfont-vue-44a28b9";content:""}.icon.arrow-right-double[data-v-03498935]:before{font-family:"iconfont-vue-44a28b9";content:""}.icon.arrow-right[data-v-03498935]:before{font-family:"iconfont-vue-44a28b9";content:""}.icon.breadcrumb[data-v-03498935]:before{font-family:"iconfont-vue-44a28b9";content:""}.icon.checkmark[data-v-03498935]:before{font-family:"iconfont-vue-44a28b9";content:""}.icon.close[data-v-03498935]:before{font-family:"iconfont-vue-44a28b9";content:""}.icon.confirm[data-v-03498935]:before{font-family:"iconfont-vue-44a28b9";content:""}.icon.info[data-v-03498935]:before{font-family:"iconfont-vue-44a28b9";content:""}.icon.menu[data-v-03498935]:before{font-family:"iconfont-vue-44a28b9";content:""}.icon.more[data-v-03498935]:before{font-family:"iconfont-vue-44a28b9";content:""}.icon.pause[data-v-03498935]:before{font-family:"iconfont-vue-44a28b9";content:""}.icon.play[data-v-03498935]:before{font-family:"iconfont-vue-44a28b9";content:""}.icon.triangle-s[data-v-03498935]:before{font-family:"iconfont-vue-44a28b9";content:""}.action-item[data-v-03498935]{position:relative;display:inline-block}.action-item--single[data-v-03498935]:hover,.action-item--single[data-v-03498935]:focus,.action-item--single[data-v-03498935]:active,.action-item__menutoggle[data-v-03498935]:hover,.action-item__menutoggle[data-v-03498935]:focus,.action-item__menutoggle[data-v-03498935]:active{opacity:1;background-color:rgba(127,127,127,0.25)}.action-item.action-item--open .action-item__menutoggle[data-v-03498935]{opacity:1;background-color:rgba(127,127,127,0.25)}.action-item--single[data-v-03498935],.action-item__menutoggle[data-v-03498935]{box-sizing:border-box;width:auto;min-width:44px;height:44px;margin:0;padding:14px;cursor:pointer;border:none;background-color:transparent}.action-item__menutoggle[data-v-03498935]{display:flex;align-items:center;justify-content:center;opacity:.7;border-radius:22px;font-weight:bold;line-height:16px}.action-item__menutoggle[data-v-03498935]:before{content:\'\'}.action-item__menutoggle--default-icon[data-v-03498935]:before{font-family:"iconfont-vue-44a28b9";font-style:normal;font-weight:400;content:""}.action-item__menutoggle--default-icon[data-v-03498935]::before{font-size:16px}.action-item__menutoggle--with-title[data-v-03498935]{position:relative;padding-left:44px;white-space:nowrap;opacity:1;border:1px solid var(--color-border-dark);background-color:var(--color-background-dark);background-position:14px center;font-size:inherit}.action-item__menutoggle--with-title[data-v-03498935]:before{position:absolute;top:14px;left:14px}.action-item__menutoggle--primary[data-v-03498935]{opacity:1;color:var(--color-primary-text);border:none;background-color:var(--color-primary-element)}.action-item--open .action-item__menutoggle--primary[data-v-03498935],.action-item__menutoggle--primary[data-v-03498935]:hover,.action-item__menutoggle--primary[data-v-03498935]:focus,.action-item__menutoggle--primary[data-v-03498935]:active{color:var(--color-primary-text) !important;background-color:var(--color-primary-element-light) !important}.action-item--single[data-v-03498935]{opacity:.7}.action-item--single[data-v-03498935]:hover,.action-item--single[data-v-03498935]:focus,.action-item--single[data-v-03498935]:active{opacity:1}.action-item--single>[hidden][data-v-03498935]{display:none}.action-item--multiple[data-v-03498935]{position:relative}.action-item__menu[data-v-03498935]{position:absolute;z-index:110;right:50%;display:none;margin-top:-5px;margin-bottom:10px;transform:translateX(50%);color:var(--color-main-text);border-radius:var(--border-radius);background-color:var(--color-main-background);filter:drop-shadow(0 1px 3px var(--color-box-shadow))}.action-item__menu ul[data-v-03498935]>:not(li){display:none}.action-item__menu.open[data-v-03498935]{display:block}.action-item__menu .action-item__menu_arrow[data-v-03498935]{position:absolute;right:50%;bottom:100%;width:0;height:0;margin-right:-9px;content:\' \';pointer-events:none;border:solid transparent;border-width:9px;border-bottom-color:var(--color-main-background)}.action-item__menu.menu-right[data-v-03498935]{right:0;left:auto;transform:none}.action-item__menu.menu-right .action-item__menu_arrow[data-v-03498935]{right:13px;margin-right:0}.action-item__menu.menu-left[data-v-03498935]{right:auto;left:0;transform:none}.action-item__menu.menu-left .action-item__menu_arrow[data-v-03498935]{right:auto;left:13px;margin-right:0}.ie .action-item__menu[data-v-03498935],.ie .action-item__menu .action-item__menu_arrow[data-v-03498935],.edge .action-item__menu[data-v-03498935],.edge .action-item__menu .action-item__menu_arrow[data-v-03498935]{border:1px solid var(--color-border)}\n',""]),e.exports=t}])}));
//# sourceMappingURL=Actions.js.map

/***/ }),

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");
var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var buildFullPath = __webpack_require__(/*! ../core/buildFullPath */ "./node_modules/axios/lib/core/buildFullPath.js");
var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/axios/lib/helpers/parseHeaders.js");
var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");
var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/axios/lib/core/createError.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/axios/lib/helpers/cookies.js");

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/axios/lib/core/Axios.js");
var mergeConfig = __webpack_require__(/*! ./core/mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(/*! ./cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/axios/lib/helpers/spread.js");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/Cancel.js":
/*!*************************************************!*\
  !*** ./node_modules/axios/lib/cancel/Cancel.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__(/*! ./Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var buildURL = __webpack_require__(/*! ../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/axios/lib/core/InterceptorManager.js");
var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/axios/lib/core/dispatchRequest.js");
var mergeConfig = __webpack_require__(/*! ./mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "./node_modules/axios/lib/core/buildFullPath.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/buildFullPath.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isAbsoluteURL = __webpack_require__(/*! ../helpers/isAbsoluteURL */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");
var combineURLs = __webpack_require__(/*! ../helpers/combineURLs */ "./node_modules/axios/lib/helpers/combineURLs.js");

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/createError.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/createError.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__(/*! ./enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/axios/lib/core/transformData.js");
var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/core/enhanceError.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/enhanceError.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/mergeConfig.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/mergeConfig.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'params', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy'];
  var defaultToConfig2Keys = [
    'baseURL', 'url', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress',
    'maxContentLength', 'validateStatus', 'maxRedirects', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath'
  ];

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, function mergeDeepProperties(prop) {
    if (utils.isObject(config2[prop])) {
      config[prop] = utils.deepMerge(config1[prop], config2[prop]);
    } else if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (utils.isObject(config1[prop])) {
      config[prop] = utils.deepMerge(config1[prop]);
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys);

  var otherKeys = Object
    .keys(config2)
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, function otherKeysDefaultToConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  return config;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__(/*! ./createError */ "./node_modules/axios/lib/core/createError.js");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),

/***/ "./node_modules/axios/lib/defaults.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/defaults.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var normalizeHeaderName = __webpack_require__(/*! ./helpers/normalizeHeaderName */ "./node_modules/axios/lib/helpers/normalizeHeaderName.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ./adapters/xhr */ "./node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ./adapters/http */ "./node_modules/axios/lib/adapters/xhr.js");
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/normalizeHeaderName.js":
/*!***************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Function equal to merge with the difference being that no reference
 * to original objects is kept.
 *
 * @see merge
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function deepMerge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = deepMerge(result[key], val);
    } else if (typeof val === 'object') {
      result[key] = deepMerge({}, val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  deepMerge: deepMerge,
  extend: extend,
  trim: trim
};


/***/ })

}]);
//# sourceMappingURL=photos-1.js.map?v=309b5e3965a8a84ccb16