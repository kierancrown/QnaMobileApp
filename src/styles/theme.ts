import {createTheme, useTheme} from '@shopify/restyle';
import {s, vs, mvs} from 'react-native-size-matters';

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

  secondaryText: '#ddd',

  darkBackground: '#000000',
  lightBackground: '#fff',

  darkSecondaryBackground: '#222222',
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
    // Actions
    successfulAction: palette.successfulActionDark,
    destructiveAction: palette.destructiveActionDark,
    bookmarkAction: palette.bookmarkActionDark,
    // Backgrounds
    mainBackground: palette.black,
    cardBackground: palette.darkSecondaryBackground,
    backdrop: palette.primary[800],
    sheetBackdrop: palette.sheetBackdropDark,
    // Text
    foreground: palette.white,
    secondary: palette.secondaryText,
    secondaryBrand: palette.primary[200],
    cardText: palette.cardTextDark,
    // Input
    inputBackground: palette.inputBackgroundDark,
    inputPlaceholder: palette.inputPlaceholderDark,
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
    skeleton: palette.skeletonDark,
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
  },
  iconSizes: {
    xxs: s(3),
    xs: s(8),
    s: s(12),
    m: s(16),
    l: s(24),
    xl: s(32),
    ll: s(36),
    xxl: s(48),
    xxxl: s(64),
    xxxxl: s(96),
  },
  textVariants: {
    extraLargeTemp: {
      fontWeight: '900',
      fontSize: mvs(120),
      lineHeight: mvs(120),
    },
    largeTemp: {
      fontWeight: '900',
      fontSize: mvs(96),
      lineHeight: mvs(96),
    },
    temp: {
      fontWeight: '800',
      fontSize: mvs(64),
      lineHeight: mvs(64),
    },
    smallTemp: {
      fontWeight: '800',
      fontSize: mvs(48),
      lineHeight: mvs(48),
    },
    extraSmallTemp: {
      fontWeight: '600',
      fontSize: mvs(32),
    },
    hourlyTemp: {
      fontWeight: '600',
      fontSize: mvs(16),
    },
    extraLargeHeader: {
      fontWeight: '900',
      fontSize: mvs(56),
    },
    largeHeader: {
      fontWeight: '900',
      fontSize: mvs(48),
    },
    navbarTitle: {
      fontWeight: 'bold',
      fontSize: mvs(24),
    },
    header: {
      fontWeight: 'bold',
      fontSize: mvs(34),
      lineHeight: mvs(40),
    },
    subheader: {
      fontWeight: 'bold',
      fontSize: mvs(24),
    },
    title: {
      fontWeight: 'bold',
      fontSize: mvs(20),
    },
    highlight: {
      fontWeight: '500',
      fontSize: mvs(20),
      lineHeight: mvs(24),
    },
    headline: {
      fontWeight: 'bold',
      fontSize: mvs(14),
    },
    medium: {
      fontWeight: 'bold',
      fontSize: mvs(16),
      lineHeight: mvs(24),
    },
    smallBody: {
      fontSize: mvs(14),
    },
    largeInput: {
      fontSize: mvs(16),
      lineHeight: mvs(18),
    },
    questionBody: {
      fontWeight: '500',
      fontSize: mvs(14),
      lineHeight: mvs(18),
    },
    body: {
      fontSize: mvs(16),
      lineHeight: mvs(24),
    },
    small: {
      fontWeight: '500',
      fontSize: mvs(14),
    },
    smaller: {
      fontWeight: '500',
      fontSize: mvs(13),
    },
    tag: {
      fontWeight: 'bold',
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
    defaults: {
      fontFamily: 'JUST Sans Variable',
      color: 'foreground',
    },
  },
});

export type Theme = typeof theme;
export const useAppTheme = () => useTheme<Theme>();
export {theme};
export default theme;
