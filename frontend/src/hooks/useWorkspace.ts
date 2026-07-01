import { useState, useEffect } from "react";
import { workspaceService } from "../services/workspace";
import { WorkspaceState } from "../services/workspace/types";

export function useWorkspace() {
  const [state, setState] = useState<WorkspaceState>(workspaceService.getState());

  useEffect(() => {
    const unsubscribe = workspaceService.subscribe(setState);
    return () => unsubscribe();
  }, []);

  return {
    state,
    openTab: workspaceService.openTab.bind(workspaceService),
    closeTab: workspaceService.closeTab.bind(workspaceService),
    setUnsavedChanges: workspaceService.setUnsavedChanges.bind(workspaceService),
    setSidebarCollapsed: workspaceService.setSidebarCollapsed.bind(workspaceService)
  };
}
