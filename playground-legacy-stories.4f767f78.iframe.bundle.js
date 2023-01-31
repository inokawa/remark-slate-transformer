"use strict";(self.webpackChunkremark_slate_transformer=self.webpackChunkremark_slate_transformer||[]).push([[554],{"./stories/playground/legacy.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{MarkdownToSlateJson:()=>MarkdownToSlateJson,__namedExportsOrder:()=>__namedExportsOrder,default:()=>legacy_stories});__webpack_require__("./node_modules/@storybook/react/dist/index.mjs");var react=__webpack_require__("./node_modules/react/index.js"),slate_es=__webpack_require__("./node_modules/slate_legacy/lib/slate.es.js"),lib=__webpack_require__("./node_modules/unified/lib/index.js"),remark_parse=__webpack_require__("./node_modules/remark-parse/index.js"),remark_gfm=__webpack_require__("./node_modules/remark-gfm/index.js"),remark_frontmatter=__webpack_require__("./node_modules/remark-frontmatter/index.js"),remark_stringify=__webpack_require__("./node_modules/remark-stringify/index.js"),mdast_to_slate=__webpack_require__("./src/transformers/mdast-to-slate/index.ts"),__rest=function(s,e){var t={};for(var p in s)Object.prototype.hasOwnProperty.call(s,p)&&e.indexOf(p)<0&&(t[p]=s[p]);if(null!=s&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(p=Object.getOwnPropertySymbols(s);i<p.length;i++)e.indexOf(p[i])<0&&Object.prototype.propertyIsEnumerable.call(s,p[i])&&(t[p[i]]=s[p[i]])}return t};const convertNodes=nodes=>nodes.reduce(((acc,n)=>{const node=convert(n);return node&&acc.push(node),acc}),[]),convert=node=>{if("text"in node){const{text}=node,rest=__rest(node,["text"]);return{object:"text",text,marks:Object.keys(rest).reduce(((acc,type)=>rest[type]?(acc.push({object:"mark",type}),acc):acc),[])}}switch(node.type){case"paragraph":case"heading":case"blockquote":case"list":case"listItem":case"table":case"tableRow":case"tableCell":case"html":case"code":case"yaml":case"toml":case"thematicBreak":case"definition":case"break":case"math":{const{type,children}=node,rest=__rest(node,["type","children"]);return{object:"block",type,nodes:convertNodes(children),data:Object.assign({},rest)}}case"footnoteDefinition":case"link":case"linkReference":case"image":case"imageReference":case"footnote":case"footnoteReference":case"inlineMath":{const{type,children}=node,rest=__rest(node,["type","children"]);return{object:"inline",type,nodes:convertNodes(children),data:Object.assign({},rest)}}}return null},remark_to_slate0_47=function(){this.Compiler=function(node){return nodes=(0,mdast_to_slate.z)(node,{}),{object:"value",document:{object:"document",nodes:convertNodes(nodes)}};var nodes}};var slate_to_mdast=__webpack_require__("./src/transformers/slate-to-mdast/index.ts");const slate0_47_to_slate_convertNodes=nodes=>nodes.reduce(((acc,n)=>{const node=slate0_47_to_slate_convert(n);return node&&acc.push(node),acc}),[]),slate0_47_to_slate_convert=node=>{switch(node.object){case"block":{const{type,nodes,data}=node;return Object.assign({type,children:slate0_47_to_slate_convertNodes(nodes)},data)}case"inline":{const{type,nodes,data}=node;return Object.assign({type,children:slate0_47_to_slate_convertNodes(nodes)},data)}case"text":{const{text="",marks}=node;return Object.assign({text},null==marks?void 0:marks.reduce(((acc,m)=>(acc[m.type]=!0,acc)),{}))}}return null},slate0_47_to_remark=function(){return function(node){return(0,slate_to_mdast.L)({type:"root",children:(nodes=node.children,slate0_47_to_slate_convertNodes(nodes))},{});var nodes}};var _a,_b,_c,text_editor=__webpack_require__("./stories/components/text-editor.tsx"),components_text=__webpack_require__("./stories/components/text.tsx"),article=__webpack_require__("./fixtures/article.md"),jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const toSlateProcessor=(0,lib.l)().use(remark_parse.Z).use(remark_gfm.Z).use(remark_frontmatter.Z).use(remark_to_slate0_47),toSlate=((0,lib.l)().use(slate0_47_to_remark).use(remark_gfm.Z).use(remark_frontmatter.Z).use(remark_stringify.Z),s=>slate_es.B4.fromJSON(toSlateProcessor.processSync(s).result)),legacy_stories={title:"Playground/Slate ~0.47"},Wrapper=({children})=>(0,jsx_runtime.jsx)("div",{style:(0,react.useMemo)((()=>({width:"100vw",height:"100vh",display:"flex",flexDirection:"row",fontSize:"10.5pt"})),[]),children});Wrapper.displayName="Wrapper";const MarkdownToSlateJson={render:()=>{const[value,setValue]=(0,react.useState)(toSlate(article)),ref=(0,react.useRef)(null);return(0,jsx_runtime.jsxs)(Wrapper,{children:[(0,jsx_runtime.jsx)(text_editor.Z,{ref,initialValue:article}),(0,jsx_runtime.jsx)("div",{style:{padding:10},children:(0,jsx_runtime.jsx)("button",{style:{height:"100%"},onClick:()=>{ref.current&&setValue(toSlate(ref.current.value))},children:"md -> slate"})}),(0,jsx_runtime.jsx)(components_text.Z,{children:JSON.stringify(value,null,2)})]})}};MarkdownToSlateJson.parameters=Object.assign(Object.assign({},MarkdownToSlateJson.parameters),{docs:Object.assign(Object.assign({},null===(_a=MarkdownToSlateJson.parameters)||void 0===_a?void 0:_a.docs),{source:Object.assign({originalSource:'{\n  render: () => {\n    const [value, setValue] = useState(toSlate(text));\n    const ref = useRef<HTMLTextAreaElement>(null);\n    return <Wrapper>\n        <TextEditor ref={ref} initialValue={text} />\n        <div style={{\n        padding: 10\n      }}>\n          <button style={{\n          height: "100%"\n        }} onClick={() => {\n          if (!ref.current) return;\n          setValue(toSlate(ref.current.value));\n        }}>\n            {"md -> slate"}\n          </button>\n        </div>\n        <Text>{JSON.stringify(value, null, 2)}</Text>\n      </Wrapper>;\n  }\n}'},null===(_c=null===(_b=MarkdownToSlateJson.parameters)||void 0===_b?void 0:_b.docs)||void 0===_c?void 0:_c.source)})});const __namedExportsOrder=["MarkdownToSlateJson"]},"./src/transformers/mdast-to-slate/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{z:()=>mdastToSlate});var _utils__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/utils.ts");const mdastToSlate=(node,overrides)=>buildSlateRoot(node,overrides),buildSlateRoot=(root,overrides)=>convertNodes(root.children,{},overrides),convertNodes=(nodes,deco,overrides)=>0===nodes.length?[{text:""}]:nodes.reduce(((acc,node)=>(acc.push(...buildSlateNode(node,deco,overrides)),acc)),[]),buildSlateNode=(node,deco,overrides)=>{var _a;const customNode=null===(_a=overrides[node.type])||void 0===_a?void 0:_a.call(overrides,node,(children=>convertNodes(children,deco,overrides)));if(null!=customNode)return[customNode];switch(node.type){case"paragraph":return[buildParagraph(node,deco,overrides)];case"heading":return[buildHeading(node,deco,overrides)];case"thematicBreak":return[buildThematicBreak(node)];case"blockquote":return[buildBlockquote(node,deco,overrides)];case"list":return[buildList(node,deco,overrides)];case"listItem":return[buildListItem(node,deco,overrides)];case"table":return[buildTable(node,deco,overrides)];case"tableRow":return[buildTableRow(node,deco,overrides)];case"tableCell":return[buildTableCell(node,deco,overrides)];case"html":return[buildHtml(node)];case"code":return[buildCode(node)];case"yaml":return[buildYaml(node)];case"toml":return[buildToml(node)];case"definition":return[buildDefinition(node)];case"footnoteDefinition":return[buildFootnoteDefinition(node,deco,overrides)];case"text":return[buildText(node.value,deco)];case"emphasis":case"strong":case"delete":{const{type,children}=node;return children.reduce(((acc,n)=>(acc.push(...buildSlateNode(n,Object.assign(Object.assign({},deco),{[type]:!0}),overrides)),acc)),[])}case"inlineCode":{const{type,value}=node;return[buildText(value,Object.assign(Object.assign({},deco),{[type]:!0}))]}case"break":return[buildBreak(node)];case"link":return[buildLink(node,deco,overrides)];case"image":return[buildImage(node)];case"linkReference":return[buildLinkReference(node,deco,overrides)];case"imageReference":return[buildImageReference(node)];case"footnote":return[buildFootnote(node,deco,overrides)];case"footnoteReference":return[buildFootnoteReference(node)];case"math":return[buildMath(node)];case"inlineMath":return[buildInlineMath(node)];default:(0,_utils__WEBPACK_IMPORTED_MODULE_0__.t)(node)}return[]},buildParagraph=({type,children},deco,overrides)=>({type,children:convertNodes(children,deco,overrides)}),buildHeading=({type,children,depth},deco,overrides)=>({type,depth,children:convertNodes(children,deco,overrides)}),buildThematicBreak=({type})=>({type,children:[{text:""}]}),buildBlockquote=({type,children},deco,overrides)=>({type,children:convertNodes(children,deco,overrides)}),buildList=({type,children,ordered,start,spread},deco,overrides)=>({type,children:convertNodes(children,deco,overrides),ordered,start,spread}),buildListItem=({type,children,checked,spread},deco,overrides)=>({type,children:convertNodes(children,deco,overrides),checked,spread}),buildTable=({type,children,align},deco,overrides)=>({type,children:convertNodes(children,deco,overrides),align}),buildTableRow=({type,children},deco,overrides)=>({type,children:convertNodes(children,deco,overrides)}),buildTableCell=({type,children},deco,overrides)=>({type,children:convertNodes(children,deco,overrides)}),buildHtml=({type,value})=>({type,children:[{text:value}]}),buildCode=({type,value,lang,meta})=>({type,lang,meta,children:[{text:value}]}),buildYaml=({type,value})=>({type,children:[{text:value}]}),buildToml=({type,value})=>({type,children:[{text:value}]}),buildMath=({type,value})=>({type,children:[{text:value}]}),buildInlineMath=({type,value})=>({type,children:[{text:value}]}),buildDefinition=({type,identifier,label,url,title})=>({type,identifier,label,url,title,children:[{text:""}]}),buildFootnoteDefinition=({type,children,identifier,label},deco,overrides)=>({type,children:convertNodes(children,deco,overrides),identifier,label}),buildText=(text,deco)=>Object.assign(Object.assign({},deco),{text}),buildBreak=({type})=>({type,children:[{text:""}]}),buildLink=({type,children,url,title},deco,overrides)=>({type,children:convertNodes(children,deco,overrides),url,title}),buildImage=({type,url,title,alt})=>({type,url,title,alt,children:[{text:""}]}),buildLinkReference=({type,children,referenceType,identifier,label},deco,overrides)=>({type,children:convertNodes(children,deco,overrides),referenceType,identifier,label}),buildImageReference=({type,alt,referenceType,identifier,label})=>({type,alt,referenceType,identifier,label,children:[{text:""}]}),buildFootnote=({type,children},deco,overrides)=>({type,children:convertNodes(children,deco,overrides)}),buildFootnoteReference=({type,identifier,label})=>({type,identifier,label,children:[{text:""}]})},"./src/transformers/slate-to-mdast/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{L:()=>slateToMdast});var _utils__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/utils.ts");const slateToMdast=(node,overrides)=>buildMdastRoot(node,overrides),buildMdastRoot=(node,overrides)=>({type:"root",children:convertNodes(node.children,overrides)}),convertNodes=(nodes,overrides)=>{const mdastNodes=[];let textQueue=[];for(let i=0;i<=nodes.length;i++){const n=nodes[i];if(n&&isText(n))textQueue.push(n);else{const mdastTexts=[],starts=[];let ends=[],textTemp="";for(let j=0;j<textQueue.length;j++){const cur=textQueue[j];textTemp+=cur.text;const prevStarts=starts.slice(),prevEnds=ends.slice(),prev=textQueue[j-1],next=textQueue[j+1];ends=[],["inlineCode","emphasis","strong","delete"].forEach((k=>{cur[k]&&(prev&&prev[k]||starts.push(k),next&&next[k]||ends.push(k))}));const endsToRemove=starts.reduce(((acc,k,kIndex)=>(ends.includes(k)&&acc.push({key:k,index:kIndex}),acc)),[]);if(starts.length>0){let bef="",aft="";if(1===endsToRemove.length&&(prevStarts.toString()!==starts.toString()||prevEnds.includes("emphasis")&&ends.includes("strong"))&&starts.length-endsToRemove.length==0){for(;textTemp.startsWith(" ");)bef+=" ",textTemp=textTemp.slice(1);for(;textTemp.endsWith(" ");)aft+=" ",textTemp=textTemp.slice(0,-1)}let res={type:"text",value:textTemp};textTemp="";starts.slice().reverse().forEach((k=>{switch(k){case"inlineCode":res={type:k,value:res.value};break;case"strong":case"emphasis":case"delete":res={type:k,children:[res]};break;default:(0,_utils__WEBPACK_IMPORTED_MODULE_0__.t)(k)}}));const arr=[];bef.length>0&&arr.push({type:"text",value:bef}),arr.push(res),aft.length>0&&arr.push({type:"text",value:aft}),mdastTexts.push(...arr)}endsToRemove.length>0?endsToRemove.reverse().forEach((e=>{starts.splice(e.index,1)})):(mdastTexts.push({type:"text",value:textTemp}),textTemp="")}if(textTemp&&(mdastTexts.push({type:"text",value:textTemp}),textTemp=""),mdastNodes.push(...mergeTexts(mdastTexts)),textQueue=[],!n)continue;const node=buildMdastNode(n,overrides);node&&mdastNodes.push(node)}}return mdastNodes},buildMdastNode=(node,overrides)=>{var _a;const customNode=null===(_a=overrides[node.type])||void 0===_a?void 0:_a.call(overrides,node,(children=>convertNodes(children,overrides)));if(null!=customNode)return customNode;switch(node.type){case"paragraph":return buildParagraph(node,overrides);case"heading":return buildHeading(node,overrides);case"thematicBreak":return buildThematicBreak(node);case"blockquote":return buildBlockquote(node,overrides);case"list":return buildList(node,overrides);case"listItem":return buildListItem(node,overrides);case"table":return buildTable(node,overrides);case"tableRow":return buildTableRow(node,overrides);case"tableCell":return buildTableCell(node,overrides);case"html":return buildHtml(node);case"code":return buildCode(node);case"yaml":return buildYaml(node);case"toml":return buildToml(node);case"definition":return buildDefinition(node);case"footnoteDefinition":return buildFootnoteDefinition(node,overrides);case"break":return buildBreak(node);case"link":return buildLink(node,overrides);case"image":return buildImage(node);case"linkReference":return buildLinkReference(node,overrides);case"imageReference":return buildImageReference(node);case"footnote":return buildFootnote(node,overrides);case"footnoteReference":return creatFootnoteReference(node);case"math":return buildMath(node);case"inlineMath":return buildInlineMath(node);default:(0,_utils__WEBPACK_IMPORTED_MODULE_0__.t)(node)}return null},isText=node=>"text"in node,mergeTexts=nodes=>{const res=[];for(const cur of nodes){const last=res[res.length-1];if(last&&last.type===cur.type)"text"===last.type||"inlineCode"===last.type?last.value+=cur.value:last.children=mergeTexts(last.children.concat(cur.children));else{if("text"===cur.type&&""===cur.value)continue;res.push(cur)}}return res},buildParagraph=({type,children},overrides)=>({type,children:convertNodes(children,overrides)}),buildHeading=({type,depth,children},overrides)=>({type,depth,children:convertNodes(children,overrides)}),buildThematicBreak=({type})=>({type}),buildBlockquote=({type,children},overrides)=>({type,children:convertNodes(children,overrides)}),buildList=({type,ordered,start,spread,children},overrides)=>({type,ordered,start,spread,children:convertNodes(children,overrides)}),buildListItem=({type,checked,spread,children},overrides)=>({type,checked,spread,children:convertNodes(children,overrides)}),buildTable=({type,align,children},overrides)=>({type,align,children:convertNodes(children,overrides)}),buildTableRow=({type,children},overrides)=>({type,children:convertNodes(children,overrides)}),buildTableCell=({type,children},overrides)=>({type,children:convertNodes(children,overrides)}),buildHtml=({type,children})=>({type,value:children[0].text}),buildCode=({type,lang,meta,children})=>({type,lang,meta,value:children[0].text}),buildYaml=({type,children})=>({type,value:children[0].text}),buildToml=({type,children})=>({type,value:children[0].text}),buildDefinition=({type,identifier,label,url,title})=>({type,identifier,label,url,title}),buildFootnoteDefinition=({type,identifier,label,children},overrides)=>({type,identifier,label,children:convertNodes(children,overrides)}),buildBreak=({type})=>({type}),buildLink=({type,url,title,children},overrides)=>({type,url,title,children:convertNodes(children,overrides)}),buildImage=({type,url,title,alt})=>({type,url,title,alt}),buildLinkReference=({type,identifier,label,referenceType,children},overrides)=>({type,identifier,label,referenceType,children:convertNodes(children,overrides)}),buildImageReference=({type,identifier,label,alt,referenceType})=>({type,identifier,label,alt,referenceType}),buildFootnote=({type,children},overrides)=>({type,children:convertNodes(children,overrides)}),creatFootnoteReference=({type,identifier,label})=>({type,identifier,label}),buildMath=({type,children})=>({type,value:children[0].text}),buildInlineMath=({type,children})=>({type,value:children[0].text})},"./src/utils.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{t:()=>unreachable});const unreachable=_=>{throw new Error("unreachable")}},"./stories/components/text-editor.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react/jsx-runtime.js");const style={flex:1,padding:10,overflowY:"scroll"},textAreaStyle={width:"100%",height:"100%"},__WEBPACK_DEFAULT_EXPORT__=(0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)((({initialValue},ref)=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div",{style,children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("textarea",{ref,style:textAreaStyle,defaultValue:initialValue})})));try{texteditor.displayName="texteditor",texteditor.__docgenInfo={description:"",displayName:"texteditor",props:{initialValue:{defaultValue:null,description:"",name:"initialValue",required:!0,type:{name:"string"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["stories/components/text-editor.tsx#texteditor"]={docgenInfo:texteditor.__docgenInfo,name:"texteditor",path:"stories/components/text-editor.tsx#texteditor"})}catch(__react_docgen_typescript_loader_error){}},"./stories/components/text.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("./node_modules/react/index.js");var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react/jsx-runtime.js");const style={flex:1,margin:10,overflowY:"scroll"},textStyle={whiteSpace:"pre-wrap"},__WEBPACK_DEFAULT_EXPORT__=({children})=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div",{style,children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div",{style:textStyle,children})});try{text.displayName="text",text.__docgenInfo={description:"",displayName:"text",props:{}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["stories/components/text.tsx#text"]={docgenInfo:text.__docgenInfo,name:"text",path:"stories/components/text.tsx#text"})}catch(__react_docgen_typescript_loader_error){}},"./fixtures/article.md":module=>{module.exports='---\ntitle: "This is frontmatter"\ndate: 2020-04-30 12:34\ncategories: [JavaScript, React]\n---\n\n# heading 1\n\n## heading 2\n\n### heading 3\n\n#### heading 4\n\n##### heading 5\n\n###### heading 6\n\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n\naaaaaaaa**bold**_emphasis_~~delete~~`inline code`\n\n- list\n\n  - list\n    - list\n  - list\n  - list\n\n- [ ] not checked\n- [x] checked\n\n1. ordered list\n1. ordered list\n1. ordered list\n   1. aaa\n   1. aaa\n      1. eeeee\n      1. eeeee\n   1. aaa\n1. ordered list\n\nThis is [link to GitHub.com](https://github.com/).\n\nThis is ![image](https://github.githubassets.com/images/modules/logos_page/Octocat.png).\n\n> quote\n> quote\n> quote\n> quote\n\n> quote\n>\n> > quoted quote\n\n| Left align | Right align | Center align |\n| :--------- | ----------: | :----------: |\n| This       |        This |     This     |\n| column     |      column |    column    |\n| will       |        will |     will     |\n| be         |          be |      be      |\n| left       |       right |    center    |\n| aligned    |     aligned |   aligned    |\n\n<div style="color:red;">\nThis is <u>HTML</u>\n</div>\n\n---\n\n---\n\n```javascript\nfunction $initHighlight(block, cls) {\n  try {\n    if (cls.search(/\\bno\\-highlight\\b/) != -1)\n      return process(block, true, 0x0F) +\n             ` class="${cls}"`;\n  } catch (e) {\n    /* handle exception */\n  }\n  for (var i = 0 / 2; i < classes.length; i++) {\n    if (checkCondition(classes[i]) === undefined)\n      console.log(\'undefined\');\n  }\n\n  return (\n    <div>\n      <web-component>{block}</web-component>\n    </div>\n  )\n}\n\nexport  $initHighlight;\n```\n'}}]);