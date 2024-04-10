import React, {FC} from 'react';

import HomeTabBarIcon from 'app/components/common/TabBar/Icons/HomeTabBarIcon';
import SearchTabBarIcon from 'app/components/common/TabBar/Icons/SearchTabBarIcon';
import InboxTabBarIcon from 'app/components/common/TabBar/Icons/InboxTabBarIcon';
import ProfileTabBarIcon from 'app/components/common/TabBar/Icons/ProfileTabBarIcon';

import {Box, Center, HStack, VStack} from 'ui';
import {useTheme} from '@shopify/restyle';
import {Theme} from 'app/styles/theme';
import {WINDOW_WIDTH} from '@gorhom/bottom-sheet';

import PlusIcon from 'app/assets/icons/Plus.svg';

interface FloatTabBarProps {}

const ICON_SIZE = 24;
const CTA_SIZE = 72;
const DOT_SIZE = 4;

const FloatTabBar: FC<FloatTabBarProps> = () => {
  const theme = useTheme<Theme>();
  const activeColor = theme.colors.brand;
  const inactiveColor = theme.colors.cardText;

  return (
    <Box>
      <HStack
        width="100%"
        justifyContent="space-around"
        alignItems="center"
        py="sY"
        px="m"
        columnGap="l"
        borderRadius="pill"
        backgroundColor="cardBackground"
        shadowColor="black"
        shadowOffset={{
          width: 0,
          height: 2,
        }}
        shadowOpacity={0.33}>
        <VStack alignItems="center">
          <HomeTabBarIcon size={ICON_SIZE} focused={true} color={activeColor} />
          <Box
            width={ICON_SIZE / 1.5}
            height={DOT_SIZE}
            borderRadius="pill"
            backgroundColor="brand"
            position="absolute"
            top={ICON_SIZE + DOT_SIZE / 1.5}
          />
        </VStack>
        <SearchTabBarIcon
          size={ICON_SIZE}
          focused={false}
          color={inactiveColor}
        />
        <Box width={CTA_SIZE} />
        <InboxTabBarIcon
          size={ICON_SIZE}
          focused={false}
          color={inactiveColor}
        />
        <ProfileTabBarIcon
          size={ICON_SIZE}
          focused={false}
          color={inactiveColor}
        />
      </HStack>
      <Center
        width={CTA_SIZE}
        height={CTA_SIZE}
        position="absolute"
        backgroundColor="brand"
        top={-theme.spacing.xsY}
        left={(WINDOW_WIDTH - theme.spacing.l * 2 - CTA_SIZE) / 2}
        shadowColor="black"
        shadowOffset={{
          width: 0,
          height: 2,
        }}
        shadowOpacity={0.33}
        borderRadius="pill">
        <PlusIcon
          width={ICON_SIZE * 1.2}
          height={ICON_SIZE * 1.2}
          fill={theme.colors.white}
        />
      </Center>
    </Box>
  );
};

export default FloatTabBar;
