import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'userReducer',
  initialState: {
    user: null,
    preferenceInfo: null,
  },
  reducers: {
    setCurrentUser: (state, action) => {
      state.user = action.payload;
    },
    removeCurrentUser: (state, action) => {
      localStorage.removeItem('token');
      state.user = null;
    },
    setPreferenceInfo: (state, action) => {
      state.preferenceInfo = action.payload;
    },
  },
});

export default userSlice.reducer;

export const { setCurrentUser, removeCurrentUser, setPreferenceInfo } = userSlice.actions;
