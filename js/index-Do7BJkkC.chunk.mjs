function e(t,r,o){const n=document.querySelector(`#initial-state-${t}-${r}`);if(n===null){if(o!==void 0)return o;throw new Error(`Could not find initial state ${r} of ${t}`)}try{return JSON.parse(atob(n.value))}catch{throw new Error(`Could not parse initial state ${r} of ${t}`)}}export{e as l};
//# sourceMappingURL=index-Do7BJkkC.chunk.mjs.map
