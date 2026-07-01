import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SnapshotDialog } from './SnapshotDialog';
import { workspaceApi } from '../../services/workspace/api';
import { workspaceDispatcher } from '../../services/workspace/dispatcher';

vi.mock('../../services/workspace/api');
vi.mock('../../services/workspace/dispatcher');

describe('SnapshotDialog full coverage', () => {
  it('renders and creates snapshot', async () => {
    (workspaceApi.getSnapshots as any).mockResolvedValue([{ id: '1', name: 'Snap1', created_at: '2023', version: 1, description: 'desc' }]);
    const mockClose = vi.fn();
    
    render(<SnapshotDialog workspaceId="w1" isOpen={true} onClose={mockClose} />);
    expect(await screen.findByText('Snap1')).toBeInTheDocument();
    
    // Create
    const input = screen.getByPlaceholderText('Snapshot Name');
    fireEvent.change(input, { target: { value: 'NewSnap' } });
    
    const descInput = screen.getByPlaceholderText('Description');
    fireEvent.change(descInput, { target: { value: 'NewDesc' } });
    
    const btn = screen.getByText('Create Snapshot');
    fireEvent.click(btn);
    
    expect(workspaceDispatcher.createSnapshot).toHaveBeenCalled();
  });
});