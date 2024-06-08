import {createSlice} from '@reduxjs/toolkit';

export interface AuthState {
  showOnboarding: boolean;
  skippedAuth: boolean;
  username: string | undefined;
  avatarImageUrl: string | undefined;
  isVerified: boolean;
  deletedAccount: boolean;
}

const initialState: AuthState = {
  showOnboarding: false,
  skippedAuth: false,
  username: undefined,
  avatarImageUrl: undefined,
  isVerified: false,
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
      state.username = undefined;
      state.avatarImageUrl = undefined;
      state.isVerified = false;
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
    setAvatarImageUrl: (state, action) => {
      state.avatarImageUrl = action.payload;
    },
    setUsernameCache: (
      state,
      action: {
        payload:
          | {
              username: string;
              isVerified: boolean;
            }
          | undefined;
      },
    ) => {
      state.username = action.payload?.username;
      state.isVerified = action.payload?.isVerified ?? false;
    },
  },
});

export const {
  resetAuth,
  skipAuth,
  resetCache,
  setUsernameCache,
  setAvatarImageUrl,
  showOnboarding,
  completeOnboarding,
  deletedAccount,
  resetDeletedAccount,
} = authSlice.actions;

export default authSlice.reducer;
