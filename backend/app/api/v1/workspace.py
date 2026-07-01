from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps

from app.schemas.workspace import (
    WorkspaceCreate,
    WorkspaceUpdate,
    WorkspaceResponse,
    WorkspaceExport,
    WorkspaceSnapshotCreate,
    WorkspaceSnapshotResponse,
    WorkspaceRecoveryCreate,
    WorkspaceRecoveryResponse
)
from app.services.workspace import WorkspaceService

router = APIRouter()


@router.post("", response_model=WorkspaceResponse)
def create_workspace(
    *,
    db: Session = Depends(deps.get_db),
    workspace_in: WorkspaceCreate,
) -> Any:
    return WorkspaceService.create_workspace(db, workspace_in)


@router.get("", response_model=List[WorkspaceResponse])
def get_workspaces(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 50,
    search: Optional[str] = None,
) -> Any:
    workspaces, _ = WorkspaceService.get_workspaces(db, skip, limit, search)
    return workspaces


@router.get("/{workspace_id}", response_model=WorkspaceResponse)
def get_workspace(
    workspace_id: str,
    db: Session = Depends(deps.get_db),
) -> Any:
    workspace = WorkspaceService.get_workspace(db, workspace_id)
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return workspace


@router.put("/{workspace_id}", response_model=WorkspaceResponse)
def update_workspace(
    workspace_id: str,
    *,
    db: Session = Depends(deps.get_db),
    workspace_in: WorkspaceUpdate,
) -> Any:
    workspace = WorkspaceService.update_workspace(db, workspace_id, workspace_in)
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return workspace


@router.delete("/{workspace_id}")
def delete_workspace(
    workspace_id: str,
    db: Session = Depends(deps.get_db),
) -> Any:
    success = WorkspaceService.delete_workspace(db, workspace_id)
    if not success:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return {"status": "success"}


@router.post("/{workspace_id}/snapshots", response_model=WorkspaceSnapshotResponse)
def create_snapshot(
    workspace_id: str,
    *,
    db: Session = Depends(deps.get_db),
    snapshot_in: WorkspaceSnapshotCreate,
) -> Any:
    return WorkspaceService.create_snapshot(db, workspace_id, snapshot_in)


@router.get("/{workspace_id}/snapshots", response_model=List[WorkspaceSnapshotResponse])
def get_snapshots(
    workspace_id: str,
    db: Session = Depends(deps.get_db),
) -> Any:
    workspace = WorkspaceService.get_workspace(db, workspace_id)
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return WorkspaceService.get_snapshots(db, workspace_id)


@router.post("/{workspace_id}/snapshots/{snapshot_id}/restore", response_model=WorkspaceResponse)
def restore_snapshot(
    workspace_id: str,
    snapshot_id: str,
    db: Session = Depends(deps.get_db),
) -> Any:
    return WorkspaceService.restore_snapshot(db, workspace_id, snapshot_id)


@router.post("/{workspace_id}/recovery", response_model=WorkspaceRecoveryResponse)
def save_recovery(
    workspace_id: str,
    *,
    db: Session = Depends(deps.get_db),
    recovery_in: WorkspaceRecoveryCreate,
) -> Any:
    return WorkspaceService.save_recovery(db, workspace_id, recovery_in.state)


@router.get("/{workspace_id}/recovery", response_model=WorkspaceRecoveryResponse)
def get_recovery(
    workspace_id: str,
    db: Session = Depends(deps.get_db),
) -> Any:
    recovery = WorkspaceService.get_recovery(db, workspace_id)
    if not recovery:
        raise HTTPException(status_code=404, detail="Recovery not found")
    return recovery


@router.delete("/{workspace_id}/recovery")
def clear_recovery(
    workspace_id: str,
    db: Session = Depends(deps.get_db),
) -> Any:
    success = WorkspaceService.clear_recovery(db, workspace_id)
    if not success:
        raise HTTPException(status_code=404, detail="Recovery not found")
    return {"status": "success"}


@router.get("/{workspace_id}/export", response_model=WorkspaceExport)
def export_workspace(
    workspace_id: str,
    db: Session = Depends(deps.get_db),
) -> Any:
    return WorkspaceService.export_workspace(db, workspace_id)


@router.post("/import", response_model=WorkspaceResponse)
def import_workspace(
    *,
    db: Session = Depends(deps.get_db),
    export_in: WorkspaceExport,
) -> Any:
    return WorkspaceService.import_workspace(db, export_in)
