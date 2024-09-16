import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  accessToken: "",
  userInfo: "",
  authorizedNavigation: "",
}
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
  },
  selectors: {
    selectAccessToken: (state) => state.accessToken,
  },
});


export const { setAccessToken } = userSlice.actions


export default userSlice.reducer