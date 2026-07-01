from typing import Any, Dict, List
from abc import ABC, abstractmethod
from app.models.workspace import Workspace

class WorkspaceExtensionPlugin(ABC):
    @abstractmethod
    def on_workspace_created(self, workspace: Workspace) -> None:
        pass

    @abstractmethod
    def on_workspace_saved(self, workspace: Workspace) -> None:
        pass

    @abstractmethod
    def on_workspace_deleted(self, workspace_id: str) -> None:
        pass

class WorkspaceExtensionPoint:
    _plugins: List[WorkspaceExtensionPlugin] = []

    @classmethod
    def register_plugin(cls, plugin: WorkspaceExtensionPlugin):
        cls._plugins.append(plugin)
        
    @classmethod
    def on_workspace_created(cls, workspace: Workspace):
        for plugin in cls._plugins:
            plugin.on_workspace_created(workspace)

    @classmethod
    def on_workspace_saved(cls, workspace: Workspace):
        for plugin in cls._plugins:
            plugin.on_workspace_saved(workspace)

    @classmethod
    def on_workspace_deleted(cls, workspace_id: str):
        for plugin in cls._plugins:
            plugin.on_workspace_deleted(workspace_id)
