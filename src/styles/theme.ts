import {createTheme, useTheme} from '@shopify/restyle';
import {s, vs, mvs} from 'react-native-size-matters';

const palette = {
  purpleLight: '#95cdfb',
  purplePrimary: '#4fabf8',
  purpleDark: '#2f6795',

  secondaryText: '#ddd',

  darkBackground: '#000000',
  lightBackground: '#fff',

  darkSecondaryBackground: '#222222',
  lightSecondaryBackground: '#FAF9F6',

  sheetBackdropLight: '#f5f5f5E0',
  sheetBackdropDark: '#2f2f2fE0',

  cardBackgroundLight: '#f5f5f5A8',
  cardBackgroundDark: '#2f2f2fA8',

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

  airQualityIndex: {
    low: {
      light: '#16a34a',
      dark: '#22c55e',
    },
    moderate: {
      light: '#d97706',
      dark: '#f59e0b',
    },
    high: {
      light: '#dc2626',
      dark: '#ef4444',
    },
    veryHigh: {
      light: '#6b21a8',
      dark: '#a855f7',
    },
  },

  black: '#0B0B0B',
  white: '#F0F2F3',
};

const theme = createTheme({
  colors: {
    brand: palette.purplePrimary,
    // Actions
    successfulAction: palette.successfulActionLight,
    destructiveAction: palette.destructiveActionLight,
    bookmarkAction: palette.bookmarkActionLight,
    // Backgrounds
    mainBackground: palette.white,
    cardBackground: palette.cardBackgroundLight,
    sheetBackdrop: palette.sheetBackdropDark,
    backdrop: palette.purpleLight,
    // Text
    foreground: palette.black,
    secondary: palette.secondaryText,
    secondaryBrand: palette.purpleDark,
    cardText: palette.cardTextLight,
    // Input
    inputBackground: palette.inputBackgroundLight,
    inputPlaceholder: palette.inputPlaceholderLight,
    // Segment control
    segmentBackground: palette.segmentBackgroundLight,
    segmentItemBackground: palette.segmentItemBackgroundLight,
    segmentItemText: palette.segmentItemTextLight,
    segmentItemTextSelected: palette.segmentItemTextSelectedLight,
    // Dividers
    divider: palette.dividerLight,
    // Outline
    outline: palette.dividerDark,
    // Common
    white: palette.white,
    black: palette.black,
    // Skeleton
    skeleton: palette.skeletonLight,
    // Air Quality
    airQualityIndexLow: palette.airQualityIndex.low.light,
    airQualityIndexModerate: palette.airQualityIndex.moderate.light,
    airQualityIndexHigh: palette.airQualityIndex.high.light,
    airQualityIndexVeryHigh: palette.airQualityIndex.veryHigh.light,
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
    body: {
      fontSize: mvs(16),
      lineHeight: mvs(24),
    },
    small: {
      fontWeight: '500',
      fontSize: mvs(14),
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

const darkTheme: Theme = {
  ...theme,
  colors: {
    ...theme.colors,
    // Actions
    successfulAction: palette.successfulActionDark,
    destructiveAction: palette.destructiveActionDark,
    bookmarkAction: palette.bookmarkActionDark,
    // Backgrounds
    mainBackground: palette.black,
    cardBackground: palette.cardBackgroundDark,
    backdrop: palette.purpleDark,
    // Text
    foreground: palette.white,
    secondaryBrand: palette.purpleLight,
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
    // Air Quality
    airQualityIndexLow: palette.airQualityIndex.low.dark,
    airQualityIndexModerate: palette.airQualityIndex.moderate.dark,
    airQualityIndexHigh: palette.airQualityIndex.high.dark,
    airQualityIndexVeryHigh: palette.airQualityIndex.veryHigh.dark,
  },
};

export type Theme = typeof theme;
export const useAppTheme = () => useTheme<Theme>();
export {theme, darkTheme};
export default theme;
