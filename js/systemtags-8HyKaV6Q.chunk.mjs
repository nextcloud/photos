import{b as h,d as b,l as p}from"./index-BryCpKr0.chunk.mjs";import{a as u,d as w}from"./dav-Vt8ZXmmv.chunk.mjs";import{d as g,p as m,u as T}from"./files-CcMYUI1-.chunk.mjs";import{g as D}from"./DavRequest-BWSmtv4-.chunk.mjs";import{p as l}from"./icons-DY4h9raQ.chunk.mjs";async function F(i,a={}){return(await g.getDirectoryContents("/systemtags-assigned/image",{data:`<?xml version="1.0"?>
			<d:propfind  xmlns:d="DAV:"
				xmlns:oc="http://owncloud.org/ns" xmlns:nc="http://nextcloud.org/ns">
				<d:prop>
					<oc:id />
					<oc:display-name />
					<oc:user-visible />
					<oc:user-assignable />
					<oc:can-assign />
					<nc:files-assigned/>
					<nc:reference-fileid/>
				</d:prop>
			</d:propfind>`,details:!0,...a})).data.filter(t=>!!t.props?.id).map(t=>{const o={...t.props,fileid:t.props?.id};return u({...t,props:o},"/systemtags-assigned/image")})}async function $(i,a={}){return a={headers:{method:"REPORT"},data:`<?xml version="1.0"?>
			<oc:filter-files
				xmlns:d="DAV:"
				xmlns:oc="http://owncloud.org/ns"
				xmlns:nc="http://nextcloud.org/ns"
				xmlns:ocs="http://open-collaboration-services.org/ns">
				<d:prop>
					${D()}
				</d:prop>
				<oc:filter-rules>
					<oc:systemtag>${i}</oc:systemtag>
				</oc:filter-rules>
			</oc:filter-files>`,details:!0,...a},(await g.getDirectoryContents(w,a)).data.map(t=>u(t)).filter(t=>t.mime&&h.indexOf(t.mime)!==-1)}const V=b("systemtags",()=>{const i=l({}),a=l({}),t=l({});function o(s){s.sort((e,n)=>m(e,n,"display-name")).forEach(e=>{i.value[e.id]=e,a.value[e.attributes["display-name"]]=e.id})}function d(s){delete a.value[i.value[s].attributes["display-name"]],delete i.value[s]}function c(s,e){if(e.length===0){d(s);return}const n=e.sort((r,x)=>m(r,x,"files-assigned"));p.debug(`Overwrite list, id: ${s}`,{list:n}),t.value[s]=n.map(r=>r.fileid)}async function f(s,e){try{const n=await $(s,{signal:e});c(s,n),T().appendFiles(n)}catch(n){p.error(`Failed to get tag content, id: ${s}`,{error:n})}}async function y(s){o(await F("",{signal:s}))}function v(s){return a.value[s]}return{tags:i,names:a,tagsFiles:t,updateTags:o,removeTag:d,updateTag:c,fetchTagFiles:f,fetchAllTags:y,tagId:v}});export{V as u};
//# sourceMappingURL=systemtags-8HyKaV6Q.chunk.mjs.map
