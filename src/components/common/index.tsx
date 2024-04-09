export {default as Box} from './Box';
export {default as Center} from './Center';
export {default as HStack} from './HStack';
export {default as Icon} from './Icon';
export {default as Text} from './Text';
export {default as VStack} from './VStack';
export {default as Flex} from './Flex';
export {default as SafeAreaView} from './SafeAreaView';

import CustomBackdrop from './Sheets/Backdrop';
import CustomBackground from './Sheets/Background';
const sheet = {
  backdrop: CustomBackdrop,
  background: CustomBackground,
};

export const Sheets = sheet;
