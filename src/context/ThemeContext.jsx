import { createContext, useContext } from 'react';
import { theme as defaultTheme } from '../config/theme';

const ThemeContext = createContext();

export function ThemeProvider({ theme = defaultTheme, children }) {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
 }
 
 // eslint-disable-next-line react-refresh/only-export-components
 export const useTheme = () => {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return theme;
 };