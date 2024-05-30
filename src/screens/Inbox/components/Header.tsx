import {Center, HStack} from 'app/components/common';
import HeaderBar from 'app/components/common/HeaderBar';
import {useAppTheme} from 'app/styles/theme';
import React, {FC, useState} from 'react';

import ElipsisIcon from 'app/assets/icons/actions/ellipsis.svg';
import AnimatedHeader from 'app/components/common/Header/AnimatedHeader';
import PopoverMenu from 'app/components/common/PopoverMenu';

const HeaderTabs = ['All', 'Requested', 'Notifications'];

interface HeaderComponentProps {
  onSize?: (size: {width: number; height: number}) => void;
}

export const HeaderComponent: FC<HeaderComponentProps> = ({onSize}) => {
  const theme = useAppTheme();
  const [selectedTab, setSelectedTab] =
    useState<(typeof HeaderTabs)[number]>('For You');

  return (
    <AnimatedHeader onSize={onSize} absoluteFill>
      <HStack py="sY" columnGap="xs" alignItems="center">
        <HeaderBar
          tabItems={HeaderTabs}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
        <Center paddingEnd="xs">
          <PopoverMenu
            accessibilityLabel="Open Inbox Options"
            accessibilityRole="button"
            accessibilityHint="Mark all as read"
            triggerComponent={
              <Center py="xsY" px="xs">
                <ElipsisIcon
                  width={theme.iconSizes.l}
                  height={theme.iconSizes.l}
                />
              </Center>
            }
            items={[
              {
                title: 'Mark all as read',
                onPress: () => {},
              },
            ]}
          />
        </Center>
      </HStack>
    </AnimatedHeader>
  );
};

export default HeaderComponent;
