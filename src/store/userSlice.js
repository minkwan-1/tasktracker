import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth, storage } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { signInWithEmailAndPassword } from "firebase/auth";

// 유저 정보를 설정하는 비동기 함수
export const checkLoginUser = createAsyncThunk(
  "user/checkLoginUser",
  async (user) => {
    console.log(user);
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      console.log(user);
      localStorage.setItem("user", JSON.stringify(user));
    });

    return user;
  }
);
// sign in
export const signInUser = createAsyncThunk(
  "user/signInUser",
  async (userInfo) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      userInfo?.email,
      userInfo?.password
    );
    const result = {
      uid: userCredential?.user?.uid,
      displayName: userCredential?.user?.displayName,
      email: userCredential?.user?.email,
    };
    localStorage.setItem("user", JSON.stringify(result));

    return result;
  }
);

// 유저 정보를 초기화하는 비동기 함수
export const clearUser = createAsyncThunk("user/clearUser", async () => {
  localStorage.removeItem("user");
});

export const signupUser = createAsyncThunk(
  "user/signupUser",
  async (userInfo) => {
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
        if (userInfo?.imgFile) {
          // firebase에 이미지를 업로드
          const storageRef = ref(
            storage,
            new Date().getTime() + userInfo?.imgFile?.name
          );
          const uploadTask = uploadBytesResumable(
            storageRef,
            userInfo?.imgFile
          );
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
            },
            // 업로드가 완료된 경우
            () => {
              // 업로드된 파일의 다운로드 URL을 가져옴
              getDownloadURL(uploadTask.snapshot.ref).then(
                async (downloadURL) => {
                  // 사용자 프로필을 업데이트
                  await updateProfile(auth.currentUser, {
                    displayName: userInfo?.displayName,
                    photoURL: downloadURL,
                  });
                }
              );
            }
          );
        }
        // 이미지 파일이 없는 경우
        else {
          await updateProfile(auth.currentUser, {
            displayName: userInfo?.displayName,
            photoURL: "",
          });
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
  }
);

const initialState = {
  userInfo: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(checkLoginUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(checkLoginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.userInfo = action.payload;
    });
    builder.addCase(checkLoginUser.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(clearUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(clearUser.fulfilled, (state) => {
      state.loading = false;
      state.userInfo = null;
    });
    builder.addCase(clearUser.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(signupUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(signupUser.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(signupUser.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(signInUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(signInUser.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(signInUser.rejected, (state) => {
      state.loading = false;
    });
  },
});

export default userSlice.reducer;
