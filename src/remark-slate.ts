import * as slate from "slate";
import * as mdast from "./models/mdast";

export type Decoration = {
  [key in (
    | mdast.Emphasis
    | mdast.Strong
    | mdast.Delete
    | mdast.InlineCode
  )["type"]]?: true;
};

export function remarkToSlate(node: any): slate.Node[] {
  return createSlateRoot(node as mdast.Root);
}

function createSlateRoot(root: mdast.Root): slate.Node[] {
  return convertNodes(root.children, {});
}

function convertNodes(
  nodes: mdast.Content[],
  decoration: Decoration
): slate.Node[] {
  return nodes.reduce<slate.Node[]>((acc, node) => {
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

export type SlateParagraph = ReturnType<typeof createParagraph>;

function createParagraph(node: mdast.Paragraph, decoration: Decoration) {
  const { type, children } = node;
  return {
    type,
    children: convertNodes(children, decoration),
  };
}

export type SlateHeading = ReturnType<typeof createHeading>;

function createHeading(node: mdast.Heading, decoration: Decoration) {
  const { type, children, depth } = node;
  return {
    type,
    depth,
    children: convertNodes(children, decoration),
  };
}

export type SlateThematicBreak = ReturnType<typeof createThematicBreak>;

function createThematicBreak(node: mdast.ThematicBreak) {
  return {
    type: node.type,
    ...createVoidFields(),
  };
}

export type SlateBlockquote = ReturnType<typeof createBlockquote>;

function createBlockquote(node: mdast.Blockquote, decoration: Decoration) {
  return {
    type: node.type,
    children: convertNodes(node.children, decoration),
  };
}

export type SlateList = ReturnType<typeof createList>;

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

export type SlateListItem = ReturnType<typeof createListItem>;

function createListItem(node: mdast.ListItem, decoration: Decoration) {
  const { type, children, checked, spread } = node;
  return {
    type,
    children: convertNodes(children, decoration),
    checked,
    spread,
  };
}

export type SlateTable = ReturnType<typeof createTable>;

function createTable(node: mdast.Table, decoration: Decoration) {
  const { type, children, align } = node;
  return {
    type,
    children: convertNodes(children, decoration),
    align,
  };
}

export type SlateTableRow = ReturnType<typeof createTableRow>;

function createTableRow(node: mdast.TableRow, decoration: Decoration) {
  const { type, children } = node;
  return {
    type,
    children: convertNodes(children, decoration),
  };
}

export type SlateTableCell = ReturnType<typeof createTableCell>;

function createTableCell(node: mdast.TableCell, decoration: Decoration) {
  const { type, children } = node;
  return {
    type,
    children: convertNodes(children, decoration),
  };
}

export type SlateHtml = ReturnType<typeof createHtml>;

function createHtml(node: mdast.HTML) {
  const { type, value } = node;
  return {
    type,
    children: [{ text: value }],
  };
}

export type SlateCode = ReturnType<typeof createCode>;

function createCode(node: mdast.Code) {
  const { type, value, lang, meta } = node;
  return {
    type,
    lang,
    meta,
    children: [{ text: value }],
  };
}

export type SlateYaml = ReturnType<typeof createYaml>;

function createYaml(node: mdast.YAML) {
  const { type, value } = node;
  return {
    type,
    children: [{ text: value }],
  };
}

export type SlateDefinition = ReturnType<typeof createDefinition>;

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

export type SlateFootnoteDefinition = ReturnType<
  typeof createFootnoteDefinition
>;

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

export type SlateText = ReturnType<typeof createText>;

function createText(text: string, decoration: Decoration) {
  return {
    ...decoration,
    text,
  };
}

export type SlateBreak = ReturnType<typeof createBreak>;

function createBreak(node: mdast.Break) {
  return {
    type: node.type,
    ...createVoidFields(),
  };
}

export type SlateLink = ReturnType<typeof createLink>;

function createLink(node: mdast.Link, decoration: Decoration) {
  const { type, children, url, title } = node;
  return {
    type,
    children: convertNodes(children, decoration),
    url,
    title,
  };
}

export type SlateImage = ReturnType<typeof createImage>;

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

export type SlateLinkReference = ReturnType<typeof createLinkReference>;

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

export type SlateImageReference = ReturnType<typeof createImageReference>;

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

export type SlateFootnote = ReturnType<typeof createFootnote>;

function createFootnote(node: mdast.Footnote, decoration: Decoration) {
  const { type, children } = node;
  return {
    type,
    children: convertNodes(children, decoration),
  };
}

export type SlateFootnoteReference = ReturnType<typeof createFootnoteReference>;

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
  | SlateParagraph
  | SlateHeading
  | SlateThematicBreak
  | SlateBlockquote
  | SlateList
  | SlateListItem
  | SlateTable
  | SlateTableRow
  | SlateTableCell
  | SlateHtml
  | SlateCode
  | SlateYaml
  | SlateDefinition
  | SlateFootnoteDefinition
  | SlateText
  | SlateBreak
  | SlateLink
  | SlateImage
  | SlateLinkReference
  | SlateImageReference
  | SlateFootnote
  | SlateFootnoteReference;
