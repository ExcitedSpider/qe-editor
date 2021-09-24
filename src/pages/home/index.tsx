import styled from "styled-components";
import { MpEditor } from "@/components/mp-editor";

const BackgroundNode = styled.div`
  padding: 60px;
  min-height: 100vh;
  box-sizing: border-box;
`;

const EditorNode = styled.div`
  width: 768px;
  margin: 0 auto;
`;

const Home = () => {
  return (
    <BackgroundNode>
      <EditorNode>
        <MpEditor style={{ minHeight: "600px" }}></MpEditor>
      </EditorNode>
    </BackgroundNode>
  );
};

export default Home;
