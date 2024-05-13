import React, {FC} from 'react';
import {HStack, Text} from './common';

import BadgeIcon from 'app/assets/icons/Badge.svg';
import {TextProps, useTheme} from '@shopify/restyle';
import {Theme} from 'app/styles/theme';
import {useUsername} from 'app/hooks/useUsername';
import {Pressable} from 'react-native';

interface UsernameProps extends TextProps<Theme> {
  username?: string;
  isVerified?: boolean;
  noHighlight?: boolean;
  onPress?: () => void;
}

const Username: FC<UsernameProps> = ({
  username,
  noHighlight,
  isVerified,
  onPress,
  ...rest
}) => {
  const theme = useTheme<Theme>();
  const user = useUsername();

  const iconSize = rest.variant
    ? theme.textVariants[rest.variant].fontSize
    : theme.textVariants.body.fontSize;

  const columnGap: keyof Theme['spacing'] = iconSize >= 24 ? 'xs' : 'xxxs';

  return (
    <Pressable disabled={onPress == null} onPress={onPress} hitSlop={8}>
      <HStack alignItems="center" columnGap={columnGap}>
        <Text
          color={
            noHighlight == null && user?.username === username
              ? 'brand'
              : rest.color ?? 'foreground'
          }
          {...rest}>
          {username ?? 'Anonymous'}
        </Text>
        {isVerified && (
          <BadgeIcon
            width={iconSize}
            height={iconSize}
            fill={theme.colors.verifiedBadge}
          />
        )}
      </HStack>
    </Pressable>
  );
};

export default Username;
