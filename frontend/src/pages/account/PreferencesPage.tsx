import { useRef } from "react";
import { PageContainer } from "../../components/common/PageContainer";
import { PageHeader } from "../../components/common/PageHeader";
import { PageContent } from "../../components/common/PageContent";
import { useSettings } from "../../hooks/useSettings";
import { toast } from "sonner";

function PreferenceToggle({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-3">
      <input
        type="checkbox"
        id={id}
        className="mt-1 rounded border-border text-primary focus:ring-primary/20 cursor-pointer"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div>
        <label htmlFor={id} className="text-sm font-medium cursor-pointer select-none">
          {label}
        </label>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5 select-none">{description}</p>
        )}
      </div>
    </div>
  );
}

function PreferenceSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-6 bg-background rounded-xl border border-border shadow-soft space-y-4">
      <h3 className="text-lg font-medium tracking-tight">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export default function PreferencesPage() {
  const { state, updatePreferencesSettings } = useSettings();
  const prefs = state.preferences;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdate = (key: keyof typeof prefs, value: boolean) => {
    updatePreferencesSettings({ [key]: value });
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(prefs, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "stacklab_preferences.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast.success("Preferences exported successfully.");
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        updatePreferencesSettings(imported);
      } catch (err) {
        console.error("Failed to parse preferences file", err);
        toast.error("Invalid preferences file.");
      }
    };
    reader.readAsText(file);
    e.target.value = ""; // Reset input
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all preferences to their default values?")) {
      updatePreferencesSettings({
        emailNotifications: true,
        pushNotifications: true,
        activityNotifications: true,
        workspaceNotifications: true,
        systemNotifications: true,
        openLastWorkspace: false,
        restorePreviousSession: true,
        checkForUpdates: true,
        showRecentWorkspaces: true,
        showActivityCenter: true,
        showQuickActions: true,
        compactDashboardMode: false,
        autoSaveLabs: true,
        openLastActiveLab: false,
        confirmBeforeClosingWorkspace: true,
        enableAnimations: true,
        enableLazyLoading: true,
        reduceMotion: false,
      });
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Preferences"
        description="Manage your global application preferences."
      />

      <PageContent>
        <div className="max-w-3xl grid gap-6 pb-12">
          
          <PreferenceSection title="Notifications">
            <PreferenceToggle
              id="email-notif"
              label="Email Notifications"
              checked={prefs.emailNotifications}
              onChange={(c) => handleUpdate("emailNotifications", c)}
            />
            <PreferenceToggle
              id="push-notif"
              label="Push Notifications"
              checked={prefs.pushNotifications}
              onChange={(c) => handleUpdate("pushNotifications", c)}
            />
            <PreferenceToggle
              id="activity-notif"
              label="Activity Notifications"
              checked={prefs.activityNotifications}
              onChange={(c) => handleUpdate("activityNotifications", c)}
            />
            <PreferenceToggle
              id="workspace-notif"
              label="Workspace Notifications"
              checked={prefs.workspaceNotifications}
              onChange={(c) => handleUpdate("workspaceNotifications", c)}
            />
            <PreferenceToggle
              id="system-notif"
              label="System Notifications"
              checked={prefs.systemNotifications}
              onChange={(c) => handleUpdate("systemNotifications", c)}
            />
          </PreferenceSection>

          <PreferenceSection title="Startup">
            <PreferenceToggle
              id="open-last-workspace"
              label="Open Last Workspace"
              checked={prefs.openLastWorkspace}
              onChange={(c) => handleUpdate("openLastWorkspace", c)}
            />
            <PreferenceToggle
              id="restore-prev-session"
              label="Restore Previous Session"
              checked={prefs.restorePreviousSession}
              onChange={(c) => handleUpdate("restorePreviousSession", c)}
            />
            <PreferenceToggle
              id="check-updates"
              label="Check for Updates on Startup"
              checked={prefs.checkForUpdates}
              onChange={(c) => handleUpdate("checkForUpdates", c)}
            />
          </PreferenceSection>

          <PreferenceSection title="Dashboard">
            <PreferenceToggle
              id="recent-workspaces"
              label="Show Recent Workspaces"
              checked={prefs.showRecentWorkspaces}
              onChange={(c) => handleUpdate("showRecentWorkspaces", c)}
            />
            <PreferenceToggle
              id="activity-center"
              label="Show Activity Center"
              checked={prefs.showActivityCenter}
              onChange={(c) => handleUpdate("showActivityCenter", c)}
            />
            <PreferenceToggle
              id="quick-actions"
              label="Show Quick Actions"
              checked={prefs.showQuickActions}
              onChange={(c) => handleUpdate("showQuickActions", c)}
            />
            <PreferenceToggle
              id="compact-dashboard"
              label="Compact Dashboard Mode"
              checked={prefs.compactDashboardMode}
              onChange={(c) => handleUpdate("compactDashboardMode", c)}
            />
          </PreferenceSection>

          <PreferenceSection title="Labs">
            <PreferenceToggle
              id="autosave-labs"
              label="Auto Save Labs"
              checked={prefs.autoSaveLabs}
              onChange={(c) => handleUpdate("autoSaveLabs", c)}
            />
            <PreferenceToggle
              id="open-last-lab"
              label="Open Last Active Lab"
              checked={prefs.openLastActiveLab}
              onChange={(c) => handleUpdate("openLastActiveLab", c)}
            />
            <PreferenceToggle
              id="confirm-close-ws"
              label="Confirm Before Closing Workspace"
              checked={prefs.confirmBeforeClosingWorkspace}
              onChange={(c) => handleUpdate("confirmBeforeClosingWorkspace", c)}
            />
          </PreferenceSection>

          <PreferenceSection title="Performance">
            <PreferenceToggle
              id="enable-animations"
              label="Enable Animations"
              checked={prefs.enableAnimations}
              onChange={(c) => handleUpdate("enableAnimations", c)}
            />
            <PreferenceToggle
              id="enable-lazy-loading"
              label="Enable Lazy Loading"
              checked={prefs.enableLazyLoading}
              onChange={(c) => handleUpdate("enableLazyLoading", c)}
            />
            <PreferenceToggle
              id="reduce-motion"
              label="Reduce Motion"
              checked={prefs.reduceMotion}
              onChange={(c) => handleUpdate("reduceMotion", c)}
            />
          </PreferenceSection>

          <PreferenceSection title="Data">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
              >
                Export Preferences
              </button>
              
              <button
                onClick={handleImportClick}
                className="px-4 py-2 bg-secondary text-secondary-foreground text-sm font-medium rounded-md hover:bg-secondary/80 transition-colors border border-border"
              >
                Import Preferences
              </button>
              <input
                type="file"
                accept=".json"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImportFile}
              />

              <button
                onClick={handleReset}
                className="px-4 py-2 bg-destructive/10 text-destructive text-sm font-medium rounded-md hover:bg-destructive/20 transition-colors"
              >
                Reset Preferences
              </button>
            </div>
          </PreferenceSection>

        </div>
      </PageContent>
    </PageContainer>
  );
}
