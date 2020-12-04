import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'userReducer',
  initialState: {user : null},
  reducers: {
    onLogin: (state, action) => {
      state.user = action.payload;
    },
    onLogout: (state, action) => {
      localStorage.removeItem('token');
      state.user = null;
    },
    onUpdateUser: (state, action) => {
      state.user.preferences = action.payload; 
    },
  },
});

export default userSlice.reducer;

export const { onLogin, onLogout, onSignup } = userSlice.actions;
