const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { j as getCurrentInstance, V as Vue, q as computed } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
function useModelMigration(oldModelName, oldModelEvent, required = false) {
  const vm = getCurrentInstance().proxy;
  if (required && vm.$props[oldModelName] === void 0 && vm.$props.modelValue === void 0) {
    Vue.util.warn(`Missing required prop: "modelValue" or old "${oldModelName}"`);
  }
  const model = computed({
    get() {
      if (vm.$props[oldModelName] !== void 0) {
        return vm.$props[oldModelName];
      }
      return vm.$props.modelValue;
    },
    set(value) {
      vm.$emit("update:modelValue", value);
      vm.$emit("update:model-value", value);
      vm.$emit(oldModelEvent, value);
    }
  });
  return model;
}
export {
  useModelMigration as u
};
//# sourceMappingURL=useModelMigration-EhAWvqDD-DYrjrJkv.chunk.mjs.map
