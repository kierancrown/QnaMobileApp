import React, {FC} from 'react';
import {Box, HStack, Text, VStack} from './common';
import dayjs from 'dayjs';
import {Database} from 'app/types/supabase';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Pressable} from 'react-native';
import {useTheme} from '@shopify/restyle';
import {Theme} from 'app/styles/theme';

interface NotificationItemProps {
  onPress: () => void;
  id: number;
  title: NotificationType;
  body: string;
  timestamp: string;
  read?: boolean;
  image?: string;
}

export type NotificationType = Database['public']['Enums']['notification_type'];

const getTitleFromType = (type: NotificationType) => {
  switch (type) {
    case 'account_follow':
      return 'New follower';
    case 'login':
      return 'New login activity';
    case 'question_like':
      return 'Somebody liked your question';
    case 'question_response':
      return 'Somebody responded to your question';
    default:
      return 'New notification';
  }
};

const NotificationItem: FC<NotificationItemProps> = ({
  onPress,
  title,
  body,
  timestamp,
  read = false,
}) => {
  const theme = useTheme<Theme>();
  const opacity = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacity.value, {
        duration: 66,
      }),
    };
  }, []);

  const onPressIn = () => {
    opacity.value = 0.66;
  };

  const onPressOut = () => {
    opacity.value = 1;
  };

  return (
    <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View style={[animatedStyle]}>
        <VStack
          rowGap="sY"
          px="m"
          py="sY"
          my="xxsY"
          backgroundColor="cardBackground">
          <HStack alignItems="center" columnGap="xs">
            {read === false && (
              <Box
                width={theme.iconSizes.xs}
                height={theme.iconSizes.xs}
                borderRadius="pill"
                bg="bookmarkAction"
              />
            )}
            <Text variant="smaller" fontWeight="400">
              {getTitleFromType(title)}
            </Text>
          </HStack>
          <HStack columnGap="xs" alignItems="center">
            <Text variant="questionBody">{body}</Text>
            <Text variant="username" color="cardText">
              {dayjs(timestamp).fromNow()}
            </Text>
          </HStack>
        </VStack>
      </Animated.View>
    </Pressable>
  );
};

export default NotificationItem;
