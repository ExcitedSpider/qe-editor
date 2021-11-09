import * as React from "react";
import styled from "styled-components";
import { useSlate, ReactEditor } from "slate-react";
import { Editor, BaseEditor, CustomTypes, Transforms } from "slate";
import { ToolbarProps } from "./type";
import { Select as AduiSelect, Tooltip } from "adui";
import { ToolbarTag } from "./tag";

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
export const MarkButton: React.FC<{
  format: NodeFormat;
  value?: any;
  tips?: string;
}> = ({ format, children, value, tips }) => {
  const editor = useSlate();

  const active = isMarkActive(editor, format, value);

  return (
    <Tooltip popup={tips} placement="top">
      <ToolbarTag
        intent={active ? "primary" : "normal"}
        onClick={() => {
          toggleMark(editor, format, value);
        }}
      >
        {children}
      </ToolbarTag>
    </Tooltip>
  );
};

const Select = styled(AduiSelect)`
  min-width: 52px;
  margin-right: 12px;
`;

/** 格式选择，比如字号、对齐方式等 */
export const MarkSelect: React.FC<{
  format: NodeFormat;
  options: { label: React.ReactNode; value: React.ReactText }[];
  defaultValue?: React.ReactText;
  tips?: string;
}> = ({ format, options, defaultValue, tips }) => {
  const editor = useSlate();

  const current = Editor.marks(editor)?.[format];

  return (
    <Tooltip popup={tips} placement="top">
      <Select
        theme="light"
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
    </Tooltip>
  );
};

type NodeFormat = keyof Omit<CustomTypes["Text"], "text">;

const isMarkActive = (
  editor: BaseEditor & ReactEditor,
  format: NodeFormat,
  value = true
) => {
  const marks = Editor.marks(editor);

  return marks?.[format] === value;
};

export const toggleMark = (
  editor: BaseEditor & ReactEditor,
  format: NodeFormat,
  value: any = true
) => {
  const isActive = isMarkActive(editor, format, value);

  // 用户没有选择，默认插入样式到第一个元素
  if (!editor.selection) {
    Transforms.insertNodes(
      editor,
      {
        text: "",
      },
      {
        at: [0, 0],
      }
    );

    Transforms.select(editor, [0, 0]);
  }

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, value);
  }
};
