import * as slate from "../../models/slate";
import * as mdast from "../../models/mdast";

export type Decoration = Readonly<{
  [key in (
    | mdast.Emphasis
    | mdast.Strong
    | mdast.Delete
    | mdast.InlineCode
  )["type"]]?: true;
}>;

export type OverridedMdastBuilders = {
  [key in mdast.Content["type"]]?: MdastBuilder<key>;
} & ({ [key: string]: MdastBuilder<typeof key> } | {});

export type MdastBuilder<T extends string> = (
  node: T extends mdast.Content["type"]
    ? Extract<mdast.Content, { type: T }>
    : unknown,
  next: (children: any[]) => any
) => object | undefined;

export function mdastToSlate(
  node: mdast.Root,
  overrides: OverridedMdastBuilders
): slate.Node[] {
  return buildSlateRoot(node, overrides);
}

function buildSlateRoot(
  root: mdast.Root,
  overrides: OverridedMdastBuilders
): slate.Node[] {
  return convertNodes(root.children, {}, overrides);
}

function convertNodes(
  nodes: mdast.Content[],
  deco: Decoration,
  overrides: OverridedMdastBuilders
): slate.Node[] {
  if (nodes.length === 0) {
    return [{ text: "" }];
  }

  return nodes.reduce<slate.Node[]>((acc, node) => {
    acc.push(...buildSlateNode(node, deco, overrides));
    return acc;
  }, []);
}

function buildSlateNode(
  node: mdast.Content,
  deco: Decoration,
  overrides: OverridedMdastBuilders
): SlateNode[] {
  const customNode = overrides[node.type]?.(node as any, (children) =>
    convertNodes(children, deco, overrides)
  );
  if (customNode != null) {
    return [customNode as SlateNode];
  }

  switch (node.type) {
    case "paragraph":
      return [buildParagraph(node, deco, overrides)];
    case "heading":
      return [buildHeading(node, deco, overrides)];
    case "thematicBreak":
      return [buildThematicBreak(node)];
    case "blockquote":
      return [buildBlockquote(node, deco, overrides)];
    case "list":
      return [buildList(node, deco, overrides)];
    case "listItem":
      return [buildListItem(node, deco, overrides)];
    case "table":
      return [buildTable(node, deco, overrides)];
    case "tableRow":
      return [buildTableRow(node, deco, overrides)];
    case "tableCell":
      return [buildTableCell(node, deco, overrides)];
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
      return [buildFootnoteDefinition(node, deco, overrides)];
    case "text":
      return [buildText(node.value, deco)];
    case "emphasis":
    case "strong":
    case "delete": {
      const { type, children } = node;
      return children.reduce<SlateNode[]>((acc, n) => {
        acc.push(...buildSlateNode(n, { ...deco, [type]: true }, overrides));
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
      return [buildLink(node, deco, overrides)];
    case "image":
      return [buildImage(node)];
    case "linkReference":
      return [buildLinkReference(node, deco, overrides)];
    case "imageReference":
      return [buildImageReference(node)];
    case "footnote":
      return [buildFootnote(node, deco, overrides)];
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

function buildParagraph(
  node: mdast.Paragraph,
  deco: Decoration,
  overrides: OverridedMdastBuilders
) {
  const { type, children } = node;
  return {
    type,
    children: convertNodes(children, deco, overrides),
  };
}

export type Heading = ReturnType<typeof buildHeading>;

function buildHeading(
  node: mdast.Heading,
  deco: Decoration,
  overrides: OverridedMdastBuilders
) {
  const { type, children, depth } = node;
  return {
    type,
    depth,
    children: convertNodes(children, deco, overrides),
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

function buildBlockquote(
  node: mdast.Blockquote,
  deco: Decoration,
  overrides: OverridedMdastBuilders
) {
  return {
    type: node.type,
    children: convertNodes(node.children, deco, overrides),
  };
}

export type List = ReturnType<typeof buildList>;

function buildList(
  node: mdast.List,
  deco: Decoration,
  overrides: OverridedMdastBuilders
) {
  const { type, children, ordered, start, spread } = node;
  return {
    type,
    children: convertNodes(children, deco, overrides),
    ordered,
    start,
    spread,
  };
}

export type ListItem = ReturnType<typeof buildListItem>;

function buildListItem(
  node: mdast.ListItem,
  deco: Decoration,
  overrides: OverridedMdastBuilders
) {
  const { type, children, checked, spread } = node;
  return {
    type,
    children: convertNodes(children, deco, overrides),
    checked,
    spread,
  };
}

export type Table = ReturnType<typeof buildTable>;

function buildTable(
  node: mdast.Table,
  deco: Decoration,
  overrides: OverridedMdastBuilders
) {
  const { type, children, align } = node;
  return {
    type,
    children: convertNodes(children, deco, overrides),
    align,
  };
}

export type TableRow = ReturnType<typeof buildTableRow>;

function buildTableRow(
  node: mdast.TableRow,
  deco: Decoration,
  overrides: OverridedMdastBuilders
) {
  const { type, children } = node;
  return {
    type,
    children: convertNodes(children, deco, overrides),
  };
}

export type TableCell = ReturnType<typeof buildTableCell>;

function buildTableCell(
  node: mdast.TableCell,
  deco: Decoration,
  overrides: OverridedMdastBuilders
) {
  const { type, children } = node;
  return {
    type,
    children: convertNodes(children, deco, overrides),
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
  deco: Decoration,
  overrides: OverridedMdastBuilders
) {
  const { type, children, identifier, label } = node;
  return {
    type,
    children: convertNodes(children, deco, overrides),
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

function buildLink(
  node: mdast.Link,
  deco: Decoration,
  overrides: OverridedMdastBuilders
) {
  const { type, children, url, title } = node;
  return {
    type,
    children: convertNodes(children, deco, overrides),
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

function buildLinkReference(
  node: mdast.LinkReference,
  deco: Decoration,
  overrides: OverridedMdastBuilders
) {
  const { type, children, referenceType, identifier, label } = node;
  return {
    type,
    children: convertNodes(children, deco, overrides),
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

function buildFootnote(
  node: mdast.Footnote,
  deco: Decoration,
  overrides: OverridedMdastBuilders
) {
  const { type, children } = node;
  return {
    type,
    children: convertNodes(children, deco, overrides),
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
