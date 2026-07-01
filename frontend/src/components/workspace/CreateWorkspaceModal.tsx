import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useNavigate } from "react-router-dom";
import { workspaceApi } from "../../services/workspace/api";
import { labsConfig } from "../../config/labs";
import { useWorkspaceContext } from "../../contexts/WorkspaceContext";

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialName?: string;
}

export function CreateWorkspaceModal({ isOpen, onClose, initialName = "" }: CreateWorkspaceModalProps) {
  const { fetchWorkspaces } = useWorkspaceContext();
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Development");
  const [template, setTemplate] = useState("Blank");
  const [defaultLabs, setDefaultLabs] = useState<string[]>([]);
  const [tags, setTags] = useState("");
  const [autoSave, setAutoSave] = useState(true);
  const [recovery, setRecovery] = useState(true);
  const [createInitialSnapshot, setCreateInitialSnapshot] = useState(true);
  const [pinWorkspace, setPinWorkspace] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLabToggle = (labId: string) => {
    setDefaultLabs(prev => 
      prev.includes(labId) ? prev.filter(id => id !== labId) : [...prev, labId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const tagsArray = tags.split(",").map(t => t.trim()).filter(Boolean);
      
      const ws = await workspaceApi.createWorkspace({
        name,
        description,
        status: "active",
        is_pinned: pinWorkspace,
        tags: tagsArray,
        state: {
          activeLabId: defaultLabs.length > 0 ? defaultLabs[0] : null,
          openTabs: [],
          recentFiles: [],
          sidebarCollapsed: false
        }
      });

      await fetchWorkspaces();

      onClose();
      navigate(`/workspace/${ws.id}`);
    } catch (error: any) {
      console.error("Failed to create workspace:", error);
      setErrorMsg(error.message || "An unexpected error occurred while creating the workspace.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Workspace</DialogTitle>
        </DialogHeader>
        {errorMsg && (
          <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">
            {errorMsg}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Workspace Name *</label>
            <Input 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. My Next.js Project"
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Description</label>
            <textarea 
              className="w-full flex min-h-[80px] rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Category</label>
              <select 
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm outline-none focus:ring-2 focus:ring-primary/20"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="General">General</option>
                <option value="Development">Development</option>
                <option value="Testing">Testing</option>
                <option value="Learning">Learning</option>
              </select>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Template</label>
              <select 
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm outline-none focus:ring-2 focus:ring-primary/20"
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
              >
                <option value="Blank">Blank</option>
                <option value="React">React</option>
                <option value="Node.js">Node.js</option>
                <option value="Python">Python</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Default Labs</label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {labsConfig.map(lab => (
                <div key={lab.id} className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id={`lab-${lab.id}`}
                    className="rounded border-border text-primary focus:ring-primary/20"
                    checked={defaultLabs.includes(lab.id)}
                    onChange={() => handleLabToggle(lab.id)}
                  />
                  <label htmlFor={`lab-${lab.id}`} className="text-sm cursor-pointer select-none">{lab.title}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Tags (comma-separated)</label>
            <Input 
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. frontend, react, internal"
            />
          </div>

          <div className="grid grid-cols-2 gap-y-3 mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="autoSave"
                className="rounded border-border text-primary focus:ring-primary/20"
                checked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
              />
              <label htmlFor="autoSave" className="text-sm font-medium cursor-pointer">Auto Save</label>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="recovery"
                className="rounded border-border text-primary focus:ring-primary/20"
                checked={recovery}
                onChange={(e) => setRecovery(e.target.checked)}
              />
              <label htmlFor="recovery" className="text-sm font-medium cursor-pointer">Recovery</label>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="initialSnapshot"
                className="rounded border-border text-primary focus:ring-primary/20"
                checked={createInitialSnapshot}
                onChange={(e) => setCreateInitialSnapshot(e.target.checked)}
              />
              <label htmlFor="initialSnapshot" className="text-sm font-medium cursor-pointer">Create Initial Snapshot</label>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="pinWorkspace"
                className="rounded border-border text-primary focus:ring-primary/20"
                checked={pinWorkspace}
                onChange={(e) => setPinWorkspace(e.target.checked)}
              />
              <label htmlFor="pinWorkspace" className="text-sm font-medium cursor-pointer">Pin Workspace</label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={!name.trim() || isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Workspace"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
