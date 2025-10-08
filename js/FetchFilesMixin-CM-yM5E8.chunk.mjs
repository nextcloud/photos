const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { d as defineComponent, N as joinPaths, J as defaultRootPath, t as translate } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
import { l as logger, p as photosStore, al as davClient, aj as showError, ap as SemaphoreWithPriority } from "./index-BOzawWmL.chunk.mjs";
import { g as getPhotos } from "./PhotoSearch-Y02mQqQD.chunk.mjs";
import { A as AbortControllerMixin } from "./AbortControllerMixin-B_otrjDn.chunk.mjs";
const FetchFilesMixin = defineComponent({
  name: "FetchFilesMixin",
  mixins: [AbortControllerMixin],
  data() {
    return {
      errorFetchingFiles: null,
      loadingFiles: false,
      doneFetchingFiles: false,
      fetchSemaphore: new SemaphoreWithPriority(1),
      fetchedFileIds: []
    };
  },
  watch: {
    "$route.path": function() {
      this.resetFetchFilesState();
    }
  },
  methods: {
    /**
     * @param options - Options to pass to getPhotos.
     * @param blacklist - Array of ids to filter out.
     * @param force - Force fetching even if doneFetchingFiles is true
     * @return The next batch of data depending on global offset.
     */
    async fetchFiles(options = {}, blacklist = [], force = false) {
      if (this.doneFetchingFiles && !force || this.loadingFiles) {
        return [];
      }
      const signal = this.abortController.signal;
      const fetchSemaphoreSymbol = await this.fetchSemaphore.acquire();
      try {
        this.errorFetchingFiles = null;
        this.loadingFiles = true;
        const numberOfImagesPerBatch = 200;
        const fetchedFiles = await getPhotos({
          firstResult: this.fetchedFileIds.length,
          nbResults: numberOfImagesPerBatch,
          ...options,
          signal
        });
        if (fetchedFiles.length !== numberOfImagesPerBatch) {
          this.doneFetchingFiles = true;
        }
        const fileIds = fetchedFiles.map((file) => file.fileid).filter((fileId) => !this.fetchedFileIds.includes(fileId));
        this.fetchedFileIds.push(...fileIds.filter((fileId) => !blacklist.includes(fileId)));
        this.$store.dispatch("appendFiles", fetchedFiles);
        logger.debug(`[FetchFilesMixin] Fetched ${fileIds.length} new files: `, { fileIds });
        return fileIds;
      } catch (error) {
        if (error.response?.status === 404) {
          const sources = photosStore.state.userConfig.photosSourceFolders;
          for (const source of sources) {
            if (error.response?.data?.match(`File with name /${source} could not be located`) === null) {
              continue;
            }
            logger.debug(`The ${source} folder does not exist, creating it.`);
            try {
              await davClient.createDirectory(joinPaths(defaultRootPath, source));
              this.resetFetchFilesState();
              return [];
            } catch (error2) {
              this.errorFetchingFiles = 404;
              logger.error("Fail to create source directory", { error: error2 });
            }
          }
        } else if (error instanceof DOMException && error.code === error.ABORT_ERR) {
          return [];
        } else {
          this.errorFetchingFiles = error;
        }
        showError(translate("photos", "Error fetching files"));
        logger.error(translate("photos", "Error fetching files"), { error });
      } finally {
        this.loadingFiles = false;
        this.fetchSemaphore.release(fetchSemaphoreSymbol);
      }
      return [];
    },
    resetFetchFilesState() {
      this.abortPendingRequest();
      this.doneFetchingFiles = false;
      this.errorFetchingFiles = null;
      this.loadingFiles = false;
      this.fetchedFileIds = [];
    }
  }
});
export {
  FetchFilesMixin as F
};
//# sourceMappingURL=FetchFilesMixin-CM-yM5E8.chunk.mjs.map
