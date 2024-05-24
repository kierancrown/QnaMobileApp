import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {Theme, useAppTheme} from 'app/styles/theme';
import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useCallback,
} from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native-gesture-handler';
import Popover, {
  PopoverMode,
  PopoverPlacement,
} from 'react-native-popover-view';
import VStack from './VStack';
import {Platform, Pressable, StyleSheet} from 'react-native';
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
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';

interface PopoverMenuItemProps {
  title: string;
  titleColor?: keyof Theme['colors'];
  left?: React.ReactNode;
  right?: React.ReactNode;
  backgroundColor?: keyof Theme['colors'];
  onPress?: () => void;
  closeOnPress?: boolean;
  onClosePress?: () => void;
}

interface PopoverMenuTitleProps {
  title: string;
  titleColor?: keyof Theme['colors'];
  left?: React.ReactNode;
  right?: React.ReactNode;
}

export type PopoverMenuItemsProps = (
  | PopoverMenuItemProps
  | PopoverMenuTitleProps
  | 'divider'
)[];

// Type guard for PopoverMenuItemProps
function isPopoverMenuItemProps(item: any): item is PopoverMenuItemProps {
  return typeof item === 'object' && item !== null && 'onPress' in item;
}

// Type guard for PopoverMenuTitleProps
function isPopoverMenuTitleProps(item: any): item is PopoverMenuTitleProps {
  return typeof item === 'object' && item !== null && !('onPress' in item);
}

interface PopoverMenuProps extends TouchableOpacityProps {
  triggerComponent: React.ReactNode;
  minWidth?: number;
  items: PopoverMenuItemsProps;
  mode?: PopoverMode;
  placement?: PopoverPlacement;
  customInsets?: EdgeInsets;
}

export interface PopoverRef {
  closePopover: () => void;
}

const PopoverMenuItem: React.FC<PopoverMenuItemProps> = item => {
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
    if (item.closeOnPress) {
      item.onClosePress?.();
    }
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
        <HStack
          px="s"
          py="xsY"
          columnGap="xs"
          alignItems="center"
          backgroundColor={item.backgroundColor}>
          {item.left}
          <Text variant="bodySemiBold" color={item.titleColor ?? 'cardText'}>
            {item.title}
          </Text>
          <Flex alignItems="flex-end">{item.right}</Flex>
        </HStack>
      </Animated.View>
    </Pressable>
  );
};

const PopoverMenuTitleItem: React.FC<PopoverMenuTitleProps> = item => {
  return (
    <HStack px="s" py="xsY" columnGap="xs" alignItems="center">
      {item.left}
      <Text variant="smallBodySemiBold" color={item.titleColor ?? 'cardText'}>
        {item.title}
      </Text>
      <Flex alignItems="flex-end">{item.right}</Flex>
    </HStack>
  );
};

const PopoverMenu = forwardRef<PopoverRef, PopoverMenuProps>(
  (
    {
      triggerComponent,
      items,
      minWidth,
      mode = PopoverMode.RN_MODAL,
      placement = PopoverPlacement.AUTO,
      customInsets,
      ...rest
    },
    ref,
  ) => {
    const theme = useAppTheme();
    const POPOVER_MIN_WIDTH = minWidth ?? SCREEN_WIDTH / 2.5;
    const insets = useSafeAreaInsets();
    const verticalOffset =
      Platform.OS === 'android' ? -(insets.bottom + 5) : -5;
    const [popoverOpen, setPopoverOpen] = useState(false);

    const closePopover = useCallback(() => {
      setPopoverOpen(false);
    }, []);

    useImperativeHandle(ref, () => ({
      closePopover,
    }));

    return (
      <Box
        onStartShouldSetResponder={() => true}
        onTouchEnd={e => {
          e.stopPropagation();
        }}>
        <Popover
          isVisible={popoverOpen}
          mode={mode}
          placement={placement}
          onRequestClose={closePopover}
          verticalOffset={verticalOffset}
          displayAreaInsets={customInsets ?? insets}
          arrowSize={{width: 0, height: 0}}
          popoverStyle={{
            backgroundColor: theme.colors.cardBackground,
            borderRadius: theme.borderRadii.l,
          }}
          from={
            <TouchableOpacity
              hitSlop={8}
              {...rest}
              onPress={() => setPopoverOpen(true)}>
              {triggerComponent}
            </TouchableOpacity>
          }>
          <VStack minWidth={POPOVER_MIN_WIDTH}>
            {items.map((item, index) =>
              isPopoverMenuItemProps(item) ? (
                <PopoverMenuItem
                  key={index}
                  {...item}
                  onClosePress={closePopover}
                />
              ) : isPopoverMenuTitleProps(item) ? (
                <PopoverMenuTitleItem key={index} {...item} />
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
      </Box>
    );
  },
);

export default PopoverMenu;
