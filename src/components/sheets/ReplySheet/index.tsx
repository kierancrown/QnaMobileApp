import React, {FC, useCallback, useMemo, useRef} from 'react';
import BottomSheet, {SCREEN_HEIGHT} from '@gorhom/bottom-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSharedValue} from 'react-native-reanimated';
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

import Screen from './screens/ReplyScreen';

interface ReplySheetProps {
  open?: boolean;
  onClose?: () => void;
  onSubmit: () => void;
  avatarImageUrl: string;
  replyingToUsername: string;
  replyingToVerified: boolean;
}

export type ReplyStackParamList = {
  ReplyScreen: {
    avatarImageUrl: string;
    replyingToUsername: string;
    replyingToVerified: boolean;
  };
};

export const navigationRef = createNavigationContainerRef();
const Stack = createStackNavigator<ReplyStackParamList>();

interface NavigatorProps {
  avatarImageUrl: string;
  replyingToUsername: string;
  replyingToVerified: boolean;
}

const Navigator: FC<NavigatorProps> = ({
  avatarImageUrl,
  replyingToUsername,
  replyingToVerified,
}) => {
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
          backgroundColor: theme.colors.inputBackground,
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
        backgroundColor: theme.colors.inputBackground,
        borderStartStartRadius: theme.borderRadii.xl,
        borderStartEndRadius: theme.borderRadii.xl,
        overflow: 'hidden',
      },
    }),
    [forCardPopin, theme.borderRadii.xl, theme.colors.inputBackground],
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
        <Stack.Screen
          name="ReplyScreen"
          component={Screen}
          initialParams={{
            avatarImageUrl,
            replyingToUsername,
            replyingToVerified,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const ReplySheet: FC<ReplySheetProps> = ({
  open = false,
  onClose,
  avatarImageUrl,
  replyingToUsername,
  replyingToVerified,
}) => {
  const sheetRef = useRef<BottomSheet>(null);
  const animatedPosition = useSharedValue(0);
  const {top: topSafeAreaInset} = useSafeAreaInsets();
  const snapPoints = useMemo(() => ['50%'], []);

  const onDismiss = useCallback(() => {
    sheetRef.current?.close();
    return true;
  }, []);

  const handleSheetChanges = useCallback(
    (index: number) => {
      console.log('index', index);
      if (index === -1) {
        onClose?.();
      }
    },
    [onClose],
  );

  useAndroidBack(onDismiss);

  return (
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
      <Navigator
        avatarImageUrl={avatarImageUrl}
        replyingToUsername={replyingToUsername}
        replyingToVerified={replyingToVerified}
      />
    </BottomSheet>
  );
};

export default ReplySheet;
