import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MetadataPanel } from './MetadataPanel';
import { Workspace } from '../../services/workspace/types';

describe('MetadataPanel', () => {
  it('renders empty metadata', () => {
    const ws = { id: '1', name: 'Test' } as Workspace;
    render(<MetadataPanel workspace={ws} />);
    expect(screen.getByText('Metadata not available.')).toBeInTheDocument();
  });
});