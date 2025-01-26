import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import vendorReducer from './slices/vendorSlice';
import serviceReducer from './slices/serviceSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    vendors: vendorReducer,
    services: serviceReducer,
  },
});