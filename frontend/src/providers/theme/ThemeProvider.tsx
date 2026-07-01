import React, { createContext, useContext, useEffect } from "react";
import { useSettings } from "../../hooks/useSettings";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeProviderContext = createContext<ThemeProviderState>({
  theme: "light",
  setTheme: () => null,
});

function applyTheme(mode: Theme) {
  const root = window.document.documentElement;
  root.classList.remove("light", "dark");

  if (mode === "system") {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    root.classList.add(systemTheme);
  } else {
    root.classList.add(mode);
  }
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { state, updateThemeSettings } = useSettings();
  const theme = state.theme.mode as Theme;

  // Apply theme whenever the setting changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // When set to "system", also react to OS-level preference changes at runtime
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => updateThemeSettings({ mode: newTheme }),
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
