import React from "react";

const style: React.CSSProperties = { flex: 1, margin: 10, overflowY: "scroll" };
const textStyle: React.CSSProperties = {
  whiteSpace: "pre-wrap",
};

export default ({ children }: { children: React.ReactNode }) => (
  <div style={style}>
    <div style={textStyle}>{children}</div>
  </div>
);
