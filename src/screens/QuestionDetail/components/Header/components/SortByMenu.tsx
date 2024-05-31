import React from 'react';
import {FC, useEffect, useState} from 'react';
import PopoverMenu, {
  PopoverMenuItemsProps,
} from 'app/components/common/PopoverMenu';
import {useAppTheme} from 'app/styles/theme';
import {Center} from 'app/components/common';

import MostLikedIcon from 'app/assets/icons/actions/sortBy/heart.svg';
import OldestIcon from 'app/assets/icons/actions/sortBy/ClockOld.svg';
import RandomIcon from 'app/assets/icons/actions/sortBy/shuffle.svg';
import NewestIcon from 'app/assets/icons/actions/sortBy/Clock.svg';
import SearchIcon from 'app/assets/icons/tabbar/Search.svg';
import SortIcon from 'app/assets/icons/actions/Sort.svg';
import CheckIcon from 'app/assets/icons/check.svg';

interface SortByMenuProps {
  onSortByChange: (
    sortBy: 'mostLiked' | 'newest' | 'oldest' | 'random',
  ) => void;
}

const SortByMenu: FC<SortByMenuProps> = ({onSortByChange}) => {
  const theme = useAppTheme();

  const [sortBy, setSortBy] = useState<
    'mostLiked' | 'newest' | 'oldest' | 'random'
  >('mostLiked');

  useEffect(() => {
    onSortByChange(sortBy);
  }, [onSortByChange, sortBy]);

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
    <PopoverMenu
      accessibilityLabel="Sort answers by"
      accessibilityRole="button"
      triggerComponent={
        <Center py="xxsY" px="xxs">
          <SortIcon width={theme.iconSizes.l} height={theme.iconSizes.l} />
        </Center>
      }
      items={sortByMenuItems}
    />
  );
};

export default SortByMenu;
