import{a3 as e}from"./index-BGGeUZyp.chunk.mjs";import{q as p,p as c,_ as m,Z as f,w as u}from"./index-C-nSEKko.chunk.mjs";import{Y as h,U as g}from"./vue.runtime.esm-CShV2ddg.chunk.mjs";async function w(d={}){d={firstResult:0,nbResults:200,mimesType:p,onThisDay:!1,onlyFavorites:!1,...d};const s=d.mimesType.reduce((t,r)=>`${t}
		<d:eq>
			<d:prop>
				<d:getcontenttype/>
			</d:prop>
			<d:literal>${r}</d:literal>
		</d:eq>
	`,""),o=d.onlyFavorites?`<d:eq>
				<d:prop>
					<oc:favorite/>
				</d:prop>
				<d:literal>1</d:literal>
			</d:eq>`:"",a=d.onThisDay?`<d:or>${Array(20).fill(1).map((t,r)=>{const i=e(Date.now()).startOf("day").subtract(3,"d").subtract(r+1,"y"),l=e(Date.now()).endOf("day").add(3,"d").subtract(r+1,"y");return`<d:and>
				<d:gt>
					<d:prop>
						<d:getlastmodified />
					</d:prop>
					<d:literal>${i.format(e.defaultFormatUtc)}</d:literal>
				</d:gt>
				<d:lt>
					<d:prop>
						<d:getlastmodified />
					</d:prop>
					<d:literal>${l.format(e.defaultFormatUtc)}</d:literal>
				</d:lt>
			</d:and>`}).join(`
`)}</d:or>`:"",n=c.state.userConfig.photosSourceFolders.map(t=>`
			<d:scope>
				<d:href>${h(g,t)}</d:href>
				<d:depth>infinity</d:depth>
			</d:scope>`).join(`
`);return d=Object.assign({data:`<?xml version="1.0" encoding="UTF-8"?>
			<d:searchrequest xmlns:d="DAV:"
				xmlns:oc="http://owncloud.org/ns"
				xmlns:nc="http://nextcloud.org/ns"
				xmlns:ns="https://github.com/icewind1991/SearchDAV/ns"
				xmlns:ocs="http://open-collaboration-services.org/ns">
				<d:basicsearch>
					<d:select>
						<d:prop>
							${m()}
						</d:prop>
					</d:select>
					<d:from>
						${n}
					</d:from>
					<d:where>
						<d:and>
							<d:or>
								${s}
							</d:or>
							${o}
							${a}
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
			</d:searchrequest>`,deep:!0,details:!0},d),(await f.search("/",d)).data.results.map(t=>u(t))}export{w as g};
//# sourceMappingURL=PhotoSearch-CMraq11m.chunk.mjs.map
