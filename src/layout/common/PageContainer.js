import React from "react";
import { styled } from "styled-components";
import Appbar from "../appbar/Appbar";
import Footer from "../footer/Footer";

const Box = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  flex-grow: 1;
`;

const PageContainer = ({ children }) => {
  return (
    <Box>
      <Appbar />
      <Content>{children}</Content>
      <Footer />
    </Box>
  );
};

export default PageContainer;
