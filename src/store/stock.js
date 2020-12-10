import { createSlice } from '@reduxjs/toolkit';

const stockSlice = createSlice({
  name: 'stockReducer',
  initialState: {
    searchStockDetails: null,
  },
  reducers: {
    setSearchStockDetails: (state, action) => {
      state.searchStockDetails = action.payload;
    },
    setOneWeekStockDetails: (state, action) => {
      state.oneWeekStockDetails = action.payload;
    },
    setOneMonthStockDetails: (state, action) => {
      state.oneMonthStockDetails = action.payload;
    },
    setRecommendationSymbolList: (state, action) => {
      state.recommendationSymbolList = action.payload;
    },
    setRecommendationSymbolInfo: (state, action) => {
      state.recommendationSymbolInfo = action.payload;
    },
  },
});

export default stockSlice.reducer;

export const {
  setSearchStockDetails,
  setOneWeekStockDetails,
  setOneMonthStockDetails,
  setRecommendationSymbolList,
  setRecommendationSymbolInfo,
} = stockSlice.actions;
