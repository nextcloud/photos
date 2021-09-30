
<template>
  <!-- Errors handlers-->
  <EmptyContent v-if="error === 404" illustration-name="folder">
    {{ t("photos", "This folder does not exist") }}
  </EmptyContent>
  <EmptyContent v-else-if="error">
    {{ t("photos", "An error occurred") }}
  </EmptyContent>

  <!-- Folder content -->
  <div v-else-if="!loading">
    <Navigation
      v-if="isEmpty"
      key="navigation"
      :basename="path"
      :filename="'/'"
      :root-title="rootTitle"
    />

    <EmptyContent v-if="isEmpty" illustration-name="empty">
      {{ t("photos", "No photos in here") }}
    </EmptyContent>
    <div class="main-container">
      <div
        v-for="item in this.contentList"
        class="item"
        :key="item.fileid"
        v-bind:class="{ fullWidth: item.id.includes('title') }"
      >
        <div v-if="item.id.includes('title')">
          <Separator :items="item" />
        </div>
        <div v-else>
          <!-- {{ (file1 = item) }} -->
          <Gallery :item="item" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "@nextcloud/moment";
import { mapGetters } from "vuex";

import getPhotos from "../services/PhotoSearch";
import { generateRemoteUrl, generateUrl } from "@nextcloud/router";
import { getCurrentUser } from "@nextcloud/auth";
import EmptyContent from "../components/EmptyContent";
import File from "../components/File";
import galleryFile from "../components/GalleryFile";
import Gallery from "../components/Gallery";
import Separator from "../components/Separator";
import Navigation from "../components/Navigation";
import Loader from "../components/Loader";

import cancelableRequest from "../utils/CancelableRequest";
import { allMimes } from "../services/AllowedMimes";
import UserConfig from "../mixins/UserConfig";

export default {
  name: "Timeline1",
  components: {
    EmptyContent,
    Navigation,
    Gallery,
    Separator,
  },
  render(h) {
    return h(
      "span",
      `Name: ${this.student.studentName} RegNo: ${this.student.studentRegNo} Marcs: ${this.student.cat1Marks}`
    );
  },
  mixins: [UserConfig],
  props: {
    loading: {
      type: Boolean,
      required: true,
    },
    onlyFavorites: {
      type: Boolean,
      default: false,
    },
    mimesType: {
      type: Array,
      default: () => allMimes,
    },
    rootTitle: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      fileData: Object,
      count: 0,
      cancelRequest: null,
      done: false,
      error: null,
      page: 0,
      lastSection: "",
      fieldArray: [],
      widthData: 1,
      height: "",
      file1: Object,
      width_main: 0,
      loaderComponent: Loader,
    };
  },

  computed: {
    // global lists
    ...mapGetters(["files", "timeline"]),

    // list of loaded medias
    fileList() {
      return this.timeline
        .map((fileId) => this.files[fileId])
        .filter((file) => !!file);
    },

    checkSpace() {
      //check remaining space
    },
    src() {
      return (
        `../../../remote.php/dav/files/${getCurrentUser().uid}` + this.filename
      );
    },
    wrapperRatio() {
      let wrapper = this.$refs.wrapper;
      return wrapper.clientHeight / wrapper.clientWidth;
    },

    // list of displayed content in the grid (titles + medias)
    contentList() {
      const fieldArray = [];
      /** The goal of this flat map is to return an array of images separated by titles (months)
       * ie: [{month1}, {image1}, {image2}, {month2}, {image3}, {image4}, {image5}]
       * First we get the current month+year of the image
       * We compare it to the previous image month+year
       * If there is a difference we have to insert a title object before the current image
       * If it's equal we just add the current image to the array
       * Note: the injected param of objects are used to pass custom params to the grid lib
       * In our case injected could be an image/video (aka file) or a title (year/month)
       * Note2: titles are rendered full width and images are rendered on 1 column and 256x256 ratio
       */
      var finalData = this.fileList.flatMap((galleryFile, index) => {
        const finalArray = [];

        const currentSection = this.getFormatedDate(
          galleryFile.lastmod,
          "YYYY MMMM"
        );
        if (this.lastSection !== currentSection) {
          finalArray.push({
            id: `title-${index}`,
            injected: {
              year: this.getFormatedDate(galleryFile.lastmod, "YYYY"),
              month: this.getFormatedDate(galleryFile.lastmod, "MMMM"),
            },
            height: 90,
            width: 100,
            renderComponent: Separator,
          });
          this.lastSection = currentSection; // we keep track of the last section for the next batch
        }

        finalArray.push({
          id: `img-${galleryFile.fileid}`,
          injected: {
            ...galleryFile,
            loadMore: this.getContent,
            canLoop: false,
          },
          renderComponent: Gallery,
        });
        return finalArray;
      });

      var tempArray = [];
      var tempArray1 = [];
      var tempArray2 = [];
      var j = -1;
      var k = 0;
      var leftContainer = document.getElementById("app-navigation-vue");
      var windowWidth = document.documentElement.clientWidth;
      var originalMainWindow = windowWidth - leftContainer.offsetWidth - 10;
      var gap = 2;
      var max_height = 200;
      var rowWidth = 0;
      var totalRowWidth = originalMainWindow;
      for (var i = 0; i < finalData.length; i++) {
        if (finalData[i].id.includes("title")) {
          if (j >= 0) {
            tempArray1[j] = tempArray;
            j = 0;
            tempArray = [];
          }
          j++;
        } else {
          finalData[i].injected.width = this.aspectRatio(
            finalData[i].injected.height,
            finalData[i].injected.width,
            200,
            0
          );

          finalData[i].injected.height = this.aspectRatioHeight(
            finalData[i].injected.height,
            finalData[i].injected.width,
            200,
            0
          );
          if (finalData[i].injected.height > 200) {
            finalData[i].injected.height = max_height;
          }

          rowWidth += finalData[i].injected.width;
          console.log(
            "file ID :" +
              finalData[i].id +
              "image resize  Width:" +
              finalData[i].injected.width +
              " image resize Height:" +
              finalData[i].injected.height
          );

          tempArray.push(finalData[i]);
          if (rowWidth >= totalRowWidth) {
            tempArray2 = this.adjustHeightWidth(tempArray);
            console.log(tempArray2);
            tempArray = [];
            rowWidth = 0;
          }
        }
      }

      return finalData;
    },
    // is current folder empty?
    isEmpty() {
      return this.fileList.length === 0;
    },
  },

  watch: {
    async onlyFavorites() {
      // reset component
      this.resetState();
      this.getContent();
    },
    async mimesType() {
      // reset component
      this.resetState();
      this.getContent();
    },
  },

  beforeMount() {
    this.resetState();
    this.getContent();
    //this.resetState();
  },

  created() {
    this.resetState();
    //this.getContent();
  },
  mounted() {
    window.addEventListener("resize", this.windowResize);
    this.$nextTick(function () {
      window.addEventListener("scroll", this.onScroll);
      //  this.onScroll(); // needed for initial loading on page
    });
  },

  beforeDestroy() {
    // cancel any pending requests
    if (this.cancelRequest) {
      this.cancelRequest("Changed view");
    }
    this.resetState();
    //window.removeEventListener("scroll", this.handleScroll);
  },

  methods: {
    /** Return next batch of data depending on global offset
     *
     * @param {boolean} doReturn Returns a Promise with the list instead of a boolean
     * @return {Promise<boolean>} Returns a Promise with a boolean that stops infinite loading
     */
    // handleScroll(event) {
    //   // Any code to be executed when the window is scrolled
    //   this.getContent();
    // },

    windowResize() {
      var leftContainer = document.getElementById("app-navigation-vue");
      var windowWidth = document.documentElement.clientWidth;
      console.log("windowWidth");
      if (windowWidth < 760) {
        this.resetState();
        this.getContent();
      }
    },

    randomIntFromInterval(min, max) {
      // min and max included
      return Math.floor(Math.random() * (max - min + 1) + min);
    },

    adjustHeightWidth(fileArray) {
      var leftContainer = document.getElementById("app-navigation-vue");
      var windowWidth = document.documentElement.clientWidth;
      if (windowWidth < 768) {
        var mainWindow = windowWidth - 10;
      } else {
        var mainWindow = windowWidth - leftContainer.offsetWidth - 10;
      }

      var gap = 2;
      var max_height = 200;
      var array_length = 0;
      array_length = fileArray.length;
      console.log("array length: " + array_length);
      var multiplyGap = 2 * array_length;
      console.log("array multiplyGap: " + multiplyGap);
      mainWindow = mainWindow - multiplyGap;
      console.log("array mainWindow: " + mainWindow);
      var height = 200; //this.randomIntFromInterval(150, 230);
      var maxWidth = Math.round(Math.ceil(mainWindow / array_length));

      console.log("maxWidth" + maxWidth);
      console.log(" mainWindow:  " + mainWindow + " maxWidth" + maxWidth);

      for (var i = 0; i < fileArray.length; i++) {
        if (windowWidth > 768 && array_length == 1) {
          console.log("FileName: " + fileArray[i].injected.filename);
          fileArray[i].injected.height = 200;
          fileArray[i].injected.width = fileArray[i].injected.width;
        } else {
          fileArray[i].injected.height = 200;
          fileArray[i].injected.width = maxWidth - 8;
        }
      }
      return fileArray;
    },

    aspectRatio: function (height, width, requiredHeight, repeat = 0) {
      var height1 = requiredHeight;
      var aspectRatio = height1 / (height / width);
      //console.log("------" + Math.round(aspectRatio), height, width);
      return Math.round(aspectRatio);
    },

    aspectRatioHeight: function (height, width, requiredwidth, repeat = 0) {
      var height1 = requiredwidth;
      var aspectRatio = height1 * (height / width);
      //console.log("------" + Math.round(aspectRatio), height, width);
      return Math.round(aspectRatio);
    },

    repeatAspectRatio: function (
      remainingWidth,
      fileObjects,
      remainingWindow,
      originalWindow,
      repeat = 0
    ) {
      for (var i = 0; i < fileObjects.length; i++) {
        if (remainingWindow > 1 && remainingWindow < 50) {
          fileObjects[i].height = 185;
          fileObjects[i].width = this.aspectRatio(
            fileObjects[i].height - 10,
            fileObjects[i].width - 10,
            175
          );
        } else if (remainingWindow > 51 && remainingWindow < 100) {
          fileObjects[i].height = 165;
          fileObjects[i].width = this.aspectRatio(
            fileObjects[i].height - 10,
            fileObjects[i].width - 10,
            165
          );
        } else if (remainingWindow > 101 && remainingWindow < 151) {
          fileObjects[i].height = 155 - repeat * 10;
          fileObjects[i].width = this.aspectRatio(
            fileObjects[i].height - 10 - repeat * 10,
            fileObjects[i].width - 10 - repeat * 10,
            155 - repeat * 10
          );
        }
        var sum = 0;
        for (var i = 0; i < fileObjects.length; i++) {
          sum += fileObjects[i].width;
        }
        if (sum > originalWindow) {
          repeat = repeat + 1;
          var mainWindow = sum - originalWindow;
          // fileObjects = this.repeatAspectRatio(
          //   mainWindow,
          //   fileObjects,
          //   mainWindow,
          //   originalWindow,
          //   repeat
          // );
        }
      }
      return fileObjects;
    },

    aspectRatioWidth: function (
      remainingWidth,
      fileObjects,
      remainingWindow,
      originalWindow,
      repeat = 0
    ) {
      for (var i = 0; i < fileObjects.length; i++) {
        console.log(
          " width : " +
            fileObjects[i].width +
            " remaining : " +
            remainingWindow +
            " original : " +
            originalWindow
        );

        if (remainingWindow > 1 && remainingWindow < 50) {
          fileObjects[i].height = 185 - repeat;
          fileObjects[i].width = this.aspectRatio(
            200 - remainingWindow,
            fileObjects[i].width,
            205 - remainingWindow
          );
        } else if (remainingWindow > 51 && remainingWindow < 100) {
          fileObjects[i].height = 190 - repeat;
          fileObjects[i].width = this.aspectRatio(
            200 - repeat,
            fileObjects[i].width,
            210 - repeat
          );
        } else if (remainingWindow > 101 && remainingWindow < 200) {
          fileObjects[i].height = 170 - repeat;
          fileObjects[i].width = this.aspectRatio(
            200 - repeat,
            fileObjects[i].width,
            240 - repeat
          );
        } else if (remainingWindow < -1 && remainingWindow > -50) {
          fileObjects[i].height = 185 - remainingWindow;
          fileObjects[i].width = this.aspectRatio(
            200,
            fileObjects[i].width,
            190 - remainingWindow
          );
        } else if (remainingWindow > -51 && remainingWindow < -100) {
          fileObjects[i].height = 190;
          fileObjects[i].width = this.aspectRatio(
            200,
            fileObjects[i].width,
            190
          );
        } else if (remainingWindow < -101 && remainingWindow > -200) {
          fileObjects[i].height = 170;
          fileObjects[i].width = this.aspectRatio(
            200,
            fileObjects[i].width,
            165
          );
        }

        console.log("=====================");
      }
      var sum = 0;
      for (var i = 0; i < fileObjects.length; i++) {
        sum += fileObjects[i].width;
      }
      console.log("sum " + sum);
      if (sum > originalWindow) {
        repeat += 1;
        var mainWindow = sum - originalWindow;
        console.log("inner : " + mainWindow + " repeat" + repeat);
        // fileObjects = this.repeatAspectRatio(
        //   mainWindow,
        //   fileObjects,
        //   mainWindow,
        //   originalWindow,
        //   repeat
        // );
      }
      return fileObjects;
    },

    processData: function (files) {
      var obj = Object;
      var obj1 = Object;
      var arr = [];
      var arr1 = [];
      var j = 0;
      var k = 0;
      var calculatedWidth = 0;
      var leftContainer = document.getElementById("app-navigation-vue");
      var windowWidth = document.documentElement.clientWidth;
      var mainWindow = windowWidth - leftContainer.offsetWidth - 12;
      var originalMainWindow = windowWidth - leftContainer.offsetWidth - 12;
      for (var i = 0; i < files.length; i++) {
        files[i].width = this.aspectRatio(
          files[i].height,
          files[i].width,
          200,
          0
        );
        mainWindow = mainWindow - files[i].width;
        arr[j] = files[i];
        j++;
        // if (mainWindow < 10) {
        //   arr = this.aspectRatioWidth(
        //     mainWindow,
        //     arr,
        //     mainWindow,
        //     originalMainWindow,
        //     0
        //   );

        //   //console.log(arr);
        //   arr1.push(arr);
        //   arr = [];
        //   mainWindow = windowWidth - leftContainer.offsetWidth;
        //   k = k++;
        //   j = 0;
        // } else if (mainWindow > 10 && mainWindow < 100) {
        //   arr = this.aspectRatioWidth(
        //     mainWindow,
        //     arr,
        //     mainWindow,
        //     originalMainWindow,
        //     0
        //   );
        //   //console.log(arr);
        //   arr1.push(arr);
        //   arr = [];
        //   mainWindow = windowWidth - leftContainer.offsetWidth;
        //   k = k++;
        //   j = 0;
        // } else if (mainWindow > 100 && mainWindow < 200) {
        //   arr = this.aspectRatioWidth(
        //     mainWindow,
        //     arr,
        //     mainWindow,
        //     originalMainWindow,
        //     0
        //   );
        //   //console.log(arr);
        //   arr1.push(arr);
        //   arr = [];
        //   mainWindow = windowWidth - leftContainer.offsetWidth;
        //   k = k++;
        //   j = 0;
        // } else if (mainWindow > 201) {
        // }
      }
      obj1 = obj;
      console.log(arr1);
      return arr1;
    },
    async getImageHeight(src) {
      return new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = () => resolve(img.height);
        img.onerror = reject;
        img.src = src;
      });
    },

    async getImageWidth(src) {
      return new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = () => resolve(img.width);
        img.onerror = reject;
        img.src = src;
      });
    },
    async getContent(doReturn) {
      this.resetState();
      if (this.done) {
        return Promise.resolve(true);
      }

      // cancel any pending requests
      if (this.cancelRequest) {
        this.cancelRequest("Changed view");
      }

      // if we don't already have some cached data let's show a loader
      if (this.timeline.length === 0) {
        this.$emit("update:loading", true);
      }

      // done loading even with errors
      const { request, cancel } = cancelableRequest(getPhotos);
      this.cancelRequest = cancel;
      const numberOfImagesPerBatch = 20 * 5; // loading 5 rows

      try {
        // Load next batch of images
        const files = await request(this.onlyFavorites, {
          page: this.page,
          perPage: numberOfImagesPerBatch,
          mimesType: this.mimesType,
        });
        console.log(files.length);
        // If we get less files than requested that means we got to the end
        if (files.length !== numberOfImagesPerBatch) {
          this.done = true;
        }

        var filesArray = [];
        for (var i = 0; i < files.length; i++) {
          var y = await this.getImageWidth(
            "/index.php/core/preview?fileId=" +
              files[i].fileid +
              "&x=1000&y=1000&forceIcon=0&a=1"
          );
          files[i].width = y;

          var z = await this.getImageHeight(
            "/index.php/core/preview?fileId=" +
              files[i].fileid +
              "&x=1000&y=1000&forceIcon=0&a=1"
          );
          files[i].height = z;
        }
        console.log(files.length);
        this.$store.dispatch("updateTimeline", files);
        this.$store.dispatch("appendFiles", files);
        this.page += 1;
        if (true) {
          return Promise.resolve(files);
        }

        return Promise.resolve(false);
      } catch (error) {
        if (error.response && error.response.status) {
          if (error.response.status === 404) {
            this.error = 404;
            setTimeout(() => {
              this.$router.push({ name: this.$route.name });
            }, 3000);
          } else {
            this.error = error;
          }
        }

        // cancelled request, moving on...
        console.error("Error fetching timeline", error);
        return Promise.resolve(true);
      } finally {
        // done loading even with errors
        this.$emit("update:loading", false);
        this.cancelRequest = null;
      }
    },

    /**
     * Reset this component data to a pristine state
     */
    resetState() {
      this.$store.dispatch("resetTimeline");
      this.done = false;
      this.error = null;
      this.page = 0;
      this.lastSection = "";
      this.widthData = 0;
      this.$emit("update:loading", true);
    },

    getFormatedDate(string, format) {
      return moment(string).format(format);
    },
  },
};
</script>

<style scoped>
.container {
  width: auto;
}

.main-container {
  display: flex;
  justify-content: start;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  margin: 0 4px;
}

.item {
  width: auto;
  margin: 4px;
  height: 200px;
}

.title-item {
  height: 90px;
  width: 100%;
  margin: 2px;
}
.fullWidth {
  width: 100%;
  height: auto;
}
</style>