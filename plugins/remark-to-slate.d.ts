import { Plugin } from 'unified';
import { Node } from 'slate';
import { Root } from 'mdast';
import { OverridedMdastBuilders, MarkNames } from '../transformers/mdast-to-slate';
declare module "unified" {
    interface CompileResultMap {
        remarkToSlateNode: Node[];
    }
}
export type Options = {
    overrides?: OverridedMdastBuilders;
    marks?: MarkNames;
};
declare const plugin: Plugin<[Options?], Root, Node[]>;
export default plugin;
