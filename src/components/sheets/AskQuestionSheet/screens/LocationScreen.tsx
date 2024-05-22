import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {Box, Center, Flex, HStack, Text, VStack} from 'app/components/common';
import Input from 'app/components/common/TextInput';
import {
  setActionButton,
  setSelectedLocation,
} from 'app/redux/slices/askSheetSlice';
import {AppDispatch, RootState} from 'app/redux/store';
import React, {FC, useEffect, useMemo, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Geolocation from '@react-native-community/geolocation';
import {ActivityIndicator, StyleProp, TextInput, ViewStyle} from 'react-native';
import {
  NearGeoLocation,
  useGeoLocationSearch,
} from 'app/hooks/useGeoLocationSearch';
import useMount from 'app/hooks/useMount';
import SelectionItem from 'app/components/common/SelectionItem';
import {AskQuestionStackParamList} from '..';
import {useAppTheme} from 'app/styles/theme';
import LinearGradient from 'react-native-linear-gradient';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';

const LocationsScreen: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedLocation = useSelector(
    (state: RootState) => state.nonPersistent.askSheet.selectedLocation,
  );
  const [searchTerm, setSearchTerm] = useState<string>('');
  const {findNearestLocation, searchLocations} = useGeoLocationSearch();
  const [results, setResults] = useState<NearGeoLocation[]>([]);
  const {goBack} = useNavigation<NavigationProp<AskQuestionStackParamList>>();
  const searchInput = useRef<TextInput>(null);
  const theme = useAppTheme();

  const listHeaderGradientStyles: StyleProp<ViewStyle> = useMemo(
    () => ({
      width: '100%',
      height: theme.spacing.xlY,
    }),
    [theme],
  );

  useFocusEffect(() => {
    dispatch(setActionButton('back'));
  });

  const getCurrent = () => {
    try {
      Geolocation.getCurrentPosition(info => {
        (async () => {
          console.log(info);
          const data = await findNearestLocation({
            lat: info.coords.latitude,
            long: info.coords.longitude,
          });
          if (
            selectedLocation &&
            !data.find(d => d.id === selectedLocation?.id)
          ) {
            setResults([selectedLocation, ...data]);
          } else {
            setResults(data);
          }
        })();
      });
    } catch (error) {
      console.log(error);
    }
  };

  useMount(getCurrent);

  useEffect(() => {
    if (searchTerm.length > 2) {
      (async () => {
        const data = await searchLocations(searchTerm);
        // @ts-ignore
        setResults(data);
      })();
    } else {
      getCurrent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  return (
    <VStack flex={1}>
      <VStack px="s" pt="mY">
        <Input
          placeholder="Search for a location"
          ref={searchInput}
          value={searchTerm}
          onChangeText={setSearchTerm}
          returnKeyType="search"
          insideBottomSheet
        />
      </VStack>

      <Flex>
        <Box position="absolute" top={0} left={0} right={0} zIndex={10}>
          <LinearGradient
            colors={[theme.colors.mainBackground, theme.colors.none]}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            style={listHeaderGradientStyles}
          />
        </Box>
        {results.length === 0 ? (
          <Center flex={1}>
            <HStack alignItems="center" columnGap="xs">
              <ActivityIndicator size="small" />
              <Text>Searching for you...</Text>
            </HStack>
          </Center>
        ) : (
          <BottomSheetFlatList
            data={results}
            keyExtractor={item => item.id.toString()}
            keyboardShouldPersistTaps="always"
            contentContainerStyle={{
              paddingVertical: theme.spacing.mY,
            }}
            renderItem={({item}) => (
              <SelectionItem
                title={item.name}
                subtitle={
                  // Remove the first part including the first comma
                  item.display_name.split(',').slice(1).join(',')
                }
                selected={selectedLocation?.id === item.id}
                onSelected={() => {
                  dispatch(setSelectedLocation(item));
                  goBack();
                }}
              />
            )}
          />
        )}
      </Flex>
    </VStack>
  );
};

export default LocationsScreen;
