import React, {FC, useCallback, useEffect, useMemo, useRef} from 'react';
import BottomSheet, {SCREEN_HEIGHT} from '@gorhom/bottom-sheet';
import Screen from './screens/AskScreen';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Pressable,
  StyleSheet,
} from 'react-native';
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
  StackNavigationOptions,
  TransitionPresets,
} from '@react-navigation/stack';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from 'app/redux/store';
import {
  resetSheet,
  setLoading,
  setSheetState,
} from 'app/redux/slices/askSheetSlice';
import LocationsScreen from './screens/LocationScreen';
import useAndroidBack from 'app/hooks/useAndroidBack';

interface AskQuestionSheetProps {
  open?: boolean;
  onClose?: () => void;
}

export type AskQuestionStackParamList = {
  AskScreen: undefined;
  LocationScreen: undefined;
};

export const navigationRef = createNavigationContainerRef();
const Stack = createStackNavigator<AskQuestionStackParamList>();

const Navigator: FC = () => {
  const theme = useAppTheme();

  const screenOptions = useMemo<StackNavigationOptions>(
    () => ({
      ...TransitionPresets.SlideFromRightIOS,
      headerShown: false,
      safeAreaInsets: {top: 0},
    }),
    [],
  );

  return (
    <NavigationContainer
      ref={navigationRef}
      independent={true}
      theme={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: theme.colors.mainBackground,
        },
      }}>
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name="AskScreen" component={Screen} />
        <Stack.Screen name="LocationScreen" component={LocationsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const AskQuestionSheet: FC<AskQuestionSheetProps> = ({
  open = false,
  onClose,
}) => {
  const sheetRef = useRef<BottomSheet>(null);
  const animatedPosition = useSharedValue(0);
  const topSafeAreaInset = useSafeAreaInsets().top;
  const dispatch = useDispatch<AppDispatch>();
  const {
    isLoading,
    canSubmit,
    actionButton,
    question,
    questionDetail,
    questionMedia,
    questionPoll,
  } = useSelector((state: RootState) => state.nonPersistent.askSheet);
  const theme = useAppTheme();
  const BUTTON_CONTAINER_HEIGHT = theme.spacing.xlY;

  const enablePanDown = useMemo(
    () => !isLoading && actionButton === 'close',
    [isLoading, actionButton],
  );

  const snapPoints = useMemo(
    () => [
      SCREEN_HEIGHT -
        topSafeAreaInset -
        theme.spacing.mY -
        BUTTON_CONTAINER_HEIGHT,
    ],
    [topSafeAreaInset, theme, BUTTON_CONTAINER_HEIGHT],
  );

  const isEmpty = useMemo(
    () =>
      !question.length &&
      !questionDetail.length &&
      !questionMedia.length &&
      !questionPoll.length,
    [question, questionDetail, questionMedia, questionPoll],
  );

  const beforeClose = useCallback(() => {
    if (isLoading) {
      Alert.alert(
        'Cancel posting',
        'Are you sure you want to cancel posting this question? You will lose this data.',
        [
          {
            text: 'Yes',
            style: 'destructive',
            onPress: () => {
              dispatch(resetSheet());
              sheetRef.current?.close();
            },
          },
          {
            text: 'No',
            style: 'cancel',
          },
        ],
      );
      sheetRef.current?.snapToIndex(0);
      return false;
    }

    if (!isEmpty) {
      Alert.alert(
        'Discard changes',
        'Are you sure you want to discard changes? You will lose this data.',
        [
          {
            text: 'Yes',
            style: 'destructive',
            onPress: () => {
              dispatch(resetSheet());
              sheetRef.current?.close();
            },
          },
          {
            text: 'No',
            style: 'cancel',
          },
        ],
      );
      sheetRef.current?.snapToIndex(0);
      return false;
    }

    return true;
  }, [isLoading, isEmpty, dispatch]);

  const onDismiss = useCallback(() => {
    console.log('onDismiss');
    if (actionButton === 'close') {
      console.log('beforeClose', beforeClose());
      if (beforeClose() === true) {
        sheetRef.current?.close();
      }
    } else {
      navigationRef.current?.goBack();
    }
  }, [actionButton, beforeClose]);

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

  const submit = async () => {
    dispatch(setLoading(true));
    setTimeout(() => {
      dispatch(resetSheet());
      onDismiss();
    }, 2000);
  };

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
              {isLoading ? (
                <ActivityIndicator size="small" />
              ) : actionButton === 'close' ? (
                <Icon icon={<CloseIcon />} color="foreground" size="l" />
              ) : (
                <Icon icon={<BackIcon />} color="foreground" size="l" />
              )}
            </Center>
          </Pressable>
          <Flex />
          <Animated.View style={askButtonAnimatedStyle}>
            <Button
              title={isLoading ? 'Asking' : 'Ask'}
              disabled={!canSubmit}
              py="none"
              height={BUTTON_CONTAINER_HEIGHT}
              justifyContent="center"
              borderRadius="pill"
              px="l"
              onPress={submit}
            />
          </Animated.View>
        </HStack>
      </Animated.View>
      <BottomSheet
        snapPoints={snapPoints}
        index={open ? 0 : -1}
        ref={sheetRef}
        animateOnMount={false}
        animatedIndex={animatedPosition}
        enablePanDownToClose={enablePanDown}
        keyboardBehavior="extend"
        maxDynamicContentSize={SCREEN_HEIGHT - topSafeAreaInset}
        onChange={handleSheetChanges}
        backdropComponent={CustomBackdrop}
        handleComponent={null}
        backgroundComponent={CustomBackground}
        onAnimate={(fromIndex, toIndex) => {
          if (fromIndex === 0 && toIndex === -1) {
            beforeClose();
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
