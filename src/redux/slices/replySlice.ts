import {createSlice} from '@reduxjs/toolkit';

export interface ReplyData {
  avatarImageUrl: string;
  username: string;
  verified: boolean;
}

export interface ReplyState {
  showBackdrop: boolean;
  userAvatarImageUrl?: string;
  replyToUsername?: string;
  replyToVerified?: boolean;
  replySheetOpen: boolean;
}

const initialState: ReplyState = {
  showBackdrop: false,
  replySheetOpen: false,
};

export const replySlice = createSlice({
  name: 'reply',
  initialState,
  reducers: {
    setShowBackdrop: (
      state,
      action: {
        payload: boolean;
      },
    ) => {
      state.showBackdrop = action.payload;
    },
    setReplyData: (
      state,
      action: {
        payload: ReplyData;
      },
    ) => {
      state.userAvatarImageUrl = action.payload.avatarImageUrl;
      state.replyToUsername = action.payload.username;
      state.replyToVerified = action.payload.verified;
    },
    openReplySheet: state => {
      state.replySheetOpen = true;
    },
    closeReplySheet: state => {
      state.replySheetOpen = false;
    },
  },
});

export const {setShowBackdrop, setReplyData, openReplySheet, closeReplySheet} =
  replySlice.actions;

export default replySlice.reducer;
