import {
  SettingsState,
  EditorSettings,
  ThemeSettings,
  WorkspaceSettings,
  PreferencesSettings,
} from "./types";
import { settingsPersistence } from "./persistence";

type SettingsListener = (state: SettingsState) => void;

class SettingsService {
  private state: SettingsState;
  private listeners: Set<SettingsListener> = new Set();

  constructor() {
    this.state = settingsPersistence.load();
  }

  getState(): SettingsState {
    return this.state;
  }

  subscribe(listener: SettingsListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    settingsPersistence.save(this.state);
    this.listeners.forEach((listener) => listener(this.state));
  }

  updateEditorSettings(partial: Partial<EditorSettings>) {
    this.state = {
      ...this.state,
      editor: { ...this.state.editor, ...partial },
    };
    this.notify();
  }

  updateThemeSettings(partial: Partial<ThemeSettings>) {
    this.state = {
      ...this.state,
      theme: { ...this.state.theme, ...partial },
    };
    this.notify();
  }

  updateWorkspaceSettings(partial: Partial<WorkspaceSettings>) {
    this.state = {
      ...this.state,
      workspace: { ...this.state.workspace, ...partial },
    };
    this.notify();
  }

  updatePreferencesSettings(partial: Partial<PreferencesSettings>) {
    this.state = {
      ...this.state,
      preferences: { ...this.state.preferences, ...partial },
    };
    this.notify();
  }
}

export const settingsService = new SettingsService();
