import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WorkspaceTimeline } from './WorkspaceTimeline';

describe('WorkspaceTimeline', () => {
  it('renders empty state', () => {
    render(<WorkspaceTimeline snapshots={[]} onRestore={vi.fn()} />);
    expect(screen.getByText('No snapshots in timeline.')).toBeInTheDocument();
  });
});