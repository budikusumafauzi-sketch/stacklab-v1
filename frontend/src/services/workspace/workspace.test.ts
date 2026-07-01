import { describe, it, expect, vi, beforeEach } from "vitest";
import { workspaceApi } from "./api";
import { workspaceDispatcher } from "./dispatcher";
import { internalApi } from "../api/internal";

vi.mock("../api/internal", () => ({
  internalApi: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }
}));

describe("Workspace API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should get workspaces", async () => {
    (internalApi.get as any).mockResolvedValue([{ id: "ws1" }]);
    const res = await workspaceApi.getWorkspaces();
    expect(res[0].id).toBe("ws1");
    expect(internalApi.get).toHaveBeenCalledWith("/workspace");
  });

  it("should create workspace", async () => {
    (internalApi.post as any).mockResolvedValue({ id: "ws2" });
    const res = await workspaceApi.createWorkspace({ name: "test" });
    expect(res.id).toBe("ws2");
    expect(internalApi.post).toHaveBeenCalledWith("/workspace", { name: "test" });
  });

  it("should update workspace", async () => {
    (internalApi.put as any).mockResolvedValue({ id: "ws3" });
    const res = await workspaceApi.updateWorkspace("ws3", { name: "updated" });
    expect(res.id).toBe("ws3");
    expect(internalApi.put).toHaveBeenCalledWith("/workspace/ws3", { name: "updated" });
  });

  it("should delete workspace", async () => {
    await workspaceApi.deleteWorkspace("ws1");
    expect(internalApi.delete).toHaveBeenCalledWith("/workspace/ws1");
  });

  it("should get workspace by id", async () => {
    (internalApi.get as any).mockResolvedValue({ id: "ws1" });
    const res = await workspaceApi.getWorkspace("ws1");
    expect(res.id).toBe("ws1");
    expect(internalApi.get).toHaveBeenCalledWith("/workspace/ws1");
  });

  it("should handle snapshots", async () => {
    (internalApi.post as any).mockResolvedValue({ id: "snap1" });
    (internalApi.get as any).mockResolvedValue([{ id: "snap1" }]);
    
    await workspaceApi.createSnapshot("ws1", { name: "snap" });
    expect(internalApi.post).toHaveBeenCalledWith("/workspace/ws1/snapshots", { name: "snap" });
    
    await workspaceApi.getSnapshots("ws1");
    expect(internalApi.get).toHaveBeenCalledWith("/workspace/ws1/snapshots");
    
    await workspaceApi.restoreSnapshot("ws1", "snap1");
    expect(internalApi.post).toHaveBeenCalledWith("/workspace/ws1/snapshots/snap1/restore", {});
  });

  it("should handle recovery", async () => {
    (internalApi.post as any).mockResolvedValue({ id: "rec1" });
    (internalApi.get as any).mockResolvedValue({ id: "rec1" });
    
    await workspaceApi.saveRecovery("ws1", {});
    expect(internalApi.post).toHaveBeenCalledWith("/workspace/ws1/recovery", { state: {} });
    
    await workspaceApi.getRecovery("ws1");
    expect(internalApi.get).toHaveBeenCalledWith("/workspace/ws1/recovery");
    
    await workspaceApi.clearRecovery("ws1");
    expect(internalApi.delete).toHaveBeenCalledWith("/workspace/ws1/recovery");
  });

  it("should handle export and import", async () => {
    (internalApi.get as any).mockResolvedValue({ version: 1 });
    (internalApi.post as any).mockResolvedValue({ id: "ws1" });
    
    await workspaceApi.exportWorkspace("ws1");
    expect(internalApi.get).toHaveBeenCalledWith("/workspace/ws1/export");
    
    await workspaceApi.importWorkspace({ version: 1 } as any);
    expect(internalApi.post).toHaveBeenCalledWith("/workspace/import", { version: 1 });
  });
});

describe("Workspace Dispatcher", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create workspace and update state", async () => {
    (internalApi.post as any).mockResolvedValue({ id: "ws-dispatch", name: "test", state: {} });
    const ws = await workspaceDispatcher.createWorkspace("test");
    expect(ws.id).toBe("ws-dispatch");
    
    let subWs: any;
    workspaceDispatcher.subscribe((val) => { subWs = val; });
    expect(subWs.id).toBe("ws-dispatch");
  });
});
