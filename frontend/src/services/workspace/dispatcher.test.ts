import { describe, it, expect, vi, beforeEach } from 'vitest';
import { workspaceDispatcher } from './dispatcher';
import { workspaceApi } from './api';

vi.mock('./api', () => ({
  workspaceApi: {
    getWorkspace: vi.fn().mockResolvedValue({ id: '1', state: {} }),
    createWorkspace: vi.fn().mockResolvedValue({ id: '1', state: {} }),
    updateWorkspace: vi.fn().mockResolvedValue({ id: '1', state: {} }),
    deleteWorkspace: vi.fn().mockResolvedValue({ status: 'success' }),
    createSnapshot: vi.fn().mockResolvedValue({ id: 's1' }),
    restoreSnapshot: vi.fn().mockResolvedValue({ id: '1', state: {} }),
    saveRecovery: vi.fn().mockResolvedValue({ id: 'r1' }),
    clearRecovery: vi.fn().mockResolvedValue({ status: 'success' }),
  }
}));

describe('WorkspaceDispatcher', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('loadWorkspace', async () => {
    await workspaceDispatcher.loadWorkspace('1');
    expect(workspaceApi.getWorkspace).toHaveBeenCalledWith('1');
  });

  it('createWorkspace', async () => {
    const res = await workspaceDispatcher.createWorkspace('name', 'desc');
    expect(res.id).toBe('1');
    expect(workspaceApi.createWorkspace).toHaveBeenCalled();
  });

  it('updateLocalState and commit', async () => {
    await workspaceDispatcher.loadWorkspace('1');
    workspaceDispatcher.updateLocalState({ openTabs: [], recentFiles: [], activeLabId: null, sidebarCollapsed: false });
    await workspaceDispatcher.commitState();
    expect(workspaceApi.updateWorkspace).toHaveBeenCalled();
  });

  it('createSnapshot', async () => {
    await workspaceDispatcher.loadWorkspace('1');
    await workspaceDispatcher.createSnapshot('n', 'd');
    expect(workspaceApi.createSnapshot).toHaveBeenCalled();
  });

  it('restoreSnapshot', async () => {
    await workspaceDispatcher.loadWorkspace('1');
    await workspaceDispatcher.restoreSnapshot('s1');
    expect(workspaceApi.restoreSnapshot).toHaveBeenCalled();
  });

  it('saveRecoveryCheckpoint', async () => {
    await workspaceDispatcher.loadWorkspace('1');
    await workspaceDispatcher.saveRecoveryCheckpoint();
    expect(workspaceApi.saveRecovery).toHaveBeenCalled();
  });
});