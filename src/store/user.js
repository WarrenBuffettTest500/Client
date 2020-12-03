import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'userReducer',
  initialState: {
    user: null,
  },
  reducers: {
    onLogin: (state, action) => {
      state.user = action.payload;
    },
    onLogout: (state, action) => {
      state.user = null;
    },
  },
});

export default slice.reducer;

export const { onLogin, onLogout } = slice.actions;
