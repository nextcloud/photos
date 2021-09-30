<template>
  <a
    :class="{}"
    class="file"
    :href="davPath"
    :aria-label="ariaLabel"
    @click.prevent="openViewer"
  >
    <div
      v-if="item.injected.mime.includes('video') && item.injected.hasPreview"
      class="icon-video-white"
    />
    <img
      :id="ariaUuid"
      ref="myDiv"
      :src="src"
      :height="height"
      :width="width"
    />

    <p :id="ariaUuid" class="hidden-visually">{{ item.injected.basename }}</p>
    <div class="cover" role="none" />
  </a>
</template>

<script>
import { generateRemoteUrl, generateUrl } from "@nextcloud/router";
import { getCurrentUser } from "@nextcloud/auth";

import UserConfig from "../mixins/UserConfig";

export default {
  name: "Gallery",
  mixins: [UserConfig],
  inheritAttrs: false,
  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      loaded: false,
      error: false,
    };
  },
  computed: {
    davPath() {
      return generateUrl(
        `/core/preview?fileId=${
          this.item.injected.fileid
        }&x=${1000}&y=${1000}&a=0&v=${this.item.injected.etag}`
      );
    },
    ariaUuid() {
      return `image-${this.item.injected.fileid}`;
    },
    ariaLabel() {
      return t("photos", 'Open the full size "{name}" image', {
        name: this.item.injected.basename,
      });
    },
    isImage() {
      return this.item.injected.mime.startsWith("image");
    },
    height() {
      return this.item.injected.height;
    },
    width() {
      return this.item.injected.width;
    },
    src() {
      return generateUrl(
        `/core/preview?fileId=${
          this.item.injected.fileid
        }&x=${1000}&y=${1000}&a=1&v=${this.item.injected.etag}`
      );
    },
  },
  mounted() {
    // window.addEventListener("resize", this.handleResize);
    // this.handleResize();
  },
  beforeDestroy() {
    // cancel any pending load
    this.$refs.src = "";
  },

  methods: {
    openViewer() {
      OCA.Viewer.open({
        path: this.item.injected.filename,
        list: this.item.injected.list,
        loadMore: this.item.injected.loadMore
          ? async () => await this.item.injected.loadMore(true)
          : () => [],
        canLoop: this.item.injected.canLoop,
      });
    },

    /** When the image is fully loaded by browser we remove the placeholder */
    onLoad() {
      this.loaded = true;
    },

    onError() {
      this.error = true;
    },
  },
};
</script>

<style scoped>
.img {
  height: 200px;
}
</style>