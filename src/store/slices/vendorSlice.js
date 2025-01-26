import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  vendors: [],
  loading: false,
  error: null,
};

const vendorSlice = createSlice({
  name: 'vendors',
  initialState,
  reducers: {
    setVendors: (state, action) => {
      state.vendors = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setVendors, setLoading, setError } = vendorSlice.actions;
export default vendorSlice.reducer;