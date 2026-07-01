export interface TabState {
  id: string;
  path: string;
  title: string;
  icon?: string;
  isActive: boolean;
  isPinned: boolean;
  hasUnsavedChanges: boolean;
  lastAccessed: number;
}

export interface WorkspaceState {
  openTabs: TabState[];
  recentFiles: string[];
  activeLabId: string | null;
  sidebarCollapsed: boolean;
}

export interface WorkspaceMetadata {
  snapshot_count: number;
  plugin_count: number;
  ai_sessions: number;
  recovery_count: number;
  export_count: number;
  import_count: number;
  integrity_status: string;
  last_save: string | null;
  last_auto_save?: string;
  last_snapshot?: string;
  last_export?: string;
  last_import?: string;
}

export interface Workspace {
  id: string;
  owner_id: string;
  name: string;
  description?: string;
  status: string;
  version: number;
  is_pinned: boolean;
  is_favorite: boolean;
  is_deleted: boolean;
  tags: string[];
  state: WorkspaceState;
  created_at: string;
  updated_at: string;
  last_accessed_at: string;
  metadata_rel?: WorkspaceMetadata;
}

export interface WorkspaceSnapshot {
  id: string;
  workspace_id: string;
  creator_id: string | null;
  snapshot_type: string;
  name: string | null;
  description: string | null;
  version: string | null;
  schema_version: string | null;
  state: WorkspaceState;
  checksum: string | null;
  compression_type: string | null;
  size_bytes: number;
  metadata_info: Record<string, any>;
  created_at: string;
}

export interface WorkspaceRecovery {
  id: string;
  workspace_id: string;
  state: WorkspaceState;
  checksum: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceExport {
  workspace?: Workspace;
  snapshots?: WorkspaceSnapshot[];
  compressed_payload?: string;
  export_version: string;
  schema_version: string;
  checksum: string;
}
