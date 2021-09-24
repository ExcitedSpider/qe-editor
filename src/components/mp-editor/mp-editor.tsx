import React, {
  useMemo,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { BaseEditor, createEditor, Descendant, Editor } from "slate";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
import styled from "styled-components";

const WrapNode = styled.div`
  height: 100%;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  background-color: white;
  padding: 16px;
`;

export interface MpEditorProps {
  className?: string;
  style?: React.CSSProperties;
}

export const MpEditor = forwardRef<ReactEditor & Editor, MpEditorProps>(
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
          <Editable className={`h-full ${className}`} style={style}></Editable>
        </Slate>
      </WrapNode>
    );
  }
);

// 构造 editor ref 对象
function useRefObject(
  ref: React.ForwardedRef<ReactEditor & BaseEditor>,
  editor: ReactEditor & BaseEditor
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
