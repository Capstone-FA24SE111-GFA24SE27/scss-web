import { createSlice } from '@reduxjs/toolkit';

const initialState: User = {
  accessToken: "",
  account: null
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
    },
    logout: (state) => {
      state = initialState
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


export type User = {
  accessToken: string;
  account: Account | null
}

export type Account = {
  id: number,
  email: string,
  role: string,
  status: string,
  profile: Profile
}

export type Profile = {
  id: number,
  fullName: string,
  phoneNumber: string,
  dateOfBirth: number,
  avatarLink: string
}


export default userSlice.reducer