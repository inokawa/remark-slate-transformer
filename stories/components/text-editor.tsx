import React, { forwardRef } from "react";

const style: React.CSSProperties = {
  flex: 1,
  padding: 10,
  overflowY: "scroll",
};
const textAreaStyle = { width: "100%", height: "100%" };

export default forwardRef<
  HTMLTextAreaElement,
  {
    initialValue: string;
  }
>(({ initialValue }, ref) => (
  <div style={style}>
    <textarea ref={ref} style={textAreaStyle} defaultValue={initialValue} />
  </div>
));
