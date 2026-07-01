from typing import Optional, List, Dict, Any, Tuple
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import desc, or_
import hashlib
import gzip
import json
from datetime import datetime, timezone
import uuid
import base64
from fastapi import HTTPException, status

from app.models.workspace import Workspace, WorkspaceSnapshot, WorkspaceRecovery, WorkspaceMetadata
from app.schemas.workspace import (
    WorkspaceCreate, WorkspaceUpdate, WorkspaceExport, WorkspaceSnapshotCreate,
    WorkspaceResponse, WorkspaceSnapshotResponse
)

# Fixed local owner used for all workspaces (no auth / multi-user)
LOCAL_OWNER_ID = "local"


def generate_checksum(payload: Dict[str, Any]) -> str:
    """Generate a SHA-256 checksum for a JSON payload."""
    data_str = json.dumps(payload, sort_keys=True)
    return hashlib.sha256(data_str.encode("utf-8")).hexdigest()


class WorkspaceService:
    @staticmethod
    def _update_metadata(db: Session, workspace_id: str, field: str, value: Any = None):
        """Helper to update metadata counters or timestamps."""
        metadata = db.query(WorkspaceMetadata).filter(WorkspaceMetadata.workspace_id == workspace_id).first()
        if metadata:
            if hasattr(metadata, field):
                if value is None and 'count' in field:
                    current = getattr(metadata, field)
                    setattr(metadata, field, current + 1)
                else:
                    setattr(metadata, field, value)
            db.commit()

    @staticmethod
    def create_workspace(db: Session, obj_in: WorkspaceCreate) -> Workspace:
        db_obj = Workspace(
            owner_id=LOCAL_OWNER_ID,
            name=obj_in.name,
            description=obj_in.description,
            status=obj_in.status,
            is_pinned=obj_in.is_pinned,
            is_favorite=obj_in.is_favorite,
            tags=obj_in.tags,
            state=obj_in.state,
            version=1,
            is_deleted=False
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    @staticmethod
    def get_workspaces(
        db: Session,
        skip: int = 0,
        limit: int = 50,
        search: Optional[str] = None
    ) -> Tuple[List[Workspace], int]:
        query = db.query(Workspace).options(joinedload(Workspace.metadata_rel)).filter(
            Workspace.is_deleted == False
        )

        if search:
            search_filter = f"%{search}%"
            query = query.filter(
                or_(
                    Workspace.name.ilike(search_filter),
                    Workspace.description.ilike(search_filter)
                )
            )

        total = query.count()
        items = query.order_by(desc(Workspace.is_pinned), desc(Workspace.last_accessed_at)).offset(skip).limit(limit).all()
        return items, total

    @staticmethod
    def get_workspace(db: Session, workspace_id: str) -> Optional[Workspace]:
        db_obj = db.query(Workspace).options(joinedload(Workspace.metadata_rel)).filter(
            Workspace.id == workspace_id,
            Workspace.is_deleted == False
        ).first()

        if db_obj:
            db_obj.last_accessed_at = datetime.now(timezone.utc)
            db.commit()
            db.refresh(db_obj)

        return db_obj

    @staticmethod
    def update_workspace(db: Session, workspace_id: str, obj_in: WorkspaceUpdate) -> Optional[Workspace]:
        db_obj = db.query(Workspace).filter(
            Workspace.id == workspace_id,
            Workspace.is_deleted == False
        ).first()

        if not db_obj:
            return None

        if obj_in.version is not None and db_obj.version != obj_in.version:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Conflict: Workspace was modified by another request")

        update_data = obj_in.model_dump(exclude_unset=True)
        if "version" in update_data:
            del update_data["version"]

        for field, value in update_data.items():
            setattr(db_obj, field, value)

        db_obj.version += 1
        db.commit()
        db.refresh(db_obj)

        if "state" in update_data:
            WorkspaceService._update_metadata(db, workspace_id, "last_save", datetime.now(timezone.utc))

        return db_obj

    @staticmethod
    def delete_workspace(db: Session, workspace_id: str) -> bool:
        """Soft delete"""
        db_obj = db.query(Workspace).filter(Workspace.id == workspace_id).first()
        if db_obj:
            db_obj.is_deleted = True
            db.commit()
            return True
        return False

    @staticmethod
    def create_snapshot(db: Session, workspace_id: str, obj_in: WorkspaceSnapshotCreate) -> WorkspaceSnapshot:
        workspace = WorkspaceService.get_workspace(db, workspace_id)
        if not workspace:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workspace not found")

        checksum = generate_checksum(obj_in.state)

        snapshot = WorkspaceSnapshot(
            workspace_id=workspace_id,
            creator_id=LOCAL_OWNER_ID,
            snapshot_type=obj_in.snapshot_type,
            name=obj_in.name,
            description=obj_in.description,
            version=obj_in.version or str(workspace.version),
            schema_version="1.0.0",
            state=obj_in.state,
            checksum=checksum,
            compression_type="None",
            size_bytes=len(json.dumps(obj_in.state).encode('utf-8'))
        )
        db.add(snapshot)
        db.commit()
        db.refresh(snapshot)

        WorkspaceService._update_metadata(db, workspace_id, "snapshot_count")
        WorkspaceService._update_metadata(db, workspace_id, "last_snapshot", datetime.now(timezone.utc))

        return snapshot

    @staticmethod
    def restore_snapshot(db: Session, workspace_id: str, snapshot_id: str) -> Workspace:
        workspace = WorkspaceService.get_workspace(db, workspace_id)
        if not workspace:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workspace not found")

        snapshot = db.query(WorkspaceSnapshot).filter(
            WorkspaceSnapshot.id == snapshot_id,
            WorkspaceSnapshot.workspace_id == workspace_id
        ).first()

        if not snapshot:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Snapshot not found")

        if snapshot.checksum and snapshot.checksum != generate_checksum(snapshot.state):
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Snapshot integrity check failed")

        workspace.state = snapshot.state
        workspace.version += 1
        db.commit()
        db.refresh(workspace)
        return workspace

    @staticmethod
    def get_snapshots(db: Session, workspace_id: str) -> List[WorkspaceSnapshot]:
        return db.query(WorkspaceSnapshot).filter(
            WorkspaceSnapshot.workspace_id == workspace_id
        ).order_by(desc(WorkspaceSnapshot.created_at)).all()

    @staticmethod
    def save_recovery(db: Session, workspace_id: str, state: Dict[str, Any]) -> WorkspaceRecovery:
        workspace = db.query(Workspace).filter(Workspace.id == workspace_id).first()
        if not workspace:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workspace not found")

        checksum = generate_checksum(state)
        recovery = db.query(WorkspaceRecovery).filter(WorkspaceRecovery.workspace_id == workspace_id).first()

        if recovery:
            recovery.state = state
            recovery.checksum = checksum
            recovery.updated_at = datetime.now(timezone.utc)
        else:
            recovery = WorkspaceRecovery(
                workspace_id=workspace_id,
                state=state,
                checksum=checksum
            )
            db.add(recovery)

        db.commit()
        db.refresh(recovery)

        WorkspaceService._update_metadata(db, workspace_id, "recovery_count")
        WorkspaceService._update_metadata(db, workspace_id, "last_auto_save", datetime.now(timezone.utc))

        return recovery

    @staticmethod
    def get_recovery(db: Session, workspace_id: str) -> Optional[WorkspaceRecovery]:
        workspace = db.query(Workspace).filter(Workspace.id == workspace_id).first()
        if not workspace:
            return None
        return db.query(WorkspaceRecovery).filter(WorkspaceRecovery.workspace_id == workspace_id).first()

    @staticmethod
    def clear_recovery(db: Session, workspace_id: str) -> bool:
        workspace = db.query(Workspace).filter(Workspace.id == workspace_id).first()
        if not workspace:
            return False

        recovery = db.query(WorkspaceRecovery).filter(WorkspaceRecovery.workspace_id == workspace_id).first()
        if recovery:
            db.delete(recovery)
            db.commit()
            return True
        return False

    @staticmethod
    def export_workspace(db: Session, workspace_id: str) -> WorkspaceExport:
        workspace = WorkspaceService.get_workspace(db, workspace_id)
        if not workspace:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workspace not found")

        snapshots = WorkspaceService.get_snapshots(db, workspace_id)

        export_payload = {
            "workspace": WorkspaceResponse.model_validate(workspace).model_dump(mode='json'),
            "snapshots": [WorkspaceSnapshotResponse.model_validate(s).model_dump(mode='json') for s in snapshots]
        }

        checksum = generate_checksum(export_payload["workspace"]["state"])

        json_bytes = json.dumps(export_payload).encode('utf-8')
        compressed_bytes = gzip.compress(json_bytes)
        compressed_payload = base64.b64encode(compressed_bytes).decode('utf-8')

        WorkspaceService._update_metadata(db, workspace_id, "export_count")
        WorkspaceService._update_metadata(db, workspace_id, "last_export", datetime.now(timezone.utc))

        return WorkspaceExport(
            compressed_payload=compressed_payload,
            export_version="1.0.0",
            schema_version="1.0.0",
            checksum=checksum
        )

    @staticmethod
    def import_workspace(db: Session, export_data: WorkspaceExport) -> Workspace:
        if export_data.compressed_payload:
            json_bytes = gzip.decompress(base64.b64decode(export_data.compressed_payload))
            decompressed = json.loads(json_bytes.decode('utf-8'))
            workspace_data = decompressed["workspace"]
            snapshots_data = decompressed["snapshots"]
        else:
            workspace_data = export_data.workspace.model_dump(mode='json') if export_data.workspace else {}
            snapshots_data = [s.model_dump(mode='json') for s in export_data.snapshots] if export_data.snapshots else []

        if export_data.checksum != generate_checksum(workspace_data.get("state", {})):
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Import integrity check failed")

        db_workspace = Workspace(
            owner_id=LOCAL_OWNER_ID,
            name=workspace_data.get("name", "Imported Workspace"),
            description=workspace_data.get("description"),
            status=workspace_data.get("status", "active"),
            is_pinned=workspace_data.get("is_pinned", False),
            is_favorite=workspace_data.get("is_favorite", False),
            tags=workspace_data.get("tags", []),
            state=workspace_data.get("state", {}),
            version=1,
            is_deleted=False
        )
        db.add(db_workspace)
        db.commit()
        db.refresh(db_workspace)

        metadata = WorkspaceMetadata(
            workspace_id=db_workspace.id,
            snapshot_count=len(snapshots_data),
            import_count=1,
            last_import=datetime.now(timezone.utc)
        )
        db.add(metadata)

        for snap in snapshots_data:
            db_snap = WorkspaceSnapshot(
                workspace_id=db_workspace.id,
                creator_id=LOCAL_OWNER_ID,
                snapshot_type=snap.get("snapshot_type", "Manual"),
                name=snap.get("name", "Imported Snapshot"),
                description=snap.get("description"),
                version=snap.get("version"),
                schema_version=snap.get("schema_version"),
                state=snap.get("state", {}),
                checksum=snap.get("checksum"),
                compression_type=snap.get("compression_type"),
                size_bytes=snap.get("size_bytes", 0)
            )
            db.add(db_snap)

        db.commit()
        return db_workspace
