import {FlashList} from '@shopify/flash-list';
import {useTabBarAnimation, useTabPress} from 'app/context/tabBarContext';
import {useBottomPadding} from 'app/hooks/useBottomPadding';
import {useAppTheme} from 'app/styles/theme';
import React, {FC, useRef, useState} from 'react';
import {Box, HStack, Text, VStack} from 'ui';
import {SearchHeader} from './components/Header';
import {interpolate, useSharedValue} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RefreshControl} from 'react-native';

export const SearchScreen: FC = () => {
  const scrollRef = useRef(null);
  const theme = useAppTheme();
  const bottomListPadding = useBottomPadding(theme.spacing.mY);
  const showNavBar = useSharedValue(1);
  const [headerHeight, setHeaderHeight] = useState(0);
  const {top: topInset} = useSafeAreaInsets();

  const [refreshing, setRefreshing] = useState(false);

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
    <VStack flex={1}>
      <SearchHeader
        showNavBar={showNavBar}
        onHeightChange={setHeaderHeight}
        onFocus={() => {
          scrollRef.current.scrollToOffset({offset: 0, animated: true});
        }}
      />
      <Box position="absolute" top={0} left={0} right={0} bottom={0}>
        <FlashList
          ref={scrollRef}
          refreshControl={<RefreshControl refreshing={refreshing} />}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            setTimeout(() => {
              setRefreshing(false);
            }, 2000);
          }}
          contentContainerStyle={{
            paddingTop: theme.spacing.mY + headerHeight,
            paddingBottom: bottomListPadding,
          }}
          data={[
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
            20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
          ]}
          keyExtractor={item => item.toString()}
          onScroll={({nativeEvent}) => {
            showNavBar.value = interpolate(
              nativeEvent.contentOffset.y,
              [0, headerHeight - topInset],
              [1, 0],
            );
            scrollHandlerWorklet(nativeEvent);
          }}
          estimatedItemSize={100}
          renderItem={({item}) => {
            return (
              <HStack py="sY" px="m">
                <Text variant="medium">{item}</Text>
              </HStack>
            );
          }}
        />
      </Box>
    </VStack>
  );
};
