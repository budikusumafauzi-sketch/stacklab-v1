import { internalApi } from "../api/internal";
import { 
  Workspace, 
  WorkspaceSnapshot, 
  WorkspaceRecovery, 
  WorkspaceExport 
} from "./types";

export const workspaceApi = {
  // Core Workspace
  createWorkspace: async (data: Partial<Workspace>): Promise<Workspace> => {
    return internalApi.post("/workspace", data) as Promise<Workspace>;
  },
  getWorkspaces: async (): Promise<Workspace[]> => {
    return internalApi.get("/workspace") as Promise<Workspace[]>;
  },
  getWorkspace: async (id: string): Promise<Workspace> => {
    return internalApi.get(`/workspace/${id}`) as Promise<Workspace>;
  },
  updateWorkspace: async (id: string, data: Partial<Workspace>): Promise<Workspace> => {
    return internalApi.put(`/workspace/${id}`, data) as Promise<Workspace>;
  },
  deleteWorkspace: async (id: string): Promise<void> => {
    await internalApi.delete(`/workspace/${id}`);
  },

  // Snapshots
  createSnapshot: async (workspaceId: string, data: Partial<WorkspaceSnapshot>): Promise<WorkspaceSnapshot> => {
    return internalApi.post(`/workspace/${workspaceId}/snapshots`, data) as Promise<WorkspaceSnapshot>;
  },
  getSnapshots: async (workspaceId: string): Promise<WorkspaceSnapshot[]> => {
    return internalApi.get(`/workspace/${workspaceId}/snapshots`) as Promise<WorkspaceSnapshot[]>;
  },
  restoreSnapshot: async (workspaceId: string, snapshotId: string): Promise<Workspace> => {
    return internalApi.post(`/workspace/${workspaceId}/snapshots/${snapshotId}/restore`, {}) as Promise<Workspace>;
  },

  // Recovery
  saveRecovery: async (workspaceId: string, state: any): Promise<WorkspaceRecovery> => {
    return internalApi.post(`/workspace/${workspaceId}/recovery`, { state }) as Promise<WorkspaceRecovery>;
  },
  getRecovery: async (workspaceId: string): Promise<WorkspaceRecovery> => {
    return internalApi.get(`/workspace/${workspaceId}/recovery`) as Promise<WorkspaceRecovery>;
  },
  clearRecovery: async (workspaceId: string): Promise<void> => {
    await internalApi.delete(`/workspace/${workspaceId}/recovery`);
  },

  // Export / Import
  exportWorkspace: async (workspaceId: string): Promise<WorkspaceExport> => {
    return internalApi.get(`/workspace/${workspaceId}/export`) as Promise<WorkspaceExport>;
  },
  importWorkspace: async (data: WorkspaceExport): Promise<Workspace> => {
    return internalApi.post("/workspace/import", data) as Promise<Workspace>;
  }
};
