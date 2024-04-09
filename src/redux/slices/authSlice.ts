import {createSlice} from '@reduxjs/toolkit';

export interface AuthState {
  skippedAuth: boolean;
}

const initialState: AuthState = {
  skippedAuth: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    skipAuth: state => {
      state.skippedAuth = true;
    },
    resetAuth: state => {
      state.skippedAuth = false;
    },
  },
});

export const {resetAuth, skipAuth} = authSlice.actions;

export default authSlice.reducer;
