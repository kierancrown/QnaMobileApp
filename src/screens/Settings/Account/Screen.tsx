import {ScrollViewWithHeaders} from '@codeherence/react-native-header';
import React from 'react';
import HeaderComponent from '../components/Header';
import {useAppTheme} from 'app/styles/theme';
import {useBottomPadding} from 'app/hooks/useBottomPadding';
import {useHiddenTabBar} from 'app/context/tabBarContext';
import SettingsItem from '../components/SettingsItem';
import {HStack, Text, VStack} from 'app/components/common';
import Avatar from 'app/components/common/Avatar';
import Username from 'app/components/Username';

const SettingsAccountScreen = () => {
  const theme = useAppTheme();
  const bottomListPadding = useBottomPadding(theme.spacing.mY);
  useHiddenTabBar();

  return (
    <ScrollViewWithHeaders
      HeaderComponent={HeaderComponent}
      contentContainerStyle={{
        paddingTop: theme.spacing.mY,
        paddingBottom: bottomListPadding,
      }}>
      <VStack py="sY" px="s">
        <HStack columnGap="m" alignItems="center">
          <Avatar size="xxxl" />
          <VStack rowGap="xxxsY">
            <Username
              variant="markdownH3"
              username="KieranCrown"
              isVerified
              noHighlight
            />
            <Text variant="body" color="cardText">
              Joined 01/01/1996
            </Text>
          </VStack>
        </HStack>
      </VStack>

      <SettingsItem title="Change username" onPress={() => {}} />
      <SettingsItem title="Update profile picture" onPress={() => {}} />

      <SettingsItem
        title="Delete account"
        titleColor="destructiveAction"
        onPress={() => {}}
      />
    </ScrollViewWithHeaders>
  );
};

export default SettingsAccountScreen;
