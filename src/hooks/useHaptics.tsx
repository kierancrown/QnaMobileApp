import deviceInfoModule from 'react-native-device-info';
import haptics, {
  HapticFeedbackTypes,
  HapticOptions,
} from 'react-native-haptic-feedback';

const availibleOniOS = [
  'impactLight',
  'impactMedium',
  'impactHeavy',
  'rigid',
  'soft',
  'notificationSuccess',
  'notificationWarning',
  'notificationError',
  'selection',
];

const availibleOnAndroid = [
  'impactLight',
  'impactMedium',
  'impactHeavy',
  'rigid',
  'soft',
  'notificationSuccess',
  'notificationWarning',
  'notificationError',
  'clockTick',
  'contextClick',
  'keyboardPress',
  'keyboardRelease',
  'keyboardTap',
  'longPress',
  'textHandleMove',
  'virtualKey',
  'virtualKeyRelease',
  'effectClick',
  'effectDoubleClick',
  'effectHeavyClick',
  'effectTick',
];

export const useHaptics = () => {
  const hapticsAvailable = async (type: HapticFeedbackTypes) => {
    const isSim = await deviceInfoModule.isEmulator();
    if (!isSim) {
      if (deviceInfoModule.getSystemName() === 'iOS') {
        return availibleOniOS.includes(type);
      }
      if (deviceInfoModule.getSystemName() === 'Android') {
        return availibleOnAndroid.includes(type);
      }
    }
    return false;
  };

  const triggerHaptic = async (
    type:
      | HapticFeedbackTypes
      | {
          iOS?: HapticFeedbackTypes;
          android?: HapticFeedbackTypes;
        },
    options?: HapticOptions,
  ) => {
    const haptic =
      typeof type === 'string'
        ? type
        : deviceInfoModule.getSystemName() === 'iOS'
        ? type.iOS
        : type.android;

    if (!haptic) {
      console.log(`Haptic feedback type ${type} not available`);
      return;
    }

    if (await hapticsAvailable(haptic)) {
      haptics.trigger(haptic, options);
    } else {
      console.log(`Haptic feedback type ${type} not available`);
    }
  };

  return {triggerHaptic, hapticsAvailable};
};

export {HapticFeedbackTypes} from 'react-native-haptic-feedback';
