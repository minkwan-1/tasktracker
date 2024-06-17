import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// 유저 정보를 설정하는 비동기 함수
export const setUser = createAsyncThunk("user/setUser", async (user) => {
  console.log(user);
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    console.log(user);
    localStorage.setItem("user", JSON.stringify(user));
    if (user) return user;
  });

  return user;
});

// 유저 정보를 초기화하는 비동기 함수
export const clearUser = createAsyncThunk("user/clearUser", async () => {
  localStorage.removeItem("user");
});

const initialState = {
  userInfo: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(setUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(setUser.fulfilled, (state, action) => {
      state.loading = false;
      state.userInfo = action.payload;
    });
    builder.addCase(setUser.rejected, (state) => {
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
  },
});

export default userSlice.reducer;
