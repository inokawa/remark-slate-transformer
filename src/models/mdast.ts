// ref: https://github.com/syntax-tree/mdast

import type { Literal } from "mdast";

/** @internal */
export * from "mdast";
/** @internal */
export * from "mdast-util-math";

/** @internal */
export interface TOML extends Literal {
  type: "toml";
}

/** @internal */
declare module "mdast" {
  interface RootContentMap {
    toml: TOML;
  }
}
