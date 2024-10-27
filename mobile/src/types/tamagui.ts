import { createAnimations } from '@tamagui/animations-moti';
import { config } from '@tamagui/config/v3';
import { createFont, createTamagui } from '@tamagui/core';
import { themes, tokens } from '@tamagui/themes';

const LexendFace = {
  normal: { normal: 'Lexend-Regular', italic: 'Lexend-Regular' },
  bold: { normal: 'Lexend-Bold', italic: 'Lexend-Bold' },

  100: { normal: 'Lexend-Thin', italic: 'Lexend-Thin' },
  200: { normal: 'Lexend-ExtraLight', italic: 'Lexend-ExtraLight' },
  300: { normal: 'Lexend-Light', italic: 'Lexend-Light' },
  400: { normal: 'Lexend-Regular', italic: 'Lexend-Regular' },
  500: { normal: 'Lexend-Medium', italic: 'Lexend-Medium' },
  600: { normal: 'Lexend-SemiBold', italic: 'Lexend-SemiBold' },
  700: { normal: 'Lexend-Bold', italic: 'Lexend-Bold' },
  800: { normal: 'Lexend-ExtraBold', italic: 'Lexend-ExtraBold' },
  900: { normal: 'Lexend-Black', italic: 'Lexend-Black' },
};

const MontserratFace = {
  normal: { normal: 'Montserrat-Regular', italic: 'Montserrat-Italic' },
  bold: { normal: 'Montserrat-Bold', italic: 'Montserrat-BoldItalic' },

  100: { normal: 'Montserrat-Thin', italic: 'Montserrat-ThinItalic' },
  200: {
    normal: 'Montserrat-ExtraLight',
    italic: 'Montserrat-ExtraLightItalic',
  },
  300: { normal: 'Montserrat-Light', italic: 'Montserrat-LightItalic' },
  400: { normal: 'Montserrat-Regular', italic: 'Montserrat-Italic' },
  500: { normal: 'Montserrat-Medium', italic: 'Montserrat-MediumItalic' },
  600: { normal: 'Montserrat-SemiBold', italic: 'Montserrat-SemiBoldItalic' },
  700: { normal: 'Montserrat-Bold', italic: 'Montserrat-BoldItalic' },
  800: { normal: 'Montserrat-ExtraBold', italic: 'Montserrat-ExtraBoldItalic' },
  900: { normal: 'Montserrat-Black', italic: 'Montserrat-BlackItalic' },
};

const heading = createFont({
  size: config.fonts.heading.size,
  lineHeight: config.fonts.heading.lineHeight,
  weight: config.fonts.heading.weight,
  letterSpacing: config.fonts.heading.letterSpacing,
  face: MontserratFace,
});

const body = createFont({
  size: config.fonts.body.size,
  lineHeight: config.fonts.body.lineHeight,
  weight: config.fonts.body.weight,
  letterSpacing: config.fonts.body.letterSpacing,
  face: LexendFace,
});

export const tamaguiConfig = createTamagui({
  config,
  animations: createAnimations({
    fast: {
      type: 'spring',
      damping: 20,
      mass: 1.2,
      stiffness: 250,
    },
    medium: {
      type: 'spring',
      damping: 10,
      mass: 0.9,
      stiffness: 100,
    },
    slow: {
      type: 'spring',
      damping: 20,
      stiffness: 60,
    },
  }),
  themes: {
    dark: {
      ...themes.dark,
      background: '#222831',
      color: '#EEEEEE',
      accentBackground: '#393E46',
      accentColor: '#00ADB5',
    },
    light: {
      ...themes.light,
      background: '#EEEEEE',
      color: '#222831',
      accentBackground: '#DDDDDD',
      accentColor: '#00ADB5',
    },
  },
  tokens,
  fonts: {
    heading,
    body,
  },
});
type Conf = typeof tamaguiConfig;

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends Conf {}
}
