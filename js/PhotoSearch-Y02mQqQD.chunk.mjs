const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { N as joinPaths, L as resultToNode, J as defaultRootPath } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
import { m as moment } from "./index-Cokc0amN.chunk.mjs";
import { h as allMimes, p as photosStore, aq as getDefaultDavProps, al as davClient } from "./index-BOzawWmL.chunk.mjs";
async function getPhotos(_options = {}) {
  const options = {
    firstResult: 0,
    nbResults: 200,
    mimesType: allMimes,
    onThisDay: false,
    onlyFavorites: false,
    full: false,
    extraFilters: "",
    ..._options
  };
  const orMime = options.mimesType.reduce((str, mime) => `${str}
		<d:eq>
			<d:prop>
				<d:getcontenttype/>
			</d:prop>
			<d:literal>${mime}</d:literal>
		</d:eq>
	`, "");
  const eqFavorites = options.onlyFavorites ? `<d:eq>
				<d:prop>
					<oc:favorite/>
				</d:prop>
				<d:literal>1</d:literal>
			</d:eq>` : "";
  const onThisDay = options.onThisDay ? `<d:or>${Array(20).fill(1).map((_, years) => {
    const start = moment(Date.now()).startOf("day").subtract(3, "d").subtract(years + 1, "y");
    const end = moment(Date.now()).endOf("day").add(3, "d").subtract(years + 1, "y");
    return `<d:and>
				<d:gt>
					<d:prop>
						<nc:metadata-photos-original_date_time/>
					</d:prop>
					<d:literal>${start.format(moment.defaultFormatUtc)}</d:literal>
				</d:gt>
				<d:lt>
					<d:prop>
						<nc:metadata-photos-original_date_time/>
					</d:prop>
					<d:literal>${end.format(moment.defaultFormatUtc)}</d:literal>
				</d:lt>
			</d:and>`;
  }).join("\n")}</d:or>` : "";
  const sourceFolders = photosStore.state.userConfig.photosSourceFolders.map((folder) => `
			<d:scope>
				<d:href>${joinPaths(defaultRootPath, folder)}</d:href>
				<d:depth>infinity</d:depth>
			</d:scope>`).join("\n");
  options.data = `<?xml version="1.0" encoding="UTF-8"?>
		<d:searchrequest xmlns:d="DAV:"
			xmlns:oc="http://owncloud.org/ns"
			xmlns:nc="http://nextcloud.org/ns"
			xmlns:ns="https://github.com/icewind1991/SearchDAV/ns"
			xmlns:ocs="http://open-collaboration-services.org/ns">
			<d:basicsearch>
				<d:select>
					<d:prop>
						${getDefaultDavProps()}
					</d:prop>
				</d:select>
				<d:from>
					${sourceFolders}
				</d:from>
				<d:where>
					<d:and>
						<d:or>
							${orMime}
						</d:or>
						${eqFavorites}
						${onThisDay}
						${options.extraFilters}
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
					<d:nresults>${options.nbResults}</d:nresults>
					<ns:firstresult>${options.firstResult}</ns:firstresult>
				</d:limit>
			</d:basicsearch>
		</d:searchrequest>`;
  options.details = true;
  const response = await davClient.search("/", options);
  return response.data.results.map((data) => resultToNode(data));
}
export {
  getPhotos as g
};
//# sourceMappingURL=PhotoSearch-Y02mQqQD.chunk.mjs.map
