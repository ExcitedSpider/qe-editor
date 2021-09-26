import { CSSProperties } from "styled-components";
import { RenderLeafProps } from "slate-react";

export function renderLeaf(props: RenderLeafProps) {
  return (
    // 这里必须使用内联样式确保复制出来样式准确
    <span style={getLeafProps(props)} {...props.attributes}>
      {props.children}
    </span>
  );
}

function getLeafProps(props: RenderLeafProps): CSSProperties {
  return {
    fontWeight: props.leaf.bold ? "bold" : "normal",
  };
}
