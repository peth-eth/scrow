import { colors } from './colors';

// Theme values exported for backward compatibility.
// Chakra's extendTheme is no longer used — Tailwind handles styling.
export const theme = {
  initialColorMode: 'light',
  useSystemColorMode: false,
  colors,
  fonts: {
    mono: `'Poppins', sans-serif`,
    heading: `'Poppins', sans-serif`,
    body: `'Poppins', sans-serif`,
  },
  gray: '#F5F6F8',
};

// globalStyles is no longer needed with Tailwind — apply via globals.css instead.
export const globalStyles = '';
