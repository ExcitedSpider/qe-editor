import React, {
  useMemo,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { createEditor, Descendant, Transforms, Text } from "slate";
import { Slate, Editable, withReact, RenderElementProps } from "slate-react";
import styled from "styled-components";
import { MpEditorProps, EditorInstance } from "./type";
import { Toolbar, MarkButton, MarkSelect, ColorPicker, BlockSelect } from "../toolbar";
import { renderLeaf } from "./leaf";
import { LeftAlign, centerAlign, rightAlign } from "./icon";

const WrapNode = styled.div`
  height: 100%;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  background-color: white;
  padding: 16px;
`;

const Italic = styled.span`
  font-style: italic;
`;

const UnderLine = styled.span`
  text-decoration: underline;
`;

const LineThrough = styled.span`
  text-decoration: line-through;
`;

export const MpEditor = forwardRef<EditorInstance, MpEditorProps>(
  (props, ref) => {
    const { className, style } = props;

    const editor = useMemo(() => withReact(createEditor()), []);

    const [value, setValue] = useState<Descendant[]>([
      {
        type: "paragraph",
        children: [{ text: "", fontSize: "17px" }],
      },
    ]);

    useRefObject(ref, editor);

    return (
      <WrapNode>
        <Slate
          editor={editor}
          value={value}
          onChange={(newValue) => setValue(newValue)}
        >
          <Toolbar>
            <MarkSelect
              format="fontSize"
              options={getFontSizeOptions()}
              defaultValue="17px"
              tips="字号"
            ></MarkSelect>
            <MarkButton tips="粗体" format="bold">
              B
            </MarkButton>
            <MarkButton tips="斜体" format="fontStyle" value="italic">
              <Italic>I</Italic>
            </MarkButton>
            <MarkButton tips="下划线" format="textDecoration" value="underline">
              <UnderLine>U</UnderLine>
            </MarkButton>
            <MarkButton
              tips="删除线"
              format="textDecoration"
              value="line-through"
            >
              <LineThrough>S</LineThrough>
            </MarkButton>
            <ColorPicker tips="文字颜色"></ColorPicker>
            <MarkSelect
              format="lineHeight"
              options={getLineHeightOptions()}
              defaultValue={1.2}
              tips="行高"
            ></MarkSelect>
            <BlockSelect
              format="textAlign"
              options={getTextAlignOptions()}
              defaultValue={"left"}
              tips="对齐"
            ></BlockSelect>
          </Toolbar>
          <Editable
            autoFocus
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            className={`h-full ${className}`}
            onKeyDown={handleKeyDown.bind(editor, editor)}
            style={style}
          ></Editable>
        </Slate>
      </WrapNode>
    );
  }
);

function getFontSizeOptions(): {
  label: React.ReactNode;
  value: React.ReactText;
}[] {
  return new Array(20).fill(0b0).map((_, index) => ({
    label: `${12 + index}px`,
    value: `${12 + index}px`,
  }));
}

function getLineHeightOptions(): {
  label: React.ReactNode;
  value: React.ReactText;
}[] {
  return new Array(7)
    .fill(0b0)
    .map((_, index) => (0.8 + index * 0.2).toFixed(1))
    .map((value) => ({
      label: `${value}倍`,
      value: Number(value),
    }));
}

const VerticalAlign = styled.div`
  display: flex;
  align-items: center;
`

function getTextAlignOptions() {
  return [
    {
      label: (
        <VerticalAlign>
          <svg width="24" height="24" viewBox="0 0 1024 1024">
            <path d={LeftAlign}></path>
          </svg>
        </VerticalAlign>
      ),
      value: "left",
    },
    {
      label: (
        <VerticalAlign>
          <svg width="24" height="24" viewBox="0 0 1024 1024">
            <path d={centerAlign}></path>
          </svg>
        </VerticalAlign>
      ),
      value: "center",
    },
    {
      label: (
        <VerticalAlign>
          <svg width="24" height="24" viewBox="0 0 1024 1024">
            <path d={rightAlign}></path>
          </svg>
        </VerticalAlign>
      ),
      value: "right",
    },
  ];
}

function handleKeyDown(editor: EditorInstance, event: React.KeyboardEvent) {
  if (!event.ctrlKey) {
    return;
  }

  const metaKeyHandlers: { [key: string]: () => void } = {
    b: () => {
      event.preventDefault();
      Transforms.setNodes(
        editor,
        { bold: true },
        { match: (n) => Text.isText(n), split: true }
      );
    },
  };

  metaKeyHandlers[event.key]?.();
}

function renderElement(props: RenderElementProps) {
  return (
    // 所有元素统一使用 section 保证兼容性
    <section data-powered-by="tad-mp-editor" style={props.element.style} {...props.attributes}>
      {props.children}
    </section>
  );
}

// 构造 editor ref 对象
function useRefObject(
  ref: React.ForwardedRef<EditorInstance>,
  editor: EditorInstance
) {
  useImperativeHandle(
    ref,
    () => {
      return Object.keys(editor).reduce(
        (acc, cur) => ({
          ...acc,
          [cur]: (editor as any)[cur].bind(editor),
        }),
        {}
      ) as any;
    },
    []
  );
}
