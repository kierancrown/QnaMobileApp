import React, {FC} from 'react';
import {Center, HStack, Text, VStack} from './common';
import dayjs from 'dayjs';
import {Database} from 'app/types/supabase';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Platform, Pressable, StyleSheet} from 'react-native';
import {useTheme} from '@shopify/restyle';
import {Theme} from 'app/styles/theme';
import Avatar from './common/Avatar';

import UserSheildIcon from 'app/assets/icons/SharpShield.svg';
import Badge from './common/Badge';
import LinearGradient from 'react-native-linear-gradient';

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

const renderIcon = (
  type: NotificationType,
  theme: Theme,
  unread: boolean = false,
) => {
  switch (type) {
    case 'login':
      return (
        <Badge
          size="xsmall"
          hidden={!unread}
          color={theme.colors.bookmarkAction}
          animateOnMount={false}>
          <Center
            overflow="hidden"
            width={theme.iconSizes.xl}
            height={theme.iconSizes.xl}
            borderRadius="pill"
            bg="inputBackground">
            <LinearGradient
              colors={['#F09819', '#FF512F']}
              style={StyleSheet.absoluteFillObject}
            />
            <UserSheildIcon
              fill={theme.colors.foreground}
              width={theme.iconSizes.intermediate}
              height={theme.iconSizes.intermediate}
            />
          </Center>
        </Badge>
      );
    default:
      return (
        <Badge
          size="xsmall"
          hidden={!unread}
          color={theme.colors.bookmarkAction}
          animateOnMount={false}>
          <Avatar size="xl" defaultAvatar />
        </Badge>
      );
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
          flex={1}
          rowGap="xsY"
          px="s"
          py="xsY"
          my="xxsY"
          mx={Platform.select({
            ios: 'xs',
            android: 's',
          })}
          borderRadius="l"
          backgroundColor="cardBackground">
          <HStack alignItems="center" columnGap="s">
            {renderIcon(title, theme, read === false)}
            <VStack rowGap="xxsY" flex={1}>
              <Text variant="smaller">{getTitleFromType(title)}</Text>
              <Text variant={'tiny'} color="cardText">
                {dayjs(timestamp).fromNow()}
              </Text>
            </VStack>
          </HStack>
          <HStack columnGap="xs" alignItems="center">
            <Text variant="smallBody">{body}</Text>
          </HStack>
        </VStack>
      </Animated.View>
    </Pressable>
  );
};

export default NotificationItem;
