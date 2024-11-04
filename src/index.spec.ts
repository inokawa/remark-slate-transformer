import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { unified } from "unified";
import markdown from "remark-parse";
import gfm from "remark-gfm";
import frontmatter from "remark-frontmatter";
import math from "remark-math";
import stringify from "remark-stringify";
import { remarkToSlate, slateToRemark } from ".";
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
});
