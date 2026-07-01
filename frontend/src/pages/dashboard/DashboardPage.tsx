
import { dashboardConfig } from "../../config/dashboard";
import { PageContainer } from "../../components/common/PageContainer";
import { PageHeader } from "../../components/common/PageHeader";
import { PageContent } from "../../components/common/PageContent";
import { StatusBadge } from "../../components/common/StatusBadge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Activity, LayoutGrid, Radio, TerminalSquare, Info } from "../../config/icons";
import { useSystemStatus } from "../../hooks/useSystemStatus";
import { useActivity } from "../../hooks/useActivity";
import { ActivityLog } from "../../services/activity/api";
import { workspaceDispatcher } from "../../services/workspace/dispatcher";
import { useNavigate } from "react-router-dom";

import { useWorkspaces } from "../../hooks/useWorkspaces";
import { useState, Suspense, lazy, useEffect } from "react";
import { Dialog, DialogContent } from "../../components/ui/dialog";

const ExportImportDialog = lazy(() => import("../../components/workspace/ExportImportDialog").then(module => ({ default: module.ExportImportDialog })));
const MetadataPanel = lazy(() => import("../../components/workspace/MetadataPanel").then(module => ({ default: module.MetadataPanel })));
const SnapshotDialog = lazy(() => import("../../components/workspace/SnapshotDialog").then(module => ({ default: module.SnapshotDialog })));
const RecoveryDialog = lazy(() => import("../../components/workspace/RecoveryDialog").then(module => ({ default: module.RecoveryDialog })));
const ConflictDialog = lazy(() => import("../../components/workspace/ConflictDialog").then(module => ({ default: module.ConflictDialog })));
const CreateWorkspaceModal = lazy(() => import("../../components/workspace/CreateWorkspaceModal").then(module => ({ default: module.CreateWorkspaceModal })));
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../../components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

export default function DashboardPage() {
  const systemHealth = useSystemStatus();
  const { activities } = useActivity();
  const { workspaces, loading, deleteWorkspace, togglePin, fetchWorkspaces } = useWorkspaces();
  const [isExportImportOpen, setIsExportImportOpen] = useState(false);
  const [selectedMetaWs, setSelectedMetaWs] = useState<any>(null);
  const [selectedSnapshotWs, setSelectedSnapshotWs] = useState<any>(null);
  const [selectedRecoveryWs, setSelectedRecoveryWs] = useState<any>(null);
  const [isConflictOpen, setIsConflictOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  const handleCreateClick = () => {
    setIsCreateOpen(true);
  };

  const handleOpenWorkspace = async (ws: any) => {
    await workspaceDispatcher.loadWorkspace(ws.id);
    const targetLab = ws.state?.activeLabId || "sql";
    navigate(`/labs/${targetLab}`);
  };

  return (
    <PageContainer>
      <PageHeader 
        title={dashboardConfig.hero.title} 
        description={dashboardConfig.hero.description}
      />
      
      <PageContent>
        <Suspense fallback={<div className="p-4">Loading resources...</div>}>
          <CreateWorkspaceModal 
            isOpen={isCreateOpen}
            onClose={() => setIsCreateOpen(false)}
          />
          <ExportImportDialog 
            isOpen={isExportImportOpen} 
            onClose={() => setIsExportImportOpen(false)}
            onImportSuccess={() => fetchWorkspaces()} 
          />
          <Dialog open={!!selectedMetaWs} onOpenChange={(open) => !open && setSelectedMetaWs(null)}>
            <DialogContent className="sm:max-w-md p-0 border-none bg-transparent shadow-none">
              {selectedMetaWs && <MetadataPanel workspace={selectedMetaWs} />}
            </DialogContent>
          </Dialog>
          {selectedSnapshotWs && (
            <SnapshotDialog 
              workspaceId={selectedSnapshotWs.id} 
              isOpen={true} 
              onClose={() => setSelectedSnapshotWs(null)} 
            />
          )}
          {selectedRecoveryWs && (
            <RecoveryDialog 
              workspaceId={selectedRecoveryWs.id}
            />
          )}
          <ConflictDialog 
            isOpen={isConflictOpen}
            onClose={() => setIsConflictOpen(false)}
            onForceOverwrite={() => setIsConflictOpen(false)}
            onDiscardLocal={() => setIsConflictOpen(false)}
            onSaveAsNew={() => setIsConflictOpen(false)}
          />
        </Suspense>
        {/* Workspaces */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold">Your Workspaces</h2>
          </div>
          
          {loading && workspaces.length === 0 ? (
            <p className="text-sm text-muted-foreground">Loading workspaces...</p>
          ) : workspaces.length === 0 ? (
            <div className="p-8 border rounded border-dashed text-center flex flex-col items-center gap-4">
              <p className="text-sm text-muted-foreground">No workspaces found.</p>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleCreateClick}>Create Workspace</Button>
                <Button size="sm" variant="outline" onClick={() => setIsExportImportOpen(true)}>Import Workspace</Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {workspaces.map((ws) => (
                <Card key={ws.id} className="hover:shadow-md transition-shadow flex flex-col">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 bg-primary/10 rounded-md text-primary cursor-pointer" onClick={() => togglePin(ws.id, ws.is_pinned)}>
                        {ws.is_pinned ? "📌" : <LayoutGrid className="h-5 w-5" />}
                      </div>
                      <StatusBadge status={ws.status as any} />
                    </div>
                    <CardTitle className="text-base">{ws.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 flex-1 flex flex-col">
                    <CardDescription className="text-xs mb-2 flex-1 line-clamp-2">
                      {ws.description || "No description"}
                    </CardDescription>
                    <div className="text-[10px] text-muted-foreground mb-4">
                      Updated: {new Date(ws.updated_at).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2 mt-auto">
                      <Button variant="default" className="flex-1" size="sm" onClick={() => handleOpenWorkspace(ws)}>
                        Open
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedMetaWs(ws)}>Metadata</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSelectedSnapshotWs(ws)}>Snapshots</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSelectedRecoveryWs(ws)}>Check Recovery</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setIsConflictOpen(true)}>Simulate Conflict</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => deleteWorkspace(ws.id)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Statistics */}
            <section>
              <h3 className="text-lg font-semibold mb-4 text-foreground">System Overview</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {dashboardConfig.statistics.map((stat, idx) => (
                  <Card key={idx}>
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <span className="text-2xl font-bold text-primary mb-1">{stat.value}</span>
                      <span className="text-xs text-muted-foreground">{stat.label}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Recent Activity */}
            <section>
              <h3 className="text-lg font-semibold mb-4 text-foreground">Recent Activity</h3>
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {activities.length === 0 ? (
                      <p className="p-4 text-sm text-muted-foreground text-center">No recent activity</p>
                    ) : (
                      activities.slice(0, 5).map((activity: ActivityLog) => (
                        <div key={activity.id} className="flex items-start p-4 hover:bg-secondary/50 transition-colors">
                          <div className="mt-1 bg-primary/10 p-1.5 rounded-full text-primary mr-4 shrink-0">
                            <Activity className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{activity.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(activity.created_at).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Right Sidebar Column */}
          <div className="space-y-6">
            {/* System Status */}
            <section>
              <h3 className="text-lg font-semibold mb-4 text-foreground">System Status</h3>
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <LayoutGrid className="h-4 w-4 mr-2" /> Frontend
                    </div>
                    <StatusBadge status={systemHealth.frontend} />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <TerminalSquare className="h-4 w-4 mr-2" /> Backend
                    </div>
                    <StatusBadge status={systemHealth.backend} />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Radio className="h-4 w-4 mr-2" /> API
                    </div>
                    <StatusBadge status={systemHealth.api} />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <LayoutGrid className="h-4 w-4 mr-2" /> Labs
                    </div>
                    <StatusBadge status={systemHealth.labs} />
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Tips & Documentation */}
            <section>
              <h3 className="text-lg font-semibold mb-4 text-foreground">Tips & Docs</h3>
              <div className="space-y-4">
                {dashboardConfig.tipsAndDocs.map((tip, idx) => (
                  <Card key={idx} className="bg-primary/5 border-primary/20">
                    <CardHeader className="p-4 pb-2 flex flex-row items-center space-y-0 space-x-2">
                      <Info className="h-4 w-4 text-primary" />
                      <CardTitle className="text-sm text-primary">{tip.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <CardDescription className="text-xs text-foreground/80">
                        {tip.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        </div>
      </PageContent>
    </PageContainer>
  );
}
