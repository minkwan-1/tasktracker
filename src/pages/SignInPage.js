import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkLoginUser, signInUser } from "../store/userSlice";
import styled from "styled-components";
import { PageContainer } from "../layout/common";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import usePreventAuth from "../hooks/usePreventAuth";

const StyledContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-height: 100vh;
  background: black;
  color: white;
  text-align: center;
`;

const ContentWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 2rem;
  background: linear-gradient(45deg, #ffffff, #cccccc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: fadeIn 1.5s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const Input = styled.input`
  width: 300px;
  padding: 0.5rem;
  margin: 0.5rem 0;
  font-size: 1rem;
  border: 1px solid #cccccc;
  border-radius: 5px;
  background: #333;
  color: white;
  box-shadow: 0px 4px 15px rgba(255, 255, 255, 0.2);
  opacity: 0;
  animation: fadeIn 1.5s ease forwards;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &::placeholder {
    color: #cccccc;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 300px;
  padding: 1rem 0;
  margin: 1rem;
  font-size: 1.5rem;
  color: black;
  background: white;
  border: 2px solid white;
  border-radius: 50px;
  box-shadow: 0px 4px 15px rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  opacity: 0;
  animation: fadeIn 1.5s ease forwards;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
    }
  }

  &:hover {
    background: #ffffff;
    color: black;
    transform: translateY(-5px);
    box-shadow: 0px 8px 20px rgba(255, 255, 255, 0.3);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0px 4px 15px rgba(255, 255, 255, 0.2);
  }
  &:disabled {
    background-color: gray;
  }
`;

const GridOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background-image: linear-gradient(to right, #1f1f1f 1px, transparent 1px),
    linear-gradient(to bottom, #1f1f1f 1px, transparent 1px);
  background-size: 20px 20px;
  z-index: 0;
`;

const SignInPage = () => {
  const [signinInfo, setSigninInfo] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state?.user?.loading);
  usePreventAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSigninInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 로그인을 처리하는 함수
  const handleSignIn = async () => {
    // firebase를 통해, 이메일과 비밀번호로 로그인
    try {
      // const userCredential = await signInWithEmailAndPassword(
      //   auth,
      //   signinInfo?.email,
      //   signinInfo?.password
      // );
      // 로그인 한 사용자 정보를 가져옴
      // const user = userCredential?.user;
      // 사용자 정보를 직렬화
      await dispatch(
        signInUser({ email: signinInfo?.email, password: signinInfo?.password })
      ).unwrap();

      navigate("/home");
    } catch (error) {
      // 예외가 발생한 경우, 해당 에러를 콘솔에 출력
      console.error(error);
    }
  };

  return (
    <PageContainer>
      <StyledContainer>
        <ContentWrapper>
          <Title>Sign in to TaskTracker</Title>
          <Input
            type="email"
            name="email"
            value={signinInfo?.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <Input
            type="password"
            name="password"
            value={signinInfo?.password}
            onChange={handleChange}
            placeholder="Password"
          />
          <Button disabled={loading} onClick={handleSignIn}>
            Sign In
          </Button>
        </ContentWrapper>
        <GridOverlay />
      </StyledContainer>
    </PageContainer>
  );
};

export default SignInPage;
