import{a as b,d as w,l as m}from"./index-B88Z0kTr.chunk.mjs";import{r as d,V as o}from"./index-CqCwDYb2.chunk.mjs";import{a as g,d as T}from"./dav-B4ZDSy0r.chunk.mjs";import{d as f,b as u,u as D}from"./files-BXRSxNzW.chunk.mjs";import{g as F}from"./DavRequest-B2hDTPKZ.chunk.mjs";async function $(i,a={}){return(await f.getDirectoryContents("/systemtags-assigned/image",{data:`<?xml version="1.0"?>
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
			</d:propfind>`,details:!0,...a})).data.filter(t=>!!t.props?.id).map(t=>{const r={...t.props,fileid:t.props?.id};return g({...t,props:r},"/systemtags-assigned/image")})}async function A(i,a={}){return a={headers:{method:"REPORT"},data:`<?xml version="1.0"?>
			<oc:filter-files
				xmlns:d="DAV:"
				xmlns:oc="http://owncloud.org/ns"
				xmlns:nc="http://nextcloud.org/ns"
				xmlns:ocs="http://open-collaboration-services.org/ns">
				<d:prop>
					${F()}
				</d:prop>
				<oc:filter-rules>
					<oc:systemtag>${i}</oc:systemtag>
				</oc:filter-rules>
			</oc:filter-files>`,details:!0,...a},(await f.getDirectoryContents(T,a)).data.map(t=>g(t)).filter(t=>t.mime&&b.indexOf(t.mime)!==-1)}const I=w("systemtags",()=>{const i=d({}),a=d({}),t=d({});function r(s){s.sort((e,n)=>u(e,n,"display-name")).forEach(e=>{o.set(i.value,e.id,e),o.set(a.value,e.attributes["display-name"],e.id)})}function c(s){o.delete(a.value,i.value[s].attributes["display-name"]),o.delete(i.value,s)}function p(s,e){if(e.length===0){c(s);return}const n=e.sort((l,x)=>u(l,x,"files-assigned"));m.debug(`Overwrite list, id: ${s}`,{list:n}),o.set(t.value,s,n.map(l=>l.fileid))}async function y(s,e){try{const n=await A(s,{signal:e});p(s,n),D().appendFiles(n)}catch(n){m.error(`Failed to get tag content, id: ${s}`,{error:n})}}async function v(s){r(await $("",{signal:s}))}function h(s){return a.value[s]}return{tags:i,names:a,tagsFiles:t,updateTags:r,removeTag:c,updateTag:p,fetchTagFiles:y,fetchAllTags:v,tagId:h}});export{I as u};
//# sourceMappingURL=systemtags-BMt8rS4x.chunk.mjs.map
