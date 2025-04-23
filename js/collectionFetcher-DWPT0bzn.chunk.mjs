import{m as s}from"./index-BU47S74H.chunk.mjs";import{t as f}from"./vue.runtime.esm-D5CTWQro.chunk.mjs";import{Z as l,f as c,w as i}from"./index-CHIr7m_h.chunk.mjs";function d(o=[]){return`<?xml version="1.0"?>
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
			</d:propfind>`}async function x(o,e,n=[],a=l){try{const t=await a.stat(o,{data:d(n),details:!0,...e});return c.debug("[Collections] Fetched a collection: ",{data:t.data}),p(t.data)}catch(t){if(t instanceof DOMException&&t.code===t.ABORT_ERR)return null;throw t}}async function b(o,e,n=[],a=l){try{const t=await a.getDirectoryContents(o,{data:d(n),details:!0,...e});return c.debug(`[Collections] Fetched ${t.data.length} collections: `,{data:t.data}),t.data.filter(r=>r.filename!==o).map(p)}catch(t){if(t instanceof DOMException&&t.code===t.ABORT_ERR)return[];throw t}}function p(o){let e=[];o.props.collaborators===void 0||o.props.collaborators===""?e=[]:typeof o.props.collaborators.collaborator=="object"&&(Array.isArray(o.props.collaborators.collaborator)?e=o.props.collaborators.collaborator:e=[o.props.collaborators.collaborator]);const n=i(o);n.collaborators=e;const a=JSON.parse(o.dateRange?.replace(/&quot;/g,'"')??"{}");a.start===null&&(a.start=s().unix(),a.end=s().unix());const t={startDate:s.unix(a.start).format("MMMM YYYY"),endDate:s.unix(a.end).format("MMMM YYYY")};return t.startDate===t.endDate?n.date=t.startDate:n.date=f("photos","{startDate} to {endDate}",t),n}async function D(o,e,n=[],a=l){try{const t=(await a.getDirectoryContents(o,{data:u(n),details:!0,...e})).data.map(r=>i(r)).filter(r=>r.fileid);return c.debug(`[Collections] Fetched ${t.length} new files: `,{fetchedFiles:t}),t}catch(t){if(t instanceof DOMException&&t.code===t.ABORT_ERR)return[];throw c.error("Error fetching collection files",{error:t}),t}}export{D as a,x as b,b as f};
//# sourceMappingURL=collectionFetcher-DWPT0bzn.chunk.mjs.map
