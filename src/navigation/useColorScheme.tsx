import {useColorScheme as useSystemColorScheme} from 'react-native';
import {RootState} from 'app/redux/store';
import {useSelector} from 'react-redux';

export const useColorScheme = () => {
  const mode = useSelector((state: RootState) => state.persistent.theme.mode);
  const systemScheme = useSystemColorScheme();
  return mode === 'system' ? systemScheme : mode;
};

export default useColorScheme;
