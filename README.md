# remark-slate-transformer

![npm](https://img.shields.io/npm/v/remark-slate-transformer) ![check](https://github.com/inokawa/remark-slate-transformer/workflows/check/badge.svg) ![demo](https://github.com/inokawa/remark-slate-transformer/workflows/demo/badge.svg)

[remark](https://github.com/remarkjs/remark) plugin to transform remark syntax tree ([mdast](https://github.com/syntax-tree/mdast)) to [Slate](https://github.com/ianstormtaylor/slate) document tree, and vice versa. Made for WYSIWYG markdown editor.

[remark](https://github.com/remarkjs/remark) is popular markdown parser/serializer which data structure can be converted to what used in [rehype](https://github.com/rehypejs/rehype), [retext](https://github.com/retextjs/retext) and so on. [Slate](https://github.com/ianstormtaylor/slate) is fully customizable rich text editor built on [React](https://github.com/facebook/react). Connect both 2 worlds should be great...

## Support

This plugin supports slate 0.50+.
The data structure is described [here](https://docs.slatejs.org/concepts/02-nodes).
And also support ~0.47.9 currently, but I don't know in the future.

All nodes in [mdast](https://github.com/syntax-tree/mdast) syntax tree are supported, including nodes created with...

- [remark-gfm](https://github.com/remarkjs/remark-gfm)
- [remark-footnotes](https://github.com/remarkjs/remark-footnotes)
- [remark-frontmatter](https://github.com/remarkjs/remark-frontmatter)
- `math` and `inlineMath` from [remark-math](https://github.com/remarkjs/remark-math).

## Demo

https://inokawa.github.io/remark-slate-transformer/

## Install

```sh
npm install remark-slate-transformer
```

## Usage

### Transform remark to slate

#### 0.50+

```javascript
import { unified } from "unified";
import markdown from "remark-parse";
import { remarkToSlate } from "remark-slate-transformer";

const processor = unified().use(markdown).use(remarkToSlate);

const text = "# hello world";

const value = processor.processSync(text).result;
console.log(value);
```

#### ~0.47.9

```javascript
import { Value } from "slate";
import { unified } from "unified";
import markdown from "remark-parse";
import { remarkToSlateLegacy } from "remark-slate-transformer";

const processor = unified().use(markdown).use(remarkToSlateLegacy);

const text = "# hello world";

const value = Value.fromJSON(processor.processSync(text).result);
console.log(value);
```

### Transform slate to remark

#### 0.50+

```javascript
import { unified } from "unified";
import stringify from "remark-stringify";
import { slateToRemark } from "remark-slate-transformer";

const processor = unified().use(slateToRemark).use(stringify);

const value = ...; // value passed to slate editor

const ast = processor.runSync({
  type: "root",
  children: value,
});
const text = processor.stringify(ast);
console.log(text);
```

#### ~0.47.9

```javascript
import { unified } from "unified";
import stringify from "remark-stringify";
import { slateToRemarkLegacy } from "remark-slate-transformer";

const processor = unified().use(slateToRemarkLegacy).use(stringify);

const value = ...; // value passed to slate editor

const ast = processor.runSync({
  type: "root",
  children: value.toJSON().document.nodes,
});
const text = processor.stringify(ast);
console.log(text);
```

### Utilities

Transformer utilities `mdastToSlate` and `slateToMdast` are also exported for more fine-tuned control.
