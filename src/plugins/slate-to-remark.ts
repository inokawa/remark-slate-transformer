import type { Node } from "slate";
import {
  slateToMdast,
  OverridedSlateBuilders,
} from "../transformers/slate-to-mdast";

export type Options = {
  overrides?: OverridedSlateBuilders;
};

export default (nodes: Node[], { overrides = {} }: Options = {}) => {
  return slateToMdast(nodes, overrides);
};
