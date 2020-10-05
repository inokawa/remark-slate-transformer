import React from "react";
import Editor from "./editor";

export default {
  title: "example",
};

export const Sample = () => (
  <Editor
    initialValue={[
      {
        type: "paragraph",
        children: [{ text: "A line of text in a paragraph." }],
      },
    ]}
  />
);
