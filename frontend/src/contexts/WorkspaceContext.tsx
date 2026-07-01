import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from "react";
import { workspaceApi } from "../services/workspace/api";
import { Workspace } from "../services/workspace/types";
import { workspaceDispatcher } from "../services/workspace/dispatcher";

interface WorkspaceContextValue {
  workspaces: Workspace[];
  loading: boolean;
  error: string | null;
  fetchWorkspaces: () => Promise<void>;
  createWorkspace: (name: string, description?: string) => Promise<void>;
  deleteWorkspace: (id: string) => Promise<void>;
  togglePin: (id: string, currentPin: boolean) => Promise<void>;
}

export const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkspaces = useCallback(async () => {
    try {
      setLoading(true);
      const data = await workspaceApi.getWorkspaces();
      setWorkspaces(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  const createWorkspace = useCallback(async (name: string, description?: string) => {
    await workspaceDispatcher.createWorkspace(name, description);
    await fetchWorkspaces();
  }, [fetchWorkspaces]);

  const deleteWorkspace = useCallback(async (id: string) => {
    await workspaceApi.deleteWorkspace(id);
    await fetchWorkspaces();
  }, [fetchWorkspaces]);

  const togglePin = useCallback(async (id: string, currentPin: boolean) => {
    await workspaceApi.updateWorkspace(id, { is_pinned: !currentPin });
    await fetchWorkspaces();
  }, [fetchWorkspaces]);

  const value = useMemo(() => ({
    workspaces,
    loading,
    error,
    fetchWorkspaces,
    createWorkspace,
    deleteWorkspace,
    togglePin
  }), [workspaces, loading, error, fetchWorkspaces, createWorkspace, deleteWorkspace, togglePin]);

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
};

export function useWorkspaceContext() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error("useWorkspaceContext must be used within a WorkspaceProvider");
  }
  return context;
}
