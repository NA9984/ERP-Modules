"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme =
  | "light"
  | "dark"
  | "blue"
  | "emerald"
  | "ocean"
  | "sage"
  | "teal"
  | "coffee"
  | "sand"
  | "frost"
  | "sap"
  | "navy"
  | "executive";

type ThemeContextType = {
  theme: Theme;
  changeTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  // Load saved theme from LocalStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("erp-theme") as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Whenever theme changes, inject it directly into HTML element
  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute("data-theme", theme);
    localStorage.setItem("erp-theme", theme);
  }, [theme]);

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}