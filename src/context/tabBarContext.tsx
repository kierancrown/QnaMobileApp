import React, {FC, createContext, useContext, useState} from 'react';
import {SharedValue, useSharedValue} from 'react-native-reanimated';

interface TabBarContextData {
  lastScrollY: SharedValue<number>;
  scrollY: SharedValue<number>;
  scrollDirection: 'up' | 'down';
  hideThreshold: number;

  setScrollY: (value: number) => void;
  setHideThreshold: (value: number) => void;
}

interface TabBarProviderProps {
  children: React.ReactNode | React.ReactNode[];
}

const TabBarContext = createContext<TabBarContextData>({} as TabBarContextData);

export const TabBarProvider: FC<TabBarProviderProps> = ({children}) => {
  const lastScrollY = useSharedValue(0);
  const scrollY = useSharedValue(0);

  const [hideThreshold, setHideThreshold] = useState<number>(40);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');

  const setScrollY = (value: number) => {
    // Calculate the direction of the scroll
    let direction: 'up' | 'down' = 'up';
    if (value <= 0) {
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
    } else {
      // If the scroll amount is less than the hide threshold, ignore the scroll
      console.log(
        'Scroll amount is less than the hide threshold. Ignoring the scroll.',
      );
    }
  };

  return (
    <TabBarContext.Provider
      value={{
        scrollY,
        lastScrollY,
        scrollDirection,
        hideThreshold,
        setHideThreshold,
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
