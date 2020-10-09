# slate-remark

![check](https://github.com/inokawa/slate-remark/workflows/check/badge.svg)

[remark](https://github.com/remarkjs/remark) plugin to transform remark synthax tree ([mdast](https://github.com/syntax-tree/mdast)) to [slate](https://github.com/ianstormtaylor/slate) document tree, and also slate to remark.

This plugin supports slate 0.50+.

**This is under development. In some usecase this will correctly work but in the others may not work.**

## Install

```
npm install slate-remark
```

## Usage

### Transform remark to slate

```javascript
import unified from "unified";
import markdown from "remark-parse";
import { remarkToSlate } from "slate-remark";

const processor = unified()
  .use(markdown, { commonmark: true })
  .use(remarkToSlate);

const res = processor.processSync(text).result;
console.log(res);
```

### Transform slate to remark

```javascript
import unified from "unified";
import stringify from "remark-stringify";
import { slateToRemark } from "slate-remark";

const processor = unified().use(slateToRemark).use(stringify, {
  bullet: "*",
  fence: "~",
  fences: true,
  incrementListMarker: false,
});

const tree = await processor.run({
  type: "root",
  children: value,
});
const res = toRemarkProcessor.stringify(tree);
console.log(res);
```

## Demo

https://inokawa.github.io/slate-remark/
