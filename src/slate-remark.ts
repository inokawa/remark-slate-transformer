import * as slate from "slate";
import * as mdast from "./models/mdast";
import { Node } from "unist";
import { SlateNode } from "./remark-slate";

export default function plugin() {
  // @ts-ignore
  this.Parser = parser;

  function parser(nodes: slate.Node[]): Node {
    return createMdastRoot(nodes);
  }
}

function createMdastRoot(nodes: slate.Node[]): Node {
  const root: mdast.Root = {
    type: "root",
    children: convertNodes(nodes) as mdast.Root["children"],
  };
  return (root as any) as Node;
}

function convertNodes(nodes: slate.Node[]): Node[] {
  return nodes.reduce<Node[]>((acc, n) => {
    const node = createMdastNode(n as SlateNode);
    if (node) {
      acc.push(node);
    }
    return acc;
  }, []);
}

function createMdastNode(node: SlateNode): Node | null {
  switch (node.type) {
    case "paragraph": {
      const { type, children } = node;
      const res: mdast.Paragraph = {
        type,
        children: (convertNodes(
          children
        ) as any) as mdast.Paragraph["children"],
      };
      return (res as any) as Node;
    }
    case "heading": {
      const { type, depth, children } = node;
      const res: mdast.Heading = {
        type,
        depth,
        children: (convertNodes(children) as any) as mdast.Heading["children"],
      };
      return (res as any) as Node;
    }
    case "thematicBreak": {
      const { type } = node;
      const res: mdast.ThematicBreak = {
        type,
      };
      return (res as any) as Node;
    }
    case "blockquote": {
      const { type, children } = node;
      const res: mdast.Blockquote = {
        type,
        children: (convertNodes(
          children
        ) as any) as mdast.Blockquote["children"],
      };
      return (res as any) as Node;
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
      return (res as any) as Node;
    }
    case "listItem": {
      const { type, checked, spread, children } = node;
      const res: mdast.ListItem = {
        type,
        checked,
        spread,
        children: (convertNodes(children) as any) as mdast.ListItem["children"],
      };
      return (res as any) as Node;
    }
    case "table": {
      const { type, align, children } = node;
      const res: mdast.Table = {
        type,
        align,
        children: (convertNodes(children) as any) as mdast.Table["children"],
      };
      return (res as any) as Node;
    }
    case "tableRow": {
      const { type, children } = node;
      const res: mdast.TableRow = {
        type,
        children: (convertNodes(children) as any) as mdast.TableRow["children"],
      };
      return (res as any) as Node;
    }
    case "tableCell": {
      const { type, children } = node;
      const res: mdast.TableCell = {
        type,
        children: (convertNodes(
          children
        ) as any) as mdast.TableCell["children"],
      };
      return (res as any) as Node;
    }
    case "html": {
      const { type, children } = node;
      const res: mdast.HTML = {
        type,
        value: children[0].text,
      };
      return (res as any) as Node;
    }
    case "code": {
      const { type, lang, meta, children } = node;
      const res: mdast.Code = {
        type,
        lang,
        meta,
        value: children[0].text,
      };
      return (res as any) as Node;
    }
    case "yaml": {
      const { type, children } = node;
      const res: mdast.YAML = {
        type,
        value: children[0].text,
      };
      return (res as any) as Node;
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
      return (res as any) as Node;
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
      return (res as any) as Node;
    }
    // case "text":
    case "emphasis": {
      const { type, children } = node;
      const res: mdast.Emphasis = {
        type,
        children: (convertNodes(children) as any) as mdast.Emphasis["children"],
      };
      return (res as any) as Node;
    }
    case "strong": {
      const { type, children } = node;
      const res: mdast.Strong = {
        type,
        children: (convertNodes(children) as any) as mdast.Strong["children"],
      };
      return (res as any) as Node;
    }
    case "delete": {
      const { type, children } = node;
      const res: mdast.Delete = {
        type,
        children: (convertNodes(children) as any) as mdast.Delete["children"],
      };
      return (res as any) as Node;
    }
    case "inlineCode": {
      const { type, children } = node;
      const res: mdast.InlineCode = {
        type,
        value: children[0].text,
      };
      return (res as any) as Node;
    }
    case "break": {
      const { type } = node;
      const res: mdast.Break = {
        type,
      };
      return (res as any) as Node;
    }
    case "link": {
      const { type, url, title, children } = node;
      const res: mdast.Link = {
        type,
        url,
        title,
        children: (convertNodes(children) as any) as mdast.Link["children"],
      };
      return (res as any) as Node;
    }
    case "image": {
      const { type, url, title, alt } = node;
      const res: mdast.Image = {
        type,
        url,
        title,
        alt,
      };
      return (res as any) as Node;
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
      return (res as any) as Node;
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
      return (res as any) as Node;
    }
    case "footnote": {
      const { type, children } = node;
      const res: mdast.Footnote = {
        type,
        children: (convertNodes(children) as any) as mdast.Footnote["children"],
      };
      return (res as any) as Node;
    }
    case "footnoteReference": {
      const { type, identifier, label } = node;
      const res: mdast.FootnoteReference = {
        type,
        identifier,
        label,
      };
      return (res as any) as Node;
    }
    default:
      break;
  }
  if (!!node.text) {
    const res: mdast.Text = {
      type: "text",
      value: node.text,
    };
    return (res as any) as Node;
  }
  return null;
}
