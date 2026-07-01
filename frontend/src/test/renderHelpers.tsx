import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../providers/theme/ThemeProvider';
import { NotificationProvider } from '../providers/notification/NotificationProvider';
import { ActivityProvider } from '../providers/activity/ActivityContext';
import { WorkspaceProvider } from '../contexts/WorkspaceContext';

interface WrapperProps {
  children: React.ReactNode;
}

const AllTheProviders = ({ children }: WrapperProps) => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <NotificationProvider>
          <ActivityProvider>
            <WorkspaceProvider>
              {children}
            </WorkspaceProvider>
          </ActivityProvider>
        </NotificationProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
