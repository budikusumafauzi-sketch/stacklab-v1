from typing import Optional, List, Any
from sqlalchemy.orm import Session
from sqlalchemy import desc, or_, and_
from app.models.activity import Activity
from app.schemas.activity import ActivityCreate, ActivityType, ActivityCategory

class ActivityService:
    @staticmethod
    def create_activity(db: Session, user_id: str, obj_in: ActivityCreate) -> Activity:
        db_obj = Activity(
            user_id=user_id,
            type=obj_in.type.value,
            category=obj_in.category.value,
            title=obj_in.title,
            description=obj_in.description,
            metadata_=obj_in.metadata_
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    @staticmethod
    def get_activities(
        db: Session, 
        user_id: str, 
        skip: int = 0, 
        limit: int = 50,
        type: Optional[ActivityType] = None,
        category: Optional[ActivityCategory] = None,
        search: Optional[str] = None
    ) -> tuple[List[Activity], int]:
        query = db.query(Activity).filter(Activity.user_id == user_id)
        
        if type:
            query = query.filter(Activity.type == type.value)
        if category:
            query = query.filter(Activity.category == category.value)
        if search:
            search_filter = f"%{search}%"
            query = query.filter(
                or_(
                    Activity.title.ilike(search_filter),
                    Activity.description.ilike(search_filter)
                )
            )
        
        total = query.count()
        items = query.order_by(desc(Activity.created_at)).offset(skip).limit(limit).all()
        return items, total

    @staticmethod
    def mark_as_read(db: Session, user_id: str, activity_id: int) -> Optional[Activity]:
        db_obj = db.query(Activity).filter(Activity.id == activity_id, Activity.user_id == user_id).first()
        if db_obj:
            db_obj.is_read = True
            db.commit()
            db.refresh(db_obj)
        return db_obj

    @staticmethod
    def mark_all_as_read(db: Session, user_id: str) -> int:
        updated = db.query(Activity).filter(
            Activity.user_id == user_id, 
            Activity.is_read == False
        ).update({"is_read": True})
        db.commit()
        return updated

    @staticmethod
    def delete_activity(db: Session, user_id: str, activity_id: int) -> bool:
        db_obj = db.query(Activity).filter(Activity.id == activity_id, Activity.user_id == user_id).first()
        if db_obj:
            db.delete(db_obj)
            db.commit()
            return True
        return False
