import {createSlice} from '@reduxjs/toolkit';

export interface IThemeSettingsState {
  mode: 'system' | 'light' | 'dark';
}

const initialState: IThemeSettingsState = {
  mode: 'system',
};

export const themeSettingsSlice = createSlice({
  name: 'themeSettings',
  initialState,
  reducers: {
    setMode: (
      state,
      action: {
        payload: 'system' | 'light' | 'dark';
      },
    ) => {
      state.mode = action.payload;
    },
  },
});

export const {setMode} = themeSettingsSlice.actions;

export default themeSettingsSlice.reducer;
