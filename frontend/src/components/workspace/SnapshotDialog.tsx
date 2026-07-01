import React, { useState, useEffect } from "react";
import { workspaceApi } from "../../services/workspace/api";
import { workspaceDispatcher } from "../../services/workspace/dispatcher";
import { WorkspaceSnapshot } from "../../services/workspace/types";
import { WorkspaceTimeline } from "./WorkspaceTimeline";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface SnapshotDialogProps {
  workspaceId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const SnapshotDialog: React.FC<SnapshotDialogProps> = ({ workspaceId, isOpen, onClose }) => {
  const [snapshots, setSnapshots] = useState<WorkspaceSnapshot[]>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const loadSnapshots = async () => {
    setLoading(true);
    try {
      const data = await workspaceApi.getSnapshots(workspaceId);
      setSnapshots(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadSnapshots();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, workspaceId]);

  const handleCreate = async () => {
    try {
      await workspaceDispatcher.createSnapshot(name, description);
      setName("");
      setDescription("");
      loadSnapshots();
    } catch (e) {
      console.error(e);
    }
  };

  const handleRestore = async (snapId: string) => {
    if (confirm("Are you sure you want to restore this snapshot? Current unsaved changes will be lost.")) {
      try {
        await workspaceDispatcher.restoreSnapshot(snapId);
        onClose();
      } catch (e) {
        console.error(e);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Workspace Snapshots</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-2">
          <input 
            type="text" 
            placeholder="Snapshot Name" 
            className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="Description" 
            className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button 
            onClick={handleCreate}
            disabled={!name}
            className="bg-blue-600 text-white p-2 rounded disabled:opacity-50"
          >
            Create Snapshot
          </button>
        </div>

        <div className="flex-1 overflow-y-auto mt-4 pr-2">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <WorkspaceTimeline snapshots={snapshots} onRestore={handleRestore} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
