import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  max-width: 1200px;
  width: 100%;
  display: flex;
  margin: 0 auto;
  padding: 0px 12px;
`;

const ComponentWrapper = ({ children }) => {
  return <Wrapper>{children}</Wrapper>;
};

export default ComponentWrapper;
