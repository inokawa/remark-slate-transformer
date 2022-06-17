import type {
  ValueJSON,
  BlockJSON,
  InlineJSON,
  TextJSON,
  MarkJSON,
} from "slate_legacy";
import type { Decoration, SlateNode } from "./mdast-to-slate";

export function slateToSlate047(nodes: SlateNode[]): ValueJSON {
  return {
    object: "value",
    document: {
      object: "document",
      nodes: convertNodes(nodes),
    },
  };
}

function convertNodes(
  nodes: SlateNode[]
): (BlockJSON | InlineJSON | TextJSON)[] {
  return nodes.reduce<(BlockJSON | InlineJSON | TextJSON)[]>((acc, n) => {
    const node = convert(n as SlateNode);
    if (node) {
      acc.push(node);
    }
    return acc;
  }, []);
}

function convert(node: SlateNode): BlockJSON | InlineJSON | TextJSON | null {
  if ("text" in node) {
    const { text, ...rest } = node;
    const marks: MarkJSON[] = Object.keys(rest).reduce<
      { object: "mark"; type: string }[]
    >((acc, type) => {
      if (!rest[type as keyof Decoration]) return acc;
      acc.push({
        object: "mark",
        type,
      });
      return acc;
    }, []);
    const res: TextJSON = {
      object: "text",
      text,
      marks,
    };
    return res;
  }
  switch (node.type) {
    case "paragraph":
    case "heading":
    case "blockquote":
    case "list":
    case "listItem":
    case "table":
    case "tableRow":
    case "tableCell":
    case "html":
    case "code":
    case "yaml":
    case "toml":
    case "thematicBreak":
    case "definition":
    case "break":
    case "math": {
      const { type, children, ...rest } = node;
      const res: BlockJSON = {
        object: "block",
        type,
        nodes: convertNodes(children as SlateNode[]),
        data: {
          ...rest,
        },
      };
      return res;
    }
    case "footnoteDefinition":
    case "link":
    case "linkReference":
    case "image":
    case "imageReference":
    case "footnote":
    case "footnoteReference":
    case "inlineMath": {
      const { type, children, ...rest } = node;
      const res: InlineJSON = {
        object: "inline",
        type,
        nodes: convertNodes(children as SlateNode[]) as InlineJSON[],
        data: {
          ...rest,
        },
      };
      return res;
    }
    default:
      break;
  }
  return null;
}
