import React, { createContext, useEffect, useState } from "react";
// src/services
import { STORAGE_KEYS, storageService } from "@/src/services/storage/";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: (newTheme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>("dark");

  // useEffect
  useEffect(() => {
    storageService.get<string>(STORAGE_KEYS.SETTINGS.THEME).then((saved) => {
      if (saved === "light" || saved === "dark") setTheme(saved);
      else setTheme("light");
    });
  }, []);

  const toggleTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    storageService.set<string>(STORAGE_KEYS.SETTINGS.THEME, newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
