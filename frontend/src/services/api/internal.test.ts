import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { internalApi } from "./internal";

describe("Internal API", () => {
  beforeEach(() => {
    vi.spyOn(global, "fetch").mockImplementation(vi.fn() as any);
    Storage.prototype.getItem = vi.fn();
    Storage.prototype.setItem = vi.fn();
    Storage.prototype.removeItem = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should append auth token and return json on success", async () => {
    (localStorage.getItem as any).mockReturnValue("fake-token");
    const mockJson = vi.fn().mockResolvedValue({ success: true });
    (global.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      json: mockJson
    });

    const data = await internalApi.get("/test") as any;
    expect(data.success).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/test"),
      expect.objectContaining({
        headers: expect.any(Headers)
      })
    );
  });

  it("should throw error on 400", async () => {
    const mockJson = vi.fn().mockResolvedValue({ detail: "Bad request" });
    (global.fetch as any).mockResolvedValue({
      ok: false,
      status: 400,
      json: mockJson
    });

    await expect(internalApi.post("/test", { a: 1 })).rejects.toThrow("Bad request");
  });

  it("should attempt refresh token on 401 and retry", async () => {
    const mockJsonError = vi.fn().mockResolvedValue({ detail: "Unauthorized" });
    const mockJsonSuccess = vi.fn().mockResolvedValue({ success: true });
    const mockRefreshJson = vi.fn().mockResolvedValue({ access_token: "new-token" });

    // 1st fetch: 401
    // 2nd fetch: refresh ok
    // 3rd fetch: retry ok
    (global.fetch as any)
      .mockResolvedValueOnce({ ok: false, status: 401, json: mockJsonError })
      .mockResolvedValueOnce({ ok: true, status: 200, json: mockRefreshJson })
      .mockResolvedValueOnce({ ok: true, status: 200, json: mockJsonSuccess });

    const data = await internalApi.put("/test", {}) as any;
    expect(data.success).toBe(true);
    expect(localStorage.setItem).toHaveBeenCalledWith("access_token", "new-token");
    expect(global.fetch).toHaveBeenCalled();
  });

  it("should throw and logout if refresh fails", async () => {
    const mockJsonError = vi.fn().mockResolvedValue({ detail: "Unauthorized" });

    // 1st fetch: 401
    // 2nd fetch: refresh 401
    (global.fetch as any)
      .mockResolvedValueOnce({ ok: false, status: 401, json: mockJsonError })
      .mockResolvedValueOnce({ ok: false, status: 401, json: mockJsonError });

    const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");

    await expect(internalApi.delete("/test")).rejects.toThrow("Session expired");
    expect(localStorage.removeItem).toHaveBeenCalledWith("access_token");
    expect(dispatchEventSpy).toHaveBeenCalled();
  });
  
  it("should handle patch method", async () => {
    const mockJson = vi.fn().mockResolvedValue({ ok: true });
    (global.fetch as any).mockResolvedValue({ ok: true, status: 200, json: mockJson });
    await internalApi.patch("/test", { a: 1 });
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/api/v1/test"), expect.objectContaining({ method: "PATCH" }));
  });
});
