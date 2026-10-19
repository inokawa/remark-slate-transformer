import type { Root, RootContent } from "mdast";
import type { Descendant, Element, Node } from "slate";
import type * as mdast from "../../models/mdast";
import type * as slateInternal from "../mdast-to-slate";
import type { MarkNames, MdastElement, MdastNode } from "../mdast-to-slate";
import { unreachable } from "../../utils";

type DecorationType = keyof slateInternal.Decoration;

type TextOrDecoration =
  | mdast.Text
  | mdast.Emphasis
  | mdast.Strong
  | mdast.Delete
  | mdast.InlineCode;

export type OverridedSlateBuilders = {
  [key in MdastElement["type"]]?: SlateBuilder<
    Extract<MdastElement, { type: key }>
  >;
} & ({ [key: string]: SlateBuilder } | {});

export type SlateBuilder<T = Element> = (
  node: T,
  next: (children: readonly Descendant[]) => RootContent[]
) => object | undefined;

type Context = {
  overrides: OverridedSlateBuilders;
  marks: MarkNames;
};

export const slateToMdast = (
  nodes: readonly (Node | MdastNode)[],
  overrides: OverridedSlateBuilders,
  marks: MarkNames = {}
): Root => {
  return {
    type: "root",
    children: convertNodes(nodes, { overrides, marks }) as Root["children"],
  };
};

const DECORATION_TYPES = ["emphasis", "strong", "delete", "inlineCode"] as const;

const fromSlateMarks = (
  text: { text: string },
  ctx: Context
): slateInternal.Text => {
  const props = new Map(Object.entries(text));
  const result: slateInternal.Text = { text: text.text };
  DECORATION_TYPES.forEach((type) => {
    if (props.get(ctx.marks[type] ?? type)) {
      result[type] = true;
    }
  });
  return result;
};

const textContent = (nodes: readonly (Node | MdastNode)[]): string =>
  nodes
    .map((node) => ("text" in node ? node.text : textContent(node.children)))
    .join("");

const convertNodes = (
  nodes: readonly (Node | MdastNode)[],
  ctx: Context
): RootContent[] => {
  const mdastNodes: RootContent[] = [];
  let textQueue: slateInternal.Text[] = [];
  for (let i = 0; i <= nodes.length; i++) {
    const n = nodes[i] as MdastNode | undefined;
    if (n && isText(n)) {
      textQueue.push(fromSlateMarks(n, ctx));
    } else {
      mdastNodes.push(...convertTexts(textQueue));
      textQueue = [];
      if (!n) continue;
      const node = buildMdastNode(n, ctx);
      if (node) {
        mdastNodes.push(node);
      }
    }
  }

  return mdastNodes;
};

const convertTexts = (
  slateTexts: readonly slateInternal.Text[]
): TextOrDecoration[] => {
  const mdastTexts: TextOrDecoration[] = [];
  const starts: DecorationType[] = [];
  let ends: DecorationType[] = [];
  let textTemp: string = "";
  for (let j = 0; j < slateTexts.length; j++) {
    const cur = slateTexts[j]!;
    textTemp += cur.text;

    const prevStarts = starts.slice();
    const prevEnds = ends.slice();

    const prev = slateTexts[j - 1];
    const next = slateTexts[j + 1];
    ends = [];
    (
      [
        "emphasis",
        "strong",
        "delete",
        // inlineCode should be last because of the spec in mdast
        // https://github.com/inokawa/remark-slate-transformer/issues/145
        "inlineCode",
      ] as const
    ).forEach((k) => {
      if (cur[k]) {
        if (!prev || !prev[k]) {
          starts.push(k);
        }
        if (!next || !next[k]) {
          ends.push(k);
        }
      }
    });

    const endsToRemove = starts.reduce<
      { key: DecorationType; index: number }[]
    >((acc, k, kIndex) => {
      if (ends.includes(k)) {
        acc.push({ key: k, index: kIndex });
      }
      return acc;
    }, []);

    if (starts.length > 0) {
      let bef = "";
      let aft = "";
      if (
        endsToRemove.length === 1 &&
        (prevStarts.toString() !== starts.toString() ||
          // https://github.com/inokawa/remark-slate-transformer/issues/90
          (prevEnds.includes("emphasis") && ends.includes("strong"))) &&
        starts.length - endsToRemove.length === 0
      ) {
        while (textTemp.startsWith(" ")) {
          bef += " ";
          textTemp = textTemp.slice(1);
        }
        while (textTemp.endsWith(" ")) {
          aft += " ";
          textTemp = textTemp.slice(0, -1);
        }
      }
      const value = textTemp;
      const hasText = value !== "";
      let res: TextOrDecoration = {
        type: "text",
        value,
      };
      textTemp = "";
      const wrapOrder = starts.slice().reverse();
      if (wrapOrder.includes("inlineCode")) {
        wrapOrder.splice(wrapOrder.indexOf("inlineCode"), 1);
        wrapOrder.unshift("inlineCode");
      }
      wrapOrder.forEach((k) => {
        switch (k) {
          case "inlineCode":
            res = {
              type: k,
              value,
            };
            break;
          case "strong":
          case "emphasis":
          case "delete":
            res = {
              type: k,
              children: [res],
            };
            break;
          default:
            unreachable(k);
            break;
        }
      });
      const arr: TextOrDecoration[] = [];
      if (bef.length > 0) {
        arr.push({ type: "text", value: bef });
      }
      if (hasText) {
        arr.push(res);
      }
      if (aft.length > 0) {
        arr.push({ type: "text", value: aft });
      }
      mdastTexts.push(...arr);
    }

    if (endsToRemove.length > 0) {
      endsToRemove.reverse().forEach((e) => {
        starts.splice(e.index, 1);
      });
    } else {
      mdastTexts.push({ type: "text", value: textTemp });
      textTemp = "";
    }
  }
  if (textTemp) {
    mdastTexts.push({ type: "text", value: textTemp });
    textTemp = "";
  }
  return mergeTexts(mdastTexts);
};

const buildMdastNode = (
  node: Exclude<MdastNode, slateInternal.Text>,
  ctx: Context
): RootContent | null => {
  const build = (ctx.overrides as { [key: string]: SlateBuilder<MdastElement> })[
    node.type
  ];
  const customNode = build?.(node, (children) => convertNodes(children, ctx));
  if (customNode != null) {
    return customNode as RootContent;
  }

  switch (node.type) {
    case "paragraph":
      return buildParagraph(node, ctx);
    case "heading":
      return buildHeading(node, ctx);
    case "thematicBreak":
      return buildThematicBreak(node);
    case "blockquote":
      return buildBlockquote(node, ctx);
    case "list":
      return buildList(node, ctx);
    case "listItem":
      return buildListItem(node, ctx);
    case "table":
      return buildTable(node, ctx);
    case "tableRow":
      return buildTableRow(node, ctx);
    case "tableCell":
      return buildTableCell(node, ctx);
    case "html":
      return buildHtml(node);
    case "code":
      return buildCode(node);
    case "yaml":
      return buildYaml(node);
    case "toml":
      return buildToml(node);
    case "definition":
      return buildDefinition(node);
    case "footnoteDefinition":
      return buildFootnoteDefinition(node, ctx);
    case "break":
      return buildBreak(node);
    case "link":
      return buildLink(node, ctx);
    case "image":
      return buildImage(node);
    case "linkReference":
      return buildLinkReference(node, ctx);
    case "imageReference":
      return buildImageReference(node);
    case "footnoteReference":
      return creatFootnoteReference(node);
    case "math":
      return buildMath(node);
    case "inlineMath":
      return buildInlineMath(node);
    default:
      unreachable(node);
      break;
  }
  return null;
};

const isText = (node: MdastNode): node is slateInternal.Text => {
  return "text" in node;
};

const mergeTexts = (nodes: TextOrDecoration[]): TextOrDecoration[] => {
  const res: TextOrDecoration[] = [];
  for (const cur of nodes) {
    const last = res[res.length - 1];
    if (last && last.type === cur.type) {
      if (last.type === "text") {
        last.value += (cur as typeof last).value;
      } else if (last.type === "inlineCode") {
        last.value += (cur as typeof last).value;
      } else {
        last.children = mergeTexts(
          last.children.concat(
            (cur as typeof last).children
          ) as TextOrDecoration[]
        );
      }
    } else {
      if (cur.type === "text" && cur.value === "") continue;
      res.push(cur);
    }
  }
  return res;
};

const buildParagraph = (
  { type, children }: slateInternal.Paragraph,
  ctx: Context
): mdast.Paragraph => {
  return {
    type,
    children: convertNodes(children, ctx) as mdast.Paragraph["children"],
  };
};

const buildHeading = (
  { type, depth, children }: slateInternal.Heading,
  ctx: Context
): mdast.Heading => {
  return {
    type,
    depth,
    children: convertNodes(children, ctx) as mdast.Heading["children"],
  };
};

const buildThematicBreak = ({
  type,
}: slateInternal.ThematicBreak): mdast.ThematicBreak => {
  return {
    type,
  };
};

const buildBlockquote = (
  { type, children }: slateInternal.Blockquote,
  ctx: Context
): mdast.Blockquote => {
  return {
    type,
    children: convertNodes(children, ctx) as mdast.Blockquote["children"],
  };
};

const buildList = (
  { type, ordered, start, spread, children }: slateInternal.List,
  ctx: Context
): mdast.List => {
  return {
    type,
    ordered,
    start,
    spread,
    children: convertNodes(children, ctx) as mdast.List["children"],
  };
};

const buildListItem = (
  { type, checked, spread, children }: slateInternal.ListItem,
  ctx: Context
): mdast.ListItem => {
  return {
    type,
    checked,
    spread,
    children: convertNodes(children, ctx) as mdast.ListItem["children"],
  };
};

const buildTable = (
  { type, align, children }: slateInternal.Table,
  ctx: Context
): mdast.Table => {
  return {
    type,
    align,
    children: convertNodes(children, ctx) as mdast.Table["children"],
  };
};

const buildTableRow = (
  { type, children }: slateInternal.TableRow,
  ctx: Context
): mdast.TableRow => {
  return {
    type,
    children: convertNodes(children, ctx) as mdast.TableRow["children"],
  };
};

const buildTableCell = (
  { type, children }: slateInternal.TableCell,
  ctx: Context
): mdast.TableCell => {
  return {
    type,
    children: convertNodes(children, ctx) as mdast.TableCell["children"],
  };
};

const buildHtml = ({ type, children }: slateInternal.Html): mdast.HTML => {
  return {
    type,
    value: textContent(children),
  };
};

const buildCode = ({
  type,
  lang,
  meta,
  children,
}: slateInternal.Code): mdast.Code => {
  return {
    type,
    lang,
    meta,
    value: textContent(children),
  };
};

const buildYaml = ({ type, children }: slateInternal.Yaml): mdast.YAML => {
  return {
    type,
    value: textContent(children),
  };
};

const buildToml = ({ type, children }: slateInternal.Toml): mdast.TOML => {
  return {
    type,
    value: textContent(children),
  };
};

const buildDefinition = ({
  type,
  identifier,
  label,
  url,
  title,
}: slateInternal.Definition): mdast.Definition => {
  return {
    type,
    identifier,
    label,
    url,
    title,
  };
};

const buildFootnoteDefinition = (
  { type, identifier, label, children }: slateInternal.FootnoteDefinition,
  ctx: Context
): mdast.FootnoteDefinition => {
  return {
    type,
    identifier,
    label,
    children: convertNodes(
      children,
      ctx
    ) as mdast.FootnoteDefinition["children"],
  };
};

const buildBreak = ({ type }: slateInternal.Break): mdast.Break => {
  return {
    type,
  };
};

const buildLink = (
  { type, url, title, children }: slateInternal.Link,
  ctx: Context
): mdast.Link => {
  return {
    type,
    url,
    title,
    children: convertNodes(children, ctx) as mdast.Link["children"],
  };
};

const buildImage = ({
  type,
  url,
  title,
  alt,
}: slateInternal.Image): mdast.Image => {
  return {
    type,
    url,
    title,
    alt,
  };
};

const buildLinkReference = (
  {
    type,
    identifier,
    label,
    referenceType,
    children,
  }: slateInternal.LinkReference,
  ctx: Context
): mdast.LinkReference => {
  return {
    type,
    identifier,
    label,
    referenceType,
    children: convertNodes(
      children,
      ctx
    ) as mdast.LinkReference["children"],
  };
};

const buildImageReference = ({
  type,
  identifier,
  label,
  alt,
  referenceType,
}: slateInternal.ImageReference): mdast.ImageReference => {
  return {
    type,
    identifier,
    label,
    alt,
    referenceType,
  };
};

const creatFootnoteReference = ({
  type,
  identifier,
  label,
}: slateInternal.FootnoteReference): mdast.FootnoteReference => {
  return {
    type,
    identifier,
    label,
  };
};

const buildMath = ({ type, children }: slateInternal.Math): mdast.Math => {
  return {
    type,
    value: textContent(children),
  };
};

const buildInlineMath = ({
  type,
  children,
}: slateInternal.InlineMath): mdast.InlineMath => {
  return {
    type,
    value: textContent(children),
  };
};
