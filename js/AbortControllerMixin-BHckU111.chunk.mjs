import{d as r}from"./vue.runtime.esm-DZVHDHac.chunk.mjs";const n=r({name:"AbortControllerMixin",data(){return{abortController:new AbortController}},beforeDestroy(){this.abortController.abort()},beforeRouteLeave(t,e,o){this.abortController.abort(),this.abortController=new AbortController,o()}});export{n as A};
//# sourceMappingURL=AbortControllerMixin-BHckU111.chunk.mjs.map
