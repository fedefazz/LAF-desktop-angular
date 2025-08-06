export interface ThemeConfig {
  name: string;
  displayName: string;
  isDark: boolean;
  primaryColor: string;
  accentColor: string;
}

export const THEMES: { [key: string]: ThemeConfig } = {
  light: {
    name: 'light',
    displayName: 'Tema Claro',
    isDark: false,
    primaryColor: '#1976d2',
    accentColor: '#ff4081'
  },
  dark: {
    name: 'dark',
    displayName: 'Tema Oscuro',
    isDark: true,
    primaryColor: '#90caf9',
    accentColor: '#f48fb1'
  }
};
