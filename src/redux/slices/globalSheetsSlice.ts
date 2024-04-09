import {createSlice} from '@reduxjs/toolkit';

export interface IGlobalSheetsState {
  webViewSheet: {
    url: string;
    title: string;
    open: boolean;
  };
}

const initialState: IGlobalSheetsState = {
  webViewSheet: {
    url: '',
    title: 'Help',
    open: false,
  },
};

export const globalSheetSlice = createSlice({
  name: 'sheets',
  initialState,
  reducers: {
    openWebViewSheet: (
      state,
      action: {
        payload: {
          url: string;
          title: string;
        };
      },
    ) => {
      state.webViewSheet = {
        url: action.payload.url,
        title: action.payload.title,
        open: true,
      };
    },
    closeWebViewSheet: state => {
      state.webViewSheet.open = false;
    },
  },
});

export const {openWebViewSheet, closeWebViewSheet} = globalSheetSlice.actions;

export default globalSheetSlice.reducer;
