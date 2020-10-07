import fs from "fs";
import path from "path";
import unified from "unified";
import markdown from "remark-parse";
import * as module from "./";

describe(module.remarkToSlate.name, () => {
  const processor = unified()
    .use(markdown, { commonmark: true })
    .use(module.remarkToSlate);

  it("plain text", () => {
    return processor
      .process(fs.readFileSync(path.join(__dirname, "../fixture/plain-text.md")))
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
