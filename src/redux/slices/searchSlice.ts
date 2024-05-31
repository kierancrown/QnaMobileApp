import {createSlice} from '@reduxjs/toolkit';

export interface SearchState {
  searchTerm: string;
  headerTabs: string[];
  selectedTab?: string;
}

const initialState: SearchState = {
  searchTerm: '',
  headerTabs: ['Topics', 'People', 'Questions'],
  selectedTab: undefined,
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchTerm: (
      state,
      action: {
        payload: string;
      },
    ) => {
      state.searchTerm = action.payload;
    },
    clearSearchTerm: state => {
      state.searchTerm = '';
    },
    setSelectedTab: (
      state,
      action: {
        payload: string;
      },
    ) => {
      if (state.selectedTab === action.payload) {
        state.selectedTab = undefined;
        return;
      }
      if (!state.headerTabs.includes(action.payload)) {
        return;
      }
      state.selectedTab = action.payload;
    },
    clearSelectedTab: state => {
      state.selectedTab = undefined;
    },
  },
});

export const {
  setSearchTerm,
  clearSearchTerm,
  setSelectedTab,
  clearSelectedTab,
} = searchSlice.actions;

export default searchSlice.reducer;
