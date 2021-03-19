import * as slateLib from "slate";
import * as unistLib from "unist";
import * as mdast from "../models/mdast";
import * as slate from "./mdast-to-slate";

type DecorationType = keyof slate.Decoration;

type TextOrDecoration =
  | mdast.Text
  | mdast.Emphasis
  | mdast.Strong
  | mdast.Delete
  | mdast.InlineCode;

export function slateToMdast(node: slateLib.Node): unistLib.Node {
  return createMdastRoot(node);
}

function createMdastRoot(node: slateLib.Node): unistLib.Node {
  const root: mdast.Root = {
    type: "root",
    children: convertNodes((node as any).children) as mdast.Root["children"],
  };
  return (root as any) as unistLib.Node;
}

function convertNodes(nodes: slateLib.Node[]): unistLib.Node[] {
  const mdastNodes: unistLib.Node[] = [];
  let textQueue: slate.Text[] = [];
  for (let i = 0; i <= nodes.length; i++) {
    const n = nodes[i] as slate.SlateNode;
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
      const node = createMdastNode(n);
      if (node) {
        mdastNodes.push(node as unistLib.Node);
      }
    }
  }

  return mdastNodes;
}

function createMdastNode(
  node: Exclude<slate.SlateNode, slate.Text>
): Exclude<mdast.Content, TextOrDecoration> | null {
  switch (node.type) {
    case "paragraph":
      return createParagraph(node);
    case "heading":
      return createHeading(node);
    case "thematicBreak":
      return createThematicBreak(node);
    case "blockquote":
      return createBlockquote(node);
    case "list":
      return createList(node);
    case "listItem":
      return createListItem(node);
    case "table":
      return createTable(node);
    case "tableRow":
      return createTableRow(node);
    case "tableCell":
      return createTableCell(node);
    case "html":
      return createHtml(node);
    case "code":
      return createCode(node);
    case "yaml":
      return createYaml(node);
    case "toml":
      return createToml(node);
    case "definition":
      return createDefinition(node);
    case "footnoteDefinition":
      return createFootnoteDefinition(node);
    case "break":
      return createBreak(node);
    case "link":
      return createLink(node);
    case "image":
      return createImage(node);
    case "linkReference":
      return createLinkReference(node);
    case "imageReference":
      return createImageReference(node);
    case "footnote":
      return createFootnote(node);
    case "footnoteReference":
      return creatFootnoteReference(node);
    case "math":
      return createMath(node);
    case "inlineMath":
      return createInlineMath(node);
    default:
      break;
  }
  return null;
}

function isText(node: slate.SlateNode): node is slate.Text {
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

function createParagraph(node: slate.Paragraph): mdast.Paragraph {
  const { type, children } = node;
  return {
    type,
    children: (convertNodes(children) as any) as mdast.Paragraph["children"],
  };
}

function createHeading(node: slate.Heading): mdast.Heading {
  const { type, depth, children } = node;
  return {
    type,
    depth,
    children: (convertNodes(children) as any) as mdast.Heading["children"],
  };
}

function createThematicBreak(node: slate.ThematicBreak): mdast.ThematicBreak {
  const { type } = node;
  return {
    type,
  };
}

function createBlockquote(node: slate.Blockquote): mdast.Blockquote {
  const { type, children } = node;
  return {
    type,
    children: (convertNodes(children) as any) as mdast.Blockquote["children"],
  };
}

function createList(node: slate.List): mdast.List {
  const { type, ordered, start, spread, children } = node;
  return {
    type,
    ordered,
    start,
    spread,
    children: (convertNodes(children) as any) as mdast.List["children"],
  };
}

function createListItem(node: slate.ListItem): mdast.ListItem {
  const { type, checked, spread, children } = node;
  return {
    type,
    checked,
    spread,
    children: (convertNodes(children) as any) as mdast.ListItem["children"],
  };
}

function createTable(node: slate.Table): mdast.Table {
  const { type, align, children } = node;
  return {
    type,
    align,
    children: (convertNodes(children) as any) as mdast.Table["children"],
  };
}

function createTableRow(node: slate.TableRow): mdast.TableRow {
  const { type, children } = node;
  return {
    type,
    children: (convertNodes(children) as any) as mdast.TableRow["children"],
  };
}

function createTableCell(node: slate.TableCell): mdast.TableCell {
  const { type, children } = node;
  return {
    type,
    children: (convertNodes(children) as any) as mdast.TableCell["children"],
  };
}

function createHtml(node: slate.Html): mdast.HTML {
  const { type, children } = node;
  return {
    type,
    value: children[0].text,
  };
}

function createCode(node: slate.Code): mdast.Code {
  const { type, lang, meta, children } = node;
  return {
    type,
    lang,
    meta,
    value: children[0].text,
  };
}

function createYaml(node: slate.Yaml): mdast.YAML {
  const { type, children } = node;
  return {
    type,
    value: children[0].text,
  };
}

function createToml(node: slate.Toml): mdast.TOML {
  const { type, children } = node;
  return {
    type,
    value: children[0].text,
  };
}

function createDefinition(node: slate.Definition): mdast.Definition {
  const { type, identifier, label, url, title } = node;
  return {
    type,
    identifier,
    label,
    url,
    title,
  };
}

function createFootnoteDefinition(
  node: slate.FootnoteDefinition
): mdast.FootnoteDefinition {
  const { type, identifier, label, children } = node;
  return {
    type,
    identifier,
    label,
    children: (convertNodes(
      children
    ) as any) as mdast.FootnoteDefinition["children"],
  };
}

function createBreak(node: slate.Break): mdast.Break {
  const { type } = node;
  return {
    type,
  };
}

function createLink(node: slate.Link): mdast.Link {
  const { type, url, title, children } = node;
  return {
    type,
    url,
    title,
    children: (convertNodes(children) as any) as mdast.Link["children"],
  };
}

function createImage(node: slate.Image): mdast.Image {
  const { type, url, title, alt } = node;
  return {
    type,
    url,
    title,
    alt,
  };
}

function createLinkReference(node: slate.LinkReference): mdast.LinkReference {
  const { type, identifier, label, referenceType, children } = node;
  return {
    type,
    identifier,
    label,
    referenceType,
    children: (convertNodes(
      children
    ) as any) as mdast.LinkReference["children"],
  };
}

function createImageReference(
  node: slate.ImageReference
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

function createFootnote(node: slate.Footnote): mdast.Footnote {
  const { type, children } = node;
  return {
    type,
    children: (convertNodes(children) as any) as mdast.Footnote["children"],
  };
}

function creatFootnoteReference(
  node: slate.FootnoteReference
): mdast.FootnoteReference {
  const { type, identifier, label } = node;
  return {
    type,
    identifier,
    label,
  };
}

function createMath(node: slate.Math): mdast.Math {
  const { type, children } = node;
  return {
    type,
    value: children[0].text,
  };
}

function createInlineMath(node: slate.InlineMath): mdast.InlineMath {
  const { type, children } = node;
  return {
    type,
    value: children[0].text,
  };
}
