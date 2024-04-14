import React, {useMemo} from 'react';
import {BottomSheetBackdropProps} from '@gorhom/bottom-sheet';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {useAppTheme} from 'app/styles/theme';
import {Button, Flex, HStack, SafeAreaView} from 'app/components/common';
import Avatar from 'app/components/common/Avatar';
import {Alert} from 'react-native';

const CustomBackdrop = ({animatedIndex, style}: BottomSheetBackdropProps) => {
  const theme = useAppTheme();
  // animated variables
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [-1, 0],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  const buttonsContainerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          animatedIndex.value,
          [-1, 0],
          [theme.spacing.lY, 0],
          Extrapolation.CLAMP,
        ),
      },
    ],
    opacity: interpolate(
      animatedIndex.value,
      [-0.5, 0],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  // styles
  const containerStyle = useMemo(
    () => [
      style,
      {
        backgroundColor: theme.colors.cardBackground,
      },
      containerAnimatedStyle,
    ],
    [style, containerAnimatedStyle, theme.colors.cardBackground],
  );

  return (
    <Animated.View pointerEvents="none" style={containerStyle}>
      <SafeAreaView>
        <Animated.View style={buttonsContainerAnimatedStyle}>
          <HStack
            alignItems="center"
            height={theme.spacing.xxlY}
            px="m"
            zIndex={999}>
            <Avatar />
            <Flex />
            <Button
              title="Ask"
              borderRadius="pill"
              px="l"
              onPress={() => {
                Alert.alert('hi');
              }}
            />
          </HStack>
        </Animated.View>
      </SafeAreaView>
    </Animated.View>
  );
};

export default CustomBackdrop;
