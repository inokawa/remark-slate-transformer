import * as slateLib from "slate";
import * as mdast from "./models/mdast";

export type Decoration = {
  [key in (
    | mdast.Emphasis
    | mdast.Strong
    | mdast.Delete
    | mdast.InlineCode
  )["type"]]?: true;
};

export function remarkToSlate(node: any): slateLib.Node[] {
  return createSlateRoot(node as mdast.Root);
}

function createSlateRoot(root: mdast.Root): slateLib.Node[] {
  return convertNodes(root.children, {});
}

function convertNodes(
  nodes: mdast.Content[],
  decoration: Decoration
): slateLib.Node[] {
  return nodes.reduce<slateLib.Node[]>((acc, node) => {
    acc.push(...createSlateNode(node, decoration));
    return acc;
  }, []);
}

function createSlateNode(
  node: mdast.Content,
  decoration: Decoration
): SlateNode[] {
  switch (node.type) {
    case "paragraph":
      return [createParagraph(node, decoration)];
    case "heading":
      return [createHeading(node, decoration)];
    case "thematicBreak":
      return [createThematicBreak(node)];
    case "blockquote":
      return [createBlockquote(node, decoration)];
    case "list":
      return [createList(node, decoration)];
    case "listItem":
      return [createListItem(node, decoration)];
    case "table":
      return [createTable(node, decoration)];
    case "tableRow":
      return [createTableRow(node, decoration)];
    case "tableCell":
      return [createTableCell(node, decoration)];
    case "html":
      return [createHtml(node)];
    case "code":
      return [createCode(node)];
    case "yaml":
      return [createYaml(node)];
    case "definition":
      return [createDefinition(node)];
    case "footnoteDefinition":
      return [createFootnoteDefinition(node, decoration)];
    case "text":
      return [createText(node.value, decoration)];
    case "emphasis":
    case "strong":
    case "delete": {
      const { type, children } = node;
      return children.flatMap((n) =>
        createSlateNode(n, { ...decoration, [type]: true })
      );
    }
    case "inlineCode": {
      const { type, value } = node;
      return [createText(value, { ...decoration, [type]: true })];
    }
    case "break":
      return [createBreak(node)];
    case "link":
      return [createLink(node, decoration)];
    case "image":
      return [createImage(node)];
    case "linkReference":
      return [createLinkReference(node, decoration)];
    case "imageReference":
      return [createImageReference(node)];
    case "footnote":
      return [createFootnote(node, decoration)];
    case "footnoteReference":
      return [createFootnoteReference(node)];
    default:
      break;
  }
  return [];
}

function createVoidFields() {
  return {
    void: true,
    children: [{ text: "" }],
  };
}

export type Paragraph = ReturnType<typeof createParagraph>;

function createParagraph(node: mdast.Paragraph, decoration: Decoration) {
  const { type, children } = node;
  return {
    type,
    children: convertNodes(children, decoration),
  };
}

export type Heading = ReturnType<typeof createHeading>;

function createHeading(node: mdast.Heading, decoration: Decoration) {
  const { type, children, depth } = node;
  return {
    type,
    depth,
    children: convertNodes(children, decoration),
  };
}

export type ThematicBreak = ReturnType<typeof createThematicBreak>;

function createThematicBreak(node: mdast.ThematicBreak) {
  return {
    type: node.type,
    ...createVoidFields(),
  };
}

export type Blockquote = ReturnType<typeof createBlockquote>;

function createBlockquote(node: mdast.Blockquote, decoration: Decoration) {
  return {
    type: node.type,
    children: convertNodes(node.children, decoration),
  };
}

export type List = ReturnType<typeof createList>;

function createList(node: mdast.List, decoration: Decoration) {
  const { type, children, ordered, start, spread } = node;
  return {
    type,
    children: convertNodes(children, decoration),
    ordered,
    start,
    spread,
  };
}

export type ListItem = ReturnType<typeof createListItem>;

function createListItem(node: mdast.ListItem, decoration: Decoration) {
  const { type, children, checked, spread } = node;
  return {
    type,
    children: convertNodes(children, decoration),
    checked,
    spread,
  };
}

export type Table = ReturnType<typeof createTable>;

function createTable(node: mdast.Table, decoration: Decoration) {
  const { type, children, align } = node;
  return {
    type,
    children: convertNodes(children, decoration),
    align,
  };
}

export type TableRow = ReturnType<typeof createTableRow>;

function createTableRow(node: mdast.TableRow, decoration: Decoration) {
  const { type, children } = node;
  return {
    type,
    children: convertNodes(children, decoration),
  };
}

export type TableCell = ReturnType<typeof createTableCell>;

function createTableCell(node: mdast.TableCell, decoration: Decoration) {
  const { type, children } = node;
  return {
    type,
    children: convertNodes(children, decoration),
  };
}

export type Html = ReturnType<typeof createHtml>;

function createHtml(node: mdast.HTML) {
  const { type, value } = node;
  return {
    type,
    children: [{ text: value }],
  };
}

export type Code = ReturnType<typeof createCode>;

function createCode(node: mdast.Code) {
  const { type, value, lang, meta } = node;
  return {
    type,
    lang,
    meta,
    children: [{ text: value }],
  };
}

export type Yaml = ReturnType<typeof createYaml>;

function createYaml(node: mdast.YAML) {
  const { type, value } = node;
  return {
    type,
    children: [{ text: value }],
  };
}

export type Definition = ReturnType<typeof createDefinition>;

function createDefinition(node: mdast.Definition) {
  const { type, identifier, label, url, title } = node;
  return {
    type,
    identifier,
    label,
    url,
    title,
    ...createVoidFields(),
  };
}

export type FootnoteDefinition = ReturnType<typeof createFootnoteDefinition>;

function createFootnoteDefinition(
  node: mdast.FootnoteDefinition,
  decoration: Decoration
) {
  const { type, children, identifier, label } = node;
  return {
    type,
    children: convertNodes(children, decoration),
    identifier,
    label,
  };
}

export type Text = ReturnType<typeof createText>;

function createText(text: string, decoration: Decoration) {
  return {
    ...decoration,
    text,
  };
}

export type Break = ReturnType<typeof createBreak>;

function createBreak(node: mdast.Break) {
  return {
    type: node.type,
    ...createVoidFields(),
  };
}

export type Link = ReturnType<typeof createLink>;

function createLink(node: mdast.Link, decoration: Decoration) {
  const { type, children, url, title } = node;
  return {
    type,
    children: convertNodes(children, decoration),
    url,
    title,
  };
}

export type Image = ReturnType<typeof createImage>;

function createImage(node: mdast.Image) {
  const { type, url, title, alt } = node;
  return {
    type,
    url,
    title,
    alt,
    ...createVoidFields(),
  };
}

export type LinkReference = ReturnType<typeof createLinkReference>;

function createLinkReference(
  node: mdast.LinkReference,
  decoration: Decoration
) {
  const { type, children, referenceType, identifier, label } = node;
  return {
    type,
    children: convertNodes(children, decoration),
    referenceType,
    identifier,
    label,
  };
}

export type ImageReference = ReturnType<typeof createImageReference>;

function createImageReference(node: mdast.ImageReference) {
  const { type, alt, referenceType, identifier, label } = node;
  return {
    type,
    alt,
    referenceType,
    identifier,
    label,
    ...createVoidFields(),
  };
}

export type Footnote = ReturnType<typeof createFootnote>;

function createFootnote(node: mdast.Footnote, decoration: Decoration) {
  const { type, children } = node;
  return {
    type,
    children: convertNodes(children, decoration),
  };
}

export type FootnoteReference = ReturnType<typeof createFootnoteReference>;

function createFootnoteReference(node: mdast.FootnoteReference) {
  const { type, identifier, label } = node;
  return {
    type,
    identifier,
    label,
    ...createVoidFields(),
  };
}

export type SlateNode =
  | Paragraph
  | Heading
  | ThematicBreak
  | Blockquote
  | List
  | ListItem
  | Table
  | TableRow
  | TableCell
  | Html
  | Code
  | Yaml
  | Definition
  | FootnoteDefinition
  | Text
  | Break
  | Link
  | Image
  | LinkReference
  | ImageReference
  | Footnote
  | FootnoteReference;
