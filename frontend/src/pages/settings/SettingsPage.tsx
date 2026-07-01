import { useState } from "react";
import { useSettings } from "../../hooks/useSettings";

export default function SettingsPage() {
  const { state, updateEditorSettings, updateThemeSettings, updateWorkspaceSettings } =
    useSettings();

  // Local controlled state for number inputs to allow typing without mid-edit side-effects
  const [fontSizeInput, setFontSizeInput] = useState(String(state.editor.fontSize));
  const [tabSizeInput, setTabSizeInput] = useState(String(state.editor.tabSize));

  const handleFontSizeBlur = () => {
    const val = parseInt(fontSizeInput, 10);
    if (!isNaN(val) && val >= 8 && val <= 32) {
      updateEditorSettings({ fontSize: val });
    } else {
      setFontSizeInput(String(state.editor.fontSize));
    }
  };

  const handleTabSizeBlur = () => {
    const val = parseInt(tabSizeInput, 10);
    if (!isNaN(val) && val >= 1 && val <= 8) {
      updateEditorSettings({ tabSize: val });
    } else {
      setTabSizeInput(String(state.editor.tabSize));
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">Manage your workspace preferences.</p>
      </div>

      <div className="grid gap-6">
        {/* Theme Settings */}
        <div className="p-6 bg-background rounded-xl border border-border shadow-soft space-y-4">
          <h3 className="text-lg font-medium">Theme Settings</h3>
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Mode</label>
              <select
                className="w-full max-w-sm px-3 py-2 bg-background border border-border rounded-md text-sm outline-none focus:ring-2 focus:ring-primary/20"
                value={state.theme.mode}
                onChange={(e) =>
                  updateThemeSettings({ mode: e.target.value as "light" | "dark" | "system" })
                }
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
          </div>
        </div>

        {/* Editor Settings */}
        <div className="p-6 bg-background rounded-xl border border-border shadow-soft space-y-4">
          <h3 className="text-lg font-medium">Editor Settings</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Font Size</label>
              <input
                type="number"
                min={8}
                max={32}
                className="px-3 py-2 bg-background border border-border rounded-md text-sm outline-none focus:ring-2 focus:ring-primary/20"
                value={fontSizeInput}
                onChange={(e) => setFontSizeInput(e.target.value)}
                onBlur={handleFontSizeBlur}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Tab Size</label>
              <input
                type="number"
                min={1}
                max={8}
                className="px-3 py-2 bg-background border border-border rounded-md text-sm outline-none focus:ring-2 focus:ring-primary/20"
                value={tabSizeInput}
                onChange={(e) => setTabSizeInput(e.target.value)}
                onBlur={handleTabSizeBlur}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Word Wrap</label>
              <select
                className="px-3 py-2 bg-background border border-border rounded-md text-sm outline-none focus:ring-2 focus:ring-primary/20"
                value={state.editor.wordWrap}
                onChange={(e) =>
                  updateEditorSettings({
                    wordWrap: e.target.value as "on" | "off" | "wordWrapColumn" | "bounded",
                  })
                }
              >
                <option value="on">On</option>
                <option value="off">Off</option>
                <option value="wordWrapColumn">Word Wrap Column</option>
                <option value="bounded">Bounded</option>
              </select>
            </div>
            <div className="flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                id="minimap"
                className="rounded border-border text-primary focus:ring-primary/20"
                checked={state.editor.minimap}
                onChange={(e) => updateEditorSettings({ minimap: e.target.checked })}
              />
              <label htmlFor="minimap" className="text-sm font-medium cursor-pointer">
                Show Minimap
              </label>
            </div>
          </div>
        </div>

        {/* Workspace Settings */}
        <div className="p-6 bg-background rounded-xl border border-border shadow-soft space-y-4">
          <h3 className="text-lg font-medium">Workspace Settings</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="autosave"
                className="rounded border-border text-primary focus:ring-primary/20"
                checked={state.workspace.autoSave}
                onChange={(e) => updateWorkspaceSettings({ autoSave: e.target.checked })}
              />
              <div>
                <label htmlFor="autosave" className="text-sm font-medium cursor-pointer">
                  Auto Save
                </label>
                <p className="text-xs text-muted-foreground">
                  Automatically save workspace changes as you work.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="recovery"
                className="rounded border-border text-primary focus:ring-primary/20"
                checked={state.workspace.recovery}
                onChange={(e) => updateWorkspaceSettings({ recovery: e.target.checked })}
              />
              <div>
                <label htmlFor="recovery" className="text-sm font-medium cursor-pointer">
                  Recovery Checkpoints
                </label>
                <p className="text-xs text-muted-foreground">
                  Periodically save recovery checkpoints to restore after unexpected closures.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
