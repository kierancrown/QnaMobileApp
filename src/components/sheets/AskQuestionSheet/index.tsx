import React, {FC, useCallback, useEffect, useMemo, useRef} from 'react';
import BottomSheet, {SCREEN_HEIGHT} from '@gorhom/bottom-sheet';
import {Keyboard, Pressable, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import CustomBackground from '../../common/Sheets/Background';
import CustomBackdrop from './Backdrop';
import {Button, Center, Flex, HStack, Icon} from 'app/components/common';
import {useAppTheme} from 'app/styles/theme';
import CloseIcon from 'app/assets/icons/actions/Close.svg';
import BackIcon from 'app/assets/icons/arrows/ArrowLeft.svg';

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
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from 'app/redux/store';
import {setSheetState} from 'app/redux/slices/askSheetSlice';

import useAndroidBack from 'app/hooks/useAndroidBack';

import Screen from './screens/AskScreen';
import LocationsScreen from './screens/LocationScreen';
import ManageTagsScreen from './screens/ManageTagsScreen';

interface AskQuestionSheetProps {
  open?: boolean;
  onClose?: () => void;
  onSubmit: () => void;
}

export type AskQuestionStackParamList = {
  AskScreen: undefined;
  LocationScreen: undefined;
  ManageTagsScreen: undefined;
};

export const navigationRef = createNavigationContainerRef();
const Stack = createStackNavigator<AskQuestionStackParamList>();

const Navigator: FC = () => {
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
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name="AskScreen" component={Screen} />
        <Stack.Screen name="LocationScreen" component={LocationsScreen} />
        <Stack.Screen name="ManageTagsScreen" component={ManageTagsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const AskQuestionSheet: FC<AskQuestionSheetProps> = ({
  open = false,
  onClose,
  onSubmit,
}) => {
  const sheetRef = useRef<BottomSheet>(null);
  const animatedPosition = useSharedValue(0);
  const topSafeAreaInset = useSafeAreaInsets().top;
  const dispatch = useDispatch<AppDispatch>();
  const {canSubmit, actionButton} = useSelector(
    (state: RootState) => state.nonPersistent.askSheet,
  );
  const theme = useAppTheme();
  const BUTTON_CONTAINER_HEIGHT = theme.spacing.xlY;

  const snapPoints = useMemo(
    () => [
      SCREEN_HEIGHT -
        topSafeAreaInset -
        theme.spacing.mY -
        BUTTON_CONTAINER_HEIGHT,
    ],
    [topSafeAreaInset, theme, BUTTON_CONTAINER_HEIGHT],
  );

  const onDismiss = useCallback(() => {
    if (actionButton === 'close') {
      sheetRef.current?.close();
    } else {
      navigationRef.current?.goBack();
    }
  }, [actionButton]);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose?.();
      }
    },
    [onClose],
  );

  useAndroidBack(onDismiss);

  const buttonsContainerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          animatedPosition.value,
          [-1, 0],
          [theme.spacing.lY, 0],
          Extrapolation.CLAMP,
        ),
      },
    ],
    opacity: interpolate(
      animatedPosition.value,
      [-0.5, 0],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  const askButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(actionButton === 'close' ? 1 : 0, {
        duration: 200,
      }),
    };
  }, [actionButton]);

  useEffect(() => {
    dispatch(setSheetState(open ? 'open' : 'closed'));
  }, [dispatch, open]);

  return (
    <>
      <Animated.View
        pointerEvents={open ? 'auto' : 'none'}
        style={[
          styles.buttons,
          {bottom: snapPoints[0] + theme.spacing.sY},
          buttonsContainerAnimatedStyle,
        ]}>
        <HStack alignItems="center" height={BUTTON_CONTAINER_HEIGHT} px="m">
          <Pressable hitSlop={16} onPress={onDismiss}>
            <Center>
              {actionButton === 'close' ? (
                <Icon icon={<CloseIcon />} color="foreground" size="l" />
              ) : (
                <Icon icon={<BackIcon />} color="foreground" size="l" />
              )}
            </Center>
          </Pressable>
          <Flex />
          <Animated.View style={askButtonAnimatedStyle}>
            <Button
              title="Ask"
              disabled={!canSubmit}
              py="none"
              height={BUTTON_CONTAINER_HEIGHT}
              justifyContent="center"
              borderRadius="pill"
              px="l"
              onPress={() => {
                sheetRef.current?.close();
                onSubmit();
              }}
            />
          </Animated.View>
        </HStack>
      </Animated.View>
      <BottomSheet
        ref={sheetRef}
        index={open ? 0 : -1}
        animateOnMount={false}
        handleComponent={null}
        snapPoints={snapPoints}
        keyboardBehavior="extend"
        enablePanDownToClose={true}
        onChange={handleSheetChanges}
        animatedIndex={animatedPosition}
        backdropComponent={CustomBackdrop}
        backgroundComponent={CustomBackground}
        maxDynamicContentSize={SCREEN_HEIGHT - topSafeAreaInset}
        onAnimate={(fromIndex, toIndex) => {
          if (fromIndex === 0 && toIndex === -1) {
            Keyboard.dismiss();
          }
        }}>
        <Navigator />
      </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  buttons: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 999,
  },
});

export default AskQuestionSheet;
