const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { d as defineComponent, t as translate } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
import { aj as showError, l as logger, ap as SemaphoreWithPriority } from "./index-BOzawWmL.chunk.mjs";
import { a as fetchCollectionFiles, b as fetchCollection } from "./collectionFetcher-COU0Vwo3.chunk.mjs";
import { A as AbortControllerMixin } from "./AbortControllerMixin-B_otrjDn.chunk.mjs";
const FetchCollectionContentMixin = defineComponent({
  name: "FetchCollectionContentMixin",
  data() {
    return {
      fetchSemaphore: new SemaphoreWithPriority(1),
      loadingCollection: false,
      loadingCollectionFiles: false,
      errorFetchingCollection: null,
      errorFetchingCollectionFiles: null
    };
  },
  mixins: [AbortControllerMixin],
  methods: {
    async fetchCollection(collectionFileName, extraProps, client) {
      if (this.loadingCollection) {
        return null;
      }
      try {
        this.loadingCollection = true;
        this.errorFetchingCollection = null;
        const collection = await fetchCollection(collectionFileName, { signal: this.abortController.signal }, extraProps, client);
        this.$store.dispatch("addCollections", { collections: [collection] });
        return collection;
      } catch (error) {
        if (error.response?.status === 404) {
          this.errorFetchingCollection = 404;
          return null;
        }
        this.errorFetchingCollection = error;
        logger.error("[PublicCollectionContent] Error fetching collection", { error });
        showError(translate("photos", "Failed to fetch collection."));
      } finally {
        this.loadingCollection = false;
      }
      return null;
    },
    async fetchCollectionFiles(collectionFileName, extraProps, client) {
      if (this.loadingCollectionFiles) {
        return [];
      }
      const fetchSemaphoreSymbol = await this.fetchSemaphore.acquire();
      try {
        this.errorFetchingCollectionFiles = null;
        this.loadingCollectionFiles = true;
        const fetchedFiles = await fetchCollectionFiles(collectionFileName, { signal: this.abortController.signal }, extraProps, client);
        const fileIds = fetchedFiles.map((file) => file.fileid?.toString());
        this.$store.dispatch("appendFiles", fetchedFiles);
        await this.$store.commit("setCollectionFiles", { collectionFileName, fileIds });
        return fetchedFiles;
      } catch (error) {
        if (error.response?.status === 404) {
          this.errorFetchingCollectionFiles = 404;
          return [];
        }
        this.errorFetchingCollectionFiles = error;
        showError(translate("photos", "Failed to fetch collections list."));
        logger.error("[PublicCollectionContent] Error fetching collection files", { error });
      } finally {
        this.loadingCollectionFiles = false;
        this.fetchSemaphore.release(fetchSemaphoreSymbol);
      }
      return [];
    }
  }
});
export {
  FetchCollectionContentMixin as F
};
//# sourceMappingURL=FetchCollectionContentMixin-ank00rhB.chunk.mjs.map
