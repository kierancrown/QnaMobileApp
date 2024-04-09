import {combineReducers, configureStore} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

import themeSettingsSlice from './slices/themeSettingsSlice';
import globalSheetsSlice from './slices/globalSheetsSlice';
import authSlice from './slices/authSlice';

const persistConfig = {
  key: 'persisted',
  storage: AsyncStorage,
};

const reducers = combineReducers({
  auth: authSlice,
  theme: themeSettingsSlice,
});

const nonPersistedReducers = combineReducers({
  sheets: globalSheetsSlice,
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

export const persistor = persistStore(store);
