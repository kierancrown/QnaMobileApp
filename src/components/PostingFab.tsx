import React, {FC, useEffect} from 'react';
import {HStack, ActivityLoader, Center, Text} from './common';
import {useBottomPadding} from 'app/hooks/useBottomPadding';
import {useAppTheme} from 'app/styles/theme';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {useTabBar} from 'app/context/tabBarContext';
import {ESTIMATED_TABBAR_HEIGHT} from './common/TabBar/FloatingTabBar';

interface PostingFabProps {
  isVisible: boolean;
}

const PostingFab: FC<PostingFabProps> = ({isVisible}) => {
  const theme = useAppTheme();
  const {scrollDirection} = useTabBar();
  const bottomPadding = useBottomPadding(theme.spacing.mY);

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(theme.spacing.mY);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{translateY: translateY.value}],
      zIndex: 100,
    };
  }, []);

  useEffect(() => {
    opacity.value = withTiming(isVisible ? 1 : 0, {duration: 200});
    translateY.value = withSpring(
      isVisible
        ? scrollDirection === 'down'
          ? ESTIMATED_TABBAR_HEIGHT + theme.spacing.mY
          : 0
        : theme.spacing.mY,
      {
        damping: 15,
        stiffness: 100,
      },
    );
  }, [
    isVisible,
    opacity,
    theme.spacing.mY,
    translateY,
    scrollDirection,
    theme.spacing.xsY,
    bottomPadding,
  ]);

  return (
    <Animated.View style={animatedStyles} pointerEvents="none">
      <Center position="absolute" bottom={bottomPadding} left={0} right={0}>
        <HStack
          alignItems="center"
          columnGap="xxxxs"
          bg="mainBackground"
          borderRadius="pill"
          borderWidth={2}
          borderColor="cardBackground"
          px="xxs"
          py="xxxsY">
          <ActivityLoader size="s" />
          <Text variant="medium" marginEnd="s">
            Posting Question
          </Text>
        </HStack>
      </Center>
    </Animated.View>
  );
};

export default PostingFab;
