import { Plugin } from "unified";
import { remarkToSlate } from "./remark-slate";
import { slateToRemark } from "./slate-remark";
import { remarkToSlateLegacy } from "./legacy/remark-slate";

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

function remarkToSlateLegacyPlugin() {
  // @ts-ignore
  this.Compiler = remarkToSlateLegacy;
}
export { remarkToSlateLegacyPlugin as remarkToSlateLegacy };
