import React, { useState } from "react";
import { PageContainer } from "../layout/common";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import { auth, storage } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import usePreventAuth from "../hooks/usePreventAuth";

import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "../utils/validation";

const StyledContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: black;
  color: white;
  text-align: center;
  overflow: hidden;
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
  border: 1px solid ${({ error }) => (error ? "red" : "#cccccc")};
  border-radius: 5px;
  background: #333;
  color: white;
  box-shadow: 0px 4px 15px rgba(255, 255, 255, 0.2);
  opacity: 1;
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
  opacity: 1;
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

const ImageUploadWrapper = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 300px;
  height: 300px;
  border: 2px dashed #cccccc;
  border-radius: 10px;
  margin-bottom: 1rem;
  cursor: pointer;
  position: relative;
  opacity: 1;
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
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
`;

const ImageUploadIcon = styled.span`
  font-size: 3rem;
  color: #cccccc;
`;

const ErrorMessage = styled.p`
  font-size: 0.7rem;
  color: red;
  margin-top: 0.2rem;
`;

const SignUpPage = () => {
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [prevImg, setPrevImgFile] = useState("");
  const [imgFile, setImageFile] = useState("");
  const [errors, setErrors] = useState({});
  usePreventAuth();

  const navigate = useNavigate();

  // 입력 필드에서 변경이 있을 때 호출되는 함수
  const handleChange = (e) => {
    // 인풋 필드에서 이름과 값을 추출
    const { name, value } = e.target;
    // 유효성 검사 오류 메세지를 저장할 변수를 초기화
    let validationError = "";
    switch (name) {
      // 이메일 입력 필드인 경우, 이메일 validation을 수행하는 validateEmail 함수를 호출
      case "email":
        validationError = validateEmail(value);
        break;
      // 비밀번호 입력 필드인 경우, 비밀번호 validation을 수행하는 validatePassword 함수를 호출
      case "password":
        validationError = validatePassword(value);
        break;
      // 사용자 이름 입력 필드인 경우, 사용자 이름 validation을 수행하는 validateUsername 함수를 호출
      case "username":
        validationError = validateUsername(value);
        break;
      default:
        break;
    }
    // 각 유효성 검사에 대한 결과를 오류 상태에 업데이트
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validationError,
    }));
    // userInfo 상태에는, 입력 필드에 입력된 새 값이 업데이트 됨
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 이미지 파일을 저장하는 함수
  const saveImgFile = (e) => {
    // 파일이 선택되었는지 확인
    if (e.target.files) {
      // 선택한 파일을 가져옴
      const file = e.target.files[0];
      // 이미지 파일 상태를 업데이트
      setImageFile(file);
      // FileReader 객체를 생성
      const reader = new FileReader();
      // 파일을 읽은 후, Data URL로 변환
      reader.readAsDataURL(file);
      // 파일 읽기가 완료되면 실행됨
      reader.onloadend = () => {
        // Data URL을 이미지 파일 미리보기 상태로 설정
        setPrevImgFile(reader.result);
      };
    }
  };

  // 회원가입을 처리하는 함수
  const handleSignUp = async (e) => {
    // 기본 이벤트를 막음
    e.preventDefault();
    // 유효성 검사 오류가 있는지 확인
    if (Object.values(errors).some((error) => error)) {
      alert("Please check your information again.");
      return;
    }

    try {
      // Firebase를 통해, 이메일과 비밀번호로 사용자를 생성
      await createUserWithEmailAndPassword(
        auth,
        userInfo?.email,
        userInfo?.password
      );

      // 현재 사용자가 있는 경우(=firebase에 회원 등록이 된 경우)
      if (auth.currentUser) {
        // 동시에 이미지 파일이 있는 경우
        if (imgFile) {
          // firebase에 이미지를 업로드
          const storageRef = ref(storage, new Date().getTime() + imgFile?.name);
          const uploadTask = uploadBytesResumable(storageRef, imgFile);
          uploadTask.on(
            "state_changed",
            // 업로드 상태가 변경될 때 실행될 콜백 함수
            (snapshot) => {
              // 업로드 진행률을 계산하는 로직
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log("Upload is " + progress + "% done");
              switch (snapshot.state) {
                case "paused":
                  console.log("Upload is paused");
                  break;
                case "running":
                  console.log("Upload is running");
                  break;
              }
            },
            // 업로드 중 에러가 발생한 경우
            (error) => {
              alert("Failed to upload image. Please try again later.");
              navigate("/signin");
            },
            // 업로드가 완료된 경우
            () => {
              // 업로드된 파일의 다운로드 URL을 가져옴
              getDownloadURL(uploadTask.snapshot.ref).then(
                async (downloadURL) => {
                  // 사용자 프로필을 업데이트
                  await updateProfile(auth.currentUser, {
                    displayName: userInfo?.username,
                    photoURL: downloadURL,
                  });
                  alert("Sign up successful!");
                  navigate("/signin");
                }
              );
            }
          );
        }
        // 이미지 파일이 없는 경우
        else {
          alert("Sign up successful!");
          navigate("/signin");
        }
      }
    } catch (error) {
      // 예외가 발생한 경우
      switch (error.code) {
        case "auth/email-already-in-use":
          alert("Email already in use.");
          break;
        case "auth/weak-password":
          alert("Password should be at least 6 characters.");
          break;
        case "auth/network-request-failed":
          alert("Network request failed.");
          break;
        case "auth/invalid-email":
          alert("Invalid email format.");
          break;
        case "auth/internal-error":
          alert("Internal error.");
          break;
        default:
          alert("Sign up failed.");
      }
    }
  };

  return (
    <PageContainer>
      <StyledContainer>
        <ContentWrapper>
          <Title>Sign up to TaskTracker</Title>
          <ImageUploadWrapper>
            {prevImg ? (
              <ImagePreview src={prevImg} />
            ) : (
              <ImageUploadIcon>+</ImageUploadIcon>
            )}
            <input
              style={{ display: "none" }}
              type="file"
              accept="image/*"
              id="profileImg"
              onChange={saveImgFile}
            />
          </ImageUploadWrapper>
          <Input
            type="text"
            placeholder="Username"
            value={userInfo.username}
            name="username"
            onChange={handleChange}
            error={errors.username}
          />
          {errors.username && <ErrorMessage>{errors.username}</ErrorMessage>}{" "}
          <Input
            type="email"
            placeholder="example@gmail.com"
            value={userInfo.email}
            name="email"
            onChange={handleChange}
            error={errors.email}
          />
          {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}{" "}
          <Input
            type="password"
            placeholder="Password"
            value={userInfo.password}
            name="password"
            onChange={handleChange}
            error={errors.password}
          />
          {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}{" "}
          <Button onClick={handleSignUp}>Create account</Button>
        </ContentWrapper>
        <GridOverlay />
      </StyledContainer>
    </PageContainer>
  );
};

export default SignUpPage;
