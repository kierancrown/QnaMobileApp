import {combineReducers, configureStore} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

import authSlice from './slices/authSlice';
import globalSheetsSlice from './slices/globalSheetsSlice';
import globalNotificationsSlice from './slices/notificationSlice';
import askSheetSlice from './slices/askSheetSlice';
import searchSlice from './slices/searchSlice';
import replySlice from './slices/replySlice';
import alertSlice from './slices/alertSlice';

const persistConfig = {
  key: 'persisted',
  storage: AsyncStorage,
};

const reducers = combineReducers({
  auth: authSlice,
  notifications: globalNotificationsSlice,
});

const nonPersistedReducers = combineReducers({
  alerts: alertSlice,
  sheets: globalSheetsSlice,
  askSheet: askSheetSlice,
  search: searchSlice,
  reply: replySlice,
});

const rootReducer = combineReducers({
  persistent: persistReducer(persistConfig, reducers),
  nonPersistent: nonPersistedReducers,
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const persistor = persistStore(store);
