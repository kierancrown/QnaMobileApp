import React, {FC, useMemo} from 'react';

import PopoverMenu, {
  PopoverMenuItemsProps,
} from 'app/components/common/PopoverMenu';
import {Theme, useAppTheme} from 'app/styles/theme';
import {Center} from 'app/components/common';

import HideIcon from 'app/assets/icons/actions/Hide.svg';
import ReportIcon from 'app/assets/icons/actions/ReportAlt.svg';
import TrashIcon from 'app/assets/icons/actions/Trash.svg';
import ElipsisIcon from 'app/assets/icons/actions/ellipsis.svg';

interface DefaultMenuProps {
  isOwner: boolean;
  iconSize?: keyof Theme['iconSizes'];
}

const DefaultMenu: FC<DefaultMenuProps> = ({isOwner, iconSize}) => {
  const theme = useAppTheme();
  const ellipsisIconSize = iconSize || 'l';

  const menuItems = useMemo(() => {
    return isOwner
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
  }, [isOwner, theme]);

  return (
    <PopoverMenu
      accessibilityLabel="Open Question Options"
      accessibilityRole="button"
      accessibilityHint="Report or hide this question"
      triggerComponent={
        <Center py="xxsY" px="xxs">
          <ElipsisIcon
            width={theme.iconSizes[ellipsisIconSize]}
            height={theme.iconSizes[ellipsisIconSize]}
          />
        </Center>
      }
      items={menuItems}
    />
  );
};

export default DefaultMenu;
