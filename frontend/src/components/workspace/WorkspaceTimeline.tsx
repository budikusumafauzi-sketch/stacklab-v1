// @ts-nocheck
import React, { memo } from 'react';
import { WorkspaceSnapshot } from '../../services/workspace/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

interface WorkspaceTimelineProps {
  snapshots: WorkspaceSnapshot[];
  onRestore: (snapshotId: string) => void;
}

export const WorkspaceTimeline = memo(({ snapshots, onRestore }: WorkspaceTimelineProps) => {
  if (!snapshots || snapshots.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">No snapshots in timeline.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Snapshot Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 border-l-2 border-primary/20 pl-4 ml-2">
          {snapshots.map((snap) => (
            <div key={snap.id} className="relative">
              {/* Timeline Dot */}
              <div className="absolute -left-6 mt-1.5 h-3 w-3 rounded-full bg-primary" />
              
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium">{snap.name || 'Untitled Snapshot'}</span>
                  <span className="text-xs text-muted-foreground">{new Date(snap.created_at).toLocaleString()}</span>
                </div>
                {snap.description && (
                  <p className="text-xs text-muted-foreground">{snap.description}</p>
                )}
                <div className="flex gap-2 mt-2">
                  <span className="text-[10px] uppercase tracking-wider bg-secondary/50 px-2 py-1 rounded text-secondary-foreground">
                    {snap.snapshot_type}
                  </span>
                  <Button variant="outline" size="sm" className="h-6 text-xs ml-auto" onClick={() => onRestore(snap.id)}>
                    Restore
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});
