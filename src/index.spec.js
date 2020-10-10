import fs from "fs";
import path from "path";
import unified from "unified";
import markdown from "remark-parse";
import stringify from "remark-stringify";
import { remarkToSlate, slateToRemark } from "./";

describe("e2e", () => {
  const toSlateProcessor = unified()
    .use(markdown, { commonmark: true })
    .use(remarkToSlate);
  const toRemarkProcessor = unified().use(slateToRemark).use(stringify);

  it.each([["article.md"], ["headings.md"], ["plain-text.md"]])("%s", (p) => {
    const slateNodes = toSlateProcessor.processSync(
      fs.readFileSync(path.join(__dirname, "../fixture/", p))
    ).result;
    expect(slateNodes).toMatchSnapshot();

    const mdastTree = toRemarkProcessor.runSync({
      type: "root",
      children: slateNodes,
    });
    expect(mdastTree).toMatchSnapshot();

    const text = toRemarkProcessor.stringify(mdastTree);
    expect(text).toMatchSnapshot();
  });
});
