import type { Plugin } from "unified";
import type * as mdast from "../models/mdast";
import type * as slate from "../models/slate";
import {
  slateToMdast,
  OverridedSlateBuilders,
} from "../transformers/slate-to-mdast";

export type Options = {
  overrides?: OverridedSlateBuilders;
};

const plugin: Plugin<[Options?], slate.Node, mdast.Root> = ({
  overrides = {},
} = {}) => {
  return function (node) {
    return slateToMdast(node, overrides);
  };
};
export default plugin;
