import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface LabWorkspaceProps {
  children?: ReactNode;
  className?: string;
}

export function LabWorkspace({ children, className }: LabWorkspaceProps) {
  return (
    <div className={cn("flex-1 bg-muted border border-border rounded-md overflow-hidden relative", className)}>
      {children || (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50 font-medium">
          Workspace Area
        </div>
      )}
    </div>
  );
}
