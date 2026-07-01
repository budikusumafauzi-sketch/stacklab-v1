import { activityService } from './api';

export enum ActivityType {
  INFO = "INFO",
  SUCCESS = "SUCCESS",
  WARNING = "WARNING",
  ERROR = "ERROR",
  SYSTEM = "SYSTEM",
  AI = "AI",
  PLUGIN = "PLUGIN",
  SECURITY = "SECURITY",
  WORKSPACE = "WORKSPACE"
}

export enum ActivityCategory {
  Workspace = "Workspace",
  Authentication = "Authentication",
  Security = "Security",
  System = "System",
  Notification = "Notification",
  Plugin = "Plugin",
  AI = "AI",
  SQL = "SQL",
  JSON = "JSON",
  Linux = "Linux",
  Network = "Network",
  Settings = "Settings",
  Export = "Export",
  Import = "Import",
  CommandPalette = "CommandPalette"
}

export const ActivityEvents = {
  WorkspaceOpened: "WorkspaceOpened",
  WorkspaceClosed: "WorkspaceClosed",
  WorkspaceSaved: "WorkspaceSaved",
  WorkspaceRestored: "WorkspaceRestored",
  WorkspaceExported: "WorkspaceExported",
  WorkspaceImported: "WorkspaceImported",
  WorkspaceSnapshotCreated: "WorkspaceSnapshotCreated",
  WorkspaceSnapshotRestored: "WorkspaceSnapshotRestored",
  UserLogin: "UserLogin",
  UserLogout: "UserLogout",
  PasswordChanged: "PasswordChanged",
  PluginInstalled: "PluginInstalled",
  PluginRemoved: "PluginRemoved",
  PluginUpdated: "PluginUpdated",
  NotificationCreated: "NotificationCreated",
  NotificationRead: "NotificationRead",
  CommandExecuted: "CommandExecuted",
  SearchPerformed: "SearchPerformed",
  SQLExecuted: "SQLExecuted",
  JSONFormatted: "JSONFormatted",
  LinuxCommandExecuted: "LinuxCommandExecuted",
  NetworkCalculationExecuted: "NetworkCalculationExecuted",
  AIRequestStarted: "AIRequestStarted",
  AIRequestCompleted: "AIRequestCompleted",
  AIConversationCreated: "AIConversationCreated",
  SettingsChanged: "SettingsChanged",
  SystemWarning: "SystemWarning",
  SystemError: "SystemError"
} as const;

export type ActivityEventName = keyof typeof ActivityEvents;

export const ActivityDispatcher = {
  dispatch: async (
    eventName: ActivityEventName,
    type: ActivityType,
    category: ActivityCategory,
    description?: string,
    metadata?: Record<string, unknown>
  ) => {
    try {
      await activityService.logActivity({
        title: eventName,
        type,
        category,
        description,
        metadata
      });
      // Emit a local event so the UI can refresh if needed
      window.dispatchEvent(new CustomEvent('activity:new', { detail: { eventName } }));
    } catch (error) {
      console.error("Failed to dispatch activity:", error);
    }
  },

  dispatchWorkspaceEvent: (eventName: ActivityEventName, description?: string, metadata?: Record<string, unknown>) => {
    return ActivityDispatcher.dispatch(eventName, ActivityType.WORKSPACE, ActivityCategory.Workspace, description, metadata);
  },
  
  dispatchSystemEvent: (eventName: ActivityEventName, type: ActivityType = ActivityType.SYSTEM, description?: string, metadata?: Record<string, unknown>) => {
    return ActivityDispatcher.dispatch(eventName, type, ActivityCategory.System, description, metadata);
  },

  dispatchAuthEvent: (eventName: ActivityEventName, type: ActivityType = ActivityType.SECURITY, description?: string) => {
    return ActivityDispatcher.dispatch(eventName, type, ActivityCategory.Authentication, description);
  }
};
