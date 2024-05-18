import {useFocusEffect} from '@react-navigation/native';
import {Center, Flex, HStack, Text, VStack} from 'app/components/common';
import Input from 'app/components/common/TextInput';
import {setActionButton} from 'app/redux/slices/askSheetSlice';
import {AppDispatch} from 'app/redux/store';
import React, {FC, useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import Geolocation from '@react-native-community/geolocation';
import {ActivityIndicator, Alert} from 'react-native';
import {
  NearGeoLocation,
  useGeoLocationSearch,
} from 'app/hooks/useGeoLocationSearch';
import useMount from 'app/hooks/useMount';
import {FlashList} from '@shopify/flash-list';
import SettingsItem from 'app/screens/Settings/components/SettingsItem';

const LocationsScreen: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const {findNearestLocation, searchLocations} = useGeoLocationSearch();
  const [results, setResults] = useState<NearGeoLocation[]>([]);

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
          setResults(data);
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
        setResults(data);
      })();
    } else {
      getCurrent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  return (
    <VStack flex={1} py="mY">
      <VStack px="m">
        <Input
          placeholder="Search for a location"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </VStack>
      <Flex pt='mY'>
        {results.length === 0 ? (
          <Center flex={1}>
            <HStack alignItems="center" columnGap="xs">
              <ActivityIndicator size="small" />
              <Text>Searching for you...</Text>
            </HStack>
          </Center>
        ) : (
          <FlashList
            data={results}
            keyExtractor={item => item.id.toString()}
            estimatedItemSize={66}
            renderItem={({item}) => (
              <SettingsItem
                title={item.name}
                onPress={() => {
                  Alert.alert('hi');
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
