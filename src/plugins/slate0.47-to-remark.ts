import type { Plugin } from "unified";
import { slateToMdast } from "../transformers/slate-to-mdast";
import { slate047ToSlate } from "../transformers/slate0.47-to-slate";

type Settings = {};

const plugin: Plugin<[Settings?]> = function (settings?: Settings) {
  // @ts-ignore
  return function (node: any) {
    return slateToMdast({
      type: "root",
      children: slate047ToSlate(node.children),
    });
  };
};
export default plugin;
