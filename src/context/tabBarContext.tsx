import {useNavigation} from '@react-navigation/native';
import React, {FC, createContext, useContext, useEffect, useState} from 'react';
import {BackHandler, NativeScrollEvent} from 'react-native';
import {SharedValue, runOnJS, useSharedValue} from 'react-native-reanimated';

interface TabBarContextData {
  lastScrollY: SharedValue<number>;
  scrollY: SharedValue<number>;
  scrollContentSize: number;
  scrollDirection: 'up' | 'down';
  hideThreshold: number;

  setScrollY: (value: number) => void;
  setHideThreshold: (value: number) => void;
  setContentSize: (value: number) => void;

  emitTabPress: (tabName: string) => void;
  addTabPressListener: (listener: (tabName: string) => void) => void;
  removeTabPressListener: (listener: (tabName: string) => void) => void;
}

interface TabBarProviderProps {
  children: React.ReactNode | React.ReactNode[];
}

const TabBarContext = createContext<TabBarContextData>({} as TabBarContextData);

export const TabBarProvider: FC<TabBarProviderProps> = ({children}) => {
  const lastScrollY = useSharedValue(0);
  const scrollY = useSharedValue(0);
  const [scrollContentSize, setContentSize] = useState<number>(0);

  const [hideThreshold, setHideThreshold] = useState<number>(40);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');

  const [listeners, setListeners] = useState<((tabName: string) => void)[]>([]);

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

  const emitTabPress = (tabName: string) => {
    // Emitting tab press event
    console.log('Tab Pressed:', tabName);
    // Notify all subscribers
    listeners.forEach(listener => listener(tabName));
  };

  const addTabPressListener = (listener: (tabName: string) => void) => {
    setListeners(prevListeners => [...prevListeners, listener]);
  };

  const removeTabPressListener = (listener: (tabName: string) => void) => {
    setListeners(prevListeners =>
      prevListeners.filter(prevListener => prevListener !== listener),
    );
  };

  return (
    <TabBarContext.Provider
      value={{
        scrollY,
        lastScrollY,
        scrollContentSize,
        scrollDirection,
        hideThreshold,
        emitTabPress,
        addTabPressListener,
        removeTabPressListener,
        setHideThreshold,
        setContentSize,
        setScrollY,
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

interface UseTabPressProps {
  onTabPress: (tabName: string) => void;
}

export const useTabPress = ({onTabPress}: UseTabPressProps) => {
  const {addTabPressListener, removeTabPressListener} = useTabBar();

  useEffect(() => {
    const listener = (tabName: string) => {
      onTabPress(tabName);
    };

    addTabPressListener(listener);

    return () => {
      removeTabPressListener(listener);
    };
  }, [addTabPressListener, onTabPress, removeTabPressListener]);
};
