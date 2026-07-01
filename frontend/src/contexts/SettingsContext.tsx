import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { settingsService } from "../services/settings";
import { SettingsState, EditorSettings, ThemeSettings, WorkspaceSettings, PreferencesSettings } from "../services/settings/types";

interface SettingsContextValue {
  state: SettingsState;
  updateEditorSettings: (partial: Partial<EditorSettings>) => void;
  updateThemeSettings: (partial: Partial<ThemeSettings>) => void;
  updateWorkspaceSettings: (partial: Partial<WorkspaceSettings>) => void;
  updatePreferencesSettings: (partial: Partial<PreferencesSettings>) => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SettingsState>(settingsService.getState());

  useEffect(() => {
    const unsubscribe = settingsService.subscribe(setState);
    return () => unsubscribe();
  }, []);

  const value: SettingsContextValue = {
    state,
    updateEditorSettings: settingsService.updateEditorSettings.bind(settingsService),
    updateThemeSettings: settingsService.updateThemeSettings.bind(settingsService),
    updateWorkspaceSettings: settingsService.updateWorkspaceSettings.bind(settingsService),
    updatePreferencesSettings: settingsService.updatePreferencesSettings.bind(settingsService),
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettingsContext() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettingsContext must be used within a SettingsProvider");
  }
  return context;
}
