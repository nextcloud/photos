import{d as r}from"./vue.runtime.esm-C8-0a0Ou.chunk.mjs";const n=r({name:"AbortControllerMixin",data(){return{abortController:new AbortController}},beforeDestroy(){this.abortController.abort()},beforeRouteLeave(t,e,o){this.abortController.abort(),this.abortController=new AbortController,o()}});export{n as A};
//# sourceMappingURL=AbortControllerMixin-BOi4MTNa.chunk.mjs.map
