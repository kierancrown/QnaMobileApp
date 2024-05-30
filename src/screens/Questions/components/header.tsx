import {Center, HStack} from 'app/components/common';
import HeaderBar from 'app/components/common/HeaderBar';
import {useAppTheme} from 'app/styles/theme';
import React, {FC, useState} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';

import FilterIcon from 'app/assets/icons/actions/Filter.svg';
import AnimatedHeader from 'app/components/common/Header/AnimatedHeader';

const HeaderTabs = ['For You', 'Trending', 'Near Me', 'Discover'];

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
          <TouchableOpacity hitSlop={8}>
            <FilterIcon
              width={theme.iconSizes.intermediate}
              height={theme.iconSizes.intermediate}
            />
          </TouchableOpacity>
        </Center>
      </HStack>
    </AnimatedHeader>
  );
};

export default HeaderComponent;
