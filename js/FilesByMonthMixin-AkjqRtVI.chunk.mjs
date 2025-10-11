const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { d as defineComponent } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
const FilesByMonthMixin = defineComponent({
  name: "FilesByMonthMixin",
  computed: {
    fileIdsByMonth() {
      const filesByMonth = {};
      for (const fileId of this.fetchedFileIds) {
        const file = this.files[fileId];
        if (file) {
          filesByMonth[file.attributes.month] = filesByMonth[file.attributes.month] ?? [];
          filesByMonth[file.attributes.month].push(file.fileid);
        }
      }
      Object.keys(filesByMonth).forEach((month) => filesByMonth[month].sort(this.sortFilesByTimestamp));
      return filesByMonth;
    },
    monthsList() {
      return Object.keys(this.fileIdsByMonth).sort((month1, month2) => month1 > month2 ? -1 : 1);
    }
  },
  methods: {
    sortFilesByTimestamp(fileId1, fileId2) {
      return this.files[fileId1].attributes.timestamp > this.files[fileId2].attributes.timestamp ? -1 : 1;
    }
  }
});
export {
  FilesByMonthMixin as F
};
//# sourceMappingURL=FilesByMonthMixin-AkjqRtVI.chunk.mjs.map
