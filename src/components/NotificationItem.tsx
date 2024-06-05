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

import UserSheildIcon from 'app/assets/icons/SharpShield.svg';
import Badge from './common/Badge';
import LinearGradient from 'react-native-linear-gradient';
import OfflineAvatar from './common/OfflineAvatar';

interface NotificationItemProps {
  onPress: () => void;
  id: number;
  type: NotificationType;
  title?: string | React.ReactNode;
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
      return type;
  }
};

const renderIcon = (
  type: NotificationType,
  theme: Theme,
  unread: boolean = false,
  avatarUrl?: string,
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
          <OfflineAvatar size="xl" defaultAvatar={!avatarUrl} uri={avatarUrl} />
        </Badge>
      );
  }
};

const NotificationItem: FC<NotificationItemProps> = ({
  onPress,
  title,
  type,
  body,
  timestamp,
  read = false,
  image,
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
            {renderIcon(type, theme, read === false, image)}
            <VStack rowGap="xxsY" flex={1}>
              {!title || typeof title === 'string' ? (
                <Text variant="smaller">{title ?? getTitleFromType(type)}</Text>
              ) : (
                title
              )}
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
