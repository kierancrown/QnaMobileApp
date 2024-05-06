import {ScrollViewWithHeaders} from '@codeherence/react-native-header';
import {Text} from 'app/components/common';
import React from 'react';
import HeaderComponent from './components/Header';
import LargeHeaderComponent from './components/LargeHeader';
import {useAppTheme} from 'app/styles/theme';
import {useBottomPadding} from 'app/hooks/useBottomPadding';
import {useTabBar} from 'app/context/tabBarContext';
import {useFocusEffect} from '@react-navigation/native';

const SettingsScren = () => {
  const theme = useAppTheme();
  const bottomListPadding = useBottomPadding(theme.spacing.mY);
  const {setHidden} = useTabBar();

  useFocusEffect(() => {
    console.log('SettingsScren focused');
    setHidden(true);
    return () => {
      console.log('SettingsScren unfocused');
      setHidden(false);
    };
  });

  return (
    <ScrollViewWithHeaders
      HeaderComponent={HeaderComponent}
      LargeHeaderComponent={LargeHeaderComponent}
      contentContainerStyle={{
        paddingBottom: bottomListPadding,
      }}>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
      <Text>Settings</Text>
    </ScrollViewWithHeaders>
  );
};

export default SettingsScren;
