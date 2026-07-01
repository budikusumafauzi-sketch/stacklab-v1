from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid

# Metadata Schemas
class WorkspaceMetadataBase(BaseModel):
    snapshot_count: int = 0
    plugin_count: int = 0
    ai_sessions: int = 0
    recovery_count: int = 0
    export_count: int = 0
    import_count: int = 0
    integrity_status: str = "Valid"
    last_save: Optional[datetime] = None
    last_auto_save: Optional[datetime] = None
    last_snapshot: Optional[datetime] = None
    last_export: Optional[datetime] = None
    last_import: Optional[datetime] = None

class WorkspaceMetadataResponse(WorkspaceMetadataBase):
    id: str
    workspace_id: str
    model_config = ConfigDict(from_attributes=True)

# Snapshot Schemas
class WorkspaceSnapshotBase(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    snapshot_type: str = "Manual"
    version: Optional[str] = None
    schema_version: Optional[str] = None
    state: Dict[str, Any]
    checksum: Optional[str] = None
    compression_type: Optional[str] = None
    size_bytes: int = 0
    metadata_info: Dict[str, Any] = Field(default_factory=dict)

class WorkspaceSnapshotCreate(WorkspaceSnapshotBase):
    pass

class WorkspaceSnapshotResponse(WorkspaceSnapshotBase):
    id: str
    workspace_id: str
    creator_id: Optional[str] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Recovery Schemas
class WorkspaceRecoveryBase(BaseModel):
    state: Dict[str, Any]
    checksum: Optional[str] = None

class WorkspaceRecoveryCreate(WorkspaceRecoveryBase):
    pass

class WorkspaceRecoveryResponse(WorkspaceRecoveryBase):
    id: str
    workspace_id: str
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Workspace Schemas
class WorkspaceBase(BaseModel):
    name: str
    description: Optional[str] = None
    status: str = "active"
    is_pinned: bool = False
    is_favorite: bool = False
    tags: List[str] = Field(default_factory=list)
    state: Dict[str, Any] = Field(default_factory=dict)

class WorkspaceCreate(WorkspaceBase):
    pass

class WorkspaceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    is_pinned: Optional[bool] = None
    is_favorite: Optional[bool] = None
    tags: Optional[List[str]] = None
    state: Optional[Dict[str, Any]] = None
    version: Optional[int] = None # For optimistic locking

class WorkspaceResponse(WorkspaceBase):
    id: str
    owner_id: str
    version: int
    is_deleted: bool
    created_at: datetime
    updated_at: datetime
    last_accessed_at: datetime
    
    metadata_rel: Optional[WorkspaceMetadataResponse] = None
    
    model_config = ConfigDict(from_attributes=True)

class WorkspaceExport(BaseModel):
    workspace: Optional[WorkspaceResponse] = None
    snapshots: Optional[List[WorkspaceSnapshotResponse]] = None
    compressed_payload: Optional[str] = None
    export_version: str = "1.0.0"
    schema_version: str = "1.0.0"
    checksum: str
