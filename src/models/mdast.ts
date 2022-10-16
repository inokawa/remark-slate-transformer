// ref: https://github.com/syntax-tree/mdast

import type { Literal } from "mdast";

export * from "mdast";
export * from "mdast-util-math/complex-types";

export interface TOML extends Literal {
  type: "toml";
}

declare module "mdast" {
  interface FrontmatterContentMap {
    toml: TOML;
  }
}
