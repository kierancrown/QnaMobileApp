import {createTheme, useTheme} from '@shopify/restyle';
import {s, vs, mvs} from 'react-native-size-matters';
import {fonts} from './fonts';

const palette = {
  primary: {
    DEFAULT: '#84CC16',
    50: '#D5F5A4',
    100: '#CDF392',
    200: '#BCEF6D',
    300: '#ABEB48',
    400: '#9AE723',
    500: '#84CC16',
    600: '#639911',
    700: '#42670B',
    800: '#223406',
    900: '#010100',
    950: '#000000',
  },
  Grey: {
    DEFAULT: '#737373',
    50: '#DADADA',
    100: '#CFCFCF',
    200: '#B8B8B8',
    300: '#A1A1A1',
    400: '#8A8A8A',
    500: '#737373',
    600: '#5C5C5C',
    700: '#454545',
    800: '#403E3B',
    900: '#2A2927',
    950: '#141210',
  },
  flamingo: {
    DEFAULT: '#EF4444',
    50: '#FDEDED',
    100: '#FCDADA',
    200: '#F9B5B5',
    300: '#F58F8F',
    400: '#F26A6A',
    500: '#EF4444',
    600: '#E71414',
    700: '#B30F0F',
    800: '#800B0B',
    900: '#4C0707',
    950: '#320404',
  },
  'french-rose': {
    DEFAULT: '#EC4899',
    50: '#FDEEF6',
    100: '#FBDCEB',
    200: '#F8B7D7',
    300: '#F492C2',
    400: '#F06DAE',
    500: '#EC4899',
    600: '#E4187D',
    700: '#B11261',
    800: '#7F0D45',
    900: '#4C0829',
    950: '#32051B',
  },
  cerulean: {
    DEFAULT: '#0EA5E9',
    50: '#B4E5FA',
    100: '#A1DEF9',
    200: '#7AD0F7',
    300: '#54C3F5',
    400: '#2DB5F2',
    500: '#0EA5E9',
    600: '#0B80B4',
    700: '#085A7F',
    800: '#04354A',
    900: '#010F15',
    950: '#000000',
  },

  secondaryText: '#ddd',

  darkBackground: '#000000',
  lightBackground: '#fff',

  darkSecondaryBackground: '#222222',
  darkSecondaryBackground2: '#333333',
  lightSecondaryBackground: '#FAF9F6',

  sheetBackdropLight: '#f5f5f5E0',
  sheetBackdropDark: '#2f2f2fE0',

  cardBackgroundLight: '#f5f5f5',
  cardBackgroundDark: '#2f2f2f',

  cardTextLight: '#2f2f2fA8',
  cardTextDark: '#f5f5f5A8',

  skeletonLight: '#f5f5f5',
  skeletonDark: '#2f2f2f',

  successfulActionLight: '#22c55e',
  successfulActionDark: '#15803d',
  destructiveActionLight: '#dc2626',
  destructiveActionDark: '#991b1b',
  bookmarkActionLight: '#06b6d4',
  bookmarkActionDark: '#0e7490',

  inputBackgroundLight: '#e2e8f0',
  inputBackgroundDark: '#2f2f2f',
  inputPlaceholderLight: '#666',
  inputPlaceholderDark: '#aaa',

  segmentBackgroundLight: '#e4e4e7',
  segmentBackgroundDark: '#2f2f2f',

  segmentItemBackgroundLight: '#d4d4d8',
  segmentItemBackgroundDark: '#f5f5f5A8',

  segmentItemTextLight: '#666',
  segmentItemTextSelectedLight: '#000',
  segmentItemTextDark: '#aaa',
  segmentItemTextSelectedDark: '#fff',

  dividerLight: '#f5f5f5',
  dividerDark: '#2f2f2f',

  black: '#0B0B0B',
  white: '#F0F2F3',
  none: 'transparent',
};

const theme = createTheme({
  colors: {
    brand: palette.primary.DEFAULT,
    // TabBar
    tabBarBackground: palette.Grey[800],
    tabBarIconInactive: palette.Grey[300],
    tabBarIconActive: palette.primary.DEFAULT,
    tabBarReplyIcon: palette.cerulean.DEFAULT,
    // Actions
    inactiveAction: palette.Grey[900],
    heartAction: palette['french-rose'][600],
    successfulAction: palette.successfulActionDark,
    destructiveAction: palette.destructiveActionLight,
    bookmarkAction: palette.cerulean[600],
    // Backgrounds
    mainBackground: palette.black,
    cardBackground: palette.darkSecondaryBackground,
    backdrop: palette.primary[800],
    sheetBackdrop: palette.sheetBackdropDark,
    // Pill
    pillUnselectedBackground: `${palette.Grey[400]}1A`,
    pillSelectedBackground: palette.Grey[400],
    // Button
    buttonDisabled: palette.Grey[800],
    // Badge
    badgeBackground: palette.flamingo[600],
    // Text
    foreground: palette.white,
    secondary: palette.secondaryText,
    secondaryBrand: palette.primary[200],
    cardText: palette.cardTextDark,
    verifiedBadge: palette.primary[500],
    // Input
    inputBackground: palette.inputBackgroundDark,
    inputPlaceholder: palette.inputPlaceholderDark,
    lowCharLimit: '#d97706',
    reallyLowCharLimit: '#ea580c',
    minusCharLimit: '#dc2626',
    // Segment control
    segmentBackground: palette.segmentBackgroundDark,
    segmentItemBackground: palette.segmentItemBackgroundDark,
    segmentItemText: palette.segmentItemTextDark,
    segmentItemTextSelected: palette.segmentItemTextSelectedDark,
    // Dividers
    divider: palette.dividerDark,
    // Outline
    outline: palette.dividerLight,
    // Skeleton
    skeletonBackground: palette.cardBackgroundDark,
    skeleton: '#52525b',
    // Common
    white: palette.white,
    black: palette.black,
    none: palette.none,
  },
  spacing: {
    xxxsMinus: s(-2),
    xxsMinus: s(-4),
    xsMinus: s(-8),
    sMinus: s(-12),
    mMinus: s(-16),
    lMinus: s(-24),
    xlMinus: s(-32),
    xxlMinus: s(-48),
    none: 0,
    xxxxxs: s(0.5),
    xxxxs: s(1),
    xxxs: s(2),
    xxxsY: vs(2),
    xxs: s(4),
    xxsY: vs(4),
    xs: s(8),
    xsY: vs(8),
    s: s(12),
    sY: vs(12),
    m: s(16),
    mY: vs(16),
    l: s(24),
    lY: vs(24),
    xl: s(32),
    xlY: vs(32),
    xxl: s(48),
    xxlY: vs(48),
    xxxl: s(64),
    xxxlY: vs(64),
  },
  borderRadii: {
    none: 0,
    s: s(4),
    m: s(8),
    l: s(16),
    xl: s(24),
    xxl: s(32),
    xxxl: s(64),
    pill: s(100),
    textInput: mvs(12),
  },
  iconSizes: {
    xxs: s(3),
    xs: s(8),
    s: s(12),
    m: s(16),
    popover: s(18),
    intermediate: s(20),
    l: s(24),
    commentAvatar: s(26),
    xl: s(32),
    ll: s(36),
    xxl: s(48),
    xxxl: s(64),
    xxxxl: s(96),
    logo: s(120),
  },
  spinnerSizes: {
    xxs: s(12),
    xs: s(18),
    s: s(36),
    m: s(54),
    l: s(72),
    xl: s(90),
    xxl: s(108),
  },
  textVariants: {
    markdownH1: {
      fontFamily: fonts.black,
      fontSize: mvs(34),
    },
    markdownH2: {
      fontFamily: fonts.bold,
      fontSize: mvs(26),
    },
    markdownH3: {
      fontFamily: fonts.bold,
      fontSize: mvs(20),
    },
    markdownBullet: {
      fontFamily: fonts.semiBold,
      fontSize: mvs(16),
    },
    extraLargeHeader: {
      fontWeight: '900',
      fontSize: mvs(56),
    },
    largeHeader: {
      fontFamily: fonts.black,
      fontSize: mvs(48),
    },
    navbarTitle: {
      fontFamily: fonts.bold,
      fontSize: mvs(24),
    },
    header: {
      fontFamily: fonts.bold,
      fontSize: mvs(34),
      lineHeight: mvs(40),
    },
    subheader: {
      fontFamily: fonts.bold,
      fontSize: mvs(24),
    },
    title: {
      fontFamily: fonts.bold,
      fontSize: mvs(20),
    },
    highlight: {
      fontFamily: fonts.semiBold,
      fontSize: mvs(20),
      lineHeight: mvs(24),
    },
    headline: {
      fontFamily: fonts.bold,
      fontSize: mvs(14),
    },
    medium: {
      fontFamily: fonts.semiBold,
      fontSize: mvs(16),
      lineHeight: mvs(24),
    },
    smallBody: {
      fontSize: mvs(14),
    },
    smallBodySemiBold: {
      fontFamily: fonts.semiBold,
      fontSize: mvs(14),
    },
    smallBodyBold: {
      fontFamily: fonts.bold,
      fontSize: mvs(14),
    },
    smallInput: {
      fontSize: mvs(14),
      lineHeight: mvs(16),
      fontFamily: fonts.semiBold,
    },
    largeInput: {
      fontSize: mvs(16),
      lineHeight: mvs(18),
    },
    largeInputSemiBold: {
      fontFamily: fonts.semiBold,
      fontSize: mvs(16),
      lineHeight: mvs(18),
    },
    largeInputBold: {
      fontFamily: fonts.bold,
      fontSize: mvs(16),
      lineHeight: mvs(18),
    },
    intermediateInput: {
      fontSize: mvs(18),
      lineHeight: mvs(22),
    },
    extraLargeInput: {
      fontSize: mvs(17),
      lineHeight: mvs(21),
    },
    questionBody: {
      fontFamily: fonts.semiBold,
      fontSize: mvs(15),
      lineHeight: mvs(19),
    },
    questionDetail: {
      fontSize: mvs(14),
      lineHeight: mvs(18),
    },
    body: {
      fontSize: mvs(16),
      lineHeight: mvs(24),
    },
    bodyUnderline: {
      fontSize: mvs(16),
      lineHeight: mvs(24),
      textDecorationLine: 'underline',
    },
    bodySemiBold: {
      fontFamily: fonts.semiBold,
      fontSize: mvs(16),
      lineHeight: mvs(24),
    },
    bodyBold: {
      fontFamily: fonts.bold,
      fontSize: mvs(16),
      lineHeight: mvs(24),
    },
    small: {
      fontFamily: fonts.semiBold,
      fontSize: mvs(14),
    },
    smaller: {
      fontFamily: fonts.semiBold,
      fontSize: mvs(13),
    },
    tag: {
      fontFamily: fonts.bold,
      fontSize: mvs(12),
    },
    username: {
      fontWeight: '600',
      fontSize: mvs(12),
    },
    tiny: {
      fontWeight: '600',
      fontSize: mvs(10),
    },
    defaultTextInput: {
      fontSize: mvs(20),
      lineHeight: mvs(24),
    },
    defaults: {
      fontFamily: fonts.regular,
      color: 'foreground',
      fontSize: mvs(16),
    },
  },
});

export type Theme = typeof theme;
export const useAppTheme = () => useTheme<Theme>();
export {theme};
export default theme;
