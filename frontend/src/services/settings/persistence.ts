import { SettingsState } from "./types";

const STORAGE_KEY = "stacklab:settings:state";

const defaultState: SettingsState = {
  editor: {
    fontSize: 14,
    wordWrap: "on",
    minimap: false,
    formatOnSave: true,
    tabSize: 2,
  },
  theme: {
    mode: "system",
    accentColor: "blue",
  },
  workspace: {
    autoSave: true,
    recovery: true,
  },
  preferences: {
    emailNotifications: true,
    pushNotifications: true,
    activityNotifications: true,
    workspaceNotifications: true,
    systemNotifications: true,
    openLastWorkspace: false,
    restorePreviousSession: true,
    checkForUpdates: true,
    showRecentWorkspaces: true,
    showActivityCenter: true,
    showQuickActions: true,
    compactDashboardMode: false,
    autoSaveLabs: true,
    openLastActiveLab: false,
    confirmBeforeClosingWorkspace: true,
    enableAnimations: true,
    enableLazyLoading: true,
    reduceMotion: false,
  },
};

export const settingsPersistence = {
  save(state: SettingsState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Failed to save settings state to localStorage", e);
    }
  },

  load(): SettingsState {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        // Deep merge with default state to handle added keys over time
        const parsed = JSON.parse(data) as Partial<SettingsState>;
        return {
          editor: { ...defaultState.editor, ...(parsed.editor || {}) },
          theme: { ...defaultState.theme, ...(parsed.theme || {}) },
          workspace: { ...defaultState.workspace, ...(parsed.workspace || {}) },
          preferences: { ...defaultState.preferences, ...(parsed.preferences || {}) },
        };
      }
    } catch (e) {
      console.warn("Failed to load settings state from localStorage", e);
    }
    return defaultState;
  },

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  },
};
