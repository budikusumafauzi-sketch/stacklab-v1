import React, { useState, useEffect } from "react";
import { workspaceApi } from "../../services/workspace/api";
import { workspaceDispatcher } from "../../services/workspace/dispatcher";
import { WorkspaceRecovery } from "../../services/workspace/types";

interface RecoveryDialogProps {
  workspaceId: string;
}

export const RecoveryDialog: React.FC<RecoveryDialogProps> = ({ workspaceId }) => {
  const [recovery, setRecovery] = useState<WorkspaceRecovery | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkRecovery = async () => {
    try {
      const data = await workspaceApi.getRecovery(workspaceId);
      if (data) {
        setRecovery(data);
        setIsOpen(true);
      }
    } catch {
      // 404 is expected if no recovery exists
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkRecovery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId]);

  const handleRecover = async () => {
    if (!recovery) return;
    setLoading(true);
    try {
      // Apply recovered state locally
      workspaceDispatcher.updateLocalState(recovery.state);
      await workspaceApi.clearRecovery(workspaceId);
      setIsOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = async () => {
    setLoading(true);
    try {
      await workspaceApi.clearRecovery(workspaceId);
      setIsOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !recovery) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-md text-gray-800 dark:text-gray-200">
        <div className="flex items-center gap-3 mb-4 text-orange-500">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-xl font-bold">Unsaved Changes Detected</h2>
        </div>
        
        <p className="mb-6">
          StackLab recovered unsaved changes from a previous session (Auto-saved at {new Date(recovery.updated_at).toLocaleTimeString()}). 
          Would you like to restore them?
        </p>

        <div className="flex justify-end gap-3">
          <button 
            onClick={handleDiscard} 
            disabled={loading}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            Discard
          </button>
          <button 
            onClick={handleRecover} 
            disabled={loading}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
          >
            Recover State
          </button>
        </div>
      </div>
    </div>
  );
};
