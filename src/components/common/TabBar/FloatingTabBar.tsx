import React, {FC, Fragment} from 'react';

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
import {Theme} from 'app/styles/theme';
import {WINDOW_WIDTH} from '@gorhom/bottom-sheet';

import PlusIcon from 'app/assets/icons/Plus.svg';
import {Pressable, StyleProp, ViewStyle} from 'react-native';

interface FloatTabBarProps {
  state: TabNavigationState<ParamListBase>;
  descriptors: BottomTabDescriptorMap;
  navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>;
}

const ICON_SIZE = 24;
const CTA_SIZE = 72;

export const FloatingTabBar: FC<FloatTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const theme = useTheme<Theme>();
  const activeColor = theme.colors.brand;
  const inactiveColor = theme.colors.cardText;

  const ctaStyles: StyleProp<ViewStyle> = {
    position: 'absolute',
    top: -theme.spacing.xsY,
    left: (WINDOW_WIDTH - theme.spacing.l * 2 - CTA_SIZE) / 2,
  };

  return (
    <Box>
      <HStack
        width="100%"
        justifyContent="space-around"
        alignItems="center"
        py="sY"
        px="m"
        columnGap="l"
        borderRadius="pill"
        backgroundColor="cardBackground"
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
      <Pressable style={ctaStyles}>
        <Center
          width={CTA_SIZE}
          height={CTA_SIZE}
          backgroundColor="brand"
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
    </Box>
  );
};
