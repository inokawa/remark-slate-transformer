import React, { useMemo, useRef, useState } from "react";
import unified from "unified";
import markdown from "remark-parse";
import { remarkToSlate } from "../src";
import SlateEditor from "./slate-editor";
import TextEditor from "./text-editor";
import Text from "./text";
import text from "../fixture/article.md";

const processor = unified()
  .use(markdown, { commonmark: true })
  .use(remarkToSlate as any);

export default {
  title: "playground",
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

export const Editor = () => {
  const [value, setValue] = useState(processor.processSync(text).result as any);
  const ref = useRef<HTMLTextAreaElement>(null);
  return (
    <Wrapper>
      <TextEditor ref={ref} initialValue={text} />
      <div style={{ padding: 10 }}>
        <button
          style={{ height: "100%" }}
          onClick={() => {
            if (!ref.current) return;
            setValue(processor.processSync(ref.current.value).result as any);
          }}
        >
          {"md -> slate"}
        </button>
      </div>
      <SlateEditor initialValue={value} />
    </Wrapper>
  );
};

export const Json = () => {
  const [value, setValue] = useState(processor.processSync(text).result as any);
  const ref = useRef<HTMLTextAreaElement>(null);
  return (
    <Wrapper>
      <TextEditor ref={ref} initialValue={text} />
      <div style={{ padding: 10 }}>
        <button
          style={{ height: "100%" }}
          onClick={() => {
            if (!ref.current) return;
            setValue(processor.processSync(ref.current.value).result as any);
          }}
        >
          {"md -> slate"}
        </button>
      </div>
      <Text>{JSON.stringify(value, null, 2)}</Text>
    </Wrapper>
  );
};
