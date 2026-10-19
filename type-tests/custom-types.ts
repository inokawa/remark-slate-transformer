import { unified } from "unified";
import markdown from "remark-parse";
import { createEditor, type BaseEditor, type Element } from "slate";
import {
  remarkToSlate,
  slateToRemark,
  withMdast,
  type MdastElement,
  type MdastText,
} from "../src";

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor;
    Element: MdastElement;
    Text: MdastText;
  }
}

const editor = withMdast(createEditor());
editor.children = unified()
  .use(markdown)
  .use(remarkToSlate)
  .processSync("# a").result;

const describe = (element: Element): string => {
  switch (element.type) {
    case "heading":
      return `h${element.depth}`;
    case "link":
      return element.url;
    default:
      return element.type;
  }
};
editor.children.forEach((node) => {
  if (!("text" in node)) describe(node);
});

const bold: MdastText = { text: "a", strong: true };
slateToRemark([{ type: "paragraph", children: [bold] }], {
  overrides: {
    heading: (node, next) => ({
      type: "heading",
      depth: node.depth,
      children: next(node.children),
    }),
  },
});
