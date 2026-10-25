import{a as w,d as T,l as p}from"./AllowedMimes-BJni7RwI.chunk.mjs";import{a as u,d as b}from"./dav-Du05RFzW.chunk.mjs";import{d as f,o as m,h as F}from"./files-BOeQSxkH.chunk.mjs";import{g as D}from"./DavRequest-GWT1AoUM.chunk.mjs";import{r as l}from"./icons-CFiR7S_v.chunk.mjs";async function $(n,o={}){return(await f.getDirectoryContents("/systemtags-assigned/image",{data:`<?xml version="1.0"?>
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
			</d:propfind>`,details:!0,...o})).data.filter(t=>!!t.props?.id).map(t=>{const i={...t.props,fileid:t.props?.id};return u({...t,props:i},"/systemtags-assigned/image")})}async function A(n,o={}){return o={headers:{method:"REPORT"},data:`<?xml version="1.0"?>
			<oc:filter-files
				xmlns:d="DAV:"
				xmlns:oc="http://owncloud.org/ns"
				xmlns:nc="http://nextcloud.org/ns"
				xmlns:ocs="http://open-collaboration-services.org/ns">
				<d:prop>
					${D()}
				</d:prop>
				<oc:filter-rules>
					<oc:systemtag>${n}</oc:systemtag>
				</oc:filter-rules>
			</oc:filter-files>`,details:!0,...o},(await f.getDirectoryContents(b,o)).data.map(t=>u(t)).filter(t=>t.mime&&w.indexOf(t.mime)!==-1)}const I=T("systemtags",()=>{const n=l({}),o=l({}),t=l({});function i(e){e.sort((s,a)=>m(s,a,"display-name")).forEach(s=>{n.value[s.id]=s,o.value[s.attributes["display-name"]]=s.id})}function c(e){delete o.value[n.value[e].attributes["display-name"]],delete n.value[e]}function d(e,s){if(s.length===0){c(e);return}const a=s.sort((r,x)=>m(r,x,"files-assigned"));p.debug(`Overwrite list, id: ${e}`,{list:a}),t.value[e]=a.map(r=>r.fileid)}function g(e,s){t.value[e]=(t.value[e]??[]).filter(a=>a!==s)}async function v(e,s){try{const a=await A(e,{signal:s});d(e,a),F().appendFiles(a)}catch(a){p.error(`Failed to get tag content, id: ${e}`,{error:a})}}async function y(e){i(await $("",{signal:e}))}function h(e){return o.value[e]}return{tags:n,names:o,tagsFiles:t,updateTags:i,removeTag:c,removeTagFile:g,updateTag:d,fetchTagFiles:v,fetchAllTags:y,tagId:h}});export{I as u};
//# sourceMappingURL=systemtags-Byru7qWj.chunk.mjs.map
