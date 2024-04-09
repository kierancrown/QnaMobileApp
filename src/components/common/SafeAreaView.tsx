import React, {FC} from 'react';
import {Keyboard, Pressable} from 'react-native';
import {SafeAreaView as RNSafeAreaView} from 'react-native-safe-area-context';

interface SafeAreaViewProps {
  children: React.ReactNode | React.ReactNode[];
}

const SafeAreaView: FC<SafeAreaViewProps> = ({children}) => {
  const style = {flex: 1};

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <Pressable style={style} onPress={dismissKeyboard}>
      <RNSafeAreaView style={style}>{children}</RNSafeAreaView>
    </Pressable>
  );
};

export default SafeAreaView;
