import type { BlockJSON, InlineJSON, TextJSON } from "slate_legacy";
import type * as slate from "../models/slate";

export function slate047ToSlate(
  nodes: (BlockJSON | InlineJSON | TextJSON)[]
): slate.Node[] {
  return convertNodes(nodes);
}

function convertNodes(
  nodes: (BlockJSON | InlineJSON | TextJSON)[]
): slate.Node[] {
  return nodes.reduce<slate.Node[]>((acc, n) => {
    const node = convert(n as BlockJSON);
    if (node) {
      acc.push(node);
    }
    return acc;
  }, []);
}

function convert(node: BlockJSON | InlineJSON | TextJSON): slate.Node | null {
  switch (node.object) {
    case "block": {
      const { type, nodes, data } = node;
      return {
        type,
        children: convertNodes(nodes as BlockJSON[]),
        ...data,
      };
    }
    case "inline": {
      const { type, nodes, data } = node;
      return {
        type,
        children: convertNodes(nodes as InlineJSON[]),
        ...data,
      };
    }
    case "text": {
      const { text = "", marks } = node;
      return {
        text,
        ...marks?.reduce((acc, m) => {
          acc[m.type] = true;
          return acc;
        }, {} as { [key: string]: true }),
      };
    }
    default:
      break;
  }
  return null;
}
