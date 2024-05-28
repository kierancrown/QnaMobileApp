import {Box, Center, HStack, VStack} from 'app/components/common';
import Input from 'app/components/common/TextInput';
import React, {FC, useEffect, useRef, useState} from 'react';
import Animated, {
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import SearchIcon from 'app/assets/icons/tabbar/Search.svg';
import {useAppTheme} from 'app/styles/theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {WINDOW_WIDTH} from '@gorhom/bottom-sheet';
import LinearGradient from 'react-native-linear-gradient';
import Color from 'color';
import {StyleSheet, TextInput, View, ViewStyle} from 'react-native';
import HeaderBar from 'app/components/common/HeaderBar';

interface SearchHeaderProps {
  showNavBar: SharedValue<number>;
  onHeightChange: (height: number) => void;
  onFocus: () => void;
}

const OUTER_STYLE: ViewStyle = {
  zIndex: 100,
};

const HeaderTabs = ['Topics', 'People', 'Questions'];

export const SearchHeader: FC<SearchHeaderProps> = ({
  showNavBar,
  onHeightChange,
  onFocus,
}) => {
  const theme = useAppTheme();
  const searchInput = useRef<TextInput>(null);
  const {top: topInset} = useSafeAreaInsets();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const topColor = Color(theme.colors.mainBackground).alpha(0.9).hexa();
  const [selectedTab, setSelectedTab] =
    useState<(typeof HeaderTabs)[number]>('Topics');

  useEffect(() => {
    if (showNavBar.value === 0) {
      searchInput.current?.blur();
    }
  }, [isFocused, showNavBar]);

  const inputAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: showNavBar.value,
      paddingTop: topInset,
      transform: [
        {translateY: interpolate(showNavBar.value, [0, 1], [-100, 1])},
      ],
    };
  }, []);

  return (
    <View
      style={OUTER_STYLE}
      onLayout={({nativeEvent}) => {
        onHeightChange(nativeEvent.layout.height);
      }}>
      <VStack>
        <Box
          pointerEvents="none"
          position="absolute"
          top={0}
          height={topInset * 2}
          width={WINDOW_WIDTH}>
          <LinearGradient
            colors={[theme.colors.mainBackground, topColor, theme.colors.none]}
            locations={[0, 0.1, 1]}
            style={{
              ...StyleSheet.absoluteFillObject,
              height: topInset * 2,
            }}
          />
        </Box>
        <Animated.View style={inputAnimatedStyle}>
          <VStack>
            <HStack py="sY" px="xs">
              <Input
                placeholder="topics, users, or questions, etc"
                onFocus={() => {
                  setIsFocused(true);
                  onFocus();
                }}
                onBlur={() => {
                  setIsFocused(false);
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
                clearButton
                onClear={() => {
                  setSearchTerm('');
                }}
                ref={searchInput}
                value={searchTerm}
                onChangeText={setSearchTerm}
                returnKeyType="search"
                minWidth="100%"
                borderRadius="pill"
                variant="extraLargeInput"
              />
            </HStack>
            <HeaderBar
              tabItems={HeaderTabs}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
          </VStack>
        </Animated.View>
      </VStack>
    </View>
  );
};
