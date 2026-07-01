import React, { useState } from "react";
import { workspaceApi } from "../../services/workspace/api";
import { WorkspaceExport } from "../../services/workspace/types";

interface ExportImportDialogProps {
  workspaceId?: string; // Optional if importing a new workspace from dashboard
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess?: (workspaceId: string) => void;
}

export const ExportImportDialog: React.FC<ExportImportDialogProps> = ({ workspaceId, isOpen, onClose, onImportSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    if (!workspaceId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await workspaceApi.exportWorkspace(workspaceId);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `workspace-${workspaceId}.stacklab`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setError(e.message || "Failed to export workspace");
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const payload: WorkspaceExport = JSON.parse(text);
        const newWs = await workspaceApi.importWorkspace(payload);
        if (onImportSuccess) {
          onImportSuccess(newWs.id);
        }
        onClose();
      } catch (err: any) {
        setError(err.response?.data?.detail || err.message || "Failed to import workspace");
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = () => {
      setError("Failed to read file");
      setLoading(false);
    };
    reader.readAsText(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-md text-gray-800 dark:text-gray-200">
        <h2 className="text-xl font-bold mb-4">Export / Import Workspace</h2>
        
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">{error}</div>}

        <div className="flex flex-col gap-4">
          {workspaceId && (
            <div className="border p-4 rounded dark:border-gray-700">
              <h3 className="font-semibold mb-2">Export Current Workspace</h3>
              <p className="text-sm text-gray-500 mb-4">Download a .stacklab file containing all state and snapshots.</p>
              <button 
                onClick={handleExport}
                disabled={loading}
                className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50"
              >
                {loading ? "Exporting..." : "Export to File"}
              </button>
            </div>
          )}

          <div className="border p-4 rounded dark:border-gray-700">
            <h3 className="font-semibold mb-2">Import Workspace</h3>
            <p className="text-sm text-gray-500 mb-4">Upload a .stacklab file to restore a workspace.</p>
            <input 
              type="file" 
              accept=".stacklab,.json"
              onChange={handleImport}
              disabled={loading}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-300"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50" disabled={loading}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
