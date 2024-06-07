import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  FC,
  useState,
  useEffect,
} from 'react';
import {AlertBoxProps} from 'app/components/AlertBox';
import {Center, Flex} from './common';
import AlertBox from './AlertBox';
import {Pressable, StyleSheet, ViewStyle} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

// Define the types
interface GlobalAlertState {
  openAlerts: AlertBoxProps[];
}

interface AlertContextProps {
  state: GlobalAlertState;
  openAlert: (alert: Omit<AlertBoxProps, 'id'>) => void;
  closeAlert: (id: number) => void;
}

interface CombinedAlertProps {
  children: ReactNode;
}

const pressableStyle: ViewStyle = {
  flex: 1,
};

// Initial state
const initialState: GlobalAlertState = {
  openAlerts: [],
};

// Reducer
const alertReducer = (
  state: GlobalAlertState,
  action: {type: string; payload?: any},
) => {
  switch (action.type) {
    case 'OPEN_ALERT':
      return {
        ...state,
        openAlerts: [
          ...state.openAlerts,
          {
            id: state.openAlerts.length + 1,
            ...action.payload,
          },
        ],
      };
    case 'CLOSE_ALERT':
      return {
        ...state,
        openAlerts: state.openAlerts.filter(
          alert => alert.id !== action.payload,
        ),
      };
    default:
      return state;
  }
};

// Create context
const AlertContext = createContext<AlertContextProps | undefined>(undefined);

// Custom hook to use the AlertContext
const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

// Combined provider and wrapper component
const CombinedAlert: FC<CombinedAlertProps> = ({children}) => {
  const [state, dispatch] = useReducer(alertReducer, initialState);
  const [backdropVisible, setBackdropVisible] = useState(false);
  const boxScale = useSharedValue(1);

  useEffect(() => {
    if (state.openAlerts.length > 0) {
      setBackdropVisible(true);
    }
  }, [state.openAlerts]);

  const openAlert = (alert: Omit<AlertBoxProps, 'id'>) => {
    dispatch({type: 'OPEN_ALERT', payload: alert});
  };

  const closeAlert = (id: number) => {
    dispatch({type: 'CLOSE_ALERT', payload: id});
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(backdropVisible ? 1 : 0, {
        duration: 300,
      }),
    };
  }, [backdropVisible]);

  const boxAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: boxScale.value}],
    };
  });

  return (
    <AlertContext.Provider value={{state, openAlert, closeAlert}}>
      <Flex>
        {children}
        <Animated.View
          pointerEvents={backdropVisible ? 'auto' : 'none'}
          style={[StyleSheet.absoluteFillObject, animatedStyle]}>
          <Pressable
            style={pressableStyle}
            onPress={() => {
              boxScale.value = withSequence(
                withTiming(1.025, {duration: 66}),
                withTiming(1, {duration: 66}),
              );
            }}>
            <Center flex={1} bg="mainBackgroundHalf" px="m" py="mY">
              {state.openAlerts.map(alert => (
                <AlertBox
                  key={alert.id}
                  {...alert}
                  animatedStyle={boxAnimatedStyle}
                  onDismissing={() => {
                    if (state.openAlerts.length < 2) {
                      setBackdropVisible(false);
                    }
                  }}
                />
              ))}
            </Center>
          </Pressable>
        </Animated.View>
      </Flex>
    </AlertContext.Provider>
  );
};

export {CombinedAlert, useAlert};
