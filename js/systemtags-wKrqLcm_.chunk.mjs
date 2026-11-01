import{a as w,d as T,l as p}from"./AllowedMimes-Ddfx6HXR.chunk.mjs";import{a as u,r as g,d as b,p as m,m as F}from"./files-B5mgfLvi.chunk.mjs";import{g as D}from"./DavRequest-DDKnInR_.chunk.mjs";import{r as l}from"./icons-C9jNe4Lo.chunk.mjs";async function $(i,n={}){return(await u.getDirectoryContents("/systemtags-assigned/image",{data:`<?xml version="1.0"?>
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
			</d:propfind>`,details:!0,...n})).data.filter(s=>!!s.props?.id).map(s=>{const o={...s.props,fileid:s.props?.id};return g({...s,props:o},"/systemtags-assigned/image")})}async function A(i,n={}){return n={headers:{method:"REPORT"},data:`<?xml version="1.0"?>
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
			</oc:filter-files>`,details:!0,...n},(await u.getDirectoryContents(b,n)).data.map(s=>g(s)).filter(s=>s.mime&&w.indexOf(s.mime)!==-1)}const V=T("systemtags",()=>{const i=l({}),n=l({}),s=l({});function o(e){e.sort((t,a)=>m(t,a,"display-name")).forEach(t=>{i.value[t.id]=t,n.value[t.attributes["display-name"]]=t.id})}function c(e){delete n.value[i.value[e].attributes["display-name"]],delete i.value[e]}function d(e,t){if(t.length===0){c(e);return}const a=t.sort((r,x)=>m(r,x,"files-assigned"));p.debug(`Overwrite list, id: ${e}`,{list:a}),s.value[e]=a.map(r=>r.fileid)}function f(e,t){s.value[e]=(s.value[e]??[]).filter(a=>a!==t)}async function v(e,t){try{const a=await A(e,{signal:t});d(e,a),F().appendFiles(a)}catch(a){p.error(`Failed to get tag content, id: ${e}`,{error:a})}}async function y(e){o(await $("",{signal:e}))}function h(e){return n.value[e]}return{tags:i,names:n,tagsFiles:s,updateTags:o,removeTag:c,removeTagFile:f,updateTag:d,fetchTagFiles:v,fetchAllTags:y,tagId:h}});export{V as u};
//# sourceMappingURL=systemtags-wKrqLcm_.chunk.mjs.map
