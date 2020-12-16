import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  preferenceInfo: null,
  staticPortfolio: [],
  recommendationCriterion: 'random',
};

const userSlice = createSlice({
  name: 'userReducer',
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setPreferenceInfo: (state, action) => {
      state.preferenceInfo = action.payload;
    },
    setStaticPortfolio: (state, action) => {
      state.staticPortfolio = action.payload;
    },
    setRecommendationCriterion: (state, action) => {
      state.recommendationCriterion = action.payload;
    },
    initializeUserStates: () => {
      localStorage.removeItem('token');
      return initialState;
    },
  },
});

export default userSlice.reducer;

export const { setCurrentUser, removeCurrentUser, setPreferenceInfo, setStaticPortfolio, setRecommendationCriterion, initializeUserStates } = userSlice.actions;
