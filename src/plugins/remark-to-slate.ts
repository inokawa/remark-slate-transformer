import type { Plugin } from "unified";
import type { Node } from "slate";
import type { Root } from "mdast";
import {
  OverridedMdastBuilders,
  mdastToSlate,
} from "../transformers/mdast-to-slate";

declare module "unified" {
  interface CompileResultMap {
    remarkToSlateNode: Node[];
  }
}

export type Options = {
  overrides?: OverridedMdastBuilders;
};

const plugin: Plugin<[Options?], Root, Node[]> = function ({
  overrides = {},
} = {}) {
  this.compiler = function (node) {
    return mdastToSlate(node as Root, overrides);
  };
};
export default plugin;
