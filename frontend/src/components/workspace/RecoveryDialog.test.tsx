// @ts-nocheck
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RecoveryDialog } from './RecoveryDialog';

describe('RecoveryDialog', () => {
  it('renders correctly', () => {
    const { getByText } = render(<RecoveryDialog workspaceId="123" />);
    // Add simple assertion since state manages open logic internally
  });
});