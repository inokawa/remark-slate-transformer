import { Editor, Element } from 'slate';
export declare const isMdastInline: (element: Element) => boolean;
export declare const isMdastVoid: (element: Element) => boolean;
export declare const withMdast: <T extends Editor>(editor: T) => T;
