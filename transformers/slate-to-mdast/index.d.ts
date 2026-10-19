import { Root, RootContent } from 'mdast';
import { Descendant, Element, Node } from 'slate';
import { MarkNames, MdastElement, MdastNode } from '../mdast-to-slate';
export type OverridedSlateBuilders = {
    [key in MdastElement["type"]]?: SlateBuilder<Extract<MdastElement, {
        type: key;
    }>>;
} & ({
    [key: string]: SlateBuilder;
} | {});
export type SlateBuilder<T = Element> = (node: T, next: (children: readonly Descendant[]) => RootContent[]) => object | undefined;
export declare const slateToMdast: (nodes: readonly (Node | MdastNode)[], overrides: OverridedSlateBuilders, marks?: MarkNames) => Root;
