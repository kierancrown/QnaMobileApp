import {SCREEN_HEIGHT} from '@gorhom/bottom-sheet';
import {createSlice} from '@reduxjs/toolkit';
import {SharedValue} from 'react-native-reanimated';

export interface AuthSheetState {
  sheetOpen: boolean;
  promptReason: 'none' | 'reply' | 'post' | 'follow';
  sheetSnapPoints:
    | (string | number)[]
    | SharedValue<(string | number)[]>
    | undefined;
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
  sheetSnapPoints: [SCREEN_HEIGHT / 2],
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
    setSheetSnapPoints: (
      state,
      action: {payload: AuthSheetState['sheetSnapPoints']},
    ) => {
      state.sheetSnapPoints = action.payload;
    },
  },
});

export const {openAuthSheet, closeAuthSheet, setSheetSnapPoints} =
  authSheetSlice.actions;

export default authSheetSlice.reducer;
