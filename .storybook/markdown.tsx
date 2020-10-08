import React, { useCallback, useMemo, useState } from "react";
import unified from "unified";
import markdown from "remark-parse";
import remark2rehype from "remark-rehype";
import html from "rehype-stringify";

const processor = unified()
  .use(markdown, { commonmark: true })
  .use(remark2rehype)
  .use(html);

const style: React.CSSProperties = {
  flex: 1,
  margin: 10,
};

type Props = {
  initialValue: string;
};

export default ({ initialValue }: Props) => {
  const html = useMemo(
    () => ({ __html: processor.processSync(initialValue).contents as string }),
    [initialValue]
  );
  return (
    <div style={style}>
      <div dangerouslySetInnerHTML={html} />
    </div>
  );
};
