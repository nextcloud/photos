import{a as $}from"./dav--9zNVXiK.chunk.mjs";import{l as h,t as p,d as P}from"./AllowedMimes-BEWeHYuJ.chunk.mjs";import{f as J}from"./index-D2NRa5x8.chunk.mjs";import{d as F,f as C,u as x,S as D,s as g,g as _}from"./files-DckCYSaD.chunk.mjs";import{i as q}from"./index-Dp_mJkaP.chunk.mjs";import{p as y,L as O}from"./icons-BQaqLn_a.chunk.mjs";import{u as M}from"./useAbortController-B8y6X0qJ.chunk.mjs";function R(t=[]){return`<?xml version="1.0"?>
			<d:propfind xmlns:d="DAV:"
				xmlns:oc="http://owncloud.org/ns"
				xmlns:nc="http://nextcloud.org/ns"
				xmlns:ocs="http://open-collaboration-services.org/ns">
				<d:prop>
					<nc:last-photo />
					<nc:nbItems />
					${t.join("")}
				</d:prop>
			</d:propfind>`}function V(t=[]){return`<?xml version="1.0"?>
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
			</d:propfind>`}async function X(t,n,i=[],s=F){try{const r=await s.stat(t,{data:R(i),details:!0,...n});return h.debug("[Collections] Fetched a collection: ",{data:r.data}),B(r.data,t.split("/").slice(0,-1).join("/"))}catch(r){if(r instanceof DOMException&&r.code===r.ABORT_ERR)return null;throw r}}async function k(t,n={},i=[],s=F){try{const r=await s.getDirectoryContents(t,{data:R(i),details:!0,...n});return h.debug(`[Collections] Fetched ${r.data.length} collections: `,{data:r.data}),r.data.filter(u=>u.filename!==t).map(u=>B(u,t))}catch(r){if(r instanceof DOMException&&r.code===r.ABORT_ERR)return[];throw r}}function B(t,n){t.props.collaborators===void 0||t.props.collaborators===""?t.props.collaborators=[]:typeof t.props.collaborators.collaborator=="object"&&(Array.isArray(t.props.collaborators.collaborator)?t.props.collaborators=t.props.collaborators.collaborator:t.props.collaborators=[t.props.collaborators.collaborator]);const i=JSON.parse(t.props.dateRange?.replace(/&quot;/g,'"')??"{}"),s=Math.floor(Date.now()/1e3),r=Number.isFinite(i.start)?i.start:s,u=Number.isFinite(i.end)?i.end:s,d={startDate:C(new Date(r*1e3)),endDate:C(new Date(u*1e3))};return d.startDate===d.endDate?t.props.date=d.startDate:t.props.date=p("photos","{startDate} to {endDate}",d),t.props.filters=JSON.parse(t.props.filters??"{}"),$(t,n)}async function Z(t,n,i=[],s=F){try{const r=await s.getDirectoryContents(t,{data:V(i),details:!0,...n}),u=t.split("/").slice(0,-1).join("/"),d=r.data.map(b=>$(b,u,J("dav"))).filter(b=>b.fileid!==void 0);return h.debug(`[Collections] Fetched ${d.length} new files: `,{fetchedFiles:d}),d}catch(r){if(r instanceof DOMException&&r.code===r.ABORT_ERR)return[];throw h.error("Error fetching collection files",{error:r}),r}}const ee=["<nc:photos-collection-file-original-filename />"],L=P("collections",()=>{const t=y({}),n=y({});function i(e){return Object.values(t.value).filter(o=>o.root===e).reduce((o,a)=>({...o,[a.root+a.path]:a}),{})}function s(e){t.value={...t.value,...e.reduce((o,a)=>({...o,[a.root+a.path]:a}),{})}}function r(e){t.value[e.root+e.path]=e}function u(e){e.forEach(o=>{delete t.value[o],delete n.value[o]})}function d(e,o=[]){n.value={...n.value,[e]:o};const a=t.value[e];a!==void 0&&(a.attributes.nbItems=o.length,a.attributes["last-photo"]=Number.parseInt(o[o.length-1]))}function b(e,o){const a=n.value[e]||[];n.value={...n.value,[e]:[...new Set([...a,...o])]};const l=t.value[e];l.attributes.nbItems+=o.length,l.attributes["last-photo"]=Number.parseInt(o[o.length-1])}function f(e,o){n.value={...n.value,[e]:n.value[e].filter(l=>!o.includes(l))};const a=t.value[e];if(a.attributes.nbItems-=o.length,o.includes(a.attributes["last-photo"].toString())){const l=n.value[e];a.attributes["last-photo"]=Number.parseInt(l[l.length])}}async function j(e,o){const a=new D(5);b(e,o);const l=o.map(async m=>{const c=x().files[m],v=t.value[e],N=await a.acquire();try{await F.copyFile(c.root+c.path,`${v.root+v.path}/${c.basename}`)}catch(w){q(w)&&w.response?.status!==409&&(f(e,[m]),h.error(p("photos","Failed to add {fileBaseName} to collection {collectionFileName}",{fileBaseName:c.basename,collectionFileName:e}),{error:w}),g(p("photos","Failed to add {fileBaseName} to collection {collectionFileName}",{fileBaseName:c.basename,collectionFileName:e})))}finally{a.release(N)}});return Promise.all(l)}async function A(e,o){const a=new D(5);f(e,o);const l=o.map(async m=>{const c=x().files[m],v=await a.acquire();try{await F.deleteFile(c.root+c.path)}catch(N){b(e,[m]),h.error(p("photos","Failed to delete {fileBaseName}",{fileBaseName:c.basename}),{error:N}),g(p("photos","Failed to delete {fileBaseName}",{fileBaseName:c.basename}))}finally{a.release(v)}});return Promise.all(l)}async function E(e){try{return await F.createDirectory(e.root+e.path),s([e]),e}catch(o){h.error(p("photos","Failed to create {collectionFileName}",{collectionFileName:e.path}),{error:o}),g(p("photos","Failed to create {collectionFileName}",{collectionFileName:e.path}))}}async function S(e,o){const a=t.value[e],l=O(a).clone();l.rename(o);try{return s([l]),d(l.root+l.path,n.value[e]),await F.moveFile(a.root+a.path,a.root+l.path,{overwrite:!1}),u([e]),l}catch(m){return u([a.root+l.path]),h.error(p("photos","Failed to rename {currentCollectionFileName} to {newCollectionFileName}",{currentCollectionFileName:e,newCollectionFileName:l.path}),{error:m}),g(p("photos","Failed to rename {currentCollectionFileName} to {newCollectionFileName}",{currentCollectionFileName:e,newCollectionFileName:l.path})),a}}async function I(e,o){const a=t.value[e],l=O(a).clone();l.update(o);const m=Object.entries(o).map(([c,v])=>{switch(typeof v){case"string":return`<nc:${c}>${v}</nc:${c}>`;case"object":return`<nc:${c}>${JSON.stringify(v)}</nc:${c}>`;default:return""}}).join();try{return r(l),await F.customRequest(a.root+a.path,{method:"PROPPATCH",data:`<?xml version="1.0"?>
							<d:propertyupdate xmlns:d="DAV:"
								xmlns:oc="http://owncloud.org/ns"
								xmlns:nc="http://nextcloud.org/ns"
								xmlns:ocs="http://open-collaboration-services.org/ns">
							<d:set>
								<d:prop>
									${m}
								</d:prop>
							</d:set>
							</d:propertyupdate>`}),l}catch(c){return r(a),h.error(p("photos","Failed to update properties of {collectionFileName} with {properties}",{collectionFileName:e,properties:JSON.stringify(o)}),{error:c}),g(p("photos","Failed to update properties of {collectionFileName} with {properties}",{collectionFileName:e,properties:JSON.stringify(o)})),a}}async function T(e){try{const o=e.split("/")[3],a=e.split("/").splice(4).join("/");let l=p("photos","Delete collection");switch(o){case"albums":l=p("photos","Delete album");break;case"sharedalbums":l=p("photos","Leave shared album");break}if(!await z(l,p("photos","Are you sure you want to delete {collectionName}? This action cannot be undone.",{collectionName:a})))return!1;const m=t.value[e];return await F.deleteFile(m.root+m.path),u([e]),!0}catch(o){return h.error(p("photos","Failed to delete {collectionFileName}",{collectionFileName:e}),{error:o}),g(p("photos","Failed to delete {collectionFileName}",{collectionFileName:e})),!1}}return{collections:t,collectionsFiles:n,collectionsWithPrefix:i,addCollections:s,addFileIdsToCollection:b,removeFileIdsFromCollection:f,removeCollections:u,setCollectionFiles:d,addFilesToCollection:j,removeFilesFromCollection:A,createCollection:E,renameCollection:S,updateCollection:I,deleteCollection:T}});async function z(t,n){return await _({name:t,text:n,severity:"warning"})}function te(){const t=L(),{abortSignal:n}=M(),i=y(null),s=y(!1);async function r(u,d=[],b=F){if(s.value)return[];try{s.value=!0,i.value=null;const f=await k(u,{signal:n.value},d,b);return t.addCollections(f),f}catch(f){f.response?.status===404?i.value=404:i.value=f,h.error("Error fetching collections:",{error:f})}finally{s.value=!1}return[]}return{fetchCollections:r,errorFetchingCollections:i,loadingCollections:s}}export{te as a,X as b,ee as c,k as d,Z as f,L as u};
//# sourceMappingURL=useFetchCollections-Dl88uvmP.chunk.mjs.map
