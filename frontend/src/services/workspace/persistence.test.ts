import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { workspacePersistence } from "./persistence";
import { WorkspaceState } from "./types";

describe("workspacePersistence", () => {
  beforeEach(() => {
    Storage.prototype.getItem = vi.fn();
    Storage.prototype.setItem = vi.fn();
    Storage.prototype.removeItem = vi.fn();
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should save state", () => {
    const state: WorkspaceState = { openTabs: [], recentFiles: [], activeLabId: null, sidebarCollapsed: false };
    workspacePersistence.save(state);
    expect(localStorage.setItem).toHaveBeenCalledWith("stacklab:workspace:state", JSON.stringify(state));
  });

  it("should catch save error", () => {
    (localStorage.setItem as any).mockImplementation(() => { throw new Error("quota"); });
    const state: WorkspaceState = { openTabs: [], recentFiles: [], activeLabId: null, sidebarCollapsed: false };
    workspacePersistence.save(state);
    expect(console.warn).toHaveBeenCalled();
  });

  it("should load state", () => {
    const state: WorkspaceState = { openTabs: [], recentFiles: [], activeLabId: "123", sidebarCollapsed: true };
    (localStorage.getItem as any).mockReturnValue(JSON.stringify(state));
    const loaded = workspacePersistence.load();
    expect(loaded.activeLabId).toBe("123");
  });

  it("should return default on load error", () => {
    (localStorage.getItem as any).mockImplementation(() => { throw new Error("error"); });
    const loaded = workspacePersistence.load();
    expect(loaded.activeLabId).toBe(null);
    expect(console.warn).toHaveBeenCalled();
  });

  it("should clear state", () => {
    workspacePersistence.clear();
    expect(localStorage.removeItem).toHaveBeenCalledWith("stacklab:workspace:state");
  });
});
