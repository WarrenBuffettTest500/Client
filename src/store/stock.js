import { createSlice } from '@reduxjs/toolkit';

const stockSlice = createSlice({
  name: 'stockReducer',
  initialState: {searchStockDetails : null},
  reducers: {
    setStockDetails: (state, action) => {
      state.searchStockDetails = action.payload;
    },
  },
});

export default stockSlice.reducer;

export const { setStockDetails } = stockSlice.actions;
