/*! For license information please see photos-src_components_Collection_CollectionContent_vue-src_components_FilesPicker_vue.js.LICENSE.txt */
(self.webpackChunkphotos=self.webpackChunkphotos||[]).push([["src_components_Collection_CollectionContent_vue-src_components_FilesPicker_vue"],{66951:(t,e,i)=>{"use strict";i.d(e,{Z:()=>A});var n=i(59537),a=i(94236),l=i(45994),r=i(3301),o=i(81067),s=i(2161),c=i(80351),d=i.n(c);var f=i(32114),p=i(69363),h=i(25108);const A={name:"FetchFilesMixin",mixins:[p.Z],data:()=>({errorFetchingFiles:null,loadingFiles:!1,doneFetchingFiles:!1,semaphore:new f.Z(30),fetchSemaphore:new f.Z(1),semaphoreSymbol:null,fetchedFileIds:[]}),watch:{$route(){this.resetFetchFilesState()}},methods:{async fetchFiles(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[],c=arguments.length>3&&void 0!==arguments[3]&&arguments[3];if(this.doneFetchingFiles&&!c||this.loadingFiles)return[];const f=await this.semaphore.acquire((()=>0),"fetchFiles"),p=await this.fetchSemaphore.acquire();try{this.errorFetchingFiles=null,this.loadingFiles=!0,this.semaphoreSymbol=f;const c=200,p=await async function(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};e={firstResult:0,nbResults:200,mimesType:r.Oj,onThisDay:!1,onlyFavorites:!1,...e};const i="/files/".concat((0,l.ts)().uid),n=e.mimesType.reduce(((t,e)=>"".concat(t,"\n\t\t<d:eq>\n\t\t\t<d:prop>\n\t\t\t\t<d:getcontenttype/>\n\t\t\t</d:prop>\n\t\t\t<d:literal>").concat(e,"</d:literal>\n\t\t</d:eq>\n\t")),""),c=e.onlyFavorites?"<d:eq>\n\t\t\t\t<d:prop>\n\t\t\t\t\t<oc:favorite/>\n\t\t\t\t</d:prop>\n\t\t\t\t<d:literal>1</d:literal>\n\t\t\t</d:eq>":"",f=e.onThisDay?"<d:or>".concat(Array(20).fill(1).map(((t,e)=>{const i=d()(Date.now()).startOf("day").subtract(3,"d").subtract(e+1,"y"),n=d()(Date.now()).endOf("day").add(3,"d").subtract(e+1,"y");return"<d:and>\n\t\t\t\t<d:gt>\n\t\t\t\t\t<d:prop>\n\t\t\t\t\t\t<d:getlastmodified />\n\t\t\t\t\t</d:prop>\n\t\t\t\t\t<d:literal>".concat(i.format(d().defaultFormatUtc),"</d:literal>\n\t\t\t\t</d:gt>\n\t\t\t\t<d:lt>\n\t\t\t\t\t<d:prop>\n\t\t\t\t\t\t<d:getlastmodified />\n\t\t\t\t\t</d:prop>\n\t\t\t\t\t<d:literal>").concat(n.format(d().defaultFormatUtc),"</d:literal>\n\t\t\t\t</d:lt>\n\t\t\t</d:and>")})).join("\n"),"</d:or>"):"";return e=Object.assign({method:"SEARCH",headers:{"content-Type":"text/xml"},data:'<?xml version="1.0" encoding="UTF-8"?>\n\t\t\t<d:searchrequest xmlns:d="DAV:"\n\t\t\t\txmlns:oc="http://owncloud.org/ns"\n\t\t\t\txmlns:nc="http://nextcloud.org/ns"\n\t\t\t\txmlns:ns="https://github.com/icewind1991/SearchDAV/ns"\n\t\t\t\txmlns:ocs="http://open-collaboration-services.org/ns">\n\t\t\t\t<d:basicsearch>\n\t\t\t\t\t<d:select>\n\t\t\t\t\t\t<d:prop>\n\t\t\t\t\t\t\t'.concat(s.N,"\n\t\t\t\t\t\t</d:prop>\n\t\t\t\t\t</d:select>\n\t\t\t\t\t<d:from>\n\t\t\t\t\t\t<d:scope>\n\t\t\t\t\t\t\t<d:href>").concat(i,"/").concat(t,"</d:href>\n\t\t\t\t\t\t\t<d:depth>infinity</d:depth>\n\t\t\t\t\t\t</d:scope>\n\t\t\t\t\t</d:from>\n\t\t\t\t\t<d:where>\n\t\t\t\t\t\t<d:and>\n\t\t\t\t\t\t\t<d:or>\n\t\t\t\t\t\t\t\t").concat(n,"\n\t\t\t\t\t\t\t</d:or>\n\t\t\t\t\t\t\t").concat(c,"\n\t\t\t\t\t\t\t").concat(f,"\n\t\t\t\t\t\t</d:and>\n\t\t\t\t\t</d:where>\n\t\t\t\t\t<d:orderby>\n\t\t\t\t\t\t<d:order>\n\t\t\t\t\t\t\t<d:prop><d:getlastmodified/></d:prop>\n\t\t\t\t\t\t\t<d:descending/>\n\t\t\t\t\t\t</d:order>\n\t\t\t\t\t</d:orderby>\n\t\t\t\t\t<d:limit>\n\t\t\t\t\t\t<d:nresults>").concat(e.nbResults,"</d:nresults>\n\t\t\t\t\t\t<ns:firstresult>").concat(e.firstResult,"</ns:firstresult>\n\t\t\t\t\t</d:limit>\n\t\t\t\t</d:basicsearch>\n\t\t\t</d:searchrequest>"),deep:!0,details:!0},e),(await o.ZP.getDirectoryContents("",e)).data.map((t=>(0,a.AX)(t)))}(t,{firstResult:this.fetchedFileIds.length,nbResults:c,...e,signal:this.abortController.signal});p.length!==c&&(this.doneFetchingFiles=!0);const h=p.map((t=>t.fileid)).filter((t=>!this.fetchedFileIds.includes(t)));return this.fetchedFileIds.push(...h.map((t=>t.toString())).filter((t=>!i.includes(t)))),this.$store.dispatch("appendFiles",p),n.Z.debug("[FetchFilesMixin] Fetched ".concat(h.length," new files: "),h),h}catch(t){var A;if(404===(null===(A=t.response)||void 0===A?void 0:A.status))this.errorFetchingFiles=404;else{if("ERR_CANCELED"===t.code)return[];this.errorFetchingFiles=t}n.Z.error("Error fetching files",{error:t}),h.error(t)}finally{this.loadingFiles=!1,this.semaphore.release(f),this.fetchSemaphore.release(p)}return[]},resetFetchFilesState(){this.doneFetchingFiles=!1,this.errorFetchingFiles=null,this.loadingFiles=!1,this.fetchedFileIds=[]}}}},28391:(t,e,i)=>{"use strict";i.d(e,{Z:()=>n});const n={name:"FilesByMonthMixin",computed:{fileIdsByMonth(){const t={};for(const i of this.fetchedFileIds){const n=this.files[i];var e;if(n)t[n.month]=null!==(e=t[n.month])&&void 0!==e?e:[],t[n.month].push(n.fileid)}return Object.keys(t).forEach((e=>t[e].sort(this.sortFilesByTimestamp))),t},monthsList(){return Object.keys(this.fileIdsByMonth).sort(((t,e)=>t>e?-1:1))}},methods:{sortFilesByTimestamp(t,e){return this.files[t].timestamp>this.files[e].timestamp?-1:1}}}},93538:(t,e,i)=>{"use strict";i.d(e,{Z:()=>o});var n=i(87537),a=i.n(n),l=i(23645),r=i.n(l)()(a());r.push([t.id,".collection[data-v-2d83c546]{display:flex;flex-direction:column}.collection__media[data-v-2d83c546]{padding:0 64px}@media only screen and (max-width: 1200px){.collection__media[data-v-2d83c546]{padding:0 4px}}","",{version:3,sources:["webpack://./src/components/Collection/CollectionContent.vue"],names:[],mappings:"AAEA,6BACC,YAAA,CACA,qBAAA,CAEA,oCACC,cAAA,CAEA,2CAHD,oCAIE,aAAA,CAAA",sourcesContent:['$sizes: ("400": ("count": 3, "marginTop": 66, "marginW": 8), "700": ("count": 4, "marginTop": 66, "marginW": 8), "1024": ("count": 5, "marginTop": 66, "marginW": 44), "1280": ("count": 4, "marginTop": 66, "marginW": 44), "1440": ("count": 5, "marginTop": 88, "marginW": 66), "1600": ("count": 6, "marginTop": 88, "marginW": 66), "2048": ("count": 7, "marginTop": 88, "marginW": 66), "2560": ("count": 8, "marginTop": 88, "marginW": 88), "3440": ("count": 9, "marginTop": 88, "marginW": 88), "max": ("count": 10, "marginTop": 88, "marginW": 88));\n\n.collection {\n\tdisplay: flex;\n\tflex-direction: column;\n\n\t&__media {\n\t\tpadding: 0 64px;\n\n\t\t@media only screen and (max-width: 1200px) {\n\t\t\tpadding: 0 4px;\n\t\t}\n\t}\n}\n'],sourceRoot:""}]);const o=r},98764:(t,e,i)=>{"use strict";i.d(e,{Z:()=>o});var n=i(87537),a=i.n(n),l=i(23645),r=i.n(l)()(a());r.push([t.id,".file-picker[data-v-174ae58a]{display:flex;flex-direction:column;padding:12px}.file-picker__content[data-v-174ae58a]{display:flex;align-items:flex-start;flex-grow:1;height:500px}.file-picker__navigation[data-v-174ae58a]{flex-basis:200px;overflow:scroll;margin-right:8px;padding-right:8px;height:100%}@media only screen and (max-width: 1200px){.file-picker__navigation[data-v-174ae58a]{flex-basis:100px}}.file-picker__navigation--placeholder[data-v-174ae58a]{background:var(--color-primary-light);border-radius:var(--border-radius-large)}.file-picker__navigation__month[data-v-174ae58a]{font-weight:bold;font-size:16px;border-radius:var(--border-radius-pill);padding:8px 16px;margin:4px 0;cursor:pointer}@media only screen and (max-width: 1200px){.file-picker__navigation__month[data-v-174ae58a]{text-align:center}}.file-picker__navigation__month[data-v-174ae58a]:hover{background:var(--color-background-dark)}.file-picker__navigation__month.selected[data-v-174ae58a]{background:var(--color-primary-element-lighter)}.file-picker__file-list[data-v-174ae58a]{flex-grow:1;min-width:0;height:100%}.file-picker__file-list--placeholder[data-v-174ae58a]{background:var(--color-primary-light);border-radius:var(--border-radius-large)}.file-picker__file-list .section-header[data-v-174ae58a]{font-weight:bold;font-size:20px;padding:8px 0 4px 0}.file-picker__file-list[data-v-174ae58a] .empty-content{position:absolute;width:100%;margin-top:0;height:100%;display:flex;flex-direction:column;justify-content:center}.file-picker__actions[data-v-174ae58a]{display:flex;justify-content:space-between;justify-items:center;padding-top:16px}","",{version:3,sources:["webpack://./src/components/FilesPicker.vue"],names:[],mappings:"AAEA,8BACC,YAAA,CACA,qBAAA,CACA,YAAA,CAEA,uCACC,YAAA,CACA,sBAAA,CACA,WAAA,CACA,YAAA,CAGD,0CACC,gBAAA,CACA,eAAA,CACA,gBAAA,CACA,iBAAA,CACA,WAAA,CAEA,2CAPD,0CAQE,gBAAA,CAAA,CAGD,uDACC,qCAAA,CACA,wCAAA,CAGD,iDACC,gBAAA,CACA,cAAA,CACA,uCAAA,CACA,gBAAA,CACA,YAAA,CACA,cAAA,CAEA,2CARD,iDASE,iBAAA,CAAA,CAGD,uDACC,uCAAA,CAGD,0DACC,+CAAA,CAKH,yCACC,WAAA,CACA,WAAA,CACA,WAAA,CAEA,sDACC,qCAAA,CACA,wCAAA,CAGD,yDACC,gBAAA,CACA,cAAA,CACA,mBAAA,CAGD,wDACC,iBAAA,CACA,UAAA,CACA,YAAA,CACA,WAAA,CACA,YAAA,CACA,qBAAA,CACA,sBAAA,CAIF,uCACC,YAAA,CACA,6BAAA,CACA,oBAAA,CACA,gBAAA",sourcesContent:['$sizes: ("400": ("count": 3, "marginTop": 66, "marginW": 8), "700": ("count": 4, "marginTop": 66, "marginW": 8), "1024": ("count": 5, "marginTop": 66, "marginW": 44), "1280": ("count": 4, "marginTop": 66, "marginW": 44), "1440": ("count": 5, "marginTop": 88, "marginW": 66), "1600": ("count": 6, "marginTop": 88, "marginW": 66), "2048": ("count": 7, "marginTop": 88, "marginW": 66), "2560": ("count": 8, "marginTop": 88, "marginW": 88), "3440": ("count": 9, "marginTop": 88, "marginW": 88), "max": ("count": 10, "marginTop": 88, "marginW": 88));\n\n.file-picker {\n\tdisplay: flex;\n\tflex-direction: column;\n\tpadding: 12px;\n\n\t&__content {\n\t\tdisplay: flex;\n\t\talign-items: flex-start;\n\t\tflex-grow: 1;\n\t\theight: 500px;\n\t}\n\n\t&__navigation {\n\t\tflex-basis: 200px;\n\t\toverflow: scroll;\n\t\tmargin-right: 8px;\n\t\tpadding-right: 8px;\n\t\theight: 100%;\n\n\t\t@media only screen and (max-width: 1200px) {\n\t\t\tflex-basis: 100px;\n\t\t}\n\n\t\t&--placeholder {\n\t\t\tbackground: var(--color-primary-light);\n\t\t\tborder-radius: var(--border-radius-large);\n\t\t}\n\n\t\t&__month {\n\t\t\tfont-weight: bold;\n\t\t\tfont-size: 16px;\n\t\t\tborder-radius: var(--border-radius-pill);\n\t\t\tpadding: 8px 16px;\n\t\t\tmargin: 4px 0;\n\t\t\tcursor: pointer;\n\n\t\t\t@media only screen and (max-width: 1200px) {\n\t\t\t\ttext-align: center;\n\t\t\t}\n\n\t\t\t&:hover {\n\t\t\t\tbackground: var(--color-background-dark);\n\t\t\t}\n\n\t\t\t&.selected {\n\t\t\t\tbackground: var(--color-primary-element-lighter);\n\t\t\t}\n\t\t}\n\t}\n\n\t&__file-list {\n\t\tflex-grow: 1;\n\t\tmin-width: 0;\n\t\theight: 100%;\n\n\t\t&--placeholder {\n\t\t\tbackground: var(--color-primary-light);\n\t\t\tborder-radius: var(--border-radius-large);\n\t\t}\n\n\t\t.section-header {\n\t\t\tfont-weight: bold;\n\t\t\tfont-size: 20px;\n\t\t\tpadding: 8px 0 4px 0;\n\t\t}\n\n\t\t:deep .empty-content {\n\t\t\tposition: absolute;\n\t\t\twidth: 100%;\n\t\t\tmargin-top: 0;\n\t\t\theight: 100%;\n\t\t\tdisplay: flex;\n\t\t\tflex-direction: column;\n\t\t\tjustify-content: center;\n\t\t}\n\t}\n\n\t&__actions {\n\t\tdisplay: flex;\n\t\tjustify-content: space-between;\n\t\tjustify-items: center;\n\t\tpadding-top: 16px;\n\t}\n}\n'],sourceRoot:""}]);const o=r},63159:(t,e,i)=>{"use strict";i.d(e,{Z:()=>a});const n={name:"AlertCircleIcon",emits:["click"],props:{title:{type:String},fillColor:{type:String,default:"currentColor"},size:{type:Number,default:24}}};const a=(0,i(51900).Z)(n,(function(){var t=this,e=t._self._c;return e("span",t._b({staticClass:"material-design-icon alert-circle-icon",attrs:{"aria-hidden":!t.title,"aria-label":t.title,role:"img"},on:{click:function(e){return t.$emit("click",e)}}},"span",t.$attrs,!1),[e("svg",{staticClass:"material-design-icon__svg",attrs:{fill:t.fillColor,width:t.size,height:t.size,viewBox:"0 0 24 24"}},[e("path",{attrs:{d:"M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"}},[t.title?e("title",[t._v(t._s(t.title))]):t._e()])])])}),[],!1,null,null,null).exports},57563:(t,e,i)=>{"use strict";i.d(e,{Z:()=>a});const n={name:"FolderMultipleImageIcon",emits:["click"],props:{title:{type:String},fillColor:{type:String,default:"currentColor"},size:{type:Number,default:24}}};const a=(0,i(51900).Z)(n,(function(){var t=this,e=t._self._c;return e("span",t._b({staticClass:"material-design-icon folder-multiple-image-icon",attrs:{"aria-hidden":!t.title,"aria-label":t.title,role:"img"},on:{click:function(e){return t.$emit("click",e)}}},"span",t.$attrs,!1),[e("svg",{staticClass:"material-design-icon__svg",attrs:{fill:t.fillColor,width:t.size,height:t.size,viewBox:"0 0 24 24"}},[e("path",{attrs:{d:"M7,15L11.5,9L15,13.5L17.5,10.5L21,15M22,4H14L12,2H6A2,2 0 0,0 4,4V16A2,2 0 0,0 6,18H22A2,2 0 0,0 24,16V6A2,2 0 0,0 22,4M2,6H0V11H0V20A2,2 0 0,0 2,22H20V20H2V6Z"}},[t.title?e("title",[t._v(t._s(t.title))]):t._e()])])])}),[],!1,null,null,null).exports},12571:(t,e,i)=>{"use strict";i.d(e,{Z:()=>a});const n={name:"ImagePlusIcon",emits:["click"],props:{title:{type:String},fillColor:{type:String,default:"currentColor"},size:{type:Number,default:24}}};const a=(0,i(51900).Z)(n,(function(){var t=this,e=t._self._c;return e("span",t._b({staticClass:"material-design-icon image-plus-icon",attrs:{"aria-hidden":!t.title,"aria-label":t.title,role:"img"},on:{click:function(e){return t.$emit("click",e)}}},"span",t.$attrs,!1),[e("svg",{staticClass:"material-design-icon__svg",attrs:{fill:t.fillColor,width:t.size,height:t.size,viewBox:"0 0 24 24"}},[e("path",{attrs:{d:"M18 15V18H15V20H18V23H20V20H23V18H20V15H18M13.3 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H19C20.1 3 21 3.9 21 5V13.3C20.4 13.1 19.7 13 19 13C17.9 13 16.8 13.3 15.9 13.9L14.5 12L11 16.5L8.5 13.5L5 18H13.1C13 18.3 13 18.7 13 19C13 19.7 13.1 20.4 13.3 21Z"}},[t.title?e("title",[t._v(t._s(t.title))]):t._e()])])])}),[],!1,null,null,null).exports},6151:(t,e,i)=>{"use strict";i.d(e,{Z:()=>k});var n=i(20629),a=i(63159),l=i(57563),r=i(15961),o=i(98171),s=i(74416),c=i(27125);var d=i(32114);const f={name:"CollectionContent",components:{AlertCircle:a.Z,FolderMultipleImage:l.Z,NcEmptyContent:r.SL,FilesListViewer:s.Z,File:c.Z},mixins:[o.Z,r.tq],props:{collection:{type:Object,default:()=>{}},collectionFileIds:{type:Array,required:!0},loading:{type:Boolean,default:!1},allowSelection:{type:Boolean,default:!0},error:{type:[Error,Number],default:null},semaphore:{type:d.Z,required:!0}},data:()=>({FolderIllustration:'<svg id="3ecf9745-447a-4766-8a86-6837975429df" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="729.47" height="695.09" viewBox="0 0 729.47 695.09" style="margin-left:calc(50% * (730 - 615) / 730)"><defs><linearGradient id="fc2ce546-a06c-4acb-8cca-fc7989cc5e45" x1="611.98" y1="687.2" x2="611.98" y2="258.73" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="gray" stop-opacity="0.25"/><stop offset="0.54" stop-color="gray" stop-opacity="0.12"/><stop offset="1" stop-color="gray" stop-opacity="0.1"/></linearGradient><linearGradient id="8de405ef-36e0-4554-af41-d0565e95cbca" x1="410.91" y1="358.56" x2="452.61" y2="86.08" gradientTransform="matrix(1.01, 0.13, -0.13, 1.02, 62.29, -41.05)" xlink:href="#fc2ce546-a06c-4acb-8cca-fc7989cc5e45"/><linearGradient id="90a47f5c-11a4-432e-bbe5-e819485e2974" x1="597.01" y1="453.03" x2="597.01" y2="138.64" gradientTransform="translate(140.76 -189.73) rotate(20.42)" xlink:href="#fc2ce546-a06c-4acb-8cca-fc7989cc5e45"/><linearGradient id="c3d8783b-6f33-4c65-b7a9-7a0b4c25dfb1" x1="756.62" y1="488.3" x2="772.25" y2="249.01" gradientTransform="matrix(0.26, 0.99, -1.02, 0.25, 910.43, -476.82)" xlink:href="#fc2ce546-a06c-4acb-8cca-fc7989cc5e45"/><linearGradient id="1441cd83-913d-413c-98d4-824021df009a" x1="310" y1="695.09" x2="310" y2="203.86" xlink:href="#fc2ce546-a06c-4acb-8cca-fc7989cc5e45"/><linearGradient id="4913d3bc-5f66-46f4-9c65-3645c89ed5d3" x1="545.79" y1="695.81" x2="545.79" y2="464.64" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#b3b3b3" stop-opacity="0.25"/><stop offset="0.54" stop-color="#b3b3b3" stop-opacity="0.1"/><stop offset="1" stop-color="#b3b3b3" stop-opacity="0.05"/></linearGradient><linearGradient id="0cf8a40c-444c-472e-8722-d672ac4b1674" x1="310.8" y1="580.62" x2="310.8" y2="375.85" xlink:href="#4913d3bc-5f66-46f4-9c65-3645c89ed5d3"/><clipPath id="f4edd298-8257-4895-a91b-ae15b3b0d94f" transform="translate(-235.26 -102.45)"><rect x="400.07" y="483.3" width="291.69" height="194.01" rx="8.85" ry="8.85" fill="#fff"/></clipPath></defs><title>folder</title><polygon points="618.97 687.2 513.53 687.2 513.53 258.73 710.42 258.73 618.97 687.2" fill="url(#fc2ce546-a06c-4acb-8cca-fc7989cc5e45)"/><polygon points="613.72 687.2 510.37 687.2 510.37 258.73 703.35 258.73 613.72 687.2" fill="#f5f5f5"/><rect x="249.88" y="158.45" width="439.19" height="168.85" transform="translate(-283.32 32.9) rotate(-15.62)" fill="url(#8de405ef-36e0-4554-af41-d0565e95cbca)"/><rect x="254.32" y="160.66" width="431.85" height="163.44" transform="translate(-283.15 33.09) rotate(-15.62)" fill="#f4f4f4"/><rect x="367.9" y="230.63" width="108.65" height="8.29" transform="translate(-282.88 19.88) rotate(-15.62)" fill="#f5f5f5"/><rect x="376.82" y="262.55" width="108.65" height="8.29" transform="translate(-291.14 23.46) rotate(-15.62)" fill="#fff"/><rect x="371.14" y="237.71" width="174.6" height="8.29" transform="translate(-283.45 29.89) rotate(-15.62)" fill="#fff"/><circle cx="329.58" cy="277.88" r="19.34" transform="translate(-297.9 -3.47) rotate(-15.62)" fill="#fff"/><rect x="376.38" y="210.25" width="441.26" height="171.17" transform="translate(-300.97 124.47) rotate(-20.42)" fill="url(#90a47f5c-11a4-432e-bbe5-e819485e2974)"/><rect x="381.03" y="214.81" width="431.85" height="163.44" transform="translate(-301.21 124.5) rotate(-20.42)" fill="#f7f7f7"/><rect x="494.14" y="288.83" width="108.65" height="8.29" transform="translate(-303.02 107.35) rotate(-20.42)" fill="#f5f5f5"/><rect x="505.71" y="319.89" width="108.65" height="8.29" transform="translate(-313.13 113.34) rotate(-20.42)" fill="#fff"/><rect x="497.85" y="292.85" width="174.6" height="8.29" transform="matrix(0.94, -0.35, 0.35, 0.94, -302.12, 120.41)" fill="#fff"/><circle cx="459.76" cy="343.69" r="19.34" transform="translate(-326.29 79.59) rotate(-20.42)" fill="#fff"/><rect x="646.89" y="150.88" width="172.17" height="440.14" transform="translate(3.97 925.06) rotate(-79.9)" fill="url(#c3d8783b-6f33-4c65-b7a9-7a0b4c25dfb1)"/><rect x="515.81" y="288.22" width="431.85" height="163.44" transform="translate(-159.05 -225.04) rotate(10.1)" fill="#fafafa"/><rect x="687.63" y="287.92" width="8.29" height="108.65" transform="translate(-1.75 860.83) rotate(-79.9)" fill="#f5f5f5"/><rect x="681.81" y="320.56" width="8.29" height="108.65" transform="translate(-38.67 882.02) rotate(-79.9)" fill="#fff"/><rect x="717.18" y="277.05" width="8.29" height="174.6" transform="translate(0.86 908.15) rotate(-79.9)" fill="#fff"/><circle cx="589.6" cy="340.88" r="19.34" transform="translate(-84.66 759.11) rotate(-79.9)" fill="#fff"/><polygon points="171.78 253.69 100.61 203.86 2.07 203.86 2.07 253.69 2.07 278.1 2.07 695.09 617.93 695.09 617.93 253.69 171.78 253.69" fill="url(#1441cd83-913d-413c-98d4-824021df009a)"/><polygon points="174.44 258.73 104.36 210.36 7.34 210.36 7.34 258.73 7.34 282.43 7.34 687.2 613.72 687.2 613.72 258.73 174.44 258.73" fill="#fff"/><path d="M711.54,688.53a7.25,7.25,0,0,1-7.21,7.28H387.26a7.25,7.25,0,0,1-7.21-7.28V471.93a7.25,7.25,0,0,1,7.21-7.28H704.33a7.25,7.25,0,0,1,7.21,7.28" transform="translate(-235.26 -102.45)" fill="url(#4913d3bc-5f66-46f4-9c65-3645c89ed5d3)"/><path d="M707.81,685a7,7,0,0,1-7,7H391.05a7,7,0,0,1-7-7V475.62a7,7,0,0,1,7-7H700.77a7,7,0,0,1,7,7" transform="translate(-235.26 -102.45)" fill="#fff"/><g id="114cebd5-d8fe-4021-8e49-fe55d7dac6be" data-name="&lt;Rectangle&gt;"><rect x="161.12" y="375.85" width="299.37" height="204.76" rx="8.85" ry="8.85" fill="url(#0cf8a40c-444c-472e-8722-d672ac4b1674)"/></g><rect x="164.8" y="380.84" width="291.69" height="194.01" rx="8.85" ry="8.85" fill="#fff"/><g clip-path="url(#f4edd298-8257-4895-a91b-ae15b3b0d94f)"><path d="M383.84,675.53l81.44-93.31a16.21,16.21,0,0,1,22.94-1.5L511,600.84a16.21,16.21,0,0,0,21.16.25l69.7-58.58A16.21,16.21,0,0,1,624.3,544l85.53,94.14a16.21,16.21,0,0,1,4.15,9.47l3.3,37.13a16.21,16.21,0,0,1-16.15,17.65H396.06a16.21,16.21,0,0,1-16.2-15.72h0A16.21,16.21,0,0,1,383.84,675.53Z" transform="translate(-235.26 -102.45)" fill="#6c63ff"/></g><circle cx="199.93" cy="411.95" r="18.06" fill="#ff5252"/></svg>',appContent:document.getElementById("app-content-vue")}),computed:{...(0,n.Se)(["files"])},methods:{openViewer(t){const e=this.files[t];OCA.Viewer.open({fileInfo:e,list:this.collectionFileIds.map((t=>this.files[t])).filter((t=>!t.sectionHeader)),loadMore:e.loadMore?async()=>await e.loadMore(!0):()=>[],canLoop:e.canLoop})}}};var p=i(93379),h=i.n(p),A=i(7795),g=i.n(A),m=i(90569),u=i.n(m),C=i(3565),y=i.n(C),x=i(19216),b=i.n(x),_=i(44589),v=i.n(_),w=i(93538),F={};F.styleTagTransform=v(),F.setAttributes=y(),F.insert=u().bind(null,"head"),F.domAPI=g(),F.insertStyleElement=b();h()(w.Z,F);w.Z&&w.Z.locals&&w.Z.locals;const k=(0,i(51900).Z)(f,(function(){var t=this,e=t._self._c;return void 0===t.collection&&!t.loading||404===t.error?e("NcEmptyContent",{staticClass:"empty-content-with-illustration",attrs:{title:t.t("photos","This collection does not exist")}},[e("FolderMultipleImage",{attrs:{slot:"icon"},slot:"icon"})],1):t.error?e("NcEmptyContent",{attrs:{title:t.t("photos","An error occurred")}},[e("AlertCircle",{attrs:{slot:"icon"},slot:"icon"})],1):e("div",{staticClass:"collection"},[t._t("header",null,{selectedFileIds:t.selectedFileIds,resetSelection:t.resetSelection}),t._v(" "),0!==t.collectionFileIds.length||t.loading?t._e():t._t("empty-content"),t._v(" "),void 0!==t.collection?e("FilesListViewer",{staticClass:"collection__media",attrs:{"container-element":t.appContent,"file-ids":t.collectionFileIds,"base-height":t.isMobile?120:200,loading:t.loading},scopedSlots:t._u([{key:"default",fn:function(i){let{file:n,visibility:a}=i;return e("File",{attrs:{file:t.files[n.id],"allow-selection":t.allowSelection,selected:!0===t.selection[n.id],visibility:a,semaphore:t.semaphore},on:{click:t.openViewer,"select-toggled":t.onFileSelectToggle}})}}],null,!1,1530500134)}):t._e()],2)}),[],!1,null,"2d83c546",null).exports},72554:(t,e,i)=>{"use strict";i.d(e,{Z:()=>B});var n=i(20629),a=i(15961),l=i(52587),r=i(80351),o=i.n(r),s=i(12571),c=i(74416),d=i(27125),f=i(66951),p=i(98171),h=i(28391),A=i(81090),g=i(3301);const m={name:"FilesPicker",components:{File:d.Z,FilesListViewer:c.Z,ImagePlus:s.Z,NcButton:a.P2,NcLoadingIcon:a.lb,UploadPicker:l.e},filters:{dateMonthAndYear:t=>o()(t,"YYYYMM").format("MMMM YYYY")},mixins:[f.Z,h.Z,p.Z,A.Z],props:{destination:{type:String,required:!0},blacklistIds:{type:Array,default:()=>[]},loading:{type:Boolean,default:!1}},data:()=>({allowedMimes:g.ZP,targetMonth:null,uploadContext:{route:"albumpicker"}}),computed:{...(0,n.Se)(["files"])},watch:{monthsList(t){null===this.targetMonth&&(this.targetMonth=t[0])}},methods:{getFiles(){this.fetchFiles("",{},this.blacklistIds)},refreshFiles(){this.fetchFiles("",{firstResult:0},[...this.blacklistIds,...this.fetchedFileIds],!0)},emitPickedEvent(){this.$emit("files-picked",this.selectedFileIds)}}};var u=i(93379),C=i.n(u),y=i(7795),x=i.n(y),b=i(90569),_=i.n(b),v=i(3565),w=i.n(v),F=i(19216),k=i.n(F),Z=i(44589),M=i.n(Z),I=i(98764),T={};T.styleTagTransform=M(),T.setAttributes=w(),T.insert=_().bind(null,"head"),T.domAPI=x(),T.insertStyleElement=k();C()(I.Z,T);I.Z&&I.Z.locals&&I.Z.locals;const B=(0,i(51900).Z)(m,(function(){var t=this,e=t._self._c;return e("div",{staticClass:"file-picker"},[e("div",{staticClass:"file-picker__content"},[e("div",{staticClass:"file-picker__navigation",class:{"file-picker__navigation--placeholder":0===t.monthsList.length}},t._l(t.monthsList,(function(i){return e("div",{key:i,staticClass:"file-picker__navigation__month",class:{selected:t.targetMonth===i},on:{click:function(e){t.targetMonth=i}}},[t._v("\n\t\t\t\t"+t._s(t._f("dateMonthAndYear")(i))+"\n\t\t\t")])})),0),t._v(" "),e("FilesListViewer",{staticClass:"file-picker__file-list",class:{"file-picker__file-list--placeholder":0===t.monthsList.length},attrs:{"file-ids-by-section":t.fileIdsByMonth,"empty-message":t.t("photos","There are no photos or videos yet!"),sections:t.monthsList,loading:t.loadingFiles,"base-height":100,"section-header-height":50,"scroll-to-section":t.targetMonth},on:{"need-content":t.getFiles},scopedSlots:t._u([{key:"default",fn:function(i){let{file:n,height:a,visibility:l}=i;return[n.sectionHeader?e("h3",{staticClass:"section-header",style:{height:"".concat(a,"px")},attrs:{id:"file-picker-section-header-".concat(n.id)}},[t._v("\n\t\t\t\t\t"+t._s(t._f("dateMonthAndYear")(n.id))+"\n\t\t\t\t")]):e("File",{attrs:{file:t.files[n.id],"allow-selection":!0,selected:!0===t.selection[n.id],visibility:l,semaphore:t.semaphore},on:{"select-toggled":t.onFileSelectToggle}})]}}])})],1),t._v(" "),e("div",{staticClass:"file-picker__actions"},[e("UploadPicker",{attrs:{accept:t.allowedMimes,context:t.uploadContext,destination:t.photosLocation,multiple:!0},on:{uploaded:t.refreshFiles}}),t._v(" "),e("NcButton",{attrs:{type:"primary",disabled:t.loading||0===t.selectedFileIds.length},on:{click:t.emitPickedEvent},scopedSlots:t._u([{key:"icon",fn:function(){return[t.loading?t._e():e("ImagePlus"),t._v(" "),t.loading?e("NcLoadingIcon"):t._e()]},proxy:!0}])},[t._v("\n\t\t\t"+t._s(t.t("photos","Add to {destination}",{destination:t.destination}))+"\n\t\t")])],1)])}),[],!1,null,"174ae58a",null).exports},80950:()=>{},46601:()=>{},89214:()=>{},96419:()=>{},56353:()=>{},8623:()=>{},7748:()=>{},85568:()=>{},69386:()=>{},31616:()=>{},56619:()=>{},77108:()=>{}}]);
//# sourceMappingURL=photos-src_components_Collection_CollectionContent_vue-src_components_FilesPicker_vue.js.map?v=af75a75e118874e00099