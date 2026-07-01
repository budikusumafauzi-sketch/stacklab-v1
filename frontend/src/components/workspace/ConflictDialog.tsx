// @ts-nocheck
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";

interface ConflictDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onForceOverwrite: () => void;
  onDiscardLocal: () => void;
  onSaveAsNew: () => void;
}

export function ConflictDialog({
  isOpen,
  onClose,
  onForceOverwrite,
  onDiscardLocal,
  onSaveAsNew
}: ConflictDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-destructive">Version Conflict Detected</DialogTitle>
          <DialogDescription>
            The workspace was modified by another request since you last loaded it. 
            How would you like to resolve this conflict?
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex flex-col gap-2">
            <Button variant="outline" onClick={onDiscardLocal} className="w-full justify-start">
              <div className="flex flex-col items-start">
                <span>Discard Local Changes</span>
                <span className="text-xs text-muted-foreground font-normal">Pull the latest server version and discard your changes.</span>
              </div>
            </Button>
            <Button variant="outline" onClick={onSaveAsNew} className="w-full justify-start">
              <div className="flex flex-col items-start">
                <span>Save as New Workspace</span>
                <span className="text-xs text-muted-foreground font-normal">Keep your changes by creating a new workspace.</span>
              </div>
            </Button>
            <Button variant="destructive" onClick={onForceOverwrite} className="w-full justify-start">
              <div className="flex flex-col items-start">
                <span>Force Overwrite</span>
                <span className="text-xs text-primary-foreground/80 font-normal">Overwrite the server version with your local changes.</span>
              </div>
            </Button>
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
