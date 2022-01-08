import type { Plugin } from "unified";
import {
  slateToMdast,
  OverridedSlateBuilders,
} from "../transformers/slate-to-mdast";

export type Options = {
  overrides?: OverridedSlateBuilders;
};

const plugin: Plugin<[Options?]> = ({ overrides = {} } = {}) => {
  return function (node) {
    return slateToMdast(node as any, overrides);
  };
};
export default plugin;
