import{r as v,R as n,a}from"./index-BDI-3E0j.js";var f=Object.defineProperty,_=(e,r)=>{for(var t in r)f(e,t,{get:r[t],enumerable:!0})},p={},d=v;p.createRoot=d.createRoot,p.hydrateRoot=d.hydrateRoot;var s=new Map,w=({callback:e,children:r})=>{let t=a.useRef();return a.useLayoutEffect(()=>{t.current!==e&&(t.current=e,e())},[e]),r},y=async(e,r)=>{let t=await R(r);return new Promise(o=>{t.render(n.createElement(w,{callback:()=>o(null)},e))})},m=(e,r)=>{let t=s.get(e);t&&(t.unmount(),s.delete(e))},R=async e=>{let r=s.get(e);return r||(r=p.createRoot(e),s.set(e,r)),r};const{global:g}=__STORYBOOK_MODULE_GLOBAL__;var x={};_(x,{parameters:()=>L,render:()=>C,renderToCanvas:()=>M});var C=(e,r)=>{let{id:t,component:o}=r;if(!o)throw new Error(`Unable to render story ${t} as the component annotation is missing from the default export`);return n.createElement(o,{...e})},{FRAMEWORK_OPTIONS:i}=g,D=class extends a.Component{constructor(){super(...arguments),this.state={hasError:!1}}static getDerivedStateFromError(){return{hasError:!0}}componentDidMount(){let{hasError:e}=this.state,{showMain:r}=this.props;e||r()}componentDidCatch(e){let{showException:r}=this.props;r(e)}render(){let{hasError:e}=this.state,{children:r}=this.props;return e?null:r}},l=i!=null&&i.strictMode?a.StrictMode:a.Fragment;async function M({storyContext:e,unboundStoryFn:r,showMain:t,showException:o,forceRemount:h},c){let u=n.createElement(D,{showMain:t,showException:o},n.createElement(r,{...e})),E=l?n.createElement(l,null,u):u;return h&&m(c),await y(E,c),()=>m(c)}var L={renderer:"react"};export{L as parameters,C as render,M as renderToCanvas};
