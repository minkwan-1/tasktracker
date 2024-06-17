import React from "react";
import { styled } from "styled-components";

const FooterStyle = styled.div`
  background-color: black;
`;

const FooterTextContainer = styled.div`
  max-width: 1200px;
  width: 100%;
  display: flex;
  color: white;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  padding: 16px 0;
  row-gap: 10px;

  @media (max-width: 1200px) {
    padding: 16px;
  }
`;

const Footer = () => {
  return (
    <FooterStyle>
      {/* Text */}
      <FooterTextContainer>
        <p>My task</p>
        <p>Copyright © 2023 All rights reserved</p>
        <p>Powered By SITE123 - Create your own website</p>
      </FooterTextContainer>
      {/* Button */}
    </FooterStyle>
  );
};

export default Footer;
