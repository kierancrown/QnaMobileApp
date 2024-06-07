import React, {FC, Fragment, useEffect} from 'react';
import {
  BottomTabDescriptorMap,
  BottomTabNavigationEventMap,
} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import {
  NavigationHelpers,
  ParamListBase,
  TabNavigationState,
} from '@react-navigation/native';
import {Box, Center, HStack, Text, VStack} from 'ui';
import {useTheme} from '@shopify/restyle';
import staticTheme, {Theme} from 'app/styles/theme';

import {Pressable, StyleProp, ViewStyle} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {FabAction, useTabBar} from 'app/context/tabBarContext';
import {WINDOW_WIDTH} from '@gorhom/bottom-sheet';

import PlusIcon from 'app/assets/icons/actions/Plus.svg';
import Badge from '../Badge';
import {useHaptics, HapticFeedbackTypes} from 'app/hooks/useHaptics';
import OfflineAvatar from '../OfflineAvatar';
import {useAppDispatch, useAppSelector} from 'app/redux/store';
import Username from 'app/components/Username';
import {openReplySheet} from 'app/redux/slices/replySlice';
import {openAuthSheet} from 'app/redux/slices/authSheetSlice';
import {useUser} from 'app/lib/supabase/context/auth';

interface FloatTabBarProps {
  state: TabNavigationState<ParamListBase>;
  descriptors: BottomTabDescriptorMap;
  navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>;
  onCtaPress?: () => void;
  bottomPadding?: number;
}

export const ICON_SIZE = 24;
export const CTA_SIZE = 72;

const replyPressableStyle: ViewStyle = {
  flex: 1,
};

export const ESTIMATED_TABBAR_HEIGHT = ICON_SIZE + staticTheme.spacing.sY * 2;

export const FloatingTabBar: FC<FloatTabBarProps> = ({
  state,
  descriptors,
  navigation,
  onCtaPress,
  bottomPadding = 0,
}) => {
  const theme = useTheme<Theme>();
  const activeColor = theme.colors.tabBarIconActive;
  const inactiveColor = theme.colors.tabBarIconInactive;
  const {replyToUsername, replyToVerified} = useAppSelector(
    appState => appState.nonPersistent.reply,
  );
  const avatarUrl = useAppSelector(
    appState => appState.persistent.auth.avatarImageUrl,
  );
  const {triggerHaptic} = useHaptics();
  const {user} = useUser();
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const dispatch = useAppDispatch();
  const {scrollDirection, fabEventEmitter, fabAction, hidden} = useTabBar();
  const fabChange = useSharedValue(fabAction);

  const internalCtaPress = () => {
    fabEventEmitter.emit('ctaPress');
    onCtaPress &&
      fabEventEmitter.listenerCount('ctaPress') === 0 &&
      onCtaPress();
  };

  const animatedStyle = useAnimatedStyle(() => {
    const hideTabBar = hidden === true || scrollDirection === 'down';
    return {
      transform: [
        {
          translateY: hideTabBar
            ? withTiming(ESTIMATED_TABBAR_HEIGHT * 3)
            : withSpring(0, {
                damping: 15,
                stiffness: 100,
              }),
        },
      ],
    };
  }, [scrollDirection, hidden]);

  const ctaStyles: StyleProp<ViewStyle> = {
    position: 'absolute',
    top: -(CTA_SIZE / 2 - ICON_SIZE / 2 - theme.spacing.sY),
    left: (WINDOW_WIDTH - CTA_SIZE) / 2,
    borderRadius: theme.borderRadii.pill,
    backgroundColor: activeColor,
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.33,
  };

  const ctaAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity:
        fabChange.value > 0 ? withTiming(0, {duration: 200}) : opacity.value,
      transform: [
        {
          scale:
            fabChange.value > 0
              ? withTiming(0.33, {
                  duration: 200,
                })
              : withTiming(scale.value, {
                  duration: 66,
                }),
        },
      ],
    };
  }, []);

  const tabIconsStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(fabChange.value > 0 ? 0 : 1, {
        duration: 200,
      }),
      transform: [
        {
          translateY: withTiming(fabChange.value > 0 ? theme.spacing.xxsY : 0, {
            duration: 200,
          }),
        },
      ],
    };
  }, [theme.spacing.xxsY]);

  const replyBarStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      top: 0,
      opacity: withTiming(fabChange.value > 0 ? 1 : 0, {
        duration: 200,
      }),
      transform: [
        {
          translateY: withTiming(fabChange.value > 0 ? 0 : -theme.spacing.xxsY),
        },
      ],
    };
  }, [theme.spacing.xxsY]);

  useEffect(() => {
    fabChange.value = withTiming(fabAction, {
      duration: 200,
    });
  }, [fabAction, fabChange]);

  const onPressIn = () => {
    opacity.value = withTiming(0.88, {
      duration: 100,
    });
    scale.value = 0.92;
  };

  const onPressOut = () => {
    opacity.value = withTiming(1, {
      duration: 88,
    });
    scale.value = 1;
  };

  return (
    <Animated.View style={animatedStyle}>
      <Box
        position="absolute"
        bottom={0}
        px="l"
        width={WINDOW_WIDTH}
        style={{
          paddingBottom: bottomPadding,
        }}>
        <HStack
          width="100%"
          alignItems="center"
          py="sY"
          px="m"
          borderRadius="pill"
          backgroundColor="tabBarBackground"
          shadowColor="black"
          shadowOffset={{
            width: 0,
            height: 2,
          }}
          shadowOpacity={0.33}>
          <Animated.View style={tabIconsStyle}>
            <HStack
              columnGap="l"
              justifyContent="space-around"
              alignItems="center"
              width="100%">
              {state.routes.map((route, index) => {
                const half = state.routes.length / 2;
                const {options} = descriptors[route.key];

                const tabBarIcon = options.tabBarIcon;
                const isFocused = state.index === index;

                const onPress = async () => {
                  fabEventEmitter.emit('tabPress', route.name);
                  const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                  });

                  if (!isFocused && !event.defaultPrevented) {
                    navigation.navigate(route.name);
                    await triggerHaptic({
                      iOS: HapticFeedbackTypes.selection,
                      android: HapticFeedbackTypes.effectClick,
                    });
                  }
                };

                const onLongPress = () => {
                  navigation.emit({
                    type: 'tabLongPress',
                    target: route.key,
                  });
                };

                return (
                  <Fragment key={route.key}>
                    {index === half && <Box width={CTA_SIZE * 0.8} />}
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={options.tabBarAccessibilityLabel}
                      testID={options.tabBarTestID}
                      hitSlop={16}
                      onPress={onPress}
                      onLongPress={onLongPress}>
                      <Badge size="xsmall" hidden={options.tabBarBadge == null}>
                        <VStack alignItems="center">
                          {tabBarIcon
                            ? tabBarIcon({
                                focused: isFocused,
                                color: isFocused ? activeColor : inactiveColor,
                                size: ICON_SIZE,
                              })
                            : null}
                        </VStack>
                      </Badge>
                    </Pressable>
                  </Fragment>
                );
              })}
            </HStack>
          </Animated.View>

          <Animated.View
            style={replyBarStyle}
            pointerEvents={fabAction === FabAction.REPLY ? 'auto' : 'none'}>
            <Pressable
              onPress={async () => {
                await triggerHaptic({
                  iOS: HapticFeedbackTypes.impactMedium,
                  android: HapticFeedbackTypes.effectHeavyClick,
                });
                if (user) {
                  dispatch(openReplySheet());
                } else {
                  dispatch(openAuthSheet('reply'));
                }
              }}
              style={replyPressableStyle}>
              <HStack
                alignItems="center"
                flex={1}
                borderRadius="pill"
                px="s"
                columnGap="xs">
                <OfflineAvatar size="l" uri={avatarUrl} />
                <HStack alignItems="center">
                  <Text variant="bodySemiBold" color="inputPlaceholder">
                    Reply to{' '}
                  </Text>
                  <Username
                    username={replyToUsername}
                    isVerified={replyToVerified || false}
                    variant="bodySemiBold"
                    noHighlight
                    color="inputPlaceholder"
                  />
                </HStack>
              </HStack>
            </Pressable>
          </Animated.View>
        </HStack>
        <Animated.View
          style={[ctaStyles, ctaAnimatedStyle]}
          pointerEvents={fabAction === FabAction.ADD ? 'auto' : 'none'}>
          <Pressable
            onPress={internalCtaPress}
            onPressIn={onPressIn}
            onPressOut={onPressOut}>
            <Center
              width={CTA_SIZE}
              height={CTA_SIZE}
              backgroundColor="tabBarIconActive"
              shadowColor="black"
              shadowOffset={{
                width: 0,
                height: 2,
              }}
              shadowOpacity={0.33}
              borderRadius="pill">
              <PlusIcon
                width={ICON_SIZE * 1.2}
                height={ICON_SIZE * 1.2}
                fill={theme.colors.white}
              />
            </Center>
          </Pressable>
        </Animated.View>
      </Box>
    </Animated.View>
  );
};
