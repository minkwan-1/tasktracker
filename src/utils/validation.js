export const validateUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
  return usernameRegex.test(username)
    ? ""
    : "3자 이상 16자 이하, 영문자, 숫자, 밑줄(_)만 허용됩니다.";
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) ? "" : "잘못된 이메일 형식입니다.";
};

export const validatePassword = (password) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password)
    ? ""
    : "최소 8자 이상, 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.";
};
