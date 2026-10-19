import type { Node } from "slate";
import type {
  HtmlMarkNames,
  MarkNames,
  MdastNode,
} from "../transformers/mdast-to-slate";
import {
  slateToMdast,
  OverridedSlateBuilders,
} from "../transformers/slate-to-mdast";

export type Options = {
  overrides?: OverridedSlateBuilders;
  marks?: MarkNames;
  htmlMarks?: HtmlMarkNames;
};

export default (
  nodes: readonly (Node | MdastNode)[],
  { overrides = {}, marks = {}, htmlMarks = {} }: Options = {}
) => {
  return slateToMdast(nodes, overrides, marks, htmlMarks);
};
