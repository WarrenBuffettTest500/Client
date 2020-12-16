import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchStockDetails: null,
  recommendationSymbolList: [],
  companyProfileList: [],
};

const stockSlice = createSlice({
  name: 'stockReducer',
  initialState,
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
    setCompanyProfileList: (state, action) => {
      state.companyProfileList = action.payload;
    },
    setInitialState: state => state = initialState,
  },
});

export default stockSlice.reducer;

export const {
  setSearchStockDetails,
  setOneWeekStockDetails,
  setOneMonthStockDetails,
  setRecommendationSymbolList,
  setRecommendationSymbolInfo,
  setCompanyProfileList,
  setInitialState,
} = stockSlice.actions;
