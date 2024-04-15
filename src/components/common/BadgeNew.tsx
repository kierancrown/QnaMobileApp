import React, {FC} from 'react';
import {Theme, useAppTheme} from 'app/styles/theme';
import Center from './Center';
import Text from './Text';
import Box from './Box';

interface BadgeProps {
  text?: string;
  textColor?: keyof Theme['colors'];
  color?: keyof Theme['colors'];
  location?: 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft';
  children?: React.ReactNode;
  enabled?: boolean;
}

const Badge: FC<BadgeProps> = ({
  text = '0',
  color = 'badgeBackground',
  textColor = 'white',
  location = 'topRight',
  enabled = true,
  children,
}) => {
  const theme = useAppTheme();

  return (
    <Box>
      {children}
      {enabled && (
        <Center
          p="xxs"
          aspectRatio={1}
          borderRadius="pill"
          backgroundColor={color}
          position={children ? 'absolute' : 'relative'}
          top={
            ['topRight', 'topLeft'].includes(location)
              ? -theme.spacing.xxsY
              : 'auto'
          }
          bottom={
            ['bottomRight', 'bottomLeft'].includes(location)
              ? -theme.spacing.xxsY
              : 'auto'
          }
          left={
            ['topLeft', 'bottomLeft'].includes(location)
              ? -theme.spacing.xxs
              : 'auto'
          }
          right={
            ['topRight', 'bottomRight'].includes(location)
              ? -theme.spacing.xxs
              : 'auto'
          }>
          <Text variant="smaller" color={textColor}>
            {text}
          </Text>
        </Center>
      )}
    </Box>
  );
};

export default Badge;
