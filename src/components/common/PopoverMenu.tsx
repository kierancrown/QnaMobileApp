import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {Theme, useAppTheme} from 'app/styles/theme';
import React, {FC} from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native-gesture-handler';
import Popover from 'react-native-popover-view';
import VStack from './VStack';
import {Pressable, StyleSheet} from 'react-native';
import HStack from './HStack';
import Box from './Box';
import Text from './Text';
import Flex from './Flex';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {HapticFeedbackTypes} from 'react-native-haptic-feedback';
import {useHaptics} from 'app/hooks/useHaptics';

export interface PopoverMenuItemProps {
  title: string;
  titleColor?: keyof Theme['colors'];
  left?: React.ReactNode;
  right?: React.ReactNode;
  onPress?: () => void;
}

interface PopoverMenuProps extends TouchableOpacityProps {
  triggerComponent: React.ReactNode;
  minWidth?: number;
  items: (PopoverMenuItemProps | 'divider')[];
}

const PopoverMenuItem: FC<PopoverMenuItemProps> = item => {
  const {triggerHaptic} = useHaptics();
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{scale: scale.value}],
    };
  }, []);

  const onInternalPress = async () => {
    await triggerHaptic(HapticFeedbackTypes.impactLight);
    item.onPress?.();
  };

  const onPressIn = () => {
    opacity.value = withTiming(0.66, {duration: 0.88});
    scale.value = withTiming(0.98, {duration: 0.66});
  };

  const onPressOut = () => {
    opacity.value = withTiming(1, {duration: 0.88});
    scale.value = withSpring(1);
  };

  return (
    <Pressable
      onPress={onInternalPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}>
      <Animated.View style={animatedStyle}>
        <HStack px="s" columnGap="xxs">
          {item.left}
          <Text variant="smallBody" color={item.titleColor ?? 'cardText'}>
            {item.title}
          </Text>
          <Flex justifyContent="flex-end">{item.right}</Flex>
        </HStack>
      </Animated.View>
    </Pressable>
  );
};

const PopoverMenu: FC<PopoverMenuProps> = ({
  triggerComponent,
  items,
  minWidth,
  ...rest
}) => {
  const theme = useAppTheme();
  const POPOVER_MIN_WIDTH = minWidth ?? SCREEN_WIDTH / 2.5;

  return (
    <Popover
      verticalOffset={-5}
      arrowSize={{width: 0, height: 0}}
      popoverStyle={{
        backgroundColor: theme.colors.cardBackground,
        borderRadius: theme.borderRadii.m,
      }}
      from={
        <TouchableOpacity hitSlop={8} {...rest}>
          {triggerComponent}
        </TouchableOpacity>
      }>
      <VStack rowGap="sY" py="sY" minWidth={POPOVER_MIN_WIDTH}>
        {items.map((item, index) =>
          item !== 'divider' ? (
            <PopoverMenuItem key={index} {...item} />
          ) : (
            <Box
              key={index}
              height={StyleSheet.hairlineWidth}
              backgroundColor="cardText"
              opacity={0.5}
              width="100%"
            />
          ),
        )}
      </VStack>
    </Popover>
  );
};

export default PopoverMenu;
