import * as React from "react";
import "github-markdown-css";

export default ({ children }: { children: React.ReactNode }) => (
  <div className="markdown-body">{children}</div>
);
