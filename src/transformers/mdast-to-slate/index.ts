import type { Root, RootContent } from "mdast";
import type { Node } from "slate";
import type * as slate from "../../models/slate";
import type * as mdast from "../../models/mdast";
import { unreachable } from "../../utils";

/**
 * @internal
 */
export type Decoration = Readonly<{
  [key in (
    | mdast.Emphasis
    | mdast.Strong
    | mdast.Delete
    | mdast.InlineCode
  )["type"]]?: true;
}>;

export type OverridedMdastBuilders = {
  [key in RootContent["type"]]?: MdastBuilder<key>;
} & ({ [key: string]: MdastBuilder<typeof key> } | {});

export type MdastBuilder<T extends string> = (
  node: T extends RootContent["type"]
    ? Extract<RootContent, { type: T }>
    : unknown,
  next: (children: any[]) => any
) => object | undefined;

export const mdastToSlate = (
  node: Root,
  overrides: OverridedMdastBuilders
): Node[] => {
  return buildSlateRoot(node, overrides);
};

const buildSlateRoot = (
  root: mdast.Root,
  overrides: OverridedMdastBuilders
): slate.Node[] => {
  return convertNodes(root.children, {}, overrides);
};

const convertNodes = (
  nodes: mdast.RootContent[],
  deco: Decoration,
  overrides: OverridedMdastBuilders
): slate.Node[] => {
  return nodes.reduce<slate.Node[]>((acc, node) => {
    acc.push(...buildSlateNode(node, deco, overrides));
    return acc;
  }, []);
};

const buildSlateNode = (
  node: mdast.RootContent,
  deco: Decoration,
  overrides: OverridedMdastBuilders
): SlateNode[] => {
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
    case "footnoteReference":
      return [buildFootnoteReference(node)];
    case "math":
      return [buildMath(node)];
    case "inlineMath":
      return [buildInlineMath(node)];
    default:
      unreachable(node);
      break;
  }
  return [];
};

/**
 * @internal
 */
export type Paragraph = ReturnType<typeof buildParagraph>;

const buildParagraph = (
  { type, children }: mdast.Paragraph,
  deco: Decoration,
  overrides: OverridedMdastBuilders
) => {
  return {
    type,
    children: convertNodes(children, deco, overrides),
  };
};

/**
 * @internal
 */
export type Heading = ReturnType<typeof buildHeading>;

const buildHeading = (
  { type, children, depth }: mdast.Heading,
  deco: Decoration,
  overrides: OverridedMdastBuilders
) => {
  return {
    type,
    depth,
    children: convertNodes(children, deco, overrides),
  };
};

/**
 * @internal
 */
export type ThematicBreak = ReturnType<typeof buildThematicBreak>;

const buildThematicBreak = ({ type }: mdast.ThematicBreak) => {
  return {
    type,
    children: [{ text: "" }],
  };
};

/**
 * @internal
 */
export type Blockquote = ReturnType<typeof buildBlockquote>;

const buildBlockquote = (
  { type, children }: mdast.Blockquote,
  deco: Decoration,
  overrides: OverridedMdastBuilders
) => {
  return {
    type,
    children: convertNodes(children, deco, overrides),
  };
};

/**
 * @internal
 */
export type List = ReturnType<typeof buildList>;

const buildList = (
  { type, children, ordered, start, spread }: mdast.List,
  deco: Decoration,
  overrides: OverridedMdastBuilders
) => {
  return {
    type,
    children: convertNodes(children, deco, overrides),
    ordered,
    start,
    spread,
  };
};

/**
 * @internal
 */
export type ListItem = ReturnType<typeof buildListItem>;

const buildListItem = (
  { type, children, checked, spread }: mdast.ListItem,
  deco: Decoration,
  overrides: OverridedMdastBuilders
) => {
  return {
    type,
    children:
      // https://github.com/inokawa/remark-slate-transformer/issues/42
      // https://github.com/inokawa/remark-slate-transformer/issues/129
      children.length === 0
        ? [{ text: "" }]
        : convertNodes(children, deco, overrides),
    checked,
    spread,
  };
};

/**
 * @internal
 */
export type Table = ReturnType<typeof buildTable>;

const buildTable = (
  { type, children, align }: mdast.Table,
  deco: Decoration,
  overrides: OverridedMdastBuilders
) => {
  return {
    type,
    children: convertNodes(children, deco, overrides),
    align,
  };
};

/**
 * @internal
 */
export type TableRow = ReturnType<typeof buildTableRow>;

const buildTableRow = (
  { type, children }: mdast.TableRow,
  deco: Decoration,
  overrides: OverridedMdastBuilders
) => {
  return {
    type,
    children: convertNodes(children, deco, overrides),
  };
};

/**
 * @internal
 */
export type TableCell = ReturnType<typeof buildTableCell>;

const buildTableCell = (
  { type, children }: mdast.TableCell,
  deco: Decoration,
  overrides: OverridedMdastBuilders
) => {
  return {
    type,
    children: convertNodes(children, deco, overrides),
  };
};

/**
 * @internal
 */
export type Html = ReturnType<typeof buildHtml>;

const buildHtml = ({ type, value }: mdast.HTML) => {
  return {
    type,
    children: [{ text: value }],
  };
};

/**
 * @internal
 */
export type Code = ReturnType<typeof buildCode>;

const buildCode = ({ type, value, lang, meta }: mdast.Code) => {
  return {
    type,
    lang,
    meta,
    children: [{ text: value }],
  };
};

/**
 * @internal
 */
export type Yaml = ReturnType<typeof buildYaml>;

const buildYaml = ({ type, value }: mdast.YAML) => {
  return {
    type,
    children: [{ text: value }],
  };
};

/**
 * @internal
 */
export type Toml = ReturnType<typeof buildToml>;

const buildToml = ({ type, value }: mdast.TOML) => {
  return {
    type,
    children: [{ text: value }],
  };
};

/**
 * @internal
 */
export type Math = ReturnType<typeof buildMath>;

const buildMath = ({ type, value }: mdast.Math) => {
  return {
    type,
    children: [{ text: value }],
  };
};

/**
 * @internal
 */
export type InlineMath = ReturnType<typeof buildInlineMath>;

const buildInlineMath = ({ type, value }: mdast.InlineMath) => {
  return {
    type,
    children: [{ text: value }],
  };
};

/**
 * @internal
 */
export type Definition = ReturnType<typeof buildDefinition>;

const buildDefinition = ({
  type,
  identifier,
  label,
  url,
  title,
}: mdast.Definition) => {
  return {
    type,
    identifier,
    label,
    url,
    title,
    children: [{ text: "" }],
  };
};

/**
 * @internal
 */
export type FootnoteDefinition = ReturnType<typeof buildFootnoteDefinition>;

const buildFootnoteDefinition = (
  { type, children, identifier, label }: mdast.FootnoteDefinition,
  deco: Decoration,
  overrides: OverridedMdastBuilders
) => {
  return {
    type,
    children: convertNodes(children, deco, overrides),
    identifier,
    label,
  };
};

/**
 * @internal
 */
export type Text = ReturnType<typeof buildText>;

const buildText = (text: string, deco: Decoration) => {
  return {
    ...deco,
    text,
  };
};

/**
 * @internal
 */
export type Break = ReturnType<typeof buildBreak>;

const buildBreak = ({ type }: mdast.Break) => {
  return {
    type,
    children: [{ text: "" }],
  };
};

/**
 * @internal
 */
export type Link = ReturnType<typeof buildLink>;

const buildLink = (
  { type, children, url, title }: mdast.Link,
  deco: Decoration,
  overrides: OverridedMdastBuilders
) => {
  return {
    type,
    children: convertNodes(children, deco, overrides),
    url,
    title,
  };
};

/**
 * @internal
 */
export type Image = ReturnType<typeof buildImage>;

const buildImage = ({ type, url, title, alt }: mdast.Image) => {
  return {
    type,
    url,
    title,
    alt,
    children: [{ text: "" }],
  };
};

/**
 * @internal
 */
export type LinkReference = ReturnType<typeof buildLinkReference>;

const buildLinkReference = (
  { type, children, referenceType, identifier, label }: mdast.LinkReference,
  deco: Decoration,
  overrides: OverridedMdastBuilders
) => {
  return {
    type,
    children: convertNodes(children, deco, overrides),
    referenceType,
    identifier,
    label,
  };
};

/**
 * @internal
 */
export type ImageReference = ReturnType<typeof buildImageReference>;

const buildImageReference = ({
  type,
  alt,
  referenceType,
  identifier,
  label,
}: mdast.ImageReference) => {
  return {
    type,
    alt,
    referenceType,
    identifier,
    label,
    children: [{ text: "" }],
  };
};

/**
 * @internal
 */
export type FootnoteReference = ReturnType<typeof buildFootnoteReference>;

const buildFootnoteReference = ({
  type,
  identifier,
  label,
}: mdast.FootnoteReference) => {
  return {
    type,
    identifier,
    label,
    children: [{ text: "" }],
  };
};

/**
 * @internal
 */
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
  | FootnoteReference
  | Math
  | InlineMath;
