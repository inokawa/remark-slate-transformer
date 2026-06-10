import { Root } from 'mdast';
import { Node } from 'slate';
export type OverridedSlateBuilders = {
    [key: string]: SlateBuilder;
};
export type SlateBuilder = (node: unknown, next: (children: any[]) => any) => object | undefined;
export declare const slateToMdast: (nodes: Node[], overrides: OverridedSlateBuilders) => Root;
