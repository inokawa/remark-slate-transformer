import type { Plugin } from "unified";
import {
  slateToMdast,
  OverridedSlateBuilders,
} from "../transformers/slate-to-mdast";

export type Options = {
  overrides?: OverridedSlateBuilders;
};

const plugin: Plugin<[Options?]> = ({ overrides = {} } = {}) => {
  return function (node: any) {
    return slateToMdast(node, overrides);
  };
};
export default plugin;
