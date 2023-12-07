import type { Plugin } from "unified";
import { mdastToSlate, SlateNode } from "../transformers/mdast-to-slate";
import { slateToSlate047 } from "../transformers/slate-to-slate0.47";

const plugin: Plugin<[]> = function () {
  this.compiler = function (node) {
    return slateToSlate047(mdastToSlate(node as any, {}) as SlateNode[]);
  };
};
export default plugin;
