import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { WorkspaceProvider, useWorkspaceContext } from './WorkspaceContext';

const DummyChild = () => {
  const ctx = useWorkspaceContext();
  return <div data-testid="child">{ctx ? 'has-context' : 'no-context'}</div>;
};

describe('WorkspaceContext', () => {
  it('provides context', () => {
    render(
      <WorkspaceProvider>
        <DummyChild />
      </WorkspaceProvider>
    );
    expect(screen.getByTestId('child')).toHaveTextContent('has-context');
  });
});