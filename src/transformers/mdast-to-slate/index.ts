import * as slate from "../../models/slate";
import * as mdast from "../../models/mdast";

export type Decoration = {
  [key in (
    | mdast.Emphasis
    | mdast.Strong
    | mdast.Delete
    | mdast.InlineCode
  )["type"]]?: true;
};

export function mdastToSlate(node: mdast.Root): slate.Node[] {
  return buildSlateRoot(node);
}

function buildSlateRoot(root: mdast.Root): slate.Node[] {
  return convertNodes(root.children, {});
}

function convertNodes(nodes: mdast.Content[], deco: Decoration): slate.Node[] {
  if (nodes.length === 0) {
    return [{ text: "" }];
  }

  return nodes.reduce<slate.Node[]>((acc, node) => {
    acc.push(...buildSlateNode(node, deco));
    return acc;
  }, []);
}

function buildSlateNode(node: mdast.Content, deco: Decoration): SlateNode[] {
  switch (node.type) {
    case "paragraph":
      return [buildParagraph(node, deco)];
    case "heading":
      return [buildHeading(node, deco)];
    case "thematicBreak":
      return [buildThematicBreak(node)];
    case "blockquote":
      return [buildBlockquote(node, deco)];
    case "list":
      return [buildList(node, deco)];
    case "listItem":
      return [buildListItem(node, deco)];
    case "table":
      return [buildTable(node, deco)];
    case "tableRow":
      return [buildTableRow(node, deco)];
    case "tableCell":
      return [buildTableCell(node, deco)];
    case "html":
      return [buildHtml(node)];
    case "code":
      return [buildCode(node)];
    case "yaml":
      return [buildYaml(node)];
    case "toml":
      return [buildToml(node)];
    case "definition":
      return [buildDefinition(node)];
    case "footnoteDefinition":
      return [buildFootnoteDefinition(node, deco)];
    case "text":
      return [buildText(node.value, deco)];
    case "emphasis":
    case "strong":
    case "delete": {
      const { type, children } = node;
      return children.reduce<SlateNode[]>((acc, n) => {
        acc.push(...buildSlateNode(n, { ...deco, [type]: true }));
        return acc;
      }, []);
    }
    case "inlineCode": {
      const { type, value } = node;
      return [buildText(value, { ...deco, [type]: true })];
    }
    case "break":
      return [buildBreak(node)];
    case "link":
      return [buildLink(node, deco)];
    case "image":
      return [buildImage(node)];
    case "linkReference":
      return [buildLinkReference(node, deco)];
    case "imageReference":
      return [buildImageReference(node)];
    case "footnote":
      return [buildFootnote(node, deco)];
    case "footnoteReference":
      return [buildFootnoteReference(node)];
    case "math":
      return [buildMath(node)];
    case "inlineMath":
      return [buildInlineMath(node)];
    default:
      const _: never = node;
      break;
  }
  return [];
}

export type Paragraph = ReturnType<typeof buildParagraph>;

function buildParagraph(node: mdast.Paragraph, deco: Decoration) {
  const { type, children } = node;
  return {
    type,
    children: convertNodes(children, deco),
  };
}

export type Heading = ReturnType<typeof buildHeading>;

function buildHeading(node: mdast.Heading, deco: Decoration) {
  const { type, children, depth } = node;
  return {
    type,
    depth,
    children: convertNodes(children, deco),
  };
}

export type ThematicBreak = ReturnType<typeof buildThematicBreak>;

function buildThematicBreak(node: mdast.ThematicBreak) {
  return {
    type: node.type,
    children: [{ text: "" }],
  };
}

export type Blockquote = ReturnType<typeof buildBlockquote>;

function buildBlockquote(node: mdast.Blockquote, deco: Decoration) {
  return {
    type: node.type,
    children: convertNodes(node.children, deco),
  };
}

export type List = ReturnType<typeof buildList>;

function buildList(node: mdast.List, deco: Decoration) {
  const { type, children, ordered, start, spread } = node;
  return {
    type,
    children: convertNodes(children, deco),
    ordered,
    start,
    spread,
  };
}

export type ListItem = ReturnType<typeof buildListItem>;

function buildListItem(node: mdast.ListItem, deco: Decoration) {
  const { type, children, checked, spread } = node;
  return {
    type,
    children: convertNodes(children, deco),
    checked,
    spread,
  };
}

export type Table = ReturnType<typeof buildTable>;

function buildTable(node: mdast.Table, deco: Decoration) {
  const { type, children, align } = node;
  return {
    type,
    children: convertNodes(children, deco),
    align,
  };
}

export type TableRow = ReturnType<typeof buildTableRow>;

function buildTableRow(node: mdast.TableRow, deco: Decoration) {
  const { type, children } = node;
  return {
    type,
    children: convertNodes(children, deco),
  };
}

export type TableCell = ReturnType<typeof buildTableCell>;

function buildTableCell(node: mdast.TableCell, deco: Decoration) {
  const { type, children } = node;
  return {
    type,
    children: convertNodes(children, deco),
  };
}

export type Html = ReturnType<typeof buildHtml>;

function buildHtml(node: mdast.HTML) {
  const { type, value } = node;
  return {
    type,
    children: [{ text: value }],
  };
}

export type Code = ReturnType<typeof buildCode>;

function buildCode(node: mdast.Code) {
  const { type, value, lang, meta } = node;
  return {
    type,
    lang,
    meta,
    children: [{ text: value }],
  };
}

export type Yaml = ReturnType<typeof buildYaml>;

function buildYaml(node: mdast.YAML) {
  const { type, value } = node;
  return {
    type,
    children: [{ text: value }],
  };
}

export type Toml = ReturnType<typeof buildToml>;

function buildToml(node: mdast.TOML) {
  const { type, value } = node;
  return {
    type,
    children: [{ text: value }],
  };
}

export type Math = ReturnType<typeof buildMath>;

function buildMath(node: mdast.Math) {
  const { type, value } = node;
  return {
    type,
    children: [{ text: value }],
  };
}

export type InlineMath = ReturnType<typeof buildInlineMath>;

function buildInlineMath(node: mdast.InlineMath) {
  const { type, value } = node;
  return {
    type,
    children: [{ text: value }],
  };
}

export type Definition = ReturnType<typeof buildDefinition>;

function buildDefinition(node: mdast.Definition) {
  const { type, identifier, label, url, title } = node;
  return {
    type,
    identifier,
    label,
    url,
    title,
    children: [{ text: "" }],
  };
}

export type FootnoteDefinition = ReturnType<typeof buildFootnoteDefinition>;

function buildFootnoteDefinition(
  node: mdast.FootnoteDefinition,
  deco: Decoration
) {
  const { type, children, identifier, label } = node;
  return {
    type,
    children: convertNodes(children, deco),
    identifier,
    label,
  };
}

export type Text = ReturnType<typeof buildText>;

function buildText(text: string, deco: Decoration) {
  return {
    ...deco,
    text,
  };
}

export type Break = ReturnType<typeof buildBreak>;

function buildBreak(node: mdast.Break) {
  return {
    type: node.type,
    children: [{ text: "" }],
  };
}

export type Link = ReturnType<typeof buildLink>;

function buildLink(node: mdast.Link, deco: Decoration) {
  const { type, children, url, title } = node;
  return {
    type,
    children: convertNodes(children, deco),
    url,
    title,
  };
}

export type Image = ReturnType<typeof buildImage>;

function buildImage(node: mdast.Image) {
  const { type, url, title, alt } = node;
  return {
    type,
    url,
    title,
    alt,
    children: [{ text: "" }],
  };
}

export type LinkReference = ReturnType<typeof buildLinkReference>;

function buildLinkReference(node: mdast.LinkReference, deco: Decoration) {
  const { type, children, referenceType, identifier, label } = node;
  return {
    type,
    children: convertNodes(children, deco),
    referenceType,
    identifier,
    label,
  };
}

export type ImageReference = ReturnType<typeof buildImageReference>;

function buildImageReference(node: mdast.ImageReference) {
  const { type, alt, referenceType, identifier, label } = node;
  return {
    type,
    alt,
    referenceType,
    identifier,
    label,
    children: [{ text: "" }],
  };
}

export type Footnote = ReturnType<typeof buildFootnote>;

function buildFootnote(node: mdast.Footnote, deco: Decoration) {
  const { type, children } = node;
  return {
    type,
    children: convertNodes(children, deco),
  };
}

export type FootnoteReference = ReturnType<typeof buildFootnoteReference>;

function buildFootnoteReference(node: mdast.FootnoteReference) {
  const { type, identifier, label } = node;
  return {
    type,
    identifier,
    label,
    children: [{ text: "" }],
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
  | Toml
  | Definition
  | FootnoteDefinition
  | Text
  | Break
  | Link
  | Image
  | LinkReference
  | ImageReference
  | Footnote
  | FootnoteReference
  | Math
  | InlineMath;
