import { defineConfig, presetWind3, presetWebFonts } from 'unocss';

import colors from './uno/theme/colors.js';
import fontSize from './uno/theme/fontSize.js';
import fontFamily from './uno/theme/fontFamily.js';
import lineHeight from './uno/theme/lineHeight.js';

export default defineConfig({
  presets: [
    presetWind3(),
    presetWebFonts({
      provider: 'google',
      fonts: fontFamily,
    }),
  ],
  theme: {
    colors,
    fontSize,
    lineHeight: {
      ...lineHeight.heading,
      ...lineHeight.body,
    },
  },
  shortcuts: [],
});
