import React, {FC} from 'react';
import {SafeAreaView as RNSafeAreaView} from 'react-native-safe-area-context';

interface SafeAreaViewProps {
  children: React.ReactNode | React.ReactNode[];
}

const SafeAreaView: FC<SafeAreaViewProps> = ({children}) => {
  const style = {flex: 1};
  return <RNSafeAreaView style={style}>{children}</RNSafeAreaView>;
};

export default SafeAreaView;
