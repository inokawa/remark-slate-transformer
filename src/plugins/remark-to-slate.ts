import type { Plugin } from "unified";
import type * as mdast from "../models/mdast";
import type * as slate from "../models/slate";
import {
  OverridedMdastBuilders,
  mdastToSlate,
} from "../transformers/mdast-to-slate";

export type Options = {
  overrides?: OverridedMdastBuilders;
};

const plugin: Plugin<[Options?], mdast.Root, slate.Node[]> = function ({
  overrides = {},
} = {}) {
  this.Compiler = function (node) {
    return mdastToSlate(node, overrides);
  };
};
export default plugin;
