import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const usePreventAuth = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("user"))) {
      navigate("/home");
      if (pathname === "/archive") {
        navigate("/archive");
      }
    } else {
      if (pathname === "/home" || pathname === "/archive") {
        navigate("/");
      }
    }
  }, []);
  return;
};

export default usePreventAuth;
