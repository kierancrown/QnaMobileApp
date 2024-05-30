import {Center, HStack, VStack} from 'app/components/common';
import HeaderBar from 'app/components/common/HeaderBar';
import {useAppTheme} from 'app/styles/theme';
import React, {FC, useRef, useState} from 'react';

import AnimatedHeader from 'app/components/common/Header/AnimatedHeader';
import Input from 'app/components/common/TextInput';

import {TextInput} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import FilterIcon from 'app/assets/icons/actions/Filter.svg';
import SearchIcon from 'app/assets/icons/tabbar/Search.svg';

const HeaderTabs = ['Topics', 'People', 'Questions'];

interface HeaderComponentProps {
  onSize?: (size: {width: number; height: number}) => void;
}

export const HeaderComponent: FC<HeaderComponentProps> = ({onSize}) => {
  const theme = useAppTheme();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTab, setSelectedTab] =
    useState<(typeof HeaderTabs)[number]>('For You');

  const searchInput = useRef<TextInput>(null);

  return (
    <AnimatedHeader onSize={onSize} absoluteFill>
      <VStack rowGap="xsY">
        <HStack px="xs" alignItems="center">
          <Input
            placeholder="topics, users, or questions, etc"
            leftAdornment={
              <Center>
                <SearchIcon
                  width={theme.iconSizes.intermediate}
                  height={theme.iconSizes.intermediate}
                  fill={theme.colors.inputPlaceholder}
                />
              </Center>
            }
            clearButton
            onClear={() => {
              setSearchTerm('');
            }}
            ref={searchInput}
            value={searchTerm}
            onChangeText={setSearchTerm}
            returnKeyType="search"
            minWidth="100%"
            borderRadius="pill"
            variant="extraLargeInput"
          />
        </HStack>
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
      </VStack>
    </AnimatedHeader>
  );
};

export default HeaderComponent;
