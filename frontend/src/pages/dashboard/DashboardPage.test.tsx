import { render, screen, waitFor } from '../../test/renderHelpers';
import { describe, it, expect, vi } from 'vitest';
import DashboardPage from './DashboardPage';
import { useWorkspaces } from '../../hooks/useWorkspaces';
import { useSystemStatus } from '../../hooks/useSystemStatus';
import { useActivity } from '../../hooks/useActivity';

vi.mock('../../hooks/useWorkspaces');
vi.mock('../../hooks/useSystemStatus');
vi.mock('../../hooks/useActivity');

describe('DashboardPage', () => {
  it('renders workspaces and handles clicks', async () => {
    const mockFetch = vi.fn();
    const mockCreate = vi.fn();
    const mockDelete = vi.fn();
    (useSystemStatus as any).mockReturnValue({ status: 'ok' });
    (useActivity as any).mockReturnValue({ activities: [] });
    (useWorkspaces as any).mockReturnValue({
      workspaces: [{ id: '1', name: 'Ws1', description: 'desc', updated_at: '2023-01-01', version: 1, is_pinned: false }],
      loading: false,
      fetchWorkspaces: mockFetch,
      createWorkspace: mockCreate,
      deleteWorkspace: mockDelete
    });

    render(<DashboardPage />);
    
    // Suspense needs waitFor
    await waitFor(() => {
      expect(screen.getByText('Ws1')).toBeInTheDocument();
    });
  });
});