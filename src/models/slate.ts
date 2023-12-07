// ref: https://docs.slatejs.org/concepts/11-typescript

import type * as slate from "slate";

/** @internal */
export type Node = Editor | Element | Text;
/** @internal */
export type Editor = slate.Editor;
/** @internal */
export type Element = slate.Element & { type: string };
/** @internal */
export type Text = slate.Text;
