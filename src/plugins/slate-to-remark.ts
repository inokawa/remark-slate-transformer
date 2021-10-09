import type { Plugin } from "unified";
import { slateToMdast } from "../transformers/slate-to-mdast";

type Settings = {};

const plugin: Plugin<[Settings?]> = function (settings?: Settings) {
  // @ts-ignore
  return function (node: any) {
    return slateToMdast(node);
  };
};
export default plugin;
