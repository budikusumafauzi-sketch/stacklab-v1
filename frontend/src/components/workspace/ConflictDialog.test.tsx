// @ts-nocheck
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ConflictDialog } from './ConflictDialog';

describe('ConflictDialog', () => {
  it('renders nothing when closed', () => {
    const { container } = render(<ConflictDialog isOpen={false} onClose={vi.fn()} onForceOverwrite={vi.fn()} onDiscardLocal={vi.fn()} onSaveAsNew={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });
});