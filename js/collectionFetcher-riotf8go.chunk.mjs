import{I as d,t as u}from"./vue.runtime.esm-CgV0NZOD.chunk.mjs";import{m as s}from"./index-Ce7iYg--.chunk.mjs";import{am as p,l as c}from"./index-mp1XnZYt.chunk.mjs";function f(o=[]){return`<?xml version="1.0"?>
			<d:propfind xmlns:d="DAV:"
				xmlns:oc="http://owncloud.org/ns"
				xmlns:nc="http://nextcloud.org/ns"
				xmlns:ocs="http://open-collaboration-services.org/ns">
				<d:prop>
					<nc:last-photo />
					<nc:nbItems />
					${o.join("")}
				</d:prop>
			</d:propfind>`}function h(o=[]){return`<?xml version="1.0"?>
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
			</d:propfind>`}async function D(o,e,r=[],a=p){try{const t=await a.stat(o,{data:f(r),details:!0,...e});return c.debug("[Collections] Fetched a collection: ",{data:t.data}),m(t.data,o.split("/").slice(0,-1).join("/"))}catch(t){if(t instanceof DOMException&&t.code===t.ABORT_ERR)return null;throw t}}async function y(o,e={},r=[],a=p){try{const t=await a.getDirectoryContents(o,{data:f(r),details:!0,...e});return c.debug(`[Collections] Fetched ${t.data.length} collections: `,{data:t.data}),t.data.filter(n=>n.filename!==o).map(n=>m(n,o))}catch(t){if(t instanceof DOMException&&t.code===t.ABORT_ERR)return[];throw t}}function m(o,e){o.props.collaborators===void 0||o.props.collaborators===""?o.props.collaborators=[]:typeof o.props.collaborators.collaborator=="object"&&(Array.isArray(o.props.collaborators.collaborator)?o.props.collaborators=o.props.collaborators.collaborator:o.props.collaborators=[o.props.collaborators.collaborator]);const r=JSON.parse(o.props.dateRange?.replace(/&quot;/g,'"')??"{}");r.start===null&&(r.start=s().unix(),r.end=s().unix());const a={startDate:s.unix(r.start).format("MMMM YYYY"),endDate:s.unix(r.end).format("MMMM YYYY")};return a.startDate===a.endDate?o.props.date=a.startDate:o.props.date=u("photos","{startDate} to {endDate}",a),o.props.filters=JSON.parse(o.props.filters??"{}"),d(o,e)}async function M(o,e,r=[],a=p){try{const t=await a.getDirectoryContents(o,{data:h(r),details:!0,...e}),n=o.split("/").slice(0,-1).join("/"),l=t.data.map(i=>d(i,n)).filter(i=>i.fileid!==void 0);return c.debug(`[Collections] Fetched ${l.length} new files: `,{fetchedFiles:l}),l}catch(t){if(t instanceof DOMException&&t.code===t.ABORT_ERR)return[];throw c.error("Error fetching collection files",{error:t}),t}}export{M as a,D as b,y as f};
//# sourceMappingURL=collectionFetcher-riotf8go.chunk.mjs.map
