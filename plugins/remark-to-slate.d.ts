import { Plugin } from 'unified';
import { Descendant } from 'slate';
import { Root } from 'mdast';
import { OverridedMdastBuilders, HtmlMarkNames, MarkNames } from '../transformers/mdast-to-slate';
declare module "unified" {
    interface CompileResultMap {
        remarkToSlateNode: Descendant[];
    }
}
export type Options = {
    overrides?: OverridedMdastBuilders;
    marks?: MarkNames;
    htmlMarks?: HtmlMarkNames;
};
declare const plugin: Plugin<[Options?], Root, Descendant[]>;
export default plugin;
