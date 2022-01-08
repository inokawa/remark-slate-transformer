import type { Plugin } from "unified";
import { slateToMdast } from "../transformers/slate-to-mdast";
import { slate047ToSlate } from "../transformers/slate0.47-to-slate";

const plugin: Plugin<[]> = function () {
  return function (node) {
    return slateToMdast(
      {
        type: "root",
        children: slate047ToSlate((node as any).children),
      },
      {}
    );
  };
};
export default plugin;
