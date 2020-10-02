import { Node } from "unist";
import { Compiler } from "unified";
import * as slate from "slate";
import * as mdast from "./models/mdast";

const VOID_KEY = "void";

export default function plugin(this: { Compiler: Compiler }) {
  this.Compiler = (compiler as any) as Compiler;

  function compiler(node: Node) {
    return remarkToSlate((node as any) as mdast.Root);
  }
}

function remarkToSlate(root: mdast.Root): slate.Node[] {
  return convertMdastNodes(root.children);
}

function convertMdastNodes(nodes: mdast.Content[]): slate.Node[] {
  return nodes.reduce<slate.Node[]>((acc, node) => {
    const slateNode = createSlateNode(node);
    if (slateNode) {
      acc.push(slateNode);
    }
    return acc;
  }, []);

  function createSlateNode(node: mdast.Content): slate.Node | null {
    switch (node.type) {
      case "paragraph": {
        const { type, children } = node;
        return {
          type,
          children: convertMdastNodes(children),
        };
      }
      case "heading": {
        const { type, children, depth } = node;
        return {
          type,
          depth,
          children: convertMdastNodes(children),
        };
      }
      case "thematicBreak":
        return {
          type: node.type,
          [VOID_KEY]: true,
          children: [
            {
              text: "",
            },
          ],
        };
      case "blockquote": {
        return {
          type: node.type,
          children: convertMdastNodes(node.children),
        };
      }
      case "list": {
        const { type, children, ordered, start, spread } = node;
        return {
          type,
          children: convertMdastNodes(children),
          ordered,
          start,
          spread,
        };
      }
      case "listItem": {
        const { type, children, checked, spread } = node;
        return {
          type,
          children: convertMdastNodes(children),
          checked,
          spread,
        };
      }
      case "table": {
        const { type, children, align } = node;
        return {
          type,
          children: convertMdastNodes(children),
          align,
        };
      }
      case "tableRow": {
        const { type, children } = node;
        return {
          type,
          children: convertMdastNodes(children),
        };
      }
      case "tableCell": {
        const { type, children } = node;
        return {
          type,
          children: convertMdastNodes(children),
        };
      }
      case "html": {
        const { type, value } = node;
        return {
          type,
          children: [{ text: value }],
        };
      }
      case "code": {
        const { type, value, lang, meta } = node;
        return {
          text: value,
          [type]: true,
          lang,
          meta,
        };
      }
      case "yaml": {
        const { type, value } = node;
        return {
          type,
          children: [{ text: value }],
        };
      }
      case "definition": {
        const { type, identifier, label, url, title } = node;
        return {
          children: [{ text: "" }],
          identifier,
          label,
          url,
          title,
        };
      }
      // case "footnoteDefinition":
      case "text":
        return {
          text: node.value,
        };
      case "emphasis":
      case "strong":
      case "delete": {
        const { type, children } = node;
        return {
          [type]: true,
          children: convertMdastNodes(children),
        };
      }
      case "inlineCode": {
        const { type, value } = node;
        return {
          text: value,
          [type]: true,
        };
      }
      // case "break":
      // case "link":
      // case "image":
      // case "linkReference":
      // case "imageReference":
      // case "footnote":
      // case "footnoteReference":
      default: {
        return null;
      }
    }
  }
}

