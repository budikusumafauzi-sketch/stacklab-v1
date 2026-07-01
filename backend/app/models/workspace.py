from sqlalchemy import Column, String, DateTime, JSON, Boolean, Integer, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from app.core.database import Base

class Workspace(Base):
    __tablename__ = "workspaces"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    owner_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    status = Column(String, default="active")
    version = Column(Integer, default=1) # Optimistic locking version
    is_pinned = Column(Boolean, default=False)
    is_favorite = Column(Boolean, default=False)
    is_deleted = Column(Boolean, default=False)
    state = Column(JSON, nullable=False)
    tags = Column(JSON, default=list)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    last_accessed_at = Column(DateTime(timezone=True), server_default=func.now())

    snapshots = relationship("WorkspaceSnapshot", back_populates="workspace", cascade="all, delete-orphan")
    recoveries = relationship("WorkspaceRecovery", back_populates="workspace", cascade="all, delete-orphan")
    metadata_rel = relationship("WorkspaceMetadata", back_populates="workspace", uselist=False, cascade="all, delete-orphan")


class WorkspaceSnapshot(Base):
    __tablename__ = "workspace_snapshots"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    workspace_id = Column(String, ForeignKey("workspaces.id", ondelete="CASCADE"), index=True, nullable=False)
    creator_id = Column(String, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    
    snapshot_type = Column(String, default="Manual") # Manual, Automatic, Recovery, Plugin, AI
    name = Column(String, nullable=True)
    description = Column(String, nullable=True)
    
    version = Column(String, nullable=True) # Semantic version
    schema_version = Column(String, nullable=True)
    
    state = Column(JSON, nullable=False)
    checksum = Column(String, nullable=True)
    compression_type = Column(String, nullable=True) # e.g. GZIP
    
    size_bytes = Column(Integer, default=0)
    metadata_info = Column(JSON, default=dict)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    workspace = relationship("Workspace", back_populates="snapshots")


class WorkspaceRecovery(Base):
    __tablename__ = "workspace_recoveries"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    workspace_id = Column(String, ForeignKey("workspaces.id", ondelete="CASCADE"), index=True, nullable=False, unique=True)
    
    state = Column(JSON, nullable=False)
    checksum = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    workspace = relationship("Workspace", back_populates="recoveries")


class WorkspaceMetadata(Base):
    __tablename__ = "workspace_metadata"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    workspace_id = Column(String, ForeignKey("workspaces.id", ondelete="CASCADE"), index=True, nullable=False, unique=True)
    
    snapshot_count = Column(Integer, default=0)
    plugin_count = Column(Integer, default=0)
    ai_sessions = Column(Integer, default=0)
    recovery_count = Column(Integer, default=0)
    export_count = Column(Integer, default=0)
    import_count = Column(Integer, default=0)
    
    integrity_status = Column(String, default="Valid")
    
    last_save = Column(DateTime(timezone=True), nullable=True)
    last_auto_save = Column(DateTime(timezone=True), nullable=True)
    last_snapshot = Column(DateTime(timezone=True), nullable=True)
    last_export = Column(DateTime(timezone=True), nullable=True)
    last_import = Column(DateTime(timezone=True), nullable=True)

    workspace = relationship("Workspace", back_populates="metadata_rel")
