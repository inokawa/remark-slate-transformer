// ref: https://docs.slatejs.org/concepts/11-typescript

import type * as slate from "slate";

export type Node = Editor | Element | Text;
export type Editor = slate.Editor;
export type Element = slate.Element & { type: string };
export type Text = slate.Text;
