const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { V as Vue, aa as toRaw } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
function spawnDialog(dialog, props, onClose = () => {
}) {
  const el = document.createElement("div");
  const container = typeof props?.container === "string" ? document.querySelector(props.container) || document.body : document.body;
  container.appendChild(el);
  const vm = new Vue({
    el,
    name: "VueDialogHelper",
    render: (h) => h(dialog, {
      props,
      on: {
        close: (...rest) => {
          onClose(...rest.map((v) => toRaw(v)));
          vm.$destroy();
          el.remove();
        }
      }
    })
  });
  return vm;
}
export {
  spawnDialog as s
};
//# sourceMappingURL=dialog-CIZq3-6b.chunk.mjs.map
