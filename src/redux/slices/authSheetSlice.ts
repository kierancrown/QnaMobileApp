import {createSlice} from '@reduxjs/toolkit';

export interface AuthSheetState {
  sheetOpen: boolean;
}

const initialState: AuthSheetState = {
  sheetOpen: false,
};

export const authSheetSlice = createSlice({
  name: 'authSheet',
  initialState,
  reducers: {
    openAuthSheet: state => {
      state.sheetOpen = true;
    },
    closeAuthSheet: state => {
      state.sheetOpen = false;
    },
  },
});

export const {openAuthSheet, closeAuthSheet} = authSheetSlice.actions;

export default authSheetSlice.reducer;
