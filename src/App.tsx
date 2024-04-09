import React, {FC} from 'react';
import RootStack from './navigation/RootStack';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {persistor, store} from './redux/store';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {SafeAreaProvider} from 'react-native-safe-area-context';

import ThemeProvider from './wrappers/ThemeProvider';

const gestureStyle = {flex: 1};

const App: FC = () => {
  return (
    <GestureHandlerRootView style={gestureStyle}>
      <SafeAreaProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ThemeProvider>
              <RootStack />
            </ThemeProvider>
          </PersistGate>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
