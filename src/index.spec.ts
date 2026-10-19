import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { unified } from "unified";
import markdown from "remark-parse";
import gfm from "remark-gfm";
import frontmatter from "remark-frontmatter";
import math from "remark-math";
import stringify from "remark-stringify";
import { remarkToSlate, slateToRemark, withMdast } from ".";
import type { MdastElement, MdastNode } from ".";
import { createEditor, Editor, Element } from "slate";
import { Root } from "mdast";

const FIXTURE_PATH = "../fixtures";

describe("e2e", () => {
  const toSlateProcessor = unified()
    .use(markdown)
    .use(gfm)
    .use(frontmatter, ["yaml", "toml"])
    .use(math)
    .use(remarkToSlate);
  const toRemarkProcessor = unified()
    .use(gfm)
    .use(frontmatter, ["yaml", "toml"])
    .use(math)
    .use(stringify, { bullet: "-", emphasis: "_" });

  const fixturesDir = path.join(__dirname, FIXTURE_PATH);
  const filenames = fs.readdirSync(fixturesDir);
  filenames.forEach((filename) => {
    it(filename, () => {
      const slateNodes = toSlateProcessor.processSync(
        fs.readFileSync(path.join(fixturesDir, filename))
      ).result;
      expect(slateNodes).toMatchSnapshot();

      const mdastTree = toRemarkProcessor.runSync(slateToRemark(slateNodes));
      expect(mdastTree).toMatchSnapshot();

      const text = toRemarkProcessor.stringify(mdastTree as Root /* FIXME */);
      expect(text).toMatchSnapshot();
    });
  });
});

describe("options", () => {
  it("override builders", () => {
    const mdText = `
  - AAAA
    - BBBB
  - CCCC
    `;
    const toSlateProcessor = unified()
      .use(markdown)
      .use(remarkToSlate, {
        overrides: {
          list: (node, next) => ({
            type: "foo",
            children: next(node.children),
          }),
          text: (node) => ({ type: "bar", bar: node.value }),
        },
      });
    const toRemarkProcessor = unified().use(stringify, { bullet: "-" });
    const slateTree = toSlateProcessor.processSync(mdText).result;
    expect(slateTree).toMatchSnapshot();
    const mdastTree = toRemarkProcessor.runSync(
      slateToRemark(slateTree, {
        overrides: {
          foo: (node, next) => ({
            type: "list",
            children: next(node.children),
          }),
          bar: (node: Element & { bar?: string }) => ({
            type: "text",
            value: node.bar,
          }),
        },
      })
    );
    expect(mdastTree).toMatchSnapshot();
    const text = toRemarkProcessor.stringify(mdastTree as Root /* FIXME */);
    expect(text).toMatchSnapshot();
  });

  it("passes the surrounding marks to override builders", () => {
    const slateTree = unified()
      .use(markdown)
      .use(remarkToSlate, {
        overrides: {
          inlineCode: (node, _next, marks) => ({
            ...marks,
            code: true,
            text: node.value,
          }),
        },
      })
      .processSync("a **b `c`** _`d`_\n").result;
    expect(slateTree).toEqual([
      {
        type: "paragraph",
        children: [
          { text: "a " },
          { strong: true, text: "b " },
          { strong: true, code: true, text: "c" },
          { text: " " },
          { emphasis: true, code: true, text: "d" },
        ],
      },
    ]);
  });
});

describe("marks option", () => {
  const marks = {
    strong: "bold",
    emphasis: "italic",
    delete: "strikethrough",
    inlineCode: "code",
  };
  const value = [
    {
      type: "paragraph",
      children: [
        { text: "a " },
        { bold: true, text: "b " },
        { bold: true, code: true, text: "c" },
        { text: " " },
        { italic: true, text: "d" },
        { text: " " },
        { strikethrough: true, text: "e" },
      ],
    },
  ];

  it("renames marks in remarkToSlate", () => {
    const slateTree = unified()
      .use(markdown)
      .use(gfm)
      .use(remarkToSlate, { marks })
      .processSync("a **b `c`** _d_ ~~e~~\n").result;
    expect(slateTree).toEqual(value);
  });

  it("reads renamed marks in slateToRemark", () => {
    const processor = unified().use(gfm).use(stringify);
    const mdastTree = processor.runSync(slateToRemark(value, { marks }));
    expect(processor.stringify(mdastTree as Root)).toBe(
      "a **b `c`** *d* ~~e~~\n"
    );
  });

  it("ignores the mdast name once a mark is renamed", () => {
    const processor = unified().use(stringify);
    const doc = [
      { type: "paragraph", children: [{ text: "a", strong: true }] },
    ];
    const mdastTree = processor.runSync(slateToRemark(doc, { marks }));
    expect(processor.stringify(mdastTree as Root)).toBe("a\n");
  });

  it("passes renamed marks to override builders", () => {
    const slateTree = unified()
      .use(markdown)
      .use(remarkToSlate, {
        marks,
        overrides: {
          inlineCode: (node, _next, marks) => ({
            ...marks,
            mono: true,
            text: node.value,
          }),
        },
      })
      .processSync("**`c`**\n").result;
    expect(slateTree).toEqual([
      { type: "paragraph", children: [{ bold: true, mono: true, text: "c" }] },
    ]);
  });
});

describe("issues", () => {
  it("issue42", () => {
    const mdText = `
- list
  - list
- list
- list
- 
  `;
    const toSlateProcessor = unified().use(markdown).use(remarkToSlate);
    const toRemarkProcessor = unified().use(stringify, { bullet: "-" });
    const slateTree = toSlateProcessor.processSync(mdText).result;
    expect(slateTree).toMatchSnapshot();
    const mdastTree = toRemarkProcessor.runSync(slateToRemark(slateTree));
    const text = toRemarkProcessor.stringify(mdastTree as Root /* FIXME */);
    expect(text).toMatchSnapshot();
  });

  it("issue44", () => {
    const slateNodes = [
      {
        type: "paragraph",
        children: [
          {
            text: "Naoki Urasawa is a ",
          },
          {
            text: "Japanese ",
            strong: true,
          },
          {
            text: "manga artist and musician. He has been ",
          },
          {
            emphasis: true,
            text: "drawing ",
          },
          {
            text: "manga since he ",
          },
          {
            strong: true,
            text: " was",
          },
          {
            text: " four years old, and for most of his career has created two series simultaneously. ",
          },
          {
            strong: true,
            text: "So there ",
          },
        ],
      },
    ];
    const toSlateProcessor = unified().use(markdown).use(remarkToSlate);
    const toRemarkProcessor = unified().use(stringify, { emphasis: "*" });
    const mdastTree = toRemarkProcessor.runSync(slateToRemark(slateNodes));
    expect(mdastTree).toMatchSnapshot();
    const text = toRemarkProcessor.stringify(mdastTree as Root /* FIXME */);
    expect(text).toMatchSnapshot();
    const slateTree = toSlateProcessor.processSync(text).result;
    expect(slateTree).toMatchSnapshot();
  });

  it("issue90", () => {
    const slateNodes = [
      {
        type: "paragraph",
        children: [
          {
            text: "Italic",
            strong: true,
            emphasis: true,
          },
          {
            strong: true,
            text: " in a bold paragraph",
          },
        ],
      },
      {
        type: "paragraph",
        children: [
          {
            strong: true,
            text: "This is an ",
          },
          {
            text: "Italic",
            strong: true,
            emphasis: true,
          },
          {
            strong: true,
            text: " in a bold paragraph",
          },
        ],
      },
    ];
    const toSlateProcessor = unified().use(markdown).use(remarkToSlate);
    const toRemarkProcessor = unified().use(stringify, { emphasis: "*" });
    const mdastTree = toRemarkProcessor.runSync(slateToRemark(slateNodes));
    expect(mdastTree).toMatchSnapshot();
    const text = toRemarkProcessor.stringify(mdastTree as Root /* FIXME */);
    expect(text).toMatchSnapshot();
    const slateTree = toSlateProcessor.processSync(text).result;
    expect(slateTree).toMatchSnapshot();
  });

  it("issue129", () => {
    const toSlateProcessor = unified().use(markdown).use(remarkToSlate);
    const slateTree = toSlateProcessor.processSync("").result;
    expect(slateTree).toMatchSnapshot();
    const slateTreeWithSpace = toSlateProcessor.processSync(" ").result;
    expect(slateTreeWithSpace).toMatchSnapshot();
  });

  it("issue145", () => {
    const processor = unified().use(stringify, { emphasis: "_" });
    const ast = processor.runSync(
      slateToRemark([
        { text: "inline code", strong: true, emphasis: true },
      ])
    );
    expect(ast).toMatchSnapshot();
    const text = processor.stringify(ast as Root /* FIXME */);
    expect(text).toMatchSnapshot();
  });

  it("issue145-2", () => {
    const processor = unified().use(markdown).use(stringify, { emphasis: "_" });
    const ast = processor.runSync(
      slateToRemark([
        {
          type: "paragraph",
          children: [{ emphasis: true, inlineCode: true, text: "code" }],
        },
      ])
    );
    expect(ast).toMatchSnapshot();
    const text = processor.stringify(ast as Root /* FIXME */);
    expect(text).toMatchSnapshot();
  });
  it("inline code that continues into another mark", () => {
    const processor = unified().use(stringify);
    const ast = processor.runSync(
      slateToRemark([
        {
          type: "paragraph",
          children: [
            { text: "a", inlineCode: true },
            { text: "b", inlineCode: true, delete: true },
          ],
        },
      ])
    );
    expect((ast as Root).children[0]).toEqual({
      type: "paragraph",
      children: [
        { type: "inlineCode", value: "a" },
        { type: "delete", children: [{ type: "inlineCode", value: "b" }] },
      ],
    });
  });
  it("mark on whitespace only", () => {
    const processor = unified().use(stringify);
    const ast = processor.runSync(
      slateToRemark([
        {
          type: "paragraph",
          children: [{ text: "a" }, { text: " ", strong: true }, { text: "b" }],
        },
      ])
    );
    expect((ast as Root).children[0]).toEqual({
      type: "paragraph",
      children: [{ type: "text", value: "a b" }],
    });
    expect(processor.stringify(ast as Root)).toBe("a b\n");
  });
});

describe("htmlMarks option", () => {
  const htmlMarks = { u: "underline", sub: "subscript", sup: "superscript" };
  const toSlate = (md: string) =>
    unified()
      .use(markdown)
      .use(remarkToSlate, { htmlMarks })
      .processSync(md).result;
  const toMarkdown = (value: Parameters<typeof slateToRemark>[0]) => {
    const processor = unified().use(stringify);
    return processor.stringify(
      processor.runSync(slateToRemark(value, { htmlMarks })) as Root
    );
  };

  it("reads paired tags as marks", () => {
    expect(toSlate("a <u>b **c**</u> H<SUB>2</SUB>O x<sup>2</sup>\n")).toEqual([
      {
        type: "paragraph",
        children: [
          { text: "a " },
          { underline: true, text: "b " },
          { underline: true, strong: true, text: "c" },
          { text: " H" },
          { subscript: true, text: "2" },
          { text: "O x" },
          { superscript: true, text: "2" },
        ],
      },
    ]);
  });

  it("marks the text of inline elements between the tags", () => {
    expect(toSlate("<u>[a](b)</u>\n")).toEqual([
      {
        type: "paragraph",
        children: [
          {
            type: "link",
            url: "b",
            title: null,
            children: [{ underline: true, text: "a" }],
          },
        ],
      },
    ]);
  });

  it("pairs tags in children built by an override", () => {
    const slateTree = unified()
      .use(markdown)
      .use(remarkToSlate, {
        htmlMarks,
        overrides: {
          paragraph: (node, next) => ({
            type: "p",
            children: next(node.children),
          }),
        },
      })
      .processSync("a <u>b</u>\n").result;
    expect(slateTree).toEqual([
      { type: "p", children: [{ text: "a " }, { underline: true, text: "b" }] },
    ]);
  });

  it("keeps unknown tags as html", () => {
    const html = (text: string) => ({
      type: "html",
      inline: true,
      children: [{ text }],
    });
    expect(toSlate("<u>a <b>b</b></u>\n")).toEqual([
      {
        type: "paragraph",
        children: [
          { underline: true, text: "a " },
          html("<b>"),
          { underline: true, text: "b" },
          html("</b>"),
        ],
      },
    ]);
  });

  it("follows browsers for unpaired tags", () => {
    expect(toSlate("a <u>b\n\nc</u>d\n")).toEqual([
      { type: "paragraph", children: [{ text: "a " }, { underline: true, text: "b" }] },
      { type: "paragraph", children: [{ text: "cd" }] },
    ]);
  });

  it("follows browsers for tags crossing emphasis", () => {
    expect(toSlate("<u>a **b</u> c**\n")).toEqual([
      {
        type: "paragraph",
        children: [
          { underline: true, text: "a " },
          { underline: true, strong: true, text: "b" },
          { strong: true, text: " c" },
        ],
      },
    ]);
  });

  it("keeps marks from tags around a link out of later links", () => {
    expect(toSlate("[<u>a](b) c\n")).toEqual([
      {
        type: "paragraph",
        children: [
          {
            type: "link",
            url: "b",
            title: null,
            children: [{ underline: true, text: "a" }],
          },
          { text: " c" },
        ],
      },
    ]);
  });

  it("writes marks as tags and reads them back", () => {
    const md = "a <u>b</u> <u>**c**</u> H<sub>2</sub>O x<sup>2</sup>\n";
    expect(toMarkdown(toSlate(md))).toBe(md);
  });

  it("writes marks as tags", () => {
    const b = { text: "b", underline: true };
    const c = { text: "c", strong: true, underline: true, superscript: true };
    expect(
      toMarkdown([{ type: "paragraph", children: [{ text: "a " }, b, c] }])
    ).toBe("a <u>b</u><u><sup>**c**</sup></u>\n");
  });

  it("skips tags around whitespace-only text", () => {
    const space = { text: " ", underline: true };
    expect(
      toMarkdown([
        { type: "paragraph", children: [{ text: "a" }, space, { text: "b" }] },
      ])
    ).toBe("a b\n");
  });

  it("leaves tags alone without the option", () => {
    const slateTree = unified()
      .use(markdown)
      .use(remarkToSlate)
      .processSync("<u>a</u>\n").result;
    expect(slateTree).toEqual([
      {
        type: "paragraph",
        children: [
          { type: "html", inline: true, children: [{ text: "<u>" }] },
          { text: "a" },
          { type: "html", inline: true, children: [{ text: "</u>" }] },
        ],
      },
    ]);
  });
});

describe("text content", () => {
  it("keeps every text in a code block", () => {
    const processor = unified().use(stringify);
    const ast = processor.runSync(
      slateToRemark([
        { type: "code", lang: "js", children: [{ text: "a" }, { text: "b" }] },
      ])
    );
    expect(processor.stringify(ast as Root)).toBe("```js\nab\n```\n");
  });
});

describe("html", () => {
  const toSlateProcessor = unified().use(markdown).use(remarkToSlate);
  const toRemarkProcessor = unified().use(stringify);

  it("marks html inside phrasing content as inline", () => {
    const [paragraph, block] = toSlateProcessor.processSync(
      "a <b>bold</b> [x <i>y</i>](u)\n\n<div>block</div>\n"
    ).result as MdastNode[];

    const childrenOf = (node: MdastNode | undefined) =>
      node && "children" in node ? node.children : [];
    const htmlInline = (nodes: MdastNode[]) =>
      nodes.flatMap((n) => ("type" in n && n.type === "html" ? [n.inline] : []));
    const link = childrenOf(paragraph).find(
      (n) => "type" in n && n.type === "link"
    );

    expect(htmlInline(childrenOf(paragraph))).toEqual([true, true]);
    expect(htmlInline(childrenOf(link))).toEqual([true, true]);
    expect(htmlInline(block ? [block] : [])).toEqual([undefined]);
  });

  it("round-trips inline html", () => {
    const md = "a <b>bold</b> c\n\n<div>block</div>\n";
    const slateNodes = toSlateProcessor.processSync(md).result;
    const mdastTree = toRemarkProcessor.runSync(slateToRemark(slateNodes));
    expect(toRemarkProcessor.stringify(mdastTree as Root)).toBe(md);
  });
});

describe("withMdast", () => {
  const toSlateProcessor = unified().use(markdown).use(gfm).use(remarkToSlate);
  const toRemarkProcessor = unified().use(gfm).use(stringify);

  const normalize = (md: string, editor = withMdast(createEditor())) => {
    editor.children = toSlateProcessor.processSync(md).result;
    Editor.normalize(editor, { force: true });
    const mdastTree = toRemarkProcessor.runSync(slateToRemark(editor.children));
    return toRemarkProcessor.stringify(mdastTree as Root);
  };

  it("keeps inline nodes inside paragraphs through normalization", () => {
    const md =
      "a <b>`bold`</b> [link](u) ![img](i.png) [^1] x\\\ny\n\n<div>block</div>\n\n***\n\n[^1]: note\n";
    expect(normalize(md)).toBe(md);
  });

  it("loses inline html without it", () => {
    const md = "a <b>`bold`</b> c\n";
    expect(normalize(md, createEditor())).not.toBe(md);
  });

  it("wraps list children that are not list items", () => {
    const editor = withMdast(createEditor());
    const value: MdastElement[] = [
      {
        type: "list",
        ordered: false,
        children: [{ type: "paragraph", children: [{ text: "a" }] }],
      },
    ];
    editor.children = value;
    Editor.normalize(editor, { force: true });
    expect(editor.children).toEqual([
      {
        type: "list",
        ordered: false,
        children: [
          {
            type: "listItem",
            children: [{ type: "paragraph", children: [{ text: "a" }] }],
          },
        ],
      },
    ]);
  });
});

describe("withMdast insertBreak", () => {
  const toSlateProcessor = unified().use(markdown).use(gfm).use(remarkToSlate);
  const toRemarkProcessor = unified()
    .use(gfm)
    .use(stringify, { bullet: "-" });

  const breakAt = (md: string, path: number[], offset: number) => {
    const editor = withMdast(createEditor());
    editor.children = toSlateProcessor.processSync(md).result;
    editor.select({ path, offset });
    editor.insertBreak();
    const mdastTree = toRemarkProcessor.runSync(slateToRemark(editor.children));
    return toRemarkProcessor.stringify(mdastTree as Root);
  };

  it("splits a list item instead of its paragraph", () => {
    expect(breakAt("- ab\n- c\n", [0, 0, 0, 0], 1)).toBe("- a\n- b\n- c\n");
  });

  it("splits an ordered list item", () => {
    expect(breakAt("1. ab\n", [0, 0, 0, 0], 1)).toBe("1. a\n2. b\n");
  });

  it("starts the new task list item unchecked", () => {
    expect(breakAt("- [x] ab\n", [0, 0, 0, 0], 1)).toBe("- [x] a\n- [ ] b\n");
  });

  it("splits a paragraph outside lists as before", () => {
    expect(breakAt("ab\n", [0, 0], 1)).toBe("a\n\nb\n");
  });
});
