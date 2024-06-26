import {useState} from 'react';
import useMount from './useMount';
import {supabase} from 'app/lib/supabase';
import {Json} from 'app/types/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuth} from './useAuth';

const useSyncedPreference = <T,>(key: string, defaultValue: T) => {
  const [id, setId] = useState<number>();
  const [value, _setValue] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(false);
  const {authStatus, profile} = useAuth({});

  const refresh = async () => {
    if (authStatus !== 'SIGNED_IN' || !profile?.user_id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from('user_preferences')
      .select('id, value')
      .eq('key', key)
      .eq('user_id', profile.user_id)
      .then(({data, error}) => {
        if (error) {
          console.error('Error fetching user preferences', error);
          setLoading(false);
          return;
        }
        if (data.length === 0) {
          _setValue(defaultValue);
          return;
        }
        const {id: _id, value: rest} = data[0];
        setId(_id);
        _setValue(rest as T);
        setLoading(false);
      });
  };

  const setValue = async (newValue: T) => {
    if (authStatus === 'SIGNED_IN' && profile?.user_id) {
      setLoading(true);
      _setValue(newValue);
      try {
        const {error} = await supabase.from('user_preferences').upsert({
          id,
          key,
          value: (typeof newValue === 'string'
            ? {value: newValue}
            : newValue) as Json,
          user_id: profile.user_id,
        });

        if (error) {
          console.error('Error updating user preferences', error);
          setLoading(false);
          return;
        }
        await refresh();
        await saveToDisk(newValue);
      } catch (error) {
        console.error('Error updating user preferences', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const saveToDisk = async (newValue: T) => {
    const convertedValue =
      typeof newValue === 'object'
        ? JSON.stringify(newValue)
        : String(newValue);
    return AsyncStorage.setItem(key, convertedValue);
  };

  const loadFromDisk = async () => {
    try {
      const storedValue = await AsyncStorage.getItem(key);
      if (storedValue) {
        try {
          _setValue(JSON.parse(storedValue));
        } catch (error) {
          _setValue(storedValue as T);
        }
      }
    } catch (error) {
      console.log('Error loading user preferences from disk', error);
    }
  };

  useMount(loadFromDisk);
  useMount(refresh);

  return [value, setValue, {loading, refresh}] as const;
};

export default useSyncedPreference;
