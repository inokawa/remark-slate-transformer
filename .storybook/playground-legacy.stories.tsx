import React, { useMemo, useRef, useState } from "react";
import { Value } from "slate_legacy";
import unified from "unified";
import markdown from "remark-parse";
import gfm from "remark-gfm";
import frontmatter from "remark-frontmatter";
import stringify from "remark-stringify";
import { remarkToSlateLegacy, slateToRemarkLegacy } from "../src";
import SlateEditor from "./components/slate0.47-editor";
import TextEditor from "./components/text-editor";
import Text from "./components/text";
import text from "../fixture/article.md";

const toSlateProcessor = unified()
  .use(markdown)
  .use(gfm)
  .use(frontmatter)
  .use(remarkToSlateLegacy);
const toRemarkProcessor = unified()
  .use(slateToRemarkLegacy)
  .use(gfm)
  .use(frontmatter)
  .use(stringify);

const toSlate = (s: string) =>
  Value.fromJSON(toSlateProcessor.processSync(s).result);
const toMd = (value: Value) => {
  const mdast = toRemarkProcessor.runSync({
    type: "root",
    children: value.toJSON().document.nodes,
  });
  return toRemarkProcessor.stringify(mdast);
};

export default {
  title: "Playground/Slate ~0.47",
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

// export const MarkdownToSlate = () => {
//   const [value, setValue] = useState(toSlate(text));
//   const ref = useRef<HTMLTextAreaElement>(null);
//   return (
//     <Wrapper>
//       <TextEditor ref={ref} initialValue={text} />
//       <div style={{ padding: 10 }}>
//         <button
//           style={{ height: "100%" }}
//           onClick={() => {
//             if (!ref.current) return;
//             setValue(toSlate(ref.current.value));
//           }}
//         >
//           {"md -> slate"}
//         </button>
//       </div>
//       <SlateEditor ref={useRef(null)} initialValue={value} />
//     </Wrapper>
//   );
// };

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

// export const SlateToMarkdown = () => {
//   const [value, setValue] = useState(toSlate(text));
//   const [md, setMd] = useState(toMd(value));
//   const ref = useRef<Value>(null);
//   return (
//     <Wrapper>
//       <SlateEditor ref={ref} initialValue={value} />
//       <div style={{ padding: 10 }}>
//         <button
//           style={{ height: "100%" }}
//           onClick={() => {
//             if (!ref.current) return;
//             setMd(toMd(ref.current));
//           }}
//         >
//           {"slate -> md"}
//         </button>
//       </div>
//       <Text>{md}</Text>
//     </Wrapper>
//   );
// };
