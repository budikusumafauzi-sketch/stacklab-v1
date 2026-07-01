import React from "react";
// import { render, RenderOptions } from "@testing-library/react"; // Will be added in Phase 4
import { ThemeProvider } from "../providers/theme/ThemeProvider";
import { NotificationProvider } from "../providers/notification/NotificationProvider";
import { BrowserRouter } from "react-router-dom";

/**
 * Standard test wrapper that provides all necessary context providers
 * for testing StackLab components.
 */
export function AllTheProviders({ children }: { children: React.ReactNode }) {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

/**
 * Custom render function to be used instead of standard RTL render.
 * Uncomment and use in Phase 4 once @testing-library/react is installed.
 */
/*
export const customRender = (
  ui: React.ReactElement, 
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from "@testing-library/react";
export { customRender as render };
*/
