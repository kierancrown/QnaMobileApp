import {useNavigation} from '@react-navigation/native';
import React, {FC, createContext, useContext, useEffect, useState} from 'react';
import {BackHandler, NativeScrollEvent} from 'react-native';
import {SharedValue, runOnJS, useSharedValue} from 'react-native-reanimated';
import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter';

export enum FabAction {
  ADD,
  REPLY,
}

interface TabBarContextData {
  lastScrollY: SharedValue<number>;
  scrollY: SharedValue<number>;
  scrollContentSize: number;
  scrollDirection: 'up' | 'down';
  hideThreshold: number;
  fabAction: FabAction;

  fabEventEmitter: EventEmitter;

  setScrollY: (value: number) => void;
  setHideThreshold: (value: number) => void;
  setContentSize: (value: number) => void;
  setFabAction: (value: FabAction) => void;
}

interface TabBarProviderProps {
  children: React.ReactNode | React.ReactNode[];
}

const TabBarContext = createContext<TabBarContextData>({} as TabBarContextData);

export const TabBarProvider: FC<TabBarProviderProps> = ({children}) => {
  const lastScrollY = useSharedValue(0);
  const scrollY = useSharedValue(0);
  const [scrollContentSize, setContentSize] = useState<number>(0);
  const [fabAction, setFabAction] = useState<FabAction>(FabAction.ADD);

  const [hideThreshold, setHideThreshold] = useState<number>(40);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');

  const setScrollY = (value: number) => {
    // Calculate the direction of the scroll
    let direction: 'up' | 'down' = 'up';
    if (value <= 0 || value >= scrollContentSize - hideThreshold / 2) {
      setScrollDirection(direction);
      return;
    }
    if (value > scrollY.value) {
      direction = 'down';
    }

    // Calculate the scroll amount
    const scrollAmount = Math.abs(value - scrollY.value);

    // Check if the scroll amount exceeds the hide threshold
    if (scrollAmount >= hideThreshold) {
      // Update the scroll direction and last scrollY
      setScrollDirection(direction);
      lastScrollY.value = scrollY.value;
      // Update the scrollY value
      scrollY.value = value;
    }
  };

  // Create a new event emitter instance
  const fabEventEmitter = new EventEmitter();

  // const emitEvent = () => {
  //   fabEventEmitter.emit('onCtaPress');
  // };

  // const addListener = callback => {
  //   fabEventEmitter.addListener('eventName', callback);
  // };

  // // Function to remove listeners
  // const removeListener = callback => {
  //   fabEventEmitter.removeListener('eventName', callback);
  // };

  return (
    <TabBarContext.Provider
      value={{
        scrollY,
        lastScrollY,
        scrollContentSize,
        scrollDirection,
        hideThreshold,
        fabAction,
        fabEventEmitter,
        setHideThreshold,
        setContentSize,
        setScrollY,
        setFabAction,
      }}>
      {children}
    </TabBarContext.Provider>
  );
};

export const useTabBar = () => {
  const context = useContext(TabBarContext);
  return context;
};

interface UseTabBarAnimationProps {
  scrollToTop?: () => void;
}

export const useTabBarAnimation = ({scrollToTop}: UseTabBarAnimationProps) => {
  const navigation = useNavigation();
  const {setScrollY, setContentSize, scrollY, hideThreshold} = useTabBar();

  const scrollHandlerWorklet = (evt: NativeScrollEvent) => {
    'worklet';
    const maxScrollY = evt.contentSize.height - evt.layoutMeasurement.height;
    runOnJS(setContentSize)(maxScrollY);
    runOnJS(setScrollY)(evt.contentOffset.y);
  };

  useEffect(() => {
    const handler = () => {
      if (parseInt(scrollY.value.toFixed(), 10) > hideThreshold) {
        scrollToTop?.();
        return true;
      }
      return false;
    };

    BackHandler.addEventListener('hardwareBackPress', handler);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handler);
    };
  }, [scrollY, navigation, scrollToTop, hideThreshold]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setScrollY(0);
    });

    return unsubscribe;
  }, [navigation, setScrollY]);

  return {scrollHandlerWorklet};
};
