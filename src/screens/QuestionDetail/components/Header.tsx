import {Header} from '@codeherence/react-native-header';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {Center, HStack, Text} from 'app/components/common';
import {Theme, useAppTheme} from 'app/styles/theme';
import React, {useState} from 'react';
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
import SearchIcon from 'app/assets/icons/tabbar/Search.svg';

import CheckIcon from 'app/assets/icons/check.svg';

export const menuItems = (
  isOwner: boolean,
  theme: Theme,
): PopoverMenuItemsProps =>
  isOwner
    ? ([
        {
          title: 'Delete',
          titleColor: 'destructiveAction',
          left: (
            <TrashIcon
              color={theme.colors.destructiveAction}
              width={theme.iconSizes.popover}
              height={theme.iconSizes.popover}
            />
          ),
          onPress: () => {},
        },
      ] as PopoverMenuItemsProps)
    : ([
        {
          title: 'Hide',
          left: (
            <HideIcon
              fill={theme.colors.cardText}
              width={theme.iconSizes.popover}
              height={theme.iconSizes.popover}
            />
          ),
          onPress: () => {},
        },
        {
          title: 'Report',
          titleColor: 'destructiveAction',
          left: (
            <ReportIcon
              color={theme.colors.destructiveAction}
              width={theme.iconSizes.popover}
              height={theme.iconSizes.popover}
            />
          ),
          onPress: () => {},
        },
      ] as PopoverMenuItemsProps);

const HeaderComponent = ({showNavBar}: {showNavBar: SharedValue<number>}) => {
  const {
    params: {responseCount, isOwner},
  } = useRoute<RouteProp<HomeStackParamList, 'QuestionDetail'>>();
  const {goBack} = useNavigation();
  const theme = useAppTheme();
  const [sortBy, setSortBy] = useState<
    'mostLiked' | 'newest' | 'oldest' | 'random'
  >('mostLiked');

  const sortByMenuItems: PopoverMenuItemsProps = [
    {
      title: 'Find in Responses',
      left: (
        <SearchIcon
          fill={theme.colors.cardText}
          width={theme.iconSizes.popover}
          height={theme.iconSizes.popover}
        />
      ),
      onPress: () => {},
    },
    'divider',
    {
      title: 'Sort by',
    },
    {
      title: 'Most Liked',
      left: (
        <MostLikedIcon
          color={theme.colors.cardText}
          width={theme.iconSizes.popover}
          height={theme.iconSizes.popover}
        />
      ),
      right: sortBy === 'mostLiked' && (
        <Center>
          <CheckIcon
            fill={theme.colors.brand}
            width={theme.iconSizes.popover}
            height={theme.iconSizes.popover}
          />
        </Center>
      ),
      backgroundColor: sortBy === 'mostLiked' ? 'inputBackground' : 'none',
      onPress: () => setSortBy('mostLiked'),
      closeOnPress: true,
    },
    {
      title: 'Newest',
      left: (
        <NewestIcon
          color={theme.colors.cardText}
          width={theme.iconSizes.popover}
          height={theme.iconSizes.popover}
        />
      ),
      right: sortBy === 'newest' && (
        <Center>
          <CheckIcon
            fill={theme.colors.brand}
            width={theme.iconSizes.popover}
            height={theme.iconSizes.popover}
          />
        </Center>
      ),
      backgroundColor: sortBy === 'newest' ? 'inputBackground' : 'none',
      onPress: () => setSortBy('newest'),
      closeOnPress: true,
    },
    {
      title: 'Oldest',
      left: (
        <OldestIcon
          color={theme.colors.cardText}
          width={theme.iconSizes.popover}
          height={theme.iconSizes.popover}
        />
      ),
      right: sortBy === 'oldest' && (
        <Center>
          <CheckIcon
            fill={theme.colors.brand}
            width={theme.iconSizes.popover}
            height={theme.iconSizes.popover}
          />
        </Center>
      ),
      backgroundColor: sortBy === 'oldest' ? 'inputBackground' : 'none',
      onPress: () => setSortBy('oldest'),
      closeOnPress: true,
    },
    {
      title: 'Random',
      left: (
        <RandomIcon
          color={theme.colors.cardText}
          width={theme.iconSizes.popover}
          height={theme.iconSizes.popover}
        />
      ),
      right: sortBy === 'random' && (
        <Center>
          <CheckIcon
            fill={theme.colors.brand}
            width={theme.iconSizes.popover}
            height={theme.iconSizes.popover}
          />
        </Center>
      ),
      backgroundColor: sortBy === 'random' ? 'inputBackground' : 'none',
      onPress: () => setSortBy('random'),
      closeOnPress: true,
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
