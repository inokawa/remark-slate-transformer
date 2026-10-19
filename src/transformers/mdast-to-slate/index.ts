import type { Root, RootContent } from "mdast";
import type { Descendant } from "slate";
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
  next: (children: RootContent[]) => Descendant[],
  marks: Marks
) => object | undefined;

export type MarkNames = {
  [key in "emphasis" | "strong" | "delete" | "inlineCode"]?: string;
};

export type HtmlMarkNames = { [tag: string]: string };

type Marks = Readonly<{ [key: string]: true }>;

type Context = {
  overrides: OverridedMdastBuilders;
  marks: MarkNames;
  htmlMarks: HtmlMarkNames;
};

export const mdastToSlate = (
  node: Root,
  overrides: OverridedMdastBuilders,
  marks: MarkNames = {},
  htmlMarks: HtmlMarkNames = {}
): Descendant[] => {
  return convertNodes(node.children, {}, { overrides, marks, htmlMarks });
};

const toSlateMarks = (deco: Marks, ctx: Context): Marks =>
  Object.fromEntries(
    Object.keys(deco).map((key) => [
      ctx.marks[key as keyof MarkNames] ?? key,
      true as const,
    ])
  );

const HTML_TAG = /^<(\/?)([a-z][a-z0-9]*)>$/i;

const htmlTag = (node: mdast.RootContent) => {
  const match = node.type === "html" ? HTML_TAG.exec(node.value.trim()) : null;
  return match && { closing: match[1] === "/", name: match[2]!.toLowerCase() };
};

const htmlMarkOf = (node: mdast.RootContent, ctx: Context) => {
  const tag = htmlTag(node);
  return tag && !tag.closing && Object.prototype.hasOwnProperty.call(ctx.htmlMarks, tag.name)
    ? { name: tag.name, mark: ctx.htmlMarks[tag.name]! }
    : null;
};

const findClosingTag = (
  nodes: readonly mdast.RootContent[],
  start: number,
  name: string
) => {
  let depth = 0;
  for (let i = start + 1; i < nodes.length; i++) {
    const tag = htmlTag(nodes[i]!);
    if (tag?.name !== name) continue;
    if (!tag.closing) {
      depth++;
    } else if (depth === 0) {
      return i;
    } else {
      depth--;
    }
  }
  return -1;
};

const convertInline = (
  nodes: readonly mdast.RootContent[],
  deco: Marks,
  ctx: Context
): MdastNode[] => {
  const result: MdastNode[] = [];
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]!;
    const htmlMark = htmlMarkOf(node, ctx);
    const end = htmlMark ? findClosingTag(nodes, i, htmlMark.name) : -1;
    if (htmlMark && end !== -1) {
      result.push(
        ...convertInline(
          nodes.slice(i + 1, end),
          { ...deco, [htmlMark.mark]: true },
          ctx
        )
      );
      i = end;
    } else {
      result.push(...buildSlateNode(node, deco, ctx));
    }
  }
  return result;
};

const convertNodes = (
  nodes: mdast.RootContent[],
  deco: Marks,
  ctx: Context
): MdastNode[] => {
  return nodes.reduce<MdastNode[]>((acc, node) => {
    acc.push(...buildSlateNode(node, deco, ctx));
    return acc;
  }, []);
};

const convertPhrasing = (
  nodes: mdast.PhrasingContent[],
  deco: Marks,
  ctx: Context
): MdastNode[] => {
  return convertInline(nodes, deco, ctx).map((node) =>
    "type" in node && node.type === "html" ? { ...node, inline: true } : node
  );
};

const buildSlateNode = (
  node: mdast.RootContent,
  deco: Marks,
  ctx: Context
): MdastNode[] => {
  const build = ctx.overrides[node.type] as MdastBuilder<string> | undefined;
  const customNode = build?.(
    node,
    (children) => convertNodes(children, deco, ctx),
    toSlateMarks(deco, ctx)
  );
  if (customNode != null) {
    return [customNode as MdastNode];
  }

  switch (node.type) {
    case "paragraph":
      return [buildParagraph(node, deco, ctx)];
    case "heading":
      return [buildHeading(node, deco, ctx)];
    case "thematicBreak":
      return [buildThematicBreak(node)];
    case "blockquote":
      return [buildBlockquote(node, deco, ctx)];
    case "list":
      return [buildList(node, deco, ctx)];
    case "listItem":
      return [buildListItem(node, deco, ctx)];
    case "table":
      return [buildTable(node, deco, ctx)];
    case "tableRow":
      return [buildTableRow(node, deco, ctx)];
    case "tableCell":
      return [buildTableCell(node, deco, ctx)];
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
      return [buildFootnoteDefinition(node, deco, ctx)];
    case "text":
      return [buildText(node.value, toSlateMarks(deco, ctx))];
    case "emphasis":
    case "strong":
    case "delete": {
      const { type, children } = node;
      return convertInline(children, { ...deco, [type]: true }, ctx);
    }
    case "inlineCode": {
      const { type, value } = node;
      return [buildText(value, toSlateMarks({ ...deco, [type]: true }, ctx))];
    }
    case "break":
      return [buildBreak(node)];
    case "link":
      return [buildLink(node, deco, ctx)];
    case "image":
      return [buildImage(node)];
    case "linkReference":
      return [buildLinkReference(node, deco, ctx)];
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

export interface Paragraph extends Pick<mdast.Paragraph, "type"> {
  children: MdastNode[];
}

const buildParagraph = (
  { type, children }: mdast.Paragraph,
  deco: Marks,
  ctx: Context
): Paragraph => {
  return {
    type,
    children: convertPhrasing(children, deco, ctx),
  };
};

export interface Heading extends Pick<mdast.Heading, "type" | "depth"> {
  children: MdastNode[];
}

const buildHeading = (
  { type, children, depth }: mdast.Heading,
  deco: Marks,
  ctx: Context
): Heading => {
  return {
    type,
    depth,
    children: convertPhrasing(children, deco, ctx),
  };
};

export interface ThematicBreak extends Pick<mdast.ThematicBreak, "type"> {
  children: MdastNode[];
}

const buildThematicBreak = ({ type }: mdast.ThematicBreak): ThematicBreak => {
  return {
    type,
    children: [{ text: "" }],
  };
};

export interface Blockquote extends Pick<mdast.Blockquote, "type"> {
  children: MdastNode[];
}

const buildBlockquote = (
  { type, children }: mdast.Blockquote,
  deco: Marks,
  ctx: Context
): Blockquote => {
  return {
    type,
    children: convertNodes(children, deco, ctx),
  };
};

export interface List
  extends Pick<mdast.List, "type" | "ordered" | "start" | "spread"> {
  children: MdastNode[];
}

const buildList = (
  { type, children, ordered, start, spread }: mdast.List,
  deco: Marks,
  ctx: Context
): List => {
  return {
    type,
    children: convertNodes(children, deco, ctx),
    ordered,
    start,
    spread,
  };
};

export interface ListItem
  extends Pick<mdast.ListItem, "type" | "checked" | "spread"> {
  children: MdastNode[];
}

const buildListItem = (
  { type, children, checked, spread }: mdast.ListItem,
  deco: Marks,
  ctx: Context
): ListItem => {
  return {
    type,
    children:
      // https://github.com/inokawa/remark-slate-transformer/issues/42
      // https://github.com/inokawa/remark-slate-transformer/issues/129
      children.length === 0
        ? [{ text: "" }]
        : convertNodes(children, deco, ctx),
    checked,
    spread,
  };
};

export interface Table extends Pick<mdast.Table, "type" | "align"> {
  children: MdastNode[];
}

const buildTable = (
  { type, children, align }: mdast.Table,
  deco: Marks,
  ctx: Context
): Table => {
  return {
    type,
    children: convertNodes(children, deco, ctx),
    align,
  };
};

export interface TableRow extends Pick<mdast.TableRow, "type"> {
  children: MdastNode[];
}

const buildTableRow = (
  { type, children }: mdast.TableRow,
  deco: Marks,
  ctx: Context
): TableRow => {
  return {
    type,
    children: convertNodes(children, deco, ctx),
  };
};

export interface TableCell extends Pick<mdast.TableCell, "type"> {
  children: MdastNode[];
}

const buildTableCell = (
  { type, children }: mdast.TableCell,
  deco: Marks,
  ctx: Context
): TableCell => {
  return {
    type,
    children: convertPhrasing(children, deco, ctx),
  };
};

export interface Html extends Pick<mdast.Html, "type"> {
  children: MdastNode[];
  inline?: true;
}

const buildHtml = ({ type, value }: mdast.HTML): Html => {
  return {
    type,
    children: [{ text: value }],
  };
};

export interface Code extends Pick<mdast.Code, "type" | "lang" | "meta"> {
  children: MdastNode[];
}

const buildCode = ({ type, value, lang, meta }: mdast.Code): Code => {
  return {
    type,
    lang,
    meta,
    children: [{ text: value }],
  };
};

export interface Yaml extends Pick<mdast.Yaml, "type"> {
  children: MdastNode[];
}

const buildYaml = ({ type, value }: mdast.YAML): Yaml => {
  return {
    type,
    children: [{ text: value }],
  };
};

export interface Toml extends Pick<mdast.TOML, "type"> {
  children: MdastNode[];
}

const buildToml = ({ type, value }: mdast.TOML): Toml => {
  return {
    type,
    children: [{ text: value }],
  };
};

export interface Math extends Pick<mdast.Math, "type"> {
  children: MdastNode[];
}

const buildMath = ({ type, value }: mdast.Math): Math => {
  return {
    type,
    children: [{ text: value }],
  };
};

export interface InlineMath extends Pick<mdast.InlineMath, "type"> {
  children: MdastNode[];
}

const buildInlineMath = ({ type, value }: mdast.InlineMath): InlineMath => {
  return {
    type,
    children: [{ text: value }],
  };
};

export interface Definition
  extends Pick<
    mdast.Definition,
    "type" | "identifier" | "label" | "url" | "title"
  > {
  children: MdastNode[];
}

const buildDefinition = ({
  type,
  identifier,
  label,
  url,
  title,
}: mdast.Definition): Definition => {
  return {
    type,
    identifier,
    label,
    url,
    title,
    children: [{ text: "" }],
  };
};

export interface FootnoteDefinition
  extends Pick<mdast.FootnoteDefinition, "type" | "identifier" | "label"> {
  children: MdastNode[];
}

const buildFootnoteDefinition = (
  { type, children, identifier, label }: mdast.FootnoteDefinition,
  deco: Marks,
  ctx: Context
): FootnoteDefinition => {
  return {
    type,
    children: convertNodes(children, deco, ctx),
    identifier,
    label,
  };
};

export interface Text {
  text: string;
  emphasis?: true;
  strong?: true;
  delete?: true;
  inlineCode?: true;
}

const buildText = (
  text: string,
  marks: Readonly<{ [key: string]: true }>
): Text => {
  return {
    ...marks,
    text,
  };
};

export interface Break extends Pick<mdast.Break, "type"> {
  children: MdastNode[];
}

const buildBreak = ({ type }: mdast.Break): Break => {
  return {
    type,
    children: [{ text: "" }],
  };
};

export interface Link extends Pick<mdast.Link, "type" | "url" | "title"> {
  children: MdastNode[];
}

const buildLink = (
  { type, children, url, title }: mdast.Link,
  deco: Marks,
  ctx: Context
): Link => {
  return {
    type,
    children: convertPhrasing(children, deco, ctx),
    url,
    title,
  };
};

export interface Image
  extends Pick<mdast.Image, "type" | "url" | "title" | "alt"> {
  children: MdastNode[];
}

const buildImage = ({ type, url, title, alt }: mdast.Image): Image => {
  return {
    type,
    url,
    title,
    alt,
    children: [{ text: "" }],
  };
};

export interface LinkReference
  extends Pick<
    mdast.LinkReference,
    "type" | "referenceType" | "identifier" | "label"
  > {
  children: MdastNode[];
}

const buildLinkReference = (
  { type, children, referenceType, identifier, label }: mdast.LinkReference,
  deco: Marks,
  ctx: Context
): LinkReference => {
  return {
    type,
    children: convertPhrasing(children, deco, ctx),
    referenceType,
    identifier,
    label,
  };
};

export interface ImageReference
  extends Pick<
    mdast.ImageReference,
    "type" | "alt" | "referenceType" | "identifier" | "label"
  > {
  children: MdastNode[];
}

const buildImageReference = ({
  type,
  alt,
  referenceType,
  identifier,
  label,
}: mdast.ImageReference): ImageReference => {
  return {
    type,
    alt,
    referenceType,
    identifier,
    label,
    children: [{ text: "" }],
  };
};

export interface FootnoteReference
  extends Pick<mdast.FootnoteReference, "type" | "identifier" | "label"> {
  children: MdastNode[];
}

const buildFootnoteReference = ({
  type,
  identifier,
  label,
}: mdast.FootnoteReference): FootnoteReference => {
  return {
    type,
    identifier,
    label,
    children: [{ text: "" }],
  };
};

export type MdastElement =
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
  | Break
  | Link
  | Image
  | LinkReference
  | ImageReference
  | FootnoteReference
  | Math
  | InlineMath;

export type MdastNode = MdastElement | Text;
