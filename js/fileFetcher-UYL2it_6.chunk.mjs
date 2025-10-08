const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { L as resultToNode } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
import { al as davClient, at as getPropFind } from "./index-BOzawWmL.chunk.mjs";
async function fetchFile(fileName, options = {}) {
  try {
    const response = await davClient.stat(fileName, {
      data: getPropFind(),
      details: true,
      ...options
    });
    return resultToNode(response.data);
  } catch (error) {
    if (error.code === "ERR_CANCELED") {
      return null;
    }
    throw error;
  }
}
export {
  fetchFile as f
};
//# sourceMappingURL=fileFetcher-UYL2it_6.chunk.mjs.map
