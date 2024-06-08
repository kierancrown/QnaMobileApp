import {SCREEN_HEIGHT} from '@gorhom/bottom-sheet';
import {useFocusEffect} from '@react-navigation/native';
import {setSheetSnapPoints} from 'app/redux/slices/authSheetSlice';
import {useAppDispatch} from 'app/redux/store';

export const useSheetNavigationHeight = (height: number | string) => {
  const dispatch = useAppDispatch();

  useFocusEffect(() => {
    dispatch(setSheetSnapPoints([height]));

    return () => {
      dispatch(setSheetSnapPoints([SCREEN_HEIGHT / 2]));
    };
  });
};
