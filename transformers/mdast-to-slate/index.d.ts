import { Root, RootContent } from 'mdast';
import { Node } from 'slate';
export type OverridedMdastBuilders = {
    [key in RootContent["type"]]?: MdastBuilder<key>;
} & ({
    [key: string]: MdastBuilder<typeof key>;
} | {});
export type MdastBuilder<T extends string> = (node: T extends RootContent["type"] ? Extract<RootContent, {
    type: T;
}> : unknown, next: (children: RootContent[]) => Node[], marks: Readonly<{
    [key: string]: true;
}>) => object | undefined;
export type MarkNames = {
    [key in "emphasis" | "strong" | "delete" | "inlineCode"]?: string;
};
export declare const mdastToSlate: (node: Root, overrides: OverridedMdastBuilders, marks?: MarkNames) => Node[];
