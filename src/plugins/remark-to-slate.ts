import type { Plugin } from "unified";
import type { Descendant } from "slate";
import type { Root } from "mdast";
import {
  OverridedMdastBuilders,
  HtmlMarkNames,
  MarkNames,
  mdastToSlate,
} from "../transformers/mdast-to-slate";

declare module "unified" {
  interface CompileResultMap {
    remarkToSlateNode: Descendant[];
  }
}

export type Options = {
  overrides?: OverridedMdastBuilders;
  marks?: MarkNames;
  htmlMarks?: HtmlMarkNames;
};

const plugin: Plugin<[Options?], Root, Descendant[]> = function ({
  overrides = {},
  marks = {},
  htmlMarks = {},
} = {}) {
  this.compiler = function (node) {
    return mdastToSlate(node as Root, overrides, marks, htmlMarks);
  };
};
export default plugin;
