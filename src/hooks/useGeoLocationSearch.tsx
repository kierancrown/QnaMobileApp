import {supabase} from 'app/lib/supabase';

export interface NearGeoLocation {
  id: number;
  name: string;
  lat: number;
  long: number;
  dist_meters: number;
  display_name: string;
}

export const useGeoLocationSearch = () => {
  const findNearestLocation = async ({
    lat,
    long,
  }: {
    lat: number;
    long: number;
  }) => {
    const {data, error: err} = await supabase.rpc('nearby_geolocations', {
      lat,
      long,
    });

    if (err) {
      throw err;
    }

    return data ?? [];
  };

  const searchLocations = async (
    searchTerm: string,
  ): Promise<NearGeoLocation[]> => {
    const {data: locations, error: err} = await supabase
      .from('geolocations')
      .select('*')
      .ilike('name', `%${searchTerm}%`)
      .order('population', {ascending: false})
      .limit(10);

    if (err) {
      throw err;
    }

    return (
      locations.map(location => ({
        id: location.id,
        name: location.name,
        lat: 0,
        long: 0,
        dist_meters: 0,
        display_name: location.display_name,
      })) ?? []
    );
  };

  return {findNearestLocation, searchLocations};
};
