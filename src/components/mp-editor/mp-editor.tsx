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
import { Toolbar, MarkButton, MarkSelect } from "../toolbar";
import { renderLeaf } from "./leaf";
import { SketchPicker } from 'react-color';

const WrapNode = styled.div`
  height: 100%;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  background-color: white;
  padding: 16px;
`;

const Italic = styled.span`
font-style: italic;
`

const UnderLine = styled.span`
text-decoration: underline;
`

const LineThrough = styled.span`
text-decoration: line-through;
`

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
            ></MarkSelect>
            <MarkButton format="bold">B</MarkButton>
            <MarkButton format="fontStyle" value="italic">
              <Italic>I</Italic>
            </MarkButton>
            <MarkButton format="textDecoration" value="underline">
              <UnderLine>U</UnderLine>
            </MarkButton>
            <MarkButton format="textDecoration" value="line-through">
              <LineThrough>S</LineThrough>
            </MarkButton>
          </Toolbar>
          <Editable
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
    <section data-powered-by="tad-mp-editor" {...props.attributes}>
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
