import * as unistLib from "unist";
import * as slate from "../../models/slate";
import * as mdast from "../../models/mdast";
import * as slateInternal from "../mdast-to-slate";

type DecorationType = keyof slateInternal.Decoration;

type TextOrDecoration =
  | mdast.Text
  | mdast.Emphasis
  | mdast.Strong
  | mdast.Delete
  | mdast.InlineCode;

export type OverridedSlateBuilders = { [key: string]: SlateBuilder };

export type SlateBuilder = (
  node: unknown,
  next: typeof convertNodes
) => object | undefined;

export function slateToMdast(
  node: slate.Node,
  overrides: OverridedSlateBuilders
): unistLib.Node {
  return buildMdastRoot(node, overrides);
}

function buildMdastRoot(
  node: slate.Node,
  overrides: OverridedSlateBuilders
): unistLib.Node {
  const root: mdast.Root = {
    type: "root",
    children: convertNodes(
      (node as any).children,
      overrides
    ) as mdast.Root["children"],
  };
  return (root as any) as unistLib.Node;
}

function convertNodes(
  nodes: slate.Node[],
  overrides: OverridedSlateBuilders
): unistLib.Node[] {
  const mdastNodes: unistLib.Node[] = [];
  let textQueue: slateInternal.Text[] = [];
  for (let i = 0; i <= nodes.length; i++) {
    const n = nodes[i] as slateInternal.SlateNode;
    if (n && isText(n)) {
      textQueue.push(n);
    } else {
      const mdastTexts: TextOrDecoration[] = [];
      const starts: DecorationType[] = [];
      let textTemp: string = "";
      for (let j = 0; j < textQueue.length; j++) {
        const cur = textQueue[j];
        textTemp += cur.text;

        const prevStartsStr = starts.toString();

        const prev = textQueue[j - 1];
        const next = textQueue[j + 1];
        const ends: DecorationType[] = [];
        (["inlineCode", "emphasis", "strong", "delete"] as const).forEach(
          (k) => {
            if (cur[k]) {
              if (!prev || !prev[k]) {
                starts.push(k);
              }
              if (!next || !next[k]) {
                ends.push(k);
              }
            }
          }
        );

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
            prevStartsStr !== starts.toString() &&
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
          let res: TextOrDecoration = {
            type: "text",
            value: textTemp,
          };
          textTemp = "";
          const startsReversed = starts.slice().reverse();
          startsReversed.forEach((k) => {
            switch (k) {
              case "inlineCode":
                res = {
                  type: k,
                  value: (res as any).value,
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
                const _: never = k;
                break;
            }
          });
          const arr: TextOrDecoration[] = [];
          if (bef.length > 0) {
            arr.push({ type: "text", value: bef });
          }
          arr.push(res);
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

      mdastNodes.push(...((mergeTexts(mdastTexts) as any) as unistLib.Node[]));
      textQueue = [];
      if (!n) continue;
      const node = buildMdastNode(n, overrides);
      if (node) {
        mdastNodes.push(node as unistLib.Node);
      }
    }
  }

  return mdastNodes;
}

function buildMdastNode(
  node: Exclude<slateInternal.SlateNode, slateInternal.Text>,
  overrides: OverridedSlateBuilders
): Exclude<mdast.Content, TextOrDecoration> | null {
  const customNode = overrides[node.type]?.(node as any, (children) =>
    convertNodes(children, overrides)
  );
  if (customNode != null) {
    return customNode as any;
  }

  switch (node.type) {
    case "paragraph":
      return buildParagraph(node, overrides);
    case "heading":
      return buildHeading(node, overrides);
    case "thematicBreak":
      return buildThematicBreak(node);
    case "blockquote":
      return buildBlockquote(node, overrides);
    case "list":
      return buildList(node, overrides);
    case "listItem":
      return buildListItem(node, overrides);
    case "table":
      return buildTable(node, overrides);
    case "tableRow":
      return buildTableRow(node, overrides);
    case "tableCell":
      return buildTableCell(node, overrides);
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
      return buildFootnoteDefinition(node, overrides);
    case "break":
      return buildBreak(node);
    case "link":
      return buildLink(node, overrides);
    case "image":
      return buildImage(node);
    case "linkReference":
      return buildLinkReference(node, overrides);
    case "imageReference":
      return buildImageReference(node);
    case "footnote":
      return buildFootnote(node, overrides);
    case "footnoteReference":
      return creatFootnoteReference(node);
    case "math":
      return buildMath(node);
    case "inlineMath":
      return buildInlineMath(node);
    default:
      const _: never = node;
      break;
  }
  return null;
}

function isText(node: slateInternal.SlateNode): node is slateInternal.Text {
  return "text" in node;
}

function mergeTexts(nodes: TextOrDecoration[]): TextOrDecoration[] {
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
}

function buildParagraph(
  node: slateInternal.Paragraph,
  overrides: OverridedSlateBuilders
): mdast.Paragraph {
  const { type, children } = node;
  return {
    type,
    children: convertNodes(children, overrides) as mdast.Paragraph["children"],
  };
}

function buildHeading(
  node: slateInternal.Heading,
  overrides: OverridedSlateBuilders
): mdast.Heading {
  const { type, depth, children } = node;
  return {
    type,
    depth,
    children: convertNodes(children, overrides) as mdast.Heading["children"],
  };
}

function buildThematicBreak(
  node: slateInternal.ThematicBreak
): mdast.ThematicBreak {
  const { type } = node;
  return {
    type,
  };
}

function buildBlockquote(
  node: slateInternal.Blockquote,
  overrides: OverridedSlateBuilders
): mdast.Blockquote {
  const { type, children } = node;
  return {
    type,
    children: convertNodes(children, overrides) as mdast.Blockquote["children"],
  };
}

function buildList(
  node: slateInternal.List,
  overrides: OverridedSlateBuilders
): mdast.List {
  const { type, ordered, start, spread, children } = node;
  return {
    type,
    ordered,
    start,
    spread,
    children: convertNodes(children, overrides) as mdast.List["children"],
  };
}

function buildListItem(
  node: slateInternal.ListItem,
  overrides: OverridedSlateBuilders
): mdast.ListItem {
  const { type, checked, spread, children } = node;
  return {
    type,
    checked,
    spread,
    children: convertNodes(children, overrides) as mdast.ListItem["children"],
  };
}

function buildTable(
  node: slateInternal.Table,
  overrides: OverridedSlateBuilders
): mdast.Table {
  const { type, align, children } = node;
  return {
    type,
    align,
    children: convertNodes(children, overrides) as mdast.Table["children"],
  };
}

function buildTableRow(
  node: slateInternal.TableRow,
  overrides: OverridedSlateBuilders
): mdast.TableRow {
  const { type, children } = node;
  return {
    type,
    children: convertNodes(children, overrides) as mdast.TableRow["children"],
  };
}

function buildTableCell(
  node: slateInternal.TableCell,
  overrides: OverridedSlateBuilders
): mdast.TableCell {
  const { type, children } = node;
  return {
    type,
    children: convertNodes(children, overrides) as mdast.TableCell["children"],
  };
}

function buildHtml(node: slateInternal.Html): mdast.HTML {
  const { type, children } = node;
  return {
    type,
    value: children[0].text,
  };
}

function buildCode(node: slateInternal.Code): mdast.Code {
  const { type, lang, meta, children } = node;
  return {
    type,
    lang,
    meta,
    value: children[0].text,
  };
}

function buildYaml(node: slateInternal.Yaml): mdast.YAML {
  const { type, children } = node;
  return {
    type,
    value: children[0].text,
  };
}

function buildToml(node: slateInternal.Toml): mdast.TOML {
  const { type, children } = node;
  return {
    type,
    value: children[0].text,
  };
}

function buildDefinition(node: slateInternal.Definition): mdast.Definition {
  const { type, identifier, label, url, title } = node;
  return {
    type,
    identifier,
    label,
    url,
    title,
  };
}

function buildFootnoteDefinition(
  node: slateInternal.FootnoteDefinition,
  overrides: OverridedSlateBuilders
): mdast.FootnoteDefinition {
  const { type, identifier, label, children } = node;
  return {
    type,
    identifier,
    label,
    children: convertNodes(
      children,
      overrides
    ) as mdast.FootnoteDefinition["children"],
  };
}

function buildBreak(node: slateInternal.Break): mdast.Break {
  const { type } = node;
  return {
    type,
  };
}

function buildLink(
  node: slateInternal.Link,
  overrides: OverridedSlateBuilders
): mdast.Link {
  const { type, url, title, children } = node;
  return {
    type,
    url,
    title,
    children: convertNodes(children, overrides) as mdast.Link["children"],
  };
}

function buildImage(node: slateInternal.Image): mdast.Image {
  const { type, url, title, alt } = node;
  return {
    type,
    url,
    title,
    alt,
  };
}

function buildLinkReference(
  node: slateInternal.LinkReference,
  overrides: OverridedSlateBuilders
): mdast.LinkReference {
  const { type, identifier, label, referenceType, children } = node;
  return {
    type,
    identifier,
    label,
    referenceType,
    children: convertNodes(
      children,
      overrides
    ) as mdast.LinkReference["children"],
  };
}

function buildImageReference(
  node: slateInternal.ImageReference
): mdast.ImageReference {
  const { type, identifier, label, alt, referenceType } = node;
  return {
    type,
    identifier,
    label,
    alt,
    referenceType,
  };
}

function buildFootnote(
  node: slateInternal.Footnote,
  overrides: OverridedSlateBuilders
): mdast.Footnote {
  const { type, children } = node;
  return {
    type,
    children: convertNodes(children, overrides) as mdast.Footnote["children"],
  };
}

function creatFootnoteReference(
  node: slateInternal.FootnoteReference
): mdast.FootnoteReference {
  const { type, identifier, label } = node;
  return {
    type,
    identifier,
    label,
  };
}

function buildMath(node: slateInternal.Math): mdast.Math {
  const { type, children } = node;
  return {
    type,
    value: children[0].text,
  };
}

function buildInlineMath(node: slateInternal.InlineMath): mdast.InlineMath {
  const { type, children } = node;
  return {
    type,
    value: children[0].text,
  };
}
