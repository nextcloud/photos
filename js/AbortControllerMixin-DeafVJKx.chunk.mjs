const e={name:"AbortControllerMixin",data(){return{abortController:new AbortController}},beforeDestroy(){this.abortController.abort()},beforeRouteLeave(r,t,o){this.abortController.abort(),this.abortController=new AbortController,o()}};export{e as A};
//# sourceMappingURL=AbortControllerMixin-DeafVJKx.chunk.mjs.map
