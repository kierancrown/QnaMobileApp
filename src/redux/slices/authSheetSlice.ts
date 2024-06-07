import {createSlice} from '@reduxjs/toolkit';

export interface AuthSheetState {
  sheetOpen: boolean;
  promptReason: 'none' | 'reply' | 'post' | 'follow';
}

export enum ReasonText {
  reply = ' reply to others',
  post = ' post new questions',
  follow = ' follow other users',
  bookmarks = ' bookmark questions',
  like = ' like questions and replies',
  none = ' post new questions',
}

const initialState: AuthSheetState = {
  sheetOpen: false,
  promptReason: 'none',
};

export const authSheetSlice = createSlice({
  name: 'authSheet',
  initialState,
  reducers: {
    openAuthSheet: (
      state,
      action: {
        payload: AuthSheetState['promptReason'];
      },
    ) => {
      state.sheetOpen = true;
      state.promptReason = action.payload;
    },
    closeAuthSheet: state => {
      state.sheetOpen = false;
    },
  },
});

export const {openAuthSheet, closeAuthSheet} = authSheetSlice.actions;

export default authSheetSlice.reducer;
