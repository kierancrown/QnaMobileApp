import {createSlice} from '@reduxjs/toolkit';

export interface ReplyState {
  showBackdrop: boolean;
}

const initialState: ReplyState = {
  showBackdrop: false,
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
  },
});

export const {setShowBackdrop} = replySlice.actions;

export default replySlice.reducer;
