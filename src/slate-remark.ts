import * as slate from "slate";
import * as mdast from "./models/mdast";
import { Node as UnistNode } from "unist";
import { Decoration, SlateNode, SlateText } from "./remark-slate";

type DecorationType = keyof Decoration;

type TextOrDecoration =
  | mdast.Text
  | mdast.Emphasis
  | mdast.Strong
  | mdast.Delete
  | mdast.InlineCode;

export function slateToRemark(node: any): UnistNode {
  return createMdastRoot(node as slate.Node);
}

function createMdastRoot(node: slate.Node): UnistNode {
  const root: mdast.Root = {
    type: "root",
    children: convertNodes((node as any).children) as mdast.Root["children"],
  };
  return (root as any) as UnistNode;
}

function convertNodes(nodes: slate.Node[]): UnistNode[] {
  const mdastNodes: UnistNode[] = [];
  let textQueue: SlateText[] = [];
  for (let i = 0; i <= nodes.length; i++) {
    const n = nodes[i] as SlateNode;
    if (n && isText(n)) {
      textQueue.push(n);
    } else {
      const mdastTexts: TextOrDecoration[] = [];
      const starts: DecorationType[] = [];
      let textTemp: string = "";
      for (let j = 0; j < textQueue.length; j++) {
        const cur = textQueue[j];
        textTemp += cur.text;

        const prev = textQueue[j - 1];
        const next = textQueue[j + 1];
        const ends: DecorationType[] = [];
        if (cur.inlineCode) {
          if (!prev || !prev.inlineCode) {
            starts.push("inlineCode");
          }
          if (!next || !next.inlineCode) {
            ends.push("inlineCode");
          }
        }
        if (cur.emphasis) {
          if (!prev || !prev.emphasis) {
            starts.push("emphasis");
          }
          if (!next || !next.emphasis) {
            ends.push("emphasis");
          }
        }
        if (cur.strong) {
          if (!prev || !prev.strong) {
            starts.push("strong");
          }
          if (!next || !next.strong) {
            ends.push("strong");
          }
        }
        if (cur.delete) {
          if (!prev || !prev.delete) {
            starts.push("delete");
          }
          if (!next || !next.delete) {
            ends.push("delete");
          }
        }
        if (starts.length > 0) {
          let res: TextOrDecoration = {
            type: "text",
            value: textTemp,
          };
          textTemp = "";
          const startsReversed = starts.slice().reverse();
          startsReversed.forEach((k) => {
            if (k === "inlineCode") {
              res = {
                type: k,
                value: (res as any).value,
              };
            } else {
              res = {
                type: k,
                children: [res],
              };
            }
          });
          mdastTexts.push(res);
        }

        if (starts.length > 0 && ends.length > 0) {
          const endsToRemove = starts.reduce<
            { key: DecorationType; index: number }[]
          >((acc, k, kIndex) => {
            if (ends.includes(k)) {
              acc.push({ key: k, index: kIndex });
            }
            return acc;
          }, []);

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

      mdastNodes.push(...((mergeTexts(mdastTexts) as any) as UnistNode[]));
      textQueue = [];
      if (!n) continue;
      const node = createMdastNode(n as SlateNode);
      if (node) {
        mdastNodes.push(node);
      }
    }
  }

  return mdastNodes;
}

function createMdastNode(node: SlateNode): UnistNode | null {
  if (isText(node)) {
    let res: TextOrDecoration = {
      type: "text",
      value: node.text,
    };
    if (node.inlineCode) {
      res = {
        type: "inlineCode",
        value: res.value,
      };
    }
    if (node.emphasis) {
      res = {
        type: "emphasis",
        children: [res],
      };
    }
    if (node.strong) {
      res = {
        type: "strong",
        children: [res],
      };
    }
    if (node.delete) {
      res = {
        type: "delete",
        children: [res],
      };
    }
    return (res as any) as UnistNode;
  }

  switch (node.type) {
    case "paragraph": {
      const { type, children } = node;
      const res: mdast.Paragraph = {
        type,
        children: (convertNodes(
          children
        ) as any) as mdast.Paragraph["children"],
      };
      return (res as any) as UnistNode;
    }
    case "heading": {
      const { type, depth, children } = node;
      const res: mdast.Heading = {
        type,
        depth,
        children: (convertNodes(children) as any) as mdast.Heading["children"],
      };
      return (res as any) as UnistNode;
    }
    case "thematicBreak": {
      const { type } = node;
      const res: mdast.ThematicBreak = {
        type,
      };
      return (res as any) as UnistNode;
    }
    case "blockquote": {
      const { type, children } = node;
      const res: mdast.Blockquote = {
        type,
        children: (convertNodes(
          children
        ) as any) as mdast.Blockquote["children"],
      };
      return (res as any) as UnistNode;
    }
    case "list": {
      const { type, ordered, start, spread, children } = node;
      const res: mdast.List = {
        type,
        ordered,
        start,
        spread,
        children: (convertNodes(children) as any) as mdast.List["children"],
      };
      return (res as any) as UnistNode;
    }
    case "listItem": {
      const { type, checked, spread, children } = node;
      const res: mdast.ListItem = {
        type,
        checked,
        spread,
        children: (convertNodes(children) as any) as mdast.ListItem["children"],
      };
      return (res as any) as UnistNode;
    }
    case "table": {
      const { type, align, children } = node;
      const res: mdast.Table = {
        type,
        align,
        children: (convertNodes(children) as any) as mdast.Table["children"],
      };
      return (res as any) as UnistNode;
    }
    case "tableRow": {
      const { type, children } = node;
      const res: mdast.TableRow = {
        type,
        children: (convertNodes(children) as any) as mdast.TableRow["children"],
      };
      return (res as any) as UnistNode;
    }
    case "tableCell": {
      const { type, children } = node;
      const res: mdast.TableCell = {
        type,
        children: (convertNodes(
          children
        ) as any) as mdast.TableCell["children"],
      };
      return (res as any) as UnistNode;
    }
    case "html": {
      const { type, children } = node;
      const res: mdast.HTML = {
        type,
        value: children[0].text,
      };
      return (res as any) as UnistNode;
    }
    case "code": {
      const { type, lang, meta, children } = node;
      const res: mdast.Code = {
        type,
        lang,
        meta,
        value: children[0].text,
      };
      return (res as any) as UnistNode;
    }
    case "yaml": {
      const { type, children } = node;
      const res: mdast.YAML = {
        type,
        value: children[0].text,
      };
      return (res as any) as UnistNode;
    }
    case "definition": {
      const { type, identifier, label, url, title } = node;
      const res: mdast.Definition = {
        type,
        identifier,
        label,
        url,
        title,
      };
      return (res as any) as UnistNode;
    }
    case "footnoteDefinition": {
      const { type, identifier, label, children } = node;
      const res: mdast.FootnoteDefinition = {
        type,
        identifier,
        label,
        children: (convertNodes(
          children
        ) as any) as mdast.FootnoteDefinition["children"],
      };
      return (res as any) as UnistNode;
    }
    case "break": {
      const { type } = node;
      const res: mdast.Break = {
        type,
      };
      return (res as any) as UnistNode;
    }
    case "link": {
      const { type, url, title, children } = node;
      const res: mdast.Link = {
        type,
        url,
        title,
        children: (convertNodes(children) as any) as mdast.Link["children"],
      };
      return (res as any) as UnistNode;
    }
    case "image": {
      const { type, url, title, alt } = node;
      const res: mdast.Image = {
        type,
        url,
        title,
        alt,
      };
      return (res as any) as UnistNode;
    }
    case "linkReference": {
      const { type, identifier, label, referenceType, children } = node;
      const res: mdast.LinkReference = {
        type,
        identifier,
        label,
        referenceType,
        children: (convertNodes(
          children
        ) as any) as mdast.LinkReference["children"],
      };
      return (res as any) as UnistNode;
    }
    case "imageReference": {
      const { type, identifier, label, alt, referenceType } = node;
      const res: mdast.ImageReference = {
        type,
        identifier,
        label,
        alt,
        referenceType,
      };
      return (res as any) as UnistNode;
    }
    case "footnote": {
      const { type, children } = node;
      const res: mdast.Footnote = {
        type,
        children: (convertNodes(children) as any) as mdast.Footnote["children"],
      };
      return (res as any) as UnistNode;
    }
    case "footnoteReference": {
      const { type, identifier, label } = node;
      const res: mdast.FootnoteReference = {
        type,
        identifier,
        label,
      };
      return (res as any) as UnistNode;
    }
    default:
      break;
  }
  return null;
}

function isText(node: SlateNode): node is SlateText {
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
