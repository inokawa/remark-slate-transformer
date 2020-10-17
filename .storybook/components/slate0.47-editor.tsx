import React, {
  forwardRef,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { Value } from "slate_legacy";
import {
  Editor,
  OnChangeParam,
  RenderBlockProps,
  RenderInlineProps,
  RenderMarkProps,
} from "slate-react_legacy";
import "github-markdown-css";

const style: React.CSSProperties = {
  flex: 1,
  margin: 10,
  overflowY: "scroll",
};

type Props = {
  initialValue: Value;
};

export default forwardRef(
  ({ initialValue }: Props, ref: React.MutableRefObject<Value>) => {
    const [value, setValue] = useState<Value>(initialValue);
    ref.current = value;
    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    const onChange = useCallback(({ value }: OnChangeParam) => {
      setValue(value);
    }, []);

    const renderBlock = useCallback(
      (
        { node, children, attributes }: RenderBlockProps,
        editor: Editor,
        next: () => any
      ) => {
        switch (node.type) {
          case "paragraph":
            return <p {...attributes}>{children}</p>;
          case "heading": {
            switch (node.data.get("depth")) {
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
            if (node.data.get("ordered")) {
              return <ol {...attributes}>{children}</ol>;
            } else {
              return <ul {...attributes}>{children}</ul>;
            }
          case "listItem":
            return (
              <li {...attributes}>
                {node.data.get("checked") === true ? (
                  <input type="checkbox" readOnly checked />
                ) : node.data.get("checked") === false ? (
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
              <pre>
                <code {...attributes}>{children}</code>
              </pre>
            );
          case "code":
            // TODO lang meta
            return (
              <pre>
                <code {...attributes}>{children}</code>
              </pre>
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
            break;
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
      },
      []
    );

    const renderInline = useCallback(
      (
        { node, children, attributes }: RenderInlineProps,
        editor: Editor,
        next: () => any
      ) => {
        switch (node.type) {
          case "link":
            return (
              <a
                {...attributes}
                href={node.data.get("url") as string}
                title={node.data.get("title") as string}
              >
                {children}
              </a>
            );
          case "image":
            return (
              <>
                <img
                  {...attributes}
                  src={node.data.get("url") as string}
                  title={node.data.get("title") as string}
                  alt={node.data.get("alt") as string}
                />
                {children}
              </>
            );
          default:
            break;
        }
        return <p {...attributes}>{children}</p>;
      },
      []
    );

    const renderMark = useCallback(
      (
        { mark, children }: RenderMarkProps,
        editor: Editor,
        next: () => any
      ) => {
        switch (mark.type) {
          case "strong":
            return <strong>{children}</strong>;
          case "emphasis":
            return <em>{children}</em>;
          case "delete":
            return <del>{children}</del>;
          case "inlineCode":
            return <code>{children}</code>;
          default:
            return next();
        }
      },
      []
    );

    return (
      <div className="markdown-body" style={style}>
        <Editor
          value={value}
          onChange={onChange}
          renderBlock={renderBlock}
          renderInline={renderInline}
          renderMark={renderMark}
        />
      </div>
    );
  }
);
