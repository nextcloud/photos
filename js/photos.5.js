(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{285:function(t,e,n){function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}
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
 */var a=n(380),o=a.prepareRequestOptions;a.prepareRequestOptions=function(t,e){e.cancelToken&&"object"===r(e.cancelToken)&&(t.cancelToken=Object.assign({},t.cancelToken||{},e.cancelToken)),o(t,e),e.method&&"string"==typeof e.method&&(t.method=e.method)},t.exports=a},295:function(t,e,n){var r=n(323);"string"==typeof r&&(r=[[t.i,r,""]]),r.locals&&(t.exports=r.locals);(0,n(172).default)("0f73ce6c",r,!0,{})},309:function(t,e,n){"use strict";var r=n(379),a=n.n(r),o=n(308),i=n.n(o),c=n(344),s=n.n(c),l=n(19);a.a.getPatcher().patch("request",i.a);var u=Object(l.generateRemoteUrl)("dav"),d=a.a.createClient(u);s()(u).pathname;e.a=d},322:function(t,e,n){"use strict";var r=n(295);n.n(r).a},323:function(t,e,n){(e=n(171)(!1)).push([t.i,".file[data-v-1b9c1a10],.folder[data-v-1b9c1a10]{position:relative;display:flex;align-items:center;justify-content:center;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.file .cover[data-v-1b9c1a10],.folder .cover[data-v-1b9c1a10]{z-index:2;width:100%;padding-bottom:100%;transition:opacity var(--animation-quick) ease-in-out;opacity:0;background-color:var(--color-main-text)}.file.active .cover[data-v-1b9c1a10],.file:active .cover[data-v-1b9c1a10],.file:hover .cover[data-v-1b9c1a10],.file:focus .cover[data-v-1b9c1a10],.folder.active .cover[data-v-1b9c1a10],.folder:active .cover[data-v-1b9c1a10],.folder:hover .cover[data-v-1b9c1a10],.folder:focus .cover[data-v-1b9c1a10]{opacity:.3}.file--clear.active .cover[data-v-1b9c1a10],.file--clear:active .cover[data-v-1b9c1a10],.file--clear:hover .cover[data-v-1b9c1a10],.file--clear:focus .cover[data-v-1b9c1a10],.folder--clear.active .cover[data-v-1b9c1a10],.folder--clear:active .cover[data-v-1b9c1a10],.folder--clear:hover .cover[data-v-1b9c1a10],.folder--clear:focus .cover[data-v-1b9c1a10]{opacity:.1}.fade-enter-active[data-v-1b9c1a10],.fade-leave-active[data-v-1b9c1a10]{transition:opacity var(--animation-quick) ease-in-out}.fade-enter[data-v-1b9c1a10],.fade-leave-to[data-v-1b9c1a10]{opacity:0}.folder-content[data-v-1b9c1a10]{position:absolute;display:grid;width:100%;height:100%}.folder-content--grid-1[data-v-1b9c1a10]{grid-template-columns:1fr;grid-template-rows:1fr}.folder-content--grid-2[data-v-1b9c1a10]{grid-template-columns:1fr;grid-template-rows:1fr 1fr}.folder-content--grid-3[data-v-1b9c1a10]{grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr}.folder-content--grid-3 img[data-v-1b9c1a10]:first-child{grid-column:span 2}.folder-content--grid-4[data-v-1b9c1a10]{grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr}.folder-content img[data-v-1b9c1a10]{width:100%;height:100%;-o-object-fit:cover;object-fit:cover}.folder-name[data-v-1b9c1a10]{position:absolute;z-index:3;display:flex;overflow:hidden;flex-direction:column;width:100%;height:100%;transition:opacity var(--animation-quick) ease-in-out;opacity:1}.folder-name__icon[data-v-1b9c1a10]{height:40%;margin-top:calc(30% - 1rem / 2);background-size:40%}.folder-name__name[data-v-1b9c1a10]{overflow:hidden;height:1rem;padding:0 10px;text-align:center;white-space:nowrap;text-overflow:ellipsis;color:var(--color-main-background);text-shadow:0 0 8px var(--color-main-text);font-size:1rem;line-height:1rem}.folder--clear .folder-name__icon[data-v-1b9c1a10]{opacity:.3}.folder--clear .folder-name__name[data-v-1b9c1a10]{color:var(--color-main-text);text-shadow:0 0 8px var(--color-main-background)}.folder:not(.folder--clear) .cover[data-v-1b9c1a10]{opacity:.3}.folder:not(.folder--clear):active .folder-name[data-v-1b9c1a10],.folder:not(.folder--clear):active .cover[data-v-1b9c1a10],.folder:not(.folder--clear):hover .folder-name[data-v-1b9c1a10],.folder:not(.folder--clear):hover .cover[data-v-1b9c1a10],.folder:not(.folder--clear):focus .folder-name[data-v-1b9c1a10],.folder:not(.folder--clear):focus .cover[data-v-1b9c1a10]{opacity:0}\n",""]),t.exports=e},364:function(t,e,n){"use strict";n.d(e,"a",(function(){return r}));
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
var r="\n\t<oc:fileid />\n\t<d:getlastmodified />\n\t<d:getetag />\n\t<d:getcontenttype />\n\t<d:getcontentlength />\n\t<nc:has-preview />\n\t<oc:favorite />\n\t<d:resourcetype />";'<?xml version="1.0"?>\n\t\t\t<d:propfind xmlns:d="DAV:"\n\t\t\t\txmlns:oc="http://owncloud.org/ns"\n\t\t\t\txmlns:nc="http://nextcloud.org/ns"\n\t\t\t\txmlns:ocs="http://open-collaboration-services.org/ns">\n\t\t\t\t<d:prop>\n\t\t\t\t\t'.concat(r,"\n\t\t\t\t</d:prop>\n\t\t\t</d:propfind>")},367:function(e,n,r){"use strict";var a=r(19),o={name:"FolderTagPreview",props:{icon:{type:String,default:"icon-folder"},id:{type:Number,required:!0},name:{type:String,required:!0},path:{type:String,required:!0},fileList:{type:Array,default:function(){return[]}}},data:function(){return{loaded:!1,failed:[]}},computed:{isEmpty:function(){return 0===this.previewList.length},ariaUuid:function(){return"folder-".concat(this.id)},ariaLabel:function(){return t("photos",'Open the "{name}" sub-directory',{name:this.name})},previewList:function(){var t=this;return this.fileList.filter((function(e){return-1===t.failed.indexOf(e.fileid)}))},to:function(){var t=/^\/?(.+)/i.exec(this.path)[1];return Object.assign({},this.$route,{params:{path:t}})}},methods:{generateImgSrc:function(t){var e=t.fileid,n=t.etag;return Object(a.generateUrl)("/core/preview?fileId=".concat(e,"&x=",256,"&y=",256,"&a=true&v=").concat(n))},onPreviewFail:function(t){var e=t.fileid;this.failed.push(e)}}},i=(r(322),r(82)),c=Object(i.a)(o,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("router-link",{staticClass:"folder",class:{"folder--clear":t.isEmpty},attrs:{to:t.to,"aria-label":t.ariaLabel}},[n("transition",{attrs:{name:"fade"}},[n("div",{directives:[{name:"show",rawName:"v-show",value:t.loaded,expression:"loaded"}],staticClass:"folder-content",class:"folder-content--grid-"+t.previewList.length,attrs:{role:"none"}},t._l(t.previewList,(function(e){return n("img",{key:e.fileid,attrs:{src:t.generateImgSrc(e),alt:""},on:{load:function(e){t.loaded=!0},error:function(n){return t.onPreviewFail(e)}}})})),0)]),t._v(" "),n("div",{staticClass:"folder-name"},[n("span",{staticClass:"folder-name__icon",class:[t.isEmpty?"icon-dark":"icon-white",t.icon],attrs:{role:"img"}}),t._v(" "),n("p",{staticClass:"folder-name__name",attrs:{id:t.ariaUuid}},[t._v("\n\t\t\t"+t._s(t.name)+"\n\t\t")])]),t._v(" "),n("div",{staticClass:"cover",attrs:{role:"none"}})],1)}),[],!1,null,"1b9c1a10",null);n.a=c.exports},396:function(t,e){},397:function(t,e){},417:function(t,e){},419:function(t,e){},646:function(t,e,n){"use strict";n.r(e);var r=n(52),a=n(309),o=n(24);function i(t,e,n,r,a,o,i){try{var c=t[o](i),s=c.value}catch(t){return void n(t)}c.done?e(s):Promise.resolve(s).then(r,a)}
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
 */var c=function(t){return s.apply(this,arguments)};function s(){var t;return t=regeneratorRuntime.mark((function t(e){var n,r,i=arguments;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n=i.length>1&&void 0!==i[1]?i[1]:{},t.next=3,a.a.getDirectoryContents("/systemtags/",Object.assign({},{data:'<?xml version="1.0"?>\n\t\t\t<d:propfind  xmlns:d="DAV:"\n\t\t\t\txmlns:oc="http://owncloud.org/ns">\n\t\t\t\t<d:prop>\n\t\t\t\t\t<oc:id />\n\t\t\t\t\t<oc:display-name />\n\t\t\t\t\t<oc:user-visible />\n\t\t\t\t\t<oc:user-assignable />\n\t\t\t\t\t<oc:can-assign />\n\t\t\t\t</d:prop>\n\t\t\t</d:propfind>',details:!0},n));case 3:return r=t.sent,t.abrupt("return",r.data.map((function(t){return Object(o.b)(t)})));case 5:case"end":return t.stop()}}),t)})),(s=function(){var e=this,n=arguments;return new Promise((function(r,a){var o=t.apply(e,n);function c(t){i(o,r,a,c,s,"next",t)}function s(t){i(o,r,a,c,s,"throw",t)}c(void 0)}))}).apply(this,arguments)}var l=n(83),u=n(364);function d(t,e,n,r,a,o,i){try{var c=t[o](i),s=c.value}catch(t){return void n(t)}c.done?e(s):Promise.resolve(s).then(r,a)}
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
 */var f=function(t){return p.apply(this,arguments)};function p(){var t;return t=regeneratorRuntime.mark((function t(e){var n,r,i,c=arguments;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n=c.length>1&&void 0!==c[1]?c[1]:{},n=Object.assign({method:"REPORT",data:'<?xml version="1.0"?>\n\t\t\t<oc:filter-files\n\t\t\t\txmlns:d="DAV:"\n\t\t\t\txmlns:oc="http://owncloud.org/ns"\n\t\t\t\txmlns:nc="http://nextcloud.org/ns"\n\t\t\t\txmlns:ocs="http://open-collaboration-services.org/ns">\n\t\t\t\t<d:prop>\n\t\t\t\t\t'.concat(u.a,"\n\t\t\t\t</d:prop>\n\t\t\t\t<oc:filter-rules>\n\t\t\t\t\t<oc:systemtag>").concat(e,"</oc:systemtag>\n\t\t\t\t</oc:filter-rules>\n\t\t\t</oc:filter-files>"),details:!0},n),r="/files/".concat(Object(l.getCurrentUser)().uid),t.next=5,a.a.getDirectoryContents(r,n);case 5:return i=t.sent,t.abrupt("return",i.data.map((function(t){return Object(o.b)(t)})).map((function(t){return Object.assign({},t,{filename:t.filename.replace(r,"")})})));case 7:case"end":return t.stop()}}),t)})),(p=function(){var e=this,n=arguments;return new Promise((function(r,a){var o=t.apply(e,n);function i(t){d(o,r,a,i,c,"next",t)}function c(t){d(o,r,a,i,c,"throw",t)}i(void 0)}))}).apply(this,arguments)}var v=n(368),h=n(301);function m(t,e,n,r,a,o,i){try{var c=t[o](i),s=c.value}catch(t){return void n(t)}c.done?e(s):Promise.resolve(s).then(r,a)}function g(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function b(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var y,w,x={name:"Tag",components:{FolderTagPreview:n(367).a},inheritAttrs:!1,props:{displayName:{type:String,required:!0},id:{type:Number,required:!0}},data:function(){return{cancelRequest:function(){}}},computed:function(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?g(Object(n),!0).forEach((function(e){b(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):g(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}({},Object(r.c)(["files","tags"]),{folderContent:function(){return this.tags[this.id].files},fileList:function(){var t=this;return this.folderContent?this.folderContent.map((function(e){return t.files[e]})).filter((function(t){return!!t})).slice(0,4):[]}}),beforeDestroy:function(){this.cancelRequest("Navigated away")},created:(y=regeneratorRuntime.mark((function t(){var e,n,r,a;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e=Object(h.a)(f),n=e.request,r=e.cancel,this.cancelRequest=r,t.prev=2,t.next=5,n(this.id);case 5:a=t.sent,this.$store.dispatch("updateTag",{id:this.id,files:a}),this.$store.dispatch("appendFiles",a),t.next=13;break;case 10:t.prev=10,t.t0=t.catch(2),t.t0.response&&t.t0.response.status&&console.error("Failed to get folder content",this.id,t.t0.response);case 13:case"end":return t.stop()}}),t,this,[[2,10]])})),w=function(){var t=this,e=arguments;return new Promise((function(n,r){var a=y.apply(t,e);function o(t){m(a,n,r,o,i,"next",t)}function i(t){m(a,n,r,o,i,"throw",t)}o(void 0)}))},function(){return w.apply(this,arguments)})},O=n(82),j=Object(O.a)(x,(function(){var t=this.$createElement;return(this._self._c||t)("FolderTagPreview",{attrs:{id:this.id,icon:"icon-tag",name:this.displayName,path:this.displayName,"file-list":this.fileList}})}),[],!1,null,null,null).exports,_=n(369),k=n(366),R=n(370);function P(t,e,n,r,a,o,i){try{var c=t[o](i),s=c.value}catch(t){return void n(t)}c.done?e(s):Promise.resolve(s).then(r,a)}function C(t){return function(){var e=this,n=arguments;return new Promise((function(r,a){var o=t.apply(e,n);function i(t){P(o,r,a,i,c,"next",t)}function c(t){P(o,r,a,i,c,"throw",t)}i(void 0)}))}}function q(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function T(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var S,E,D,L,N={name:"Tags",components:{EmptyContent:v.a,File:_.a,Tag:j,Grid:k.a,Navigation:R.a},props:{rootTitle:{type:String,required:!0},path:{type:String,default:""},loading:{type:Boolean,required:!0},isRoot:{type:Boolean,default:!0}},data:function(){return{error:null,cancelRequest:function(){}}},computed:function(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?q(Object(n),!0).forEach((function(e){T(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):q(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}({},Object(r.c)(["files","tags","tagsNames"]),{tagId:function(){return this.$store.getters.tagId(this.path)},tag:function(){return this.tags[this.tagId]},fileList:function(){var t=this;return this.tag&&this.tag.files.map((function(e){return t.files[e]})).filter((function(t){return!!t}))},isEmpty:function(){return this.isRoot?0===Object.keys(this.tagsNames).length:0===this.fileList.length}}),watch:{path:(L=C(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(this.tagId){t.next=3;break}return t.next=3,this.fetchRootContent();case 3:this.isRoot||this.fetchContent();case 4:case"end":return t.stop()}}),t,this)}))),function(){return L.apply(this,arguments)})},beforeDestroy:function(){this.cancelRequest("Changed view")},beforeMount:(D=C(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(this.tagId){t.next=3;break}return t.next=3,this.fetchRootContent();case 3:this.isRoot||this.fetchContent();case 4:case"end":return t.stop()}}),t,this)}))),function(){return D.apply(this,arguments)}),methods:{fetchRootContent:(E=C(regeneratorRuntime.mark((function t(){var e,n,r,a;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return this.cancelRequest("Changed folder"),OCA.Viewer.close(),this.tags[this.tagId]||this.$emit("update:loading",!0),this.error=null,e=Object(h.a)(c),n=e.request,r=e.cancel,this.cancelRequest=r,t.prev=6,t.next=9,n();case 9:a=t.sent,this.$store.dispatch("updateTags",a),t.next=17;break;case 13:t.prev=13,t.t0=t.catch(6),console.error(t.t0),this.error=!0;case 17:return t.prev=17,this.$emit("update:loading",!1),t.finish(17);case 20:case"end":return t.stop()}}),t,this,[[6,13,17,20]])}))),function(){return E.apply(this,arguments)}),fetchContent:(S=C(regeneratorRuntime.mark((function t(){var e,n,r,a;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return this.cancelRequest(),OCA.Viewer.close(),this.tags[this.tagId]||this.$emit("update:loading",!0),this.error=null,e=Object(h.a)(f),n=e.request,r=e.cancel,this.cancelRequest=r,t.next=8,n(this.tagId);case 8:a=t.sent,this.$store.dispatch("updateTag",{id:this.tagId,files:a}),this.$store.dispatch("appendFiles",a),this.$emit("update:loading",!1);case 12:case"end":return t.stop()}}),t,this)}))),function(){return S.apply(this,arguments)})}},$=Object(O.a)(N,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return t.error?n("EmptyContent",[t._v("\n\t"+t._s(t.t("photos","An error occurred"))+"\n")]):t.loading?t._e():n("Grid",[n("Navigation",{key:"navigation",attrs:{basename:t.path,filename:"/"+t.path,"root-title":t.rootTitle}}),t._v(" "),t.isRoot?t._l(t.tagsNames,(function(e){return n("Tag",t._b({key:e,attrs:{fileid:e,basename:t.tags[e].displayName}},"Tag",t.tags[e],!1))})):[t.isEmpty?n("EmptyContent",{key:"emptycontent",attrs:{"illustration-name":"empty"},scopedSlots:t._u([{key:"desc",fn:function(){return[t._v("\n\t\t\t\t"+t._s(t.t("photos","Photos with tags will show up here"))+"\n\t\t\t")]},proxy:!0}],null,!1,3269923249)},[t._v("\n\t\t\t"+t._s(t.t("photos","No tags yet"))+"\n\t\t\t")]):t._e(),t._v(" "),t._l(t.fileList,(function(e){return n("File",t._b({key:e.fileid,attrs:{list:t.fileList}},"File",e,!1))}))]],2)}),[],!1,null,null,null);e.default=$.exports}}]);
//# sourceMappingURL=photos.5.js.map?v=5c5b280517269a9c68d2