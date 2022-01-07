import type { Plugin } from "unified";
import { slateToMdast } from "../transformers/slate-to-mdast";
import { slate047ToSlate } from "../transformers/slate0.47-to-slate";

const plugin: Plugin<[]> = function () {
  // @ts-ignore
  return function (node: any) {
    return slateToMdast(
      {
        type: "root",
        children: slate047ToSlate(node.children),
      },
      {}
    );
  };
};
export default plugin;
