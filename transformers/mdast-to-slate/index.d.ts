import { Root, RootContent } from 'mdast';
import { Descendant } from 'slate';
import type * as mdast from "../../models/mdast";
export type OverridedMdastBuilders = {
    [key in RootContent["type"]]?: MdastBuilder<key>;
} & ({
    [key: string]: MdastBuilder<typeof key>;
} | {});
export type MdastBuilder<T extends string> = (node: T extends RootContent["type"] ? Extract<RootContent, {
    type: T;
}> : unknown, next: (children: RootContent[]) => Descendant[], marks: Readonly<{
    [key: string]: true;
}>) => object | undefined;
export type MarkNames = {
    [key in "emphasis" | "strong" | "delete" | "inlineCode"]?: string;
};
export declare const mdastToSlate: (node: Root, overrides: OverridedMdastBuilders, marks?: MarkNames) => Descendant[];
export interface Paragraph extends Pick<mdast.Paragraph, "type"> {
    children: MdastNode[];
}
export interface Heading extends Pick<mdast.Heading, "type" | "depth"> {
    children: MdastNode[];
}
export interface ThematicBreak extends Pick<mdast.ThematicBreak, "type"> {
    children: MdastNode[];
}
export interface Blockquote extends Pick<mdast.Blockquote, "type"> {
    children: MdastNode[];
}
export interface List extends Pick<mdast.List, "type" | "ordered" | "start" | "spread"> {
    children: MdastNode[];
}
export interface ListItem extends Pick<mdast.ListItem, "type" | "checked" | "spread"> {
    children: MdastNode[];
}
export interface Table extends Pick<mdast.Table, "type" | "align"> {
    children: MdastNode[];
}
export interface TableRow extends Pick<mdast.TableRow, "type"> {
    children: MdastNode[];
}
export interface TableCell extends Pick<mdast.TableCell, "type"> {
    children: MdastNode[];
}
export interface Html extends Pick<mdast.Html, "type"> {
    children: MdastNode[];
    inline?: true;
}
export interface Code extends Pick<mdast.Code, "type" | "lang" | "meta"> {
    children: MdastNode[];
}
export interface Yaml extends Pick<mdast.Yaml, "type"> {
    children: MdastNode[];
}
export interface Toml extends Pick<mdast.TOML, "type"> {
    children: MdastNode[];
}
export interface Math extends Pick<mdast.Math, "type"> {
    children: MdastNode[];
}
export interface InlineMath extends Pick<mdast.InlineMath, "type"> {
    children: MdastNode[];
}
export interface Definition extends Pick<mdast.Definition, "type" | "identifier" | "label" | "url" | "title"> {
    children: MdastNode[];
}
export interface FootnoteDefinition extends Pick<mdast.FootnoteDefinition, "type" | "identifier" | "label"> {
    children: MdastNode[];
}
export interface Text {
    text: string;
    emphasis?: true;
    strong?: true;
    delete?: true;
    inlineCode?: true;
}
export interface Break extends Pick<mdast.Break, "type"> {
    children: MdastNode[];
}
export interface Link extends Pick<mdast.Link, "type" | "url" | "title"> {
    children: MdastNode[];
}
export interface Image extends Pick<mdast.Image, "type" | "url" | "title" | "alt"> {
    children: MdastNode[];
}
export interface LinkReference extends Pick<mdast.LinkReference, "type" | "referenceType" | "identifier" | "label"> {
    children: MdastNode[];
}
export interface ImageReference extends Pick<mdast.ImageReference, "type" | "alt" | "referenceType" | "identifier" | "label"> {
    children: MdastNode[];
}
export interface FootnoteReference extends Pick<mdast.FootnoteReference, "type" | "identifier" | "label"> {
    children: MdastNode[];
}
export type MdastElement = Paragraph | Heading | ThematicBreak | Blockquote | List | ListItem | Table | TableRow | TableCell | Html | Code | Yaml | Toml | Definition | FootnoteDefinition | Break | Link | Image | LinkReference | ImageReference | FootnoteReference | Math | InlineMath;
export type MdastNode = MdastElement | Text;
