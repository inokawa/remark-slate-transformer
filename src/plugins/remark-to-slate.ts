import type { Plugin } from "unified";
import {
  OverridedMdastBuilders,
  mdastToSlate,
} from "../transformers/mdast-to-slate";

export type Options = {
  overrides?: OverridedMdastBuilders;
};

const plugin: Plugin<[Options?]> = function ({ overrides = {} } = {}) {
  this.Compiler = function (node) {
    return mdastToSlate(node as any, overrides);
  };
};
export default plugin;
