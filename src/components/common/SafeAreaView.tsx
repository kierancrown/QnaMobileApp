import React, {FC} from 'react';
import {Keyboard, Pressable, ViewStyle} from 'react-native';
import {
  Edges,
  SafeAreaView as RNSafeAreaView,
} from 'react-native-safe-area-context';

interface SafeAreaViewProps {
  children: React.ReactNode | React.ReactNode[];
  edges?: Edges;
  style?: ViewStyle;
}

const SafeAreaView: FC<SafeAreaViewProps> = ({children, edges, style}) => {
  const styles = {flex: 1, ...style};

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <Pressable style={styles} onPress={dismissKeyboard}>
      <RNSafeAreaView style={styles} edges={edges}>
        {children}
      </RNSafeAreaView>
    </Pressable>
  );
};

export default SafeAreaView;
