import {createSlice} from '@reduxjs/toolkit';

export interface GlobalNotificationState {
  unreadCount: number;
}

const initialState: GlobalNotificationState = {
  unreadCount: 0,
};

export const globalNotificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setUnreadCount: (
      state,
      action: {
        payload: number;
      },
    ) => {
      state.unreadCount = action.payload;
    },
  },
});

export const {setUnreadCount} = globalNotificationsSlice.actions;

export default globalNotificationsSlice.reducer;
