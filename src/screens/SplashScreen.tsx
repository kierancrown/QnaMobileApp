import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import React from 'react';

import LottieAnimation from 'app/assets/animations/splash-green.json';
// import {Skottie} from 'react-native-skottie';
import Lottie from 'lottie-react-native';

import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useTheme} from '@shopify/restyle';
import {Theme} from 'app/styles/theme';
import {WINDOW_WIDTH} from '@gorhom/bottom-sheet';

interface SplashScreenProps {
  onDismiss: () => void;
}

const SplashScreen = ({onDismiss}: SplashScreenProps) => {
  const opacity = useSharedValue(1);
  const theme = useTheme<Theme>();

  const onInternalDismiss = () => {
    opacity.value = withTiming(0, {duration: 500}, () => {
      runOnJS(onDismiss)();
    });
  };

  const backgroundColorStyle: StyleProp<ViewStyle> = {
    backgroundColor: theme.colors.black,
  };

  const animatedBackgroundStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <>
      <Animated.View
        style={[
          styles.container,
          backgroundColorStyle,
          StyleSheet.absoluteFill,
          animatedBackgroundStyle,
        ]}>
        <View style={styles.animation}>
          <Lottie
            source={LottieAnimation}
            autoPlay
            loop={false}
            resizeMode="cover"
            style={styles.lottieView}
            onAnimationFinish={onInternalDismiss}
          />
        </View>
      </Animated.View>
    </>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: Number.MAX_SAFE_INTEGER,
  },
  animation: {
    width: WINDOW_WIDTH * 0.8,
    aspectRatio: 1,
  },
  lottieView: {
    flex: 1,
  },
});
