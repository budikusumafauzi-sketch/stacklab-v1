export interface EditorSettings {
  fontSize: number;
  wordWrap: "on" | "off" | "wordWrapColumn" | "bounded";
  minimap: boolean;
  formatOnSave: boolean;
  tabSize: number;
}

export interface ThemeSettings {
  mode: "light" | "dark" | "system";
  accentColor: string;
}

export interface WorkspaceSettings {
  autoSave: boolean;
  recovery: boolean;
}

export interface PreferencesSettings {
  // Notifications
  emailNotifications: boolean;
  pushNotifications: boolean;
  activityNotifications: boolean;
  workspaceNotifications: boolean;
  systemNotifications: boolean;

  // Startup
  openLastWorkspace: boolean;
  restorePreviousSession: boolean;
  checkForUpdates: boolean;

  // Dashboard
  showRecentWorkspaces: boolean;
  showActivityCenter: boolean;
  showQuickActions: boolean;
  compactDashboardMode: boolean;

  // Labs
  autoSaveLabs: boolean;
  openLastActiveLab: boolean;
  confirmBeforeClosingWorkspace: boolean;

  // Performance
  enableAnimations: boolean;
  enableLazyLoading: boolean;
  reduceMotion: boolean;
}

export interface SettingsState {
  editor: EditorSettings;
  theme: ThemeSettings;
  workspace: WorkspaceSettings;
  preferences: PreferencesSettings;
}
