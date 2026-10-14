import{b,d as w,l as p}from"./AllowedMimes-BEWeHYuJ.chunk.mjs";import{a as u,d as T}from"./dav--9zNVXiK.chunk.mjs";import{d as f,p as m,u as F}from"./files-DckCYSaD.chunk.mjs";import{g as D}from"./DavRequest-CbjrIjJe.chunk.mjs";import{p as l}from"./icons-BQaqLn_a.chunk.mjs";async function $(o,n={}){return(await f.getDirectoryContents("/systemtags-assigned/image",{data:`<?xml version="1.0"?>
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
			</d:propfind>`,details:!0,...n})).data.filter(t=>!!t.props?.id).map(t=>{const i={...t.props,fileid:t.props?.id};return u({...t,props:i},"/systemtags-assigned/image")})}async function A(o,n={}){return n={headers:{method:"REPORT"},data:`<?xml version="1.0"?>
			<oc:filter-files
				xmlns:d="DAV:"
				xmlns:oc="http://owncloud.org/ns"
				xmlns:nc="http://nextcloud.org/ns"
				xmlns:ocs="http://open-collaboration-services.org/ns">
				<d:prop>
					${D()}
				</d:prop>
				<oc:filter-rules>
					<oc:systemtag>${o}</oc:systemtag>
				</oc:filter-rules>
			</oc:filter-files>`,details:!0,...n},(await f.getDirectoryContents(T,n)).data.map(t=>u(t)).filter(t=>t.mime&&b.indexOf(t.mime)!==-1)}const I=w("systemtags",()=>{const o=l({}),n=l({}),t=l({});function i(e){e.sort((s,a)=>m(s,a,"display-name")).forEach(s=>{o.value[s.id]=s,n.value[s.attributes["display-name"]]=s.id})}function c(e){delete n.value[o.value[e].attributes["display-name"]],delete o.value[e]}function d(e,s){if(s.length===0){c(e);return}const a=s.sort((r,x)=>m(r,x,"files-assigned"));p.debug(`Overwrite list, id: ${e}`,{list:a}),t.value[e]=a.map(r=>r.fileid)}function g(e,s){t.value[e]=(t.value[e]??[]).filter(a=>a!==s)}async function v(e,s){try{const a=await A(e,{signal:s});d(e,a),F().appendFiles(a)}catch(a){p.error(`Failed to get tag content, id: ${e}`,{error:a})}}async function y(e){i(await $("",{signal:e}))}function h(e){return n.value[e]}return{tags:o,names:n,tagsFiles:t,updateTags:i,removeTag:c,removeTagFile:g,updateTag:d,fetchTagFiles:v,fetchAllTags:y,tagId:h}});export{I as u};
//# sourceMappingURL=systemtags-mx9TeHVF.chunk.mjs.map
