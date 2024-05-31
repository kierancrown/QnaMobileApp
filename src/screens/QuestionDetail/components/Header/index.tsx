import {useAppTheme} from 'app/styles/theme';
import React, {FC} from 'react';

import AnimatedHeader from 'app/components/common/Header/AnimatedHeader';
import {useNavigation} from '@react-navigation/native';
import {Center, Flex, HStack, Text} from 'app/components/common';
import {TouchableOpacity} from 'react-native-gesture-handler';

import BackIcon from 'app/assets/icons/arrows/ArrowLeft.svg';
import {formatNumber} from 'app/utils/numberFormatter';
import SortByMenu from './components/SortByMenu';
import DefaultMenu from './components/DefaultMenu';

interface HeaderComponentProps {
  onSize?: (size: {width: number; height: number}) => void;
  responseCount: number;
  isOwner: boolean;
  questionId: number;
}

export const HeaderComponent: FC<HeaderComponentProps> = ({
  onSize,
  responseCount,
  isOwner,
  questionId,
}) => {
  const theme = useAppTheme();
  const {goBack} = useNavigation();

  return (
    <AnimatedHeader onSize={onSize} absoluteFill>
      <HStack alignItems="center" pb="xsY" px="xs">
        <Flex alignItems="flex-start">
          <TouchableOpacity
            onPress={goBack}
            hitSlop={8}
            accessibilityLabel="Go back"
            accessibilityRole="button"
            accessibilityHint="Go back to previous screen">
            <Center py="xxsY" px="xxs">
              <BackIcon width={theme.iconSizes.l} height={theme.iconSizes.l} />
            </Center>
          </TouchableOpacity>
        </Flex>
        <Center py="xxsY">
          <Text variant="medium">
            {responseCount
              ? `${formatNumber(responseCount)} answer${
                  responseCount > 1 ? 's' : ''
                }`
              : 'Question'}
          </Text>
        </Center>
        <Flex alignItems="flex-end">
          <HStack alignItems="center">
            <SortByMenu onSortByChange={console.log} />
            <DefaultMenu isOwner={isOwner} questionId={questionId} />
          </HStack>
        </Flex>
      </HStack>
    </AnimatedHeader>
  );
};

export default HeaderComponent;
