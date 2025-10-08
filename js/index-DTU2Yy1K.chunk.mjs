const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=[window.OC.filePath('photos', '', 'js/index-BC-7VPxC-BDyuTh0B.chunk.mjs'),window.OC.filePath('photos', '', 'js/preload-helper-BO5AHt9u.chunk.mjs'),window.OC.filePath('photos', '', 'js/vue.runtime.esm-Dri5gLQO.chunk.mjs')])))=>i.map(i=>d[i]);
const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { _ as __vitePreload } from "./preload-helper-BO5AHt9u.chunk.mjs";
import { U as pathBrowserifyExports } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
import { s as spawnDialog$1 } from "./dialog-CIZq3-6b.chunk.mjs";
import { am as t, an as n } from "./index-BOzawWmL.chunk.mjs";
const IconMove = '<svg xmlns="http://www.w3.org/2000/svg" id="mdi-folder-move" viewBox="0 0 24 24"><path d="M14,18V15H10V11H14V8L19,13M20,6H12L10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6Z" /></svg>';
const IconCopy = '<svg xmlns="http://www.w3.org/2000/svg" id="mdi-folder-multiple" viewBox="0 0 24 24"><path d="M22,4H14L12,2H6A2,2 0 0,0 4,4V16A2,2 0 0,0 6,18H22A2,2 0 0,0 24,16V6A2,2 0 0,0 22,4M2,6H0V11H0V20A2,2 0 0,0 2,22H20V20H2V6Z" /></svg>';
class FilePickerClosed extends Error {
}
class FilePicker {
  title;
  multiSelect;
  mimeTypeFilter;
  directoriesAllowed;
  buttons;
  path;
  filter;
  container;
  disabledNavigation;
  constructor(title, multiSelect, mimeTypeFilter, directoriesAllowed, buttons, path, filter, container, disabledNavigation = false) {
    this.title = title;
    this.multiSelect = multiSelect;
    this.mimeTypeFilter = mimeTypeFilter;
    this.directoriesAllowed = directoriesAllowed;
    this.path = path;
    this.filter = filter;
    this.buttons = buttons;
    this.container = container;
    this.disabledNavigation = disabledNavigation;
  }
  /**
   * Pick files using the FilePicker.
   *
   * @return Promise with array of picked files or rejected promise on close without picking
   */
  async pickNodes() {
    const { FilePickerVue } = await __vitePreload(async () => {
      const { FilePickerVue: FilePickerVue2 } = await import("./index-BC-7VPxC-BDyuTh0B.chunk.mjs");
      return { FilePickerVue: FilePickerVue2 };
    }, true ? __vite__mapDeps([0,1,2]) : void 0, import.meta.url);
    return new Promise((resolve, reject) => {
      spawnDialog$1(FilePickerVue, {
        allowPickDirectory: this.directoriesAllowed,
        buttons: this.buttons,
        container: this.container,
        name: this.title,
        path: this.path,
        mimetypeFilter: this.mimeTypeFilter,
        multiselect: this.multiSelect,
        filterFn: this.filter,
        disabledNavigation: this.disabledNavigation
      }, (...rest) => {
        const [nodes] = rest;
        if (!Array.isArray(nodes) || nodes.length === 0) {
          reject(new FilePickerClosed("FilePicker: No nodes selected"));
        } else {
          resolve(nodes);
        }
      });
    });
  }
  /**
   * Pick files using the FilePicker
   *
   * @return Promise with array of paths of picked files or rejected promise on close without picking
   */
  async pick() {
    const nodes = await this.pickNodes();
    if (this.multiSelect) {
      return nodes.map((node) => node.path);
    }
    const path = nodes[0]?.path ?? "/";
    return path;
  }
}
class FilePickerBuilder {
  title;
  multiSelect = false;
  mimeTypeFilter = [];
  directoriesAllowed = false;
  path;
  filter;
  buttons = [];
  container;
  disabledNavigation = false;
  /**
   * Construct a new FilePicker
   *
   * @param title Title of the FilePicker
   */
  constructor(title) {
    this.title = title;
  }
  /**
   * Set the container where the FilePicker will be mounted
   * By default 'body' is used
   *
   * @param container The dialog container
   */
  setContainer(container) {
    this.container = container;
    return this;
  }
  /**
   * Enable or disable picking multiple files
   *
   * @param ms True to enable picking multiple files, false otherwise
   */
  setMultiSelect(ms) {
    this.multiSelect = ms;
    return this;
  }
  /**
   * Add allowed MIME type
   *
   * @param filter MIME type to allow
   */
  addMimeTypeFilter(filter) {
    this.mimeTypeFilter.push(filter);
    return this;
  }
  /**
   * Set allowed MIME types
   *
   * @param filter Array of allowed MIME types
   */
  setMimeTypeFilter(filter) {
    this.mimeTypeFilter = filter;
    return this;
  }
  /**
   * Add a button to the FilePicker
   * Note: This overrides any previous `setButtonFactory` call
   *
   * @param button The button
   */
  addButton(button) {
    if (typeof this.buttons === "function") {
      console.warn("FilePicker buttons were set to factory, now overwritten with button object.");
      this.buttons = [];
    }
    this.buttons.push(button);
    return this;
  }
  /**
   * Set the button factory which is used to generate buttons from current view, path and selected nodes
   * Note: This overrides any previous `addButton` call
   *
   * @param factory The button factory
   */
  setButtonFactory(factory) {
    this.buttons = factory;
    return this;
  }
  /**
   * Set FilePicker type based on legacy file picker types
   * @param type The legacy filepicker type to emulate
   * @deprecated Use `addButton` or `setButtonFactory` instead as with setType you do not know which button was pressed
   */
  setType(type) {
    this.buttons = (nodes, path) => {
      const buttons = [];
      const node = nodes?.[0]?.attributes?.displayName || nodes?.[0]?.basename;
      const target = node || pathBrowserifyExports.basename(path);
      if (type === 1) {
        let label = t("Choose");
        if (nodes.length === 1) {
          label = t("Choose {file}", { file: node });
        } else if (this.multiSelect) {
          label = n("Choose %n file", "Choose %n files", nodes.length);
        }
        buttons.push({
          callback: () => {
          },
          type: "primary",
          label
        });
      }
      if (type === 4 || type === 3) {
        buttons.push({
          callback: () => {
          },
          label: target ? t("Copy to {target}", { target }) : t("Copy"),
          type: "primary",
          icon: IconCopy
        });
      }
      if (type === 2 || type === 4) {
        buttons.push({
          callback: () => {
          },
          label: target ? t("Move to {target}", { target }) : t("Move"),
          type: type === 2 ? "primary" : "secondary",
          icon: IconMove
        });
      }
      return buttons;
    };
    return this;
  }
  /**
   * Allow to pick directories besides files
   *
   * @param allow True to allow picking directories
   */
  allowDirectories(allow = true) {
    this.directoriesAllowed = allow;
    return this;
  }
  /**
   * Set starting path of the FilePicker
   *
   * @param path Path to start from picking
   */
  startAt(path) {
    this.path = path;
    return this;
  }
  /**
   * Add filter function to filter file list of FilePicker
   *
   * @param filter Filter function to apply
   */
  setFilter(filter) {
    this.filter = filter;
    return this;
  }
  /**
   * Disable navigation (view selection)
   */
  disableNavigation() {
    this.disabledNavigation = true;
    return this;
  }
  /**
   * Construct the configured FilePicker
   */
  build() {
    return new FilePicker(
      this.title,
      this.multiSelect,
      this.mimeTypeFilter,
      this.directoriesAllowed,
      this.buttons,
      this.path,
      this.filter,
      this.container,
      this.disabledNavigation
    );
  }
}
function getFilePickerBuilder(title) {
  return new FilePickerBuilder(title);
}
const spawnDialog = spawnDialog$1;
export {
  getFilePickerBuilder as g,
  spawnDialog as s
};
//# sourceMappingURL=index-DTU2Yy1K.chunk.mjs.map
