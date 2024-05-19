import {createSlice} from '@reduxjs/toolkit';
import {PollOptionType} from 'app/components/sheets/AskQuestionSheet/components/Poll';
import {NearGeoLocation} from 'app/hooks/useGeoLocationSearch';
import {Asset} from 'react-native-image-picker';
import {SharedValue} from 'react-native-reanimated';

export interface AskSheetState {
  isLoading: boolean;
  animatedIndex?: SharedValue<number>;
  canSubmit: boolean;
  sheetState: 'closing' | 'closed' | 'open' | 'submitting';
  actionButton: 'close' | 'back';
  selectedLocation?: NearGeoLocation;
  preventSwipeDown?: boolean;

  question: string;
  questionDetail: string;
  questionMedia: Asset[];
  questionPoll: PollOptionType[];
}

const initialState: AskSheetState = {
  isLoading: false,
  canSubmit: false,
  preventSwipeDown: false,
  sheetState: 'closed',
  actionButton: 'close',
  question: '',
  questionDetail: '',
  questionMedia: [],
  questionPoll: [],
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
    setSelectedLocation: (
      state,
      action: {payload: AskSheetState['selectedLocation']},
    ) => {
      state.selectedLocation = action.payload;
    },
    setActionButton: (
      state,
      action: {payload: AskSheetState['actionButton']},
    ) => {
      state.actionButton = action.payload;
    },
    setQuestion: (state, action: {payload: string}) => {
      state.question = action.payload;
    },
    setQuestionDetail: (state, action: {payload: string}) => {
      state.questionDetail = action.payload;
    },
    setQuestionMedia: (state, action: {payload: Asset[]}) => {
      state.questionMedia = action.payload;
    },
    setQuestionPoll: (state, action: {payload: PollOptionType[]}) => {
      state.questionPoll = action.payload;
    },
    setPreventSwipeDown: (state, action: {payload: boolean}) => {
      state.preventSwipeDown = action.payload;
    },
    resetSheet: () => initialState,
  },
});

export const {
  setLoading,
  setAnimatedIndex,
  setCanSubmit,
  setSheetState,
  setActionButton,
  setSelectedLocation,
  setQuestion,
  setQuestionDetail,
  setQuestionMedia,
  setQuestionPoll,
  setPreventSwipeDown,
  resetSheet,
} = askSheetSlice.actions;

export default askSheetSlice.reducer;
