import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";

export interface MpEditorProps {
  className?: string;
  style?: React.CSSProperties;
}

export type EditorInstance = ReactEditor & BaseEditor;
