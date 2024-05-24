import Input from 'app/components/common/TextInput';
import {useTabBarAnimation, useTabPress} from 'app/context/tabBarContext';
import {useBottomPadding} from 'app/hooks/useBottomPadding';
import {useAppTheme} from 'app/styles/theme';
import React, {FC, useRef, useState} from 'react';
import {TextInput} from 'react-native';
import {Center, HStack, Text, VStack} from 'ui';
import {TouchableOpacity} from 'react-native-gesture-handler';

import SearchIcon from 'app/assets/icons/tabbar/Search.svg';
import ClearIcon from 'app/assets/icons/CircleCloseSolid.svg';
import {FlashListWithHeaders, Header} from '@codeherence/react-native-header';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const HeaderComponent = ({}: {showNavBar: SharedValue<number>}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const searchInput = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);
  const theme = useAppTheme();
  const showNavBar = useSharedValue(1);

  const rightAdornmentAnimatedStyle = useAnimatedStyle(() => {
    const show = focused && searchTerm.length > 0;
    return {
      opacity: withTiming(show ? 1 : 0, {duration: 220}),
      transform: [
        {
          translateX: withTiming(show ? 0 : theme.spacing.xs, {duration: 220}),
        },
      ],
    };
  }, [focused, searchTerm, theme.spacing.xs]);

  return (
    <Header
      showNavBar={showNavBar}
      noBottomBorder
      headerCenter={
        <VStack>
          <Center py="xxsY">
            <Text variant="medium">Discover</Text>
          </Center>
          <HStack py="sY" px="xs">
            <Input
              placeholder="topics, users, or questions, etc"
              onFocus={() => {
                setFocused(true);
              }}
              onBlur={() => {
                setFocused(false);
              }}
              leftAdornment={
                <Center>
                  <SearchIcon
                    width={theme.iconSizes.intermediate}
                    height={theme.iconSizes.intermediate}
                    fill={theme.colors.inputPlaceholder}
                  />
                </Center>
              }
              rightAdornment={
                <Animated.View style={rightAdornmentAnimatedStyle}>
                  <TouchableOpacity
                    hitSlop={8}
                    onPress={() => {
                      setSearchTerm('');
                    }}>
                    <Center>
                      <ClearIcon
                        width={theme.iconSizes.intermediate}
                        height={theme.iconSizes.intermediate}
                        fill={theme.colors.inputPlaceholder}
                      />
                    </Center>
                  </TouchableOpacity>
                </Animated.View>
              }
              ref={searchInput}
              value={searchTerm}
              onChangeText={setSearchTerm}
              returnKeyType="search"
              minWidth="100%"
              borderRadius="pill"
              variant="extraLargeInput"
            />
          </HStack>
        </VStack>
      }
    />
  );
};

const SearchScreen: FC = () => {
  const scrollRef = useRef(null);
  const theme = useAppTheme();
  const bottomListPadding = useBottomPadding(theme.spacing.mY);

  useTabPress({
    tabName: 'SearchTab',
    onPress: () => {
      if (scrollRef.current) {
        // @ts-ignore
        scrollRef.current.scrollToOffset({offset: 0, animated: true});
      }
    },
  });

  const {scrollHandlerWorklet} = useTabBarAnimation({
    scrollToTop: () => {
      if (scrollRef.current) {
        // @ts-ignore
        scrollRef.current.scrollToOffset({offset: 0, animated: true});
      }
    },
  });

  return (
    <FlashListWithHeaders
      ref={scrollRef}
      HeaderComponent={HeaderComponent}
      contentContainerStyle={{
        paddingTop: theme.spacing.mY,
        paddingBottom: bottomListPadding,
      }}
      data={[
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
      ]}
      keyExtractor={item => item.toString()}
      onScrollWorklet={scrollHandlerWorklet}
      estimatedItemSize={100}
      renderItem={({item}) => {
        return (
          <HStack py="sY" px="m">
            <Text variant="medium">{item}</Text>
          </HStack>
        );
      }}
    />
  );
};

export default SearchScreen;
