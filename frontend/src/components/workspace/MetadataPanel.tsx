// @ts-nocheck
import React, { memo } from 'react';
import { Workspace } from '../../services/workspace/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Activity, LayoutGrid, TerminalSquare } from '../../config/icons';

interface MetadataPanelProps {
  workspace: Workspace;
}

export const MetadataPanel = memo(({ workspace }: MetadataPanelProps) => {
  const meta = workspace.metadata_rel;

  if (!meta) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Workspace Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">Metadata not available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center">
          <Activity className="w-4 h-4 mr-2" />
          Workspace Metadata
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex flex-col">
            <span className="text-muted-foreground text-xs">Snapshots</span>
            <span className="font-medium">{meta.snapshot_count}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground text-xs">Recoveries</span>
            <span className="font-medium">{meta.recovery_count}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground text-xs">Exports</span>
            <span className="font-medium">{meta.export_count}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground text-xs">Imports</span>
            <span className="font-medium">{meta.import_count}</span>
          </div>
        </div>

        <div className="space-y-1">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Timeline</h4>
          <div className="text-xs flex justify-between">
            <span>Last Save:</span>
            <span>{meta.last_save ? new Date(meta.last_save).toLocaleString() : 'Never'}</span>
          </div>
          <div className="text-xs flex justify-between">
            <span>Last Snapshot:</span>
            <span>{meta.last_snapshot ? new Date(meta.last_snapshot).toLocaleString() : 'Never'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
