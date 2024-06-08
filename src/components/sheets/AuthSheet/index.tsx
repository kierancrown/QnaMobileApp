import React, {FC, useCallback, useEffect, useMemo, useRef} from 'react';
import BottomSheet, {SCREEN_HEIGHT} from '@gorhom/bottom-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import CustomBackground from './components/Background';
import {useAppTheme} from 'app/styles/theme';

import {
  NavigationContainer,
  DefaultTheme,
  createNavigationContainerRef,
} from '@react-navigation/native';
import {
  createStackNavigator,
  StackCardStyleInterpolator,
  StackNavigationOptions,
} from '@react-navigation/stack';

import useAndroidBack from 'app/hooks/useAndroidBack';
import Screen from './screens/AuthScreen';
import AuthPromptScreen from './screens/AuthPromptScreen';
import {Pressable, StyleSheet, ViewStyle} from 'react-native';
import {Flex} from 'app/components/common';

interface AuthSheetProps {
  open?: boolean;
  onClose?: () => void;
}

export type AuthStackParamList = {
  AuthPromptScreen: {
    reason: string;
  };
  AuthScreen: {};
};

export const navigationRef = createNavigationContainerRef<AuthStackParamList>();
const Stack = createStackNavigator<AuthStackParamList>();

const backdropPressableStyle: ViewStyle = {
  flex: 1,
};

interface NavigatorProps {}

const Navigator: FC<NavigatorProps> = ({}) => {
  const theme = useAppTheme();

  const forCardPopin: StackCardStyleInterpolator = useCallback(
    ({current, next}) => {
      const progress = current.progress;
      const nextProgress = next ? next.progress : undefined;

      return {
        cardStyle: {
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [theme.spacing.xlY, 0],
              }),
            },
          ],
          opacity: progress,
          backgroundColor: theme.colors.mainBackground,
          borderTopLeftRadius: theme.borderRadii.xl,
          borderTopRightRadius: theme.borderRadii.xl,
          overflow: 'hidden',
        },
        containerStyle: {
          opacity: nextProgress?.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0],
          }),
        },
      };
    },
    [theme],
  );

  const screenOptions = useMemo<StackNavigationOptions>(
    () => ({
      headerShown: false,
      safeAreaInsets: {top: 0},
      cardStyleInterpolator: forCardPopin,
      cardStyle: {
        backgroundColor: theme.colors.mainBackground,
        borderStartStartRadius: theme.borderRadii.xl,
        borderStartEndRadius: theme.borderRadii.xl,
        overflow: 'hidden',
      },
    }),
    [forCardPopin, theme.borderRadii.xl, theme.colors.mainBackground],
  );

  return (
    <NavigationContainer
      ref={navigationRef}
      independent={true}
      theme={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: theme.colors.none,
        },
      }}>
      <Stack.Navigator
        screenOptions={screenOptions}
        initialRouteName="AuthPromptScreen">
        <Stack.Screen name="AuthPromptScreen" component={AuthPromptScreen} />
        <Stack.Screen name="AuthScreen" component={Screen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const AuthSheet: FC<AuthSheetProps> = ({open = false, onClose}) => {
  const sheetRef = useRef<BottomSheet>(null);
  const animatedPosition = useSharedValue(0);
  const {top: topSafeAreaInset} = useSafeAreaInsets();
  const snapPoints = useMemo(() => ['50%'], []);
  const theme = useAppTheme();

  useEffect(() => {
    if (open) {
      navigationRef.navigate('AuthPromptScreen', {reason: 'none'});
    }
  }, [open]);

  const onDismiss = useCallback(() => {
    sheetRef.current?.close();
    return true;
  }, []);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose?.();
      }
    },
    [onClose],
  );

  const backdropStyle = useAnimatedStyle(
    () => ({
      opacity: interpolate(animatedPosition.value, [-1, 0], [0, 1]),
      backgroundColor: theme.colors.sheetBackdrop,
      ...StyleSheet.absoluteFillObject,
    }),
    [theme.colors.sheetBackdrop],
  );

  useAndroidBack(onDismiss);

  return (
    <>
      <Animated.View
        style={backdropStyle}
        pointerEvents={open ? 'auto' : 'none'}>
        <Pressable onPress={onDismiss} style={backdropPressableStyle}>
          <Flex />
        </Pressable>
      </Animated.View>
      <BottomSheet
        ref={sheetRef}
        index={open ? 0 : -1}
        handleComponent={null}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        animatedIndex={animatedPosition}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        backdropComponent={null}
        enablePanDownToClose
        backgroundComponent={CustomBackground}
        maxDynamicContentSize={SCREEN_HEIGHT - topSafeAreaInset}>
        <Navigator />
      </BottomSheet>
    </>
  );
};

export default AuthSheet;
