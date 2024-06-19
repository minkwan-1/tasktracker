import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { useSelector } from "react-redux";
import { setUser, clearUser } from "../../store/userSlice";
import { useDispatch } from "react-redux";
import { auth } from "../../firebase";

const HeaderStyle = styled.div`
  background-color: black;
  width: 100%;
  height: 80px;
  position: sticky;
  top: 0;
  z-index: 999;
`;

const LogOut = styled.div`
  cursor: pointer;
  color: white;
`;

const HeaderContentWrapper = styled.div`
  max-width: 1200px;
  display: flex;
  margin: 0 auto;
  height: 100%;
  padding: 0px 12px;
  justify-content: space-between;
`;

const LogoContainer = styled.div`
  width: auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Logo = styled.p`
  width: auto;
  height: auto;
  font-size: 25px;
  font-weight: bold;
  color: white;
`;

const DisplayName = styled.p`
  @media (max-width: 400px) {
    display: none;
  }
`;

const Appbar = () => {
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state?.user?.userInfo);
  console.log(userInfo);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setUser(JSON.parse(localStorage.getItem("user"))));
  }, [dispatch]);

  const handleSignOut = () => {
    auth.signOut();
    dispatch(clearUser());
    navigate("/");
  };
  return (
    <HeaderStyle>
      <HeaderContentWrapper>
        <LogoContainer>
          <Logo onClick={() => navigate("/")}>🍅 TaskTracker</Logo>
        </LogoContainer>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: "bold",
            fontSize: "20px",
            gap: "10px",
          }}
        >
          <DisplayName style={{ color: "white" }}>
            {userInfo?.displayName}
          </DisplayName>
          {userInfo ? <LogOut onClick={handleSignOut}>⏎</LogOut> : <></>}
        </div>
      </HeaderContentWrapper>
    </HeaderStyle>
  );
};

export default Appbar;
