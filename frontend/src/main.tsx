import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./providers/RouterProvider";
import { ThemeProvider } from "./providers/theme/ThemeProvider";
import { ErrorBoundary } from "./components/system/ErrorBoundary";
import { NotificationProvider } from "./providers/notification/NotificationProvider";
import { ActivityProvider } from "./providers/activity/ActivityContext";
import { WorkspaceProvider } from "./contexts/WorkspaceContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import { ProfileProvider } from "./contexts/ProfileContext";
import { Toaster } from "sonner";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <ProfileProvider>
        <SettingsProvider>
          <ThemeProvider>
            <NotificationProvider>
              <ActivityProvider>
                <WorkspaceProvider>
                  <RouterProvider router={router} />
                  <Toaster position="top-right" richColors />
                </WorkspaceProvider>
              </ActivityProvider>
            </NotificationProvider>
          </ThemeProvider>
        </SettingsProvider>
      </ProfileProvider>
    </ErrorBoundary>
  </StrictMode>
);
