// @ts-nocheck
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ExportImportDialog } from './ExportImportDialog';
import { workspaceApi } from '../../services/workspace/api';

vi.mock('../../services/workspace/api');

describe('ExportImportDialog', () => {
  it('renders and functions', async () => {
    (workspaceApi.exportWorkspace as any).mockResolvedValue({ id: '1', name: 'W1' });
    render(<ExportImportDialog isOpen={true} onClose={vi.fn()} onImportSuccess={vi.fn()} />);
    
    expect(screen.getByText('Export / Import Workspace')).toBeInTheDocument();
  });
});