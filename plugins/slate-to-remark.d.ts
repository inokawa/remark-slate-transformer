import { Node } from 'slate';
import { MarkNames, MdastNode } from '../transformers/mdast-to-slate';
import { OverridedSlateBuilders } from '../transformers/slate-to-mdast';
export type Options = {
    overrides?: OverridedSlateBuilders;
    marks?: MarkNames;
};
declare const _default: (nodes: readonly (Node | MdastNode)[], { overrides, marks }?: Options) => import('mdast').Root;
export default _default;
