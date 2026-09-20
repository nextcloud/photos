import{a as $}from"./dav-B4ZDSy0r.chunk.mjs";import{i as P,t as s,r as C,V as w}from"./index-CqCwDYb2.chunk.mjs";import{d as f,f as x,u as D,S as O,s as v,a as J}from"./files-BXRSxNzW.chunk.mjs";import{l as h,d as _}from"./index-B88Z0kTr.chunk.mjs";import{i as q}from"./index-BBYxZUGt.chunk.mjs";function R(t=[]){return`<?xml version="1.0"?>
			<d:propfind xmlns:d="DAV:"
				xmlns:oc="http://owncloud.org/ns"
				xmlns:nc="http://nextcloud.org/ns"
				xmlns:ocs="http://open-collaboration-services.org/ns">
				<d:prop>
					<nc:last-photo />
					<nc:nbItems />
					${t.join("")}
				</d:prop>
			</d:propfind>`}function M(t=[]){return`<?xml version="1.0"?>
			<d:propfind xmlns:d="DAV:"
				xmlns:oc="http://owncloud.org/ns"
				xmlns:nc="http://nextcloud.org/ns"
				xmlns:ocs="http://open-collaboration-services.org/ns">
				<d:prop>
					<d:getcontentlength />
					<d:getcontenttype />
					<d:getetag />
					<d:getlastmodified />
					<d:resourcetype />
					<nc:metadata-blurhash />
					<nc:metadata-photos-size />
					<nc:metadata-photos-original_date_time />
					<nc:metadata-files-live-photo />
					<nc:has-preview />
					<nc:hidden />
					<oc:favorite />
					<oc:fileid />
					<oc:permissions />
					${t.join(`
					`)}
				</d:prop>
			</d:propfind>`}async function G(t,n,c=[],p=f){try{const r=await p.stat(t,{data:R(c),details:!0,...n});return h.debug("[Collections] Fetched a collection: ",{data:r.data}),B(r.data,t.split("/").slice(0,-1).join("/"))}catch(r){if(r instanceof DOMException&&r.code===r.ABORT_ERR)return null;throw r}}async function U(t,n={},c=[],p=f){try{const r=await p.getDirectoryContents(t,{data:R(c),details:!0,...n});return h.debug(`[Collections] Fetched ${r.data.length} collections: `,{data:r.data}),r.data.filter(d=>d.filename!==t).map(d=>B(d,t))}catch(r){if(r instanceof DOMException&&r.code===r.ABORT_ERR)return[];throw r}}function B(t,n){t.props.collaborators===void 0||t.props.collaborators===""?t.props.collaborators=[]:typeof t.props.collaborators.collaborator=="object"&&(Array.isArray(t.props.collaborators.collaborator)?t.props.collaborators=t.props.collaborators.collaborator:t.props.collaborators=[t.props.collaborators.collaborator]);const c=JSON.parse(t.props.dateRange?.replace(/&quot;/g,'"')??"{}"),p=Math.floor(Date.now()/1e3),r=Number.isFinite(c.start)?c.start:p,d=Number.isFinite(c.end)?c.end:p,m={startDate:x(new Date(r*1e3)),endDate:x(new Date(d*1e3))};return m.startDate===m.endDate?t.props.date=m.startDate:t.props.date=s("photos","{startDate} to {endDate}",m),t.props.filters=JSON.parse(t.props.filters??"{}"),$(t,n)}async function Y(t,n,c=[],p=f){try{const r=await p.getDirectoryContents(t,{data:M(c),details:!0,...n}),d=t.split("/").slice(0,-1).join("/"),m=r.data.map(b=>$(b,d,P("dav"))).filter(b=>b.fileid!==void 0);return h.debug(`[Collections] Fetched ${m.length} new files: `,{fetchedFiles:m}),m}catch(r){if(r instanceof DOMException&&r.code===r.ABORT_ERR)return[];throw h.error("Error fetching collection files",{error:r}),r}}const K=["<nc:photos-collection-file-original-filename />"],Q=_("collections",()=>{const t=C({}),n=C({});function c(e){return Object.values(t.value).filter(o=>o.root===e).reduce((o,a)=>({...o,[a.root+a.path]:a}),{})}function p(e){t.value={...t.value,...e.reduce((o,a)=>({...o,[a.root+a.path]:a}),{})}}function r(e){w.set(t.value,e.root+e.path,e)}function d(e){e.forEach(o=>{w.delete(t.value,o),w.delete(n.value,o)})}function m(e,o=[]){n.value={...n.value,[e]:o};const a=t.value[e];a!==void 0&&(a.attributes.nbItems=o.length,a.attributes["last-photo"]=Number.parseInt(o[o.length-1]))}function b(e,o){const a=n.value[e]||[];n.value={...n.value,[e]:[...new Set([...a,...o])]};const l=t.value[e];l.attributes.nbItems+=o.length,l.attributes["last-photo"]=Number.parseInt(o[o.length-1])}function N(e,o){n.value={...n.value,[e]:n.value[e].filter(l=>!o.includes(l))};const a=t.value[e];if(a.attributes.nbItems-=o.length,o.includes(a.attributes["last-photo"].toString())){const l=n.value[e];a.attributes["last-photo"]=Number.parseInt(l[l.length])}}async function j(e,o){const a=new O(5);b(e,o);const l=o.map(async u=>{const i=D().files[u],F=t.value[e],y=await a.acquire();try{await f.copyFile(i.root+i.path,`${F.root+F.path}/${i.basename}`)}catch(g){q(g)&&g.response?.status!==409&&(N(e,[u]),h.error(s("photos","Failed to add {fileBaseName} to collection {collectionFileName}",{fileBaseName:i.basename,collectionFileName:e}),{error:g}),v(s("photos","Failed to add {fileBaseName} to collection {collectionFileName}",{fileBaseName:i.basename,collectionFileName:e})))}finally{a.release(y)}});return Promise.all(l)}async function A(e,o){const a=new O(5);N(e,o);const l=o.map(async u=>{const i=D().files[u],F=await a.acquire();try{await f.deleteFile(i.root+i.path)}catch(y){b(e,[u]),h.error(s("photos","Failed to delete {fileBaseName}",{fileBaseName:i.basename}),{error:y}),v(s("photos","Failed to delete {fileBaseName}",{fileBaseName:i.basename}))}finally{a.release(F)}});return Promise.all(l)}async function E(e){try{return await f.createDirectory(e.root+e.path),p([e]),e}catch(o){h.error(s("photos","Failed to create {collectionFileName}",{collectionFileName:e.path}),{error:o}),v(s("photos","Failed to create {collectionFileName}",{collectionFileName:e.path}))}}async function I(e,o){const a=t.value[e],l=a.clone();l.rename(o);try{return p([l]),m(l.root+l.path,n.value[e]),await f.moveFile(a.root+a.path,a.root+l.path,{overwrite:!1}),d([e]),l}catch(u){return d([a.root+l.path]),h.error(s("photos","Failed to rename {currentCollectionFileName} to {newCollectionFileName}",{currentCollectionFileName:e,newCollectionFileName:l.path}),{error:u}),v(s("photos","Failed to rename {currentCollectionFileName} to {newCollectionFileName}",{currentCollectionFileName:e,newCollectionFileName:l.path})),a}}async function S(e,o){const a=t.value[e],l=a.clone();l.update(o);const u=Object.entries(o).map(([i,F])=>{switch(typeof F){case"string":return`<nc:${i}>${F}</nc:${i}>`;case"object":return`<nc:${i}>${JSON.stringify(F)}</nc:${i}>`;default:return""}}).join();try{return r(l),await f.customRequest(a.root+a.path,{method:"PROPPATCH",data:`<?xml version="1.0"?>
							<d:propertyupdate xmlns:d="DAV:"
								xmlns:oc="http://owncloud.org/ns"
								xmlns:nc="http://nextcloud.org/ns"
								xmlns:ocs="http://open-collaboration-services.org/ns">
							<d:set>
								<d:prop>
									${u}
								</d:prop>
							</d:set>
							</d:propertyupdate>`}),l}catch(i){return r(a),h.error(s("photos","Failed to update properties of {collectionFileName} with {properties}",{collectionFileName:e,properties:JSON.stringify(o)}),{error:i}),v(s("photos","Failed to update properties of {collectionFileName} with {properties}",{collectionFileName:e,properties:JSON.stringify(o)})),a}}async function T(e){try{const o=e.split("/")[3],a=e.split("/").splice(4).join("/");let l=s("photos","Delete collection");switch(o){case"albums":l=s("photos","Delete album");break;case"sharedalbums":l=s("photos","Leave shared album");break}if(!await V(l,s("photos","Are you sure you want to delete {collectionName}? This action cannot be undone.",{collectionName:a})))return!1;const u=t.value[e];return await f.deleteFile(u.root+u.path),d([e]),!0}catch(o){return h.error(s("photos","Failed to delete {collectionFileName}",{collectionFileName:e}),{error:o}),v(s("photos","Failed to delete {collectionFileName}",{collectionFileName:e})),!1}}return{collections:t,collectionsFiles:n,collectionsWithPrefix:c,addCollections:p,addFileIdsToCollection:b,removeFileIdsFromCollection:N,removeCollections:d,setCollectionFiles:m,addFilesToCollection:j,removeFilesFromCollection:A,createCollection:E,renameCollection:I,updateCollection:S,deleteCollection:T}});async function V(t,n){return await J({name:t,text:n,severity:"warning"})}export{Y as a,G as b,K as c,U as f,Q as u};
//# sourceMappingURL=collections-dae_FaoK.chunk.mjs.map
