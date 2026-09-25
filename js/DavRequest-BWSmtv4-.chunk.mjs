import{c as r}from"./dav-Vt8ZXmmv.chunk.mjs";let o=null;function t(){return o===null&&(o=r()),o}function p(n=[]){return`<?xml version="1.0"?>
			<d:propfind xmlns:d="DAV:"
				xmlns:oc="http://owncloud.org/ns"
				xmlns:nc="http://nextcloud.org/ns"
				xmlns:ocs="http://open-collaboration-services.org/ns">
				<d:prop>
					${t()}
					${n.join(`
`)}
				</d:prop>
			</d:propfind>`}export{p as a,t as g};
//# sourceMappingURL=DavRequest-BWSmtv4-.chunk.mjs.map
