import"../sb-preview/runtime.mjs";(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))_(t);new MutationObserver(t=>{for(const e of t)if(e.type==="childList")for(const n of e.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&_(n)}).observe(document,{childList:!0,subtree:!0});function s(t){const e={};return t.integrity&&(e.integrity=t.integrity),t.referrerPolicy&&(e.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?e.credentials="include":t.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function _(t){if(t.ep)return;t.ep=!0;const e=s(t);fetch(t.href,e)}})();const R="modulepreload",S=function(r,o){return new URL(r,o).href},O={},l=function(o,s,_){if(!s||s.length===0)return o();const t=document.getElementsByTagName("link");return Promise.all(s.map(e=>{if(e=S(e,_),e in O)return;O[e]=!0;const n=e.endsWith(".css"),m=n?'[rel="stylesheet"]':"";if(!!_)for(let c=t.length-1;c>=0;c--){const a=t[c];if(a.href===e&&(!n||a.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${e}"]${m}`))return;const i=document.createElement("link");if(i.rel=n?"stylesheet":R,n||(i.as="script",i.crossOrigin=""),i.href=e,document.head.appendChild(i),n)return new Promise((c,a)=>{i.addEventListener("load",c),i.addEventListener("error",()=>a(new Error(`Unable to preload CSS for ${e}`)))})})).then(()=>o())},{createChannel:p}=__STORYBOOK_MODULE_CHANNEL_POSTMESSAGE__,{createChannel:w}=__STORYBOOK_MODULE_CHANNEL_WEBSOCKET__,{addons:d}=__STORYBOOK_MODULE_PREVIEW_API__,E=p({page:"preview"});d.setChannel(E);window.__STORYBOOK_ADDONS_CHANNEL__=E;const{SERVER_CHANNEL_URL:u}=globalThis;if(u){const r=w({url:u});d.setServerChannel(r),window.__STORYBOOK_SERVER_CHANNEL__=r}const h={"./stories/playground/current.stories.tsx":async()=>l(()=>import("./current.stories-cd75da23.js"),["./current.stories-cd75da23.js","./article-f216a044.js","./isSymbol-5f0d4ff2.js","./throttle-a1239451.js","./index-a58d94f4.js","./extends-98964cd2.js","./current.stories-29d2a762.css"],import.meta.url),"./stories/playground/legacy.stories.tsx":async()=>l(()=>import("./legacy.stories-a4d43946.js"),["./legacy.stories-a4d43946.js","./article-f216a044.js","./isSymbol-5f0d4ff2.js","./_baseClone-07a2b83f.js","./_Uint8Array-7a97f5ae.js","./isPlainObject-95cb902b.js"],import.meta.url)};async function f(r){return h[r]()}f.__docgenInfo={description:"",methods:[],displayName:"importFn"};const{composeConfigs:T,PreviewWeb:P,ClientApi:y}=__STORYBOOK_MODULE_PREVIEW_API__,L=async()=>{const r=await Promise.all([l(()=>import("./config-5f47117f.js"),["./config-5f47117f.js","./index-4d44bf7c.js","./isSymbol-5f0d4ff2.js","./index-a58d94f4.js","./_Uint8Array-7a97f5ae.js","./isPlainObject-95cb902b.js"],import.meta.url),l(()=>import("./preview-56822596.js"),[],import.meta.url),l(()=>import("./preview-0b9869e2.js"),[],import.meta.url)]);return T(r)};window.__STORYBOOK_PREVIEW__=window.__STORYBOOK_PREVIEW__||new P;window.__STORYBOOK_STORY_STORE__=window.__STORYBOOK_STORY_STORE__||window.__STORYBOOK_PREVIEW__.storyStore;window.__STORYBOOK_CLIENT_API__=window.__STORYBOOK_CLIENT_API__||new y({storyStore:window.__STORYBOOK_PREVIEW__.storyStore});window.__STORYBOOK_PREVIEW__.initialize({importFn:f,getProjectAnnotations:L});export{l as _};
//# sourceMappingURL=iframe-5489025f.js.map