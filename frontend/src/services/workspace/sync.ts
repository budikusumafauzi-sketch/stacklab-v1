import { internalApi } from '../api/internal';
import { WorkspaceState } from './types';

let syncTimeout: number | null = null;
const SYNC_DEBOUNCE_MS = 2000;

export const workspaceSync = {
  async saveSnapshot(state: WorkspaceState): Promise<void> {
    try {
      await internalApi.post('/workspace/snapshots', { state });
    } catch (error) {
      console.error('Failed to sync workspace snapshot', error);
      // Fallback to local storage is handled by the persistence module, but we can log here.
    }
  },

  scheduleSync(state: WorkspaceState): void {
    if (syncTimeout) {
      window.clearTimeout(syncTimeout);
    }
    syncTimeout = window.setTimeout(() => {
      this.saveSnapshot(state);
    }, SYNC_DEBOUNCE_MS);
  },
  
  async getLatestSnapshot(): Promise<WorkspaceState | null> {
    try {
      const response = await internalApi.get('/workspace/snapshots/latest');
      return (response as { state: WorkspaceState }).state;
    } catch (error) {
      console.error('Failed to get latest snapshot', error);
      return null;
    }
  }
};
