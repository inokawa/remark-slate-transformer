import React, { useMemo, useRef, useState } from "react";
import { Node } from "slate";
import unified from "unified";
import markdown from "remark-parse";
import gfm from "remark-gfm";
import frontmatter from "remark-frontmatter";
import stringify from "remark-stringify";
import { remarkToSlate, slateToRemark } from "../src";
import SlateEditor from "./components/slate-editor";
import TextEditor from "./components/text-editor";
import Text from "./components/text";
import text from "../fixtures/article.md";

const toSlateProcessor = unified()
  .use(markdown)
  .use(gfm)
  .use(frontmatter)
  .use(remarkToSlate);
const toRemarkProcessor = unified()
  .use(slateToRemark)
  .use(gfm)
  .use(frontmatter)
  .use(stringify);

const toSlate = (s: string) => toSlateProcessor.processSync(s).result as Node[];
const toMd = (value: Node[]) => {
  const mdast = toRemarkProcessor.runSync({
    type: "root",
    children: value,
  });
  return toRemarkProcessor.stringify(mdast);
};

export default {
  title: "Playground/Slate 0.50+",
};

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <div
    style={useMemo(
      () => ({
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "row",
        fontSize: "10.5pt",
      }),
      []
    )}
  >
    {children}
  </div>
);

export const MarkdownToSlate = () => {
  const [value, setValue] = useState(toSlate(text));
  const ref = useRef<HTMLTextAreaElement>(null);
  return (
    <Wrapper>
      <TextEditor ref={ref} initialValue={text} />
      <div style={{ padding: 10 }}>
        <button
          style={{ height: "100%" }}
          onClick={() => {
            if (!ref.current) return;
            setValue(toSlate(ref.current.value));
          }}
        >
          {"md -> slate"}
        </button>
      </div>
      <SlateEditor ref={useRef(null)} initialValue={value} />
    </Wrapper>
  );
};

export const MarkdownToSlateJson = () => {
  const [value, setValue] = useState(toSlate(text));
  const ref = useRef<HTMLTextAreaElement>(null);
  return (
    <Wrapper>
      <TextEditor ref={ref} initialValue={text} />
      <div style={{ padding: 10 }}>
        <button
          style={{ height: "100%" }}
          onClick={() => {
            if (!ref.current) return;
            setValue(toSlate(ref.current.value));
          }}
        >
          {"md -> slate"}
        </button>
      </div>
      <Text>{JSON.stringify(value, null, 2)}</Text>
    </Wrapper>
  );
};

export const SlateToMarkdown = () => {
  const [value, setValue] = useState(toSlate(text));
  const [md, setMd] = useState(toMd(value));
  const ref = useRef<Node[]>(null);
  return (
    <Wrapper>
      <SlateEditor ref={ref} initialValue={value} />
      <div style={{ padding: 10 }}>
        <button
          style={{ height: "100%" }}
          onClick={() => {
            if (!ref.current) return;
            setMd(toMd(ref.current));
          }}
        >
          {"slate -> md"}
        </button>
      </div>
      <Text>{md}</Text>
    </Wrapper>
  );
};
