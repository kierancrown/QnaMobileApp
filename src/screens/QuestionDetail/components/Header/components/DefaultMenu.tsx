import React, {FC, useCallback, useMemo} from 'react';

import PopoverMenu, {
  PopoverMenuItemsProps,
} from 'app/components/common/PopoverMenu';
import {Theme, useAppTheme} from 'app/styles/theme';
import {Center} from 'app/components/common';

import HideIcon from 'app/assets/icons/actions/Hide.svg';
import ReportIcon from 'app/assets/icons/actions/ReportAlt.svg';
import TrashIcon from 'app/assets/icons/actions/Trash.svg';
import ElipsisIcon from 'app/assets/icons/actions/ellipsis.svg';
import {supabase} from 'app/lib/supabase';
import {useAlert} from 'app/components/AlertsWrapper';

interface DefaultMenuProps {
  isOwner: boolean;
  iconSize?: keyof Theme['iconSizes'];
  questionId: number;
}

const DefaultMenu: FC<DefaultMenuProps> = ({isOwner, iconSize, questionId}) => {
  const theme = useAppTheme();
  const {openAlert} = useAlert();
  const ellipsisIconSize = iconSize || 'l';

  const deleteSelf = useCallback(() => {
    if (isOwner) {
      openAlert({
        title: 'Delete Question',
        message: 'Are you sure you want to delete this question?',
        buttons: [
          {
            text: 'Cancel',
          },
          {
            text: 'Delete',
            variant: 'destructive',
            onPress: async () => {
              const {error} = await supabase
                .from('questions')
                .delete()
                .eq('id', questionId);
              if (error) {
                console.error(error);
                openAlert({
                  title: 'Error',
                  message: error.message,
                });
              } else {
                openAlert({
                  title: 'Success',
                  message: 'Question deleted',
                });
              }
            },
          },
        ],
      });
    }
  }, [isOwner, openAlert, questionId]);

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
            onPress: deleteSelf,
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
  }, [
    isOwner,
    deleteSelf,
    theme.colors.cardText,
    theme.colors.destructiveAction,
    theme.iconSizes.popover,
  ]);

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
