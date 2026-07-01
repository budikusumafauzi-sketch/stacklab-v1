import { WorkspaceState, TabState } from "./types";
import { workspacePersistence } from "./persistence";
import { workspaceSync } from "./sync";
import { ActivityDispatcher } from "../activity/dispatcher";

type WorkspaceListener = (state: WorkspaceState) => void;

class WorkspaceService {
  private state: WorkspaceState;
  private listeners: Set<WorkspaceListener> = new Set();

  constructor() {
    this.state = workspacePersistence.load();
  }

  getState(): WorkspaceState {
    return this.state;
  }

  subscribe(listener: WorkspaceListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    workspacePersistence.save(this.state);
    workspaceSync.scheduleSync(this.state);
    this.listeners.forEach((listener) => listener(this.state));
  }

  openTab(tab: Omit<TabState, "isActive" | "lastAccessed" | "hasUnsavedChanges" | "isPinned">) {
    const existingIndex = this.state.openTabs.findIndex((t) => t.id === tab.id);
    const now = Date.now();

    const newTabs = this.state.openTabs.map((t) => ({ ...t, isActive: false }));

    if (existingIndex >= 0) {
      newTabs[existingIndex] = { ...newTabs[existingIndex], isActive: true, lastAccessed: now };
    } else {
      newTabs.push({ ...tab, isActive: true, lastAccessed: now, hasUnsavedChanges: false, isPinned: false });
    }

    this.state = {
      ...this.state,
      openTabs: newTabs,
      activeLabId: tab.id,
    };
    ActivityDispatcher.dispatchWorkspaceEvent("WorkspaceOpened", `Opened lab: ${tab.title}`);
    this.notify();
  }

  closeTab(id: string) {
    const newTabs = this.state.openTabs.filter((t) => t.id !== id);
    let newActiveId = this.state.activeLabId;

    if (this.state.activeLabId === id) {
      newActiveId = newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null;
      if (newTabs.length > 0) {
        newTabs[newTabs.length - 1].isActive = true;
      }
    }

    this.state = {
      ...this.state,
      openTabs: newTabs,
      activeLabId: newActiveId,
    };
    this.notify();
  }

  setUnsavedChanges(id: string, hasUnsavedChanges: boolean) {
    const newTabs = this.state.openTabs.map((t) =>
      t.id === id ? { ...t, hasUnsavedChanges } : t
    );
    this.state = { ...this.state, openTabs: newTabs };
    this.notify();
  }

  setSidebarCollapsed(collapsed: boolean) {
    this.state = { ...this.state, sidebarCollapsed: collapsed };
    this.notify();
  }
}

export const workspaceService = new WorkspaceService();
