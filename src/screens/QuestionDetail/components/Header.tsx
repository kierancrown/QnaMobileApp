import {Header} from '@codeherence/react-native-header';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {Center, HStack, Text} from 'app/components/common';
import {Theme, useAppTheme} from 'app/styles/theme';
import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {SharedValue} from 'react-native-reanimated';

import BackIcon from 'app/assets/icons/arrows/ArrowLeft.svg';
import ElipsisIcon from 'app/assets/icons/actions/ellipsis.svg';
import SortIcon from 'app/assets/icons/actions/Sort.svg';

import {HomeStackParamList} from 'app/navigation/HomeStack';
import {formatNumber} from 'app/utils/numberFormatter';
import PopoverMenu, {
  PopoverMenuItemsProps,
} from 'app/components/common/PopoverMenu';

import HideIcon from 'app/assets/icons/actions/Hide.svg';
import ReportIcon from 'app/assets/icons/actions/ReportAlt.svg';
import TrashIcon from 'app/assets/icons/actions/Trash.svg';
import MostLikedIcon from 'app/assets/icons/actions/sortBy/heart.svg';
import NewestIcon from 'app/assets/icons/actions/sortBy/Clock.svg';
import OldestIcon from 'app/assets/icons/actions/sortBy/ClockOld.svg';
import RandomIcon from 'app/assets/icons/actions/sortBy/shuffle.svg';

export const menuItems = (
  isOwner: boolean,
  theme: Theme,
): PopoverMenuItemsProps =>
  isOwner
    ? ([
        {
          title: 'Delete',
          titleColor: 'destructiveAction',
          right: (
            <TrashIcon
              color={theme.colors.destructiveAction}
              width={theme.iconSizes.intermediate}
              height={theme.iconSizes.intermediate}
            />
          ),
        },
      ] as PopoverMenuItemsProps)
    : ([
        {
          title: 'Hide',
          right: (
            <HideIcon
              fill={theme.colors.cardText}
              width={theme.iconSizes.intermediate}
              height={theme.iconSizes.intermediate}
            />
          ),
        },
        {
          title: 'Report',
          titleColor: 'destructiveAction',
          right: (
            <ReportIcon
              color={theme.colors.destructiveAction}
              width={theme.iconSizes.intermediate}
              height={theme.iconSizes.intermediate}
            />
          ),
        },
      ] as PopoverMenuItemsProps);

const HeaderComponent = ({showNavBar}: {showNavBar: SharedValue<number>}) => {
  const {
    params: {responseCount, isOwner},
  } = useRoute<RouteProp<HomeStackParamList, 'QuestionDetail'>>();
  const {goBack} = useNavigation();
  const theme = useAppTheme();

  const sortByMenuItems: PopoverMenuItemsProps = [
    {
      title: 'Most Liked',
      left: (
        <MostLikedIcon
          color={theme.colors.cardText}
          width={theme.iconSizes.intermediate}
          height={theme.iconSizes.intermediate}
        />
      ),
    },
    {
      title: 'Newest',
      left: (
        <NewestIcon
          color={theme.colors.cardText}
          width={theme.iconSizes.intermediate}
          height={theme.iconSizes.intermediate}
        />
      ),
    },
    {
      title: 'Oldest',
      left: (
        <OldestIcon
          color={theme.colors.cardText}
          width={theme.iconSizes.intermediate}
          height={theme.iconSizes.intermediate}
        />
      ),
    },
    {
      title: 'Random',
      left: (
        <RandomIcon
          color={theme.colors.cardText}
          width={theme.iconSizes.intermediate}
          height={theme.iconSizes.intermediate}
        />
      ),
    },
  ];

  return (
    <Header
      showNavBar={showNavBar}
      noBottomBorder
      headerLeft={
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
      }
      headerCenter={
        <Center py="xxsY">
          <Text variant="medium">
            {responseCount
              ? `${formatNumber(responseCount)} answers`
              : 'Question'}
          </Text>
        </Center>
      }
      headerRight={
        <HStack alignItems="center" columnGap="xs">
          <PopoverMenu
            accessibilityLabel="Sort answers by"
            accessibilityRole="button"
            triggerComponent={
              <Center py="xxsY" px="xxs">
                <SortIcon
                  width={theme.iconSizes.l}
                  height={theme.iconSizes.l}
                />
              </Center>
            }
            items={sortByMenuItems}
          />
          <PopoverMenu
            accessibilityLabel="Open Question Options"
            accessibilityRole="button"
            accessibilityHint="Report or hide this question"
            triggerComponent={
              <Center py="xxsY" px="xxs">
                <ElipsisIcon
                  width={theme.iconSizes.l}
                  height={theme.iconSizes.l}
                />
              </Center>
            }
            items={menuItems(isOwner ?? false, theme)}
          />
        </HStack>
      }
    />
  );
};

export default HeaderComponent;
