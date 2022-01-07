import type { Plugin } from "unified";
import {
  OverridedMdastBuilders,
  mdastToSlate,
} from "../transformers/mdast-to-slate";

type Options = {
  overrides?: OverridedMdastBuilders;
};

const plugin: Plugin<[Options]> = function ({ overrides = {} }: Options = {}) {
  // @ts-ignore
  this.Compiler = function (node: any) {
    return mdastToSlate(node, overrides);
  };
};
export default plugin;
