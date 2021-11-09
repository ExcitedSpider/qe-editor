import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";

// Element 数据类型定义
type CustomElement = { type: "paragraph"; children: CustomText[] };

// 格式数据类型定义
interface CustomText {
  text: string;
  bold?: boolean;
  fontSize?: string;
  textDecoration?: React.CSSProperties['textDecoration']
  fontStyle?: React.CSSProperties['fontStyle']
  color?: string;
  lineHeight?: string | number;
  textAlign?: React.CSSProperties['textAlign'];
}

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
