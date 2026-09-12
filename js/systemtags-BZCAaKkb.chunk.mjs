import{b,d as w,H as m,l as u}from"./AllowedMimes-DTRijevd.chunk.mjs";import{a as p,d as T}from"./dav-TIu3ej-H.chunk.mjs";import{d as g,u as F}from"./files-yY0TKgdV.chunk.mjs";import{g as D}from"./DavRequest-BBVySfj1.chunk.mjs";import{p as r}from"./icons-BpXyo97h.chunk.mjs";async function $(i,n={}){return(await g.getDirectoryContents("/systemtags-assigned/image",{data:`<?xml version="1.0"?>
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
			</d:propfind>`,details:!0,...n})).data.map(e=>p(e,"/systemtags-assigned/image"))}async function A(i,n={}){return n={headers:{method:"REPORT"},data:`<?xml version="1.0"?>
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
			</oc:filter-files>`,details:!0,...n},(await g.getDirectoryContents(T,n)).data.map(e=>p(e)).filter(e=>e.mime&&b.indexOf(e.mime)!==-1)}const H=w("systemtags",()=>{const i=r({}),n=r({}),e=r({});function l(t){t.sort((s,a)=>m(s,a,"display-name")).forEach(s=>{i.value[s.attributes.id]=s,n.value[s.attributes["display-name"]]=s.attributes.id})}function c(t){delete n.value[i.value[t].attributes["display-name"]],delete i.value[t]}function d(t,s){if(s.length===0){c(t);return}const a=s.sort((o,x)=>m(o,x,"files-assigned"));u.debug(`Overwrite list, id: ${t}`,{list:a}),e.value[t]=a.map(o=>o.fileid)}function f(t,s){e.value[t]=(e.value[t]??[]).filter(a=>a!==s)}async function v(t,s){try{const a=await A(t,{signal:s});d(t,a),F().appendFiles(a)}catch(a){u.error(`Failed to get tag content, id: ${t}`,{error:a})}}async function y(t){l(await $("",{signal:t}))}function h(t){return n.value[t]}return{tags:i,names:n,tagsFiles:e,updateTags:l,removeTag:c,removeTagFile:f,updateTag:d,fetchTagFiles:v,fetchAllTags:y,tagId:h}});export{H as u};
//# sourceMappingURL=systemtags-BZCAaKkb.chunk.mjs.map
