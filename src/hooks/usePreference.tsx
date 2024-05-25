import {useState} from 'react';
import useMount from './useMount';
import {useUser} from 'app/lib/supabase/context/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const usePreference = <T,>(key: string, defaultValue: T) => {
  const [value, _setValue] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(false);
  const {user} = useUser();

  const refresh = async () => {
    if (!user?.id) {
      return;
    }
    setLoading(true);
    await loadFromDisk();
    setLoading(false);
  };

  const setValue = async (newValue: T) => {
    if (user?.id) {
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
    if (!user?.id) {
      return;
    }
    const convertedValue =
      typeof newValue === 'object'
        ? JSON.stringify(newValue)
        : String(newValue);
    const concatedKey = `${user.id}-${key}`;
    return AsyncStorage.setItem(concatedKey, convertedValue);
  };

  const loadFromDisk = async () => {
    if (!user?.id) {
      return;
    }
    const concatedKey = `${user.id}-${key}`;
    const storedValue = await AsyncStorage.getItem(concatedKey);
    if (storedValue) {
      _setValue(JSON.parse(storedValue));
    }
  };

  useMount(refresh);

  return [value, setValue, {loading, refresh}] as const;
};

export default usePreference;
