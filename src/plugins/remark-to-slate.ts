import type { Plugin } from "unified";
import type { Node } from "slate";
import type { Root } from "mdast";
import {
  OverridedMdastBuilders,
  MarkNames,
  mdastToSlate,
} from "../transformers/mdast-to-slate";

declare module "unified" {
  interface CompileResultMap {
    remarkToSlateNode: Node[];
  }
}

export type Options = {
  overrides?: OverridedMdastBuilders;
  marks?: MarkNames;
};

const plugin: Plugin<[Options?], Root, Node[]> = function ({
  overrides = {},
  marks = {},
} = {}) {
  this.compiler = function (node) {
    return mdastToSlate(node as Root, overrides, marks);
  };
};
export default plugin;
