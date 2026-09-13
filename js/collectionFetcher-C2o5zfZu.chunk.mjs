import{b as d,g as u,t as m}from"./dav-i4TJ-db1.chunk.mjs";import{d as i,l as c,f as p}from"./index-TVQumSFb.chunk.mjs";function f(o=[]){return`<?xml version="1.0"?>
			<d:propfind xmlns:d="DAV:"
				xmlns:oc="http://owncloud.org/ns"
				xmlns:nc="http://nextcloud.org/ns"
				xmlns:ocs="http://open-collaboration-services.org/ns">
				<d:prop>
					<nc:last-photo />
					<nc:nbItems />
					${o.join("")}
				</d:prop>
			</d:propfind>`}function b(o=[]){return`<?xml version="1.0"?>
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
					${o.join(`
					`)}
				</d:prop>
			</d:propfind>`}async function x(o,n,e=[],a=i){try{const t=await a.stat(o,{data:f(e),details:!0,...n});return c.debug("[Collections] Fetched a collection: ",{data:t.data}),h(t.data,o.split("/").slice(0,-1).join("/"))}catch(t){if(t instanceof DOMException&&t.code===t.ABORT_ERR)return null;throw t}}async function w(o,n={},e=[],a=i){try{const t=await a.getDirectoryContents(o,{data:f(e),details:!0,...n});return c.debug(`[Collections] Fetched ${t.data.length} collections: `,{data:t.data}),t.data.filter(s=>s.filename!==o).map(s=>h(s,o))}catch(t){if(t instanceof DOMException&&t.code===t.ABORT_ERR)return[];throw t}}function h(o,n){o.props.collaborators===void 0||o.props.collaborators===""?o.props.collaborators=[]:typeof o.props.collaborators.collaborator=="object"&&(Array.isArray(o.props.collaborators.collaborator)?o.props.collaborators=o.props.collaborators.collaborator:o.props.collaborators=[o.props.collaborators.collaborator]);const e=JSON.parse(o.props.dateRange?.replace(/&quot;/g,'"')??"{}"),a=Math.floor(Date.now()/1e3),t=Number.isFinite(e.start)?e.start:a,s=Number.isFinite(e.end)?e.end:a,r={startDate:p(new Date(t*1e3)),endDate:p(new Date(s*1e3))};return r.startDate===r.endDate?o.props.date=r.startDate:o.props.date=m("photos","{startDate} to {endDate}",r),o.props.filters=JSON.parse(o.props.filters??"{}"),d(o,n)}async function y(o,n,e=[],a=i){try{const t=await a.getDirectoryContents(o,{data:b(e),details:!0,...n}),s=o.split("/").slice(0,-1).join("/"),r=t.data.map(l=>d(l,s,u("dav"))).filter(l=>l.fileid!==void 0);return c.debug(`[Collections] Fetched ${r.length} new files: `,{fetchedFiles:r}),r}catch(t){if(t instanceof DOMException&&t.code===t.ABORT_ERR)return[];throw c.error("Error fetching collection files",{error:t}),t}}export{y as a,x as b,w as f};
//# sourceMappingURL=collectionFetcher-C2o5zfZu.chunk.mjs.map
