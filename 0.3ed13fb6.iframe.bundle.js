(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{"./node_modules/@storybook/components/dist/esm/syntaxhighlighter-82dea71a.js":function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,"SyntaxHighlighter",(function(){return syntaxhighlighter_82dea71a_SyntaxHighlighter})),__webpack_require__.d(__webpack_exports__,"createCopyToClipboardFunction",(function(){return createCopyToClipboardFunction})),__webpack_require__.d(__webpack_exports__,"default",(function(){return syntaxhighlighter_82dea71a_SyntaxHighlighter}));__webpack_require__("./node_modules/regenerator-runtime/runtime.js"),__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"),__webpack_require__("./node_modules/core-js/modules/es.object.entries.js"),__webpack_require__("./node_modules/core-js/modules/es.object.assign.js"),__webpack_require__("./node_modules/core-js/modules/es.string.trim.js"),__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js"),__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.array.slice.js"),__webpack_require__("./node_modules/core-js/modules/es.function.name.js"),__webpack_require__("./node_modules/core-js/modules/es.array.from.js"),__webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js");var index_b45716e8=__webpack_require__("./node_modules/@storybook/components/dist/esm/index-b45716e8.js"),react=__webpack_require__("./node_modules/react/index.js"),react_default=__webpack_require__.n(react),esm=__webpack_require__("./node_modules/@storybook/client-logger/dist/esm/index.js"),dist_esm=__webpack_require__("./node_modules/@storybook/theming/dist/esm/index.js"),memoizerific=__webpack_require__("./node_modules/memoizerific/memoizerific.js"),memoizerific_default=__webpack_require__.n(memoizerific),jsx=__webpack_require__("./node_modules/refractor/lang/jsx.js"),prism_jsx=__webpack_require__.n(jsx).a,bash=__webpack_require__("./node_modules/refractor/lang/bash.js"),prism_bash=__webpack_require__.n(bash).a,css=__webpack_require__("./node_modules/refractor/lang/css.js"),prism_css=__webpack_require__.n(css).a,js_extras=__webpack_require__("./node_modules/refractor/lang/js-extras.js"),prism_js_extras=__webpack_require__.n(js_extras).a,json=__webpack_require__("./node_modules/refractor/lang/json.js"),prism_json=__webpack_require__.n(json).a,graphql=__webpack_require__("./node_modules/refractor/lang/graphql.js"),prism_graphql=__webpack_require__.n(graphql).a,markup=__webpack_require__("./node_modules/refractor/lang/markup.js"),prism_markup=__webpack_require__.n(markup).a,markdown=__webpack_require__("./node_modules/refractor/lang/markdown.js"),prism_markdown=__webpack_require__.n(markdown).a,yaml=__webpack_require__("./node_modules/refractor/lang/yaml.js"),prism_yaml=__webpack_require__.n(yaml).a,tsx=__webpack_require__("./node_modules/refractor/lang/tsx.js"),prism_tsx=__webpack_require__.n(tsx).a,typescript=__webpack_require__("./node_modules/refractor/lang/typescript.js"),prism_typescript=__webpack_require__.n(typescript).a,highlight=__webpack_require__("./node_modules/react-syntax-highlighter/dist/esm/highlight.js"),core=__webpack_require__("./node_modules/refractor/core.js"),core_default=__webpack_require__.n(core),prism_light_SyntaxHighlighter=Object(highlight.a)(core_default.a,{});prism_light_SyntaxHighlighter.registerLanguage=function(_,language){return core_default.a.register(language)},prism_light_SyntaxHighlighter.alias=function(name,aliases){return core_default.a.alias(name,aliases)};var prism_light=prism_light_SyntaxHighlighter;__webpack_require__("./node_modules/@storybook/csf/dist/index.js"),__webpack_require__("./node_modules/qs/lib/index.js");function _slicedToArray(arr,i){return function _arrayWithHoles(arr){if(Array.isArray(arr))return arr}(arr)||function _iterableToArrayLimit(arr,i){var _i=null==arr?null:"undefined"!=typeof Symbol&&arr[Symbol.iterator]||arr["@@iterator"];if(null==_i)return;var _s,_e,_arr=[],_n=!0,_d=!1;try{for(_i=_i.call(arr);!(_n=(_s=_i.next()).done)&&(_arr.push(_s.value),!i||_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{_n||null==_i.return||_i.return()}finally{if(_d)throw _e}}return _arr}(arr,i)||function _unsupportedIterableToArray(o,minLen){if(!o)return;if("string"==typeof o)return _arrayLikeToArray(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);"Object"===n&&o.constructor&&(n=o.constructor.name);if("Map"===n||"Set"===n)return Array.from(o);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _arrayLikeToArray(o,minLen)}(arr,i)||function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _arrayLikeToArray(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}var syntaxhighlighter_82dea71a_navigator=index_b45716e8.bb.navigator,syntaxhighlighter_82dea71a_document=index_b45716e8.bb.document,globalWindow=index_b45716e8.bb.window;prism_light.registerLanguage("jsextra",prism_js_extras),prism_light.registerLanguage("jsx",prism_jsx),prism_light.registerLanguage("json",prism_json),prism_light.registerLanguage("yml",prism_yaml),prism_light.registerLanguage("md",prism_markdown),prism_light.registerLanguage("bash",prism_bash),prism_light.registerLanguage("css",prism_css),prism_light.registerLanguage("html",prism_markup),prism_light.registerLanguage("tsx",prism_tsx),prism_light.registerLanguage("typescript",prism_typescript),prism_light.registerLanguage("graphql",prism_graphql);var themedSyntax=memoizerific_default()(2)((function(theme){return Object.entries(theme.code||{}).reduce((function(acc,_ref){var _ref2=_slicedToArray(_ref,2),key=_ref2[0],val=_ref2[1];return Object.assign(Object.assign({},acc),function _defineProperty(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value:value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}({},"* .".concat(key),val))}),{})})),copyToClipboard=createCopyToClipboardFunction();function createCopyToClipboardFunction(){var _this=this;return(null==syntaxhighlighter_82dea71a_navigator?void 0:syntaxhighlighter_82dea71a_navigator.clipboard)?function(text){return syntaxhighlighter_82dea71a_navigator.clipboard.writeText(text)}:function(text){return Object(index_b45716e8.l)(_this,void 0,void 0,regeneratorRuntime.mark((function _callee(){var tmp,focus;return regeneratorRuntime.wrap((function _callee$(_context){for(;;)switch(_context.prev=_context.next){case 0:tmp=syntaxhighlighter_82dea71a_document.createElement("TEXTAREA"),focus=syntaxhighlighter_82dea71a_document.activeElement,tmp.value=text,syntaxhighlighter_82dea71a_document.body.appendChild(tmp),tmp.select(),syntaxhighlighter_82dea71a_document.execCommand("copy"),syntaxhighlighter_82dea71a_document.body.removeChild(tmp),focus.focus();case 8:case"end":return _context.stop()}}),_callee)})))}}var Wrapper=dist_esm.i.div((function(_ref3){return{position:"relative",overflow:"hidden",color:_ref3.theme.color.defaultText}}),(function(_ref4){var theme=_ref4.theme;return _ref4.bordered?{border:"1px solid ".concat(theme.appBorderColor),borderRadius:theme.borderRadius,background:theme.background.content}:{}})),Scroller=Object(dist_esm.i)((function(_ref5){var children=_ref5.children,className=_ref5.className;return react_default.a.createElement(index_b45716e8.i,{horizontal:!0,vertical:!0,className:className},children)}))({position:"relative"},(function(_ref6){var theme=_ref6.theme;return themedSyntax(theme)})),Pre=dist_esm.i.pre((function(_ref7){var theme=_ref7.theme;return{display:"flex",justifyContent:"flex-start",margin:0,padding:_ref7.padded?theme.layoutMargin:0}})),Code=dist_esm.i.div((function(_ref8){return{flex:1,paddingLeft:2,paddingRight:_ref8.theme.layoutMargin,opacity:1}})),syntaxhighlighter_82dea71a_SyntaxHighlighter=function SyntaxHighlighter(_a){var children=_a.children,_a$language=_a.language,language=void 0===_a$language?"jsx":_a$language,_a$copyable=_a.copyable,copyable=void 0!==_a$copyable&&_a$copyable,_a$bordered=_a.bordered,bordered=void 0!==_a$bordered&&_a$bordered,_a$padded=_a.padded,padded=void 0!==_a$padded&&_a$padded,_a$format=_a.format,format=void 0===_a$format||_a$format,_a$formatter=_a.formatter,formatter=void 0===_a$formatter?null:_a$formatter,_a$className=_a.className,className=void 0===_a$className?null:_a$className,_a$showLineNumbers=_a.showLineNumbers,showLineNumbers=void 0!==_a$showLineNumbers&&_a$showLineNumbers,rest=Object(index_b45716e8.m)(_a,["children","language","copyable","bordered","padded","format","formatter","className","showLineNumbers"]);if("string"!=typeof children||!children.trim())return null;var highlightableCode=formatter?formatter(format,children):children.trim(),_useState2=_slicedToArray(Object(react.useState)(!1),2),copied=_useState2[0],setCopied=_useState2[1],onClick=Object(react.useCallback)((function(e){e.preventDefault();var selectedText=globalWindow.getSelection().toString(),textToCopy="click"!==e.type&&selectedText?selectedText:highlightableCode;copyToClipboard(textToCopy).then((function(){setCopied(!0),globalWindow.setTimeout((function(){return setCopied(!1)}),1500)})).catch(esm.a.error)}),[]);return react_default.a.createElement(Wrapper,{bordered:bordered,padded:padded,className:className,onCopyCapture:onClick},react_default.a.createElement(Scroller,null,react_default.a.createElement(prism_light,Object.assign({padded:padded||bordered,language:language,showLineNumbers:showLineNumbers,showInlineLineNumbers:showLineNumbers,useInlineStyles:!1,PreTag:Pre,CodeTag:Code,lineNumberContainerStyle:{}},rest),highlightableCode)),copyable?react_default.a.createElement(index_b45716e8.a,{actionItems:[{title:copied?"Copied":"Copy",onClick:onClick}]}):null)}}}]);