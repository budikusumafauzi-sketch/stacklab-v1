import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import AppShell from "../layouts/AppShell";
import { LoadingState } from "../components/common/LoadingState";

// Lazy load pages for performance optimization
const DashboardPage = lazy(() => import("../pages/dashboard/DashboardPage"));
const LabsPlaceholder = lazy(() => import("../pages/labs/LabsPlaceholder"));
const SqlLabPage = lazy(() => import("../pages/labs/SqlLabPage"));
const NetworkLabPage = lazy(() => import("../pages/labs/NetworkLabPage"));
const ApiLabPage = lazy(() => import("../pages/labs/ApiLabPage"));
const LinuxLabPage = lazy(() => import("../pages/labs/LinuxLabPage"));
const JsonLabPage = lazy(() => import("../pages/labs/JsonLabPage"));
const SettingsPage = lazy(() => import("../pages/settings/SettingsPage"));
const ProfilePage = lazy(() => import("../pages/account/ProfilePage"));
const PreferencesPage = lazy(() => import("../pages/account/PreferencesPage"));
const NotFoundPage = lazy(() => import("../pages/error/NotFoundPage"));
const WorkspacePage = lazy(() => import("../pages/workspace/WorkspacePage"));

const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingState fullScreen message="Loading module..." />}>
    {children}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <SuspenseWrapper><DashboardPage /></SuspenseWrapper>,
      },
      {
        path: "labs/sql",
        element: <SuspenseWrapper><SqlLabPage /></SuspenseWrapper>,
      },
      {
        path: "labs/network",
        element: <SuspenseWrapper><NetworkLabPage /></SuspenseWrapper>,
      },
      {
        path: "labs/api",
        element: <SuspenseWrapper><ApiLabPage /></SuspenseWrapper>,
      },
      {
        path: "labs/linux",
        element: <SuspenseWrapper><LinuxLabPage /></SuspenseWrapper>,
      },
      {
        path: "labs/json",
        element: <SuspenseWrapper><JsonLabPage /></SuspenseWrapper>,
      },
      {
        path: "labs/:labId",
        element: <SuspenseWrapper><LabsPlaceholder /></SuspenseWrapper>,
      },
      {
        path: "workspace/:workspaceId",
        element: <SuspenseWrapper><WorkspacePage /></SuspenseWrapper>,
      },
      {
        path: "settings",
        element: <SuspenseWrapper><SettingsPage /></SuspenseWrapper>,
      },
      {
        path: "profile",
        element: <SuspenseWrapper><ProfilePage /></SuspenseWrapper>,
      },
      {
        path: "preferences",
        element: <SuspenseWrapper><PreferencesPage /></SuspenseWrapper>,
      },
      {
        path: "*",
        element: <SuspenseWrapper><NotFoundPage /></SuspenseWrapper>,
      },
    ],
  },
]);
