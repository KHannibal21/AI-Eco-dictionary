import { Platform } from 'react-native';

const brandGreenLight = '#2E7D32';
const brandGreenDark = '#4CAF50';
const accentGreenLight = '#81C784';
const accentGreenDark = '#A5D6A7';

export const Colors = {
  light: {
    text: '#1C2E1C',
    secondaryText: '#4A5C4A',
    background: '#F8FCF8',
    cardBackground: '#FFFFFF',
    tint: brandGreenLight,
    icon: '#5C6B5C',
    tabIconDefault: '#8A9A8A',
    tabIconSelected: brandGreenLight,
    border: '#D0E0D0',
    success: brandGreenLight,
    warning: '#F9A825',
    error: '#C62828',
  },
  dark: {
    text: '#E8F0E8',
    secondaryText: '#B0C4B0',
    background: '#121C12',
    cardBackground: '#1E2E1E',
    tint: brandGreenDark,
    icon: '#9CB09C',
    tabIconDefault: '#6C7C6C',
    tabIconSelected: brandGreenDark,
    border: '#2A3A2A',
    success: brandGreenDark,
    warning: '#FFB300',
    error: '#EF5350',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});