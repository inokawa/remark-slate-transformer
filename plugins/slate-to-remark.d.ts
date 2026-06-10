import { Node } from 'slate';
import { OverridedSlateBuilders } from '../transformers/slate-to-mdast';
export type Options = {
    overrides?: OverridedSlateBuilders;
};
declare const _default: (nodes: Node[], { overrides }?: Options) => import('mdast').Root;
export default _default;
