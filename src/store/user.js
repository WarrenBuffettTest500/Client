import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'userReducer',
  initialState: {
    currentUser: null,
    preferenceInfo: null,
    staticPortfolio: [],
  },
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    removeCurrentUser: (state, action) => {
      localStorage.removeItem('token');
      state.currentUser = null;
    },
    setPreferenceInfo: (state, action) => {
      state.preferenceInfo = action.payload;
    },
    setStaticPortfolio: (state, action) => {
      state.staticPortfolio = action.payload;
    },
  },
});

export default userSlice.reducer;

export const { setCurrentUser, removeCurrentUser, setPreferenceInfo, setStaticPortfolio } = userSlice.actions;
