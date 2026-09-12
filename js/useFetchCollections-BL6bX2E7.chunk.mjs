import{a as $}from"./dav--9zNVXiK.chunk.mjs";import{l as m,t as p,d as Y}from"./AllowedMimes-D6DwqNIb.chunk.mjs";import{d as f,c as y,u as C,S as D,s as g,g as T}from"./files-B4nYn5v2.chunk.mjs";import{f as P}from"./index-D2NRa5x8.chunk.mjs";import{i as J}from"./index-Dp_mJkaP.chunk.mjs";import{p as N,L as O}from"./icons-BQaqLn_a.chunk.mjs";import{u as _}from"./useAbortController-HlawkBYL.chunk.mjs";function R(t=[]){return`<?xml version="1.0"?>
			<d:propfind xmlns:d="DAV:"
				xmlns:oc="http://owncloud.org/ns"
				xmlns:nc="http://nextcloud.org/ns"
				xmlns:ocs="http://open-collaboration-services.org/ns">
				<d:prop>
					<nc:last-photo />
					<nc:nbItems />
					${t.join("")}
				</d:prop>
			</d:propfind>`}function q(t=[]){return`<?xml version="1.0"?>
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
			</d:propfind>`}async function X(t,n,c=[],i=f){try{const l=await i.stat(t,{data:R(c),details:!0,...n});return m.debug("[Collections] Fetched a collection: ",{data:l.data}),B(l.data,t.split("/").slice(0,-1).join("/"))}catch(l){if(l instanceof DOMException&&l.code===l.ABORT_ERR)return null;throw l}}async function V(t,n={},c=[],i=f){try{const l=await i.getDirectoryContents(t,{data:R(c),details:!0,...n});return m.debug(`[Collections] Fetched ${l.data.length} collections: `,{data:l.data}),l.data.filter(u=>u.filename!==t).map(u=>B(u,t))}catch(l){if(l instanceof DOMException&&l.code===l.ABORT_ERR)return[];throw l}}function B(t,n){t.props.collaborators===void 0||t.props.collaborators===""?t.props.collaborators=[]:typeof t.props.collaborators.collaborator=="object"&&(Array.isArray(t.props.collaborators.collaborator)?t.props.collaborators=t.props.collaborators.collaborator:t.props.collaborators=[t.props.collaborators.collaborator]);const c=JSON.parse(t.props.dateRange?.replace(/&quot;/g,'"')??"{}");c.start===null&&(c.start=y().unix(),c.end=y().unix());const i={startDate:y.unix(c.start).format("MMMM YYYY"),endDate:y.unix(c.end).format("MMMM YYYY")};return i.startDate===i.endDate?t.props.date=i.startDate:t.props.date=p("photos","{startDate} to {endDate}",i),t.props.filters=JSON.parse(t.props.filters??"{}"),$(t,n)}async function Z(t,n,c=[],i=f){try{const l=await i.getDirectoryContents(t,{data:q(c),details:!0,...n}),u=t.split("/").slice(0,-1).join("/"),b=l.data.map(F=>$(F,u,P("dav"))).filter(F=>F.fileid!==void 0);return m.debug(`[Collections] Fetched ${b.length} new files: `,{fetchedFiles:b}),b}catch(l){if(l instanceof DOMException&&l.code===l.ABORT_ERR)return[];throw m.error("Error fetching collection files",{error:l}),l}}const ee=["<nc:photos-collection-file-original-filename />"],k=Y("collections",()=>{const t=N({}),n=N({});function c(e){return Object.values(t.value).filter(o=>o.root===e).reduce((o,a)=>({...o,[a.root+a.path]:a}),{})}function i(e){t.value={...t.value,...e.reduce((o,a)=>({...o,[a.root+a.path]:a}),{})}}function l(e){t.value[e.root+e.path]=e}function u(e){e.forEach(o=>{delete t.value[o],delete n.value[o]})}function b(e,o=[]){n.value={...n.value,[e]:o};const a=t.value[e];a!==void 0&&(a.attributes.nbItems=o.length,a.attributes["last-photo"]=Number.parseInt(o[o.length-1]))}function F(e,o){const a=n.value[e]||[];n.value={...n.value,[e]:[...new Set([...a,...o])]};const r=t.value[e];r.attributes.nbItems+=o.length,r.attributes["last-photo"]=Number.parseInt(o[o.length-1])}function h(e,o){n.value={...n.value,[e]:n.value[e].filter(r=>!o.includes(r))};const a=t.value[e];if(a.attributes.nbItems-=o.length,o.includes(a.attributes["last-photo"].toString())){const r=n.value[e];a.attributes["last-photo"]=Number.parseInt(r[r.length])}}async function M(e,o){const a=new D(5);F(e,o);const r=o.map(async d=>{const s=C().files[d],v=t.value[e],w=await a.acquire();try{await f.copyFile(s.root+s.path,`${v.root+v.path}/${s.basename}`)}catch(x){J(x)&&x.response?.status!==409&&(h(e,[d]),m.error(p("photos","Failed to add {fileBaseName} to collection {collectionFileName}",{fileBaseName:s.basename,collectionFileName:e}),{error:x}),g(p("photos","Failed to add {fileBaseName} to collection {collectionFileName}",{fileBaseName:s.basename,collectionFileName:e})))}finally{a.release(w)}});return Promise.all(r)}async function j(e,o){const a=new D(5);h(e,o);const r=o.map(async d=>{const s=C().files[d],v=await a.acquire();try{await f.deleteFile(s.root+s.path)}catch(w){F(e,[d]),m.error(p("photos","Failed to delete {fileBaseName}",{fileBaseName:s.basename}),{error:w}),g(p("photos","Failed to delete {fileBaseName}",{fileBaseName:s.basename}))}finally{a.release(v)}});return Promise.all(r)}async function A(e){try{return await f.createDirectory(e.root+e.path),i([e]),e}catch(o){m.error(p("photos","Failed to create {collectionFileName}",{collectionFileName:e.path}),{error:o}),g(p("photos","Failed to create {collectionFileName}",{collectionFileName:e.path}))}}async function E(e,o){const a=t.value[e],r=O(a).clone();r.rename(o);try{return i([r]),b(r.root+r.path,n.value[e]),await f.moveFile(a.root+a.path,a.root+r.path,{overwrite:!1}),u([e]),r}catch(d){return u([a.root+r.path]),m.error(p("photos","Failed to rename {currentCollectionFileName} to {newCollectionFileName}",{currentCollectionFileName:e,newCollectionFileName:r.path}),{error:d}),g(p("photos","Failed to rename {currentCollectionFileName} to {newCollectionFileName}",{currentCollectionFileName:e,newCollectionFileName:r.path})),a}}async function S(e,o){const a=t.value[e],r=O(a).clone();r.update(o);const d=Object.entries(o).map(([s,v])=>{switch(typeof v){case"string":return`<nc:${s}>${v}</nc:${s}>`;case"object":return`<nc:${s}>${JSON.stringify(v)}</nc:${s}>`;default:return""}}).join();try{return l(r),await f.customRequest(a.root+a.path,{method:"PROPPATCH",data:`<?xml version="1.0"?>
							<d:propertyupdate xmlns:d="DAV:"
								xmlns:oc="http://owncloud.org/ns"
								xmlns:nc="http://nextcloud.org/ns"
								xmlns:ocs="http://open-collaboration-services.org/ns">
							<d:set>
								<d:prop>
									${d}
								</d:prop>
							</d:set>
							</d:propertyupdate>`}),r}catch(s){return l(a),m.error(p("photos","Failed to update properties of {collectionFileName} with {properties}",{collectionFileName:e,properties:JSON.stringify(o)}),{error:s}),g(p("photos","Failed to update properties of {collectionFileName} with {properties}",{collectionFileName:e,properties:JSON.stringify(o)})),a}}async function I(e){try{const o=e.split("/")[3],a=e.split("/").splice(4).join("/");let r=p("photos","Delete collection");switch(o){case"albums":r=p("photos","Delete album");break;case"sharedalbums":r=p("photos","Leave shared album");break}if(!await L(r,p("photos","Are you sure you want to delete {collectionName}? This action cannot be undone.",{collectionName:a})))return!1;const d=t.value[e];return await f.deleteFile(d.root+d.path),u([e]),!0}catch(o){return m.error(p("photos","Failed to delete {collectionFileName}",{collectionFileName:e}),{error:o}),g(p("photos","Failed to delete {collectionFileName}",{collectionFileName:e})),!1}}return{collections:t,collectionsFiles:n,collectionsWithPrefix:c,addCollections:i,addFileIdsToCollection:F,removeFileIdsFromCollection:h,removeCollections:u,setCollectionFiles:b,addFilesToCollection:M,removeFilesFromCollection:j,createCollection:A,renameCollection:E,updateCollection:S,deleteCollection:I}});async function L(t,n){return await T({name:t,text:n,severity:"warning"})}function te(){const t=k(),{abortSignal:n}=_(),c=N(null),i=N(!1);async function l(u,b=[],F=f){if(i.value)return[];try{i.value=!0,c.value=null;const h=await V(u,{signal:n.value},b,F);return t.addCollections(h),h}catch(h){h.response?.status===404?c.value=404:c.value=h,m.error("Error fetching collections:",{error:h})}finally{i.value=!1}return[]}return{fetchCollections:l,errorFetchingCollections:c,loadingCollections:i}}export{te as a,X as b,ee as c,V as d,Z as f,k as u};
//# sourceMappingURL=useFetchCollections-BL6bX2E7.chunk.mjs.map
