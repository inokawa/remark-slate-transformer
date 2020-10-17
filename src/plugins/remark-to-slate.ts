import { mdastToSlate } from "../transformers/mdast-to-slate";

export default function plugin() {
  // @ts-ignore
  this.Compiler = function (node: any) {
    return mdastToSlate(node);
  };
}
