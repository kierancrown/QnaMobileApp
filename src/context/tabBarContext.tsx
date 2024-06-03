import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {TabStackParamList} from 'app/navigation/TabStack';
import {ReplyData, setReplyData} from 'app/redux/slices/replySlice';
import {useAppDispatch} from 'app/redux/store';
import React, {
  FC,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {BackHandler, NativeScrollEvent} from 'react-native';
import {SharedValue, runOnJS, useSharedValue} from 'react-native-reanimated';
import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter';

export enum FabAction {
  ADD,
  REPLY,
}
interface TabBarContextData {
  lastScrollY: number;
  scrollY: SharedValue<number>;
  scrollDirection: 'up' | 'down';
  hideThreshold: number;
  fabAction: FabAction;
  hidden: boolean;
  fabEventEmitter: EventEmitter;
  setHidden: (value: boolean) => void;
  setScrollY: (value: number) => void;
  setHideThreshold: (value: number) => void;
  setFabAction: (value: FabAction) => void;
}

interface TabBarProviderProps {
  children: React.ReactNode | React.ReactNode[];
}

const TabBarContext = createContext<TabBarContextData>({} as TabBarContextData);

export const TabBarProvider: FC<TabBarProviderProps> = ({children}) => {
  const lastScrollY = useRef(0);
  const scrollY = useSharedValue(0);
  const [fabAction, setFabAction] = useState<FabAction>(FabAction.ADD);
  const [hidden, setHidden] = useState<boolean>(false);
  const [hideThreshold, setHideThreshold] = useState<number>(40);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');

  const setScrollY = (value: number) => {
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
      lastScrollY.current = scrollY.value;
      // Update the scrollY value
      scrollY.value = value;
    }
  };

  // Create a new event emitter instance
  const fabEventEmitter = new EventEmitter();

  return (
    <TabBarContext.Provider
      value={{
        scrollY,
        lastScrollY: lastScrollY.current,
        scrollDirection,
        hideThreshold,
        fabAction,
        fabEventEmitter,
        setHideThreshold,
        setScrollY,
        setFabAction,
        hidden,
        setHidden,
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
  const {setScrollY, scrollY, hideThreshold} = useTabBar();

  const scrollHandlerWorklet = (evt: NativeScrollEvent) => {
    'worklet';
    // const maxScrollY = evt.contentSize.height - evt.layoutMeasurement.height;
    // runOnJS(setContentSize)(maxScrollY);
    runOnJS(setScrollY)(evt.contentOffset.y);
  };

  useEffect(() => {
    const handler = () => {
      if (parseInt(scrollY.value.toFixed(), 10) > hideThreshold) {
        scrollToTop?.();
        return true;
      }
      if (navigation.canGoBack()) {
        navigation.goBack();
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
  tabName: keyof TabStackParamList;
  onPress: () => void;
}

export const useTabPress = ({tabName, onPress}: UseTabPressProps) => {
  const {fabEventEmitter} = useTabBar();

  useFocusEffect(() => {
    const listener = fabEventEmitter.addListener('tabPress', (name: string) => {
      if (tabName === name) {
        onPress();
      }
    });

    return () => {
      listener.remove();
    };
  });
};

export const useHiddenTabBar = () => {
  const {setHidden} = useTabBar();

  useFocusEffect(() => {
    setHidden(true);
    return () => {
      setHidden(false);
    };
  });
};

export const useReplyTabBar = (data: ReplyData) => {
  const {setFabAction} = useTabBar();
  const dispatch = useAppDispatch();

  useFocusEffect(
    useCallback(() => {
      console.log('mount');
      setFabAction(FabAction.REPLY);
      dispatch(setReplyData(data));
      return () => {
        console.log('called');
        setFabAction(FabAction.ADD);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );
};
