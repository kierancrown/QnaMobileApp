import React, {FC} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {HStack, Text, VStack} from 'ui';

interface LargeTitleHeaderProps {
  title: string;
  subtitle?: string;
  collapsed?: boolean;
}

const LargeTitleHeader: FC<LargeTitleHeaderProps> = ({title, subtitle}) => {
  return (
    <SafeAreaView edges={['top', 'left', 'right']}>
      <HStack alignItems="center" px="m" py="xsY">
        <VStack>
          <Text variant="largeHeader">{title}</Text>
          {subtitle && (
            <Text variant="subheader" color="cardText">
              {subtitle}
            </Text>
          )}
        </VStack>
      </HStack>
    </SafeAreaView>
  );
};

export default LargeTitleHeader;
