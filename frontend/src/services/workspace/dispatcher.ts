import { workspaceApi } from "./api";
import { Workspace, WorkspaceState } from "./types";
import { workspacePersistence } from "./persistence";
import { ActivityDispatcher } from "../activity/dispatcher";
import { settingsService } from "../settings";

class WorkspaceDispatcher {
  private currentWorkspace: Workspace | null = null;
  private autoSaveTimer: NodeJS.Timeout | null = null;
  private listeners: Set<(ws: Workspace | null) => void> = new Set();

  subscribe(listener: (ws: Workspace | null) => void) {
    this.listeners.add(listener);
    listener(this.currentWorkspace);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l(this.currentWorkspace));
  }

  async loadWorkspace(id: string) {
    try {
      const ws = await workspaceApi.getWorkspace(id);
      this.currentWorkspace = ws;
      workspacePersistence.save(ws.state); // Sync locally
      this.notify();
    } catch (e) {
      console.error("Failed to load workspace", e);
    }
  }

  async createWorkspace(name: string, description?: string) {
    try {
      const defaultState: WorkspaceState = {
        openTabs: [],
        recentFiles: [],
        activeLabId: null,
        sidebarCollapsed: false,
      };
      
      const ws = await workspaceApi.createWorkspace({
        name,
        description,
        state: defaultState,
        status: "active",
        is_pinned: false,
        tags: []
      });
      
      this.currentWorkspace = ws;
      this.notify();
      return ws;
    } catch (e) {
      console.error("Failed to create workspace", e);
      throw e;
    }
  }

  updateLocalState(newState: WorkspaceState) {
    if (!this.currentWorkspace) return;

    this.currentWorkspace.state = newState;
    workspacePersistence.save(newState);
    this.notify();

    const { autoSave } = settingsService.getState().workspace;

    // Debounce Auto-Save Recovery (only when autoSave is enabled)
    if (autoSave) {
      if (this.autoSaveTimer) clearTimeout(this.autoSaveTimer);
      this.autoSaveTimer = setTimeout(() => {
        this.saveRecoveryCheckpoint();
      }, 3000); // 3s debounce
    }
  }

  async saveRecoveryCheckpoint() {
    if (!this.currentWorkspace) return;

    const { recovery } = settingsService.getState().workspace;
    if (!recovery) return; // Recovery checkpoints disabled in settings

    try {
      await workspaceApi.saveRecovery(this.currentWorkspace.id, this.currentWorkspace.state);
    } catch (e) {
      console.error("Failed to save recovery checkpoint", e);
    }
  }

  async commitState() {
    if (!this.currentWorkspace) return;
    try {
      const ws = await workspaceApi.updateWorkspace(this.currentWorkspace.id, {
        state: this.currentWorkspace.state,
        version: this.currentWorkspace.version
      });
      this.currentWorkspace = ws; // Updated version
      await workspaceApi.clearRecovery(ws.id); // clear checkpoint after manual save
      ActivityDispatcher.dispatchWorkspaceEvent("WorkspaceSaved", `Saved workspace: ${ws.name}`);
      this.notify();
    } catch (e) {
      console.error("Failed to commit state", e);
      throw e; // Let UI handle conflict (409)
    }
  }

  async createSnapshot(name: string, description: string) {
    if (!this.currentWorkspace) return;
    try {
      await workspaceApi.createSnapshot(this.currentWorkspace.id, {
        name,
        description,
        state: this.currentWorkspace.state
      });
      ActivityDispatcher.dispatchWorkspaceEvent("WorkspaceSnapshotCreated", `Created snapshot: ${name}`);
    } catch (e) {
      console.error("Failed to create snapshot", e);
      throw e;
    }
  }

  async restoreSnapshot(snapshotId: string) {
    if (!this.currentWorkspace) return;
    try {
      const ws = await workspaceApi.restoreSnapshot(this.currentWorkspace.id, snapshotId);
      this.currentWorkspace = ws;
      workspacePersistence.save(ws.state);
      ActivityDispatcher.dispatchWorkspaceEvent("WorkspaceSnapshotRestored", `Restored snapshot`);
      this.notify();
    } catch (e) {
      console.error("Failed to restore snapshot", e);
      throw e;
    }
  }
}

export const workspaceDispatcher = new WorkspaceDispatcher();
