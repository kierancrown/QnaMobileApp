import {ScrollViewWithHeaders} from '@codeherence/react-native-header';
import React from 'react';
import HeaderComponent from '../components/Header';
import {useAppTheme} from 'app/styles/theme';
import {useBottomPadding} from 'app/hooks/useBottomPadding';
import {useHiddenTabBar} from 'app/context/tabBarContext';
import SettingsItem from '../components/SettingsItem';
import {Text, VStack} from 'app/components/common';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {ProfileStackParamList} from 'app/navigation/ProfileStack';

const SettingsAboutScreen = () => {
  const theme = useAppTheme();
  const bottomListPadding = useBottomPadding(theme.spacing.mY);
  const {navigate} = useNavigation<NavigationProp<ProfileStackParamList>>();
  useHiddenTabBar();

  return (
    <ScrollViewWithHeaders
      HeaderComponent={HeaderComponent}
      contentContainerStyle={{
        paddingTop: theme.spacing.mY,
        paddingBottom: bottomListPadding,
      }}>
      <SettingsItem
        title="Privacy Policy"
        onPress={() => {
          navigate('SettingsDocumentViewer', {
            headerTitle: 'Privacy Policy',
            documentName: 'privacy_policy',
          });
        }}
      />
      <SettingsItem
        title="Terms of Service"
        onPress={() => {
          navigate('SettingsDocumentViewer', {
            headerTitle: 'Terms of Service',
            documentName: 'terms_of_service',
          });
        }}
      />
      <SettingsItem title="Third-Party licences" onPress={() => {}} />
      <VStack py="lY" px="s" rowGap="xsY" opacity={0.66}>
        <Text variant="smallBody" color="cardText">
          Version 1.0.0
        </Text>
        <Text variant="smallBody" color="cardText">
          Build 1
        </Text>
      </VStack>
    </ScrollViewWithHeaders>
  );
};

export default SettingsAboutScreen;
