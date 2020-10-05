import React, { useCallback, useMemo, useState } from "react";
import { createEditor, Node } from "slate";
import {
  Slate,
  Editable,
  withReact,
  RenderElementProps,
  RenderLeafProps,
} from "slate-react";

const style: React.CSSProperties = {
  width: "100vw",
  height: "100vh",
  padding: 10,
};

type Props = {
  initialValue: Node[];
};

const renderElement = ({
  attributes,
  children,
  element,
}: RenderElementProps) => {
  switch (element.type) {
    case "paragraph":
      return <p {...attributes}>{children}</p>;
    case "heading": {
      switch (element.depth) {
        case 1:
          return <h1 {...attributes}>{children}</h1>;
        case 2:
          return <h2 {...attributes}>{children}</h2>;
        case 3:
          return <h3 {...attributes}>{children}</h3>;
        case 4:
          return <h4 {...attributes}>{children}</h4>;
        case 5:
          return <h5 {...attributes}>{children}</h5>;
        case 6:
          return <h6 {...attributes}>{children}</h6>;
        default:
          break;
      }
      break;
    }
    case "thematicBreak":
      return <hr />;
    case "blockquote":
      return <blockquote {...attributes}>{children}</blockquote>;
    case "list":
      if (element.ordered) {
        return <ol {...attributes}>{children}</ol>;
      } else {
        return <ul {...attributes}>{children}</ul>;
      }
    case "listItem":
      return (
        <li {...attributes}>
          {element.checked === true ? (
            <input type="checkbox" readOnly checked />
          ) : element.checked === false ? (
            <input type="checkbox" readOnly />
          ) : null}
          {children}
        </li>
      );
    case "table":
      return (
        <table>
          <tbody {...attributes}>{children}</tbody>
        </table>
      );
    case "tableRow":
      return <tr {...attributes}>{children}</tr>;
    case "tableCell":
      return <td {...attributes}>{children}</td>;
    case "html":
      break;
    case "yaml":
      break;
    case "definition":
    case "footnoteDefinition":
    case "break":
      break;
    case "link":
      return (
        <a
          {...attributes}
          href={element.url as string}
          title={element.title as string}
        >
          {children}
        </a>
      );
    case "image":
      return (
        <img
          {...attributes}
          src={element.url as string}
          title={element.title as string}
          alt={element.alt as string}
        />
      );
    case "linkReference":
    case "imageReference":
    case "footnote":
    case "footnoteReference":
      break;
    default:
      break;
  }
  return <p {...attributes}>{children}</p>;
};

const renderLeaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.strong) {
    children = <strong>{children}</strong>;
  }
  if (leaf.emphasis) {
    children = <em>{children}</em>;
  }
  if (leaf.delete) {
    children = <del>{children}</del>;
  }
  if (leaf.inlineCode) {
    children = <code>{children}</code>;
  }
  if (leaf.code) {
    // TODO lang meta
    children = (
      <pre>
        <code {...attributes}>{children}</code>
      </pre>
    );
  }
  return <span {...attributes}>{children}</span>;
};

export default ({ initialValue }: Props) => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState<Node[]>(initialValue);

  return (
    <div style={style}>
      <Slate editor={editor} value={value} onChange={setValue}>
        <Editable renderElement={renderElement} renderLeaf={renderLeaf} />
      </Slate>
    </div>
  );
};
