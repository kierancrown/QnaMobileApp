import {createSlice} from '@reduxjs/toolkit';

export interface ReplyState {
  sheetState: 'closed' | 'open' | 'loading';
  questionId: number | null;
}

const initialState: ReplyState = {
  sheetState: 'closed',
  questionId: null,
};

export const replySlice = createSlice({
  name: 'reply',
  initialState,
  reducers: {
    setSheetState: (state, action) => {
      state.sheetState = action.payload;
    },
    setQuestionId: (state, action) => {
      state.questionId = action.payload;
    },
    clearQuestionId: state => {
      state.questionId = null;
    },
  },
});

export const {setSheetState, setQuestionId, clearQuestionId} =
  replySlice.actions;

export default replySlice.reducer;
