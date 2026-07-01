import { describe, it, expect, vi, beforeEach } from "vitest";
import { activityService } from "./api";
import { ActivityDispatcher, ActivityType } from "./dispatcher";
import { internalApi } from "../api/internal";

vi.mock("../api/internal", () => ({
  internalApi: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  }
}));

describe("Activity API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should get activities", async () => {
    (internalApi.get as any).mockResolvedValue({ items: [{ id: 1 }], total: 1 });
    const res = await activityService.getActivities({ skip: 0, limit: 50 });
    expect(res.items[0].id).toBe(1);
    expect(internalApi.get).toHaveBeenCalledWith("/activity?skip=0&limit=50");
  });

  it("should mark as read", async () => {
    (internalApi.patch as any).mockResolvedValue({ id: 1, is_read: true });
    await activityService.markAsRead(1);
    expect(internalApi.patch).toHaveBeenCalledWith("/activity/1/read", {});
  });

  it("should mark all as read", async () => {
    (internalApi.patch as any).mockResolvedValue({ count: 5 });
    await activityService.markAllAsRead();
    expect(internalApi.patch).toHaveBeenCalledWith("/activity/read-all", {});
  });

});

describe("Activity Dispatcher", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should dispatch network events", async () => {
    (internalApi.post as any).mockResolvedValue({ id: 2 });
    await ActivityDispatcher.dispatchSystemEvent("SystemWarning", ActivityType.WARNING, "Pinged google.com", { ip: "8.8.8.8" });
    expect(internalApi.post).toHaveBeenCalledWith("/activity", expect.objectContaining({
      title: "SystemWarning",
      description: "Pinged google.com",
      type: "WARNING",
      category: "System"
    }));
  });

  it("should dispatch workspace events", async () => {
    (internalApi.post as any).mockResolvedValue({ id: 3 });
    await ActivityDispatcher.dispatchWorkspaceEvent("WorkspaceOpened", "My WS");
    expect(internalApi.post).toHaveBeenCalledWith("/activity", expect.objectContaining({
      title: "WorkspaceOpened",
      description: "My WS",
      type: "WORKSPACE",
      category: "Workspace"
    }));
  });

  it("should handle sync events", async () => {
    (internalApi.post as any).mockResolvedValue({ id: 4 });
    await ActivityDispatcher.dispatchSystemEvent("SystemError", ActivityType.ERROR, "Synced up");
    expect(internalApi.post).toHaveBeenCalledWith("/activity", expect.objectContaining({
      title: "SystemError",
      description: "Synced up",
      type: "ERROR",
      category: "System"
    }));
  });
});
