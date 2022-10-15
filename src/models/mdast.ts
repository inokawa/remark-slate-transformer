// ref: https://github.com/syntax-tree/mdast

import type { Literal } from 'mdast'

export * from 'mdast'

export interface TOML extends Literal {
  type: "toml";
}

export interface Math extends Literal {
  type: "math";
}

export interface InlineMath extends Literal {
  type: "inlineMath";
}

declare module "mdast" {
  interface FrontmatterContentMap {
    toml: TOML
  }

  interface BlockContentMap {
    math: Math
  }

  interface StaticPhrasingContentMap {
    inlineMath: InlineMath
  }
}
