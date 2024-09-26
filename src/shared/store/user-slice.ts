import { createSlice } from '@reduxjs/toolkit';
import { User } from '@shared/types';

const accountString = localStorage.getItem('account');

const initialState: User = {
  accessToken: "",
  account: accountString ? JSON.parse(accountString) : null,
}
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setAccount: (state, action) => {
      state.account = action.payload
      localStorage.setItem('account', JSON.stringify(action.payload))
    },
    logout: (state) => {
      state.account = null
      state.accessToken = ''
      localStorage.removeItem('account')
    }
  },
  selectors: {
    selectAccessToken: (state) => state.accessToken,
    selectAccount: (state) => state.account,
  },
});


export const {
  setAccessToken,
  setAccount,
  logout
} = userSlice.actions


export const {
  selectAccessToken,
  selectAccount,
} = userSlice.selectors



export default userSlice.reducer