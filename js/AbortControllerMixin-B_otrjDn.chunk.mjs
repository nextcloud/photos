const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { d as defineComponent } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
const AbortControllerMixin = defineComponent({
  name: "AbortControllerMixin",
  data() {
    return {
      abortController: new AbortController()
    };
  },
  methods: {
    abortPendingRequest() {
      this.abortController.abort();
      this.abortController = new AbortController();
    }
  },
  beforeDestroy() {
    this.abortController.abort();
  },
  beforeRouteLeave(from, to, next) {
    this.abortPendingRequest();
    next();
  }
});
export {
  AbortControllerMixin as A
};
//# sourceMappingURL=AbortControllerMixin-B_otrjDn.chunk.mjs.map
