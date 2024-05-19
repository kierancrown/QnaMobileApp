import {useEffect} from 'react';
import {BackHandler} from 'react-native';

const useAndroidBack = (onBack: () => void) => {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        onBack();
        return true;
      },
    );

    return () => backHandler.remove();
  }, [onBack]);
};

export default useAndroidBack;
