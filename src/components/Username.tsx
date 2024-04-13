import React, {FC} from 'react';
import {HStack, Text} from './common';

import BadgeIcon from 'app/assets/icons/Badge.svg';
import {TextProps, useTheme} from '@shopify/restyle';
import {Theme} from 'app/styles/theme';
import {useUsername} from 'app/hooks/useUsername';

interface UsernameProps extends TextProps<Theme> {
  username: string;
  isVerified?: boolean;
}

const Username: FC<UsernameProps> = ({username, isVerified, ...rest}) => {
  const theme = useTheme<Theme>();
  const user = useUsername();

  const iconSize = rest.variant
    ? theme.textVariants[rest.variant].fontSize
    : theme.textVariants.body.fontSize;

  return (
    <HStack alignItems="center" columnGap="xxxs">
      <Text
        color={
          user?.username === username ? 'brand' : rest.color ?? 'foreground'
        }
        {...rest}>
        {username}
      </Text>
      {isVerified && (
        <BadgeIcon
          width={iconSize}
          height={iconSize}
          fill={theme.colors.verifiedBadge}
        />
      )}
    </HStack>
  );
};

export default Username;
