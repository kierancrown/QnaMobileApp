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
import {Box, Center, HStack, VStack} from 'ui';
import {useTheme} from '@shopify/restyle';
import staticTheme, {Theme} from 'app/styles/theme';

import {Pressable, StyleProp, ViewStyle} from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {FabAction, useTabBar} from 'app/context/tabBarContext';
import {WINDOW_WIDTH} from '@gorhom/bottom-sheet';

import PlusIcon from 'app/assets/icons/actions/Plus.svg';
import ReplyIcon from 'app/assets/icons/actions/Comment.svg';

interface FloatTabBarProps {
  state: TabNavigationState<ParamListBase>;
  descriptors: BottomTabDescriptorMap;
  navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>;
  onCtaPress?: () => void;
}

export const ICON_SIZE = 24;
export const CTA_SIZE = 72;

export const ESTIMATED_TABBAR_HEIGHT = ICON_SIZE + staticTheme.spacing.sY * 2;

export const FloatingTabBar: FC<FloatTabBarProps> = ({
  state,
  descriptors,
  navigation,
  onCtaPress,
}) => {
  const theme = useTheme<Theme>();
  const activeColor = theme.colors.tabBarIconActive;
  const inactiveColor = theme.colors.tabBarIconInactive;

  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  const {scrollDirection, fabEventEmitter, fabAction} = useTabBar();
  const fabChange = useSharedValue(fabAction);

  const internalCtaPress = () => {
    fabEventEmitter.emit('ctaPress');
    onCtaPress &&
      fabEventEmitter.listenerCount('ctaPress') === 0 &&
      onCtaPress();
  };

  const animatedStyle = useAnimatedStyle(() => {
    const hideTabBar = scrollDirection === 'down';
    return {
      transform: [
        {
          translateY: hideTabBar
            ? withTiming(ESTIMATED_TABBAR_HEIGHT * 3)
            : withSpring(0),
        },
      ],
    };
  }, [scrollDirection]);

  const ctaStyles: StyleProp<ViewStyle> = {
    position: 'absolute',
    top: -(CTA_SIZE / 2 - ICON_SIZE / 2 - theme.spacing.sY),
    left: (WINDOW_WIDTH - theme.spacing.l * 2 - CTA_SIZE) / 2,
    borderRadius: theme.borderRadii.pill,
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.33,
  };

  const ctaIconStyles: StyleProp<ViewStyle> = {
    position: 'absolute',
  };

  const addAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        fabChange.value,
        [FabAction.ADD, FabAction.REPLY],
        [1, 0],
      ),
    };
  }, []);

  const replyAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        fabChange.value,
        [FabAction.ADD, FabAction.REPLY],
        [0, 1],
      ),
    };
  }, []);

  const ctaAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{scale: scale.value}],
      backgroundColor: interpolateColor(
        fabChange.value,
        [FabAction.ADD, FabAction.REPLY],
        [theme.colors.tabBarIconActive, theme.colors.tabBarReplyIcon],
      ),
    };
  }, []);

  useEffect(() => {
    fabChange.value = withTiming(fabAction, {
      duration: 200,
    });
  }, [fabAction, fabChange]);

  const onPressIn = () => {
    opacity.value = withTiming(0.88, {
      duration: 100,
    });
    scale.value = withTiming(0.92, {
      duration: 66,
    });
  };

  const onPressOut = () => {
    opacity.value = withTiming(1, {
      duration: 88,
    });
    scale.value = withTiming(1, {
      duration: 66,
    });
  };

  return (
    <Animated.View style={animatedStyle}>
      <HStack
        width="100%"
        justifyContent="space-around"
        alignItems="center"
        py="sY"
        px="m"
        columnGap="l"
        borderRadius="pill"
        backgroundColor="tabBarBackground"
        shadowColor="black"
        shadowOffset={{
          width: 0,
          height: 2,
        }}
        shadowOpacity={0.33}>
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
              // await triggerHaptic('impactLight');
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
                <VStack alignItems="center">
                  {tabBarIcon
                    ? tabBarIcon({
                        focused: isFocused,
                        color: isFocused ? activeColor : inactiveColor,
                        size: ICON_SIZE,
                      })
                    : null}
                </VStack>
              </Pressable>
            </Fragment>
          );
        })}
      </HStack>
      <Animated.View style={[ctaStyles, ctaAnimatedStyle]}>
        <Pressable
          onPress={internalCtaPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}>
          <Center
            width={CTA_SIZE}
            height={CTA_SIZE}
            // backgroundColor="tabBarIconActive"
            shadowColor="black"
            shadowOffset={{
              width: 0,
              height: 2,
            }}
            shadowOpacity={0.33}
            borderRadius="pill">
            <Animated.View style={[ctaIconStyles, addAnimatedStyle]}>
              <PlusIcon
                width={ICON_SIZE * 1.2}
                height={ICON_SIZE * 1.2}
                fill={theme.colors.white}
              />
            </Animated.View>
            <Animated.View style={[ctaIconStyles, replyAnimatedStyle]}>
              <ReplyIcon
                width={ICON_SIZE * 1.2}
                height={ICON_SIZE * 1.2}
                fill={theme.colors.white}
              />
            </Animated.View>
          </Center>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
};
