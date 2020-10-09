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

  it("plain text", async () => {
    const slateNodes = toSlateProcessor.processSync(
      fs.readFileSync(path.join(__dirname, "../fixture/plain-text.md"))
    ).result;
    expect(slateNodes).toMatchSnapshot();

    const mdastTree = await toRemarkProcessor.run({
      type: "root",
      children: slateNodes,
    });
    expect(mdastTree).toMatchSnapshot();

    const text = toRemarkProcessor.stringify(mdastTree);
    expect(text).toMatchSnapshot();
  });

  it("headings", async () => {
    const slateNodes = toSlateProcessor.processSync(
      fs.readFileSync(path.join(__dirname, "../fixture/headings.md"))
    ).result;
    expect(slateNodes).toMatchSnapshot();

    const mdastTree = await toRemarkProcessor.run({
      type: "root",
      children: slateNodes,
    });
    expect(mdastTree).toMatchSnapshot();

    const text = toRemarkProcessor.stringify(mdastTree);
    expect(text).toMatchSnapshot();
  });

  it("article", async () => {
    const slateNodes = toSlateProcessor.processSync(
      fs.readFileSync(path.join(__dirname, "../fixture/article.md"))
    ).result;
    expect(slateNodes).toMatchSnapshot();

    const mdastTree = await toRemarkProcessor.run({
      type: "root",
      children: slateNodes,
    });
    expect(mdastTree).toMatchSnapshot();

    const text = toRemarkProcessor.stringify(mdastTree);
    expect(text).toMatchSnapshot();
  });
});
