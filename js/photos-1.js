(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[1],{

/***/ "./node_modules/@nextcloud/vue/dist/Components/ActionButton.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@nextcloud/vue/dist/Components/ActionButton.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

!function(t,e){ true?module.exports=e():undefined}(window,(function(){return function(t){var e={};function n(o){if(e[o])return e[o].exports;var r=e[o]={i:o,l:!1,exports:{}};return t[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=t,n.c=e,n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(o,r,function(e){return t[e]}.bind(null,r));return o},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="/dist/",n(n.s=107)}({0:function(t,e,n){"use strict";function o(t,e,n,o,r,i,a,s){var c,u="function"==typeof t?t.options:t;if(e&&(u.render=e,u.staticRenderFns=n,u._compiled=!0),o&&(u.functional=!0),i&&(u._scopeId="data-v-"+i),a?(c=function(t){(t=t||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(t=__VUE_SSR_CONTEXT__),r&&r.call(this,t),t&&t._registeredComponents&&t._registeredComponents.add(a)},u._ssrRegister=c):r&&(c=s?function(){r.call(this,(u.functional?this.parent:this).$root.$options.shadowRoot)}:r),c)if(u.functional){u._injectStyles=c;var d=u.render;u.render=function(t,e){return c.call(e),d(t,e)}}else{var l=u.beforeCreate;u.beforeCreate=l?[].concat(l,c):[c]}return{exports:t,options:u}}n.d(e,"a",(function(){return o}))},1:function(t,e,n){"use strict";t.exports=function(t){var e=[];return e.toString=function(){return this.map((function(e){var n=function(t,e){var n=t[1]||"",o=t[3];if(!o)return n;if(e&&"function"==typeof btoa){var r=(a=o,s=btoa(unescape(encodeURIComponent(JSON.stringify(a)))),c="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(s),"/*# ".concat(c," */")),i=o.sources.map((function(t){return"/*# sourceURL=".concat(o.sourceRoot||"").concat(t," */")}));return[n].concat(i).concat([r]).join("\n")}var a,s,c;return[n].join("\n")}(e,t);return e[2]?"@media ".concat(e[2]," {").concat(n,"}"):n})).join("")},e.i=function(t,n,o){"string"==typeof t&&(t=[[null,t,""]]);var r={};if(o)for(var i=0;i<this.length;i++){var a=this[i][0];null!=a&&(r[a]=!0)}for(var s=0;s<t.length;s++){var c=[].concat(t[s]);o&&r[c[0]]||(n&&(c[2]?c[2]="".concat(n," and ").concat(c[2]):c[2]=n),e.push(c))}},e}},10:function(t,e){t.exports=__webpack_require__(/*! core-js/modules/web.dom-collections.iterator */ "./node_modules/core-js/modules/web.dom-collections.iterator.js")},107:function(t,e,n){"use strict";n.r(e);var o=n(83);
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
 */e.default=o.a},121:function(t,e,n){"use strict";var o=n(62);n.n(o).a},122:function(t,e,n){(e=n(1)(!1)).push([t.i,"li.active[data-v-33d3d922]{box-shadow:inset 4px 0 var(--color-primary)}.action--disabled[data-v-33d3d922]{pointer-events:none;opacity:.5}.action--disabled[data-v-33d3d922]:hover,.action--disabled[data-v-33d3d922]:focus{cursor:default;opacity:.5}.action--disabled *[data-v-33d3d922]{opacity:1 !important}.action-button[data-v-33d3d922]{display:flex;align-items:flex-start;width:100%;height:auto;margin:0;padding:0;padding-right:14px;cursor:pointer;white-space:nowrap;opacity:.7;color:var(--color-main-text);border:0;border-radius:0;background-color:transparent;box-shadow:none;font-weight:normal;line-height:44px}.action-button[data-v-33d3d922]:hover,.action-button[data-v-33d3d922]:focus{opacity:1}.action-button>span[data-v-33d3d922]{cursor:pointer;white-space:nowrap}.action-button__icon[data-v-33d3d922]{width:44px;height:44px;opacity:1;background-position:14px center;background-size:16px;background-repeat:no-repeat}.action-button p[data-v-33d3d922]{width:150px;padding:7px 0;margin:auto;cursor:pointer;text-align:left;line-height:1.6em}.action-button__longtext[data-v-33d3d922]{cursor:pointer;white-space:pre-wrap}.action-button__title[data-v-33d3d922]{font-weight:bold}\n",""]),t.exports=e},2:function(t,e,n){"use strict";function o(t,e){for(var n=[],o={},r=0;r<e.length;r++){var i=e[r],a=i[0],s={id:t+":"+r,css:i[1],media:i[2],sourceMap:i[3]};o[a]?o[a].parts.push(s):n.push(o[a]={id:a,parts:[s]})}return n}n.r(e),n.d(e,"default",(function(){return p}));var r="undefined"!=typeof document;if("undefined"!=typeof DEBUG&&DEBUG&&!r)throw new Error("vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment.");var i={},a=r&&(document.head||document.getElementsByTagName("head")[0]),s=null,c=0,u=!1,d=function(){},l=null,f="undefined"!=typeof navigator&&/msie [6-9]\b/.test(navigator.userAgent.toLowerCase());function p(t,e,n,r){u=n,l=r||{};var a=o(t,e);return h(a),function(e){for(var n=[],r=0;r<a.length;r++){var s=a[r];(c=i[s.id]).refs--,n.push(c)}e?h(a=o(t,e)):a=[];for(r=0;r<n.length;r++){var c;if(0===(c=n[r]).refs){for(var u=0;u<c.parts.length;u++)c.parts[u]();delete i[c.id]}}}}function h(t){for(var e=0;e<t.length;e++){var n=t[e],o=i[n.id];if(o){o.refs++;for(var r=0;r<o.parts.length;r++)o.parts[r](n.parts[r]);for(;r<n.parts.length;r++)o.parts.push(m(n.parts[r]));o.parts.length>n.parts.length&&(o.parts.length=n.parts.length)}else{var a=[];for(r=0;r<n.parts.length;r++)a.push(m(n.parts[r]));i[n.id]={id:n.id,refs:1,parts:a}}}}function v(){var t=document.createElement("style");return t.type="text/css",a.appendChild(t),t}function m(t){var e,n,o=document.querySelector('style[data-vue-ssr-id~="'+t.id+'"]');if(o){if(u)return d;o.parentNode.removeChild(o)}if(f){var r=c++;o=s||(s=v()),e=x.bind(null,o,r,!1),n=x.bind(null,o,r,!0)}else o=v(),e=y.bind(null,o),n=function(){o.parentNode.removeChild(o)};return e(t),function(o){if(o){if(o.css===t.css&&o.media===t.media&&o.sourceMap===t.sourceMap)return;e(t=o)}else n()}}var b,g=(b=[],function(t,e){return b[t]=e,b.filter(Boolean).join("\n")});function x(t,e,n,o){var r=n?"":o.css;if(t.styleSheet)t.styleSheet.cssText=g(e,r);else{var i=document.createTextNode(r),a=t.childNodes;a[e]&&t.removeChild(a[e]),a.length?t.insertBefore(i,a[e]):t.appendChild(i)}}function y(t,e){var n=e.css,o=e.media,r=e.sourceMap;if(o&&t.setAttribute("media",o),l.ssrId&&t.setAttribute("data-vue-ssr-id",e.id),r&&(n+="\n/*# sourceURL="+r.sources[0]+" */",n+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(r))))+" */"),t.styleSheet)t.styleSheet.cssText=n;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(n))}}},28:function(t,e,n){"use strict";n(7),n(32);var o=n(5),r=n.n(o);
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
 */e.a={before:function(){this.$slots.default&&""!==this.text.trim()||(r.a.util.warn("".concat(this.$options.name," cannot be empty and requires a meaningful text content"),this),this.$destroy(),this.$el.remove())},beforeUpdate:function(){this.text=this.getText()},data:function(){return{text:this.getText()}},computed:{isLongText:function(){return this.text&&this.text.trim().length>20}},methods:{getText:function(){return this.$slots.default?this.$slots.default[0].text.trim():""}}}},3:function(t,e){t.exports=__webpack_require__(/*! core-js/modules/es.object.to-string */ "./node_modules/core-js/modules/es.object.to-string.js")},32:function(t,e){t.exports=__webpack_require__(/*! core-js/modules/es.string.trim */ "./node_modules/core-js/modules/es.string.trim.js")},33:function(t,e){t.exports=__webpack_require__(/*! core-js/modules/web.url */ "./node_modules/core-js/modules/web.url.js")},38:function(t,e,n){"use strict";n(8),n(3),n(9),n(10),n(33);var o=n(28),r=(n(7),function(t,e){for(var n=t.$parent;n;){if(n.$options.name===e)return n;n=n.$parent}});e.a={mixins:[o.a],props:{icon:{type:String,default:""},title:{type:String,default:""},closeAfterClick:{type:Boolean,default:!1},ariaLabel:{type:String,default:""}},computed:{isIconUrl:function(){try{return new URL(this.icon)}catch(t){return!1}}},methods:{onClick:function(t){if(this.$emit("click",t),this.closeAfterClick){var e=r(this,"Actions");e&&e.closeMenu&&e.closeMenu()}}}}},5:function(t,e){t.exports=__webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm.js")},62:function(t,e,n){var o=n(122);"string"==typeof o&&(o=[[t.i,o,""]]),o.locals&&(t.exports=o.locals);(0,n(2).default)("ec11ce7c",o,!0,{})},7:function(t,e){t.exports=__webpack_require__(/*! core-js/modules/es.function.name */ "./node_modules/core-js/modules/es.function.name.js")},78:function(t,e){},8:function(t,e){t.exports=__webpack_require__(/*! core-js/modules/es.array.iterator */ "./node_modules/core-js/modules/es.array.iterator.js")},83:function(t,e,n){"use strict";var o={name:"ActionButton",mixins:[n(38).a],props:{disabled:{type:Boolean,default:!1}},computed:{isFocusable:function(){return!this.disabled}}},r=(n(121),n(0)),i=n(78),a=n.n(i),s=Object(r.a)(o,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("li",{staticClass:"action",class:{"action--disabled":t.disabled}},[n("button",{staticClass:"action-button",class:{focusable:t.isFocusable},attrs:{"aria-label":t.ariaLabel},on:{click:t.onClick}},[t._t("icon",[n("span",{staticClass:"action-button__icon",class:[t.isIconUrl?"action-button__icon--url":t.icon],style:{backgroundImage:t.isIconUrl?"url("+t.icon+")":null}})]),t._v(" "),t.title?n("p",[n("strong",{staticClass:"action-button__title"},[t._v("\n\t\t\t\t"+t._s(t.title)+"\n\t\t\t")]),t._v(" "),n("br"),t._v(" "),n("span",{staticClass:"action-button__longtext",domProps:{textContent:t._s(t.text)}})]):t.isLongText?n("p",{staticClass:"action-button__longtext",domProps:{textContent:t._s(t.text)}}):n("span",{staticClass:"action-button__text"},[t._v(t._s(t.text))]),t._v(" "),t._e()],2)])}),[],!1,null,"33d3d922",null);"function"==typeof a.a&&a()(s);e.a=s.exports},9:function(t,e){t.exports=__webpack_require__(/*! core-js/modules/es.string.iterator */ "./node_modules/core-js/modules/es.string.iterator.js")}})}));
//# sourceMappingURL=ActionButton.js.map

/***/ }),

/***/ "./node_modules/@nextcloud/vue/dist/Components/Actions.js":
/*!****************************************************************!*\
  !*** ./node_modules/@nextcloud/vue/dist/Components/Actions.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

!function(e,s){ true?module.exports=s():undefined}(window,(function(){return function(e){var s={};function t(o){if(s[o])return s[o].exports;var n=s[o]={i:o,l:!1,exports:{}};return e[o].call(n.exports,n,n.exports,t),n.l=!0,n.exports}return t.m=e,t.c=s,t.d=function(e,s,o){t.o(e,s)||Object.defineProperty(e,s,{enumerable:!0,get:o})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,s){if(1&s&&(e=t(e)),8&s)return e;if(4&s&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(t.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&s&&"string"!=typeof e)for(var n in e)t.d(o,n,function(s){return e[s]}.bind(null,n));return o},t.n=function(e){var s=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(s,"a",s),s},t.o=function(e,s){return Object.prototype.hasOwnProperty.call(e,s)},t.p="/dist/",t(t.s=54)}([function(e,s,t){"use strict";function o(e,s,t,o,n,r,c,i){var m,A="function"==typeof e?e.options:e;if(s&&(A.render=s,A.staticRenderFns=t,A._compiled=!0),o&&(A.functional=!0),r&&(A._scopeId="data-v-"+r),c?(m=function(e){(e=e||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(e=__VUE_SSR_CONTEXT__),n&&n.call(this,e),e&&e._registeredComponents&&e._registeredComponents.add(c)},A._ssrRegister=m):n&&(m=i?function(){n.call(this,(A.functional?this.parent:this).$root.$options.shadowRoot)}:n),m)if(A.functional){A._injectStyles=m;var a=A.render;A.render=function(e,s){return m.call(s),a(e,s)}}else{var l=A.beforeCreate;A.beforeCreate=l?[].concat(l,m):[m]}return{exports:e,options:A}}t.d(s,"a",(function(){return o}))},function(e,s,t){"use strict";e.exports=function(e){var s=[];return s.toString=function(){return this.map((function(s){var t=function(e,s){var t=e[1]||"",o=e[3];if(!o)return t;if(s&&"function"==typeof btoa){var n=(c=o,i=btoa(unescape(encodeURIComponent(JSON.stringify(c)))),m="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(i),"/*# ".concat(m," */")),r=o.sources.map((function(e){return"/*# sourceURL=".concat(o.sourceRoot||"").concat(e," */")}));return[t].concat(r).concat([n]).join("\n")}var c,i,m;return[t].join("\n")}(s,e);return s[2]?"@media ".concat(s[2]," {").concat(t,"}"):t})).join("")},s.i=function(e,t,o){"string"==typeof e&&(e=[[null,e,""]]);var n={};if(o)for(var r=0;r<this.length;r++){var c=this[r][0];null!=c&&(n[c]=!0)}for(var i=0;i<e.length;i++){var m=[].concat(e[i]);o&&n[m[0]]||(t&&(m[2]?m[2]="".concat(t," and ").concat(m[2]):m[2]=t),s.push(m))}},s}},function(e,s,t){"use strict";function o(e,s){for(var t=[],o={},n=0;n<s.length;n++){var r=s[n],c=r[0],i={id:e+":"+n,css:r[1],media:r[2],sourceMap:r[3]};o[c]?o[c].parts.push(i):t.push(o[c]={id:c,parts:[i]})}return t}t.r(s),t.d(s,"default",(function(){return u}));var n="undefined"!=typeof document;if("undefined"!=typeof DEBUG&&DEBUG&&!n)throw new Error("vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment.");var r={},c=n&&(document.head||document.getElementsByTagName("head")[0]),i=null,m=0,A=!1,a=function(){},l=null,g="undefined"!=typeof navigator&&/msie [6-9]\b/.test(navigator.userAgent.toLowerCase());function u(e,s,t,n){A=t,l=n||{};var c=o(e,s);return d(c),function(s){for(var t=[],n=0;n<c.length;n++){var i=c[n];(m=r[i.id]).refs--,t.push(m)}s?d(c=o(e,s)):c=[];for(n=0;n<t.length;n++){var m;if(0===(m=t[n]).refs){for(var A=0;A<m.parts.length;A++)m.parts[A]();delete r[m.id]}}}}function d(e){for(var s=0;s<e.length;s++){var t=e[s],o=r[t.id];if(o){o.refs++;for(var n=0;n<o.parts.length;n++)o.parts[n](t.parts[n]);for(;n<t.parts.length;n++)o.parts.push(v(t.parts[n]));o.parts.length>t.parts.length&&(o.parts.length=t.parts.length)}else{var c=[];for(n=0;n<t.parts.length;n++)c.push(v(t.parts[n]));r[t.id]={id:t.id,refs:1,parts:c}}}}function p(){var e=document.createElement("style");return e.type="text/css",c.appendChild(e),e}function v(e){var s,t,o=document.querySelector('style[data-vue-ssr-id~="'+e.id+'"]');if(o){if(A)return a;o.parentNode.removeChild(o)}if(g){var n=m++;o=i||(i=p()),s=E.bind(null,o,n,!1),t=E.bind(null,o,n,!0)}else o=p(),s=T.bind(null,o),t=function(){o.parentNode.removeChild(o)};return s(e),function(o){if(o){if(o.css===e.css&&o.media===e.media&&o.sourceMap===e.sourceMap)return;s(e=o)}else t()}}var f,M=(f=[],function(e,s){return f[e]=s,f.filter(Boolean).join("\n")});function E(e,s,t,o){var n=t?"":o.css;if(e.styleSheet)e.styleSheet.cssText=M(s,n);else{var r=document.createTextNode(n),c=e.childNodes;c[s]&&e.removeChild(c[s]),c.length?e.insertBefore(r,c[s]):e.appendChild(r)}}function T(e,s){var t=s.css,o=s.media,n=s.sourceMap;if(o&&e.setAttribute("media",o),l.ssrId&&e.setAttribute("data-vue-ssr-id",s.id),n&&(t+="\n/*# sourceURL="+n.sources[0]+" */",t+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(n))))+" */"),e.styleSheet)e.styleSheet.cssText=t;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(t))}}},function(e,s){e.exports=__webpack_require__(/*! core-js/modules/es.object.to-string */ "./node_modules/core-js/modules/es.object.to-string.js")},function(e,s){e.exports=__webpack_require__(/*! v-tooltip */ "./node_modules/v-tooltip/dist/v-tooltip.esm.js")},function(e,s){e.exports=__webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm.js")},function(e,s,t){"use strict";t.d(s,"b",(function(){return i})),t.d(s,"a",(function(){return c}));t(11);var o=t(27),n=Object(o.getGettextBuilder)().detectLocale();[{locale:"br",json:{charset:"utf-8",headers:{"Last-Translator":"Kervoas-Le Nabat Ewen <ewenkervoas@free.fr>, 2020","Language-Team":"Breton (https://www.transifex.com/nextcloud/teams/64236/br/)","Content-Type":"text/plain; charset=UTF-8",Language:"br","Plural-Forms":"nplurals=5; plural=((n%10 == 1) && (n%100 != 11) && (n%100 !=71) && (n%100 !=91) ? 0 :(n%10 == 2) && (n%100 != 12) && (n%100 !=72) && (n%100 !=92) ? 1 :(n%10 ==3 || n%10==4 || n%10==9) && (n%100 < 10 || n% 100 > 19) && (n%100 < 70 || n%100 > 79) && (n%100 < 90 || n%100 > 99) ? 2 :(n != 0 && n % 1000000 == 0) ? 3 : 4);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nKervoas-Le Nabat Ewen <ewenkervoas@free.fr>, 2020\n"},msgstr:["Last-Translator: Kervoas-Le Nabat Ewen <ewenkervoas@free.fr>, 2020\nLanguage-Team: Breton (https://www.transifex.com/nextcloud/teams/64236/br/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: br\nPlural-Forms: nplurals=5; plural=((n%10 == 1) && (n%100 != 11) && (n%100 !=71) && (n%100 !=91) ? 0 :(n%10 == 2) && (n%100 != 12) && (n%100 !=72) && (n%100 !=92) ? 1 :(n%10 ==3 || n%10==4 || n%10==9) && (n%100 < 10 || n% 100 > 19) && (n%100 < 70 || n%100 > 79) && (n%100 < 90 || n%100 > 99) ? 2 :(n != 0 && n % 1000000 == 0) ? 3 : 4);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (diwelus)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (bevennet)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:249"},msgstr:["Oberioù"]},Activities:{msgid:"Activities",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:176"},msgstr:["Oberiantizoù"]},"Animals & Nature":{msgid:"Animals & Nature",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:174"},msgstr:["Loened & Natur"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Dibab"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Serriñ"]},Custom:{msgid:"Custom",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:181"},msgstr:["Personelañ"]},Flags:{msgid:"Flags",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:180"},msgstr:["Bannieloù"]},"Food & Drink":{msgid:"Food & Drink",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:175"},msgstr:["Boued & Evajoù"]},"Frequently used":{msgid:"Frequently used",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:171"},msgstr:["Implijet alies"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Da heul"]},"No emoji found":{msgid:"No emoji found",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:168"},msgstr:["Emoji ebet kavet"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["Disoc'h ebet"]},Objects:{msgid:"Objects",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:178"},msgstr:["Traoù"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Arsav an diaporama"]},"People & Body":{msgid:"People & Body",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:173"},msgstr:["Tud & Korf"]},"Pick an emoji":{msgid:"Pick an emoji",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:153"},msgstr:["Choaz un emoji"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["A-raok"]},Search:{msgid:"Search",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:167"},msgstr:["Klask"]},"Search results":{msgid:"Search results",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:170"},msgstr:["Disoc'hoù an enklask"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Choaz ur c'hlav"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:57"},msgstr:["Arventennoù"]},"Smileys & Emotion":{msgid:"Smileys & Emotion",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:172"},msgstr:["Smileyioù & Fromoù"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Kregiñ an diaporama"]},Symbols:{msgid:"Symbols",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:179"},msgstr:["Arouezioù"]},"Travel & Places":{msgid:"Travel & Places",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:177"},msgstr:["Beaj & Lec'hioù"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["Dibosupl eo klask ar strollad"]}}}}},{locale:"ca",json:{charset:"utf-8",headers:{"Last-Translator":"Toni Hermoso Pulido <toniher@softcatala.cat>, 2020","Language-Team":"Catalan (https://www.transifex.com/nextcloud/teams/64236/ca/)","Content-Type":"text/plain; charset=UTF-8",Language:"ca","Plural-Forms":"nplurals=2; plural=(n != 1);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nCarles Ferrando Garcia <carles.ferrando@gnuescultura.eu>, 2020\nMarc Riera <marcriera@softcatala.org>, 2020\nToni Hermoso Pulido <toniher@softcatala.cat>, 2020\n"},msgstr:["Last-Translator: Toni Hermoso Pulido <toniher@softcatala.cat>, 2020\nLanguage-Team: Catalan (https://www.transifex.com/nextcloud/teams/64236/ca/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: ca\nPlural-Forms: nplurals=2; plural=(n != 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (invisible)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (restringit)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:254"},msgstr:["Accions"]},Activities:{msgid:"Activities",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:176"},msgstr:["Activitats"]},"Animals & Nature":{msgid:"Animals & Nature",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:174"},msgstr:["Animals i natura"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Tria"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Tanca"]},Custom:{msgid:"Custom",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:181"},msgstr:["Personalitzat"]},Flags:{msgid:"Flags",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:180"},msgstr:["Marques"]},"Food & Drink":{msgid:"Food & Drink",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:175"},msgstr:["Menjar i begudes"]},"Frequently used":{msgid:"Frequently used",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:171"},msgstr:["Utilitzats recentment"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Següent"]},"No emoji found":{msgid:"No emoji found",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:168"},msgstr:["No s'ha trobat cap emoji"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["Sense resultats"]},Objects:{msgid:"Objects",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:178"},msgstr:["Objectes"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Atura la presentació"]},"People & Body":{msgid:"People & Body",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:173"},msgstr:["Persones i cos"]},"Pick an emoji":{msgid:"Pick an emoji",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:153"},msgstr:["Trieu un emoji"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Anterior"]},Search:{msgid:"Search",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:167"},msgstr:["Cerca"]},"Search results":{msgid:"Search results",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:170"},msgstr:["Resultats de cerca"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Selecciona una etiqueta"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:57"},msgstr:["Paràmetres"]},"Smileys & Emotion":{msgid:"Smileys & Emotion",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:172"},msgstr:["Cares i emocions"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Inicia la presentació"]},Symbols:{msgid:"Symbols",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:179"},msgstr:["Símbols"]},"Travel & Places":{msgid:"Travel & Places",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:177"},msgstr:["Viatges i llocs"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["No es pot cercar el grup"]}}}}},{locale:"cs_CZ",json:{charset:"utf-8",headers:{"Last-Translator":"Pavel Borecki <pavel.borecki@gmail.com>, 2020","Language-Team":"Czech (Czech Republic) (https://www.transifex.com/nextcloud/teams/64236/cs_CZ/)","Content-Type":"text/plain; charset=UTF-8",Language:"cs_CZ","Plural-Forms":"nplurals=4; plural=(n == 1 && n % 1 == 0) ? 0 : (n >= 2 && n <= 4 && n % 1 == 0) ? 1: (n % 1 != 0 ) ? 2 : 3;"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nPavel Borecki <pavel.borecki@gmail.com>, 2020\n"},msgstr:["Last-Translator: Pavel Borecki <pavel.borecki@gmail.com>, 2020\nLanguage-Team: Czech (Czech Republic) (https://www.transifex.com/nextcloud/teams/64236/cs_CZ/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: cs_CZ\nPlural-Forms: nplurals=4; plural=(n == 1 && n % 1 == 0) ? 0 : (n >= 2 && n <= 4 && n % 1 == 0) ? 1: (n % 1 != 0 ) ? 2 : 3;\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (neviditelný)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (omezený)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:249"},msgstr:["Akce"]},Activities:{msgid:"Activities",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:176"},msgstr:["Aktivity"]},"Animals & Nature":{msgid:"Animals & Nature",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:174"},msgstr:["Zvířata a příroda"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Zvolit"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Zavřít"]},Custom:{msgid:"Custom",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:181"},msgstr:["Uživatelsky určené"]},Flags:{msgid:"Flags",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:180"},msgstr:["Příznaky"]},"Food & Drink":{msgid:"Food & Drink",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:175"},msgstr:["Jídlo a pití"]},"Frequently used":{msgid:"Frequently used",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:171"},msgstr:["Často používané"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Následující"]},"No emoji found":{msgid:"No emoji found",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:168"},msgstr:["Nenalezeno žádné emoji"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["Žádné výsledky"]},Objects:{msgid:"Objects",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:178"},msgstr:["Objekty"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Pozastavit prezentaci"]},"People & Body":{msgid:"People & Body",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:173"},msgstr:["Lidé a tělo"]},"Pick an emoji":{msgid:"Pick an emoji",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:153"},msgstr:["Vyberte emoji"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Předchozí"]},Search:{msgid:"Search",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:167"},msgstr:["Hledat"]},"Search results":{msgid:"Search results",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:170"},msgstr:["Výsledky hledání"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Vybrat štítek"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Nastavení"]},"Smileys & Emotion":{msgid:"Smileys & Emotion",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:172"},msgstr:["Úsměvy a emoce"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Spustit prezentaci"]},Symbols:{msgid:"Symbols",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:179"},msgstr:["Symboly"]},"Travel & Places":{msgid:"Travel & Places",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:177"},msgstr:["Cestování a místa"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["Nedaří se hledat skupinu"]}}}}},{locale:"da",json:{charset:"utf-8",headers:{"Last-Translator":"Thomas Nielsen <thsnielsen@gmail.com>, 2020","Language-Team":"Danish (https://www.transifex.com/nextcloud/teams/64236/da/)","Content-Type":"text/plain; charset=UTF-8",Language:"da","Plural-Forms":"nplurals=2; plural=(n != 1);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nThomas Nielsen <thsnielsen@gmail.com>, 2020\n"},msgstr:["Last-Translator: Thomas Nielsen <thsnielsen@gmail.com>, 2020\nLanguage-Team: Danish (https://www.transifex.com/nextcloud/teams/64236/da/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: da\nPlural-Forms: nplurals=2; plural=(n != 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (usynlig)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (begrænset)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:247"},msgstr:["Handlinger"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Vælg"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Luk"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Videre"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:172\nsrc/components/MultiselectTags/MultiselectTags.vue:78"},msgstr:["Ingen resultater"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Suspender fremvisning"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Forrige"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Vælg et mærke"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Indstillinger"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Start fremvisning"]}}}}},{locale:"de",json:{charset:"utf-8",headers:{"Last-Translator":"Mark Ziegler <mark.ziegler@rakekniven.de>, 2020","Language-Team":"German (https://www.transifex.com/nextcloud/teams/64236/de/)","Content-Type":"text/plain; charset=UTF-8",Language:"de","Plural-Forms":"nplurals=2; plural=(n != 1);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nPhilipp Fischbeck <pfischbeck@googlemail.com>, 2020\nAndreas Eitel <github-aneitel@online.de>, 2020\nMario Siegmann <mario_siegmann@web.de>, 2020\nJoachim Sokolowski, 2020\nMark Ziegler <mark.ziegler@rakekniven.de>, 2020\n"},msgstr:["Last-Translator: Mark Ziegler <mark.ziegler@rakekniven.de>, 2020\nLanguage-Team: German (https://www.transifex.com/nextcloud/teams/64236/de/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: de\nPlural-Forms: nplurals=2; plural=(n != 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (unsichtbar)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (eingeschränkt)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:249"},msgstr:["Aktionen"]},Activities:{msgid:"Activities",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:176"},msgstr:["Aktivitäten"]},"Animals & Nature":{msgid:"Animals & Nature",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:174"},msgstr:["Tiere & Natur"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Auswählen"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Schließen"]},Custom:{msgid:"Custom",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:181"},msgstr:["Benutzerdefiniert"]},Flags:{msgid:"Flags",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:180"},msgstr:["Flaggen"]},"Food & Drink":{msgid:"Food & Drink",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:175"},msgstr:["Essen & Trinken"]},"Frequently used":{msgid:"Frequently used",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:171"},msgstr:["Häufig verwendet"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Weiter"]},"No emoji found":{msgid:"No emoji found",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:168"},msgstr:["Kein Emoji gefunden"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["Keine Ergebnisse"]},Objects:{msgid:"Objects",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:178"},msgstr:["Gegenstände"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Diashow pausieren"]},"People & Body":{msgid:"People & Body",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:173"},msgstr:["Menschen & Körper"]},"Pick an emoji":{msgid:"Pick an emoji",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:153"},msgstr:["Ein Emoji auswählen"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Vorherige"]},Search:{msgid:"Search",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:167"},msgstr:["Suche"]},"Search results":{msgid:"Search results",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:170"},msgstr:["Suchergebnisse"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Schlagwort auswählen"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:57"},msgstr:["Einstellungen"]},"Smileys & Emotion":{msgid:"Smileys & Emotion",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:172"},msgstr:["Smileys & Emotionen"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Diashow starten"]},Symbols:{msgid:"Symbols",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:179"},msgstr:["Symbole"]},"Travel & Places":{msgid:"Travel & Places",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:177"},msgstr:["Reisen & Orte"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["Die Gruppe konnte nicht durchsucht werden"]}}}}},{locale:"de_DE",json:{charset:"utf-8",headers:{"Last-Translator":"Mark Ziegler <mark.ziegler@rakekniven.de>, 2020","Language-Team":"German (Germany) (https://www.transifex.com/nextcloud/teams/64236/de_DE/)","Content-Type":"text/plain; charset=UTF-8",Language:"de_DE","Plural-Forms":"nplurals=2; plural=(n != 1);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nPhilipp Fischbeck <pfischbeck@googlemail.com>, 2020\nProfDrJones <jones@fs.cs.hm.edu>, 2020\nMario Siegmann <mario_siegmann@web.de>, 2020\nMark Ziegler <mark.ziegler@rakekniven.de>, 2020\n"},msgstr:["Last-Translator: Mark Ziegler <mark.ziegler@rakekniven.de>, 2020\nLanguage-Team: German (Germany) (https://www.transifex.com/nextcloud/teams/64236/de_DE/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: de_DE\nPlural-Forms: nplurals=2; plural=(n != 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (unsichtbar)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (eingeschränkt)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:249"},msgstr:["Aktionen"]},Activities:{msgid:"Activities",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:176"},msgstr:["Aktivitäten"]},"Animals & Nature":{msgid:"Animals & Nature",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:174"},msgstr:["Tiere & Natur"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Auswählen"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Schließen"]},Custom:{msgid:"Custom",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:181"},msgstr:["Benutzerdefiniert"]},Flags:{msgid:"Flags",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:180"},msgstr:["Flaggen"]},"Food & Drink":{msgid:"Food & Drink",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:175"},msgstr:["Essen & Trinken"]},"Frequently used":{msgid:"Frequently used",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:171"},msgstr:["Häufig verwendet"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Weiter"]},"No emoji found":{msgid:"No emoji found",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:168"},msgstr:["Kein Emoji gefunden"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["Keine Ergebnisse"]},Objects:{msgid:"Objects",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:178"},msgstr:["Gegenstände"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Diashow pausieren"]},"People & Body":{msgid:"People & Body",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:173"},msgstr:["Menschen & Körper"]},"Pick an emoji":{msgid:"Pick an emoji",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:153"},msgstr:["Ein Emoji auswählen"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Vorherige"]},Search:{msgid:"Search",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:167"},msgstr:["Suche"]},"Search results":{msgid:"Search results",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:170"},msgstr:["Suchergebnisse"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Schlagwort auswählen"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:57"},msgstr:["Einstellungen"]},"Smileys & Emotion":{msgid:"Smileys & Emotion",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:172"},msgstr:["Smileys & Emotionen"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Diashow starten"]},Symbols:{msgid:"Symbols",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:179"},msgstr:["Symbole"]},"Travel & Places":{msgid:"Travel & Places",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:177"},msgstr:["Reisen & Orte"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["Die Gruppe kann nicht durchsucht werden"]}}}}},{locale:"el",json:{charset:"utf-8",headers:{"Last-Translator":"Efstathios Iosifidis <iefstathios@gmail.com>, 2020","Language-Team":"Greek (https://www.transifex.com/nextcloud/teams/64236/el/)","Content-Type":"text/plain; charset=UTF-8",Language:"el","Plural-Forms":"nplurals=2; plural=(n != 1);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\ngeorge k <norhorn@gmail.com>, 2020\nEfstathios Iosifidis <iefstathios@gmail.com>, 2020\n"},msgstr:["Last-Translator: Efstathios Iosifidis <iefstathios@gmail.com>, 2020\nLanguage-Team: Greek (https://www.transifex.com/nextcloud/teams/64236/el/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: el\nPlural-Forms: nplurals=2; plural=(n != 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (αόρατο)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (περιορισμένο)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:249"},msgstr:["Ενέργειες"]},Activities:{msgid:"Activities",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:176"},msgstr:["Δραστηριότητες"]},"Animals & Nature":{msgid:"Animals & Nature",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:174"},msgstr:["Ζώα & Φύση"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Επιλογή"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Κλείσιμο"]},Custom:{msgid:"Custom",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:181"},msgstr:["Προσαρμογή"]},Flags:{msgid:"Flags",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:180"},msgstr:["Σημαίες"]},"Food & Drink":{msgid:"Food & Drink",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:175"},msgstr:["Φαγητό & Ποτό"]},"Frequently used":{msgid:"Frequently used",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:171"},msgstr:["Συχνά χρησιμοποιούμενο"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Επόμενο"]},"No emoji found":{msgid:"No emoji found",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:168"},msgstr:["Δεν βρέθηκε emoji"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["Κανένα αποτέλεσμα"]},Objects:{msgid:"Objects",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:178"},msgstr:["Αντικείμενα"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Παύση προβολής διαφανειών"]},"People & Body":{msgid:"People & Body",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:173"},msgstr:["Άνθρωποι & Σώμα"]},"Pick an emoji":{msgid:"Pick an emoji",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:153"},msgstr:["Επιλέξτε ένα emoji"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Προηγούμενο"]},Search:{msgid:"Search",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:167"},msgstr:["Αναζήτηση"]},"Search results":{msgid:"Search results",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:170"},msgstr:["Αποτελέσματα αναζήτησης"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Επιλογή ετικέτας"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Ρυθμίσεις"]},"Smileys & Emotion":{msgid:"Smileys & Emotion",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:172"},msgstr:["Φατσούλες & Συναίσθημα"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Έναρξη προβολής διαφανειών"]},Symbols:{msgid:"Symbols",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:179"},msgstr:["Σύμβολα"]},"Travel & Places":{msgid:"Travel & Places",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:177"},msgstr:["Ταξίδια & Τοποθεσίες"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["Δεν είναι δυνατή η αναζήτηση της ομάδας"]}}}}},{locale:"es",json:{charset:"utf-8",headers:{"Last-Translator":"asd fgh <c1@cgps.xyz>, 2020","Language-Team":"Spanish (https://www.transifex.com/nextcloud/teams/64236/es/)","Content-Type":"text/plain; charset=UTF-8",Language:"es","Plural-Forms":"nplurals=2; plural=(n != 1);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\njavier san felipe <jsanfe@gmail.com>, 2020\nasd fgh <c1@cgps.xyz>, 2020\n"},msgstr:["Last-Translator: asd fgh <c1@cgps.xyz>, 2020\nLanguage-Team: Spanish (https://www.transifex.com/nextcloud/teams/64236/es/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: es\nPlural-Forms: nplurals=2; plural=(n != 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{etiqueta} (invisible)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{etiqueta} (restringido)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:247"},msgstr:["acciones"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Elige"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Cierra"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Siguiente"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:172\nsrc/components/MultiselectTags/MultiselectTags.vue:78"},msgstr:[" Ningún resultado"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Pausa la presentación "]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Anterior"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Selecciona una etiqueta"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Ajustes"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Comienza la presentación "]}}}}},{locale:"eu",json:{charset:"utf-8",headers:{"Last-Translator":"Asier Iturralde Sarasola <asier.iturralde@gmail.com>, 2020","Language-Team":"Basque (https://www.transifex.com/nextcloud/teams/64236/eu/)","Content-Type":"text/plain; charset=UTF-8",Language:"eu","Plural-Forms":"nplurals=2; plural=(n != 1);"},translations:{"":{"":{msgid:"",comments:{translator:"Translators:\nAsier Iturralde Sarasola <asier.iturralde@gmail.com>, 2020\n"},msgstr:["Last-Translator: Asier Iturralde Sarasola <asier.iturralde@gmail.com>, 2020\nLanguage-Team: Basque (https://www.transifex.com/nextcloud/teams/64236/eu/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: eu\nPlural-Forms: nplurals=2; plural=(n != 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:169"},msgstr:["{tag} (ikusezina)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:172"},msgstr:["{tag} (mugatua)"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Aukeratu"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:109"},msgstr:["Itxi"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:154"},msgstr:["Hurrengoa"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:169\nsrc/components/MultiselectTags/MultiselectTags.vue:78"},msgstr:["Emaitzarik ez"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:290"},msgstr:["Pausatu diaporama"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:134"},msgstr:["Aurrekoa"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Hautatu etiketa bat"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Ezarpenak"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:290"},msgstr:["Hasi diaporama"]}}}}},{locale:"fi_FI",json:{charset:"utf-8",headers:{"Last-Translator":"Robin Lahtinen <robin.lahtinen@gmail.com>, 2020","Language-Team":"Finnish (Finland) (https://www.transifex.com/nextcloud/teams/64236/fi_FI/)","Content-Type":"text/plain; charset=UTF-8",Language:"fi_FI","Plural-Forms":"nplurals=2; plural=(n != 1);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nRobin Lahtinen <robin.lahtinen@gmail.com>, 2020\n"},msgstr:["Last-Translator: Robin Lahtinen <robin.lahtinen@gmail.com>, 2020\nLanguage-Team: Finnish (Finland) (https://www.transifex.com/nextcloud/teams/64236/fi_FI/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: fi_FI\nPlural-Forms: nplurals=2; plural=(n != 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (näkymätön)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (rajoitettu)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:247"},msgstr:["Toiminnot"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Valitse"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Sulje"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Seuraava"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["Ei tuloksia"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Keskeytä diaesitys"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Edellinen"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Valitse tagi"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Asetukset"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Aloita diaesitys"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["Ryhmää ei voi hakea"]}}}}},{locale:"fr",json:{charset:"utf-8",headers:{"Last-Translator":"Julien Veyssier <eneiluj@gmx.fr>, 2020","Language-Team":"French (https://www.transifex.com/nextcloud/teams/64236/fr/)","Content-Type":"text/plain; charset=UTF-8",Language:"fr","Plural-Forms":"nplurals=2; plural=(n > 1);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nBrendan Abolivier <transifex@brendanabolivier.com>, 2020\ngud bes <gudbes@protonmail.com>, 2020\nGreg Greg <grena@grenabox.fr>, 2020\nLuclu7 <theluc7andcompagnie@gmail.com>, 2020\nJulien Veyssier <eneiluj@gmx.fr>, 2020\n"},msgstr:["Last-Translator: Julien Veyssier <eneiluj@gmx.fr>, 2020\nLanguage-Team: French (https://www.transifex.com/nextcloud/teams/64236/fr/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: fr\nPlural-Forms: nplurals=2; plural=(n > 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (invisible)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (restreint)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:249"},msgstr:["Actions"]},Activities:{msgid:"Activities",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:176"},msgstr:["Activités"]},"Animals & Nature":{msgid:"Animals & Nature",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:174"},msgstr:["Animaux & Nature"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Choisir"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Fermer"]},Custom:{msgid:"Custom",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:181"},msgstr:["Personnalisé"]},Flags:{msgid:"Flags",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:180"},msgstr:["Drapeaux"]},"Food & Drink":{msgid:"Food & Drink",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:175"},msgstr:["Nourriture & Boissons"]},"Frequently used":{msgid:"Frequently used",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:171"},msgstr:["Utilisés fréquemment"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Suivant"]},"No emoji found":{msgid:"No emoji found",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:168"},msgstr:["Pas d’émoji trouvé"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["Aucun résultat"]},Objects:{msgid:"Objects",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:178"},msgstr:["Objets"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Mettre le diaporama en pause"]},"People & Body":{msgid:"People & Body",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:173"},msgstr:["Personnes & Corps"]},"Pick an emoji":{msgid:"Pick an emoji",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:153"},msgstr:["Choisissez un émoji"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Précédent"]},Search:{msgid:"Search",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:167"},msgstr:["Chercher"]},"Search results":{msgid:"Search results",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:170"},msgstr:["Résultats de recherche"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Sélectionnez une balise"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Paramètres"]},"Smileys & Emotion":{msgid:"Smileys & Emotion",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:172"},msgstr:["Smileys & Émotions"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Démarrer le diaporama"]},Symbols:{msgid:"Symbols",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:179"},msgstr:["Symboles"]},"Travel & Places":{msgid:"Travel & Places",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:177"},msgstr:["Voyage & Lieux"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["Impossible de chercher le groupe"]}}}}},{locale:"gl",json:{charset:"utf-8",headers:{"Last-Translator":"Miguel Anxo Bouzada <mbouzada@gmail.com>, 2020","Language-Team":"Galician (https://www.transifex.com/nextcloud/teams/64236/gl/)","Content-Type":"text/plain; charset=UTF-8",Language:"gl","Plural-Forms":"nplurals=2; plural=(n != 1);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nMiguel Anxo Bouzada <mbouzada@gmail.com>, 2020\n"},msgstr:["Last-Translator: Miguel Anxo Bouzada <mbouzada@gmail.com>, 2020\nLanguage-Team: Galician (https://www.transifex.com/nextcloud/teams/64236/gl/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: gl\nPlural-Forms: nplurals=2; plural=(n != 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (invisíbel)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (restrinxido)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:249"},msgstr:["Accións"]},Activities:{msgid:"Activities",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:176"},msgstr:["Actividades"]},"Animals & Nature":{msgid:"Animals & Nature",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:174"},msgstr:["Animais e natureza"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Escoller"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Pechar"]},Custom:{msgid:"Custom",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:181"},msgstr:["Personalizado"]},Flags:{msgid:"Flags",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:180"},msgstr:["Bandeiras"]},"Food & Drink":{msgid:"Food & Drink",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:175"},msgstr:["Comida e bebida"]},"Frequently used":{msgid:"Frequently used",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:171"},msgstr:["Usado con frecuencia"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Seguinte"]},"No emoji found":{msgid:"No emoji found",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:168"},msgstr:["Non se atopou ningún «emoji»"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["Sen resultados"]},Objects:{msgid:"Objects",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:178"},msgstr:["Obxectos"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Pausar o diaporama"]},"People & Body":{msgid:"People & Body",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:173"},msgstr:["Persoas e corpo"]},"Pick an emoji":{msgid:"Pick an emoji",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:153"},msgstr:["Escolla un «emoji»"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Anterir"]},Search:{msgid:"Search",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:167"},msgstr:["Buscar"]},"Search results":{msgid:"Search results",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:170"},msgstr:["Resultados da busca"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Seleccione unha etiqueta"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Axustes"]},"Smileys & Emotion":{msgid:"Smileys & Emotion",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:172"},msgstr:["Sorrisos e emocións"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Iniciar o diaporama"]},Symbols:{msgid:"Symbols",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:179"},msgstr:["Símbolos"]},"Travel & Places":{msgid:"Travel & Places",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:177"},msgstr:["Viaxes e lugares"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["Non foi posíbel buscar o grupo"]}}}}},{locale:"he",json:{charset:"utf-8",headers:{"Last-Translator":"Yaron Shahrabani <sh.yaron@gmail.com>, 2020","Language-Team":"Hebrew (https://www.transifex.com/nextcloud/teams/64236/he/)","Content-Type":"text/plain; charset=UTF-8",Language:"he","Plural-Forms":"nplurals=4; plural=(n == 1 && n % 1 == 0) ? 0 : (n == 2 && n % 1 == 0) ? 1: (n % 10 == 0 && n % 1 == 0 && n > 10) ? 2 : 3;"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nYaron Shahrabani <sh.yaron@gmail.com>, 2020\n"},msgstr:["Last-Translator: Yaron Shahrabani <sh.yaron@gmail.com>, 2020\nLanguage-Team: Hebrew (https://www.transifex.com/nextcloud/teams/64236/he/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: he\nPlural-Forms: nplurals=4; plural=(n == 1 && n % 1 == 0) ? 0 : (n == 2 && n % 1 == 0) ? 1: (n % 10 == 0 && n % 1 == 0 && n > 10) ? 2 : 3;\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (נסתר)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (מוגבל)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:249"},msgstr:["פעולות"]},Activities:{msgid:"Activities",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:176"},msgstr:["פעילויות"]},"Animals & Nature":{msgid:"Animals & Nature",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:174"},msgstr:["חיות וטבע"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["בחירה"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["סגירה"]},Custom:{msgid:"Custom",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:181"},msgstr:["בהתאמה אישית"]},Flags:{msgid:"Flags",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:180"},msgstr:["דגלים"]},"Food & Drink":{msgid:"Food & Drink",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:175"},msgstr:["מזון ומשקאות"]},"Frequently used":{msgid:"Frequently used",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:171"},msgstr:["בשימוש תדיר"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["הבא"]},"No emoji found":{msgid:"No emoji found",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:168"},msgstr:["לא נמצא אמוג׳י"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["אין תוצאות"]},Objects:{msgid:"Objects",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:178"},msgstr:["חפצים"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["השהיית מצגת"]},"People & Body":{msgid:"People & Body",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:173"},msgstr:["אנשים וגוף"]},"Pick an emoji":{msgid:"Pick an emoji",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:153"},msgstr:["נא לבחור אמוג׳י"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["הקודם"]},Search:{msgid:"Search",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:167"},msgstr:["חיפוש"]},"Search results":{msgid:"Search results",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:170"},msgstr:["תוצאות חיפוש"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["בחירת תגית"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:57"},msgstr:["הגדרות"]},"Smileys & Emotion":{msgid:"Smileys & Emotion",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:172"},msgstr:["חייכנים ורגשונים"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["התחלת המצגת"]},Symbols:{msgid:"Symbols",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:179"},msgstr:["סמלים"]},"Travel & Places":{msgid:"Travel & Places",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:177"},msgstr:["טיולים ומקומות"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["לא ניתן לחפש בקבוצה"]}}}}},{locale:"hu_HU",json:{charset:"utf-8",headers:{"Last-Translator":"asbot10 <asbot000@gmail.com>, 2020","Language-Team":"Hungarian (Hungary) (https://www.transifex.com/nextcloud/teams/64236/hu_HU/)","Content-Type":"text/plain; charset=UTF-8",Language:"hu_HU","Plural-Forms":"nplurals=2; plural=(n != 1);"},translations:{"":{"":{msgid:"",comments:{translator:"Translators:\nBalázs Meskó <mesko.balazs@fsf.hu>, 2020\nasbot10 <asbot000@gmail.com>, 2020\n"},msgstr:["Last-Translator: asbot10 <asbot000@gmail.com>, 2020\nLanguage-Team: Hungarian (Hungary) (https://www.transifex.com/nextcloud/teams/64236/hu_HU/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: hu_HU\nPlural-Forms: nplurals=2; plural=(n != 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (láthatatlan)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (korlátozott)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:197"},msgstr:["Műveletek"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Válassszon"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Bezárás"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Következő"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:172\nsrc/components/MultiselectTags/MultiselectTags.vue:78"},msgstr:["Nincs találat"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Diavetítés szüneteltetése"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Előző"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Válasszon címkét"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Beállítások"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Diavetítés indítása"]}}}}},{locale:"is",json:{charset:"utf-8",headers:{"Last-Translator":"Sveinn í Felli <sv1@fellsnet.is>, 2020","Language-Team":"Icelandic (https://www.transifex.com/nextcloud/teams/64236/is/)","Content-Type":"text/plain; charset=UTF-8",Language:"is","Plural-Forms":"nplurals=2; plural=(n % 10 != 1 || n % 100 == 11);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nSveinn í Felli <sv1@fellsnet.is>, 2020\n"},msgstr:["Last-Translator: Sveinn í Felli <sv1@fellsnet.is>, 2020\nLanguage-Team: Icelandic (https://www.transifex.com/nextcloud/teams/64236/is/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: is\nPlural-Forms: nplurals=2; plural=(n % 10 != 1 || n % 100 == 11);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (ósýnilegt)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (takmarkað)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:254"},msgstr:["Aðgerðir"]},Activities:{msgid:"Activities",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:176"},msgstr:["Aðgerðir"]},"Animals & Nature":{msgid:"Animals & Nature",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:174"},msgstr:["Dýr og náttúra"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Velja"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Loka"]},Custom:{msgid:"Custom",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:181"},msgstr:["Sérsniðið"]},Flags:{msgid:"Flags",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:180"},msgstr:["Flögg"]},"Food & Drink":{msgid:"Food & Drink",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:175"},msgstr:["Matur og drykkur"]},"Frequently used":{msgid:"Frequently used",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:171"},msgstr:["Oftast notað"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Næsta"]},"No emoji found":{msgid:"No emoji found",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:168"},msgstr:["Ekkert tjáningartákn fannst"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["Engar niðurstöður"]},Objects:{msgid:"Objects",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:178"},msgstr:["Hlutir"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Gera hlé á skyggnusýningu"]},"People & Body":{msgid:"People & Body",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:173"},msgstr:["Fólk og líkami"]},"Pick an emoji":{msgid:"Pick an emoji",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:153"},msgstr:["Veldu tjáningartákn"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Fyrri"]},Search:{msgid:"Search",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:167"},msgstr:["Leita"]},"Search results":{msgid:"Search results",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:170"},msgstr:["Leitarniðurstöður"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Veldu merki"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:57"},msgstr:["Stillingar"]},"Smileys & Emotion":{msgid:"Smileys & Emotion",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:172"},msgstr:["Broskallar og tilfinningar"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Byrja skyggnusýningu"]},Symbols:{msgid:"Symbols",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:179"},msgstr:["Tákn"]},"Travel & Places":{msgid:"Travel & Places",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:177"},msgstr:["Staðir og ferðalög"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["Get ekki leitað í hópnum"]}}}}},{locale:"it",json:{charset:"utf-8",headers:{"Last-Translator":"Vincenzo Reale <vinx.reale@gmail.com>, 2020","Language-Team":"Italian (https://www.transifex.com/nextcloud/teams/64236/it/)","Content-Type":"text/plain; charset=UTF-8",Language:"it","Plural-Forms":"nplurals=2; plural=(n != 1);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nRandom_R, 2020\nVincenzo Reale <vinx.reale@gmail.com>, 2020\n"},msgstr:["Last-Translator: Vincenzo Reale <vinx.reale@gmail.com>, 2020\nLanguage-Team: Italian (https://www.transifex.com/nextcloud/teams/64236/it/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: it\nPlural-Forms: nplurals=2; plural=(n != 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (invisibile)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (limitato)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:249"},msgstr:["Azioni"]},Activities:{msgid:"Activities",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:176"},msgstr:["Attività"]},"Animals & Nature":{msgid:"Animals & Nature",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:174"},msgstr:["Animali e natura"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Scegli"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Chiudi"]},Custom:{msgid:"Custom",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:181"},msgstr:["Personalizzato"]},Flags:{msgid:"Flags",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:180"},msgstr:["Bandiere"]},"Food & Drink":{msgid:"Food & Drink",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:175"},msgstr:["Cibo e bevande"]},"Frequently used":{msgid:"Frequently used",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:171"},msgstr:["Usati di frequente"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Successivo"]},"No emoji found":{msgid:"No emoji found",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:168"},msgstr:["Nessun emoji trovato"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["Nessun risultato"]},Objects:{msgid:"Objects",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:178"},msgstr:["Oggetti"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Presentazione in pausa"]},"People & Body":{msgid:"People & Body",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:173"},msgstr:["Persone e corpo"]},"Pick an emoji":{msgid:"Pick an emoji",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:153"},msgstr:["Scegli un emoji"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Precedente"]},Search:{msgid:"Search",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:167"},msgstr:["Cerca"]},"Search results":{msgid:"Search results",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:170"},msgstr:["Risultati di ricerca"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Seleziona un'etichetta"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:57"},msgstr:["Impostazioni"]},"Smileys & Emotion":{msgid:"Smileys & Emotion",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:172"},msgstr:["Faccine ed emozioni"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Avvia presentazione"]},Symbols:{msgid:"Symbols",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:179"},msgstr:["Simboli"]},"Travel & Places":{msgid:"Travel & Places",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:177"},msgstr:["Viaggi e luoghi"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["Impossibile cercare il gruppo"]}}}}},{locale:"ja_JP",json:{charset:"utf-8",headers:{"Last-Translator":"YANO Tetsu <tetuyano+transi@gmail.com>, 2020","Language-Team":"Japanese (Japan) (https://www.transifex.com/nextcloud/teams/64236/ja_JP/)","Content-Type":"text/plain; charset=UTF-8",Language:"ja_JP","Plural-Forms":"nplurals=1; plural=0;"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nYANO Tetsu <tetuyano+transi@gmail.com>, 2020\n"},msgstr:["Last-Translator: YANO Tetsu <tetuyano+transi@gmail.com>, 2020\nLanguage-Team: Japanese (Japan) (https://www.transifex.com/nextcloud/teams/64236/ja_JP/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: ja_JP\nPlural-Forms: nplurals=1; plural=0;\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{タグ} (不可視)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{タグ} (制限付)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:249"},msgstr:["操作"]},Activities:{msgid:"Activities",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:176"},msgstr:["アクティビティ"]},"Animals & Nature":{msgid:"Animals & Nature",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:174"},msgstr:["動物と自然"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["選択"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["閉じる"]},Custom:{msgid:"Custom",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:181"},msgstr:["カスタム"]},Flags:{msgid:"Flags",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:180"},msgstr:["国旗"]},"Food & Drink":{msgid:"Food & Drink",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:175"},msgstr:["食べ物と飲み物"]},"Frequently used":{msgid:"Frequently used",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:171"},msgstr:["よく使うもの"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["次"]},"No emoji found":{msgid:"No emoji found",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:168"},msgstr:["絵文字が見つかりません"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["なし"]},Objects:{msgid:"Objects",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:178"},msgstr:["物"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["スライドショーを一時停止"]},"People & Body":{msgid:"People & Body",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:173"},msgstr:["様々な人と体の部位"]},"Pick an emoji":{msgid:"Pick an emoji",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:153"},msgstr:["絵文字を選択"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["前"]},Search:{msgid:"Search",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:167"},msgstr:["検索"]},"Search results":{msgid:"Search results",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:170"},msgstr:["検索結果"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["タグを選択"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["設定"]},"Smileys & Emotion":{msgid:"Smileys & Emotion",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:172"},msgstr:["笑顔と気持ち"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["スライドショーを開始"]},Symbols:{msgid:"Symbols",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:179"},msgstr:["記号"]},"Travel & Places":{msgid:"Travel & Places",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:177"},msgstr:["旅行と場所"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["グループを検索できません"]}}}}},{locale:"lt_LT",json:{charset:"utf-8",headers:{"Last-Translator":"Moo, 2020","Language-Team":"Lithuanian (Lithuania) (https://www.transifex.com/nextcloud/teams/64236/lt_LT/)","Content-Type":"text/plain; charset=UTF-8",Language:"lt_LT","Plural-Forms":"nplurals=4; plural=(n % 10 == 1 && (n % 100 > 19 || n % 100 < 11) ? 0 : (n % 10 >= 2 && n % 10 <=9) && (n % 100 > 19 || n % 100 < 11) ? 1 : n % 1 != 0 ? 2: 3);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nMoo, 2020\n"},msgstr:["Last-Translator: Moo, 2020\nLanguage-Team: Lithuanian (Lithuania) (https://www.transifex.com/nextcloud/teams/64236/lt_LT/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: lt_LT\nPlural-Forms: nplurals=4; plural=(n % 10 == 1 && (n % 100 > 19 || n % 100 < 11) ? 0 : (n % 10 >= 2 && n % 10 <=9) && (n % 100 > 19 || n % 100 < 11) ? 1 : n % 1 != 0 ? 2: 3);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (nematoma)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (apribota)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:254"},msgstr:["Veiksmai"]},Activities:{msgid:"Activities",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:176"},msgstr:["Veiklos"]},"Animals & Nature":{msgid:"Animals & Nature",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:174"},msgstr:["Gyvūnai ir gamta"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Pasirinkti"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Užverti"]},Custom:{msgid:"Custom",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:181"},msgstr:["Tinkinti"]},Flags:{msgid:"Flags",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:180"},msgstr:["Vėliavos"]},"Food & Drink":{msgid:"Food & Drink",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:175"},msgstr:["Maistas ir gėrimai"]},"Frequently used":{msgid:"Frequently used",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:171"},msgstr:["Dažniausiai naudoti"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Kitas"]},"No emoji found":{msgid:"No emoji found",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:168"},msgstr:["Nerasta jaustukų"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["Nėra rezultatų"]},Objects:{msgid:"Objects",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:178"},msgstr:["Objektai"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Pristabdyti skaidrių rodymą"]},"People & Body":{msgid:"People & Body",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:173"},msgstr:["Žmonės ir kūnas"]},"Pick an emoji":{msgid:"Pick an emoji",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:153"},msgstr:["Pasirinkti jaustuką"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Ankstesnis"]},Search:{msgid:"Search",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:167"},msgstr:["Ieškoti"]},"Search results":{msgid:"Search results",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:170"},msgstr:["Paieškos rezultatai"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Pasirinkti žymę"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:57"},msgstr:["Nustatymai"]},"Smileys & Emotion":{msgid:"Smileys & Emotion",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:172"},msgstr:["Šypsenos ir emocijos"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Pradėti skaidrių rodymą"]},Symbols:{msgid:"Symbols",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:179"},msgstr:["Simboliai"]},"Travel & Places":{msgid:"Travel & Places",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:177"},msgstr:["Kelionės ir vietos"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["Nepavyko atlikti paiešką grupėje"]}}}}},{locale:"lv",json:{charset:"utf-8",headers:{"Last-Translator":"stendec <stendec@inbox.lv>, 2020","Language-Team":"Latvian (https://www.transifex.com/nextcloud/teams/64236/lv/)","Content-Type":"text/plain; charset=UTF-8",Language:"lv","Plural-Forms":"nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n != 0 ? 1 : 2);"},translations:{"":{"":{msgid:"",comments:{translator:"Translators:\nstendec <stendec@inbox.lv>, 2020\n"},msgstr:["Last-Translator: stendec <stendec@inbox.lv>, 2020\nLanguage-Team: Latvian (https://www.transifex.com/nextcloud/teams/64236/lv/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: lv\nPlural-Forms: nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n != 0 ? 1 : 2);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:169"},msgstr:["{tag} (neredzams)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:172"},msgstr:["{tag} (ierobežots)"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Izvēlēties"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:109"},msgstr:["Aizvērt"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:154"},msgstr:["Nākamais"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:169\nsrc/components/MultiselectTags/MultiselectTags.vue:78"},msgstr:["Nav rezultātu"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:290"},msgstr:["Pauzēt slaidrādi"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:134"},msgstr:["Iepriekšējais"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Izvēlēties birku"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Iestatījumi"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:290"},msgstr:["Sākt slaidrādi"]}}}}},{locale:"mk",json:{charset:"utf-8",headers:{"Last-Translator":"Сашко Тодоров, 2020","Language-Team":"Macedonian (https://www.transifex.com/nextcloud/teams/64236/mk/)","Content-Type":"text/plain; charset=UTF-8",Language:"mk","Plural-Forms":"nplurals=2; plural=(n % 10 == 1 && n % 100 != 11) ? 0 : 1;"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nСашко Тодоров, 2020\n"},msgstr:["Last-Translator: Сашко Тодоров, 2020\nLanguage-Team: Macedonian (https://www.transifex.com/nextcloud/teams/64236/mk/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: mk\nPlural-Forms: nplurals=2; plural=(n % 10 == 1 && n % 100 != 11) ? 0 : 1;\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (невидливо)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (ограничено)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:249"},msgstr:["Акции"]},Activities:{msgid:"Activities",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:176"},msgstr:["Активности"]},"Animals & Nature":{msgid:"Animals & Nature",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:174"},msgstr:["Животни & Природа"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Избери"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Затвори"]},Custom:{msgid:"Custom",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:181"},msgstr:["Прилагодени"]},Flags:{msgid:"Flags",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:180"},msgstr:["Знамиња"]},"Food & Drink":{msgid:"Food & Drink",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:175"},msgstr:["Храна & Пијалоци"]},"Frequently used":{msgid:"Frequently used",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:171"},msgstr:["Најчесто користени"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Следно"]},"No emoji found":{msgid:"No emoji found",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:168"},msgstr:["Не се пронајдени емотикони"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["Нема резултати"]},Objects:{msgid:"Objects",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:178"},msgstr:["Објекти"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Пузирај слајдшоу"]},"People & Body":{msgid:"People & Body",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:173"},msgstr:["Луѓе & Тело"]},"Pick an emoji":{msgid:"Pick an emoji",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:153"},msgstr:["Избери емотикон"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Предходно"]},Search:{msgid:"Search",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:167"},msgstr:["Барај"]},"Search results":{msgid:"Search results",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:170"},msgstr:["Резултати од барувањето"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Избери ознака"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:57"},msgstr:["Параметри"]},"Smileys & Emotion":{msgid:"Smileys & Emotion",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:172"},msgstr:["Смешковци & Емотикони"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Стартувај слајдшоу"]},Symbols:{msgid:"Symbols",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:179"},msgstr:["Симболи"]},"Travel & Places":{msgid:"Travel & Places",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:177"},msgstr:["Патувања & Места"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["Неможе да се принајде групата"]}}}}},{locale:"nb_NO",json:{charset:"utf-8",headers:{"Last-Translator":"Ole Jakob Brustad <ole.jakob@brustadbuss.no>, 2020","Language-Team":"Norwegian Bokmål (Norway) (https://www.transifex.com/nextcloud/teams/64236/nb_NO/)","Content-Type":"text/plain; charset=UTF-8",Language:"nb_NO","Plural-Forms":"nplurals=2; plural=(n != 1);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nOle Jakob Brustad <ole.jakob@brustadbuss.no>, 2020\n"},msgstr:["Last-Translator: Ole Jakob Brustad <ole.jakob@brustadbuss.no>, 2020\nLanguage-Team: Norwegian Bokmål (Norway) (https://www.transifex.com/nextcloud/teams/64236/nb_NO/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: nb_NO\nPlural-Forms: nplurals=2; plural=(n != 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (usynlig)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (beskyttet)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:247"},msgstr:["Handlinger"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Velg"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Lukk"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Neste"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:172\nsrc/components/MultiselectTags/MultiselectTags.vue:78"},msgstr:["Ingen resultat"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Pause lysbildefremvisning"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Forrige"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Velg et merke"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Instillinger"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Start lysbildefremvisning"]}}}}},{locale:"nl",json:{charset:"utf-8",headers:{"Last-Translator":"Arjan van S, 2020","Language-Team":"Dutch (https://www.transifex.com/nextcloud/teams/64236/nl/)","Content-Type":"text/plain; charset=UTF-8",Language:"nl","Plural-Forms":"nplurals=2; plural=(n != 1);"},translations:{"":{"":{msgid:"",comments:{translator:"Translators:\nRoeland Jago Douma <roeland@famdouma.nl>, 2020\nArjan van S, 2020\n"},msgstr:["Last-Translator: Arjan van S, 2020\nLanguage-Team: Dutch (https://www.transifex.com/nextcloud/teams/64236/nl/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: nl\nPlural-Forms: nplurals=2; plural=(n != 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (onzichtbaar)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (beperkt)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:196"},msgstr:["Acties"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Kies"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Sluiten"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Volgende"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:172\nsrc/components/MultiselectTags/MultiselectTags.vue:78"},msgstr:["Geen resultaten"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Pauzeer diavoorstelling"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Vorige"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Selecteer een label"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Instellingen"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Start diavoorstelling"]}}}}},{locale:"oc",json:{charset:"utf-8",headers:{"Last-Translator":"Quentin PAGÈS, 2020","Language-Team":"Occitan (post 1500) (https://www.transifex.com/nextcloud/teams/64236/oc/)","Content-Type":"text/plain; charset=UTF-8",Language:"oc","Plural-Forms":"nplurals=2; plural=(n > 1);"},translations:{"":{"":{msgid:"",comments:{translator:"Translators:\nQuentin PAGÈS, 2020\n"},msgstr:["Last-Translator: Quentin PAGÈS, 2020\nLanguage-Team: Occitan (post 1500) (https://www.transifex.com/nextcloud/teams/64236/oc/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: oc\nPlural-Forms: nplurals=2; plural=(n > 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (invisible)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (limit)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:194"},msgstr:["Accions"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Causir"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Tampar"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Seguent"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:172\nsrc/components/MultiselectTags/MultiselectTags.vue:78"},msgstr:["Cap de resultat"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Metre en pausa lo diaporama"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Precedent"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Seleccionar una etiqueta"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Paramètres"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Lançar lo diaporama"]}}}}},{locale:"pl",json:{charset:"utf-8",headers:{"Last-Translator":"Valdnet, 2020","Language-Team":"Polish (https://www.transifex.com/nextcloud/teams/64236/pl/)","Content-Type":"text/plain; charset=UTF-8",Language:"pl","Plural-Forms":"nplurals=4; plural=(n==1 ? 0 : (n%10>=2 && n%10<=4) && (n%100<12 || n%100>14) ? 1 : n!=1 && (n%10>=0 && n%10<=1) || (n%10>=5 && n%10<=9) || (n%100>=12 && n%100<=14) ? 2 : 3);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nValdnet, 2020\n"},msgstr:["Last-Translator: Valdnet, 2020\nLanguage-Team: Polish (https://www.transifex.com/nextcloud/teams/64236/pl/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: pl\nPlural-Forms: nplurals=4; plural=(n==1 ? 0 : (n%10>=2 && n%10<=4) && (n%100<12 || n%100>14) ? 1 : n!=1 && (n%10>=0 && n%10<=1) || (n%10>=5 && n%10<=9) || (n%100>=12 && n%100<=14) ? 2 : 3);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (niewidoczna)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (ograniczona)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:249"},msgstr:["Działania"]},Activities:{msgid:"Activities",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:176"},msgstr:["Aktywność"]},"Animals & Nature":{msgid:"Animals & Nature",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:174"},msgstr:["Zwierzęta i natura"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Wybierz"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Zamknij"]},Custom:{msgid:"Custom",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:181"},msgstr:["Zwyczajne"]},Flags:{msgid:"Flags",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:180"},msgstr:["Flagi"]},"Food & Drink":{msgid:"Food & Drink",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:175"},msgstr:["Jedzenie i picie"]},"Frequently used":{msgid:"Frequently used",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:171"},msgstr:["Często używane"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Następny"]},"No emoji found":{msgid:"No emoji found",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:168"},msgstr:["Nie znaleziono emotikonów"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["Brak wyników"]},Objects:{msgid:"Objects",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:178"},msgstr:["Obiekty"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Wstrzymaj pokaz slajdów"]},"People & Body":{msgid:"People & Body",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:173"},msgstr:["Ludzie i ciało"]},"Pick an emoji":{msgid:"Pick an emoji",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:153"},msgstr:["Wybierz emoji"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Poprzedni"]},Search:{msgid:"Search",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:167"},msgstr:["Szukaj"]},"Search results":{msgid:"Search results",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:170"},msgstr:["Wyniki wyszukiwania"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Wybierz etykietę"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Ustawienia"]},"Smileys & Emotion":{msgid:"Smileys & Emotion",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:172"},msgstr:["Buźki i emotikony"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Rozpocznij pokaz slajdów"]},Symbols:{msgid:"Symbols",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:179"},msgstr:["Symbole"]},"Travel & Places":{msgid:"Travel & Places",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:177"},msgstr:["Podróże i miejsca"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["Nie można przeszukać grupy"]}}}}},{locale:"pt_BR",json:{charset:"utf-8",headers:{"Last-Translator":"Paulo Schopf, 2020","Language-Team":"Portuguese (Brazil) (https://www.transifex.com/nextcloud/teams/64236/pt_BR/)","Content-Type":"text/plain; charset=UTF-8",Language:"pt_BR","Plural-Forms":"nplurals=2; plural=(n > 1);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nMaurício Gardini <accounts@mauriciogardini.com>, 2020\nPaulo Schopf, 2020\n"},msgstr:["Last-Translator: Paulo Schopf, 2020\nLanguage-Team: Portuguese (Brazil) (https://www.transifex.com/nextcloud/teams/64236/pt_BR/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: pt_BR\nPlural-Forms: nplurals=2; plural=(n > 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (invisível)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (restrito) "]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:249"},msgstr:["Ações"]},Activities:{msgid:"Activities",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:176"},msgstr:["Atividades"]},"Animals & Nature":{msgid:"Animals & Nature",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:174"},msgstr:["Animais & Natureza"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Escolher"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Fechar"]},Custom:{msgid:"Custom",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:181"},msgstr:["Personalizado"]},Flags:{msgid:"Flags",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:180"},msgstr:["Bandeiras"]},"Food & Drink":{msgid:"Food & Drink",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:175"},msgstr:["Comida & Bebida"]},"Frequently used":{msgid:"Frequently used",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:171"},msgstr:["Mais usados"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Próximo"]},"No emoji found":{msgid:"No emoji found",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:168"},msgstr:["Nenhum emoji encontrado"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["Sem resultados"]},Objects:{msgid:"Objects",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:178"},msgstr:["Objetos"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Pausar apresentação de slides"]},"People & Body":{msgid:"People & Body",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:173"},msgstr:["Pessoas & Corpo"]},"Pick an emoji":{msgid:"Pick an emoji",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:153"},msgstr:["Escolha um emoji"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Anterior"]},Search:{msgid:"Search",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:167"},msgstr:["Pesquisar"]},"Search results":{msgid:"Search results",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:170"},msgstr:["Resultados da pesquisa"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Selecionar uma tag"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Configurações"]},"Smileys & Emotion":{msgid:"Smileys & Emotion",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:172"},msgstr:["Smiles & Emoções"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Iniciar apresentação de slides"]},Symbols:{msgid:"Symbols",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:179"},msgstr:["Símbolo"]},"Travel & Places":{msgid:"Travel & Places",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:177"},msgstr:["Viagem & Lugares"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["Não foi possível pesquisar o grupo"]}}}}},{locale:"pt_PT",json:{charset:"utf-8",headers:{"Last-Translator":"Manuela Silva <manuelarodsilva@gmail.com>, 2020","Language-Team":"Portuguese (Portugal) (https://www.transifex.com/nextcloud/teams/64236/pt_PT/)","Content-Type":"text/plain; charset=UTF-8",Language:"pt_PT","Plural-Forms":"nplurals=2; plural=(n != 1);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nfpapoila <fpapoila@gmail.com>, 2020\nManuela Silva <manuelarodsilva@gmail.com>, 2020\n"},msgstr:["Last-Translator: Manuela Silva <manuelarodsilva@gmail.com>, 2020\nLanguage-Team: Portuguese (Portugal) (https://www.transifex.com/nextcloud/teams/64236/pt_PT/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: pt_PT\nPlural-Forms: nplurals=2; plural=(n != 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (invisivel)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (restrito)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:249"},msgstr:["Ações"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Escolher"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Fechar"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Seguinte"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["Sem resultados"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Pausar diaporama"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Anterior"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Selecionar uma etiqueta"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Definições"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Iniciar diaporama"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["Não é possível pesquisar o grupo"]}}}}},{locale:"ru",json:{charset:"utf-8",headers:{"Last-Translator":"Alex <kekcuha@gmail.com>, 2020","Language-Team":"Russian (https://www.transifex.com/nextcloud/teams/64236/ru/)","Content-Type":"text/plain; charset=UTF-8",Language:"ru","Plural-Forms":"nplurals=4; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<12 || n%100>14) ? 1 : n%10==0 || (n%10>=5 && n%10<=9) || (n%100>=11 && n%100<=14)? 2 : 3);"},translations:{"":{"":{msgid:"",comments:{translator:"Translators:\nAlex <kekcuha@gmail.com>, 2020\n"},msgstr:["Last-Translator: Alex <kekcuha@gmail.com>, 2020\nLanguage-Team: Russian (https://www.transifex.com/nextcloud/teams/64236/ru/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: ru\nPlural-Forms: nplurals=4; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<12 || n%100>14) ? 1 : n%10==0 || (n%10>=5 && n%10<=9) || (n%100>=11 && n%100<=14)? 2 : 3);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:169"},msgstr:["{tag} (невидимое)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:172"},msgstr:["{tag} (ограниченное)"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Выберите"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:109"},msgstr:["Закрыть"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:154"},msgstr:["Следующее"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:169\nsrc/components/MultiselectTags/MultiselectTags.vue:78"},msgstr:["Результаты отсуствуют"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:290"},msgstr:["Приостановить показ слйдов"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:134"},msgstr:["Предыдущее"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Выберите метку"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Параметры"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:290"},msgstr:["Начать показ слайдов"]}}}}},{locale:"sk_SK",json:{charset:"utf-8",headers:{"Last-Translator":"Anton Kuchár <tonokuc@pobox.sk>, 2020","Language-Team":"Slovak (Slovakia) (https://www.transifex.com/nextcloud/teams/64236/sk_SK/)","Content-Type":"text/plain; charset=UTF-8",Language:"sk_SK","Plural-Forms":"nplurals=4; plural=(n % 1 == 0 && n == 1 ? 0 : n % 1 == 0 && n >= 2 && n <= 4 ? 1 : n % 1 != 0 ? 2: 3);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nAnton Kuchár <tonokuc@pobox.sk>, 2020\n"},msgstr:["Last-Translator: Anton Kuchár <tonokuc@pobox.sk>, 2020\nLanguage-Team: Slovak (Slovakia) (https://www.transifex.com/nextcloud/teams/64236/sk_SK/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: sk_SK\nPlural-Forms: nplurals=4; plural=(n % 1 == 0 && n == 1 ? 0 : n % 1 == 0 && n >= 2 && n <= 4 ? 1 : n % 1 != 0 ? 2: 3);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (neviditeľný)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (obmedzený)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:249"},msgstr:["Akcie"]},Activities:{msgid:"Activities",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:176"},msgstr:["Aktivity"]},"Animals & Nature":{msgid:"Animals & Nature",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:174"},msgstr:["Zvieratá a príroda"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Vybrať"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Zatvoriť"]},Custom:{msgid:"Custom",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:181"},msgstr:["Zvyk"]},Flags:{msgid:"Flags",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:180"},msgstr:["Vlajky"]},"Food & Drink":{msgid:"Food & Drink",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:175"},msgstr:["Jedlo a nápoje"]},"Frequently used":{msgid:"Frequently used",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:171"},msgstr:["Často používané"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Ďalší"]},"No emoji found":{msgid:"No emoji found",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:168"},msgstr:["Nenašli sa žiadne emodži"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["Žiadne výsledky"]},Objects:{msgid:"Objects",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:178"},msgstr:["Objekty"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Pozastaviť prezentáciu"]},"People & Body":{msgid:"People & Body",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:173"},msgstr:["Ľudia a telo"]},"Pick an emoji":{msgid:"Pick an emoji",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:153"},msgstr:["Vyberte si emodži"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Predchádzajúci"]},Search:{msgid:"Search",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:167"},msgstr:["Hľadať"]},"Search results":{msgid:"Search results",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:170"},msgstr:["Výsledky vyhľadávania"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Vybrať štítok"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Nastavenia"]},"Smileys & Emotion":{msgid:"Smileys & Emotion",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:172"},msgstr:["Smajlíky a emócie"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Začať prezentáciu"]},Symbols:{msgid:"Symbols",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:179"},msgstr:["Symboly"]},"Travel & Places":{msgid:"Travel & Places",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:177"},msgstr:["Cestovanie a miesta"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["Skupinu sa nepodarilo nájsť"]}}}}},{locale:"sv",json:{charset:"utf-8",headers:{"Last-Translator":"Jonatan Nyberg, 2020","Language-Team":"Swedish (https://www.transifex.com/nextcloud/teams/64236/sv/)","Content-Type":"text/plain; charset=UTF-8",Language:"sv","Plural-Forms":"nplurals=2; plural=(n != 1);"},translations:{"":{"":{msgid:"",comments:{translator:"Translators:\nGabriel Ekström <gabriel.ekstrom06@gmail.com>, 2020\nErik Lennartsson, 2020\nJonatan Nyberg, 2020\n"},msgstr:["Last-Translator: Jonatan Nyberg, 2020\nLanguage-Team: Swedish (https://www.transifex.com/nextcloud/teams/64236/sv/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: sv\nPlural-Forms: nplurals=2; plural=(n != 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (osynlig)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (begränsad)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:194"},msgstr:["Åtgärder"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Välj"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Stäng"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Nästa"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:172\nsrc/components/MultiselectTags/MultiselectTags.vue:78"},msgstr:["Inga resultat"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Pausa bildspel"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Föregående"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Välj en tag"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Inställningar"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Starta bildspel"]}}}}},{locale:"tr",json:{charset:"utf-8",headers:{"Last-Translator":"Hüseyin Fahri Uzun <mail@fahriuzun.com>, 2020","Language-Team":"Turkish (https://www.transifex.com/nextcloud/teams/64236/tr/)","Content-Type":"text/plain; charset=UTF-8",Language:"tr","Plural-Forms":"nplurals=2; plural=(n > 1);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nKemal Oktay Aktoğan <oktayaktogan@gmail.com>, 2020\nabc Def <hdogan1974@gmail.com>, 2020\nHüseyin Fahri Uzun <mail@fahriuzun.com>, 2020\n"},msgstr:["Last-Translator: Hüseyin Fahri Uzun <mail@fahriuzun.com>, 2020\nLanguage-Team: Turkish (https://www.transifex.com/nextcloud/teams/64236/tr/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: tr\nPlural-Forms: nplurals=2; plural=(n > 1);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (görünmez)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (kısıtlı)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:247"},msgstr:["Eylemler"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Seç"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Kapat"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Sonraki"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["Sonuçlar yok"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Slayt gösterisini duraklat"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Önceki"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Bir etiket seçin"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Ayarlar"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Slayt gösterisini başlat"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["Grupta arama yapılamıyor"]}}}}},{locale:"uk",json:{charset:"utf-8",headers:{"Last-Translator":"Oleksa Stasevych <oleksiy.stasevych@gmail.com>, 2020","Language-Team":"Ukrainian (https://www.transifex.com/nextcloud/teams/64236/uk/)","Content-Type":"text/plain; charset=UTF-8",Language:"uk","Plural-Forms":"nplurals=4; plural=(n % 1 == 0 && n % 10 == 1 && n % 100 != 11 ? 0 : n % 1 == 0 && n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? 1 : n % 1 == 0 && (n % 10 ==0 || (n % 10 >=5 && n % 10 <=9) || (n % 100 >=11 && n % 100 <=14 )) ? 2: 3);"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nOleksa Stasevych <oleksiy.stasevych@gmail.com>, 2020\n"},msgstr:["Last-Translator: Oleksa Stasevych <oleksiy.stasevych@gmail.com>, 2020\nLanguage-Team: Ukrainian (https://www.transifex.com/nextcloud/teams/64236/uk/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: uk\nPlural-Forms: nplurals=4; plural=(n % 1 == 0 && n % 10 == 1 && n % 100 != 11 ? 0 : n % 1 == 0 && n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? 1 : n % 1 == 0 && (n % 10 ==0 || (n % 10 >=5 && n % 10 <=9) || (n % 100 >=11 && n % 100 <=14 )) ? 2: 3);\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (invisible)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (restricted)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:249"},msgstr:["Дії"]},Activities:{msgid:"Activities",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:176"},msgstr:["Діяльність"]},"Animals & Nature":{msgid:"Animals & Nature",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:174"},msgstr:["Тварини та природа"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["Виберіть"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["Закрити"]},Custom:{msgid:"Custom",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:181"},msgstr:["Власне"]},Flags:{msgid:"Flags",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:180"},msgstr:["Прапори"]},"Food & Drink":{msgid:"Food & Drink",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:175"},msgstr:["Їжа та напитки"]},"Frequently used":{msgid:"Frequently used",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:171"},msgstr:["Найчастіші"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["Вперед"]},"No emoji found":{msgid:"No emoji found",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:168"},msgstr:["Емоційки відсутні"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["Відсутні результати"]},Objects:{msgid:"Objects",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:178"},msgstr:["Об'єкти"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Пауза у показі слайдів"]},"People & Body":{msgid:"People & Body",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:173"},msgstr:["Люди та жести"]},"Pick an emoji":{msgid:"Pick an emoji",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:153"},msgstr:["Виберіть емоційку"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["Назад"]},Search:{msgid:"Search",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:167"},msgstr:["Пошук"]},"Search results":{msgid:"Search results",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:170"},msgstr:["Результати пошуку"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["Виберіть позначку"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["Налаштування"]},"Smileys & Emotion":{msgid:"Smileys & Emotion",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:172"},msgstr:["Усміхайлики та емоційки"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["Почати показ слайдів"]},Symbols:{msgid:"Symbols",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:179"},msgstr:["Символи"]},"Travel & Places":{msgid:"Travel & Places",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:177"},msgstr:["Поїздки та місця"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["Неможливо шукати в групі"]}}}}},{locale:"zh_CN",json:{charset:"utf-8",headers:{"Last-Translator":"Pascal Janus <pascal_janus@163.com>, 2020","Language-Team":"Chinese (China) (https://www.transifex.com/nextcloud/teams/64236/zh_CN/)","Content-Type":"text/plain; charset=UTF-8",Language:"zh_CN","Plural-Forms":"nplurals=1; plural=0;"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nSleepyJesse <Jesse_Xu@live.com>, 2020\nJianming Liang <fuufuukun@163.com>, 2020\nPascal Janus <pascal_janus@163.com>, 2020\n"},msgstr:["Last-Translator: Pascal Janus <pascal_janus@163.com>, 2020\nLanguage-Team: Chinese (China) (https://www.transifex.com/nextcloud/teams/64236/zh_CN/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: zh_CN\nPlural-Forms: nplurals=1; plural=0;\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} （不可见）"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} （受限）"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:247"},msgstr:["行为"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["选择"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["关闭"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["下一个"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["无结果"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["暂停幻灯片"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["上一个"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["选择一个标签"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:53"},msgstr:["设置"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["开始幻灯片"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["无法搜索分组"]}}}}},{locale:"zh_TW",json:{charset:"utf-8",headers:{"Last-Translator":"Natashia Maxins <railroad1987@gmail.com>, 2020","Language-Team":"Chinese (Taiwan) (https://www.transifex.com/nextcloud/teams/64236/zh_TW/)","Content-Type":"text/plain; charset=UTF-8",Language:"zh_TW","Plural-Forms":"nplurals=1; plural=0;"},translations:{"":{"":{msgid:"",comments:{translator:"\nTranslators:\nbyStarTW (pan93412) <pan93412@gmail.com>, 2020\nNatashia Maxins <railroad1987@gmail.com>, 2020\n"},msgstr:["Last-Translator: Natashia Maxins <railroad1987@gmail.com>, 2020\nLanguage-Team: Chinese (Taiwan) (https://www.transifex.com/nextcloud/teams/64236/zh_TW/)\nContent-Type: text/plain; charset=UTF-8\nLanguage: zh_TW\nPlural-Forms: nplurals=1; plural=0;\n"]},"{tag} (invisible)":{msgid:"{tag} (invisible)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:170"},msgstr:["{tag} (隱藏)"]},"{tag} (restricted)":{msgid:"{tag} (restricted)",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:173"},msgstr:["{tag} (受限)"]},Actions:{msgid:"Actions",comments:{reference:"src/components/Actions/Actions.vue:254"},msgstr:["動作"]},Activities:{msgid:"Activities",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:176"},msgstr:["活動"]},"Animals & Nature":{msgid:"Animals & Nature",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:174"},msgstr:["動物與自然"]},Choose:{msgid:"Choose",comments:{reference:"src/components/ColorPicker/ColorPicker.vue:145"},msgstr:["選擇"]},Close:{msgid:"Close",comments:{reference:"src/components/Modal/Modal.vue:117"},msgstr:["關閉"]},Custom:{msgid:"Custom",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:181"},msgstr:["自定義"]},Flags:{msgid:"Flags",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:180"},msgstr:["旗幟"]},"Food & Drink":{msgid:"Food & Drink",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:175"},msgstr:["食物與飲料"]},"Frequently used":{msgid:"Frequently used",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:171"},msgstr:["最近使用"]},Next:{msgid:"Next",comments:{reference:"src/components/Modal/Modal.vue:166"},msgstr:["下一個"]},"No emoji found":{msgid:"No emoji found",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:168"},msgstr:["未找到表情符號"]},"No results":{msgid:"No results",comments:{reference:"src/components/Multiselect/Multiselect.vue:174\nsrc/components/MultiselectTags/MultiselectTags.vue:78\nsrc/components/SettingsSelectGroup/SettingsSelectGroup.vue:38"},msgstr:["無結果"]},Objects:{msgid:"Objects",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:178"},msgstr:["物件"]},"Pause slideshow":{msgid:"Pause slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["暫停幻燈片"]},"People & Body":{msgid:"People & Body",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:173"},msgstr:["人物"]},"Pick an emoji":{msgid:"Pick an emoji",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:153"},msgstr:["選擇表情符號"]},Previous:{msgid:"Previous",comments:{reference:"src/components/Modal/Modal.vue:144"},msgstr:["上一個"]},Search:{msgid:"Search",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:167"},msgstr:["搜尋"]},"Search results":{msgid:"Search results",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:170"},msgstr:["搜尋結果"]},"Select a tag":{msgid:"Select a tag",comments:{reference:"src/components/MultiselectTags/MultiselectTags.vue:100"},msgstr:["選擇標籤"]},Settings:{msgid:"Settings",comments:{reference:"src/components/AppNavigationSettings/AppNavigationSettings.vue:57"},msgstr:["設定"]},"Smileys & Emotion":{msgid:"Smileys & Emotion",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:172"},msgstr:["表情"]},"Start slideshow":{msgid:"Start slideshow",comments:{reference:"src/components/Modal/Modal.vue:302"},msgstr:["開始幻燈片"]},Symbols:{msgid:"Symbols",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:179"},msgstr:["標誌"]},"Travel & Places":{msgid:"Travel & Places",comments:{reference:"src/components/EmojiPicker/EmojiPicker.vue:177"},msgstr:["旅遊與景點"]},"Unable to search the group":{msgid:"Unable to search the group",comments:{reference:"src/components/SettingsSelectGroup/SettingsSelectGroup.vue:143"},msgstr:["無法搜尋群組"]}}}}}].map((function(e){return n.addTranslation(e.locale,e.json)}));var r=n.build(),c=r.ngettext.bind(r),i=r.gettext.bind(r)},function(e,s){e.exports=__webpack_require__(/*! core-js/modules/es.function.name */ "./node_modules/core-js/modules/es.function.name.js")},function(e,s){e.exports=__webpack_require__(/*! core-js/modules/es.array.iterator */ "./node_modules/core-js/modules/es.array.iterator.js")},function(e,s){e.exports=__webpack_require__(/*! core-js/modules/es.string.iterator */ "./node_modules/core-js/modules/es.string.iterator.js")},function(e,s){e.exports=__webpack_require__(/*! core-js/modules/web.dom-collections.iterator */ "./node_modules/core-js/modules/web.dom-collections.iterator.js")},function(e,s){e.exports=__webpack_require__(/*! core-js/modules/es.array.map */ "./node_modules/core-js/modules/es.array.map.js")},function(e,s){e.exports=__webpack_require__(/*! core-js/modules/es.regexp.to-string */ "./node_modules/core-js/modules/es.regexp.to-string.js")},function(e,s,t){var o=t(65);"string"==typeof o&&(o=[[e.i,o,""]]),o.locals&&(e.exports=o.locals);(0,t(2).default)("7a7fb996",o,!0,{})},function(e,s){e.exports=__webpack_require__(/*! core-js/modules/es.array.index-of */ "./node_modules/core-js/modules/es.array.index-of.js")},function(e,s,t){"use strict";t.r(s);var o=t(4);t(55);
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
o.VTooltip.options.defaultTemplate='<div class="vue-tooltip" role="tooltip" data-v-'.concat("19787a9",'><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'),o.VTooltip.options.defaultHtml=!1,s.default=o.VTooltip},function(e,s,t){"use strict";e.exports=function(e,s){return s||(s={}),"string"!=typeof(e=e&&e.__esModule?e.default:e)?e:(/^['"].*['"]$/.test(e)&&(e=e.slice(1,-1)),s.hash&&(e+=s.hash),/["'() \t\n]/.test(e)||s.needQuotes?'"'.concat(e.replace(/"/g,'\\"').replace(/\n/g,"\\n"),'"'):e)}},function(e,s,t){"use strict";t.r(s),s.default="data:application/vnd.ms-fontobject;base64,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"},function(e,s,t){"use strict";t.r(s),s.default="data:font/woff;base64,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PAE55eh8gAAAAQAAAAEAADf1ivtfDzz1AAsTiAAAAADbpI3lAAAAANtTseb/4AAAE5MTiAAAAAgAAgAAAAAAAAABAAATiAAAAAATiP/g//UTkwABAAAAAAAAAAAAAAAAAAAABwAAAAATiAAAE4gAABOIAAATiAAABjYAABOIAAAAAP//AAAAAAAAAAAAAAAA/+AAAAAAAAAAAAAAACIANgBYAGwAgACUALQBDgF8AZoCEAImAjQCQgKoAyIDpgP+AAEAAAATAEsAAwAAAAAAAgAAAAoACgAAAP8AAAAAAAAAAAAQAMYAAQAAAAAAAQAUAAAAAQAAAAAAAgAHABQAAQAAAAAAAwAUABsAAQAAAAAABAAUAC8AAQAAAAAABQALAEMAAQAAAAAABgAUAE4AAQAAAAAACgArAGIAAQAAAAAACwATAI0AAwABBAkAAQAoAKAAAwABBAkAAgAOAMgAAwABBAkAAwAoANYAAwABBAkABAAoAP4AAwABBAkABQAWASYAAwABBAkABgAoATwAAwABBAkACgBWAWQAAwABBAkACwAmAbppY29uZm9udC12dWUtMTk3ODdhOVJlZ3VsYXJpY29uZm9udC12dWUtMTk3ODdhOWljb25mb250LXZ1ZS0xOTc4N2E5VmVyc2lvbiAxLjBpY29uZm9udC12dWUtMTk3ODdhOUdlbmVyYXRlZCBieSBzdmcydHRmIGZyb20gRm9udGVsbG8gcHJvamVjdC5odHRwOi8vZm9udGVsbG8uY29tAGkAYwBvAG4AZgBvAG4AdAAtAHYAdQBlAC0AMQA5ADcAOAA3AGEAOQBSAGUAZwB1AGwAYQByAGkAYwBvAG4AZgBvAG4AdAAtAHYAdQBlAC0AMQA5ADcAOAA3AGEAOQBpAGMAbwBuAGYAbwBuAHQALQB2AHUAZQAtADEAOQA3ADgANwBhADkAVgBlAHIAcwBpAG8AbgAgADEALgAwAGkAYwBvAG4AZgBvAG4AdAAtAHYAdQBlAC0AMQA5ADcAOAA3AGEAOQBHAGUAbgBlAHIAYQB0AGUAZAAgAGIAeQAgAHMAdgBnADIAdAB0AGYAIABmAHIAbwBtACAARgBvAG4AdABlAGwAbABvACAAcAByAG8AagBlAGMAdAAuAGgAdAB0AHAAOgAvAC8AZgBvAG4AdABlAGwAbABvAC4AYwBvAG0AAAACAAAAAAAAADIAAAAAAAAAAAAAAAAAAAAAAAAAAAATABMAAAECAQMBBAEFAQYBBwEIAQkBCgELAQwBDQEOAQ8BEAERARIBExFhcnJvdy1sZWZ0LWRvdWJsZQphcnJvdy1sZWZ0EmFycm93LXJpZ2h0LWRvdWJsZQthcnJvdy1yaWdodApicmVhZGNydW1iCWNoZWNrbWFyawVjbG9zZQdjb25maXJtBGluZm8EbWVudQRtb3JlBXBhdXNlBHBsYXkKdHJpYW5nbGUtcxB1c2VyLXN0YXR1cy1hd2F5D3VzZXItc3RhdHVzLWRuZBV1c2VyLXN0YXR1cy1pbnZpc2libGUSdXNlci1zdGF0dXMtb25saW5lAAA="},function(e,s,t){"use strict";t.r(s),s.default="data:font/ttf;base64,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AAATiP/g//UTkwABAAAAAAAAAAAAAAAAAAAABwAAAAATiAAAE4gAABOIAAATiAAABjYAABOIAAAAAP//AAAAAAAAAAAAAAAA/+AAAAAAAAAAAAAAACIANgBYAGwAgACUALQBDgF8AZoCEAImAjQCQgKoAyIDpgP+AAEAAAATAEsAAwAAAAAAAgAAAAoACgAAAP8AAAAAAAAAAAAQAMYAAQAAAAAAAQAUAAAAAQAAAAAAAgAHABQAAQAAAAAAAwAUABsAAQAAAAAABAAUAC8AAQAAAAAABQALAEMAAQAAAAAABgAUAE4AAQAAAAAACgArAGIAAQAAAAAACwATAI0AAwABBAkAAQAoAKAAAwABBAkAAgAOAMgAAwABBAkAAwAoANYAAwABBAkABAAoAP4AAwABBAkABQAWASYAAwABBAkABgAoATwAAwABBAkACgBWAWQAAwABBAkACwAmAbppY29uZm9udC12dWUtMTk3ODdhOVJlZ3VsYXJpY29uZm9udC12dWUtMTk3ODdhOWljb25mb250LXZ1ZS0xOTc4N2E5VmVyc2lvbiAxLjBpY29uZm9udC12dWUtMTk3ODdhOUdlbmVyYXRlZCBieSBzdmcydHRmIGZyb20gRm9udGVsbG8gcHJvamVjdC5odHRwOi8vZm9udGVsbG8uY29tAGkAYwBvAG4AZgBvAG4AdAAtAHYAdQBlAC0AMQA5ADcAOAA3AGEAOQBSAGUAZwB1AGwAYQByAGkAYwBvAG4AZgBvAG4AdAAtAHYAdQBlAC0AMQA5ADcAOAA3AGEAOQBpAGMAbwBuAGYAbwBuAHQALQB2AHUAZQAtADEAOQA3ADgANwBhADkAVgBlAHIAcwBpAG8AbgAgADEALgAwAGkAYwBvAG4AZgBvAG4AdAAtAHYAdQBlAC0AMQA5ADcAOAA3AGEAOQBHAGUAbgBlAHIAYQB0AGUAZAAgAGIAeQAgAHMAdgBnADIAdAB0AGYAIABmAHIAbwBtACAARgBvAG4AdABlAGwAbABvACAAcAByAG8AagBlAGMAdAAuAGgAdAB0AHAAOgAvAC8AZgBvAG4AdABlAGwAbABvAC4AYwBvAG0AAAACAAAAAAAAADIAAAAAAAAAAAAAAAAAAAAAAAAAAAATABMAAAECAQMBBAEFAQYBBwEIAQkBCgELAQwBDQEOAQ8BEAERARIBExFhcnJvdy1sZWZ0LWRvdWJsZQphcnJvdy1sZWZ0EmFycm93LXJpZ2h0LWRvdWJsZQthcnJvdy1yaWdodApicmVhZGNydW1iCWNoZWNrbWFyawVjbG9zZQdjb25maXJtBGluZm8EbWVudQRtb3JlBXBhdXNlBHBsYXkKdHJpYW5nbGUtcxB1c2VyLXN0YXR1cy1hd2F5D3VzZXItc3RhdHVzLWRuZBV1c2VyLXN0YXR1cy1pbnZpc2libGUSdXNlci1zdGF0dXMtb25saW5lAAA="},function(e,s,t){"use strict";t.r(s),s.default="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCIgPjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48bWV0YWRhdGE+PC9tZXRhZGF0YT48ZGVmcz48Zm9udCBpZD0iaWNvbmZvbnQtdnVlLTE5Nzg3YTkiIGhvcml6LWFkdi14PSI1MDAwIj48Zm9udC1mYWNlIGZvbnQtZmFtaWx5PSJpY29uZm9udC12dWUtMTk3ODdhOSIgZm9udC13ZWlnaHQ9IjQwMCIgZm9udC1zdHJldGNoPSJub3JtYWwiIHVuaXRzLXBlci1lbT0iNTAwMCIgcGFub3NlLTE9IjIgMCA1IDMgMCAwIDAgMCAwIDAiIGFzY2VudD0iNTAwMCIgZGVzY2VudD0iMCIgeC1oZWlnaHQ9IjAiIGJib3g9Ii0zMiAwIDUwMTEgNTAwMCIgdW5kZXJsaW5lLXRoaWNrbmVzcz0iMCIgdW5kZXJsaW5lLXBvc2l0aW9uPSI1MCIgdW5pY29kZS1yYW5nZT0iVStlYTAxLWVhMTIiIC8+PG1pc3NpbmctZ2x5cGggaG9yaXotYWR2LXg9IjAiICAvPjxnbHlwaCBnbHlwaC1uYW1lPSJhcnJvdy1sZWZ0LWRvdWJsZSIgdW5pY29kZT0iJiN4ZWEwMTsiIGQ9Ik0zNzUwIDM5MDYgbC0xNDA2IC0xNDA2IGwxNDA2IC0xNDA2IGwwIDMxMiBsLTEwOTQgMTA5NCBsMTA5NCAxMDk0IGwwIDMxMiBaTTIzNDQgMzkwNiBsLTE0MDYgLTE0MDYgbDE0MDYgLTE0MDYgbDAgMzEyIGwtMTA5NCAxMDk0IGwxMDk0IDEwOTQgbDAgMzEyIFoiIC8+PGdseXBoIGdseXBoLW5hbWU9ImFycm93LWxlZnQiIHVuaWNvZGU9IiYjeGVhMDI7IiBkPSJNMTU2MyAyNTAwIGwxODc1IC0xODc1IGwwIC0zMTIgbC0yMTg4IDIxODcgbDIxODggMjE4OCBsMCAtMzEzIGwtMTg3NSAtMTg3NSBaIiAvPjxnbHlwaCBnbHlwaC1uYW1lPSJhcnJvdy1yaWdodC1kb3VibGUiIHVuaWNvZGU9IiYjeGVhMDM7IiBkPSJNMTI1MCAxMDk0IGwxNDA2IDE0MDYgbC0xNDA2IDE0MDYgbDAgLTMxMiBsMTA5NCAtMTA5NCBsLTEwOTQgLTEwOTQgbDAgLTMxMiBaTTI2NTYgMTA5NCBsMTQwNyAxNDA2IGwtMTQwNyAxNDA2IGwwIC0zMTIgbDEwOTQgLTEwOTQgbC0xMDk0IC0xMDk0IGwwIC0zMTIgWiIgLz48Z2x5cGggZ2x5cGgtbmFtZT0iYXJyb3ctcmlnaHQiIHVuaWNvZGU9IiYjeGVhMDQ7IiBkPSJNMzQzOCAyNTAwIGwtMTg3NSAxODc1IGwwIDMxMyBsMjE4NyAtMjE4OCBsLTIxODcgLTIxODcgbDAgMzEyIGwxODc1IDE4NzUgWiIgLz48Z2x5cGggZ2x5cGgtbmFtZT0iYnJlYWRjcnVtYiIgdW5pY29kZT0iJiN4ZWEwNTsiIGQ9Ik0xNDggNTAwMCBsLTE0OCAtODUgbDEzOTQgLTI0MTUgbC0xMzk0IC0yNDE1IGwxNDggLTg1IGwxNDQzIDI1MDAgbC0xNDQzIDI1MDAgWiIgLz48Z2x5cGggZ2x5cGgtbmFtZT0iY2hlY2ttYXJrIiB1bmljb2RlPSImI3hlYTA2OyIgZD0iTTQwNDUgMzk3MSBsLTIwNjEgLTIwNjEgbC0xMDI5IDEwMjkgbC00NDIgLTQ0MSBsMTQ3MSAtMTQ3MSBsMjUwMyAyNTAyIGwtNDQyIDQ0MiBaIiAvPjxnbHlwaCBnbHlwaC1uYW1lPSJjbG9zZSIgdW5pY29kZT0iJiN4ZWEwNzsiIGQ9Ik00Mzc1IDExNTYgbC01MzEgLTUzMSBsLTEzNDQgMTM0NCBsLTEzNDQgLTEzNDQgbC01MzEgNTMxIGwxMzQ0IDEzNDQgbC0xMzQ0IDEzNDQgbDUzMSA1MzEgbDEzNDQgLTEzNDQgbDEzNDQgMTM0NCBsNTMxIC01MzEgbC0xMzQ0IC0xMzQ0IGwxMzQ0IC0xMzQ0IFoiIC8+PGdseXBoIGdseXBoLW5hbWU9ImNvbmZpcm0iIHVuaWNvZGU9IiYjeGVhMDg7IiBkPSJNMjY1NiA0ODQ0IHEtMTAxIDAgLTE4MCAtNTcgcS03NCAtNTIgLTEwOSAtMTM4IHEtMzUgLTg2IC0xOSAtMTc1IHExOCAtOTYgOTAgLTE2NyBsMTQ5NSAtMTQ5NCBsLTM2MTYgMCBxLTc3IDEgLTEzOSAtMjYgcS01OCAtMjQgLTk5IC03MCBxLTM5IC00NCAtNTkgLTEwMSBxLTIwIC01NiAtMjAgLTExNiBxMCAtNjAgMjAgLTExNiBxMjAgLTU3IDU5IC0xMDEgcTQxIC00NiA5OSAtNzAgcTYyIC0yNyAxMzkgLTI1IGwzNjE2IDAgbC0xNDk1IC0xNDk1IHEtNTUgLTUzIC04MSAtMTE2IHEtMjQgLTU5IC0yMSAtMTIxIHEzIC01OCAzMCAtMTEzIHEyNSAtNTQgNjggLTk3IHE0MyAtNDMgOTYgLTY4IHE1NSAtMjYgMTE0IC0yOSBxNjIgLTMgMTIwIDIxIHE2MyAyNSAxMTYgODEgbDIwMjkgMjAyOCBxNTkgNjAgODAgMTQxIHEyMSA4MCAxIDE1OSBxLTIxIDgyIC04MSAxNDIgbC0yMDI5IDIwMjggcS00NCA0NSAtMTAyIDcwIHEtNTggMjUgLTEyMiAyNSBaIiAvPjxnbHlwaCBnbHlwaC1uYW1lPSJpbmZvIiB1bmljb2RlPSImI3hlYTA5OyIgZD0iTTI0MjIgNDY4OCBxLTExMSAwIC0yMTMgLTQzIHEtOTggLTQyIC0xNzQgLTExNy41IHEtNzYgLTc1LjUgLTExNyAtMTc0LjUgcS00MyAtMTAxIC00MyAtMjEyLjUgcTAgLTExMS41IDQzIC0yMTIuNSBxNDEgLTk4IDExNyAtMTc0IHE3NiAtNzYgMTc0IC0xMTcgcTEwMiAtNDMgMjEzIC00MyBxMTExIDAgMjEzIDQzIHE5OCA0MSAxNzMuNSAxMTcgcTc1LjUgNzYgMTE3LjUgMTc0IHE0MyAxMDEgNDMgMjEyLjUgcTAgMTExLjUgLTQzIDIxMi41IHEtNDIgOTkgLTExNy41IDE3NC41IHEtNzUuNSA3NS41IC0xNzMuNSAxMTcuNSBxLTEwMiA0MyAtMjEzIDQzIFpNMTU2MyAzMTI1IHEtODYgMCAtMTU4IC00MyBxLTcxIC00MSAtMTEyIC0xMTIgcS00MyAtNzIgLTQzIC0xNTcuNSBxMCAtODUuNSA0MyAtMTU3LjUgcTQxIC03MSAxMTIgLTExMiBxNzIgLTQzIDE1OCAtNDMgbDYyNSAwIGwwIC0xNTYyIGwtNjI1IDAgcS04NiAwIC0xNTggLTQzIHEtNzEgLTQxIC0xMTIgLTExMiBxLTQzIC03MyAtNDMgLTE1OCBxMCAtODUgNDMgLTE1OCBxNDEgLTcxIDExMiAtMTEyIHE3MiAtNDMgMTU4IC00MiBsMTg3NSAwIHE4NSAwIDE1NyA0MiBxNzEgNDEgMTEyIDExMiBxNDMgNzMgNDMgMTU4IHEwIDg1IC00MyAxNTggcS00MSA3MSAtMTEyIDExMiBxLTcyIDQzIC0xNTcgNDMgbC02MjUgMCBsMCAxODc1IHEwIDg1IC00MyAxNTcgcS00MSA3MSAtMTEyIDExMiBxLTczIDQzIC0xNTggNDMgbC05MzcgMCBaIiAvPjxnbHlwaCBnbHlwaC1uYW1lPSJtZW51IiB1bmljb2RlPSImI3hlYTBhOyIgZD0iTTYyNSA0Mzc1IGwwIC02MjUgbDM3NTAgMCBsMCA2MjUgbC0zNzUwIDAgWk02MjUgMjgxMyBsMCAtNjI1IGwzNzUwIDAgbDAgNjI1IGwtMzc1MCAwIFpNNjI1IDEyNTAgbDAgLTYyNSBsMzc1MCAwIGwwIDYyNSBsLTM3NTAgMCBaIiAvPjxnbHlwaCBnbHlwaC1uYW1lPSJtb3JlIiB1bmljb2RlPSImI3hlYTBiOyIgZD0iTTc4MSAzMDQ3IHExMTIgMCAyMTMgLTQzIHE5OCAtNDIgMTc0IC0xMTcuNSBxNzYgLTc1LjUgMTE3IC0xNzMuNSBxNDMgLTEwMiA0MyAtMjEzIHEwIC0xMTEgLTQzIC0yMTMgcS00MSAtOTggLTExNyAtMTczLjUgcS03NiAtNzUuNSAtMTc0IC0xMTcuNSBxLTEwMSAtNDMgLTIxMi41IC00MyBxLTExMS41IDAgLTIxMy41IDQzIHEtOTggNDIgLTE3My41IDExNy41IHEtNzUuNSA3NS41IC0xMTcuNSAxNzMuNSBxLTQzIDEwMiAtNDMgMjEzIHEwIDExMSA0MyAyMTMgcTQyIDk4IDExNy41IDE3My41IHE3NS41IDc1LjUgMTczLjUgMTE3LjUgcTEwMiA0MyAyMTMgNDMgWk0yNTAwIDMwNDcgcTExMSAwIDIxMyAtNDMgcTk4IC00MiAxNzMuNSAtMTE3LjUgcTc1LjUgLTc1LjUgMTE3LjUgLTE3My41IHE0MyAtMTAyIDQzIC0yMTMgcTAgLTExMSAtNDMgLTIxMyBxLTQyIC05OCAtMTE3LjUgLTE3My41IHEtNzUuNSAtNzUuNSAtMTczLjUgLTExNy41IHEtMTAyIC00MyAtMjEzIC00MyBxLTExMSAwIC0yMTMgNDMgcS05OCA0MiAtMTczLjUgMTE3LjUgcS03NS41IDc1LjUgLTExNy41IDE3My41IHEtNDMgMTAyIC00MyAyMTMgcTAgMTExIDQzIDIxMyBxNDIgOTggMTE3LjUgMTczLjUgcTc1LjUgNzUuNSAxNzMuNSAxMTcuNSBxMTAyIDQzIDIxMyA0MyBaTTQyMTkgMzA0NyBxMTExIDAgMjEzIC00MyBxOTggLTQyIDE3My41IC0xMTcuNSBxNzUuNSAtNzUuNSAxMTcuNSAtMTczLjUgcTQzIC0xMDIgNDMgLTIxMyBxMCAtMTExIC00MyAtMjEzIHEtNDIgLTk4IC0xMTcuNSAtMTczLjUgcS03NS41IC03NS41IC0xNzMuNSAtMTE3LjUgcS0xMDIgLTQzIC0yMTMuNSAtNDMgcS0xMTEuNSAwIC0yMTIuNSA0MyBxLTk4IDQyIC0xNzQgMTE3LjUgcS03NiA3NS41IC0xMTcgMTczLjUgcS00MyAxMDIgLTQzIDIxMyBxMCAxMTEgNDMgMjEzIHE0MSA5OCAxMTcgMTczLjUgcTc2IDc1LjUgMTc0IDExNy41IHExMDEgNDMgMjEzIDQzIFoiIC8+PGdseXBoIGdseXBoLW5hbWU9InBhdXNlIiB1bmljb2RlPSImI3hlYTBjOyIgZD0iTTkzOCA0MDYzIGwwIC0zMTI1IGwxMjUwIDAgbDAgMzEyNSBsLTEyNTAgMCBaTTI4MTMgNDA2MyBsMCAtMzEyNSBsMTI1MCAwIGwwIDMxMjUgbC0xMjUwIDAgWiIgLz48Z2x5cGggZ2x5cGgtbmFtZT0icGxheSIgdW5pY29kZT0iJiN4ZWEwZDsiIGQ9Ik02MjUgNDM3NSBsMzc1MCAtMTg3NSBsLTM3NTAgLTE4NzUgbDAgMzc1MCBaIiAvPjxnbHlwaCBnbHlwaC1uYW1lPSJ0cmlhbmdsZS1zIiB1bmljb2RlPSImI3hlYTBlOyIgZD0iTTEyNTAgMzEyNSBsMTI1MCAtMTI1MCBsMTI1MCAxMjQ4IGwtMjUwMCAyIFoiIC8+PGdseXBoIGdseXBoLW5hbWU9InVzZXItc3RhdHVzLWF3YXkiIHVuaWNvZGU9IiYjeGVhMGY7IiBkPSJNMjE1NiA0OTY5IHEtMzYwIC00NiAtNjk1IC0xOTcgcS0zMjYgLTE0NyAtNjAxIC0zODAgcS0yNzQgLTIzMSAtNDcyIC01MjggcS0yMDIgLTMwMSAtMzA5IC02NDIgcS0xMTAgLTM1MyAtMTEwIC03MjIgcTAgLTQwNiAxMjggLTc4OCBxMTIzIC0zNzAgMzU2IC02ODYgcTIyOSAtMzEzIDU0MiAtNTQyIHEzMTYgLTIzMiA2ODYgLTM1NiBxMzgyIC0xMjggNzg4IC0xMjggcTM2OSAwIDcyMiAxMDcgcTM0MiAxMDQgNjQ0IDMwMSBxMjk4IDE5NCA1MzMgNDYzIHEyMzYgMjcwIDM4OSA1OTMgcTE1NiAzMzEgMjEyIDY5MiBxLTE4OCAtMjA0IC00MjMuNSAtMzUxIHEtMjM1LjUgLTE0NyAtNDk4LjUgLTIyNSBxLTI2OSAtODAgLTU0NyAtODAgcS0zMjIgMCAtNjI4IDEwMyBxLTI5NSA5OSAtNTQ4IDI4NiBxLTI1MSAxODQgLTQzNSA0MzUgcS0xODcgMjUzIC0yODYgNTQ4IHEtMTAzIDMwNiAtMTAzIDYyOCBxMCAyOTMgODAgNTY4IHE3OCAyNjkgMjI1LjUgNDk4LjUgcTE0Ny41IDIyOS41IDM1MC41IDQwMi41IFoiIC8+PGdseXBoIGdseXBoLW5hbWU9InVzZXItc3RhdHVzLWRuZCIgdW5pY29kZT0iJiN4ZWExMDsiIGQ9Ik0yNTAwIDUwMDAgcS00MDYgMCAtNzg4IC0xMjggcS0zNzAgLTEyNCAtNjg2IC0zNTYgcS0zMTMgLTIyOSAtNTQyIC01NDIgcS0yMzIgLTMxNiAtMzU2IC02ODYgcS0xMjggLTM4MiAtMTI4IC03ODggcTAgLTQwNiAxMjggLTc4OCBxMTI0IC0zNzAgMzU2IC02ODYgcTIyOSAtMzEzIDU0MiAtNTQyIHEzMTYgLTIzMiA2ODYgLTM1NiBxMzgyIC0xMjggNzg4IC0xMjggcTQwNiAwIDc4OCAxMjggcTM3MCAxMjQgNjg2IDM1NiBxMzEzIDIyOSA1NDIgNTQyIHEyMzIgMzE2IDM1NiA2ODYgcTEyOCAzODIgMTI4IDc4OCBxMCA0MDYgLTEyOCA3ODggcS0xMjQgMzcwIC0zNTYgNjg2IHEtMjI5IDMxMyAtNTQyIDU0MiBxLTMxNiAyMzIgLTY4NiAzNTYgcS0zODIgMTI4IC03ODggMTI4IFpNMTU2MyAyOTY5IGwxODc1IDAgcTkxIDAgMTc4IC0zOCBxODQgLTM3IDE1MCAtMTAzIHE2NiAtNjYgMTAyIC0xNDkgcTM4IC04NyAzOCAtMTc5IHEwIC05MiAtMzggLTE3OSBxLTM2IC04MyAtMTAyIC0xNDkgcS02NiAtNjYgLTE1MCAtMTAzIHEtODcgLTM4IC0xNzggLTM4IGwtMTg3NSAwIHEtOTIgMCAtMTc5IDM4IHEtODQgMzcgLTE1MCAxMDMgcS02NiA2NiAtMTAyIDE0OSBxLTM4IDg3IC0zOCAxNzkgcTAgOTIgMzggMTc5IHEzNiA4MyAxMDIgMTQ5IHE2NiA2NiAxNTAgMTAzIHE4NyAzOCAxNzkgMzggWiIgLz48Z2x5cGggZ2x5cGgtbmFtZT0idXNlci1zdGF0dXMtaW52aXNpYmxlIiB1bmljb2RlPSImI3hlYTExOyIgZD0iTTI1MDAgNTAwMCBxLTQwNiAwIC03ODggLTEyOCBxLTM3MCAtMTI0IC02ODYgLTM1NiBxLTMxMyAtMjI5IC01NDIgLTU0MiBxLTIzMiAtMzE2IC0zNTYgLTY4NiBxLTEyOCAtMzgyIC0xMjggLTc4OCBxMCAtNDA2IDEyOCAtNzg4IHExMjQgLTM3MCAzNTYgLTY4NiBxMjI5IC0zMTMgNTQyIC01NDIgcTMxNiAtMjMyIDY4NiAtMzU2IHEzODIgLTEyOCA3ODggLTEyOCBxNDA2IDAgNzg4IDEyOCBxMzcwIDEyNCA2ODYgMzU2IHEzMTMgMjI5IDU0MiA1NDIgcTIzMiAzMTYgMzU2IDY4NiBxMTI4IDM4MiAxMjggNzg4IHEwIDQwNiAtMTI4IDc4OCBxLTEyNCAzNzAgLTM1NiA2ODYgcS0yMjkgMzEzIC01NDIgNTQyIHEtMzE2IDIzMiAtNjg2IDM1NiBxLTM4MiAxMjggLTc4OCAxMjggWk0yNTAwIDQwMDAgcTMxMSAwIDU5MCAtMTE2IHEyNzEgLTExMiA0NzYuNSAtMzE3LjUgcTIwNS41IC0yMDUuNSAzMTcuNSAtNDc2LjUgcTExNiAtMjc5IDExNiAtNTkwIHEwIC0zMTEgLTExNiAtNTkwIHEtMTEyIC0yNzEgLTMxNy41IC00NzYuNSBxLTIwNS41IC0yMDUuNSAtNDc2LjUgLTMxNy41IHEtMjc5IC0xMTYgLTU5MCAtMTE2IHEtMzExIDAgLTU5MCAxMTYgcS0yNzEgMTEyIC00NzYuNSAzMTcuNSBxLTIwNS41IDIwNS41IC0zMTcuNSA0NzYuNSBxLTExNiAyNzkgLTExNiA1OTAgcTAgMzExIDExNiA1OTAgcTExMiAyNzEgMzE3LjUgNDc2LjUgcTIwNS41IDIwNS41IDQ3Ni41IDMxNy41IHEyNzkgMTE2IDU5MCAxMTYgWiIgLz48Z2x5cGggZ2x5cGgtbmFtZT0idXNlci1zdGF0dXMtb25saW5lIiB1bmljb2RlPSImI3hlYTEyOyIgZD0iTTE1MDAgMTUwMCBsMjAwMCAwIGwwIDIwMDAgbC0yMDAwIDAgbDAgLTIwMDAgWk0yNTAwIDUwMDAgcS00MDYgMCAtNzg4IC0xMjggcS0zNzAgLTEyNCAtNjg2IC0zNTYgcS0zMTMgLTIyOSAtNTQyIC01NDIgcS0yMzIgLTMxNiAtMzU2IC02ODYgcS0xMjggLTM4MiAtMTI4IC03ODggcTAgLTQwNiAxMjggLTc4OCBxMTI0IC0zNzAgMzU2IC02ODYgcTIyOSAtMzEzIDU0MiAtNTQyIHEzMTYgLTIzMiA2ODYgLTM1NiBxMzgyIC0xMjggNzg4IC0xMjggcTQwNiAwIDc4OCAxMjggcTM3MCAxMjQgNjg2IDM1NiBxMzEzIDIyOSA1NDIgNTQyIHEyMzIgMzE2IDM1NiA2ODYgcTEyOCAzODIgMTI4IDc4OCBxMCA0MDYgLTEyOCA3ODggcS0xMjQgMzcwIC0zNTYgNjg2IHEtMjI5IDMxMyAtNTQyIDU0MiBxLTMxNiAyMzIgLTY4NiAzNTYgcS0zODIgMTI4IC03ODggMTI4IFoiIC8+PC9mb250PjwvZGVmcz48L3N2Zz4="},function(e,s){e.exports=__webpack_require__(/*! core-js/modules/es.regexp.exec */ "./node_modules/core-js/modules/es.regexp.exec.js")},,function(e,s,t){"use strict";t(3),t(21),t(12),t(31);s.a=function(e){return Math.random().toString(36).replace(/[^a-z]+/g,"").substr(0,e||5)}},function(e,s){},function(e,s){e.exports=__webpack_require__(/*! core-js/modules/es.symbol */ "./node_modules/core-js/modules/es.symbol.js")},function(e,s){e.exports=__webpack_require__(/*! core-js/modules/es.array.concat */ "./node_modules/core-js/modules/es.array.concat.js")},function(e,s){e.exports=__webpack_require__(/*! @nextcloud/l10n/dist/gettext */ "./node_modules/@nextcloud/l10n/dist/gettext.js")},,,,function(e,s){e.exports=__webpack_require__(/*! core-js/modules/es.string.replace */ "./node_modules/core-js/modules/es.string.replace.js")},,,function(e,s,t){"use strict";t.r(s);var o={name:"Popover",components:{VPopover:t(4).VPopover}},n=(t(64),t(0)),r=t(24),c=t.n(r),i=Object(n.a)(o,(function(){var e=this.$createElement,s=this._self._c||e;return s("VPopover",this._g(this._b({attrs:{"popover-base-class":"popover","popover-wrapper-class":"popover__wrapper","popover-arrow-class":"popover__arrow","popover-inner-class":"popover__inner"}},"VPopover",this.$attrs,!1),this.$listeners),[this._t("trigger"),this._v(" "),s("template",{slot:"popover"},[this._t("default")],2)],2)}),[],!1,null,null,null);"function"==typeof c.a&&c()(i);var m=i.exports;
/**
 * @copyright Copyright (c) 2019 Marco Ambrosini <marcoambrosini@pm.me>
 *
 * @author Marco Ambrosini <marcoambrosini@pm.me>
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
 */s.default=m},,function(e,s){e.exports=__webpack_require__(/*! core-js/modules/es.symbol.description */ "./node_modules/core-js/modules/es.symbol.description.js")},function(e,s,t){var o=t(85);"string"==typeof o&&(o=[[e.i,o,""]]),o.locals&&(e.exports=o.locals);(0,t(2).default)("7d4b1d60",o,!0,{})},,function(e,s){e.exports=__webpack_require__(/*! core-js/modules/es.array.slice */ "./node_modules/core-js/modules/es.array.slice.js")},,,,function(e,s,t){"use strict";t(26),t(14),t(82),t(7);var o=t(5),n=t.n(o);s.a=function(e,s,t){if(void 0!==e)for(var o=e.length-1;o>=0;o--){var r=e[o],c=!r.componentOptions&&r.tag&&-1===s.indexOf(r.tag),i=!!r.componentOptions&&"string"==typeof r.componentOptions.tag,m=i&&-1===s.indexOf(r.componentOptions.tag);(c||!i||m)&&((c||m)&&n.a.util.warn("".concat(c?r.tag:r.componentOptions.tag," is not allowed inside the ").concat(t.$options.name," component"),t),e.splice(o,1))}}},function(e,s){e.exports=__webpack_require__(/*! core-js/modules/es.symbol.iterator */ "./node_modules/core-js/modules/es.symbol.iterator.js")},,,,function(e,s){e.exports=__webpack_require__(/*! core-js/modules/es.array.filter */ "./node_modules/core-js/modules/es.array.filter.js")},function(e,s){e.exports=__webpack_require__(/*! core-js/modules/es.array.from */ "./node_modules/core-js/modules/es.array.from.js")},,,function(e,s){},,function(e,s,t){"use strict";t.r(s);var o=t(59);
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
 */s.default=o.a},function(e,s,t){var o=t(56);"string"==typeof o&&(o=[[e.i,o,""]]),o.locals&&(e.exports=o.locals);(0,t(2).default)("941c791e",o,!0,{})},function(e,s,t){(s=t(1)(!1)).push([e.i,".vue-tooltip[data-v-19787a9]{position:absolute;z-index:100000;right:auto;left:auto;display:block;margin:0;margin-top:-3px;padding:10px 0;text-align:left;text-align:start;opacity:0;line-height:1.6;line-break:auto;filter:drop-shadow(0 1px 10px var(--color-box-shadow))}.vue-tooltip[data-v-19787a9][x-placement^='top'] .tooltip-arrow{bottom:0;margin-top:0;margin-bottom:0;border-width:10px 10px 0 10px;border-right-color:transparent;border-bottom-color:transparent;border-left-color:transparent}.vue-tooltip[data-v-19787a9][x-placement^='bottom'] .tooltip-arrow{top:0;margin-top:0;margin-bottom:0;border-width:0 10px 10px 10px;border-top-color:transparent;border-right-color:transparent;border-left-color:transparent}.vue-tooltip[data-v-19787a9][x-placement^='right'] .tooltip-arrow{right:100%;margin-right:0;margin-left:0;border-width:10px 10px 10px 0;border-top-color:transparent;border-bottom-color:transparent;border-left-color:transparent}.vue-tooltip[data-v-19787a9][x-placement^='left'] .tooltip-arrow{left:100%;margin-right:0;margin-left:0;border-width:10px 0 10px 10px;border-top-color:transparent;border-right-color:transparent;border-bottom-color:transparent}.vue-tooltip[data-v-19787a9][aria-hidden='true']{visibility:hidden;transition:opacity .15s, visibility .15s;opacity:0}.vue-tooltip[data-v-19787a9][aria-hidden='false']{visibility:visible;transition:opacity .15s;opacity:1}.vue-tooltip[data-v-19787a9] .tooltip-inner{max-width:350px;padding:5px 8px;text-align:center;color:var(--color-main-text);border-radius:var(--border-radius);background-color:var(--color-main-background)}.vue-tooltip[data-v-19787a9] .tooltip-arrow{position:absolute;z-index:1;width:0;height:0;margin:0;border-style:solid;border-color:var(--color-main-background)}\n",""]),e.exports=s},,,function(e,s,t){"use strict";t(25),t(36),t(44),t(26),t(48),t(49),t(14),t(8),t(39),t(7),t(3),t(12),t(9),t(10);var o=t(15),n=t(23),r=t(43),c=t(6),i=t(34);function m(e){return function(e){if(Array.isArray(e))return A(e)}(e)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||function(e,s){if(!e)return;if("string"==typeof e)return A(e,s);var t=Object.prototype.toString.call(e).slice(8,-1);"Object"===t&&e.constructor&&(t=e.constructor.name);if("Map"===t||"Set"===t)return Array.from(e);if("Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))return A(e,s)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function A(e,s){(null==s||s>e.length)&&(s=e.length);for(var t=0,o=new Array(s);t<s;t++)o[t]=e[t];return o}var a=["ActionButton","ActionCheckbox","ActionInput","ActionLink","ActionRadio","ActionRouter","ActionSeparator","ActionText","ActionTextEditable"],l={name:"Actions",directives:{tooltip:o.default},components:{Popover:i.default},props:{open:{type:Boolean,default:!1},forceMenu:{type:Boolean,default:!1},menuTitle:{type:String,default:null},primary:{type:Boolean,default:!1},defaultIcon:{type:String,default:"action-item__menutoggle--default-icon"},ariaLabel:{type:String,default:Object(c.b)("Actions")},placement:{type:String,default:"bottom"},boundariesElement:{type:Element,default:function(){return document.querySelector("body")}},container:{type:String,default:"body"}},data:function(){return{actions:[],opened:this.open,focusIndex:0,randomId:"menu-"+Object(n.a)(),children:this.$children}},computed:{hasMultipleActions:function(){return this.actions.length>1},isValidSingleAction:function(){return 1===this.actions.length&&null!==this.firstActionElement},firstActionVNode:function(){return this.actions[0]},firstAction:function(){return this.children[0]?this.children[0]:{}},firstActionBinding:function(){if(this.firstActionVNode&&this.firstActionVNode.componentOptions){var e=this.firstActionVNode.componentOptions.tag;if("ActionLink"===e)return{is:"a",href:this.firstAction.href,target:this.firstAction.target,"aria-label":this.firstAction.ariaLabel};if("ActionRouter"===e)return{is:"router-link",to:this.firstAction.to,exact:this.firstAction.exact,"aria-label":this.firstAction.ariaLabel};if("ActionButton"===e)return{is:"button","aria-label":this.firstAction.ariaLabel}}return null},firstActionEvent:function(){return this.firstActionVNode&&this.firstActionVNode.componentOptions&&this.firstActionVNode.componentOptions.listeners&&this.firstActionVNode.componentOptions.listeners.click},firstActionEventBinding:function(){return this.firstActionEvent?"click":null},firstActionClass:function(){var e=this.firstActionVNode&&this.firstActionVNode.data.staticClass,s=this.firstActionVNode&&this.firstActionVNode.data.class;return"".concat(e," ").concat(s)}},watch:{open:function(e){e!==this.opened&&(this.opened=e)}},beforeMount:function(){this.initActions(),Object(r.a)(this.$slots.default,a,this)},beforeUpdate:function(){this.initActions(),Object(r.a)(this.$slots.default,a,this)},methods:{openMenu:function(e){this.opened||(this.opened=!0,this.$emit("update:open",!0),this.$emit("open"),this.onOpen(e))},closeMenu:function(e){this.opened&&(this.opened=!1,this.$emit("update:open",!1),this.$emit("close"),this.opened=!1,this.focusIndex=0,this.$refs.menuButton.focus())},onOpen:function(e){var s=this;this.$nextTick((function(){s.focusFirstAction(e)}))},onMouseFocusAction:function(e){if(document.activeElement!==e.target){var s=e.target.closest("li");if(s){var t=s.querySelector(".focusable");if(t){var o=m(this.$refs.menu.querySelectorAll(".focusable")).indexOf(t);o>-1&&(this.focusIndex=o,this.focusAction())}}}},removeCurrentActive:function(){var e=this.$refs.menu.querySelector("li.active");e&&e.classList.remove("active")},focusAction:function(){var e=this.$refs.menu.querySelectorAll(".focusable")[this.focusIndex];if(e){this.removeCurrentActive();var s=e.closest("li.action");e.focus(),s&&s.classList.add("active")}},focusPreviousAction:function(e){this.opened&&(0===this.focusIndex?this.closeMenu():(this.preventIfEvent(e),this.focusIndex=this.focusIndex-1),this.focusAction())},focusNextAction:function(e){if(this.opened){var s=this.$refs.menu.querySelectorAll(".focusable").length-1;this.focusIndex===s?this.closeMenu():(this.preventIfEvent(e),this.focusIndex=this.focusIndex+1),this.focusAction()}},focusFirstAction:function(e){this.opened&&(this.preventIfEvent(e),this.focusIndex=0,this.focusAction())},focusLastAction:function(e){this.opened&&(this.preventIfEvent(e),this.focusIndex=this.$el.querySelectorAll(".focusable").length-1,this.focusAction())},preventIfEvent:function(e){e&&(e.preventDefault(),e.stopPropagation())},execFirstAction:function(e){this.firstActionEvent&&this.firstActionEvent(e)},initActions:function(){this.actions=(this.$slots.default||[]).filter((function(e){return!!e&&!!e.componentOptions}))}}},g=(t(84),t(0)),u=t(52),d=t.n(u),p=Object(g.a)(l,(function(){var e,s=this,t=s.$createElement,o=s._self._c||t;return s.isValidSingleAction&&!s.forceMenu?o("element",s._b({directives:[{name:"tooltip",rawName:"v-tooltip.auto",value:s.firstAction.text,expression:"firstAction.text",modifiers:{auto:!0}}],staticClass:"action-item action-item--single",class:[s.firstAction.icon,s.firstActionClass],attrs:{rel:"noreferrer noopener"},on:s._d({},[s.firstActionEventBinding,s.execFirstAction])},"element",s.firstActionBinding,!1),[o("span",{attrs:{"aria-hidden":!0,hidden:""}},[s._t("default")],2)]):o("div",{directives:[{name:"show",rawName:"v-show",value:s.hasMultipleActions||s.forceMenu,expression:"hasMultipleActions || forceMenu"}],staticClass:"action-item",class:{"action-item--open":s.opened}},[o("Popover",{attrs:{delay:0,"handle-resize":!0,open:s.opened,placement:s.placement,"boundaries-element":s.boundariesElement,container:s.container},on:{"update:open":function(e){s.opened=e},show:s.openMenu,"apply-show":s.onOpen,hide:s.closeMenu}},[o("button",{ref:"menuButton",staticClass:"icon action-item__menutoggle",class:(e={},e[s.defaultIcon]=!0,e["action-item__menutoggle--with-title"]=s.menuTitle,e["action-item__menutoggle--primary"]=s.primary,e),attrs:{slot:"trigger","aria-label":s.ariaLabel,"aria-haspopup":"true","aria-controls":s.randomId,"aria-expanded":s.opened},slot:"trigger"},[s._v("\n\t\t\t"+s._s(s.menuTitle)+"\n\t\t")]),s._v(" "),o("div",{directives:[{name:"show",rawName:"v-show",value:s.opened,expression:"opened"}],ref:"menu",class:{open:s.opened},attrs:{tabindex:"-1"},on:{keydown:[function(e){return!e.type.indexOf("key")&&s._k(e.keyCode,"up",38,e.key,["Up","ArrowUp"])||e.ctrlKey||e.shiftKey||e.altKey||e.metaKey?null:s.focusPreviousAction(e)},function(e){return!e.type.indexOf("key")&&s._k(e.keyCode,"down",40,e.key,["Down","ArrowDown"])||e.ctrlKey||e.shiftKey||e.altKey||e.metaKey?null:s.focusNextAction(e)},function(e){return!e.type.indexOf("key")&&s._k(e.keyCode,"tab",9,e.key,"Tab")||e.ctrlKey||e.shiftKey||e.altKey||e.metaKey?null:s.focusNextAction(e)},function(e){return!e.type.indexOf("key")&&s._k(e.keyCode,"tab",9,e.key,"Tab")?null:e.shiftKey?e.ctrlKey||e.altKey||e.metaKey?null:s.focusPreviousAction(e):null},function(e){return!e.type.indexOf("key")&&s._k(e.keyCode,"page-up",void 0,e.key,void 0)||e.ctrlKey||e.shiftKey||e.altKey||e.metaKey?null:s.focusFirstAction(e)},function(e){return!e.type.indexOf("key")&&s._k(e.keyCode,"page-down",void 0,e.key,void 0)||e.ctrlKey||e.shiftKey||e.altKey||e.metaKey?null:s.focusLastAction(e)},function(e){return!e.type.indexOf("key")&&s._k(e.keyCode,"esc",27,e.key,["Esc","Escape"])||e.ctrlKey||e.shiftKey||e.altKey||e.metaKey?null:(e.preventDefault(),s.closeMenu(e))}],mousemove:s.onMouseFocusAction}},[o("ul",{attrs:{id:s.randomId,tabindex:"-1"}},[s.opened?[s._t("default")]:s._e()],2)])])],1)}),[],!1,null,"69f4d5ed",null);"function"==typeof d.a&&d()(p);s.a=p.exports},,,,,function(e,s,t){"use strict";var o=t(13);t.n(o).a},function(e,s,t){(s=t(1)(!1)).push([e.i,".popover{z-index:100000;display:block !important;filter:drop-shadow(0 1px 10px var(--color-box-shadow))}.popover__inner{padding:0;color:var(--color-main-text);border-radius:var(--border-radius);background:var(--color-main-background)}.popover__arrow{position:absolute;z-index:1;width:0;height:0;margin:10px;border-style:solid;border-color:var(--color-main-background)}.popover[x-placement^='top']{margin-bottom:10px}.popover[x-placement^='top'] .popover__arrow{bottom:-10px;left:calc(50% - $arrow-width);margin-top:0;margin-bottom:0;border-width:10px 10px 0 10px;border-right-color:transparent !important;border-bottom-color:transparent !important;border-left-color:transparent !important}.popover[x-placement^='bottom']{margin-top:10px}.popover[x-placement^='bottom'] .popover__arrow{top:-10px;left:calc(50% - $arrow-width);margin-top:0;margin-bottom:0;border-width:0 10px 10px 10px;border-top-color:transparent !important;border-right-color:transparent !important;border-left-color:transparent !important}.popover[x-placement^='right']{margin-left:10px}.popover[x-placement^='right'] .popover__arrow{top:calc(50% - $arrow-width);left:-10px;margin-right:0;margin-left:0;border-width:10px 10px 10px 0;border-top-color:transparent !important;border-bottom-color:transparent !important;border-left-color:transparent !important}.popover[x-placement^='left']{margin-right:10px}.popover[x-placement^='left'] .popover__arrow{top:calc(50% - $arrow-width);right:-10px;margin-right:0;margin-left:0;border-width:10px 0 10px 10px;border-top-color:transparent !important;border-right-color:transparent !important;border-bottom-color:transparent !important}.popover[aria-hidden='true']{visibility:hidden;transition:opacity var(--animation-quick),visibility var(--animation-quick);opacity:0}.popover[aria-hidden='false']{visibility:visible;transition:opacity var(--animation-quick);opacity:1}\n",""]),e.exports=s},,,,,,,,,,,,,,,,,function(e,s){e.exports=__webpack_require__(/*! core-js/modules/es.array.splice */ "./node_modules/core-js/modules/es.array.splice.js")},,function(e,s,t){"use strict";var o=t(37);t.n(o).a},function(e,s,t){var o=t(1),n=t(16),r=t(17),c=t(18),i=t(19),m=t(20);s=o(!1);var A=n(r),a=n(c),l=n(i),g=n(m);s.push([e.i,'@font-face{font-family:"iconfont-vue-19787a9";src:url('+A+");src:url("+A+') format("embedded-opentype"),url('+a+') format("woff"),url('+l+') format("truetype"),url('+g+') format("svg")}.icon[data-v-69f4d5ed]{font-style:normal;font-weight:400}.icon.arrow-left-double[data-v-69f4d5ed]:before{font-family:"iconfont-vue-19787a9";content:""}.icon.arrow-left[data-v-69f4d5ed]:before{font-family:"iconfont-vue-19787a9";content:""}.icon.arrow-right-double[data-v-69f4d5ed]:before{font-family:"iconfont-vue-19787a9";content:""}.icon.arrow-right[data-v-69f4d5ed]:before{font-family:"iconfont-vue-19787a9";content:""}.icon.breadcrumb[data-v-69f4d5ed]:before{font-family:"iconfont-vue-19787a9";content:""}.icon.checkmark[data-v-69f4d5ed]:before{font-family:"iconfont-vue-19787a9";content:""}.icon.close[data-v-69f4d5ed]:before{font-family:"iconfont-vue-19787a9";content:""}.icon.confirm[data-v-69f4d5ed]:before{font-family:"iconfont-vue-19787a9";content:""}.icon.info[data-v-69f4d5ed]:before{font-family:"iconfont-vue-19787a9";content:""}.icon.menu[data-v-69f4d5ed]:before{font-family:"iconfont-vue-19787a9";content:""}.icon.more[data-v-69f4d5ed]:before{font-family:"iconfont-vue-19787a9";content:""}.icon.pause[data-v-69f4d5ed]:before{font-family:"iconfont-vue-19787a9";content:""}.icon.play[data-v-69f4d5ed]:before{font-family:"iconfont-vue-19787a9";content:""}.icon.triangle-s[data-v-69f4d5ed]:before{font-family:"iconfont-vue-19787a9";content:""}.icon.user-status-away[data-v-69f4d5ed]:before{font-family:"iconfont-vue-19787a9";content:""}.icon.user-status-dnd[data-v-69f4d5ed]:before{font-family:"iconfont-vue-19787a9";content:""}.icon.user-status-invisible[data-v-69f4d5ed]:before{font-family:"iconfont-vue-19787a9";content:""}.icon.user-status-online[data-v-69f4d5ed]:before{font-family:"iconfont-vue-19787a9";content:""}.action-item[data-v-69f4d5ed]{position:relative;display:inline-block}.action-item--single[data-v-69f4d5ed]:hover,.action-item--single[data-v-69f4d5ed]:focus,.action-item--single[data-v-69f4d5ed]:active,.action-item__menutoggle[data-v-69f4d5ed]:hover,.action-item__menutoggle[data-v-69f4d5ed]:focus,.action-item__menutoggle[data-v-69f4d5ed]:active{opacity:1;background-color:rgba(127,127,127,0.25)}.action-item.action-item--open .action-item__menutoggle[data-v-69f4d5ed]{opacity:1;background-color:rgba(127,127,127,0.25)}.action-item--single[data-v-69f4d5ed],.action-item__menutoggle[data-v-69f4d5ed]{box-sizing:border-box;width:auto;min-width:44px;height:44px;margin:0;padding:14px;cursor:pointer;border:none;border-radius:22px;background-color:transparent}.action-item__menutoggle[data-v-69f4d5ed]{display:flex;align-items:center;justify-content:center;opacity:.7;font-weight:bold;line-height:16px}.action-item__menutoggle[data-v-69f4d5ed]:before{content:\'\'}.action-item__menutoggle--default-icon[data-v-69f4d5ed]:before{font-family:"iconfont-vue-19787a9";font-style:normal;font-weight:400;content:""}.action-item__menutoggle--default-icon[data-v-69f4d5ed]::before{font-size:16px}.action-item__menutoggle--with-title[data-v-69f4d5ed]{position:relative;padding-left:44px;white-space:nowrap;opacity:1;border:1px solid var(--color-border-dark);background-color:var(--color-background-dark);background-position:14px center;font-size:inherit}.action-item__menutoggle--with-title[data-v-69f4d5ed]:before{position:absolute;top:14px;left:14px}.action-item__menutoggle--primary[data-v-69f4d5ed]{opacity:1;color:var(--color-primary-text);border:none;background-color:var(--color-primary-element)}.action-item--open .action-item__menutoggle--primary[data-v-69f4d5ed],.action-item__menutoggle--primary[data-v-69f4d5ed]:hover,.action-item__menutoggle--primary[data-v-69f4d5ed]:focus,.action-item__menutoggle--primary[data-v-69f4d5ed]:active{color:var(--color-primary-text) !important;background-color:var(--color-primary-element-light) !important}.action-item--single[data-v-69f4d5ed]{opacity:.7}.action-item--single[data-v-69f4d5ed]:hover,.action-item--single[data-v-69f4d5ed]:focus,.action-item--single[data-v-69f4d5ed]:active{opacity:1}.action-item--single>[hidden][data-v-69f4d5ed]{display:none}.ie .action-item__menu[data-v-69f4d5ed],.ie .action-item__menu .action-item__menu_arrow[data-v-69f4d5ed],.edge .action-item__menu[data-v-69f4d5ed],.edge .action-item__menu .action-item__menu_arrow[data-v-69f4d5ed]{border:1px solid var(--color-border)}\n',""]),e.exports=s}])}));
//# sourceMappingURL=Actions.js.map

/***/ }),

/***/ "./node_modules/vue-virtual-grid/dist/virtual-grid.common.js":
/*!*******************************************************************!*\
  !*** ./node_modules/vue-virtual-grid/dist/virtual-grid.common.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "fb15");
/******/ })
/************************************************************************/
/******/ ({

/***/ "24fb":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (useSourceMap) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item, useSourceMap);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join('');
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === 'string') {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, '']];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

function cssWithMappingToString(item, useSourceMap) {
  var content = item[1] || ''; // eslint-disable-next-line prefer-destructuring

  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (useSourceMap && typeof btoa === 'function') {
    var sourceMapping = toComment(cssMapping);
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || '').concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
  }

  return [content].join('\n');
} // Adapted from convert-source-map (MIT)


function toComment(sourceMap) {
  // eslint-disable-next-line no-undef
  var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
  var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
  return "/*# ".concat(data, " */");
}

/***/ }),

/***/ "4117":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VirtualGrid_vue_vue_type_style_index_0_id_8e6a98ac_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("9cbf");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VirtualGrid_vue_vue_type_style_index_0_id_8e6a98ac_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VirtualGrid_vue_vue_type_style_index_0_id_8e6a98ac_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VirtualGrid_vue_vue_type_style_index_0_id_8e6a98ac_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "499e":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "default", function() { return /* binding */ addStylesClient; });

// CONCATENATED MODULE: ./node_modules/vue-style-loader/lib/listToStyles.js
/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}

// CONCATENATED MODULE: ./node_modules/vue-style-loader/lib/addStylesClient.js
/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/



var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}
var options = null
var ssrIdKey = 'data-vue-ssr-id'

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

function addStylesClient (parentId, list, _isProduction, _options) {
  isProduction = _isProduction

  options = _options || {}

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }
  if (options.ssrId) {
    styleElement.setAttribute(ssrIdKey, obj.id)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),

/***/ "8875":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// addapted from the document.currentScript polyfill by Adam Miller
// MIT license
// source: https://github.com/amiller-gh/currentScript-polyfill

// added support for Firefox https://bugzilla.mozilla.org/show_bug.cgi?id=1620505

(function (root, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
}(typeof self !== 'undefined' ? self : this, function () {
  function getCurrentScript () {
    var descriptor = Object.getOwnPropertyDescriptor(document, 'currentScript')
    // for chrome
    if (!descriptor && 'currentScript' in document && document.currentScript) {
      return document.currentScript
    }

    // for other browsers with native support for currentScript
    if (descriptor && descriptor.get !== getCurrentScript && document.currentScript) {
      return document.currentScript
    }
  
    // IE 8-10 support script readyState
    // IE 11+ & Firefox support stack trace
    try {
      throw new Error();
    }
    catch (err) {
      // Find the second match for the "at" string to get file src url from stack.
      var ieStackRegExp = /.*at [^(]*\((.*):(.+):(.+)\)$/ig,
        ffStackRegExp = /@([^@]*):(\d+):(\d+)\s*$/ig,
        stackDetails = ieStackRegExp.exec(err.stack) || ffStackRegExp.exec(err.stack),
        scriptLocation = (stackDetails && stackDetails[1]) || false,
        line = (stackDetails && stackDetails[2]) || false,
        currentLocation = document.location.href.replace(document.location.hash, ''),
        pageSource,
        inlineScriptSourceRegExp,
        inlineScriptSource,
        scripts = document.getElementsByTagName('script'); // Live NodeList collection
  
      if (scriptLocation === currentLocation) {
        pageSource = document.documentElement.outerHTML;
        inlineScriptSourceRegExp = new RegExp('(?:[^\\n]+?\\n){0,' + (line - 2) + '}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*', 'i');
        inlineScriptSource = pageSource.replace(inlineScriptSourceRegExp, '$1').trim();
      }
  
      for (var i = 0; i < scripts.length; i++) {
        // If ready state is interactive, return the script tag
        if (scripts[i].readyState === 'interactive') {
          return scripts[i];
        }
  
        // If src matches, return the script tag
        if (scripts[i].src === scriptLocation) {
          return scripts[i];
        }
  
        // If inline source matches, return the script tag
        if (
          scriptLocation === currentLocation &&
          scripts[i].innerHTML &&
          scripts[i].innerHTML.trim() === inlineScriptSource
        ) {
          return scripts[i];
        }
      }
  
      // If no match, return null
      return null;
    }
  };

  return getCurrentScript
}));


/***/ }),

/***/ "88c2":
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".grid[data-v-8e6a98ac]{display:grid;align-items:center}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "8bbf":
/***/ (function(module, exports) {

module.exports = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm.js");

/***/ }),

/***/ "9cbf":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("88c2");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__("499e").default
var update = add("8a458e06", content, true, {"sourceMap":false,"shadowMode":false});

/***/ }),

/***/ "fb15":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  var currentScript = window.document.currentScript
  if (true) {
    var getCurrentScript = __webpack_require__("8875")
    currentScript = getCurrentScript()

    // for backward compatibility, because previously we directly included the polyfill
    if (!('currentScript' in document)) {
      Object.defineProperty(document, 'currentScript', { get: getCurrentScript })
    }
  }

  var src = currentScript && currentScript.src.match(/(.+\/)[^/]+\.js(\?.*)?$/)
  if (src) {
    __webpack_require__.p = src[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ var setPublicPath = (null);

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"38de3646-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/VirtualGrid.vue?vue&type=template&id=8e6a98ac&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{ref:"virtualGrid",style:({
        boxSizing: 'border-box',
        height: ((_vm.layoutData.totalHeight) + "px"),
        paddingTop: ("" + (_vm.renderData !== null && _vm.renderData.firstRenderedRowOffset !== null
                ? _vm.renderData.firstRenderedRowOffset + 'px'
                : '0px')),
    })},[_c('div',{staticClass:"grid",style:({
            'grid-template-columns': ("repeat(" + (_vm.configData.columnCount) + ", 1fr)"),
            'gap': ((_vm.configData.gridGap) + "px"),
        })},_vm._l((_vm.renderData.cellsToRender),function(item){return _c('div',{key:item.id,style:({
                'height': item.height,
                'grid-column-start': item.columnNumber,
                'grid-column-end': item.columnNumber + item.columnSpan,
                'grid-row-start': _vm.getGridRowStart(item, _vm.renderData),
            })},[_c(item.renderComponent,{tag:"component",attrs:{"item":item}})],1)}),0),_c(_vm.loadingBatch && _vm.loader,{tag:"component"})],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/VirtualGrid.vue?vue&type=template&id=8e6a98ac&scoped=true&

// CONCATENATED MODULE: ./node_modules/tslib/tslib.es6.js
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __createBinding(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}

function __exportStar(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
}

function __classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
}

// EXTERNAL MODULE: external {"commonjs":"vue","commonjs2":"vue","root":"Vue"}
var external_commonjs_vue_commonjs2_vue_root_Vue_ = __webpack_require__("8bbf");
var external_commonjs_vue_commonjs2_vue_root_Vue_default = /*#__PURE__*/__webpack_require__.n(external_commonjs_vue_commonjs2_vue_root_Vue_);

// CONCATENATED MODULE: ./node_modules/vue-class-component/dist/vue-class-component.esm.js
/**
  * vue-class-component v7.2.6
  * (c) 2015-present Evan You
  * @license MIT
  */


function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

// The rational behind the verbose Reflect-feature check below is the fact that there are polyfills
// which add an implementation for Reflect.defineMetadata but not for Reflect.getOwnMetadataKeys.
// Without this check consumers will encounter hard to track down runtime errors.
function reflectionIsSupported() {
  return typeof Reflect !== 'undefined' && Reflect.defineMetadata && Reflect.getOwnMetadataKeys;
}
function copyReflectionMetadata(to, from) {
  forwardMetadata(to, from);
  Object.getOwnPropertyNames(from.prototype).forEach(function (key) {
    forwardMetadata(to.prototype, from.prototype, key);
  });
  Object.getOwnPropertyNames(from).forEach(function (key) {
    forwardMetadata(to, from, key);
  });
}

function forwardMetadata(to, from, propertyKey) {
  var metaKeys = propertyKey ? Reflect.getOwnMetadataKeys(from, propertyKey) : Reflect.getOwnMetadataKeys(from);
  metaKeys.forEach(function (metaKey) {
    var metadata = propertyKey ? Reflect.getOwnMetadata(metaKey, from, propertyKey) : Reflect.getOwnMetadata(metaKey, from);

    if (propertyKey) {
      Reflect.defineMetadata(metaKey, metadata, to, propertyKey);
    } else {
      Reflect.defineMetadata(metaKey, metadata, to);
    }
  });
}

var fakeArray = {
  __proto__: []
};
var hasProto = fakeArray instanceof Array;
function createDecorator(factory) {
  return function (target, key, index) {
    var Ctor = typeof target === 'function' ? target : target.constructor;

    if (!Ctor.__decorators__) {
      Ctor.__decorators__ = [];
    }

    if (typeof index !== 'number') {
      index = undefined;
    }

    Ctor.__decorators__.push(function (options) {
      return factory(options, key, index);
    });
  };
}
function mixins() {
  for (var _len = arguments.length, Ctors = new Array(_len), _key = 0; _key < _len; _key++) {
    Ctors[_key] = arguments[_key];
  }

  return external_commonjs_vue_commonjs2_vue_root_Vue_default.a.extend({
    mixins: Ctors
  });
}
function isPrimitive(value) {
  var type = _typeof(value);

  return value == null || type !== 'object' && type !== 'function';
}
function warn(message) {
  if (typeof console !== 'undefined') {
    console.warn('[vue-class-component] ' + message);
  }
}

function collectDataFromConstructor(vm, Component) {
  // override _init to prevent to init as Vue instance
  var originalInit = Component.prototype._init;

  Component.prototype._init = function () {
    var _this = this;

    // proxy to actual vm
    var keys = Object.getOwnPropertyNames(vm); // 2.2.0 compat (props are no longer exposed as self properties)

    if (vm.$options.props) {
      for (var key in vm.$options.props) {
        if (!vm.hasOwnProperty(key)) {
          keys.push(key);
        }
      }
    }

    keys.forEach(function (key) {
      Object.defineProperty(_this, key, {
        get: function get() {
          return vm[key];
        },
        set: function set(value) {
          vm[key] = value;
        },
        configurable: true
      });
    });
  }; // should be acquired class property values


  var data = new Component(); // restore original _init to avoid memory leak (#209)

  Component.prototype._init = originalInit; // create plain data object

  var plainData = {};
  Object.keys(data).forEach(function (key) {
    if (data[key] !== undefined) {
      plainData[key] = data[key];
    }
  });

  if (false) {}

  return plainData;
}

var $internalHooks = ['data', 'beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeDestroy', 'destroyed', 'beforeUpdate', 'updated', 'activated', 'deactivated', 'render', 'errorCaptured', 'serverPrefetch' // 2.6
];
function componentFactory(Component) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  options.name = options.name || Component._componentTag || Component.name; // prototype props.

  var proto = Component.prototype;
  Object.getOwnPropertyNames(proto).forEach(function (key) {
    if (key === 'constructor') {
      return;
    } // hooks


    if ($internalHooks.indexOf(key) > -1) {
      options[key] = proto[key];
      return;
    }

    var descriptor = Object.getOwnPropertyDescriptor(proto, key);

    if (descriptor.value !== void 0) {
      // methods
      if (typeof descriptor.value === 'function') {
        (options.methods || (options.methods = {}))[key] = descriptor.value;
      } else {
        // typescript decorated data
        (options.mixins || (options.mixins = [])).push({
          data: function data() {
            return _defineProperty({}, key, descriptor.value);
          }
        });
      }
    } else if (descriptor.get || descriptor.set) {
      // computed properties
      (options.computed || (options.computed = {}))[key] = {
        get: descriptor.get,
        set: descriptor.set
      };
    }
  });
  (options.mixins || (options.mixins = [])).push({
    data: function data() {
      return collectDataFromConstructor(this, Component);
    }
  }); // decorate options

  var decorators = Component.__decorators__;

  if (decorators) {
    decorators.forEach(function (fn) {
      return fn(options);
    });
    delete Component.__decorators__;
  } // find super


  var superProto = Object.getPrototypeOf(Component.prototype);
  var Super = superProto instanceof external_commonjs_vue_commonjs2_vue_root_Vue_default.a ? superProto.constructor : external_commonjs_vue_commonjs2_vue_root_Vue_default.a;
  var Extended = Super.extend(options);
  forwardStaticMembers(Extended, Component, Super);

  if (reflectionIsSupported()) {
    copyReflectionMetadata(Extended, Component);
  }

  return Extended;
}
var reservedPropertyNames = [// Unique id
'cid', // Super Vue constructor
'super', // Component options that will be used by the component
'options', 'superOptions', 'extendOptions', 'sealedOptions', // Private assets
'component', 'directive', 'filter'];
var shouldIgnore = {
  prototype: true,
  arguments: true,
  callee: true,
  caller: true
};

function forwardStaticMembers(Extended, Original, Super) {
  // We have to use getOwnPropertyNames since Babel registers methods as non-enumerable
  Object.getOwnPropertyNames(Original).forEach(function (key) {
    // Skip the properties that should not be overwritten
    if (shouldIgnore[key]) {
      return;
    } // Some browsers does not allow reconfigure built-in properties


    var extendedDescriptor = Object.getOwnPropertyDescriptor(Extended, key);

    if (extendedDescriptor && !extendedDescriptor.configurable) {
      return;
    }

    var descriptor = Object.getOwnPropertyDescriptor(Original, key); // If the user agent does not support `__proto__` or its family (IE <= 10),
    // the sub class properties may be inherited properties from the super class in TypeScript.
    // We need to exclude such properties to prevent to overwrite
    // the component options object which stored on the extended constructor (See #192).
    // If the value is a referenced value (object or function),
    // we can check equality of them and exclude it if they have the same reference.
    // If it is a primitive value, it will be forwarded for safety.

    if (!hasProto) {
      // Only `cid` is explicitly exluded from property forwarding
      // because we cannot detect whether it is a inherited property or not
      // on the no `__proto__` environment even though the property is reserved.
      if (key === 'cid') {
        return;
      }

      var superDescriptor = Object.getOwnPropertyDescriptor(Super, key);

      if (!isPrimitive(descriptor.value) && superDescriptor && superDescriptor.value === descriptor.value) {
        return;
      }
    } // Warn if the users manually declare reserved properties


    if (false) {}

    Object.defineProperty(Extended, key, descriptor);
  });
}

function vue_class_component_esm_Component(options) {
  if (typeof options === 'function') {
    return componentFactory(options);
  }

  return function (Component) {
    return componentFactory(Component, options);
  };
}

vue_class_component_esm_Component.registerHooks = function registerHooks(keys) {
  $internalHooks.push.apply($internalHooks, _toConsumableArray(keys));
};

/* harmony default export */ var vue_class_component_esm = (vue_class_component_esm_Component);


// CONCATENATED MODULE: ./node_modules/vue-property-decorator/lib/vue-property-decorator.js
/** vue-property-decorator verson 9.0.2 MIT LICENSE copyright 2020 kaorun343 */
/// <reference types='reflect-metadata'/>




/** Used for keying reactive provide/inject properties */
var reactiveInjectKey = '__reactiveInject__';
/**
 * decorator of an inject
 * @param from key
 * @return PropertyDecorator
 */
function Inject(options) {
    return createDecorator(function (componentOptions, key) {
        if (typeof componentOptions.inject === 'undefined') {
            componentOptions.inject = {};
        }
        if (!Array.isArray(componentOptions.inject)) {
            componentOptions.inject[key] = options || key;
        }
    });
}
/**
 * decorator of a reactive inject
 * @param from key
 * @return PropertyDecorator
 */
function InjectReactive(options) {
    return createDecorator(function (componentOptions, key) {
        if (typeof componentOptions.inject === 'undefined') {
            componentOptions.inject = {};
        }
        if (!Array.isArray(componentOptions.inject)) {
            var fromKey_1 = !!options ? options.from || options : key;
            var defaultVal_1 = (!!options && options.default) || undefined;
            if (!componentOptions.computed)
                componentOptions.computed = {};
            componentOptions.computed[key] = function () {
                var obj = this[reactiveInjectKey];
                return obj ? obj[fromKey_1] : defaultVal_1;
            };
            componentOptions.inject[reactiveInjectKey] = reactiveInjectKey;
        }
    });
}
function produceProvide(original) {
    var provide = function () {
        var _this = this;
        var rv = typeof original === 'function' ? original.call(this) : original;
        rv = Object.create(rv || null);
        // set reactive services (propagates previous services if necessary)
        rv[reactiveInjectKey] = Object.create(this[reactiveInjectKey] || {});
        for (var i in provide.managed) {
            rv[provide.managed[i]] = this[i];
        }
        var _loop_1 = function (i) {
            rv[provide.managedReactive[i]] = this_1[i]; // Duplicates the behavior of `@Provide`
            Object.defineProperty(rv[reactiveInjectKey], provide.managedReactive[i], {
                enumerable: true,
                get: function () { return _this[i]; },
            });
        };
        var this_1 = this;
        for (var i in provide.managedReactive) {
            _loop_1(i);
        }
        return rv;
    };
    provide.managed = {};
    provide.managedReactive = {};
    return provide;
}
function needToProduceProvide(original) {
    return (typeof original !== 'function' ||
        (!original.managed && !original.managedReactive));
}
function inheritInjected(componentOptions) {
    // inject parent reactive services (if any)
    if (!Array.isArray(componentOptions.inject)) {
        componentOptions.inject = componentOptions.inject || {};
        componentOptions.inject[reactiveInjectKey] = {
            from: reactiveInjectKey,
            default: {},
        };
    }
}
/**
 * decorator of a provide
 * @param key key
 * @return PropertyDecorator | void
 */
function Provide(key) {
    return createDecorator(function (componentOptions, k) {
        var provide = componentOptions.provide;
        inheritInjected(componentOptions);
        if (needToProduceProvide(provide)) {
            provide = componentOptions.provide = produceProvide(provide);
        }
        provide.managed[k] = key || k;
    });
}
/**
 * decorator of a reactive provide
 * @param key key
 * @return PropertyDecorator | void
 */
function ProvideReactive(key) {
    return createDecorator(function (componentOptions, k) {
        var provide = componentOptions.provide;
        inheritInjected(componentOptions);
        if (needToProduceProvide(provide)) {
            provide = componentOptions.provide = produceProvide(provide);
        }
        provide.managedReactive[k] = key || k;
    });
}
/** @see {@link https://github.com/vuejs/vue-class-component/blob/master/src/reflect.ts} */
var reflectMetadataIsSupported = typeof Reflect !== 'undefined' && typeof Reflect.getMetadata !== 'undefined';
function applyMetadata(options, target, key) {
    if (reflectMetadataIsSupported) {
        if (!Array.isArray(options) &&
            typeof options !== 'function' &&
            typeof options.type === 'undefined') {
            var type = Reflect.getMetadata('design:type', target, key);
            if (type !== Object) {
                options.type = type;
            }
        }
    }
}
/**
 * decorator of model
 * @param  event event name
 * @param options options
 * @return PropertyDecorator
 */
function Model(event, options) {
    if (options === void 0) { options = {}; }
    return function (target, key) {
        applyMetadata(options, target, key);
        createDecorator(function (componentOptions, k) {
            ;
            (componentOptions.props || (componentOptions.props = {}))[k] = options;
            componentOptions.model = { prop: k, event: event || k };
        })(target, key);
    };
}
/**
 * decorator of a prop
 * @param  options the options for the prop
 * @return PropertyDecorator | void
 */
function Prop(options) {
    if (options === void 0) { options = {}; }
    return function (target, key) {
        applyMetadata(options, target, key);
        createDecorator(function (componentOptions, k) {
            ;
            (componentOptions.props || (componentOptions.props = {}))[k] = options;
        })(target, key);
    };
}
/**
 * decorator of a synced prop
 * @param propName the name to interface with from outside, must be different from decorated property
 * @param options the options for the synced prop
 * @return PropertyDecorator | void
 */
function PropSync(propName, options) {
    if (options === void 0) { options = {}; }
    // @ts-ignore
    return function (target, key) {
        applyMetadata(options, target, key);
        createDecorator(function (componentOptions, k) {
            ;
            (componentOptions.props || (componentOptions.props = {}))[propName] = options;
            (componentOptions.computed || (componentOptions.computed = {}))[k] = {
                get: function () {
                    return this[propName];
                },
                set: function (value) {
                    // @ts-ignore
                    this.$emit("update:" + propName, value);
                },
            };
        })(target, key);
    };
}
/**
 * decorator of a watch function
 * @param  path the path or the expression to observe
 * @param  WatchOption
 * @return MethodDecorator
 */
function Watch(path, options) {
    if (options === void 0) { options = {}; }
    var _a = options.deep, deep = _a === void 0 ? false : _a, _b = options.immediate, immediate = _b === void 0 ? false : _b;
    return createDecorator(function (componentOptions, handler) {
        if (typeof componentOptions.watch !== 'object') {
            componentOptions.watch = Object.create(null);
        }
        var watch = componentOptions.watch;
        if (typeof watch[path] === 'object' && !Array.isArray(watch[path])) {
            watch[path] = [watch[path]];
        }
        else if (typeof watch[path] === 'undefined') {
            watch[path] = [];
        }
        watch[path].push({ handler: handler, deep: deep, immediate: immediate });
    });
}
// Code copied from Vue/src/shared/util.js
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = function (str) { return str.replace(hyphenateRE, '-$1').toLowerCase(); };
/**
 * decorator of an event-emitter function
 * @param  event The name of the event
 * @return MethodDecorator
 */
function Emit(event) {
    return function (_target, propertyKey, descriptor) {
        var key = hyphenate(propertyKey);
        var original = descriptor.value;
        descriptor.value = function emitter() {
            var _this = this;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var emit = function (returnValue) {
                var emitName = event || key;
                if (returnValue === undefined) {
                    if (args.length === 0) {
                        _this.$emit(emitName);
                    }
                    else if (args.length === 1) {
                        _this.$emit(emitName, args[0]);
                    }
                    else {
                        _this.$emit.apply(_this, [emitName].concat(args));
                    }
                }
                else {
                    args.unshift(returnValue);
                    _this.$emit.apply(_this, [emitName].concat(args));
                }
            };
            var returnValue = original.apply(this, args);
            if (isPromise(returnValue)) {
                returnValue.then(emit);
            }
            else {
                emit(returnValue);
            }
            return returnValue;
        };
    };
}
/**
 * decorator of a ref prop
 * @param refKey the ref key defined in template
 */
function Ref(refKey) {
    return createDecorator(function (options, key) {
        options.computed = options.computed || {};
        options.computed[key] = {
            cache: false,
            get: function () {
                return this.$refs[refKey || key];
            },
        };
    });
}
function isPromise(obj) {
    return obj instanceof Promise || (obj && typeof obj.then === 'function');
}

// CONCATENATED MODULE: ./src/utils.ts
const getGridGapDefault = (elementWidth, windowHeight) => {
    if (elementWidth > 720 && windowHeight > 480) {
        return 10;
    }
    else {
        return 5;
    }
};
const getColumnCountDefault = (elementWidth) => {
    return Math.floor(elementWidth / 250);
};
const getWindowMarginDefault = (windowHeight) => {
    return Math.round(windowHeight * 1.5);
};
const getItemRatioHeightDefault = (height, width, columnWidth) => {
    const imageRatio = height / width;
    return Math.round(columnWidth * imageRatio);
};
const debugLog = (condition, ...args) => {
    if (condition) {
        console.debug(...args);
    }
};

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/ts-loader??ref--13-2!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/VirtualGrid.vue?vue&type=script&lang=ts&
var VirtualGridvue_type_script_lang_ts_a, VirtualGridvue_type_script_lang_ts_b;



let VirtualGridvue_type_script_lang_ts_VirtualGrid = class VirtualGrid extends external_commonjs_vue_commonjs2_vue_root_Vue_default.a {
    constructor() {
        super(...arguments);
        this.updateLock = false;
        this.bottomReached = false;
        this.ref = null;
        this.containerData = {
            windowSize: { height: 0, width: 0 },
            windowScroll: { x: 0, y: 0 },
            elementWindowOffset: 0,
            elementSize: { height: 0, width: 0 },
        };
    }
    get loadingBatch() {
        return this.loader && this.updateLock;
    }
    get configData() {
        return this.computeConfigData(this.containerData, this.items);
    }
    get layoutData() {
        return this.computeLayoutData(this.configData);
    }
    get renderData() {
        return this.computeRenderData(this.configData, this.containerData, this.layoutData);
    }
    mounted() {
        window.addEventListener('resize', this.resize);
        window.addEventListener('scroll', this.scroll);
        this.initializeGridData();
    }
    beforeDestroy() {
        window.removeEventListener('resize', this.resize);
        window.removeEventListener('scroll', this.scroll);
    }
    resize() {
        this.computeContainerData();
    }
    scroll() {
        this.computeContainerData();
        this.loadMoreData(this.containerData)
            .catch((error) => {
            if (error) {
                console.error('Fail to load next data batch', error);
            }
        })
            .then();
    }
    initializeGridData() {
        this.ref = this.$refs.virtualGrid;
        this.computeContainerData();
    }
    async loadMoreData(containerData) {
        const windowTop = containerData.windowScroll.y;
        const windowBottom = windowTop + containerData.windowSize.height;
        const bottomTrigger = containerData.elementWindowOffset + containerData.elementSize.height - this.updateTriggerMargin;
        if (!this.bottomReached && windowBottom > bottomTrigger && !this.updateLock) {
            this.updateLock = true;
            debugLog(this.debug, 'Loading next batch');
            const isLastBatch = await this.updateFunction();
            if (isLastBatch) {
                debugLog(this.debug, 'Bottom reached');
                this.bottomReached = true;
            }
            this.updateLock = false;
        }
        return Promise.resolve();
    }
    computeContainerData() {
        if (this.ref === null) {
            return;
        }
        const windowSize = this.getWindowSize();
        const windowScroll = this.getWindowScroll();
        const elementWindowOffset = this.getElementOffset(this.ref);
        const elementSize = this.getElementSize(this.ref);
        this.containerData = { windowSize, windowScroll, elementWindowOffset, elementSize };
    }
    computeConfigData(containerData, items) {
        if (containerData === null || items === null) {
            return {
                windowMargin: 0,
                gridGap: 0,
                columnCount: 1,
                entries: [],
            };
        }
        const elementWidth = containerData.elementSize ? containerData.elementSize.width : null;
        const windowMargin = this.getWindowMargin(containerData.windowSize.height);
        const gridGap = this.getGridGap(elementWidth, containerData.windowSize.height);
        const columnCount = this.getColumnCount(elementWidth);
        const columnWidth = this.getColumnWidth(columnCount, gridGap, elementWidth);
        const entries = items.map((item) => {
            if (!item.width) {
                return item;
            }
            const imageWidth = columnWidth * item.columnSpan + gridGap * (item.columnSpan - 1);
            return {
                ...item,
                height: this.getItemRatioHeight(item.height, item.width, imageWidth),
                width: imageWidth,
            };
        });
        return {
            windowMargin,
            gridGap,
            columnCount,
            entries,
        };
    }
    computeLayoutData(configData) {
        if (configData === null) {
            return { cells: [], totalHeight: 0 };
        }
        let currentRowNumber = 1;
        let prevRowsTotalHeight = 0;
        let currentRowMaxHeight = 0;
        let columnShift = 0;
        const cells = configData.entries.map((entry, index) => {
            const { columnCount, gridGap } = configData;
            let columnSpanRecompute = entry.columnSpan;
            let heightRecompute = entry.height;
            if (columnSpanRecompute < 1) {
                columnSpanRecompute = columnCount;
            }
            const distanceToRowStart = (index + columnShift) % columnCount;
            if (entry.newRow && distanceToRowStart !== 0) {
                columnShift += columnCount - distanceToRowStart;
            }
            const shiftedIndex = index + columnShift;
            const columnNumber = (shiftedIndex % columnCount) + 1;
            const rowNumber = Math.floor(shiftedIndex / columnCount) + 1;
            if (columnNumber + columnSpanRecompute > columnCount + 1) {
                const overlapNumber = columnNumber + columnSpanRecompute - columnCount - 1;
                const overlapRatio = overlapNumber / columnSpanRecompute;
                heightRecompute = heightRecompute * (1 - overlapRatio);
                columnSpanRecompute -= overlapNumber;
            }
            if (columnSpanRecompute > 1) {
                columnShift += columnSpanRecompute - 1;
            }
            if (rowNumber !== currentRowNumber) {
                currentRowNumber = rowNumber;
                prevRowsTotalHeight += currentRowMaxHeight + gridGap;
                currentRowMaxHeight = 0;
            }
            const offset = prevRowsTotalHeight;
            const height = Math.round(heightRecompute);
            currentRowMaxHeight = Math.max(currentRowMaxHeight, height);
            return { ...entry, columnNumber, rowNumber, offset, height, columnSpan: columnSpanRecompute };
        });
        const totalHeight = prevRowsTotalHeight + currentRowMaxHeight;
        return { cells, totalHeight };
    }
    computeRenderData(configData, containerData, layoutData) {
        if (layoutData === null || configData === null) {
            return { cellsToRender: [], firstRenderedRowNumber: 0, firstRenderedRowOffset: 0 };
        }
        const cellsToRender = [];
        let firstRenderedRowNumber = null;
        let firstRenderedRowOffset = null;
        if (containerData.elementWindowOffset !== null) {
            const elementWindowOffset = containerData.elementWindowOffset;
            for (const cell of layoutData.cells) {
                const cellTop = elementWindowOffset + cell.offset;
                const cellBottom = cellTop + cell.height;
                const windowTop = containerData.windowScroll.y;
                const windowBottom = windowTop + containerData.windowSize.height;
                const renderTop = windowTop - configData.windowMargin;
                const renderBottom = windowBottom + configData.windowMargin;
                if (cellTop > renderBottom) {
                    continue;
                }
                if (cellBottom < renderTop) {
                    continue;
                }
                if (firstRenderedRowNumber === null) {
                    firstRenderedRowNumber = cell.rowNumber;
                }
                if (cell.rowNumber === firstRenderedRowNumber) {
                    firstRenderedRowOffset = firstRenderedRowOffset
                        ? Math.min(firstRenderedRowOffset, cell.offset)
                        : cell.offset;
                }
                cellsToRender.push(cell);
            }
        }
        return { cellsToRender, firstRenderedRowNumber, firstRenderedRowOffset };
    }
    getColumnWidth(columnCount, gridGap, elementWidth) {
        if (columnCount === null || gridGap === null || elementWidth === null) {
            return null;
        }
        const totalGapSpace = (columnCount - 1) * gridGap;
        const columnWidth = Math.round((elementWidth - totalGapSpace) / columnCount);
        return columnWidth;
    }
    getGridRowStart(cell, renderData) {
        if (renderData === null) {
            return undefined;
        }
        const offset = renderData.firstRenderedRowNumber !== null ? renderData.firstRenderedRowNumber - 1 : 0;
        const gridRowStart = cell.rowNumber - offset;
        return `${gridRowStart}`;
    }
    resetGrid() {
        this.bottomReached = false;
        this.initializeGridData();
    }
    isSameElementSize(a, b) {
        return a.width === b.width && a.height === b.height;
    }
    getWindowSize() {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
        };
    }
    getElementSize(element) {
        const rect = element.getBoundingClientRect();
        return {
            width: rect.width,
            height: rect.height,
        };
    }
    isSameElementScroll(a, b) {
        return a.x === b.x && a.y === b.y;
    }
    getWindowScroll() {
        return {
            x: window.scrollX,
            y: window.scrollY,
        };
    }
    getElementOffset(element) {
        return window.scrollY + element.getBoundingClientRect().top;
    }
};
__decorate([
    Prop({ required: true }),
    __metadata("design:type", Array)
], VirtualGridvue_type_script_lang_ts_VirtualGrid.prototype, "items", void 0);
__decorate([
    Prop({ default: () => () => true }),
    __metadata("design:type", Function)
], VirtualGridvue_type_script_lang_ts_VirtualGrid.prototype, "updateFunction", void 0);
__decorate([
    Prop({ default: () => getGridGapDefault }),
    __metadata("design:type", Function)
], VirtualGridvue_type_script_lang_ts_VirtualGrid.prototype, "getGridGap", void 0);
__decorate([
    Prop({ default: () => getColumnCountDefault }),
    __metadata("design:type", Function)
], VirtualGridvue_type_script_lang_ts_VirtualGrid.prototype, "getColumnCount", void 0);
__decorate([
    Prop({ default: () => getWindowMarginDefault }),
    __metadata("design:type", Function)
], VirtualGridvue_type_script_lang_ts_VirtualGrid.prototype, "getWindowMargin", void 0);
__decorate([
    Prop({ default: () => getItemRatioHeightDefault }),
    __metadata("design:type", Function)
], VirtualGridvue_type_script_lang_ts_VirtualGrid.prototype, "getItemRatioHeight", void 0);
__decorate([
    Prop({ default: 500 }),
    __metadata("design:type", Number)
], VirtualGridvue_type_script_lang_ts_VirtualGrid.prototype, "updateTriggerMargin", void 0);
__decorate([
    Prop({ default: null }),
    __metadata("design:type", typeof (VirtualGridvue_type_script_lang_ts_a = typeof external_commonjs_vue_commonjs2_vue_root_Vue_default.a !== "undefined" && external_commonjs_vue_commonjs2_vue_root_Vue_default.a.Component) === "function" ? VirtualGridvue_type_script_lang_ts_a : Object)
], VirtualGridvue_type_script_lang_ts_VirtualGrid.prototype, "loader", void 0);
__decorate([
    Prop({ default: false }),
    __metadata("design:type", Boolean)
], VirtualGridvue_type_script_lang_ts_VirtualGrid.prototype, "debug", void 0);
__decorate([
    ProvideReactive(),
    __metadata("design:type", Boolean)
], VirtualGridvue_type_script_lang_ts_VirtualGrid.prototype, "updateLock", void 0);
__decorate([
    ProvideReactive(),
    __metadata("design:type", Boolean)
], VirtualGridvue_type_script_lang_ts_VirtualGrid.prototype, "bottomReached", void 0);
__decorate([
    ProvideReactive(),
    __metadata("design:type", typeof (VirtualGridvue_type_script_lang_ts_b = typeof Element !== "undefined" && Element) === "function" ? VirtualGridvue_type_script_lang_ts_b : Object)
], VirtualGridvue_type_script_lang_ts_VirtualGrid.prototype, "ref", void 0);
__decorate([
    ProvideReactive(),
    __metadata("design:type", Object)
], VirtualGridvue_type_script_lang_ts_VirtualGrid.prototype, "containerData", void 0);
VirtualGridvue_type_script_lang_ts_VirtualGrid = __decorate([
    vue_class_component_esm
], VirtualGridvue_type_script_lang_ts_VirtualGrid);
/* harmony default export */ var VirtualGridvue_type_script_lang_ts_ = (VirtualGridvue_type_script_lang_ts_VirtualGrid);

// CONCATENATED MODULE: ./src/VirtualGrid.vue?vue&type=script&lang=ts&
 /* harmony default export */ var src_VirtualGridvue_type_script_lang_ts_ = (VirtualGridvue_type_script_lang_ts_); 
// EXTERNAL MODULE: ./src/VirtualGrid.vue?vue&type=style&index=0&id=8e6a98ac&scoped=true&lang=css&
var VirtualGridvue_type_style_index_0_id_8e6a98ac_scoped_true_lang_css_ = __webpack_require__("4117");

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () {
        injectStyles.call(
          this,
          (options.functional ? this.parent : this).$root.$options.shadowRoot
        )
      }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functional component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}

// CONCATENATED MODULE: ./src/VirtualGrid.vue






/* normalize component */

var component = normalizeComponent(
  src_VirtualGridvue_type_script_lang_ts_,
  render,
  staticRenderFns,
  false,
  null,
  "8e6a98ac",
  null
  
)

/* harmony default export */ var src_VirtualGrid = (component.exports);
// CONCATENATED MODULE: ./src/main.ts

/* harmony default export */ var main = (src_VirtualGrid);

// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib.js


/* harmony default export */ var entry_lib = __webpack_exports__["default"] = (main);



/***/ })

/******/ });
//# sourceMappingURL=virtual-grid.common.js.map

/***/ })

}]);
//# sourceMappingURL=photos-1.js.map?v=a1d43161a8b912761422