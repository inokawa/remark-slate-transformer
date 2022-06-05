import React, { forwardRef, useEffect, useMemo, useState } from "react";
import { createEditor, Node } from "slate";
import {
  Slate,
  Editable,
  withReact,
  RenderElementProps,
  RenderLeafProps,
} from "slate-react";
import { withHistory } from "slate-history";
import "github-markdown-css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";

const style: React.CSSProperties = {
  flex: 1,
  margin: 10,
  overflowY: "scroll",
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
      return (
        <div
          {...attributes}
          dangerouslySetInnerHTML={{
            __html: element.children[0].text as string,
          }}
        />
      );
    case "code":
      return (
        <SyntaxHighlighter
          {...attributes}
          style={dark}
          language={element.lang as string}
        >
          {element.children[0].text}
        </SyntaxHighlighter>
      );
    case "yaml":
    case "toml":
      return (
        <pre>
          <code {...attributes}>{children}</code>
        </pre>
      );
    case "definition":
      break;
    case "footnoteDefinition":
      break;
    case "break":
      return <br />;
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
        <>
          <img
            {...attributes}
            src={element.url as string}
            title={element.title as string}
            alt={element.alt as string}
          />
          {children}
        </>
      );
    case "linkReference":
      break;
    case "imageReference":
      break;
    case "footnote":
      break;
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
  return <span {...attributes}>{children}</span>;
};

export default forwardRef<Node[], Props>(({ initialValue }, ref) => {
  const editor = useState(() => {
    const e = withHistory(withReact(createEditor()));
    e.isInline = (element) => {
      const { type } = element;
      return type === "link" || type === "image";
    };
    e.isVoid = (element) => {
      return element.type === "image";
    };
    return e;
  })[0];

  const [value, setValue] = useState<Node[]>(initialValue);
  ref.current = value;

  // Hack to update value externally
  const [key, setKey] = useState(0);
  useEffect(() => {
    setValue(initialValue);
    setKey((p) => p + 1);
  }, [initialValue]);

  return (
    <div className="markdown-body" style={style}>
      <Slate key={key} editor={editor} value={value} onChange={setValue}>
        <Editable renderElement={renderElement} renderLeaf={renderLeaf} />
      </Slate>
    </div>
  );
});
