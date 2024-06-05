import React, {FC} from 'react';
import {BlurView} from '@react-native-community/blur';
import {StyleSheet} from 'react-native';

const BlurBackground: FC = () => {
  return <BlurView style={StyleSheet.absoluteFillObject} blurType="dark" />;
};

export default BlurBackground;
