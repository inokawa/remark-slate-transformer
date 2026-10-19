import type { Node } from "slate";
import type { MarkNames, MdastNode } from "../transformers/mdast-to-slate";
import {
  slateToMdast,
  OverridedSlateBuilders,
} from "../transformers/slate-to-mdast";

export type Options = {
  overrides?: OverridedSlateBuilders;
  marks?: MarkNames;
};

export default (
  nodes: readonly (Node | MdastNode)[],
  { overrides = {}, marks = {} }: Options = {}
) => {
  return slateToMdast(nodes, overrides, marks);
};
