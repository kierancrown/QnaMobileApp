import {createSlice} from '@reduxjs/toolkit';

export interface AuthState {
  showOnboarding: boolean;
  skippedAuth: boolean;
  username: string | undefined;
}

const initialState: AuthState = {
  showOnboarding: false,
  skippedAuth: false,
  username: undefined,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    showOnboarding: state => {
      state.showOnboarding = true;
    },
    completeOnboarding: state => {
      state.showOnboarding = false;
    },
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
        payload: string | undefined;
      },
    ) => {
      state.username = action.payload;
    },
  },
});

export const {
  resetAuth,
  skipAuth,
  resetCache,
  setUsernameCache,
  showOnboarding,
  completeOnboarding,
} = authSlice.actions;

export default authSlice.reducer;
