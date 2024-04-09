import {createSlice} from '@reduxjs/toolkit';
import {Username} from 'app/lib/supabase/types';

export interface AuthState {
  skippedAuth: boolean;
  username: Username | undefined;
}

const initialState: AuthState = {
  skippedAuth: false,
  username: undefined,
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
    resetCache: state => {
      state.username = undefined;
    },
    setUsernameCache: (
      state,
      action: {
        payload: Username | undefined;
      },
    ) => {
      state.username = action.payload;
    },
  },
});

export const {resetAuth, skipAuth, resetCache, setUsernameCache} =
  authSlice.actions;

export default authSlice.reducer;
