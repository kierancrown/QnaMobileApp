import {createSlice} from '@reduxjs/toolkit';

export interface AuthState {
  showOnboarding: boolean;
  skippedAuth: boolean;
  username: string | undefined;
  deletedAccount: boolean;
}

const initialState: AuthState = {
  showOnboarding: false,
  skippedAuth: false,
  username: undefined,
  deletedAccount: false,
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
    deletedAccount: state => {
      state.username = undefined;
      state.showOnboarding = false;
      state.skippedAuth = false;
      state.deletedAccount = true;
    },
    resetDeletedAccount: state => {
      state.deletedAccount = false;
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
  deletedAccount,
  resetDeletedAccount,
} = authSlice.actions;

export default authSlice.reducer;
