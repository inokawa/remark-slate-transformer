import { Root, RootContent } from 'mdast';
import { Node } from 'slate';
export type OverridedMdastBuilders = {
    [key in RootContent["type"]]?: MdastBuilder<key>;
} & ({
    [key: string]: MdastBuilder<typeof key>;
} | {});
export type MdastBuilder<T extends string> = (node: T extends RootContent["type"] ? Extract<RootContent, {
    type: T;
}> : unknown, next: (children: any[]) => any) => object | undefined;
export declare const mdastToSlate: (node: Root, overrides: OverridedMdastBuilders) => Node[];
