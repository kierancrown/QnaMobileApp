import {createSlice} from '@reduxjs/toolkit';
import {SharedValue} from 'react-native-reanimated';

export interface AskSheetState {
  isLoading: boolean;
  animatedIndex?: SharedValue<number>;
  canSubmit: boolean;
  sheetState: 'closing' | 'closed' | 'open' | 'submitting';
  actionButton: 'close' | 'back';
}

const initialState: AskSheetState = {
  isLoading: false,
  canSubmit: false,
  sheetState: 'closed',
  actionButton: 'close',
};

export const askSheetSlice = createSlice({
  name: 'askSheet',
  initialState,
  reducers: {
    setLoading: (state, action: {payload: boolean}) => {
      state.isLoading = action.payload;
    },
    setAnimatedIndex: (state, action: {payload: SharedValue<number>}) => {
      state.animatedIndex = action.payload;
    },
    setCanSubmit: (state, action: {payload: boolean}) => {
      state.canSubmit = action.payload;
    },
    setSheetState: (state, action: {payload: AskSheetState['sheetState']}) => {
      state.sheetState = action.payload;
    },
    setActionButton: (
      state,
      action: {payload: AskSheetState['actionButton']},
    ) => {
      state.actionButton = action.payload;
    },
  },
});

export const {
  setLoading,
  setAnimatedIndex,
  setCanSubmit,
  setSheetState,
  setActionButton,
} = askSheetSlice.actions;

export default askSheetSlice.reducer;
