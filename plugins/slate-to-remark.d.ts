import { Node } from 'slate';
import { HtmlMarkNames, MarkNames, MdastNode } from '../transformers/mdast-to-slate';
import { OverridedSlateBuilders } from '../transformers/slate-to-mdast';
export type Options = {
    overrides?: OverridedSlateBuilders;
    marks?: MarkNames;
    htmlMarks?: HtmlMarkNames;
};
declare const _default: (nodes: readonly (Node | MdastNode)[], { overrides, marks, htmlMarks }?: Options) => import('mdast').Root;
export default _default;
