import * as React from "react";
import styled from "styled-components";
import { useSlate, ReactEditor } from "slate-react";
import {
  Editor,
  BaseEditor,
  CustomTypes,
  Transforms,
  Element as SlateElement,
  Node,
  Element,
  Selection,
} from "slate";
import { ToolbarProps } from "./type";
import { ISelectProps, Select as AduiSelect, Tooltip } from "adui";
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
  format: TextFormat;
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

  & .adui-select-selection-item {
    display: flex;
    align-items: center;
  }
`;

/** 基础选择器 */
export const BaseSelect: React.FC<
  ISelectProps & {
    /** 选项 */
    options: { label: React.ReactNode; value: React.ReactText }[];
    /** tooltip  */
    tips?: string;
  }
> = ({ options, tips, ...rest }) => {
  return (
    <Tooltip popup={tips} placement="top">
      <Select theme="light" {...rest}>
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

/** Mark 格式选择，比如字号、颜色等 */
export const MarkSelect: React.FC<{
  format: TextFormat;
  options: { label: React.ReactNode; value: React.ReactText }[];
  defaultValue?: React.ReactText;
  tips?: string;
}> = ({ format, options, defaultValue, tips }) => {
  const editor = useSlate();

  const current = Editor.marks(editor)?.[format];

  return (
    <BaseSelect
      tips={tips}
      options={options}
      onSelect={(value: React.ReactText) => {
        toggleMark(editor, format, value);
      }}
      value={
        typeof current === "number" || typeof current === "string"
          ? current
          : null
      }
      defaultValue={defaultValue}
    ></BaseSelect>
  );
};

const retriveCondition = (n: Node) =>
  SlateElement.isElement(n) && !Editor.isEditor(n) && !!n.type;

/** Block 格式选择，比如对齐等 */
export const BlockSelect: React.FC<{
  format: keyof React.CSSProperties;
  options: { label: React.ReactNode; value: React.ReactText }[];
  defaultValue?: React.ReactText;
  tips?: string;
}> = ({ format, options, defaultValue, tips }) => {
  const editor = useSlate();

  const { selection } = editor;

  let current = retrieveFormatValue(defaultValue, selection, editor, format);

  return (
    <BaseSelect
      tips={tips}
      options={options}
      defaultValue={defaultValue}
      value={current}
      onSelect={(value) => {
        Transforms.setNodes(
          editor,
          {
            style: {
              [format]: value,
            },
          },
          {
            match: retriveCondition,
          }
        );
      }}
    ></BaseSelect>
  );
};

type TextFormat = keyof Omit<CustomTypes["Text"], "text">;
type NodeFormat = keyof CustomTypes["Element"];

const isMarkActive = (
  editor: BaseEditor & ReactEditor,
  format: TextFormat,
  value = true
) => {
  const marks = Editor.marks(editor);

  return marks?.[format] === value;
};

export const toggleMark = (
  editor: BaseEditor & ReactEditor,
  format: TextFormat,
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

function retrieveFormatValue(defaultValue: React.ReactText | undefined, selection: Selection, editor: BaseEditor & ReactEditor, format: string) {
  let current = defaultValue;
  if (selection) {
    const nodeRetriver = Editor.nodes(editor, {
      at: selection,
      match: retriveCondition,
    });

    const { value } = nodeRetriver.next();
    if (value) {
      const [node] = value as [Element, unknown];
      current = (node?.style as any)?.[format] || defaultValue;
    }
  }
  return current;
}

