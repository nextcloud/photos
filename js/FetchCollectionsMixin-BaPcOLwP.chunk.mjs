const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { d as defineComponent } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
import { f as fetchCollections } from "./collectionFetcher-COU0Vwo3.chunk.mjs";
import { al as davClient, l as logger } from "./index-BOzawWmL.chunk.mjs";
import { A as AbortControllerMixin } from "./AbortControllerMixin-B_otrjDn.chunk.mjs";
const FetchCollectionsMixin = defineComponent({
  name: "FetchCollectionsMixin",
  data() {
    return {
      errorFetchingCollections: null,
      loadingCollections: false
    };
  },
  mixins: [AbortControllerMixin],
  methods: {
    async fetchCollections(collectionHome, extraProps = [], client = davClient) {
      if (this.loadingCollections) {
        return [];
      }
      try {
        this.loadingCollections = true;
        this.errorFetchingCollections = null;
        const collections = await fetchCollections(collectionHome, { signal: this.abortController.signal }, extraProps, client);
        this.$store.dispatch("addCollections", { collections });
        return collections;
      } catch (error) {
        if (error.response?.status === 404) {
          this.errorFetchingCollections = 404;
        } else {
          this.errorFetchingCollections = error;
        }
        logger.error("Error fetching collections:", { error });
      } finally {
        this.loadingCollections = false;
      }
      return [];
    }
  }
});
export {
  FetchCollectionsMixin as F
};
//# sourceMappingURL=FetchCollectionsMixin-BaPcOLwP.chunk.mjs.map
