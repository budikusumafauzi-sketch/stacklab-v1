import { ReactNode } from "react";
import { cn } from "../lib/utils";

interface LabLayoutProps {
  toolbar?: ReactNode;
  leftPanel?: ReactNode;
  rightPanel?: ReactNode;
  bottomPanel?: ReactNode;
  statusBar?: ReactNode;
  workspace: ReactNode;
  className?: string;
}

export default function LabLayout({
  toolbar,
  leftPanel,
  rightPanel,
  bottomPanel,
  statusBar,
  workspace,
  className,
}: LabLayoutProps) {
  return (
    <div className={cn("flex flex-col h-full bg-background rounded-lg border border-border overflow-hidden shadow-soft", className)}>
      {/* Optional Toolbar */}
      {toolbar && (
        <div className="h-14 border-b border-border bg-background px-4 flex items-center shrink-0">
          {toolbar}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Optional Left Panel */}
        {leftPanel && (
          <div className="w-64 border-r border-border bg-secondary/30 shrink-0 overflow-y-auto">
            {leftPanel}
          </div>
        )}

        {/* Central Workspace area (always present, but content is injected) */}
        <div className="flex-1 flex flex-col min-w-0 p-4 bg-background">
          {workspace}
        </div>

        {/* Optional Right Panel */}
        {rightPanel && (
          <div className="w-72 border-l border-border bg-secondary/30 shrink-0 overflow-y-auto">
            {rightPanel}
          </div>
        )}
      </div>

      {/* Optional Bottom Panel */}
      {bottomPanel && (
        <div className="h-48 border-t border-border bg-background shrink-0 overflow-y-auto">
          {bottomPanel}
        </div>
      )}

      {/* Optional Status Bar */}
      {statusBar && (
        <div className="h-8 border-t border-border bg-muted/50 px-4 flex items-center shrink-0 text-xs text-muted-foreground">
          {statusBar}
        </div>
      )}
    </div>
  );
}
