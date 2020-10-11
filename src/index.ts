import { Plugin } from "unified";
import { remarkToSlate } from "./remark-slate";
import { slateToRemark } from "./slate-remark";

function remarkToSlatePlugin() {
  // @ts-ignore
  this.Compiler = remarkToSlate;
}
export { remarkToSlatePlugin as remarkToSlate };

const slateToRemarkPlugin: Plugin<[{}?]> = function (settings?: {}) {
  // @ts-ignore
  return slateToRemark;
};
export { slateToRemarkPlugin as slateToRemark };
