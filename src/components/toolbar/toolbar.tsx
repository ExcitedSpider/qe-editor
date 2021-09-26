import * as React from "react";
import styled from "styled-components";
import { useSlate, ReactEditor } from "slate-react";
import { Editor, BaseEditor, CustomTypes } from "slate";
import { ToolbarProps } from "./type";
import Tag from "adui/es/tag";

const ToolbarNode = styled.div`
  background-color: white;
  padding-bottom: 16px;
`;

export const Toolbar: React.FC<React.PropsWithChildren<ToolbarProps>> = ({
  className,
  style,
  children,
}) => {
  return (
    <ToolbarNode className={className} style={style}>
      {children}
    </ToolbarNode>
  );
};

export const MarkButton: React.FC<{ format: NodeFormat }> = ({
  format,
  children,
}) => {
  const editor = useSlate();

  const active = isMarkActive(editor, format);

  return (
    <Tag
      interactive
      style={{ minWidth: "20px", minHeight: "20px", lineHeight: "20px" }}
      intent={active ? "primary" : "normal"}
      onClick={() => {
        toggleMark(editor, format);
      }}
    >
      {children}
    </Tag>
  );
};

type NodeFormat = keyof Omit<CustomTypes["Text"], "text">;

const isMarkActive = (editor: BaseEditor & ReactEditor, format: NodeFormat) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const toggleMark = (editor: BaseEditor & ReactEditor, format: NodeFormat) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};
