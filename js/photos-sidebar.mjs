const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=[window.OC.filePath('photos', '', 'js/PhotosTab-mRgG_ZMf.chunk.mjs'),window.OC.filePath('photos', '', 'js/index-Cokc0amN.chunk.mjs'),window.OC.filePath('photos', '', 'js/vue.runtime.esm-Dri5gLQO.chunk.mjs'),window.OC.filePath('photos', '', 'js/icons-BZLMM6Xn.chunk.mjs'),window.OC.filePath('photos', '', 'css/PhotosTab-D8FpRNKm.chunk.css')])))=>i.map(i=>d[i]);
const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { _ as __vitePreload } from "./preload-helper-BO5AHt9u.chunk.mjs";
import { t as translate, V as Vue, a as translatePlural, r as registerDavProperty } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
const InformationOutline = '<svg xmlns="http://www.w3.org/2000/svg" id="mdi-information-outline" viewBox="0 0 24 24"><path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z" /></svg>';
Vue.prototype.t = translate;
Vue.prototype.n = translatePlural;
registerDavProperty("nc:metadata-photos-exif");
registerDavProperty("nc:metadata-photos-ifd0");
registerDavProperty("nc:metadata-photos-gps");
registerDavProperty("nc:metadata-photos-place");
let PhotosTabView = null;
let PhotosTabInstance = null;
const photosTab = new OCA.Files.Sidebar.Tab({
  id: "photos",
  name: translate("photos", "Details"),
  iconSvg: InformationOutline,
  async mount(el, fileInfo, context) {
    if (PhotosTabView === null) {
      const { default: PhotosTab } = await __vitePreload(async () => {
        const { default: PhotosTab2 } = await import("./PhotosTab-mRgG_ZMf.chunk.mjs");
        return { default: PhotosTab2 };
      }, true ? __vite__mapDeps([0,1,2,3,4]) : void 0, import.meta.url);
      PhotosTabView = PhotosTabView ?? Vue.extend(PhotosTab);
    }
    if (PhotosTabInstance) {
      PhotosTabInstance.$destroy();
    }
    PhotosTabInstance = new PhotosTabView({
      // Better integration with vue parent component
      parent: context
    });
    PhotosTabInstance.update(fileInfo);
    PhotosTabInstance.$mount(el);
  },
  update(fileInfo) {
    PhotosTabInstance.update(fileInfo);
  },
  destroy() {
    PhotosTabInstance.$destroy();
    PhotosTabInstance = null;
  }
});
window.addEventListener("DOMContentLoaded", async function() {
  if (window.OCA.Files && window.OCA.Files.Sidebar) {
    window.OCA.Files.Sidebar.registerTab(photosTab);
    const { default: PhotosTab } = await __vitePreload(async () => {
      const { default: PhotosTab2 } = await import(
        /* webpackPreload: true */
        "./PhotosTab-mRgG_ZMf.chunk.mjs"
      );
      return { default: PhotosTab2 };
    }, true ? __vite__mapDeps([0,1,2,3,4]) : void 0, import.meta.url);
    PhotosTabView = PhotosTabView ?? Vue.extend(PhotosTab);
  }
});
//# sourceMappingURL=photos-sidebar.mjs.map
