import {Center, HStack} from 'ui';
import React, {FC} from 'react';
import {Pressable} from 'react-native';

import HeartIcon from 'app/assets/icons/actions/Heart.svg';
import HeartOutlineIcon from 'app/assets/icons/actions/Heart-Outline.svg';
import BookmarkIcon from 'app/assets/icons/actions/Bookmark.svg';
import BookmarkOutlineIcon from 'app/assets/icons/actions/Bookmark-Outline.svg';
import ShareIcon from 'app/assets/icons/actions/arrow-up-from-bracket.svg';

import {useTheme} from '@shopify/restyle';
import {Theme} from 'app/styles/theme';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {HapticFeedbackTypes, useHaptics} from 'app/hooks/useHaptics';

interface ActionBarIconProps {
  active?: boolean;
  onPress?: () => void;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
  activeColor?: keyof Theme['colors'];
}

interface ActionBarProps {
  isLiked: boolean;
  isBookmarked: boolean;
  onLike?: () => void;
  onBookmark?: () => void;
  onShare?: () => void;
}

const ICON_SIZE = 20;

const ActionBarIcon: FC<ActionBarIconProps> = ({
  active,
  onPress,
  icon,
  activeIcon,
  activeColor = 'brand',
}) => {
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const {triggerHaptic} = useHaptics();

  const internalOnPress = async () => {
    await triggerHaptic(HapticFeedbackTypes.selection);
    onPress?.();
  };

  const onPressIn = () => {
    opacity.value = 0.66;
    scale.value = 0.9;
  };

  const onPressOut = () => {
    opacity.value = 1;
    scale.value = 1;
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{scale: scale.value}],
    };
  }, []);

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={internalOnPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}>
        <Center
          backgroundColor={!active ? 'inactiveAction' : activeColor}
          borderRadius="m"
          p="xs">
          {active || !activeIcon ? icon : activeIcon}
        </Center>
      </Pressable>
    </Animated.View>
  );
};

const ActionBar: FC<ActionBarProps> = ({
  isLiked,
  onLike,
  isBookmarked,
  onBookmark,
  onShare,
}) => {
  const theme = useTheme<Theme>();
  return (
    <HStack alignItems="center" columnGap="s">
      <ActionBarIcon
        active={isLiked}
        activeColor="heartAction"
        onPress={onLike}
        icon={
          <HeartIcon
            width={ICON_SIZE}
            height={ICON_SIZE}
            fill={theme.colors.white}
          />
        }
        activeIcon={
          <HeartOutlineIcon
            width={ICON_SIZE}
            height={ICON_SIZE}
            fill={theme.colors.white}
          />
        }
      />

      <ActionBarIcon
        active={isBookmarked}
        activeColor="bookmarkAction"
        onPress={onBookmark}
        icon={
          <BookmarkIcon
            width={ICON_SIZE}
            height={ICON_SIZE}
            fill={theme.colors.white}
          />
        }
        activeIcon={
          <BookmarkOutlineIcon
            width={ICON_SIZE}
            height={ICON_SIZE}
            fill={theme.colors.white}
          />
        }
      />

      <ActionBarIcon
        onPress={onShare}
        icon={
          <ShareIcon
            width={ICON_SIZE}
            height={ICON_SIZE}
            fill={theme.colors.white}
          />
        }
      />
    </HStack>
  );
};

export default ActionBar;
