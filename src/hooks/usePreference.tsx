import {useState} from 'react';
import useMount from './useMount';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuth} from './useAuth';

const usePreference = <T,>(key: string, defaultValue: T) => {
  const [value, _setValue] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(false);
  const {profile, authStatus} = useAuth({});

  const refresh = async () => {
    if (authStatus !== 'SIGNED_IN') {
      return;
    }
    setLoading(true);
    await loadFromDisk();
    setLoading(false);
  };

  const setValue = async (newValue: T) => {
    if (authStatus === 'SIGNED_IN') {
      setLoading(true);
      _setValue(newValue);
      try {
        await saveToDisk(newValue);
      } catch (error) {
        console.error('Error updating user preferences', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const saveToDisk = async (newValue: T) => {
    if (authStatus !== 'SIGNED_IN' || !profile?.user_id) {
      return;
    }
    const convertedValue =
      typeof newValue === 'object'
        ? JSON.stringify(newValue)
        : String(newValue);
    const concatedKey = `${profile?.user_id}-${key}`;
    return AsyncStorage.setItem(concatedKey, convertedValue);
  };

  const loadFromDisk = async () => {
    if (authStatus !== 'SIGNED_IN' || !profile?.user_id) {
      return;
    }
    const concatedKey = `${profile?.user_id}-${key}`;
    const storedValue = await AsyncStorage.getItem(concatedKey);
    if (storedValue) {
      _setValue(JSON.parse(storedValue));
    }
  };

  useMount(refresh);

  return [value, setValue, {loading, refresh}] as const;
};

export default usePreference;
