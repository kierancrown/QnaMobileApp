import axios from 'axios';
import {useEffect, useState} from 'react';
import {useDebounceValue} from 'usehooks-ts';

const validUsername = (username: string) => {
  // Regex to check the following
  // - Starts with a letter
  // - Can be followed by letters, numbers, or underscores
  // - Must be at least 3 characters long
  // - Must be at most 16 characters long
  const regex = /^[a-zA-Z][a-zA-Z0-9_]{2,15}$/;
  return regex.test(username);
};

export const useUsernameCheck = (username: string) => {
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [invalidUsername, setInvalidUsername] = useState(false);
  const [ignoreResponse, setIgnoreResponse] = useState(false);
  const [loading, setLoading] = useState(false);

  const [debouncedUsername] = useDebounceValue(username.trim(), 500);

  useEffect(() => {
    const checkUsernameAvailability = async () => {
      if (debouncedUsername.length === 0) {
        setIgnoreResponse(true);
        return;
      }
      setIgnoreResponse(false);
      if (!validUsername(debouncedUsername)) {
        setInvalidUsername(true);
        return;
      }
      setUsernameAvailable(false);
      setLoading(true);
      setInvalidUsername(false);
      try {
        const response = await axios.post<{
          available: boolean;
        }>('https://api.getqna.app/functions/v1/username-available', {
          username: debouncedUsername,
        });
        setUsernameAvailable(response.data.available);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    checkUsernameAvailability();
  }, [debouncedUsername]);

  return {
    usernameAvailable,
    invalidUsername,
    ignoreResponse,
    loading,
  };
};
