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

type TypedElement = Element & { type?: string };

const isElement = (node: Node): node is TypedElement =>
  "children" in node && !("text" in node) && !("operations" in node);

const typeOf = (element: Element): string =>
  "type" in element && typeof element.type === "string" ? element.type : "";

export const isMdastInline = (element: Element): boolean => {
  const type = typeOf(element);
  return type === "html"
    ? "inline" in element && !!element.inline
    : INLINE_TYPES.has(type);
};

export const isMdastVoid = (element: Element): boolean =>
  VOID_TYPES.has(typeOf(element));

export const withMdast = <T extends Editor>(editor: T): T => {
  const { insertBreak, isInline, isVoid, normalizeNode } = editor;

  editor.isInline = (element) => isMdastInline(element) || isInline(element);
  editor.isVoid = (element) => isMdastVoid(element) || isVoid(element);

  editor.insertBreak = () => {
    editor.deleteFragment();
    const item = editor.above({
      match: (n) => isElement(n) && n.type === "listItem",
    });
    const block = editor.above({
      match: (n) => isElement(n) && editor.isBlock(n),
      mode: "lowest",
    });
    if (item && block && block[1].length === item[1].length + 1) {
      editor.splitNodes({
        always: true,
        match: (n) => isElement(n) && n.type === "listItem",
      });
      const [next] = editor.nodes({
        match: (n) => isElement(n) && n.type === "listItem",
        mode: "lowest",
      });
      if (
        next &&
        "checked" in next[0] &&
        typeof next[0].checked === "boolean"
      ) {
        editor.setNodes({ checked: false } as Partial<Element>, {
          at: next[1],
        });
      }
      return;
    }
    insertBreak();
  };

  editor.normalizeNode = (entry, options) => {
    const [node, path] = entry;
    if (isElement(node) && node.type === "list") {
      const index = node.children.findIndex(
        (child) => !isElement(child) || child.type !== "listItem",
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
