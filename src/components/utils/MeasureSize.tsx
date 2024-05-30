import React, {FC} from 'react';
import {View} from 'react-native';

interface MeasureSizeProps {
  onSize: (size: {width: number; height: number}) => void;
  children: React.ReactNode;
}

export const MeasureSize: FC<MeasureSizeProps> = ({children, onSize}) => {
  const [size, setSize] = React.useState({width: 0, height: 0});
  const onLayout = (event: any) => {
    const {width, height} = event.nativeEvent.layout;
    if (size.width !== width || size.height !== height) {
      setSize({width, height});
      onSize({width, height});
    }
  };

  return <View onLayout={onLayout}>{children}</View>;
};
