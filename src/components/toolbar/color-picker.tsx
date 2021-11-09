import * as React from "react";
import { BlockPicker } from "react-color";
import styled from "styled-components";
import { useSlate } from "slate-react";
import { Editor } from "slate";
import { ToolbarTag } from "./tag";
import { useClickOutside } from "../../hooks/use-click-outside";

const Colored = styled.span`
  color: ${(props) => props.color || "black"};
`;

const Container = styled.div`
  position: relative;
  display: inline-block;
  z-index: 10;
`;

const FloatLayer = styled.div`
  position: absolute;
  top: calc(100% + 16px);
  left: 50%;
  transform: translate(-50%, 0);

  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 8px;

  filter: drop-shadow(0px 6px 15px rgba(0, 0, 0, 0.05))
    drop-shadow(0px 3px 5px rgba(0, 0, 0, 0.05));
`;

export const ColorPicker = () => {
  const [visible, setVisible] = React.useState(false);
  const editor = useSlate();

  const currentValue = Editor.marks(editor)?.["color"] || "black";
  const ref = useClickOutside(() => {
    setVisible(false);
  });

  return (
    <div ref={ref as any} style={{ display: "inline-block" }}>
      <ToolbarTag>
        <Container >
          <Colored onClick={setVisible?.bind(null, true)} color={currentValue}>
            A
          </Colored>
          {visible && (
            <FloatLayer>
              <BlockPicker
                color={currentValue}
                onChange={(e) => {
                  Editor.addMark(editor, "color", e.hex);
                }}
              ></BlockPicker>
            </FloatLayer>
          )}
        </Container>
      </ToolbarTag>
    </div>
  );
};
