import React from "react";
import styled from "styled-components";

const FooterStyle = styled.div`
  background-color: #111;
  color: #fff;
  padding: 40px 0;
`;

const FooterTextContainer = styled.div`
  max-width: 1200px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
`;

const FooterText = styled.p`
  font-size: 1rem;
  text-align: center;
`;

const Footer = () => {
  return (
    <FooterStyle>
      <FooterTextContainer>
        <FooterText>🍅 TaskTracker</FooterText>
        <FooterText>Copyright © 2024 All rights reserved</FooterText>
      </FooterTextContainer>
    </FooterStyle>
  );
};

export default Footer;
