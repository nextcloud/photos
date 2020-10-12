(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{188:function(t,e,n){function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}
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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */var o=n(278),i=o.prepareRequestOptions;o.prepareRequestOptions=function(t,e){e.cancelToken&&"object"===r(e.cancelToken)&&(t.cancelToken=e.cancelToken),i(t,e),e.method&&"string"==typeof e.method&&(t.method=e.method)},t.exports=o},217:function(t,e,n){"use strict";var r=n(277),o=n.n(r),i=n(211),a=n.n(i),c=n(260),s=n.n(c),u=n(17);o.a.getPatcher().patch("request",a.a);var l=Object(u.generateRemoteUrl)("dav"),f=o.a.createClient(l);s()(l).pathname;e.a=f},262:function(t,e,n){"use strict";n.d(e,"a",(function(){return r}));
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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
var r="\n\t<oc:fileid />\n\t<d:getlastmodified />\n\t<d:getetag />\n\t<d:getcontenttype />\n\t<d:getcontentlength />\n\t<nc:has-preview />\n\t<oc:favorite />\n\t<d:resourcetype />";'<?xml version="1.0"?>\n\t\t\t<d:propfind xmlns:d="DAV:"\n\t\t\t\txmlns:oc="http://owncloud.org/ns"\n\t\t\t\txmlns:nc="http://nextcloud.org/ns"\n\t\t\t\txmlns:ocs="http://open-collaboration-services.org/ns">\n\t\t\t\t<d:prop>\n\t\t\t\t\t'.concat(r,"\n\t\t\t\t</d:prop>\n\t\t\t</d:propfind>")},294:function(t,e){},295:function(t,e){},304:function(t,e){},305:function(t,e){},325:function(t,e){},327:function(t,e){},328:function(t,e){},331:function(t,e){},332:function(t,e){},337:function(t,e){},338:function(t,e){},345:function(t,e){},348:function(t,e){},354:function(t,e){},357:function(t,e){},677:function(t,e,n){"use strict";n.r(e);var r=n(49),o=n(217),i=n(24);function a(t,e,n,r,o,i,a){try{var c=t[i](a),s=c.value}catch(t){return void n(t)}c.done?e(s):Promise.resolve(s).then(r,o)}function c(t){return function(){var e=this,n=arguments;return new Promise((function(r,o){var i=t.apply(e,n);function c(t){a(i,r,o,c,s,"next",t)}function s(t){a(i,r,o,c,s,"throw",t)}c(void 0)}))}}
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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */var s=function(t){return u.apply(this,arguments)};function u(){return(u=c(regeneratorRuntime.mark((function t(e){var n,r,a=arguments;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n=a.length>1&&void 0!==a[1]?a[1]:{},t.next=3,o.a.getDirectoryContents("/systemtags/",Object.assign({},{data:'<?xml version="1.0"?>\n\t\t\t<d:propfind  xmlns:d="DAV:"\n\t\t\t\txmlns:oc="http://owncloud.org/ns">\n\t\t\t\t<d:prop>\n\t\t\t\t\t<oc:id />\n\t\t\t\t\t<oc:display-name />\n\t\t\t\t\t<oc:user-visible />\n\t\t\t\t\t<oc:user-assignable />\n\t\t\t\t\t<oc:can-assign />\n\t\t\t\t</d:prop>\n\t\t\t</d:propfind>',details:!0},n));case 3:return r=t.sent,t.abrupt("return",r.data.map((function(t){return Object(i.b)(t)})));case 5:case"end":return t.stop()}}),t)})))).apply(this,arguments)}var l=n(22),f=n(262),p=n(75);function d(t,e,n,r,o,i,a){try{var c=t[i](a),s=c.value}catch(t){return void n(t)}c.done?e(s):Promise.resolve(s).then(r,o)}function h(t){return function(){var e=this,n=arguments;return new Promise((function(r,o){var i=t.apply(e,n);function a(t){d(i,r,o,a,c,"next",t)}function c(t){d(i,r,o,a,c,"throw",t)}a(void 0)}))}}
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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */var g=function(t){return m.apply(this,arguments)};function m(){return(m=h(regeneratorRuntime.mark((function t(e){var n,r,a,c=arguments;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n=c.length>1&&void 0!==c[1]?c[1]:{},n=Object.assign({method:"REPORT",data:'<?xml version="1.0"?>\n\t\t\t<oc:filter-files\n\t\t\t\txmlns:d="DAV:"\n\t\t\t\txmlns:oc="http://owncloud.org/ns"\n\t\t\t\txmlns:nc="http://nextcloud.org/ns"\n\t\t\t\txmlns:ocs="http://open-collaboration-services.org/ns">\n\t\t\t\t<d:prop>\n\t\t\t\t\t'.concat(f.a,"\n\t\t\t\t</d:prop>\n\t\t\t\t<oc:filter-rules>\n\t\t\t\t\t<oc:systemtag>").concat(e,"</oc:systemtag>\n\t\t\t\t</oc:filter-rules>\n\t\t\t</oc:filter-files>"),details:!0},n),r="/files/".concat(Object(l.getCurrentUser)().uid),t.next=5,o.a.getDirectoryContents(r,n);case 5:return a=t.sent,t.abrupt("return",a.data.map((function(t){return Object(i.b)(t)})).filter((function(t){return t.mime&&-1!==p.b.indexOf(t.mime)})).map((function(t){return Object.assign({},t,{filename:t.filename.replace(r,"")})})));case 7:case"end":return t.stop()}}),t)})))).apply(this,arguments)}var v=n(226),y=n(203);function b(t,e,n,r,o,i,a){try{var c=t[i](a),s=c.value}catch(t){return void n(t)}c.done?e(s):Promise.resolve(s).then(r,o)}function O(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function w(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?O(Object(n),!0).forEach((function(e){x(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):O(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function x(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var R={name:"Tag",components:{FolderTagPreview:n(503).a},inheritAttrs:!1,props:{displayName:{type:String,required:!0},id:{type:Number,required:!0}},data:function(){return{cancelRequest:null}},computed:w(w({},Object(r.c)(["files","tags"])),{},{folderContent:function(){return this.tags[this.id].files},fileList:function(){var t=this;return this.folderContent?this.folderContent.map((function(e){return t.files[e]})).filter((function(t){return!!t})).slice(0,4):[]}}),beforeDestroy:function(){this.cancelRequest&&this.cancelRequest("Navigated away")},created:function(){var t,e=this;return(t=regeneratorRuntime.mark((function t(){var n,r,o,i;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n=Object(y.a)(g),r=n.request,o=n.cancel,e.cancelRequest=o,t.prev=2,t.next=5,r(e.id);case 5:i=t.sent,e.$store.dispatch("updateTag",{id:e.id,files:i}),e.$store.dispatch("appendFiles",i),t.next=13;break;case 10:t.prev=10,t.t0=t.catch(2),t.t0.response&&t.t0.response.status&&console.error("Failed to get folder content",e.id,t.t0.response);case 13:return t.prev=13,e.cancelRequest=null,t.finish(13);case 16:case"end":return t.stop()}}),t,null,[[2,10,13,16]])})),function(){var e=this,n=arguments;return new Promise((function(r,o){var i=t.apply(e,n);function a(t){b(i,r,o,a,c,"next",t)}function c(t){b(i,r,o,a,c,"throw",t)}a(void 0)}))})()}},j=n(74),P=Object(j.a)(R,(function(){var t=this.$createElement;return(this._self._c||t)("FolderTagPreview",{attrs:{id:this.id,icon:"icon-tag",name:this.displayName,path:this.displayName,"file-list":this.fileList}})}),[],!1,null,null,null).exports,k=n(501),q=n(502),C=n(227);function _(t,e,n,r,o,i,a){try{var c=t[i](a),s=c.value}catch(t){return void n(t)}c.done?e(s):Promise.resolve(s).then(r,o)}function T(t){return function(){var e=this,n=arguments;return new Promise((function(r,o){var i=t.apply(e,n);function a(t){_(i,r,o,a,c,"next",t)}function c(t){_(i,r,o,a,c,"throw",t)}a(void 0)}))}}function D(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function N(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?D(Object(n),!0).forEach((function(e){S(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):D(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function S(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var E={name:"Tags",components:{EmptyContent:v.a,File:k.a,Tag:P,Grid:q.a,Navigation:C.a},props:{rootTitle:{type:String,required:!0},path:{type:String,default:""},loading:{type:Boolean,required:!0},isRoot:{type:Boolean,default:!0}},data:function(){return{error:null,cancelRequest:null}},computed:N(N({},Object(r.c)(["files","tags","tagsNames"])),{},{tagId:function(){return this.$store.getters.tagId(this.path)},tag:function(){return this.tags[this.tagId]},fileList:function(){var t=this;return this.tag&&this.tag.files.map((function(e){return t.files[e]})).filter((function(t){return!!t}))},isEmpty:function(){return this.isRoot?0===Object.keys(this.tagsNames).length:0===this.fileList.length}}),watch:{path:function(){var t=this;return T(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t.tagId){e.next=3;break}return e.next=3,t.fetchRootContent();case 3:t.isRoot||t.fetchContent();case 4:case"end":return e.stop()}}),e)})))()}},beforeDestroy:function(){this.cancelRequest&&this.cancelRequest("Navigated away")},beforeMount:function(){var t=this;return T(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t.tagId){e.next=3;break}return e.next=3,t.fetchRootContent();case 3:t.isRoot||t.fetchContent();case 4:case"end":return e.stop()}}),e)})))()},methods:{fetchRootContent:function(){var t=this;return T(regeneratorRuntime.mark((function e(){var n,r,o,i;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.cancelRequest&&t.cancelRequest("Changed folder"),OCA.Viewer.close(),t.tags[t.tagId]||t.$emit("update:loading",!0),t.error=null,n=Object(y.a)(s),r=n.request,o=n.cancel,t.cancelRequest=o,e.prev=6,e.next=9,r();case 9:i=e.sent,t.$store.dispatch("updateTags",i),e.next=17;break;case 13:e.prev=13,e.t0=e.catch(6),console.error(e.t0),t.error=!0;case 17:return e.prev=17,t.$emit("update:loading",!1),t.cancelRequest=null,e.finish(17);case 21:case"end":return e.stop()}}),e,null,[[6,13,17,21]])})))()},fetchContent:function(){var t=this;return T(regeneratorRuntime.mark((function e(){var n,r,o,i;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.cancelRequest&&t.cancelRequest(),OCA.Viewer.close(),t.tags[t.tagId]||t.$emit("update:loading",!0),t.error=null,n=Object(y.a)(g),r=n.request,o=n.cancel,t.cancelRequest=o,e.prev=6,e.next=9,r(t.tagId);case 9:i=e.sent,t.$store.dispatch("updateTag",{id:t.tagId,files:i}),t.$store.dispatch("appendFiles",i),e.next=18;break;case 14:e.prev=14,e.t0=e.catch(6),console.error(e.t0),t.error=!0;case 18:return e.prev=18,t.$emit("update:loading",!1),t.cancelRequest=null,e.finish(18);case 22:case"end":return e.stop()}}),e,null,[[6,14,18,22]])})))()}}},$=Object(j.a)(E,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return t.error?n("EmptyContent",[t._v("\n\t"+t._s(t.t("photos","An error occurred"))+"\n")]):t.loading?t._e():n("div",[n("Navigation",{key:"navigation",attrs:{basename:t.path,filename:"/"+t.path,"root-title":t.rootTitle}}),t._v(" "),n("Grid",[t.isRoot?t._l(t.tagsNames,(function(e){return n("Tag",t._b({key:e,attrs:{fileid:e,basename:t.tags[e].displayName}},"Tag",t.tags[e],!1))})):[t.isEmpty?n("EmptyContent",{key:"emptycontent",attrs:{"illustration-name":"empty"},scopedSlots:t._u([{key:"desc",fn:function(){return[t._v("\n\t\t\t\t\t"+t._s(t.t("photos","Photos with tags will show up here"))+"\n\t\t\t\t")]},proxy:!0}],null,!1,2298586353)},[t._v("\n\t\t\t\t"+t._s(t.t("photos","No tags yet"))+"\n\t\t\t\t")]):t._e(),t._v(" "),t._l(t.fileList,(function(e){return n("File",t._b({key:e.fileid,attrs:{list:t.fileList}},"File",e,!1))}))]],2)],1)}),[],!1,null,null,null);e.default=$.exports}}]);
//# sourceMappingURL=photos-6.js.map?v=96680ce8e996a422fba8