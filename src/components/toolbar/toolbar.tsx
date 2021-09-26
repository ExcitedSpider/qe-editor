import * as React from "react";
import styled from "styled-components";
import { useSlate, ReactEditor } from "slate-react";
import { Editor, BaseEditor, CustomTypes } from "slate";
import { ToolbarProps } from "./type";
import { Select as AduiSelect, Tag } from "adui";

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

/** 格式按钮，比如加粗、下划线等 */
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

const Select = styled(AduiSelect)`
  min-width: 52px;
`;

/** 格式选择，比如字号、对齐方式等 */
export const MarkSelect: React.FC<{
  format: NodeFormat;
  options: { label: React.ReactNode; value: React.ReactText }[];
  defaultValue?: React.ReactText;
}> = ({ format, options, defaultValue }) => {
  const editor = useSlate();

  const current = Editor.marks(editor)?.[format];

  return (
    <Select
      theme="light"
      size="mini"
      onSelect={(value: React.ReactText) => {
        toggleMark(editor, format, value);
      }}
      value={
        typeof current === "number" || typeof current === "string"
          ? current
          : null
      }
      defaultValue={defaultValue}
    >
      {options.map((item) => {
        return (
          <Select.Option
            style={{ zIndex: 100000 }}
            key={item.value}
            value={item.value}
          >
            {item.label}
          </Select.Option>
        );
      })}
    </Select>
  );
};

type NodeFormat = keyof Omit<CustomTypes["Text"], "text">;

const isMarkActive = (editor: BaseEditor & ReactEditor, format: NodeFormat) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const toggleMark = (
  editor: BaseEditor & ReactEditor,
  format: NodeFormat,
  value: any = true
) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, value);
  }
};
