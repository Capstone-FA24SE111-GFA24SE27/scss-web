import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  accessToken: "",
  userInfo: {
    name: "Phat Doan Tien",
    role: "STUDENT"
  },
}
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload
    }
  },
  selectors: {
    selectAccessToken: (state) => state.accessToken,
    selectUserInfo: (state) => state.userInfo,
  },
});


export const { setAccessToken } = userSlice.actions


export default userSlice.reducer