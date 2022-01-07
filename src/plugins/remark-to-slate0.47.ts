import { mdastToSlate, SlateNode } from "../transformers/mdast-to-slate";
import { slateToSlate047 } from "../transformers/slate-to-slate0.47";

export default function plugin() {
  // @ts-ignore
  this.Compiler = function (node: any) {
    return slateToSlate047(mdastToSlate(node, {}) as SlateNode[]);
  };
}
