import {Header} from '@codeherence/react-native-header';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {Center, HStack, Text} from 'app/components/common';
import {useAppTheme} from 'app/styles/theme';
import React, {useMemo} from 'react';
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

const HeaderComponent = ({showNavBar}: {showNavBar: SharedValue<number>}) => {
  const {
    params: {responseCount, isOwner},
  } = useRoute<RouteProp<HomeStackParamList, 'QuestionDetail'>>();
  const {goBack} = useNavigation();
  const theme = useAppTheme();

  const menuItems: PopoverMenuItemsProps = useMemo(
    () =>
      isOwner
        ? ([
            {
              title: 'Delete',
              titleColor: 'destructiveAction',
              right: (
                <TrashIcon
                  color={theme.colors.destructiveAction}
                  width={theme.iconSizes.m}
                  height={theme.iconSizes.m}
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
                  width={theme.iconSizes.m}
                  height={theme.iconSizes.m}
                />
              ),
            },
            {
              title: 'Report',
              titleColor: 'destructiveAction',
              right: (
                <ReportIcon
                  color={theme.colors.destructiveAction}
                  width={theme.iconSizes.m}
                  height={theme.iconSizes.m}
                />
              ),
            },
          ] as PopoverMenuItemsProps),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isOwner],
  );

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
            items={menuItems}
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
            items={menuItems}
          />
        </HStack>
      }
    />
  );
};

export default HeaderComponent;
