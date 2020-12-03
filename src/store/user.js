import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'userReducer',
  initialState: {
    uid: '',
    email: '',
    displayName: '',
    photoURL: '',
    token: '',
  },
  reducers: {
    onLogin: (state, action) => {
      state = action.payload;
    },
    onLogout: (state, action) => {
      state = null;
    },
    onSignup: (state, action) => {
      state = action.payload;
    },
  },
});

export default userSlice.reducer;

export const { onLogin, onLogout, onSignup } = userSlice.actions;
