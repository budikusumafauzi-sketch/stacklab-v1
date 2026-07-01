from typing import Optional, Dict, Any, List
from pydantic import BaseModel, ConfigDict, Field, AliasChoices
from enum import Enum
from datetime import datetime

class ActivityType(str, Enum):
    INFO = "INFO"
    SUCCESS = "SUCCESS"
    WARNING = "WARNING"
    ERROR = "ERROR"
    SYSTEM = "SYSTEM"
    AI = "AI"
    PLUGIN = "PLUGIN"
    SECURITY = "SECURITY"
    WORKSPACE = "WORKSPACE"

class ActivityCategory(str, Enum):
    Workspace = "Workspace"
    Authentication = "Authentication"
    Security = "Security"
    System = "System"
    Notification = "Notification"
    Plugin = "Plugin"
    AI = "AI"
    SQL = "SQL"
    JSON = "JSON"
    Linux = "Linux"
    Network = "Network"
    Settings = "Settings"
    Export = "Export"
    Import = "Import"
    CommandPalette = "CommandPalette"

class ActivityBase(BaseModel):
    type: ActivityType
    category: ActivityCategory
    title: str
    description: Optional[str] = None
    metadata_: Optional[Dict[str, Any]] = Field(default=None, alias="metadata", validation_alias=AliasChoices("metadata_", "metadata"))

class ActivityCreate(ActivityBase):
    pass



class ActivityResponse(ActivityBase):
    id: int
    user_id: str
    is_read: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

class PaginatedActivityResponse(BaseModel):
    items: List[ActivityResponse]
    total: int
    page: int
    size: int
