import React, {FC} from 'react';
import {Keyboard, Pressable} from 'react-native';
import {
  Edges,
  SafeAreaView as RNSafeAreaView,
} from 'react-native-safe-area-context';

interface SafeAreaViewProps {
  children: React.ReactNode | React.ReactNode[];
  edges?: Edges;
}

const SafeAreaView: FC<SafeAreaViewProps> = ({children, edges}) => {
  const style = {flex: 1};

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <Pressable style={style} onPress={dismissKeyboard}>
      <RNSafeAreaView style={style} edges={edges}>
        {children}
      </RNSafeAreaView>
    </Pressable>
  );
};

export default SafeAreaView;
