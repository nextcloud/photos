const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { L as resultToNode, t as translate } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
import { m as moment } from "./index-Cokc0amN.chunk.mjs";
import { al as davClient, l as logger } from "./index-BOzawWmL.chunk.mjs";
function getCollectionDavRequest(extraProps = []) {
  return `<?xml version="1.0"?>
			<d:propfind xmlns:d="DAV:"
				xmlns:oc="http://owncloud.org/ns"
				xmlns:nc="http://nextcloud.org/ns"
				xmlns:ocs="http://open-collaboration-services.org/ns">
				<d:prop>
					<nc:last-photo />
					<nc:nbItems />
					${extraProps.join("")}
				</d:prop>
			</d:propfind>`;
}
function getCollectionFilesDavRequest(extraProps = []) {
  return `<?xml version="1.0"?>
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
					${extraProps.join("")}
				</d:prop>
			</d:propfind>`;
}
async function fetchCollection(path, options, extraProps = [], client = davClient) {
  try {
    const response = await client.stat(path, {
      data: getCollectionDavRequest(extraProps),
      details: true,
      ...options
    });
    logger.debug("[Collections] Fetched a collection: ", { data: response.data });
    return formatCollection(response.data, path.split("/").slice(0, -1).join("/"));
  } catch (error) {
    if (error instanceof DOMException && error.code === error.ABORT_ERR) {
      return null;
    }
    throw error;
  }
}
async function fetchCollections(path, options = {}, extraProps = [], client = davClient) {
  try {
    const response = await client.getDirectoryContents(path, {
      data: getCollectionDavRequest(extraProps),
      details: true,
      ...options
    });
    logger.debug(`[Collections] Fetched ${response.data.length} collections: `, { data: response.data });
    return response.data.filter((collection) => collection.filename !== path).map((rawCollection) => formatCollection(rawCollection, path));
  } catch (error) {
    if (error instanceof DOMException && error.code === error.ABORT_ERR) {
      return [];
    }
    throw error;
  }
}
function formatCollection(rawCollection, root) {
  if (rawCollection.props.collaborators === void 0 || rawCollection.props.collaborators === "") {
    rawCollection.props.collaborators = [];
  } else if (typeof rawCollection.props.collaborators.collaborator === "object") {
    if (Array.isArray(rawCollection.props.collaborators.collaborator)) {
      rawCollection.props.collaborators = rawCollection.props.collaborators.collaborator;
    } else {
      rawCollection.props.collaborators = [rawCollection.props.collaborators.collaborator];
    }
  }
  const dateRange = JSON.parse(rawCollection.props.dateRange?.replace(/&quot;/g, '"') ?? "{}");
  if (dateRange.start === null) {
    dateRange.start = moment().unix();
    dateRange.end = moment().unix();
  }
  const dateRangeFormatted = {
    startDate: moment.unix(dateRange.start).format("MMMM YYYY"),
    endDate: moment.unix(dateRange.end).format("MMMM YYYY")
  };
  if (dateRangeFormatted.startDate === dateRangeFormatted.endDate) {
    rawCollection.props.date = dateRangeFormatted.startDate;
  } else {
    rawCollection.props.date = translate("photos", "{startDate} to {endDate}", dateRangeFormatted);
  }
  rawCollection.props.filters = JSON.parse(rawCollection.props.filters ?? "{}");
  return resultToNode(rawCollection, root);
}
async function fetchCollectionFiles(path, options, extraProps = [], client = davClient) {
  try {
    const response = await client.getDirectoryContents(path, {
      data: getCollectionFilesDavRequest(extraProps),
      details: true,
      ...options
    });
    const filesRoot = path.split("/").slice(0, -1).join("/");
    const fetchedFiles = response.data.map((file) => resultToNode(file, filesRoot)).filter((file) => file.fileid !== void 0);
    logger.debug(`[Collections] Fetched ${fetchedFiles.length} new files: `, { fetchedFiles });
    return fetchedFiles;
  } catch (error) {
    if (error instanceof DOMException && error.code === error.ABORT_ERR) {
      return [];
    }
    logger.error("Error fetching collection files", { error });
    throw error;
  }
}
export {
  fetchCollectionFiles as a,
  fetchCollection as b,
  fetchCollections as f
};
//# sourceMappingURL=collectionFetcher-COU0Vwo3.chunk.mjs.map
