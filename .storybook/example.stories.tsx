import React from "react";
import unified from "unified";
import markdown from "remark-parse";
import { remarkToSlate } from "../src";
import Editor from "./editor";
import MdStyle from "./md-style";
import text from "../fixture/article.md";

const processor = unified()
  .use(markdown, { commonmark: true })
  .use(remarkToSlate as any);

export default {
  title: "example",
};

export const Sample = () => (
  <MdStyle>
    <Editor initialValue={processor.processSync(text).result as any} />
  </MdStyle>
);
