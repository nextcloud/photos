import{d as l,c as u,g as f}from"./index-CM9CmxyJ.chunk.mjs";window._nc_files_scope??={},window._nc_files_scope.v4_0??={};const d=window._nc_files_scope.v4_0,i=l().setApp("@nextcloud/files").detectUser().build(),a=["d:getcontentlength","d:getcontenttype","d:getetag","d:getlastmodified","d:creationdate","d:displayname","d:quota-available-bytes","d:resourcetype","nc:has-preview","nc:is-encrypted","nc:mount-type","oc:comments-unread","oc:favorite","oc:fileid","oc:owner-display-name","oc:owner-id","oc:permissions","oc:size","nc:upload_time"],c={d:"DAV:",nc:"http://nextcloud.org/ns",oc:"http://owncloud.org/ns",ocs:"http://open-collaboration-services.org/ns"};function v(e,t={nc:"http://nextcloud.org/ns"}){d.davNamespaces??={...c},d.davProperties??=[...a];const r={...d.davNamespaces,...t};if(d.davProperties.find(s=>s===e))return i.warn(`${e} already registered`,{prop:e}),!1;if(e.startsWith("<")||e.split(":").length!==2)return i.error(`${e} is not valid. See example: 'oc:fileid'`,{prop:e}),!1;const o=e.split(":")[0];return r[o]?(d.davProperties.push(e),d.davNamespaces=r,!0):(i.error(`${e} namespace unknown`,{prop:e,namespaces:r}),!1)}function n(){return d.davProperties??=[...a],d.davProperties.map(e=>`<${e} />`).join(" ")}function p(){return d.davNamespaces??={...c},Object.keys(d.davNamespaces).map(e=>`xmlns:${e}="${d.davNamespaces?.[e]}"`).join(" ")}function g(){return`<?xml version="1.0"?>
		<d:propfind ${p()}>
			<d:prop>
				${n()}
			</d:prop>
		</d:propfind>`}function h(){return`<?xml version="1.0"?>
		<oc:filter-files ${p()}>
			<d:prop>
				${n()}
			</d:prop>
			<oc:filter-rules>
				<oc:favorite>1</oc:favorite>
			</oc:filter-rules>
		</oc:filter-files>`}function _(e,t=100){const r=u(),o=r.dav?.search_supports_upload_time,s=r.dav?.search_supports_last_activity?"<nc:last_activity/>":"<d:getlastmodified/>";return`<?xml version="1.0" encoding="UTF-8"?>
<d:searchrequest ${p()}
	xmlns:ns="https://github.com/icewind1991/SearchDAV/ns">
	<d:basicsearch>
		<d:select>
			<d:prop>
				${n()}
			</d:prop>
		</d:select>
		<d:from>
			<d:scope>
				<d:href>/files/${f()?.uid}/</d:href>
				<d:depth>infinity</d:depth>
			</d:scope>
		</d:from>
		<d:where>
			<d:and>
				<d:or>
					<d:not>
						<d:eq>
							<d:prop>
								<d:getcontenttype/>
							</d:prop>
							<d:literal>httpd/unix-directory</d:literal>
						</d:eq>
					</d:not>
					<d:eq>
						<d:prop>
							<oc:size/>
						</d:prop>
						<d:literal>0</d:literal>
					</d:eq>
				</d:or>
				${o?`
						<d:or>
							<d:gt>
								<d:prop>
									<d:getlastmodified/>
								</d:prop>
								<d:literal>${e}</d:literal>
							</d:gt>
							<d:gt>
								<d:prop>
									<nc:upload_time/>
								</d:prop>
								<d:literal>${e}</d:literal>
							</d:gt>
						</d:or>
				`:`
					<d:gt>
						<d:prop>
							<d:getlastmodified/>
						</d:prop>
						<d:literal>${e}</d:literal>
					</d:gt>
				`}
			</d:and>
		</d:where>
		<d:orderby>
			<d:order>
				<d:prop>
					${s}
				</d:prop>
				<d:descending/>
			</d:order>
		</d:orderby>
		<d:limit>
			<d:nresults>${t}</d:nresults>
			<ns:firstresult>0</ns:firstresult>
		</d:limit>
	</d:basicsearch>
</d:searchrequest>`}export{n as a,_ as b,h as c,g,i as l,v as r,d as s};
//# sourceMappingURL=davProperties-CLIlVThh.chunk.mjs.map
