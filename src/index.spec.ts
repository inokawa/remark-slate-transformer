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
import { createEditor, Editor } from "slate";
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
          foo: (node: any, next) => ({
            type: "list",
            children: next(node.children),
          }),
          bar: (node: any) => ({ type: "text", value: node.bar }),
        },
      })
    );
    expect(mdastTree).toMatchSnapshot();
    const text = toRemarkProcessor.stringify(mdastTree as Root /* FIXME */);
    expect(text).toMatchSnapshot();
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
        { text: "inline code", strong: true, emphasis: true } as any,
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
        } as any,
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
        } as any,
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
        } as any,
      ])
    );
    expect((ast as Root).children[0]).toEqual({
      type: "paragraph",
      children: [{ type: "text", value: "a b" }],
    });
    expect(processor.stringify(ast as Root)).toBe("a b\n");
  });
});

describe("html", () => {
  const toSlateProcessor = unified().use(markdown).use(remarkToSlate);
  const toRemarkProcessor = unified().use(stringify);

  it("marks html inside phrasing content as inline", () => {
    const slateNodes = toSlateProcessor.processSync(
      "a <b>bold</b> [x <i>y</i>](u)\n\n<div>block</div>\n"
    ).result as any[];

    const [paragraph, block] = slateNodes;
    const htmlInParagraph = paragraph.children.filter(
      (n: any) => n.type === "html"
    );
    const htmlInLink = paragraph.children
      .find((n: any) => n.type === "link")
      .children.filter((n: any) => n.type === "html");

    expect(htmlInParagraph.map((n: any) => n.inline)).toEqual([true, true]);
    expect(htmlInLink.map((n: any) => n.inline)).toEqual([true, true]);
    expect(block.type).toBe("html");
    expect(block.inline).toBeUndefined();
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
    editor.children = toSlateProcessor.processSync(md).result as any;
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
    editor.children = [
      {
        type: "list",
        ordered: false,
        children: [{ type: "paragraph", children: [{ text: "a" }] }],
      } as any,
    ];
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
    editor.children = toSlateProcessor.processSync(md).result as any;
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
