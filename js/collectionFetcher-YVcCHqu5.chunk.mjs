import{c as d,g as h,t as m}from"./dav-CXNg1SSo.chunk.mjs";import{d as p,l as c,m as s}from"./index-BqMbNt7r.chunk.mjs";function f(o=[]){return`<?xml version="1.0"?>
			<d:propfind xmlns:d="DAV:"
				xmlns:oc="http://owncloud.org/ns"
				xmlns:nc="http://nextcloud.org/ns"
				xmlns:ocs="http://open-collaboration-services.org/ns">
				<d:prop>
					<nc:last-photo />
					<nc:nbItems />
					${o.join("")}
				</d:prop>
			</d:propfind>`}function g(o=[]){return`<?xml version="1.0"?>
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
			</d:propfind>`}async function D(o,e,a=[],r=p){try{const t=await r.stat(o,{data:f(a),details:!0,...e});return c.debug("[Collections] Fetched a collection: ",{data:t.data}),u(t.data,o.split("/").slice(0,-1).join("/"))}catch(t){if(t instanceof DOMException&&t.code===t.ABORT_ERR)return null;throw t}}async function y(o,e={},a=[],r=p){try{const t=await r.getDirectoryContents(o,{data:f(a),details:!0,...e});return c.debug(`[Collections] Fetched ${t.data.length} collections: `,{data:t.data}),t.data.filter(n=>n.filename!==o).map(n=>u(n,o))}catch(t){if(t instanceof DOMException&&t.code===t.ABORT_ERR)return[];throw t}}function u(o,e){o.props.collaborators===void 0||o.props.collaborators===""?o.props.collaborators=[]:typeof o.props.collaborators.collaborator=="object"&&(Array.isArray(o.props.collaborators.collaborator)?o.props.collaborators=o.props.collaborators.collaborator:o.props.collaborators=[o.props.collaborators.collaborator]);const a=JSON.parse(o.props.dateRange?.replace(/&quot;/g,'"')??"{}");a.start===null&&(a.start=s().unix(),a.end=s().unix());const r={startDate:s.unix(a.start).format("MMMM YYYY"),endDate:s.unix(a.end).format("MMMM YYYY")};return r.startDate===r.endDate?o.props.date=r.startDate:o.props.date=m("photos","{startDate} to {endDate}",r),o.props.filters=JSON.parse(o.props.filters??"{}"),d(o,e)}async function v(o,e,a=[],r=p){try{const t=await r.getDirectoryContents(o,{data:g(a),details:!0,...e}),n=o.split("/").slice(0,-1).join("/"),l=t.data.map(i=>d(i,n,h("dav"))).filter(i=>i.fileid!==void 0);return c.debug(`[Collections] Fetched ${l.length} new files: `,{fetchedFiles:l}),l}catch(t){if(t instanceof DOMException&&t.code===t.ABORT_ERR)return[];throw c.error("Error fetching collection files",{error:t}),t}}export{v as a,D as b,y as f};
//# sourceMappingURL=collectionFetcher-YVcCHqu5.chunk.mjs.map
