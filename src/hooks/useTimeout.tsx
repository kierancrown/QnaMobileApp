import React from 'react';

const useTimeout = (callback: () => void, delay: number) => {
  React.useEffect(() => {
    const id = setTimeout(() => {
      callback();
    }, delay);
    return () => clearTimeout(id);
  }, [callback, delay]);
};

export default useTimeout;
