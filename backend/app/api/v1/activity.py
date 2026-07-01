from typing import Any, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api import deps
from app.schemas.activity import ActivityCreate, ActivityResponse, PaginatedActivityResponse, ActivityType, ActivityCategory
from app.services.activity import ActivityService

router = APIRouter()

LOCAL_USER_ID = "local"


@router.post("/", response_model=ActivityResponse)
def create_activity(
    *,
    db: Session = Depends(deps.get_db),
    activity_in: ActivityCreate,
) -> Any:
    """
    Create a new activity log.
    """
    return ActivityService.create_activity(db=db, user_id=LOCAL_USER_ID, obj_in=activity_in)


@router.get("/", response_model=PaginatedActivityResponse)
def read_activities(
    db: Session = Depends(deps.get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    type: Optional[ActivityType] = None,
    category: Optional[ActivityCategory] = None,
    search: Optional[str] = None,
) -> Any:
    """
    Retrieve activities.
    """
    items, total = ActivityService.get_activities(
        db, user_id=LOCAL_USER_ID, skip=skip, limit=limit, type=type, category=category, search=search
    )
    return {
        "items": items,
        "total": total,
        "page": skip // limit + 1 if limit > 0 else 1,
        "size": limit
    }


@router.patch("/{id}/read", response_model=ActivityResponse)
def mark_activity_as_read(
    id: int,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Mark a specific activity as read.
    """
    activity = ActivityService.mark_as_read(db, user_id=LOCAL_USER_ID, activity_id=id)
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    return activity


@router.patch("/read-all", response_model=dict)
def mark_all_activities_as_read(
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Mark all unread activities as read.
    """
    updated_count = ActivityService.mark_all_as_read(db, user_id=LOCAL_USER_ID)
    return {"updated": updated_count}


@router.delete("/{id}", status_code=status.HTTP_200_OK)
def delete_activity(
    id: int,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Delete an activity.
    """
    success = ActivityService.delete_activity(db, user_id=LOCAL_USER_ID, activity_id=id)
    if not success:
        raise HTTPException(status_code=404, detail="Activity not found")
    return {"success": True}
