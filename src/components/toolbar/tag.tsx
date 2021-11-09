import * as React from "react";
import { Tag } from "adui";
import { ITagProps } from "adui/es/tag";

export const ToolbarTag: React.FC<ITagProps> = (args) => {
  return (
    <Tag
      interactive
      size="large"
      style={{
        minWidth: "20px",
        minHeight: "26px",
        lineHeight: "20px",
        display: "inline-flex",
        alignItems: "center",
      }}
      {...args}
    >
      {args.children}
    </Tag>
  );
};
