import React, {
  useMemo,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { createEditor, Descendant, Transforms, Text } from "slate";
import {
  Slate,
  Editable,
  withReact,
  RenderElementProps,
  RenderLeafProps,
} from "slate-react";
import styled from "styled-components";
import { MpEditorProps, EditorInstance } from "./type";
import { Toolbar, MarkButton } from "../toolbar";

const WrapNode = styled.div`
  height: 100%;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  background-color: white;
  padding: 16px;
`;

export const MpEditor = forwardRef<EditorInstance, MpEditorProps>(
  (props, ref) => {
    const { className, style } = props;

    const editor = useMemo(() => withReact(createEditor()), []);

    const [value, setValue] = useState<Descendant[]>([
      {
        type: "paragraph",
        children: [{ text: "" }],
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
            <MarkButton format="bold">B</MarkButton>
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

function renderLeaf(props: RenderLeafProps) {
  const LeafSpan = styled.span`
    font-weight: ${props.leaf.bold ? "bold" : "normal"};
  `;

  return <LeafSpan {...props.attributes}>{props.children}</LeafSpan>;
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
