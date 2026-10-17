import type { Editor, Element, Node } from "slate";

const INLINE_TYPES = new Set([
  "link",
  "linkReference",
  "break",
  "image",
  "imageReference",
  "footnoteReference",
  "inlineMath",
]);

const VOID_TYPES = new Set([
  "thematicBreak",
  "break",
  "image",
  "imageReference",
  "footnoteReference",
  "definition",
]);

type MdastElement = Element & { type?: string; inline?: boolean };

const isElement = (node: Node): node is MdastElement =>
  "children" in node && !("text" in node) && !("operations" in node);

export const isMdastInline = (element: Element): boolean => {
  const { type, inline } = element as MdastElement;
  return type === "html" ? !!inline : INLINE_TYPES.has(type ?? "");
};

export const isMdastVoid = (element: Element): boolean =>
  VOID_TYPES.has((element as MdastElement).type ?? "");

export const withMdast = <T extends Editor>(editor: T): T => {
  const { isInline, isVoid, normalizeNode } = editor;

  editor.isInline = (element) => isMdastInline(element) || isInline(element);
  editor.isVoid = (element) => isMdastVoid(element) || isVoid(element);

  editor.normalizeNode = (entry, options) => {
    const [node, path] = entry;
    if (isElement(node) && node.type === "list") {
      const index = node.children.findIndex(
        (child) => !isElement(child) || child.type !== "listItem"
      );
      if (index !== -1) {
        editor.wrapNodes({ type: "listItem", children: [] } as Element, {
          at: [...path, index],
        });
        return;
      }
    }
    normalizeNode(entry, options);
  };

  return editor;
};
