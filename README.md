# remark-slate-transformer

![npm](https://img.shields.io/npm/v/remark-slate-transformer) ![npm](https://img.shields.io/npm/dw/remark-slate-transformer) ![check](https://github.com/inokawa/remark-slate-transformer/workflows/check/badge.svg) ![demo](https://github.com/inokawa/remark-slate-transformer/workflows/demo/badge.svg)

[remark](https://github.com/remarkjs/remark) plugin to transform remark syntax tree ([mdast](https://github.com/syntax-tree/mdast)) to [Slate](https://github.com/ianstormtaylor/slate) document tree, and vice versa. Made for WYSIWYG markdown editor.

[remark](https://github.com/remarkjs/remark) is popular markdown parser/serializer which data structure can be converted to what used in [rehype](https://github.com/rehypejs/rehype), [retext](https://github.com/retextjs/retext) and so on. [Slate](https://github.com/ianstormtaylor/slate) is fully customizable rich text editor built on [React](https://github.com/facebook/react). Connect both 2 worlds should be great...

> [!NOTE]
> For Plate users, try https://github.com/inokawa/remark-slate-transformer/issues/31#issuecomment-2786317057

## Support

This plugin supports slate 0.50+.
The data structure is described [here](https://docs.slatejs.org/concepts/02-nodes).
slate ~0.47.9 was supported until 0.8.1.

All nodes in [mdast](https://github.com/syntax-tree/mdast) syntax tree are supported, including nodes created with...

- [remark-gfm](https://github.com/remarkjs/remark-gfm)
- [remark-frontmatter](https://github.com/remarkjs/remark-frontmatter)
- `math` and `inlineMath` from [remark-math](https://github.com/remarkjs/remark-math).

And also have experimental support for [custom AST](https://github.com/inokawa/remark-slate-transformer#support-custom-ast).

## Demo

https://inokawa.github.io/remark-slate-transformer/

## Install

```sh
npm install remark-slate-transformer
```

### Supported unified versions

| remark-slate-transformer | unified          |
| ------------------------ | ---------------- |
| >=0.9.0                  | >=11.0.0         |
| >=0.7.0 <0.9.0           | >=10.1.0 <11.0.0 |
| >=0.5.0 <0.7.0           | >=10.0.0         |
| <0.5.0                   | <10.0.0          |

## Usage

### Transform remark to slate

```javascript
import { unified } from "unified";
import markdown from "remark-parse";
import { remarkToSlate } from "remark-slate-transformer";

const processor = unified().use(markdown).use(remarkToSlate);

const text = "# hello world";

const value = processor.processSync(text).result;
console.log(value);
```

### Transform slate to remark

```javascript
import { unified } from "unified";
import stringify from "remark-stringify";
import { slateToRemark } from "remark-slate-transformer";

const processor = unified().use(stringify);

const value = ...; // value passed to slate editor

const ast = processor.runSync(slateToRemark(value));
const text = processor.stringify(ast);
console.log(text);
```

### Support custom AST

```js
import { unified } from "unified";
import markdown from "remark-parse";
import stringify from "remark-stringify";
import { remarkToSlate, slateToRemark } from "remark-slate-transformer";

const text = "# hello world";
const r2s = unified()
  .use(markdown)
  .use(remarkToSlate, {
    // If you use TypeScript, install `@types/mdast` for autocomplete.
    overrides: {
      // This overrides `type: "heading"` builder of remarkToSlate
      heading: (node, next) => ({
        type: "head",
        dep: node.depth,
        // You have to call next if the node have children
        children: next(node.children),
      }),
      // Unknown type from community plugins can be handled
      foo: (node, next) => ({ type: "foo", value: node.bar }),
    },
  });
const value = r2s.processSync(text).result;
console.log(value);

const s2r = unified().use(stringify);
const ast = s2r.runSync(
  slateToRemark(value, {
    overrides: {
      head: (node, next) => ({
        type: "heading",
        depth: node.dep,
        children: next(node.children),
      }),
      foo: (node, next) => ({ type: "foo", bar: node.value }),
    },
  })
);
const text = s2r.stringify(ast);
console.log(text);
```

`remarkToSlate` builders also get the marks around the node, like `{ strong: true }`, as a third argument. Spread them into a text you return so it keeps them:

```js
inlineCode: (node, next, marks) => ({ ...marks, mono: true, text: node.value }),
```

### Mark names

Texts get marks named after the mdast types: `strong`, `emphasis`, `delete` and `inlineCode`. Pass `marks` to both sides to use your editor's names instead:

```js
const marks = {
  strong: "bold",
  emphasis: "italic",
  delete: "strikethrough",
  inlineCode: "code",
};

unified().use(markdown).use(remarkToSlate, { marks });
slateToRemark(value, { marks });
```

Once a mark is renamed, `slateToRemark` reads only the new name.

### Utilities

Transformer utilities `mdastToSlate` and `slateToMdast` are also exported for more fine-tuned control.

### Inline HTML

mdast uses `type: "html"` for both block and inline HTML. When `html` appears inside phrasing content (a paragraph, heading, table cell or link), the Slate element gets `inline: true`. Use it in `isInline` so Slate doesn't treat inline HTML as a block:

```js
const { isInline } = editor;
editor.isInline = (element) =>
  element.type === "html" ? !!element.inline : isInline(element);
```

### Editor setup

Slate needs to know which elements are inline and which are void, or normalization removes them from paragraphs. `withMdast` sets `isInline` and `isVoid` for the elements this package creates, wraps stray list children in `listItem`, and makes Enter inside a list item start a new item:

```js
import { createEditor } from "slate";
import { withMdast } from "remark-slate-transformer";

const editor = withMdast(createEditor());
```

`isMdastInline` and `isMdastVoid` are exported too, for editors that set up `isInline` and `isVoid` themselves.

## Contribute

All contributions are welcome.
If you find a problem, feel free to create an [issue](https://github.com/inokawa/remark-slate-transformer/issues) or a [PR](https://github.com/inokawa/remark-slate-transformer/pulls).

### Making a Pull Request

1. Fork this repo.
2. Run `npm install`.
3. Commit your fix.
4. Add tests to cover the fix.
5. Make a PR and confirm all the CI checks passed.

## Related projects

- [remark-docx](https://github.com/inokawa/remark-docx)
- [remark-pdf](https://github.com/inokawa/remark-pdf)
