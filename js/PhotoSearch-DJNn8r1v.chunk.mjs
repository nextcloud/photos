import{m as r}from"./index-D-GU54Qs.chunk.mjs";import{q as c,p as m,_ as f,Z as u,w as h}from"./index-B_-Mz_Iy.chunk.mjs";import{W as g,S as y}from"./vue.runtime.esm-K-L1yEsQ.chunk.mjs";async function x(o={}){const d={firstResult:0,nbResults:200,mimesType:c,onThisDay:!1,onlyFavorites:!1,full:!1,...o},s=d.mimesType.reduce((t,e)=>`${t}
		<d:eq>
			<d:prop>
				<d:getcontenttype/>
			</d:prop>
			<d:literal>${e}</d:literal>
		</d:eq>
	`,""),a=d.onlyFavorites?`<d:eq>
				<d:prop>
					<oc:favorite/>
				</d:prop>
				<d:literal>1</d:literal>
			</d:eq>`:"",n=d.onThisDay?`<d:or>${Array(20).fill(1).map((t,e)=>{const l=r(Date.now()).startOf("day").subtract(3,"d").subtract(e+1,"y"),p=r(Date.now()).endOf("day").add(3,"d").subtract(e+1,"y");return`<d:and>
				<d:gt>
					<d:prop>
						<d:getlastmodified />
					</d:prop>
					<d:literal>${l.format(r.defaultFormatUtc)}</d:literal>
				</d:gt>
				<d:lt>
					<d:prop>
						<d:getlastmodified />
					</d:prop>
					<d:literal>${p.format(r.defaultFormatUtc)}</d:literal>
				</d:lt>
			</d:and>`}).join(`
`)}</d:or>`:"",i=m.state.userConfig.photosSourceFolders.map(t=>`
			<d:scope>
				<d:href>${g(y,t)}</d:href>
				<d:depth>infinity</d:depth>
			</d:scope>`).join(`
`);return d.data=`<?xml version="1.0" encoding="UTF-8"?>
		<d:searchrequest xmlns:d="DAV:"
			xmlns:oc="http://owncloud.org/ns"
			xmlns:nc="http://nextcloud.org/ns"
			xmlns:ns="https://github.com/icewind1991/SearchDAV/ns"
			xmlns:ocs="http://open-collaboration-services.org/ns">
			<d:basicsearch>
				<d:select>
					<d:prop>
						${f()}
					</d:prop>
				</d:select>
				<d:from>
					${i}
				</d:from>
				<d:where>
					<d:and>
						<d:or>
							${s}
						</d:or>
						${a}
						${n}
					</d:and>
				</d:where>
				<d:orderby>
					<d:order>
						<d:prop><nc:metadata-photos-original_date_time/></d:prop>
						<d:descending/>
					</d:order>
					<d:order>
						<d:prop><d:getlastmodified/></d:prop>
						<d:descending/>
					</d:order>
				</d:orderby>
				<d:limit>
					<d:nresults>${d.nbResults}</d:nresults>
					<ns:firstresult>${d.firstResult}</ns:firstresult>
				</d:limit>
			</d:basicsearch>
		</d:searchrequest>`,d.details=!0,(await u.search("/",d)).data.results.map(t=>h(t))}export{x as g};
//# sourceMappingURL=PhotoSearch-DJNn8r1v.chunk.mjs.map
