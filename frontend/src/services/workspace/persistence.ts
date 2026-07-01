import { WorkspaceState } from "./types";

const STORAGE_KEY = "stacklab:workspace:state";

const defaultState: WorkspaceState = {
  openTabs: [],
  recentFiles: [],
  activeLabId: null,
  sidebarCollapsed: false,
};

export const workspacePersistence = {
  save(state: WorkspaceState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Failed to save workspace state to localStorage", e);
    }
  },

  load(): WorkspaceState {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data) as WorkspaceState;
      }
    } catch (e) {
      console.warn("Failed to load workspace state from localStorage", e);
    }
    return defaultState;
  },

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
};
