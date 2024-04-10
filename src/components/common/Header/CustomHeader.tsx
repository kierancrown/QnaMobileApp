import React, {FC} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Box, Center, HStack, Text} from 'ui';

interface HeaderProps {
  title: string;
  leftButton?: React.ReactNode;
  rightButton?: React.ReactNode;
}

export const Header: FC<HeaderProps> = ({title, leftButton, rightButton}) => {
  return (
    <Box
      backgroundColor="cardBackground"
      borderColor="segmentBackground"
      borderBottomWidth={1}>
      <SafeAreaView edges={['top', 'left', 'right']}>
        <HStack py="xxsY" px="xs">
          <HStack flex={1} alignItems="center" justifyContent="flex-start">
            {leftButton}
          </HStack>
          <Center flex={2}>
            <Text variant="medium">{title}</Text>
          </Center>
          <HStack flex={1} alignItems="center" justifyContent="flex-end">
            {rightButton}
          </HStack>
        </HStack>
      </SafeAreaView>
    </Box>
  );
};
