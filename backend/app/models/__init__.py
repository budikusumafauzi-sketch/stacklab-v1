from app.core.database import Base
from app.models.user import User
from app.models.workspace import Workspace, WorkspaceSnapshot, WorkspaceRecovery, WorkspaceMetadata
from app.models.activity import Activity

# Add new models here so Alembic can discover them
__all__ = ["Base", "User", "Workspace", "WorkspaceSnapshot", "WorkspaceRecovery", "WorkspaceMetadata", "Activity"]
