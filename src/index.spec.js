import fs from "fs";
import path from "path";
import unified from "unified";
import markdown from "remark-parse";
import { remarkToSlate, slateToRemark } from "./";

describe("remark to slate", () => {
  const processor = unified()
    .use(markdown, { commonmark: true })
    .use(remarkToSlate);

  it("plain text", () => {
    return processor
      .process(
        fs.readFileSync(path.join(__dirname, "../fixture/plain-text.md"))
      )
      .then((res) => {
        expect(res.result).toMatchSnapshot();
      });
  });

  it("headings", () => {
    return processor
      .process(fs.readFileSync(path.join(__dirname, "../fixture/headings.md")))
      .then((res) => {
        expect(res.result).toMatchSnapshot();
      });
  });

  it("article", () => {
    return processor
      .process(fs.readFileSync(path.join(__dirname, "../fixture/article.md")))
      .then((res) => {
        expect(res.result).toMatchSnapshot();
      });
  });
});

describe("slate to remark", () => {
  const processor = unified()
    .use(markdown, { commonmark: true })
    .use(remarkToSlate);
  const parser = unified().use(slateToRemark);

  it("plain text", () => {
    return parser
      .run({
        type: "root",
        children: processor.processSync(
          fs.readFileSync(path.join(__dirname, "../fixture/plain-text.md"))
        ).result,
      })
      .then((res) => {
        expect(res).toMatchSnapshot();
      });
  });

  it("headings", () => {
    return parser
      .run({
        type: "root",
        children: processor.processSync(
          fs.readFileSync(path.join(__dirname, "../fixture/headings.md"))
        ).result,
      })
      .then((res) => {
        expect(res).toMatchSnapshot();
      });
  });

  it("article", () => {
    return parser
      .run({
        type: "root",
        children: processor.processSync(
          fs.readFileSync(path.join(__dirname, "../fixture/article.md"))
        ).result,
      })
      .then((res) => {
        expect(res).toMatchSnapshot();
      });
  });
});
