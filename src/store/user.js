import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'userReducer',
  initialState: {user : null},
  reducers: {
    onLogin: (state, action) => {
      state.user = action.payload;
      console.log(state, 'state');
      console.log(action.payload, 'payload');
    },
    onLogout: (state, action) => {
      state = null;
    },
    onUpdateUser: (state, action) => {
      state.user.preferences = action.payload; 
    },
  },
});

export default userSlice.reducer;

export const { onLogin, onLogout, onSignup } = userSlice.actions;
