import * as React from "react";
import { BlockPicker } from "react-color";
import styled from "styled-components";
import { useSlate } from "slate-react";
import { Editor } from "slate";
import { ToolbarTag } from "./tag";
import { useClickOutside } from "../../hooks/use-click-outside";
import { toggleMark } from './toolbar';

const Colored = styled.span`
  color: ${(props) => props.color || "black"};
`;

const Container = styled.div`
  position: relative;
  display: inline-block;
  z-index: 10;

  & .block-picker {
    box-shadow: none;

    & span > div[tabindex="0"] {
      border: 1px solid rgba(0, 0, 0, 0.06);
    }
  }
`;

const FloatLayer = styled.div<{ visible: boolean }>`
  position: absolute;
  top: calc(100% + 16px);
  left: 50%;
  transform: translate(-50%, 0);

  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 8px;

  filter: drop-shadow(0px 6px 15px rgba(0, 0, 0, 0.05))
    drop-shadow(0px 3px 5px rgba(0, 0, 0, 0.05));

  display: ${(props) => (props.visible ? "block" : "none")};
`;

const PALLETES = [
  "#F47373",
  "#697689",
  "#37D67A",
  "#2CCCE4",
  "#dce775",
  "#ff8a65",
  "#ba68c8",
  "#555555",
  "#000000",
  "#ffffff",
];

export const ColorPicker = () => {
  const [visible, setVisible] = React.useState(false);
  const editor = useSlate();

  const currentValue = Editor.marks(editor)?.["color"] || "black";
  const ref = useClickOutside(() => {
    setVisible(false);
  });

  return (
    <div ref={ref as any} onClick={setVisible?.bind(null, true)} style={{ display: "inline-block" }}>
      <ToolbarTag>
        <Container>
          <Colored color={currentValue}>
            A
          </Colored>
          <FloatLayer visible={visible}>
            <BlockPicker
              color={currentValue}
              onChange={(e) => {
                toggleMark(editor, 'color', e.hex);
              }}
              colors={PALLETES}
            ></BlockPicker>
          </FloatLayer>
        </Container>
      </ToolbarTag>
    </div>
  );
};
