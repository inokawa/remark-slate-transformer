import { Root, RootContent } from 'mdast';
import { Node } from 'slate';
import { MarkNames } from '../mdast-to-slate';
export type OverridedSlateBuilders = {
    [key: string]: SlateBuilder;
};
export type SlateBuilder = (node: unknown, next: (children: Node[]) => RootContent[]) => object | undefined;
export declare const slateToMdast: (nodes: Node[], overrides: OverridedSlateBuilders, marks?: MarkNames) => Root;
