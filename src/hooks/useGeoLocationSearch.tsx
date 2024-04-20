import {supabase} from 'app/lib/supabase';

export interface NearGeoLocation {
  id: number;
  name: string;
  lat: number;
  long: number;
  dist_meters: number;
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

  return {findNearestLocation};
};
