import fs from "fs";
import path from "path";
import unified from "unified";
import markdown from "remark-parse";
import stringify from "remark-stringify";
import { remarkToSlate, slateToRemark, remarkToSlateLegacy } from "./";
import { Value } from "slate0.47";

const FIXTURE_PATH = "../fixture";

describe("e2e", () => {
  const toSlateProcessor = unified()
    .use(markdown, { commonmark: true })
    .use(remarkToSlate);
  const toRemarkProcessor = unified().use(slateToRemark).use(stringify);

  const fixtureDir = path.join(__dirname, FIXTURE_PATH);
  const filenames = fs.readdirSync(fixtureDir);
  filenames.forEach((filename) => {
    it(filename, () => {
      const slateNodes = toSlateProcessor.processSync(
        fs.readFileSync(path.join(fixtureDir, filename))
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
});

describe("e2e legacy", () => {
  const toSlateProcessor = unified()
    .use(markdown, { commonmark: true })
    .use(remarkToSlateLegacy);
  // const toRemarkProcessor = unified().use(slateToRemark).use(stringify);

  const fixtureDir = path.join(__dirname, FIXTURE_PATH);
  const filenames = fs.readdirSync(fixtureDir);
  filenames.forEach((filename) => {
    it(filename, () => {
      const slateNodes = toSlateProcessor.processSync(
        fs.readFileSync(path.join(fixtureDir, filename))
      ).result;
      expect(slateNodes).toMatchSnapshot();
      expect(Value.fromJSON(slateNodes)).toMatchSnapshot();

      // const mdastTree = toRemarkProcessor.runSync({
      //   type: "root",
      //   children: slateNodes,
      // });
      // expect(mdastTree).toMatchSnapshot();

      // const text = toRemarkProcessor.stringify(mdastTree);
      // expect(text).toMatchSnapshot();
    });
  });
});
