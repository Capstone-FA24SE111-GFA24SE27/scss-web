import { createSlice } from '@reduxjs/toolkit';
import { User } from '@shared/types';

const accountString = localStorage.getItem('account');

const initialState: User = {
  accessToken: "",
  account: accountString ? JSON.parse(accountString) : null,
  refreshToken: "",
}
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setRefreshToken: (state, action) => {
      state.refreshToken = action.payload;
      localStorage.setItem('refreshToken', JSON.stringify(action.payload))
    },
    setAccount: (state, action) => {
      state.account = action.payload
      localStorage.setItem('account', JSON.stringify(action.payload))
    },
    logout: (state) => {
      state.account = null
      state.accessToken = ''
      localStorage.removeItem('account')
      localStorage.removeItem('refreshToken')
    }
  },
  selectors: {
    selectAccessToken: (state) => state.accessToken,
    selectRefreshToken: (state) => state.refreshToken,
    selectAccount: (state) => state.account,
  },
});


export const {
  setAccessToken,
  setAccount,
  setRefreshToken,
  logout
} = userSlice.actions


export const {
  selectAccessToken,
  selectAccount,
  selectRefreshToken,
} = userSlice.selectors



export default userSlice.reducer