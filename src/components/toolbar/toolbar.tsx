import * as React from "react";
import styled from "styled-components";
import { useSlate, ReactEditor } from "slate-react";
import { Editor, BaseEditor, CustomTypes } from "slate";
import { ToolbarProps } from "./type";

const ToolbarNode = styled.div`
  background-color: white;
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

const ButtonNode = styled.div`
  display: inline-block;
  height: 32px;
  width: 32px;
  overflow: hidden;
  cursor: pointer;
  border-radius: 4px;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.12);
  }
  &:active {
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

export const MarkButton: React.FC<{ format: NodeFormat }> = ({ format, children }) => {
  const editor = useSlate();

  return (
    <ButtonNode
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
      role="button"
      aria-label={`toggle format ${format}`}
    >
      {children}
    </ButtonNode>
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
