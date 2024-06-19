import React from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import usePreventAuth from "../hooks/usePreventAuth";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StyledContainer = styled.div`
  display: flex;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d);
  color: white;
  text-align: center;
  min-width: 100%;
`;

const ContentWrapper = styled.div`
  position: relative;
  display: flex;
  z-index: 1;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  animation: ${fadeIn} 1.5s ease-in-out;
`;

const Title = styled.h1`
  font-size: 4rem;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #ffffff, #ffeb3b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${fadeIn} 2s ease-in-out;
  @media (max-width: 768px) {
    font-size: 3rem;
  }
  @media (max-width: 360px) {
    font-size: 2.5rem;
  }
`;

const Description = styled.p`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  padding: 0 20px;
  opacity: 0;
  animation: ${fadeIn} 2.5s ease forwards;

  &.active {
    opacity: 1;
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }

  @media (max-width: 360px) {
    font-size: 1rem;
  }
`;

const Button = styled.button`
  display: inline-block;
  width: 220px;
  padding: 1rem 2rem;
  margin: 1rem;
  font-size: 1.5rem;
  color: black;
  background: white;
  border: 2px solid white;
  border-radius: 50px;
  text-decoration: none;
  box-shadow: 0px 4px 15px rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease-in-out;

  &:hover {
    background: #ffffff;
    color: black;
    transform: translateY(-5px);
    box-shadow: 0px 8px 20px rgba(255, 255, 255, 0.5);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0px 4px 15px rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 768px) {
    width: 180px;
    font-size: 1.2rem;
  }

  @media (max-width: 360px) {
    width: 150px;
    font-size: 1rem;
  }

  animation: ${fadeIn} 3s ease-in-out;
`;

const GridOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background-image: linear-gradient(
      to right,
      rgba(255, 255, 255, 0.1) 1px,
      transparent 1px
    ),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
  z-index: 0;
  animation: ${fadeIn} 4s ease-in-out;
`;

const LandingPage = () => {
  usePreventAuth();
  const navigate = useNavigate();
  return (
    <StyledContainer>
      <ContentWrapper>
        <Title>Welcome to TaskTracker</Title>
        <Description>
          Start a timer for 25 minutes, focus on your task, and then archive
          your focused content to track it. Join us today!
        </Description>
        <div>
          <Button onClick={() => navigate("/signin")}>Sign In</Button>
          <Button onClick={() => navigate("/signup")}>Sign Up</Button>
        </div>
      </ContentWrapper>
      <GridOverlay />
    </StyledContainer>
  );
};

export default LandingPage;
