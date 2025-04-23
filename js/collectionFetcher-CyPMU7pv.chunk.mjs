import{a3 as s}from"./index-BGGeUZyp.chunk.mjs";import{t as f}from"./vue.runtime.esm-CShV2ddg.chunk.mjs";import{Z as l,f as c,w as i}from"./index-C-nSEKko.chunk.mjs";function d(o=[]){return`<?xml version="1.0"?>
			<d:propfind xmlns:d="DAV:"
				xmlns:oc="http://owncloud.org/ns"
				xmlns:nc="http://nextcloud.org/ns"
				xmlns:ocs="http://open-collaboration-services.org/ns">
				<d:prop>
					<nc:last-photo />
					<nc:nbItems />
					${o.join("")}
				</d:prop>
			</d:propfind>`}function u(o=[]){return`<?xml version="1.0"?>
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
					<nc:metadata-photos-size />
					<nc:metadata-photos-original_date_time />
					<nc:metadata-files-live-photo />
					<nc:has-preview />
					<nc:hidden />
					<oc:favorite />
					<oc:fileid />
					<oc:permissions />
					${o.join("")}
				</d:prop>
			</d:propfind>`}async function b(o,a,r=[],e=l){try{const t=await e.stat(o,{data:d(r),details:!0,...a});return c.debug("[Collections] Fetched a collection: ",{data:t.data}),p(t.data)}catch(t){if(t instanceof DOMException&&t.code===t.ABORT_ERR)return null;throw t}}async function x(o,a,r=[],e=l){try{const t=await e.getDirectoryContents(o,{data:d(r),details:!0,...a});return c.debug(`[Collections] Fetched ${t.data.length} collections: `,{data:t.data}),t.data.filter(n=>n.filename!==o).map(p)}catch(t){if(t instanceof DOMException&&t.code===t.ABORT_ERR)return[];throw t}}function p(o){o.props.collaborators===void 0||o.props.collaborators===""?o.props.collaborators=[]:typeof o.props.collaborators.collaborator=="object"&&(Array.isArray(o.props.collaborators.collaborator)?o.props.collaborators=o.props.collaborators.collaborator:o.props.collaborators=[o.props.collaborators.collaborator]),o=i(o);const a=JSON.parse(o.dateRange?.replace(/&quot;/g,'"')??"{}");a.start===null&&(a.start=s().unix(),a.end=s().unix());const r={startDate:s.unix(a.start).format("MMMM YYYY"),endDate:s.unix(a.end).format("MMMM YYYY")};return r.startDate===r.endDate?o.date=r.startDate:o.date=f("photos","{startDate} to {endDate}",r),o}async function D(o,a,r=[],e=l){try{const t=(await e.getDirectoryContents(o,{data:u(r),details:!0,...a})).data.map(n=>i(n)).filter(n=>n.fileid);return c.debug(`[Collections] Fetched ${t.length} new files: `,t),t}catch(t){if(t instanceof DOMException&&t.code===t.ABORT_ERR)return[];throw c.error("Error fetching collection files",{error:t}),t}}export{D as a,b,x as f};
//# sourceMappingURL=collectionFetcher-CyPMU7pv.chunk.mjs.map
