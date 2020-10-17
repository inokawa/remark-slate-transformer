import fs from "fs";
import path from "path";
import unified from "unified";
import markdown from "remark-parse";
import gfm from "remark-gfm";
import footnotes from "remark-footnotes";
import frontmatter from "remark-frontmatter";
import stringify from "remark-stringify";
import {
  remarkToSlate,
  slateToRemark,
  remarkToSlateLegacy,
  slateToRemarkLegacy,
} from "./";
import { Value } from "slate_legacy";

const FIXTURE_PATH = "../fixture";

describe("e2e", () => {
  const toSlateProcessor = unified()
    .use(markdown, { commonmark: true })
    .use(gfm)
    .use(footnotes, { inlineNotes: true })
    .use(frontmatter, ["yaml", "toml"])
    .use(remarkToSlate);
  const toRemarkProcessor = unified()
    .use(slateToRemark)
    .use(gfm)
    .use(footnotes, { inlineNotes: true })
    .use(frontmatter, ["yaml", "toml"])
    .use(stringify, { bullet: "-", emphasis: "_" });

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
    .use(gfm)
    .use(footnotes, { inlineNotes: true })
    .use(frontmatter, ["yaml", "toml"])
    .use(remarkToSlateLegacy);
  const toRemarkProcessor = unified()
    .use(slateToRemarkLegacy)
    .use(gfm)
    .use(footnotes, { inlineNotes: true })
    .use(frontmatter, ["yaml", "toml"])
    .use(stringify, { bullet: "-", emphasis: "_" });

  const fixtureDir = path.join(__dirname, FIXTURE_PATH);
  const filenames = fs.readdirSync(fixtureDir);
  filenames.forEach((filename) => {
    it(filename, () => {
      const value = toSlateProcessor.processSync(
        fs.readFileSync(path.join(fixtureDir, filename))
      ).result;
      expect(value).toMatchSnapshot();
      expect(Value.fromJSON(value)).toMatchSnapshot();

      const mdastTree = toRemarkProcessor.runSync({
        type: "root",
        children: value.document.nodes,
      });
      expect(mdastTree).toMatchSnapshot();

      const text = toRemarkProcessor.stringify(mdastTree);
      expect(text).toMatchSnapshot();
    });
  });
});
