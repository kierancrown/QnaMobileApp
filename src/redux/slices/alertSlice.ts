import {createSlice} from '@reduxjs/toolkit';
import {AlertBoxProps} from 'app/components/AlertBox';

export interface GlobalAlertSlice {
  openAlerts: AlertBoxProps[];
}

const initialState: GlobalAlertSlice = {
  openAlerts: [],
};

export const globalNotificationsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    openAlert: (state, action: {payload: Omit<AlertBoxProps, 'id'>}) => {
      state.openAlerts.push({
        id: state.openAlerts.length + 1,
        ...action.payload,
      });
    },
    closeAlert: (state, action: {payload: number}) => {
      state.openAlerts.splice(action.payload, 1);
    },
  },
});

export const {openAlert, closeAlert} = globalNotificationsSlice.actions;

export default globalNotificationsSlice.reducer;
